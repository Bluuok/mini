# Claim-Evidence Ledger：简历主张—证据账本

Claim 是一条准备写进简历、项目故事或面试回答，并且能够被追问和复核的具体主张。它不是新的能力编号，也不是最终 bullet；它位于 Agent Project Model 的 Artifact 与自然语言产物之间。

`text
源码事实 + 用户背景 + JD
          ↓
Agent Project Model / Artifact Inventory
          ↓
       Claim（引用 Artifact + R/H/RT/S）
          ↓
  证据 / 责任 / 边界 / 结果口径
          ↓
   简历 bullet + Q&A + 面试验证
`

## 何时建立

Resume、Scenario 或 Full-flow 模式默认建立内存中的 Ledger；满足以下任一条件时，建议按模板导出为用户材料目录旁的 JSON sidecar：

- 同一项目需要生成多个岗位版本；
- 简历涉及 `主导`、`负责人`、`Owner`、`0→1` 或精确指标；
- 场景层 S 点与基座层 R/H/RT 点需要同时出现；
- 用户需要后续生成项目故事、模拟面试或复练；
- 材料中存在职责、指标、时间或项目范围冲突。

Skill 包不保存用户个人信息。默认只在当前会话维护，用户明确要求保存时才写入用户指定路径。

## Ledger v1 字段

每条 `claims` 记录必须包含：

| 字段 | 含义 |
|---|---|
| `id` | 稳定的 Claim ID，如 `claim-miniclaw-001` |
| `project` | `miniclaw` 或 `craft-agents` |
| `artifact_refs` | 对应 Agent Project Model 中的 Artifact ID；新生成的 Claim 必填 |
| `support_points` | 支撑该 Claim 的 `Rxx/Hxx/RTxx/Sxx` 点 |
| `claim_types` | `ownership/technical/architecture/metric/result` |
| `claim_basis` | `project_source/user_attested/scenario_design/jd_assumption` |
| `source_fact` | 不包装的原始事实 |
| `candidate_wording` | 候选简历表述 |
| `sources` | 源码、W 文档、用户确认、JD 等定位证据 |
| `attribution_scope` | `personal/team/project/scenario` |
| `responsibility_level` | `participated/module_owner/delivery_lead/project_owner/not_applicable` |
| `result_type` | 个人结果、团队结果、阶段结果、测算、方法交付等 |
| `verification_status` | `confirmed/pending/stale/excluded` |
| `allowed_uses` | `audit/resume_draft/resume_final/interview` |
| `interview_details` | 决策、难点、验证、结果口径 |
| `boundary` | 不能越过的职责和技术边界 |
| `risk_notes` | 冲突、缺口和风险提示 |
| `last_verified` | 最近确认日期，未知为 `null` |

## 归因与表述政策

### 项目能力与个人能力分开

- `project_source` 证明项目具备某能力，不能单独证明用户本人负责。
- 用户主动选择或明确接受某个点，视为 `user_attested`；这确认“愿意按该点承担面试回答责任”，不自动确认精确指标。
- `scenario_design` 只有在对应 Artifact 已完成状态、Ownership 与证据门控后才可进入干净简历，并且只能使用与 `Scenario Extension` 或 `Design-only` 一致的设计、定义、方案和契约类表述；不得声称已上线或已有精确业务结果。
- `jd_assumption` 只能进入业务痛点、目标或预期效果，不得作为个人成果证据。

### 结果类型决定结果动词

- `personal_actual`：可以写个人完成的可核验结果。
- `team_actual`：必须保留团队或协作口径。
- `phase_result`：必须保留阶段性口径。
- `estimate`：写“测算、预期、目标”，不能写成实际收益。
- `deliverable`：写方法、方案、契约、工具或交付物。
- 没有来源的数字不进入最终简历。

### 输出门禁

- 审计版可展示全部状态、证据和风险。
- 可贴简历版只消费 `verification_status=confirmed` 且允许 `resume_final` 的 Claim。
- `pending/stale/excluded` 不得进入最终简历。
- 最终简历不显示状态标签、内部 Claim ID、`R/H/RT/S` 支撑点编号、`L0-L4` 层级、`L1/L2/L3` 掌握度或 `route_id`；场景对齐包仍可在审计表中显示这些元数据。
- Miniclaw 基座 Memory 仍是结构化知识表 + FTS5；只有行业 Agent 的 S02 场景知识层可以讨论分层向量检索设计。

## 与 Agent Project Model 和现有编号体系的关系

Claim 不替代 `R/Q/W/S/H/RT/PS`：

`text
Artifact → 工程产物、Agent 层、状态、Ownership 与面试展示入口
R/H/RT/S → 项目或场景能力来源
W        → 技术事实证据
Claim    → 本次准备承担的具体主张
Q        → 面试验证路径
`

一个 Claim 可以关联多个 Artifact 和支撑点，但必须声明一个主要叙事边界；不要用 Claim 合并两个互相冲突的 Scope Boundary。旧版 Ledger 没有 `artifact_refs` 时仍可校验，但必须先补做 Project Model 才能重新生成最终简历。
