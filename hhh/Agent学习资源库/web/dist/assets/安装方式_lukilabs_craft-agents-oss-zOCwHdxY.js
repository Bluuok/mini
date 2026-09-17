const n=`# 安装方式 | lukilabs/craft-agents-oss


---
Craft Agents 提供四种不同的安装路径，每种路径都针对不同的使用模式量身定制——从功能完备的打包桌面体验，到用于远程 CI/CD 工作流的无头服务器。了解哪种路径适合你的需求是高效上手的第一步。本页面涵盖了所有受支持的安装方法，并提供了特定平台的详细信息、前置条件检查以及验证步骤。

## 安装全景[](#安装全景)

该项目是一个基于 Bun 驱动的 monorepo，提供三个主要构建产物：**Electron 桌面应用**（功能完备的 GUI 客户端）、**无头服务器**（基于 WebSocket 的后端，用于远程或编程访问）以及 **CLI 客户端**（轻量级终端界面，可连接到本地或远程服务器）。下图说明了这些组件之间的关系，以及每种安装方法会生成哪种构建产物。

Syntax error in textmermaid version 11.6.0

来源：[package.json](package.json#L1-L45)、[Dockerfile.server](Dockerfile.server#L1-L95)、[electron-builder.yml](apps/electron/electron-builder.yml#L1-L50)

## 方法对比[](#方法对比)

在深入了解每种方法之前，请使用下表来确定最适合你工作流的方案。每种方法最终运行的都是同一个核心引擎——区别在于打包方式、传输层和运营模式。

方法

输出产物

平台支持

是否需要 Bun？

是否需要构建？

适用场景

**一键安装**

桌面应用二进制文件

macOS (arm64/x64)、Windows (x64)、Linux (x64)

否

否

绝大多数用户；获取可用应用的最快路径

**从源码构建**

桌面应用 (开发模式)

任何支持 Bun + Electron 的平台

是

是 (自动)

贡献者、自定义修改、调试

**Docker**

无头服务器容器

Linux 容器 (任何宿主操作系统)

否

否 (预构建镜像)

远程服务器、CI/CD、持久化会话

**服务器安装脚本**

无头服务器 (裸机)

macOS、Linux

是

是 (自动)

VPS 托管、自管理基础设施

**CLI 客户端**

终端界面

任何支持 Bun 的平台

是

否

脚本编写、自动化、无头工作流

来源：[scripts/install-app.sh](scripts/install-app.sh#L41-L75)、[scripts/install-app.ps1](scripts/install-app.ps1#L28-L47)、[Dockerfile.server](Dockerfile.server#L1-L30)、[scripts/install-server.sh](scripts/install-server.sh#L28-L45)、[apps/cli/package.json](apps/cli/package.json#L1-L26)

## 方法一：一键安装 (桌面应用)[](#方法一一键安装-桌面应用)

这是**推荐路径**，适合绝大多数用户。只需一条 shell 命令，即可从官方发布渠道下载最新的预构建 Craft Agents 二进制文件，通过 SHA-512 校验和验证其完整性，并将其安装到你平台的标准位置。无需构建工具，无需 Git，也无需运行时依赖项。

安装脚本会从 \`https://agents.craft.do/electron/latest/\` 获取一个 YAML 清单文件，其中包含版本元数据、针对不同架构的下载 URL 以及用于完整性验证的 SHA-512 校验和。整个流程——检测、下载、验证和安装——完全自动化。

### macOS[](#macos)

BASH

Copy code

\`\`\`
curl -fsSL https://agents.craft.do/install-app.sh | bash
\`\`\`

该脚本会检测你的 CPU 架构（Apple Silicon \`arm64\` 或 Intel \`x64\`），下载对应的 \`.zip\` 压缩包，解压 \`Craft Agents.app\` 应用包，将其安装到 \`/Applications\` 目录，并移除 macOS 的隔离属性，从而使应用能够在没有 Gatekeeper 警告的情况下启动 [install-app.sh](scripts/install-app.sh#L210-L291)。

通过 Spotlight 或以下命令启动：

BASH

Copy code

\`\`\`
open -a 'Craft Agents'
\`\`\`

### Windows[](#windows)

POWERSHELL

Copy code

\`\`\`
irm https://agents.craft.do/install-app.ps1 | iex
\`\`\`

此 PowerShell 脚本会检测 x64/x86 架构，下载 NSIS 安装程序 (\`.exe\`)，验证 SHA-512 校验和，运行安装程序（将应用放置在 \`%LOCALAPPDATA%\\Programs\\Craft Agents\\\` 目录中），并将 \`craft-agents\` 命令添加到你的用户 PATH 环境变量中以便在终端访问 [install-app.ps1](scripts/install-app.ps1#L28-L200)。

从“开始”菜单、桌面快捷方式或终端启动：

POWERSHELL

Copy code

\`\`\`
craft-agents
\`\`\`

### Linux (仅限 x64)[](#linux-仅限-x64)

BASH

Copy code

\`\`\`
curl -fsSL https://agents.craft.do/install-app.sh | bash
\`\`\`

在 Linux 上，脚本会下载一个 \`AppImage\` 文件，将其安装到 \`~/.craft-agent/app/\` 目录，并在 \`~/.local/bin/craft-agents\` 创建一个封装脚本，用于处理 Electron 沙盒的特性和清理过期的缓存。如果未安装 \`fusermount\` (FUSE)，脚本会打印警告，因为 AppImage 需要 FUSE 支持 [install-app.sh](scripts/install-app.sh#L293-L370)。

使用以下命令启动：

BASH

Copy code

\`\`\`
craft-agents
\`\`\`

如果找不到 \`craft-agents\` 命令，请将二进制文件目录添加到你的 PATH 中：

BASH

Copy code

\`\`\`
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
\`\`\`

所有三个一键安装脚本在安装前都会执行 **SHA-512 校验和验证**。校验和从官方 YAML 清单中获取，并使用 base64 编码的哈希值与下载的二进制文件进行比较。如果验证失败，安装程序会删除损坏的下载文件并以错误状态退出——确保你永远不会运行被篡改的二进制文件。

## 方法二：从源码构建[](#方法二从源码构建)

从源码构建为你提供了一个支持热重载功能的实时开发环境。如果你想为 Craft Agents 做贡献、自定义 UI 或在代码级别调试行为，这是正确的选择。它需要 [Bun 运行时](https://bun.sh/)（1.0 及以上版本）和 Git。

### 前置条件[](#前置条件)

工具

最低版本

用途

[Bun](https://bun.sh/)

≥ 1.0

JavaScript 运行时、包管理器、测试运行器

[Git](https://git-scm.com/)

任意

克隆代码仓库

[Electron](https://www.electronjs.org/)

39.x

桌面外壳 (作为开发依赖自动安装)

### 分步操作[](#分步操作)

BASH

Copy code

\`\`\`
git clone https://github.com/lukilabs/craft-agents-oss.git
cd craft-agents-oss

# 2. 安装所有工作区依赖
bun install

# 3. 构建并启动桌面应用
bun run electron:start
\`\`\`

\`electron:start\` 脚本会按顺序串联四个构建步骤——主进程、预加载脚本、渲染器 UI 和打包资源——然后针对编译输出启动 Electron [package.json](package.json#L46-L53)。首次运行可能需要 30-60 秒；由于 esbuild 缓存机制，后续运行会更快。

### 带热重载的开发模式[](#带热重载的开发模式)

对于迭代的 UI 开发，请改用热重载开发服务器：

BASH

Copy code

\`\`\`
bun run electron:dev
\`\`\`

这会同时运行 Electron 主进程和 Vite 开发服务器，因此对渲染器中 React 组件的更改会立即生效，而无需完整重建 [package.json](package.json#L54-L55)。

### 类型检查[](#类型检查)

该 monorepo 强制执行 TypeScript 严格模式。在提交贡献之前，请运行：

BASH

Copy code

\`\`\`
bun run typecheck:all
\`\`\`

这会按顺序检查所有核心包、服务器和 Electron 应用 [package.json](package.json#L11-L14)。

## 方法三：Docker (无头服务器)[](#方法三docker-无头服务器)

Docker 方法会生成一个**无头服务器**——一个没有图形界面的 Craft Agents 后端，可通过 WebSocket 访问。这非常适合运行在远程 VPS 上、在 CI/CD 流水线内部，或者作为多个桌面客户端以瘦客户端模式连接的持久化后端。

### 快速开始[](#快速开始)

BASH

Copy code

\`\`\`
# 构建镜像
docker buildx build -f Dockerfile.server -t craft-agent-server .

# 运行容器
docker run -d \\
  --name craft-agents \\
  -p 9100:9100 \\
  --user $(id -u):$(id -g) \\
  -e HOME=/home/craftagents \\
  -e CRAFT_SERVER_TOKEN=$(openssl rand -hex 32) \\
  -v craft-data:/home/craftagents/.craft-agent \\
  craft-agent-server
\`\`\`

\`--user\` 标志将容器进程映射到你的宿主 UID/GID，从而使挂载的卷具有正确的文件权限。\`CRAFT_SERVER_TOKEN\` 是客户端身份验证所必需的——如上所示生成一个随机的 token，并安全保存，因为它无法被恢复 [Dockerfile.server](Dockerfile.server#L6-L25)。

### 镜像包含的内容[](#镜像包含的内容)

此 Dockerfile 使用 \`oven/bun:1.3-slim\` 作为基础镜像，安装系统工具（\`ca-certificates\`、\`git\`、\`ripgrep\`），复制整个 monorepo 源码，运行 \`bun install\`，将 MCP 辅助服务器构建为打包的 CJS 模块，并通过 Vite 编译 WebUI。最终结果是一个在 9100 端口同时提供 WebSocket RPC 端点和 WebUI 的单一容器 [Dockerfile.server](Dockerfile.server#L18-L82)。

镜像暴露的关键环境变量：

变量

默认值

描述

\`CRAFT_RPC_HOST\`

\`0.0.0.0\`

绑定地址 (暴露以供远程访问)

\`CRAFT_RPC_PORT\`

\`9100\`

WebSocket 端口

\`CRAFT_WEBUI_DIR\`

\`/app/apps/webui/dist\`

预构建的 WebUI 资源

\`CRAFT_BUNDLED_ASSETS_ROOT\`

\`/app/apps/electron\`

打包的资源文件

\`CRAFT_SERVER_TOKEN\`

_(必需)_

身份验证 bearer token

### 启用 TLS (远程访问推荐)[](#启用-tls-远程访问推荐)

对于生产环境的部署，请使用 TLS 加密 WebSocket 连接：

BASH

Copy code

\`\`\`
docker run -d \\
  -p 9100:9100 \\
  --user $(id -u):$(id -g) \\
  -e HOME=/home/craftagents \\
  -e CRAFT_SERVER_TOKEN=<token> \\
  -e CRAFT_RPC_TLS_CERT=/certs/cert.pem \\
  -e CRAFT_RPC_TLS_KEY=/certs/key.pem \\
  -v /path/to/certs:/certs:ro \\
  -v craft-data:/home/craftagents/.craft-agent \\
  craft-agent-server
\`\`\`

Dockerfile 默认会创建一个非 root 用户 \`craftagents\`，但你应在运行时使用 \`--user $(id -u):$(id -g)\` 覆盖此设置。Claude Agent SDK 明确拒绝以 root 身份运行，并且匹配宿主 UID/GID 可以防止挂载卷（用于存储会话数据和凭据）出现权限问题 [Dockerfile.server](Dockerfile.server#L34-L40)。

## 方法四：服务器安装脚本[](#方法四服务器安装脚本)

对于裸机无头部署（不使用 Docker），\`install-server.sh\` 脚本会自动化整个设置过程：依赖安装、子进程服务器构建、WebUI 编译以及 token 生成。

### 前置条件[](#前置条件-1)

宿主机上必须安装 **Bun ≥ 1.0**。脚本会检查此项，如果未找到则会退出并显示安装说明 [install-server.sh](scripts/install-server.sh#L28-L35)。

### 运行脚本[](#运行脚本)

BASH

Copy code

\`\`\`
# 在仓库根目录下
bash scripts/install-server.sh
\`\`\`

该脚本按顺序执行以下步骤：

1.  验证 Bun 已安装并打印其版本
2.  使用锁定文件运行 \`bun install\` (如失败则回退到标准安装)
3.  将 MCP 辅助服务器（\`session-mcp-server\` 和 \`pi-agent-server\`）构建为打包的 CJS
4.  通过 Vite 构建 WebUI
5.  生成一个随机的服务器 token
6.  打印包含所有必需环境变量的完整运行命令 [install-server.sh](scripts/install-server.sh#L47-L107)

脚本完成后，使用打印出的命令启动服务器：

BASH

Copy code

\`\`\`
CRAFT_SERVER_TOKEN=<generated-token> \\
CRAFT_WEBUI_DIR=$PWD/apps/webui/dist \\
CRAFT_BUNDLED_ASSETS_ROOT=$PWD/apps/electron \\
bun run packages/server/src/index.ts
\`\`\`

## 方法五：CLI 客户端[](#方法五cli-客户端)

CLI 客户端 (\`@craft-agent/cli\`) 是一个基于终端的界面，可通过 WebSocket 连接到任何正在运行的 Craft Agents 服务器（本地或远程）。它支持会话管理、消息流式传输、服务器验证，以及一个完全自包含的 \`run\` 命令，可以即时生成其专属服务器。

### 安装[](#安装)

CLI 需要完整的代码仓库（它依赖于工作区包 \`@craft-agent/shared\` 和 \`@craft-agent/server-core\`）：

BASH

Copy code

\`\`\`
git clone https://github.com/lukilabs/craft-agents-oss.git
cd craft-agents-oss
bun install

# 直接运行
bun run apps/cli/src/index.ts --help

# 或者全局链接以方便使用
cd apps/cli && bun link
craft-cli --help
\`\`\`

### 快速自包含运行[](#快速自包含运行)

尝试 CLI 的最快方式——无需设置服务器。\`run\` 命令会生成一个临时的无头服务器，创建一个会话，发送你的提示词，流式传输响应，然后退出：

BASH

Copy code

\`\`\`
ANTHROPIC_API_KEY=sk-... bun run apps/cli/src/index.ts run "Hello, world!"
\`\`\`

### 连接到现有服务器[](#连接到现有服务器)

使用环境变量或标志将 CLI 指向正在运行的无头服务器：

BASH

Copy code

\`\`\`
export CRAFT_SERVER_URL=ws://127.0.0.1:9100
export CRAFT_SERVER_TOKEN=<token>
craft-cli ping
\`\`\`

有关包含所有命令、标志和脚本编写模式的完整 CLI 文档，请参阅[一键安装脚本](/lukilabs/craft-agents-oss/4-one-line-install-scripts) 和专门的 [CLI 参考文档](docs/cli.md)。

来源：[apps/cli/package.json](apps/cli/package.json#L1-L26)、[apps/cli/src/index.ts](apps/cli/src/index.ts#L17-L43)

## 将桌面应用连接到远程服务器[](#将桌面应用连接到远程服务器)

无论你使用哪种方法安装桌面应用，都可以通过连接到远程无头服务器，以**瘦客户端模式**运行它。在此模式下，桌面应用在本地渲染 UI，但所有会话逻辑、工具执行和 LLM 调用都在远程服务器上进行。

BASH

Copy code

\`\`\`
CRAFT_SERVER_URL=wss://your-server:9100 \\
CRAFT_SERVER_TOKEN=<token> \\
bun run electron:start
\`\`\`

或者对于预构建的桌面应用，在启动前设置环境变量：

BASH

Copy code

\`\`\`
# macOS
CRAFT_SERVER_URL=wss://your-server:9100 CRAFT_SERVER_TOKEN=<token> open -a 'Craft Agents'

# Windows
$env:CRAFT_SERVER_URL="wss://your-server:9100"; $env:CRAFT_SERVER_TOKEN="<token>"; Start-Process "Craft Agents"

# Linux
CRAFT_SERVER_URL=wss://your-server:9100 CRAFT_SERVER_TOKEN=<token> craft-agents
\`\`\`

来源：[README.md](README.md#L200-L230)

## 验证与故障排除[](#验证与故障排除)

安装完成后，通过一次快速的冒烟测试来验证一切是否正常工作：

方法

验证命令

预期结果

桌面应用

从系统启动器启动

应用窗口打开并显示引导流程

从源码构建

\`bun run electron:start\`

Electron 窗口在开发模式下打开

Docker

检查日志：\`docker logs craft-agents\`

打印出 \`CRAFT_SERVER_URL=ws://...\`

服务器脚本

\`curl http://localhost:9100\` 或检查日志

显示包含 URL 的服务器就绪消息

CLI

\`bun run apps/cli/src/index.ts run "ping"\`

文本响应流式传输到终端

### 调试模式[](#调试模式)

要在桌面应用中启用详细日志记录，请使用 \`-- --debug\` 标志启动（注意双破折号分隔符）[README.md](README.md#L595-L610)：

BASH

Copy code

\`\`\`
# macOS
/Applications/Craft\\ Agents.app/Contents/MacOS/Craft\\ Agents -- --debug

# Linux
./craft-agents -- --debug

# Windows
& "$env:LOCALAPPDATA\\Programs\\Craft Agents\\Craft Agents.exe" -- --debug
\`\`\`

日志会写入特定平台的位置：

-   **macOS:** \`~/Library/Logs/@craft-agent/electron/main.log\`
-   **Windows:** \`%APPDATA%\\@craft-agent\\electron\\logs\\main.log\`
-   **Linux:** \`~/.config/@craft-agent/electron/logs/main.log\`

### 配置存储[](#配置存储)

所有 Craft Agents 配置——包括工作区、加密凭据 (AES-256-GCM)、LLM 连接、主题和会话数据——都存储在 \`~/.craft-agent/\` 目录中。同一台机器上的所有安装方法共享此目录 [README.md](README.md#L463-L482)。

## 下一步[](#下一步)

既然你已经安装了 Craft Agents，接下来的逻辑步骤取决于你选择的方法和目标：

-   **桌面应用用户**：跳转到[快速开始](/lukilabs/craft-agents-oss/2-quick-start) 指南，配置你的第一个 API 连接并创建一个工作区。
-   **服务器/Docker 用户**：探索[无头远程服务器](/lukilabs/craft-agents-oss/22-headless-remote-server) 页面，了解详细的配置、TLS 设置和多客户端管理。
-   **CLI 用户**：继续阅读[一键安装脚本](/lukilabs/craft-agents-oss/4-one-line-install-scripts) ，获取高级 CLI 模式和完整的命令参考。
-   **贡献者**：在深入开发之前，请阅读 [Monorepo 架构](/lukilabs/craft-agents-oss/8-monorepo-architecture) 页面以了解代码库结构。`;export{n as default};
