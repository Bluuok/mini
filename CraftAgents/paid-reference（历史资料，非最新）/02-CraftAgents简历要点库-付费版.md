# Craft Agents 简历要点库（付费版）

使用方式：从下面 `R01-R27` 中选 4-5 个最能讲清楚的点。每个点都对应 `Qxx.x` 面试题和 `Wxx` 技术依据。

## R01 Monorepo 工作区与包职责拆分

- 风险：低
- 推荐 bullet：针对多端复用场景下模块职责混杂、依赖耦合导致改动互相影响的问题，基于 Bun workspace，设计了 monorepo 分层（Electron、WebUI、CLI、server、core、shared、ui 按运行时和职责拆分），实现了多端复用时的依赖解耦。
- 面试要讲：为什么需要 monorepo、apps/packages 如何分工、core 为什么要轻依赖。
- 对应 Q：`Q01.x`
- 对应 W：`W01`

## R02 core/shared/server/ui 分层边界

- 风险：低
- 推荐 bullet：针对多端环境下 Agent 协议、配置与渲染逻辑不一致的问题，基于分层边界设计，设计了 core/shared/server/ui 四层边界（core 类型层、shared 业务逻辑层、server-core 服务层、ui 组件层），实现了多端行为的一致。
- 面试要讲：哪些东西应该放 core，哪些应该放 shared，为什么 UI 不直接依赖后端实现。
- 对应 Q：`Q02.x`
- 对应 W：`W01 W02`

## R03 AgentBackend 抽象与 provider-agnostic event

- 风险：中
- 推荐 bullet：针对 UI 层耦合具体模型 SDK、切换后端成本高的问题，基于抽象接口与统一事件流，设计了 AgentBackend 抽象（ClaudeAgent、PiAgent 统一为 provider-agnostic 的 `AgentEvent` 流式接口），实现了 UI 层与模型供应商的解耦。
- 面试要讲：为什么要抽象后端、事件类型如何统一、UI 如何消费流式事件。
- 对应 Q：`Q03.x`
- 对应 W：`W03 W14`

## R04 BaseAgent Template Method 执行生命周期

- 风险：中
- 推荐 bullet：针对各后端 turn 前置处理逻辑重复、行为不一致的问题，基于 Template Method 模式，设计了 BaseAgent 执行生命周期（技能解析、前置条件注册、分支上下文注入、消息重写后委托具体后端），实现了 turn 前置处理的统一。
- 面试要讲：模板方法解决什么问题、哪些逻辑放基类、哪些放子类。
- 对应 Q：`Q04.x`
- 对应 W：`W03 W14`

## R05 ClaudeAgent / PiAgent 多后端适配

- 风险：中
- 推荐 bullet：针对多后端 SDK 事件模型差异导致上层接口不统一的问题，基于多后端适配模式，设计了 ClaudeAgent 与 PiAgent 双后端适配（SDK 事件映射、子进程 JSONL 通信、工具代理、模型配置），实现了统一接口下的多后端支持。
- 面试要讲：Claude 与 Pi 执行模式差异、为什么 Pi 要进程外运行、事件如何转发。
- 对应 Q：`Q05.x`
- 对应 W：`W03 W11 W14`

## R06 Permission Mode 与 PreToolUse 安全管线

- 风险：高
- 推荐 bullet：针对工具执行缺乏统一安全拦截、提示词约束不可靠的问题，基于 Permission Mode 与 PreToolUse 检查管线，设计了工具执行安全边界（safe/ask/allow-all 模式注入系统提示词、工具调用前集中化硬拦截），实现了工具执行风险的可控。
- 面试要讲：安全模式如何影响工具调用、为什么提示词约束不够、PreToolUse 如何做硬拦截。
- 对应 Q：`Q06.x`
- 对应 W：`W03 W05 W14`

## R07 Thinking Level、模型配置与运行时控制

- 风险：中
- 推荐 bullet：针对模型配置与推理强度调整缺乏统一入口、UI 与后端能力不一致的问题，基于抽象设计，设计了 Thinking Level 与模型配置抽象（动态切换模型、调整推理强度），实现了 UI 控件与后端能力的一致。
- 面试要讲：模型配置如何流转、capabilities-driven UI 的意义、运行时切换有哪些风险。
- 对应 Q：`Q07.x`
- 对应 W：`W03 W04 W11`

## R08 Session / Workspace 生命周期与隔离

- 风险：低
- 推荐 bullet：针对多会话任务状态互相污染、工作目录与上下文混杂的问题，基于 Session/Workspace 隔离设计，设计了以 Session 与 Workspace 为边界的状态隔离体系（管理会话生命周期、工作目录、偏好配置与工具上下文），实现了多会话任务的隔离。
- 面试要讲：Session 与 Workspace 区别、为什么会话是隔离边界、工作区配置如何影响 Agent。
- 对应 Q：`Q08.x`
- 对应 W：`W06`

## R09 JSONL 会话持久化与运行时/存储双模型

- 风险：中
- 推荐 bullet：针对流式状态与持久化记录混合导致存储模型混乱、恢复不完整的问题，基于运行时/存储双模型，设计了 JSONL 会话存储（区分运行时 Message 与持久化 StoredMessage），实现了流式状态与长期记录的分治。
- 面试要讲：为什么用 JSONL、运行时状态为什么不落盘、如何恢复会话。
- 对应 Q：`Q09.x`
- 对应 W：`W06 W14`

## R10 AgentEvent 流式事件状态机

- 风险：中
- 推荐 bullet：针对流式渲染与错误恢复缺乏统一事件契约、UI 解析逻辑分散的问题，基于可辨识联合类型，设计了 AgentEvent 事件流协议（文本增量、工具启动/结果、权限请求、结构化错误与完成状态），实现了 UI 实时渲染与错误恢复的统一。
- 面试要讲：事件驱动比直接返回字符串好在哪、状态机如何支持工具调用。
- 对应 Q：`Q10.x`
- 对应 W：`W03 W07 W14`

## R11 System Prompt 动态构建与上下文文件发现

- 风险：中
- 推荐 bullet：针对系统提示词随能力叠加膨胀、上下文文件发现不可控的问题，基于动态构建与缓存控制，设计了 System Prompt 动态生成机制（整合权限模式、环境元数据、用户偏好与 AGENTS.md/CLAUDE.md 上下文发现），实现了提示词膨胀的受控。
- 面试要讲：提示词静态/动态分离、上下文文件搜索策略、权限如何注入。
- 对应 Q：`Q11.x`
- 对应 W：`W05 W14`

## R12 IPC / WebSocket 统一协议与传输层

- 风险：低
- 推荐 bullet：针对 Electron IPC 与 WebSocket 双传输层逻辑重复、多端连接无法复用的问题，基于统一 RPC 抽象，设计了 IPC/WebSocket 统一传输层（统一 RPC channel、DTO 与路由规则），实现了同一套会话、文件与模型连接逻辑的多端复用。
- 面试要讲：本地与远程通道如何区分、DTO 如何保证边界一致、为什么需要传输抽象。
- 对应 Q：`Q12.x`
- 对应 W：`W07`

## R13 Channel Map / ElectronAPI 契约一致性测试

- 风险：低
- 推荐 bullet：针对前端 API、IPC 通道与后端 handler 各自演进导致漂移的问题，基于契约一致性测试，设计了 Channel Map 与 ElectronAPI 契约一致性测试（校验通道名、参数与返回结构），实现了接口漂移的编译期拦截。
- 面试要讲：契约测试测什么、为什么 IPC 容易漂移、哪些方法要排除。
- 对应 Q：`Q13.x`
- 对应 W：`W07 W13`

## R14 Electron 三进程安全模型

- 风险：中
- 推荐 bullet：针对桌面 Agent 渲染进程权限过大、本地能力暴露面不可控的问题，基于最小暴露原则，设计了 Electron 三进程安全模型（主进程、预加载桥、渲染进程职责边界，受控 IPC 暴露本地能力），实现了桌面端权限泄漏风险的收敛。
- 面试要讲：主进程/预加载/渲染器各做什么、为什么不能让 UI 直接访问 Node API。
- 对应 Q：`Q14.x`
- 对应 W：`W08`

## R15 Renderer AppShell、会话 UI 与状态管理

- 风险：中
- 推荐 bullet：针对 Agent 流式事件、工具结果与权限请求在 UI 中呈现分散的问题，基于组件化与会话状态管理，设计了渲染器界面架构（AppShell、ChatDisplay、富文本输入、会话状态管理），实现了多类信息的统一呈现。
- 面试要讲：UI 如何消费 AgentEvent、会话状态如何隔离、输入和附件如何建模。
- 对应 Q：`Q15.x`
- 对应 W：`W08 W09`

## R16 WebUI 适配与多端复用

- 风险：低
- 推荐 bullet：针对桌面端与浏览器端体验割裂、服务端能力无法复用的问题，基于 Web API adapter 与组件复用，设计了 WebUI 多端适配层（桌面会话体验迁移到 WebUI），实现了同一套 server-core 服务浏览器与 Electron 客户端。
- 面试要讲：WebUI 与 Electron 的能力差异、哪些 API 需要 polyfill、哪些逻辑能复用。
- 对应 Q：`Q16.x`
- 对应 W：`W09`

## R17 Session-scoped Tools 上下文抽象

- 风险：中
- 推荐 bullet：针对工具处理器在进程内与 MCP 进程外不可复用、上下文传递分散的问题，基于上下文注入抽象，设计了 SessionToolContext（sessionId、workspacePath、文件系统、凭据管理与回调统一注入），实现了工具的进程内外复用。
- 面试要讲：为什么工具不能直接访问全局状态、Context 提供哪些能力、回调如何通知宿主。
- 对应 Q：`Q17.x`
- 对应 W：`W10`

## R18 Sources / Skills / MCP 集成与 ServerBuilder

- 风险：高
- 推荐 bullet：针对 Sources/Skills/MCP 等外部能力接入缺乏统一入口、凭据与权限配置分散的问题，基于 ServerBuilder 统一转换，设计了统一能力接入层（MCP/API/Local Source 转换为 Agent 可调用工具、凭据注入与权限配置），实现了外部能力的统一调度。
- 面试要讲：Source 和 Skill 区别、ServerBuilder 做什么、MCP/API/Local 如何统一。
- 对应 Q：`Q18.x`
- 对应 W：`W10`

## R19 OAuth、凭据管理与 Token Refresh

- 风险：高
- 推荐 bullet：针对第三方凭据过期导致工具调用失败、认证状态不同步的问题，基于凭据抽象与令牌刷新管理，设计了 OAuth/API Key 统一认证抽象（CredentialManager 与 TokenRefreshManager 管理刷新、冷却时间与认证状态同步），实现了认证状态的可靠维护。
- 面试要讲：刷新令牌怎么避免死循环、为什么要有冷却时间、状态如何同步到磁盘和内存。
- 对应 Q：`Q19.x`
- 对应 W：`W10 W12`

## R20 Headless Server、SessionManager 与 RPC handlers

- 风险：中
- 推荐 bullet：针对服务端能力与桌面端绑定、无法独立复用的问题，基于 server-core 封装，设计了 Headless Server 服务层（SessionManager、RPC handlers、文件操作、模型连接与自动化逻辑作为可嵌入后端服务），实现了服务端能力的复用。
- 面试要讲：server-core 和 server 的区别、RPC handler 如何组织、SessionManager 的职责。
- 对应 Q：`Q20.x`
- 对应 W：`W11`

## R21 Pi Agent Server 进程外 JSONL 协议

- 风险：高
- 推荐 bullet：针对重依赖与主进程耦合导致隔离性差、工具调用代理复杂的问题，基于进程外 JSONL 协议，设计了 Pi Agent Server 进程外执行环境（stdin/stdout JSONL 处理 init/prompt/runtime config update/abort），实现了重依赖隔离与工具调用代理。
- 面试要讲：为什么要子进程、JSONL 协议如何通信、工具如何代理回主进程。
- 对应 Q：`Q21.x`
- 对应 W：`W11`

## R22 Messaging Gateway 多平台消息规范化

- 风险：高
- 推荐 bullet：针对多平台消息格式差异导致内部协议混乱、平台依赖难以隔离的问题，基于消息规范化，设计了 Messaging Gateway（Telegram、Lark/Feishu、WhatsApp 消息规范化为内部 Agent 协议、worker 隔离平台依赖），实现了多平台消息的统一接入。
- 面试要讲：消息规范化字段、为什么 WhatsApp 用 worker、如何映射到会话。
- 对应 Q：`Q22.x`
- 对应 W：`W12`

## R23 Electron / WebUI / Server 构建分发流水线

- 风险：中
- 推荐 bullet：针对多运行时分发产物构建配置重复、跨端一致性难保证的问题，基于多阶段构建流水线，设计了 Electron、WebUI、无头服务器与子进程服务的构建分发方案（Bun、Vite、esbuild、electron-builder），实现了跨运行时产物的统一分发。
- 面试要讲：主进程/预加载/渲染器分别怎么构建、服务器如何打包、资产如何管理。
- 对应 Q：`Q23.x`
- 对应 W：`W13`

## R24 类型检查、测试、i18n 与 IPC 安全验证

- 风险：低
- 推荐 bullet：针对多端 Agent 应用回归面大、类型与契约错误难以提前发现的问题，基于分层验证体系，设计了多维度验证机制（类型检查、测试、i18n parity、Channel Map 契约与 IPC 原始发送检查），实现了回归风险的收敛。
- 面试要讲：validate:dev 与 validate:ci 差异、哪些测试保证协议安全、为什么要分层类型检查。
- 对应 Q：`Q24.x`
- 对应 W：`W13`

## R25 行为评测与契约验证（Agent 评测）

- 风险：中
- 推荐 bullet：针对多端 Agent 流式行为难以评测、契约漂移导致回归不可见的问题，基于事件流建模与契约断言，设计了行为评测机制（AgentEvent 全链路事件、Channel Map 契约一致性测试、冒烟测试套件），实现了行为可复现与回归可定位。
- 面试要讲：R24 与 R25 的分工（编译期验证 vs 运行期行为评测）；AgentEvent 为什么是过程评测数据；LLM 裁判三偏置与 pass^k 是方法论认知。
- 对应 Q：`Q25.x`
- 对应 W：`W07 W13`

## R26 多源能力接入与技能治理（Skill 自进化）

- 风险：高
- 推荐 bullet：针对多来源技能与外部能力混杂接入、凭据与权限配置分散的问题，基于统一接入层与最小权限，设计了能力接入治理体系（ServerBuilder 统一转换、凭据注入、权限配置、上下文文件发现），实现了外部能力的统一调度与供应链风险收敛。
- 面试要讲：统一入口为什么是治理边界；凭据注入与权限配置如何对应供应链治理（26.1% 技能漏洞率）；技能自动生成/轨迹蒸馏是前沿认知，平台未实现。
- 对应 Q：`Q26.x`
- 对应 W：`W10`

## R27 工具执行安全与最小暴露（Agent 安全）

- 风险：高
- 推荐 bullet：针对桌面 Agent 工具执行缺乏硬拦截、本地能力暴露面不可控的问题，基于信任边界下移原则，设计了工具执行安全管线（Permission Mode 注入、PreToolUse 集中化拦截、Electron 三进程受控 IPC），实现了工具级硬拦截与权限泄漏风险的收敛。
- 面试要讲：为什么提示词约束不够（软约束 vs 硬拦截）；Electron 三进程如何最小化暴露；注入结构性/逆缩放/Sleeper Agents/AI Control 是前沿认知。
- 对应 Q：`Q27.x`
- 对应 W：`W03 W05 W08`
