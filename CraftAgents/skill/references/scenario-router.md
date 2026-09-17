# Industry Agent 场景选择器与路由规范

> 本文件是场景模式的轻量路由层。它负责“先选行业族，再选具体任务”，不把全部行业场景一次性展示给用户。具体场景的完整说明见 `multi-industry-agent-scenario-library.md`；只有用户确认的 route 才读取对应段落。

## 1. 交互目标

场景模式不能一开始把 20+ 个场景全部丢给用户。使用渐进式选择：

```text
JD / 公司背景
    ↓
行业族推荐（最多 1 个推荐 + 2 个备选）
    ↓
具体任务选择（最多 5 个候选）
    ↓
数据源 / 风险 / 自动化边界确认
    ↓
Industry Agent Route
    ↓
只加载选中的场景资料 + 对应项目 Skill
```

如果 JD 已经明确行业和任务，直接生成推荐卡，请用户确认，不再展示完整菜单。如果用户没有 JD，也没有行业偏好，才展示下面的一级菜单。

## 2. 一级行业族菜单

首次展示只显示以下 6 项，并允许用户回复编号或名称：

| ID | 行业族 | 适合的问题类型 | 二级候选示例 |
| --- | --- | --- | --- |
| F1 | 制造与工业 | 设备、质量、排产、工艺 | 故障诊断 / 质量调查 / 排产异常 / 工艺优化 |
| F2 | 供应链与物流 | 采购、供应商、仓储、履约 | 采购异常 / 供应商风险 / 异常履约 |
| F3 | 金融与财务 | 企业研究、费用、月结 | Research / 费用异常 / 月结调查 |
| F4 | 风险、合规与生命科学 | 安全、养殖、医药、法务 | EHS / 养殖合规 / CAPA / 合同审查 |
| F5 | 互联网与软件 | 线上故障、客户问题 | Incident / B2B 客户问题调查 |
| F6 | 商业增长与组织 | 电商、广告、市场、品牌、销售、人力 | 经营决策 / 投放诊断 / 竞品情报 / 招聘辅助 |

金融 Research Agent 与电商 / 零售经营决策 Agent 是当前的**快速入口**，分别对应 F3 和 F6；它们不是对其他行业的排他限制。

一级菜单的固定文案建议：

```text
你想把项目对齐到哪类业务？先选一个行业族即可：
1. 制造与工业：设备、质量、排产、工艺
2. 供应链与物流：采购、供应商、仓储、履约
3. 金融与财务：企业研究、费用、月结
4. 风险、合规与生命科学：安全、养殖、医药、法务
5. 互联网与软件：线上故障、客户问题
6. 商业增长与组织：电商、广告、市场、品牌、销售、人力
也可以直接说“按 JD 自动推荐”。
```

## 3. 二级场景目录

二级菜单只展示所选行业族的候选，不展示其他行业族。`route_id` 是后续装配和 Claim Ledger 的稳定标识。

### F1 制造与工业

| route_id | 场景 | 核心闭环 |
| --- | --- | --- |
| `manufacturing-equipment-diagnosis` | 设备故障诊断 Agent | 报警 → 状态/参数 → 历史 Case → Root Cause → Reviewer → 维修建议 |
| `manufacturing-quality-investigation` | 质量异常调查 Agent | 不良 → 批次/设备/原料 → 正常批次对比 → Root Cause → CAPA |
| `manufacturing-production-scheduling` | 生产计划异常调度 Agent | 订单/故障 → 产能/物料 → 多方案 → 延期风险 → Approval → 写入计划 |
| `manufacturing-process-optimization` | 工艺参数优化 Agent | 良率下降 → 参数漂移 → 历史实验 → 候选方案 → 仿真/人工确认 |

### F2 供应链与物流

| route_id | 场景 | 核心闭环 |
| --- | --- | --- |
| `supply-procurement-anomaly` | 采购异常 Agent | 需求 → 库存/历史价/报价/交期 → 异常 → 替代供应商 → 建议 |
| `supply-supplier-risk` | 供应商风险调查 Agent | 供应商 → 交付/质量/价格/投诉 → 外部调查 → Risk Score → Evidence Report |
| `logistics-fulfillment-investigation` | 异常履约调查 Agent | 订单异常 → 仓储/物流节点 → 异常定位 → 历史 Case → 处置建议 |

### F3 金融与财务

| route_id | 场景 | 核心闭环 |
| --- | --- | --- |
| `finance-research` | 金融 Research Agent（快速入口） | Research Task → Questions → 多源检索 → Cross Check → 计算 → Evidence → Thesis |
| `finance-expense-anomaly` | 报销 / 费用异常 Agent | 报销 → 发票/合同/PO/政策 → 异常判断 → Reviewer → 审核建议 |
| `finance-month-end-close` | 月结调查 Agent | 对账差异 → Drill Down → 原始交易 → 跨系统核对 → 调整建议 |

### F4 风险、合规与生命科学

| route_id | 场景 | 核心闭环 |
| --- | --- | --- |
| `ehs-safety-audit` | EHS 安全生产审查 Agent | 日常数据 → 异常 → 规范比对 → 交叉验证 → Reviewer → 风险报告 |
| `agriculture-farm-compliance` | 养殖场合规与异常审查 Agent | 用药/防疫/死亡率/环境 → 关联检查 → 对抗复核 → 风险报告 |
| `pharma-deviation-capa` | 医药偏差调查 / CAPA Agent | Deviation → Batch/设备/人员/环境 → 历史 Case → Root Cause → CAPA |
| `legal-contract-review` | 合同异常审查 Agent | 合同 → 主体/金额/责任/条款 → 模板/法规对比 → Reviewer → Risk Report |

### F5 互联网与软件

| route_id | 场景 | 核心闭环 |
| --- | --- | --- |
| `internet-incident-response` | 线上故障 Incident Agent | Alert → Metrics/Logs/Trace → Deployment/Git → 历史 Incident → Mitigation |
| `internet-customer-investigation` | B2B 客户问题调查 Agent | Ticket → 客户/配置/日志/DB → 历史 Case → Root Cause → Response Draft |

### F6 商业增长与组织

| route_id | 场景 | 核心闭环 |
| --- | --- | --- |
| `ecommerce-operations` | 电商 / 零售经营决策 Agent（快速入口） | Monitor → Detect → Investigate → Decide → Act |
| `ecommerce-price-decision` | 电商价格 / 促销决策子场景 | 价格/促销 → SKU/规格核验 → 历史/毛利 → 建议 → Approval |
| `advertising-diagnosis` | 广告投放异常诊断 Agent | ROI 下降 → Campaign/人群/素材/商品/落地页 → Root Cause → Action |
| `market-competitor-intelligence` | 市场竞品情报 Agent | 竞品 → 产品/内容/价格/Campaign → 历史变化 → Insight |
| `brand-crisis-investigation` | 品牌舆情危机调查 Agent | 异常舆情 → 来源/传播/观点 → 历史事件 → 风险等级 → Response |
| `sales-account-intelligence` | 销售 Account Intelligence Agent | Account → 互动/机会/风险/关键人 → Next Best Action |
| `hr-recruiting-assistant` | 招聘筛选与面试辅助 Agent | JD → 能力要求 → 简历证据 → 追问 → 面试证据 → Candidate Report |

## 4. 路由判定规则

1. **先看用户明确选择**：用户指定行业族或 `route_id` 时，不重新推断、不混入其他场景。
2. **再看 JD 强信号**：行业名、业务系统、数据源和 SOP 动词共同决定路由；单个关键词不足以切换行业。
3. **输出推荐而不是强行决定**：有 JD 时给出 `推荐 route + 依据 + 两个近邻备选`，等待用户确认；用户明确要求自动生成时才直接确认推荐路由。
4. **最多展示 5 个二级候选**：候选过多时，按 JD 相关度排序，其余只显示“还有更多，可输入行业/任务名搜索”。
5. **一个简历只绑定一个 route**：不能把金融 Research 和电商经营放进同一份场景化项目条目；批量生成时才显式建立多个 route。
6. **优先选择调查/决策型任务**：如果用户只说“做一个行业 Agent”，优先推荐有明确数据源、SOP、权限和 Benchmark 的 route，而不是泛化成聊天机器人。
7. **场景资料按需加载**：`finance-research` 与 `ecommerce-operations` 是快速入口，直接读取 `scenario-architecture.md` 的对应完整章节；其他 route 再按下方 route-to-section 索引读取 `multi-industry-agent-scenario-library.md` 的一个段落。禁止默认加载全库。

### route-to-section 索引

`manufacturing-equipment-diagnosis→01`、`manufacturing-quality-investigation→02`、`manufacturing-production-scheduling→03`、`manufacturing-process-optimization→04`、`supply-procurement-anomaly→05`、`supply-supplier-risk→06`、`logistics-fulfillment-investigation→07`、`ehs-safety-audit→08`、`agriculture-farm-compliance→09`、`pharma-deviation-capa→10`、`legal-contract-review→11`、`finance-expense-anomaly→12`、`finance-month-end-close→13`、`internet-incident-response→14`、`internet-customer-investigation→15`、`advertising-diagnosis→16`、`market-competitor-intelligence→17`、`brand-crisis-investigation→18`、`sales-account-intelligence→19`、`hr-recruiting-assistant→20`。

`ecommerce-price-decision` 是 `ecommerce-operations` 的价格/促销子流程，读取 `scenario-architecture.md` 的电商章节并收窄到该子流程；不能反过来把整个电商经营 Agent 缩成价格采集器。

## 5. Route Card 输出契约

选定后先输出一张短 Route Card，再进入简历生成：

```yaml
route_id: finance-research
industry_family: F3
industry_agent: 金融 Research Agent
base_project: miniclaw | craft-agents
business_problem: 结论需要跨多源搜集、交叉验证并可追溯
data_sources: [财报, 公告, 电话会, 新闻, 研报, 产业数据, 历史数据, 竞争对手, 宏观数据]
connector_plan: CLI / MCP / API + source + timestamp + retrieval_status
knowledge_model: Claim-Evidence-Source-Timestamp + Case Memory
sop: Research Task → Questions → Search → Cross Check → Calculate → Evidence → Thesis
permission_boundary: 研究与草稿自动；正式发布/交易执行需审批，Agent 不直接交易
reviewer_focus: 反向证据、来源时点、口径一致性、计算可复现
benchmark_focus: Evidence Coverage / Source Freshness / Contradiction Detection
selection_status: confirmed
```

Route Card 的字段必须根据所选场景替换，不得把金融字段复制给电商或制造场景。它是后续 Artifact Inventory、候选 Bullet、Claim Ledger 和面试追问的共同输入。

Route Card 只描述业务需求，不证明工程实现。确认 route 后，必须按 `scenario-architecture.md` 动态生成 Artifact Inventory，并为每个候选项补充：

```yaml
base_dependency: [R/H/RT 支撑点]
scenario_increment: 新增的 Adapter / Schema / Skill / Dataset / Eval 等 Artifact
artifact_status: Implemented | Prototype | Scenario Extension | Design-only
ownership: owner | participated | collaborated | unknown
evidence: [源码, Schema, Trace, Test, 设计文档, 用户确认]
scope_boundary: 不允许声称的能力
```

Artifact 完成门控后才进入 Claim Ledger 和候选 Bullet；Route Card 本身不能作为“已实现”的证据。

## 6. “不知道选什么”的默认策略

- 有 JD：自动识别行业族，展示 1 个推荐 + 最多 2 个近邻备选。
- 只有行业：展示该行业族的二级菜单，默认推荐第一个调查/决策型场景。
- 只有目标岗位：按岗位职责映射行业族，并明确“这是基于 JD 缺失信息的合理假设”。
- 完全没有上下文：展示 6 项一级菜单，只问一个选择问题，不开始生成简历。
- 用户要求批量比较：允许显式选择多个 `route_id`，但每个 route 单独生成项目条目、Claim Ledger 和审查结果。
