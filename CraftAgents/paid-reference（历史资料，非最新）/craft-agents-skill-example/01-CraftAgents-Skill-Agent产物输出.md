# Craft Agents Resume Skill — Agent 产物输出

## 用户画像

- 目标岗位：AI Agent 架构 / 后端平台
- 技术栈：TypeScript、React、Node/Bun、WebSocket
- 熟悉方向：架构分层、状态管理、接口协议
- 不熟方向：OAuth 细节、MCP 协议细节
- 风险偏好：高阶但需要可解释

## 方案匹配

采用方案 H：会员默认推荐版。

选定 5 个点：

- `R03` AgentBackend 抽象与 provider-agnostic event
- `R06` Permission Mode 与 PreToolUse 安全管线
- `R08` Session / Workspace 生命周期与隔离
- `R12` IPC / WebSocket 统一协议与传输层
- `R18` Sources / Skills / MCP 集成与 ServerBuilder

风险提示：

- `R06` 是高风险点：必须能讲清提示词软约束与工具前硬拦截的区别。
- `R18` 是高风险点：必须能讲清 Source、Skill、MCP、ServerBuilder 的边界。
- 如果面试前准备不足，`R06` 可降级为 `R10`，`R18` 可降级为 `R17`。

## 简历项目

### Craft Agents — 高阶 Agent 架构与多端执行平台

项目简介：

基于 Craft Agents OSS 的架构学习与项目化整理，围绕 AgentBackend 抽象、权限控制、会话隔离、统一传输协议和 MCP/Sources 工具生态，拆解一个多端 Agent 平台从模型执行到 UI 呈现的核心链路。

技术栈：

TypeScript、Bun、Electron、React、Vite、WebSocket、MCP、OAuth、JSONL、Monorepo

简历 bullet（可贴简历版）：

- **多后端统一执行** 针对不同模型后端导致 UI 与执行协议耦合的问题，基于 AgentBackend 抽象和 AgentEvent 流式接口设计了统一执行边界，实现了前端对具体模型 SDK 的解耦。
- **工具调用安全门控** 针对 Agent 工具调用缺少统一风险拦截的问题，基于 Permission Mode 与 PreToolUse 检查管线设计了调用前安全边界，实现了 safe、ask、allow-all 等模式下的统一裁决入口。
- **会话与工作区隔离** 针对多会话并行时工作目录、偏好和工具上下文容易互相污染的问题，基于 Session 与 Workspace 生命周期模型设计了状态隔离机制，实现了会话恢复与工作目录边界的统一管理。
- **跨端传输复用** 针对桌面端与 Web 端重复实现会话和文件通信逻辑的问题，基于 Electron IPC、WebSocket、统一 RPC channel 和 DTO 设计了传输层抽象，实现了多端共享同一套协议边界。
- **能力生态统一接入** 针对 MCP、API、Local Source 接入方式不一致的问题，基于 ServerBuilder 设计了 Sources、Skills 与 MCP 的统一工具注册路径，实现了能力发现、凭据注入和权限配置的集中管理。

## 面试 Q&A

### Q03.1 为什么需要 AgentBackend 抽象？

- 解决问题：不同模型 SDK 的消息格式、工具调用和事件回调不同。
- Craft Agents 实现：通过 AgentBackend 统一 `chat()`、abort、模型配置和 `AgentEvent`。
- 设计取舍：牺牲一点抽象成本，换取 UI 层和模型后端解耦。
- 局限扩展：具体 provider 能力仍然不同，需要 capabilities 或适配层处理差异。

### Q06.1 为什么不能只靠系统提示词限制工具？

- 解决问题：Agent 可能调用敏感工具，提示词只是软约束。
- Craft Agents 实现：Permission Mode 影响提示词和 UI 状态，PreToolUse / PermissionManager 在工具执行前做硬检查。
- 设计取舍：safe、ask、allow-all 在自主性和安全性之间做分层。
- 局限扩展：这不是完整安全沙箱，不能夸大为彻底防御所有风险。

### Q08.1 Session 和 Workspace 有什么区别？

- 解决问题：多会话、多目录、多工具上下文需要隔离。
- Craft Agents 实现：Session 管理对话和工具状态，Workspace 定义工作目录、来源、配置和偏好。
- 设计取舍：用显式边界换取可恢复、可切换和可管理。
- 局限扩展：复杂协同场景还需要更细粒度的权限和共享状态策略。

### Q12.1 为什么 Electron IPC 和 WebSocket 要统一协议？

- 解决问题：桌面和 WebUI 都需要复用会话、文件、模型连接等领域能力。
- Craft Agents 实现：通过 RPC channel、DTO 和 routing 抽象本地 IPC 与远程 WebSocket。
- 设计取舍：协议层更复杂，但能减少多端重复实现。
- 局限扩展：本地专属能力仍要保留 LOCAL_ONLY 边界。

### Q18.1 Source 和 Skill 的区别是什么？

- 解决问题：Agent 既需要连接外部系统，也需要知道如何使用这些能力。
- Craft Agents 实现：Source 描述连接、凭据和权限；Skill 描述使用逻辑；ServerBuilder 把 Source 转成可调用工具。
- 设计取舍：把连接和使用逻辑拆开，提升扩展性和权限可控性。
- 局限扩展：MCP、API、Local Source 的能力模型不同，不能把所有 Source 说成同一种协议。

## 深挖依据

本次可深挖索引：

- `R03` → `W03 W14`
- `R06` → `W03 W05 W14`
- `R08` → `W06`
- `R12` → `W07`
- `R18` → `W10`

深挖时应读取：

- `references/codewiki-index.md`
- `references/Craft-Agents-中文技术手册.md`
- 必要时交叉校验 `references/craft-ai-agents-craft-agents-oss-DeepWiki.md`

## 降级建议

- `R06` 降级：从“实现 Permission Mode 与 PreToolUse 安全管线”改为“梳理 Agent 工具调用前的权限模式与审批边界”。
- `R18` 降级：从“实现 Sources / Skills / MCP 集成”改为“理解 Sources、Skills、MCP 在 Agent 工具体系中的分工”。
