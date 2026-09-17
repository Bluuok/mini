# HappyClaw 简历要点库（付费版）

使用方式：从下面 `R01-R27` 中选 4-5 个最能讲清楚的点。每个点都对应 `Qxx.x` 面试题和 `Wxx` 技术依据。

## R01 Agent-First 三层产品模型（Profile/Workspace/Session）

- 风险：中
- 推荐 bullet：针对多用户 Agent 场景下身份、隔离边界与会话状态缺乏统一产品模型的问题，基于三层数据模型设计，设计了 AgentProfile -> Workspace -> Runtime Session 三层产品模型（Profile 顶层身份、Workspace 隔离边界、Session 会话续约记录，identity_hash 校验运行时一致性），实现了身份与数据隔离的一致可校验。
- 面试要讲：三层各是什么、为什么 Profile 在最上层、identity_hash 解决什么问题。
- 对应 Q：`Q01.x`
- 对应 W：`W05`

## R02 多用户自托管服务化架构

- 风险：低
- 推荐 bullet：针对 CLI 单次会话与桌面应用无法支撑企业级 Agent 长期驻场运行的问题，基于自托管服务化架构，设计了长期在线的多用户服务化封装（将 Claude Code 运行时封装为常驻服务，区别于单次 CLI 或桌面应用），实现了企业级 Agent 驻场运行能力的落地。
- 面试要讲：服务化与 CLI/桌面的区别、长期在线意味着什么、多用户共享了什么。
- 对应 Q：`Q02.x`
- 对应 W：`W00 W01`

## R03 Host/Container 双模式执行引擎

- 风险：中高
- 推荐 bullet：针对单执行模式无法兼顾权限实时性与隔离安全性、供应商故障影响执行的问题，基于双模式执行引擎设计，设计了 Host/Container 双模式 Agent 执行引擎（Host 实时读 DB 权限、Container Docker 沙箱隔离，共享 Provider 选择与模型降级编排），实现了两种模式执行行为的一致与容错。
- 面试要讲：两种模式各适合什么场景、为什么 Host 要实时读权限、Container 的隔离边界在哪。
- 对应 Q：`Q03.x`
- 对应 W：`W06 W15`

## R04 Docker 容器沙箱与挂载安全三层防御

- 风险：高
- 推荐 bullet：针对容器挂载泄露宿主敏感文件导致安全事件的问题，基于 fail-closed 纵深防御设计，设计了 Docker 容器沙箱挂载三层防御（mount-allowlist 自动重载 fail-closed、硬拒绝 /proc /sys .ssh .aws docker.sock、阻塞 credentials .env id_rsa，非主工作区只读挂载），实现了敏感路径的纵深防护。
- 面试要讲：三层各防什么、fail-closed 的含义、entrypoint 降权做了什么。
- 对应 Q：`Q04.x`
- 对应 W：`W15`

## R05 运行时文件系统 IPC 协议

- 风险：中高
- 推荐 bullet：针对 Runner 与主进程通信依赖网络服务导致部署复杂、易失联的问题，基于文件系统原子写协议，设计了零网络依赖的 IPC 协议（原子两阶段写入 .tmp->rename、receipt 光标追踪、_close/_drain/_interrupt 三个信号量、stdout 帧协议），实现了跨进程通信的可靠与解耦。
- 面试要讲：为什么用文件系统而非网络、原子写入怎么保证、三个信号量各做什么。
- 对应 Q：`Q05.x`
- 对应 W：`W16`

## R06 StreamEvent 三端同步事件流系统

- 风险：中高
- 推荐 bullet：针对三端事件状态各自维护导致展示失真、不同步的问题，基于单源真值设计，设计了 StreamEvent 事件流系统（shared/stream-event.ts 唯一来源机械复制三端、24+ 事件类型分五层、Processor->ContainerOutput->RunStreamFence->rAF 批处理端到端同步），实现了三端事件状态的一致性。
- 面试要讲：为什么单源真值、三端怎么同步、RunStreamFence 做什么。
- 对应 Q：`Q06.x`
- 对应 W：`W17`

## R07 7 渠道 IM 统一抽象与适配器模式

- 风险：中
- 推荐 bullet：针对企业多渠道接入时 Agent 核心耦合渠道 SDK、扩展新渠道成本高的问题，基于适配器模式，设计了 IMChannel 统一接口（飞书、Telegram、QQ、钉钉、微信、Discord、WhatsApp 七渠道统一抽象），实现了 Agent 核心不感知渠道差异。
- 面试要讲：为什么要统一抽象、适配器做了什么、各渠道能力差异如何处理。
- 对应 Q：`Q07.x`
- 对应 W：`W04 W07`

## R08 多渠道消息路由与 JID 寻址

- 风险：中
- 推荐 bullet：针对多渠道消息无法统一寻址与路由、原生上下文丢失的问题，基于统一寻址规范，设计了 JID 寻址格式（`{provider}:{externalChatId}#account:{id}#thread:{id}#root:{id}`）与多渠道路由解析，实现了飞书话题、Telegram Forum 等原生上下文的映射。
- 面试要讲：JID 为什么这样设计、路由解析做了什么、原生上下文怎么映射。
- 对应 Q：`Q08.x`
- 对应 W：`W07`

## R09 出站消息可靠投递状态机

- 风险：中高
- 推荐 bullet：针对出站消息在异步投递中丢失或重复的问题，基于 outbox 模式与状态机，设计了出站消息可靠投递状态机（pending->claimed->uploading->uploaded->sending->delivered/uncertain/failed，`reconcileExpiredChannelOutbox` 恢复），实现了 IM 消息至少一次交付。
- 面试要讲：为什么需要状态机、uncertain 状态怎么处理、outbox 恢复做了什么。
- 对应 Q：`Q09.x`
- 对应 W：`W07`

## R10 Turn 租赁与会话所有权管理

- 风险：中高
- 推荐 bullet：针对多用户并发会话冲突、同一会话被多实例抢占的问题，基于租约与所有权机制，设计了 Turn 租赁（45s 过期、12s 心跳）与会话所有权管理（`resolveStickyChannelOwner`、IMConnectionManager 全局连接池、凭证互斥），实现了多用户并发会话的不冲突。
- 面试要讲：Turn 租赁解决什么、会话粘性为什么重要、凭证互斥防什么。
- 对应 Q：`Q10.x`
- 对应 W：`W07`

## R11 Provider 多模型负载均衡与健康追踪

- 风险：中
- 推荐 bullet：针对单一模型供应商故障导致服务不可用的问题，基于负载均衡与健康追踪，设计了 ProviderPool 内存负载均衡器（round-robin/weighted-round-robin/failover 三策略、consecutiveErrors≥3 健康追踪、5 分钟恢复窗口），实现了多供应商可用性管理。
- 面试要讲：三种策略各适合什么、健康追踪怎么判断、会话粘性为什么防 thinking block 错误。
- 对应 Q：`Q11.x`
- 对应 W：`W03`

## R12 多 Provider 凭据管理与 AES-256-GCM 加密

- 风险：中
- 推荐 bullet：针对多 Provider 凭据明文存储泄露风险与运行时降级缺失的问题，基于对称加密与文件权限控制，设计了多 Provider 凭据管理体系（AES-256-GCM 加密存储 secrets、0o600 权限、provider-fallback.ts 模型级降级），实现了凭据安全与运行时容错。
- 面试要讲：为什么用 AES-256-GCM、密钥怎么管理、模型降级什么时候触发。
- 对应 Q：`Q12.x`
- 对应 W：`W03 W09`

## R13 SQLite Schema 演进与三层迁移策略

- 风险：中
- 推荐 bullet：针对 SQLite 长期演进中 schema 变更破坏存量数据、迁移不可重入的问题，基于三层迁移策略，设计了 SQLite 迁移体系（`CREATE TABLE IF NOT EXISTS` 声明式建表 + `ensureColumn` 幂等补列 + 版本门控数据迁移，VACUUM INTO 预迁移备份、`assertSchema` 完整性断言），实现了 Schema 平滑演进至 v63。
- 面试要讲：为什么三层、幂等补列解决什么、预迁移备份防什么。
- 对应 Q：`Q13.x`
- 对应 W：`W10`

## R14 定时任务调度器（Cron/间隔/一次性）

- 风险：中高
- 推荐 bullet：针对多实例部署下定时任务重复执行与并发竞争的问题，基于租约互斥与不可重入调度，设计了 V2 Occurrence Materialization 定时任务调度器（cron 最小 60s/interval/once 三类型、SQLite 租约互斥 lease_owner/lease_token、循环 `pumpTaskScheduler`），实现了多实例安全调度。
- 面试要讲：Materialization 模式解决什么、租约互斥怎么防并发、心跳为什么是 lease/3。
- 对应 Q：`Q14.x`
- 对应 W：`W11`

## R15 Agent Profile 四段式 Prompt 工程

- 风险：中
- 推荐 bullet：针对数字员工人设缺乏结构化约束、修改无安全确认导致行为失控的问题，基于四段正交 Prompt 工程，设计了 Agent Profile 四段式 Prompt（IDENTITY/SOUL/AGENTS/TOOLS、append/replace 双模式、两阶段 AI 辅助与确认短语安全流程），实现了人设管理的可控与一致。
- 面试要讲：四段各管什么、replace 模式有什么限制、确认短语为什么是安全令牌。
- 对应 Q：`Q15.x`
- 对应 W：`W12`

## R16 Skills/MCP/Plugins 分层能力治理

- 风险：高
- 推荐 bullet：针对 Skills/MCP/Plugins 能力混杂加载、冲突难以治理的问题，基于分层优先级与不可变快照，设计了分层能力治理体系（Skills 六层优先级 builtin->host->project->managed->workspace->plugin、MCP 原生+托管双层、Plugins 不可变快照 COW 物化、`mutateCapabilityAroundRuntimeQuiesce` 安全门控），实现了能力加载的安全可控。
- 面试要讲：六层优先级为什么这么排、托管层为什么优先、运行时安全门控防什么。
- 对应 Q：`Q16.x`
- 对应 W：`W13`

## R17 对话式 Agent Builder 三阶段工作流

- 风险：中高
- 推荐 bullet：针对自然语言创建/编辑 Agent 缺乏跨轮次安全确认、存在竞态的问题，基于确认短语安全令牌与运行时隔离，设计了对话式 Agent Builder 三阶段工作流（Prepare->Confirm->Publish、`withCapabilityScopeLocks` 能力锁、`quiesceWorkspaceRunnersAroundCommit` 运行时隔离），实现了自然语言编辑 Agent 的安全性验证。
- 面试要讲：三阶段各做什么、确认短语为什么跨轮次、运行时隔离防什么竞态。
- 对应 Q：`Q17.x`
- 对应 W：`W14`

## R18 Web API 路由体系与 Hono 框架实践

- 风险：低
- 推荐 bullet：针对 Web API 层路由与校验职责混杂、难以维护扩展的问题，基于 Hono 框架分层路由实践，设计了分层路由体系（`app.route(prefix, router)` 注册 20 个路由文件、Zod Schema 驱动验证、authMiddleware + requirePermission 两层认证、WebSocket Origin 校验），实现了 API 层的工程化。
- 面试要讲：为什么用 Hono、分层注册有什么好处、Zod 验证解决什么。
- 对应 Q：`Q18.x`
- 对应 W：`W08`

## R19 认证与会话管理

- 风险：中
- 推荐 bullet：针对会话 Cookie 可伪造、登录接口可被爆破的问题，基于 HMAC 签名与双层限流，设计了 Cookie Session 认证体系（30 天、64 字符 hex token、HMAC-SHA256 签名、常量时间比较防时序攻击、`__Host-` 前缀 Secure Cookie、per-IP + per-username 双层限流），实现了认证与登录安全加固。
- 面试要讲：为什么要签名、常量时间比较防什么、双层限流怎么配合。
- 对应 Q：`Q19.x`
- 对应 W：`W09`

## R20 RBAC 权限三态模型与工作区所有权

- 风险：中高
- 推荐 bullet：针对多租户场景下越权访问与管理员权限过大的问题，基于 RBAC 三态模型与渠道身份匹配，设计了权限体系（canAccessGroup/canModifyGroup/canDeleteGroup 三态、admin 不自动 bypass 工作区所有权、IM Owner Gate 渠道身份匹配），实现了企业多租户隔离。
- 面试要讲：三态各做什么、admin 为什么不 bypass、IM Owner Gate 防什么。
- 对应 Q：`Q20.x`
- 对应 W：`W09 W21`

## R21 React 19 前端架构与 Zustand 状态管理

- 风险：低
- 推荐 bullet：针对前端状态分散导致消息流渲染卡顿、弱网重连体验差的问题，基于 React 19 与模块化状态管理，设计了模块化前端架构（15 个模块化 Store、`@tanstack/react-virtual` 消息虚拟化、WsManager 指数退避重连），实现了长列表流畅渲染与弱网恢复。
- 面试要讲：为什么选 Zustand、虚拟化解决什么、WsManager 重连策略。
- 对应 Q：`Q21.x`
- 对应 W：`W18`

## R22 实时流式输出与工具轨迹展示

- 风险：中
- 推荐 bullet：针对流式输出与工具轨迹缺乏实时可视化、长推理过程不可感知的问题，基于 StreamingState 数据结构与 rAF 批处理，设计了实时流式输出系统（partialText/thinkingText/activeTools/taskStates/todos、sessionStorage 持久化，渲染思考块/嵌套工具卡片/TODO 面板/权限拒绝卡片），实现了推理过程的实时可视化。
- 面试要讲：StreamingState 管什么、rAF 批处理为什么、两阶段中断防什么。
- 对应 Q：`Q22.x`
- 对应 W：`W19`

## R23 多租户安全隔离

- 风险：高
- 推荐 bullet：针对多租户间越权与跨租户注入风险的问题，基于实时活性授权与多层防护，设计了多租户安全隔离体系（`canExecuteOnHost` 每次从 DB 读 + 内存 Set 即时吊销、定时任务无 Admin 旁路、URL SSRF 防 DNS rebinding、文件系统路径遍历防护），实现了租户间越权风险的收敛。
- 面试要讲：实时授权为什么每次读 DB、定时任务为什么无旁路、SSRF 怎么防 DNS rebinding。
- 对应 Q：`Q23.x`
- 对应 W：`W21`

## R24 工程化验证体系与三端类型同步

- 风险：低
- 推荐 bullet：针对三端共享类型各自维护导致编译期漂移、运行时才发现错误的问题，基于编译单元验证与机械同步，设计了三层 TypeScript 编译单元验证体系（`make sync-types` 机械复制共享类型、CI 验证 StreamEvent 同步与 Prompt 引用、290+ 测试覆盖），实现了"把运行时错误提前到编译时"。
- 面试要讲：为什么三端编译、sync-types 怎么验证、CI 跑了哪些检查。
- 对应 Q：`Q24.x`
- 对应 W：`W22`

## R25 行为评测与可观测底座（Agent 评测）

- 风险：中
- 推荐 bullet：针对 Agent 行为黑盒化、改动效果难以度量与归因的问题，基于结构化事件流与回归门禁，设计了行为评测底座（StreamEvent 全链路轨迹、290+ 测试与 CI 门禁、迁移与安全回归套件），实现了行为可观测、回归可追踪、结论可归因。
- 面试要讲：R24 与 R25 的分工（编译期验证 vs 运行期行为评测）；Trace 为什么是评测前提；确定性评分优于 LLM 裁判；pass^k 与成本受控是方法论认知。
- 对应 Q：`Q25.x`
- 对应 W：`W17 W22`

## R26 数字员工能力治理与进化（Skill 自进化）

- 风险：高
- 推荐 bullet：针对数字员工技能/插件库膨胀导致能力冲突、变更难以回滚的问题，基于分层优先级与不可变快照，设计了能力治理与进化机制（六层优先级加载、COW 物化、运行时安全门控、确认短语审批），实现了能力变更的可回滚与安全上线。
- 面试要讲：为什么不可变快照=可回滚；确认短语如何把人设发布变成人审；前沿认知（轨迹蒸馏/Ratchet 库卫生/26.1% 技能漏洞率）与平台实现的边界——平台无自动技能进化。
- 对应 Q：`Q26.x`
- 对应 W：`W12 W13`

## R27 纵深防御与信任边界（Agent 安全）

- 风险：高
- 推荐 bullet：针对多租户数字员工平台攻破后爆炸半径不可控的问题，基于纵深防御与信任边界下移，设计了分层安全体系（容器沙箱挂载三层防御、凭据加密托管、RBAC 三态授权、多租户实时活性授权），实现了单层失守下的爆炸半径收敛。
- 面试要讲：信任边界下移的含义；论文防御（gVisor 内核隔离/网络白名单/AI Control 15%→92%）是认知不是实现；评测意识如何影响安全结论。
- 对应 Q：`Q27.x`
- 对应 W：`W15 W09 W21`
