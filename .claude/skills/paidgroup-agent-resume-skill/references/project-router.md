# Project Router：三项目定位与证据来源

三项目 = MiniCode（轻量级终端编码助手）、Craft Agents（lukilabs/craft-agents-oss，AI Agent 桌面工作台）、HappyClaw（自托管多用户 Claude Code 智能体工作台）。本文件用于酥化（/asu）、简历制作（/resume）和同款简历（/asu-resume）时的项目知识定位。

## 选择规则

1. 用户提到项目名或与某项目相关的技术点 → 选对应项目。
2. 用户提到“三项目”但没说哪个 → 问用户选哪个项目，或让用户描述所做内容后判断。
3. 用户经历不涉及三项目 → 不使用项目 refs，直接按 /asu 通用酥化流程，材料以用户提供为准。

## 精选 refs（已随 skill 安装）

| 项目 | refs 目录 | 关键文件 |
| --- | --- | --- |
| MiniCode | `references/minicode/` | `resume-points.md`（R 点与 Scope Boundary）、`combo-plans.md`（方案组合）、`interview-qa.md`（面试题库）、`user-intake.md`（用户盘问）、`codewiki-index.md`（Wxx 索引） |
| Craft Agents | `references/craft-agents/` | 同上 |
| HappyClaw | `references/happyclaw/` | 同上 |

使用顺序（酥化/简历制作时）：

1. `user-intake.md`：用户背景、目标岗位、掌握程度 L2/L3、风险偏好缺失时先补问。
2. `resume-points.md`：选 4—5 个 R 点，先看每点 Scope Boundary，不超界。
3. `combo-plans.md`：按目标岗位选默认方案（MiniCode 默认 Plan G，Craft Agents 默认 Plan H，HappyClaw 默认 Plan H）；高风险点按 user-intake 规则降级。
4. `interview-qa.md`：面试 Q&A 预测、追问准备。
5. `codewiki-index.md`：深挖技术点时用，只读相关 Wxx 段落。

## codewiki 运行时定位

全量文档不随 skill 打包，按运行时定位读取。默认根路径（相对当前工作区）：

| 项目 | 默认路径 | 文件形态 |
| --- | --- | --- |
| MiniCode | `03-定稿/付费群文档汇总/三项目codewiki/MiniCode-main/` | 01-30 编号 md + `wiki.json` |
| Craft Agents | `03-定稿/付费群文档汇总/三项目codewiki/craft-agents-oss/` | 主题目录 + `craft-agents-oss_zread_full.md` + `manifest.md` |
| HappyClaw | `03-定稿/付费群文档汇总/三项目codewiki/happyclaw-main/` | 01-30 编号 md + `wiki.json` |

读取规则：

- 先确认路径存在；不存在时询问用户实际路径或可用的 codewiki 位置，不自行猜测内容。
- 深挖某个 R 点时，先用该项目的 `codewiki-index.md` 找对应 Wxx，再只读匹配文件/段落。
- MiniCode/HappyClaw：按主题匹配编号文件（如 R08 工具系统 → MiniCode `05-内置工具与本地快捷指令.md` / `08-统一工具协议…`），可用 `wiki.json` 做 slug→文件映射。
- Craft Agents：主题目录名含主题词（如 `BaseAgent_抽象_lukilabs_craft-agents-oss`），或直接读 `craft-agents-oss_zread_full.md` 按段落定位；`manifest.md` 提供索引。
- 只提取已实现的行为、数据流、取舍和失败模式；路线图/规划类描述写成“设计理解/可扩展性”，不写成已完成的线上能力。

## 四段式 bullet 结构（三项目通用）

酥化与简历中，每个 bullet 保持四段式：

```text
针对[业务问题]，基于[技术]，设计了[工程方案]，实现了[验证效果]。
```

- 业务问题：默认用项目真实痛点；场景对齐（有 JD）时换成 JD 场景痛点。
- 验证效果：无可靠数字时写定性结果或“目标/预期”，不编造指标。
- 前沿点映射（JD 含 评测/评估/质检 → 行为评测；技能/知识沉淀/进化 → 能力治理；安全/合规/权限/审计 → 工具执行安全/纵深防御）：项目真实能力进 bullet，论文证据只进面试 talking points，严禁写进 bullet。

## 各项目默认方案与场景化参数

Scenario 对齐（Step 1a）时，未选方案的用户用以下默认，并按下述规则降级：

| 项目 | 默认方案 | 默认 R 点 | 高风险点降级 |
| --- | --- | --- | --- |
| MiniCode | Plan G | R01 R08 R10 R15 R18 | R06→R05（L2）；R13→R14 不建议，走 R18 兜底 |
| Craft Agents | Plan H | R03 R06 R08 R12 R18 | R06→R10；R18→R17 |
| HappyClaw | Plan H | R01 R07 R11 R15 R23 | R23→R19（须同步去掉“multi-tenant”，改“multi-user Agent workstation + digital employee”） |

### 前沿点编号（各项目不同，务必用对应 refs）

| 主题 | MiniCode | Craft Agents | HappyClaw |
| --- | --- | --- | --- |
| 评测/评估/质检 | R23（受控验证闭环） | R25（行为评测与契约验证） | R25（行为评测与可观测底座） |
| 技能/知识沉淀/进化 | R24（Skills 渐进披露与治理） | R26（多源能力接入与技能治理） | R26（数字员工能力治理与进化） |
| 安全/合规/权限/审计 | R25（受控执行与安全边界） | R27（工具执行安全与最小暴露） | R27（纵深防御与信任边界） |

### IM 能力（落地增强，各项目不同）

| 项目 | 原生 IM 能力 | 需外部桥接 | 边界 |
| --- | --- | --- | --- |
| MiniCode | 无原生 IM | cc-connect | cc-connect 只做文本消息桥接，无 IM 内 diff 审批卡片；自研适配标“规划中” |
| Craft Agents | R22 Messaging Gateway：Telegram / Lark(含飞书) / WhatsApp | 钉钉 / 企微 / Slack 走 cc-connect | R22 落地增强遵守掌握程度规则（L2 不深挖）；自研适配标“规划中” |
| HappyClaw | 7 渠道：飞书 / Telegram / QQ / 钉钉 / 微信 / Discord / WhatsApp | 企微走 cc-connect wecom | 微信渠道=iLink/仅 P2P，非企业微信开放平台；各渠道能力有差异（WhatsApp 有封号风险、微信无群聊），不得写成“全部渠道功能一致” |

## 能力归属护栏

- 改写只改变叙事框架，不改变能力层级；每个 R 点只能声明其 Scope Boundary 内的能力。
- 非项目原生能力（业务 API、外部系统集成、IM 桥接）必须标注 R 点归属与是否自建。
- 常见越界模式：把数据采集层说成指标系统、把文件级 diff 审查扩展到非文件动作、把负载均衡说成任务路由、把 Web 登录认证说成 Agent 运行时身份。
- IM 落地：HappyClaw 原生 7 渠道（微信为 P2P，非企微；企微需 cc-connect 适配）；Craft Agents 原生 R22（Telegram/飞书/WhatsApp）；MiniCode 无原生 IM，需 cc-connect 桥接。渠道能力差异不得写成“全部渠道功能一致”。
