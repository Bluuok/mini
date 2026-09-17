# 多行业 Agent 落地场景库

统一架构：

```text
Data Source
→ CLI / MCP / API
→ Enterprise Knowledge
→ SOP Skill
→ Agent Workflow
→ Permission / Review
→ Trace
→ Gold / Bad Case
→ Benchmark
```

---

## 01｜制造业：设备故障诊断 Agent

**解决什么**

设备报警以后，工程师需要查 PLC、设备日志、维修手册、历史故障，再判断原因。

**数据源**

```text
PLC / SCADA
设备日志
MES
维修工单
设备说明书
历史故障 Case
```

**接入**

```text
SCADA / MES → MCP
设备 CLI / 日志 → CLI Tool
说明书 / 工单 → Knowledge
```

**SOP**

```text
报警
→ 查询设备状态
→ 获取异常参数
→ 检索历史 Case
→ 执行诊断指令
→ Root Cause
→ Reviewer 验证
→ 维修建议
```

**Knowledge**

设备拓扑、报警码、维修手册、故障 Case、正常参数区间。

**Benchmark**

测试：

```text
传感器异常
机械故障
电气故障
假报警
多个故障同时发生
历史 Case 相似但根因不同
```

指标：

Root Cause Accuracy / Tool Selection / Evidence Coverage / False Diagnosis Rate。

---

## 02｜制造业：质量异常调查 Agent

**解决什么**

产品出现不良后，质量工程师需要跨 MES、工艺参数、批次、原料、设备调查。

**数据源**

```text
MES
QMS
工艺参数
检测设备
原料批次
供应商记录
历史 NCR / CAPA
```

**SOP**

```text
质量异常
→ 定位批次
→ 查询设备
→ 查询原料
→ 对比正常批次
→ 识别异常参数
→ 历史 Case 检索
→ Root Cause 候选
→ CAPA 建议
```

**Agent 形态**

Investigation Agent + Quality Reviewer。

**Benchmark**

构造：

正常波动、原料异常、设备漂移、操作员问题、多因素耦合、数据缺失。

重点测：

```text
异常定位率
错误归因率
Evidence Completeness
Root Cause Top-K Recall
```

---

## 03｜制造业：生产计划异常调度 Agent

**解决什么**

订单变化、设备故障、物料短缺时，人工计划需要重新排产。

**数据源**

ERP、MES、WMS、订单、BOM、库存、设备状态、人员班次。

**SOP**

```text
订单变化 / 故障
→ 查询产能
→ 查询物料
→ 查询库存
→ 查询设备
→ 生成多个排产方案
→ 计算延期风险
→ 人工审批
→ 写入排产系统
```

**权限**

读取自动。

排产建议自动。

修改正式计划必须 Approval。

**Benchmark**

测试：

急单插入、设备宕机、关键物料短缺、多订单冲突。

指标：

On-time Rate / Constraint Violation / Plan Stability / Tool Correctness。

---

## 04｜制造业：工艺参数优化 Agent

**解决什么**

工程师需要不断根据良率调整温度、压力、速度、时间等参数。

**数据源**

MES、PLC、传感器、实验数据、良率、设备历史参数。

**SOP**

```text
良率下降
→ 对比历史批次
→ 找相关参数
→ 分析参数漂移
→ 检索成功 Case
→ 给出候选调整方案
→ 仿真 / 验证
→ 人工确认
```

**Knowledge**

工艺窗口、禁止调整范围、设备限制、历史实验结果。

**Benchmark**

重点测试参数边界和错误建议。

不以“文案质量”为指标，而看：

```text
Constraint Satisfaction
Yield Prediction
Unsafe Recommendation Rate
```

---

## 05｜供应链：采购异常 Agent

**解决什么**

采购员每天需要判断价格上涨、供应商交期、库存和替代供应商。

**数据源**

ERP、采购订单、供应商报价、库存、历史采购价、市场价格。

**SOP**

```text
采购需求
→ 查询库存
→ 查询历史采购价
→ 对比供应商报价
→ 查询交期
→ 识别价格异常
→ 查替代供应商
→ 给出采购建议
```

**Agent Tools**

供应商门户无 API：

```text
CLI / Browser Adapter
```

内部 ERP：

```text
MCP
```

**Benchmark**

价格异常识别、供应商选择、交期风险、替代料推荐。

---

## 06｜供应链：供应商风险调查 Agent

**解决什么**

供应商出问题以前，企业通常只能靠人工复盘。

**数据源**

采购记录、质量记录、交付记录、投诉、公开工商信息、舆情。

**SOP**

```text
Supplier
→ 交付分析
→ 质量分析
→ 价格异常
→ 历史投诉
→ 外部风险调查
→ Risk Score
→ Evidence Report
```

**Reviewer**

专门检查：

```text
是否证据不足
是否把一次异常当长期趋势
是否存在数据时间偏差
```

**Benchmark**

供应商真实历史事件回放。

指标：

Risk Recall / False Alarm / Evidence Groundedness。

---

## 07｜仓储物流：异常履约调查 Agent

**解决什么**

物流延迟、丢件、库存不一致，需要人工跨多个系统调查。

**数据源**

WMS、TMS、快递平台、GPS、订单、仓库扫描记录。

**SOP**

```text
订单异常
→ 查询订单
→ 查询仓库出库
→ 查询物流
→ 查询扫描节点
→ 判断异常节点
→ 历史 Case
→ 给出处置建议
```

**CLI**

如果快递后台无统一 API：

```text
logistics-cli track
logistics-cli exception
```

**Benchmark**

漏扫、延迟、地址错误、仓库未出库、物流丢失等 Case。

---

## 08｜EHS：安全生产审查 Agent

**解决什么**

工厂安全巡检往往大量依赖人工表格和抽检。

**数据源**

巡检记录、设备报警、IoT、视频事件、工单、培训记录、事故记录。

**SOP**

```text
每日数据
→ 检查异常
→ 交叉验证
→ 对照安全规范
→ 找到违规项
→ Reviewer 反向验证
→ 风险报告
```

**典型对抗式问题**

```text
巡检记录是否补录？
设备报警后是否真实处置？
培训人员是否覆盖该班组？
```

**Benchmark**

历史安全事故前的数据回放。

评测：

Risk Detection Recall / False Positive / Evidence Chain。

---

## 09｜养殖业：养殖场合规与异常审查 Agent

这是非常吸引人的非传统案例。

**解决什么**

养殖场存在：

用药、防疫、死亡率、饲料、库存、环境参数等大量交叉数据。

**数据源**

```text
IoT 温湿度
饲料记录
兽药采购
兽药使用
死亡记录
防疫记录
库存
视频事件
```

**SOP**

```text
每日数据
→ 交叉检查库存与用药
→ 检查死亡率
→ 对比环境变化
→ 检查防疫记录
→ 找异常关联
→ Adversarial Review
→ 风险报告
```

**Knowledge**

兽药规范、防疫 SOP、正常死亡率区间、养殖周期规则。

**Benchmark**

故意构造：

```text
库存对不上
补录防疫记录
异常死亡率
超量用药
环境恶化但未报警
```

特别适合作为“对抗式 Agent 审查”案例。

---

## 10｜医药：偏差调查 / CAPA Agent

**解决什么**

药企出现偏差后，需要调查设备、人员、批次、SOP、环境、原料。

**数据源**

QMS、LIMS、MES、SOP、设备日志、人员培训记录、批次记录。

**SOP**

```text
Deviation
→ Batch
→ Equipment
→ Material
→ Operator
→ Environment
→ SOP
→ Historical Deviation
→ Root Cause
→ CAPA
```

**权限**

Agent 可以调查和生成 CAPA 草案。

不能自动关闭偏差。

**Benchmark**

历史偏差 Case 回放。

测：

Root Cause Coverage / Missing Evidence / Wrong CAPA / Hallucination。

---

## 11｜法务：合同异常审查 Agent

**数据源**

合同、标准条款库、客户资料、历史合同、法规。

**SOP**

```text
合同解析
→ 主体
→ 金额
→ 付款
→ 责任
→ 违约
→ 数据条款
→ 历史模板对比
→ Reviewer
→ Risk Report
```

**Benchmark**

故意放入：

隐藏责任、条款冲突、异常付款、主体错误、标准模板偏离。

---

## 12｜财务：报销 / 费用异常 Agent

**解决什么**

财务审核大量时间花在低价值单据检查。

**数据源**

ERP、报销系统、发票、合同、采购订单、差旅记录。

**SOP**

```text
报销
→ 发票
→ 合同
→ PO
→ 金额
→ 时间
→ 人员
→ 政策
→ 异常判断
```

**Reviewer**

寻找：

重复报销、拆单、虚假发票、超预算、跨项目报销。

**Benchmark**

从历史审核 Case + 人工生成 Fraud Case 构建。

---

## 13｜财务：月结调查 Agent

**解决什么**

月结并不是简单算账，而是不断调查“为什么对不上”。

**数据源**

GL、AP、AR、银行流水、ERP、订单、发票。

**SOP**

```text
账目异常
→ 找差额
→ Drill Down
→ 找原始交易
→ 对比业务系统
→ 判断时间差 / 错账 / 漏账
→ 调整建议
```

**Benchmark**

构造：

跨期、重复、漏记、币种错误、内部交易。

---

## 14｜互联网公司：线上故障 Incident Agent

**解决什么**

服务出故障以后，需要工程师不断切 Grafana、日志、K8s、Git。

**数据源**

Logs、Metrics、Tracing、Git、CI/CD、Jira、Kubernetes。

**SOP**

```text
Alert
→ Metrics
→ Logs
→ Trace
→ Deployment
→ Git Diff
→ Historical Incident
→ Root Cause
→ Mitigation
```

**Tools**

天然适合 CLI：

```text
kubectl
git
docker
internal-cli
```

**Benchmark**

历史 Incident Replay。

指标：

MTTR、Root Cause Accuracy、Tool Calls、Unsafe Action Rate。

---

## 15｜互联网公司：客户问题调查 Agent

**解决什么**

B2B SaaS 客服经常需要研发协助调查客户问题。

**数据源**

CRM、工单、日志、数据库、用户配置、历史 Case。

**SOP**

```text
Ticket
→ 客户信息
→ 配置
→ Logs
→ DB
→ Historical Case
→ Root Cause
→ Response Draft
```

**权限**

生产数据库默认 Read Only。

任何修改需要 Approval。

**Benchmark**

从历史客服工单构建 Gold Trace。

---

## 16｜广告：投放异常诊断 Agent

**数据源**

广告平台、CRM、转化、商品、素材。

**SOP**

```text
ROI 下降
→ Campaign
→ Audience
→ Creative
→ CTR
→ CVR
→ Product
→ Landing Page
→ Root Cause
→ Action
```

**Benchmark**

素材疲劳、受众问题、商品缺货、落地页故障、归因异常。

---

## 17｜市场运营：竞品情报 Agent

**解决什么**

市场人员需要每天人工搜索竞品动态。

**数据源**

官网、公众号、小红书、微博、电商平台、新闻、广告库。

**CLI**

例如：

```text
xiaohongshu-cli
taobao-cli
weibo-cli
```

统一输出结构化数据。

**SOP**

```text
Competitor
→ 新产品
→ 新内容
→ 价格
→ Campaign
→ 用户反馈
→ 和历史变化对比
→ Insight
```

**Benchmark**

考察：

信息覆盖率、重复信息过滤、错误归因、时间准确性。

---

## 18｜品牌：舆情危机调查 Agent

**数据源**

微博、小红书、抖音、新闻、客服、评论。

**SOP**

```text
异常舆情
→ Source Tracking
→ 传播路径
→ 主要观点
→ 真实投诉 / 水军判断
→ 历史事件
→ 风险等级
→ Response Suggestion
```

**Reviewer**

专门检查：

```text
是否夸大风险
是否证据不足
是否错误引用用户观点
```

---

## 19｜销售：Account Intelligence Agent

**解决什么**

销售人员最大的问题不是没有 CRM，而是不知道“下一步该干什么”。

**数据源**

CRM、邮件、会议纪要、订单、合同、客服记录。

**SOP**

```text
Account
→ 最近互动
→ 业务变化
→ 当前 Opportunity
→ Risk
→ Stakeholder
→ Next Best Action
```

**Knowledge**

客户历史 Timeline 是核心。

**Benchmark**

历史销售机会回放：

Agent 是否正确判断：

```text
赢单
流失
延期
关键人变化
```

---

## 20｜人力：招聘筛选与面试辅助 Agent

**数据源**

JD、简历、面试记录、岗位能力模型、历史招聘数据。

**SOP**

```text
JD
→ Skill Requirement
→ Resume Evidence
→ Gap
→ Interview Questions
→ Interview Evidence
→ Candidate Report
```

**权限**

Agent 只提供辅助判断。

不自动做最终录用决策。

**Benchmark**

重点测试：

证据匹配、问题覆盖、虚构经历识别、判断一致性。

---

# 一个更实用的场景选择矩阵

如果目的是做作品、内部创新或者简历项目，可以优先挑下面这些：

| 场景             | Demo 吸引力 | 企业真实性 | Tool Calling | Knowledge | Benchmark价值 |
| -------------- | -------: | ----: | -----------: | --------: | ----------: |
| 设备故障诊断         |    ★★★★★ | ★★★★★ |        ★★★★★ |     ★★★★★ |       ★★★★★ |
| 质量异常调查         |    ★★★★★ | ★★★★★ |         ★★★★ |     ★★★★★ |       ★★★★★ |
| 生产排产           |     ★★★★ | ★★★★★ |        ★★★★★ |      ★★★★ |        ★★★★ |
| 安全生产审查         |    ★★★★★ | ★★★★★ |         ★★★★ |     ★★★★★ |       ★★★★★ |
| 养殖场审查          |    ★★★★★ |  ★★★★ |         ★★★★ |      ★★★★ |       ★★★★★ |
| 药企偏差调查         |    ★★★★★ | ★★★★★ |         ★★★★ |     ★★★★★ |       ★★★★★ |
| 采购异常           |     ★★★★ | ★★★★★ |        ★★★★★ |      ★★★★ |        ★★★★ |
| 电商价格监管         |    ★★★★★ | ★★★★★ |        ★★★★★ |      ★★★★ |       ★★★★★ |
| 广告诊断           |    ★★★★★ | ★★★★★ |        ★★★★★ |      ★★★★ |       ★★★★★ |
| Incident Agent |    ★★★★★ | ★★★★★ |        ★★★★★ |      ★★★★ |       ★★★★★ |
| 法务合同审查         |     ★★★★ | ★★★★★ |          ★★★ |     ★★★★★ |       ★★★★★ |
| 财务异常审核         |     ★★★★ | ★★★★★ |         ★★★★ |     ★★★★★ |       ★★★★★ |

如果只是为了挑出最有代表性的 **6 个 Industry Pack**，我会建议：

```text
E-commerce Price Agent
Manufacturing Diagnostic Agent
Quality Investigation Agent
EHS Adversarial Audit Agent
Advertising Optimization Agent
Pharma Deviation Agent
```

这六个放在一起，已经能很好地证明共享 Agent Base 不是只适合互联网场景。

它们虽然行业完全不同，但底层都可以复用：

```text
CLI / MCP
+
Enterprise Knowledge
+
SOP Skill
+
Agent Runtime
+
Reviewer
+
Permission Gate
+
Gold / Bad Case
+
Trace Benchmark
```

真正发生变化的只有：

```text
Data
Knowledge
Skill
Policy
Benchmark
```

本场景库提供的是业务 SOP 与 Artifact 推导素材，不代表任何 Artifact 已实现。使用时必须先经过 `agent-project-modeling.md` 的状态、Ownership、证据和 Scope 门控；不得把行业词替换当作新的工程经验。

这也正是 Industry Pack 应该承担的边界。
