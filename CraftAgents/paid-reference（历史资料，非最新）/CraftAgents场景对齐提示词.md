# Craft Agents 简历场景对齐提示词

> 将本目录作为工作目录，并把下方任务与 JD / 公司背景一起交给本地 Agent。正式规则以 `craft-agents-resume-skill/SKILL.md` 为入口；本文件不复制完整规则，避免双轨漂移。

## 任务

使用 `./craft-agents-resume-skill` 将 Craft Agents 建模为目标行业的 Agent 项目经历。必须先读取完整 `SKILL.md`，再按其 Reference Routing 只加载当前 route 需要的资料。

输入：

- JD 与公司背景；
- 目标岗位；
- 候选人真实参与范围与可提供的代码、Schema、Trace、Test；
- 可选：掌握度、风险偏好、已有简历。

## 强制生成链路

```text
事实抽取
→ Agent Architecture Mapping
→ 能力缺口分析
→ 动态场景 Artifact 推导
→ Artifact Status + Ownership + Evidence + Scope Gate
→ Coverage Check + 竞争力排序
→ Claim-Evidence Ledger
→ 最终简历
```

先读：

- `./craft-agents-resume-skill/references/agent-project-modeling.md`
- `./craft-agents-resume-skill/references/scenario-router.md`
- `./craft-agents-resume-skill/references/scenario-architecture.md`
- `./craft-agents-resume-skill/references/claim-evidence-ledger.md`
- `./craft-agents-resume-skill/references/resume-points.md`

route 确认后，只读 `multi-industry-agent-scenario-library.md` 的对应段落。不要加载整个场景库。

## 硬性要求

1. R/H/RT/S 是事实索引，不是生成上限，也不决定 Bullet 配额。
2. 场景化必须新增可指认的 Adapter、CLI/MCP、Schema、Knowledge/Memory、Domain Skill/SOP、Trace、Dataset、Agent Eval、Regression Gate 或 Reviewer；只替换行业词视为失败。
3. 每个 Artifact 标记 `Implemented / Prototype / Scenario Extension / Design-only`。没有场景实现证据时默认后两者。
4. 项目能力不等于个人 Ownership；Owner、生产、指标和业务效果必须有用户或材料证据。
5. Coverage 用于暴露缺口，不为覆盖六层而虚构能力。
6. 金融场景围绕 `Claim → Evidence → Source → Timestamp`；电商场景围绕 `Monitor → Detect → Investigate → Decide → Act`，价格仅为子流程。
7. Craft 的 ServerBuilder/SessionToolContext 是工具接入框架，不等于已实现业务 Tool；Workspace 不是数据库行级多租户隔离；原生消息网关仅 Telegram、Lark/飞书、WhatsApp。

## 输出

- 可贴简历版：项目名、一句话简介、技术栈、4–5 条自然语言 Bullet；
- Agent Architecture Mapping；
- Artifact Inventory；
- Coverage Check；
- Claim / Evidence / Ownership 审计；
- 场景增量与基座边界；
- 待确认项和降级措辞；
- 面试追问入口。

黑体摘要优先使用 `MCP / CLI`、`Agent Harness`、`Tool Calling`、`Context Engineering`、`Agent Runtime`、`Memory`、`Agent Eval / Trace Benchmark` 等招聘者可识别概念。正文交代问题、实现、Artifact 和效果，不用固定连接词的机械齐全代替质量。

可贴简历区禁止出现 R/H/RT/S、L0–L4、掌握度、route_id、Claim ID、Artifact 状态或审计标签。

## 对抗审查

让独立审查者逐条验证：Agent 层、技术摘要、具体 Artifact、Agent 相关性、证据、状态、Ownership、Scope、场景增量、Coverage、同源重复、项目定位与面试展示入口。失败项降级、移出核心 Bullet 或转待确认。
