# Craft Agents Resume Skill 使用说明

当前版本先建立 Agent Project Model，再生成 Claim 与简历：`事实抽取 → Agent Architecture Mapping → 场景 Artifact → 状态/Ownership/证据门控 → Coverage → Claim → Bullet`。`resume-points.md` 是事实参考库，不是生成上限；场景模式会动态推导 Adapter、CLI/MCP、Schema、Skill/SOP、Memory、Dataset、Agent Eval、Benchmark 与 Reviewer，并按真实状态决定措辞。

核心新增文件：

- `references/agent-project-modeling.md`
- `references/evidence-navigation.md`：编号 → 文档 → 相对路径 → 章节/表格行的导航索引
- `assets/agent-project-model-template.json`
- `scripts/validate_agent_project_model.py` 与 `scripts/validate_resume_package.py`

Craft Agents Resume Skill 是一个面向 AI Agent 的高阶简历项目生成技能。

它的作用是让 Agent 根据你的背景、目标岗位和掌握程度，把 Craft Agents 包装成一段可以写进简历的高阶 Agent 架构项目经历，并自动配套生成面试 Q&A、技术追问准备和 CodeWiki 深挖依据。

它适合这些场景：

- 你想把 Craft Agents 写成 Agent 架构、AI Infra、后端平台、桌面 Agent 或 MCP 工具生态项目。
- 你不知道自己该选哪些技术点，想让 Agent 从 `R01-R27` 和动态 Artifact 中挑出至少 4 条最适合的内容。
- 你担心简历写得太高级但讲不清楚，想让 Agent 标注风险和降级说法。
- 你想对某个技术点做源码/CodeWiki 深挖，准备强追问。

## 你会拿到什么

下载后，请确认文件夹结构大致如下：

```text
craft-agents-resume-skill/
├── SKILL.md
├── README.md
├── agents/
│   └── openai.yaml
└── references/
    ├── resume-points.md
    ├── interview-qa.md
    ├── combo-plans.md
    ├── user-intake.md
    ├── scenario-architecture.md
    ├── scenario-router.md
    ├── multi-industry-agent-scenario-library.md
    ├── codewiki-index.md
    ├── evidence-navigation.md
    ├── Craft-Agents-中文技术手册.md
    └── craft-ai-agents-craft-agents-oss-DeepWiki.md
```

不要只复制 `SKILL.md`。这个 Skill 的价值主要来自 `references/` 里的要点库、Q&A、组合方案和完整源材料。

如果用户问“R21/401/101 在哪里”，Skill 必须先解析编号前缀，并输出对应文件、相对路径和章节/表格行；不完整编号不得猜测。

## 下载方式

如果你收到的是网盘、飞书、GitHub 或压缩包链接：

1. 下载整个 `craft-agents-resume-skill` 文件夹。
2. 如果下载下来是 `.zip`，先解压。
3. 确认解压后的根目录里能看到 `SKILL.md`。
4. 如果文件夹名变成了 `craft-agents-resume-skill-main`，建议重命名为 `craft-agents-resume-skill`。

## 安装到 Codex

macOS / Linux：

```bash
mkdir -p ~/.codex/skills
cp -R ~/Downloads/craft-agents-resume-skill ~/.codex/skills/
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force $env:USERPROFILE\.codex\skills
Copy-Item -Recurse .\craft-agents-resume-skill $env:USERPROFILE\.codex\skills\
```

安装后检查：

```bash
ls ~/.codex/skills/craft-agents-resume-skill/SKILL.md
ls ~/.codex/skills/craft-agents-resume-skill/references/Craft-Agents-中文技术手册.md
```

如果这两个文件都能看到，说明核心文件已经放对。

## 安装到其他支持 Skill 的 Agent

如果你用的不是 Codex，而是其他支持本地 Skill / Agent Skill / 自定义技能的客户端，原则一样：

1. 找到该 Agent 的本地 skills 目录。
2. 把整个 `craft-agents-resume-skill` 文件夹复制进去。
3. 确认 `SKILL.md` 位于技能文件夹根目录。
4. 确认 `references/` 没有丢失。
5. 重启或刷新 Agent，让它重新加载技能列表。

如果你的聊天产品不能读取本地文件夹，可以把整个文件夹上传到项目知识库或文件区，再让 Agent 按 `SKILL.md` 的流程执行。

## 第一次使用

可以直接这样问：

```text
请使用 Craft Agents Resume Skill，根据我的背景生成一版高阶 Agent 架构项目经历。

我的背景：
- 目标岗位：AI Agent 架构 / 后端平台
- 技术栈：TypeScript、React、Node/Bun、WebSocket
- 熟悉：架构分层、状态管理、接口协议
- 不熟：OAuth 和 MCP 细节

请输出：
1. 项目名称
2. 项目简介（一句话）
3. 技术栈
4. 至少 4 条简历 bullet（交代问题、技术、Artifact 与效果；不机械依赖固定句式）
5. 每条 bullet 对应的 Artifact 与内部证据映射
6. 对应面试 Q&A
7. 高风险点和降级建议
```

如果不知道适合哪个方向：

```text
请使用 Craft Agents Resume Skill，先问我必要背景问题，然后判断我适合 Agent Core、后端平台、桌面 Agent、MCP 工具生态还是保守版本。
```

## 深挖某个技术点

普通生成简历时，Agent 不需要读取完整技术手册。只有当你要准备强追问、源码解释或优化高阶 bullet 时，再让 Agent 使用 CodeWiki。

示例：

```text
请基于 Craft Agents CodeWiki 深挖 R06 Permission Mode 与 PreToolUse 安全管线。
要求：
1. 解释这个点解决什么问题
2. Craft Agents 如何实现
3. 面试官可能怎么追问
4. 我应该怎么回答
5. 哪些说法不能写成已实现能力
```

优化已有 bullet：

```text
请使用 Craft Agents Resume Skill，基于 CodeWiki 优化这条 bullet：
“实现了 Agent 权限系统，提升安全性。”

要求：
1. 不夸大
2. 更像真实工程项目
3. 给出对应 Rxx / Qxx / Wxx
4. 标注降级说法
```

## 好用的提示词

保守版本：

```text
请使用 Craft Agents Resume Skill，给我一版面试风险较低的 Craft Agents 项目经历。不要写我很难解释的高阶点。
```

高阶 Agent 架构版本：

```text
请使用 Craft Agents Resume Skill，给我一版偏 Agent Core 架构的高阶版本。所有高阶表述必须能被 CodeWiki 支撑，不能把扩展设想写成已实现。
```

MCP 工具生态版本：

```text
请使用 Craft Agents Resume Skill，把 Craft Agents 包装成 MCP / Sources / Skills 工具生态项目，并标注哪些点面试风险最高。
```

面试冲刺：

```text
请使用 Craft Agents Resume Skill，根据我选的 R03、R06、R08、R12、R18，生成一份面试追问清单。每个问题都要给回答框架、误区和降级说法。
```

## 场景化对齐（贴 JD 自动切换）

当你有目标岗位的 JD 时，贴上 JD 和公司背景，Skill 会自动进入场景化模式，把 Craft Agents 重新框定到目标公司的业务场景。

```text
请使用 Craft Agents Resume Skill，根据以下 JD 帮我做场景化对齐：

【JD】
<粘贴岗位描述>

【公司背景】
行业 / 业务模式 / 团队规模 / 用的 IM

【我的掌握度】L2，目标岗位：Agent 架构工程师
```

你会拿到：场景映射表、审计映射（含 Rxx/Sxx + Scope Boundary）、可贴简历项目条目、源码驱动的面试 talking points、IM 桥接方案（R22 原生覆盖飞书/Telegram/WhatsApp，钉钉/企微靠 cc-connect）、对抗式审查（7 项检查）。快速入口是金融 Research Agent 或电商/零售经营决策 Agent；更多行业通过 `scenario-router.md` 分级选择，并按 route 按需读取。

简历正文采用“短摘要 + 一段连续自然语言 STAR”格式；支撑点、层级、route 和 Claim 只保留在审计视图，不进入可贴简历版。面试 QA 另按 `source-driven-qa.md` 绑定源码 Artifact、测试证据和追问路径。

## 面试 Q&A 预测

贴上 JD，让 Skill 基于项目源码预测面试官会问什么，并给出连贯答案、源码定位、追问和降级建议。

```text
请使用 Craft Agents Resume Skill，根据以下 JD 预测面试问题。我选了 R03、R10、R08、R12、R17，掌握度 L2。

【JD】
<粘贴岗位描述>
```

你会拿到四部分：

1. **按 Claim 的源码预测题 + 连贯答案**：基于 source-driven-qa.md、interview-qa.md、源码索引和 JD 特定追问
2. **场景化追问**：interview-qa.md 没覆盖的岗位/公司特有问题
3. **扛不住的追问 + 降级建议**：基于掌握度预测 L2 扛不住的源码级追问，每条给具体降级路径（如"R06 讲不清 -> 降级到 R10"）
4. **项目故事摘要**：每条 bullet 的 30 秒电梯版 STAR，指向完整版项目故事（见下节）

## 项目故事生成

面试时需要从头到尾说清"为什么做、怎么运转、我做了什么"。贴上触发词，Skill 会生成完整 8 模块故事包。

```text
请使用 Craft Agents Resume Skill，帮我生成项目故事，讲清楚项目怎么迭代的、我负责哪些板块。
```

8 个模块：项目事实卡（标注【本人实际参与】/【项目整体架构】/【待确认】）、业务故事、架构与数据流（Mermaid 图 + 标注【本人参与】）、技术故事、我的 STAR 故事（30 秒/90 秒/3 分钟三版本）、拷打问题树（≥8 轮 2 层追问）、多项目串联、技术关系速记。

## 全流程（贴 JD 一站完成）

```text
请使用 Craft Agents Resume Skill，根据以下 JD 帮我做全流程：场景化简历 + 面试 Q&A 预测 + 对抗式审查。

【JD】
<粘贴岗位描述>

【公司背景】
行业 / 业务模式 / 团队规模 / 用的 IM

【我的掌握度】L2，保守偏好
```

## 注意事项

- 不要一次写 10 个技术点。简历至少保留 4 条，但确认项不足时应输出待确认草稿，不得凑成终稿。
- 不要编造性能数据、用户数、业务收益或线上事故。
- 不要把路线图、扩展设想、未证实能力写成已经完成。
- `R06 R18 R19 R21 R22` 都属于高风险点，不熟就降级。
- 面试前一定要用对应 `Qxx.x` 逐条练习。

## 最小验证清单

安装后，用下面这句话测试：

```text
请使用 Craft Agents Resume Skill，给一个目标 AI Agent 架构岗位的同学生成 Craft Agents 简历项目，要求选择 4-5 个 Rxx 点，并给出对应 Qxx 面试准备。
```

如果输出里包含：

- 至少 4 个简历 bullet，且能追溯到 Artifact
- `Rxx` 编号
- `Qxx.x` 面试题
- 高风险提示和降级建议
- CodeWiki 深挖入口

说明 Skill 已经可以正常使用。

## Claim-Evidence 与面试闭环

新版 Skill 在简历生成和场景对齐前建立 Claim Ledger：每条 bullet 绑定事实、支撑点、责任边界、结果类型和面试追问。用户选择或接受的点视为愿意承担该点的面试责任，但精确指标仍需独立来源。

输出分为审计视图和可贴简历版。审计视图保留 Claim、R/H/RT/S、W/Q、状态和风险；可贴简历版隐藏这些内部字段。生成后可使用 scripts/validate_claim_ledger.py 校验账本。

面试准备支持 Predict、Grill、Review、Retry：一次只问一个问题，先锁定必要证据，复练时使用变体或反事实题，并把 verified、partial、unverified、contradictory 状态反写到简历表述。
