const n=`> 本页回答一个核心问题：HappyClaw 如何把「你是谁（身份）」「你在哪里干活（隔离环境）」「你此刻在说什么（执行上下文）」拆成三个独立又相互绑定的概念。理解这三层是理解整个系统产品形态与权限边界的起点。

## 从"群组聊天"到"智能体优先"：三层模型为何存在

HappyClaw 早期沿用了 IM 群组的思维：一个群聊就是一个工作单元。随着系统演进为**自托管多用户 Claude Code 智能体工作台**，产品模型发生了根本性迁移——**智能体（Agent）成为顶层产品身份和策略拥有者**，工作区与会话退居为它的派生资源。架构文档明确写道：产品模型与持久化运行时模型是"显式区分"的：Agent 是顶层身份；Workspace 是私有文件系统与隔离边界；Runtime Session 只是工作区内部的执行记录，**它不是另一个产品级 Agent**。

这一决策的直接后果是目标层级：

\`\`\`text
Agent
  ├── 身份提示词（identity prompt）
  ├── Claude 预设包含策略
  ├── 用户 Skill / 用户 MCP 策略
  ├── 渠道挂载（channel mounts）
  └── Workspaces
      ├── 运行时隔离边界
      ├── 主会话（main session）
      └── 可选对话/任务运行时会话
\`\`\`

Sources: [agent-first-architecture-plan.md](docs/agent-first-architecture-plan.md#L12-L40)

对初学者来说，最容易混淆的点在于：**代码里"Agent"一词被复用了两次**。顶层智能体存放在 \`agent_profiles\` 表（新概念）；而遗留的 \`agents\` 表存放的是**工作区内部的对话/任务/子代理会话**（旧概念，见下文第三层）。数据库注释明确警告："Do not confuse this with the legacy \`agents\` table"——请务必区分这两者。

Sources: [db.ts](src/db.ts#L891-L935)

## 三层模型总览

先给出整体关系图，再逐层拆解。这张图把三层及其数据库落点画在一起，阅读时请记住：**每一层都有自己的存储表和生命周期，层与层之间通过外键/绑定表关联**。

\`\`\`mermaid
graph TB
    subgraph L1["第一层 · 智能体 Agent（身份与策略）"]
        AP["agent_profiles<br/>identity_prompt / soul_prompt<br/>agents_prompt / tools_prompt<br/>runtime_policy / identity_hash / version"]
        DAP["内置默认智能体 'HappyClaw'<br/>每个用户自动创建"]
    end

    subgraph L2["第二层 · 工作区 Workspace（隔离与执行）"]
        WS["workspaces（规范表）<br/>jid = web:{uuid}"]
        RG["registered_groups（兼容表）<br/>folder = 文件系统目录名"]
        WAP["workspace_agent_profiles（绑定表）<br/>folder → agent_profile_id<br/>+ interaction_mode"]
        FILES["data/groups/{folder}/ 项目文件<br/>data/sessions/{folder}/.claude/ SDK 会话"]
    end

    subgraph L3["第三层 · 会话 Session（执行记录）"]
        MAIN["主会话 main<br/>chat_jid = 工作区 JID 本身"]
        CONV["对话会话 conversation<br/>chat_jid = {workspaceJid}#agent:{id}"]
        RS["运行时会话 workspace_runtime_sessions<br/>sdk_session_id / provider_id<br/>agent_profile_id / identity_hash"]
        SESS["sessions 表<br/>（group_folder, agent_id）<br/>→ session_id + provider_id"]
    end

    AP --> DAP
    DAP -->|"Home 工作区必须绑定内置智能体"| WAP
    AP -->|"拥有多个"| WAP
    WAP -->|"绑定"| WS
    WS -->|"兼容镜像"| RG
    RG -->|"folder 指向"| FILES
    WS -->|"默认拥有"| MAIN
    WS -->|"可创建多个"| CONV
    WS -->|"投影 SDK 恢复元数据"| RS
    CONV -->|"SDK 会话目录 agents/{id}/.claude/"| FILES
    RS -->|"粘性 Provider 绑定"| SESS
\`\`\`

**三层职责对比表**是理解本模型最直接的速查工具：

| 维度 | 智能体（Agent） | 工作区（Workspace） | 会话（Session） |
|---|---|---|---|
| 本质 | 产品级身份与策略拥有者 | 隔离边界与执行环境 | 工作区内的执行记录 |
| 回答的问题 | 我是谁？能调用哪些能力？ | 我在哪干活？以什么模式运行？ | 此刻的对话/任务进行到哪？ |
| 核心表 | \`agent_profiles\` | \`workspaces\`、\`registered_groups\`、\`workspace_agent_profiles\` | \`agents\`（对话/任务）、\`workspace_runtime_sessions\`、\`sessions\` |
| 唯一标识 | \`id\`（UUID） | \`jid\`（\`web:{uuid}\`）+ \`folder\`（目录名） | \`agent_id\` + 虚拟聊天 JID（\`{workspaceJid}#agent:{id}\`） |
| 身份校验 | \`identity_hash\` + \`version\` | 无独立身份，随 Agent 绑定 | 快照 \`agent_profile_id\` + \`identity_hash\` + \`version\` |
| 归属 | \`owner_user_id\` | \`owner_user_id\` + 绑定的 \`agent_profile_id\` | 所在工作区，\`created_by\` 记录创建者 |
| 生命周期 | 创建/编辑/归档；删除前须迁移全部工作区 | 创建须显式选 Agent；删除级联清理会话 | 主会话常驻；对话/任务会话可增删、可被 \`/clear\` 重置 |

Sources: [agent-first-architecture-plan.md](docs/agent-first-architecture-plan.md#L47-L80) · [types.ts](src/types.ts#L281-L320)

## 第一层：智能体 —— 身份与策略的拥有者

**智能体是产品的第一级用户心智模型**，而不是一个可执行进程。它的职责是"定义"，不是"运行"：定义身份、定义能力边界、拥有工作区与渠道挂载。每个智能体有七类提示词字段，前四个构成了完整的人格分层：

| 字段 | 作用 |
|---|---|
| \`identity_prompt\` | 身份：简短的角色、使命与边界 |
| \`soul_prompt\` | 灵魂：价值观、气质与持久判断原则 |
| \`agents_prompt\` | 操作规则、工作流与协作行为 |
| \`tools_prompt\` | 工具选择与使用指引 |
| \`prompt_mode\` | \`append\`（追加到 Claude Code 预设之后）或 \`replace\`（替换预设） |

\`agent_profiles\` 表还包含 \`runtime_policy\`（JSON 运行时策略：推理 effort、上下文来源、用户 Skill/MCP 选择）、\`identity_hash\`（身份指纹）与 \`version\`（版本号）。**Provider、模型与凭据由系统统一管理，不属于智能体策略**——这一点在第四阶段迁移中刻意收窄，避免把资源选择权下放到策略层。

Sources: [types.ts](src/types.ts#L281-L320) · [agent-first-architecture-plan.md](docs/agent-first-architecture-plan.md#L200-L235)

每位用户都自动拥有一个内置默认智能体，名为 **HappyClaw**（旧名 "Default Agent" 会在读取时自动迁移改名）。它是代码级保障的：Home 工作区必须绑定此内置智能体，任何尝试把 Home 工作区绑到其他智能体的操作都会被 \`assignWorkspaceAgentProfile\` 直接拒绝。

Sources: [db.ts](src/db.ts#L8724-L8810) · [db.ts](src/db.ts#L9045-L9075)

## 第二层：工作区 —— 隔离与执行边界

工作区由智能体派生而来，是**文件系统隔离、路由与 Host/Container 双执行模式的边界**。它的三个关键设计：

**1. 目录名即持久标识。** 工作区的 \`folder\` 不是任意路径，而是受正则约束的标识符（\`^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$\`）。创建时被接受的目录名，在清理时也一定能被安全处理——这是注册与运行时路径构建共享的契约。

Sources: [workspace-folder.ts](src/workspace-folder.ts#L1-L22)

**2. 三表协作的兼容架构。** 规范化 \`workspaces\` 表是元数据真相源；\`registered_groups\` 是遗留兼容镜像（历史数据仍驻留其中）；\`workspace_agent_profiles\` 是连接工作区与智能体的桥梁表，记录 \`group_folder → agent_profile_id\` 绑定及 \`interaction_mode\`（assistant / proactive）。API 层通过 \`/api/workspaces\` 暴露这三者的合并投影。

Sources: [db.ts](src/db.ts#L715-L745) · [db.ts](src/db.ts#L986-L995) · [workspaces.ts](src/routes/workspaces.ts#L80-L130)

**3. 创建必须显式选择智能体。** 工作区创建接口要求携带 \`agent_profile_id\`（未指定时回退到当前用户的默认智能体，但**加载失败绝不会静默回退**——前端把失败态、空态、加载态明确区分）。发布过程在智能体级锁内完成"绑定写入 + 注册组发布"两步，保证任何并发编辑都无法在两者之间插入快照；失败时双向回滚。

Sources: [groups.ts](src/routes/groups.ts#L546-L615) · [groups.ts](src/routes/groups.ts#L980-L1060)

工作区还携带执行语义：\`execution_mode\`（host/container）、\`interaction_mode\`（assistant/proactive 交互契约）、\`custom_cwd\`（宿主机模式工作目录）、以及 init 来源（\`init_source_path\` / \`init_git_url\`）。容器模式可额外挂载宿主机目录，但仅限活跃管理员且必须通过白名单校验。

Sources: [groups.ts](src/routes/groups.ts#L620-L800) · [workspace-interaction-runtime.ts](src/workspace-interaction-runtime.ts#L1-L30)

## 第三层：会话 —— 执行记录与运行时身份

会话是工作区内部的执行记录，**它不是产品级身份**。理解这一层的关键是分清三种会话形态：

| 形态 | 存储 | 聊天 JID | SDK 会话目录 | 说明 |
|---|---|---|---|---|
| 主会话（main） | 无独立行，工作区本身即主会话 | 工作区 JID（\`web:{uuid}\`） | \`data/sessions/{folder}/.claude/\` | 每个工作区默认常驻；\`/clear\` 重置会停止所有兄弟 JID 并清空目录缓存 |
| 对话会话（conversation） | \`agents\` 表，\`kind='conversation'\` | \`{workspaceJid}#agent:{agentId}\` | \`data/sessions/{folder}/agents/{agentId}/.claude/\` | Web 手动创建或 IM 话题映射；有独立的 \`source_kind\` / \`thread_id\` / \`title_source\` |
| 运行时会话（runtime） | \`workspace_runtime_sessions\` 表 | —（投影数据） | 同上 | 只记录 SDK/provider 恢复元数据，故意不叫 \`sessions\` 以免与产品会话混淆 |

Sources: [routes/agents.ts](src/routes/agents.ts#L341-L400) · [db.ts](src/db.ts#L751-L770) · [commands.test.ts](tests/commands.test.ts#L95-L150)

会话列表 API（\`GET /api/groups/:jid/sessions\`）把主会话与对话会话合并返回：主会话固定 \`id='main'\`、\`is_main=true\`，对话会话附带最近消息预览与关联的 IM 挂载。创建对话会话时，系统同步创建 IPC 与会话目录，并注册虚拟聊天 JID \`{jid}#agent:{id}\` 用于消息路由。

Sources: [routes/agents.ts](src/routes/agents.ts#L400-L480)

**运行时会话承载运行时身份一致性。** \`workspace_runtime_sessions\` 行记录 \`sdk_session_id\`、\`provider_id\`、\`agent_profile_id\`、\`agent_profile_version\`、\`identity_hash\`——即架构文档要求的"运行时身份必须包含 AgentProfile id + identity hash + version"。同时，\`sessions\` 表按 \`(group_folder, agent_id)\` 维护 SDK 会话 ID 与 **Provider 粘性绑定**：当恢复一个已产生 thinking 块的 Claude 会话时，必须路由回同一 Provider，否则 thinking 块签名无法校验。切换 Provider 时会先 \`deleteSession\` 清空会话再重绑新 Provider。

Sources: [db.ts](src/db.ts#L7817-L7900) · [container-runner.ts](src/container-runner.ts#L1680-L1725) · [agent-first-architecture-plan.md](docs/agent-first-architecture-plan.md#L120-L145)

## 三层之间的联动：身份指纹与热失效

三层模型的价值在于**可验证的联动**。核心机制是 \`identity_hash\`（身份指纹）：

\`\`\`mermaid
sequenceDiagram
    participant U as 用户
    participant API as Agent API
    participant DB as agent_profiles
    participant R as Warm Runner
    participant W as 工作区

    U->>API: 编辑智能体身份提示词
    API->>DB: 更新 prompts → 重算 identity_hash + version+1
    API->>R: 停止该智能体所有工作区的 warm runner
    Note over R,W: 下次冷启动时注入新身份
    W->>R: 新消息进入工作区会话
    R->>DB: 校验会话快照 identity_hash / version
    alt 指纹一致
        R-->>W: 正常处理
    else 指纹不一致（会话重置）
        R-->>W: 重置 SDK 会话行，保留近期历史注入
    end
\`\`\`

具体规则有三条，全部在智能体级锁内执行：

1. **编辑智能体身份** → 停止所有绑定工作区的 warm runner（防止旧内存中的 runner 用过期提示词处理新消息）；
2. **工作区切换智能体** → 停止该工作区的 warm runner，并在同一事务中更新 \`workspace_agent_profiles\` 绑定与渠道挂载镜像；
3. **删除非默认智能体** → 要求所有绑定工作区先迁移，渠道挂载的 Agent 归属随工作区映射一起变更。

Sources: [agent-profile-runtime.ts](src/agent-profile-runtime.ts#L1-L105) · [agent-first-architecture-plan.md](docs/agent-first-architecture-plan.md#L150-L200)

会话级还有一个**渠道归属粘性**规则：会话的所有者按"会话粒度"（Provider + 外部聊天 + 渠道账号）固定，Web 可以注入消息但不会改变传输归属；第二个 IM 连接器观察到后续消息也不会静默迁移会话到自己的 Bot。只有跨越不同会话/账号/Provider 时才可能更换所有者。

Sources: [channel-session-owner.ts](src/channel-session-owner.ts#L1-L36)

## 前端视角：Agent 分组、工作区与会话侧栏

三层模型在前端呈现为两级导航加一个侧栏：**侧边栏先按 Agent 分组（默认 HappyClaw 置顶，自定义智能体按名称排序），每个分组下列出其拥有的工作区**（Home 工作区优先）；进入工作区后，会话侧栏列出主会话与各对话会话，支持重命名、删除、绑定 IM 渠道。

Sources: [agent-product.ts](web/src/utils/agent-product.ts#L30-L60) · [SessionSidebar.tsx](web/src/components/chat/SessionSidebar.tsx#L1-L60)

## 小结与阅读路径

一句话总结三层模型：**智能体定义身份与策略，工作区提供隔离与执行环境，会话承载每一次具体的对话与任务执行**；三者通过 \`workspace_agent_profiles\` 绑定表和 \`identity_hash\` 身份指纹实现一致的联动与失效控制。

建议的后续阅读顺序：

- 想知道"工作区到底怎么跑起来"：→ [Host 与 Container 双执行模式](7-host-yu-container-shuang-zhi-xing-mo-shi)
- 想知道"智能体能调用哪些能力"：→ [Agent 能力治理：Skills、MCP 与 Plugins](8-agent-neng-li-zhi-li-skills-mcp-yu-plugins)
- 想知道"会话之间如何排队并发"：→ [会话队列与并发控制](18-hui-hua-dui-lie-yu-bing-fa-kong-zhi)
- 想知道"工作区记忆如何跨会话共享"：→ [Workspace Memory v2：结构化跨会话知识](22-workspace-memory-v2-jie-gou-hua-kua-hui-hua-zhi-shi)
- 想验证权限边界：→ [RBAC 权限模型与资源隔离](24-rbac-quan-xian-mo-xing-yu-zi-yuan-ge-chi)`;export{n as default};
