# MiniCode Resume Skill 使用说明

MiniCode Resume Skill 是一个面向 AI Agent 的简历项目生成技能。

它的作用不是再给你一篇固定模板，而是让 Agent 根据你的背景、目标岗位和掌握程度，把 MiniCode 这个 AI Agent 项目包装成一段可以写进简历的项目经历，并自动配套生成面试 Q&A、技术追问准备和 CodeWiki 深挖依据。

简单说：你拿到的不只是“MiniCode 简历怎么写”，而是一个可以反复调用的 Agent 项目包装器。

适合这些场景：

- 你想把 MiniCode 写成 AI Agent、后端、CLI 工具链或工程架构方向的简历项目。
- 你不知道自己该选哪些技术点，想让 Agent 帮你从 25 个要点里挑 4-5 个最适合的。
- 你担心简历写得太虚，想让每个 bullet 都能对应到面试 Q&A 和 CodeWiki 依据。
- 你已经写了一版 MiniCode 项目经历，想让 Agent 帮你优化表达、降低风险、准备追问。

## 你会拿到什么

下载后，请确认文件夹结构大致如下：

```text
minicode-resume-skill/
├── SKILL.md
├── README.md
├── agents/
│   └── openai.yaml
└── references/
    ├── resume-points.md
    ├── interview-qa.md
    ├── combo-plans.md
    ├── user-intake.md
    ├── codewiki-index.md
    └── MiniCode-Complete-CN.md
```

其中：

- `SKILL.md` 是 Agent 读取的技能入口。
- `references/resume-points.md` 是简历要点库的 Agent 压缩版。
- `references/interview-qa.md` 是面试 Q&A 的 Agent 压缩版。
- `references/combo-plans.md` 是不同岗位和基础对应的组合方案。
- `references/user-intake.md` 是 Agent 用来追问你背景的清单。
- `references/codewiki-index.md` 是 CodeWiki 检索索引。
- `references/MiniCode-Complete-CN.md` 是完整 CodeWiki，用于技术深挖和校验。

不要只复制 `SKILL.md`。这个 Skill 的价值主要来自 `references/` 里的资料，尤其是完整 CodeWiki。

## 下载方式

如果你收到的是网盘、飞书、GitHub 或压缩包链接：

1. 下载整个 `minicode-resume-skill` 文件夹。
2. 如果下载下来是 `.zip`，先解压。
3. 确认解压后的文件夹根目录里能看到 `SKILL.md`。
4. 如果文件夹名变成了 `minicode-resume-skill-main` 或类似名字，建议重命名为 `minicode-resume-skill`。

最终你应该得到一个完整文件夹：

```text
minicode-resume-skill/
```

## 安装到 Codex

如果你使用的是 Codex，并且支持本地 Skills，把整个文件夹复制到本机的 Codex Skills 目录。

macOS / Linux：

```bash
mkdir -p ~/.codex/skills
cp -R /你的下载路径/minicode-resume-skill ~/.codex/skills/
```

示例：

```bash
mkdir -p ~/.codex/skills
cp -R ~/Downloads/minicode-resume-skill ~/.codex/skills/
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force $env:USERPROFILE\.codex\skills
Copy-Item -Recurse .\minicode-resume-skill $env:USERPROFILE\.codex\skills\
```

安装后检查：

```bash
ls ~/.codex/skills/minicode-resume-skill/SKILL.md
ls ~/.codex/skills/minicode-resume-skill/references/MiniCode-Complete-CN.md
```

如果这两个文件都能看到，说明核心文件已经放对。

## 安装到其他支持 Skill 的 Agent

如果你用的不是 Codex，而是其他支持本地 Skill / Agent Skill / 自定义技能的客户端，原则也一样：

1. 找到该 Agent 的本地 skills 目录。
2. 把整个 `minicode-resume-skill` 文件夹复制进去。
3. 确认 `SKILL.md` 位于技能文件夹根目录。
4. 确认 `references/` 文件夹没有丢失。
5. 重启或刷新 Agent，让它重新加载技能列表。

如果你使用的是普通网页聊天产品，且它不能读取本地文件夹，那么它通常无法直接“安装”这个 Skill。你可以改为把整个文件夹上传到项目知识库、文件区或工作区里，再让 Agent 按 `SKILL.md` 的流程执行。

## 第一次使用

安装完成后，重启 Codex 或刷新你的 Agent，然后直接发起类似请求：

```text
请使用 MiniCode Resume Skill，根据我的背景生成一版 MiniCode 简历项目经历。

我的背景：
- 目标岗位：AI 应用开发
- 技术栈：Python、TypeScript、React
- 我比较熟悉：Agent 基本流程、工具调用、上下文管理
- 我不太熟悉：MCP 协议细节

请输出：
1. 项目名称
2. 项目简介（一句话）
3. 技术栈
4. 4-5 条简历 bullet（每条按"针对xx业务问题，基于xx技术，设计了xx工程方案，实现了xx验证效果"四段式输出）
5. 每条 bullet 对应的面试 Q&A
6. 哪些点有面试风险
```

如果你不知道自己适合写什么，可以这样问：

```text
请使用 MiniCode Resume Skill，先问我必要背景问题，然后帮我判断 MiniCode 项目最适合写成哪种简历版本。
```

## 推荐使用流程

第一次使用建议按这个顺序来：

1. 先让 Agent 询问你的背景、目标岗位和掌握程度。
2. 让 Agent 从组合方案里选一个方向。
3. 让 Agent 只选 4-5 个 `Rxx` 简历要点，不要贪多。
4. 让 Agent 输出项目经历、技术栈和 bullet。
5. 让 Agent 给每个 `Rxx` 匹配对应 `Qxx.x` 面试题。
6. 对你不熟的点，要求 Agent 降级表达或替换成更稳的点。
7. 对你想重点冲刺的点，再要求 Agent 基于 CodeWiki 深挖。

## 深挖某个技术点

普通生成简历时，Agent 不需要读取完整 CodeWiki。只有当你要准备强追问、源码解释或高阶技术点时，再让 Agent 使用 CodeWiki。

示例：

```text
请基于 MiniCode CodeWiki 深挖 R06 上下文压缩。
要求：
1. 解释这个点解决了什么问题
2. MiniCode 里大概怎么实现
3. 面试官可能怎么追问
4. 我应该怎么回答
5. 哪些说法不能写成已实现能力
```

也可以这样优化单条 bullet：

```text
请使用 MiniCode Resume Skill，基于 CodeWiki 帮我优化这条 bullet：
“实现了上下文压缩机制，提升 Agent 长任务稳定性。”

要求：
1. 不夸大
2. 更像真实工程项目
3. 给出对应面试解释
4. 标注它对应哪个 Rxx / Qxx / CodeWiki 主题
```

## 输出结果应该长什么样

一次合格输出通常应该包含：

- 项目定位：MiniCode 是什么，为什么适合作为简历项目。
- 技术栈：Agent Loop、Tool System、MCP、Skills、Context Compression、TUI、Session、Config 等。
- 简历 bullet：只保留 4-5 条，避免写成技术清单；每条按"针对xx业务问题，基于xx技术，设计了xx工程方案，实现了xx验证效果"四段式输出。
- 编号映射：每个 bullet 对应 `Rxx` 简历点。
- 面试准备：每个 `Rxx` 对应 `Qxx.x` 面试问题。
- 风险提示：哪些点你不熟，哪些表述要降级。
- 深挖依据：需要时引用 `codewiki-index.md` 和完整 CodeWiki。

## 好用的提示词

生成简历项目：

```text
请使用 MiniCode Resume Skill，把 MiniCode 包装成适合我背景的简历项目。先判断我适合 AI 应用、后端、CLI 工具链还是 Agent 架构方向，然后只选 4-5 个最稳的点。
```

保守版本：

```text
请使用 MiniCode Resume Skill，给我一版面试风险较低的 MiniCode 项目经历。不要写我很难解释的高阶点。
```

高阶版本：

```text
请使用 MiniCode Resume Skill，给我一版偏 Agent 架构方向的高阶 MiniCode 项目经历。但所有高阶表述都必须能被 CodeWiki 支撑，不能把未来规划写成已实现。
```

面试冲刺：

```text
请使用 MiniCode Resume Skill，根据我已经选的 R01、R08、R10、R15、R18，生成一份面试追问清单。每个问题都要给出回答框架、常见误区和降级说法。
```

修改已有简历：

```text
请使用 MiniCode Resume Skill，审查我这段 MiniCode 项目经历是否虚、是否难解释、是否需要降级。然后给我一版更稳的改写。
```

## 场景化对齐（贴 JD 自动切换）

当你有目标岗位的 JD 时，贴上 JD 和公司背景，Skill 会自动进入场景化模式，把 MiniCode 重新框定到目标公司的业务场景。

```text
请使用 MiniCode Resume Skill，根据以下 JD 帮我做场景化对齐：

【JD】
<粘贴岗位描述>

【公司背景】
行业：中型科技公司 / Agent 平台团队
用的 IM：飞书

【我的掌握度】L2，目标岗位：AI 应用工程师
```

你会拿到：

- **场景映射表**：公司业务场景 → 痛点 → 映射的 MiniCode 能力（R 点）→ 改写方向
- **重写简历条目**：3-5 条 bullet，贴公司业务，按已实现写，每条标注 Rxx
- **面试 talking points**：四段式（解决问题/怎么实现/为什么这样设计/局限与扩展）+ 预判追问
- **落地增强**：cc-connect 接 IM 的配置与卖点（标注外部依赖）
- **对抗式审查**：5 项检查（漏洞/逻辑冲突/能力归因/场景-能力覆盖/定位完整性）

## 面试 Q&A 预测

不用等面试才准备。贴上 JD，让 Skill 预测面试官会问什么，并给出四段式答案和降级建议。

```text
请使用 MiniCode Resume Skill，根据以下 JD 预测面试问题。我选了 R01、R08、R10、R15、R18，掌握度 L2。

【JD】
<粘贴岗位描述>
```

你会拿到四部分：

1. **按 R 点的高频预测题 + 四段式答案**：基于 interview-qa.md 静态题库 + JD 特定追问，每题标注来源（R 点基线 / JD 特定）
2. **场景化追问**：interview-qa.md 没覆盖的岗位特有问题（如 JD 要求 RAG 就追问 RAG 细节）和公司特有问题（如跨境公司问数据合规）
3. **扛不住的追问 + 降级建议**：基于掌握度预测 L2 扛不住的源码级追问，每条给具体降级路径（如"R06 讲不清 → 降级到 R05"）
4. **项目故事摘要**：每条 bullet 的 30 秒电梯版 STAR + 关键追问防守，指向完整版项目故事（见下节）

## 项目故事生成

面试时需要从头到尾说清"为什么做、怎么运转、我做了什么、被追问怎么不露怯"。贴上"项目故事"触发词，Skill 会生成完整 8 模块故事包。

```text
请使用 MiniCode Resume Skill，帮我用 MiniCode 生成项目故事，讲清楚项目怎么迭代的、我负责哪些板块。
```

你会拿到 8 个模块：

| 模块 | 内容 |
|------|------|
| 项目事实卡 | 项目名称/业务用户/痛点/目标/核心链路/我的职责/协作边界/待确认问题，每条标注【本人实际参与】/【项目整体架构】/【待确认】 |
| 业务故事 | 用户是谁、原来怎么做、项目改变什么、我的角色、"输入→处理→输出→反馈"闭环 |
| 架构与数据流 | Mermaid 架构图 + 输入/输出/状态/异常表 + 架构解读，标注【本人参与】 |
| 技术故事 | 每个 R 点的业务问题/输入输出/边界/失败恢复 |
| 我的故事（STAR） | 每条 bullet 转 STAR，含 30 秒电梯版/90 秒标准版/3 分钟深讲版/追问第一人称回答 |
| 拷打问题树 | ≥8 轮问题，每轮 2 层追问，含简答/展开答/诚实答法 |
| 多项目串联 | 能力演进线 + 方法复用线 + ≥10 轮跨项目拷打 |
| 技术关系速记 | 通俗比喻 + 严格定义 + 在我项目中的位置 |

## 全流程（贴 JD 一站完成）

如果你同时有 JD 且想要完整准备，贴 JD 后说"全流程"，Skill 会按顺序执行：场景化对齐 → Q&A 预测（含故事摘要）→ 对抗式审查 → 定稿。

```text
请使用 MiniCode Resume Skill，根据以下 JD 帮我做全流程：场景化简历 + 面试 Q&A 预测 + 对抗式审查。

【JD】
<粘贴岗位描述>

【公司背景】
行业 / 业务模式 / 团队规模 / 用的 IM

【我的掌握度】L2，保守偏好
```

## 注意事项

- 不要让 Agent 一次写 10 个以上技术点。简历里通常只需要 4-5 个最能讲清楚的点。
- 不要把 CodeWiki 里的路线图、未来规划、扩展设想写成已经完成的能力。
- 不要要求 Agent 编造性能数据、用户量、线上收益或业务指标。
- 如果你对某个技术点只能听懂不能讲清楚，就让 Agent 降级为更基础的表达。
- 面试前一定要用 `Qxx.x` 逐条练习，不要只复制 bullet。

## 常见问题

### 1. Agent 没有自动触发这个 Skill 怎么办？

在提示词里明确写：

```text
请使用 MiniCode Resume Skill
```

或者直接说明任务：

```text
帮我把 MiniCode 写成简历项目，并给出对应面试 Q&A。
```

### 2. Agent 说找不到 CodeWiki 怎么办？

检查这个文件是否存在：

```text
minicode-resume-skill/references/MiniCode-Complete-CN.md
```

如果没有，说明你只复制了部分文件，需要重新下载完整文件夹。

### 3. 生成内容看起来太高级，怕面试讲不出来怎么办？

让 Agent 执行降级：

```text
请把这版 MiniCode 简历项目降级到我能解释的水平。保留工程感，但不要写我无法回答追问的高风险点。
```

### 4. 可以直接复制 Agent 生成的简历吗？

可以作为初稿，但建议至少做两步：

1. 删除你不熟悉的技术点。
2. 用对应的 `Qxx.x` 面试题练到能口头讲清楚。

### 5. 这个 Skill 和付费版内参是什么关系？

付费版内参是给人读的学习资料，帮助你理解每个简历点、组合方案和面试风险。

MiniCode Resume Skill 是给 Agent 用的执行工具，帮助你把这些资料转化成个性化简历项目、面试 Q&A 和技术深挖解释。

两者共用同一套编号体系：`Rxx` 是简历点，`Qxx.x` 是面试题，CodeWiki 主题是技术依据。

## 最小验证清单

安装后，你可以用下面这句话测试：

```text
请使用 MiniCode Resume Skill，给一个后端开发同学生成 MiniCode 简历项目，要求选择 4-5 个 Rxx 点，并给出对应 Qxx 面试准备。
```

如果输出里包含：

- 4-5 个简历 bullet
- `Rxx` 编号
- `Qxx.x` 面试题
- 面试风险提示

说明 Skill 已经可以正常使用。
