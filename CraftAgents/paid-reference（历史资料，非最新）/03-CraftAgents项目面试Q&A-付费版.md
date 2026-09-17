# Craft Agents 项目面试 Q&A（付费版）

回答模板统一使用四段：解决什么问题、Craft Agents 如何实现、为什么这样设计、局限与扩展。

## R/Q 对照

`R01 -> Q01.x`，`R02 -> Q02.x`，`R03 -> Q03.x`，`R04 -> Q04.x`，`R05 -> Q05.x`，`R06 -> Q06.x`，`R07 -> Q07.x`，`R08 -> Q08.x`，`R09 -> Q09.x`，`R10 -> Q10.x`，`R11 -> Q11.x`，`R12 -> Q12.x`，`R13 -> Q13.x`，`R14 -> Q14.x`，`R15 -> Q15.x`，`R16 -> Q16.x`，`R17 -> Q17.x`，`R18 -> Q18.x`，`R19 -> Q19.x`，`R20 -> Q20.x`，`R21 -> Q21.x`，`R22 -> Q22.x`，`R23 -> Q23.x`，`R24 -> Q24.x`。

## Q01 Monorepo 工作区与包职责拆分

- Q01.1 为什么 Craft Agents 适合用 monorepo？
- 答：它同时包含 Electron、WebUI、CLI、server 和共享包，monorepo 能统一依赖、类型和构建脚本，避免多仓库同步成本。
- 误区：只说“方便管理”，不讲 apps/packages 职责边界。
- 降级说法：我主要理解它的工作区拆分和依赖复用，还没有深入构建脚本细节。

## Q02 core/shared/server/ui 分层边界

- Q02.1 core 和 shared 为什么要分开？
- 答：core 应保持类型和存储模型轻依赖，shared 承载业务逻辑、配置、认证和 Agent 相关实现，避免基础类型包被重依赖污染。
- 误区：把 core 写成业务层。
- 降级说法：我能讲清楚包职责，但不会夸大为自己重构了整个 monorepo。

## Q03 AgentBackend 抽象与 provider-agnostic event

- Q03.1 为什么需要 AgentBackend 抽象？
- 答：不同模型 SDK 的消息格式、工具调用和事件回调不同，AgentBackend 把它们统一成 `chat()`、abort、模型配置和 AgentEvent，让 UI 不关心具体提供商。
- 误区：只说“适配多个模型”，不讲事件和接口契约。
- 降级说法：我重点理解接口设计和事件统一，具体每个后端 SDK 的细节可按源码再展开。

## Q04 BaseAgent Template Method 执行生命周期

- Q04.1 BaseAgent 为什么用模板方法？
- 答：技能解析、前置条件、分支上下文、路径处理、权限等逻辑是所有后端共享的；具体模型调用留给子类，避免 ClaudeAgent、PiAgent 重复实现。
- 误区：把模板方法说成普通继承。
- 降级说法：我能讲清楚共享前置流程和子类执行点。

## Q05 ClaudeAgent / PiAgent 多后端适配

- Q05.1 ClaudeAgent 和 PiAgent 的执行模式有什么差异？
- 答：ClaudeAgent 主要适配 Claude SDK 事件；PiAgent 更像进程外 RPC 客户端，通过 JSONL 与 Pi Agent Server 通信，并代理工具回主进程。
- 误区：说二者只是换了模型名。
- 降级说法：我熟悉抽象层和数据流，对 Pi SDK 内部实现不做过度展开。

## Q06 Permission Mode 与 PreToolUse 安全管线

- Q06.1 为什么不能只靠系统提示词限制工具？
- 答：提示词是软约束，真正的安全边界要在工具执行前通过 PreToolUse 和 PermissionManager 做硬检查；safe、ask、allow-all 还要同步影响 UI 和提示词。
- 误区：把 allow-all 写成安全能力。
- 降级说法：我理解权限模式和工具前置检查，但不会声称覆盖所有安全场景。

## Q07 Thinking Level、模型配置与运行时控制

- Q07.1 Thinking Level 的工程意义是什么？
- 答：它把推理强度变成可配置能力，允许不同后端映射到自身支持的 effort/token 机制，同时 UI 通过 capabilities 判断是否展示控制项。
- 误区：把它说成固定提示词模板。
- 降级说法：我能讲配置流转和后端能力适配。

## Q08 Session / Workspace 生命周期与隔离

- Q08.1 Session 和 Workspace 有什么区别？
- 答：Session 是一次对话和工具执行状态的隔离边界；Workspace 是会话运行的环境，包括工作目录、配置、来源和偏好。
- 误区：把二者都说成“聊天记录”。
- 降级说法：我可以从状态隔离角度讲，不展开所有 UI 操作。

## Q09 JSONL 会话持久化与运行时/存储双模型

- Q09.1 为什么会话用 JSONL？
- 答：Agent 任务是流式、长时间、多事件的，JSONL 适合按行追加和恢复；运行时 Message 保留 isStreaming 等临时状态，StoredMessage 只持久化必要字段。
- 误区：说 JSONL 只是为了简单。
- 降级说法：我能解释存储模型，不编造数据库性能收益。

## Q10 AgentEvent 流式事件状态机

- Q10.1 为什么要把 Agent 输出建模成事件？
- 答：Agent 不只输出文本，还会启动工具、返回工具结果、请求权限、报错和结束。统一 AgentEvent 能让 UI 实时渲染并处理恢复路径。
- 误区：只讲 text_delta，不讲 tool 和 error。
- 降级说法：我重点讲事件类型和 UI 消费方式。

## Q11 System Prompt 动态构建与上下文文件发现

- Q11.1 系统提示词为什么要动态构建？
- 答：Agent 需要结合权限模式、环境信息、用户偏好和项目上下文文件；动态构建能在不同工作区产生不同边界，同时通过缓存和大小限制控制膨胀。s
- 误区：把所有上下文都塞进 system prompt。
- 降级说法：我能讲搜索策略和边界，不声称解决所有上下文管理问题。

## Q12 IPC / WebSocket 统一协议与传输层

- Q12.1 为什么 Electron IPC 和 WebSocket 要统一协议？
- 答：桌面和 WebUI 都需要会话、文件、模型连接等领域能力。统一 DTO、channel 和 routing，可以复用业务逻辑，只替换传输实现。
- 误区：把 WebSocket 当成 Electron IPC 的替代品。
- 降级说法：我能讲协议抽象，不展开每个 handler 的实现。

## Q13 Channel Map / ElectronAPI 契约一致性测试

- Q13.1 Channel Map parity test 解决什么问题？
- 答：它防止 ElectronAPI 暴露的方法、IPC channel 映射和后端 handler 不一致，避免运行时才发现通信失败。
- 误区：只说“增加测试覆盖率”。
- 降级说法：我能讲契约测试思想和适用边界。

## Q14 Electron 三进程安全模型

- Q14.1 为什么不能让渲染进程直接调用 Node API？
- 答：渲染进程面向 UI，暴露 Node API 会扩大攻击面。预加载脚本应作为受控桥，只暴露白名单能力给渲染器。
- 误区：把 Electron 写成普通网页。
- 降级说法：我能讲主进程、预加载、渲染器职责。

## Q15 Renderer AppShell、会话 UI 与状态管理

- Q15.1 Agent UI 和普通聊天 UI 最大区别是什么？
- 答：Agent UI 要展示流式文本、工具生命周期、权限请求、错误、计划和附件，不只是 user/assistant 两类消息。
- 误区：只讲聊天气泡。
- 降级说法：我能讲会话 UI 数据流，不夸大复杂交互实现。

## Q16 WebUI 适配与多端复用

- Q16.1 WebUI 复用 Electron UI 时最大的挑战是什么？
- 答：浏览器没有 Electron 原生能力，需要 Web API adapter 或 polyfill；真正可复用的是组件、DTO 和 server-core 领域逻辑。
- 误区：说复制组件即可。
- 降级说法：我能讲复用边界。

## Q17 Session-scoped Tools 上下文抽象

- Q17.1 SessionToolContext 为什么重要？
- 答：工具执行需要 sessionId、workspacePath、文件系统、凭据和回调。如果工具直接访问全局状态，就很难测试、复用和进程外运行。
- 误区：把 context 当参数集合。
- 降级说法：我能讲上下文注入和可测试性。

## Q18 Sources / Skills / MCP 集成与 ServerBuilder

- Q18.1 Source 和 Skill 的区别是什么？
- 答：Source 提供连接外部系统的配置和凭据，Skill 提供使用这些能力的逻辑和模式。ServerBuilder 把 Source 配置转成可调用工具。
- 误区：把 Skill 当 MCP 服务器。
- 降级说法：我能讲概念和数据流，对具体协议细节按资料展开。

## Q19 OAuth、凭据管理与 Token Refresh

- Q19.1 Token Refresh 为什么要有冷却时间？
- 答：如果端点异常或 refresh token 失效，持续刷新会造成死循环和请求风暴。冷却时间能限制失败重试频率，并给用户明确恢复路径。
- 误区：只说定时刷新。
- 降级说法：我能讲刷新策略，不声称实现了所有 OAuth 提供商。

## Q20 Headless Server、SessionManager 与 RPC handlers

- Q20.1 server-core 和 server 的关系是什么？
- 答：server-core 是可嵌入的领域逻辑和 RPC 基础设施，server 是独立无头服务器包装器，用 Bun 运行并暴露 WebSocket 能力。
- 误区：把 server-core 当入口应用。
- 降级说法：我能讲后端分层和 handler 组织。

## Q21 Pi Agent Server 进程外 JSONL 协议

- Q21.1 为什么 Pi Agent Server 要进程外运行？
- 答：它隔离重依赖和 ESM/运行时差异，通过 stdin/stdout JSONL 与主进程通信，使主应用只处理协议和事件转发。
- 误区：只说为了性能。
- 降级说法：我能讲协议边界，不展开 Pi SDK 内部。

## Q22 Messaging Gateway 多平台消息规范化

- Q22.1 多平台消息为什么要先规范化？
- 答：Telegram、Lark、WhatsApp 的用户、消息、附件和会话模型不同，规范化后 Agent 核心只处理统一协议，不感知平台差异。
- 误区：把网关写成简单转发。
- 降级说法：我能讲架构，不声称完整实现所有平台能力。

## Q23 Electron / WebUI / Server 构建分发流水线

- Q23.1 Craft Agents 的构建复杂在哪里？
- 答：它要分别构建 Electron 主进程、预加载、渲染器、WebUI、无头服务器、MCP/Pi 子进程和资源资产，跨运行时约束不同。
- 误区：只说 bun build。
- 降级说法：我能讲多阶段构建，不背每个脚本参数。

## Q24 类型检查、测试、i18n 与 IPC 安全验证

- Q24.1 为什么验证体系要分层？
- 答：shared、electron、all 类型检查的成本和覆盖范围不同；CI 还要加 i18n parity、契约测试和 IPC 安全检查，兼顾开发速度和发布可靠性。
- 误区：只讲单元测试。
- 降级说法：我能讲验证策略和关键测试。
