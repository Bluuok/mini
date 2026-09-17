---
name: craft-agents-resume-skill
description: Model Craft Agents engineering experience from source evidence, derive scenario-specific Artifacts for a target JD or industry, gate claims by implementation status and ownership, and generate competitive resume bullets plus interview preparation. Use for Craft Agents resume projects, finance/ecommerce or other Industry Agent positioning, claim verification, project stories, interview Q&A, and source-backed technical deep dives.
---

# Craft Agents Resume Skill

## Operating Modes

- **Resume**：无特定行业时，生成基于项目事实的 Agent 工程项目经历。
- **Scenario**：有 JD、公司背景或行业任务时，生成该 route 的 Industry Agent 版本。
- **Q&A Prediction**：预测与 Bullet、JD 和薄弱证据对应的面试追问。
- **Grill / Review / Retry**：逐题模拟、复盘并把验证结果反馈到 Claim。
- **Story**：把选定 Claim 展开为项目事实卡、架构、STAR/CAR 与追问树。
- **Full Flow**：Scenario → Resume → Q&A → 对抗审查。

如果用户只要求生成简历，不要强迫其先完成模拟面试。缺少高影响背景时读取 `references/user-intake.md`，只询问会改变真实性、Ownership、岗位方向或风险等级的信息。

## Mandatory Generation Core

Resume、Scenario 和 Full Flow 必须先读 `references/agent-project-modeling.md`，并按下面顺序工作：

```text
源码 / 用户材料 / 旧要点库
→ 事实抽取
→ Agent Architecture Mapping
→ 能力缺口分析
→ 场景 Artifact 推导（仅 Scenario）
→ Artifact 状态 + Ownership + Evidence + Scope Gate
→ Coverage Check + 竞争力排序
→ Claim-Evidence Ledger
→ Resume Positioning
→ 最终 Bullet
```

不得直接从 `resume-points.md` 抽 5 条后改写。R/H/RT/S 是证据索引，不是生成框架；Bullet 库是已知能力参考，不是场景生成上限。

## Reference Routing

只读取当前任务所需资料：

- 所有简历生成：`agent-project-modeling.md`、`claim-evidence-ledger.md`、`resume-points.md`。
- 编号、证据和文件定位：先读 `evidence-navigation.md`；凡是用户问“某个编号在哪”或输出要引用 `R/H/RT/S/W/Q/A/Claim` 时，必须给出对应文档、相对路径和章节/表格行。
- 岗位组合与风险降级：`combo-plans.md`、`harness-runtime-map.md`、`user-intake.md`。
- 场景选择：先读 `scenario-router.md`；route 确认后读 `scenario-architecture.md`，并只读取 `multi-industry-agent-scenario-library.md` 的对应段落。
- 面试预测：先读 `source-driven-qa.md`，再读 `interview-qa.md`；普通预测不加载完整源码。用户要求深入解释某道 QA、源码级追问或技术细节时，再按 `assets/source-manifest.json` 从 `references/craft-agents-oss-main.zip` 读取相关源码，并结合 `codewiki-index.md` 定位；模拟与复练再读 `interview-contract-and-session.md`、`question-and-scoring-contract.md`、`review-and-retry.md`。
- 源码深挖：先读取 `assets/source-manifest.json` 校验源码包，再用 `codewiki-index.md` 定位并读取中文技术手册或 DeepWiki 对应章节，最后用 ZIP/解压源码核验关键实现；SDK Harness 深挖使用 `pi-sdk-harness.md`。

不要为了普通简历生成加载全部技术手册或整个多行业库。

## Base Resume Workflow

1. 从项目资料与用户背景提取“项目事实、用户参与、结果证据、未知项”，四者分开记录。
2. 将候选能力映射到 `External Knowledge / Harness / Runtime / Memory / Eval / Workflow`，建立 Agent Project Model。
3. 标记 `agent_core / agent_supporting / ordinary_infra`。Agent 岗默认把通用 Monorepo、Electron UI、IPC/WebSocket、构建分发和普通认证放入补充区，除非它直接承载 Tool Calling、权限回调、Runtime、状态恢复或 Eval Trace。
4. 为每个 Artifact 标记 `Implemented / Prototype / Scenario Extension / Design-only`、Ownership、证据、可展示入口与 Scope Boundary；同时生成导航指针，至少包含当前输出章节、Project-relative 源码路径或 Skill-relative 参考路径。
5. 运行 Coverage Check；缺失能力如实标 `absent` 或 `not_applicable`，不得硬凑。
6. 至少保留 4 条互不重复、证据可追溯的项目 Bullet；默认拆出 2 条独立 Harness Bullet，分别讲 Tool Calling / 工具面与 Context Engineering / 任务规划，确有证据时再增加第 3 条权限拦截、审批恢复或子代理编排 Bullet。证据不足时暴露缺口，不用重复句式、普通技术栈或空泛效果凑数。
7. 输出完整对齐包，并在用户只要简历时把审计区压缩，但不得省略真实性门控。

## Scenario Workflow

1. 从 JD/公司背景提取行业、业务问题、数据源、决策动作、风险和关键词。
2. 若行业未知，只显示 `scenario-router.md` 的六个行业族；有 JD 时给 1 个推荐 route 和最多 2 个近邻备选。用户要求自动生成时直接采用最匹配 route，并注明推断依据。
3. 生成 Route Card；一份简历只绑定一个 route。
4. 按 `scenario-architecture.md` 从业务 SOP 反推 Adapter、CLI/MCP、Domain Schema、Knowledge/Memory、Skill/SOP、Trace、Dataset、Agent Eval、Regression Gate、Reviewer 等候选 Artifact。
5. 分开记录：基座依赖、场景新增 Artifact、Artifact 状态、用户 Ownership 与证据。只有换行业词而没有新增工程 Artifact 时，判定为场景换皮并停止生成虚假的场景经历。
6. 未提供实现材料时，金融/电商/其他行业的连接器、知识库、Domain Skill、Dataset、Benchmark 和 Reviewer 默认是 `Scenario Extension` 或 `Design-only`。
7. 最终至少 4 条，不再按旧 L1–L4 配额硬装。使用 Coverage 与竞争力排序，优先呈现 Knowledge/Tool、两条 Harness 子能力、Runtime/Memory、Eval 和 Workflow 中真实且最相关的组合；缺失层不补造，确认项不足时不得声称已有可贴终稿。

### 快速入口

- **金融 Research Agent**：必须建模 `Claim → Evidence → Source → Timestamp`、来源时点、期间/口径、计算复现、反向证据、Trace Benchmark 与只读 Reviewer。正式发布和交易执行不自动化。
- **电商/零售经营决策 Agent**：必须覆盖 Monitor → Detect → Investigate → Decide → Act，考虑 SKU、促销、库存、销售、广告和毛利/权限约束。价格只是子流程；改价、调预算、补货等需审批。

## Claim and Truthfulness Gate

如果 Claim、Artifact 或支撑点带有编号，第一次出现时必须附导航信息；禁止只写 `R17`、`A01` 或 `claim-fin-001` 让用户自己全局搜索。导航规则见 `references/evidence-navigation.md`。

建立 Artifact Inventory 后读取 `references/claim-evidence-ledger.md`。每条最终 Bullet 建一个主 Claim，并引用 Artifact ID、R/H/RT/S 支撑点及 W/Q 证据。

- 项目源码证明项目能力，不自动证明用户个人负责。
- 用户明确接受某点可记为 `user_attested`，但不证明精确指标。
- `Scenario Extension` 只有具备具体基座依赖、接口/Schema/流程和验收方案时成立，只能写“设计并扩展、定义契约”；已有验证记录才可写“验证”。`Design-only` 只能写“设计、规划、提出方案”。
- `Prototype` 写“搭建原型、验证、打通局部链路”。
- `Implemented` 才可写“实现、构建”；“上线、生产、业务提升”仍需生产证据。
- Pending、stale、excluded 或 Ownership 冲突的 Claim 不进入可贴简历区。
- 不编造性能、用户、收入、准确率、生产事故、团队规模或个人 Owner 归因。

导出模型时运行：

```bash
python3 scripts/validate_agent_project_model.py <agent-project-model.json>
python3 scripts/validate_claim_ledger.py <claim-ledger.json>
python3 scripts/validate_resume_package.py <agent-project-model.json> <claim-ledger.json> [--resume <paste-ready-only.md>]
```

最终交付优先运行联合验证器；它会交叉检查 Artifact 引用、状态动词、Ownership、普通 Infra 准入和可贴区内部标记。验证器仍不能证明真实世界经历。

## Craft Agents Technical Boundaries

- AgentBackend/ClaudeAgent/PiAgent 是多后端统一接口；不要把单个抽象点写成完整 Runtime。
- SessionToolContext 与 ServerBuilder 提供工具复用和统一接入框架，不等于已实现财报、ERP、广告、知识检索或工单业务 Tool。
- Permission Mode + PreToolUse 是工具执行硬拦截；Prompt 中的规则不替代该边界。
- Workspace 是文件系统/工作目录级隔离，不是 SaaS 多租户 DB 行级隔离。
- 原生 Messaging Gateway 仅 Telegram、Lark/飞书、WhatsApp；钉钉、企业微信、Slack 需要外部桥接，自研适配若无证据只能标场景扩展。
- R25 支撑事件流、契约与冒烟回归；LLM-as-Judge、行业 Dataset、Benchmark 和 Evo 若无实现证据，只能作为新 Artifact 标状态。
- Electron IPC、WebSocket、UI 和分发工程只有直接支撑 Agent 权限、工具事件或运行时控制时才进入核心 Bullet。
- 前沿论文和外部 Benchmark 数字只用于面试认知，不能冒充项目结果。

## Resume Output Contract

详细 Bullet 写作规则见 [references/star-bullet-writing.md](references/star-bullet-writing.md)。可贴简历区只包含项目名、一句话项目简介和至少 4 条 Bullet，不单列“技术栈”字段；技术名只有在解释某个核心 Agent 能力时才自然写入 Bullet 正文。每条 Bullet 都必须是“黑体摘要 + 一段连续自然语言”，内部完整包含 STAR（情境、任务、行动、结果），但不得显示 `S/T/A/R` 标签或拆成四段；场景状态、Ownership 和 Claim 边界放到审计区，不塞进 Bullet。

- 用黑体短摘要直接露出核心技术或 Artifact，例如 `MCP / CLI`、`Agent Harness`、`Tool Calling`、`Context Engineering`、`Agent Runtime`、`Memory`、`Agent Eval / Trace Benchmark`；
- 交代具体情境、任务、工程行动、Artifact 与可验证结果；
- 使用与 Artifact 状态一致的动词；
- 能指向代码、Schema、Trace、Test 或设计材料；
- 一个完整项目默认拆出 2 条独立 Harness Bullet，分别讲 Tool Calling / 工具面与 Context Engineering / 任务规划；确有证据时再增加第 3 条权限拦截、审批恢复或子代理编排 Bullet，不把 Harness 压缩成一个泛化标签；
- 项目简历至少保留 4 条互不重复的 Bullet；不足时暴露证据缺口，不用重复句式、普通技术栈或空泛效果凑数；
- 不在 Bullet 中出现任何状态、Ownership、Claim 或证据边界审计提示语；这些信息只在后续审计区记录；
- 保持自然语言，不以“针对/基于/设计/实现”四个词的机械齐全作为主要质量标准。

推荐形态：

```text
**[核心概念 / Artifact]** 针对[具体问题]，基于[技术与实现]构建/验证/设计了[Artifact]，[可验证效果或目标]。
```

可贴简历区禁止出现 `Rxx/Hxx/RTxx/Sxx`、`L0–L4`、掌握度标签、`route_id`、Claim ID、Artifact 状态和审计标签。

## Required Output Package

完整生成默认输出：

1. 干净的可贴简历版（不含技术栈字段或审计提示语）；
2. Agent Architecture Mapping；
3. Artifact Inventory；
4. Coverage Check；
5. `Evidence Navigation`：编号、含义、文档、相对路径、章节/行和下一步阅读位置；
6. Claim / Evidence / Ownership 审计；
7. 场景扩展与基座原生能力边界；
8. 待确认项、风险与降级措辞；
9. 与最终 Claim 对应的面试问题入口。

主质量评分依次看 Agent 能力命中度、工程颗粒度、技术辨识度、证据强度、真实性、差异化和覆盖；句式与格式只做最后底线检查。

## Q&A, Interview, and Story

- Q&A 以最终 Claim 为边界：项目问题、JD 追问、薄弱证据与降级方案分开标注；每道主问题必须绑定简历 Bullet、源码 Artifact 和 Project-relative 路径。生成前先执行 `source-driven-qa.md` 的源码核验顺序，不得只从静态题库改写。
- 答案内部采用“问题背景 → 任务目标 → 具体动作 → 技术取舍 → 结果/验证 → 局限”的连贯叙事，不显示 S/T/A/R 标签；技术名词必须落到源码符号、数据结构、状态变化或测试证据。
- 场景 QA 复用同一份基座源码，只改变业务问题、Failure Mode、Domain Artifact 和追问；源码没有实现的行业连接器、数据集或生产结果只能作为设计题或场景题。
- 每道核心题至少准备架构、实现、取舍、失败/回滚、Ownership 五类追问；追问必须能回到代码、测试、Trace、文档或诚实降级路径。
- Grill 一次问一题，使用 Session Ledger；Review 把回答反馈到 Claim；Retry 使用变体、反事实、失败路径、证据或 60 秒压缩，不原题复读。
- Story 输出项目事实卡、业务流程、架构与数据流、技术故事、STAR/CAR、追问树、多项目能力迁移和概念速查。用户参与、项目整体能力和待确认信息必须分开。
- 多项目只能连接能力演进，不能虚构共享代码、数据库、模型或服务。

## Adversarial Review

当用户要求审查、找漏洞或最终验收时，逐条检查：架构层、核心技术摘要、具体 Artifact、Agent 相关性、证据、状态、Ownership、Scope、场景增量、Coverage、同源重复、项目定位与面试可展示入口。任何关键项不成立，降级、移出核心 Bullet 或转待确认。

## Evidence Navigation

当用户问“`R17/401/101` 在哪里”“这个 Claim 对应哪份主文档”或“源码应该去哪里看”时：

1. 先按 `references/evidence-navigation.md` 解析前缀和上下文；不完整编号不得猜测。
2. 在当前生成文件中新增或定位 `# Evidence Navigation`，给出 `编号 → 含义 → 当前输出章节 → Workspace-relative/Project-relative 路径 → 下一步`。
3. 对 `R/H/RT/S/W/Q` 等内部索引，给出 Skill-relative 路径和具体表格行/章节；对 `Axx`、`artifact-*`、`claim-*`，给出当前输出文件和对应审计表行。
4. 如果存在多个同号候选，列出候选路径并要求补充前缀；不得把不同项目的同号条目合并。
