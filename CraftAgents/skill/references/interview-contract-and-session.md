# 面试契约与 Session Ledger

本文件用于 Resume Skill 的 Q&A Prediction、Grill、Review 和 Retry 模式。默认只在当前会话维护状态；用户明确要求保存时才导出 JSON。

## 面试契约

缺少信息时使用默认值，不重复盘问：

    role: 从 JD 或用户画像推断
    round: 技术面
    duration_minutes: 30
    feedback_policy: deferred
    hint_policy: on_request
    max_followups_per_claim: 5
    language: zh-CN

用户明确指定的轮次、时长、反馈方式或题型优先。

## Session Ledger

每个被问到的 Claim 记录 claim_id、status、evidence_found、missing、contradictions、followup_depth、last_question_id、source_anchors、evidence_level 和 ownership_scope。预测题生成时还要记录对应的 bullet_id、agent_layer 和 scenario_route。

允许状态：

- verified：必要证据得到支持；
- partial：部分支持，仍有明确缺口；
- unverified：无法提供最低限度事实；
- contradictory：与简历或前文存在未解决冲突；
- not_covered：本轮未覆盖。

账本只记录用户回答中的证据、缺口和冲突，不记录模型臆测，也不记录整段聊天记录。源码锚点只接受 Project-relative path 加符号/测试定位；源码包不可读或哈希不匹配时，必须把该题标为 source_unverified。

## 恢复规则

- 当前会话有账本时，从未结束 Claim 或最高优先级缺口继续。
- 没有可恢复记录时，明确说明并要求用户提供上次复盘或重新开始。
- 不假装记得丢失的问题、回答或状态。
