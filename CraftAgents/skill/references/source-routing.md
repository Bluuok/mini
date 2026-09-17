# 场景到源码路由

场景路由只决定“问什么”和“追问哪里”，不改变 Craft Agents 的基座源码事实。先读取 `assets/source-manifest.json`，再按下表选择最小源码集合；不要为一个场景加载整份 ZIP。

| 场景 | 业务问题与 Failure Mode | 首选源码入口 | 需要补充的 QA 角度 |
| --- | --- | --- | --- |
| 非场景化 Agent 平台 | 多后端执行、工具权限、会话隔离 | `packages/shared/src/agent/base-agent.ts`、`packages/shared/src/agent/backend/factory.ts`、`packages/pi-agent-server/src/index.ts` | 生命周期、事件适配、Session/Workspace 边界 |
| 金融 Research Agent | 来源时点、口径冲突、证据链断裂 | `packages/shared/src/sources/server-builder.ts`、`packages/shared/src/agent/core/pre-tool-use.ts`、`packages/pi-agent-server/src/tools/search/create-search-tool.ts` | Claim→Evidence、只读工具、来源治理；不要声称已有金融研究连接器 |
| 电商经营决策 Agent | 价格/库存/广告异常、促销误判、处置重复 | `packages/shared/src/sources/server-builder.ts`、`packages/session-tools-core/src/handlers/create-task.ts`、`packages/messaging-gateway/src/router.ts` | Monitor→Detect→Investigate→Decide→Act、审批、任务幂等；不要声称已有价格抓取系统 |
| 工业运维 Agent | 设备/质量异常、SOP 漏执行、告警风暴 | `packages/shared/src/agent/backend/event-queue.ts`、`packages/shared/src/agent/core/pre-tool-use.ts`、`packages/server-core/src/handlers/rpc/tasks.ts` | 任务编排、故障恢复、权限边界、人工接管 |

每个路由至少选一个 Agent Core 实现点、一个状态/安全点和一个测试或契约点。场景没有对应源码时，只生成“设计追问”和明确的方案边界。
