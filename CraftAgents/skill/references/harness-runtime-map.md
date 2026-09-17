# Harness vs Runtime 边界映射（Craft Agents）

> 供 Scenario Alignment Path / Resume Mode 判断“这条能力属于 Harness 还是 Runtime”，并按岗位调整优先级。本文件的组件映射是 Skill 包内可用摘要；父目录的 `05-CraftAgents-Harness与Runtime要点扩充-付费版.md` 仅是可选深挖材料，不是正常生成的必需依赖。

## 边界定义

- **Agent Harness**：让模型成为 Agent 的一层。职责：Agent 循环、Prompt 装配与上下文管理、工具面披露与分发、消息/状态追踪、输出解析与重试、错误处理与终止条件、子代理编排。特征：**赋能（empower）**，产品逻辑所在，属于应用代码。
- **Agent Runtime**：Agent 行为实际发生并被治理的一层。职责：进程/会话隔离、沙箱执行、资源限制、网络出口管控、凭据注入与 broker、持久化状态与检查点、并发排队与水平扩展、执行层遥测审计。特征：**限制（limit/constrain）**，属于基础设施代码。

**不要混淆**：Harness 不是安全边界（它的职责是赋能不是设限）；Runtime 才是治理与隔离层。

## Craft Agents 归属映射

| 组件 | 归属 | 依据 |
| --- | --- | --- |
| BaseAgent 模板方法 / AgentBackend 抽象 | Harness | Agent 循环与多后端统一 |
| PromptBuilder 共享上下文块（core/） | Harness | Prompt 装配 |
| PreToolUse 五步集中管线 | Harness | 工具分发前拦截（赋能前提下的顺序治理） |
| Permission Mode / 权限回调回路 | Harness | 人在回路的交互协议（裁决在产品侧） |
| Bash AST 校验器 | Harness | 输出解析与 schema 校验 |
| spawn_session 子代理工具 | Harness | 子代理编排 |
| 会话生命周期 / 恢复上下文 | Harness | 消息与状态追踪 |
| 四族事件适配器 / event-queue | Harness | 事件统一与重试 |
| call_llm 内嵌工具 / PrerequisiteManager | Harness | 工具面扩展 |
| Skills / Sources / prompts / mentions | Harness | 上下文与能力披露 |
| **AgentBackend 接口 / 进程外 JSONL** | **边界** | 两个世界的物理接缝 |
| Pi Agent Server 子进程运行时 | Runtime | 进程隔离 |
| CredentialManager / TokenRefresh 冷却 | Runtime | 凭据 broker |
| Messaging Gateway + WhatsApp worker | Runtime | 依赖隔离与扇出 |
| server-core runtime/ 平台抽象（null 实现） | Runtime | 执行环境治理 |
| transport/ codec / capabilities / push | Runtime | 传输原语 |
| automations / scheduler | Runtime | 后台任务执行 |

**边界注意**：Permission 相关组件在 Craft 中跨两层——**裁决协议与回调属 Harness（人在回路的产品逻辑），凭据注入与进程隔离属 Runtime**。面试中若被问"权限是不是安全边界"，正确口径：PreToolUse 是拦截点（Harness 提供治理钩子），真正兜底的是工具执行的进程边界与凭据范围（Runtime）。

## 轨道选择启发式

- 用户目标为 **AI 应用 / Agent 架构 / Agent 工程师** → 优先 Harness、Tool Calling 与 Context Engineering Artifact。
- 用户有**后端/平台/infra 基础**，目标 **Agent 平台 / 基础设施 / 桌面客户端架构** → 提高 Runtime、隔离、凭据和恢复 Artifact 的优先级。
- 用户目标不明 → 先做 Agent Project Model 与 Coverage Check，不套固定 H/R/RT 数量。
- **同源去重红线**：H01↔R06、H07↔R10、RT01↔R21、RT02↔R19、RT03↔R22 同源不同面，同一份简历同源对最多出现一个。
- **证据口径红线**：H/RT 点证据来自源码直读（源码包）而非 wiki/手册页；面试深挖时如实说“基于源码分析”。SDK 内部机制另有 PS 系列（`references/pi-sdk-harness.md`，证据基于 0.84.x 文档口径，注意本项目依赖 0.80.6 的 API 差异），PS 点不进 bullet，仅作纵深弹药。
- **前沿红线不变**：评测/自进化/安全话题仍按 R25/R26/R27 的【项目实现】/【前沿认知】双标注；H/RT 点全部属于【项目实现】范畴。
