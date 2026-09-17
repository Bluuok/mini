const n=`# Monorepo 架构 | lukilabs/craft-agents-oss


---
本页文档介绍了 **craft-agents-oss** monorepo 的结构设计、依赖拓扑和构建系统 —— 这是一个以 TypeScript 为首要语言的代码库，使用 Bun workspaces 进行管理，能够从统一的代码库构建出三个不同的应用程序目标（Electron 桌面端、无头服务器和 Web 客户端）。

## 工作区拓扑[](#工作区拓扑)

该仓库使用 **Bun workspaces** 作为包管理器，在根目录的 \`package.json\` 中的 \`workspaces\` 字段中声明。所有的包和应用程序都存放在两个顶层目录中：\`packages/\` 用于存放共享库，\`apps/\` 用于存放可运行的应用程序。整个仓库内部统一使用 \`workspace:*\` 协议来引用内部依赖，确保每个工作区的使用者始终解析到本地副本，而不是从注册表拉取。

来源：[package.json](package.json#L1-L12)

Syntax error in textmermaid version 11.6.0

工作区通过否定型 glob 模式排除了 \`apps/online-docs\`，从而将营销文档站点与构建流水线分离开来。

来源：[package.json](package.json#L8-L11)

## 两层包系统[](#两层包系统)

该仓库将其内部包组织成严格的依赖层次结构，以防止循环引用，并在三个概念层（**基础类型**、**共享业务逻辑**和**平台基础设施**）之间强制实施关注点分离。

### 第一层 —— 基础包[](#第一层--基础包)

两个叶子包构成了依赖树的根基，它们具有零或接近零的内部耦合：

包

npm 名称

职责

内部依赖

\`core\`

\`@craft-agent/core\`

TypeScript 类型定义和纯工具函数（路径、调试）

无

\`session-tools-core\`

\`@craft-agent/session-tools-core\`

用于会话级 Agent 工具的工具定义、校验模式和沙盒运行时

无

\`@craft-agent/core\` 仅导出类型（\`session.ts\`、\`workspace.ts\`、\`server.ts\`、\`message.ts\`）以及路径/调试工具。它声明了对 \`@anthropic-ai/claude-agent-sdk\` 和 \`@modelcontextprotocol/sdk\` 的 peer dependencies，但其自身没有任何运行时依赖。该包的 \`index.ts\` 明确指出，存储、凭据、Agent 逻辑、认证和 MCP _尚未_迁移至此 —— 它们仍保留在 \`shared\` 中。

来源：[packages/core/src/index.ts](packages/core/src/index.ts#L1-L16), [packages/core/package.json](packages/core/package.json#L1-L22)

\`@craft-agent/session-tools-core\` 为会话级工具（如 \`SubmitPlan\`、\`config_validate\`、\`skill_validate\`、\`script-sandbox\` 以及源 OAuth 流程）提供了一个处理器注册表。它仅依赖于 \`zod\`、\`zod-to-json-schema\`、\`gray-matter\` 和 \`beautiful-mermaid\` —— 完全属于外部依赖，零内部工作区依赖。

来源：[packages/session-tools-core/package.json](packages/session-tools-core/package.json#L1-L25)

### 第二层 —— 业务逻辑[](#第二层--业务逻辑)

包

npm 名称

职责

内部依赖

\`shared\`

\`@craft-agent/shared\`

Agent 后端（BaseAgent、ClaudeAgent、PiAgent）、认证流程、配置、凭据、MCP 客户端池、会话、提示词、自动化、来源、技能、i18n

\`core\`、\`session-tools-core\`

\`ui\`

\`@craft-agent/ui\`

共享的 React 组件（SessionViewer、TurnCard、Markdown 渲染、终端显示）

\`core\`

\`@craft-agent/shared\` 是仓库中最大的包，作为所有 Agent 相关业务逻辑的中枢神经系统。其 \`exports\` 映射暴露了超过 50 个按领域组织的子路径导出项：\`./agent\`、\`./auth\`、\`./config\`、\`./credentials\`、\`./mcp\`、\`./sessions\`、\`./sources\`、\`./skills\`、\`./automations\`、\`./protocol\`、\`./i18n\` 等。这种细粒度的导出结构允许使用者仅导入所需的模块，从而为 CLI 等轻量级目标保持较小的打包体积。

来源：[packages/shared/package.json](packages/shared/package.json#L1-L93)

\`@craft-agent/ui\` 提供了由 Electron 渲染器和 Session Viewer 共同使用的共享 React 组件层。它将 React 和 Markdown 渲染库声明为带有可选元数据的 **peer dependencies**，让每个消费应用可以自行控制 \`react\`、\`react-markdown\`、\`jotai\` 和 Tailwind CSS 的确切版本。

来源：[packages/ui/package.json](packages/ui/package.json#L1-L71)

### 第三层 —— 平台基础设施[](#第三层--平台基础设施)

包

npm 名称

职责

内部依赖

\`server-core\`

\`@craft-agent/server-core\`

可复用的服务器引导程序、WebSocket 传输层、RPC 处理器注册表、会话管理、WebUI 服务

\`core\`、\`shared\`

\`session-mcp-server\`

\`@craft-agent/session-mcp-server\`

向 Codex agent 提供会话工具的 MCP stdio 服务器

\`shared\`、\`session-tools-core\`

\`pi-agent-server\`

\`@craft-agent/pi-agent-server\`

通过 stdio 上的 JSONL 进行通信的进程外 Pi agent 服务器

无（内部）

\`@craft-agent/server-core\` 是关键的桥接包 —— 它封装了完整的无头服务器基础设施，使得 Electron 主进程和独立的 \`@craft-agent/server\` 应用都能够在不重复代码的情况下引导完整的 Agent 服务器。它的导出项暴露了 \`./transport\`、\`./runtime\`、\`./handlers\`、\`./bootstrap\`、\`./model-fetchers\`、\`./domain\`、\`./services\` 和 \`./webui\`。

来源：[packages/server-core/package.json](packages/server-core/package.json#L1-L39), [packages/server-core/src/index.ts](packages/server-core/src/index.ts#L1-L5)

## 应用程序目标[](#应用程序目标)

\`apps/\` 目录包含四个不同的可运行应用程序，每个应用程序都有自己的构建流水线，但共享底层的 \`packages/\` 库。

### 应用程序依赖矩阵[](#应用程序依赖矩阵)

应用

\`core\`

\`shared\`

\`server-core\`

\`ui\`

运行时

**Electron**

✅

✅

✅

✅

Node + Electron

**CLI**

—

✅

✅

—

Bun

**Viewer**

✅

—

—

✅

浏览器 (Vite)

**WebUI**

—

—

—

—

浏览器 (Vite)

### \`@craft-agent/electron\` — 桌面应用程序[](#craft-agentelectron--桌面应用程序)

Electron 应用是最复杂的目标，它消费了所有四个库包。其架构遵循标准的 Electron 三进程模型：**主进程**（Node.js）、**预加载脚本**（沙盒桥接）和**渲染进程**（React/Vite）。主进程入口首先加载 shell 环境变量，初始化 Sentry 错误追踪，设置 i18n，然后调用来自 \`server-core\` 的 \`bootstrapServer\` —— 这与无头服务器使用的引导函数完全相同。这种共享的引导机制是架构的基石：它意味着桌面应用和服务器应用运行着完全一致的会话管理、RPC 处理和传输代码。

来源：[apps/electron/src/main/index.ts](apps/electron/src/main/index.ts#L1-L80), [apps/electron/package.json](apps/electron/package.json#L1-L81)

### \`@craft-agent/server\` — 无头服务器[](#craft-agentserver--无头服务器)

独立服务器被刻意设计得极简：\`packages/server/src/index.ts\` 是一个单文件（约 290 行），它串联起环境变量解析、TLS 配置、WebUI 处理器创建，然后委托给来自 \`server-core\` 的 \`bootstrapServer\`。它要求 Bun 作为其运行时引擎（\`engines.bun >= 1.0.0\`），并暴露了一个 \`craft-server\` 二进制入口点。位于 \`scripts/build-server.ts\` 的构建脚本会组装一个包含 Bun 运行时、子进程服务器和资源的独立分发版。

来源：[packages/server/package.json](packages/server/package.json#L1-L38), [packages/server/src/index.ts](packages/server/src/index.ts#L1-L200)

### \`@craft-agent/cli\` — 终端客户端[](#craft-agentcli--终端客户端)

CLI 通过 WebSocket 连接到正在运行的 Craft Agent 服务器，并提供用于会话管理、带实时流式传输的消息发送以及服务器健康状态验证的命令。它依赖于 \`shared\` 和 \`server-core\`，但值得注意的是，它_并不_依赖于 \`@craft-agent/ui\`，从而为其在终端中的使用保持了极小的体积。

来源：[apps/cli/package.json](apps/cli/package.json#L1-L26), [apps/cli/src/index.ts](apps/cli/src/index.ts#L1-L50)

### \`@craft-agent/viewer\` 和 \`@craft-agent/webui\`[](#craft-agentviewer-和-craft-agentwebui)

**Viewer** 是一个独立的 Web 应用，用于上传和分享会话记录 —— 它消费 \`core\`（用于会话类型）和 \`ui\`（用于 SessionViewer/TurnCard 组件）。**WebUI** 是一个轻量级外壳，为无头服务器提供基于浏览器的聊天界面；它没有任何工作区依赖，而是依赖服务器的 \`/api/config\` 端点在运行时引导 WebSocket 连接。

来源：[apps/viewer/package.json](apps/viewer/package.json#L1-L39), [apps/webui/package.json](apps/webui/package.json#L1-L18)

## 构建系统架构[](#构建系统架构)

该 monorepo 采用了一种多语言构建策略，根据运行时需求为每个目标选择最优的打包工具，而不是强制使用单一的构建工具链。

Syntax error in textmermaid version 11.6.0

### 打包工具分配表[](#打包工具分配表)

构建目标

工具

输出格式

平台目标

关键标志

Electron 主进程

esbuild

CJS

\`node\`

\`--external:electron\`

Electron 预加载脚本

esbuild

CJS

\`node\`

\`--external:electron\`

Electron 拦截器

esbuild

CJS

\`node\`

(来自 shared)

Electron 渲染进程

Vite

ESM + HTML

browser

React 插件

Session Viewer

Vite

ESM + HTML

browser

React 插件

WebUI

Vite

ESM + HTML

browser

(极简配置)

session-mcp-server

Bun

CJS

\`node\`

\`--format=cjs\`

pi-agent-server

Bun

ESM

\`bun\`

\`--external koffi\`

独立服务器

\`scripts/build-server.ts\`

目录 + tar.gz

darwin/linux

跨平台

来源：[apps/electron/package.json](apps/electron/package.json#L22-L30), [packages/session-mcp-server/package.json](packages/session-mcp-server/package.json#L14-L15), [packages/pi-agent-server/package.json](packages/pi-agent-server/package.json#L14-L15), [scripts/build-server.ts](scripts/build-server.ts#L1-L60)

### 模块系统策略[](#模块系统策略)

代码库主要以 ESM 为主（大多数 \`package.json\` 文件中设置了 \`"type": "module"\`），但在运行时限制有要求的地方会策略性地回退到 CJS。Electron 主进程和两个子进程服务器（session-mcp-server、pi-agent-server）编译为 CJS，因为它们运行在需要兼容 \`require()\` 输出的 Node.js 上下文中。session-mcp-server 在包级别显式设置了 \`"type": "commonjs"\`，而 pi-agent-server 保持 ESM 但专门针对 Bun 运行时（\`--target=bun\`）。

位于仓库根目录的 \`bunfig.toml\` 文件应用了一个全局预加载：\`preload = ["./packages/shared/src/unified-network-interceptor.ts"]\`。该拦截器在任何工作区模块之前运行，在所有服务端上下文中提供统一的网络请求处理（凭据注入、代理路由） —— Electron 主进程和无头服务器都透明地继承了此行为。

来源：[bunfig.toml](bunfig.toml#L1-L2)

## TypeScript 配置[](#typescript-配置)

根目录的 \`tsconfig.json\` 建立了一个严格的基线，所有工作区包都继承此配置：\`ESNext\` 目标和模块、\`bundler\` 模块解析、启用 \`strict\` 模式、强制执行 \`verbatimModuleSyntax\`，以及启用 \`noUncheckedIndexedAccess\` 以实现更安全的数组/对象访问。\`jsx\` 配置使用 \`react-jsx\` 并将 \`react\` 作为导入源。每个工作区包都包含自己的 \`tsconfig.json\`，用于扩展或镜像这些设置，从而允许在需要时进行按包定制。

来源：[tsconfig.json](tsconfig.json#L1-L31)

## 子进程服务器模式[](#子进程服务器模式)

有两个包遵循一种独特的架构模式，作为通过 stdio 进行通信的**进程外服务器**：

**\`@craft-agent/session-mcp-server\`** 通过 stdio 传输实现了 Model Context Protocol (MCP)，向 Codex agent 暴露会话级工具（SubmitPlan、config\\_validate、credential-prompt 等）。它通过 Bun 打包工具构建为 CJS，并作为由主 Agent 会话生成的子进程运行。

**\`@craft-agent/pi-agent-server\`** 将 Pi 编码 Agent 作为独立进程运行，通过 stdio 上的 JSONL 进行通信。它构建为针对 Bun 运行时的 ESM，并包含 web-fetch 和搜索工具。与 MCP 服务器不同，它具有**零内部工作区依赖** —— 它仅依赖于 \`@mariozechner/pi-*\` 生态系统的包。

这两个服务器都在无头服务器启动之前按需构建（通过 \`server:build:subprocess\` 脚本），并且它们的 \`dist/\` 输出包含在独立服务器的分发版中。

来源：[packages/session-mcp-server/package.json](packages/session-mcp-server/package.json#L1-L25), [packages/pi-agent-server/package.json](packages/pi-agent-server/package.json#L1-L30)

## 关键根目录脚本[](#关键根目录脚本)

根目录的 \`package.json\` 通过提升的脚本协调跨工作区操作。在架构上最重要的命令遵循一致的命名模式：

脚本

目的

范围

\`typecheck:all\`

对 core、shared、server-core、server、session-tools-core、electron、cli 进行类型检查

全栈

\`validate:ci\`

运行 typecheck + shared 测试 + doc-tool 测试

CI 流水线

\`server:build\`

通过 \`scripts/build-server.ts\` 组装独立服务器分发版

服务器部署

\`electron:build\`

串联所有四个 Electron 构建步骤（主进程、预加载脚本、渲染进程、资源）

桌面端

\`server:build:subprocess\`

构建 session-mcp-server 和 pi-agent-server 打包产物

服务器前置条件

\`lint\`

运行 IPC 发送检查、electron lint、shared lint 和 UI lint

全栈

来源：[package.json](package.json#L18-L50)

* * *

该 monorepo 的架构反映了一种深思熟虑的权衡：通过在 Electron 桌面应用和无头服务器之间共享 \`server-core\` 的引导逻辑，团队确保了在不同部署目标上的行为一致性。子进程服务器模式将 Agent 后端（Claude SDK、Pi agent）隔离到独立的进程中，提供了崩溃隔离和独立的生命周期管理。要更深入地了解这些包在运行时是如何协作的，请继续阅读 [BaseAgent 抽象](/lukilabs/craft-agents-oss/9-baseagent-abstraction) 以探索 Agent 后端系统，或阅读 [无头远程服务器](/lukilabs/craft-agents-oss/22-headless-remote-server) 以了解服务器部署模型。`;export{n as default};
