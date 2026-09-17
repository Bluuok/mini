# Craft Agents｜可上传项目包

这是 Craft Agents 项目的完整交付包，已经把可调用 Skill、源码 Reference、付费项目内参和 QA 样本分开整理。

## 目录

```text
CraftAgents/
├── README.md                              # 本说明
├── skill/                                 # 可直接安装/调用的 Skill
│   ├── SKILL.md
│   ├── references/craft-agents-oss-main.zip # Craft Agents 源码
│   ├── references/                        # 规则、题库、场景路由、CodeWiki
│   ├── assets/                            # Manifest 和 JSON 模板
│   └── scripts/                           # 校验脚本
├── paid-reference（历史资料，非最新）/    # 原始付费项目内参与示例
└── qa-samples/                            # 非场景化、金融、电商、工业 QA 样本
```

## 如何使用 Skill

1. 将 `skill/` 整个目录复制到你的 Codex Skills 目录，并保留目录名 `craft-agents-resume-skill`。
2. 在任务中调用 `$craft-agents-resume-skill`，或者直接描述“基于 Craft Agents 生成简历/面试 QA”。
3. 提供目标岗位或 JD；如果没有指定行业，Skill 进入非场景化模式；如果提供行业或业务问题，先从 `skill/references/scenario-router.md` 选择一个场景。
4. 要生成简历时，Skill 输出项目名、项目简介和至少 4 条连续自然语言 Bullet；不单列技术栈。
5. 要准备面试时，Skill 先使用题库和 Claim；只有你要求深入解释某道题、源码级追问或技术细节时，才从 `skill/references/craft-agents-oss-main.zip` 按 `assets/source-manifest.json` 和 `codewiki-index.md` 定位源码。

## 推荐请求格式

```text
请使用 Craft Agents Resume Skill。
目标岗位：AI Agent 架构工程师
模式：面试 QA 预测
场景：电商经营决策 Agent
请为每条核心经历生成主问题、源码定位、架构/实现/取舍/失败/Ownership 追问，并给出可直接口述的连贯答案。
```

## 资料怎么分工

- `skill/` 是实际执行规则，不需要把 `paid-reference（历史资料，非最新）/` 加载进上下文。
- `paid-reference（历史资料，非最新）/` 仅用于历史资料、事实背景和技术追溯，不作为当前简历或面试 QA 的执行规范。
- 当前执行规范以 `skill/SKILL.md` 及 `skill/references/` 为准。
- `qa-samples/` 是已经生成的参考产物，用来观察输出质量和回答深度。
- 源码 ZIP 已放在 Skill 的 `references/` 中；普通简历生成不加载它，源码深挖时再按索引读取。

## 源码资产

- 文件：`skill/references/craft-agents-oss-main.zip`
- SHA-256：`ba48c941238e5fcf6ef6412c7fd53b30c863220ea81395e368013c38eb054871`
- 快照日期：2026-08-06
- 源码资料标注 Commit：`8981384b`
