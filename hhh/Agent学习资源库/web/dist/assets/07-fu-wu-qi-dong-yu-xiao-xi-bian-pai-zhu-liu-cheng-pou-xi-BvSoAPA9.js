const e=`本页剖析 Miniclaw 后端服务的启动时序与消息编排主干。核心结论先行：整个后端的编排中枢是 [src/index.ts](src/index.ts#L1-L3) 这一个超过两万行的模块——它不是传统意义上的"路由层"，而是把轮询调度、串行队列、游标状态机、进程生命周期管理全部收拢在一个 \`main()\` 函数闭包中的"编排巨石"。理解这一页的关键在于把握三条主线：**启动阶段的确定性顺序**（先恢复状态、再开端口、最后连渠道）、**消息从 IM 渠道到 Agent 执行的完整链路**、以及**崩溃恢复如何依赖持久化游标而非内存状态**。

## 进程入口与启动前置条件

进程入口由 package.json 定义：生产环境执行编译产物 \`dist/index.js\`，开发环境通过 tsx 直接运行源码。第一个 import 是刻意的架构约束——[load-env.ts](src/load-env.ts#L1-L5) 必须在任何其他模块读取 \`process.env\` 之前加载 \`.env\` 文件并配置 undici 全局代理 dispatcher，否则 config.ts 与 web.ts 在模块求值阶段读到的环境变量将不完整。这种"import 顺序即语义"的设计是 Node.js ESM 模块图求值顺序的直接利用。

Sources: [package.json](package.json#L6-L10), [load-env.ts](src/load-env.ts#L1-L5)

\`main()\` 函数的前几步建立运行基线：先迁移数据目录结构，再调用 \`initDatabase()\` 初始化 SQLite（含 Schema 版本迁移），随后立即执行三类"僵尸状态清理"。这些清理存在的原因是进程重启后内存回调全部丢失：已完成的 task/spawn Agent 若超过一小时未清理会导致数据库膨胀；标记为 running 的 SDK 任务在重启后不可能仍在运行；spawn Agent 的任务回调随进程消亡，不清理会让前端永久渲染"正在思考"。这三步体现了该系统的一个核心设计哲学——**SQLite 是唯一可信状态源，内存只是缓存**，任何跨进程存活的内存语义都必须在启动时被显式对账。

Sources: [index.ts](src/index.ts#L19720-L19764)

紧接其后的是一次性配置迁移与状态装载。\`migrateSystemIMToPerUser()\` 将旧版全局 IM 配置迁入 admin 用户的按用户配置；\`loadState()\` 则从 SQLite 的 router_state 表恢复三类游标——全局拉取游标、每会话的 next-pull 游标、以及每会话的 committed 游标。这里有一个值得注意的防御性决策：代码注释明确说明**不会用 next-pull 游标合成 committed 游标**，因为崩溃可能在 IPC 回执尚未提交时就推进了 next-pull，若将其视为已提交会造成静默丢消息。"at-least-once 重放优于 at-most-once 丢失"是该消息系统的根本权衡。

Sources: [index.ts](src/index.ts#L19666-L19666), [index.ts](src/index.ts#L4901-L4940)

## main() 启动序列全景

下图概括了从进程启动到全系统就绪的完整顺序。注意三个刻意安排的层次边界：Web 服务先于渠道连接启动（保证前端认证 API 不被飞书就绪状态阻塞）；队列的依赖注入发生在调度器启动之前；所有渠道连接完成之前入站处理被挂起。

\`\`\`mermaid
flowchart TD
    A[进程入口 dist/index.js] --> B[load-env 加载 .env 与代理]
    B --> C["main(): migrateDataDirectories<br/>+ initDatabase"]
    C --> D[僵尸 Agent 状态清理<br/>deleteCompletedAgents 等]
    D --> E["loadState()<br/>恢复游标 / 会话 / 群组"]
    E --> F[注册 SIGTERM/SIGINT<br/>分阶段优雅停机]
    F --> G["startWebServer()<br/>Hono + WebSocket 提前启动"]
    G --> H[GroupQueue 依赖注入<br/>processMessagesFn / 序列化键 / 计费]
    H --> I[startSchedulerLoop<br/>定时任务调度器]
    I --> J[IM 连接池构建<br/>分页枚举活跃用户]
    J --> K[遗留单例配置投影为<br/>first-class 渠道账号]
    K --> L["imManager.deferInbound()<br/>挂起入站处理"]
    L --> M[并发连接所有启用账号]
    M --> N[可靠性对账四连:<br/>Inbox / Outbox / 流式卡 / IPC]
    N --> O[recoverPendingMessages<br/>recoverConversationAgents]
    O --> P["startIpcWatcher + startStreamingBuffer<br/>+ startMessageLoop"]
\`\`\`

Sources: [index.ts](src/index.ts#L20352-L20353), [index.ts](src/index.ts#L21074-L21110)

Web 服务器的启动位置值得单独说明：它被注释明确标注为 "Start Web server early so frontend auth/API isn't blocked by Feishu readiness"。[startWebServer](src/web.ts#L3275-L3306) 接收一个巨大的 \`webDeps\` 依赖注入对象——这是 index.ts 与 web.ts 之间的全部契约面，包含群组快照访问器、七个渠道的连接状态查询函数、渠道热重载回调等数十个成员。这种"单对象注入"模式让 web.ts 保持对 index.ts 内部状态的无知，代价是契约面的持续膨胀。

Sources: [web.ts](src/web.ts#L3275-L3306), [index.ts](src/index.ts#L20353-L20409)

### 队列依赖注入：编排中枢的控制面

在调度器启动前，\`main()\` 对全局单例 \`GroupQueue\` 进行了十余项回调注入，这实际上是整个编排系统的控制平面接线。\`setProcessMessagesFn(processGroupMessages)\` 把冷启动消息处理权交给队列；\`setHostModeChecker\` 让队列能判断某会话应使用 Host 还是 Container 容量池；\`setSerializationKeyResolver\` 定义了虚拟 JID 的串行化规则——\`{chatJid}#agent:{agentId}\` 映射到 \`{folder}#{agentId}\`，\`{chatJid}#task:{taskId}\` 同理，确保同一 Workspace 下不同 Agent/任务的执行互不阻塞但各自严格串行。

Sources: [index.ts](src/index.ts#L20623-L20665)

其余注入项构成故障恢复与资源治理的闭环：计费并发上限检查器统计用户名下活跃容器数以限制非 admin 用户；\`onUnconsumedAgentIpc\` 在 Agent 进程退出但有未消费 IPC 消息时重新入队 \`processAgentConversation\`；\`onUnacknowledgedIpcDeliveries\` 在回执未确认时回卷游标触发数据库重放。这些回调共同实现了一个不变量：**任何已被物理接收的消息，要么被 Agent 消费并被确认，要么在下次启动或重试时被重放**。

Sources: [index.ts](src/index.ts#L20715-L20782)

## 分阶段优雅停机

停机设计是这个系统中最能体现工程成熟度的部分。[shutdown 处理器](src/index.ts#L19801-L19905) 将 SIGTERM/SIGINT 的处理组织为严格的五个阶段，每个阶段的先后顺序都有明确的正确性理由：

| 阶段 | 动作 | 正确性约束 |
|------|------|-----------|
| 前置 | \`pauseInbound()\` 停止所有账号级入站回调 | 保留活客户端用于停机期出站确认 |
| Phase 0 | \`stopSchedulerLoop()\` | 先停止物化新工作，排空调度器私有的脚本运行/通知重试 |
| Phase 1 | 并行 \`shutdownWebServer()\` + \`queue.shutdown(15s)\` | 停外部入口并排空所有 Agent 循环；IM 传输保持连接 |
| 过渡 | 关闭 IPC watcher → 落盘中断的流式消息 | watcher 是出站消费者必须活得比排空更久，否则消息滞留磁盘 |
| Phase 2 | \`abortAllStreamingSessions('服务维护中')\` | 在飞书客户端仍连接时终结所有卡片，避免孤儿「生成中」卡片 |
| Phase 3 | \`imManager.disconnectAll()\` → \`closeDatabase()\` | 只有卡片终结落定后才释放传输客户端 |

一个 30 秒的强制退出定时器兜底整个流程，其时长被注释解释为"必须长于队列 15 秒宽限期加容器约 10 秒强停时间"。二次收到信号则立即 \`process.exit(1)\`。注释中还记录了一个历史教训：Phase 2 与 disconnectAll 曾并发执行，正是产生孤儿流式卡片的根因——现在的顺序性是修 bug 的产物而非预先设计。

Sources: [index.ts](src/index.ts#L19801-L19905)

## 消息入站路径：从渠道适配器到数据库

以飞书为例，一条 IM 消息到达后的处理链路是：事件回调 → 可靠性 Inbox 认领→ 权限与路由判定 → \`storeMessageDirect()\` 写入 SQLite messages 表 → \`broadcastNewMessage()\` 通过 WebSocket 推送 Web 前端 → \`notifyNewImMessage()\` 唤醒轮询循环。[storeMessageDirect 的调用点](src/feishu.ts#L2720-L2733) 携带附件 JSON、source_jid（原始来源会话）与 channel_context（渠道上下文快照），这些字段是后续回复路由与上下文绑定的依据。

Sources: [feishu.ts](src/feishu.ts#L2709-L2733)

唤醒机制本身是一个精巧的低延迟设计。[message-notifier.ts](src/message-notifier.ts#L1-L41) 仅用约 40 行实现了可中断睡眠：轮询循环的每次迭代末尾 \`await interruptibleSleep(POLL_INTERVAL)\` 返回一个 Promise，渠道处理器存完消息后调用 \`notifyNewImMessage()\` 立即 resolve 该 Promise。效果是新消息最多等待 2 秒（POLL_INTERVAL）而通常近乎零延迟进入处理，同时避免了忙轮询。注意注释中的边界划分：Web 消息不走此通知器——它们通过直接 IPC 注入加 \`enqueueMessageCheck()\` 绕过轮询循环。

Sources: [message-notifier.ts](src/message-notifier.ts#L19-L41), [config.ts](src/config.ts#L18-L18)

## 消息轮询主循环：游标驱动的批量分发

[startMessageLoop](src/index.ts#L17017-L17037) 是一个 \`while (!shuttingDown)\` 主循环，每轮做四件事：拉取新消息、推进游标、按会话分发、周期性卡死检测。拉取基于 \`(timestamp, id)\` 二元组游标——[getNewMessages](src/db.ts#L4249-L4267) 用预编译语句查出所有注册会话中游标之后的消息，返回新游标。**游标在分组分发之前就立即推进并 saveState()**，这个看似激进的顺序实际是安全的：消息已持久化在数据库中，即使本轮处理失败，后续的 per-chat 游标机制仍会重放它们。

Sources: [index.ts](src/index.ts#L17026-L17047), [db.ts](src/db.ts#L4249-L4267)

每个会话的消息批次要依次通过一组门控，任一不过则整批丢弃或跳过：

| 门控顺序 | 检查内容 | 不过时的动作 |
|---------|---------|-------------|
| 1. 注册表检查 | chatJid 是否存在于 registeredGroups（内存缺失则回查 DB） | 清理处理指示器后跳过 |
| 2. 会话代理路由 | group.target_agent_id 存在表示消息已在摄入时分发给会话 Agent | 直接 continue（避免双重处理） |
| 3. Owner 门控 | 群组创建者是否 active | 整批 out-of-band 完成，通知丢弃原因 |
| 4. 计费配额 | 非 admin 用户的订阅额度 | 发送欠费提示后阻止处理 |

Sources: [index.ts](src/index.ts#L17049-L17120)

通过门控后进入关键的**暖/冷路径分流**。若该会话已有活跃 Runner，循环调用 \`queue.sendMessage(...)\` 将格式化后的提示词直接通过 IPC 注入正在运行的 Agent 进程——成功时仅推进 next-pull 游标（用 \`advanceNextPullCursorOnly\` 而非直接赋值，防止早前的回复游标被回卷导致重放）；返回 \`'no_active'\` 时才 \`enqueueMessageCheck(chatJid)\` 排队等待新 Runner。这就是同一会话连续发多条消息能被合并进同一次模型调用的机制基础。

Sources: [index.ts](src/index.ts#L17296-L17376)

循环尾部还有一个低频自检：每 15 轮轮询（约 30 秒）调用一次 \`recoverStuckPendingGroups\`，配合常量 \`STUCK_RUNNER_IDLE_MS = 3 分钟\` 与 \`STUCK_RUNNER_FORCE_RESTART_MS = 10 分钟\` 构成三级卡死检测梯度。

Sources: [index.ts](src/index.ts#L17383-L17390), [index.ts](src/index.ts#L1233-L1239)

## GroupQueue：会话级串行化的实现

GroupQueue 类是并发控制的真正执行者。[enqueueMessageCheck](src/group-queue.ts#L1331-L1389) 展示了完整的准入决策树：

\`\`\`mermaid
flowchart TD
    A[enqueueMessageCheck] --> B{正在优雅停机?}
    B -- 是 --> X[丢弃]
    B -- 否 --> C{终端变更丢弃键命中?}
    C -- 是 --> X
    C -- 否 --> D{变更暂停中?<br/>如插件安装/容器重建}
    D -- 是 --> Y[置 pendingMessages 标记<br/>加入 waitingGroups]
    D -- 否 --> E{自身或共享序列化键的<br/>Runner 活跃?}
    E -- 是 --> Y
    E -- 否 --> F{容量可用?<br/>Container 或 Host 池}
    F -- 否 --> Y
    F -- 是 --> G[runForGroup 立即启动]
    Y -.->|Runner 结束/drain 信号| G
\`\`\`

Sources: [group-queue.ts](src/group-queue.ts#L1331-L1389)

当 Runner 结束或空闲时，[drainGroup](src/group-queue.ts#L2773-L2849) 按"任务优先、消息其次"的顺序排水，且有一道防重复护栏：pendingMessages 为真但 retryTimer 已存在时不启动新 Runner——因为 \`processMessagesFn\` 失败时 scheduleRetry 与 drainGroup 会同时触发，没有这道护栏会在重试定时器之外再起一个容器造成重复消费。完全空闲的一次性虚拟 JID（\`#task:\`/\`#agent:\` 后缀）会被 GC 出 groups Map，否则每次任务运行的唯一 runId 会让 Map 无界增长。

Sources: [group-queue.ts](src/group-queue.ts#L2773-L2848)

失败重试采用指数退避：[scheduleRetry](src/group-queue.ts#L2740-L2770) 设置定时器到期后重新 enqueue，期间若用户请求停止/重启则取消重试。达到最大重试次数后由 index.ts 注入的 \`onMaxRetriesExceeded\` 回调接管——它基于最终失败批次的确切 coveredCursors 快照推进游标并向会话发送系统错误消息，保证"重试耗尽即消费完毕"，不会留下永远待处理的僵尸消息。

Sources: [group-queue.ts](src/group-queue.ts#L2740-L2770), [index.ts](src/index.ts#L20666-L20714)

## processGroupMessages：冷启动回合的组装

队列实际调用的 [processGroupMessages](src/index.ts#L5593-L5625) 是冷启动路径的入口。它的职责链条依次为：解析有效群组配置（含兄弟 JID 继承 executionMode）、检查 activation_mode 是否禁用、用 per-chat 游标拉取积压消息、过滤掉对应运行记录已终态的调度器提示词（防止旧的一次性任务被执行第二次）。随后解决**回复路由归属**：混合批次（Web + IM 来源混杂）只在全部消息来自同一 IM 源时才向 IM 回复；粘性的 session channel owner 机制让后续 Web 发起的回合仍记住上次的 IM 投递目标。

Sources: [index.ts](src/index.ts#L5593-L5687)

在真正调用 Agent 前，函数还完成了两组关键的状态绑定：\`activeAgentBuilderTurns.startBatch\` 将本批每条消息登记为输入 turn（携带 runtimeTurnId 与可选 scheduledTaskId），供结果阶段做输入↔输出关联；\`bindChannelOutboxScope\` 将流式卡片地址绑定到本次 turn 的 outbox 作用域。随后以 \`runAgent(effectiveGroup, prompt, chatJid, lastProcessed.id, onOutput)\` 进入执行层，其中 onOutput 回调承载着流式事件到渠道卡片的实时转换。

Sources: [index.ts](src/index.ts#L7072-L7112)

## runAgent：Profile 解析与双执行模式选择

[runAgent](src/index.ts#L9459-L9528) 首先解析运行时的身份与策略要素：有效 Agent Profile、交互模式、Miniclaw Owner Profile 资格（首唤醒仪式仅在 Home 工作区的默认 Profile 真实交互 turn 上生效）。接着写入两个快照文件——tasks 快照与 available-groups 快照——这是容器内 Agent 感知宿主任务列表与可见群的唯一通道。

Sources: [index.ts](src/index.ts#L9459-L9528)

输出回调被包装后承担了队列协作协议：\`markRunnerActivity\` 喂给卡死检测、有 IPC 回执且无终端级 provider 故障时 \`acknowledgeIpcDeliveries\` 提交投递、\`queryIdle === true\` 时通知队列可以注入下一条消息。session ID 只从成功输出更新——error 输出可能携带过期 ID，覆盖流式阶段的有效 session 会导致对话错乱，代码注释对此有明确警示。

Sources: [index.ts](src/index.ts#L9530-L9560)

执行模式的分支点是 \`executionMode === 'host'\`。Host 模式在 spawn 前最后一刻重查 owner 角色（持久化的 host workspace 不是永久授权，角色变更即时生效），非 admin 直接拒绝。两条路径都汇入 [runAgentWithModelFallback](src/container-runner.ts#L3076-L3096)，后者实现了一条重要的产品契约：**一个顶层 Agent 拥有唯一确定的模型配置，禁止跨配置重试**——只有未迁移/无模型的旧安装才保留 provider pool 轮询回退；且 provider 失败重试仅对定时任务开放，普通消息的 provider 失败原样返回交由上层处理。

| 维度 | Host 模式 | Container 模式 |
|------|----------|---------------|
| 执行函数 | runHostAgent | runContainerAgent |
| 授权检查 | spawn 前 re-check canExecuteOnHost | 无需（默认模式） |
| 隔离边界 | 宿主进程 + 执行策略 | Docker 容器 + 挂载白名单 |

Sources: [index.ts](src/index.ts#L9601-L9672), [container-runner.ts](src/container-runner.ts#L3088-L3096)

## 启动恢复体系：正确性边界的排序

启动尾声的恢复序列被代码注释称为"a correctness boundary"，其顺序不可调换：先做可靠性对账（关闭旧进程遗留的存活卡片、失效过期的执行围栏），再恢复流式缓冲与 IPC 投递，然后才是 \`recoverPendingMessages\` 与 \`recoverConversationAgents\`。若消息循环提前启动，可能为同一个逻辑 turn 创建第二张活跃卡片，而渠道侧旧卡片仍显示运行中。[reconcileChannelReliabilityOnStartup 与 outbox 对账](src/index.ts#L21338-L21368) 之后才调用 \`resumeDeferredInbound()\` 放行积压的入站消息。

Sources: [index.ts](src/index.ts#L21324-L21368)

[recoverPendingMessages](src/index.ts#L17480-L17531) 的逻辑浓缩了游标体系的精髓：对每个注册会话比较 next-pull 游标与 committed 游标，若前者超前（说明上次运行有未确认的 IPC 投递）则清空持久化投递并回卷游标；随后从 committed 游标起扫描积压消息，发现积压则清掉可能"闹鬼"的旧 session（防止 Agent 从错误的对话历史继续）并将会话加入 recoveryGroups 触发重放。[recoverConversationAgents](src/index.ts#L17539-L17603) 对会话型 Agent 做对称操作：running 状态重置为 idle（进程必死无疑）、虚拟 JID 上有积压消息则重新触发处理，同时顺带归档超过 30 天不活跃的会话。

Sources: [index.ts](src/index.ts#L17480-L17531), [index.ts](src/index.ts#L17539-L17603)

至此主流程闭环：渠道适配器持久化入站消息 → 轮询循环游标拉取并门控 → GroupQueue 保证会话内严格串行 → processGroupMessages 组装冷启动回合或 IPC 注入热回合 → runAgent 选择 Host/Container 执行 → 输出经 turn 关联回写游标并投递渠道。任何一环崩溃，重启后的恢复序列都能从 SQLite 游标重建出一致的待办集合。

## 延伸阅读

- Web 服务路由族、Cookie 认证与 WebSocket 广播的细节，见 [Hono Web 服务：路由族、Cookie 认证与 WebSocket](8-hono-web-fu-wu-lu-you-zu-cookie-ren-zheng-yu-websocket)
- 本页反复出现的 SQLite 游标与状态表的物理布局，见 [SQLite 持久化：Schema 版本化、迁移策略与核心表族](9-sqlite-chi-jiu-hua-schema-ban-ben-hua-qian-yi-ce-lue-yu-he-xin-biao-zu)
- stdin/stdout 结构化协议与 IPC 通道的线缆格式，见 [Pi Agent Runner 协议：stdin/stdout 结构化结果与 IPC 通道](10-pi-agent-runner-xie-yi-stdin-stdout-jie-gou-hua-jie-guo-yu-ipc-tong-dao)
- Host 与 Container 双模式的容量参数与暖 Runner 细节，见 [Host 与 Container 双执行模式：容量、超时与暖 Runner](11-host-yu-container-shuang-zhi-xing-mo-shi-rong-liang-chao-shi-yu-nuan-runner)
- 队列重试退避与卡死恢复的完整策略，见 [会话串行队列：Runner 生命周期、重试退避与卡死恢复](14-hui-hua-chuan-xing-dui-lie-runner-sheng-ming-zhou-qi-zhong-shi-tui-bi-yu-qia-si-hui-fu)`;export{e as default};
