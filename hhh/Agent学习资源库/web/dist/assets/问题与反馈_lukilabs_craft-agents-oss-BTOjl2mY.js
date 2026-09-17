const s=`# 问题与反馈 | lukilabs/craft-agents-oss


---
截至 2026 年 4 月中旬，Craft Agents 已获得 3.7k Stars，182 个未解决议题和 193 个已关闭议题。议题追踪器是一张反映实际情况的动态地图——对于一个每 2-3 天发布一个新版本的项目来说，这张地图在不断被重绘。本页面提炼了最重要的模式、最具洞察力的用户报告，以及能预示项目未来走向的功能请求。

## 现状概览[](#现状概览)

从宏观来看，议题追踪器讲述了一个清晰的故事：**项目的增长速度超过了其 QA（质量保证）覆盖范围的扩展速度**。新功能推进势头猛烈（如 i18n、OAuth、自定义端点、远程工作区），但每个新增的攻击面都会引入特定于平台的回归问题，通常需要多个版本才能彻底解决。

Syntax error in textmermaid version 11.6.0

## 平台摩擦：三大系统，三种痛点[](#平台摩擦三大系统三种痛点)

### macOS：悄无声息的无窗口启动[](#macos悄无声息的无窗口启动)

近几周诊断最彻底的 Bug 是[议题 #522](https://github.com/lukilabs/craft-agents-oss/issues/522)，由用户 \`csmcneill\` 提交。应用出现在 Dock 栏和菜单栏中，但从未打开任何窗口。根本原因非常明确：

1.  **\`.server.lock\` 文件在退出时从未被释放。** \`apps/electron/src/main/index.ts\` 中的 \`before-quit\` 处理函数调用了 \`sessionManager.flushAllSessions()\`、\`sessionManager.cleanup()\` 及其他收尾工作——但从未调用 bootstrap 返回值中的 \`instance.stop()\`。这意味着 \`packages/server-core/src/bootstrap/headless-start.ts\` 里的 \`releaseServerLock()\` 永远无法被执行。

2.  **过期锁检测容易受到 PID 重用的影响。** \`acquireServerLock()\` 使用 \`process.kill(pid, 0)\` 来检查活跃状态，这无法区分真正的 Craft Agents 实例和任何被分配了相同回收 PID 的无关进程。更稳健的方法是同时存储 PID 和进程启动时间。

3.  **错误被静默吞没。** \`app.whenReady()\` 中宽泛的 \`try/catch\` 捕获了锁获取错误，但由于生产环境日志被禁用，用户得不到任何反馈。应用就只是……停在那里。


解决方法很简单——执行 \`rm ~/.craft-agent/.server.lock\`——但在 v0.8.4 版本中，正常退出后该文件依然残留，这暴露了基本生命周期管理的缺陷。另一个相关议题，[#506](https://github.com/lukilabs/craft-agents-oss/issues/506)（“Mac App GUI 完全隐藏”），已有 7 条评论且在不断增加，似乎是从不同角度描述了同类故障。

### Windows：UI 回归与功能缺失[](#windowsui-回归与功能缺失)

在最近的几个版本中，Windows 用户遭遇了较多的麻烦：

-   [议题 #519](https://github.com/lukilabs/craft-agents-oss/issues/519) 报告了**在全新安装的 Windows 11 上出现界面异常**（6 条评论）。在从未安装过 Craft Agents 的机器上，应用开箱即用地出现了视觉破损——这是从 v0.8.3 到 v0.8.4 的回归问题。

-   [议题 #521](https://github.com/lukilabs/craft-agents-oss/issues/521)（5 条评论）指出，v0.8.4 版本发布说明中宣布的 **“切换开发者工具”菜单项**在 Windows 上根本没有出现。无论是 \`Ctrl+Shift+I\`、\`F12\` 还是 \`Ctrl+Shift+J\` 均无效。发布说明中写道：“开发者工具现在可以在生产构建中通过 视图 > 切换开发者工具 访问”，但该实现似乎仅限于 macOS。

-   [议题 #496](https://github.com/lukilabs/craft-agents-oss/issues/496) 记录了 Windows 上**粘贴图片附件失败**的问题，原因在于 \`SESSION_RUNTIME_PATH\` 未被正确解析。


这里的模式很一致：功能首先在 macOS 上开发和测试，然后移植到 Windows 时留下了缺口。Windows 上 \`fs.watch\` 过于激进（导致会话分支时出现重复消息）的问题在 v0.7.4 中得到了修复，但更广泛的平台对等性差距依然存在。

### Linux：名不副实的暗色模式[](#linux名不副实的暗色模式)

3 月 21 日提交的[议题 #461](https://github.com/lukilabs/craft-agents-oss/issues/461) 仍未解决，是该项目中在视觉上最明显的 Bug 之一。在 Linux/Wayland（特别是使用 \`niri\` 合成器的 Arch Linux）上，暗色模式渲染时，侧边栏和内容面板周围会出现褪色的灰色外壳，且窗口边缘有亮边。

提交者进行了真正的诊断工作，将问题追溯到渲染器仍在使用为 macOS 设计的**透明/毛玻璃外壳逻辑**：

-   \`src/renderer/index.css\` 中的 \`body { background: transparent; }\`
-   \`html[data-theme-override]::before\` 使用了透明值
-   当 \`resolvedMode !== systemPreference\` 时会设置 \`themeMismatch\`

与此同时，Linux 主窗口使用的是 \`frame: true\`（原生窗口装饰），因此导致了：原生边框 + 透明背景 + 合成器背景渗出 = 不一致的暗色模式。另一个独立但相关的议题，[#432](https://github.com/lukilabs/craft-agents-oss/issues/432)，报告了在 Ubuntu 24.04 上存在的相同问题。

该议题已公开三周，截至 v0.8.5 仍未修复。对于一个将自己标榜为跨平台的项目来说，Linux/Wayland 用户显然被当成了二等公民。

## 不可忽视的 Token 使用问题[](#不可忽视的-token-使用问题)

[议题 #434](https://github.com/lukilabs/craft-agents-oss/issues/434) 现已关闭，但仍值得回顾，这可以说是该项目收到的最重要的架构反馈。提交者发现，一个具有 **41k token 可见上下文的任务在单轮对话中消耗了约 40% 的 Claude Pro 配额**，而同一任务在 Claude Code 中仅消耗了 **9%**。

提交者不仅停留在抱怨层面——他们阅读了源代码，并在 Pi 后端中找到了可能的罪魁祸首：

> 在 \`packages/shared/src/agent/pi-agent.ts\` 中，Pi 后端构建了一个基础提示词，通过 \`this.promptBuilder.buildContextParts(...)\` 拼接动态上下文，并将其全部作为 \`systemPrompt\` 发送。该文件中甚至包含这样一条注释：“对于 Pi，上下文部分会进入系统提示词（而非用户消息）。”

像 \`getDateTimeContext()\`（每轮都会改变）、\`formatSessionState()\`（时间戳、版本计数器）以及来源状态等动态值被直接嵌入到了系统提示词中。这破坏了 Anthropic 的提示词缓存机制，因为该机制要求前缀必须稳定才能命中缓存。

这并非个例。更广泛的 AI Agent 生态系统也在应对同样的问题——LibreChat 的[讨论 #11615](https://github.com/danny-avila/LibreChat/discussions/11615) 记录了几乎完全相同的行为：由于框架在每轮对话中重建消息负载的方式不同，导致轮次间的提示词缓存失败，打破了前缀匹配的要求。

v0.7.8 版本通过“扩展提示词缓存”设置（TTL 从 5 分钟延长至 1 小时）部分解决了此问题，但根本的架构问题——系统提示词前缀中包含动态上下文——依然存在。真正的修复方案需要重构提示词的组装方式，将稳定内容（系统指令、工具 Schema）置于动态内容（时间戳、会话状态）之前，从而保留对缓存友好的前缀。

## 自定义提供商的兼容性缺口[](#自定义提供商的兼容性缺口)

Craft Agents 支持广泛的 LLM 提供商，但自定义/OpenAI 兼容端点的路径仍存在一些粗糙之处：

-   [议题 #525](https://github.com/lukilabs/craft-agents-oss/issues/525) 报告**自定义模型无法识别图片**。通过自定义端点使用 \`gemma4\` 时，Agent 声称从未收到上传的图片——尽管同一模型在 OpenCode 中使用相同端点时工作正常。

-   [议题 #514](https://github.com/lukilabs/craft-agents-oss/issues/514) 对\\*\\*“自动化添加”弹出框\\*\\*使用了与“添加来源”和“添加技能”不同代码路径的问题，提供了极其详尽的诊断。该弹出框在 \`EditPopover.tsx\` 中硬编码了 \`model: "sonnet"\` 和 \`inlineExecution: true\`，创建了一个不会继承有效 LLM 连接的隐藏会话。在自定义 \`pi_compat\` 端点上，这会产生 \`401 Invalid API Key\` 错误，因为通用模型别名对自定义提供商无效。

-   [议题 #494](https://github.com/lukilabs/craft-agents-oss/issues/494) 请求为 \`pi_compat\` 端点提供并发控制，并支持 OpenAI 的 \`/v1/responses\` API，以防止工具调用 Schema 崩溃。


这些问题表明，尽管 Anthropic 和 Claude Code 的路径经过了充分测试，但“自带提供商”的体验仍然脆弱。自动化弹出框的 Bug 尤其揭示了一种架构上的不一致性：不同的 UI 流程对同一概念（“我应该使用哪个模型？”）使用了不同的解析策略。

## 安全：一次负责任的披露经历[](#安全一次负责任的披露经历)

在安全方面的情况可谓好坏参半。1 月 31 日开启的[议题 #142](https://github.com/lukilabs/craft-agents-oss/issues/142) 记录了一份发送至 \`security@craft.do\` 的安全漏洞报告。报告者 Ali Sunbul 在 24 小时未获确认后开启了该 GitHub 议题。该议题最终被关闭，而相关公告——[GHSA-55x8-6mw9-g8fh](https://github.com/lukilabs/craft-agents-oss/issues/524)——引用了 **CVE-2026-31297**，该编号被 MITRE 确认为重复分配。

然而，该公告链接目前返回 404，评论者已要求维护者按照 GitHub 的公告发布流程将其公开。[SECURITY.md](https://github.com/lukilabs/craft-agents-oss/blob/main/SECURITY.md) 规定了 48 小时的确认窗口和关键问题 30 天的解决时间表，这似乎已经达成——但针对 CVE 编号的不透明处理以及未发布的公告，在透明度方面仍有改进空间。

积极的一面是，该项目在供应链安全方面做出了具体改进：\`trustedDependencies\` 白名单、在所有 CI 工作流中强制执行 \`--frozen-lockfile\`，以及针对本地 MCP 服务器子进程的凭据过滤，阻止了 \`ANTHROPIC_API_KEY\` 和 \`GITHUB_TOKEN\` 等环境变量泄漏到不受信任的服务器进程中。

## 揭示用户意图的功能请求[](#揭示用户意图的功能请求)

这些功能请求描绘了人们在实际生产中如何使用 Craft Agents 的图景：

议题

请求

信号

[#143](https://github.com/lukilabs/craft-agents-oss/issues/143)

实时 Token 使用量显示

用户希望在长时间会话中看到成本可见性

[#523](https://github.com/lukilabs/craft-agents-oss/issues/523)

每个工作区的“备注”字段

多项目用户需要工作区范围的上下文

[#512](https://github.com/lukilabs/craft-agents-oss/issues/512)

支持 Chrome“作为应用安装”的 PWA

WebUI 用户希望像原生应用一样安装

[#484](https://github.com/lukilabs/craft-agents-oss/issues/484)

Agent 交接 / 会话内切换

高级用户运行多种 Agent 配置

[#483](https://github.com/lukilabs/craft-agents-oss/issues/483)

通过分隔符实现技能子命令

技能已变得足够复杂，需要命名空间

[#271](https://github.com/lukilabs/craft-agents-oss/issues/271), [#375](https://github.com/lukilabs/craft-agents-oss/issues/375)

沙盒环境

企业用户希望对不受信任的代码执行进行隔离

关于 Token 使用量的请求（#143）特别能说明问题——它自 1 月 31 日开启以来，官方仅回应称存在现有的系统警告，但这些警告仅对 Agent 可见，用户看不到。相关数据已经在内部被追踪，只是没有展示出来。一项关于 Copilot 高级请求使用量指示器的 [PR #473](https://github.com/lukilabs/craft-agents-oss/pull/473) 正在进行中，这表明该缺口正在被填补，但尚未发布。

## 社区贡献与响应度[](#社区贡献与响应度)

维护者在多个方面表现出了积极的响应：

-   **i18n 请求**（[#510](https://github.com/lukilabs/craft-agents-oss/issues/510), [#520](https://github.com/lukilabs/craft-agents-oss/issues/520)）提出“能否添加中文语言选项？”——v0.8.5 版本便交付了该功能，同时附带了西班牙语和日语，涵盖了 1050 多个翻译字符串。从提出请求到交付（约 3 天）的速度值得称赞。

-   **MiniMax 2.7 模型支持**（[#513](https://github.com/lukilabs/craft-agents-oss/issues/513)）于 4 月 8 日提出，并通过 v0.8.5 中的 Pi SDK 升级得到解决。

-   **GLM5 模型可用性**（[#503](https://github.com/lukilabs/craft-agents-oss/issues/503)）也通过同一项 SDK 升级得到修复。


然而，像 Linux 暗色模式（#461，开放 3 周）和 Windows DevTools 缺失（#521，开放并有 5 条评论）这类特定于平台的 Bug 表明，团队正在将功能优先于平台对等性。发布节奏足够快，回归问题通常能迅速得到解决——但由于新增攻击面的速度快于旧 Bug 被彻底关闭的速度，未解决议题的数量（182 个）仍在不断攀升。

## 总结：摩擦力存在于何处[](#总结摩擦力存在于何处)

Syntax error in textmermaid version 11.6.0

对于考虑将 Craft Agents 作为日常开发工具的开发者来说，核心体会是：核心 Agent 体验（Claude/Codex 后端、会话管理、MCP 集成）是扎实且在快速改进的。但如果你使用的是 Windows 或 Linux，请做好体验存在粗糙之处的心理准备。如果你使用自定义提供商端点，请仔细测试自动化和图像处理流程。如果你对 Token 成本敏感，请密切关注提示词缓存架构——当前的实现正在白白消耗资金。`;export{s as default};
