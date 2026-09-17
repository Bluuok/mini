const n=`Miniclaw 中每一个自定义 Agent 的"人格"并非一段自由文本，而是被严格切分为 IDENTITY、SOUL、AGENTS、TOOLS 四个语义段落，经宿主侧规范化拼装后传入容器内的 Agent Runner，再嵌入一个顺序固定的平台级系统提示词计划中。本页拆解这条完整管线：四段的契约定义、宿主与 Runner 的两级组装、块级哈希审计，以及防止静态上下文撑爆模型窗口的三层预算防线。阅读前建议先了解 [Agent Profile、Workspace 与 Session 层级](5-agent-first-chan-pin-mo-xing-agent-profile-workspace-yu-session-ceng-ji) 中的 AgentProfile 概念。

## 四段契约：语义切分与必填边界

四段提示词的权威定义位于 Agent Builder 的工具 Schema 中。\`agentDefinitionSchema\` 将每段限制为最大 20,000 字符，其中 IDENTITY 与 AGENTS 为必填段，SOUL 与 TOOLS 可为空。各段的职责边界在字段描述中被明确固化：IDENTITY 只放角色、核心使命与能力边界，"不得放入工作流、命令示例或工具指令"；SOUL 承载持久价值观、判断原则、气质与沟通风格；AGENTS 承载可执行的工作流、输入输出、分支与失败处理；TOOLS 描述如何选用已配置的 Skills、MCP 与工具（含顺序和限额），且"不得整篇复制 Skill 文档"。工具描述还给出一条组合原则：保持 IDENTITY 精炼、把操作性流程放进 AGENTS，只有当 SOUL 和 TOOLS 能提供有效信息时才填写它们，永远不要把整个 Agent 规格塞进 \`identity_prompt\`。

| 段落 | 必填 | 字符上限 | 职责边界 | 明确禁止 |
|------|------|----------|----------|----------|
| IDENTITY | 是 | 20,000 | 角色、核心使命、能力边界 | 工作流、命令示例、工具指令 |
| SOUL | 否 | 20,000 | 价值观、判断原则、气质、沟通风格 | 机械型 Agent 可留空 |
| AGENTS | 是 | 20,000 | 工作流、输入输出、默认值、分支、拒绝规则、失败处理 | — |
| TOOLS | 否 | 20,000 | Skills/MCP/工具的选择策略、顺序与限额 | 整篇复制 Skill 文档 |

Sources: [mcp-tools.ts](container/agent-runner/src/mcp-tools.ts#L2242-L2272)、[mcp-tools.ts](container/agent-runner/src/mcp-tools.ts#L2365-L2373)

这套契约同样由宿主侧常量兜底：\`AGENT_PROMPT_SECTION_MAX_LENGTH = 20_000\` 定义在 \`src/agent-profile-prompts.ts\` 中，AI 生成器在产出单段提示词时若超限会直接报错"请缩小要求后重试"，而非静默截断。

Sources: [agent-profile-prompts.ts](src/agent-profile-prompts.ts#L3)、[agent-profile-generator.ts](src/agent-profile-generator.ts#L137-L139)

## 宿主侧拼接：四段合为一个 identityPrompt

四段数据以结构化字段持久化于 AgentProfile，但跨进程传输时并不保留四个独立字段，而是由宿主侧的 \`buildAgentProfilePrompt\` 按 **IDENTITY → SOUL → AGENTS → TOOLS 的规范顺序** 拼接为单一 Markdown 文本。实现上先用空格 trim 过滤掉空段，再将每个非空段格式化为 \`## 段落名\` 标题加正文的形式，最后以空行连接。函数注释强调了一个关键边界约束：这并不是完整的 Miniclaw 系统提示词——平台运行时、渠道与记忆指令在此块之外追加，\`prompt_mode=replace\` 也无法移除它们。

Sources: [agent-profile-prompts.ts](src/agent-profile-prompts.ts#L58-L78)

拼接结果通过 \`toContainerAgentProfile\` 装入容器输入：\`identityPrompt\` 字段携带拼接后的文本，\`includeClaudePreset\` 由 \`prompt_mode\` 推导（\`append\` 为 true），同时传递 \`identityHash\` 与 \`runtimePolicy\` 供 Runner 审计使用。

Sources: [index.ts](src/index.ts#L2185-L2201)

对于存量数据，迁移策略体现了对旧语义的忠实：旧版"一体化 identity prompt"大多描述的是操作行为而非狭义身份，因此 \`agentProfilePromptsFromLegacy\` 将其无损迁入 \`agents_prompt\` 而非伪装成新的窄义 IDENTITY 段；\`prompt_mode\` 则由旧 \`includeClaudePreset\` 布尔值反向推导（false 映射为 \`replace\`）。

Sources: [agent-profile-prompts.ts](src/agent-profile-prompts.ts#L13-L23)、[agent-profile-prompts.ts](src/agent-profile-prompts.ts#L80-L91)

整个两级组装管线可用下图概括：

\`\`\`mermaid
flowchart LR
    subgraph Host["宿主进程"]
        DB[("SQLite<br/>identity_prompt / soul_prompt /<br/>agents_prompt / tools_prompt")]
        NORM["normalizeAgentProfilePrompts()"]
        BAP["buildAgentProfilePrompt()<br/>## IDENTITY → ## SOUL → ## AGENTS → ## TOOLS"]
        TCP["toContainerAgentProfile()<br/>identityPrompt + identityHash"]
    end
    subgraph Runner["container/agent-runner"]
        AIP["buildAgentIdentityPrompt()<br/>包裹 &lt;agent-identity&gt; 标签"]
        PPP["buildMiniclawPromptPlan()<br/>固定顺序的块序列"]
        SP["systemPrompt<br/>claude_code preset + append<br/>或独立文本"]
    end
    DB --> NORM --> BAP --> TCP -->|"ContainerInput"| AIP --> PPP --> SP
\`\`\`

## Runner 侧组装：agent-identity 包装与固定块序

容器内 Runner 收到拼接文本后并不直接使用，而是先由 \`buildAgentIdentityPrompt\` 包裹进一个带元数据的 XML 风格标签：\`<agent-identity profile_id="..." name="..." version="..." hash="...">\`。标签内嵌一段中文引导语，声明这是"当前顶层 AgentProfile 的四段提示词，按照 IDENTITY、SOUL、AGENTS、TOOLS 的固定顺序组成"，并划定权力边界——它塑造身份、价值判断、工作方式与工具偏好，但**不能覆盖 Miniclaw 的安全规则、权限边界、工具约束和用户最新明确指令**；若启用了 Claude Code 原生预设，边界列表还会追加"Claude Code 原生提示词"。

Sources: [index.ts](container/agent-runner/src/index.ts#L300-L317)

真正的系统提示词由 \`buildMiniclawPromptPlan\` 构建。它把最多十二个 \`PromptBlockInput\` 按文档化且稳定的顺序推入数组，每个块都带有五维元数据：\`id\`（唯一标识）、\`version\`、\`scope\`（main/subagent/both）、\`owner\`（platform/agent_profile/workspace/channel）、\`required\` 与 \`condition\`（注入条件的人类可读描述）。完整顺序如下：

| 序 | 块 ID | owner | 注入条件 |
|----|-------|-------|----------|
| 1 | identity.miniclaw | platform | 仅内置默认 Miniclaw AgentProfile（\`isDefault\`） |
| 2 | bootstrap.miniclaw | platform | 默认 Profile 且启用 Owner Profile 运行时 |
| 3 | agent-profile | agent_profile | 四段拼接后的 identityPrompt 非空 |
| 4 | interaction | platform | 总是 |
| 5 | security-rules | platform | 总是 |
| 6 | memory-system.workspace | workspace | Memory 工具与 Workspace Memory 上下文可用 |
| 7 | agent-builder | platform | Agent Builder 启用且非定时任务/非消息任务 |
| 8 | output | platform | 总是（按任务/主动/助手三种模式选其一） |
| 9 | web-fetch | platform | WebSearch 或 WebFetch 可用 |
| 10 | background-tasks | platform | Task 与 TaskOutput 可用 |
| 11 | channel.* | channel | 消息来源解析到对应渠道 |
| 12 | delivery-contract | platform | 会话型 Agent 运行时激活 |

注意第 1、2 块的条件性：平台内置身份（\`identity.miniclaw.md\` 中声明的"内置、不可删除的主 Agent"身份及平台模型、行为边界说明）只注入默认 Miniclaw AgentProfile——测试 \`does not inject built-in identity or bootstrap into a custom Agent\` 验证了自定义 Agent 的块序直接从 \`agent-profile\` 开始。此外，主动交互模式始终放弃 Claude Code 预设，仅保留 Miniclaw 自有提示词并复用同一套 SDK 工具。

Sources: [prompt-plan.ts](container/agent-runner/src/prompt-plan.ts#L148-L294)、[index.ts](container/agent-runner/src/index.ts#L2410-L2471)、[tests/agent-runner-prompt-order.test.ts](tests/agent-runner-prompt-order.test.ts#L4-L22)、[tests/agent-runner-prompt-plan.test.ts](tests/agent-runner-prompt-plan.test.ts#L61-L75)、[identity.miniclaw.md](container/agent-runner/prompts/identity.miniclaw.md#L1-L33)

最终系统提示词有两种形态：\`append\` 模式下传给 SDK \`{ type: 'preset', preset: 'claude_code', append }\`，即在 Claude Code 助手预设之后追加 Miniclaw 计划全文；\`replace\` 模式则直接以计划全文作为独立系统提示词。开发期可通过环境变量 \`MINICLAW_DUMP_PROMPT=true\` 把最终提示词倾倒到 stderr，供宿主 logs 目录捕获比对。

Sources: [index.ts](container/agent-runner/src/index.ts#L2476-L2483)、[index.ts](container/agent-runner/src/index.ts#L2488-L2494)

## 确定性哈希与上下文审计

PromptPlan 的可观测性建立在两层 SHA-256 哈希之上。每个块在创建时计算自身内容的哈希、UTF-8 字节数与估算 token 数；整体计划的哈希则基于各块的元数据摘要（id/version/scope/owner/required/condition/hash）序列化后再哈希。测试验证了这一设计的精确语义：相同内容产生相同哈希；正文变化同时改变块哈希与计划哈希；而**仅改变 condition 等元数据时块哈希不变、计划哈希变化**——这意味着块哈希追踪内容本身，计划哈希追踪完整组合契约。

Sources: [prompt-plan.ts](container/agent-runner/src/prompt-plan.ts#L74-L139)、[tests/agent-runner-prompt-plan.test.ts](tests/agent-runner-prompt-plan.test.ts#L77-L104)

\`buildPromptAudit\` 将计划投影为审计对象（planHash、totalBytes、estimatedTokens 及逐块的完整元数据清单），随 \`context_audit\` 流事件回传宿主与前端，形成每次回合的提示词构成快照。

Sources: [index.ts](container/agent-runner/src/index.ts#L319-L339)

## 上下文预算的三层防线

静态提示词（平台块 + 四段身份 + Skills/MCP 工具定义等）在会话启动即占用窗口，若不加约束可能挤占对话历史甚至直接溢出。Miniclaw 以三层递进的防线应对：

\`\`\`mermaid
flowchart TD
    A["PromptPlan 组装完成"] --> B{"预检：estimatePromptTokens"}
    B -->|"≥ 50,000"| C["记录 WARN（不阻断）"]
    B -->|"≥ 100,000"| D["errors 非空 → 抛出 prompt_plan_invalid"]
    B -->|"< 50,000"| E["SDK 初始化，query 启动"]
    E --> F["init 事件 → getContextUsage()"]
    F --> G["calculateStaticStartupTokens<br/>求和静态来源（排除对话历史）"]
    G --> H{"assessContextBudget<br/>warn = min(50K, 25%×max)<br/>hard = min(100K, 40%×max)"}
    H -->|"≥ hard"| I["终止回合：<br/>contextBudgetExceeded"]
    H -->|"≥ warn"| J["警告写入 contextAudit.warnings<br/>displayLevel 升为 primary"]
    H -->|"正常"| K["context_audit 事件照常下发"]
\`\`\`

**第一层是 SDK 初始化前的预检**。\`estimatePromptTokens\` 是一个刻意保守、零依赖的估算器：取"字节数 ÷ 4 向上取整"与"非 ASCII 码点计数"两者的较大值——纯英文按每 token 约 4 字节估计，而中文等字符在 UTF-8 下约 3 字节/字，单看字节会低估，故取 max 兜底。注释明确此估算仅为预检守卫，SDK 的 \`getContextUsage()\` 结果才是权威值。超过 50,000 tokens 记警告，达到 100,000 则进入 errors 并使回合直接抛出 \`prompt_plan_invalid\` 异常；测试确认超大计划是"报告而非截断"。

Sources: [prompt-plan.ts](container/agent-runner/src/prompt-plan.ts#L62-L116)、[tests/agent-runner-prompt-plan.test.ts](tests/agent-runner-prompt-plan.test.ts#L106-L122)

**第二层是模型感知的启动预算评估**。SDK init 后 Runner 通过 feature-detect 方式调用 \`getContextUsage()\`（老版本 SDK 缺失该方法时不刷错误日志），\`calculateStaticStartupTokens\` 对静态来源求和：Memory 文件 + 已加载的 MCP 工具 + 已加载的延迟内建工具 + 系统工具 + 系统提示词分段 + Agents + 斜杠命令 + Skills，**显式排除对话历史**。阈值公式为 \`min(50_000, maxTokens × 25%)\` 警告、\`min(100_000, maxTokens × 40%)\` 硬限——取 min 使策略在小窗口模型（如 32K）下依然有效（此时阈值降为 8K/12.8K）。usage 数据不可用时安全降级为 \`unavailable\` 状态而不误判。

| 层级 | 触发时机 | 数据来源 | 警告阈值 | 硬限动作 |
|------|----------|----------|----------|----------|
| 预检 | SDK init 前 | 本地字符估算 | ≥50K 记日志 | ≥100K 抛异常中止 |
| 启动评估 | SDK init 事件 | getContextUsage() | min(50K, 25%) | 终止回合返回 contextBudgetExceeded |
| 自动压缩 | 对话过程中 | 模型窗口百分比 | 百分比策略触发压缩 | 旧绝对值钳制到窗口 90% |

Sources: [context-budget.ts](container/agent-runner/src/context-budget.ts#L32-L93)、[tests/agent-runner-context-budget.test.ts](tests/agent-runner-context-budget.test.ts#L31-L73)、[index.ts](container/agent-runner/src/index.ts#L3226-L3267)、[index.ts](container/agent-runner/src/index.ts#L3297-L3321)

硬超限的处理是彻底的：关闭事件流并以 \`contextBudgetExceeded\` 结果返回（含 startupTokens/maxTokens/hardThreshold/message），而不是让后续对话在必然溢出的状态下挣扎。

Sources: [index.ts](container/agent-runner/src/index.ts#L3297-L3321)

**第三层是模型感知的自动压缩配置**。模型窗口由名称后缀推导：以 \`[1m]\` 结尾（大小写不敏感、允许多重后缀、但后缀后不得再有其他字符）视为扩展窗口 1,000,000，否则标准 200,000。压缩阈值支持两种配置：百分比策略（合法区间 50–90 的整数，越界直接忽略）换算为绝对 token 并优先生效；遗留的绝对值配置则被钳制到当前模型窗口的 90% 以内——注释解释了原因：从 1M 模型继承的 800K 阈值若不钳制，切换回 200K 模型后会在压缩得以运行之前就溢出。另有一道专项告警：当模型带 \`[1m]\` 后缀但 SDK 上报的 maxTokens 小于 900K 时，立即推送"1M 上下文可能未生效"警告并提升展示级别。

Sources: [context-window.ts](container/agent-runner/src/context-window.ts#L1-L41)、[index.ts](container/agent-runner/src/index.ts#L2609-L2648)、[index.ts](container/agent-runner/src/index.ts#L3268-L3283)、[tests/agent-runner-context-window.test.ts](tests/agent-runner-context-window.test.ts#L10-L36)

## 身份哈希与失效传播

四段内容的变化如何被下游感知？答案是贯穿全链路的身份哈希。宿主侧 \`computeAgentProfileIdentityHash\` 以四段提示词、运行策略与名称为输入计算哈希（函数提供了旧版字符串签名与新版结构化签名的重载兼容）；对于内置默认 Profile，该哈希再经 \`bindMiniclawPlatformIdentityHash\` 包装——以代码持有的 \`MINICLAW_PLATFORM_IDENTITY_VERSION\`（当前为 1）作为盐前缀。注释阐明动机：内置身份归代码所有而非存于可编辑字段，每当受保护的身份契约变更就递增此版本号，迫使既有 SDK 会话在新身份下重启。

Sources: [db.ts](src/db.ts#L8201-L8211)、[agent-profile-runtime.ts](src/agent-profile-runtime.ts#L16-L30)、[agent-profile-runtime.ts](src/agent-profile-runtime.ts#L80-L91)

这个哈希最终出现在 Runner 侧 \`<agent-identity>\` 标签的 \`hash\` 属性中，与审计基础对象里的 \`runtimePolicyHash\`（对运行策略单独哈希）一起，构成会话恢复时判断上下文是否仍然有效的依据。

Sources: [index.ts](container/agent-runner/src/index.ts#L310)、[index.ts](container/agent-runner/src/index.ts#L345-L362)

## 小结与延伸阅读

四段 Prompt 体系的设计精髓在于**关注点分离加上层层设防**：语义上，IDENTITY/SOUL/AGENTS/TOOLS 把"我是谁、我信什么、我怎么做、我用什么"切开并各自限定长度与内容边界；组装上，宿主负责四段规范化拼接，Runner 负责把结果嵌入顺序确定、条件明确、逐块哈希的平台计划；预算上，从依赖无关的字符预检、模型感知的启动评估到窗口自适应的自动压缩，三道防线的每一道都有独立的测试契约锁定行为。理解这条管线后，建议继续深入：

- [能力解析管线：Skills、MCP、Plugins 六层来源与精确清单](13-neng-li-jie-xi-guan-xian-skills-mcp-plugins-liu-ceng-lai-yuan-yu-jing-que-qing-dan) —— PromptPlan 第 10、11 块所依赖的工具能力从何而来；
- [Host 与 Container 双执行模式](11-host-yu-container-shuang-zhi-xing-mo-shi-rong-liang-chao-shi-yu-nuan-runner) —— 本文 Runner 代码的两种执行载体；
- [Workspace Memory v2：知识类型、修订历史与并发安全](22-workspace-memory-v2-zhi-shi-le-xing-xiu-ding-li-shi-yu-bing-fa-an-quan) —— 第 6 块 memory-system.workspace 背后的长期记忆体系。`;export{n as default};
