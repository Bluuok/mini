# Craft Agents Harness 与 Runtime 要点扩充（付费版）

> **定位**：本文件是对 `02-CraftAgents简历要点库-付费版.md`（R01–R27）的大规模扩充，新增 **H 系列（Agent Harness 侧重）** 与 **RT 系列（Agent Runtime 侧重）** 两组要点。
>
> - **H 系列**：面向 AI 应用 / Agent 架构岗，讲"怎么让模型成为一个好 Agent"。Craft Agents 的 Harness 层核心在 `packages/shared/src/agent/`（BaseAgent 循环、core/ 管线、backend/ 适配）——这是 monorepo 中**跨 Electron/CLI/WebUI 复用的纯逻辑层**。
> - **RT 系列**：面向有后端基础、目标平台/基础设施岗的同学，讲"Agent 行为在哪里发生、怎么被治理"。Craft 的 Runtime 层核心在 `packages/pi-agent-server/`、`packages/server-core/src/transport|runtime/`、`packages/messaging-gateway/`、`packages/shared/src/credentials/`。
> - **证据等级**：H/RT 各点为**源码直读证据**（craft-agents-oss-main 源码包，标注文件路径），标注"基于源码分析"。

## Harness 与 Runtime 边界速查（Craft Agents 版）

```
┌────────────────── Harness（让模型成为好 Agent）──────────────────┐
│ packages/shared/src/agent/  —— 纯逻辑层，多端复用                  │
│  ├─ Agent Loop：BaseAgent 模板方法 + AgentBackend 抽象 (R03/R04)  │
│  ├─ Prompt 装配：PromptBuilder 共享上下文块 (H02) + R11 动态构建   │
│  ├─ 工具安全：PreToolUse 五步集中管线 (H01) + Permission Mode(R06)│
│  ├─ 输出校验：Bash AST 逐节点校验 (H03)                           │
│  ├─ 子代理：spawn_session 会话级工具 (H04)                        │
│  ├─ 人在回路：PermissionCallback / PlanCallback 回调协议 (H05)    │
│  ├─ 状态追踪：会话生命周期 + 恢复上下文 (H06)                      │
│  ├─ 事件统一：四族事件适配器 → AgentEvent (H07)                    │
│  └─ 内置 LLM 工具：call_llm + PrerequisiteManager (H08)           │
└─────────────────────────────────────────────────────────────────┘
            ↓ AgentBackend 接口 / 进程外 JSONL / RPC transport
┌────────────────── Runtime（治理行为发生地）──────────────────────┐
│  ├─ Pi Agent Server 进程外 JSONL 执行环境 (RT01, R21)             │
│  ├─ 凭据 broker：CredentialManager + TokenRefresh 冷却 (RT02,R19)│
│  ├─ Messaging Gateway：事件扇出 + WhatsApp worker 隔离 (RT03,R22)│
│  ├─ 平台运行时抽象：headless null 实现 (RT04)                     │
│  └─ 传输层：RPC codec + 能力协商 + push (RT05)                    │
└─────────────────────────────────────────────────────────────────┘
```

**一句话边界**：Craft 的 Harness 是 `shared/agent` 里那套"换一个 backend 照样工作"的纯逻辑（不碰进程、不碰凭据、不碰网络）；Runtime 是"backend 之外的一切执行承载"（子进程协议、凭据刷新、消息网关、传输编解码、平台能力注入）。两者的物理边界是 `AgentBackend` 接口与进程外 JSONL 协议。

---

## H 系列（Agent Harness 侧重）

## H01 PreToolUse 集中化硬拦截管线

- 风险：高
- 与 R06 关系：R06 讲 Permission Mode 总体设计；H01 深化到**管线的具体步骤与跨后端共享机制**。
- 推荐 bullet：针对工具调用安全规则散落在各后端实现导致行为不一致的问题，基于集中化拦截管线，设计了 PreToolUse 硬拦截体系（runPreToolUseChecks 五步管线：权限模式检查→失活 MCP source 工具屏蔽→Prerequisite 前置阅读门槛→call_llm 特殊拦截→路径与技能校验；Claude 与 Pi 双后端以归一化输入共享同一管线、各自仅做 SDK 格式转译；Pi 后端下的 OpenAI/Copilot/Bedrock 等非 Anthropic 供应商透明继承全部拦截），实现了工具安全的单一事实源。
- 面试要讲：为什么"归一化输入→共享管线→SDK 转译"而不是各后端各自实现（安全规则漂移的代价）；PrerequisiteManager 用"先读 guide.md 才能用工具"解决什么；管线顺序为什么不可换（前置阅读门槛必须先于工具放行）。
- 源码证据：`packages/shared/src/agent/core/pre-tool-use.ts`（文件头注释明确五步管线与双后端共享设计）、`core/prerequisite-manager.ts`、`core/permission-manager.ts`

## H02 PromptBuilder 共享上下文装配

- 风险：中
- 推荐 bullet：针对系统提示词装配逻辑在多后端间重复实现且注入内容不可控的问题，基于共享装配器，设计了 PromptBuilder 上下文管线（workspace 能力块、会话恢复上下文、会话状态块、用户偏好块、日期与工作目录上下文的标准化格式化；同时服务 ClaudeAgent 与 PiAgent；恢复上下文专用于会话续跑失败场景），实现了提示词装配的跨后端一致。
- 面试要讲：哪些块是静态的、哪些随会话状态动态变化；恢复上下文（recovery context）解决什么失败场景；与 R11 动态 System Prompt 的分工（R11 是组装策略，H02 是块内容工厂）。
- 源码证据：`packages/shared/src/agent/core/prompt-builder.ts`（文件头注释列出四项职责：workspace capabilities / recovery context / session state / user preferences）

## H03 Bash AST 逐节点校验与跨平台命令解析

- 风险：中
- 推荐 bullet：针对按字符串黑名单校验 shell 命令导致复合命令误杀或漏放的问题，基于语法树解析，设计了命令校验器（bash-parser 构建 AST 后按节点类型递归校验：&&/|| 逻辑链、管道、子 shell、重定向、$() 命令替换逐节点放行或拦截，全链安全才允许复合命令执行；编译式模式匹配预编译加速；PowerShell 侧有对应 ps1 校验器覆盖 Windows），实现了"该放的复合命令放行、该拦的危险构造拦截"的精确安全。
- 面试要讲：为什么 AST 优于正则黑名单（`git status && git log` 应放行而 `x && rm -rf /` 应拦截，字符串层面无法区分）；命令替换 $() 为什么最难校验（内容运行时才确定）；跨平台双校验器如何保持语义一致。
- 源码证据：`packages/shared/src/agent/bash-validator.ts`（文件头注释列出 AST 节点类型与 CompiledBashPattern）、`powershell-validator.ts`/`powershell-parser.ps1`

## H04 spawn_session 子代理工具

- 风险：中
- 推荐 bullet：针对主 Agent 无法将独立任务委派给隔离会话执行的问题，基于会话级工具，设计了 spawn_session 子代理机制（以 session-scoped tool 形式暴露给模型；双模式设计——help 模式枚举可用连接/模型/源供模型自主选择，默认模式以 fire-and-forget 创建新会话并投递初始 prompt；连接、模型、sources 均可由模型按任务配置），实现了 Agent 自主的任务委派与上下文隔离。
- 面试要讲：为什么用"会话即子代理"而不是进程内 subagent（天然获得会话隔离、持久化与 UI 可见性）；fire-and-forget 的结果如何回流（父会话可切换/查看子会话）；模型滥用 spawn 的防护（会话数量与权限继承策略）。
- 源码证据：`packages/shared/src/agent/spawn-session-tool.ts`（文件头注释明确双模式设计）、`spawn-helpers.ts`、`session-scoped-tools.ts`

## H05 权限模式管理与人机回调回路

- 风险：中
- 推荐 bullet：针对 Agent 自主性与安全性需要运行时动态平衡的问题，基于回调协议，设计了权限管理回路（safe/ask/allow-all 三模式经 PermissionManager 统一管理并可运行时切换；权限请求经 PermissionCallback 异步上抛至 UI、裁决结果回注执行流；计划确认走独立 PlanCallback 通道；权限请求类型细分为 bash/file_write/mcp_mutation/api_mutation/admin_approval 五类），实现了细粒度的人机协同裁决。
- 面试要讲：五类权限请求为什么要分型（不同类型 UI 呈现与默认策略不同）；回调异步化后执行流如何挂起恢复；模式切换的即时性如何保证（ConfigWatcherManager 监听变更）。
- 源码证据：`packages/shared/src/agent/backend/types.ts`（PermissionRequestType 五类联合、PermissionCallback/PlanCallback/AuthCallback）、`core/permission-manager.ts`、`mode-manager.ts`、`core/config-watcher-manager.ts`

## H06 会话生命周期与恢复上下文

- 风险：中
- 推荐 bullet：针对会话续跑失败后 Agent 上下文断裂的问题，基于状态外置与摘要迁移，设计了会话生命周期管理（session-lifecycle 模块统一管理初始化/恢复/终止；跨会话上下文迁移经 buildTransferredSessionContext 生成结构化摘要注入新会话；SDK 错误经专用 error-mapper 映射为 RecoveryMessage 可恢复语义），实现了会话故障的可恢复性与上下文连续性。
- 面试要讲：摘要迁移丢失了什么（工具中间态不可迁移）、为什么可接受；RecoveryMessage 与直接报错的区别（模型可据此自我修正）。
- 源码证据：`packages/shared/src/agent/core/session-lifecycle.ts`、`conversation-summary.ts`（buildTransferredSessionContext）、`claude-sdk-error-mapper.ts`

## H07 四族事件适配器与统一 AgentEvent

- 风险：中高
- 与 R10 关系：R10 讲 AgentEvent 契约本身；H07 讲**契约背后的适配层架构**。
- 推荐 bullet：针对多个模型 SDK 的事件模型差异侵蚀统一契约的问题，基于适配器分层，设计了事件归一架构（base-event-adapter 抽取跨后端公共映射逻辑；claude/pi/internal 四族适配器目录各自消化 SDK 特有事件；event-queue 保证事件顺序与背压；后端工厂按配置实例化对应适配器族），实现了新增后端只需实现一族适配器即可接入全部上层。
- 面试要讲：internal 族适配什么（非 SDK 的内部工具事件）；事件队列解决什么（乱序与 UI 渲染背压）；为什么映射逻辑要在 base 层与族层两级分布。
- 源码证据：`packages/shared/src/agent/backend/base-event-adapter.ts`、`backend/event-queue.ts`、`backend/{claude,pi,internal}/` 目录结构、`backend/factory.ts`

## H08 call_llm 内嵌工具与前置阅读门槛

- 风险：中
- 推荐 bullet：针对 Agent 需要在推理中调用轻量 LLM 完成子判断但又必须受安全管线约束的问题，基于会话级 MCP 工具，设计了 call_llm 内嵌能力（以 mcp__session__call_llm 形式注册的结构化请求/结果工具；被 PreToolUse 管线显式识别为特殊拦截类型以便审计与限流；与 PrerequisiteManager 的"先读文档再用工具"门槛联动），实现了模型自主的受控子调用。
- 面试要讲：为什么 call_llm 要被 PreToolUse 特殊对待（无限递归调用与成本失控风险）；子调用的模型选择策略（pick-mini-model 选配轻量模型）。
- 源码证据：`packages/shared/src/agent/llm-tool.ts`（buildCallLlmRequest）、`core/pre-tool-use.ts`（call_llm 拦截步骤）、`packages/pi-agent-server/src/pick-mini-model.ts`

## RT 系列（Agent Runtime 侧重）

## RT01 Pi Agent Server 进程外运行时

- 风险：高
- 与 R21 关系：R21 讲协议；RT01 补运行时工程细节。
- 推荐 bullet：针对重依赖 SDK 与桌面主进程耦合导致打包脆弱的问题，基于进程外执行，设计了 Pi Agent Server 运行时（独立子进程经 stdin/stdout JSONL 承载 init/prompt/config-update/abort 全生命周期；针对 Bun 打包将动态 import 塌缩的问题，显式预注册 Bedrock provider 模块避免运行时加载失败；模型解析独立成模块并带 custom-endpoint 优先级与错误分类便于测试），实现了重依赖隔离与打包确定性的兼得。
- 面试要讲：为什么要"预注册"lazy provider 模块（bundler 塌缩动态 import 是真实故障，不是理论问题）；进程外后 UI 如何渲染工具执行（事件转发+工具调用代理回主进程）。
- 对应 W：`W11`；源码证据：`packages/pi-agent-server/src/index.ts`（文件头注释 + setBedrockProviderModule 预注册）、`model-resolution.ts`、`pick-mini-model.ts`

## RT02 凭据 Broker 与 Token 刷新治理

- 风险：高
- 与 R19 关系：R19 讲 OAuth 抽象；RT02 聚焦 broker 语义——凭据何时进运行时、如何刷新、如何失效。
- 推荐 bullet：针对第三方凭据长期驻留 Agent 上下文带来的泄露风险的问题，基于凭据 broker，设计了凭据治理层（CredentialManager 统一多后端凭据存储与内存/磁盘双态同步；TokenRefreshManager 以冷却时间防刷新死循环、以认证状态机同步刷新结果；凭据仅凭据层可见，经 broker 注入工具调用时刻），实现了"凭据不进上下文、刷新不进业务逻辑"。
- 面试要讲：刷新死循环怎么形成（刷新请求自身 401 触发再刷新）、冷却时间如何打破；凭据状态磁盘与内存不一致时以谁为准；为何凭据层与 AgentBackend 平行而非嵌套。
- 对应 W：`W12`；源码证据：`packages/shared/src/credentials/manager.ts`、`credentials/backends/`、`packages/shared/src/agent/claude-context.ts`

## RT03 Messaging Gateway：事件扇出与 worker 隔离

- 风险：高
- 与 R22 关系：R22 讲消息规范化；RT03 补网关内部的扇出、配对、权限与 worker 拓扑。
- 推荐 bullet：针对多平台消息接入的扇出逻辑与平台依赖耦合的问题，基于网关分层，设计了消息运行时（gateway/router 承接平台事件并规范化、event-fanout 按订阅关系扇出至会话、access-control 与 pairing/plan-tokens 治理接入权限；WhatsApp 依赖隔离在独立 worker 包进程运行，崩溃不波及网关主进程），实现了消息面的依赖隔离与权限治理。
- 面试要讲：为什么 WhatsApp 必须 worker 进程隔离（逆向协议库稳定性差、崩溃面大）；plan-tokens 解决什么（消息投递的计划额度）；网关层与会话层如何映射（binding-store）。
- 对应 W：`W12`；源码证据：`packages/messaging-gateway/src/{gateway,router,event-fanout,access-control,pairing,plan-tokens}.ts`、`packages/messaging-whatsapp-worker/` 独立包

## RT04 平台运行时抽象与 headless null 实现

- 风险：中
- 推荐 bullet：针对服务端复用桌面能力时 GUI 依赖无法剥离的问题，基于依赖注入，设计了平台运行时抽象（runtime/platform.ts 定义窗口管理/浏览器面板等宿主能力接口；headless 部署以 platform-headless + null-browser-pane-manager 等 null 实现替换 GUI 能力——调用安全返回空行为而非抛错；server-core 服务层对部署形态无感知），实现了同一套服务代码在桌面与无头服务器的确定性降级运行。
- 面试要讲：为什么用 null 实现而不是抛 NotImplementedError（调用方无需逐处判空，行为可预期）；哪些能力 headless 必须真实现（会话/文件/模型连接）、哪些允许 null（GUI 面板）。
- 源码证据：`packages/server-core/src/runtime/platform.ts`、`runtime/platform-headless.ts`、`runtime/null-browser-pane-manager.ts`、`handlers/` 各 interface 文件

## RT05 传输层：RPC codec 与能力协商

- 风险：中
- 与 R12 关系：R12 讲统一协议；RT05 补传输原语——编解码、能力协商、服务端推送。
- 推荐 bullet：针对本地 IPC 与远程 WebSocket 双通道行为不一致的问题，基于传输原语分层，设计了运行时通信面（codec 统一 RPC 编解码、capabilities 声明客户端可用能力集、push 通道承载服务端主动事件；客户端抽象对 Electron IPC 与 WebSocket 透明），实现了传输通道可替换与能力自适应。
- 面试要讲：能力协商解决什么（WebUI 与桌面端能力集不同，服务端按协商结果裁剪推送）；push 与 RPC 的分离为什么必要（请求-响应与事件流语义不同）。
- 对应 W：`W07`；源码证据：`packages/server-core/src/transport/{codec,capabilities,push,client}.ts`

## H/RT 系列使用规则

0. **SDK 层地基**：本项目依赖 Pi Agent SDK 0.80.6（pi-agent-server 与 shared 两包）。SDK 内部封装的 Harness 能力（AgentSession/steer 队列/compaction/ResourceLoader/会话树/ModelRuntime）已抽取为 PS 系列，详见本 skill 的 `references/pi-sdk-harness.md`（证据基于 0.84.x 文档口径，引用时双版本并注）。PS 点**不单独进 bullet**，作为“为什么选 Pi 不自研 loop”与 SDK 追问的纵深弹药。

1. **混编建议**：Agent 架构岗 3H+1R+1RT；Agent 平台/Infra 岗 1H+3RT+1R。
2. **同源去重**：H01↔R06、H07↔R10、RT01↔R21、RT02↔R19、RT03↔R22 同源不同面——同一份简历同源对最多出现一个。
3. **证据口径**：H/RT 点为源码直读证据，面试追问超出 R 点 wiki 依据时，回答口径是"基于源码阅读的实现分析"。
4. **风险分级沿用三级**：低（无）、中（H02 H03 H04 H05 H06 H08、RT04 RT05）、中高（H07）、高（H01、RT01 RT02 RT03）。高风险点降级链：H01→H05→R10、RT01→R12→R10、RT02→R17、RT03→R12→R13。
5. **前沿红线不变**：评测/自进化/安全类话题仍按 R25/R26/R27 的【项目实现】/【前沿认知】双标注执行；H/RT 点全部属于【项目实现】范畴。
