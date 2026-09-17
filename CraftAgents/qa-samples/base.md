# Craft Agents｜非场景化 Agent 平台

## Q01｜为什么要用 AgentBackend 和事件适配层隔离不同执行后端？

- **验证能力**：Runtime 抽象、事件归一化和可替换性。
- **Claim**：`claim-craft-backend-abstraction`
- **建议回答**：要解决 Claude、Pi 或其他执行后端各自产生不同事件和生命周期，导致上层 UI、Session 和工具逻辑被后端绑死的问题，所以我会让 AgentBackend 暴露统一的执行边界，再由事件适配层把后端事件转换成统一 AgentEvent。这样上层只处理一套流式事件和状态模型，后端替换不会扩散到所有调用方；源码中 `base-agent`、Backend factory 和 event adapter 分别承担模板、选择和归一化职责，相关单测验证了工厂与事件行为。代价是抽象层需要维护事件语义一致性。
- **源码锚点**：`packages/shared/src/agent/base-agent.ts`；`packages/shared/src/agent/backend/factory.ts`；`packages/shared/src/agent/backend/base-event-adapter.ts`。
- **测试锚点**：`packages/shared/src/agent/__tests__/base-agent.test.ts`；`packages/shared/src/agent/backend/__tests__/factory.test.ts`。
- **必追问**：哪些生命周期由 BaseAgent 控制；事件适配如何处理后端特有事件；错误和中断怎么归一化；后端切换的代价是什么；你亲自负责哪一层。
- **不能越界**：不能把所有后端说成行为完全一致，也不能把公开源码能力直接归因于个人开发。

## Q02｜PreToolUse 为什么不能只靠 System Prompt？

- **验证能力**：Tool Calling、权限硬门和最小暴露。
- **Claim**：`claim-craft-pretool-permission-gate`
- **建议回答**：Prompt 只能告诉模型应该怎么做，不能阻止模型在生成工具调用时越权，因此我会在工具真正执行前设置 PreToolUse 拦截，把 safe、ask 和 allow-all 等模式转成代码级判定，并在需要时把请求交给用户确认。这样模型即使输出了危险调用，也必须先经过权限管线；源码中 `pre-tool-use` 和 `permission-manager` 位于执行前路径，权限测试覆盖了不同工具类型和模式。代价是每种工具都要维护清晰的权限语义，交互也会增加等待。
- **源码锚点**：`packages/shared/src/agent/core/pre-tool-use.ts`；`packages/shared/src/agent/core/permission-manager.ts`；`packages/shared/src/agent/permissions-config.ts`。
- **测试锚点**：`packages/shared/src/agent/core/__tests__/pre-tool-use-checks.isolated.ts`；`packages/shared/src/agent/core/__tests__/permission-manager.test.ts`。
- **必追问**：拦截发生在工具调用哪个时刻；ask 的状态如何回到执行流；allow-all 是否绕过所有规则；工具输出中的 Prompt Injection 怎么办；如何测试硬门未被旁路；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能声称能阻止模型的一切风险，也不能把论文里的 Agent 安全结论说成项目测试结果。

## Q03｜Sources、Skills、MCP 为什么要经过 ServerBuilder？

- **验证能力**：External Knowledge、能力治理和上下文装配。
- **Claim**：`claim-craft-capability-registration`
- **建议回答**：外部 Source 提供连接和凭据，Skill 提供使用规则，MCP 或 API 最终要变成当前 Session 能调用的工具；如果每类能力各自注册，权限、凭据和工具描述就会分散，所以我会让 ServerBuilder 作为统一装配入口，在注册时绑定来源配置、凭据注入和权限范围，再把结果交给 Session 工具层。这样工具面是可审计和可控的，但它不等于项目自动生成或自进化 Skill；源码和 ServerBuilder 测试证明的是能力接入流程。
- **源码锚点**：`packages/shared/src/sources/server-builder.ts`；`packages/session-tools-core/src/source-helpers.ts`；`packages/session-tools-core/src/tool-defs.ts`。
- **测试锚点**：`packages/shared/src/sources/__tests__/server-builder-flow.test.ts`；`packages/shared/src/sources/__tests__/server-builder-authScheme.test.ts`。
- **必追问**：凭据在哪一层注入；Source 和 Skill 的边界；工具定义如何按 Session 过滤；同名工具如何处理；第三方 Source 失效时怎么降级；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能说项目已经具备自主 Skill 生成、行业知识库或统一外部数据质量评测。
