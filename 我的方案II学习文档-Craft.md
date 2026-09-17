# 我的 Craft Agents 学习清单（多后端抽象 / Session 隔离 / MCP 接入 / 多端复用 / 事件契约）

> 我的背景：二本秋招 / 目标岗位 AI 应用开发 / 技术栈 TypeScript（不熟，需补课）/ 熟 Agent 基本流程，不熟 MCP / 已学完 MiniCode 方案 I（执行循环、工具契约、JSONL 持久化已有底子）。
>
> ⚠️ 选点 v3（2026-08-29）：**R24（分层验证体系）已移除，改为 R10（AgentEvent 统一事件流与生命周期）**。R24 机器降级为复现文档 OPTIONAL；「工程素养」由 R10 事件契约+R12 路由穷举+类型检查兜底。本清单已同步。
>
> 资料在哪看：**网页端** `hhh/Agent学习资源库/Agent学习资源库-单文件版.html` → 首页「项目 CodeWiki」分类 → **「Craft Agents CodeWiki」（标记 CA，共 23 篇）**。本文档「前置hc/主hc/辅助hc」列写的是 **CA 章节号 + 章节名**（网页端目录顺序即编号），前置hc 先读、主hc 是点本身、辅助hc 被追问才展开，直接按号点。
>
> 配套文件：简历与面试口径看 `E:/zzzz/mini/Craft-定稿.md`（五条 bullet + 12 条防线 + Q&A）；三项目关系看 `E:/zzzz/mini/三项目联动-步6.md`。

---

## 一、简历写什么

| 简历点 | 角色 | 一句话 |
| --- | --- | --- |
| R03 | AgentBackend 抽象 | 模型后端解耦（次深挖） |
| R08 | Session/Workspace 隔离 | 多任务并行不串台（讲清即可） |
| R18 | Sources/Skills/MCP 统一接入 | ServerBuilder 统一转换（**主深挖**） |
| R12 | IPC/WebSocket 统一传输层 | 多端一套逻辑（讲清即可） |
| R10 | AgentEvent 统一事件流与生命周期 | 流式渲染与错误恢复契约（收尾支撑点） |

**方向定位**：模型解耦（R03）+ 任务隔离（R08）+ 能力接入（R18 主深挖）+ 多端复用（R12）+ 事件契约（R10 收尾）。主深挖 R18（也是最大风险点——MCP 不熟），次深挖 R03，R08/R12 讲清流程，R10 作事件契约与实时呈现证据（接替 R24 收尾位）。

关键技术栈：TypeScript、React、Electron、Bun workspace、WebSocket/RPC、MCP、AgentBackend 抽象、Session/Workspace、ServerBuilder、AgentEvent 可辨识联合、EventQueue、typed_error。

**与定稿的对应**：本清单五点 = `Craft-定稿.md` §1 五条 bullet 的顺序（R03→R08→R18→R12→R10）。学完每一单元，回头把定稿里对应的 bullet 和 talking points 复述一遍——能脱稿讲出四段式才算过关。

---

## 二、一条线：前置知识 → 点本身，逐点列清

> 每个点按「前置hc → 主hc(点本身) → QA」一条线顺下来。「前置hc」=不先读就讲不清点本身的章节，先读它再进主章节；「辅助hc」=被追问时的扩展弹药，只在被问才展开。前置是追问时的兜底弹药，被问到才展开。

### 单元 0 · 全局骨架（先花半天，所有单元的地基）

- **点本身**：Bun monorepo 结构、Electron 三进程（main/preload/renderer）、桌面/无头/Web 三形态、整体数据流（UI → RPC → 会话 → Agent → 工具）。
  - 掌握门槛：能画一张「用户在 UI 发一句话到工具执行完返回」的链路图；能说出三个进程各自管什么。
- QA：无直接题，但 §5-6 单人防御叙事和所有四段式回答都靠这张骨架图撑。
- 定位（地基，无前置）：**CA-01 概述** + **CA-08 Monorepo 架构** +（浏览即可）**CA-15 Electron 主进程**

### 单元 1 · R03 AgentBackend 抽象（次深挖）

- **前置知识**（前置hc：无强前置；靠单元0骨架 + MiniCode 复习即可）：
  - Agent Loop 怎么跑（MiniCode 学过，复习即可）：模型→工具→模型闭环。区别：MiniCode 是自己写循环；Craft 把循环交给后端 SDK/Pi，自己定义的是**后端接口层**。
  - Pi 是什么：开源 agent runtime，作为第二个模型后端接入 → CA-11（PiAgent 子进程协议，配合主 hc 一起读）。
- **点本身**：前端耦合单一模型 SDK 导致换后端改整个调用链 → AgentBackend 统一 chat()/配置控制/生命周期方法 + 标准化流式事件（后端返回、UI 消费——事件词表本身是 R10 的内容，这里只讲「接口统一到流式输出」）。
  - 掌握门槛：能解释「换模型=换配置」具体指什么；能说清抽象屏蔽差异时用什么兜底（配置标记+运行时能力白名单）；能讲 R03/R10 分工一句话（R03 管谁能被换、R10 管换完 UI 还认）。
- QA：Q03.1（interview-qa.md）；定稿 §5-1 Pi 防线必背
- 定位：前置 无强前置（靠单元0）；主 **CA-09 BaseAgent 抽象**；辅助 **CA-10 ClaudeAgent SDK 集成** + **CA-11 PiAgent 子进程协议**（Pi 防线的弹药库）

### 单元 2 · R08 Session/Workspace 隔离（讲清即可）

- **前置知识**（前置hc：靠单元0；Session 在哪一层见 CA-01 概述 / CA-08 Monorepo）：
  - 单元 0 的整体数据流（Session 在哪一层）→ CA-01（概述，数据流/Session 层定位）。
- **点本身**：多个研究任务混在一个上下文互相污染 → 一个研究任务一个 Session（会话生命周期、工具上下文）+ 独立 Workspace（工作目录、数据源、偏好配置）；同一工作区可跑多会话，销毁 Session 不破坏 Workspace 资料。
  - 掌握门槛：能一句话讲清 Session vs Workspace 区别（会话状态 vs 环境）；能答「多任务并行 vs 多开窗口」反杀（隔离的是工具上下文/工作目录/偏好，不是 UI）。
- QA：Q08.1；定稿 Part1 R08 组三问
- 定位：前置 靠单元0；主 **CA-18 会话与工作区模型**

### 单元 3 · R18 Sources/Skills/MCP 统一接入（主深挖 · 最大风险点）

- **前置知识**（前置hc：先读 **CA-12 MCP 客户端池**，MCP 不熟这里补齐）：
  - MCP 是什么：把外部能力（工具/资源）以 server 形式托管，client 运行时发现并调用。tool 带输入 schema、运行时发现（tools/list）、server 独立进程 → CA-12（MCP 客户端池）。
  - Source 与 Skill 的分工：Source=连接/凭据/配置；Skill=使用逻辑 → CA-19（来源与技能，主 hc 本身）。
- **点本身**：搜索 API/抓取/本地文档/MCP 各自为政接入 → ServerBuilder 把 MCP/API/本地数据源统一转换为 Agent 可调用工具；凭据按 Source 注入、权限注册时配置——统一入口即治理边界。
  - 掌握门槛：①能完整讲一遍「一个 MCP server 从连接到它的 tool 被 Agent 调用」的数据流；②能解释凭据注入发生在哪一步；③先发自爆口径背熟：「我的 MCP 只到统一转换层，JSON-RPC/握手/传输层没深做」。
- QA：Q18.1；定稿 §5-2 先发自爆 + Part3 弱点表 #2（降级路径 R18→R17）
- 定位：前置 **CA-12（MCP 客户端池，MCP 概念先懂，兼作接入目标）**；主 **CA-19 来源与技能**；辅助 **CA-21 会话工具核心**（SessionToolContext 注入凭据/工作区的机制）+ **CA-20 OAuth 与凭证管理**（凭据注入机制）

### 单元 4 · R12 IPC/WebSocket 统一传输层（讲清即可）

- **前置知识**（前置hc：先读 **CA-15 Electron 主进程**，IPC 语境）：
  - 单元 0 的 Electron 三进程模型（IPC 在 main↔renderer 之间）→ CA-15（Electron 主进程，三进程/IPC 语境）。
- **点本身**：桌面端与 Web 端各自维护一套会话/文件/模型逻辑 → 统一 RPC channel+DTO+路由规则，Electron IPC 与 WebSocket 只是可替换传输边界；文件系统能力差异收敛在 DTO 与路由层。
  - 掌握门槛：能答「Web 端上线了吗」真话口径（桌面为主，Web 是验证逻辑复用的第二载体）；能指出分叉点在哪（桌面本地直连 vs Web 服务端代理）。
- QA：Q12.1；定稿 Part1 R12 组三问
- 定位：前置 **CA-15（Electron 主进程，IPC 语境）**；主 **CA-17 传输与 RPC 层**；辅助 **CA-23 WebUI 与会话查看器**（WebUI 怎么复用同一套逻辑）

### 单元 5 · R10 AgentEvent 统一事件流与生命周期（收尾支撑点 · v3 换入）

- **前置知识**（前置hc：单元 1 已打底——R03 学过「后端返回标准化流式事件」，本单元就是回答「事件长什么样、UI 怎么用」）：
  - 单元 1 的 Pi 子进程协议（事件怎么从 Pi 流回来）→ CA-11（PiAgent 子进程协议，事件来源语境）。
  - 双后端为什么事件形状不同：Claude SDK 消息流 vs Pi 细粒度事件 → 同上 CA-10/CA-11 对比着看。
- **点本身**：深度研究任务链路长，执行中文本增量/工具进度/权限确认/外部来源错误混杂 → AgentEvent 可辨识联合类型统一事件词表（五类核心：文本增量 text_delta/text_complete、工具 tool_start/tool_result、权限 permission_request、结构化错误 typed_error、完成 complete+usage）；UI 按 type 分流渲染；turnId 归组一轮、parentToolUseId 挂嵌套工具树（可选字段：Claude 原生透传、Pi sub-turn 近似）；EventQueue 把 Pi 异步事件桥成 AsyncGenerator（不是 generator 换皮：缓冲+完成信号+reset）；typed_error 结构化（code/title/message/actions/canRetry）→ 错误卡+恢复入口。
  - 掌握门槛：能列五类事件并说 UI 按类型分流渲染；能讲 turnId/工具树关联与「渲染契约非日志格式」；能用一个真实例子讲 typed_error 恢复（错误卡+重试入口，恢复由消费侧决策）；能用一句话讲 EventQueue 为什么存在（push 变 pull）。**注意口径：说「事件流与生命周期」，不说「状态机」——无显式 FSM 状态转移表，被追「状态机怎么建模」就画界（事件词表+关联字段+生命周期钩子）。**
- QA：Q10.1 + 定稿 Part1 R10 组五问；防线 §5-10（事件契约四件套）+ §5-11（R03/R10 分工）+ §5-12（评测越界预案）必背
- 定位：前置 **CA-09/CA-10/CA-11**（单元1 已学，事件来源语境）；主 事件类型与适配器部分在 **CA-09/CA-14**（事件流与执行引擎，配合源码 message.ts:550 AgentEvent 联合精读）；辅助 **CA-17 传输与 RPC 层**（session:event 推送怎么走 R12 通道）+ 测试相关内容散见各章（session-event-message parity）

---

## 三、资料速查（两条路）

**路线 A · 网页端（日常学习，推荐）**：打开 HTML → 「项目 CodeWiki」→ Craft Agents CodeWiki（CA）。章节对照：

| 单元 | 前置hc（先读） | 主hc | 辅助hc |
| --- | --- | --- | --- |
| 单元 0 | —（地基） | CA-01 / CA-08 / CA-15（概述 / Monorepo 架构 / Electron 主进程） | — |
| 单元 1（R03） | —（靠单元0 + MiniCode 复习） | CA-09（BaseAgent 抽象） | CA-10 / CA-11（ClaudeAgent SDK 集成 / PiAgent 子进程协议） |
| 单元 2（R08） | —（靠单元0，Session 在哪层见 CA-01/CA-08） | CA-18（会话与工作区模型） | — |
| 单元 3（R18 主深挖） | CA-12（MCP 客户端池，MCP 概念先懂） | CA-19（来源与技能，ServerBuilder） | CA-21 / CA-20（会话工具核心 / OAuth 与凭证管理） |
| 单元 4（R12） | CA-15（Electron 主进程，IPC 语境） | CA-17（传输与 RPC 层） | CA-23（WebUI 与会话查看器） |
| 单元 5（R10） | CA-09/CA-10/CA-11（单元1 已学，事件来源） | CA-09/CA-14（事件流与执行引擎）+ 源码 message.ts:550 | CA-17（session:event 推送） |

**路线 B · 深挖源码（带读时用）**：codewiki 全量文档在 `03-定稿/付费群文档汇总/三项目codewiki/craft-agents-oss/`（主题目录 + `craft-agents-oss_zread_full.md` + `manifest.md`）；craft 源码本体在 `E:/zzzz/mini/craft-agents付费版内参/craft-agents-oss-main/`（apps/packages 完整仓库）。带读优先级（=定稿 §6 补课清单）：① ServerBuilder 转换路径+凭据注入（CA-19/12 对应源码 packages 内 sources/server 相关模块）② PiAgent JSONL 子进程协议（CA-11）③ Session/Workspace 实现（CA-18）④ 统一 RPC channel/DTO（CA-17）⑤ Channel Map 契约测试实现。

---

## 四、注意事项

### 四条红线（违反即穿帮）

1. **论文数字只进口头，绝不进 bullet**：MT-Bench 85% vs 81%、position bias >60% 翻转、verbosity 91.3%→8.7%、SkillsBench +16.6pp、AI Control 15%→92%、26.1% 技能漏洞率——只在被问评测/技能治理/安全时作前沿认知展开。
2. **未实现的不说成已做**：LLM 裁判/pass^k 行为评测（只有方法论认知；R10 事件流只是行为可复现的数据基础，评测是消费侧能力不越 Scope）、技能自动进化（R26 未选）、i18n parity（已从简历删除）、跨端无缝续接会话状态。
3. **不编造量化指标**：验证效果只用定性表述（解耦/隔离/统一接入/恢复入口/标准化呈现）。
4. **MCP 先发自爆**：讲到 R18 第一句就说「只到统一转换层」，别等被问。Pi 名字被追问就进 §5-1 防线（进程外 JSONL 子进程协议），接不住退「理解设计层」。
5. **评测类追问走交底不走 R10（v3 新增）**：被问「研究结论质量怎么评估」「事件流都能回放了怎么做评测」→ 走定稿 §5-12 交底（采样/判定/裁判三独立问题，未实现诚实说），绝不把 R10 说成评测能力——Scope 明确评测/采样/度量是消费侧能力。

### 降级预案（讲不稳就换）

| 原要点 | 降级到 |
| --- | --- |
| R18（主深挖） | 退回 R17 口径：「核心贡献是工具上下文抽象（sessionId/workspace/文件系统/凭据/回调统一注入），MCP 只是其中一种 Source 类型」 |
| R03（次深挖） | 退回只讲「统一了流式输出接口」，不展开 Pi 协议细节 |
| R08 | 退回「至少解决单任务内搜索结果/原文/结论混杂」的上下文管理价值 |
| R12 | 退回「传输层抽象让同一套逻辑两个客户端跑通」，不展开 DTO 细节 |
| R10 | 退回 R03 的「五类事件形状」口径（R03 已学衔接自然），只讲「UI 按 type 分流渲染」，不展开 turnId/EventQueue/typed_error 细节 |

### 其他

- 主次分明：R18 扛三层追问（靠单元 3 前置弹药），R03 扛一轮追问，R08/R12 讲清流程，R10 准备事件四件套（防线 §5-10）。
- 只学这 5+1 个单元，不贪多；每点过 30 秒电梯测试（对着定稿 talking points 说）。
- 与 MiniCode 的口径切分（步6 联动已备）：工具处理演进线「契约（MiniCode 手写 Schema+Zod）→ 接入（Craft ServerBuilder，上游自带 schema）→ 治理（HappyClaw TOOLS 段）」——被问「为什么换了方案」就用这条，不是推翻自己。**编号提醒（v3）**：MiniCode 的 R10 是写前确认 diff，Craft 的 R10 是事件流——同号不同物，被问「三个项目 R 编号是一套吗」用这条当例子。
- 回答一律四段式：解决问题 → 实现方式 → 设计取舍 → 局限与扩展。
