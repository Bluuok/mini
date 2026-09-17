# Craft Agents 双产品 MVP 说明

## 这套产品解决什么

Craft Agents 不是一个普通的“AI 聊天界面项目”，而是一个高阶 Agent 工程架构项目。它同时覆盖 Agent 执行引擎、多后端模型适配、权限控制、会话持久化、IPC/WebSocket 协议、多端 UI、MCP/Skills/Sources 集成、OAuth 凭据管理和工程化验证。

这套付费版 MVP 的目标，是把 Craft Agents 包装成一个可写进简历、可讲清楚架构、可承受面试追问的高阶项目。

交付分成两个产品：

1. **人读版内参**：给会员学习、选点、组合简历、准备 Q&A。
2. **Agent Skill 版**：给 Agent 使用，根据用户背景自动生成 Craft Agents 简历项目和面试准备。

## 文件结构

```text
craft-agents付费版内参/
├── 00-CraftAgents双产品MVP说明.md
├── 01-CraftAgents项目使用指南-付费版.md
├── 02-CraftAgents简历要点库-付费版.md
├── 03-CraftAgents项目面试Q&A-付费版.md
├── 04-CraftAgents简历组合方案-付费版.md
├── craft-agents-resume-skill/
└── craft-agents-skill-example/
```

## 两个产品的差异

人读版负责：

- 解释 Craft Agents 为什么能作为高阶 Agent 架构项目。
- 帮会员从 `R01-R27` 中选择 4-5 个最适合自己的点。
- 用 `Qxx.x` 做反向筛选，删掉讲不清楚的点。
- 给出不同岗位和掌握程度的组合方案。

Skill 版负责：

- 让 Agent 根据用户背景自动选择组合方案。
- 生成项目简介、技术栈、4-5 条简历 bullet。
- 给每条 bullet 匹配 `Rxx` 和 `Qxx.x`。
- 在用户追问深挖时，通过 `Wxx` 回到技术手册或 DeepWiki。

## 共用编号体系

- `Rxx`：简历要点，例如 `R03 AgentBackend 抽象与 provider-agnostic event`。
- `Qxx.x`：面试问题，例如 `Q03.1 为什么需要 AgentBackend 抽象`。
- `Wxx`：技术依据索引，例如 `W03 Agent 执行引擎与 BaseAgent`。

这个编号体系保证三件事：

- 简历 bullet 不是孤立文案，而是能对应面试题。
- 面试答案不是临场发挥，而是能对应源码/技术手册依据。
- Skill 输出不是凭空生成，而是能回到完整资料深挖。

## 使用边界

- 不要一次写太多点，简历里优先写 4-5 个最能讲清楚的点。
- 不要把 Craft Agents 写成自己从零实现的完整商业产品，除非用户确实有对应实践。
- 不要编造性能指标、用户量、线上收益、业务结果。
- 不要把路线图、扩展设想、未证实能力写成已实现。
- 高阶点必须能讲清楚“问题、实现、取舍、局限”，否则降级。

## Claim-Evidence 升级后的能力

新版 Skill 在 R 点和最终 bullet 之间增加 Claim 层。每条 bullet 绑定原始事实、支撑点、个人归因、结果类型、Scope Boundary 和面试追问；面试后的 verified、partial、unverified、contradictory 状态可以反向驱动简历保留、降级或撤回。

Claim Ledger、面试 Session Ledger 和确定性校验脚本都放在 craft-agents-resume-skill 包内，支持独立安装。最终可贴简历版不显示内部状态和 Claim ID，审计视图保留完整追踪链路。

## MVP 成功标准

- 会员能从 `R01-R27` 中选出 4-5 个点写进简历。
- 每个点都有可练习的 `Qxx.x` 面试问题。
- Skill 能生成一版高阶 Agent 架构项目经历。
- 用户追问深挖时，Skill 能回到 `Wxx` 和完整源材料。
- 示例和评测记录能证明 Skill 输出符合护栏。
