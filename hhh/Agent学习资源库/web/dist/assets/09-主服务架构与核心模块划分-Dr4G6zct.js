const n=`主服务（Main Service）是 HappyClaw 的进程中枢：它同时承担 Web API、IM 消息接入、任务调度、执行编排与持久化。理解这个进程的组织方式，是读懂其余架构文档的前提。本文聚焦主服务的模块边界、启动编排与核心数据流，不深入 IPC 协议细节（见 [Agent Runner 与 IPC 通信协议](10-agent-runner-yu-ipc-tong-xin-xie-yi)）与流式事件类型体系（见 [StreamEvent 流式事件体系与类型同步](11-streamevent-liu-shi-shi-jian-ti-xi-yu-lei-xing-tong-bu)）。

## 总体架构：单进程多层的模块化布局

主服务是一个**单 Node.js 进程**，但内部按职责划分为清晰的层次。\`package.json\` 的主入口为 \`dist/index.js\`，依赖面包含 Hono（Web 框架）、better-sqlite3（持久化）与七个 IM 渠道 SDK，这决定了进程的三大对外面：HTTP API、WebSocket 流、IM 长连接。

\`\`\`mermaid
flowchart TB
    subgraph Web["Web / API 层"]
        W1["web.ts (Hono + WebSocket)"]
        W2["routes/ 20 个路由模块"]
        W3["middleware/auth.ts"]
        W4["terminal-manager.ts"]
    end

    subgraph IM["IM 渠道层"]
        I1["im-manager.ts (IMConnectionManager)"]
        I2["feishu / telegram / qq / wechat / dingtalk / discord / whatsapp 适配器"]
        I3["流式卡片控制器"]
    end

    subgraph Core["核心编排层"]
        C1["group-queue.ts (GroupQueue)"]
        C2["消息循环 + processGroupMessages"]
        C3["task-scheduler.ts"]
        C4["provider-pool.ts"]
        C5["channel-reliability-*"]
    end

    subgraph Exec["执行层"]
        E1["container-runner.ts"]
        E2["runContainerAgent / runHostAgent"]
        E3["container/agent-runner 包"]
    end

    subgraph Data["持久化层"]
        D1["db.ts (better-sqlite3, WAL)"]
        D2["data/ 目录结构"]
    end

    W1 --> W2
    W1 --> W3
    I1 --> I2
    C1 --> C2
    C2 --> E1
    E1 --> E2
    E2 --> E3
    E1 --> C4
    C3 --> E1
    C1 --> D1
    C2 --> D1
    I1 --> C1
    W1 --> C1
    E2 --> D1
\`\`\`

**进程内模块规模**是理解架构的第一手信号：\`src/index.ts\`（21,551 行）承担全部编排逻辑，\`src/db.ts\`（14,496 行）是唯一的持久化面，\`src/container-runner.ts\`（3,230 行）封装双执行模式，\`src/group-queue.ts\`（3,091 行）实现会话级并发控制。这一布局说明：编排集中在 \`index.ts\`，而领域能力被拆入独立模块，通过显式依赖注入（如 \`startWebServer(webDeps)\`）解耦。

Sources: [package.json](package.json#L6-L11)、[index.ts](src/index.ts#L19724-L19727)、[web.ts](src/web.ts#L3277-L3287)

## 启动编排：\`main()\` 的固定顺序

\`main()\` 是进程的唯一入口，其启动顺序不是随意的——每步都为后续步骤建立前提：

| 阶段 | 动作 | 目的 |
|---|---|---|
| 0 | \`migrateDataDirectories()\` | 迁移旧版数据目录布局 |
| 1 | \`initDatabase()\` | 打开 SQLite、执行 schema 迁移与孤儿修复 |
| 2 | 清理陈旧 Agent 记录 | 重启后不存在真正运行中的 SDK 任务，统一标记为 error，避免 UI 出现"僵尸 running" |
| 3 | \`loadState()\` | 从 DB 恢复 \`registeredGroups\` 等内存态 |
| 4 | 插件目录扫描（定时） | 启动 5s 后 + 每小时扫描宿主插件市场 |
| 5 | \`startWebServer()\` | **尽早启动**，前端认证/API 不被 IM 就绪阻塞 |
| 6 | \`ensureDockerRunning()\` | 验证 Docker 守护进程可用 |
| 7 | 队列回调接线 | 注入 \`processGroupMessages\`、序列化键解析、重试上限回调 |
| 8 | 重连全部渠道账号 | \`reloadChannelAccountById\` 逐个恢复 IM 长连接 |
| 9 | 渠道可靠性恢复 | 先恢复 Bot 账号就绪 → 收尾旧进程遗留卡片 → 失效过期执行栅栏 |
| 10 | \`startIpcWatcher()\` + \`startMessageLoop()\` | 恢复 IPC 消费与消息泵 |
| 11 | 飞书群组同步 + IM 绑定健康检查 | 周期 30 分钟 |

第 8 步到第 10 步的顺序构成一条**正确性边界**：IM 入站先被 \`imManager.deferInbound()\` 挂起，等渠道可靠性恢复完成、IPC watcher 就绪后才 \`resumeDeferredInbound()\`。若提前启动消息循环，同一逻辑轮次可能出现两张活跃卡片。

Sources: [index.ts](src/index.ts#L19724-L19727)、[index.ts](src/index.ts#L21344-L21382)、[db.ts](src/db.ts#L468-L486)

### 优雅停机：四阶段收尾

\`shutdown()\` 同样有严格次序，核心原则是**"先停入口，后断出口"**：IM 入站立即暂停但底层客户端保持连接（供正在运行的 Agent 收尾卡片），调度器排空 detached 工作，Web 服务器与队列并行排空，最后才关闭 IPC watcher（它们是出站消费者，必须比排空活得久），终态化所有流式卡片后再断开传输层。30 秒强制退出兜底，与队列 15 秒宽限 + 容器强停约 10 秒匹配。

Sources: [index.ts](src/index.ts#L19816-L19900)

## Web / API 层：Hono 路由挂载

\`web.ts\` 基于 Hono + \`@hono/node-server\` 构建，\`startWebServer(webDeps)\` 将全部运行时依赖以参数对象注入——这是主服务各模块解耦的关键机制。20 个路由模块挂载于 \`/api\` 前缀之下，覆盖认证、群组、任务、技能、插件、计费、监控等管理面；\`POST /api/messages\` 是 Web 会话消息的统一入口，经 \`MessageCreateSchema\`（zod）校验后写入消息表。

WebSocket 服务承载三类实时通道：状态广播（每 5 秒）、终端（\`terminal-manager.ts\` 封装 node-pty）与流式事件推送（\`broadcastStreamEvent\`）。服务端还注册了容器退出与 Runner 状态变化回调，驱动前端侧边栏指示器。

Sources: [web.ts](src/web.ts#L263-L288)、[web.ts](src/web.ts#L3277-L3337)、[web.ts](src/web.ts#L2901)

## IM 渠道层：统一连接池与适配器

\`IMConnectionManager\`（单例 \`imManager\`）是全部 IM 渠道的统一入口，以 \`(userId, channelType, accountId)\` 为键维护连接池，覆盖飞书、Telegram、QQ、微信、钉钉、Discord、WhatsApp 七种渠道。其核心设计是**连接生命周期治理**：

- **用户级 + 渠道级双层串行锁**：防止重叠的 reconnect 产生悬挂 live channel（双发消息）；
- **sealed 状态机**：用户被禁用/删除后拒绝一切新连接，运维侧通过 \`markUserReconnectable\` 显式解封；
- **凭据互斥声明**：同一 Bot 凭据最多拥有一个活跃连接器，避免 409 轮询冲突或重复回复。

入站消息经各渠道适配器回调后进入统一处理管线；出站 \`sendMessage\` / \`sendImage\` / \`setTyping\` 按 JID 自动路由到对应渠道。飞书等支持流式卡片的渠道还注册了 \`createStreamingSession\`，与 \`feishu-streaming-card.ts\`、\`dingtalk-streaming-card.ts\` 等模块配合实现"生成中"卡片体验。

Sources: [im-manager.ts](src/im-manager.ts#L194-L217)、[im-manager.ts](src/im-manager.ts#L606-L723)、[im-manager.ts](src/im-manager.ts#L2187)

## 核心编排层：队列、消息循环与调度

### GroupQueue：会话级串行化

\`GroupQueue\` 是并发控制的基石：以 \`chatJid\` 为粒度保证**同一会话的消息严格串行处理**，不同会话并行。虚拟 JID（\`#agent:\`、\`#task:\` 后缀）通过 \`serializationKeyResolver\` 映射为独立序列化键，使子 Agent 与任务运行拥有各自的并发槽位。队列还内置了变更暂停令牌（mutation pause）、fail-closed 安全栅栏（安全敏感变更未确认旧运行时停止前拒绝新运行）、重试快照与上下文溢出跟踪。

Sources: [group-queue.ts](src/group-queue.ts#L197-L268)

### 消息循环与处理管线

\`startMessageLoop()\` 是主泵：轮询新消息 → 按群组去重 → 逐组调用 \`processGroupMessages()\`。后者是编排的核心路径，依次执行：激活模式检查 → 提取自上次游标以来的消息 → 解析 IM 回复路由（sticky owner）→ 插件命令展开（\`/foo\` 斜杠命令替换为完整提示词）→ 归属者门禁 + 计费配额检查 → 入队执行。整条管线以**游标（cursor）机制**保证崩溃后不重放、不丢失。

Sources: [index.ts](src/index.ts#L17021-L17039)、[index.ts](src/index.ts#L5595-L5690)

### 任务调度器与 Provider 池

\`task-scheduler.ts\`（V2）负责定时任务：\`startSchedulerLoop\` 在启动时清理崩溃遗留的 legacy 运行日志与孤儿 task 工作区，随后进入 \`pumpTaskScheduler\` 轮询到期任务；可恢复的 V2 租约（lease）靠过期自然恢复，不做进程内权威。\`provider-pool.ts\` 则实现模型提供商的三种负载均衡策略（round-robin / weighted-round-robin / failover），健康状态纯内存维护：连续 3 次失败标记不健康，5 分钟恢复间隔后自动复检，运行中的会话计数用于调度决策。

Sources: [task-scheduler.ts](src/task-scheduler.ts#L3281-L3342)、[provider-pool.ts](src/provider-pool.ts#L47-L158)

## 执行层：Container 与 Host 双模式

\`container-runner.ts\` 是执行层的门面，提供 \`runContainerAgent\`（Docker 容器）与 \`runHostAgent\`（宿主机直接进程）两条路径，最终由 \`runAgentWithModelFallback\` 统一封装模型降级逻辑。两条路径共享同一套编排步骤：

1. **Provider 池选型**：\`trySelectPoolProvider\` 选定模型配置，切换提供商时清除会话并重新绑定；
2. **卷/目录准备**：\`buildVolumeMounts\` 组装挂载点，Host 模式则创建独立 IPC 目录树（\`data/ipc/{folder}/\`）与会话目录，并将 \`.claude.json\` 符号链接到宿主全局配置以保持 deviceId 一致；
3. **安全校验**：Host 模式下对 \`customCwd\` 执行挂载白名单复查（纵深防御，防止白名单收紧后 DB 注入路径）；
4. **启动 Agent Runner**：容器模式拉起 \`happyclaw-{folder}-{timestamp}\` 容器，Host 模式直接 spawn \`container/agent-runner\` 的构建产物。

Agent Runner 是独立 npm 包（\`container/agent-runner\`），与主服务通过磁盘 IPC 交换 \`ContainerInput\` / \`ContainerOutput\`——这一边界的完整细节属于 [Agent Runner 与 IPC 通信协议](10-agent-runner-yu-ipc-tong-xin-xie-yi)。

Sources: [container-runner.ts](src/container-runner.ts#L1671-L1694)、[container-runner.ts](src/container-runner.ts#L2295-L2439)、[container-runner.ts](src/container-runner.ts#L3135)

## 持久化层：SQLite 单库 + WAL

\`db.ts\` 是唯一持久化面，基于 better-sqlite3，当前 schema 版本 v69。初始化时执行：WAL 日志模式（与 NORMAL 同步级别配对，实测写入提升约 21 倍）→ 外键约束启用与孤儿行修复（中断的级联删除残留的 \`messages → chats\` 孤儿被自动清除）→ 升级前自动备份（schema ≥ v39 时）。库内约 35 张表覆盖消息、会话、群组、任务、Agent 档案、计费、用量等全部领域。启动后统一内存态（如 \`registeredGroups\`）从该库投影，Web 路由与 IM 管线共享同一套 \`db\` 访问函数（321 个导出）。

Sources: [db.ts](src/db.ts#L106)、[db.ts](src/db.ts#L468-L535)

## 共享契约：跨进程类型同步

主服务、Agent Runner 与 Web 前端三者共享同一份 \`StreamEvent\` 类型定义。\`shared/stream-event.ts\` 是唯一事实源，构建步骤将其复制到三处（\`src/stream-event.types.ts\`、\`container/agent-runner/src/stream-event.types.ts\`、\`web/src/stream-event.types.ts\`），任何副本的本地修改都会被构建覆盖。这一设计保证了 IM 流式卡片、Web 实时渲染与 Runner 事件上报使用完全一致的协议面。类型体系的全貌见 [StreamEvent 流式事件体系与类型同步](11-streamevent-liu-shi-shi-jian-ti-xi-yu-lei-xing-tong-bu)。

Sources: [shared/stream-event.ts](shared/stream-event.ts#L1-L25)

## 模块依赖关系总览

\`\`\`mermaid
flowchart LR
    idx["index.ts<br/>编排中枢"]
    web["web.ts + routes"]
    im["im-manager.ts"]
    q["group-queue.ts"]
    cr["container-runner.ts"]
    ts["task-scheduler.ts"]
    pp["provider-pool.ts"]
    db["db.ts"]
    ar["agent-runner 包"]

    idx --> web
    idx --> im
    idx --> q
    idx --> cr
    idx --> ts
    idx --> db
    web --> q
    im --> q
    q --> cr
    ts --> cr
    cr --> pp
    cr --> ar
    cr --> db
    web --> db
    im --> db
\`\`\`

依赖方向呈"编排 → 领域 → 基础设施"的单向收敛：\`index.ts\` 是唯一同时依赖全部核心模块的节点；\`db.ts\` 被各层共享但不反向依赖任何业务模块；\`provider-pool.ts\` 与 \`agent-runner\` 只被执行层引用。理解这一依赖图后，建议按 [Agent Runner 与 IPC 通信协议](10-agent-runner-yu-ipc-tong-xin-xie-yi) → [SQLite Schema 与数据库迁移机制](12-sqlite-schema-yu-shu-ju-ku-qian-yi-ji-zhi) 的顺序继续深入，前者解释主服务与执行进程的边界协议，后者展开持久化层的 schema 演进机制。`;export{n as default};
