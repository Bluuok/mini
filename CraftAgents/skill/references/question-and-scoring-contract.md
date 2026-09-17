# 问题与评分契约

每道核心题必须在提问前建立内部契约，不能看到回答后临时改变标准。

契约固定包含：

- question_id
- claim_id
- bullet_id
- agent_layer
- scenario_route
- intent
- required_evidence
- source_anchors
- evidence_level
- ownership_scope
- followup_triggers
- stop_condition

回答后只判断证据状态，不输出未经校准的精确总分。预测题的质量另外检查：源码可定位、实现细节、技术取舍、失败路径、Ownership 和场景增量。

动态规则：

- 必要证据缺一项：只追最关键缺口；
- 回答充分：最多追一个替代方案、故障或反事实问题；
- 回答带有背诵感：改问具体输入、数据流、代码边界或失败处理；
- 回答超出真实经历：要求划清个人、团队、上游和二开边界；
- 回答只有技术名词：要求指出源码符号、状态变化和可观察结果；
- 源码路径不存在或只能由 Wiki 推断：降级为源码分析/设计题，不判为项目实现；
- 场景只替换行业名词：要求补充 Domain Artifact 和 Failure Mode，否则移除场景题；
- 连续两轮没有新增证据：停止当前分支并标记 partial 或 unverified。

## 预测题最终门槛

主问题必须有实现源码锚点；核心 Claim 最好同时有测试或契约锚点。每道主问题至少有架构、实现、取舍、失败/回滚和 Ownership 五类追问，且答案能在一段话内讲清问题、动作、结果和局限。
