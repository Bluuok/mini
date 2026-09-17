# paidgroup-agent-resume-skill

**付费群三项目（MiniCode / Craft Agents / HappyClaw）一体化简历与面试技能**：简历项目生成、JD 场景化对齐、面试 Q&A 预测、项目故事生成（含 Agent 设计方法论九阶段开发故事）、Full-flow 全流程、对抗式审查、CodeWiki 深挖，并融合 ASu 三命令（/asu 经历酥化、/resume 可编辑简历制作、/asu-resume 同款简历复刻）与 PDF 导出。

> 适用于 Claude Code / Codex / 通用 Agents（豆包 Mac App、Trae Solo 等）等支持 Agent Skill 的工具。

---

## 能力总览

### 一、三项目模式（MiniCode / Craft Agents / HappyClaw 原有能力，完整保留）

| 模式 | 触发 | 产出 |
| --- | --- | --- |
| **Resume 简历项目生成** | 给背景（角色 / 掌握程度 / 风险偏好），无 JD | **项目描述**（项目名称 + 项目简介一句话 + 技术栈 + 项目定位）→ **4-5 条四段式要点**（`针对[业务问题]，基于[技术]，设计了[工程方案]，实现了[验证效果]`，直接引用 `resume-points.md` 原文、标注 Rxx）→ 对应面试 Q&A → 降级警告 |
| **Scenario 场景化对齐** | 粘贴 JD / 公司背景 | 解构 JD → 场景-能力映射 → 改写 bullet（业务问题槽换成 JD 痛点，保持四段式）→ IM 桥接 → 对齐包 → 降级后定位复核 |
| **Q&A 面试预测** | "面试预测""面试官会问什么" | Step 1b 输出 Part 1-4：高频题 + 四段式答案 / 场景追问 / 薄弱追问与降级路径 / 30 秒 STAR 摘要 |
| **Story 项目故事** | "项目故事""讲清楚项目""STAR 故事" | Step 1c 输出 8 模块故事包（事实卡 / 业务故事 / 架构图 / 技术故事 / STAR / 追问树 / 多项目联动 / 技术速查） |
| **方法论开发故事（增强）** | Story 模式下按需 | 按 [references/story-methodology.md](references/story-methodology.md) 的**九阶段开发故事主线**（问题定义→骨架→分层→开发顺序→决策反例→评测闭环→安全治理→踩坑恢复→落地演进）组织整段开发故事，方法论五维 × 9 阶段 × 8 模块交叉对齐 |
| **Full-flow** | 粘贴 JD + 要面试准备 | Scenario → Q&A Prediction（含 Part 4）→ 对抗式审查 |
| **Deep-dive** | "深入讲 R06""基于 CodeWiki 解释" | 定位 codewiki 对应章节，源码级解释 |
| **对抗式审查** | "场景化简历审查""找漏洞" | 5 项清单：缺口、逻辑冲突、能力归属、场景覆盖、定位完整性 |

### 二、ASu 三命令（简历文件产出）

| 命令 | 能力 | 产出 |
| --- | --- | --- |
| `/asu` | 经历酥化 | 岗位定位、项目改写（四段式）、成果证据、HR 开场白 |
| `/resume` | 简历制作 | 可编辑 HTML 简历（18 套模板）、模板复刻、PDF 导出 |
| `/asu-resume` | 同款简历 | 复刻 ASu 单栏高密度技术简历、Logo 资源、PDF |

---

## 快速开始

### 安装

1. 把整个 `paidgroup-agent-resume-skill/` 目录放进你的 Agent skills 目录（任选其一或全部）：
   - Claude Code：`~/.claude/skills/`
   - Codex：`~/.codex/skills/`
   - 通用 Agents（豆包 Mac App / Trae Solo / Codex）：`~/.agents/skills/`
2. 多端统一：可用 [dbs-bridge](/dbs-bridge) 一键桥接（软链）到多个 Agent。

### 使用（第一句话这样说）

```
你是哪个项目？我的背景：目标岗位 XX，技术栈 XX，掌握程度 L1/L2/L3，风险偏好 保守/均衡/高阶。
请帮我：生成简历项目 / 粘贴 JD 场景化对齐 / 面试 Q&A 预测 / 项目故事 / 做简历文件。
```

意图不明时，Agent 会主动问：**哪个项目 + 有没有 JD + 要哪种模式**。

### 导出 PDF

浏览器打开生成的 HTML → 打印 → 另存为 PDF：**A4、背景图形开启、页眉页脚关闭、缩放 100%**。

---

## 核心输出规范（不可协商）

- **简历项目 = 项目描述 + 项目要点**：项目描述（名称 / 一句话简介 / 技术栈 / 定位）缺一不可；要点 4-5 条、四段式、**逐字引用 `resume-points.md` 原文**（不自行改写句式）。
- **真实性**：不编造指标、用户量、延迟、排名；没有数字写定性结果（风险收敛 / 一致性 / 受控）或 `待确认`。
- **能力归属**：每条 bullet 只声明所选 R 点 Scope Boundary 内能力；业务工具标为自建适配器；不把 roadmap 写成已实现。
- **前沿点（评测 / 自进化 / 安全）**：必须分离【项目实现】与【前沿认知】，论文数字只进面试 talking points。
- **故事真实性标签**：【本人实际参与】/【项目整体架构】/【待确认】全程使用。
- **隐私**：只把你的真实个人信息写入你要求的简历文件，不写入 skill 模板、示例或说明文档。

---

## 目录结构

```text
paidgroup-agent-resume-skill/
├── SKILL.md                       # 入口：模式路由 + ASu 三命令
├── README.md                      # 本文件
├── agents/openai.yaml             # Agent 市场接口配置
├── references/
│   ├── project-router.md          # 三项目定位、默认方案、IM 能力、codewiki 运行时定位
│   ├── story-methodology.md       # ★ 项目故事方法论增强：九阶段开发故事主线
│   ├── suhua.md                   # /asu 酥化规则
│   ├── resume-html.md             # /resume 制作与 PDF 验收规则
│   ├── same-style-template.md     # /asu-resume 复刻规则
│   ├── asu-resume-template.md     # ASu 单栏高密度版式参数与 Logo 表
│   ├── minicode/                  # MiniCode 精选 refs（R 点 / 方案 / 题库 / 盘问 / 索引 / 工作流）
│   ├── craft-agents/              # Craft Agents 精选 refs
│   └── happyclaw/                 # HappyClaw 精选 refs
└── assets/                        # ASu 全套资产（18 套模板、logos、icons、示例照片）
```

---

## 三项目证据与 codewiki 定位

- 每个项目的 **R 点库、方案组合、面试题库、用户盘问、完整工作流** 都打包在 `references/<项目>/`，不依赖网络。
- **全量 codewiki 文档按运行时定位读取**，默认路径：`03-定稿/付费群文档汇总/三项目codewiki/<项目>/`；找不到时 Agent 会询问实际路径。
- Deep-dive 只读取对应 `Wxx` 章节，不加载整本手册。

---

## 边界与免责

- 不虚构头衔、公司、项目、技术栈或数据；每个强 claim 都能被追问（R 点 Scope Boundary / codewiki 描述 / 你的真实证据）。
- 场景化对齐中的行业痛点属于**合理假设**，投递前请按目标公司真实业务核对。
- 模板中的姓名、照片、联系方式均为**虚构示例**，请替换为真实信息。

---

## 版本记录

| 版本 | 说明 |
| --- | --- |
| v1.0 | 三项目 skill 原样迁移 + ASu 三命令融合；强化简历输出契约（项目描述 + 四段式 verbatim 要点）；新增项目故事方法论增强层（九阶段开发故事主线） |

---

## FAQ

- **三项目 refs 与 codewiki 的关系？** refs 是精选（选点/题库/方案/工作流），codewiki 是源码级全量文档，Deep-dive 时按运行时路径读取。
- **四段式要点能自己改吗？** 默认逐字引用要点库原文；仅当你有特定表述需求时微调措辞，四段式结构与技术表述不得改变。
- **想做简历文件怎么办？** 三项目模式产出文字后，说 `/resume`（普通模板）或 `/asu-resume`（ASu 同款）即可生成可编辑 HTML 并导出 PDF。
