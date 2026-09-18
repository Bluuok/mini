# Craft 场景、选点与证据审计

> 日期：2026-09-17。范围仅为 mini 中 Craft 项目的简历、项目故事及其必要依据；未修改 ThreadCove 业务代码，未审改其他项目。
> 材料基线：`Bluuok/mini@9bcbc97bdecef9200aa9626b697bd72657ec7822`。
> 实现基线：`Bluuok/ThreadCove@6a49d19a024fcbc6cdabeaf8da8ccbf1953dfbb9`。

## 一、使用了哪些 Skill，如何执行

实际入口是 `CraftAgents/skill/SKILL.md`。按该入口读取并使用场景路由、Agent 项目建模、证据导航、Claim Ledger、简历 STAR 写作与源码 QA 等参考文件；没有把根目录旧模板或历史付费资料当成当前规则。

| 阶段 | 使用的 Skill 相对路径 | 本次产出 |
|---|---|---|
| 场景判断 | `references/scenario-router.md`、`scenario-architecture.md`、`user-intake.md` | 保留个人研究场景，自定义 route，不硬套行业。 |
| 能力建模 | `references/agent-project-modeling.md`、`harness-runtime-map.md` | 九个独立工程产物、六层架构归属、覆盖检查。 |
| 候选选点 | `references/resume-points.md`、`combo-plans.md` | 原五点作为候选和历史映射，不机械保持五条基础设施。 |
| 证据审计 | `references/claim-evidence-ledger.md`、`evidence-navigation.md`、`codewiki-index.md` | 固定实现快照，区分源码、测试定义与历史验收记录。 |
| 简历写作 | `references/star-bullet-writing.md` | 五条粗体摘要加连续自然语言；去除 Craft 单独技术栈栏和内部编号。 |
| QA | `references/source-driven-qa.md`、`interview-qa.md` | 五组、十五个核心问答，覆盖架构、实现、取舍、失败、责任。 |
| 复查与联动 | 入口的审查/校验要求，三个 `scripts/validate_*.py` | 文案对抗式自审、跨文件映射、实际执行格式/证据结构校验。 |

使用的是 Skill 的规则与流程，不等于启动了独立子代理。本轮审查由同一助手执行；不是候选人口试，也不是独立第三方签字验收。

参考归档 `CraftAgents/skill/references/craft-agents-oss-main.zip` 未下载、未校验 SHA-256。没有使用该归档的旧索引作为当前 ThreadCove 实现证明。当前机制证据来自上述固定提交的真实项目文件。三个校验脚本和原 HTML 的 Git blob 哈希已核对，见 validation 目录。

## 二、场景判断：保留，但从“平台描述”转向“研究执行链”

**场景卡**：目标用户是本人；任务是技术选型、公开资料阅读、方案比较；输入是研究问题与可获取资料；核心动作是取材、可选独立委派、汇总和保存；交付物是答案及可检查的取材/子任务记录；约束是本地个人使用、有限调用预算、可中断和来源可回看。

`route_id = personal-technical-research` 是本次自定义路由。Skill 场景库提供行业候选，但未要求没有完全匹配项时强行包装成金融、电商或企业咨询。原定稿已给出真实个人场景，沿用它比增加不存在的行业客户更可辩护。

**当前场景有真实工程增量**：研究工具定义与执行器、取材 JSON 字段、来源/时间保留、子问题委派、有限预算和失败终态。它已经不只是“通用 MCP 平台换一个名字”。然而来源可信度、证据冲突、逐论点引用与任务质量评测仍薄弱；不能把一条工程闭环写成完整研究质量闭环。依据 E01—E04。

## 三、旧口径与当前源码的差异

| 旧材料表述 | 当前判断 | 改写处理 |
|---|---|---|
| 多任务等于多 Session；不做多 Agent | 当前有 `delegate_research` 与独立 Pi 子代理；不是所有 Session 都等于子代理。 | 写“受限子 Agent 委派”，不写通用编排平台。 |
| MCP 统一接入即可概括研究工具 | 当前有具体 `web_search/web_fetch` 业务工具体与产物。 | 把取材契约与来源留存升为第一条。 |
| 一个任务一个 Session 与独立 Workspace | Workspace 可包含多 Session；独立工作目录不等于独立工作区/租户。 | 统一为 Session 与目录边界。 |
| 只讲 Claude / Pi 两后端 | 工厂还包含 DeepSeek；研究工具装配仅 Pi。 | 三后端接口与实际研究能力分开描述。 |
| 事件流意味着统一恢复、可重放 | 恢复需要具体消费者、消息 ID、快照和检查点。 | 写已存在的保存与中断识别，不宣称自动续跑。 |
| 按阶段选模型等于自动路由 | 配置切换与自动研究阶段路由不是同一能力。 | 删除自动阶段路由暗示。 |
| 所有凭据都只在宿主 | Pi init 契约含模型 apiKey；Source 工具凭据与模型凭据不同。 | 明确凭据类别，不写全称判断。 |
| 全部自研、全部测试通过 | 旧材料自述与施工要求不足以证明全部个人独立完成或本次执行结果。 | 不写独立研发/主导，不写未经复跑的统计和成果。 |

旧 `Craft-定稿.md` 应保留历史正文，但必须加本版更正提示；否则下一次按旧定稿生成材料会重新引入上述矛盾。交付中的应用脚本只添加提示，不伪造整份旧稿已完成修订。

## 四、Agent Architecture Mapping 与覆盖

| 层 | 当前工程对象 | 覆盖结论 | 边界 |
|---|---|---|---|
| External Knowledge | 搜索/网页读取、来源与抓取时间产物 | covered | 无向量检索、逐论点证据蕴含验证。 |
| Harness | 工具面、宿主分发、受限委派、历史构建、后端接口 | covered | Tool Calling、Context、委派是不同产物，不重复换名计数。 |
| Runtime | Pi 子进程、宿主执行边界与取消清理 | covered | 本地进程边界，不是 OS 沙箱或分布式配额。 |
| Memory | 会话记录、文本检查点与 Claude 有界历史桥接 | covered | 无长期语义记忆；不是完整 SDK resume。 |
| Eval | 确定性故障与契约回归用例 | weak | 代码有用例，本次未运行；无研究质量数据集/裁判。 |
| Workflow | 受理、执行、委派、结果收集和终态 | covered（轻量范围） | 不是任意 DAG、自动重规划或完整研究 SOP 引擎。 |

覆盖表示代码和工程产物的存在，不是个人能力评级，不是测试覆盖率。最终保留五条，且工具调用、上下文工程和受限委派分别构成独立 Harness 卖点。

## 五、Artifact Inventory 与最终选点

本节 A01—A09 对应 `audit/agent-project-model.json` 的 id；Claim 编号对应 `audit/claim-evidence-ledger.json`。所有“Implemented”只表示固定源码中存在实现，不等于已部署、已被本轮运行验证或全部由候选人独立编写。

| 产物 | 层 | 工程实体 | 简历去向 |
|---|---|---|---|
| A01 | External Knowledge | 研究取材 JSON 产物与网页适配器 | 第1条 |
| A02 | Harness | Pi 研究工具面与宿主执行接口 | 第1条 |
| A03 | Harness | delegate_research / ResearchSlots / ChildRecord | 第2条 |
| A04 | Harness | restoreTextHistory / promptWithHistory | 第3条 |
| A05 | Harness | AgentBackend / DRIVER_REGISTRY / createBackend | 第4条 |
| A06 | Runtime | PiAgent.ensureSubprocess / JSONL 协议 | 第4条 |
| A07 | Workflow | SessionManager.submitMessage / recoverWorkspace | 第5条 |
| A08 | Memory | RunTranscript / JSONL 会话快照 | 第5条 |
| A09 | Eval | research.test / review-regressions.test / parity test | QA 与审计，不单独占核心条目 |

旧编号只作索引：R03→`references/resume-points.md` 的 AgentBackend；R08/R09→Session/JSONL；R10→AgentEvent；R12→传输；R17/R18→会话工具/来源接入；R21→Pi 进程外协议。对应基座问答见 `references/interview-qa.md` 同号 Q 段。本项目新增取材与委派不强行伪装成某个旧 R 点已覆盖的业务实现。

## 六、Claim、个人贡献与完成状态

五条最终 Claim 逐条绑定 Artifact 和固定源文件，均以**项目层能力**书写，采用 deliverable 结果类型；不使用生产收益、指标提升、实际客户数或“主导”措辞。用户在本轮声明这是自己的项目，因此按“项目参与”登记；这不等于逐模块作者已完成独立核验。既有故事的全量自研说法不能替代提交证据。

仍有两项不进入最终简历：旧“不做子代理”声明为 stale；“所有模块和 SDK 都本人独立研发”为 pending。真正准备投递前，应能指出本人修改、参考复用和 AI 辅助各自的边界；本次不把这个未核验事项偷偷改成 confirmed。

## 七、Source Navigation：每个来源到文件、符号与验证层级

以下路径全部相对于 `Bluuok/ThreadCove@6a49d19a024fcbc6cdabeaf8da8ccbf1953dfbb9`，不是 mini 内的上游参考源码目录。文件中的注释和 README 不优先于实际实现。

### E01

路径：`packages/shared/src/research/tools.ts`

符号/章节：`WEB_TOOLS / ResearchTools.bind / execute / runChild / ResearchSlots / recoverSession`

类别：implementation。核对说明：检索工具、子代理调度、来源产物、取消与预算。

### E02

路径：`packages/shared/src/research/web.ts`

符号/章节：`validatePublicUrl / fetchPublicPage / extractPage / searchWeb`

类别：implementation。核对说明：地址校验、DNS 绑定、重定向复检、取材解析与截断。

### E03

路径：`apps/electron/src/server/session-manager.ts`

符号/章节：`createSession / submitMessage / recoverWorkspace`

类别：implementation。核对说明：Pi 专属研究工具装配、受理/完成、重启中断。

### E04

路径：`packages/shared/tests/research.test.ts`

符号/章节：`并发槽 / 父取消 / 子失败 / 中断恢复 / 产物写失败 / 子任务超时测试`

类别：test。核对说明：已读测试定义；本次没有运行 Bun 测试或真实搜索。

### E05

路径：`packages/shared/src/agent/backend/history.ts`

符号/章节：`restoreTextHistory / promptWithHistory`

类别：implementation。核对说明：字符预算、角色过滤、引用式历史。

### E06

路径：`packages/shared/tests/review-regressions.test.ts`

符号/章节：`bounded text history / safe session deletion`

类别：test。核对说明：已读测试定义；预算与角色断言，不是本次执行结果。

### E07

路径：`packages/shared/src/agent/backend/factory.ts`

符号/章节：`DRIVER_REGISTRY / BACKEND_FACTORIES / createBackend`

类别：implementation。核对说明：三个后端配置映射；不证明功能完全对等。

### E08

路径：`packages/shared/tests/factory.test.ts`

符号/章节：`backend factory`

类别：test。核对说明：Claude/Pi 路由与生命周期表面；没有覆盖全部后端真实 API。

### E09

路径：`packages/shared/src/agent/pi-agent.ts`

符号/章节：`PiAgent / ensureSubprocess / InboundMessage / OutboundMessage`

类别：implementation。核对说明：子进程启动、JSONL 协议、宿主工具接口；init 含模型 apiKey。

### E10

路径：`apps/electron/src/server/run-transcript.ts`

符号/章节：`RunTranscript.consume / flush`

类别：implementation。核对说明：消息 ID、文本快照、检查点、结果与错误保存。

### E11

路径：`packages/shared/tests/session-event-message-parity.test.ts`

符号/章节：`eventToStoredFields / eventToRenderFields`

类别：contract。核对说明：测试内镜像映射，不直接导入真实应用路径，不能单独证明端到端一致。

### E12

路径：`docs/IMPLEMENTATION-REVIEW.md`

符号/章节：`2026-09-14 提交前复验 / OpenCode Go-Pi SDK 接入 / 数据兼容与边界`

类别：documentation。核对说明：仓库历史验收记录；本次未取得忽略目录内截图/原始报告，未复测。

### E14

路径：`packages/shared/src/agent/claude-agent.ts`

符号/章节：`ClaudeAgent.restoreHistory / chatImpl`

类别：implementation。核对说明：实际调用 restoreTextHistory 与 promptWithHistory，确认字符预算桥接的后端入口。

### E15

路径：`packages/pi-agent-server/src/index.ts`

符号/章节：`initialize / executeToolViaHost / main`

类别：implementation。核对说明：禁用默认工具和自动资源加载；显式注册工具；Pi 历史回填只保留 user/assistant，没有相同的字符预算和 tool 文本桥接。

### E13

路径：`README.md`

符号/章节：`核心能力 / 一条消息的完整旅程`

类别：documentation。核对说明：产品定位与架构说明，部分计数和研究范围滞后于源码。

## 八、对抗式自审：发现什么，怎样改写

本表为同一作者的反向质疑与修订记录，不是虚构多个独立 Agent 的审查结论。各项问题都对照本次文件逐一检查；剩余事项保留，不用分数掩盖。

| 质疑 | 发现与处理 | 剩余边界 |
|---|---|---|
| 这是不是给基础设施套研究场景？ | 查到真实研究工具、产物与子代理，简历改为从这些实体展开。 | 研究质量评估仍缺少基准。 |
| 是否把多 Session 冒充多 Agent？ | 以真实父子创建、预算、汇合实现为证据；保留普通 Session 的区别。 | 不写通用 DAG。 |
| 三个后端都支持这些工具？ | 明确 Pi 专属装配。 | 其他后端的研究工具闭环不作通过声明。 |
| 全局并发是跨机器全局吗？ | 改为单运行时实例共享。 | 没有分布式配额。 |
| 任一失败都不影响成功结果？ | 普通子任务失败与写盘失败拆开解释。 | 后者可能使委派调用整体报错。 |
| 有 JSONL 就能自动继续任务？ | 改为文本/状态恢复与 interrupted。 | 不自动重放旧付费工作。 |
| 三后端都用了相同历史桥接？ | 实查 Claude 调用入口和 Pi initialize，简历明确限定 Claude 路径。 | Pi 未使用该预算，且只回填 user/assistant；上下文策略仍有对齐缺口。 |
| 字符预算就是完整 token 预算？ | 明确字符串长度、正文预算与包装开销。 | 没有精确 tokenizer 或摘要。 |
| URL 就是验证过的引用？ | 改为来源留存与取材可回看。 | 没有逐论点证据蕴含检查。 |
| 凭据永不进入子进程？ | 分清 Source 与模型凭据，init 的 apiKey 不隐瞒。 | 不主张所有密钥只留宿主。 |
| 事件 parity 等于真实应用联调？ | 发现测试内镜像映射，明确不能单独证明真实双端路径。 | 本轮没有复跑应用集成。 |
| 测试文件存在就是测试通过？ | 清除本轮程序测试通过、真实 API 全通过和测试计数暗示。 | 历史报告只按历史记录引用。 |
| 所有模块都是本人原创？ | 标注参考架构、SDK 与项目参与边界，取消全量独立研发表述。 | 逐提交贡献需本人举证。 |

## 九、简历—故事—QA 联动与程序联调的区别

| 简历条目 | Claim | 故事 | QA | 实现/测试索引 |
|---|---|---|---|---|
| 1. 研究工具接入与证据留存 | claim-craft-001 | M4.1 | Q01.1—.3 | E01、E02、E03、E04、E15 |
| 2. 受限子 Agent 编排 | claim-craft-002 | M4.2 | Q02.1—.3 | E01、E04 |
| 3. Context Engineering | claim-craft-003 | M4.3 | Q03.1—.3 | E05、E06、E14、E15 |
| 4. 多后端适配与进程边界 | claim-craft-004 | M4.4 | Q04.1—.3 | E03、E07、E08、E09、E12、E15 |
| 5. 任务生命周期与流式恢复 | claim-craft-005 | M4.5 | Q05.1—.3 | E03、E10、E11、E12 |

**本次执行的文案联动校验**：原 HTML 完整哈希核对；只替换 Craft 区；五条正文与 Claim wording 一致；每条都有对应故事与三问 QA；无内部编号泄漏到干净简历区；模型、Ledger 与简历通过目录内原版校验脚本。实际结果以 `validation/` 中的运行输出为准，不能用这段说明替代输出。

**本次没有执行的程序联调**：未安装/启动 ThreadCove，未跑 Bun 测试，未调用真实模型或 Exa 服务，未复测研究子任务的 Web/Electron 流程。仓库历史 UI/SDK 记录不是本次执行结果。简历 HTML 的浏览器排版检查属于交付文件检查，不是 ThreadCove 产品联调。

若在本地补做程序验收，最小用例是：Pi 发起真实研究工具调用并留下产物；父任务带并发子任务后取消；一个子任务失败另一个成功；保存后重启看到原文本和 interrupted 状态；Web/Electron 消费同一运行的最终状态。应保存提交号、环境、实际工具结果与截图，且不要把测试 fixture 冒称真实搜索。

## 十、保留项与交付范围

原简历的时间、姓名、学校等占位符不由本次猜填。原文件首行多余斜杠、其他项目内容、全局技能栏和样式均不越界修改；这不表示已经审查或认可它们。原定稿与复现施工规格的历史正文不覆盖，由更正提示明确新旧范围。未创建远端分支、提交或 PR：GitHub 分支写操作返回 403。