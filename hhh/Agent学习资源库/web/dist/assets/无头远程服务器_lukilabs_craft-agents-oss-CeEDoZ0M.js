const e=`# 无头远程服务器 | lukilabs/craft-agents-oss


---
Headless 远程服务器是一个独立的、不依赖 Electron 的运行时，它通过 WebSocket RPC 传输层暴露完整的 Craft Agents 后端。它使远程客户端（桌面应用、CLI 或基于浏览器的 WebUI）能够连接到集中的 Agent 服务器，进行会话管理、工具执行和模型编排，而无需显示器。本文将从服务器的引导序列开始，追溯其传输层、身份验证模型和部署选项。

## 架构概览[](#架构概览)

Headless 服务器被解构为三层：\`packages/server/src/index.ts\` 中负责连接环境配置的轻量级**入口点**，\`packages/server-core/src/bootstrap/headless-start.ts\` 中负责编排启动和关闭的**引导引擎**，以及 \`packages/server-core/src/runtime/platform-headless.ts\` 中用 Headless 安全等效项（控制台日志记录、\`sharp\` 图像处理、空操作的 GUI 方法）替换所有 Electron 依赖项的**平台抽象层**。在此基础之上，坐落着 WebSocket RPC 服务器、可选的 WebUI 处理程序以及健康检查 HTTP 端点。

来源：[index.ts](packages/server/src/index.ts)、[headless-start.ts](packages/server-core/src/bootstrap/headless-start.ts)、[platform-headless.ts](packages/server-core/src/runtime/platform-headless.ts)

Syntax error in textmermaid version 11.6.0

## 引导序列[](#引导序列)

启动过程遵循严格的顺序原则，旨在配置错误时快速失败。当 \`packages/server/src/index.ts\` 运行时，它首先评估 \`--generate-token\` CLI 标志——如果存在，它会打印一个密码学上随机的 48 字符十六进制令牌并立即退出（[index.ts#L35-L37](packages/server/src/index.ts#L35-L37)）。否则，它将继续执行完整的引导路径。

\`server-core\` 中的 \`bootstrapServer()\` 函数接受一个由 \`TSessionManager\` 和 \`THandlerDeps\` 参数化的通用选项对象，使其可以在 Electron 嵌入式服务器和独立的 Headless 变体中复用（[headless-start.ts#L188-L190](packages/server-core/src/bootstrap/headless-start.ts#L188-L190)）。引导过程中的序列如下：

1.  **令牌验证** —— 检查服务器令牌（来自 \`options.serverToken\` 或 \`CRAFT_SERVER_TOKEN\` 环境变量）的最小长度（16 个字符）和熵。单字符重复将被直接拒绝；少于 8 个唯一字符会发出警告但继续执行（[headless-start.ts#L81-L98](packages/server-core/src/bootstrap/headless-start.ts#L81-L98)）。
2.  **平台创建** —— \`createHeadlessPlatform()\` 构建一个 \`PlatformServices\` 对象，包含结构化控制台记录器（带有 ISO 时间戳的行）、基于 \`sharp\` 的图像处理，以及显式为 \`undefined\` 的 GUI 方法（[platform-headless.ts#L44-L89](packages/server-core/src/runtime/platform-headless.ts#L44-L89)）。
3.  **配置初始化** —— \`ensureConfigDir()\` 创建 \`~/.craft-agent\`，如果不存在默认工作区配置，\`ensureGlobalConfigExists()\` 会生成一个（[headless-start.ts#L168-L178](packages/server-core/src/bootstrap/headless-start.ts#L168-L178)）。
4.  **获取锁** —— 位于 \`~/.craft-agent/.server.lock\` 的基于 PID 的锁文件可防止重复的服务器实例。该锁机制能够感知 Docker PID-1 的复用，并会覆盖之前容器生命周期遗留的过期锁（[headless-start.ts#L126-L167](packages/server-core/src/bootstrap/headless-start.ts#L126-L167)）。
5.  **RPC 服务器构建** —— 使用解析出的主机、端口、TLS 配置、令牌验证器和可选的 HTTP 处理程序实例化一个 \`WsRpcServer\`（[headless-start.ts#L248-L264](packages/server-core/src/bootstrap/headless-start.ts#L248-L264)）。
6.  **处理程序注册与会话初始化** —— 绑定所有 RPC 处理程序，将会话事件接收器连接到 \`wsServer.push()\`，并初始化会话管理器（[headless-start.ts#L275-L284](packages/server-core/src/bootstrap/headless-start.ts#L275-L284)）。

关闭过程会谨慎地逆转此顺序：向所有连接的客户端广播 \`server:shuttingDown\` 事件，并提供 2 秒的宽限期，然后停止模型刷新，清理会话，关闭 WebSocket 服务器，释放 OAuth 流程存储，最后释放锁文件（[headless-start.ts#L295-L330](packages/server-core/src/bootstrap/headless-start.ts#L295-L330)）。

来源：[headless-start.ts](packages/server-core/src/bootstrap/headless-start.ts#L188-L380)、[platform-headless.ts](packages/server-core/src/runtime/platform-headless.ts#L44-L89)

服务器将其 URL 和令牌作为 \`CRAFT_SERVER_URL=...\` 和 \`CRAFT_SERVER_TOKEN=...\` 行写入标准输出。\`apps/cli/src/server-spawner.ts\` 中的 CLI 生成器会读取这些行以发现服务器的实际地址——这是以编程方式检测服务器何时准备就绪的标准方法（[server-spawner.ts#L85-L110](apps/cli/src/server-spawner.ts#L85-L110)）。

## WebSocket RPC 传输层[](#websocket-rpc-传输层)

\`packages/server-core/src/transport/server.ts\` 中的 \`WsRpcServer\` 类是通信骨干。它封装了 \`ws\` 库的 \`WebSocketServer\`，并在此基础上增加了身份验证、感知二进制的序列化、每个客户端的事件缓冲以及心跳驱动的存活检测。

### 连接生命周期[](#连接生命周期)

每个 WebSocket 连接在 RPC 通道激活之前都要经历一个握手协议。客户端发送一个包含其身份验证令牌（作为信封负载中的 Bearer 令牌）、协议版本以及可选的公告功能集的 \`handshake\` 信封。服务器根据配置的密钥验证令牌，检查协议版本兼容性，并响应包含服务器版本和分配的客户端 ID 的 \`handshake_ack\`（[server.ts#L355-L400](packages/server-core/src/transport/server.ts#L355-L400)）。

Syntax error in textmermaid version 11.6.0

### 身份验证方法[](#身份验证方法)

服务器支持两种可共存的身份验证机制：

机制

Header / 字段

使用场景

验证方式

**Bearer 令牌**

信封负载中的 \`handshake.token\`

CLI 和编程客户端

\`validateToken(t) === serverToken\`

**会话 Cookie**

HTTP 升级时的 \`Cookie: craft_session=<jwt>\`

基于浏览器的 WebUI

通过 JWT 验证的 \`validateSessionCookie(cookieHeader)\`

仅当 \`CRAFT_WEBUI_DIR\` 存在且设置了 \`CRAFT_SERVER_TOKEN\` 时，Cookie 路径才会启用——否则 \`validateSessionCookie\` 未定义，升级路径将忽略 Cookie（[index.ts#L128-L157](packages/server/src/index.ts#L128-L157)）。

### 事件缓冲与重放[](#事件缓冲与重放)

每个客户端连接都维护一个近期服务器推送事件的环形缓冲区。发布事件时，服务器会分配一个针对该客户端的序列号，并保留序列化后的信封。在重新连接时（来自同一逻辑客户端的新 WebSocket 连接），服务器会重放客户端尚未确认的事件，确保在短暂的网络中断中不会丢失任何状态（[server.ts#L48-L53](packages/server-core/src/transport/server.ts#L48-L53)、[server.ts#L727-L755](packages/server-core/src/transport/server.ts#L727-L755)）。缓冲区大小和 TTL 由共享协议常量中的 \`EVENT_BUFFER_MAX_SIZE\` 和 \`EVENT_BUFFER_TTL_MS\` 控制。

### 线路编解码器[](#线路编解码器)

消息被序列化为 JSON 字符串，对 \`Uint8Array\` 值有特殊处理——它们被编码为 \`{ __craftRpcType: "u8", base64: "..." }\` 对象，并在接收时解码回来（[codec.ts](packages/server-core/src/transport/codec.ts)）。编解码器会根据六种已知的消息类型验证信封结构：\`handshake\`、\`handshake_ack\`、\`request\`、\`response\`、\`event\` 和 \`error\`。

来源：[server.ts](packages/server-core/src/transport/server.ts#L78-L121)、[types.ts](packages/server-core/src/transport/types.ts)、[codec.ts](packages/server-core/src/transport/codec.ts)、[push.ts](packages/server-core/src/transport/push.ts)

## TLS 与网络安全[](#tls-与网络安全)

服务器为暴露于网络的部署强制执行明确的安全边界。当 \`CRAFT_RPC_HOST\` 设置为非环回地址（除了 \`127.0.0.1\`、\`localhost\` 或 \`::1\` 之外的任何地址）时，服务器会检查是否配置了 TLS。如果 \`CRAFT_RPC_TLS_CERT\` 和 \`CRAFT_RPC_TLS_KEY\` 都不存在，服务器将**拒绝绑定**并以错误退出，防止身份验证令牌在网络中以明文传输。唯一的覆盖方式是显式的 \`--allow-insecure-bind\` CLI 标志（[index.ts#L259-L279](packages/server/src/index.ts#L259-L279)）。

TLS 配置接受在启动时读取的 PEM 编码的证书和密钥文件（可选的 CA 链和加密密钥的密码），并传递给 Node 的 \`https.createServer\`（[index.ts#L92-L106](packages/server/src/index.ts#L92-L106)、[server.ts#L67-L76](packages/server-core/src/transport/server.ts#L67-L76)）。

场景

行为

建议

绑定到 \`127.0.0.1\` / \`localhost\`

允许无 TLS 的 \`ws://\`

仅限开发环境

绑定到 \`0.0.0.0\`，无 TLS

**错误退出**（除非使用 \`--allow-insecure-bind\`）

严禁用于生产环境

绑定到 \`0.0.0.0\`，有 TLS

\`wss://\` —— 防止明文传输

推荐用于生产环境

来源：[index.ts](packages/server/src/index.ts#L259-L279)、[server.ts](packages/server-core/src/transport/server.ts#L67-L76)

## 平台抽象：Headless 与 Electron[](#平台抽象headless-与-electron)

\`PlatformServices\` 接口（[platform.ts#L39-L65](packages/server-core/src/runtime/platform.ts#L39-L65)）定义了所有服务器子系统所依赖的契约。\`createHeadlessPlatform()\` 中的 Headless 实现通过替换每个特定于 Electron 的功能来满足此契约：

PlatformService

Electron 实现

Headless 实现

\`logger\`

文件 + 控制台，带作用域

\`createConsoleLogger()\` —— 带有 ISO 时间戳的标准输出

\`imageProcessor\`

\`nativeImage\` (Electron API)

\`sharp\`（延迟导入）

\`openPath\` / \`openExternal\`

\`shell.openPath()\` / \`shell.openExternal()\`

**\`undefined\`** —— 功能路由到客户端

\`showItemInFolder\` / \`quit\` / \`systemDarkMode\`

Electron API

**\`undefined\`**

\`isPackaged\`

\`app.isPackaged\`

\`CRAFT_IS_PACKAGED\` 环境变量

\`resourcesPath\`

Electron \`process.resourcesPath\`

\`CRAFT_RESOURCES_PATH\` 环境变量或 \`cwd/resources\`

关键的设计决策在于，GUI 操作**不是被静默地空操作**——它们被保留为 \`undefined\`，并且能力系统会将它们路由到连接的客户端。当处理程序需要打开 URL 时，它会调用 \`requestClientOpenExternal(server, clientId, url)\`，这会向客户端发送一个 RPC 请求并返回客户端的响应（[capabilities.ts#L44-L57](packages/server-core/src/transport/capabilities.ts#L44-L57)）。这意味着 Headless 服务器仍然可以触发浏览器打开或文件对话框——该操作只是在连接的任何客户端上执行。

对于浏览器自动化，服务器会注入一个 \`NullBrowserPaneManager\`——这是一个空对象模式，其中每个方法要么返回安全的默认值，要么抛出明确的 \`"Browser automation is not available in headless mode"\` 错误（[null-browser-pane-manager.ts](packages/server-core/src/runtime/null-browser-pane-manager.ts)）。

来源：[platform.ts](packages/server-core/src/runtime/platform.ts#L39-L65)、[platform-headless.ts](packages/server-core/src/runtime/platform-headless.ts#L44-L89)、[capabilities.ts](packages/server-core/src/transport/capabilities.ts#L44-L57)、[null-browser-pane-manager.ts](packages/server-core/src/runtime/null-browser-pane-manager.ts)

## WebUI 集成[](#webui-集成)

当 \`CRAFT_WEBUI_DIR\` 环境变量指向一个包含已构建 WebUI 资源（通常是 \`apps/webui/dist\`）的有效目录时，服务器会在与 WebSocket RPC 服务器**相同的端口**上提供 WebUI。这是通过向 \`WsRpcServer\` 传递一个 \`httpHandler\` 回调来实现的，该回调通过 \`nodeHttpAdapter()\` 路由非 WebSocket 的 HTTP 请求——这是一个将 Node.js 的 \`IncomingMessage\`/\`ServerResponse\` 对转换为 Web 标准的 \`Request\`/\`Response\` 对象的桥梁（[node-adapter.ts](packages/server-core/src/webui/node-adapter.ts)、[index.ts#L219-L246](packages/server/src/index.ts#L219-L246)）。

WebUI 处理程序（\`createWebuiHandler\`）提供以下功能：

-   **静态文件服务**，支持对 HTML、CSS、JS、图像和字体的 MIME 类型解析（[http-server.ts#L30-L48](packages/server-core/src/webui/http-server.ts#L30-L48)）。
-   **基于 JWT 的会话身份验证** —— 使用服务器令牌或单独的 \`CRAFT_WEBUI_PASSWORD\` 登录，返回一个有效期为 24 小时的签名 JWT Cookie（\`craft_session\`）（[auth.ts](packages/server-core/src/webui/auth.ts)）。
-   **速率限制** —— 每个 IP 每 60 秒 5 次尝试，每个时间窗口内全局上限 20 次尝试（[auth.ts#L123-L175](packages/server-core/src/webui/auth.ts#L123-L175)）。
-   **OAuth 回调路由** —— \`/api/oauth/callback\` 完成 Agent 发起的 OAuth 流程，并连接回凭证管理器和会话管理器（[http-server.ts#L113-L142](packages/server-core/src/webui/http-server.ts#L113-L142)、[index.ts#L224-L239](packages/server/src/index.ts#L224-L239)）。

安全 Cookie 行为会被自动检测：如果未设置 \`CRAFT_WEBUI_SECURE_COOKIE\`，服务器会检查 \`X-Forwarded-Proto\` 头（仅来自通过 \`trustedProxies\` 配置的受信任代理）。这意味着 WebUI 在 HTTPS 反向代理后面无需手动配置即可正常工作（[http-server.ts#L84-L88](packages/server-core/src/webui/http-server.ts#L84-L88)）。

来源：[http-server.ts](packages/server-core/src/webui/http-server.ts)、[auth.ts](packages/server-core/src/webui/auth.ts)、[node-adapter.ts](packages/server-core/src/webui/node-adapter.ts)、[index.ts](packages/server/src/index.ts#L128-L157)

## 健康检查端点[](#健康检查端点)

当 \`CRAFT_HEALTH_PORT\` 设置为正整数时，将启动一个可选的 HTTP 健康端点。它使用 \`Bun.serve\` 暴露一个单一路由：\`GET /health\` 返回一个派生自会话管理器状态的 JSON 负载。健康时响应状态为 \`200\`，降级时为 \`503\`，这使其适用于 Kubernetes 存活/就绪探针或负载均衡器健康检查（[headless-start.ts#L336-L378](packages/server-core/src/bootstrap/headless-start.ts#L336-L378)）。

健康端点是一个**独立的** HTTP 服务器——它不与 RPC 共享端口，也不需要身份验证，这是专门为基础设施级别的探针设计的。

来源：[headless-start.ts](packages/server-core/src/bootstrap/headless-start.ts#L336-L378)、[index.ts](packages/server/src/index.ts#L242-L248)

## 配置参考[](#配置参考)

服务器完全通过环境变量进行配置。没有专门针对服务器进程的配置文件——所有行为都在启动时控制。

### 核心配置[](#核心配置)

变量

默认值

描述

\`CRAFT_SERVER_TOKEN\`

_（必填）_

用于客户端握手的身份验证令牌

\`CRAFT_RPC_HOST\`

\`127.0.0.1\`

WebSocket RPC 服务器的绑定地址

\`CRAFT_RPC_PORT\`

\`9100\`

WebSocket RPC 服务器的绑定端口

\`CRAFT_VERSION\`

包版本

在 \`handshake_ack\` 中发送的服务器版本字符串

\`CRAFT_DEBUG\`

\`false\`

启用调试级别的日志记录

\`CRAFT_IS_PACKAGED\`

\`false\`

生产模式标志（抑制调试输出）

### TLS 配置[](#tls-配置)

变量

默认值

描述

\`CRAFT_RPC_TLS_CERT\`

_（无）_

PEM 编码的 TLS 证书路径

\`CRAFT_RPC_TLS_KEY\`

_（无）_

PEM 编码的 TLS 私钥路径

\`CRAFT_RPC_TLS_CA\`

_（无）_

用于客户端证书验证的 PEM 编码 CA 链路径

### WebUI 配置[](#webui-配置)

变量

默认值

描述

\`CRAFT_WEBUI_DIR\`

_（无）_

已构建的 WebUI dist 目录的路径

\`CRAFT_WEBUI_PASSWORD\`

回退到 \`CRAFT_SERVER_TOKEN\`

用于 WebUI 登录的独立密码

\`CRAFT_WEBUI_SECURE_COOKIE\`

从代理头自动检测

强制安全（仅限 HTTPS）的会话 Cookie

### 基础设施[](#基础设施)

变量

默认值

描述

\`CRAFT_HEALTH_PORT\`

\`0\`（禁用）

独立 HTTP 健康端点的端口

\`CRAFT_BUNDLED_ASSETS_ROOT\`

\`cwd\`

捆绑的 Electron 资源（resources）路径

\`CRAFT_APP_ROOT\`

\`cwd\`

覆盖应用程序根路径

\`CRAFT_RESOURCES_PATH\`

\`cwd/resources\`

覆盖资源目录路径

来源：[index.ts](packages/server/src/index.ts#L88-L112)、[headless-start.ts](packages/server-core/src/bootstrap/headless-start.ts#L17-L49)、[platform-headless.ts](packages/server-core/src/runtime/platform-headless.ts#L55-L56)

## 部署方式[](#部署方式)

### Docker 容器[](#docker-容器)

\`Dockerfile.server\` 会生成一个基于 \`oven/bun:1.3-slim\` 的独立镜像。它安装系统依赖项（\`git\`、\`ripgrep\`、\`ca-certificates\`），复制 monorepo 源代码，将 MCP 子进程服务器构建为 CJS 包，通过 Vite 构建 WebUI，并设置合理的默认值：绑定到 \`0.0.0.0:9100\` 并启用 WebUI（[Dockerfile.server](Dockerfile.server)）。

BASH

Copy code

\`\`\`
docker buildx build -f Dockerfile.server -t craft-agent-server .

# 带 WebUI 运行
docker run --rm -p 9100:9100 \\
  --user $(id -u):$(id -g) \\
  -e HOME=/home/craftagents \\
  -e CRAFT_SERVER_TOKEN=<secret> \\
  craft-agent-server

# 带 TLS 和持久化配置运行
docker run --rm -p 9100:9100 \\
  --user $(id -u):$(id -g) \\
  -e HOME=/home/craftagents \\
  -e CRAFT_SERVER_TOKEN=<secret> \\
  -e CRAFT_RPC_TLS_CERT=/certs/cert.pem \\
  -e CRAFT_RPC_TLS_KEY=/certs/key.pem \\
  -v /path/to/certs:/certs:ro \\
  -v ~/.craft-agent:/home/craftagents/.craft-agent \\
  craft-agent-server
\`\`\`

该镜像以非 root 用户（\`craftagents\`）运行，因为 Claude Agent SDK 拒绝以 root 身份执行。在运行时，\`--user\` 标志映射到宿主机的 UID/GID 以保证卷权限的兼容性（[Dockerfile.server#L30-L37](Dockerfile.server#L30-L37)）。

### 独立二进制分发[](#独立二进制分发)

\`scripts/build-server.ts\` 脚本会打包一个独立的分发目录，其中包含 Bun 运行时、\`uv\`（Python 包管理器）、资源（文档、主题、权限、工具图标、MCP 服务器、Shell 包装器）以及特定平台的二进制文件（[build-server.ts](scripts/build-server.ts#L1-L200)）。它支持在 \`x64\`/\`arm64\` 架构上为 \`linux\`/\`darwin\` 进行交叉编译，并可生成压缩的 \`.tar.gz\` 归档文件。

### 源码安装[](#源码安装)

\`scripts/install-server.sh\` 脚本自动执行基于源码的安装：它检查 Bun，安装依赖项，构建 MCP 子进程服务器和 WebUI，生成服务器令牌，并打印运行命令（[install-server.sh](scripts/install-server.sh)）。

### CLI 生成器[](#cli-生成器)

为了开发和测试，CLI 包含一个 \`spawnServer()\` 函数，该函数以子进程形式在随机端口上启动 Headless 服务器，读取其标准输出中的 \`CRAFT_SERVER_URL=\` 行以确认准备就绪，并返回一个包含 \`{ url, token, stop }\` 的句柄（[server-spawner.ts](apps/cli/src/server-spawner.ts#L72-L150)）。\`packages/server/src/__tests__/smoke.test.ts\` 中的冒烟测试使用此模式来验证令牌验证、握手接受以及干净的 SIGTERM 关闭（[smoke.test.ts](packages/server/src/__tests__/smoke.test.ts#L127-L183)）。

来源：[Dockerfile.server](Dockerfile.server)、[build-server.ts](scripts/build-server.ts)、[install-server.sh](scripts/install-server.sh)、[server-spawner.ts](apps/cli/src/server-spawner.ts)

## 关闭协议[](#关闭协议)

服务器实现了一个旨在最大程度减少数据丢失的优雅关闭序列。当接收到 \`SIGINT\` 或 \`SIGTERM\` 时：

1.  向所有连接的客户端推送一个 \`server:shuttingDown\` 事件，并附带 \`graceMs: 2000\` 字段（[headless-start.ts#L300-L304](packages/server-core/src/bootstrap/headless-start.ts#L300-L304)）。
2.  服务器等待 2 秒，让客户端接收并处理该通知。
3.  停止模型刷新服务。
4.  清理会话管理器（刷新任何挂起的会话状态）。
5.  关闭 WebSocket 服务器（终止所有连接）。
6.  释放 OAuth 流程存储。
7.  释放锁文件。

该协议由冒烟测试套件验证，确认 \`SIGTERM\` 产生退出代码 \`0\`（[smoke.test.ts#L169-L183](packages/server/src/__tests__/smoke.test.ts#L169-L183)）。

来源：[headless-start.ts](packages/server-core/src/bootstrap/headless-start.ts#L295-L330)、[smoke.test.ts](packages/server/src/__tests__/smoke.test.ts#L169-L183)

* * *

**后续步骤**：要了解客户端如何与此服务器通信，请参阅 [传输与 RPC 层](/lukilabs/craft-agents-oss/17-transport-and-rpc-layer) 。关于建立在此基础设施之上的会话生命周期，请参阅 [会话与工作区模型](/lukilabs/craft-agents-oss/18-session-and-workspace-model) 。要探索 WebUI 如何使用此服务器，请继续阅读 [WebUI 与会话查看器](/lukilabs/craft-agents-oss/23-webui-and-session-viewer) 。`;export{e as default};
