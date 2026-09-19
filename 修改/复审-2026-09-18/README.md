# 2026-09-18：Craft / Happy 逐步复审与对抗裁决

## 结论与范围

保留现有两个项目的五条简历核心文字，不用新术语再次扩张贡献。当前主要问题是**证据文件未随正文发布、根目录定稿仍带旧主线、联动稿把不同机制串成过强个人经历**。本 PR 修文档、导航、证据索引和检查器；不修改 ThreadCove 或 Clawtide 的业务源码。

本轮是同一审查者按不同立场进行的反向审查，不是独立多 Agent 运行。当前环境没有可调用的独立子代理；没有生成虚构代理身份、评分或签字。独立复核仍待进行，建议分工见第七节。材料检查通过也不意味着个人贡献、真实模型、IM 联调或业务质量通过。

## 一、固定版本与最小源码抽样

| 对象 | 基线 |
|---|---|
| 材料 | `Bluuok/mini@7c19a61181335f0c5b50e6ce92fa35d61fbb8a82`，PR #2 已合并 |
| ThreadCove | `6a49d19a024fcbc6cdabeaf8da8ccbf1953dfbb9`，与上轮来源一致 |
| Clawtide | `dde300313de851baa953f24f6a0f8c75e9cacd3f`，与上轮来源一致 |

重新读取两项目 main ref，确认实现未换版。新增源码抽样只检查三个接缝：

- [ResearchTools.execute/runChild](https://github.com/Bluuok/ThreadCove/blob/6a49d19a024fcbc6cdabeaf8da8ccbf1953dfbb9/packages/shared/src/research/tools.ts#L89-L197)：独立子代理 cwd、宿主仍按父会话保存产物、常规失败和写盘失败的不同收尾。
- [TaskScheduler 心跳/pump/恢复](https://github.com/Bluuok/Clawtide/blob/dde300313de851baa953f24f6a0f8c75e9cacd3f/src/task-scheduler.ts#L570-L690)：续租失败的实际动作只是停心跳与日志，不能读注释就认定执行已取消。
- [定时执行回调](https://github.com/Bluuok/Clawtide/blob/dde300313de851baa953f24f6a0f8c75e9cacd3f/src/server.ts#L109-L140)：group/isolated 会话选择、静态 task.prompt，以及未传 systemPrompt。

其他机制沿用同一固定版本的上一轮源码锚点和已读测试定义，不声称本轮重新通读所有文件。未下载并执行上游 ZIP，也未运行产品测试。两套 Skill 的入口、建模/故事/对抗规则与旧稿的冲突按下表裁决。

## 二、Skill 适用性与逐步执行

Craft 使用 [CraftAgents/skill](../../CraftAgents/skill/SKILL.md)。Happy 使用 [.claude 的项目路由](../../.claude/skills/paidgroup-agent-resume-skill/SKILL.md)及 [Happy 完整工作流](../../.claude/skills/paidgroup-agent-resume-skill/references/happyclaw/workflow.md)。

Craft 的“事实分层、证据门控、交叉追问”可以迁移为 Happy 的审查方法，但 Craft 的 R/H/RT 编号、默认 Harness 配额、输出字段及仅支持 craft-agents/miniclaw 的校验器不适用于 Happy。不会把 Happy 改名为 craft-agents 以通过校验。

| 步骤 | Craft | Happy | 裁决 |
|---|---|---|---|
| 1 事实抽取 | 实际研究主链与 Claude 旁支分开 | 演示文本与真实运营系统分开 | 版本固定，个人作者未知 |
| 2 架构映射 | 取材、工具面、委派、上下文、执行、保存 | 调度、Profile、渠道、授权、认证 | 机制目录不伪装成顺序流水线 |
| 3 缺口 | 研究质量 Eval、逐论点证据、Pi 有界历史仍缺 | 行业 Adapter、调度 Profile/取消闭环仍缺 | 不用行业名填补实现缺口 |
| 4 场景产物 | 既有搜索/页面/子报告 | 手工运营文本、Profile 草稿和待执行记录 | 样例文件不是产品验收结果 |
| 5 状态/Ownership | 项目源码 Implemented；个人归属 unknown | source_present；个人贡献仍需确认 | 不进入 resume_final |
| 6 Coverage/排序 | 保留工具、委派、上下文、后端、状态五条；Eval 弱 | 保留 R14/R15/R07/R20/R19；认证位于最后 | 不为覆盖度虚构能力 |
| 7 Claim | 恢复模型、账本、QA/来源索引 | 恢复原生 Claim 与来源索引 | 一条简历对应一个主 Claim |
| 8 定稿与故事 | 根目录改为当前五条及一条研究主线 | 根目录改为静态文本的两入口主线 | 旧稿逐字归档 |
| 9 QA/对抗 | 五组十五题与新主线逐项对应 | 四部分 QA、八模块与九阶段准备稿保留 | 重复背诵不等于候选人已答对 |
| 10 验证 | 原 Skill 三个验证器＋本 PR 检查器 | 使用本 PR 的项目材料检查器 | 不冒称产品联调或多 Agent 终审 |

R 编号在本表属于审计信息。Happy 的索引来自 `.claude/skills/paidgroup-agent-resume-skill/references/happyclaw/resume-points.md` 对应行，QA 位于 `修改/HappyClaw/HappyClaw-面试QA.md` 的 Q14/Q15/Q07/Q20/Q19。Craft 新增场景产物允许没有旧 R 号，不硬套不存在的编号。

## 三、多视角对抗：质疑、辩护、最终处理

下列“立场”是同一审查者的检查视角，不是已启动的不同代理。

| ID / 优先级 | 质疑 | 可保留的辩护 | 最终裁决与修改 |
|---|---|---|---|
| F01 / P0 | 正文指向不存在的 JSON/fixtures，怎么复查？ | 文件曾在下载包中，但 GitHub 只发布了正文 | 补齐必要模型、Claim、来源与样例；QA JSON 只做索引，答案以 Markdown 为准 |
| F02 / P0 | 根目录“定稿”仍是旧五点且禁多 Agent，与现有 delegate 冲突 | 顶部已有历史免责声明 | 免责声明不足以形成清晰阅读入口；旧文件归档，当前五条直接呈现 |
| F03 / P0 | 个人归属尚未核定，模型却能让简历终稿门禁通过 | 用户确实称这是个人项目并接受选点 | 只支持材料自述；Artifact 保留 unknown，Claim 不允许 resume_final |
| F04 / P1 | 把工具、委派、Claude 历史、后端、恢复串为五步是否是假链？ | 五条各自有项目实现 | 它们是能力切面；明确 Pi 研究主链与 Claude 历史旁支，保留技术亮点 |
| F05 / P1 | “独立子目录”是否意味着子任务所有产物在独立目录？ | 子代理 cwd 确实独立 | 宿主仍按 parent 写取材和报告；不扩大为 OS 沙箱或全文件隔离 |
| F06 / P1 | 定时处理能叫库存巡检/动态日报吗？ | task.prompt 可装业务示例 | 无 Adapter 不会取得当天库存；改成手工静态文本的两入口演示 |
| F07 / P0 | 三入口同一函数，是否同 Profile、同权限、失租即停？ | 确实共用 AgentRuntime | 配置注入与取消接线仍缺；故事写清接缝，不把源码缺口标为修复 |
| F08 / P1 | 为什么“Prompt 无自然 diff”能成为采用短语的理由？ | 短语有意图确认作用 | Prompt 可以 diff；差异展示、确认、授权、原子提交四者互补，删除错误反例 |
| F09 / P0 | 联动稿把所有点称本人独立研发，又称 SDK 留痕能限制工具？ | 可讨论共用工程方法 | 重写联动，区分声明/事后记录与执行前限制；不强造时间线、零复用或企业团队 |
| F10 / P1 | JSON 校验通过能算多 Agent 终审和运行时可靠？ | 能发现引用、字段和措辞漂移 | 仅材料检查；独立 Agent、真实模型、IM、外部副作用均未验证 |

保持不变的强项：Craft 的研究工具与受限委派已经有场景增量，没必要退回纯 Electron 壳；Happy 的 occurrence 和条件认领、PATCH 缺失/空值、归属授权有具体工程对象，没必要全部换成普通 CRUD。

## 四、故事逻辑验收

[Craft 主线](../../Craft-故事.md)：研究问题 → 可选取材/委派 → 来源和子报告 → 状态与已保存内容。Claude 历史桥接旁列；没有把所有五条当成必经五阶段。

[Happy 主线](../../HappyClaw-故事.md)：手工文本 → Web/IM 或静态计划输入 → 各自准入与配置 → 共用运行时 → 各自结果表面。图明确不是广播到所有出口的投递保证。

[跨项目联动](../../三项目联动-步6.md)：比较工程方法，不声称真实开发先后或共享代码关系；MiniCode 本轮没有取证，不借两个个人项目替其证明实习身份。

人物、时间、问题、行动、结果的审核要求是：用户是自己；任务是明确标注的演示；行动是固定源码机制；结果只说可观察产物；个人时间与贡献待真实补证。不会用“我当时碰到线上故障”替换源码推演。

完整八模块和原十五题仍在 `修改/CraftAgent`、`修改/HappyClaw`。本轮根目录增加适合口述的主线，详细稿供追问，不要求一次背完两套长文。

## 五、证据交付与复验

[主张映射](claim-map.json)连接十条简历、故事章节、QA 组与实现产物。Craft 模型与账本保持原 Skill schema；QA JSON 改为问题索引，不复制完整答案。Happy 保持独立项目与编号，证据库绑定 Clawtide 固定提交。

执行命令（仓库根目录）：

```sh
python scripts/check_resume_review.py
python CraftAgents/skill/scripts/validate_agent_project_model.py 修改/CraftAgent/audit/agent-project-model.json --json
python CraftAgents/skill/scripts/validate_claim_ledger.py 修改/CraftAgent/audit/claim-evidence-ledger.json --json
python CraftAgents/skill/scripts/validate_resume_package.py 修改/CraftAgent/audit/agent-project-model.json 修改/CraftAgent/audit/claim-evidence-ledger.json --resume 修改/CraftAgent/Craft-简历片段.md --json
```

检查器只读取材料，不使用密钥。个人归属 unknown 的警告应保留；这是尚未完成的门禁，不是要通过改一个布尔值消除的问题。十二项演示记录保持 `not_run`、`observed=null`。

本轮实际结果见 [检查结果](verification.json)。HTML 正文和上一轮合并副本保持原 blob，不在本轮重新宣称浏览器/PDF 排版检查。历史 2026-09-17 的校验输出与 403 记录未换日期作为新结果。

## 六、旧 PR 与分支处理

PR #2 已合并，`codex/apply-revised-materials` 在检查时已不在远端分支列表，无需再次删除。PR #1 仍有独立的历史评审链接修复，未合并、未被本 PR 包含，因此保留 `docs/publish-resume-review-20260917`。没有为了“清理”而删除任何独有改动。

## 七、独立多 Agent 复核：尚未执行

后续独立审查应让至少两位审查者先分别产出问题，再由第三方裁决，不能互相复制初稿：A 只核对个人归属与实现范围；B 只核对故事因果、参数流与失败分支；C 对 A/B 分歧回看限定源码。输出每条问题的文件、证据、反例和处置，不用空泛打分。只有收到独立结果才能把状态改成完成。

本 PR 中的反向审查属于单一审查者，保留这个限制；文档可讨论、可复验，但不提供“独立多 Agent 已通过”的结论。
