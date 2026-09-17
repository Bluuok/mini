# MiniCode Resume Skill — 完整执行示例

> 本文档展示 `minicode-resume-skill` 在一条真实用户对话中的完整执行链：从 Skill 激活 → 背景收集 → 方案匹配 → 交叉校验 → 简历生成 → 面试准备 → CodeWiki 深挖。
>
> 测试角色：一名 Java + Python 后端，目标 AI 应用开发岗位，L2 掌握度，risk appetite: balanced。

---

## 阶段 0：Skill 激活

用户向 Agent 发送：

```
我目标岗位是 AI 应用开发，技术栈是 Java + Python，Agent 项目只了解基础 Tool Calling。
请用 MiniCode 帮我选 4-5 个适合写进简历的点，生成一版项目经历，并给出对应面试 Q&A。
```

Agent 检测到关键词 `MiniCode` + `简历` + `选点` → Skill 匹配 → 加载 `minicode-resume-skill`。

---

## 阶段 1：信息收集（User Intake）

### Agent 内部执行步骤

```
Step 1: Read references/user-intake.md → 已有答案 vs 缺失项
```

### 用户已提供的信息

| 问题 | 答案 | 状态 |
|------|------|------|
| Target role | AI 应用开发（AI Application Developer） | ✓ 已提供 |
| Tech background | Java + Python，基础 Tool Calling，未构建过 Agent | ✓ 已提供 |
| MiniCode mastery | 未直接说明 | ✗ 需确认 |
| Risk appetite | 未说明 | ✗ 需确认 |
| Resume goal | 未说明 | ✗ 需确认 |

### Agent 向用户提问（仅问缺失项）

```
在帮你选点之前，我先确认几个关键信息：

1. 你对 MiniCode 的掌握程度？选一个最接近的：
   a) L1：知道 MiniCode 是什么，但讲不清源码流程
   b) L2：能讲清楚模块职责和数据流，但不一定能逐行解释
   c) L3：能解释实现取舍、失败场景和源码设计理由

2. 你偏好哪种风险策略？
   a) 保守：只写 100% 能讲清的点
   b) 均衡：接受 1-2 个高阶点但要能招架追问
   c) 高阶：挑战 Agent 架构全套，承受源码级追问

3. 这次简历用于？
   a) 实习/校招 b) 初级跳槽 c) 经验跳槽（加 AI Agent 方向） d) 纯 AI 方向转型
```

### 用户回复

```
1. L2 — 能讲清模块职责，但到源码级细节就不稳了
2. 均衡 — 可以接受一个高阶点挑战一下，不行就降级
3. 经验跳槽，目前做 Java 后端，想在简历上加一段 AI Agent 项目经历
```

### Agent 总结用户画像

```
User Profile → agent memory:
  role: AI application developer
  tech: Java + Python backend, knows basic Tool Calling
  mastery: L2 (module-level explanations solid, not source-level)
  risk: balanced
  goal: experienced job switch, add AI Agent experience
  persona: Plan B (AI Application) candidate, with L2 constraint active
```

---

## 阶段 2：方案匹配（Combo Plan Selection）

### Agent 内部执行步骤

```
Step 2: Read references/combo-plans.md
  → Scan for "AI Application"
  → Match: Plan B → R01, R04, R06, R13, R15
  → BUT: Plan B now has "Min mastery: L2 (see warning)" and warning text

Step 2b: Cross-check mastery level (NEW — post-fix guardrail)
  → From user-intake.md Mastery-to-Point Mapping:
    L2 allowed: R01, R04, R08, R10, R15, R18, R19
    Plan B contains: R01 (✓L2), R04 (✓L2), R06 (✗L3-only), R13 (✗L3-only), R15 (✓L2)
  → HIGH-RISK DETECTED: R06 (Layered Context Compaction) and R13 (MCP Host) are L3 points
  → Applying fallback from combo-plans.md: R06 → R05
  → R13 remains High. For balanced risk with L2, offer choice: keep R13 with warning, or swap to R08
```

### Agent 向用户输出的交叉校验警告

```
根据你的 L2 掌握度和均衡风险偏好，我对照了 Plan B 的推荐组合：

✅ R01 Agent Loop — 进阶，L2 可驾驭
✅ R04 系统提示词 — 进阶，L2 可驾驭
⚠️ R06 分层上下文压缩 — 高阶（L3 推荐），需要讲清四种压缩策略的触发阈值和差异
    → 建议降级为 R05（Token 估算与上下文监控），同样是上下文方向但更稳
⚠️ R13 MCP Host 集成 — 高阶（L3 推荐），需要解释 stdio/HTTP 连接、命名隔离和工具注入
✅ R15 Skills 渐进加载 — 进阶，L2 可驾驭

我的推荐：用 R05 替换 R06。R13 如果你愿意花时间学习 MCP 集成章节可以保留，否则换成 R08（ToolRegistry）。
如果你接受 R05 替换，最终组合为：R01, R04, R05, R13, R15。

接受这个调整吗？还是你想挑战 R06？
```

### 用户回复

```
接受 R05 替换 R06。R13 我保留，会提前学 CodeWiki 里 MCP 那章。
```

### 最终选定的 5 个点

| 点 | 标题 | 等级 | 风险 | CodeWiki |
|----|------|------|------|----------|
| R01 | Agent Loop 执行闭环 | 进阶 | Low | W01 |
| R04 | 系统提示词构建 | 进阶 | Medium | W03 |
| R05 | Token 估算与上下文监控 | 进阶 | Medium | W04 |
| R13 | MCP Host 集成 | 高阶 | High ⚠️ | W09 |
| R15 | Skills 渐进式加载系统 | 进阶 | Medium | W10 |

---

## 阶段 3：简历项目生成

### Agent 内部执行步骤

```
Step 3: Read references/resume-points.md
  → For each selected Rxx, review "What to Explain" and "Interview Risk" fields
  → R01: "If you cannot explain the tool_calls → tool_result feedback loop, don't make this core"
  → R13: "Don't say 'implements full MCP protocol'; only claim covered integration points"
  → All 5 points pass plausibility with L2 mastery

Step 4: Generate resume entry using pre-written bullets VERBATIM
  → Output rule: "Use the pre-written bullets from resume-points.md verbatim"
```

### Agent 最终输出 — 完整简历项目

---

**项目：MiniCode — 轻量级终端 AI Coding Agent**（个人开源项目）

**技术栈**：TypeScript、Node.js、Anthropic API、Model Context Protocol (MCP)、JSON Schema / Zod

- 设计基于 model-tool-model 的 Agent 执行循环，通过 `runAgentTurn` 编排模型推理、工具调用、工具结果回传和终止判断，支持多轮编码任务执行。

- 构建系统提示词组装流程，将权限上下文、Skills 摘要、MCP 服务器状态、记忆文件和响应协议统一注入模型上下文，使 Agent 在每轮执行前获得受控能力边界。

- 实现上下文窗口监控机制，结合 provider usage 与启发式 token 估算计算上下文利用率，并按不同风险等级触发治理策略，避免长会话超限。

- 集成 Model Context Protocol 作为 Agent 外部能力扩展层，支持 stdio/HTTP MCP 客户端连接、工具发现和 `mcp__server__tool` 命名隔离，将外部工具动态注入 ToolRegistry。

- 设计 Skills 渐进式加载机制，启动时仅暴露技能名称与描述，Agent 判断相关后再按需加载完整 `SKILL.md`，平衡能力扩展与上下文成本。

---

### Agent 附加的 R13 风险提示

```
⚠️ 注意：R13（MCP Host 集成）是你的组合中唯一的高阶点。

为了在面试中讲稳这个点，建议你提前准备好：
1. MCP 是什么协议，解决什么问题（工具扩展标准化）
2. MiniCode 作为 MCP Host 如何连接外部 Server（stdio/HTTP 两种客户端）
3. 为什么用 `mcp__server__tool` 命名隔离（避免多 Server 工具冲突）
4. MCP 工具如何进入 ToolRegistry（动态注入 vs 内置工具的区别）

面试中不要说的：
• "实现了 MCP 协议全部能力" — 你只实现了 Host 侧的集成点
• "构建了完整插件市场" — MiniCode 是参考实现，不是商业平台

建议深读 CodeWiki W09 章节（约 475 行），覆盖 MCP 客户端架构和服务器管理。
```

---

## 阶段 4：面试准备清单

### Agent 内部执行步骤

```
Step 5: Read references/interview-qa.md
  → Match R01→Q01.1/Q01.2/Q01.3
  → Match R04→Q04.1/Q04.2
  → Match R05→Q05.1/Q05.2
  → Match R13→Q13.1/Q13.2
  → Match R15→Q15.1/Q15.2
  → Prepend 四段式 answer structure instruction
```

### Agent 输出 — 面试准备清单

```
下面是你的简历点对应的面试追问清单。每个回答都按四段式组织：
(1) 这个设计解决什么问题
(2) MiniCode 里怎么实现
(3) 为什么不用更简单或更复杂的方案
(4) 有什么限制或可扩展方向

---

【R01】Agent Loop 执行闭环 — 准备 Q01.1、Q01.2、Q01.3

Q01.1 — MiniCode 的 Agent Loop 是怎么跑起来的？
Q01.2 — 为什么 Agent 需要多轮工具调用，而不是一次模型请求直接回答？
Q01.3 — 你怎么防止 Agent Loop 无限执行？

【R04】系统提示词构建 — 准备 Q04.1、Q04.2

Q04.1 — MiniCode 的系统提示词里应该包含什么？
Q04.2 — 为什么 Skills 和 MCP 状态要进入系统提示词？

【R05】Token 估算与上下文监控 — 准备 Q05.1、Q05.2

Q05.1 — 为什么要做 token 估算？
Q05.2 — 为什么不只依赖 provider 返回的 token usage？

【R13】MCP Host 集成 ⚠️ 高阶 — 准备 Q13.1、Q13.2

Q13.1 — MCP 在 MiniCode 里扮演什么角色？
Q13.2 — 为什么 MCP 工具名要用 `mcp__server__tool`？

【R15】Skills 渐进加载 — 准备 Q15.1、Q15.2

Q15.1 — Skills 和 MCP 的区别是什么？
Q15.2 — 为什么不把所有 Skill 全部放进系统提示词？

---

共计 11 个追问。建议学习优先级：Q01 → Q15 → Q04 → Q05 → Q13（最难放最后）。
```

---

## 阶段 5：CodeWiki 深挖（Deep-Dive）

### 用户触发深挖

```
请围绕 R06 上下文压缩做深挖，基于 CodeWiki 解释它的触发条件、实现流程、
面试追问和简历改写方式。虽然 R06 没写进我的简历，但我想理解这个点，
万一面试官从这个方向追问我也能接住。
```

### Agent 内部执行步骤

```
Step 6: Deep-dive trigger detected ("深挖" + "基于 CodeWiki")
  → DO NOT load full MiniCode-Complete-CN.md
  → Read references/codewiki-index.md
  → R06 → W04 → Lines 995-1176 of MiniCode-Complete-CN.md
  → Read only lines 995-1176 of MiniCode-Complete-CN.md
  → Apply Resume Verification Rule:
    ✓ Is the mechanism explicitly described in CodeWiki? → YES
    ✓ Is the source file/module named? → YES (src/compact/*)
    ✓ Is the claim about implemented behavior, not future? → YES
    ✓ Can the user explain the data flow? → (user will check after reading)
  → DO NOT present roadmap/future plans as implemented
```

### Agent 深挖输出

```
═══════════════════════════════════════
R06 上下文压缩 — 基于 CodeWiki 深挖
═══════════════════════════════════════

MiniCode 的上下文压缩子系统位于 src/compact/，采用四层策略，
按上下文利用率从低到高逐级触发。

▸ 第 1 层：microcompact（微压缩）
  触发：利用率 > 50% (MICROCOMPACT_UTILIZATION)
  策略：识别"可压缩"的工具结果，替换为 CLEAR_MARKER，仅保留最近 3 个工具结果
  入口：microcompact() @ src/compact/microcompact.ts:6-50
  触发路径：runAgentTurn → src/agent-loop.ts:197-201
  设计意图：代价最低，只清除纯粹臃肿的工具输出，不影响对话连贯性

▸ 第 2 层：context collapse（上下文折叠）
  触发：利用率 > 75% (COLLAPSE_UTILIZATION)
  策略：创建投影视图 (projectCollapsedView) —
       给模型看的消息数组包含摘要，用户侧保留原始 transcripts
  入口：applyContextCollapseIfNeeded() @ src/compact/context-collapse.ts:285-350
  关键区别：不是删除历史，而是呈现模型的"塌缩视图"

▸ 第 3 层：snip compact（剪裁压缩）
  触发：利用率 > 70% (SNIP_UTILIZATION)
  策略：执行"硬"删除 — 移除中间范围的非受保护消息
       受保护工具包括 edit_file、patch_file、write_file
       这是为了防止编辑上下文丢失导致任务断裂
  入口：snipCompactConversation() @ src/compact/snipCompact.ts:282-355
  触发路径：runAgentTurn → src/agent-loop.ts:182-190
  注：snip 的触发阈值 (70%) 比 collapse (75%) 更低 —
       优先尝试轻量级硬删除，不够再上 collapse

▸ 第 4 层：auto compact（自动压缩）
  触发：利用率 > 85% (AUTOCOMPACT_UTILIZATION)
  策略：使用模型自己生成旧历史的摘要 (compactConversation + buildCompactSummaryPrompt)
  入口：autoCompact() @ src/compact/auto-compact.ts:45-82
  触发路径：runAgentTurn → src/agent-loop.ts:222-227
  容错：连续失败 3 次 (MAX_AUTOCOMPACT_FAILURES) → 自动禁用，回退到 snip/microcompact
  手动触发：也可通过 /compact 斜杠命令调用

▸ 保留边界算法 (findRetentionBoundary)
  位置：src/compact/compact.ts:58-86
  向后扫描累积 token 直到 MAX_KEEP_TOKENS (40,000)
  保证至少保留 6 条消息 (MIN_KEEP_MESSAGES)
  调用 alignBoundaryToApiRound 确保 assistant_tool_call 和 tool_result 永不分离

═══════════════════════════════════════
面试最容易被追问的三个点
═══════════════════════════════════════

1. "collapse 为什么说是投影视图，不是修改历史？"
   → 原始消息仍在 transcripts 存储中，只是给模型的视图被替换为摘要版本。
     相当于"给模型看摘要，自己保留原稿"。

2. "为什么 snip (70%) 触发阈值比 collapse (75%) 还低？"
   → snip 是硬删除，信息损失更大但代价更低。设计上优先尝试轻量级硬删除，
     如果删完后利用率仍不够再上 collapse（投影视图计算成本更高）。

3. "如果 auto compact 调模型摘要也失败了怎么办？"
   → 连续 3 次失败后 self-disable，fallback 到 snip/microcompact。
     不会因为摘要调用失败而导致 Agent 卡死。

═══════════════════════════════════════
简历改写参考
═══════════════════════════════════════

如果你后续想把 R06 加入简历（例如升级到高阶组合时），推荐写法：

"设计分层上下文压缩策略，按上下文利用率触发 microcompact、
 context collapse、snip compact 与 auto compact，在保留关键工具调用
 和最近上下文的同时控制长会话 token 膨胀。"

注意：
• 写"设计"而非"实现"（因为你是 L2，源码细节不是你的主战场）
• 面试中要能区分四种策略的触发条件
• 要说得出"修改历史"和"投影视图"的核心区别

═══════════════════════════════════════
CodeWiki 深挖源
═══════════════════════════════════════
以上全部内容基于 MiniCode-Complete-CN.md §W04 (Lines 995-1176)，
覆盖 src/compact/ 目录下全部压缩策略源码注释。
未使用路线图、未来规划或扩展设想内容。
```

---

## 阶段 6：验证护栏执行记录

在整个流程中，以下规则被逐条检查并执行：

| 规则 | 来源 | 触发点 | 结果 |
|------|------|--------|------|
| 仅推荐 4-5 个点 | SKILL.md Output Rules #1 | 阶段 2 选点 | ✅ 严格 5 个 |
| 每个 Rxx 匹配 Qxx.x | SKILL.md Output Rules #2 | 阶段 4 Q&A | ✅ 11 个追问全部匹配 |
| 高阶点警告 mastery | SKILL.md Output Rules #3 | 阶段 2 交叉校验 | ✅ R13 flagged ⚠️ |
| 不将 roadmap 写成已实现 | SKILL.md Output Rules #4 | 阶段 5 深挖 | ✅ 仅引用源码已验证内容 |
| 不编造量化指标 | SKILL.md Output Rules #5 | 阶段 3 简历生成 | ✅ 无百分比/数字造假 |
| 预写 bullet 原文使用 | SKILL.md Step 4 (NEW) | 阶段 3 简历生成 | ✅ verbatim 使用 |
| 四段式回答结构 | SKILL.md Step 5 (NEW) | 阶段 4 Q&A | ✅ preamble 已注入 |
| Mastery 交叉校验 | SKILL.md Step 2b (NEW) | 阶段 2 方案匹配 | ✅ R06→R05 降级已执行 |
| CodeWiki 事实校验 | codewiki-index.md Verification Rule | 阶段 5 深挖 | ✅ 四题全过 |

---

## 关键执行链总结

```
用户输入
  │
  ├─→ Stage 0: Skill 匹配 (MiniCode + 简历 → minicode-resume-skill)
  │
  ├─→ Stage 1: user-intake.md → 3 missing questions → user profile
  │
  ├─→ Stage 2: combo-plans.md → Plan B matched → Step 2b cross-check
  │       │                                    │
  │       │                                    ├─ R06 (L3-only) → R05 downgrade
  │       │                                    └─ R13 (L3) → user accepts with warning
  │       │
  │       └─→ Final: R01, R04, R05, R13, R15
  │
  ├─→ Stage 3: resume-points.md → "What to Explain" check → verbatim bullets
  │       │
  │       └─→ 完整简历项目 (5 bullets + tech stack + summary)
  │
  ├─→ Stage 4: interview-qa.md → Qxx.x matching → 四段式 structure
  │       │
  │       └─→ 11 Q&A prep items + 优先级排序
  │
  └─→ Stage 5: Deep-dive trigger → codewiki-index.md → W04 (995-1176)
          │
          ├─→ 四层压缩完整解释
          ├─→ 三个面试追问热点
          ├─→ 简历改写参考
          └─→ 验证规则：无 roadmap/未来规划泄露
```

---

> **文档生成信息**
> - Skill 版本：修复后版本（含 Step 2b 交叉校验 + 四段式 + Qxx.x 子编号 + 逐点面试指导）
> - 测试用户画像：Java+Python 后端 / L2 / balanced / AI 应用开发 / 经验跳槽
> - 测试日期：2026-06-16
> - 对应参考文件：SKILL.md、user-intake.md、combo-plans.md、resume-points.md、interview-qa.md、codewiki-index.md、MiniCode-Complete-CN.md
