# Craft Agents｜金融 Research Agent 场景

## Q01｜如何把金融研究来源接入 Agent，又不让来源直接获得过大权限？

- **验证能力**：External Knowledge、Source 治理和只读 Tool Calling。
- **Claim**：`claim-craft-finance-source-governance`
- **建议回答**：金融研究需要把财报、公告和新闻接入同一条证据链，但连接能力和使用方式不能混在一起，所以我会让 Source 负责连接配置与凭据，让 ServerBuilder 负责把经过配置的能力变成 Session 工具，再由 PreToolUse 在执行前检查权限；研究工具默认只读，发布或交易动作单独走审批。Craft 的源码能证明 Source、ServerBuilder 和权限门的基座能力，财报 Adapter、Claim→Evidence Schema 和金融 Dataset 仍需在场景层新增，不能说成已经接入真实市场数据。
- **源码锚点**：`packages/shared/src/sources/server-builder.ts`；`packages/shared/src/agent/core/pre-tool-use.ts`；`packages/session-tools-core/src/source-helpers.ts`。
- **测试锚点**：`packages/shared/src/sources/__tests__/server-builder-flow.test.ts`；`packages/shared/src/agent/core/__tests__/pre-tool-use-checks.isolated.ts`。
- **必追问**：来源和工具的权限如何分开；凭据如何避免进入 Prompt；如何绑定 Source 与 Evidence；冲突来源如何处理；哪些部分是场景新增；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能声称已有证券数据、券商研报或交易审批联调。

## Q02｜同一结论有两个来源时，面试官会追问什么？

- **验证能力**：Cross Check、证据建模和失败处理。
- **Claim**：`claim-craft-finance-cross-check`
- **建议回答**：金融场景下我不会让模型凭语气选择一个来源，而是要求研究流程保留原始片段、来源类型、发布日期、统计期间和计算口径，发现冲突时先把 Claim 标记为待核验，再要求补充原始材料或人工确认。Craft 基座提供工具接入、Session 上下文和权限控制，可以承载这种流程，但冲突裁决规则、时间窗 Schema 和计算复现测试需要作为场景 Artifact 构建；如果没有这些材料，回答只能定位为方案设计而不是现成项目能力。
- **源码锚点**：`packages/shared/src/sources/server-builder.ts`；`packages/pi-agent-server/src/tools/search/create-search-tool.ts`；`packages/session-tools-core/src/context.ts`。
- **测试锚点**：`packages/pi-agent-server/src/tools/search/create-search-tool.test.ts`；`packages/session-tools-core/src/validation.test.ts`。
- **必追问**：如何保存时间戳和口径；来源更新如何重新评估 Claim；研究上下文过长怎么办；如何构造冲突样例；你能展示哪份实际 Dataset。
- **不能越界**：不能把通用搜索工具说成金融 Evidence Ledger，也不能编造研究准确率。

## Q03｜为什么金融 Research Agent 不应该默认拥有写操作？

- **验证能力**：Agent 安全、权限边界和人机协作。
- **Claim**：`claim-craft-finance-readonly-gate`
- **建议回答**：金融场景的研究结论和交易动作风险等级不同，所以我会把检索、读取、计算设为低副作用工具，把发布、下单或修改组合放在明确的审批工具后面；关键不是把规则写进 Prompt，而是在 PreToolUse 路径上对每次调用做硬判定。Craft 基座的权限管理器和 PreToolUse 管线能够证明执行前拦截的设计，金融审批、审计日志和交易 Adapter 需要另行实现和验证。
- **源码锚点**：`packages/shared/src/agent/core/pre-tool-use.ts`；`packages/shared/src/agent/core/permission-manager.ts`；`packages/shared/src/agent/permissions-config.ts`。
- **测试锚点**：`packages/shared/src/agent/core/__tests__/permission-manager.test.ts`；`packages/shared/src/agent/__tests__/call-llm-permissions.test.ts`。
- **必追问**：权限模式如何传递；用户确认如何恢复 Session；工具输出注入如何防；审批记录和执行记录如何关联；不能联调时如何做替代测试；你亲自负责哪一段，能展示哪份代码或测试。
- **不能越界**：不能说 Craft 已经拥有证券交易级别的安全控制或合规认证。
