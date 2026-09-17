const n=`# WebUI 与会话查看器 | lukilabs/craft-agents-oss


---
Craft Agents 平台提供了两个基于浏览器的独立界面，它们服务于根本不同的目的：一个是用于交互式 Agent 会话的**全功能 WebUI**，另一个是用于只读会话记录检查与分享的**独立会话查看器**。两者都是基于 Vite 构建的 React 应用，但它们处于功能谱系的两极——前者通过 WebSocket 桥接复刻桌面端体验，后者是一个完全在客户端处理会话的无状态产物。

## 架构概览[](#架构概览)

这两个应用通过 \`@craft-agent/ui\` 共享统一的设计语言，但它们的运行时架构却大相径庭。WebUI 充当着一个轻量级的适配层，它在引导建立 WebSocket 连接后，完全将控制权委托给 Electron 渲染器的组件树。相比之下，会话查看器是一个自包含的 SPA，它从不建立持久连接——它加载 \`StoredSession\` 数据载荷，并使用运行在 \`readonly\` 模式下的同一个 \`SessionViewer\` 组件进行渲染。

## WebUI：运行在浏览器中的 Electron 渲染器[](#webui运行在浏览器中的-electron-渲染器)

WebUI 并非一个独立的前端——它是一个**运行时适配器**，使 Electron 渲染器的整个组件树能够在浏览器中正常运行。整个策略都体现在引导包装器 [App.tsx](apps/webui/src/App.tsx#L1-L150) 中，它在将控制权交接给共享的 Electron UI 之前，会执行精确的五步初始化序列。

### 初始化协议[](#初始化协议)

引导过程遵循一个包含 \`loading\`、\`error\` 和 \`ready\` 三种状态的确定性状态机。挂载时，\`initialize()\` 函数会[执行严格的握手流程](apps/webui/src/App.tsx#L69-L127)：

1.  **配置获取**：使用 \`credentials: 'same-origin'\` 发起 \`GET /api/config\` 调用以获取 WebSocket URL。若收到 \`401\` 响应，则会立即重定向至 \`/login\`，从而将基于 Cookie 的会话管理确立为认证边界。
2.  **工作区解析**：URL 查询参数 \`?workspace=\` 拥有最高优先级。若不存在，客户端将回退调用 \`GET /api/config/workspaces\`，从服务器获取 \`defaultWorkspaceId\`。此工作区 ID 至关重要——它将成为 WebSocket 握手的一部分，并决定客户端通过推送接收到哪些会话事件。
3.  **API 构建**：\`createWebApi()\` 实例化一个连接到已解析 WebSocket URL 的 \`WsRpcClient\`，并配置 \`autoReconnect: true\` 和 \`mode: 'remote'\`。不发送 Bearer Token——认证依赖于 WebSocket 升级时附加的会话 Cookie。
4.  **全局注入**：将构建好的 API 对象赋值给 \`window.electronAPI\`，这与 Electron 通过其 preload 脚本设置的全局变量完全一致。这是关键的桥梁——所有调用 \`window.electronAPI.openUrl()\` 或 \`window.electronAPI.getSystemTheme()\` 的共享组件都无需修改即可正常工作。
5.  **懒加载挂载**：Electron 渲染器的 \`App\` 组件通过 \`React.lazy()\` 在 \`Suspense\` 边界内加载，确保在 \`window.electronAPI\` 填充之前，没有任何组件能够访问它。

来源：[App.tsx](apps/webui/src/App.tsx#L63-L149)、[web-api.ts](apps/webui/src/adapter/web-api.ts#L1-L10)

### WebAPI 适配器模式[](#webapi-适配器模式)

[createWebApi()](apps/webui/src/adapter/web-api.ts#L63-L66) 函数是 WebUI 的架构基石。它通过组合三个层来构建完整的 \`ElectronAPI\` 实现：

层级

机制

示例

**RPC 基础层**

\`buildClientApi(client, CHANNEL_MAP, ...)\` 为共享通道映射中定义的每个通道生成代理

\`client.invoke('session:create', ...)\`

**Web 覆盖层**

将 \`LOCAL_ONLY\` 方法替换为浏览器等效实现

\`openUrl\` → \`window.open()\`，\`showNotification\` → Web Notifications API

**空操作桩**

无法在浏览器中存在的 Electron 原生操作

\`setTrafficLightsVisible\`、\`menuQuit\`、\`installUpdate\`

该适配器通过 RPC 通道委托工作区切换——\`switchWorkspace\` 调用 \`client.invoke('window:switchWorkspace', wsId)\`，以便相应地更新服务端的推送订阅。文件选取使用编程式创建的 \`<input type="file">\` 元素，而非 Electron 的原生对话框。系统主题检测委托给 \`window.matchMedia('(prefers-color-scheme: dark)')\`，并附带变更监听器以实现实时更新。

来源：[web-api.ts](apps/webui/src/adapter/web-api.ts#L63-L200)

### Node.js 垫片层[](#nodejs-垫片层)

由于共享的渲染器代码存放在 \`apps/electron/src/renderer\`（在 WebUI 的 Vite 配置中被别名为 \`@\`），它会引入浏览器无法解析的 Node.js 模块。[Vite 配置](apps/webui/vite.config.ts#L59-L66) 将 40 多个 Node.js 模块说明符映射到一个单独的垫片文件，其中 \`fs/promises\` 和 \`node:fs/promises\` 被路由到专用垫片，以避免模块解析歧义。

[node-builtins.ts](apps/webui/src/shims/node-builtins.ts#L1-L131) 垫片的设计极其精准：\`path.join\` 和 \`path.basename\` 保留了真实实现（基于正斜杠），\`crypto.randomBytes\` 委托给 \`globalThis.crypto.getRandomValues\`，而 \`fs\` 导出项会在运行时抛出描述性错误，而非静默失败。\`EventEmitter\` 导出项是一个完整的浏览器端实现——而非空操作桩——因为传输层中的 \`WebSocketServer\` 在导入时就需要它，即使浏览器的代码路径从未实例化过服务器。

来源：[vite.config.ts](apps/webui/vite.config.ts#L37-L72)、[node-builtins.ts](apps/webui/src/shims/node-builtins.ts#L1-L20)

### 认证与多入口构建[](#认证与多入口构建)

WebUI 生成一个包含两个 HTML 入口点的[多入口构建](apps/webui/vite.config.ts#L24-L28)：\`index.html\`（主应用）和 \`login.html\`（独立的认证页面）。登录页是一个完全自包含的 HTML 文件，带有内联 CSS——没有 JavaScript 框架，没有 React——具备毛玻璃效果样式、等宽字体的 JWT Token 输入框以及渐变动画。成功认证后，它会通过 \`POST /api/auth/login\` 设置会话 Cookie，并重定向到主应用。

在 Vite 构建中，\`import.meta.env.IS_WEBUI\` 标志被[定义为 \`true\`](apps/webui/vite.config.ts#L76-L77)，这使得共享组件能够有条件地禁用仅限 Electron 的功能（例如，红绿灯窗口控件、原生菜单处理），而无需进行单独构建。

来源：[vite.config.ts](apps/webui/vite.config.ts#L24-L28)、[login.html](apps/webui/src/login.html#L1-L200)

## 会话查看器：无状态会话记录渲染[](#会话查看器无状态会话记录渲染)

会话查看器（\`@craft-agent/viewer\`）是一个[刻意极简的 SPA](apps/viewer/package.json)，以只读模式渲染 Agent 会话记录。它对服务端状态零依赖——会话可通过 URL 加载或本地上传——这使其非常适合在 Cloudflare Pages 上进行静态托管。

### 会话加载策略[](#会话加载策略)

查看器支持三种输入方式，均由 [App.tsx](apps/viewer/src/App.tsx#L53-L134) 和 [SessionUpload](apps/viewer/src/components/SessionUpload.tsx#L19-L161) 组件处理：

方式

实现机制

隐私性

**基于 URL**

通过 \`getSessionIdFromUrl()\` 从 \`/s/{id}\` 路径提取会话 ID，从 \`/s/api/{id}\` 获取数据

托管于服务器

**文件上传**

拖放或文件选择器，接受 \`.json\` 文件

完全本地化

**剪贴板粘贴**

全局 \`paste\` 事件监听器解析 JSON 并校验 \`id\` + \`messages\` 字段

完全本地化

基于 URL 的加载方式与 [Cloudflare Pages 重定向规则](apps/viewer/public/_redirects) 集成，其中 \`/s/*\` 路由通过 SPA 回退机制提供 \`index.html\`，而 \`/s/api/*\` 路由则由 Cloudflare Functions 处理（推测是代理到 R2 或会话 API）。\`popstate\` 事件监听器确保浏览器的前进/后退导航能够正确更新所查看的会话。

来源：[App.tsx](apps/viewer/src/App.tsx#L65-L109)、[SessionUpload.tsx](apps/viewer/src/components/SessionUpload.tsx#L83-L99)、[\\_redirects](apps/viewer/public/_redirects#L1-L8)

### 覆层系统架构[](#覆层系统架构)

当用户在会话查看器中点击某个活动时，[handleActivityClick 回调](apps/viewer/src/App.tsx#L146-L168) 会根据工具类型将其路由到六个专用覆盖层组件之一。该路由逻辑实现了两级分发：

**第一级 — 结构化覆盖层**（Edit/Write 工具）：这些工具会生成文件变更，这些变更被路由到 \`MultiDiffPreviewOverlay\`，并附带计算出的 \`FileChange\` 对象，其中包含文件路径、原始内容和工具类型元数据。查看器会从 Claude 格式的 \`file_path\` 字段中提取文件路径，或者回退使用 PI 格式的 \`path\` 字段。

**第二级 — 解析型覆盖层**（所有其他工具）：\`@craft-agent/ui\` 中的 \`extractOverlayData()\` 工具函数将工具结果解析为带类型的 \`OverlayData\` 判别联合类型，然后将它们匹配到专用组件：

覆盖层组件

工具类型

内容

\`CodePreviewOverlay\`

Read

带行号和语法高亮的源代码

\`MultiDiffPreviewOverlay\`

Edit、Write

并排或统一差异视图

\`TerminalPreviewOverlay\`

Bash、Grep、Glob

经过 ANSI 解析的终端输出

\`JSONPreviewOverlay\`

返回 JSON 的工具

格式化的 JSON，支持节点折叠

\`DocumentFormattedMarkdownOverlay\`

Write (.md/.txt)、WebSearch

渲染的 Markdown，支持链接拦截

\`GenericOverlay\`

未知工具

原始内容；自动检测 Markdown 并路由到文档查看器

来源：[App.tsx](apps/viewer/src/App.tsx#L140-L322)、[index.ts](packages/ui/src/index.ts#L200-L224)

### 渲染管线[](#渲染管线)

查看器以 \`mode="readonly"\` 模式实例化 [\`SessionViewer\`](packages/ui/src/components/chat/SessionViewer.tsx#L75-L243)，这会产生几个具体效果。该组件通过 \`storedToMessage()\` 将 \`StoredMessage[]\` 转换为 \`Message[]\`，使用 \`groupMessagesByTurn()\` 将其按轮次分组，并将每个轮次渲染为 \`UserMessageBubble\`、\`SystemMessage\` 或 \`TurnCard\`。在只读模式下，\`annotationInteractionMode\` 被设置为 \`'tooltip-only'\` 而非 \`'interactive'\`，这会禁用完整的批注编辑功能，同时保留展示效果。\`defaultExpanded\` 属性默认为 \`false\`，默认折叠所有助手轮次，以呈现简洁可扫描的时间线。

来源：[SessionViewer.tsx](packages/ui/src/components/chat/SessionViewer.tsx#L75-L243)

## 共享 UI 包集成[](#共享-ui-包集成)

这两个应用都使用了 \`@craft-agent/ui\`，该包导出了一个专为双平台操作设计的[综合组件目录](packages/ui/src/index.ts#L1-L284)。该包的架构通过 \`PlatformProvider\` 上下文强制执行平台抽象，该上下文注入了 \`PlatformActions\`——一个定义了文件打开、URL 处理、Markdown 预览和活动详情导航的契约。每个消费应用都提供自己的实现：WebUI 的适配器将这些操作映射到 WebSocket RPC，而会话查看器则提供最小化的桩实现（因为它没有服务器连接）。

共享包内的组件层级结构将关注点分离到五个领域：

来源：[index.ts](packages/ui/src/index.ts#L1-L60)、[index.ts](packages/ui/src/index.ts#L200-L284)

## 构建与部署配置[](#构建与部署配置)

属性

WebUI

会话查看器

**包名**

\`@craft-agent/webui\`

\`@craft-agent/viewer\`

**开发端口**

5175

5174

**基础路径**

\`./\` (相对路径)

\`/s/\` (绝对路径)

**入口点**

\`index.html\`、\`login.html\`

\`index.html\`

**Source Maps**

已启用

已启用

**部署方式**

由无头服务器提供服务

Cloudflare Pages (静态)

**认证**

基于 Cookie (\`/api/auth\`)

无 (公开)

**React 别名**

\`@\` → \`electron/src/renderer\`

\`@\` → \`viewer/src\`

**Jotai 插件**

\`babel/plugin-debug-label\`、\`babel/plugin-react-refresh\`

无

WebUI 的 Vite 配置将 \`@craft-agent/ui\` 排除在依赖优化之外（\`optimizeDeps.exclude\`），并使用目标为 \`esnext\` 的顶层 await 支持，反映了其更复杂的模块图。会话查看器在开发阶段将 \`/s/api\` 代理到 \`https://agents.craft.do\`，以便针对生产环境的会话数据进行集成测试。

来源：[webui/vite.config.ts](apps/webui/vite.config.ts#L1-L91)、[viewer/vite.config.ts](apps/viewer/vite.config.ts#L1-L41)、[webui/package.json](apps/webui/package.json#L1-L18)、[viewer/package.json](apps/viewer/package.json#L1-L39)

WebUI 的 \`@\` 别名指向 \`apps/electron/src/renderer\`，而非 webui 源码目录。这意味着 WebUI 确确实实是在浏览器中运行 Electron 渲染器的组件树——每一个页面、每一个原子状态、每一个 Hook 都是完全相同的代码。唯一的区别在于传输层（WebSocket 对比 IPC）以及特定平台的方法覆盖。

## 后续步骤[](#后续步骤)

本页介绍了用于与 Craft Agents 交互的两个浏览器界面。要了解 WebUI 所桥接的传输层，请参阅[传输与 RPC 层](/lukilabs/craft-agents-oss/17-transport-and-rpc-layer) 。关于 WebUI 复用其渲染器的桌面应用，请参阅[渲染器 UI 组件](/lukilabs/craft-agents-oss/16-renderer-ui-components) 。关于 WebUI 连接的无头服务器，请参阅[无头远程服务器](/lukilabs/craft-agents-oss/22-headless-remote-server) 。若要探索这两个应用所渲染的会话数据模型，请参阅[会话与工作区模型](/lukilabs/craft-agents-oss/18-session-and-workspace-model) 。`;export{n as default};
