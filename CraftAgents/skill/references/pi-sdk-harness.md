# Pi Agent SDK Harness 底层要点（Craft Agents 版）

> **定位**：Craft Agents 构建在 Pi Agent SDK（`@earendil-works/pi-coding-agent` **0.80.6**，pi-agent-server 与 shared 两包共同依赖）之上。**用了 SDK 不等于 Harness 消失——Harness 下沉到了 SDK 层**。本文件把 SDK 内部封装的 Harness 职责抽取为 PS 系列（Pi-SDK Harness）要点，作为 Craft Agents 学员的 SDK 纵深弹药。
>
> **证据等级与版本口径**：以下要点基于本机安装的 pi-coding-agent（0.84.2）`dist/` 类型声明与官方 `docs/`（sdk.md / compaction.md / sessions.md / extensions.md）直读。**注意：Craft 依赖的是 0.80.6，个别 API 与 0.84.2 存在差异**——引用接口签名时必须注明"基于 0.84.x 文档口径，项目实际使用 0.80.6"，深挖前建议核对 `packages/*/package.json` 锁定版本与 `node_modules` 实际类型声明。
>
> **⚠️ 简历红线（本系列最关键规则）**：PS 点描述的是**第三方 SDK 的内部实现**，不是"我们写的代码"。因此：
> 1. **PS 点默认不单独进简历 bullet**——简历里写"我实现了自动压缩"是造假。
> 2. PS 点的正确用法有两个：**(a) 追问纵深弹药**——当 bullet 写了"基于 Pi Agent Runtime"时，面试官追问"SDK 的 loop/压缩/队列是怎么做的？"，PS 点就是答案；**(b) 选型判断力证明**——回答"为什么用 Pi SDK 而不是 LangChain/自研 loop"时的技术依据。
> 3. 只有当 Craft **在 SDK 能力之上做了自己的集成/扩展**时，才能把"SDK 能力 + 我们的集成"合并成一条 bullet（例：H07 事件适配器 = SDK 事件流 + 我们的四族归一；R09 双模型 = SDK JSONL 树 + 我们的运行时/存储分治）。
> 4. 口径模板："我们基于 Pi Agent Runtime 的 X 能力，在其上做了 Y 集成/约束"——SDK 是主语的一部分，不是被隐藏的脚手架。

## PS 系列要点

## PS01 AgentSession：SDK 层 Harness 的外壳与事件流

- **SDK 做了什么**：`createAgentSession()` 返回的 `AgentSession` 是单会话 Harness 外壳，统一管理 Agent 生命周期、消息历史、模型状态、压缩与事件流。事件类型学覆盖三层粒度：消息级（`message_start/end`、`message_update` 含 text_delta/thinking_delta）、工具级（`tool_execution_start/update/end` 带 isError）、回合级（`turn_start/end`、`agent_start/end`），外加会话级（`queue_update`、`compaction_start/end`、`auto_retry_start/end`、`summarization_retry_*`）。
- **核心循环在更底层**：真正的 LLM 循环在 `@earendil-works/pi-agent-core` 的 `Agent` 类，`session.agent.state` 暴露 messages/model/thinkingLevel/systemPrompt/tools 五元状态，`waitForIdle()` 供外部等齐。
- **Craft 怎么消费**：pi-agent-server（进程外子进程）订阅 AgentSession 事件流，经 JSONL 协议转发回 Electron 主进程，再由 shared/agent/backend 的四族适配器（H07）归一为 provider-agnostic 的 AgentEvent——"SDK 事件 → JSONL → AgentEvent"两级映射就是 Craft 自己写的 Harness 粘合。
- **面试要讲**：为什么事件要分消息/工具/回合/会话四级（UI 渲染粒度不同）；SDK 事件到 AgentEvent 的映射为什么要在子进程内做一半、主进程内做一半（SDK 类型不过进程边界，JSONL DTO 是中间契约）。

## PS02 两级消息队列：steer 与 followUp 的语义分界

- **SDK 做了什么**：流式进行中调用 `prompt()` 必须显式声明 `streamingBehavior: "steer" | "followUp"`，否则抛错——SDK 用类型系统强制人机交互决策。`steer()` 打断式注入（当前 assistant 回合的 tool call 结束后即送达），`followUp()` 等待式投递（Agent 完全停止后才送）。两者各有 `all | one-at-a-time` 投递模式，`queue_update` 事件实时广播队列状态；`preflightResult` 回调在 prompt 被接受/拒绝时触发；扩展命令（`/xxx`）可即时执行但不可排队。
- **Craft 怎么消费**：pi-agent-server 的 JSONL 协议把 prompt/steer 语义透传给子进程；UI 侧的会话状态块（mode-manager）向模型声明队列语义。Craft 的 Messaging Gateway（RT03）入站消息最终也落到这套队列语义上。
- **面试要讲**：steer 为什么选在"tool call 结束后"注入而不是立即中断（保持工具执行的原子性）；one-at-a-time 模式防什么；preflight 拒绝与接受后失败的区分（前者 prompt() 直接返回 false，后者走事件流）。

## PS03 自动压缩 Compaction：触发公式与 cut-point 算法

- **SDK 做了什么**：触发条件是显式不等式 `contextTokens > contextWindow - reserveTokens`（reserveTokens 默认 16384，为响应留余量）。压缩算法四步：从最新消息回走累计 token 估计直到 `keepRecentTokens`（默认 20k）确定 cut point → 收集上一保留边界到 cut point 的消息 → 调 LLM 生成结构化摘要（携带上一轮摘要做迭代上下文）→ 追加 `CompactionEntry`（含 summary 与 `firstKeptEntryId`），下次请求用"摘要 + firstKeptEntryId 起的消息"重建上下文。细节亮点：压缩请求使用**独立 routing session ID**，且在供应商支持时**禁写 prompt cache**（一次性请求缓存无意义）。另有 branch summarization 双机制服务分支切换，与压缩共用结构化摘要格式并累计追踪文件操作。
- **Craft 怎么消费**：Craft 的上下文管理（R11/H02）管**装配侧**（进模型前有什么），压缩管**回收侧**（装不下了怎么办）——两者互补。会话恢复上下文（H06 recovery context）与压缩摘要在语义上衔接：压缩摘要是"会话内回收"，迁移摘要是"跨会话搬运"。
- **面试要讲**：为什么 reserveTokens 要从窗口扣除而不是用满（响应 token 与压缩触发的竞态）；cut point 为什么回走而不是前走；firstKeptEntryId 如何让旧条目可安全丢弃；禁写 prompt cache 省的是什么。
- **证据**：SDK `docs/compaction.md`（含完整算法描述与源文件索引）、`dist/core/compaction/`

## PS04 自动重试与摘要重试：SDK 层错误恢复

- **SDK 做了什么**：事件族 `auto_retry_start/end` 与 `summarization_retry_scheduled/attempt_start/finished` 表明 SDK 内建两类恢复：普通请求失败的自动重试，以及上下文超限时的"摘要化后重试"（先压缩再重发）。会话层维护 `_retryAbortController` 使重试可被 abort 打断。
- **Craft 怎么消费**：重试/摘要重试事件经 JSONL 透传到主进程，进入 AgentEvent 错误事件族（H07/R10 的结构化错误与完成状态）；SDK 管"单次会话内重试"，Craft 的 abort 链路管用户主动取消与后端切换。
- **面试要讲**：summarization retry 与直接报错给上层的取舍；SDK 自动重试与 UI abort 的交互（abort 经 JSONL 传到子进程后由 `_retryAbortController` 生效）。

## PS05 System Prompt 构建：buildSystemPrompt 与上下文注入

- **SDK 做了什么**：`buildSystemPrompt(options)` 是 SDK 的 Prompt 装配器：默认工具说明（read/bash/edit/write 可裁剪）+ guideline bullets + `appendSystemPrompt` 追加段 + contextFiles（AGENTS.md 等预载上下文）+ skills 注入。完整替换走 `ResourceLoader` 的 `systemPromptOverride`。
- **Craft 怎么消费**：R11 动态 System Prompt 与 H02 PromptBuilder 是 SDK 装配器之上的**块内容工厂**——PromptBuilder 生成 workspace 能力块/恢复上下文/会话状态/用户偏好，SDK 负责最终拼接与工具说明。pi-agent-server 另有 system-prompt-override 模块处理覆盖路径。
- **面试要讲**：SDK 装配器与 PromptBuilder 的分工（SDK 管拼接格式，Craft 管块内容与权限注入）；AGENTS.md/CLAUDE.md 上下文发现如何经 SDK contextFiles 进入装配。

## PS06 ResourceLoader：资源双源发现机制

- **SDK 做了什么**：`DefaultResourceLoader` 统一发现五类资源——extensions、skills、prompt templates、themes、context files——按**项目级**（`.pi/extensions/`、`.pi/skills/`、`.agents/skills/` 沿祖先目录上溯到 git 根）与**全局级**（`~/.pi/agent/` 下对应目录）双源加载；`AGENTS.md` 从 cwd 向上走查。cwd 管项目源，agentDir 管全局源与 settings/models/credentials/sessions。
- **Craft 怎么消费**：Craft 在 SDK 双源之上建了自己的 Skills/Sources 治理层（shared/src/skills 存储与 R18/R26 的 ServerBuilder 统一接入）——SDK 管"从文件系统发现"，Craft 管"从用户配置/远端源接入并治理凭据与权限"。
- **面试要讲**：SDK 双源与 Craft 治理层的分工（文件系统发现 vs 用户级能力接入）；为什么发现要沿 git 根上溯（monorepo 子目录共享技能）。

## PS07 工具系统：内置工具、自定义工具与裁剪

- **SDK 做了什么**：内置 7 工具（read/bash/edit/write/grep/find/ls，默认启用前 4）；`defineTool()` 定义自定义工具（TypeBox 参数 schema、execute 返回 content+details）；`tools` 白名单、`excludeTools` 黑名单、`noTools: "all"/"builtin"` 三级裁剪；自定义 cwd 时工具按目录实例化；edit 工具返回 `details.diff`（TUI 用）与 `details.patch`（标准 unified patch，SDK 消费用）双格式。
- **Craft 怎么消费**：pi-agent-server 显式注册 SDK 工具定义（createReadToolDefinition/createBashToolDefinition 等），并叠加 session-tools-core 的会话级工具（SessionToolContext 注入 sessionId/workspacePath/凭据回调）与 spawn_session（H04）等 custom tools——三层工具来源（SDK 内置 / 会话级 / 自定义）经 `tools` 白名单统一裁剪。
- **面试要讲**：三层工具来源的优先级与裁剪语义；为什么工具要按 cwd 实例化（路径解析边界）；diff/patch 双格式服务两种消费方。

## PS08 会话树持久化：JSONL 树结构与运行时替换

- **SDK 做了什么**：会话以 JSONL 持久化，条目带 `id/parentId` 构成**树**而非线性列表——支持原地分支与 `navigateTree` 树内导航（可带摘要/自定义指令/标签）。会话替换（new/resume/fork/clone/import）不在 session 上做，而在 `AgentSessionRuntime` 层做——因为替换会话需要重建 cwd 绑定的运行时服务。关键陷阱（SDK 文档明示）：事件订阅绑定具体 session 实例，**替换后必须重新 subscribe**，扩展需重新 `bindExtensions`。
- **Craft 怎么消费**：R09 的运行时/存储双模型正是对 SDK JSONL 树的分治封装（运行时 Message 在内存、StoredMessage 落盘）；跨会话上下文迁移（H06 buildTransferredSessionContext）与 SDK fork/clone 形成两条"延续上下文"的路线——SDK 树内 fork 保原始条目，Craft 摘要迁移跨任意会话。
- **面试要讲**：SDK 树内 fork 与摘要迁移的取舍（保真 vs 跨会话通用）；订阅失效陷阱在 Craft 的工程化防护（子进程替换会话后 JSONL 事件流的重新绑定）。

## PS09 ModelRuntime：模型注册表与目录治理

- **SDK 做了什么**：`ModelRuntime.create()` 恢复本地缓存的模型目录（默认不联网刷新）；联网刷新需显式 opt-in 且受 `modelRefreshTimeoutMs` 约束；**每 provider 刷新节流 4 小时**；`PI_OFFLINE` 全局禁网；`getAvailable()` 只返回凭据有效的模型；自定义模型走 `models.json`；thinkingLevel 七档（off→max）。
- **Craft 怎么消费**：pi-agent-server 的 model-resolution/custom-endpoint-models 在 SDK 注册表之上做 custom-endpoint 优先级解析与错误分类；pick-mini-model（H08 关联）从可用模型中为 call_llm 选轻量档；R07 的 Thinking Level 运行时切换消费 SDK 的七档 thinkingLevel。
- **面试要讲**：为什么目录缓存默认不联网（启动确定性）；getAvailable 的凭据过滤把"配置了"和"能用"分开——这正是 Craft 凭据层（RT02）与模型层解耦的前提。

## PS10 扩展系统与子代理：事件总线 RPC

- **SDK 做了什么**：extensions 由 ResourceLoader 加载，通过 `pi.registerTool()`/`pi.sendMessage()` 等宿主 API 注入工具与消息，扩展命令即时执行不受队列约束。子代理能力以 **pi-subagents 扩展**提供，走**事件总线 RPC**——调用方不 import 扩展内部类，只依赖公开事件契约。
- **Craft 怎么消费**：Craft 的子代理走的是**另一条路线**——spawn_session（H04）"会话即子代理"，不依赖 SDK 子代理扩展，换来天然会话隔离、持久化与 UI 可见性。这是两条子代理路线的取舍点：SDK 扩展事件总线（轻量同进程）vs 会话级 spawn（隔离可观测）。
- **面试要讲**：为什么 Craft 选会话级 spawn 而不是 pi-subagents（产品形态决定：多端 UI 需要子任务可见可切换）；两条路线各自的适用边界。

## PS 系列使用规则

1. **PS 点不单独进 bullet**（红线见文件头）。进 bullet 的唯一形态是"SDK 能力 + Craft 集成"合并句式，且项目侧贡献必须具体（适配器/双模型/治理层/覆盖路径）。
2. **PS 点的面试定位是纵深与选型**：被问"SDK 的 harness 怎么实现""为什么选 Pi 不自研"时，PS01–PS10 就是弹药库。若无法复述 PS02/PS03 的机制，bullet 里的"基于 Pi Agent Runtime"保持一句话带过，不主动展开。
3. **版本口径**：证据基于 0.84.x 文档口径，Craft 实际依赖 0.80.6——引用接口签名时双版本并注，深挖前核对 node_modules 实际类型。
4. **与 H/RT 系列的关系**：PS 是 H 的**地基**（H02↔PS05、H04↔PS10、H06↔PS08、H07↔PS01/PS04、H08↔PS07/PS09）；同一场面试里 H 点讲项目贡献、PS 点讲底层机制，形成"上下一体"的叙事纵深。
5. **Runtime 分工的好答案**：SDK 只管 Harness 不管强治理（沙箱/资源限制/凭据 broker 都不在 SDK 内）——这正是 Craft RT 系列（进程外隔离/凭据刷新/网关 worker）存在的理由，"为什么项目要做 Runtime 层"的面试答案即此。
