const n=`# 自动化引擎 | lukilabs/craft-agents-oss


---
自动化引擎是 Craft Agent 的事件驱动神经系统，负责将工作区和 Agent 生命周期事件转换为声明式操作。它从工作区根目录的 \`automations.json\` 中读取规则，根据实时事件流进行评估，并分发**提示词操作**（生成新的 Agent 会话）或 **Webhook 操作**（向外部端点发起 HTTP 请求）。整个子系统位于 \`packages/shared/src/automations/\` 目录下，由单一的统一入口类 \`AutomationSystem\` 进行编排。

来源：[automation-system.ts](packages/shared/src/automations/automation-system.ts#L65-L65)、[constants.ts](packages/shared/src/automations/constants.ts#L1-L21)

## 架构概览[](#架构概览)

该引擎遵循**发布/订阅架构**，在事件发射、匹配和操作执行之间有着清晰的职责分离。三个可插拔的处理器——\`PromptHandler\`、\`WebhookHandler\` 和 \`EventLogHandler\`——订阅了特定于工作区的 \`WorkspaceEventBus\`，并独立处理事件。配置在构建时加载一次，并支持通过 \`reloadConfig()\` 进行热重载。

Syntax error in textmermaid version 11.6.0

来源：[automation-system.ts](packages/shared/src/automations/automation-system.ts#L243-L276)、[event-bus.ts](packages/shared/src/automations/event-bus.ts#L138-L156)

## 事件分类[](#事件分类)

事件被划分为两个独立的通道，分别由系统的不同部分处理。**应用事件**源自 Craft 应用本身（工作区级别的状态变更），而 **Agent 事件**则由底层 LLM SDK 在 Agent 执行期间发射。类型系统通过分离的联合类型和专用的 Payload 结构来强制执行这种拆分。

类别

事件

Payload 类型

来源

应用

\`LabelAdd\`

\`LabelEventPayload\`

会话元数据差异比对

应用

\`LabelRemove\`

\`LabelEventPayload\`

会话元数据差异比对

应用

\`LabelConfigChange\`

\`LabelConfigChangePayload\`

标签配置文件变更

应用

\`PermissionModeChange\`

\`PermissionModeChangePayload\`

会话元数据差异比对

应用

\`FlagChange\`

\`FlagChangePayload\`

会话元数据差异比对

应用

\`SessionStatusChange\`

\`SessionStatusChangePayload\`

会话元数据差异比对

应用

\`SchedulerTick\`

\`SchedulerTickPayload\`

\`SchedulerService\` 定时器

Agent

\`PreToolUse\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`PostToolUse\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`PostToolUseFailure\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`Stop\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`SessionStart\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`SessionEnd\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`UserPromptSubmit\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`PermissionRequest\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`SubagentStart\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`SubagentStop\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`PreCompact\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`Notification\`

\`GenericEventPayload\`

Claude SDK 钩子

Agent

\`Setup\`

\`GenericEventPayload\`

Claude SDK 钩子

\`EventPayloadMap\` 接口提供了编译时的类型安全保证：每个事件键映射到其特定的 Payload 结构体，且 \`EventHandler<T>\` 泛型确保处理器接收到类型正确的参数 [event-bus.ts](packages/shared/src/automations/event-bus.ts#L78-L102)。

来源：[types.ts](packages/shared/src/automations/types.ts#L13-L55)、[event-bus.ts](packages/shared/src/automations/event-bus.ts#L25-L102)

## 匹配器配置[](#匹配器配置)

每条自动化规则都是一个绑定到特定事件键的 \`AutomationMatcher\`。匹配流水线包含三个顺序关卡：**启用检查**、**模式匹配**（正则或 cron）以及**条件评估**。这三者必须全部通过，才会执行任何操作。

TYPESCRIPT

Copy code

\`\`\`
interface AutomationMatcher {
  id?: string;           // 6字符十六进制，加载时自动回填
  name?: string;         // 显示名称（若省略则取自第一个操作）
  matcher?: string;      // 用于事件数据匹配的正则表达式
  cron?: string;         // 5段式 cron 表达式（仅限 SchedulerTick）
  timezone?: string;     // 用于 cron/时间条件的 IANA 时区
  permissionMode?: PermissionMode;
  labels?: string[];
  enabled?: boolean;     // 默认为 true
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
}
\`\`\`

匹配器评估流水线集中在 \`matcherMatchesWithContext()\` 中，所有入口（应用事件、SDK Agent 事件）都必须经过此路由。这确保了条件门控不会被意外绕过 [utils.ts](packages/shared/src/automations/utils.ts#L164-L183)。\`enabled\` 标志检查和正则/cron 匹配发生在私有的 \`matchesBasePredicate()\` 函数中 [utils.ts](packages/shared/src/automations/utils.ts#L151-L162)。

对于 \`SchedulerTick\` 事件，系统会忽略 \`matcher\` 字段，转而通过 \`croner\` 库评估 \`cron\` 表达式。所有其他事件则使用 \`matcher\` 正则字段，与通过 \`getMatchValue()\` 提取的事件特定值进行匹配 [utils.ts](packages/shared/src/automations/utils.ts#L87-L134)。

来源：[types.ts](packages/shared/src/automations/types.ts#L145-L166)、[utils.ts](packages/shared/src/automations/utils.ts#L136-L183)、[cron-matcher.ts](packages/shared/src/automations/cron-matcher.ts#L25-L58)

## 条件系统[](#条件系统)

条件在模式匹配之后提供了一层辅助过滤。它们支持三种原语——**时间**、**状态**和**逻辑组合**——并且最多可嵌套至深度 7（上限为 8）。当嵌套深度超过 4 时，系统会发出警告。

### 条件原语[](#条件原语)

**时间条件**通过挂钟时间和星期几来对自动化进行门控。它们支持 HH:MM 格式的 \`after\`/\`before\`、三个字母的小写星期名称（\`mon\` 到 \`sun\`），以及 IANA 时区。时区配置会从条件本身逐级向下级联至匹配器的时区，最终回退到系统本地时间 [conditions.ts](packages/shared/src/automations/conditions.ts#L92-L170)。

**状态条件**用于检查事件 Payload 字段。它们支持精确的 \`value\` 匹配、\`from\`/\`to\` 状态转换检测（针对同时包含新旧值的 \`PermissionModeChange\` 和 \`SessionStatusChange\` 事件）、用于数组包含判断的 \`contains\`，以及用于取反的 \`not_value\`。\`TRANSITION_FIELDS\` 映射会将用户可见的字段名（如 \`permissionMode\`）转换为实际的 Payload 键值对（\`oldMode\`/\`newMode\`）[conditions.ts](packages/shared/src/automations/conditions.ts#L25-L31)、[conditions.ts](packages/shared/src/automations/conditions.ts#L172-L215)。

**逻辑条件**使用 \`and\`、\`or\` 和 \`not\` 运算符组合其他条件，从而在深度限制内构建任意复杂的布尔表达式 [conditions.ts](packages/shared/src/automations/conditions.ts#L217-L243)。

顶层条件采用隐式的 AND 语义进行评估——只有当每个条件都通过，或者条件数组为空/未定义时，\`evaluateConditions()\` 函数才会返回 \`true\` [conditions.ts](packages/shared/src/automations/conditions.ts#L57-L67)。

来源：[conditions.ts](packages/shared/src/automations/conditions.ts#L39-L67)、[conditions-constants.ts](packages/shared/src/automations/conditions-constants.ts#L1-L11)、[types.ts](packages/shared/src/automations/types.ts#L102-L139)

## 操作类型[](#操作类型)

### 提示词操作[](#提示词操作)

提示词操作通过将提示词加入执行队列来创建新的 Agent 会话。\`PromptHandler\` 处理匹配的自动化规则，使用基于事件 Payload 构建的 \`CRAFT_*\` 环境变量命名空间来扩展 \`$VARIABLE\` 引用，解析用于来源和技能引用的 \`@mentions\`，并通过 \`onPromptsReady\` 回调发射 \`PendingPrompt\` 对象 [handlers/prompt-handler.ts](packages/shared/src/automations/handlers/prompt-handler.ts#L22-L131)。

每个 \`PendingPrompt\` 都携带创建会话所需的元数据：\`permissionMode\`、\`labels\`、\`llmConnection\` 和 \`model\` 均从匹配器配置中转发而来 [types.ts](packages/shared/src/automations/types.ts#L217-L239)。扩展后的提示词和解析出的提及（\`@name\` 引用）也会被包含在内，以便下游进行解析 [types.ts](packages/shared/src/automations/types.ts#L185-L193)。

### Webhook 操作[](#webhook-操作)

Webhook 操作向外部端点分发 HTTP 请求，支持配置请求方法、请求头、请求体和身份验证。\`WebhookHandler\` 管理完整的生命周期，包括 URL 和请求体中的环境变量扩展、带有指数退避的即时重试、端点级别的速率限制（每个来源每分钟 30 个请求），以及通过 \`RetryScheduler\` 进行的延迟重试调度 [handlers/webhook-handler.ts](packages/shared/src/automations/handlers/webhook-handler.ts#L45-L274)。

可选择捕获 Webhook 响应（\`captureResponse: true\`），截断至 4KB 后存储在历史文件中 [types.ts](packages/shared/src/automations/types.ts#L78-L94)。

来源：[types.ts](packages/shared/src/automations/types.ts#L57-L96)、[handlers/prompt-handler.ts](packages/shared/src/automations/handlers/prompt-handler.ts#L22-L131)、[handlers/webhook-handler.ts](packages/shared/src/automations/handlers/webhook-handler.ts#L107-L274)

## 事件总线[](#事件总线)

\`WorkspaceEventBus\` 是核心的发布/订阅机制，作用域限定于单个工作区。它为特定事件提供了类型安全的 \`emit\`/\`on\`/\`off\` 方法，同时还提供 \`onAny\`/\`offAny\` 用于处理日志记录等横切关注点。处理器的调用是并行执行的（使用 \`Promise.allSettled\`），错误会被单独捕获和记录——任何单个处理器的失败都不会干扰其他处理器 [event-bus.ts](packages/shared/src/automations/event-bus.ts#L162-L320)。

速率限制内置于总线层：通过 60 秒的滑动窗口，将大多数事件的吞吐量限制在每分钟 10 个事件，而 \`SchedulerTick\` 则为每分钟 60 个 [event-bus.ts](packages/shared/src/automations/event-bus.ts#L121-L159)。

来源：[event-bus.ts](packages/shared/src/automations/event-bus.ts#L162-L320)

## 会话元数据差异比对[](#会话元数据差异比对)

\`AutomationSystem\` 维护了一个内存中的 \`Map<string, SessionMetadataSnapshot>\`，用于跟踪每个会话的最近已知状态。当调用 \`updateSessionMetadata()\` 时，它会针对存储的快照执行逐字段的差异比对，并发射相应的应用事件——\`PermissionModeChange\`、\`LabelAdd\`/\`LabelRemove\`、\`FlagChange\` 或 \`SessionStatusChange\` [automation-system.ts](packages/shared/src/automations/automation-system.ts#L330-L418)。

此机制最初是从 \`SessionManager\` 中剥离出来的，目的是将会话生命周期管理与自动化事件生成解耦。现有的会话通过 \`setInitialSessionMetadata()\` 进行初始化而不会发射事件，从而防止在工作区加载时触发虚假操作 [automation-system.ts](packages/shared/src/automations/automation-system.ts#L447-L453)。

来源：[automation-system.ts](packages/shared/src/automations/automation-system.ts#L330-L453)、[types.ts](packages/shared/src/automations/types.ts#L312-L324)

## 配置与校验[](#配置与校验)

位于工作区根目录的配置文件 \`automations.json\` 遵循基于 Zod 校验的 Schema（\`AutomationsConfigSchema\`）。Schema 校验负责处理结构正确性（必填字段、类型、正则表达式模式），而次要的语义校验环节则会检查跨字段约束（例如 \`from\`/\`to\` 需要转换事件），并根据工作区的实际配置验证标签 ID 和 LLM 连接标识 [schemas.ts](packages/shared/src/automations/schemas.ts#L16-L207)、[validation.ts](packages/shared/src/automations/validation.ts#L53-L181)。

已弃用的事件名称别名在解析时会被静默重写为标准形式，并伴随一个 \`console.warn()\` [schemas.ts](packages/shared/src/automations/schemas.ts#L149-L155)。缺失的匹配器 ID 会在首次加载时自动回填为 6 字符的十六进制字符串，并写回磁盘 [automation-system.ts](packages/shared/src/automations/automation-system.ts#L174-L200)。

\`validateAutomationsContent()\` 函数接受原始 JSON 字符串而无需进行磁盘 I/O，这使得 PreToolUse 自动化可以在将配置写入 \`automations.json\` 之前安全地对其进行校验。这可以防止系统因用户的错误编辑而进入无效状态 [validation.ts](packages/shared/src/automations/validation.ts#L182-L263)。

来源：[schemas.ts](packages/shared/src/automations/schemas.ts#L16-L207)、[validation.ts](packages/shared/src/automations/validation.ts#L26-L547)、[automation-system.ts](packages/shared/src/automations/automation-system.ts#L101-L200)

## 历史记录与重试基础设施[](#历史记录与重试基础设施)

工作区根目录下的三个持久化文件管理着自动化的生命周期：

文件

格式

用途

\`automations.json\`

JSON

声明式自动化规则

\`automations-history.jsonl\`

JSONL

执行审计日志

\`automations-retry-queue.jsonl\`

JSONL

持久化的 Webhook 重试队列

历史记录存储采用**双层保留**策略：每个匹配器 ID 最多保留 20 条记录（\`AUTOMATION_HISTORY_MAX_RUNS_PER_MATCHER\`），全局最多保留 1000 条记录（\`AUTOMATION_HISTORY_MAX_ENTRIES\`）。启动时的压缩操作在任何异步追加之前，于主线程上同步运行，从而消除了竞态条件 [history-store.ts](packages/shared/src/automations/history-store.ts#L57-L205)。运行时压缩则通过内存计数器在每追加 100 条记录后触发。

\`RetryScheduler\` 为在即时指数退避尝试后失败的 Webhook 提供**延迟重试**机制。它将失败的 Webhook 操作（连同已扩展的 URL 和已预解析的环境变量）持久化到 \`automations-retry-queue.jsonl\` 中，然后以 60 秒的间隔处理该队列。重试延迟遵循固定的时间表：5 分钟、30 分钟和 1 小时，最多进行 3 次延迟重试 [retry-scheduler.ts](packages/shared/src/automations/retry-scheduler.ts#L25-L248)。

Webhook URL 在记录日志时会通过 \`redactUrl()\` 进行脱敏处理，该函数会保留协议和主机名，但会截断过长的路径。这可以防止密钥（例如 URL 中的 Slack Webhook 令牌）泄漏到日志和历史文件中 [webhook-utils.ts](packages/shared/src/automations/webhook-utils.ts#L17-L28)。

来源：[constants.ts](packages/shared/src/automations/constants.ts#L1-L21)、[history-store.ts](packages/shared/src/automations/history-store.ts#L57-L205)、[retry-scheduler.ts](packages/shared/src/automations/retry-scheduler.ts#L25-L248)

## RPC 集成[](#rpc-集成)

server-core 层通过注册在 \`HANDLED_CHANNELS\` 下的 RPC 处理器暴露了自动化管理功能。这使得 UI 能够对自动化匹配器执行 CRUD 操作，并与执行历史记录进行交互。每个工作区的互斥锁防止并发的 IPC 调用在写入 \`automations.json\` 时互相覆盖 [automations.ts](packages/server-core/src/handlers/rpc/automations.ts#L16-L17)。

RPC 通道包括 \`GET\`、\`TEST\`、\`SET_ENABLED\`、\`DUPLICATE\`、\`DELETE\`、\`GET_HISTORY\`、\`GET_LAST_EXECUTED\` 和 \`REPLAY\`，涵盖了从检查到执行回放的完整自动化管理生命周期 [automations.ts](packages/server-core/src/handlers/rpc/automations.ts#L57-L68)。

来源：[automations.ts](packages/server-core/src/handlers/rpc/automations.ts#L57-L68)

## 安全模型[](#安全模型)

自动化引擎在输入安全方面执行多层防护。Shell 注入防护由 \`sanitizeForShell()\` 处理，该函数会转义用于 Shell 执行环境的值 [security.ts](packages/shared/src/automations/security.ts#L19-L31)。通过 \`expandEnvVars()\` 进行的环境变量扩展仅针对受控的 \`CRAFT_*\` 命名空间替换 \`$VAR\` 模式，而不会使用原始的 \`process.env\` [utils.ts](packages/shared/src/automations/utils.ts#L37-L57)。Webhook URL 在 Schema 层面进行校验，以强制使用 \`http:\` 或 \`https:\` 协议（基于环境变量的模板则推迟到运行时扩展之后再进行校验）[schemas.ts](packages/shared/src/automations/schemas.ts#L23-L56)。

\`buildEnvFromPayload()\` 函数会对用户控制的 Payload 字段进行 Shell 安全净化，同时保留结构化元数据字段不作转义，以便在 JSON 上下文中使用 [utils.ts](packages/shared/src/automations/utils.ts#L264-L300)。

来源：[security.ts](packages/shared/src/automations/security.ts#L19-L31)、[utils.ts](packages/shared/src/automations/utils.ts#L37-L300)、[schemas.ts](packages/shared/src/automations/schemas.ts#L23-L56)

## 生命周期管理[](#生命周期管理)

\`AutomationSystem\` 构造函数执行同步的引导序列：加载并校验配置、回填缺失的 ID、创建并订阅所有三个处理器、压缩历史记录，以及可选地启动调度器。销毁过程则按相反顺序进行——停止调度器、销毁处理器、排空事件总线并清除元数据映射 [automation-system.ts](packages/shared/src/automations/automation-system.ts#L79-L103)、[automation-system.ts](packages/shared/src/automations/automation-system.ts#L541-L564)。

\`SchedulerService\`（在启用 \`enableScheduler\` 时使用）在每分钟的最开始发射 \`SchedulerTick\` 事件，为基于 cron 的自动化提供时间骨架 [scheduler-service.ts](packages/shared/src/scheduler/scheduler-service.ts#L23-L88)。

来源：[automation-system.ts](packages/shared/src/automations/automation-system.ts#L79-L103)、[scheduler-service.ts](packages/shared/src/scheduler/scheduler-service.ts#L23-L88)

* * *

**后续步骤**：关于接入此引擎的 Agent 侧事件钩子，请参阅 [ClaudeAgent SDK Integration](/lukilabs/craft-agents-oss/10-claudeagent-sdk-integration) 。要了解会话的管理方式以及元数据差异比对如何与更广泛的会话生命周期相连接，请参阅 [Session and Workspace Model](/lukilabs/craft-agents-oss/18-session-and-workspace-model) 。关于提示词操作可能调用的 MCP 工具基础设施，请参阅 [MCP Client Pool](/lukilabs/craft-agents-oss/12-mcp-client-pool) 。`;export{n as default};
