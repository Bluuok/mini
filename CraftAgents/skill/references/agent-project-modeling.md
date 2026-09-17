# Agent Project Model：项目经验建模规范

本规范是简历生成前的强制中间层。它先把源码事实、用户参与事实与场景设想建模为可审计的工程 Artifact，再决定哪些内容适合进入简历。`resume-points.md` 是已知能力索引，不是生成上限。

## 1. 固定架构分类

每个候选 Artifact 必须归入一个主层；可以记录次层，但不能用多个层掩盖定位不清。

| `agent_layer` | 典型对象 | 核心判断 |
| --- | --- | --- |
| `External Knowledge` | Adapter、CLI、MCP、Schema、知识库 | Agent 如何可靠取得外部事实与工具能力 |
| `Harness` | Tool Calling、工具面裁剪、Context Engineering、任务规划、权限回调、子代理 | 模型如何被约束、赋能和编排；简历中通常拆成 2 条，必要时 3 条独立能力 |
| `Runtime` | Agent Loop、进程/容器、超时、资源、执行协议 | Agent 如何被执行、终止、恢复和隔离 |
| `Memory` | Session、长期记忆、Case Memory、状态恢复 | 跨轮次与跨任务状态如何保存和检索 |
| `Eval` | Trace、Dataset、Benchmark、Regression Gate、Reviewer | 如何发现失败、复现行为并阻断回归 |
| `Workflow` | Domain Skill、SOP、任务分解、审批、处置闭环 | Agent 如何完成具体业务任务并守住权限边界 |

普通认证、CRUD、IPC、WebSocket、Electron 壳、构建流水线默认标为 `ordinary_infra`。只有能明确说明它直接承载 Tool Calling、Agent Loop、Runtime 隔离、状态恢复或 Eval Trace 时，才可标为 `agent_supporting` 或 `agent_core`。

## 2. Artifact Inventory 字段

每个候选项至少记录：

```yaml
id: artifact-001
agent_layer: External Knowledge | Harness | Runtime | Memory | Eval | Workflow
core_concept: MCP / Tool Calling / Context Engineering / Agent Runtime / Memory / Agent Eval / ...
problem: 要解决的具体问题
implementation: 实际实现或拟议设计
artifact: 可指认的工程产物
artifact_evidence: 源码路径、Schema、CLI 输出、Trace、Test、设计文档或用户确认
effect: 可验证对象或目标，不补造指标
ownership: owner | participated | collaborated | unknown
artifact_status: Implemented | Prototype | Scenario Extension | Design-only
scenario: base | route_id
project_source: 项目事实来源或推导依据
scope_boundary: 不能声称的能力
interview_artifact: 面试时可展示或讲解的代码、Schema、Trace、Test
agent_relevance: agent_core | agent_supporting | ordinary_infra
```

使用 `assets/agent-project-model-template.json` 作为可导出的结构；生成后运行 `scripts/validate_agent_project_model.py`，最终与 Claim 一起运行 `scripts/validate_resume_package.py`。后者交叉检查状态动词、Ownership、Artifact 引用、普通 Infra 和可贴区内部标记。验证器不能替代用户对真实经历的确认。

## 3. Artifact 状态与动词

| 状态 | 需要的证据 | 简历允许的措辞 |
| --- | --- | --- |
| `Implemented` | 源码、测试、交付材料或明确用户证明 | 实现、构建、落地；“上线/生产”仍需生产证据 |
| `Prototype` | 可运行原型、局部链路或实验结果 | 搭建原型、验证、打通局部链路 |
| `Scenario Extension` | 有明确基座依赖、具体接口/Schema/流程和可执行验收方案的场景扩展 | 设计并扩展、定义契约；只有已有验证记录时才写“验证” |
| `Design-only` | 只有方向或设计，缺少可执行契约、原型或验证记录 | 设计、规划、提出方案 |

状态未知时按 `Design-only` 处理。`Scenario Extension` 至少要明确 `base_dependency + scenario_increment + interface/schema/workflow + acceptance plan`；缺一则降为 `Design-only`。`Scenario Extension` 和 `Design-only` 不得使用“实现、构建、开发、部署、交付、上线、投产、投入使用、业务提升、实际降低”等完成式措辞。`Implemented` 也不自动等于生产落地。

## 4. 生成顺序

### 4.1 事实抽取

分别记录四类事实，禁止混写：

1. 项目源码事实：项目确实具备什么。
2. 用户参与事实：用户亲自做了什么、参与程度如何。
3. 场景需求事实：JD 或业务 SOP 需要什么。
4. 推导性设计：为了补齐场景而提出的新 Artifact。

### 4.2 Architecture Mapping

把源码能力和旧 R/H/RT/S 点映射到六层 Taxonomy。点号只作为证据索引，不决定最终叙事。一个普通 Infra 点若不能回答“它具体支撑了哪个 Agent 行为”，降到补充经历或审计区。

### 4.3 能力缺口分析

先看目标岗位和场景需要哪些层，再比较项目已有能力。输出：

- 已有且有证据；
- 已有但用户 Ownership 待确认；
- 可由现有基座扩展；
- 纯设计缺口；
- 与岗位无关。

缺口分析不是补齐清单。不存在的能力不得为了 Coverage 而虚构。

### 4.4 动态场景 Artifact 推导

场景模式从业务 SOP 反推工程产物，至少检查以下候选类别，但只保留对当前 route 有意义的项：

- Adapter / CLI / MCP Server 或 Tool；
- Domain JSON Schema、来源与时间戳协议；
- Knowledge Base、Case Memory；
- Domain Skill / SOP、权限状态与人工审批；
- Trace Schema、Gold/Bad/Ambiguous Dataset；
- Agent Eval、Trace Benchmark、Regression Gate；
- 只读 Reviewer 或对抗复核机制。

先生成 Artifact Inventory，再与基座能力连接。不得只替换行业名或把通用 Tool Registry 攵称“金融/电商工具面”。

### 4.5 状态、Ownership 与证据门控

每个 Artifact 分别判断：

- 项目是否实现；
- 用户是否参与；
- 是否可展示代码、Schema、Trace 或 Test；
- 是否只有目标/预计效果；
- 哪些生产、指标、Owner 表述被禁止。

项目源码只能证明项目能力，不能证明用户个人 Ownership。用户选择某点表示愿意承担面试解释责任，但精确指标仍需独立来源。

### 4.6 Coverage Check

对最终至少 4 条候选 Bullet 检查以下能力面；4 条是下限，不是要求所有项目固定同数：

- Knowledge / Tool 接入；
- Harness：至少覆盖 2 条独立表达，优先分别检查 Tool Calling / 工具面、Context Engineering / 任务规划；有证据时可加入权限拦截、审批恢复或子代理编排第 3 条；
- Runtime 或 Memory；
- Eval；
- 场景 Workflow（仅场景模式强相关）。

输出 `covered / weak / absent / not_applicable`。Coverage 用于发现叙事缺口，不要求强行覆盖六层。基础模式没有领域 Workflow 时可标 `not_applicable`。

### 4.7 竞争力排序

按以下顺序综合排序，不用句式正则代替判断：

1. 与目标 Agent 岗的核心能力命中度；
2. 工程 Artifact 的具体程度；
3. 技术辨识度；
4. 证据与 Ownership 强度；
5. 与同类候选人的差异化；
6. Bullet 之间的能力覆盖与去重。

`ordinary_infra` 默认不能占核心 Bullet；只有目标岗位明确需要，或它是 Agent 主链不可替代的承重能力时才进入。

## 5. Claim-Evidence 衔接

Artifact Inventory 完成后，才为候选 Bullet 建 Claim：

```text
Artifact → 状态/Ownership/证据 → Claim → 简历措辞 → 面试验证
```

Claim 必须引用 Artifact ID，并继续绑定 R/H/RT/S 与 W/Q 证据。Artifact 描述“工程产物是什么”，Claim 描述“候选人准备承担什么具体主张”。两者不可互相替代。

## 6. Bullet 写作与验收

黑体摘要优先直接暴露招聘者可识别的技术或 Artifact，例如：

- `MCP / CLI 数据接入`
- `Agent Harness 与 Tool Calling`
- `Agent Runtime 隔离`
- `Context Engineering`
- `Case Memory`
- `Agent Eval / Trace Benchmark`

MCP Server、Adapter 和外部工具契约的实现归 `External Knowledge`；工具如何选择、披露、调用、拦截和回传归 `Harness`。同一 Artifact 只选一个主层，避免重复计分。

正文必须在自然语言中交代问题、实现、Artifact 与效果；不要求机械重复固定连接词。建议形态：

```text
**[核心概念 / Artifact]** 针对[具体问题]，基于[技术与实现]构建/验证/设计[Artifact]，[可验证效果或目标]。
```

每条进入核心简历前必须回答：

1. 属于 Agent Architecture 哪一层？
2. 黑体能否看出核心技术？
3. 具体 Artifact 是什么？
4. 是否只是普通后端能力？
5. 面试时能展示什么？
6. 状态、Ownership 和边界是什么？

任一关键答案为空，转入待确认或审计区。

### 6.1 STAR 验收

每条 Bullet 必须由黑体摘要和一段连续自然语言的完整 STAR 支撑：S 是触发情境，T 是候选人目标，A 是具体工程行动与 Artifact，R 是可验证结果。简历区不得打印 `S/T/A/R` 标签或拆段；场景状态、Ownership 和 Claim 边界统一放在后续审计区。详细规则见 `references/star-bullet-writing.md`。

## 7. Evidence Navigation

编号不能脱离路径单独出现。完整输出包必须增加 `Evidence Navigation`，将 `R/H/RT/S/W/Q`、`Axx`、`artifact-*`、`claim-*` 映射到：当前输出章节、Skill-relative 参考文件、Workspace-relative 路径、Project-relative 源码路径，以及具体表格行/章节。

用户只给出不完整编号（例如“401”“101”“那个 01”）时，先检索当前输出包和 references；存在多个候选就列出候选，不得猜测前缀。

## 8. 输出包

一次完整 Resume/Scenario 生成目标包含：

1. 干净的可贴简历区：项目名、一句话简介、至少 4 条按证据选择且逐条符合 STAR 的 Bullet；不单列技术栈字段，技术名只在解释核心 Agent 能力时写入正文；场景状态和 Claim 缺口不写进 Bullet，统一放在审计区；
2. Agent Architecture Mapping；
3. Artifact Inventory；
4. Coverage Check；
5. Evidence Navigation；
6. Claim / Evidence / Ownership 审计；
7. 场景扩展与项目原生能力边界；
8. 待用户确认的问题与可降级措辞。

可贴简历区不得出现 R/H/RT/S、L0–L4、掌握度标签、route_id、Claim ID、Artifact 状态或审计术语。
