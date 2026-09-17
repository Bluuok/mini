# HappyClaw Resume Skill 使用说明

HappyClaw Resume Skill 是一个面向 AI Agent 的高阶简历项目生成技能。

它的作用是让 Agent 根据你的背景、目标岗位和掌握程度，把 HappyClaw 包装成一段可以写进简历的多用户 Agent 工作台 + 企业数字员工平台项目经历，并自动配套生成面试 Q&A、技术追问准备和 CodeWiki 深挖依据。

它适合这些场景：

- 你想把 HappyClaw 写成企业 AI 应用、数字员工、Agent 平台、后端或前端项目。
- 你不知道自己该选哪些技术点，想让 Agent 从 `R01-R27` 中帮你挑 4-5 个最适合的。
- 你担心简历写得太高级但讲不清楚，想让 Agent 标注风险和降级说法。
- 你想对某个技术点做源码/CodeWiki 深挖，准备强追问。

## 你会拿到什么

下载后，请确认文件夹结构大致如下：

```text
happyclaw-resume-skill/
├── SKILL.md
├── README.md
├── agents/
│   └── openai.yaml
└── references/
    ├── resume-points.md
    ├── interview-qa.md
    ├── combo-plans.md
    ├── user-intake.md
    ├── codewiki-index.md
    └── wiki/
        ├── 1-gai-shu-happyclaw-shi-shi-yao-yu-wei-shi-yao.md
        ├── 2-kuai-su-kai-shi-...md
        ├── ... (共 23 篇)
        └── 23-kai-fa-gong-zuo-liu-...md
```

不要只复制 `SKILL.md`。这个 Skill 的价值主要来自 `references/` 里的要点库、Q&A、组合方案和完整 codewiki 源材料。

## 下载方式

如果你收到的是网盘、飞书、GitHub 或压缩包链接：

1. 下载整个 `happyclaw-resume-skill` 文件夹。
2. 如果下载下来是 `.zip`，先解压。
3. 确认解压后的根目录里能看到 `SKILL.md`。
4. 如果文件夹名变成了 `happyclaw-resume-skill-main`，建议重命名为 `happyclaw-resume-skill`。

## 安装到 Codex

macOS / Linux：

```bash
mkdir -p ~/.codex/skills
cp -R ~/Downloads/happyclaw-resume-skill ~/.codex/skills/
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force $env:USERPROFILE\.codex\skills
Copy-Item -Recurse .\happyclaw-resume-skill $env:USERPROFILE\.codex\skills\
```

安装后检查：

```bash
ls ~/.codex/skills/happyclaw-resume-skill/SKILL.md
ls ~/.codex/skills/happyclaw-resume-skill/references/codewiki-index.md
```

如果这两个文件都能看到，说明核心文件已经放对。

## 安装到其他支持 Skill 的 Agent

如果你用的不是 Codex，而是其他支持本地 Skill / Agent Skill / 自定义技能的客户端，原则一样：

1. 找到该 Agent 的本地 skills 目录。
2. 把整个 `happyclaw-resume-skill` 文件夹复制进去。
3. 确认 `SKILL.md` 位于技能文件夹根目录。
4. 确认 `references/` 没有丢失（含 `wiki/` 子目录共 23 篇 codewiki）。
5. 重启或刷新 Agent，让它重新加载技能列表。

如果你的聊天产品不能读取本地文件夹，可以把整个文件夹上传到项目知识库或文件区，再让 Agent 按 `SKILL.md` 的流程执行。

## 第一次使用

可以直接这样问：

```text
请使用 HappyClaw Resume Skill，根据我的背景生成一版多用户 Agent 工作台项目经历。

我的背景：
- 目标岗位：企业 AI 应用 / 数字员工 / Agent 平台
- 技术栈：TypeScript、Node.js、React、SQLite
- 熟悉：后端接口、状态管理、工程化
- 不熟：Docker 安全和 MCP 协议细节

请输出：
1. 项目名称
2. 项目简介（一句话）
3. 技术栈
4. 4-5 条简历 bullet（每条按"针对xx业务问题，基于xx技术，设计了xx工程方案，实现了xx验证效果"四段式输出）
5. 每条 bullet 对应的 Rxx
6. 对应面试 Q&A
7. 高风险点和降级建议
```

如果不知道适合哪个方向：

```text
请使用 HappyClaw Resume Skill，先问我必要背景问题，然后判断我适合 Agent Core、多渠道 IM 平台、数据与调度、前端体验、能力治理、企业数字员工还是保守版本。
```

## 深挖某个技术点

普通生成简历时，Agent 不需要读取完整 codewiki。只有当你要准备强追问、源码解释或优化高阶 bullet 时，再让 Agent 使用 CodeWiki。

示例：

```text
请基于 HappyClaw CodeWiki 深挖 R14 定时任务调度器的 V2 Materialization 模式。
要求：
1. 解释这个点解决什么问题
2. HappyClaw 如何实现
3. 面试官可能怎么追问
4. 我应该怎么回答
5. 哪些说法不能写成已实现能力
```

优化已有 bullet：

```text
请使用 HappyClaw Resume Skill，基于 CodeWiki 优化这条 bullet：
"实现了定时任务系统，提升自动化。"

要求：
1. 不夸大
2. 更像真实工程项目
3. 给出对应 Rxx / Qxx / Wxx
4. 标注降级说法
```

## 好用的提示词

保守版本：

```text
请使用 HappyClaw Resume Skill，给我一版面试风险较低的 HappyClaw 项目经历。不要写我很难解释的高阶点。
```

企业数字员工版本：

```text
请使用 HappyClaw Resume Skill，把 HappyClaw 包装成企业数字员工平台项目，突出 IM 驻场、定时任务自动化和多租户安全。所有高阶表述必须能被 CodeWiki 支撑，不能把扩展设想写成已实现。
```

Agent Core 架构版本：

```text
请使用 HappyClaw Resume Skill，给我一版偏 Agent Core 架构的高阶版本，围绕双模式执行引擎、IPC 协议和 StreamEvent 事件流展开。
```

面试冲刺：

```text
请使用 HappyClaw Resume Skill，根据我选的 R07、R14、R15、R20、R23，生成一份面试追问清单。每个问题都要给回答框架、误区和降级说法。
```

## 场景化对齐（贴 JD 自动切换）

当你有目标岗位的 JD 时，贴上 JD 和公司背景，Skill 会自动进入场景化模式，把 HappyClaw 重新框定到目标公司的业务场景。

```text
请使用 HappyClaw Resume Skill，根据以下 JD 帮我做场景化对齐：

【JD】
<粘贴岗位描述>

【公司背景】
行业 / 业务模式 / 团队规模 / 用的 IM

【我的掌握度】L2，目标岗位：Agent 平台工程师
```

你会拿到：场景映射表、重写简历条目（每条标 Rxx + Scope Boundary）、面试 talking points（四段式）、IM 桥接方案（HappyClaw 原生 7 渠道含飞书/钉钉/微信/Telegram/Discord/WhatsApp/QQ，企业微信走 cc-connect wecom，Slack 靠 cc-connect）、对抗式审查（5 项检查）。

注意：HappyClaw 降级 R23->R19 后，"多租户""运行时安全"定位会失去支撑，项目名会自动收束为"多用户 Agent 工作台 + 数字员工"。

## 面试 Q&A 预测

贴上 JD，让 Skill 预测面试官会问什么，并给出四段式答案和降级建议。

```text
请使用 HappyClaw Resume Skill，根据以下 JD 预测面试问题。我选了 R01、R07、R11、R15、R19，掌握度 L2。

【JD】
<粘贴岗位描述>
```

你会拿到四部分：

1. **按 R 点的高频预测题 + 四段式答案**：基于 interview-qa.md 静态题库 + JD 特定追问
2. **场景化追问**：interview-qa.md 没覆盖的岗位/公司特有问题。注意：HappyClaw 无 RAG/向量检索能力，如果 JD 要求 RAG 会预测为"无法承接"的高严重度漏洞
3. **扛不住的追问 + 降级建议**：基于掌握度预测 L2 扛不住的源码级追问，每条给具体降级路径（如"R23 讲不清 -> 降级到 R19 Web 认证"）
4. **项目故事摘要**：每条 bullet 的 30 秒电梯版 STAR，指向完整版项目故事（见下节）

## 项目故事生成

面试时需要从头到尾说清"为什么做、怎么运转、我做了什么"。贴上触发词，Skill 会生成完整 8 模块故事包。

```text
请使用 HappyClaw Resume Skill，帮我生成项目故事，讲清楚项目怎么迭代的、我负责哪些板块。
```

8 个模块：项目事实卡（标注【本人实际参与】/【项目整体架构】/【待确认】）、业务故事、架构与数据流（Mermaid 图 + 标注【本人参与】）、技术故事、我的 STAR 故事（30 秒/90 秒/3 分钟三版本）、拷打问题树（≥8 轮 2 层追问）、多项目串联、技术关系速记。

## 全流程（贴 JD 一站完成）

```text
请使用 HappyClaw Resume Skill，根据以下 JD 帮我做全流程：场景化简历 + 面试 Q&A 预测 + 对抗式审查。

【JD】
<粘贴岗位描述>

【公司背景】
行业 / 业务模式 / 团队规模 / 用的 IM

【我的掌握度】L2，保守偏好
```

## 注意事项

- 不要一次写 10 个技术点。简历里只保留 4-5 个最能讲清楚的点。
- 不要编造性能数据、用户数、业务收益或线上事故。
- 不要把路线图、扩展设想、未证实能力写成已经完成。
- `R04 R16 R23` 是最高风险点，不熟就降级。
- `R03 R05 R06 R09 R10 R14 R17 R20` 是中高风险点，面试前一定要用对应 `Qxx.x` 逐条练习。

## 最小验证清单

安装后，用下面这句话测试：

```text
请使用 HappyClaw Resume Skill，给一个目标企业数字员工岗位的同学生成 HappyClaw 简历项目，要求选择 4-5 个 Rxx 点，并给出对应 Qxx 面试准备。
```

如果输出里包含：

- 4-5 个简历 bullet
- `Rxx` 编号
- `Qxx.x` 面试题
- 高风险提示和降级建议
- CodeWiki 深挖入口

说明 Skill 已经可以正常使用。
