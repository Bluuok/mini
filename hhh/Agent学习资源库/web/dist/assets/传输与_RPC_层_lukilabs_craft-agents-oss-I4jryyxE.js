const n=`# 传输与 RPC 层 | lukilabs/craft-agents-oss


---
传输与 RPC 层是 Craft Agents 桌面应用的神经系统——一个基于自定义 WebSocket 的 RPC 框架。它用专为双模运行（本地嵌入式服务器和远程无头服务器）设计的协议，取代了 Electron 内置的 \`ipcMain\`/\`ipcRenderer\`。这种架构使得同一套渲染器代码能够透明地与本地进程内服务器或网络上的远程服务器进行通信，同时保留了 UI 组件所依赖的类型安全的 \`ElectronAPI\` 接口。

## 架构概览[](#架构概览)

传输层遵循三层架构：**线路协议**（客户端与服务端共享）、**服务端传输层**（\`server-core\` 中的 \`WsRpcServer\`）以及**客户端传输层**（Electron 应用中的 \`WsRpcClient\` + \`RoutedClient\`）。声明式的**通道映射**和代理**构建器**将 RPC 通道字符串转换为渲染器使用的嵌套 \`ElectronAPI\` 对象。

Syntax error in textmermaid version 11.6.0

来源：[index.ts](apps/electron/src/transport/index.ts), [bootstrap.ts](apps/electron/src/preload/bootstrap.ts)

## 线路协议[](#线路协议)

该协议定义在 \`@craft-agent/shared/protocol\` 中，是所有客户端与服务器之间的稳定契约。线路上的每条消息都是一个经过 JSON 编码的 \`MessageEnvelope\`，包含一个决定其语义的 \`type\` 判别字段。

### 消息类型[](#消息类型)

类型

方向

用途

\`handshake\`

客户端 → 服务端

发起连接；携带 \`protocolVersion\`、\`workspaceId\`、\`token\`、\`webContentsId\`、\`clientCapabilities\` 以及 \`lastSeq\`（用于重连）

\`handshake_ack\`

服务端 → 客户端

确认连接；分配 \`clientId\`，返回 \`registeredChannels\`、\`serverVersion\`、\`reconnected\` 和 \`stale\` 标志

\`request\`

客户端 → 服务端

RPC 调用，包含 \`id\`、\`channel\`、\`args\`

\`response\`

服务端 → 客户端

RPC 结果，包含 \`id\`、\`result\` 或 \`error\`

\`event\`

服务端 → 客户端

推送通知，包含 \`channel\`、\`args\`、\`seq\`

\`error\`

服务端 → 客户端

协议级错误（认证失败、版本不匹配）

\`sequence_ack\`

客户端 → 服务端

确认已处理的事件 \`seq\`，以清理缓冲区

协议版本固定为 \`'1.0'\`（[types.ts](packages/shared/src/protocol/types.ts#L104)）。如果客户端版本不匹配，服务端会通过 \`PROTOCOL_VERSION_UNSUPPORTED\` 错误码拒绝连接。错误码构成了一个可辨识联合类型（discriminated union），涵盖了处理程序错误、认证失败、超时场景以及能力不可用等情况（[types.ts](packages/shared/src/protocol/types.ts#L75-L89)）。

### 推送目标[](#推送目标)

事件使用 \`PushTarget\` 可辨识联合类型来控制传递范围：

目标

范围

用例

\`{ to: 'all' }\`

每个已连接的客户端

全局广播（主题变更、更新可用性）

\`{ to: 'workspace', workspaceId }\`

特定工作区内的客户端

会话事件、来源/技能变更

\`{ to: 'client', clientId }\`

单个客户端

能力请求、单窗口事件

来源：[types.ts](packages/shared/src/protocol/types.ts), [events.ts](packages/shared/src/protocol/events.ts)

## 通道注册表[](#通道注册表)

所有 RPC 通道名称均定义在一个名为 \`RPC_CHANNELS\` 的嵌套对象中（[channels.ts](packages/shared/src/protocol/channels.ts)），按领域命名空间组织。线路格式的字符串值（如 \`'sessions:getMessages'\`）是稳定的 API 契约；而嵌套的键路径仅供内部使用，可自由重组。该注册表包含约 300 多个通道，涵盖会话、工作区、文件、主题、设置、OAuth、自动化、浏览器窗格等。

为了实现路由，通道在 [routing.ts](packages/shared/src/protocol/routing.ts) 中被进一步分类：

分类

数量

路由方式

**\`LOCAL_ONLY_CHANNELS\`**

~50

始终路由到本地嵌入式服务器（窗口管理、应用更新、主题）

**\`REMOTE_ELIGIBLE_CHANNELS\`**

~250

路由到拥有当前活动工作区的服务器（会话、来源、技能、文件）

这种分类是 \`RoutedClient\` 通道调度逻辑的基础。

来源：[channels.ts](packages/shared/src/protocol/channels.ts), [routing.ts](packages/shared/src/protocol/routing.ts)

## 编解码与序列化[](#编解码与序列化)

编解码器负责 \`MessageEnvelope\` 对象的双向序列化。它使用 JSON 序列化，并对 \`Uint8Array\` 值（文件附件、缩略图）进行特殊编码处理，将其转换为 \`{ __craftRpcType: 'u8', base64: '...' }\` 的线路传输对象。编解码器在反序列化时会验证信封的结构，确保必填字段（\`id\`、\`type\`）存在，且 \`type\` 是已识别的消息类型。

共享编解码器实现于 \`packages/server-core/src/transport/codec.ts\`（[codec.ts](packages/server-core/src/transport/codec.ts)），并由 Electron 传输层重新导出（[codec.ts](apps/electron/src/transport/codec.ts)）。

编解码器能透明地处理 \`Uint8Array\` 的往返转换——文件附件、缩略图及其他二进制数据在发送时进行 base64 编码，在接收时解码，处理程序或 UI 代码对此转换完全无感。这从根本上消除了一类因标准 \`JSON.stringify\` 导致二进制数据损坏的 Bug。

来源：[codec.ts](packages/server-core/src/transport/codec.ts)

## 服务端传输层（\`WsRpcServer\`）[](#服务端传输层wsrpcserver)

\`WsRpcServer\` 类（[server.ts](packages/server-core/src/transport/server.ts)）是一个基于 \`ws\` 库构建的全功能 WebSocket RPC 服务器，运行在 Electron 主进程（或无头服务器）中。它管理客户端连接的完整生命周期。

### 连接生命周期[](#连接生命周期)

Syntax error in textmermaid version 11.6.0

### 事件缓冲与可靠交付[](#事件缓冲与可靠交付)

每个 \`ClientConnection\` 都维护着一个近期事件的**环形缓冲区**（\`BufferedEvent[]\`），最大容量为 500 条，TTL 为 30 秒（[types.ts](packages/shared/src/protocol/types.ts#L117-L121)）。当客户端在 60 秒的断连保留窗口内重新连接时，服务器会重放缓冲区中所有 \`seq > lastSeq\`（来自重连握手）的事件。如果缓冲区在断连期间已被清理，\`stale: true\` 标志将通知客户端执行全量状态刷新。

客户端定期（每 5 秒）发送 \`sequence_ack\` 消息，以便服务器从缓冲区中清除已确认的事件（[types.ts](packages/shared/src/protocol/types.ts#L127)）。

### 服务端配置[](#服务端配置)

选项

默认值

描述

\`host\`

\`'127.0.0.1'\`

绑定地址

\`port\`

\`0\`（随机）

绑定端口；0 表示自动选择可用端口

\`requireAuth\`

\`false\`

启用 Bearer Token 认证

\`validateToken\`

—

异步 Token 验证器（在 \`requireAuth: true\` 时必填）

\`validateSessionCookie\`

—

基于 Cookie 的会话验证器，用于 WebUI 认证

\`tls\`

—

用于 \`wss://\` 的 TLS 配置（证书、密钥、CA、密码）

\`serverVersion\`

—

在 \`handshake_ack\` 中发送的应用版本字符串

\`maxClients\`

\`50\`

最大并发客户端数

\`httpHandler\`

—

用于非 WS 请求（如托管 WebUI）的可选 HTTP 处理器

### 服务端发起的 RPC（反向调用）[](#服务端发起的-rpc反向调用)

服务器可以通过 \`invokeClient(clientId, channel, ...args)\` 调用特定客户端上的处理程序。这为**能力系统**提供了支持：服务器请求客户端执行需要访问 Electron \`shell\` 或 \`dialog\` API 的原生操作系统操作（打开 URL、显示对话框、选择文件）。服务器向客户端的 WebSocket 发送一个 \`request\` 类型的信封；客户端执行相应的处理程序并返回 \`response\`。

来源：[server.ts](packages/server-core/src/transport/server.ts), [types.ts](packages/server-core/src/transport/types.ts)

## 客户端传输层（\`WsRpcClient\`）[](#客户端传输层wsrpcclient)

\`WsRpcClient\` 类（[client.ts](apps/electron/src/transport/client.ts)）是 WebSocket RPC 客户端，通过预加载桥接在渲染器进程中运行。它实现了 \`RpcClient\` 接口，并增加了丰富的连接管理功能。

### 连接状态机[](#连接状态机)

Syntax error in textmermaid version 11.6.0

客户端暴露了一个丰富的 \`TransportConnectionState\` 对象，包含 \`mode\`（本地/远程）、\`status\`、\`url\`、重试 \`attempt\`、\`nextRetryInMs\`，以及带有分类 \`kind\`（\`auth\`、\`protocol\`、\`timeout\`、\`network\`、\`server\`、\`unknown\`）的结构化 \`lastError\`。错误分类将 WebSocket 关闭码和 Error 对象映射为语义化的错误类型（[client.ts](apps/electron/src/transport/client.ts#L949-L967)）。

### 指数退避重连[](#指数退避重连)

在意外断开连接时，客户端会以指数退避策略调度重连（基础时间约 1 秒，上限为 \`maxReconnectDelay\`，默认 30 秒）。\`reconnectNow()\` 方法允许立即尝试重连。成功重连后，客户端会发出一个合成的 \`__transport:reconnected\` 事件，以触发渲染器中的陈旧会话恢复机制。

### 传输模式检测[](#传输模式检测)

客户端根据连接 URL 推断其运行模式：\`ws://127.0.0.1\` 或 \`ws://localhost\` 被归类为 \`'local'\`；所有其他 URL 均为 \`'remote'\`（[client.ts](apps/electron/src/transport/client.ts#L902)）。对于通过未加密的 \`ws://\` 连接到非本地服务器的远程连接，会在预加载层被显式拦截（[bootstrap.ts](apps/electron/src/preload/bootstrap.ts#L68-L77)）。

### 支持 TLS 的 Node.js WebSocket[](#支持-tls-的-nodejs-websocket)

在 Electron 主进程中，\`createWebSocket()\` 直接使用 \`ws\` 库以支持 TLS 选项（包括用于自签名证书的 \`rejectUnauthorized: false\`）。在渲染器（浏览器上下文）中，它会降级使用全局的 \`WebSocket\` 构造函数（[client.ts](apps/electron/src/transport/client.ts#L325)）。

\`isChannelAvailable(channel)\` 方法实现了优雅降级：渲染器可以在发起调用前检查服务器是否宣告了对应的处理程序。这对于新旧版本混合部署的场景至关重要，因为较新的客户端可能会引用旧版服务器尚未实现的通道。

来源：[client.ts](apps/electron/src/transport/client.ts)

## 路由客户端（\`RoutedClient\`）[](#路由客户端routedclient)

\`RoutedClient\` 是实现双模运行的核心创新（[routed-client.ts](apps/electron/src/transport/routed-client.ts)）。它封装了两个 \`WsRpcClient\` 实例：一个持久的 \`localClient\`（始终连接到嵌入式 Electron 服务器）和一个可替换的 \`workspaceClient\`（连接到拥有当前活动工作区的服务器）。

### 路由逻辑[](#路由逻辑)

每次 \`invoke()\` 和 \`on()\` 调用都会通过 \`isLocalOnly(channel)\` 进行分类：

-   **LOCAL\\_ONLY 通道**（工作区增删改查、窗口管理、应用更新、主题）始终路由到 \`localClient\`
-   **REMOTE\\_ELIGIBLE 通道**（会话、文件、来源、技能、自动化）路由到 \`workspaceClient\`

当发生工作区切换时（通过 \`SWITCH_WORKSPACE\`），\`RoutedClient\` 会拦截响应并透明地替换 \`workspaceClient\`。对于远程工作区切换，它会通过注册的 \`WorkspaceClientFactory\` 创建新的 \`WsRpcClient\`，建立工作区 ID 映射（本地 ID → 远程 ID），并采用“先建后断”（make-before-break）策略重新连接所有远程监听器。

### 工作区 ID 转换[](#工作区-id-转换)

远程服务器使用各自的工作区 ID，而渲染器操作的是本地工作区 ID。\`RoutedClient\` 维护了一个 \`workspaceIdMapping\`，用于转换 RPC 参数中的工作区 ID。这种转换同时处理顶层的字符串参数（如 \`getSkills(workspaceId)\`）以及包含 \`workspaceId\` 属性的对象参数（如 \`testAutomation({ workspaceId, ... })\`）（[routed-client.ts](apps/electron/src/transport/routed-client.ts#L95-L113)）。

### 监听器重新订阅[](#监听器重新订阅)

符合远程路由条件的监听器会被记录在 \`remoteListeners\` 映射中。当工作区客户端被替换时，所有被记录的监听器都会在旧客户端断开之前重新订阅到新客户端上（先建后断），从而确保在工作区切换期间实现零事件丢失（[routed-client.ts](apps/electron/src/transport/routed-client.ts#L200-L240)）。

来源：[routed-client.ts](apps/electron/src/transport/routed-client.ts)

## 预加载引导与 API 构建器[](#预加载引导与-api-构建器)

预加载脚本（[bootstrap.ts](apps/electron/src/preload/bootstrap.ts)）是沙盒化渲染器与传输层之间的关键桥梁。它以两种模式运行：

模式

触发条件

传输方式

**常规模式**

默认（无 \`CRAFT_SERVER_URL\`）

具备本地 + 工作区路由的 \`RoutedClient\`

**瘦客户端模式**

\`CRAFT_SERVER_URL\` 环境变量

连接到远程服务器的单个 \`WsRpcClient\`

### 能力处理程序[](#能力处理程序)

预加载脚本注册了客户端的能力处理程序，允许服务器在客户端机器上调用原生操作系统操作：

能力

实现方式

对应操作

\`client:openExternal\`

\`shell.openExternal()\`

在默认浏览器中打开 URL

\`client:openPath\`

\`shell.openPath()\`

使用操作系统默认应用打开文件

\`client:showItemInFolder\`

\`shell.showItemInFolder()\`

在 Finder/资源管理器中显示文件

\`client:confirmDialog\`

\`ipcRenderer.invoke(__dialog:showMessageBox)\`

显示原生确认对话框

\`client:openFileDialog\`

\`ipcRenderer.invoke(__dialog:showOpenDialog)\`

显示原生文件选择器

这些能力会在握手阶段通过 \`clientCapabilities\` 进行宣告，使得服务器即使在远程/无头模式下也能执行 UI 操作（[capabilities.ts](packages/server-core/src/transport/capabilities.ts)）。

### \`buildClientApi\` — 代理工厂[](#buildclientapi--代理工厂)

\`buildClientApi()\` 函数（[build-api.ts](apps/electron/src/transport/build-api.ts)）遍历 \`CHANNEL_MAP\`，并生成一个与 \`ElectronAPI\` TypeScript 接口匹配的代理对象。每个条目要么是 \`invoke\`（返回 Promise），要么是 \`listener\`（返回取消订阅函数）。以点号分隔的键（如 \`'browserPane.create'\`）会被展开为嵌套的命名空间对象，从而生成 \`api.browserPane.create()\` 的调用形式。

这种方法用一个 65 行的声明式映射加上 66 行的构建器，取代了原本 329 行的手写预加载代码，同时通过 \`ElectronAPI\` 接口类型断言保留了完整的编译时类型安全。

### 通道映射结构[](#通道映射结构)

\`CHANNEL_MAP\`（[channel-map.ts](apps/electron/src/transport/channel-map.ts)）是一个包含 380 个条目的声明式映射，覆盖了 20 多个领域命名空间：

命名空间

示例通道

数量

Sessions

\`getSessions\`, \`sendMessage\`, \`cancelProcessing\`, \`onSessionEvent\`

~25

Files

\`readFile\`, \`readFileBinary\`, \`openFileDialog\`, \`storeAttachment\`

~9

Workspaces

\`getWorkspaces\`, \`createWorkspace\`, \`checkWorkspaceSlug\`

~5

Browser Pane

\`browserPane.create\`, \`browserPane.navigate\`, \`browserPane.onStateChanged\`

~14

Theme

\`getAppTheme\`, \`setColorTheme\`, \`onAppThemeChange\`

~14

Automations

\`getAutomations\`, \`testAutomation\`, \`onAutomationsChanged\`

~8

OAuth/Auth

\`performOAuth\`, \`startClaudeOAuth\`, \`startChatGptOAuth\`

~15

LLM Connections

\`listLlmConnections\`, \`testLlmConnection\`, \`saveLlmConnection\`

~10

Labels/Statuses

\`listLabels\`, \`createLabel\`, \`listStatuses\`, \`reorderStatuses\`

~8

Other

Menu, git, power, caching, badge, notification, views 等

~40+

来源：[bootstrap.ts](apps/electron/src/preload/bootstrap.ts), [build-api.ts](apps/electron/src/transport/build-api.ts), [channel-map.ts](apps/electron/src/transport/channel-map.ts)

## 能力与反向 RPC[](#能力与反向-rpc)

能力系统实现了一种**服务端到客户端的 RPC** 模式，这对于需要在用户机器上触发原生操作系统操作的远程/无头部署场景至关重要。该系统定义在 [capabilities.ts](packages/server-core/src/transport/capabilities.ts) 中。

Syntax error in textmermaid version 11.6.0

客户端会在握手阶段通过 \`clientCapabilities\` 数组宣告其能力。服务器可以通过握手响应中的 \`registeredChannels\` 检查能力的可用性。这种双向 RPC 模式意味着传输层是真正对称的——双方都可以作为调用方和响应方。

来源：[capabilities.ts](packages/server-core/src/transport/capabilities.ts), [types.ts](packages/server-core/src/transport/types.ts)

## 协议常量与调优[](#协议常量与调优)

常量

值

用途

\`PROTOCOL_VERSION\`

\`'1.0'\`

线路协议版本

\`HEARTBEAT_INTERVAL_MS\`

\`30,000\`

服务端心跳 Ping 间隔

\`HEARTBEAT_MAX_MISSED\`

\`2\`

导致终止连接的丢失 Pong 次数（60 秒容错）

\`REQUEST_TIMEOUT_MS\`

\`30,000\`

默认 RPC 请求超时时间

\`EVENT_BUFFER_MAX_SIZE\`

\`500\`

每个客户端环形缓冲区的最大事件数

\`EVENT_BUFFER_TTL_MS\`

\`30,000\`

事件缓冲区淘汰时间

\`DISCONNECTED_CLIENT_TTL_MS\`

\`60,000\`

客户端断连后的缓冲区保留时间

\`SEQUENCE_ACK_INTERVAL_MS\`

\`5,000\`

客户端发送确认以清理缓冲区的间隔

来源：[types.ts](packages/shared/src/protocol/types.ts)

## 运行模式[](#运行模式)

传输层支持三种不同的部署拓扑：

Syntax error in textmermaid version 11.6.0

模式

传输客户端

服务器

能力

**嵌入式**

\`RoutedClient\`（工作区 = 本地）

本地 \`WsRpcServer\`

完整能力（文件访问、浏览器窗格、原生对话框）

**远程工作区**

\`RoutedClient\`（工作区 = 远程）

本地 + 远程 \`WsRpcServer\`

完整能力 + 远程服务器会话管理

**瘦客户端**

单个 \`WsRpcClient\`

远程 \`WsRpcServer\`

通过反向 RPC 获得的操作系统能力

来源：[bootstrap.ts](apps/electron/src/preload/bootstrap.ts#L60-L154)

## 测试[](#测试)

传输层包含了覆盖多个维度的全面测试：

-   **通道映射一致性**——穷举测试，验证每个 \`RPC_CHANNELS\` 条目都被分类为 \`LOCAL_ONLY\` 或 \`REMOTE_ELIGIBLE\`（[channel-map-parity.test.ts](apps/electron/src/transport/__tests__/channel-map-parity.test.ts)）
-   **编解码器往返**——包含二进制数据的序列化/反序列化（[codec.test.ts](apps/electron/src/transport/__tests__/codec.test.ts)）
-   **路由客户端**——工作区切换、监听器重新订阅、ID 映射（[routed-client.test.ts](apps/electron/src/transport/__tests__/routed-client.test.ts)）
-   **服务器生命周期**——连接、心跳、重连、缓冲区清理（[server-lifecycle.test.ts](packages/server-core/src/transport/__tests__/server-lifecycle.test.ts)）

来源：[**tests**/](apps/electron/src/transport/__tests__)

## 后续步骤[](#后续步骤)

在了解了渲染器与服务器之间的数据流向后，可以探索以下相关层级：

-   [会话与工作区模型](/lukilabs/craft-agents-oss/18-session-and-workspace-model) ——流经传输层的数据结构
-   [无头远程服务器](/lukilabs/craft-agents-oss/22-headless-remote-server) ——服务端如何以独立模式部署
-   [WebUI 与会话查看器](/lukilabs/craft-agents-oss/23-webui-and-session-viewer) ——Web 客户端如何使用简化的传输连接
-   [Electron 主进程](/lukilabs/craft-agents-oss/15-electron-main-process) ——如何引导本地服务器并注册处理程序`;export{n as default};
