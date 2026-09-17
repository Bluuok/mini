const n=`# 会话工具核心 | lukilabs/craft-agents-oss


---
\`session-tools-core\` 包是 Craft Agent 中所有 agent 会话工具的**标准工具注册表**。它是工具定义、Zod 输入模式、处理程序实现以及运行时安全策略的唯一真实来源——供每个 agent 后端（Claude、Pi/Codex 和 session-mcp-server）以相同的方式消费。该包并非让每个后端独立重新实现工具逻辑，而是提供了一个统一的 \`SessionToolContext\` 接口供后端实现，同时核心层提供共享的处理程序代码和沙箱执行环境。

## 架构概览[](#架构概览)

该包遵循分层架构，工具定义位于顶层，处理程序构成执行核心，运行时安全子系统为脚本执行提供强制隔离。每个工具都被定义为一个声明式记录，结合了其 Zod 模式、面向 LLM 的描述、执行模式、安全模式策略以及可选的处理程序函数。

Syntax error in textmermaid version 11.6.0

来源：[index.ts](packages/session-tools-core/src/index.ts#L1-L240)、[tool-defs.ts](packages/session-tools-core/src/tool-defs.ts#L1-L657)

## 工具注册表与执行模式[](#工具注册表与执行模式)

每个会话工具都在 [tool-defs.ts](packages/session-tools-core/src/tool-defs.ts#L482-L508) 的 \`SESSION_TOOL_DEFS\` 数组中声明。每个条目都是一个 \`SessionToolDef\` 可辨识联合体，包含两个变体：\`RegistrySessionToolDef\`（在此包中具有具体处理程序的工具）和 \`BackendSessionToolDef\`（执行被委托给特定后端适配器的工具）。这种拆分确保了需要平台特定能力的工具——例如需要 Electron 的 \`BrowserPaneManager\` 的 \`browser_tool\`，或需要直接访问 SDK 的 \`call_llm\`——与后端无关的工具保持清晰的分离。

\`executionMode\` 字段控制调度路由，而 \`safeMode\` 则控制工具在 Explore/Safe 权限模式下的可用性。\`readOnly\` 标志（存在于某些工具上）可在支持该特性的后端中启用并行执行。

属性

类型

用途

\`executionMode\`

\`'registry' | 'backend'\`

处理程序位于此包中还是后端适配器中

\`safeMode\`

\`'allow' | 'block'\`

工具在 Explore/Safe 模式下是否可用

\`readOnly\`

\`boolean?\`

若为 \`true\`，则启用并行执行优化

\`handler\`

\`SessionToolHandler | null\`

注册表工具的具体处理程序；后端工具则为 \`null\`

来源：[tool-defs.ts](packages/session-tools-core/src/tool-defs.ts#L453-L476)、[tool-defs.ts](packages/session-tools-core/src/tool-defs.ts#L482-L508)

## 完整工具目录[](#完整工具目录)

注册表在六个功能类别中定义了 **22 个工具**。注册表工具（带处理程序）占主导地位，有 19 个；而 3 个后端工具在此处声明仅用于名称预留和安全模式控制，其实际执行在其他地方。

### 规划与验证工具[](#规划与验证工具)

工具名称

安全模式

只读

用途

\`SubmitPlan\`

allow

—

提交计划 markdown 文件供用户审查；暂停执行

\`config_validate\`

allow

✓

验证工作区配置文件（config、sources、statuses、permissions 等）

\`skill_validate\`

allow

✓

验证技能的 SKILL.md 前置元数据与内容

\`mermaid_validate\`

allow

✓

在渲染前验证 Mermaid 图表语法

### 来源与认证工具[](#来源与认证工具)

工具名称

安全模式

只读

用途

\`source_test\`

allow

—

对来源进行模式验证、图标处理和连接测试

\`source_oauth_trigger\`

block

—

为 MCP 来源发起 OAuth 2.0 + PKCE

\`source_google_oauth_trigger\`

block

—

触发 Google OAuth（Gmail、Calendar、Drive 等）

\`source_slack_oauth_trigger\`

block

—

触发 Slack OAuth 认证

\`source_microsoft_oauth_trigger\`

block

—

触发 Microsoft OAuth（Outlook、OneDrive、Teams 等）

\`source_credential_prompt\`

block

—

提示用户输入 API 密钥、Bearer 令牌、基本认证信息

所有 OAuth 和凭证工具在安全模式下均**被阻止**，因为它们会触发面向用户的认证流程并更改来源状态——这些操作绝不应在未经用户明确同意的情况下进行。

### 数据处理工具[](#数据处理工具)

工具名称

安全模式

只读

用途

\`transform_data\`

allow

—

运行数据转换脚本（Python/Node/Bun），超时时间为 30 秒

\`script_sandbox\`

allow

—

在完全沙箱化的子进程中执行内联脚本

\`render_template\`

allow

—

使用 Mustache 语法渲染来源 HTML 模板

### 会话自我管理工具[](#会话自我管理工具)

工具名称

安全模式

只读

用途

\`set_session_labels\`

block

—

使用标签标记会话（触发自动化）

\`set_session_status\`

block

—

设置会话状态（触发基于状态的自动化）

\`get_session_info\`

allow

✓

内省当前会话元数据

\`list_sessions\`

allow

✓

带过滤器的分页会话列表

### 仅限后端的工具（仅声明，不处理）[](#仅限后端的工具仅声明不处理)

工具名称

安全模式

用途

\`call_llm\`

allow

用于子任务的辅助 LLM 调用

\`spawn_session\`

block

创建独立的并行会话

\`browser_tool\`

allow

浏览器自动化（需要 Electron）

来源：[tool-defs.ts](packages/session-tools-core/src/tool-defs.ts#L200-L438)、[tool-defs.ts](packages/session-tools-core/src/tool-defs.ts#L482-L508)

## SessionToolContext 接口[](#sessiontoolcontext-接口)

\`SessionToolContext\` 是此包与其消费者之间的**依赖注入边界**。处理程序不会导入后端特定的模块，而是接收一个上下文对象，该对象通过基于接口的契约精确暴露其所需的能力。这种设计允许 Claude、Pi 和 session-mcp-server 各自提供自己的文件系统访问、凭证管理、验证、图标下载、MCP 连接测试以及会话生命周期操作的实现。

上下文被组织成边界清晰的能力分区：

Syntax error in textmermaid version 11.6.0

两个具体的回调类型——\`onPlanSubmitted\` 和 \`onAuthRequest\`——充当**与传输无关的 IPC 钩子**。Claude 将它们作为直接函数调用，而 Codex 则将它们作为 \`__CALLBACK__\` JSON 消息通过 stderr 序列化，从而确保相同的处理程序逻辑可以在根本不同的进程通信模型中运行。

来源：[context.ts](packages/session-tools-core/src/context.ts#L151-L346)、[context.ts](packages/session-tools-core/src/context.ts#L45-L63)

## 运行时安全子系统[](#运行时安全子系统)

\`runtime/\` 目录为脚本执行实现了**强制多层沙箱**。\`script_sandbox\` 和 \`transform_data\` 都将其子进程执行路由到此子系统，关键是，如果当前平台无法强制执行网络或文件系统隔离，\`script_sandbox\` 将**拒绝执行**。这种“默认拒绝”的设计意味着在不支持的平台上，脚本执行将直接不可用，而不是在无沙箱的情况下运行。

### 隔离层[](#隔离层)

层级

模块

macOS 后端

Linux 后端

用途

**网络隔离**

\`network-isolation.ts\`

\`sandbox-exec\` (拒绝网络\\*)

\`unshare -n\` (首选)、\`firejail --net=none\`

阻止出站网络访问

**文件系统隔离**

\`filesystem-isolation.ts\`

\`sandbox-exec\` (基于配置文件)

\`bwrap\` (首选)、\`firejail private/whitelist\`

将写入限制在会话目录内

**路径安全**

\`path-security.ts\`

不适用 (跨平台)

不适用 (跨平台)

感知符号链接的 containment 检查

**环境净化**

\`sandbox-env.ts\`

不适用 (跨平台)

不适用 (跨平台)

剥离凭证环境变量，重定向缓存

**运行时解析**

\`resolve-script-runtime.ts\`

uv (捆绑/环境)、node、bun

uv (捆绑/环境)、node、bun

定位安全的脚本解释器

在 macOS 上，文件系统和网络限制被**组合到单个 sandbox-exec 配置文件中**，以避免嵌套 sandbox-exec 封装失败。在 Linux 上，这两层是按顺序应用的——首先是 \`unshare -n\` 用于网络隔离，然后是 \`bwrap\` 用于文件系统隔离。每一层都会返回一个包含 \`status: 'enforced' | 'unavailable'\` 的计划对象，处理程序在继续之前会检查这两者。

来源：[filesystem-isolation.ts](packages/session-tools-core/src/runtime/filesystem-isolation.ts#L69-L125)、[network-isolation.ts](packages/session-tools-core/src/runtime/network-isolation.ts#L44-L81)、[path-security.ts](packages/session-tools-core/src/runtime/path-security.ts#L22-L67)

### 路径安全[](#路径安全)

\`path-security.ts\` 模块提供了两个超出简单字符串前缀匹配的 containment 检查函数。\`isPathWithinDirectory\` 执行词法规范化和 \`realpath\` 解析，以防止符号链接逃逸——攻击者无法在会话目录内创建指向其外部的符号链接。\`isPathWithinDirectoryForCreation\` 通过验证最近的现有祖先目录的真实路径，将此功能扩展到输出路径，从而处理目标路径本身尚不存在的情况。

来源：[path-security.ts](packages/session-tools-core/src/runtime/path-security.ts#L22-L67)

### 环境净化[](#环境净化)

\`sandbox-env.ts\` 模块维护了一个敏感环境变量黑名单（\`BLOCKED_ENV_VARS\`），其中包括来自 Anthropic、AWS、GitHub、OpenAI、Google、Stripe 和 npm 的 API 密钥。这些变量会从所有子进程环境中被剥离。此外，\`createScriptRuntimeEnv\` 会将 Python/uv 缓存从主目录默认位置（例如 \`~/.cache/uv\`）重定向到会话的可写数据目录中，从而确保即使在主目录为只读或不存在的情况下也能可靠执行。

来源：[sandbox-env.ts](packages/session-tools-core/src/runtime/sandbox-env.ts#L13-L80)

### 脚本运行时解析[](#脚本运行时解析)

\`resolveScriptRuntime\` 函数通过三层策略定位解释器：首先是捆绑的二进制文件（适用于打包的 Electron 应用），然后是环境提供的二进制文件（通过 PATH），最后是显式的 PATH 回退。在打包模式下，默认阻止基于 PATH 的发现，以防止执行不受信任的系统解释器。该函数通过 \`uv run python\` 解析 \`python3\`，直接解析 \`node\`，并直接解析 \`bun\`，同时返回命令和任何必需的前缀参数。

来源：[resolve-script-runtime.ts](packages/session-tools-core/src/runtime/resolve-script-runtime.ts#L158-L256)

\`script_sandbox\` 处理程序在 macOS 上的隔离组合方式与 Linux 不同：在 macOS 上，**单个** \`sandbox-exec\` 配置文件同时承载文件系统和网络限制。在 Linux 上，则按顺序应用两个独立的封装器（先是 \`unshare -n\`，然后是 \`bwrap\`）。这种差异的存在是因为 macOS 的 \`sandbox-exec\` 无法嵌套，因此尝试单独使用网络和文件系统封装器会静默失败。

## 处理程序实现[](#处理程序实现)

每个处理程序遵循相同的签名 \`(ctx: SessionToolContext, args: T) => Promise<ToolResult>\`，并使用来自 [response.ts](packages/session-tools-core/src/response.ts#L13-L59) 的集中式 \`successResponse\` / \`errorResponse\` 辅助函数。\`ToolResult\` 类型兼容 SDK 和 MCP 响应模式，包含一个 \`TextContent\` 块数组、一个可选的 \`structuredContent\` 载荷以及一个 \`isError\` 标志。

### 流程控制处理程序：SubmitPlan 与 OAuth[](#流程控制处理程序submitplan-与-oauth)

\`handleSubmitPlan\` 处理程序（[submit-plan.ts](packages/session-tools-core/src/handlers/submit-plan.ts#L24-L50)）在架构上值得注意，因为它不会正常地将控制权返回给 agent。在验证计划文件存在且可读后，它会调用 \`ctx.callbacks.onPlanSubmitted(planPath)\` —— 这是一个触发会话管理器中 \`forceAbort\` 的钩子，会暂停所有进一步的 agent 执行。只有当用户接受、修改或拒绝该计划时，对话才会恢复。

所有四个 OAuth 触发处理程序（[source-oauth.ts](packages/session-tools-core/src/handlers/source-oauth.ts#L35-L372)）都遵循相同的模式：它们验证来源是否存在，构造一个类型化的 \`AuthRequest\`（MCP、Google、Slack 或 Microsoft），并调用 \`ctx.callbacks.onAuthRequest(request)\`。这会触发执行暂停，同时 OAuth 流程在浏览器窗口中完成。每个变体都会验证特定于来源类型的先决条件——例如，\`handleGoogleOAuthTrigger\` 会检查 Google OAuth 配置和有效的作用域。

### 验证处理程序[](#验证处理程序)

三个验证工具委托给上下文上的 \`ValidatorInterface\`。\`handleConfigValidate\` 处理程序接受一个 \`target\` 参数（\`config\`、\`sources\`、\`statuses\`、\`preferences\`、\`permissions\`、\`automations\`、\`tool-icons\` 或 \`all\`），并分派到适当的验证方法。\`handleSkillValidate\` 处理程序根据 \`SkillMetadataSchema\` 验证 SKILL.md 前置元数据（要求 \`name\` 和 \`description\` 字段），并检查 slug 格式、内容存在性和图标有效性。\`handleMermaidValidate\` 处理程序针对 12 种支持的 Mermaid 图表类型执行基本的语法验证，而无需浏览器。

来源：[validation.ts](packages/session-tools-core/src/validation.ts#L197-L202)、[validation.ts](packages/session-tools-core/src/validation.ts#L265-L337)

### 数据处理处理程序[](#数据处理处理程序)

\`handleTransformData\` 处理程序将 agent 的脚本写入临时文件，相对于会话目录解析输入文件（并进行路径安全验证），生成适当的运行时解释器，并将输出写入会话的数据目录。它带有 30 秒的超时时间，并使用完整的运行时安全栈。

\`handleRenderTemplate\` 处理程序使用模板加载器（[loader.ts](packages/session-tools-core/src/templates/loader.ts#L101-L134)）从来源目录加载 HTML 模板，根据模板声明的必填字段验证数据，使用自定义 Mustache 引擎（[mustache.ts](packages/session-tools-core/src/templates/mustache.ts#L89-L96)）进行渲染，并将生成的 HTML 写入会话数据文件夹，供 \`html-preview\` 块引用。

来源：[transform-data.ts](packages/session-tools-core/src/handlers/transform-data.ts#L38-L170)、[render-template.ts](packages/session-tools-core/src/handlers/render-template.ts#L31-L96)、[loader.ts](packages/session-tools-core/src/templates/loader.ts#L59-L98)

## 过滤器与注册表辅助函数[](#过滤器与注册表辅助函数)

该包提供了一系列过滤器函数，后端使用它们来组装一致的工具视图。\`getSessionToolDefs\` 返回带有可选功能过滤（目前仅为 \`includeDeveloperFeedback\`）的完整定义数组。在此基础上，\`getSessionBackendToolNames\`、\`getSessionRegistryToolNames\`、\`getSessionSafeAllowedToolNames\` 和 \`getSessionSafeBlockedToolNames\` 派生出特定的工具子集。安全模式辅助函数上的 \`prefix\` 选项支持命名空间前缀（例如，用于 Pi 的 \`mcp__session__\`），以避免与后端自身的工具发生名称冲突。

\`getToolDefsAsJsonSchema\` 函数使用 \`zodToJsonSchema\` 将基于 Zod 的定义转换为 JSON Schema 格式——这是需要通过基于模式的发现而非代码级导入来公布工具的 MCP 服务器和 Pi 后端所使用的格式。

来源：[tool-defs.ts](packages/session-tools-core/src/tool-defs.ts#L515-L587)、[tool-defs.ts](packages/session-tools-core/src/tool-defs.ts#L636-L657)

## 模板引擎[](#模板引擎)

\`templates/\` 子系统实现了一个轻量级的 Mustache 渲染器（[mustache.ts](packages/session-tools-core/src/templates/mustache.ts#L89-L96)），带有 HTML 转义功能以防止渲染输出中的 XSS。模板作为 HTML 文件存储在每个来源的目录中，元数据从包含 \`@template\`、\`@name\`、\`@description\`、\`@required\` 和 \`@optional\` 注释的 HTML 注释头中提取。加载器（[loader.ts](packages/session-tools-core/src/templates/loader.ts#L59-L98)）解析此头部，而 \`validateTemplateData\` 会为缺少必填字段生成非阻塞警告——即使数据不完整，模板仍然会渲染。

来源：[loader.ts](packages/session-tools-core/src/templates/loader.ts#L59-L208)、[mustache.ts](packages/session-tools-core/src/templates/mustache.ts#L1-L235)

## 类型系统[](#类型系统)

该包导出了一个全面的类型系统，涵盖认证流程、来源配置、验证结果和工具响应。认证类型使用以 \`AuthRequestType\` 为判别依据的可辨识联合模式，支持五种认证策略：凭证提示、MCP OAuth、Google OAuth、Slack OAuth 和 Microsoft OAuth。\`SourceConfig\` 类型对三种来源变体（\`mcp\`、\`api\`、\`local\`）进行建模，每种传输类型、认证模式和可选的提供程序特定字段（Google 作用域、Slack 服务、Microsoft 服务、通用 OAuth）都有相应的配置块。

来源：[types.ts](packages/session-tools-core/src/types.ts#L12-L327)

\`SessionToolContext\` 使用了大量的**可选能力字段**（用 \`?\` 标记），而不是要求完整实现。像 session-mcp-server 这样无头运行的后端可以省略 \`credentialManager\`、\`downloadSourceIcon\`、\`validateStdioMcpConnection\` 以及大多数会话自我管理方法——需要这些能力的处理程序在可选方法不存在时只需返回错误响应即可。这种渐进增强模式使得上下文接口在差异巨大的部署环境中保持稳定。

## 后端如何消费此包[](#后端如何消费此包)

每个 agent 后端都从 \`session-tools-core\` 导入，并提供自己的 \`SessionToolContext\` 实现。Claude 将直接函数调用连接到基于钥匙串的凭证管理器和来自 \`packages/shared\` 的完整 Zod 验证器。Pi/Codex 使用基于 stderr 的 \`__CALLBACK__\` 消息进行计划提交和认证请求。\`session-mcp-server\` 使用带有 \`mcp__session__\` 前缀的 \`getToolDefsAsJsonSchema\` 将工具注册表适配为 MCP 工具定义。尽管存在这些传输差异，处理程序逻辑在所有三个后端中保持完全一致。

要全面了解此包如何融入后端架构，请参阅 [PiAgent 子进程协议](/lukilabs/craft-agents-oss/11-piagent-subprocess-protocol) 了解针对 Codex 的特定集成，以及参阅 [无头远程服务器](/lukilabs/craft-agents-oss/22-headless-remote-server) 了解 session-mcp-server 消费者的相关内容。`;export{n as default};
