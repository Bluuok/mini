# HappyClaw Resume Skill - Agent 产物输出

## 用户画像

- 目标岗位：企业 AI 应用 / 数字员工 / Agent 平台
- 技术栈：TypeScript、Node.js、React、SQLite
- 熟悉方向：后端接口、状态管理、工程化
- 不熟方向：Docker 安全和 MCP 协议细节
- 风险偏好：高阶但需要可解释

## 方案匹配

采用方案 H：会员默认推荐版。

选定 5 个点：

- `R01` Agent-First 三层产品模型（Profile/Workspace/Session）
- `R07` 7 渠道 IM 统一抽象与适配器模式
- `R11` Provider 多模型负载均衡与健康追踪
- `R15` Agent Profile 四段式 Prompt 工程
- `R23` 多租户安全隔离

风险提示：

- `R23` 是高风险点：必须能讲清实时活性授权、定时任务无旁路和 SSRF 防护的源码层设计。
- 如果面试前准备不足，`R23` 可降级为 `R19`。

## 简历项目

### HappyClaw - 多用户 Agent 工作台与企业数字员工平台

项目简介：

基于 HappyClaw 的架构学习与项目化整理，围绕 Agent-First 三层产品模型、7 渠道 IM 集成、多模型负载均衡、Agent Profile Prompt 工程和多租户安全隔离，拆解一个多用户 Agent 平台从数字员工驻场到安全隔离的核心链路。

技术栈：

TypeScript、Node.js、Hono、SQLite、React 19、Docker、Claude Agent SDK、WebSocket

简历 bullet：

- [R01] 设计 AgentProfile -> Workspace -> Runtime Session 三层产品模型，以 Agent Profile 作为顶层身份、Workspace 作为隔离边界、Session 作为 SDK 会话续约记录，通过 identity_hash 校验保证运行时一致性。
- [R07] 设计 IMChannel 统一接口与适配器模式，将飞书、Telegram、QQ、钉钉、微信、Discord、WhatsApp 七种渠道统一抽象，使 Agent 核心不感知渠道差异，支撑数字员工驻场企业通讯。
- [R11] 实现 ProviderPool 内存负载均衡器，支持 round-robin/weighted-round-robin/failover 三种策略，通过 consecutiveErrors≥3 健康追踪与 5 分钟恢复窗口管理多供应商可用性。
- [R15] 设计 Agent Profile 四段正交 Prompt 工程（IDENTITY/SOUL/AGENTS/TOOLS），支持 append/replace 两种模式，通过两阶段 AI 辅助与确认短语安全流程管理数字员工人设。
- [R23] 设计多租户安全隔离体系：Host 执行实时活性授权（canExecuteOnHost 每次从 DB 读 + 内存 Set 即时吊销）、定时任务无 Admin 旁路、URL SSRF 防护与路径遍历防护。

## 面试 Q&A

### Q01.1 为什么要设计 AgentProfile -> Workspace -> Session 三层模型？

- 解决问题：数字员工需要身份、环境和会话状态各自独立演进。
- HappyClaw 实现：Agent Profile 定义身份和能力边界，Workspace 是文件系统和能力隔离边界，Session 是 SDK 会话续约记录，identity_hash 校验保证一致性。
- 设计取舍：三层正交使各自独立变化，牺牲一点间接性换取清晰边界。
- 局限扩展：复杂协同场景还需要更细粒度的共享状态策略。

### Q07.1 为什么要把 7 个 IM 渠道统一抽象？

- 解决问题：7 种 IM 的消息格式、附件、会话模型各不相同。
- HappyClaw 实现：统一 IMChannel 接口，Agent 核心只处理统一协议，适配器处理渠道差异（如飞书流式卡片三级别降级）。
- 设计取舍：适配器增加了一层间接，但使 Agent 核心不感知渠道差异。
- 局限扩展：各渠道能力有差异（微信仅 P2P、WhatsApp 有封号风险），不能写成"所有渠道功能完全一致"。

### Q11.1 为什么需要会话粘性？

- 解决问题：不同 Provider 的签名实现不同，会话中途切换可能导致 "Invalid signature in thinking block" 错误。
- HappyClaw 实现：ProviderPool 把一次会话绑定到同一个 Provider，consecutiveErrors≥3 标记不健康，5 分钟恢复窗口管理可用性。
- 设计取舍：牺牲一点负载均衡灵活性，换取会话稳定性。
- 局限扩展：failover 策略下仍可能触发签名问题，需要更完善的上下文迁移。

### Q15.1 四段正交 Prompt 解决什么问题？

- 解决问题：数字员工的人设、价值观、工作流和工具策略需要独立配置。
- HappyClaw 实现：IDENTITY/SOUL/AGENTS/TOOLS 四段正交，replace 模式保持平台运行时指令不可移除，确认短语作为跨轮次安全令牌。
- 设计取舍：四段分离增加配置复杂度，但提升可维护性和安全性。
- 局限扩展：AI 辅助生成草稿质量依赖于模型能力，需要人工审核。

### Q23.1 定时任务为什么无 Admin 旁路？

- 解决问题：定时任务可被注入内容，Admin 旁路会导致注入内容跨租户种植。
- HappyClaw 实现：isAdminHome 故意不出现，Host 执行的 canExecuteOnHost 每次从 DB 读权限 + 内存 Set 即时吊销。
- 设计取舍：牺牲 Admin 便利性，换取多租户安全。
- 局限扩展：不能夸大为完整安全沙箱，它更像多租户隔离的防御纵深策略。

## 深挖依据

本次可深挖索引：

- `R01` -> `W05`
- `R07` -> `W04 W07`
- `R11` -> `W03`
- `R15` -> `W12`
- `R23` -> `W21`

深挖时应读取：

- `references/codewiki-index.md`
- `references/wiki/` 下对应编号的 codewiki 文件

## 降级建议

- `R23` 降级：从"设计多租户安全隔离体系"改为"理解并梳理了 HappyClaw 多租户安全隔离的实时授权和无旁路设计"。
- `R07` 降级：从"设计 7 渠道 IM 统一抽象"改为"梳理 IMChannel 接口和适配器模式的职责边界"。
