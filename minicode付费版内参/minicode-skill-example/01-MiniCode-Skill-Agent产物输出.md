# MiniCode Resume Skill — Agent 产物输出

> 以下内容是 Agent 对测试用户的**实际回复**。测试用户画像：Java+Python 后端 / L2 掌握度 / balanced / AI 应用开发 / 经验跳槽。
>
> 与 `00-MiniCode-Skill-完整执行示例.md` 配合阅读——那篇展示 Agent 内部推理链，这篇展示用户看到的最终产物。

---

## 第一轮：信息收集

### Agent → 用户

在帮你选点之前，我先确认几个关键信息：

**1. 你对 MiniCode 的掌握程度？选一个最接近的：**

- L1：知道 MiniCode 是什么，能描述项目大概，但讲不清源码流程
- L2：能讲清楚模块职责和数据流（什么东西在哪个模块、数据怎么流转），但不一定能逐行解释
- L3：能解释实现取舍、失败场景和源码设计理由

**2. 你偏好哪种风险策略？**

- 保守：只写 100% 能讲清的点
- 均衡：接受 1-2 个高阶点，但要能招架追问
- 高阶：挑战 Agent 架构全套，承受源码级追问

**3. 这次简历用于？**

- 实习/校招
- 初级跳槽
- 经验跳槽（想加一段 AI Agent 方向经历）
- 纯 AI 方向转型

### 用户 → Agent

```
L2 — 能讲清模块职责和流转，但到源码细节就不稳了；
均衡策略，可以接受 1 个高阶挑战；
经验跳槽，当前做 Java 后端，想补一段 AI Agent 项目经历。
```

---

## 第二轮：方案匹配与交叉校验

### Agent → 用户

根据你的 L2 掌握度和均衡偏好，我把你的画像匹配到 **Plan B（AI 应用开发版）**，然后逐点做了 mastery 交叉校验：

| 原推荐 | 等级 | 你的 L2 限制 | 判定 |
|--------|------|-------------|------|
| R01 Agent Loop | 进阶 | ✅ 允许 | 保留 |
| R04 系统提示词 | 进阶 | ✅ 允许 | 保留 |
| R06 分层上下文压缩 | 高阶 | ❌ L3 专属 | **建议降级** |
| R13 MCP Host 集成 | 高阶 | ❌ L3 专属 | 可保留但需预警 |
| R15 Skills 渐进加载 | 进阶 | ✅ 允许 | 保留 |

**我的建议：**

- **R06 → 换成 R05**（Token 估算与上下文监控）。同样是上下文治理方向，进阶难度，L2 可稳讲。面试官问 R05 会集中在"为什么需要估算 + provider 和本地估算怎么结合"，不会深挖四层压缩源码。
- **R13 保留但加 ⚠️**。MCP 是你的唯一高阶点，学习成本可控——CodeWiki W09 约 475 行，重点掌握 MCP Host/Client 角色、stdio/HTTP 连接方式、`mcp__server__tool` 命名隔离即可。

**最终组合：R01 / R04 / R05 / R13 / R15**

接受这个调整吗？

### 用户 → Agent

```
接受。R13 我会提前啃 CodeWiki。
```

---

## 第三轮：简历项目生成

### Agent → 用户

以下是基于你选的 5 个点生成的一段简历项目经历。每一条 bullet 都来自要点库原文，保证技术表述精确。

---

### MiniCode — 轻量级终端 AI Coding Agent

*个人开源项目 | TypeScript · Node.js · Anthropic API · Model Context Protocol · JSON Schema / Zod*

- 设计基于 model-tool-model 的 Agent 执行循环，通过 `runAgentTurn` 编排模型推理、工具调用、工具结果回传和终止判断，支持多轮编码任务执行。

- 构建系统提示词组装流程，将权限上下文、Skills 摘要、MCP 服务器状态、记忆文件和响应协议统一注入模型上下文，使 Agent 在每轮执行前获得受控能力边界。

- 实现上下文窗口监控机制，结合 provider usage 与启发式 token 估算计算上下文利用率，并按不同风险等级触发治理策略，避免长会话超限。

- 集成 Model Context Protocol 作为 Agent 外部能力扩展层，支持 stdio/HTTP MCP 客户端连接、工具发现和 `mcp__server__tool` 命名隔离，将外部工具动态注入 ToolRegistry。

- 设计 Skills 渐进式加载机制，启动时仅暴露技能名称与描述，Agent 判断相关后再按需加载完整 `SKILL.md`，平衡能力扩展与上下文成本。

---

### ⚠️ R13 风险提示

你的组合中 R13 是唯一高阶点。面试前请确认你能讲清：

1. MCP 协议解决什么问题（工具扩展的标准化接入）
2. MiniCode 作为 MCP Host 如何连接外部 Server（stdio 子进程 / HTTP）
3. 为什么 `mcp__server__tool` 命名隔离是必要的（多 Server 同名工具冲突）
4. MCP 工具和内置工具在 ToolRegistry 中的关系（动态注入 vs 静态注册）

**面试中绝对不要说的：**
- "实现了 MCP 协议全部能力" — 你只做了 Host 侧集成点
- "构建了完整插件市场" — MiniCode 是参考实现，不是商业平台

> 建议深读 CodeWiki §W09，覆盖 MCP 客户端架构和服务器管理 CLI。

---

## 第四轮：面试 Q&A 清单

### Agent → 用户

下面是你的 5 个简历点对应的全部面试追问。**每个回答都按四段式准备**：

1. 这个设计解决什么问题
2. MiniCode 里怎么实现
3. 为什么不用更简单或更复杂的方案
4. 这个设计有什么限制或可扩展方向

---

### R01 · Agent Loop 执行闭环

**Q01.1 — MiniCode 的 Agent Loop 是怎么跑起来的？**

用户输入进入 TUI 后交给 `runAgentTurn`，Agent Loop 将当前消息历史发送给模型适配器。模型可能返回普通文本，也可能返回 `tool_calls`。如果返回工具调用，系统通过 `ToolRegistry` 找到对应工具，执行后把结果作为 `tool_result` 追加回消息历史，再进入下一轮模型推理。直到模型返回最终回答或达到终止条件。

**Q01.2 — 为什么 Agent 需要多轮工具调用，而不是一次模型请求直接回答？**

代码任务需要观察外部环境。模型一开始并不知道文件结构、代码内容、命令输出和修改结果，必须通过工具逐步获取信息。多轮循环让 Agent 先搜索文件、再读取内容、再执行修改、再根据结果调整。这是 Coding Agent 和普通 Chatbot 的核心区别。

**Q01.3 — 你怎么防止 Agent Loop 无限执行？**

MiniCode 用 `maxSteps` 限制最大步骤数，同时对空响应和 thinking stop 做重试和回退。模型返回最终 assistant 消息时终止；工具调用执行后才继续下一轮；不可恢复异常返回诊断信息而不是空转。

---

### R04 · 系统提示词构建

**Q04.1 — MiniCode 的系统提示词里应该包含什么？**

除了基础行为指令，还要包含当前权限上下文、可用 Skills、MCP 服务器状态、记忆/指令文件和响应协议。对 Agent 来说，系统提示词是能力边界说明：告诉模型有哪些工具可用、哪些操作受限、如何返回进度和最终答案。

**Q04.2 — 为什么 Skills 和 MCP 状态要进入系统提示词？**

模型只有知道这些能力存在，才可能调用它们。MiniCode 采用渐进方式：系统提示词提供技能摘要和 MCP 状态，真正需要时再加载完整 Skill 或执行 MCP 工具。这样模型能感知能力，又不把大量上下文一次性塞进去。

---

### R05 · Token 估算与上下文监控

**Q05.1 — 为什么要做 token 估算？**

Agent 长会话会不断追加用户消息、工具调用、工具结果和摘要，不监控上下文使用量很容易超过模型窗口。MiniCode 通过 provider usage 和本地启发式估算结合，计算当前利用率，并把状态分为 normal / warning / critical / blocked，驱动后续压缩策略。

**Q05.2 — 为什么不只依赖 provider 返回的 token usage？**

provider usage 通常只覆盖已经发生过的 API 请求，当前会话尾部新增的消息可能还没被计入。MiniCode 用"最新准确计数 + 后续消息估算"兼顾准确性和实时性。

---

### R13 ⚠️ · MCP Host 集成（高阶）

**Q13.1 — MCP 在 MiniCode 里扮演什么角色？**

MiniCode 作为 MCP Host，可以连接外部 MCP Server，把外部工具、资源和提示包装成内部 ToolDefinition。这样 Agent 不只会用内置文件和 Shell 工具，也能动态接入专业服务。

**Q13.2 — 为什么 MCP 工具名要用 `mcp__server__tool`？**

这是命名隔离。不同服务器可能有同名工具，外部工具也可能和内置工具重名。加上服务器名后，工具名称更稳定，也能避免冲突。

---

### R15 · Skills 渐进式加载系统

**Q15.1 — Skills 和 MCP 的区别是什么？**

MCP 更像可执行工具协议，提供外部函数、资源和提示；Skills 更像 Markdown 工作流和领域知识，用 `SKILL.md` 指导模型怎么做某类任务。一个偏工具能力，一个偏过程知识。

**Q15.2 — 为什么不把所有 Skill 全部放进系统提示词？**

Skill 全文可能很长，大多数任务只需要其中一小部分。MiniCode 先暴露名称和描述，让模型知道有哪些技能；真正相关时再调用 `load_skill` 加载完整内容。这是渐进式上下文加载的典型实践。

---

### 学习优先级建议

```
Q01（Agent Loop）      ████████░░  高 — 核心，面试必问
Q15（Skills）          ███████░░░  高 — 概念清晰，容易讲好
Q04（System Prompt）   ██████░░░░  中 — 需要理解能力边界语义
Q05（Token Monitoring）██████░░░░  中 — 技术扎实，不难讲
Q13（MCP）⚠️           █████████░  最高难点 — 建议最后攻克
```

---

## 第五轮：CodeWiki 深挖（用户追加提问）

### 用户 → Agent

```
请围绕 R06 上下文压缩做深挖，基于 CodeWiki 解释它的触发条件、实现流程、
面试追问和简历改写方式。

虽然 R06 没写进我的简历，但如果面试官从"上下文治理"方向追问过来，
我想能接住，至少能讲出 MiniCode 的设计思路。
```

### Agent → 用户

好的，我现在去 CodeWiki 里加载 R06 对应的 W04 章节（Lines 995-1176），提取源码级事实，不碰路线图内容。

---

═══════════════════════════════════════════════
R06 分层上下文压缩 — CodeWiki 深挖
═══════════════════════════════════════════════

MiniCode 的上下文压缩子系统位于 `src/compact/`，采用**四层策略**，按上下文利用率从低到高逐级触发。

### 第 1 层：microcompact（微压缩）

| 项目 | 内容 |
|------|------|
| 触发条件 | 上下文利用率超过 50%（`MICROCOMPACT_UTILIZATION`） |
| 策略 | 识别可压缩的工具结果，将内容替换为 `CLEAR_MARKER`，仅保留最近 3 个（`RETENTION.KEEP_RECENT_TOOL_RESULTS`） |
| 入口 | `microcompact()` @ `src/compact/microcompact.ts:6-50` |
| 触发路径 | `runAgentTurn` → `src/agent-loop.ts:197-201` |
| 设计意图 | 最轻量清理，代价最低，只清除纯粹臃肿的工具输出，不影响对话连贯性 |

### 第 2 层：context collapse（上下文折叠）

| 项目 | 内容 |
|------|------|
| 触发条件 | 利用率达到 75%（`COLLAPSE_UTILIZATION`） |
| 策略 | 创建**投影视图**（`projectCollapsedView`）——给模型看的消息数组包含摘要，用户侧保留原始 transcripts |
| 入口 | `applyContextCollapseIfNeeded()` @ `src/compact/context-collapse.ts:285-350` |
| 核心机制 | 将长对话 span 替换为摘要，保留原始模型视图投影 |
| 关键区别 | **不是删除历史**——原始记录仍在，只是模型看到的是摘要版本 |

### 第 3 层：snip compact（剪裁压缩）

| 项目 | 内容 |
|------|------|
| 触发条件 | 利用率达到 70%（`SNIP_UTILIZATION`） |
| 策略 | 执行硬删除——移除中间范围的**非受保护**消息 |
| 受保护工具 | `edit_file`、`patch_file`、`write_file`（见 `src/compact/snipCompact.ts:51-57`） |
| 入口 | `snipCompactConversation()` @ `src/compact/snipCompact.ts:282-355` |
| 触发路径 | `runAgentTurn` → `src/agent-loop.ts:182-190` |

> **注意**：snip 触发阈值 (70%) 比 collapse (75%) 更低——设计上优先尝试轻量级硬删除，如果删完后利用率仍不够，再上 collapse（投影视图计算成本更高）。

### 第 4 层：auto compact（自动压缩）

| 项目 | 内容 |
|------|------|
| 触发条件 | 利用率 85%（`AUTOCOMPACT_UTILIZATION`） |
| 策略 | 使用模型自己生成旧历史的摘要（`compactConversation` + `buildCompactSummaryPrompt`） |
| 入口 | `autoCompact()` @ `src/compact/auto-compact.ts:45-82` |
| 触发路径 | `runAgentTurn` → `src/agent-loop.ts:222-227` |
| 容错 | 连续失败 3 次（`MAX_AUTOCOMPACT_FAILURES`）→ 自动禁用，回退到 snip/microcompact |
| 手动触发 | 可通过 `/compact` 斜杠命令调用 |

### 保留边界算法

| 项目 | 内容 |
|------|------|
| 位置 | `findRetentionBoundary` @ `src/compact/compact.ts:58-86` |
| 行为 | 向后扫描累积 token 直到 `MAX_KEEP_TOKENS` (40,000) |
| 底线 | 保证至少保留 6 条消息（`MIN_KEEP_MESSAGES`） |
| 关键保护 | 调用 `alignBoundaryToApiRound` 确保 `assistant_tool_call` 和其 `tool_result` 永不分离 |

═══ 面试中最容易被追问的三个点 ═══

**1. "collapse 为什么说是投影视图，而不是修改历史？"**

因为原始消息仍在 transcripts 存储中，只是给模型的视图被替换为摘要版本。相当于"给模型看摘要，自己保留原稿"。这样用户侧和审计路径不受影响。

**2. "为什么 snip 的触发阈值 (70%) 比 collapse (75%) 还低？"**

snip 是硬删除，信息损失更大但计算代价更低。设计上优先尝试轻量级剪裁——如果剪裁后利用率就够了，就不需要上 collapse（投影视图需要额外计算）。如果剪裁后仍不够，再走 collapse。

**3. "如果 auto compact 调模型摘要也失败了怎么办？"**

连续 3 次失败后 self-disable，自动回退到 snip/microcompact。不会因为摘要调用失败而导致 Agent 卡死。

═══ 简历改写参考 ═══

如果你后续想把 R06 加入简历（比如等到 L3 后再升级），推荐写法：

> 设计分层上下文压缩策略，按上下文利用率触发 microcompact、context collapse、snip compact 与 auto compact，在保留关键工具调用和最近上下文的同时控制长会话 token 膨胀。

注意：
- 写"设计"而非"实现"，因为你目前是 L2，源码细节不是你的主战场
- 面试中要能区分四种策略的触发条件（50%、70%、75%、85%）
- "修改历史 vs 投影视图" 这个区别是面试官最爱追的点，提前想好自己的表述

═══ 深挖源 ═══

以上全部内容来自 `MiniCode-Complete-CN.md` §W04（Lines 995-1176），覆盖 `src/compact/` 目录下全部压缩策略。
本次深挖**未使用** CodeWiki 中的路线图、未来规划或扩展设想内容。

═══════════════════════════════════════════════

---

## 产物清单

本次会话 Agent 共交付以下产物：

| # | 产物 | 行数/规模 | 用途 |
|---|------|-----------|------|
| 1 | 用户画像确认 | 3 个问题 | 补全 mastery / risk / goal |
| 2 | Mastery 交叉校验表 | 5 行逐点判定 | 可见的降级决策逻辑 |
| 3 | 完整简历项目经历 | 5 bullets + 技术栈 + 简介 | 可直接粘贴到简历 |
| 4 | R13 风险提示 | 4 个必会点 + 3 条禁语 | 防面试翻车 |
| 5 | 面试 Q&A 清单 | 11 个追问 + 四段式指导 + 优先级 | 系统性面试准备 |
| 6 | R06 CodeWiki 深挖 | 四层压缩 + 3 追问热点 + 简历改写 | 防追问弹药 |

---

> **文档生成信息**
> - 测试用户画像：Java+Python 后端 / L2 / balanced / AI 应用开发 / 经验跳槽
> - Skill 版本：修复后版（Step 2b + 四段式 + Qxx.x 子编号 + 逐点面试指导）
> - 测试日期：2026-06-16
