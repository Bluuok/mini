const n=`# 来源与技能 | lukilabs/craft-agents-oss


---
来源和技能构成了 Craft Agents 中 **agent 可扩展性** 的两大支柱——来源将 agent 连接到外部服务和数据，而技能则将特定领域的知识和行为指令注入到 agent 的推理上下文中。两者协同工作，将通用的 LLM 后端转变为专为你所在的工作区、工具和工作流量身定制的专属助手。

## 架构概述[](#架构概述)

来源与技能子系统完全位于 \`packages/shared/src/\` 目录下，并围绕清晰的关注点分离原则进行组织：**类型定义**描述数据契约，**存储模块**处理文件系统的 CRUD 操作，而**集成层**则将来源桥接到 MCP 工具生态系统中，并将技能桥接到系统提示词中。server-core 的 RPC 处理器通过统一的基于通道的协议，将这两个系统暴露给渲染器和 CLI。

Syntax error in textmermaid version 11.6.0

来源流经 \`SourceServerBuilder\` 进入 \`McpClientPool\`，并在此转化为可供 agent 使用的代理工具。技能则从三个文件系统层级加载，并直接注入到系统提示词中。这两个子系统均以工作区为作用域，并以文件形式持久化在磁盘上，使其具备可移植性且易于版本控制。

来源：[index.ts](packages/shared/src/sources/index.ts)、[storage.ts](packages/shared/src/skills/storage.ts)、[mcp-pool.ts](packages/shared/src/mcp/mcp-pool.ts)

## 来源类型与配置[](#来源类型与配置)

每个来源都是工作区 \`sources/\` 文件夹（\`~/.craft-agent/workspaces/{id}/sources/{slug}/\`）内的一个目录，至少包含一个 \`config.json\` 文件。配置中的 \`type\` 字段决定了激活哪个连接块以及适用哪种身份验证模型。

来源类型

连接块

传输方式

典型用例

\`mcp\`

\`McpSourceConfig\`

HTTP、SSE 或 stdio

连接到兼容 MCP 的服务器（Linear、Notion、GitHub 等）

\`api\`

\`ApiSourceConfig\`

REST HTTP

具有自定义身份验证的直接 REST API 集成

\`local\`

\`LocalSourceConfig\`

文件系统

本地目录、Obsidian 知识库、git 仓库

\`FolderSourceConfig\` 是存储在磁盘上的核心数据结构。除了特定类型的连接块之外，它还为 agent 的上下文携带了元数据——用于快速识别的 \`tagline\`、\`icon\`（emoji 或 URL）、用于特殊处理 OAuth 流程的 \`provider\` 标签，以及用于跨会话跟踪身份验证状态的连接状态字段。

来源：[types.ts](packages/shared/src/sources/types.ts#L392-L430)

### MCP 来源[](#mcp-来源)

MCP 来源支持三种由 \`transport\` 字段控制的传输方式。默认为 \`http\`，但系统也支持 \`sse\`（Server-Sent Events）和 \`stdio\`（本地子进程生成）。对于 HTTP 和 SSE，\`url\` 字段指向远程 MCP 服务器端点，而 stdio 来源则指定一个 \`command\`，并可选地提供 \`args\` 和 \`env\`。

MCP 来源的身份验证使用 \`SourceMcpAuthType\` 联合类型——\`'oauth' | 'bearer' | 'none'\`。启用 OAuth 的 MCP 来源会通过 \`SourceCredentialManager\` 发起标准的 MCP OAuth 流程，该管理器从 MCP 服务器的元数据中发现 OAuth 端点。Bearer 认证则会将静态令牌注入到请求头中。

TYPESCRIPT

Copy code

\`\`\`
// Example: MCP source with OAuth (e.g., Linear, GitHub)
{
  type: 'mcp',
  mcp: {
    transport: 'http',
    url: 'https://mcp.linear.app/sse',
    authType: 'oauth'
  }
}
\`\`\`

由构建器生成的 \`McpServerConfig\` 类型是 Claude Agent SDK 实际消费的对象——它要么是远程 URL 配置（\`http\`/\`sse\`），要么是本地子进程配置（\`stdio\`），并在顶层合并了身份验证头。

来源：[types.ts](packages/shared/src/sources/types.ts#L226-L285)、[server-builder.ts](packages/shared/src/sources/server-builder.ts#L34-L36)

### API 来源[](#api-来源)

API 来源提供了一个通用的 REST 集成层，通过动态工具生成将任何 HTTP API 包装为 MCP 服务器。\`api-tools.ts\` 模块创建进程内的 \`SdkMcpServer\` 实例，这些实例包含一个接受 method、path、params 和 headers 的单一工具——实际上就是一个暴露给 agent 的可编程 HTTP 客户端。

API 身份验证支持由 \`ApiAuthType\` 定义的五种模式：\`bearer\`（Authorization 头）、\`header\`（自定义头名称）、\`query\`（URL 参数）、\`basic\`（用户名/密码）和 \`oauth\`。系统包含对三个特定提供商的 OAuth 流程的特殊处理——Google、Slack 和 Microsoft——每个流程都有基于服务的作用域选择（例如，\`GoogleService\` 将 \`gmail\`、\`calendar\`、\`drive\` 映射到其各自的 OAuth 作用域）。

TYPESCRIPT

Copy code

\`\`\`
// Example: API source with bearer auth (e.g., OpenAI, custom API)
{
  type: 'api',
  api: {
    baseUrl: 'https://api.example.com/v1',
    authType: 'bearer',
    authScheme: 'Bearer'
  }
}

// Example: API source with multi-header auth (e.g., Datadog)
{
  type: 'api',
  api: {
    baseUrl: 'https://api.datadoghq.com/api/v2',
    authType: 'header',
    headerNames: ['DD-API-KEY', 'DD-APPLICATION-KEY']
  }
}
\`\`\`

\`ApiOAuthConfig\` 接口为任何提供商启用通用的 OAuth 2.0 集成——你只需提供授权 URL、令牌 URL、客户端 ID 和可选的作用域，系统就会处理完整的 PKCE 流程。这避免了对于支持标准 OAuth 的提供商还需要部署 MCP 服务器或手动管理 PAT 的麻烦。

来源：[types.ts](packages/shared/src/sources/types.ts#L319-L350)、[api-tools.ts](packages/shared/src/sources/api-tools.ts#L203-L332)

### 本地来源[](#本地来源)

本地来源指向文件系统路径，并带有一个可选的 \`format\` 提示（\`'filesystem' | 'obsidian' | 'git' | 'sqlite'\`）。它们使 agent 能够与本地数据（文档、知识库、项目文件）交互，而无需远程服务器。当本地来源无法访问时，其 \`connectionStatus\` 会跟踪为 \`'local_disabled'\`。

来源：[types.ts](packages/shared/src/sources/types.ts#L355-L358)

## 来源生命周期[](#来源生命周期)

从创建到在 agent 会话中实际使用，每个来源都会经历一个由存储、凭证和服务器构建器模块管理的定义明确的生命周期。

Syntax error in textmermaid version 11.6.0

### 存储与 CRUD[](#存储与-crud)

\`source storage.ts\` 模块处理来源的所有文件系统操作。\`createSource\` 函数会生成一个基于 UUID 的 \`id\`，根据名称创建一个 URL 安全的 slug（带有冲突避免机制），写入 \`config.json\`，并可选地从 URL 下载图标。\`loadSource\` 函数读取配置和 \`guide.md\`（如果存在），计算解析了完整路径的 \`LoadedSource\` 对象。

来源存储在 \`{workspaceRoot}/sources/{slug}/\` 中，目录结构如下：

Copy code

\`\`\`
sources/
└── {slug}/
    ├── config.json            ├── guide.md           # Agent context (optional)
    └── icon.svg/png       # Local icon (optional, auto-downloaded from URL)
\`\`\`

\`loadAllSources\` 函数将磁盘上用户配置的来源与内置来源（如 \`craft-agents-docs\`）合并，后者没有文件系统文件夹，但在每个工作区中始终可用。\`getEnabledSources\` 过滤器会进一步将列表缩小为仅包含 \`enabled: true\` 且通过 \`isSourceUsable\` 检查（已通过身份验证或无需身份验证）的来源。

来源：[storage.ts](packages/shared/src/sources/storage.ts#L302-L410)、[builtin-sources.ts](packages/shared/src/sources/builtin-sources.ts#L25-L36)

### 指南内容与 Agent 上下文[](#指南内容与-agent-上下文)

每个来源目录中的 \`guide.md\` 文件提供了结构化的领域知识，这些知识会被注入到 agent 的系统提示词中。\`parseGuideMarkdown\` 函数从 markdown 中提取四个可选部分：

部分

用途

**Scope**

该来源涵盖的内容——agent 据此决定何时调用该来源的工具

**Guidelines**

与该来源交互的行为规则

**Context**

关于该服务或 API 的背景信息

**API Notes**

关于端点、速率限制或特殊行为的技术细节

指南还支持一个 \`Cache\` 块（代码围栏中的 JSON）用于嵌入结构化数据。当配置中未设置 \`tagline\` 时，系统会从指南的第一段中提取一个。像 \`craft-agents-docs\` 这样的内置来源提供了可搜索的知识，agent 可以在运行时通过 \`mcp__craft-agents-docs__SearchCraftAgents\` 工具进行查询。

来源：[storage.ts](packages/shared/src/sources/storage.ts#L149-L188)、[source-guides.ts](packages/shared/src/docs/source-guides.ts#L14-L25)

### 凭证管理[](#凭证管理)

\`SourceCredentialManager\` 是一个单例，统一了所有来源类型的凭证操作。它使用命名空间的键格式将凭证存储在工作区的凭证存储中：OAuth 令牌使用 \`source_oauth::{workspaceId}::{sourceSlug}\`，Bearer 令牌使用 \`source_bearer::{workspaceId}::{sourceSlug}\`。

对于启用 OAuth 的来源，管理器通过 \`detectProvider()\` 检测合适的提供商，并路由到正确的身份验证流程：

-   **MCP OAuth**：使用从远程服务器发现的端点的标准 MCP OAuth 流程
-   **Google OAuth**：具有基于服务的作用域选择（Gmail、Calendar、Drive 等）的特定提供商流程
-   **Slack OAuth**：用于消息传递、频道和文件访问的用户级作用域身份验证
-   **Microsoft OAuth**：用于 Outlook、OneDrive、Teams 和 SharePoint 的 Graph API 集成
-   **Generic OAuth**：RFC 9728/8414 自动发现或手动指定 \`ApiOAuthConfig\`

\`isApiOAuthProvider\` 函数识别三个特定提供商的 OAuth 来源（\`google\`、\`microsoft\`、\`slack\`），而 \`isGenericOAuthSource\` 检测任何 \`authType: 'oauth'\` 但不属于这些已知提供商的 API 来源。令牌刷新通过特定提供商的刷新方法自动处理，这些方法会检查 \`expires_at\` 声明，并在令牌距离过期不到 5 分钟时发起刷新。

来源：[credential-manager.ts](packages/shared/src/sources/credential-manager.ts#L121-L388)、[types.ts](packages/shared/src/sources/types.ts#L174-L217)

### 构建服务器与 MCP 池[](#构建服务器与-mcp-池)

\`SourceServerBuilder\` 将加载的来源（及其凭证）转换为可运行的服务器配置。它的 \`buildMcpServer\` 方法为 Claude Agent SDK 生成 \`McpServerConfig\`，而 \`buildApiServer\` 则通过 \`createApiServer\` 创建进程内的 \`SdkMcpServer\` 实例。\`buildAll\` 方法编排整个流水线，返回分别对应 MCP 配置、API 服务器实例以及任何构建错误的独立映射。

\`McpClientPool\` 是管理活动连接的运行时引擎。它的 \`sync\` 方法接收构建好的服务器，并与当前连接状态进行协调——连接新来源，断开已移除的来源，并刷新身份验证头发生变化的来源（例如令牌刷新后）。已连接的来源使用遵循 \`mcp__{slug}__{toolName}\` 约定的代理名称注册其工具，使其在 agent 的工具注册表中可用。

\`ApiSourcePoolClient\` 使用 \`InMemoryTransport\` 将 API 来源服务器（进程内的 \`McpServer\` 实例）桥接到池中，因此 API 工具与 MCP 工具一起出现，并具有相同的代理命名。

\`McpClientPool.sync()\` 方法执行增量协调——它将当前连接与传入的服务器映射进行比较，仅在 URL 或身份验证头发生更改时才重新连接。这避免了在仅更新 bearer 令牌而未更改端点的令牌刷新期间产生不必要的重新连接。

来源：[server-builder.ts](packages/shared/src/sources/server-builder.ts#L77-L349)、[mcp-pool.ts](packages/shared/src/mcp/mcp-pool.ts#L101-L460)、[api-source-pool-client.ts](packages/shared/src/mcp/api-source-pool-client.ts#L15-L52)

## 技能：提示词级别的可扩展性[](#技能提示词级别的可扩展性)

如果说来源扩展了 agent 的**工具访问**能力，那么技能则扩展了其**知识与行为**。技能是一个包含 \`SKILL.md\` 文件的目录，该文件具有 YAML frontmatter 元数据和 markdown 正文，在技能激活时会被注入到系统提示词中。

### 技能元数据与结构[](#技能元数据与结构)

\`SkillMetadata\` 接口定义了 frontmatter 模式：

字段

类型

用途

\`name\`

\`string\`（必填）

在技能列表中显示的名称

\`description\`

\`string\`（必填）

用于 agent 上下文的简短描述

\`globs\`

\`string[]\`

自动触发此技能的文件模式

\`alwaysAllow\`

\`string[]\`

技能激活时预授权的工具

\`icon\`

\`string\`

用于 UI 显示的 emoji 或 URL

\`requiredSources\`

\`string[]\`

自动启用的来源 slug

技能按优先级顺序从三个层级加载：

Syntax error in textmermaid version 11.6.0

\`loadAllSkills\` 函数合并来自所有三个层级的技能，当 slug 发生冲突时，后一个层级会覆盖前一个层级。来自全局目录（\`~/.agents/skills/\`）的技能适用于所有工作区，工作区技能的作用域限于单个工作区，而项目技能（工作目录内的 \`.agents/skills/\`）则特定于当前项目上下文。

来源：[types.ts](packages/shared/src/skills/types.ts#L11-L60)、[storage.ts](packages/shared/src/skills/storage.ts#L197-L270)

### SKILL.md 格式[](#skillmd-格式)

\`SKILL.md\` 文件使用由 \`---\` 标记分隔的 YAML frontmatter，正文包含实际注入到系统提示词中的指令：

MARKDOWN

Copy code

\`\`\`
---
name: API Security Reviewer
description: Reviews API endpoints for security vulnerabilities
globs:
  - "**/*.ts"
  - "**/routes/**"
alwaysAllow:
  - Read
  - Grep
icon: 🔒
requiredSources:
  - github
---

When reviewing API code, always check for:
1. Input validation and sanitization
2. Authentication and authorization middleware
3. Rate limiting configuration
4. SQL injection prevention
\`\`\`

\`parseSkillFile\` 函数使用 \`gray-matter\` 库将 frontmatter 与正文内容分离，并将 \`requiredSources\` 字段标准化为接受单个字符串或数组。\`normalizeRequiredSources\` 辅助函数会修剪空白符并对条目进行去重。

来源：[storage.ts](packages/shared/src/skills/storage.ts#L65-L143)

### 缓存与失效[](#缓存与失效)

技能使用带有 5 分钟 TTL 的基于时间的缓存，以避免重复的文件系统读取。\`invalidateSkillsCache\` 函数会清除此缓存，该函数由工作目录更改或文件系统事件触发。类似地，\`loadSkillBySlug\` 函数会跨所有三个层级（项目 -> 工作区 -> 全局）搜索，以通过其 slug 解析技能。

来源：[storage.ts](packages/shared/src/skills/storage.ts#L197-L216)

## RPC 接口与处理器连接[](#rpc-接口与处理器连接)

来源和技能都通过在 \`server-core\` 中注册的 RPC 通道处理器暴露给渲染器。通道常量来自 \`@craft-agent/shared/protocol\`，并遵循命名空间模式。

### 来源 RPC 通道[](#来源-rpc-通道)

来源处理器注册了涵盖完整来源管理生命周期的七个通道：

通道

操作

\`sources.GET\`

列出工作区的所有来源

\`sources.CREATE\`

创建具有自动生成 slug 的新来源

\`sources.DELETE\`

移除来源及其文件夹

\`sources.START_OAUTH\`

为来源发起 OAuth 流程

\`sources.SAVE_CREDENTIALS\`

存储凭证（bearer 令牌、API 密钥）

\`sources.GET_PERMISSIONS\`

检索来源的权限配置

\`sources.GET_MCP_TOOLS\`

列出来源可用的 MCP 工具

处理器将读取操作委托给 \`loadWorkspaceSources\`，将身份验证操作委托给凭证管理器，并通过 \`getWorkspaceByNameOrId\` 解析工作区。

来源：[sources.ts](packages/server-core/src/handlers/rpc/sources.ts#L9-L18)

### 技能 RPC 通道[](#技能-rpc-通道)

技能处理器更为精简，专注于工作区作用域的技能管理：

通道

操作

\`skills.GET\`

列出所有技能（从全局、工作区、项目合并）

\`skills.GET_FILES\`

检索技能文件内容以供显示

\`skills.DELETE\`

从工作区中移除技能

\`skills.OPEN_EDITOR\`

在外部编辑器中打开技能

\`skills.OPEN_FINDER\`

在文件管理器中显示技能目录

来源：[skills.ts](packages/server-core/src/handlers/rpc/skills.ts#L8-L14)

## 与 Agent 会话的关系[](#与-agent-会话的关系)

来源和技能在 agent 会话中通过两条不同的路径汇聚。来源贡献**工具**——\`McpClientPool.getProxyToolDefs()\` 方法生成代理工具定义，并将其注册到 Claude Agent SDK 中，允许 agent 像调用原生工具一样调用 \`mcp__craft-agents-docs__SearchCraftAgents\` 或 \`mcp__linear__listIssues\`。技能贡献**上下文**——它们解析后的 \`SKILL.md\` 正文内容被注入到系统提示词中，在不添加新工具的情况下塑造 agent 的推理和行为。

\`claude-context.ts\` 中的 \`createClaudeContext\` 函数连接了会话作用域的工具回调，这些回调可以在活动的 agent 会话中验证来源配置、保存凭证和管理来源权限。这意味着 agent 可以自己创建、配置和验证来源身份验证——而不仅仅是使用它们。

当技能指定了 \`requiredSources\` 时，这些来源 slug 会与技能一起自动启用。这创建了一种声明式依赖关系：启用“GitHub Review”技能会自动连接 GitHub 来源，从而使 agent 同时具备执行代码审查所需的行为指令和工具访问权限。

来源：[claude-context.ts](packages/shared/src/agent/claude-context.ts#L78-L96)、[session-scoped-tools.ts](packages/shared/src/agent/session-scoped-tools.ts#L217-L221)

## 后续步骤[](#后续步骤)

本页介绍了来源和技能的数据模型、存储、凭证管理和运行时集成。要了解这些系统如何融入更广泛的 agent 架构，请继续阅读 [Session and Workspace Model](/lukilabs/craft-agents-oss/18-session-and-workspace-model) 以了解工作区文件系统布局，或阅读 [OAuth and Credential Management](/lukilabs/craft-agents-oss/20-oauth-and-credential-management) 以深入了解身份验证流程。有关在进程间传递来源/技能 RPC 调用的传输层，请参阅 [Transport and RPC Layer](/lukilabs/craft-agents-oss/17-transport-and-rpc-layer) 。`;export{n as default};
