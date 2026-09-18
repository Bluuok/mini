# ThreadCove 面试 QA：五组主线，十五个核心问题

> 本版与 `Craft-简历片段.md`、`Craft-故事.md` 一一对应。源码基线：`Bluuok/ThreadCove@6a49d19a024fcbc6cdabeaf8da8ccbf1953dfbb9`。来源 E01—E15 的路径/符号索引见 `Craft-场景与证据审计.md` 第七节。
>
> `source_plus_test` 只表示读到了实现与相关测试定义，不表示本轮运行通过；`source_implemented` 表示对应实现可定位，但列出的契约测试不足以单独证明完整行为。本轮没有进行候选人口试，没有打熟练度分数，也没有声称独立评审代理已验收。

## Q01 · 研究工具接入与证据留存

关联：claim-craft-001 → A01, A02；故事 M4.1。证据级别：`source_plus_test`。

### Q01.1 为什么不只接一个 MCP Server，还要有研究工具层？

MCP 解决的是工具连接与调用接口，不会自动提供研究任务需要的取材格式和来源记录。这里的 web_search、web_fetch 有明确参数与执行器，宿主把查询或 URL、fetchedAt、提取文本保存到会话产物，再把可读观察交给模型。SessionManager 在 Pi 分支装配研究工具和 MCP 代理工具，宿主按工具名选择执行入口。这样把“能接工具”和“工具如何服务研究”拆开；它还不是完整证据核验系统。

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
| 个人贡献 | 展示自己实际改过的工具定义、执行路由或产物结构；仅接入 MCP SDK 时，不冒认协议实现或搜索引擎研发。 |

**诚实降级句**：能确定的是上述源码机制；没有亲自运行或没有独立理解的分支，不声称已经联调通过，也不编造开发事故。

## Q02 · 受限子 Agent 编排

关联：claim-craft-002 → A03；故事 M4.2。证据级别：`source_plus_test`。

### Q02.1 多开几个 Session 和这里的子 Agent 有什么区别？

多 Session 主要是把会话状态分开，不必存在父子关系。本项目的 delegate_research 由父 Agent 请求委派，宿主为每个子问题创建 PiAgent 实例和独立工作目录，配置叶子研究工具，再收集状态、来源和报告，回填父任务。它有父取消传播、预算和汇合逻辑，因此可以称受限子 Agent 委派。但它没有一般 DAG 的依赖调度、跨机协调与自动重规划，不能泛称完整多 Agent 平台。

### Q02.2 具体有哪些预算，为什么只写提示词“别开太多任务”不够？

源码默认同一运行时共享三个子任务槽；一次委派允许一到三个任务，同一个父运行累计最多六个子任务，父子共享二十四次网页调用预算。子任务默认九十秒截止时间，限制模型轮数和输出规模。这些是代码中的配置约束，不是测得的性能指标。宿主限制比提示词可靠：子代理工具定义不提供再次委派，执行器也检查 canDelegate，避免模型绕过“请不要递归”的软要求；但配额并非跨运行时实例全局共享。

### Q02.3 父任务取消、子任务失败或者报告写盘失败，分别怎么收尾？

父取消和子任务截止时间被组合成信号，等待槽位的任务可退出，运行任务销毁子代理，finally 中释放槽并保存终态。常规模型错误被记录为该子任务失败，成功兄弟的报告仍可返回。写盘失败不同：委派调用可能整体报错，但 Promise.allSettled 会先等所有兄弟完成清理，不能错误返回后还残留工作。源码测试分别覆盖运行与排队取消、部分失败、超时以及报告写失败；本轮没有实际运行这些测试。

**源码与测试入口**

- E01：`packages/shared/src/research/tools.ts` → `WEB_TOOLS / ResearchTools.bind / execute / runChild / ResearchSlots / recoverSession`。检索工具、子代理调度、来源产物、取消与预算。
- E04：`packages/shared/tests/research.test.ts` → `并发槽 / 父取消 / 子失败 / 中断恢复 / 产物写失败 / 子任务超时测试`。已读测试定义；本次没有运行 Bun 测试或真实搜索。

**五类追问的回答落点**

| 追问类型 | 回答落点 |
|---|---|
| 架构 | 多开几个 Session 和这里的子 Agent 有什么区别？：明确本层职责与上/下游。 |
| 实现 | 定位上述函数、输入输出与测试断言，不只背概念。 |
| 取舍 | 独立子问题才委派；用固定预算换可控性，不声称自动找到最优任务划分。 |
| 失败与恢复 | 启动时只把孤儿 queued/running 报告标记 interrupted，不自动恢复旧付费工作。 |
| 个人贡献 | 能画出父子控制流并解释清理路径，才把编排作为个人核心点；不能把调用现成 SDK 说成从零实现模型循环。 |

**诚实降级句**：能确定的是上述源码机制；没有亲自运行或没有独立理解的分支，不声称已经联调通过，也不编造开发事故。

## Q03 · Context Engineering

关联：claim-craft-003 → A04；故事 M4.3。证据级别：`source_plus_test`。

### Q03.1 恢复历史时，究竟给模型注入了什么？

已确认 ClaudeAgent.restoreHistory/chatImpl 调用这层桥接：restoreTextHistory 从最近消息向前遍历，只保留 user、assistant、tool 的文本，按照剩余字符预算截取，再恢复为原有时间顺序。promptWithHistory 将角色和正文编码为引用式 JSON 历史，并在后面单独放当前问题。因此存储中的错误事件不会全部混入对话上下文，历史也不会无限增长。它解决的是有界文本桥接，不是复原提供商内部会话、工具缓存或全部执行状态。

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
| 个人贡献 | 展示实际函数和能手算的预算例子，说明这是文本上下文处理，不认领 SDK 的原生 Memory 实现。 |

**诚实降级句**：能确定的是上述源码机制；没有亲自运行或没有独立理解的分支，不声称已经联调通过，也不编造开发事故。

## Q04 · 多后端适配与进程边界

关联：claim-craft-004 → A05, A06；故事 M4.4。证据级别：`source_plus_test`。

### Q04.1 AgentBackend 到底统一了什么，为什么不直接在 UI 调 SDK？

统一的是会话层使用的调用与生命周期表面，以及后端事件被适配后的消费方式。工厂根据 provider 配置建立 DeepSeek、Claude 或 Pi，UI 不需要分别理解每家 SDK 的初始化和流式类型。但新增后端仍要写适配器，现有后端也可能不支持同一套工具或恢复方式。当前研究工具只在 Pi 分支装配，所以“按配置选择已有后端”比“任意模型无缝替换”准确。

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
| 个人贡献 | 讲清自己维护的适配层、协议和宿主集成；Claude/Pi SDK 的内部模型循环不算自行研发。 |

**诚实降级句**：能确定的是上述源码机制；没有亲自运行或没有独立理解的分支，不声称已经联调通过，也不编造开发事故。

## Q05 · 任务生命周期与流式恢复

关联：claim-craft-005 → A07, A08；故事 M4.5。证据级别：`source_implemented`。

### Q05.1 为什么 RPC 要先返回 accepted/runId，而不是等模型结束？

一次模型运行可能比请求受理长得多。submitMessage 先检查去重、会话是否忙碌，并持久化用户消息与 running 状态，然后返回 accepted/runId；事件处理继续进行，结束时另外保存终态和广播结果。requestId 用于同一请求的受理去重，runId 标识这次运行。这样前端可以区分未受理、正在运行和已经完成，避免把网络响应当作任务成功；它不提供分布式工具调用 exactly-once。

### Q05.2 断线、重连或 text_complete 到来时，为什么不会简单重复追加？

RunTranscript 给文本段分配稳定消息 ID，text_delta 更新该段并携带累计快照，text_complete 用完整文本替换当前段，再按 ID 更新持久化记录。这为前端对齐消息和补齐断线期间文本提供契约，而不是让前端只盲目拼接增量。检查点有间隔，突发退出仍可能丢失尾部。真实前端是否正确消费快照还需要应用路径的集成验证，不能单凭一份字段镜像测试就宣布永不重复。

### Q05.3 什么情况下不能发布成功？应用重启会接着跑旧任务吗？

后端流未给出完成事件、出现错误、被取消或终态保存失败时，都不能把任务当成功；会话层在记录刷新和终态处理后才决定是否发布完成。重启恢复把残留运行标记为 interrupted，研究子任务也类似处理，保留已有报告而不自动重放网络工作。事件类型只是契约，是否保存、重试和继续执行是额外实现；当前不能宣称完整事件回放、自动续跑和零丢失。

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
| 个人贡献 | 区分自己做的事件消费者/持久化与框架事件定义；用真实应用断言证明行为，不能只展示两份相同的测试内映射。 |

**诚实降级句**：能确定的是上述源码机制；没有亲自运行或没有独立理解的分支，不声称已经联调通过，也不编造开发事故。

## 共用问题：与参考项目、SDK 和 AI 辅助的关系

> 这是围绕个人研究场景建设的项目，参考了 Craft Agents 的架构，模型能力依赖现有 SDK。我重点介绍项目里的工具装配、受限委派、历史构建和执行记录。个人实际完成的部分应以我修改过的提交和能解释的取舍为准；使用 AI 辅助的部分也如实说明，不把整个参考仓库或 SDK 的能力算成我独立写出的代码。

这段不是要求把自己说成“只会套壳”，而是要求讲清**在哪个接口上做了什么增量**。没有本人贡献证据时，不把“主导、从零、全部独立研发”塞进答案。

## 演练方式

先不看答案讲通一次主流程，再打开相应函数解释取消、预算或终态中的一个分支。能把例子落到字段和调用路径，再进入下一组。说不清的点保留为项目架构认知，而不是抬高到个人熟练能力。