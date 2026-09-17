const n=`# 最新更新 | lukilabs/craft-agents-oss


---
如果要在 AI Agent 领域找出一个持续高频交付的项目，那非 [Craft Agents](https://github.com/lukilabs/craft-agents-oss) 莫属。在大约五周的时间（2026年3月初至4月中旬）里，这个开源 Agent 界面背后的团队发布了 **15 个版本**，从 [v0.7.2](https://github.com/lukilabs/craft-agents-oss/commit/22acfc0b1d1728ae1ce1f25229a23b897b3a4de6) 一路迭代到 [v0.8.5](https://github.com/lukilabs/craft-agents-oss/commit/02ab763ee62fdd0c45898c1f78454eb7066ba7da)。这种迭代节奏值得深入剖析——不仅是因为其产出量，更是因为它揭示了项目的战略方向。

Craft Agents 由 [Luki Labs](https://agents.craft.do) 构建，是一款基于 Electron 的桌面应用程序。它封装了 Claude Agent SDK，并提供了以文档为中心的 UI、多工作区会话管理以及可插拔的来源/技能系统。正如他们在[入门文档](https://agents.craft.do/docs/getting-started/introduction)中所述，其目标是将 Claude 的编码能力引入你的整个数字工作流——而不仅仅局限于终端。

以下是对这一版本发布列车的结构化拆解，以及它向我们揭示的项目未来走向。

* * *

## 版本时间线[](#版本时间线)

Syntax error in textmermaid version 11.6.0

这绝非一个靠初期发布后便停滞不前的项目。每一次发布都伴随着实质性的变更——而从 0.7.x 到 0.8.x 的演进，更标志着其架构野心的明显转变。

* * *

## 三个阶段[](#三个阶段)

综合审视提交信息和发行说明，0.7.x 到 0.8.x 的发展轨迹可以划分为三个相互交织的阶段：

阶段

版本

主题

关键架构转变

**供应商扩展**

v0.7.2 - v0.7.12

多供应商支持、自定义端点、Bedrock

Pi SDK 作为通用后端

**远程与 Web**

v0.8.0 - v0.8.3

混合传输、WebUI、Docker、移动端

从纯桌面端转向跨平台

**本地化与打磨**

v0.8.4 - v0.8.5

i18n、OAuth 加固、UX 修复

从单语言转向多语言

让我们逐一梳理。

* * *

## 阶段一：供应商扩展 (v0.7.2 - v0.7.12)[](#阶段一供应商扩展-v072---v0712)

0.7.x 系列的读感就像是一份“开发者可能用到的所有 LLM 供应商”清单。团队系统地扫清了接入门槛。

### 自定义端点[](#自定义端点)

[v0.7.2](https://github.com/lukilabs/craft-agents-oss/commit/22acfc0b1d1728ae1ce1f25229a23b897b3a4de6) 通过 Pi SDK 的 \`registerProvider\` 引入了自定义端点支持，允许用户接入任何兼容 OpenAI 的供应商。[v0.7.4](https://github.com/lukilabs/craft-agents-oss/commit/dc61e3e5672fb691101d5213368957eaa314c68c) 随后对设置 UX 进行了全面重构——在输入基础 URL 前加入协议选择器，并实现了编辑状态在设置路由间的持久化。[v0.7.6](https://github.com/lukilabs/craft-agents-oss/commit/1ab9365ea11da1322eda428a8dc678cdbb03fd40) 中的一项关键 Bug 修复解决了 \`customEndpoint\` 字段在保存时被静默丢弃的问题，该问题曾导致自定义端点在每次重启后恢复为默认值。这对应于 [issue #413](https://github.com/lukilabs/craft-agents-oss/issues/413)。

### Amazon Bedrock[](#amazon-bedrock)

Bedrock 支持经历了三次迭代。[v0.7.8](https://github.com/lukilabs/craft-agents-oss/commit/7fbd7275c3e75190656243629a8350533a9f7414) 添加了基础的 IAM 凭证支持。[v0.7.11](https://github.com/lukilabs/craft-agents-oss/commit/4551a0c0c0adf104613044c49708676261ed2655) 修复了设置表单被 Pi 下拉菜单处理器拦截从而导致无法提交 Bedrock 配置的问题。[v0.7.12](https://github.com/lukilabs/craft-agents-oss/commit/d007f04183697aff9e3c770182967014f0eb191e) 交付了完整的实现——将模型 ID 自动标准化为美国跨区域推理配置文件（\`us.anthropic.claude-*\`），同时修复了 \`400 ValidationException\` 错误和 \`Cannot find module './amazon-bedrock.js'\` 的打包错误。这解决了长期存在的 [issue #451](https://github.com/lukilabs/craft-agents-oss/issues/451) 和 [issue #99](https://github.com/lukilabs/craft-agents-oss/issues/99)。

### 网络基础设施[](#网络基础设施)

[v0.7.5](https://github.com/lukilabs/craft-agents-oss/commit/2525f37a4436fadfa06f3d3e1d1a1fc9d722f1e4) 添加了带有 \`NO_PROXY\` 绕过规则的 HTTP/HTTPS 代理支持，通过 \`undici\` ProxyAgent 实例路由流量。用于自动化的 Webhook 动作也在同一版本中落地——支持可配置鉴权的 HTTP Webhooks、带有指数退避的持久重试机制，以及响应捕获功能。

[v0.7.7](https://github.com/lukilabs/craft-agents-oss/commit/ea760e8c2cf20a35dcae8948ce8e40b4decbf559) 引入了 5 级思考系统（关闭 / 低 / 中 / 高 / 最高），针对 Anthropic 模型支持自适应思考，并在 Claude 和 Pi 后端之间实现并行 \`call_llm\` 执行——从而解决了 [issue #294](https://github.com/lukilabs/craft-agents-oss/issues/294)。

### 本阶段的启示[](#本阶段的启示)

团队战略性地押注 [Pi SDK](https://agents.craft.do) 作为通用路由层。他们没有为每个供应商构建直接集成，而是将 Pi 作为中间件进行投资。这在架构上是合理的，但也伴随着风险——正如一位用户在 [issue #434](https://github.com/lukilabs/craft-agents-oss/issues/434) 中指出的那样，Pi 后端将动态上下文（时间戳、会话状态、来源元数据）注入系统提示词的做法，很可能会降低提示词缓存效率，导致在执行同等任务时，相比 Claude Code 产生意想不到的高额 Token 消耗。

* * *

## 阶段二：远程与 Web (v0.8.0 - v0.8.3)[](#阶段二远程与-web-v080---v083)

从 0.7.12 到 0.8.0 的跨越是这期间最大规模的一次版本发布，它从根本上改变了 Craft Agents 的产品定位。

### v0.8.0：WebUI 版本[](#v080webui-版本)

[v0.8.0](https://github.com/lukilabs/craft-agents-oss/commit/6ba37195eed1b7cc402632524030638b80284516) 引入了：

-   **混合本地/远程传输** — 统一的连接层，具备健康检查、针对不可达远程端的 \`CloudOff\` 指示器，以及通过 \`invokeOnServer\` 采用恢复优先策略的跨服务器会话转移。
-   **多个远程工作区** — 工作区选择器 UI，支持同时连接多个远程服务器。
-   **可通过浏览器访问的 WebUI** — 无头服务器现在在同一端口上提供完整的 Web 界面，支持 Claude 和 Copilot OAuth。无需桌面应用。
-   **会话导出/导入** — 用于在服务器之间转移会话的“发送至工作区”流程。
-   **移动端 WebUI** — 120% 默认缩放、1.3 倍触摸目标缩放、防止 iOS Safari 自动缩放、通过容器查询实现响应式布局。

这是一项重大突破。Craft Agents 在单次发布中，从“一款 Electron 桌面应用”蜕变为了“一个拥有桌面端、浏览器和 CLI 客户端的完整 Agent 平台”。[官方文档](https://agents.craft.do/docs/getting-started/introduction)现在明确将其定位为平台：“运行远程服务器，并从任何机器访问你的工作区——桌面应用、浏览器或 CLI。”

### v0.8.1 - v0.8.3：加固[](#v081---v083加固)

[v0.8.1](https://github.com/lukilabs/craft-agents-oss/commit/95d829422ce451d640ff01896a9495fea30425c8) 增加了用于无头部署的 Docker Compose，并将 Web UI 资源 baked 进了 Docker 镜像中。[v0.8.2](https://github.com/lukilabs/craft-agents-oss/commit/8cdd7731d753081a7927c5ea423466654dd27953) 用 \`jose\` 替换了手写的 JWT 实现，使用 \`argon2id\` 对密码进行哈希处理，并为认证端点添加了全局限流器——这是一次显著的安全加固。[v0.8.3](https://github.com/lukilabs/craft-agents-oss/commit/7aa09c74348a95a5fe79701ddb948f3f7f1c400d) 引入了会话自我管理工具（\`set_session_labels\`、\`set_session_status\`、\`get_session_info\`、\`list_sessions\`），使 Agent 能够管理自身的生命周期——这是实现自关闭自动化工作流的前提条件。

### 本阶段的启示[](#本阶段的启示-1)

0.8.x 系列发布将 Craft Agents 定位为一个部署目标，而不仅仅是一个桌面客户端。特别是 Docker 体系——从 [v0.7.12](https://github.com/lukilabs/craft-agents-oss/commit/d007f04183697aff9e3c770182967014f0eb191e) 的基础 Docker 构建，到 [v0.8.3](https://github.com/lukilabs/craft-agents-oss/commit/7aa09c74348a95a5fe79701ddb948f3f7f1c400d) 的多架构 CI ——表明团队正将自托管团队部署作为核心使用场景。

* * *

## 阶段三：本地化与打磨 (v0.8.4 - v0.8.5)[](#阶段三本地化与打磨-v084---v085)

### v0.8.4：通用 OAuth 与开发者体验[](#v084通用-oauth-与开发者体验)

[v0.8.4](https://github.com/lukilabs/craft-agents-oss/commit/dfb2b909395e3742e7821bebcaaf3e4cbd06b376) 为 API 来源带来了通用 OAuth 支持，可通过 [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)（OAuth 授权服务器元数据）实现自动端点发现。这意味着你只需提供发行方 URL，框架便会自动解析其余配置。用于跨工作区共享来源、技能和自动化的“发送至工作区”动作也在此版本中落地。

值得注意的是，该版本还允许在生产构建中通过 \`View > Toggle Developer Tools\` 访问 DevTools——不过一个 [Windows 特有的 Bug](https://github.com/lukilabs/craft-agents-oss/issues/521) 确认了该菜单项在 Windows 打包构建中缺失，且 \`Ctrl+Shift+I\` 和 \`F12\` 快捷键同样无效。

### v0.8.5：多语言支持与 Pi SDK 升级[](#v085多语言支持与-pi-sdk-升级)

[v0.8.5](https://github.com/lukilabs/craft-agents-oss/commit/02ab763ee62fdd0c45898c1f78454eb7066ba7da) 是当前的最新版本，也可能是对推动采用最具战略意义的版本：

-   **完整的 i18n** — 整个 UI 实现了**英语、西班牙语、简体中文 和日语**的本地化，涵盖超过 1,050 个翻译字符串。会话标题和 AI 回复会跟随所选语言。语言切换位于“设置 > 外观”中。
-   **规范化语言环境注册表** — 添加新语言现在只需修改单个文件。该注册表会自动派生语言代码、显示名称、i18n 资源以及 date-fns 语言环境。
-   **开发者工具链** — Pre-commit 钩子会捕获暂存 \`.tsx\` 文件中硬编码的英文字符串。语言环境一致性测试确保翻译保持同步。\`localize-agents\` 技能实现了添加新语言的自动化。

这直接回应了 [issue #510](https://github.com/lukilabs/craft-agents-oss/issues/510)（“能否添加中文语言选项”）和 [issue #520](https://github.com/lukilabs/craft-agents-oss/issues/520)（“add i18n 什么时候添加”），这两个 Issue 在开放仅数天后便被解决。

Pi SDK 从 0.56.2 升级至 0.66.1，获得了对 GLM 5、GLM 5.1 和 MiniMax 2.7 模型的支持，解决了 [issue #503](https://github.com/lukilabs/craft-agents-oss/issues/503) 和 [issue #513](https://github.com/lukilabs/craft-agents-oss/issues/513)。此次升级还修复了 Bedrock 限流误判、Anthropic HTTP 413 检测、Z.ai 工具流式传输、OpenAI 流式传输问题以及 bash 输出截断问题。

**一个值得注意的已知限制：** 无论 UI 语言如何设置，无头服务器的响应仍保持英语。针对无头服务器的按客户端语言支持被推迟到了未来的版本中。

* * *

## 活跃的开发信号[](#活跃的开发信号)

除了带标签的正式发布外，还有几个信号表明快速迭代仍在继续：

信号

证据

潜在意味

**社区 PR**

[PR #516](https://github.com/lukilabs/craft-agents-oss/pull/516)（中文支持）、[PR #517](https://github.com/lukilabs/craft-agents-oss/pull/517)（AWS 命名配置文件）、[PR #507](https://github.com/lukilabs/craft-agents-oss/pull/507)（OAuth 客户端密钥）、[PR #482](https://github.com/lukilabs/craft-agents-oss/pull/482)（复古终端主题）、[PR #475](https://github.com/lukilabs/craft-agents-oss/pull/475)（自动化环境变量）

核心团队之外存在着活跃的贡献者输送管道

**Copilot 代码审查**

GitHub Actions 工作流“Copilot code review”在多个 PR 上运行

在 AI Agent 项目中使用 AI 进行代码审查——虽有些“套娃”，但很实用

**高 Star/Fork 比例**

GitHub 上 3.7k star，580 fork

相较于项目年龄，展现出了极高的关注度

**内部同步模式**

[Balint Orosz](https://github.com/balintorosz) 定期提交“Sync from internal repository”

开源仓库是私有 Monorepo 的下游镜像

### 值得关注的未决 Issue[](#值得关注的未决-issue)

几个未决的 Issue 预示了团队接下来的工作重心：

-   **[macOS 上的无窗口启动问题](https://github.com/lukilabs/craft-agents-oss/issues/522)** — 过期的 \`.server.lock\` 文件会导致在退出时从未调用 \`instance.stop()\` 的情况下发生静默启动失败。用户提供的根因分析非常详尽：锁文件从未被释放，因为 \`stop()\` 从未被挂载到 \`before-quit\` 处理器中，且基于 PID 的检测机制容易受到 PID 重用的影响。临时解决方案是执行 \`rm ~/.craft-agent/.server.lock\`。
-   **[自定义模型的图像识别](https://github.com/lukilabs/craft-agents-oss/issues/525)** — 发送到自定义端点模型（如 Gemma 4）的图片无法被模型接收，尽管在其他客户端中可以正常工作。
-   **[自动化弹出框的模型路径](https://github.com/lukilabs/craft-agents-oss/issues/514)** — “添加自动化”内联聊天硬编码了 \`model: "sonnet"\` 并使用 Anthropic 风格的别名，导致无法识别这些模型名称的自定义供应商端点失效。用户提供了详细的代码路径分析，定位出 \`EditPopover.tsx\` 和 \`factory.ts\` 是相关文件。
-   **[PWA 支持](https://github.com/lukilabs/craft-agents-oss/issues/512)** — WebUI 已具备约 70% 的 PWA 就绪状态（manifest、图标、meta 标签均已存在），但缺少 Service Worker，导致 Chrome 的“安装应用”选项无法使用。

* * *

## 核心要点[](#核心要点)

1.  **Pi SDK 是架构的关键枢纽。** 几乎所有与供应商相关的功能都通过 Pi 进行路由。这简化了代码库，但也造成了单点依赖。在 [issue #434](https://github.com/lukilabs/craft-agents-oss/issues/434) 中提出的提示词缓存效率担忧，在发行说明中依然未被回应。

2.  **项目正在“吃自己的狗粮”。** 正如他们在[发布博客](https://www.craft.do/blog/introducing-craft-agents)中所述：“我们正在用 Craft Agents 构建 Craft Agents。不使用代码编辑器。每一个功能、每一次修复、每一项改进——全靠提示词。”提交历史（特别是自动化生命周期和会话自我管理工具）在结构上印证了这一说法。

3.  **本地化是正确的决策。** 在社区提出需求仅几天后便落地了中文和日文语言支持，团队既展现出了服务非英语开发者的意愿，也展现出了架构上的准备就绪。规范化的语言环境注册表和开发者工具链（pre-commit 钩子、一致性测试）表明这将具备扩展至更多语言的能力。

4.  **OSS 镜像模式存在妥协。** 定期的“从内部仓库同步”提交表明，公开仓库是私有 Monorepo 的下游。这意味着社区 PR 是在一个不断移动的目标上进行合并的，CI 工作流（每次推送时运行的“Validate”环节）在某种程度上就是为了捕获这种偏移而存在的。这也意味着 OSS 仓库中的提交历史并不能忠实记录真实的开发顺序——某些功能可能在内部早已开发完成，几周后才出现在开源仓库中。

5.  **Docker 和无头模式现已成为一等公民。** 从基础的 Dockerfile（v0.7.12），到内置 Web UI 资源的 \`docker-compose.yml\`（v0.8.1），再到多架构 CI 构建（v0.8.3），这一演进过程表明团队对自托管部署是认真的。扩展后的[无头服务器文档](https://agents.craft.do/docs/getting-started/introduction)中加入了 Cloudflare Tunnel 指南，进一步印证了这一点。


* * *

## 版本兼容性一览[](#版本兼容性一览)

功能

最低版本

备注

自定义端点 (兼容 OpenAI)

v0.7.2

[持久化失效问题已于 v0.7.6 修复](https://github.com/lukilabs/craft-agents-oss/issues/413)

网络代理

v0.7.5

支持 \`NO_PROXY\` 绕过

Webhook 自动化

v0.7.5

指数退避重试

MCP 自定义请求头

v0.7.6

通过凭证存储中的 \`headerNames\` 配置

5 级思考

v0.7.7

针对 Anthropic 的自适应思考

Amazon Bedrock

v0.7.12

完整标准化为美国推理配置文件

混合远程传输

v0.8.0

WebUI、移动端、会话转移

Docker Compose

v0.8.1

GHCR 服务器镜像，内置 Web 资源

会话自我管理工具

v0.8.3

Agent 驱动的标签/状态管理

通用 OAuth (RFC 9728)

v0.8.4

通过发行方 URL 自动发现

多语言 UI (i18n)

v0.8.5

EN、ES、ZH-Hans、JA；无头 AI 仍仅限 EN

* * *

归根结底：Craft Agents 正处于激进的扩张期。五周内发布 15 个版本显然无法无限期持续，但其发展轨迹十分清晰——项目正从“带 GUI 的 Claude Code”演进为一个功能完备、跨平台、多供应商的 Agent 平台。随着社区的不断壮大，内部同步模式和 Pi SDK 依赖是否会成为瓶颈，目前尚无定论，但就现阶段而言，其开发速度令人瞩目，功能集也在快速走向成熟。`;export{n as default};
