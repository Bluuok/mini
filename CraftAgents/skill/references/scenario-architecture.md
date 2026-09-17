# Industry Agent 场景架构与 Artifact 推导

本文件负责把已确认 Route Card 转换为工程 Artifact 候选。完整建模字段、状态门控、Coverage 和 Bullet 验收见 `agent-project-modeling.md`。

## 1. 核心原则

```text
通用 Agent 基座
  + 目标场景的数据源、决策约束与业务 SOP
  ↓
能力缺口分析
  ↓
动态 Artifact 候选
  ↓
Implemented / Prototype / Scenario Extension / Design-only
  ↓
Ownership + Evidence + Scope Gate
  ↓
Claim 与简历
```

`S01–S05` 只保留为旧资料兼容索引：S01 数据接入、S02 知识/记忆、S03 SOP/治理、S04 Eval、S05 Reviewer。它们不是固定 Bullet 配额，也不是场景生成上限。最终组织使用 `External Knowledge / Harness / Runtime / Memory / Eval / Workflow` 六层 Taxonomy。

## 2. 动态推导方法

对选中 route 依次回答：

1. 数据从哪里来，格式、时点和身份如何统一？
2. 哪些能力应暴露为 CLI、MCP Tool 或 API？
3. Agent 需要什么 Domain Schema、知识与 Case Memory？
4. 业务 SOP 如何拆成可执行步骤，哪些步骤需要 Tool Calling？
5. 哪些动作可自动执行，哪些进入 `APPROVAL`，哪些必须 `BLOCKED`？
6. Trace 要记录哪些输入、工具调用、证据、决策和状态？
7. 哪些 Failure Mode 应进入 Gold/Bad/Ambiguous Dataset？
8. Benchmark 和 Regression Gate 判断什么失败？
9. 是否需要只读 Reviewer；它能驳回什么、不能执行什么？

每个答案都必须落到具体 Artifact。若只有行业名变化、没有新增 Schema、Tool、Workflow、Memory 或 Eval 产物，则判定为“场景换皮”，不得生成新的场景经历。

## 3. 基座与场景层连接

场景 Artifact 可以复用基座的 Harness、Runtime、Memory、权限或事件能力，但必须分别记录：

- `base_dependency`：依赖哪个 R/H/RT 点；
- `scenario_increment`：新增了什么 Adapter、Schema、SOP、Dataset 或 Reviewer；
- `artifact_status`：增量是已实现、原型、场景扩展还是纯设计；
- `scope_boundary`：不能把场景增量反写成基座原生能力。

每条被宣称为场景新增能力的 Bullet 都应包含一个可指认的场景增量 Artifact。纯基座 Bullet 可以保留，但不能通过替换行业词伪装成场景增量。

## 4. 金融 Research Agent

### 业务链路

```text
Research Task → Research Questions → Source Plan → 多源检索
→ Cross Check → 计算复现 → Evidence Chain → Thesis Draft → Review
```

### 候选 Artifact

| Agent 层 | 候选 Artifact | 关键字段/行为 |
| --- | --- | --- |
| External Knowledge | 财报、公告、电话会、新闻、研报、产业/历史/同业/宏观 Adapter；统一 CLI 命令或 MCP Tools | `source_id`、`published_at`、`retrieved_at`、`period`、`entity_id`、`retrieval_status` |
| Memory | Claim–Evidence–Source–Timestamp Schema；Research Case Memory | Claim 与正反证据、口径、期间、计算输入输出关联 |
| Workflow | Research Domain Skill / SOP | 问题拆解、来源规划、交叉验证、计算、论点草稿、补证 |
| Eval | Trace Schema、Research Dataset、Trace Benchmark、Regression Gate | Evidence Coverage、Source Freshness、Contradiction Detection、Calculation Reproducibility |
| Eval | 只读 Reviewer | 核查反向证据、来源时点、期间/口径；只能驳回和要求补证，权限动作归 Workflow |

### Failure Mode

财报重述、期间错配、统计口径冲突、来源滞后、重复新闻、实体歧义、数据修订、时间戳缺失、计算不可复现、正反证据不对称。每类可构造 positive / negative / ambiguous case。

### 权限边界

资料检索与计算可自动；研究摘要和投资备忘录只能自动生成草稿；正式发布、外部分发和任何交易执行需要人工授权，且默认不由该 Agent 直接执行。

默认状态：未提供额外实现材料时，金融 Adapter、知识 Schema、Domain Skill、Dataset、Benchmark、Reviewer 均为 `Scenario Extension` 或 `Design-only`，不能写成生产落地。

## 5. 电商 / 零售经营决策 Agent

### 业务链路

```text
Monitor → Detect → Investigate → Decide → Act → Review
```

价格只是子流程；完整场景同时考虑商品、SKU、促销、库存、销售、广告和经营约束。

### 候选 Artifact

| Agent 层 | 候选 Artifact | 关键字段/行为 |
| --- | --- | --- |
| External Knowledge | BI、ERP、商品、SKU、库存、销售、价格、促销、广告 Adapter；CLI/MCP Tools | `sku_id`、规格、来源、时间窗、币种、促销状态、库存状态、异常状态 |
| Memory | 商品规则、毛利约束、历史处置 Case Memory | 决策条件、历史动作、结果与回滚信息 |
| Workflow | 经营决策 Domain Skill / SOP | 监控、异常识别、调查、方案比较、审批、处置 |
| Eval | Gold/Bad/Ambiguous Dataset、Trace Benchmark、Regression Gate | SKU Matching、Evidence Coverage、False Positive、Constraint Violation、Action Safety |
| Eval | 只读 Reviewer | 核查促销解释、SKU 一致性、数据时效、库存销量、毛利与权限冲突，权限动作归 Workflow |

### Failure Mode

促销券/满减叠加、多规格、组合装、赠品、会员价、平台补贴、延迟数据、无货价格、SKU 错配、异常销量、毛利约束冲突。每类可构造 positive / negative / ambiguous case。

### 权限边界

查询与分析可自动；经营建议为草稿；改价、调预算、补货、下架或对外通知进入 `APPROVAL`；删除数据等不可逆动作默认 `BLOCKED`。Reviewer 只有否决和要求补查的权限。

默认状态：未提供额外实现材料时，业务系统 Adapter、Domain Skill、Case Memory、Dataset、Benchmark、Reviewer 均为 `Scenario Extension` 或 `Design-only`。

## 6. 其他行业 Route

从 `multi-industry-agent-scenario-library.md` 只读取已确认 route 的段落，然后按本文件第 2 节推导 Artifact。场景库提供业务素材，不预先证明实现状态。每份简历只绑定一个 route；批量生成时每个 route 单独建立 Project Model、Claim Ledger 和审查结果。

## 7. Craft Agents 连接规则

- 优先承接：AgentBackend/BaseAgent Harness（R03/R04）、Permission Mode 与 PreToolUse（R06/R27）、System Prompt 与上下文发现（R11）、SessionToolContext/MCP ServerBuilder（R17/R18）、进程外 Pi Agent Server（R21）、AgentEvent 与行为评测（R10/R25）、spawn_session 子代理（H04）。
- Craft 自带的是统一接入和工具治理框架，不等于已经实现财报、ERP、广告等业务 Tool；业务 Adapter 必须作为独立 Artifact 标状态。
- 原生消息网关仅 Telegram、Lark/飞书、WhatsApp；钉钉、企业微信、Slack 需要外部桥接，自研适配不得写成已实现。
- 文件系统 Workspace 隔离不是 SaaS 多租户数据库行级隔离。
- Electron UI、通用 IPC/WebSocket、构建分发默认是 ordinary infra，除非能证明它直接承载 Agent 权限、工具事件或运行时控制。
- R25 可证明事件契约和行为回归基础；LLM-as-Judge、行业 Dataset 与 Benchmark 若无实现证据，必须作为新 Artifact 标记状态。

## 8. 竞争力与输出检查

优先选择可展示 MCP/CLI、Tool Calling、Context Engineering、Agent Runtime、Memory、Agent Eval、Trace Benchmark、Domain Workflow 的 Artifact。输出前检查：

- 场景增量是否真实存在于 Artifact Inventory；
- 黑体摘要是否直陈技术或 Artifact；
- 每条是否有代码、Schema、Trace、Test 或设计材料作为面试入口；
- 场景扩展是否使用了与状态一致的动词；
- Coverage 缺口是否被如实暴露而非补造；
- 最终简历是否移除了内部点号、层级、route 和状态标签。
