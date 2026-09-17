# Craft Agents 简历组合方案（付费版）

## 使用说明

每个方案只推荐 5 个点。真正写进简历时可以删到 4 个。不要把多个方案简单拼接，否则面试追问面会过大。

## 方案 A：基础保守版

### 推荐人群

项目经验较少、只想稳妥写一个高质量 Agent 工程项目的同学。

### 推荐组合

`R01 R02 R08 R12 R24`

### 项目定位

Craft Agents 是一个多端 Agent 应用架构项目，重点展示 monorepo 分层、会话隔离、统一协议和工程验证。

### 面试准备重点

`Q01.x Q02.x Q08.x Q12.x Q24.x`

## 方案 B：Agent Core 高阶版

### 推荐人群

目标 AI Agent 架构、Agent 平台、AI Infra 岗位，并能讲清楚 Agent 执行机制的同学。

### 推荐组合

`R03 R04 R06 R10 R11`

### 项目定位

Craft Agents 是一个围绕 AgentBackend、BaseAgent、权限管线、流式事件和动态提示词构建的高阶 Agent 执行平台。

### 面试准备重点

`Q03.x Q04.x Q06.x Q10.x Q11.x`

## 方案 C：多后端模型版

### 推荐人群

想突出模型接入、后端适配、运行时配置和多 provider 抽象的同学。

### 推荐组合

`R03 R05 R07 R21 R02`

### 项目定位

Craft Agents 通过统一 AgentBackend、ClaudeAgent/PiAgent 适配和 Pi Agent Server 进程外协议，实现多后端模型运行时抽象。

### 面试准备重点

`Q03.x Q05.x Q07.x Q21.x Q02.x`

## 方案 D：会话与协议工程版

### 推荐人群

目标后端、平台工程、全栈架构岗位，并熟悉协议、事件、状态持久化的同学。

### 推荐组合

`R08 R09 R10 R12 R13`

### 项目定位

Craft Agents 通过 Session/Workspace 隔离、JSONL 持久化、AgentEvent 状态机和统一协议层支撑多端 Agent 会话。

### 面试准备重点

`Q08.x Q09.x Q10.x Q12.x Q13.x`

## 方案 E：桌面 Agent 产品版

### 推荐人群

目标桌面应用、全栈、客户端工程，熟悉 React/Electron 的同学。

### 推荐组合

`R14 R15 R16 R12 R23`

### 项目定位

Craft Agents 是一个基于 Electron 三进程模型、React AppShell、WebUI 复用和多阶段构建的桌面 Agent 产品工程。

### 面试准备重点

`Q14.x Q15.x Q16.x Q12.x Q23.x`

## 方案 F：MCP / 工具生态版

### 推荐人群

想突出 Agent 工具调用、MCP、Sources、Skills、OAuth 和权限边界的同学。

### 推荐组合

`R17 R18 R19 R06 R20`

### 项目定位

Craft Agents 通过 Session-scoped Tools、Sources/Skills/MCP、OAuth 刷新和 Headless Server，将外部能力安全接入 Agent 工具空间。

### 面试准备重点

`Q17.x Q18.x Q19.x Q06.x Q20.x`

## 方案 G：服务端平台化版

### 推荐人群

目标后端平台、服务端架构、AI 平台工程岗位的同学。

### 推荐组合

`R18 R20 R21 R22 R23`

### 项目定位

Craft Agents 通过 server-core、无头服务器、Pi Agent Server、Messaging Gateway 和构建分发体系，把 Agent 能力平台化。

### 面试准备重点

`Q18.x Q20.x Q21.x Q22.x Q23.x`

## 方案 H：会员默认推荐版

### 推荐人群

不知道怎么选，想要一版最能体现高阶 Agent 架构、但不至于过度冒险的同学。

### 推荐组合

`R03 R06 R08 R12 R18`

### 项目定位

Craft Agents 是一个高阶 Agent 架构项目，围绕 AgentBackend 抽象、权限控制、会话隔离、统一传输协议和 MCP/Sources 工具生态展开。

### 面试准备重点

`Q03.x Q06.x Q08.x Q12.x Q18.x`

### 风险提示

`R06` 和 `R18` 是高风险点。如果讲不清楚，降级为 `R10` 或 `R24`。

## 方案 I：前沿热点版（Agent 评测 / Skill 自进化 / Agent 安全）

### 推荐人群

目标高薪的 Agent 架构、AI Infra、Agent 安全岗位，面试官大概率追问评测、自进化、安全三个热点的同学。

### 推荐组合

`R25 R26 R27 R10 R24`

### 项目定位

Craft Agents 是一个把「评测、进化、安全」落到工程实处的多端 Agent 架构：以 AgentEvent 全链路事件与契约测试度量行为、以统一能力接入与凭据治理守住供应链、以 PreToolUse 硬拦截与三进程隔离收敛暴露面。

### 面试准备重点

`Q25.x Q26.x Q27.x Q10.x Q24.x`

### 风险提示

`R26 R27` 是高风险点。三个前沿点必须区分【项目实现】与【前沿认知】——论文数字（SkillsBench +16.6pp、AI Control 15%→92%、26.1% 技能漏洞率）只作面试展开，不写进简历 bullet。讲不稳时：`R27` 降级 `R06`，`R26` 降级 `R18`，再降 `R17`。
