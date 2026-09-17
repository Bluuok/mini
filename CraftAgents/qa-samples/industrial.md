# Craft Agents｜工业质量与运维 Agent 场景

## Q01｜工业 SOP 和设备数据如何进入 Agent 的调查上下文？

- **验证能力**：External Knowledge、Context Engineering 和 Workflow。
- **Claim**：`claim-craft-industrial-sop-investigation`
- **建议回答**：工业调查需要把设备告警、维修记录和 SOP 版本组合起来，而不是把长文档全部塞进 Prompt，所以我会让 Source 提供数据连接，Session 上下文只装当前设备和时间窗相关的信息，再由任务工具推动调查步骤和人工确认。Craft 的 ServerBuilder、Context 和 Session Task 能支撑这条基座链路，MES/QMS/PLC Adapter、故障模式库和 SOP 版本选择规则属于场景新增 Artifact。
- **源码锚点**：`packages/shared/src/sources/server-builder.ts`；`packages/session-tools-core/src/context.ts`；`packages/session-tools-core/src/handlers/create-task.ts`。
- **测试锚点**：`packages/shared/src/sources/__tests__/server-builder-flow.test.ts`；`packages/session-tools-core/src/handlers/create-task.test.ts`。
- **必追问**：如何按设备隔离上下文；SOP 版本如何选择；数据过期如何识别；调查和动作如何分开；现场没有真实数据时怎么验证；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能声称已连接真实工厂设备或完成现场生产闭环。

## Q02｜告警风暴时，如何防止多个 Agent 任务互相覆盖？

- **验证能力**：Event Queue、Session 隔离和恢复。
- **Claim**：`claim-craft-industrial-event-isolation`
- **建议回答**：工业场景的告警风暴下最危险的是同一设备的多个调查同时修改上下文或重复触发动作，所以我会按设备和任务范围建立明确的 Session/Task 边界，对可合并告警做去重，对必须升级的告警保留独立事件，再由队列控制执行顺序。Craft 基座的事件队列和 Session 模型可以证明并发管理骨架，设备级合并规则、实时性要求和现场接管协议需要由工业场景补充。
- **源码锚点**：`packages/shared/src/agent/backend/event-queue.ts`；`packages/session-tools-core/src/handlers/create-task.ts`；`packages/core/src/types/session.ts`。
- **测试锚点**：`packages/shared/src/agent/__tests__/event-queue.test.ts`；`apps/electron/src/main/__tests__/session-lazy-load-race.test.ts`。
- **必追问**：队列键是什么；相同告警如何判定；任务失败如何重试；不同设备能否并行；如何证明没有跨 Session 串话；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能把通用事件队列说成满足工业实时控制或安全联锁要求。

## Q03｜工具执行不安全时，如何把 Agent 交回人工？

- **验证能力**：Permission Gate、人工接管和失败降级。
- **Claim**：`claim-craft-industrial-human-handoff`
- **建议回答**：当工业场景的 SOP 缺失、设备状态不确定或工具返回冲突时，Agent 应停止继续执行并保留当前证据，把高风险动作交给人工确认，而不是靠模型补全。Craft 基座的 PreToolUse 和 Permission Manager 可以在工具执行前拦截并要求确认，Session/Task 层负责保留上下文；工业安全等级、动作白名单和现场审批记录需要单独设计，不能从通用权限模式直接推导。
- **源码锚点**：`packages/shared/src/agent/core/pre-tool-use.ts`；`packages/shared/src/agent/core/permission-manager.ts`；`packages/session-tools-core/src/handlers/set-session-status.ts`。
- **测试锚点**：`packages/shared/src/agent/core/__tests__/pre-tool-use-checks.isolated.ts`；`packages/session-tools-core/src/handlers/set-session-status.test.ts`。
- **必追问**：确认请求如何恢复；中断和取消有什么区别；高风险动作如何分级；人工接管后如何继续；怎么验证 Agent 不能绕过硬门；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能声称 Craft 已经取得工控安全认证或保证真实设备安全。
