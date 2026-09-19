# 2026-09-19：Happy / Craft 技能评审、修订与额外逻辑终审

本轮仅处理 Happy/Clawtide、Craft/ThreadCove，各保留五个面试核心选点。先执行对应项目skill的事实建模、故事/简历和对抗评审，再由主代理额外检查因果、参数流、失败分支与结果口径。

## 版本与当前入口

- 材料输入：[mini PR #3](https://github.com/Bluuok/mini/pull/3)，`7fa4b34a08ba42867a4c39d2a705aee503654e92`。当时本地main与远端main同为`7c19a61`，新内容在未合并PR中。
- 本地评审分支：`codex/happy-craft-review-20260919`。同步由DeepSeek执行，main未被开放PR替换。
- 实现快照：[ThreadCove 6a49d19](https://github.com/Bluuok/ThreadCove/tree/6a49d19a024fcbc6cdabeaf8da8ccbf1953dfbb9)、[Clawtide dde30031](https://github.com/Bluuok/Clawtide/tree/dde300313de851baa953f24f6a0f8c75e9cacd3f)。本轮文稿修改不改变产品源码。
- [Craft定稿](../../Craft-定稿.md) · [Craft主故事](../../Craft-故事.md) · [Craft完整故事](../CraftAgent/Craft-故事.md) · [Craft QA](../CraftAgent/Craft-面试QA.md)。
- [Happy定稿](../../HappyClaw-定稿.md) · [Happy主故事](../../HappyClaw-故事.md) · [Happy完整故事](../HappyClaw/HappyClaw-故事.md) · [Happy QA](../HappyClaw/HappyClaw-面试QA.md)。
- [独立对抗审查与处置](独立对抗评审.md) · [用户确认及简历使用边界](用户确认与使用边界.md) · [十条主张映射](claim-map.json) · [验证记录](verification.json) · [PR变更说明](PR-说明.md)。

## 对应技能的执行结果

| 阶段 | Craft | Happy |
|---|---|---|
| 规则入口 | `CraftAgents/skill/SKILL.md`及其references | `.claude/skills/paidgroup-agent-resume-skill/SKILL.md`与`references/happyclaw/workflow.md` |
| 事实/参与 | 五点按用户确认复现实现，SDK来源与运行结果分开 | 同样记录本人五点复现实现，不认领整个上游 |
| 架构/产物 | 工具面、受限委派、Claude上下文旁支、后端接口、运行记录 | 调度、Profile、IM、资源授权、Web认证 |
| 简历契约 | 黑体技术摘要＋自然语言STAR；无独立技术栈行；五条 | 四字段＋五条四段式；R/Q索引置于审计/准备区 |
| 故事契约 | 八模块、五点分层讲法、二层追问；不强套Happy九阶段 | 八模块、五点三档STAR、二层追问、九阶段内容与概念边界 |
| 技能内对抗 | 架构/Artifact/证据/Ownership/Scope/Coverage/重复等逐项 | 缺口/逻辑冲突/归属/场景覆盖/定位逐项 |
| 额外评审 | 主代理另外核对因果与跨文稿一致性 | 主代理另外核对入口参数、身份、状态与副作用 |

Happy的默认方案只在尚未选点时使用。本轮已有明确五点；模板逐字要求与固定实现冲突时，优先真实实现和用户明确的修订请求，仍保留四段式和所选R点Scope，不修改skill本身。

## 主代理的额外逻辑裁决

1. **五个选点是同一应用的能力分工，不是五步必经流水线。** Craft以Pi研究主链为讲述中心，Claude上下文旁列；Happy多个入口到同一运行函数，也不能推出相同Profile、相同身份或相同输出保证。
2. **限制必须说清对象与生命周期。** Craft父运行累计子任务与网页工具调用预算、运行时并发槽、单子任务模型轮数/超时彼此不同；本地取消、Promise汇合和提供方结算也不能互相替代。
3. **恢复必须点明恢复对象与触发入口。** Craft恢复已存文本/状态而不主动续跑。Happy常规pump、服务启动recoverOnStart、失租后的执行器取消是三件事；存在启动恢复不表示多实例恢复和外部动作去重已完整。
4. **本人实现与技术效果分别取证。** 用户已确认五点复现实现，当前文稿应自然使用第一人称；测试定义、结构检查、独立逻辑审查分别说明各自结果，不能合并成“产品已全面验证”。
5. **故事需要可讲的决策链。** 从需求到接口/状态与取舍，再到具体产物和失败边界。按代码结构解释实施步骤，不伪造真实事故、开发日期或一次未发生的演示。
6. **保留强项，不用限制说明淹没主体。** 十点都有实际工程对象；未闭环能力放审计与追问区，不因此把全部项目退成只读学习，也不新增RAG、业务Adapter、生产规模或研究质量Eval凑亮点。

以上裁决是对技能产物的第二层判断，不是重复统计标题、字段或关键词。主代理已核对修订后的故事、QA与相关diff：累计预算、Claude旁支、恢复触发入口、Cookie与代理IP、个人归属及演示口径均已落地。三位审查者的初始问题、反方辩护和处置见独立报告；本轮未发现仍阻塞文稿使用的逻辑问题，自动化校验状态另列。

## 验证与限制

材料一致性检查 **84/84通过**，Craft原生三个验证器通过，四个内存负例均被预期门禁拦截，`git diff --check`通过。另核对两份HTML只包含预定的三处文字替换，历史记录、归档和业务源码未改动。A09的归属warning保留：它未被当前五条简历主张引用，不阻塞本轮材料。

首次AGY/Antigravity调用被无交互模式的RunCommand权限拒绝，返回空正文，未执行检查。用户随后要求继续执行；主代理按此前说明的替代方式完成本地只读校验，未修改持久权限。真实输出见[材料检查](qa/material-checks.json)、[Skill验证器](qa/skill-validators.json)、[负例与范围检查](qa/focused-checks.json)。验证器生成的两个Python缓存已清理；范围复查通过。

以下为可复现命令；本机实际使用`verification.json`记录的完整Python解释器路径：

```text
python -B -X utf8 scripts/check_resume_review.py
python -B -X utf8 CraftAgents/skill/scripts/validate_agent_project_model.py 修改/CraftAgent/audit/agent-project-model.json --json
python -B -X utf8 CraftAgents/skill/scripts/validate_claim_ledger.py 修改/CraftAgent/audit/claim-evidence-ledger.json --json
python -B -X utf8 CraftAgents/skill/scripts/validate_resume_package.py 修改/CraftAgent/audit/agent-project-model.json 修改/CraftAgent/audit/claim-evidence-ledger.json --resume 修改/CraftAgent/Craft-简历片段.md --json
```

实际解释器、命令、结果和失败项以 `verification.json` 为准。结构检查不会执行模型、IM、浏览器或业务产品；十二项业务演示记录仍是未执行。HTML仅更新这两个项目的简介与Craft预算文字，不据此新增浏览器/PDF排版通过结论。

09-18历史记录和归档保持原样；当前Artifact/Claim文件是修订后的状态。要复查09-18当时的这些文件，应使用上述PR输入提交，而不能把当前文件倒推为旧轮次结果。
