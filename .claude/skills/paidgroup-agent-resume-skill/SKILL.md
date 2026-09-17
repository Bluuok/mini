---
name: paidgroup-agent-resume-skill
description: 付费群三项目简历技能：面向 MiniCode、Craft Agents、HappyClaw 三个 Agent 项目的一体化简历与面试技能。完整保留原有三项目 skill 能力（Resume 简历项目生成：项目描述【项目名称+项目简介一句话+技术栈+项目定位】→4-5 条四段式要点；Scenario 场景化对齐；Q&A 面试预测；8 模块项目故事；Full-flow；对抗式审查；CodeWiki 深挖），并融合 ASu 能力（/asu 经历酥化、/resume 可编辑简历制作与 PDF 导出、/asu-resume 同款简历复刻）。当用户输入“/asu”“/resume”“/asu-resume”，要求酥化经历、包装 MiniCode/Craft Agents/HappyClaw 项目、生成简历项目、场景化对齐 JD、预测面试 Q&A、生成项目故事、复刻同款简历、制作可编辑 HTML 简历或导出 PDF 时使用。
---

# paidgroup-agent-resume-skill：三项目简历与面试技能

面向付费群三项目（MiniCode / Craft Agents / HappyClaw）的一体化技能。**核心原则：原有三项目 skill 的完整工作流原样保留在 `references/<项目>/workflow.md`，本文件只做模式路由与 ASu 三命令，不压缩、不重写原有步骤。**

## 模式路由（第一步：选项目 + 选模式）

### 第 1 步：选项目

用户经历属于三项目之一时，先确定项目（MiniCode / Craft Agents / HappyClaw），然后加载该项目的完整工作流：

| 项目 | 完整工作流（原样迁移） | 精选 refs（同目录） | codewiki 运行时定位 |
| --- | --- | --- | --- |
| MiniCode | [references/minicode/workflow.md](references/minicode/workflow.md) | `./user-intake.md` `./combo-plans.md` `./resume-points.md` `./interview-qa.md` `./codewiki-index.md` | `03-定稿/付费群文档汇总/三项目codewiki/MiniCode-main/` |
| Craft Agents | [references/craft-agents/workflow.md](references/craft-agents/workflow.md) | 同上 | `03-定稿/付费群文档汇总/三项目codewiki/craft-agents-oss/` |
| HappyClaw | [references/happyclaw/workflow.md](references/happyclaw/workflow.md) | 同上 | `03-定稿/付费群文档汇总/三项目codewiki/happyclaw-main/` |

**执行该项目的任何模式时，必须打开对应 `workflow.md` 并严格按其步骤执行，不得跳过或自行改写。**

### 第 2 步：选模式

**入口一：三项目模式（原有能力，执行主体是 `references/<项目>/workflow.md`）**

| 模式 | 触发 | 说明 |
| --- | --- | --- |
| **Resume（简历项目生成）** | 用户给背景（角色/掌握程度/风险偏好）无 JD | 按 workflow.md 的 Workflow 执行：**先输出项目描述（项目名称 + 项目简介一句话 + 技术栈 + 项目定位），再输出 4-5 条四段式要点**，每条对应一个 Rxx 并匹配 Qxx.x 面试准备 |
| **Scenario（场景化对齐）** | 用户粘贴 JD / 公司背景 | 按 workflow.md 的 Step 1a 执行：解构 JD → 加载能力 → 场景-能力映射 → 改写 bullet（业务问题槽换成 JD 痛点，**保持四段式**）→ IM 桥接 → 输出对齐包 → 降级后定位复核 |
| **Q&A Prediction（面试预测）** | “面试预测”“面试问题”“面试官会问什么” | 按 workflow.md 的 Step 1b 执行，输出 Part 1-4 |
| **Story（项目故事）** | “项目故事”“讲清楚项目”“STAR 故事”“实习经历”“项目迭代” | 按 workflow.md 的 Step 1c 执行，输出 8 模块故事包；**另按 [references/story-methodology.md](references/story-methodology.md) 的九阶段开发故事主线，把整个项目的开发过程组织成方法论驱动的开发故事**（不替换 8 模块，用交叉表对齐） |
| **Full-flow** | 粘贴 JD + 要面试准备 | Scenario → Q&A Prediction（含 Part 4 故事摘要）→ 对抗式审查 |
| **Deep-dive** | “深入讲 R06”“基于 CodeWiki 解释”“这个设计为什么这么做” | 按 workflow.md 的 Deep-Dive Rule 执行 |
| **对抗式审查** | “场景化简历审查”“找漏洞” | 5 项清单：缺口、逻辑冲突、能力归属、场景覆盖、定位完整性 |

**入口二：ASu 三命令（简历文件产出）**

| 命令 | 能力 | 产出 |
| --- | --- | --- |
| `/asu` | 经历酥化 | 岗位定位、项目改写（四段式）、成果证据、HR 开场白，完整规则见 [references/suhua.md](references/suhua.md) |
| `/resume` | 简历制作 | 可编辑 HTML 简历、模板复刻、PDF 导出，完整规则见 [references/resume-html.md](references/resume-html.md) |
| `/asu-resume` | 同款简历 | 复刻 ASu 单栏高密度技术简历、Logo 资源、PDF，完整规则见 [references/same-style-template.md](references/same-style-template.md) |

意图不明时先问：“你是哪个项目（MiniCode / Craft Agents / HappyClaw）？有目标岗位 JD 吗？需要简历项目生成、场景化对齐、面试 Q&A 预测、项目故事，还是做简历文件？”

## 三项目模式执行要点（摘要，完整步骤见对应 workflow.md）

> 以下为路由摘要，**不得替代 workflow.md**。每个模式的完整步骤、输入输出、约束都以其为准。

### Resume：简历项目生成（核心输出契约）

执行 `references/<项目>/workflow.md` 的 Workflow（Steps 1-6）后，交付必须包含：

1. **项目描述（简历大致描述）**：按序输出四个字段，缺一不可——
   - **项目名称**（如“MiniCode — 轻量级终端 AI Coding Agent”）；
   - **项目简介**：恰好一句话（项目简介一句话）；
   - **技术栈**（如 TypeScript、Node.js、MCP、Docker）；
   - **项目定位**（如 个人开源项目 / 个人学习型项目）。
2. **项目要点（4-5 条 bullet）**：每条必须是四段式 `针对[业务问题]，基于[技术]，设计了[工程方案]，实现了[验证效果]。`；**必须直接使用 `./resume-points.md` 中对应 Rxx 的预写 bullet 原文（verbatim），不得自行改写句式**（仅当用户有特定表述需求时可微调措辞，但四段式结构与技术表述不得改变）；每条标注 Rxx。
3. **对应面试 Q&A**：从 `./interview-qa.md` 返回每个选中 Rxx 的 Qxx.x 准备清单。
4. 掌握程度降级警告与补学建议。

输出结构示例（内容以 `./resume-points.md` 原文为准）：

> **项目：MiniCode — 轻量级终端 AI Coding Agent**（个人开源项目）
> **技术栈**：TypeScript、Node.js、Anthropic API、MCP、JSON Schema / Zod
>
> - **R01** 针对多轮编码任务中模型推理与工具调用缺乏统一编排、长任务易中断的问题，基于模型-工具-模型循环的 Agent 执行模式，设计了以 `runAgentTurn` 为核心的执行循环（协调模型推理、工具调用、结果回填与终止检查），实现了多轮编码任务的稳定闭环执行。

禁止的反例：✗ 只给 bullets 不给项目名称/项目简介/技术栈；✗ 自编句式（如“设计并实现了 xxx，支持 xxx”），缺“针对…基于…设计了…实现了…”四段式；✗ 把验证效果写成编造数字（百分比/用户量/延迟）。

### Scenario：场景化对齐（Step 1a）

执行 `references/<项目>/workflow.md` 的 Step 1a（解构输入 → 加载能力 → 场景-能力映射 → 改写描述 → IM 桥接 → 输出对齐包 → 降级后定位复核）。项目特定参数（默认方案、前沿点编号、IM 能力、降级规则）见 [references/project-router.md](references/project-router.md)。

### Q&A Prediction / Story / Full-flow / Deep-dive / 对抗式审查

分别执行 workflow.md 的 Step 1b / Step 1c / 组合流程 / Deep-Dive Rule / 对抗式审查清单，步骤以 workflow.md 为准。

## 三项目项目特定参数（场景化/选点必需）

各项目的默认方案、前沿点编号、IM 桥接能力、掌握程度降级规则见 [references/project-router.md](references/project-router.md)。**场景化改写 bullet 时业务问题槽替换为 JD 场景痛点（保持四段式），验证效果除非 JD 给数字否则保持定性（目标/预期）；前沿点输出必须带【项目实现】/【前沿认知】标注，论文数字只进面试 talking points 严禁写进 bullet。**

## 输出规则（通用）

- 只推荐 4-5 个 `Rxx`，匹配 `Qxx.x` 面试准备，不要求用户写所有点。
- 选中点超过用户掌握程度时警告并提供降级路径。
- 不把 CodeWiki 里的路线图/未来计划写成已实现能力。
- 优先可信措辞：designed / implemented reference flow / supported / built mechanism / reduced risk；不编造指标。
- **简历输出格式（强制）**：先输出项目描述块（项目名称 + 项目简介恰好一句话 + 技术栈 + 项目定位），再输出 4-5 条要点；每条 bullet 必须是四段式 `针对[业务问题]，基于[技术]，设计了[工程方案]，实现了[验证效果]。`，且**直接使用 `./resume-points.md` 对应 Rxx 的预写 bullet 原文（verbatim），不自行改写**；验证效果是定性、可防守的 claim（风险收敛/一致性/受控），绝不是编造指标。
- **前沿点（评测/自进化/安全）**：每条前沿 bullet 分离【项目实现】与【前沿认知】；论文数字永不进 bullet；防守不住就降级（如 R25→R10、R24→R15、R23→R18，具体见各项目 workflow.md 与 project-router.md）。
- **能力归属**：每条 bullet 只能声明所选 R 点 Scope Boundary 内能力；业务工具标为自建适配器而非原生。
- 用户要“稳妥版”优先保守措辞与证据完整；要“进取版”可强化定位但标注待补证据。

## 表达边界

- 正式职位、公司、时间和教育背景保持真实。
- 只有能说明决策、交付和结果时，才使用“主导”“负责人”“Owner”等强动词。
- 没有可靠数字时使用可核验的定性结果，不编造百分比、用户量、延迟或排名。
- 对没有直接负责的内容明确写“团队负责”或“待确认”，不替用户冒领。
- 项目总调用量、用户数、Star/Fork 等指标要标明口径，不能自动算成个人成果。
- 不确定的信息使用 `【待补：指标/职责/链接】` 标记，成稿前集中让用户核对。
- 隐私：用户真实个人信息只写入用户要求的简历文件，不写入 skill 模板、示例或说明文档。

## 与 ASu 三命令的衔接

- 三项目模式产出文字（简历文案/场景化 bullet/talking points）后，用户要求做文件时转入 `/resume` 或 `/asu-resume` 生成可编辑 HTML/PDF。
- `/asu` 酥化面向非三项目经历；三项目经历优先走三项目模式的 Resume/Scenario 流程（有 R 点与 codewiki 证据支撑），产出后再决定是否做成简历文件。