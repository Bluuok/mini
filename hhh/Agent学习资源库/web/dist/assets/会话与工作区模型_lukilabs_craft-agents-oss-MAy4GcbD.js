const s=`# 会话与工作区模型 | lukilabs/craft-agents-oss


---
本页文档介绍了控制 Craft Agent 组织对话、隔离 Agent 状态以及将数据持久化到磁盘的层级数据模型。工作区是顶层的作用域边界；会话则是嵌套在工作区内的单个对话隔离单元。它们共同构成了一个双层、基于文件系统的存储架构，支持多工作区并发、会话分支、跨服务器传输以及具备崩溃安全性的原子持久化。

## 架构概览[](#架构概览)

整个模型根植于 \`~/.craft-agent/workspaces/\` 下的文件系统层级结构中。每个工作区拥有一个独立的目录树，包含其配置、数据来源、技能和会话。会话进而拥有自己的子目录，用于存放 JSONL 对话记录、文件附件、计划、工具输出数据以及下载的二进制文件。这种设计意味着备份、传输和删除都是简单的目录级操作，无需依赖数据库。

Syntax error in textmermaid version 11.6.0

## 工作区模型[](#工作区模型)

### 核心抽象[](#核心抽象)

**工作区** 是顶层组织单元。所有的数据来源、会话、技能、状态和标签都归属于某个工作区。规范类型为 \`WorkspaceConfig\`，定义在 [packages/shared/src/workspaces/types.ts](packages/shared/src/workspaces/types.ts#L32-L55) 中，它存储了 \`id\`、\`name\`、\`slug\`、创建/更新时间戳、可选的默认会话设置以及本地 MCP 服务器配置。

\`slug\` 字段是工作区名称的 URL 安全衍生词（由 [generateSlug()](packages/shared/src/workspaces/storage.ts#L249-L257) 生成），同时用作磁盘上的文件夹名称。为避免冲突，系统会通过 [generateUniqueWorkspacePath()](packages/shared/src/workspaces/storage.ts#L262-L281) 追加数字后缀，如 \`my-project\`、\`my-project-2\` 等。

### 工作区默认配置[](#工作区默认配置)

每个工作区携带一个 \`defaults\` 对象，用于预配置新会话。这些默认配置涵盖 AI 模型、LLM 连接 slug、权限模式、可循环权限模式、工作目录、思考级别、启用的来源 slug 以及颜色主题。在创建时，它们会与全局默认配置合并，且用户提供的值优先级更高 [packages/shared/src/workspaces/storage.ts](packages/shared/src/workspaces/storage.ts#L295-L315)。

### 工作区增删改查与发现[](#工作区增删改查与发现)

工作区存储在 \`~/.craft-agent/workspaces/{slug}/\` 中。存储层（[packages/shared/src/workspaces/storage.ts](packages/shared/src/workspaces/storage.ts#L1-L533)）提供了完整的生命周期管理：

操作

函数

关键行为

创建

\`createWorkspaceAtPath()\`

创建目录树，保存 \`config.json\`，初始化状态、标签和插件清单

加载

\`loadWorkspace()\`

读取配置，统计会话/来源数量，确保技能目录存在

摘要

\`getWorkspaceSummary()\`

轻量级列表，不加载来源详情

删除

\`deleteWorkspaceFolder()\`

对整个工作区目录执行递归 \`rmSync\`

重命名

\`renameWorkspaceFolder()\`

更新 \`config.json\` 中的 \`name\`（slug 保持不变）

发现

\`discoverWorkspacesInDefaultLocation()\`

扫描默认目录，查找包含有效 \`config.json\` 的文件夹

配置写入采用**原子文件写入**（\`atomicWriteFileSync\`），以防进程在写入中途崩溃导致数据损坏。同样，配置中存储的工作区路径会被转换为可移植格式（\`toPortablePath\`），并在读取时进行 \`~\` 展开（\`expandPath\`），从而确保跨机器兼容性。

### 工作区目录结构[](#工作区目录结构)

每个工作区文件夹包含以下子目录，它们在工作区初始化时创建 [packages/shared/src/workspaces/storage.ts](packages/shared/src/workspaces/storage.ts#L317-L329)：

路径

用途

\`config.json\`

工作区设置（名称、slug、默认配置、localMcp 配置）

\`sources/\`

MCP 和 API 数据来源配置

\`sessions/\`

该工作区的所有对话会话

\`skills/\`

自定义技能定义

\`statuses.json\`

自定义工作流状态定义

\`labels.json\`

标签组和标签定义

\`.claude-plugin/\`

用于技能认定的 SDK 插件清单

## 会话模型[](#会话模型)

### 会话作为隔离边界[](#会话作为隔离边界)

会话是 Agent 对话的**主要隔离边界**。每个会话与一个 CraftAgent 实例及一个 SDK 会话形成一对一映射。其规范类型层级如下：\`SessionConfig\`（持久化的元数据）→ \`StoredSession\`（元数据 + 消息 + Token 用量）→ \`SessionMetadata\`（轻量级列表表示）→ \`SessionHeader\`（JSONL 首行格式，包含预计算字段） [packages/shared/src/sessions/types.ts](packages/shared/src/sessions/types.ts#L103-L166), [packages/shared/src/sessions/types.ts](packages/shared/src/sessions/types.ts#L203-L275)。

### 会话标识：人类可读的 Slug[](#会话标识人类可读的-slug)

会话 ID 采用**人类可读的 slug 格式**：\`YYMMDD-形容词-名词\`（例如 \`260615-swift-river\`）。由 [generateUniqueSessionId()](packages/shared/src/sessions/slug-generator.ts#L43-L73) 生成，这些 ID 可按日期前缀进行时间排序，并从每天约 20,000 个独特的形容词-名词组合词库中提取。冲突通过追加数字后缀（\`-2\`、\`-3\`）解决，在极端边缘情况下还存在基于加密随机数的十六进制回退机制。

会话 ID 在执行任何文件系统操作前都会进行**安全校验**。[validateSessionId()](packages/shared/src/sessions/validation.ts#L24-L38) 函数通过比较 \`basename(sessionId)\` 与原始输入来防范路径遍历攻击，并强制执行 \`[\\w-]+\` 模式。[sanitizeSessionId()](packages/shared/src/sessions/validation.ts#L45-L53) 函数则提供了纵深防御的过滤机制。

### 持久化字段与自动传播[](#持久化字段与自动传播)

所有需要持久化到磁盘的会话字段都枚举在 \`SESSION_PERSISTENT_FIELDS\` 常量数组中 [packages/shared/src/sessions/types.ts](packages/shared/src/sessions/types.ts#L22-L55)。序列化管道使用 \`pickSessionFields()\` 精确提取这些字段，因此添加新的持久化字段只需将其名称追加到该数组和 \`SessionConfig\` 接口中即可——序列化过程是自动的。

下表列出了主要的持久化字段分组：

字段分组

示例字段

用途

标识

\`id\`、\`workspaceRootPath\`、\`sdkSessionId\`、\`sdkCwd\`

唯一性与 SDK 绑定

时间戳

\`createdAt\`、\`lastUsedAt\`、\`lastMessageAt\`、\`archivedAt\`

时间排序与日期分组

展示

\`name\`、\`isFlagged\`、\`sessionStatus\`、\`labels\`、\`hidden\`

UI 呈现与工作流状态

阅读追踪

\`lastReadMessageId\`、\`hasUnread\`

未读徽章逻辑

配置

\`permissionMode\`、\`enabledSourceSlugs\`、\`workingDirectory\`、\`model\`、\`llmConnection\`、\`thinkingLevel\`

单会话行为覆盖

共享

\`sharedUrl\`、\`sharedId\`

查看者导出状态

分支

\`branchFromMessageId\`、\`branchFromSdkSessionId\`、\`branchFromSdkCwd\`、\`branchFromSdkTurnId\`

对话分叉元数据

传输

\`transferredSessionSummary\`、\`transferredSessionSummaryApplied\`

远程会话交接

自动化

\`triggeredBy\`

由自动化创建的会话

计划执行

\`pendingPlanExecution\`

接受与压缩流程状态

### 会话目录布局[](#会话目录布局)

每个会话存放在 \`{workspaceRoot}/sessions/{id}/\` 中，包含六个子目录，均由 [ensureSessionDir()](packages/shared/src/sessions/storage.ts#L86-L118) 提前创建：

Copy code

\`\`\`
sessions/260615-swift-river/
├── session.jsonl          ├── attachments/           # 文件附件
├── plans/                 # 安全模式计划文件（Markdown）
├── data/                  # transform_data 工具输出（JSON）
├── long_responses/        # 已摘要的工具结果（完整原始内容）
└── downloads/             # 从 API 来源下载的二进制文件（PDF、图片）
\`\`\`

## JSONL 持久化格式[](#jsonl-持久化格式)

### 结构[](#结构)

会话以 **JSON Lines** 格式存储，其中第一行是 \`SessionHeader\` 对象，后续所有行均为 \`StoredMessage\` 对象（每行一条消息） [packages/shared/src/sessions/jsonl.ts](packages/shared/src/sessions/jsonl.ts#L1-L13)。

\`SessionHeader\` 是 \`SessionConfig\` 的超集，包含额外的**预计算字段**，从而无需解析消息内容即可实现快速列表加载 [packages/shared/src/sessions/jsonl.ts](packages/shared/src/sessions/jsonl.ts#L172-L195)：

预计算字段

类型

用途

\`messageCount\`

\`number\`

会话中的消息总数

\`lastMessageRole\`

\`'user' | 'assistant' | 'plan' | 'tool' | 'error'\`

最后一条消息类型，用于 UI 徽章显示

\`preview\`

\`string\`

第一条用户消息的前 150 个字符

\`tokenUsage\`

\`SessionTokenUsage\`

累计的 Token/成本统计

\`lastFinalMessageId\`

\`string\`

最后一条非中间态的助手消息（用于未读检测）

### 路径可移植性[](#路径可移植性)

会话 JSONL 文件采用**路径令牌化系统**以确保跨机器兼容性。在写入前，绝对的会话目录路径会通过 [makeSessionPathPortable()](packages/shared/src/sessions/jsonl.ts#L17-L31) 替换为 \`{{SESSION_PATH}}\`。在读取时，[expandSessionPath()](packages/shared/src/sessions/jsonl.ts#L36-L40) 会反转此替换。这会影响嵌入在消息内容任何位置的路径——如计划路径、附件存储路径、数据表的 \`src\` 属性——从而确保打包文件在机器间移动时保持有效。

### 原子写入[](#原子写入)

同步的 [writeSessionJsonl()](packages/shared/src/sessions/jsonl.ts#L139-L157) 与异步持久化队列均采用**先写临时文件再重命名**的策略：内容首先写入 \`session.jsonl.tmp\`，随后删除原文件，最后将临时文件重命名覆盖原文件。若进程在写入中途崩溃，受损的仅是 \`.tmp\` 文件——原有的 \`session.jsonl\` 保持完好无损 [packages/shared/src/sessions/jsonl.ts](packages/shared/src/sessions/jsonl.ts#L148-L157)。

### 弹性解析[](#弹性解析)

[readSessionJsonl()](packages/shared/src/sessions/jsonl.ts#L82-L134) 函数采用弹性方式解析消息：解析失败的行（例如因崩溃导致截断）会被直接跳过，而不会导致整个会话加载失败。系统还提供了一条迁移路径，用于处理在添加 \`sdkCwd\` 字段之前创建的会话，此时会回退使用 \`workingDirectory\` \\[packages/shared/src/sessions/jsonl.ts#L123-L125)。

## 会话持久化队列[](#会话持久化队列)

快速连续的会话保存操作（例如在活跃流式传输期间）会被 \`SessionPersistenceQueue\` 类合并处理 [packages/shared/src/sessions/persistence-queue.ts](packages/shared/src/sessions/persistence-queue.ts#L1-L245)。该队列以 500ms 间隔对写入进行防抖，并串行化单会话的写入操作，以防止共享 \`.tmp\` 文件上出现竞态条件。

一个关键特性是**外部元数据保留**。队列会追踪会话元数据字段的签名（\`name\`、\`labels\`、\`isFlagged\`、\`sessionStatus\`、\`permissionMode\`、\`hasUnread\`、\`lastReadMessageId\`）。如果磁盘写入检测到自上次写入以来，另一个进程（例如监听器编辑或不同的 Electron 窗口）修改了元数据，队列会在写入前将磁盘上的元数据合并回本地 header。这防止了主线程覆盖在外部所做的元数据更改 [packages/shared/src/sessions/persistence-queue.ts](packages/shared/src/sessions/persistence-queue.ts#L90-L120)。

Syntax error in textmermaid version 11.6.0

## 会话生命周期与过滤[](#会话生命周期与过滤)

### 增删改查操作[](#增删改查操作)

会话存储层（[packages/shared/src/sessions/storage.ts](packages/shared/src/sessions/storage.ts#L200-L600)）提供了完整的生命周期管理：

操作

函数

备注

创建

\`createSession()\`

生成人类可读 ID，创建目录树，保存空会话

获取或创建

\`getOrCreateSessionById()\`

用于 \`--session <id>\` CLI 标志

加载

\`loadSession()\`

通过 \`readSessionJsonl()\` 读取完整 JSONL

保存

\`saveSession()\`

入队并通过持久化队列刷盘

列表

\`listSessions()\`

仅读取 JSONL header 以实现快速列表，按 \`lastUsedAt\` 降序排列

删除

\`deleteSession()\`

递归删除会话目录

清空

\`clearSessionMessages()\`

重置对话但保留元数据

最新

\`getOrCreateLatestSession()\`

返回最近的活跃会话或创建新会话

### 过滤与视图[](#过滤与视图)

会话可基于其状态和标志过滤为多种视图 [packages/shared/src/sessions/storage.ts](packages/shared/src/sessions/storage.ts#L660-L710)：

过滤函数

条件

\`listActiveSessions()\`

\`isArchived !== true\`

\`listArchivedSessions()\`

\`isArchived === true\`

\`listFlaggedSessions()\`

\`isFlagged === true\` 且处于活跃状态

\`listInboxSessions()\`

状态类别为 \`'open'\` 且处于活跃状态

\`listCompletedSessions()\`

状态类别为 \`'closed'\` 且处于活跃状态

会话状态通过 \`validateSessionStatus()\` 根据工作区特定的状态配置进行校验，如果存储的状态 ID 不再存在于工作区的状态配置中，则会回退到 \`'todo'\` [packages/shared/src/sessions/storage.ts](packages/shared/src/sessions/storage.ts#L408-L409)。

### 会话状态系统[](#会话状态系统)

会话状态是引用工作区级状态定义的**动态字符串**，而非固定的枚举。虽然存在内置 ID（\`todo\`、\`in-progress\`、\`needs-review\`、\`done\`、\`cancelled\`）作为 TypeScript 类型，但用户可以按工作区定义任意的自定义状态。\`getStatusCategory()\` 函数将每个状态分类为 \`'open'\` 或 \`'closed'\`，以此驱动 UI 中的收件箱与已完成分离逻辑 [packages/shared/src/sessions/storage.ts](packages/shared/src/sessions/storage.ts#L408)。

### 归档与保留[](#归档与保留)

归档会话通过 \`isArchived\` 和 \`archivedAt\` 标志进行软删除。保留策略函数 \`deleteOldArchivedSessions()\` 会永久删除超过可配置天数的归档会话 [packages/shared/src/sessions/storage.ts](packages/shared/src/sessions/storage.ts#L714-L730)。

## 会话分支与传输[](#会话分支与传输)

### 分支[](#分支)

会话支持一种**分支模型**，子会话可以从父会话中的特定消息处分叉。分支元数据包括：

字段

用途

\`branchFromMessageId\`

硬性上下文截断——模型不得包含此节点之后的父会话消息

\`branchFromSdkSessionId\`

父级的 SDK 会话 ID（适用于支持 SDK 级分叉的提供商策略）

\`branchFromSdkTurnId\`

提供商原生的分支锚点（Claude：用于 \`resumeSessionAt\` 的助手 UUID；Pi：会话条目 ID）

\`branchFromSessionPath\`

父级的存储路径（适用于需要父会话文件的提供商级分叉）

\`branchFromSdkCwd\`

父级的 \`sdkCwd\`（SDK 会话文件按 CWD 存储）

### 远程传输[](#远程传输)

会话可通过一次性摘要注入机制在服务器间传输。\`transferredSessionSummary\` 字段保存一个隐藏摘要，该摘要在远程传输后的首轮对话中被注入；而 \`transferredSessionSummaryApplied\` 则追踪此注入是否已发生，以防止重复 [packages/shared/src/sessions/types.ts](packages/shared/src/sessions/types.ts#L49-L52)。

## 会话打包（导出/导入）[](#会话打包导出导入)

\`SessionBundle\` 接口（[packages/shared/src/sessions/bundle.ts](packages/shared/src/sessions/bundle.ts#L1-L163)）是用于在工作区和服务器间传输会话的可移植序列化格式。打包文件是一个 JSON 信封，包含会话 header、完整的消息历史、所有会话目录文件（附件、计划、数据、下载）以及可选的分支元数据。

打包字段

类型

用途

\`version\`

\`1\`

格式版本，用于向前兼容

\`session.header\`

\`SessionHeader\`

会话元数据

\`session.messages\`

\`StoredMessage[]\`

完整的对话历史

\`files\`

\`BundleFile[]\`

所有的会话目录文件

\`branchInfo\`

\`BundleBranchInfo?\`

用于分叉操作的 SDK 分支数据

\`serializeSession()\` 函数读取 JSONL，收集所有会话文件（排除 \`session.jsonl\` 本身和 \`tmp/\` 目录），并根据 \`MAX_BUNDLE_SIZE_BYTES\` 验证总大小。\`DispatchMode\` 类型（\`'move'\` 或 \`'fork'\`）决定了导出后是否删除原始会话。

Syntax error in textmermaid version 11.6.0

## 会话工具与 MCP 集成[](#会话工具与-mcp-集成)

会话通过会话 MCP 服务器（[packages/session-mcp-server/src/index.ts](packages/session-mcp-server/src/index.ts#L1-L200)）暴露给 Agent 后端。这个独立的 MCP 服务器通过 stdio 传输，为 Codex Agent 提供会话作用域的工具（获取会话信息、列出会话、设置标签/状态、提交计划等）。它使用 \`__CALLBACK__\` 前缀，通过 stderr 上的结构化 JSON 回调消息与主 Electron 进程进行通信。

工具处理逻辑位于 \`@craft-agent/session-tools-core\`（[packages/session-tools-core/src/](packages/session-tools-core/src/)）中，该包定义了一个抽象的 \`SessionToolContext\` 接口（[packages/session-tools-core/src/context.ts](packages/session-tools-core/src/context.ts#L1-L200)）。Claude（进程内）和 Codex（子进程）环境对该上下文的实现方式各不相同：

上下文方面

Claude（进程内）

Codex（子进程）

文件系统

直接使用 Node.js \`fs\`

直接使用 Node.js \`fs\`

凭证

完整的钥匙串访问权限

凭证缓存文件（由主进程写入）

回调

直接函数调用

stderr 上的 JSON 消息

验证器

来自 \`@craft-agent/shared\` 的完整 Zod 验证器

简化的内置验证器

核心的会话作用域工具包括 \`get_session_info\`、\`list_sessions\`（支持按状态、标签、搜索词过滤及排序）、\`set_session_labels\`、\`set_session_status\` 和 \`submit_plan\` [packages/session-tools-core/src/handlers/](packages/session-tools-core/src/handlers/)。

## 类型系统：核心层与共享层[](#类型系统核心层与共享层)

系统刻意采用了**双层类型系统**。\`@craft-agent/core\` 包（[packages/core/src/types/session.ts](packages/core/src/types/session.ts#L1-L61)）定义了 RPC 安全的、面向客户端的类型（\`Session\`、\`StoredSession\`、\`SessionMetadata\`），并附带一个更简单的 \`SessionStatus\` 枚举。\`@craft-agent/shared\` 包（[packages/shared/src/sessions/types.ts](packages/shared/src/sessions/types.ts#L1-L366)）则定义了完整的服务端类型（\`SessionConfig\`、\`SessionHeader\`），包含更丰富的字段集，涵盖分支、传输、自动化和计划执行元数据。核心类型作为传输的 DTO 层；而共享类型则是持久化逻辑的权威来源。

## 后续步骤[](#后续步骤)

-   **[来源与技能](/lukilabs/craft-agents-oss/19-sources-and-skills)** —— 了解数据来源和自定义技能是如何在工作区的 \`sources/\` 和 \`skills/\` 目录中组织的。
-   **[OAuth 与凭证管理](/lukilabs/craft-agents-oss/20-oauth-and-credential-management)** —— 了解凭证是如何存储、缓存并提供给会话工具使用的。
-   **[会话工具核心](/lukilabs/craft-agents-oss/21-session-tools-core)** —— 深入了解作用于会话的工具处理系统。
-   **[自动化引擎](/lukilabs/craft-agents-oss/14-automation-engine)** —— 探索自动化如何通过 \`triggeredBy\` 元数据创建和管理会话。`;export{s as default};
