const n=`# 快速开始 | lukilabs/craft-agents-oss


---
在五分钟内启动并运行 Craft Agents。本指南将引导你了解每种支持的启动路径——从一行命令安装到完整的源码构建——以便你选择最适合自己工作流的方式。完成阅读后，你将拥有一个可以对话、执行工具并连接外部服务的 AI agent。

## 选择适合你的路径[](#选择适合你的路径)

Craft Agents 提供了四种不同的入门方式，每种都针对特定的用例进行了优化。下图勾勒出了决策路径——选择符合你目标的路径，然后跳转到相应章节。

Syntax error in textmermaid version 11.6.0

路径

最适场景

部署耗时

是否需要克隆源码

**桌面应用**

交互式使用、可视化 UI、多会话工作流

约 1 分钟（安装）或约 3 分钟（构建）

仅在构建时需要

**CLI 客户端**

脚本编写、CI/CD、单次提示词执行

约 1 分钟

是（或通过全局别名）

**无头服务器**

远程托管、多客户端访问、后台 agent

约 3 分钟

是

**Docker**

可复现的部署、CI 环境、物理隔离环境

约 2 分钟

是（用于构建镜像）

## 前置条件[](#前置条件)

无论选择哪种路径，一些基础条件都是适用的。

需求

桌面应用

CLI

无头服务器

Docker

**Bun 运行时** (≥ 1.0)

仅构建时需要

是

是

否（已打包）

**Git**

仅构建时需要

仅克隆时需要

仅克隆时需要

仅构建时需要

**LLM API 密钥**

首次使用时需要

首次使用时需要

首次使用时需要

首次使用时需要

**操作系统**

macOS / Linux / Windows

macOS / Linux / Windows

macOS / Linux / Windows

任何 Docker 主机

关于 API 密钥，Craft Agents 开箱即支持多家供应商。主密钥的解析顺序如下：显式参数 → \`$LLM_API_KEY\` → 特定于供应商的环境变量（如 \`$ANTHROPIC_API_KEY\`、\`$OPENAI_API_KEY\`、\`$GOOGLE_API_KEY\`）。支持的供应商包括 Anthropic、OpenAI、Google、OpenRouter、Groq、Mistral 和 xAI。

来源：[package.json](package.json#L108-L204)、[apps/cli/src/index.ts](apps/cli/src/index.ts#L126-L133)、[docs/cli.md](docs/cli.md#L1-L200)

## 路径 1 — 桌面应用（推荐用于交互式使用）[](#路径-1--桌面应用推荐用于交互式使用)

桌面应用是 Craft Agents 的主要交互界面。它提供多会话收件箱、实时流式传输、文件附件、权限控制以及完整的工作区管理——所有这些都封装在原生的 Electron 外壳中。

### 一键安装[](#一键安装)

最快捷的方式。安装脚本会检测你的操作系统和架构，获取最新版本，验证其 SHA-512 校验和，并将二进制文件放置在合适的位置。

**macOS / Linux:**

BASH

Copy code

\`\`\`
curl -fsSL https://agents.craft.do/install-app.sh | bash
\`\`\`

**Windows (PowerShell):**

POWERSHELL

Copy code

\`\`\`
irm https://agents.craft.do/install-app.ps1 | iex
\`\`\`

安装脚本支持 macOS（x64 和 arm64）以及 Linux（x64 AppImage 格式）。在 macOS 上，应用会被安装到 \`/Applications/Craft Agents.app\`。在 Linux 上，它会以 AppImage 的形式安装到 \`~/.local/bin/\` 目录中。

来源：[scripts/install-app.sh](scripts/install-app.sh#L1-L40)、[README.md](README.md#L134-L143)

### 从源码构建[](#从源码构建)

如果你希望直接从代码仓库运行——这对于参与贡献或进行定制非常有用：

BASH

Copy code

\`\`\`
git clone https://github.com/lukilabs/craft-agents-oss.git
cd craft-agents-oss
bun install
bun run electron:start
\`\`\`

\`electron:start\` 脚本会编排四个连续的构建步骤——主进程、预加载脚本、渲染器 UI 和打包资源——然后启动 Electron。整个构建流水线定义在根目录的 [\`package.json\`](package.json#L87-L89) 中。

\`bun run electron:start\` 命令每次都会执行生产环境构建。如果需要进行支持热重载的迭代开发，请改用 \`bun run electron:dev\`——它将以监听模式启动 Vite，并开启开发者工具启动 Electron。

### 首次启动[](#首次启动)

启动应用后，你将体验一个简短的引导流程：

1.  **选择 API 连接** — 输入 Anthropic API 密钥、使用 Claude Max 登录，或选择其他供应商（Google AI Studio、通过 Codex OAuth 登录的 ChatGPT Plus、GitHub Copilot OAuth）。
2.  **创建工作区** — 工作区用于隔离会话、来源和技能。你可以将它们视为项目容器。
3.  **开始对话** — 使用 \`Cmd+N\` 打开一个新会话，并开始与 Claude 交互。

此后，所有操作均由提示词驱动。告诉 agent“将 Linear 添加为来源”，它便会自动处理发现、凭证设置和配置工作——无需手动修改配置文件。

![Desktop App](https://github.com/lukilabs/craft-agents-oss/blob/main/README.md?raw=true)

来源：[README.md](README.md#L200-L220)、[package.json](package.json#L85-L93)、[apps/cli/package.json](apps/cli/package.json#L1-L26)

## 路径 2 — CLI 客户端（单次提示词最快响应）[](#路径-2--cli-客户端单次提示词最快响应)

CLI 客户端 (\`craft-cli\`) 是一个通过 WebSocket 连接到 Craft Agent 服务器的终端界面。其核心优势在于：\`run\` 命令会自动启动服务器，执行你的提示词，流式输出响应，然后退出——无需单独设置服务器。

### 独立运行（无需服务器）[](#独立运行无需服务器)

从 Craft Agents 获取响应的最快方式：

BASH

Copy code

\`\`\`
git clone https://github.com/lukilabs/craft-agents-oss.git
cd craft-agents-oss
bun install

# 直接运行提示词
ANTHROPIC_API_KEY=sk-... bun run apps/cli/src/index.ts run "Hello, world!"
\`\`\`

这单一命令会处理所有事情：它在后台启动一个无头服务器，创建一个临时会话，发送你的提示词，实时流式输出 AI 响应，并在完成后干净地关闭。

### 实用 CLI 模式[](#实用-cli-模式)

BASH

Copy code

\`\`\`
# 从 stdin 管道输入
echo "Summarize this file" | bun run apps/cli/src/index.ts run

# 使用不同的供应商
GOOGLE_API_KEY=... bun run apps/cli/src/index.ts run --provider google --model gemini-2.0-flash "Hello"

# 指定工作区目录和特定来源运行
bun run apps/cli/src/index.ts run --workspace-dir ./project --source github "List open PRs"

# 添加到 PATH 以便使用
alias craft-cli="bun run $(pwd)/apps/cli/src/index.ts"
craft-cli run "What files are in this directory?"
\`\`\`

\`run\` 命令支持针对工作区目录、来源、权限模式、输出格式（\`text\` 或 \`stream-json\`）以及多供应商 LLM 配置的参数标志。完整的 CLI 参考文档请见 [\`docs/cli.md\`](docs/cli.md)。

来源：[apps/cli/src/index.ts](apps/cli/src/index.ts#L1-L200)、[docs/cli.md](docs/cli.md#L1-L200)、[scripts/test-workflow-local.sh](scripts/test-workflow-local.sh#L1-L24)

## 路径 3 — 无头服务器（适用于远程或持久会话）[](#路径-3--无头服务器适用于远程或持久会话)

在任何机器上将 Craft Agents 作为后台服务器运行。该服务器暴露一个 WebSocket RPC 端点，桌面应用、CLI 客户端和基于浏览器的 WebUI 均可连接到此端点。这非常适合保持长时间运行的会话、在性能强大的服务器上运行计算密集型任务，或从多台设备访问 agent。

### 快速启动[](#快速启动)

安装脚本可自动化整个设置过程——包括依赖安装、子进程构建、WebUI 编译和令牌生成：

BASH

Copy code

\`\`\`
git clone https://github.com/lukilabs/craft-agents-oss.git
cd craft-agents-oss
bun run scripts/install-server.sh
\`\`\`

该脚本会打印生成的令牌以及确切的启动命令。或者，你也可以手动进行设置：

BASH

Copy code

\`\`\`
bun install
bun run server:build:subprocess   # 构建 MCP 辅助服务器
bun run webui:build               # 构建浏览器 UI

# 生成一个安全令牌
TOKEN=$(openssl rand -hex 32)

# 启动服务器
CRAFT_SERVER_TOKEN=$TOKEN \\
CRAFT_WEBUI_DIR=$PWD/apps/webui/dist \\
CRAFT_BUNDLED_ASSETS_ROOT=$PWD/apps/electron \\
bun run packages/server/src/index.ts
\`\`\`

服务器在启动时会打印连接详情：

Copy code

\`\`\`
CRAFT_SERVER_URL=ws://127.0.0.1:9100
\`\`\`

### 连接客户端[](#连接客户端)

服务器运行后，你可以从任何客户端连接到它：

**桌面应用（瘦客户端模式）：**

BASH

Copy code

\`\`\`
CRAFT_SERVER_URL=ws://127.0.0.1:9100 \\
CRAFT_SERVER_TOKEN=$TOKEN \\
bun run electron:start
\`\`\`

在瘦客户端模式下，Electron 应用仅在本地渲染 UI，而所有的会话逻辑、工具执行和 LLM 调用都在远程服务器上进行。

**CLI 客户端：**

BASH

Copy code

\`\`\`
export CRAFT_SERVER_URL=ws://127.0.0.1:9100
export CRAFT_SERVER_TOKEN=$TOKEN
bun run apps/cli/src/index.ts ping
bun run apps/cli/src/index.ts send <session-id> "Your message"
\`\`\`

**浏览器 (WebUI)：** 在浏览器中导航到 \`http://127.0.0.1:9100\`。内置的 WebUI 提供与桌面应用相同的会话界面，并通过服务器令牌进行身份验证。

### 核心环境变量[](#核心环境变量)

变量

是否必需

默认值

描述

\`CRAFT_SERVER_TOKEN\`

**是**

—

用于客户端身份验证的 Bearer 令牌

\`CRAFT_RPC_HOST\`

否

\`127.0.0.1\`

绑定地址（如设为 \`0.0.0.0\` 则允许远程访问）

\`CRAFT_RPC_PORT\`

否

\`9100\`

绑定端口

\`CRAFT_RPC_TLS_CERT\`

否

—

PEM 证书路径（启用 \`wss://\`）

\`CRAFT_RPC_TLS_KEY\`

否

—

PEM 私钥路径

\`CRAFT_WEBUI_DIR\`

否

—

已构建的 WebUI 资源路径（启用浏览器 UI）

\`CRAFT_DEBUG\`

否

\`false\`

启用调试日志

当在网络中暴露服务器时，请务必启用 TLS。开发环境可使用 \`./scripts/generate-dev-cert.sh\`，生产环境则应挂载受信任 CA（如 Let's Encrypt）的证书。当 TLS 处于活动状态时，服务器会打印 \`wss://\`。

来源：[packages/server/src/index.ts](packages/server/src/index.ts#L1-L55)、[scripts/install-server.sh](scripts/install-server.sh#L1-L107)、[scripts/generate-dev-cert.sh](scripts/generate-dev-cert.sh#L1-L30)、[apps/webui/package.json](apps/webui/package.json#L1-L18)

## 路径 4 — Docker（适用于可复现的部署）[](#路径-4--docker适用于可复现的部署)

Docker 镜像将完整的服务器——包括 Bun 运行时、已构建的子进程服务器和 WebUI——打包到单个容器中。对于 CI 流水线、物理隔离环境，或任何需要稳定可靠运行时的场景，这是最简洁的选择。

### 构建与运行[](#构建与运行)

BASH

Copy code

\`\`\`
# 构建镜像
docker buildx build -f Dockerfile.server -t craft-agent-server .

# 使用令牌运行
docker run --rm -p 9100:9100 \\
  --user $(id -u):$(id -g) \\
  -e HOME=/home/craftagents \\
  -e CRAFT_SERVER_TOKEN=$(openssl rand -hex 32) \\
  craft-agent-server
\`\`\`

\`--user\` 参数将容器的文件系统权限映射到你的主机用户，确保卷挂载能正常工作。该镜像暴露 \`9100\` 端口，同时用于 WebSocket RPC 端点和内置的 WebUI。

### 启用 TLS 与持久化数据[](#启用-tls-与持久化数据)

BASH

Copy code

\`\`\`
docker run -d \\
  -p 9100:9100 \\
  -e CRAFT_SERVER_TOKEN=$TOKEN \\
  -e CRAFT_RPC_TLS_CERT=/certs/cert.pem \\
  -e CRAFT_RPC_TLS_KEY=/certs/key.pem \\
  -v ./certs:/certs:ro \\
  -v craft-data:/home/craftagents/.craft-agent \\
  craft-agent-server
\`\`\`

\`craft-data\` 卷会在容器重启之间持久化保存你的工作区配置、会话和凭证。出于安全考虑，请以 \`:ro\`（只读）模式挂载证书。

### 冒烟测试验证[](#冒烟测试验证)

代码仓库包含一个全面的冒烟测试，它会启动一个容器，等待其就绪，并运行 CLI 的 21 步 \`--validate-server\` 集成测试：

BASH

Copy code

\`\`\`
bash scripts/docker-smoke-test.sh craft-agent-server
\`\`\`

来源：[Dockerfile.server](Dockerfile.server#L1-L95)、[scripts/docker-smoke-test.sh](scripts/docker-smoke-test.sh#L1-L116)、[README.md](README.md#L260-L290)

## 后续操作[](#后续操作)

一旦 Craft Agents 成功运行，以下是按价值排序的最具影响力的后续步骤：

优先级

操作

原因

🔴 高

**连接你的第一个来源**

告诉 agent“将 Slack 添加为来源”——它会处理整个设置过程。这将释放 Craft Agents 的核心能力。

🔴 高

**设置权限模式**

按 \`Shift+Tab\` 切换模式：\`Explore\`（只读）、\`Ask to Edit\`（默认，需提示批准）、\`Auto\`（完全自主）。

🟡 中

**创建技能**

在提示词中描述该技能应执行的操作——agent 会编写 \`SKILL.md\` 并将其激活。后续可通过 \`@skill-name\` 引用它。

🟡 中

**体验 WebUI**

如果运行的是无头服务器，请在浏览器中打开 \`http://localhost:9100\` 以使用完整的会话界面。

🟢 低

**导入 Claude Code 配置**

告诉 agent“从 Claude Code 导入我的技能”，以迁移你现有的 MCP 服务器和技能。

### 推荐阅读顺序[](#推荐阅读顺序)

为了加深你对 Craft Agents 底层运行机制的理解，请按照以下路径阅读文档：

1.  **[安装方式](/lukilabs/craft-agents-oss/3-installation-methods)** — 详细拆解每种安装选项，包括系统需求和故障排除。
2.  **[一键安装脚本](/lukilabs/craft-agents-oss/4-one-line-install-scripts)** — 深入剖析安装脚本、其验证逻辑以及如何进行自定义。
3.  **[Monorepo 架构](/lukilabs/craft-agents-oss/8-monorepo-architecture)** — 理解 \`packages/\` 和 \`apps/\` 目录之间的关联以及依赖关系图。
4.  **[权限模式系统](/lukilabs/craft-agents-oss/13-permission-mode-system)** — 了解三级权限系统的工作原理及如何自定义规则。
5.  **[会话与工作区模型](/lukilabs/craft-agents-oss/18-session-and-workspace-model)** — 探索会话的持久化机制、工作区如何隔离状态，以及生命周期事件的流转。

若想进行实践探索，请跳转至 **[BaseAgent 抽象层](/lukilabs/craft-agents-oss/9-baseagent-abstraction)** 以理解 agent 循环，或前往 **[来源与技能](/lukilabs/craft-agents-oss/19-sources-and-skills)** 以掌握其可扩展性模型。`;export{n as default};
