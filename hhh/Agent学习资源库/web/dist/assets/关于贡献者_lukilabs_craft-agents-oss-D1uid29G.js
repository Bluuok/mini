const s=`# 关于贡献者 | lukilabs/craft-agents-oss


---
Craft Agents 并非脱胎于传统的产品路线图。它诞生于一次圣诞假期的打赌——这个故事几乎能让你了解其背后团队所需知道的一切。在深入探讨社区生态之前，有必要先了解它的起源，因为这里的贡献者文化与项目的起步方式密不可分。

## 起源：两周、一次打赌与 Claude Code[](#起源两周一次打赌与-claude-code)

2025 年 12 月底，[Craft Docs](https://www.craft.do/) 背后公司 Luki Labs 的创始人兼首席执行官 Bálint Orosz 与自己打了个赌。如果他能在两周内，使用一套自己从未接触过的技术栈（Electron + TypeScript），构建出一个“带有附加功能的 Claude Code”，那么从 2026 年 1 月 5 日起，Craft Docs 的每位员工都必须每天使用 AI。他的兄弟 Gergely Orosz（《[The Pragmatic Engineer](https://pragmaticengineer.com/)》的作者）在 [LinkedIn 上讲述了这个故事](https://www.linkedin.com/posts/gergelyorosz_wild-my-brother-balint-orosz-set-himself-activity-7422029937051635713-HupG)：

> “借助 Opus 4.5 和 Claude Code，他在两周内完成了这一目标。从 1 月 5 日起，Craft Docs 的每位员工都获得了每月 200 美元的 Claude Max 订阅计划，并被要求为自己设定‘不可能完成’的目标，看看能否达成。”

由此诞生的便是 Craft Agents。整个公司都采用了它，据说非工程人员成了它最大的粉丝。几周内，该项目便以 Apache 2.0 许可证在 [GitHub 上开源](https://github.com/lukilabs/craft-agents-oss)。到 2026 年 4 月，它已经积累了约 3,700 个 Star 和 580 个 Fork——对于一个两个月前还不存在的项目来说，这是一个迅猛的增长轨迹。

## 核心团队[](#核心团队)

### Bálint Orosz (balintorosz) —— 创始人与远见者[](#bálint-orosz-balintorosz--创始人与远见者)

Bálint 并非那种以职业 OSS 维护者为典型的传统开源项目创始人。他的背景是设计和原生 iOS 工程，他的声誉是通过 Craft Docs 建立的，该应用曾荣获 [2021 年苹果 Mac 年度应用奖](https://www.businesswire.com/news/home/20211202005370/en/Craft-Docs-Wins-Mac-App-of-the-Year-for-Apples-2021-App-Store-Awards)。蒂姆·库克亲自颁奖，并指出 Craft 借助 M1 芯片让这款工具“面向未来”。

在创立 Craft 之前，Bálint 运营着一家名为 Distinction 的移动应用代理公司，该公司被 Skyscanner 收购，随后他在 Skyscanner 负责移动战略。在 [Ness Labs 的采访](https://nesslabs.com/craft-featured-tool)中，他将自己描述为在整个职业生涯中都在“与工具作斗争”的人，因为这些工具从未达到他所期望的流畅度：

> “我非常喜欢史蒂夫·乔布斯的那句名言：‘计算机是大脑的自行车’，但我觉得对于我使用的许多工具来说，这并不成立。”

他的理念——工具应该带来使用的愉悦感，而不是让人与之博弈——直接体现在了 Craft Agents 中。对 UI 打磨的关注、对跨平台一致性的重视（macOS、Windows、Linux、WebUI、Docker），以及即使在 Electron 外壳内也坚持原生级质感的执念，都带有他深深的烙印。

在 GitHub 上，Bálint 的提交虽然不频繁，但意义重大。他负责处理[内部到 OSS 的同步操作](https://github.com/lukilabs/craft-agents-oss/commit/f7e1cf5a3f76cfabd63b4449a45f565c9aed89d9)和高层架构方向。日常的大部分工程工作则落在了其他人肩上。

### rjulius23 (Gyula) —— OSS 引擎[](#rjulius23-gyula--oss-引擎)

如果说 Bálint 是远见者，那么 rjulius23 就是保持 OSS 列车运转的引擎。看一眼[仓库活动日志](https://github.com/lukilabs/craft-agents-oss/activity)就能明白全貌：从 v0.4.0 到 v0.8.5，几乎每一个版本发布提交都由 rjulius23 推送。他被列为该项目的 **Collaborator**。

他的真名是 Gyula（一个匈牙利名字，在 [Grafana 社区讨论](https://github.com/grafana/grafana/discussions/64039)中他署名为“Gyula”，印证了他的身份）。他充当着 Craft 内部开发与公共仓库之间的桥梁——管理同步工作流，对 Issue 进行分类处理，并实现了更新日志中可见的绝大部分功能和错误修复。

以下是体现他工作广度的几个例子：

-   在 [Linux 上非 AVX2 的 Bun 兼容性问题](https://github.com/lukilabs/craft-agents-oss/issues/218)被报告后数小时内，他就完成了修复，将其切换到了基线 Bun 构建。
-   他为 Claude Opus 4.6 和 Sonnet 4.6 [实现了 100 万上下文窗口支持](https://github.com/lukilabs/craft-agents-oss/issues/424)。
-   他构建了[混合本地/远程传输层](https://github.com/lukilabs/craft-agents-oss/commit/6ba37195eed1b7cc402632524030638b80284516)，实现了无头服务器、WebUI 和多工作区架构。
-   他以全职维护者的频率响应社区 Issue，通常在 Bug 被报告的当天就予以关闭。

他的角色实际上等同于负责开发者平台的高级工程师——只不过他的“平台”是一个用户群迅速增长的开源项目。

### 内部团队[](#内部团队)

在 OSS 的表象之下，Luki Labs 作为一支规模不大但多学科交叉的团队在运作。Craft Docs 的人才与文化负责人 Zita Stallenberger [描述了这种转变](https://www.linkedin.com/posts/zita-stallenberger_living-through-an-ai-transformation-from-activity-7422235855991459840-Cdgi)：

> “从人才与文化视角亲历一场 AI 转型，感受截然不同。支持组织度过变革。发现自己现在能独立完成多少工作。实时重新思考人才战略。通过我自身的经验和问题，助力塑造 Craft Agents。”

该公司在冰岛注册为 Luki Labs Ltd.，并获得了由 Creandum 领投的 800 万美元 A 轮融资。团队使用 Craft 本身进行内部协作——包括日常笔记、站会和文档共享——这意味着每位员工既是 Craft Docs 也是 Craft Agents 的吃狗粮用户（dogfooder）。

## 社区贡献者[](#社区贡献者)

项目的 CONTRIBUTING.md（[可在仓库中查看](https://github.com/lukilabs/craft-agents-oss/blob/main/CONTRIBUTING.md)）概述了以 TypeScript、Bun 和 Electron 为核心技术栈的标准 Fork 与 PR 工作流。社区响应十分热烈。以下是从外部塑造该项目的部分人员（非详尽列表）。

### 值得关注的 PR 作者[](#值得关注的-pr-作者)

贡献者

贡献内容

PR / 参考

**@LukeyBeachBoy**

模型选择器中的 Copilot 高级请求用量指示器；MCP OAuth 客户端密钥的令牌交换修复

[#473](https://github.com/lukilabs/craft-agents-oss/pull/473), [#507](https://github.com/lukilabs/craft-agents-oss/pull/507)

**@alihoowayne**

中文语言支持（i18n）——恰好在官方 v0.8.5 i18n 发布之前到位

[#516](https://github.com/lukilabs/craft-agents-oss/pull/516)

**@skoczen**

Bedrock 连接的命名 AWS 配置文件支持

[#517](https://github.com/lukilabs/craft-agents-oss/pull/517)

**@ninjaeon**

“复古终端”预设主题

[#482](https://github.com/lukilabs/craft-agents-oss/pull/482)

**@t4sh**

在自动化名称中展开环境变量，自动递增序列号

[#475](https://github.com/lukilabs/craft-agents-oss/pull/475)

**@Cybersoulja**

Claude Code 自动化文件脚手架（hooks、skills、subagents）

[#480](https://github.com/lukilabs/craft-agents-oss/pull/480)

**@dragonguy888**、**@chouch0u**、**@DocplannerLech**、**@thomaszdxsn**、**@ImLukeF**

在 v0.7.2 中获得致谢的各项 PR 贡献

[Release notes](https://github.com/lukilabs/craft-agents-oss/commit/2525f37a4436fadfa06f3d3e1d1a1fc9d722f1e4)

### 塑造了产品的 Issue 报告者[](#塑造了产品的-issue-报告者)

更新日志中散布着对报告特定 Bug 或提出功能建议的用户的致谢，其中许多直接影响到了路线图：

-   **@jjjrmy** 和 **@jonzhan** ——请求了[可消除的工作目录历史记录](https://github.com/lukilabs/craft-agents-oss/issues/346)项，已在 v0.7.5 中实现。
-   **@Kathie-yu** 和 **@RimuruW** ——报告了 [MiniMax CN 认证](https://github.com/lukilabs/craft-agents-oss/issues/396)Bug，促使了供应商预设的拆分。
-   **@linusrogge** ——报告了消息中的[内联代码渲染回归](https://github.com/lukilabs/craft-agents-oss/issues/378)问题，已在 v0.7.5 中修复。
-   **@alexzadeh** ——指出了 [100 万上下文窗口](https://github.com/lukilabs/craft-agents-oss/issues/424)支持的缺失以及 [@提及自动补全的空格问题](https://github.com/lukilabs/craft-agents-oss/issues/398)。
-   **@naishyadav** ——建议将 [Gemini 3.1 Flash Lite](https://github.com/lukilabs/craft-agents-oss/issues/357)添加到 Google AI Studio 默认选项中。

v0.7.2 的更新日志明确感谢了[更广泛的社区群体](https://github.com/lukilabs/craft-agents-oss/commit/2525f37a4436fadfa06f3d3e1d1a1fc9d722f1e4)：@dragonguy888、@chouch0u、@DocplannerLech、@thomaszdxsn、@ImLukeF、@jonzhan、@Novtopro、@lloydwu、@alexzadeh、@galaxyboyleo 和 @minak-collab。

## 贡献流程[](#贡献流程)

该项目遵循一种结构化但轻量的贡献模型：

Syntax error in textmermaid version 11.6.0

CI 流水线在每次推送和 PR 时都会运行 [Validate 工作流](https://github.com/lukilabs/craft-agents-oss/actions)，并配有独立的 Validate Server 集成测试套件。值得注意的是，团队还使用 [GitHub Copilot 进行代码审查](https://github.com/lukilabs/craft-agents-oss/actions)，作为对 PR 的自动化首轮筛选。

分支命名约定具有描述性：\`feature/add-new-tool\`、\`fix/resolve-auth-issue\`、\`refactor/simplify-agent-loop\`、\`docs/update-readme\`。[CONTRIBUTING.md](https://github.com/lukilabs/craft-agents-oss/blob/main/CONTRIBUTING.md)提供了使用 Bun、Node.js 18+ 以及 \`bun run electron:dev\` 开发命令的完整设置说明。

## 组织背景：Luki Labs[](#组织背景luki-labs)

了解贡献者就意味着了解他们背后的公司。Luki Labs 运营在一个不同寻常的交叉领域：一家生产力应用公司在 AI 工具流行之前就全面投入其中，随后将成果开源。

Syntax error in textmermaid version 11.6.0

正如 Bálint 所阐述的那样，公司的理念是：一旦你将产品命名为“Craft”，你就肩负着确保其精雕细琢的义务。这一标准同样适用于代码、UI 以及贡献者体验。

## 这对贡献者意味着什么[](#这对贡献者意味着什么)

对于潜在贡献者而言，Craft Agents 项目提供了一个非同寻常的价值主张。一方面，它是一个代码库快速演进的年轻项目——API 在次版本之间会发生变化，提交历史显示出了重大的架构变动（混合传输层、Pi SDK 集成、自动化引擎在 v0.7.0 到 v0.8.5 之间都经历了重大重写）。但另一方面，它具备：

-   **积极的维护** —— rjulius23 在数小时内响应 Issue，发布节奏大约为每 2-3 天一次。
-   **真实的用户基础** —— 超过 3,700 个 GitHub Star 和全公司范围的部署，意味着你的贡献能产生直接影响。
-   **多后端复杂性** —— 在单个应用中支持 Anthropic、OpenAI/Codex、Bedrock、Pi SDK 和自定义端点，是一个真正有趣的工程挑战。
-   **一家愿意开源**本可作为专有竞争优势成果的公司。

CONTRIBUTING.md 指出，所有贡献均按 Apache 2.0 许可证授权。对于任何有意贡献的人，目前的 [待解决 Issue 列表](https://github.com/lukilabs/craft-agents-oss/issues)涵盖了 182 个项目，关于从 PWA 支持（[#512](https://github.com/lukilabs/craft-agents-oss/issues/512)）到单工作区笔记（[#523](https://github.com/lukilabs/craft-agents-oss/issues/523)），再到实时 Token 用量显示（[#143](https://github.com/lukilabs/craft-agents-oss/issues/143)）等话题都有活跃的讨论。

大门是敞开的。问题在于，目前大幅领先于社区 PR 吞吐量的内部开发节奏，是否会为更深入的外部协作腾出空间，又或者 Craft Agents 是否仍将是一个由公司驱动、仅靠社区在边缘打补丁的项目。鉴于 Bálint 在汲取社区意见进行构建方面的过往业绩（Craft Docs 的塑造得益于超过 1,000 名 Beta 测试员），明智的押注是前者。`;export{s as default};
