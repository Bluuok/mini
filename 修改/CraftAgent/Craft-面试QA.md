# ThreadCove 面试 QA：五组主线，十五个核心问题

> 本版与 `Craft-简历片段.md`、`Craft-故事.md` 一一对应。源码基线：`Bluuok/ThreadCove@6a49d19a024fcbc6cdabeaf8da8ccbf1953dfbb9`。来源 E01—E15 的路径/符号索引见 `Craft-场景与证据审计.md` 第七节。
>
> 2026-09-19：本人确认五个选点均基于开源基座复现并实现，以下按个人实现回答。`source_plus_test` 表示实现与测试定义可定位，不表示本轮运行通过；`source_implemented` 表示实现可定位。未进行候选人口试或熟练度评分，业务测试、真实模型调用与产品联调的范围集中见[本轮事实审计](../复审-2026-09-19/README.md)。

## Q01 · 研究工具接入与证据留存

关联：claim-craft-001 → A01, A02；故事 M4.1。证据级别：`source_plus_test`。

### Q01.1 为什么不只接一个 MCP Server，还要有研究工具层？

MCP 解决工具连接与调用接口，而我的研究场景还需要可回看的取材记录。我为 web_search、web_fetch 实现参数契约与宿主执行入口，把查询或 URL、fetchedAt、提取文本保存到会话产物，再把可读观察交给模型。SessionManager 在 Pi 分支装配研究工具和 MCP 代理工具，宿主按工具名执行。这让研究问题能关联到具体取材记录；逐论点证据核验是另外一层工作。

### Q01.2 web_fetch 的地址检查为什么不能只做一次？

因为输入可能直接指向私网，也可能先请求公共地址再重定向到私网，DNS 校验与实际连接之间还可能不一致。当前实现限制 HTTP(S) 与标准端口，拒绝嵌入凭据和私网/保留地址，检查解析到的地址集合，并把已通过校验的地址绑定给请求 lookup；每次重定向重新检查，同时限制时间、响应大小和类型。这是针对具体风险的执行约束，不是宣称覆盖所有网络攻击。对应测试检查私网、编码地址、映射地址与混合 DNS 结果。

### Q01.3 有 URL 和 JSON Schema，是否已经保证结果可信、执行安全？

没有。URL 表示取材记录里出现的来源，既不证明读过每个页面全文，也不证明每条结论都被支持。JSON Schema 描述模型可调用参数，宿主还要校验类型、长度和允许的操作。网页与子报告被明确当作不可信数据，提取时删除脚本等内容，但模型仍可能受到自然语言指令影响。当前能讲的是工具接口、输入约束和来源留存，不是全链路防注入或研究结论零幻觉。

**源码与测试入口**

- E01：`packages/shared/src/research/tools.ts` → `WEB_TOOLS / ResearchTools.bind / execute / runChild / ResearchSlots / recoverSession`。检索工具、子代理调度、来源产物、取消与预算。
- E02：`packages/shared/src/research/web.ts` → `validatePublicUrl / fetchPublicPage / extractPage / searchWeb`。地址校验、DNS 绑定、重定向复检、取材解析与截断。
- E03：`apps/electron/src/server/session-manager.ts` → `createSession / submitMessage / recoverWorkspace`。Pi 专属研究工具装配、受理/完成、重启中断。
- E04：`packages/shared/tests/research.test.ts` → `并发槽 / 父取消 / 子失败 / 中断恢复 / 产物写失败 / 子任务超时测试`。已读测试定义；本次没有运行 Bun 测试或真实搜索。
- E15：`packages/pi-agent-server/src/index.ts` → `initialize / executeToolViaHost / main`。禁用默认工具和自动资源加载；显式注册工具；Pi 历史回填只保留 user/assistant，没有相同的字符预算和 tool 文本桥接。

**五类追问的回答落点**

| 追问类型 | 回答落点 |
|---|---|
| 架构 | 为什么不只接一个 MCP Server，还要有研究工具层？：明确本层职责与上/下游。 |
| 实现 | 定位上述函数、输入输出与测试断言，不只背概念。 |
| 取舍 | 保留来源、时间和受限正文；暂不增加语义证据评分或复杂网页渲染。 |
| 失败与恢复 | 搜索限流、无可读正文或地址校验失败应显式报错，不能生成看似已检索的答案。 |
| 个人贡献 | 我复现并实现工具定义、宿主执行路由与来源产物结构；协议和搜索引擎来自现有依赖。 |

## Q02 · 受限子 Agent 编排

关联：claim-craft-002 → A03；故事 M4.2。证据级别：`source_plus_test`。

### Q02.1 多开几个 Session 和这里的子 Agent 有什么区别？

多 Session 主要是把会话状态分开，不必存在父子关系。本项目的 delegate_research 由父 Agent 请求委派，宿主为每个子问题创建 PiAgent 实例和独立工作目录，配置叶子研究工具，再收集状态、来源和报告，回填父任务。它有父取消传播、预算和汇合逻辑，因此可以称受限子 Agent 委派。但它没有一般 DAG 的依赖调度、跨机协调与自动重规划，不能泛称完整多 Agent 平台。

### Q02.2 具体有哪些预算，为什么只写提示词“别开太多任务”不够？

我把限制分成三个作用域：同一运行时共享三个子任务槽；一次委派允许一到三个任务；同一个父运行累计最多六个子任务，父子共享二十四次 web_search/web_fetch 工具调用预算。Scope 随父运行信号保留并被子任务复用，不随模型轮次重置，计数也不是物理 HTTP 请求数或费用封顶。每个子任务另配置九十秒截止时间、最多六个模型轮次和输出规模限制。子代理工具定义不提供再次委派，执行器仍检查 canDelegate。这样把扇出、资源使用和递归限制落在宿主代码，而不是只靠提示词；配额不跨运行时实例共享。

### Q02.3 父任务取消、子任务失败或者报告写盘失败，分别怎么收尾？

我把父取消和子任务截止时间组合成信号，等待槽位的任务可退出；运行任务收到取消时调用子代理销毁，finally 执行销毁、槽释放和终态保存。常规模型错误记录为失败报告，成功兄弟的报告仍可返回。报告写盘失败可能让委派调用整体报错，Promise.allSettled 会先等待各 runChild 落定，再把错误交给父调用；它不会替代 finally 的清理，也不单独证明底层进程或外部请求已经停止。已有用例定义覆盖排队与运行取消、部分失败、超时及报告保存失败，对应可检查的对象是状态、槽与持久化报告。

**源码与测试入口**

- E01：`packages/shared/src/research/tools.ts` → `WEB_TOOLS / ResearchTools.bind / execute / runChild / ResearchSlots / recoverSession`。检索工具、子代理调度、来源产物、取消与预算。
- E04：`packages/shared/tests/research.test.ts` → `并发槽 / 父取消 / 子失败 / 中断恢复 / 产物写失败 / 子任务超时测试`。已读测试定义；本次没有运行 Bun 测试或真实搜索。

**五类追问的回答落点**

| 追问类型 | 回答落点 |
|---|---|
| 架构 | 多开几个 Session 和这里的子 Agent 有什么区别？：明确本层职责与上/下游。 |
| 实现 | 定位上述函数、输入输出与测试断言，不只背概念。 |
| 取舍 | 独立子问题才委派；用固定预算换可控性，不声称自动找到最优任务划分。 |
| 失败与恢复 | 启动时把孤儿 queued/running 报告标记 interrupted，不主动重放旧模型或网络调用。 |
| 个人贡献 | 我复现并实现父子控制流、预算、取消与汇合；子代理的内部模型循环由 Pi SDK 提供。 |

## Q03 · Context Engineering

关联：claim-craft-003 → A04；故事 M4.3。证据级别：`source_plus_test`。

### Q03.1 恢复历史时，究竟给模型注入了什么？

我在 ClaudeAgent.restoreHistory/chatImpl 中接入文本历史桥接：restoreTextHistory 从最近消息向前遍历，只保留 user、assistant、tool 文本，按剩余字符预算截取，再恢复原有时间顺序；promptWithHistory 将角色和正文编码为引用式 JSON 历史，后面单独放当前问题。因此错误事件不会全部混入模型输入，选入的历史正文长度也受到限制。落盘历史本身仍可增长；这里实现的是本次请求的有界文本桥接，而非复原提供商内部会话、工具缓存或全部执行状态。

### Q03.2 字符预算等于 token 预算吗？会丢什么？

不等于。实现使用 JavaScript 字符串长度，默认历史正文预算为四万八千；JSON 包装、系统提示词、工具定义和当前问题不在这个计数中，实际请求 token 还受语言与 tokenizer 影响。预算不足时保留较新的消息，必要时只取某条消息末尾，因此可能丢失旧约束或切断句子。当前取舍是简单、确定且可测试；精确 token 预算和语义摘要是另外的改进，不能倒写成已有能力。

### Q03.3 Pi 研究主链也使用同样的历史恢复吗？

不能这样概括。ClaudeAgent 确实调用字符预算与引用拼接函数；Pi 的 restoreHistory 先复制宿主历史，子进程 initialize 只把 user/assistant 文本填入内存 Session，未在该路径使用同样的字符预算，也没有回填 tool 文本。当前不能说三后端统一有界恢复，这是后续需要对齐的接缝。另需区分：JSONL 是存储，prompt 构建决定本轮模型看到什么；引用式 JSON 包装也不等于提示注入已被完全隔离。

**源码与测试入口**

- E05：`packages/shared/src/agent/backend/history.ts` → `restoreTextHistory / promptWithHistory`。字符预算、角色过滤、引用式历史。
- E06：`packages/shared/tests/review-regressions.test.ts` → `bounded text history / safe session deletion`。已读测试定义；预算与角色断言，不是本次执行结果。
- E14：`packages/shared/src/agent/claude-agent.ts` → `ClaudeAgent.restoreHistory / chatImpl`。实际调用 restoreTextHistory 与 promptWithHistory，确认字符预算桥接的后端入口。
- E15：`packages/pi-agent-server/src/index.ts` → `initialize / executeToolViaHost / main`。禁用默认工具和自动资源加载；显式注册工具；Pi 历史回填只保留 user/assistant，没有相同的字符预算和 tool 文本桥接。

**五类追问的回答落点**

| 追问类型 | 回答落点 |
|---|---|
| 架构 | 恢复历史时，究竟给模型注入了什么？：明确本层职责与上/下游。 |
| 实现 | 定位上述函数、输入输出与测试断言，不只背概念。 |
| 取舍 | 优先保留近期文本与角色，不增加长期语义记忆、摘要模型与向量库。 |
| 失败与恢复 | 历史被截断可能影响答案；不能保证重要约束永不丢失，也不能宣称无损恢复。 |
| 个人贡献 | 我实现角色过滤、近期文本选择、字符截取和引用拼接，可用预算例子逐步解释；不认领 SDK 原生 Memory。 |

## Q04 · 多后端适配与进程边界

关联：claim-craft-004 → A05, A06；故事 M4.4。证据级别：`source_plus_test`。

### Q04.1 AgentBackend 到底统一了什么，为什么不直接在 UI 调 SDK？

我统一的是会话层使用的调用、生命周期入口和事件消费方式。工厂根据 provider 配置建立 DeepSeek、Claude 或 Pi，使上层不用分别处理每家 SDK 的初始化与流式类型。具体产物是后端工厂、适配器及公共事件入口；新增后端仍需适配，现有后端也可能不支持同一套工具或恢复方式。当前研究工具只在 Pi 分支装配，因此这里提供的是按配置选择已有后端。

### Q04.2 Pi 子进程中的一次工具调用如何回到宿主？模型密钥在哪里？

宿主 PiAgent 启动子进程，通过标准输入输出传递 JSONL 消息，初始化后接收就绪和事件；子进程提出带关联标识的工具执行请求，宿主工具执行器处理后把结果返回，事件再适配到公共消费接口。Source 工具凭据可以由宿主管理，但模型 API Key 本身出现在初始化契约中，需要进入 SDK 所在的子进程。不能把“工具在宿主执行”误说成“所有密钥都不会进入子进程”。

### Q04.3 有三个后端工厂和测试，是否就证明三个后端全部联调通过？

没有。工厂用例主要验证路由、未知 provider 错误和部分生命周期接口，不能证明真实服务、工具往返和取消恢复在每个后端都正常。仓库文档记录过 Pi/OpenCode Go 的实际 SDK 联调，同时说明其他直连 API 的未验证范围；本轮没有复跑这些外部调用。面试要分别说代码具备什么、用例断言什么、哪一次真实链路有记录，不能拿一项通过替代全部能力。

**源码与测试入口**

- E03：`apps/electron/src/server/session-manager.ts` → `createSession / submitMessage / recoverWorkspace`。Pi 专属研究工具装配、受理/完成、重启中断。
- E07：`packages/shared/src/agent/backend/factory.ts` → `DRIVER_REGISTRY / BACKEND_FACTORIES / createBackend`。三个后端配置映射；不证明功能完全对等。
- E08：`packages/shared/tests/factory.test.ts` → `backend factory`。Claude/Pi 路由与生命周期表面；没有覆盖全部后端真实 API。
- E09：`packages/shared/src/agent/pi-agent.ts` → `PiAgent / ensureSubprocess / InboundMessage / OutboundMessage`。子进程启动、JSONL 协议、宿主工具接口；init 含模型 apiKey。
- E12：`docs/IMPLEMENTATION-REVIEW.md` → `2026-09-14 提交前复验 / OpenCode Go-Pi SDK 接入 / 数据兼容与边界`。仓库历史验收记录；本次未取得忽略目录内截图/原始报告，未复测。
- E15：`packages/pi-agent-server/src/index.ts` → `initialize / executeToolViaHost / main`。禁用默认工具和自动资源加载；显式注册工具；Pi 历史回填只保留 user/assistant，没有相同的字符预算和 tool 文本桥接。

**五类追问的回答落点**

| 追问类型 | 回答落点 |
|---|---|
| 架构 | AgentBackend 到底统一了什么，为什么不直接在 UI 调 SDK？：明确本层职责与上/下游。 |
| 实现 | 定位上述函数、输入输出与测试断言，不只背概念。 |
| 取舍 | 显式暴露能力差异，不为“统一”而承诺所有 SDK 具有相同 steering、工具与恢复语义。 |
| 失败与恢复 | 子进程不是安全沙箱；退出、初始化失败和宿主工具失败需要单独处理，不保证宿主永不受资源问题影响。 |
| 个人贡献 | 我复现并实现适配层、JSONL 协议接缝和宿主工具集成；Claude/Pi SDK 内部模型循环属于依赖能力。 |

## Q05 · 任务生命周期与流式恢复

关联：claim-craft-005 → A07, A08；故事 M4.5。证据级别：`source_implemented`。

### Q05.1 为什么 RPC 要先返回 accepted/runId，而不是等模型结束？

一次模型运行可能比请求受理长得多，因此我在 submitMessage 中分开处理受理和运行：先检查请求去重与会话忙碌状态，持久化用户消息及 running 状态，再返回 accepted/runId；之后消费事件，结束时另存终态并广播结果。requestId 用于同一请求的受理去重，runId 标识本次运行。这提供了未受理、运行中和终态的区分依据，避免把网络响应当作任务成功；外部工具的分布式 exactly-once 不由这两个标识保证。

### Q05.2 断线、重连或 text_complete 到来时，为什么不会简单重复追加？

RunTranscript 给文本段分配稳定消息 ID，text_delta 更新该段并携带累计快照，text_complete 用完整文本替换当前段，再按 ID 更新持久化记录。这为前端对齐消息和补齐断线期间文本提供契约，而不是让前端只盲目拼接增量。检查点有间隔，突发退出仍可能丢失尾部。真实前端是否正确消费快照还需要应用路径的集成验证，不能单凭一份字段镜像测试就宣布永不重复。

### Q05.3 什么情况下不能发布成功？应用重启会接着跑旧任务吗？

后端流未给出完成事件、出现错误、被取消或终态保存失败时，都不能把任务当成功；会话层在记录刷新和终态处理后才决定是否发布完成。重启恢复把残留运行标记为 interrupted，研究子任务也类似处理，保留已有报告，不主动重新发起旧任务的模型或网络调用。已经发出的请求如何执行或计费取决于提供方，不能由本地中断标记推定。当前恢复的是已保存内容与状态，检查点之间仍可能丢失尾部。

**源码与测试入口**

- E03：`apps/electron/src/server/session-manager.ts` → `createSession / submitMessage / recoverWorkspace`。Pi 专属研究工具装配、受理/完成、重启中断。
- E10：`apps/electron/src/server/run-transcript.ts` → `RunTranscript.consume / flush`。消息 ID、文本快照、检查点、结果与错误保存。
- E11：`packages/shared/tests/session-event-message-parity.test.ts` → `eventToStoredFields / eventToRenderFields`。测试内镜像映射，不直接导入真实应用路径，不能单独证明端到端一致。
- E12：`docs/IMPLEMENTATION-REVIEW.md` → `2026-09-14 提交前复验 / OpenCode Go-Pi SDK 接入 / 数据兼容与边界`。仓库历史验收记录；本次未取得忽略目录内截图/原始报告，未复测。

**五类追问的回答落点**

| 追问类型 | 回答落点 |
|---|---|
| 架构 | 为什么 RPC 要先返回 accepted/runId，而不是等模型结束？：明确本层职责与上/下游。 |
| 实现 | 定位上述函数、输入输出与测试断言，不只背概念。 |
| 取舍 | 使用累计快照与文本检查点换取可恢复的显示基础，接受传输和存储开销。 |
| 失败与恢复 | 检查点间隙、写盘错误、缺失完成事件必须显式留下状态；没有跨进程存储锁与自动任务重放。 |
| 个人贡献 | 我实现受理与终态分离、事件记录和检查点消费；端到端效果需由真实应用路径验证，不能用测试内镜像映射代替。 |

## 共用问题：与参考项目、SDK 和 AI 辅助的关系

> 这是我基于 Craft Agents 开源基座，围绕五个选点复现并实现的个人研究工作台。我负责讲清研究工具、受限委派、Claude 历史桥接、多后端适配和运行记录中的具体接口、产物与取舍。模型能力和内部模型循环依赖现有 SDK，使用 AI 辅助的部分如实说明；我的实现范围是这五点在工作台中的落地。

五点的个人复现实现归属已确认；面试深挖用于验证解释能力与具体实现细节，不再以逐点确认作为讲述前提。完整参考仓库、SDK 原创、生产指标与真实运行记录仍分别记账。

## 演练方式

先不看答案讲通主流程，再打开相应函数解释取消、预算或终态中的一个分支。[完整故事 M4](Craft-故事.md#m4--五个技术故事与简历逐条对应)提供五点各 30 秒、90 秒和约 3 分钟口述稿，[M6 八轮二层追问](Craft-故事.md#m6--失败场景与八轮二层追问)提供简答、展开与不会时的诚实答法。暂时解释不清的细节应说明需要核对的符号或证据，不扩大已经证明的运行效果。
