const n=`Miniclaw 是一个自托管的多渠道 AI Agent 工作台，其工程复杂度主要集中在"职责如何在四个运行单元之间切分"这一问题上。本页聚焦回答一个核心问题：**Backend、Pi Runner、Workspace 与客户端各自拥有什么、不拥有什么，以及它们之间通过什么协议通信**。队列调度细节、Prompt 组装、渠道适配器内部实现等属于后续专页内容，此处仅在边界层面提及。

## 四边界模型总览

Miniclaw 的整体拓扑是一条自上而下的请求链：客户端发起对话或操作，Backend 做认证与编排，最终由 Pi Runner 在某个 Workspace 的文件边界内执行 Agent 循环。README 中的官方架构图明确划分了四层：

\`\`\`text
Web Client / Electron Desktop / Message Channels
                         │ HTTP + WebSocket / Channel Adapters
                         ▼
                Miniclaw Backend
        Auth · API · Queue · Scheduler · ACL
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
   Workspace         Capability         Channel
   Session           Registry            Binding
   Memory            Skills/MCP          Delivery
                         │
                         ▼
                 Pi Agent Runner
                   Host / Docker
                         │
                         ▼
                Pi Agent Runtime
          Tools · Extensions · Subagents
\`\`\`

用 Mermaid 重绘这段拓扑，并标注每个单元的**独占职责**（这是理解边界的最小记忆单元）：

\`\`\`mermaid
flowchart TB
    subgraph clients ["客户端层（三类接入方）"]
        WEB["Web Client<br/>React 19 + Vite"]
        ELEC["Electron Desktop<br/>受限 Shell"]
        IM["IM 渠道<br/>飞书/TG/微信/QQ/钉钉/Discord/WA"]
    end

    subgraph backend ["Backend（src/）— 编排中枢"]
        AUTH["认证 · Cookie 会话"]
        API["Hono API 路由族"]
        QUEUE["Session 串行队列"]
        SCHED["任务调度器"]
        ACL["ACL 授权判定"]
    end

    subgraph runner ["Pi Agent Runner（container/agent-runner/）"]
        SDK["Agent 执行循环<br/>工具调用 · Subagents"]
    end

    WS[("Workspace<br/>data/groups/&lt;folder&gt;<br/>文件 + Memory 边界")]

    WEB -- "HTTP fetch (credentials: include)<br/>WebSocket" --> backend
    ELEC -- "Preload IPC 桥 → 同一 Backend" --> backend
    IM -- "渠道适配器长连接" --> backend
    backend -- "stdin: ContainerInput JSON<br/>stdout: 标记包裹的结构化结果<br/>IPC 目录: 追加消息" --> runner
    runner -- "文件读写（Host cwd 或容器挂载）" --> WS
\`\`\`

边界划分的权威表述来自仓库文档：**Backend 负责认证、持久化、队列、调度、渠道与授权；Pi Runner 负责 Agent 执行；Workspace 决定文件与运行边界；Electron Renderer 只负责界面和受限的桌面桥接。**

Sources: [README.md](README.md#L127-L151)

Sources: [CLAUDE.md](CLAUDE.md#L98-L110)

## Backend：唯一的有状态编排中枢

Backend 是整个系统中**唯一直接接触数据库和全部凭证的进程**，所有其他单元都通过它间接获得能力。它的入口 \`src/index.ts\` 超过两万行，集中承载启动流程、消息消费、渠道路由、IPC 回传处理、任务调度与 Agent 运行编排——从其导入清单即可看出它同时协调回复投递、Turn 输出协调器、渠道卡片终结等横切关注点。

Web 面向客户端的部分由 Hono 应用承担：\`src/web.ts\` 引入 \`Hono\`、\`@hono/node-server\` 的 \`serve\` 与 \`ws\` 的 \`WebSocketServer\`，配合 Cookie 解析与会话缓存完成认证与实时推送。HTTP 路由按资源族拆分在 \`src/routes/\` 下（agents、groups、tasks、skills、plugins、channel-accounts 等），持久化则统一收敛到 \`src/db.ts\` 的 SQLite Schema 与迁移体系。

关键在于理解 Backend **不做什么**：它不解释 Prompt、不执行工具循环、不理解 Agent 的推理语义——这些都下沉给 Pi Runner；它也不持有工作区文件的"内容真相"，只持有指向文件系统的标识符与元数据。这种"编排归我、执行归你"的切分使得 Runner 可以被替换为不同的执行环境（见后文 Host/Container 对比）而不影响授权与投递逻辑。

Sources: [index.ts](src/index.ts#L63-L80)

Sources: [web.ts](src/web.ts#L1-L30)

Sources: [config.ts](src/config.ts#L33-L35)

## Pi Runner：通过三条通道隔离的无状态执行引擎

Pi Runner 位于 \`container/agent-runner/\`，是唯一加载 Pi/Claude Agent SDK 并驱动 Agent 工具循环的组件。它与 Backend 之间的协议在其入口文件头部有精确定义，共三条通道：

| 通道 | 方向 | 形式 | 用途 |
| --- | --- | --- | --- |
| stdin | Backend → Runner | 完整的 \`ContainerInput\` JSON，读到 EOF | 携带本轮全部输入：消息、会话 ID、能力清单、Provider 配置 |
| stdout | Runner → Backend | \`OUTPUT_START_MARKER\` / \`OUTPUT_END_MARKER\` 包裹的结果块，可多次出现 | 结构化 \`ContainerOutput\` 结果 |
| IPC 目录 | 双向 | \`/workspace/ipc/input/\` 下的 JSON 文件轮询 + \`_close\` 哨兵文件 | 后续追加消息、工具请求与关闭控制 |

这套设计的意图非常清晰：Runner 进程**不直接连接数据库、不监听网络端口、不知道其他 Session 的存在**。Backend 在宿主机侧以 \`data/ipc/<group.folder>/agents/<agentId>\` 作为 IPC 真相目录，并将其挂载为容器内的 \`/workspace/ipc\`——两侧看到的是同一个目录，但只有 Backend 决定哪些文件何时写入。

Runner 内部结构进一步印证了这种封闭性：\`runtime/pi/\` 子目录封装 Provider、Session、Subagents 等运行时概念，\`mcp-tools.ts\` 注册 Miniclaw 侧的 MCP 工具（如 Workspace Memory 快照读取），\`stream-processor.ts\` 把 SDK 的原始事件流转换为统一的 StreamEvent。所有这些模块都只服务于"把一次输入变成一次输出"这个单一使命。

Sources: [index.ts](container/agent-runner/src/index.ts#L1-L15)

Sources: [container-runner.ts](src/container-runner.ts#L1324-L1342)

Sources: [types.ts](container/agent-runner/src/types.ts#L194-L289)

## Workspace：文件系统的持久身份边界

Workspace 在代码中对应 \`data/groups/<folder>\` 目录，其最容易被误解的一点是：**folder 是持久化标识符，不是任意文件系统路径**。\`src/workspace-folder.ts\` 用正则 \`^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$\` 强约束命名，并在注册与运行时路径构建两条路径上共享同一校验函数，确保创建时接受的 folder 在清理时也能被安全处理。

Host 执行模式下，Backend 为每个没有自定义工作目录的 Workspace 初始化独立的 Git 根目录——注释明确说明这是为了防止 Claude Code 向上查找到父项目的 \`.git\`。若使用 \`customCwd\`，则要求必须是绝对路径、经 \`realpathSync\` 解析符号链接以防 TOCTOU 攻击，并重新校验挂载白名单。这三重防御共同守住了"Workspace 是执行边界"这条承诺。

产品语义上，同一 Workspace 内的所有 Runtime Session **共享工作区文件目录，但拥有独立 Pi Session**——文件隔离与对话上下文隔离是两个独立维度。这也解释了为什么 Workspace 能作为群聊绑定、定时任务与 Memory 的归属单位：它是文件真相的唯一锚点。

Sources: [workspace-folder.ts](src/workspace-folder.ts#L1-L22)

Sources: [container-runner.ts](src/container-runner.ts#L2294-L2332)

Sources: [CLAUDE.md](CLAUDE.md#L25-L46)

## 客户端三形态：同构 Web、受限 Shell 与原生渠道

客户端不是一个东西，而是三类边界性质完全不同的接入方，它们唯一的共同点是都必须经过 Backend：

**Web Client**（\`web/\`）是控制面与公共入口。它通过统一的 \`apiFetch\` 封装发起请求，关键细节是 \`credentials: 'include'\`——即认证完全依赖 Backend 下发的 Cookie，前端自身不持有任何令牌存储逻辑；实时流则走独立的 WebSocket 封装（\`web/src/api/ws.ts\`）。这意味着 Electron 与浏览器版 Web 共享同一套前端代码与同一套认证方式。

**Electron Desktop** 刻意做成"薄壳"。主窗口启用 \`contextIsolation: true\`、关闭 \`nodeIntegration\` 并开启 \`sandbox: true\`，Renderer 无权直接读文件、数据库或凭证，所有本机能力必须经过受限的 Preload IPC 桥。它复用 Web Client 产物，仅通过 \`MINICLAW_SERVER_URL\` 指向任意远程 Backend——桌面端因此不构成独立的服务边界，只是 Web 边界的一个受控延伸。

**IM 渠道适配器**（\`src/feishu.ts\`、\`telegram.ts\`、\`qq.ts\`、\`dingtalk.ts\`、\`wechat.ts\`、\`discord.ts\`、\`whatsapp.ts\`）以长连接方式各自对接平台，但消息进入 Backend 后统一走渠道路由与 ACL 判定。对核心系统而言，一条飞书消息和一次 Web 提交在编排层的地位是对等的。

Sources: [client.ts](web/src/api/client.ts#L11-L37)

Sources: [index.ts](electron/src/main/index.ts#L210-L212)

Sources: [CLAUDE.md](CLAUDE.md#L60-L96)

## 三端同步契约：StreamEvent 单一真相源

四个边界之间最容易腐化的地方是事件类型定义漂移——Runner 发出的事件、Backend 中转的事件与前端渲染的事件若各自演化，流式体验会立即断裂。Miniclaw 用构建期复制机制根治此问题：\`shared/stream-event.ts\` 是唯一可编辑的真相源，构建步骤把它拷贝到三个消费端——\`container/agent-runner/src/stream-event.types.ts\`、\`src/stream-event.types.ts\` 与 \`web/src/stream-event.types.ts\`，文件头注释明确警告"不要直接编辑副本，改源文件后执行 \`make build\`"。

\`\`\`mermaid
flowchart LR
    SRC["shared/stream-event.ts<br/>（唯一真相源）"] -- "make build 复制" --> R["container/agent-runner/src/<br/>stream-event.types.ts"]
    SRC -- "make build 复制" --> B["src/<br/>stream-event.types.ts"]
    SRC -- "make build 复制" --> W["web/src/<br/>stream-event.types.ts"]
    R -- "产生事件" --> B
    B -- "WebSocket 转发" --> W
\`\`\`

该契约定义了约二十余种事件类型（文本增量、思考增量、工具调用起止、权限拒绝、Memory 召回、压缩边界、用量上报等），并附带作用域（main/task/subagent/system）与展示层级标注。值得注意的是，仓库规范要求文档不得固化事件数量——应始终以类型定义本身为准，这本身就是对"契约随能力演进"的尊重。

Sources: [stream-event.ts](shared/stream-event.ts#L1-L39)

## Host 与 Container：同一 Runner 的两种物理边界

Pi Runner 的代码只有一份，但它可以被投放到两种隔离强度不同的物理环境中运行，这是架构上最重要的可切换点：

| 维度 | Host 模式 | Container 模式 |
| --- | --- | --- |
| 进程形态 | 宿主机上的 Node 子进程 | 非 root Docker 容器 |
| 工作目录 | \`customCwd\` 直接作为 cwd，默认为 \`data/groups/<folder>\` 并初始化独立 Git 根 | 通过只读/读写白名单挂载访问资源 |
| 容量边界 | 同一 Session 串行；不同 Session 不设应用层并发上限 | 受 \`maxConcurrentContainers\` 与用户计费配额限制 |
| 文件风险面 | 依赖路径校验 + 白名单 + realpath 防 TOCTOU | 内核级命名空间隔离 |
| 入口降权 | 不适用（宿主用户身份） | \`entrypoint.sh\` 以 \`runuser -u node\` 完成 root→node 降权 |

两种模式共用相同的 stdin/stdout/IPC 协议与能力清单解析，因此上层编排代码可以透明切换。Dockerfile 中甚至保留了明确的注释——不在镜像层写 \`USER node\`，而是让 entrypoint 在完成初始化后再降权——说明容器内的特权窗口被压缩到最小。这份对比也回应了一个常见的架构疑问："为什么不用容器承载一切？"答案是：Docker 只负责隔离 Agent 执行环境，不替代 Backend 的授权层，也不承载任何 UI 职责。

Sources: [container-runner.ts](src/container-runner.ts#L1649-L1720)

Sources: [container-runner.ts](src/container-runner.ts#L2273-L2340)

Sources: [entrypoint.sh](container/entrypoint.sh#L20-L35)

Sources: [Dockerfile](container/Dockerfile#L257-L261)

## 边界速查表与阅读路径

最后用一张表收拢全页结论，作为后续所有章节的参照系：

| 边界 | 物理位置 | 拥有 | 明确不拥有 | 与外界的接口 |
| --- | --- | --- | --- | --- |
| **Backend** | \`src/\` | 认证、SQLite、队列、调度、ACL、渠道连接、Provider 凭证 | Agent 推理语义、工具执行 | Hono HTTP/WS（上行）、stdin/stdout/IPC 目录（下行） |
| **Pi Runner** | \`container/agent-runner/\` | Agent 执行循环、SDK 会话、MCP 工具、StreamEvent 生产 | 数据库、网络监听、跨 Session 状态 | 三条通道：stdin、标记包裹的 stdout、IPC 文件 |
| **Workspace** | \`data/groups/<folder>\` | 文件真相、Git 历史、Memory 存储 | 对话上下文（属于各 Session）、授权决策 | 由 Backend 校验后挂载或作为 cwd 暴露 |
| **客户端** | \`web/\`、\`electron/\`、各渠道适配器 | UI 渲染、会话交互、桌面桥接 | 任何持久化、凭证、直连 Runner 的通路 | Cookie 化 HTTP + WebSocket，一律指向 Backend |

若要沿边界继续深入，推荐按依赖顺序阅读：先通过 [Agent-first 产品模型：Agent Profile、Workspace 与 Session 层级](5-agent-first-chan-pin-mo-xing-agent-profile-workspace-yu-session-ceng-ji) 理解 Workspace 之上的产品层级，再进入 [服务启动与消息编排主流程剖析](7-fu-wu-qi-dong-yu-xiao-xi-bian-pai-zhu-liu-cheng-pou-xi) 观察 Backend 的运行时行为，然后到 [Pi Agent Runner 协议：stdin/stdout 结构化结果与 IPC 通道](10-pi-agent-runner-xie-yi-stdin-stdout-jie-gou-hua-jie-guo-yu-ipc-tong-dao) 深挖执行协议细节。安全视角的完整推演见 [ACL 权限矩阵：层次化授权与无 admin 旁路的资源隔离](19-acl-quan-xian-ju-zhen-ceng-ci-hua-shou-quan-yu-wu-admin-pang-lu-de-zi-yuan-ge-chi) 与 [容器隔离与挂载安全：非 root 运行、白名单与密钥加密边界](20-rong-qi-ge-chi-yu-gua-zai-an-quan-fei-root-yun-xing-bai-ming-dan-yu-mi-yao-jia-mi-bian-jie)。`;export{n as default};
