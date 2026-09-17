# Craft Agents Resume Skill — 完整执行示例

> 说明：本文是带审计过程的完整执行记录，阶段中的 `[Rxx]` 仅用于展示内部映射；真正的可贴简历正文以 `01-CraftAgents-Skill-Agent产物输出.md` 为准，不包含内部编号。

## 阶段 0：Skill 激活

用户请求：

```text
请使用 Craft Agents Resume Skill，根据我的背景生成一版高阶 Agent 架构项目经历。
```

Agent 触发原因：

- 用户明确要求使用 Craft Agents Resume Skill。
- 任务是把 Craft Agents 包装成简历项目并准备面试。

## 阶段 1：信息收集

Agent 读取：

- `references/user-intake.md`

用户提供信息：

- 目标岗位：AI Agent 架构 / 后端平台
- 技术栈：TypeScript、React、Node/Bun、WebSocket
- 熟悉：架构分层、状态管理、接口协议
- 不熟：OAuth 细节、MCP 协议细节
- 风险偏好：希望高阶，但不能太虚

Agent 判断：

- 掌握程度：L2 到 L3 之间
- 可选高阶点：`R03 R06 R08 R12 R18`
- 风险点：`R06 R18`

## 阶段 2：方案匹配

Agent 读取：

- `references/combo-plans.md`
- `references/resume-points.md`

匹配方案：

- 方案 H：Paid-Member Default
- 推荐组合：`R03 R06 R08 R12 R18`

交叉校验：

- `R03` 中风险，可讲 AgentBackend 抽象。
- `R06` 高风险，需要讲清楚 Permission Mode 和 PreToolUse，不熟时降级为 `R10`。
- `R08` 低风险，适合作为会话隔离基础点。
- `R12` 低风险，适合后端/协议方向。
- `R18` 高风险，需要讲清楚 Source、Skill、MCP、ServerBuilder，不熟时降级为 `R17`。

## 阶段 3：简历项目生成

Agent 输出：

```text
Craft Agents — 高阶 Agent 架构与多端执行平台

项目简介：
基于 Craft Agents OSS 的架构学习与项目化整理，围绕 AgentBackend 抽象、权限控制、会话隔离、统一传输协议和 MCP/Sources 工具生态，拆解一个多端 Agent 平台从模型执行到 UI 呈现的核心链路。

技术栈：
TypeScript、Bun、Electron、React、Vite、WebSocket、MCP、OAuth、JSONL、Monorepo

简历 bullet：
- [R03] 设计 AgentBackend 抽象，将 ClaudeAgent、PiAgent 等后端统一为 provider-agnostic 的 AgentEvent 流式接口，使 UI 层不感知具体模型 SDK 差异。
- [R06] 围绕 Permission Mode 和 PreToolUse 检查管线设计工具执行安全边界，将 safe、ask、allow-all 等模式注入系统提示词并在工具调用前进行集中化拦截。
- [R08] 以 Session 和 Workspace 作为 Agent 状态隔离边界，管理会话生命周期、工作目录、偏好配置和工具上下文，避免多会话任务互相污染。
- [R12] 抽象 Electron IPC 与 WebSocket 传输层，通过统一 RPC channel、DTO 和路由规则复用同一套会话、文件和模型连接逻辑。
- [R18] 实现 Sources、Skills 与 MCP 的统一能力接入，通过 ServerBuilder 将 MCP、API、Local Source 转换为 Agent 可调用工具，并处理凭据注入和权限配置。
```

风险提示：

- `R06` 和 `R18` 是高风险点，必须能讲清楚实现路径和边界。
- 如果无法解释 PreToolUse，可把 `R06` 降级为 `R10 AgentEvent 流式事件状态机`。
- 如果无法解释 ServerBuilder 和 MCP，可把 `R18` 降级为 `R17 Session-scoped Tools 上下文抽象`。

## 阶段 4：面试 Q&A 匹配

Agent 读取：

- `references/interview-qa.md`

输出对应问题：

- `Q03.1` 为什么需要 AgentBackend 抽象？
- `Q06.1` 为什么不能只靠系统提示词限制工具？
- `Q08.1` Session 和 Workspace 有什么区别？
- `Q12.1` 为什么 Electron IPC 和 WebSocket 要统一协议？
- `Q18.1` Source 和 Skill 的区别是什么？

回答框架统一为：

1. 解决什么问题。
2. Craft Agents 如何实现。
3. 为什么这样设计。
4. 局限与扩展。

## 阶段 5：CodeWiki 深挖

用户追加：

```text
请深挖 R06 Permission Mode 与 PreToolUse 安全管线。
```

Agent 读取：

- `references/codewiki-index.md`

索引定位：

- `R06` 对应 `W03 W05 W14`
- `W03`：Agent Execution Engine
- `W05`：System Prompt and Permission Injection
- `W14`：Deep Agent Core Source Analysis

Agent 只读取完整源材料中相关章节，不加载整本手册。

深挖输出框架：

- 问题：Agent 工具调用可能执行敏感操作，仅靠提示词不足以作为安全边界。
- 实现：Permission Mode 影响系统提示词和 UI 状态，PreToolUse / PermissionManager 在工具执行前做硬检查。
- 取舍：既要支持自主执行，也要支持用户监督，因此分为 safe、ask、allow-all 等模式。
- 局限：不能把它宣传成完整安全沙箱；它更像工具调用前的策略检查与交互式审批机制。
- 降级：如果讲不清 PreToolUse，可写为“理解并梳理了 Agent 工具调用前的权限模式与审批边界”。

## 阶段 6：护栏执行记录

- 没有超过 5 个 R 点。
- 每个 bullet 都有 `Rxx`。
- 每个 `Rxx` 都有 `Qxx.x`。
- 高风险点有明确提示。
- 深挖回到了 `codewiki-index.md`。
- 没有编造指标、用户量或业务结果。
- 没有把扩展设想写成已实现能力。

## 关键执行链总结

```text
user-intake.md
→ combo-plans.md
→ resume-points.md
→ interview-qa.md
→ codewiki-index.md
→ Craft-Agents-中文技术手册.md / DeepWiki
```
