# HappyClaw Resume Skill - 完整执行示例

## 阶段 0：Skill 激活

用户请求：

```text
请使用 HappyClaw Resume Skill，根据我的背景生成一版多用户 Agent 工作台项目经历。
```

Agent 触发原因：

- 用户明确要求使用 HappyClaw Resume Skill。
- 任务是把 HappyClaw 包装成简历项目并准备面试。

## 阶段 1：信息收集

Agent 读取：

- `references/user-intake.md`

用户提供信息：

- 目标岗位：企业 AI 应用 / 数字员工 / Agent 平台
- 技术栈：TypeScript、Node.js、React、SQLite
- 熟悉：后端接口、状态管理、工程化
- 不熟：Docker 安全和 MCP 协议细节
- 风险偏好：希望高阶，但不能太虚

Agent 判断：

- 掌握程度：L2
- 可选方案：Plan H（会员默认推荐版）
- 推荐组合：`R01 R07 R11 R15 R23`
- 风险点：`R23` 高风险

## 阶段 2：方案匹配

Agent 读取：

- `references/combo-plans.md`
- `references/resume-points.md`

匹配方案：

- 方案 H：Paid-Member Default
- 推荐组合：`R01 R07 R11 R15 R23`

交叉校验：

- `R01` 中风险，可讲三层产品模型。
- `R07` 中风险，适合数字员工 IM 驻场定位。
- `R11` 中风险，适合多模型负载均衡。
- `R15` 中风险，适合 Agent Profile Prompt 工程。
- `R23` 高风险，需要讲清楚多租户安全隔离源码层设计，不熟时降级为 `R19`。

## 阶段 3：简历项目生成

Agent 输出：

```text
HappyClaw - 多用户 Agent 工作台与企业数字员工平台

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
```

风险提示：

- `R23` 是高风险点，必须能讲清楚实时授权、无旁路和 SSRF 防护的源码层设计。
- 如果无法解释多租户安全隔离，可把 `R23` 降级为 `R19 认证与会话管理`。

## 阶段 4：面试 Q&A 匹配

Agent 读取：

- `references/interview-qa.md`

输出对应问题：

- `Q01.1` 为什么要设计 AgentProfile -> Workspace -> Session 三层模型？
- `Q07.1` 为什么要把 7 个 IM 渠道统一抽象？
- `Q11.1` 为什么需要会话粘性？
- `Q15.1` 四段正交 Prompt 解决什么问题？
- `Q23.1` 定时任务为什么无 Admin 旁路？

回答框架统一为：

1. 解决什么问题。
2. HappyClaw 如何实现。
3. 为什么这样设计。
4. 局限与扩展。

## 阶段 5：CodeWiki 深挖

用户追加：

```text
请深挖 R23 多租户安全隔离。
```

Agent 读取：

- `references/codewiki-index.md`

索引定位：

- `R23` 对应 `W21`
- `W21`：多租户安全隔离
- 对应文件：`references/wiki/22-duo-zu-hu-an-quan-ge-chi-host-zhi-xing-quan-xian-zi-yuan-ge-chi-yu-min-gan-cao-zuo-bao-hu.md`

Agent 只读取该 codewiki 文件，不加载全部 23 篇。

深挖输出框架：

- 问题：多用户共享同一 Agent 运行时，需要防止跨租户数据泄漏和权限越权。
- 实现：Host 执行实时活性授权（canExecuteOnHost 每次从 DB 读权限 + beginHostPrivilegeRevocation/endHostPrivilegeRevocation 内存 Set 即时吊销），定时任务无 Admin 旁路（isAdminHome 故意不出现，防注入跨租户种植），URL SSRF 防护（isPrivateHostname + assertResolvesToPublicAddress DNS rebinding 防御 + safe-git-proxy 本地 CONNECT 代理）。
- 取舍：实时读 DB 有性能成本，但保证权限变更立即生效；无旁路牺牲了便利性，但防止注入内容跨租户。
- 局限：不能把它宣传成完整安全沙箱；它更像多租户隔离的防御纵深策略。
- 降级：如果讲不清 SSRF DNS rebinding，可写为"理解并梳理了多租户安全隔离的实时授权和无旁路设计"。

## 阶段 6：护栏执行记录

- 没有超过 5 个 R 点。
- 每个 bullet 都有 `Rxx`。
- 每个 `Rxx` 都有 `Qxx.x`。
- 高风险点有明确提示。
- 深挖回到了 `codewiki-index.md` 并只读取了对应 wiki 文件。
- 没有编造指标、用户量或业务结果。
- 没有把扩展设想写成已实现能力。

## 关键执行链总结

```text
user-intake.md
-> combo-plans.md
-> resume-points.md
-> interview-qa.md
-> codewiki-index.md
-> wiki/22-duo-zu-hu-an-quan-...md
```
