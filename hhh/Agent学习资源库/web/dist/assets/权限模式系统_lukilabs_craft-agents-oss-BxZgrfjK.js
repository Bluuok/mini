const n=`# 权限模式系统 | lukilabs/craft-agents-oss


---
权限模式系统是负责管控 craft-agent 发起的每一次工具调用、Shell 命令和 API 调用的安全守门人。它强制执行“Explore（探索）”、“Ask to Edit（编辑前询问）”和“Execute（执行）”三级信任模型，确保 Agent 能够安全地检查代码库，而不会发生意外的修改。该系统构建在分层配置架构之上，将应用级默认配置、工作区特定覆盖配置以及来源范围规则合并为每个会话单一运行时权限配置文件。

## 模式分类学[](#模式分类学)

系统定义了三种权限模式，在内部存储为 \`PermissionMode\` 字面量，但通过规范名称向用户展示。内部键与显示名称之间的二元性，既支持与旧版配置的向后兼容性，又向最终用户呈现了清晰的思维模型。

Syntax error in textmermaid version 11.6.0

位于 [mode-types.ts#L67-L79](packages/shared/src/agent/mode-types.ts#L67-L79) 的 \`parsePermissionMode()\` 函数同时接受规范值（如 \`explore\`、\`execute\`）和旧版别名（如 \`safe\`、\`allow-all\`、\`ask-to-edit\`）以保证向后兼容性，并在遇到无法识别的输入时返回 \`null\`。循环切换顺序在 [mode-types.ts#L34](packages/shared/src/agent/mode-types.ts#L34) 的 \`PERMISSION_MODE_ORDER\` 中定义为 \`['safe', 'ask', 'allow-all']\`，该顺序驱动着用于模式轮换的 SHIFT+TAB 键盘快捷键。

内部键

规范名称

显示名称

描述

SVG 图标

颜色类

\`safe\`

\`explore\`

**Explore**

只读探索。阻止写入操作，永不提示。

Compass (Lucide)

\`text-foreground/60\`

\`ask\`

\`ask\`

**Ask to Edit**

在进行编辑前提示。

Info (Lucide)

\`text-info\`

\`allow-all\`

\`execute\`

**Execute**

自动执行，无提示。

Repeat (Lucide)

\`text-accent\`

来源: [mode-types.ts](packages/shared/src/agent/mode-types.ts#L24-L34), [mode-types.ts](packages/shared/src/agent/mode-types.ts#L288-L340)

## 每会话状态管理[](#每会话状态管理)

位于 [mode-manager.ts#L230-L373](packages/shared/src/agent/mode-manager.ts#L230-L373) 的 \`ModeManager\` 类是一个单例，为每个会话维护独立的 \`ModeState\`——这里明确不存在全局状态。每个会话会跟踪其当前模式、先前模式（用于转换上下文）、一个单调递增的版本计数器、时间戳以及发起最后一次更改的执行者。

Syntax error in textmermaid version 11.6.0

位于 [mode-manager.ts#L85-L101](packages/shared/src/agent/mode-manager.ts#L85-L101) 的 \`ModeState\` 接口携带了丰富的转换元数据。\`lastChangedBy\` 字段——类型为 \`PermissionModeChangedBy = 'user' | 'system' | 'restore' | 'automation' | 'unknown'\`——标识了转换是源自键盘快捷键、自动化规则、会话恢复还是其他来源。\`lastUserSignalConsumedModeVersion\` 字段实现了一次性信号机制：当用户手动更改模式时，系统会在 [mode-manager.ts#L2150-L2156](packages/shared/src/agent/mode-manager.ts#L2150-L2156) 处将一个 \`modeChangeUserSignal\` 令牌注入到下一个 LLM 提示词中，该令牌在经过一轮对话后即被消耗，从而防止 Agent 反复响应过时的信号。

位于 [mode-manager.ts#L318-L333](packages/shared/src/agent/mode-manager.ts#L318-L333) 的 \`consumeUserModeSignal()\` 方法是一个空操作，除非最新的变更是由用户发起的，并且该信号尚未针对该模式版本被消耗。这可以防止 Agent 在多轮对话中永久回显模式更改通知。

响应式集成通过位于 [mode-manager.ts#L362-L372](packages/shared/src/agent/mode-manager.ts#L362-L372) 的 \`subscribe()\` 方法处理，该方法返回一个为 React 的 \`useSyncExternalStore\` 设计的取消订阅函数。位于 [mode-manager.ts#L107-L108](packages/shared/src/agent/mode-manager.ts#L107-L108) 的单独 \`onStateChange\` 回调则用于满足内部 CraftAgent 的同步需求。

来源: [mode-manager.ts](packages/shared/src/agent/mode-manager.ts#L83-L112), [mode-manager.ts](packages/shared/src/agent/mode-manager.ts#L230-L376)

## 工具授权逻辑[](#工具授权逻辑)

位于 [mode-manager.ts#L1803-L2070](packages/shared/src/agent/mode-manager.ts#L1803-L2070) 的 \`shouldAllowToolInMode()\` 函数是所有工具权限决策的**唯一事实来源**。它接受工具名称、输入载荷、当前权限模式以及一个可选的上下文对象（包含 plans/data 文件夹路径和用于工作区感知配置解析的 \`PermissionsContext\`）。

### 决策流[](#决策流)

Syntax error in textmermaid version 11.6.0

### 始终允许的工具[](#始终允许的工具)

位于 [mode-manager.ts#L1775-L1784](packages/shared/src/agent/mode-manager.ts#L1775-L1784) 的硬编码 \`Set\` 定义了本质上是只读且在所有模式下都能通过的工具：

-   **文件读取**：\`Read\`、\`Glob\`、\`Grep\`
-   **Agent 编排**：\`Task\`、\`TaskOutput\`
-   **Web 调研**：\`WebFetch\`、\`WebSearch\`
-   **任务追踪**：\`TodoWrite\`
-   **计划提交**：\`SubmitPlan\`
-   **语言服务器**：\`LSP\`
-   **浏览器自动化**：\`browser_tool\`

在 [mode-manager.ts#L1842-L1846](packages/shared/src/agent/mode-manager.ts#L1842-L1846) 处，匹配 \`mcp__*__<alwaysAllowedTool>\` 的 MCP 工具变体也会被透明地允许。

### Bash 命令验证[](#bash-命令验证)

在 Explore 模式下，Bash 命令会通过位于 [mode-manager.ts#L1083-L1233](packages/shared/src/agent/mode-manager.ts#L1083-L1233) 的 \`getBashRejectionReason()\` 接受多层验证。该函数会检查危险的控制字符、Shell 操作符（管道、重定向、命令替换）、参数扩展，并将命令与合并后权限配置中编译好的只读模式允许列表进行匹配。拒绝结果是一个位于 [mode-manager.ts#L645-L659](packages/shared/src/agent/mode-manager.ts#L645-L659) 的可辨识联合类型 \`BashRejectionReason\`，包含十多种特定类型——每种类型都通过位于 [mode-manager.ts#L1385-L1573](packages/shared/src/agent/mode-manager.ts#L1385-L1573) 的 \`formatBashRejectionMessage()\` 生成一条明确且可操作的错误消息。

当写入操作的目标是 plans 或 data 文件夹时，即使在 Explore 模式下，系统也会通过位于 [mode-manager.ts#L189-L224](packages/shared/src/agent/mode-manager.ts#L189-L224) 的 \`isPathWithinDirectory()\` 执行健壮的路径包含检查来允许该操作，这可以防止同缀名前缀绕过和符号链接逃逸。

### MCP 工具路由[](#mcp-工具路由)

位于 [mode-manager.ts#L2006-L2052](packages/shared/src/agent/mode-manager.ts#L2006-L2052) 的 MCP 工具遵循级联路由策略：

1.  **文档工具**（\`mcp__craft-agents-docs__*\`）——始终允许
2.  **会话工具**（\`mcp__session__*\`）——对照来自 session-tools-core 的 \`getSessionSafeAllowedToolNames()\` 进行检查
3.  **API 工具**（\`mcp__*__api_*\`）——对照端点规则（方法 + 路径正则表达式）进行验证
4.  **常规 MCP 工具**——对照合并配置中的 \`readOnlyMcpPatterns\` 进行检查

来源: [mode-manager.ts](packages/shared/src/agent/mode-manager.ts#L1772-L2070), [mode-manager.ts](packages/shared/src/agent/mode-manager.ts#L645-L659)

## 分层配置架构[](#分层配置架构)

权限通过三层累加合并来解析，由位于 [permissions-config.ts#L574-L935](packages/shared/src/agent/permissions-config.ts#L574-L935) 的 \`PermissionsConfigCache\` 实现。每一层都是扩展（而非覆盖）其下层。

Syntax error in textmermaid version 11.6.0

### 应用级默认配置[](#应用级默认配置)

在首次启动时，位于 [permissions-config.ts#L64-L124](packages/shared/src/agent/permissions-config.ts#L64-L124) 的 \`ensureDefaultPermissions()\` 会将附带的 \`default.json\` 复制到 \`~/.craft-agent/permissions/\` 中。在后续附带更新版本的启动中，它会通过位于 [permissions-config.ts#L130-L182](packages/shared/src/agent/permissions-config.ts#L130-L182) 的 \`migratePermissions()\` 执行累加迁移：保留现有的用户模式，追加新模式，并更新版本日期。损坏或丢失的文件会通过从附带文件重新复制来自动修复。

### 工作区与来源覆盖配置[](#工作区与来源覆盖配置)

工作区级权限位于项目根目录内的 \`.craft-agent/permissions.json\`。来源级权限位于 \`.craft-agent/sources/<slug>/permissions.json\`。两者都由 \`PermissionsConfigCache\` 延迟加载和缓存，并为 \`ConfigWatcher\` 提供失效钩子以支持实时编辑。

一个关键的设计细节：来源级的 MCP 模式在位于 [permissions-config.ts#L852-L915](packages/shared/src/agent/permissions-config.ts#L852-L915) 的 \`applySourceConfig()\` 中会被**自动限定作用域**。当某个来源定义了 \`allowedMcpPatterns: ["list"]\` 时，它在运行时会变成 \`mcp__<sourceSlug>__list\`，从而防止跨来源泄漏，即避免为某个集成设定的模式意外地将另一个集成的工具加入了白名单。

### PermissionsConfigFile 架构[](#permissionsconfigfile-架构)

位于 [mode-types.ts#L134-L151](packages/shared/src/agent/mode-types.ts#L134-L151) 的经 Zod 验证的 JSON 架构定义了六个配置键：

字段

类型

用途

\`version\`

\`string?\`

用于迁移跟踪的 ISO 日期（例如 \`"2026-02-07"\`）

\`allowedBashPatterns\`

\`(string | {pattern, comment?})[]?\`

只读 Bash 命令的正则表达式模式

\`allowedMcpPatterns\`

\`(string | {pattern, comment?})[]?\`

只读 MCP 工具的正则表达式模式

\`allowedApiEndpoints\`

\`{method, path, comment?}[]?\`

API 调用规则的方法 + 路径正则表达式

\`allowedWritePaths\`

\`(string | {pattern, comment?})[]?\`

Explore 模式下可写入路径的 Glob 模式

\`blockedTools\`

\`(string | {pattern, comment?})[]?\`

在硬编码集合之外要额外阻止的工具

\`blockedCommandHints\`

\`{command, reason, context?, tryInstead?, example?, whenNotMatching?}[]?\`

当特定命令被阻止时显示的详细提示

\`permissions.json\` 中的 \`blockedTools\` 字段扩展了硬编码阻止列表，但不能从中移除工具。四个基本的写入工具——\`Write\`、\`Edit\`、\`MultiEdit\`、\`NotebookEdit\`——在 Explore 模式下始终被阻止，无论配置如何，正如 [mode-types.ts#L266-L274](packages/shared/src/agent/mode-types.ts#L266-L274) 处的 \`SAFE_MODE_CONFIG\` 所述。

来源: [permissions-config.ts](packages/shared/src/agent/permissions-config.ts#L236-L270), [mode-types.ts](packages/shared/src/agent/mode-types.ts#L134-L151)

## 会话状态注入[](#会话状态注入)

位于 [mode-manager.ts#L2130-L2170](packages/shared/src/agent/mode-manager.ts#L2130-L2170) 的 \`formatSessionState()\` 函数将当前权限状态序列化为一个轻量级 XML 块，该块会被注入到发送给 LLM 的用户消息中。这使得 Agent 能够实时感知其权限约束，而无需进行额外的 API 调用。

注入的块包含规范模式名称、转换历史、最后一次更改的执行者和时间戳，并且——如果用户在当前轮次手动更改了模式——还会包含一个 \`modeChangeUserSignal\` 指令，指示 Agent 立即遵守新模式。Plans 和 data 文件夹路径始终会被包含在内，以便 Agent 知道即使在 Explore 模式下它可以在哪里安全地进行写入。

来源: [mode-manager.ts](packages/shared/src/agent/mode-manager.ts#L2126-L2171)

## 继续阅读[](#继续阅读)

-   **[MCP 客户端池](/lukilabs/craft-agents-oss/12-mcp-client-pool)** —— 了解 MCP 工具连接是如何池化的，以及来源范围的权限如何与工具路由交互
-   **[自动化引擎](/lukilabs/craft-agents-oss/14-automation-engine)** —— 了解自动化如何通过 \`'automation'\` 更改执行者以编程方式更改权限模式
-   **[会话工具核心](/lukilabs/craft-agents-oss/21-session-tools-core)** —— 探索权限系统用于 \`mcp__session__*\` 工具检查的会话范围工具允许列表`;export{n as default};
