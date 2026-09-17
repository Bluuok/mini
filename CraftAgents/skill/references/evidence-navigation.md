# Evidence Navigation Index（Craft Agents）

本文件解决“编号知道了，但不知道去哪里找”的问题。它不是简历内容，而是 Skill 的导航规则。

## 路径约定

- **Skill-relative**：相对于 `craft-agents-resume-skill/`，例如 `references/resume-points.md`。
- **Workspace-relative**：相对于本项目根目录，例如 `craft-agents付费版内参/craft-agents-resume-skill/references/resume-points.md`。
- **Project-relative**：相对于被分析的 Craft Agents 源码根目录，例如 `packages/pi-agent-server/src/index.ts`。
- 面向用户输出时，优先同时给出 Workspace-relative 或 Project-relative 路径；不能只输出一个裸编号。

## 编号到位置的映射

| 编号 | 含义 | Skill-relative 位置 | 查找方式 |
|---|---|---|---|
| `A01` / `A02` | 当前输出的场景 Artifact | 当前生成文件的 `# Artifact Inventory` | 找对应 Artifact ID 行；再看 Evidence 与 Scope |
| `artifact-fin-001` / `artifact-ecom-001` | 场景 Artifact 的长 ID | 当前生成文件的 `# Artifact Inventory` | 与 `A01` 等短 ID按本次输出表对应，不跨文件猜测 |
| `claim-*` | 当前输出的 Claim | 当前生成文件的 `# Claim / Evidence / Ownership 审计` | 找 Claim 行，再沿 Artifact、证据和门控结果回溯 |
| `R01–R27` | Craft Agents 基座简历要点 | `references/resume-points.md` | 搜索表格中的 `| Rxx |` |
| `Hxx` | Harness 深挖要点 | `../05-CraftAgents-Harness与Runtime要点扩充-付费版.md` | 搜索对应 `Hxx`；边界先看 `references/harness-runtime-map.md` |
| `RTxx` | Runtime 深挖要点 | `../05-CraftAgents-Harness与Runtime要点扩充-付费版.md` | 搜索对应 `RTxx`；边界先看 `references/harness-runtime-map.md` |
| `PS01–PS10` | Pi SDK / Harness 机制 | `references/pi-sdk-harness.md` | 搜索 `## PSxx` |
| `W00–W14` | CodeWiki 技术事实 | `references/codewiki-index.md` | 先找 `Wxx` 段落，再按其中的中文技术手册或 DeepWiki 行号读取 |
| `Q01–Q27` | 面试追问与验证路径 | `references/interview-qa.md` | 先找 `Rxx → Qxx.x`，再进入对应 `## Qxx` |
| `S01–S05` | 旧场景兼容索引 | `references/scenario-architecture.md` | S01 数据接入、S02 知识/记忆、S03 SOP/治理、S04 Eval、S05 Reviewer；不是 Bullet 配额 |
| `finance-research` | 金融 Research route | `references/scenario-router.md` + `references/scenario-architecture.md` | 读取金融章节，不默认加载整个场景库 |
| `ecommerce-operations` | 电商经营 route | `references/scenario-router.md` + `references/scenario-architecture.md` | 读取电商章节，不默认加载整个场景库 |

## Skill 必须如何回应用户的“这个编号在哪”

输出至少包含以下四项：

```text
定位：R21
含义：Pi Agent Server 进程外 JSONL 协议
位置：craft-agents付费版内参/craft-agents-resume-skill/references/resume-points.md，R21 表格行；深挖资料见 references/codewiki-index.md 的 W11，再读 references/Craft-Agents-中文技术手册.md 对应行
下一步：先读 R21 的 Scope Boundary，再进入 Q21.x 做面试验证。
```

对于当前输出中的 `Axx` 或 `claim-*`，还必须附上：

```text
当前文件：<生成文件路径>
当前章节：# Artifact Inventory 或 # Claim / Evidence / Ownership 审计
源码位置：<Project-relative path，如存在>
状态：Implemented / Prototype / Scenario Extension / Design-only
```

## 不完整编号的处理

用户只说“401”“101”“那个 01”或只给一串数字时，不得猜成 `R01`、`A01` 或 `artifact-001`。先在当前输出包、Claim Ledger 和相关 Skill references 中检索精确字符串；若仍有多个候选，列出候选及其路径，并说明需要用户确认前缀。

## 输出约束

- 导航表和编号可以出现在审计区、面试区和证据索引区。
- 可贴简历区仍禁止出现 `R/H/RT/S/W/Q`、`Axx`、Claim ID、`route_id` 和 Artifact 状态。
- 生成完整输出包时，在 Claim 审计前增加 `# Evidence Navigation`；每个内部编号第一次出现时就给出相对路径，不能把路径只放在文末。
