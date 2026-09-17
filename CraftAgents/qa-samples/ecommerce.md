# Craft Agents｜电商经营决策 Agent 场景

## Q01｜如何让电商 Agent 从监控走到处置，而不是只回答问题？

- **验证能力**：Workflow、任务工具和权限门。
- **Claim**：`claim-craft-ecommerce-decision-workflow`
- **建议回答**：电商运营每天面对的是监控、异常定位、原因调查和动作确认的连续流程，所以我会让 Source/ServerBuilder 接入库存、商品和广告数据，再由 Session 工具和任务处理承载调查与处置，真正有副作用的动作继续经过权限确认。Craft 提供能力注册、Session 工具和任务处理基座，但价格、库存和广告平台 Adapter 属于场景新增，不能仅凭源码声称完成了企业系统联调。
- **源码锚点**：`packages/shared/src/sources/server-builder.ts`；`packages/session-tools-core/src/handlers/create-task.ts`；`packages/shared/src/agent/core/pre-tool-use.ts`。
- **测试锚点**：`packages/session-tools-core/src/handlers/create-task.test.ts`；`packages/shared/src/sources/__tests__/server-builder-flow.test.ts`。
- **必追问**：Monitor 和 Act 的边界；任务如何避免重复；审批前后状态如何保存；平台 Adapter 的 Schema；怎么证明不是把通用工具换成电商名词；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能声称已接入真实电商平台或自动改价。

## Q02｜竞争价格异常和促销价如何区分？

- **验证能力**：Domain Schema、上下文工程和场景 Failure Mode。
- **Claim**：`claim-craft-ecommerce-price-context`
- **建议回答**：电商场景下，同一 SKU 的低价可能是会员价、满减、套装、规格差异或短时活动，因此我会把商品规格、促销条件、库存、采集时间和历史窗口作为结构化上下文传给调查工具，先解释异常再生成处置建议。Craft 基座的 Source 接入和 Session 上下文能承载这个流程，但促销解析规则和案例集需要场景层实现；没有真实数据时只能用合成案例或设计题验证，不能给出生产准确率。
- **源码锚点**：`packages/session-tools-core/src/context.ts`；`packages/shared/src/sources/server-builder.ts`；`packages/pi-agent-server/src/tools/search/types.ts`。
- **测试锚点**：`packages/session-tools-core/src/validation.test.ts`；`packages/pi-agent-server/src/tools/search/create-search-tool.test.ts`。
- **必追问**：Schema 哪些字段必填；历史窗口如何控制上下文；原始证据如何保存；误判如何回滚；如何设计最小 Failure Dataset；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能把搜索工具说成已经完成价格匹配或促销识别模型。

## Q03｜动作执行到一半断连，如何避免重复改价？

- **验证能力**：任务状态、事件队列和副作用幂等。
- **Claim**：`claim-craft-ecommerce-action-recovery`
- **建议回答**：电商场景里，有副作用的改价或调预算不能依赖内存中的一次调用，所以我会先持久化任务参数、审批结果和执行状态，遇到断连时根据状态判断是未执行、执行中未知还是明确失败，未知状态交给人工确认而不是自动重放。Craft 基座的 Session/Task 和事件队列提供任务管理骨架，具体平台动作的幂等键和对账接口仍属于场景实现。
- **源码锚点**：`packages/session-tools-core/src/handlers/create-task.ts`；`packages/shared/src/agent/backend/event-queue.ts`；`packages/server-core/src/tasks/create-task.ts`。
- **测试锚点**：`packages/session-tools-core/src/handlers/create-task.test.ts`；`packages/shared/src/agent/__tests__/event-queue.test.ts`。
- **必追问**：状态机有哪些终态；断连后如何恢复；幂等键由谁生成；人工确认后如何继续；如何区分任务状态和 Provider 副作用状态；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能把通用任务处理说成已经具备电商平台级 Exactly-once 改价保证。
