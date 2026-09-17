# MiniCode 双产品 MVP 说明

## 这套产品解决什么

这套 MiniCode 资料不是单纯给会员一份项目介绍，而是把一个轻量级 AI Coding Agent 项目拆成两种可交付资产：

- 人读版内参：会员自己阅读、选点、改简历、准备面试。
- Agent Skill 版：会员把 Skill 交给 Codex、Claude Code 或类似 Agent 使用，让 Agent 根据自己的背景生成简历项目和追问清单。

核心交付承诺是：

> 给会员一个能写进简历、能讲清技术、能准备追问的 AI Agent 项目素材库。

## 文件结构

人读版内参：

- `01-MiniCode项目使用指南-付费版.md`：告诉会员怎么使用这套资料。
- `02-MiniCode简历要点库-付费版.md`：提供可选简历亮点，会员从中选 4-5 个。
- `03-MiniCode项目面试Q&A-付费版.md`：每个简历点对应的面试追问和回答。
- `04-MiniCode简历组合方案-付费版.md`：不同岗位、不同基础的默认组合方案。

Agent Skill 版：

- `minicode-resume-skill/SKILL.md`：Agent 工作流入口。
- `minicode-resume-skill/references/resume-points.md`：Agent 使用的简历点压缩库。
- `minicode-resume-skill/references/interview-qa.md`：Agent 使用的 Q&A 压缩库。
- `minicode-resume-skill/references/combo-plans.md`：Agent 使用的组合策略。
- `minicode-resume-skill/references/user-intake.md`：Agent 向用户收集背景的问题。
- `minicode-resume-skill/references/codewiki-index.md`：从简历点映射到 CodeWiki 章节。
- `minicode-resume-skill/references/MiniCode-Complete-CN.md`：完整 CodeWiki，供深挖和校验。

## 两个产品的差异

人读版负责教学和判断：

- 解释 MiniCode 到底是什么项目。
- 告诉会员哪些点适合写，哪些点不适合硬写。
- 给出不同基础和岗位的组合方案。
- 帮会员理解面试官为什么会追问这些点。

Skill 版负责自动化生成：

- 根据用户背景选择合适的 4-5 个点。
- 生成一版简历项目经历。
- 给出对应面试准备清单。
- 当用户要求深挖某个点时，回到 CodeWiki 查证，不凭空发挥。

## 共用编号体系

所有资料共用同一套编号：

- `Rxx`：Resume Point，简历要点。
- `Qxx.x`：Interview Question，面试追问。
- `Wxx`：Wiki Anchor，CodeWiki 深挖索引。

例子：

- `R01` 是 Agent Loop 执行闭环。
- `Q01.1`、`Q01.2` 是围绕这个点的面试追问。
- `W01` 指向 CodeWiki 中“核心代理循环”和“代理轮次生命周期”的章节。

会员写进简历的每一个 `Rxx`，都必须能找到对应 `Qxx.x` 和 `Wxx`。

## 使用边界

这套资料有三个硬规则：

- 不把 CodeWiki 里的路线图、未来规划、扩展设想写成已实现能力。
- 不建议会员写自己完全讲不清的高阶点。
- 高阶点如果没有 CodeWiki 支撑，只能写成“可扩展方向”，不能写成项目已完成成果。

## MVP 成功标准

这个 MVP 做到下面四件事就够：

- 会员能从要点库中选出 4-5 个适合自己的简历点。
- 每个简历点都能在 Q&A 中找到对应追问。
- 会员可以直接使用组合方案生成一版 MiniCode 项目经历。
- Agent 调用 Skill 时，可以根据用户背景自动完成选点、生成简历和准备面试题。

