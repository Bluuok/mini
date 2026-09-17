# Resume Points

Select 4-5 points only. Match every selected point to Q&A in `interview-qa.md`.

## Point Index

| ID | Title | Level | Best For | Q&A | Wiki | What to Explain | Interview Risk | Scope Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R01 | Agent Loop execution loop | Medium | AI app, Agent, backend | Q01.1-Q01.3 | W01 | How user input enters Agent Loop; how model returns `assistant` or `tool_calls`; how tool results append back; when termination occurs | If you cannot explain the `tool_calls` -> `tool_result` feedback loop, don't make this a core highlight | Loop orchestration only; maxSteps termination is in scope, but empty-response retry / thinking-stop recovery belongs to R02 state machine |
| R02 | Agent Turn state machine and recovery | High | Agent infra | Q02.1-Q02.3 | W01 | Why Agent isn't a single request; difference between progress and final; how empty responses and thinking stops recover | Source-level point; only claim if you can explain the turn states | — |
| R03 | ModelAdapter abstraction | Medium | AI app, backend | Q03.1-Q03.2 | W02 | Why Agent Loop doesn't call Anthropic API directly; how adapter returns unified `AgentStep` | Don't exaggerate as supporting all models; write "isolates provider differences" | — |
| R04 | System prompt construction | Medium | AI app, Agent | Q04.1-Q04.2 | W03 | System prompt is not just role-setting but Agent capability manifest and behavior constraints | Don't say "auto-optimize prompts to improve accuracy by xx%" | — |
| R05 | Token estimation and context monitoring | Medium | LLM engineering | Q05.1-Q05.2 | W04 | Why token estimation is needed; why combine provider usage and local estimation | Don't claim specific percentage savings without your own measurements | — |
| R06 | Layered context compaction | High | LLM engineering, Agent infra | Q06.1-Q06.3 | W04 | Four compaction triggers, differences, and trade-offs; why not simply delete history | High-frequency deep-dive target; must distinguish "modifying history" from "projection view" | — |
| R07 | Large tool-result offloading | High | Agent infra, tooling | Q07.1-Q07.3 | W04/W12 | Why tool output can blow up context; difference between offloading and truncation | Don't call it vector retrieval or long-term memory; CodeWiki supports local offload and replacement | — |
| R08 | ToolDefinition and ToolRegistry | Low/Medium | Backend, Agent tools | Q08.1-Q08.2 | W05 | Why tools need schema; why a registry is needed; how model output becomes safe function calls | Don't just recite Tool Calling concepts; ground it in registry design | Registry provides the dispatch contract only; business tools (DB query, external API, IM send) must be self-built and registered, not native |
| R09 | Built-in file/search tools | Low | CLI, tooling | Q09.1-Q09.2 | W06 | How Agent observes codebase; why paginate reads; why limit search output | Not difficult, but need to explain engineering value of "controlled Agent observation" | — |
| R10 | Review-before-write diff flow | Medium | Safety, tooling | Q10.1-Q10.2 | W08 | Why Agent file writes shouldn't go directly to disk; how diff reduces risk; how approval connects to TUI | Don't just say "added permissions"; explain the `diff -> ensureEdit -> writeFile` path | Approval covers file-write tools only (write/edit/patch/modify); non-file actions (message send, API call) are out of scope and need a self-built gate. Naming `PermissionManager` pulls this into R12 (High) territory |
| R11 | Shell execution and background tasks | Medium | CLI, backend | Q11.1-Q11.2 | W07 | Why `git status` and `rm -rf` have different permission levels; why piped commands need stricter review; how background tasks are tracked | Don't give the impression Agent can execute arbitrary commands | — |
| R12 | PermissionManager | High | Safety, backend | Q12.1-Q12.3 | W08 | Least privilege, session-scoped permissions, persistent permissions, dangerous command classification | If you can't explain permission state lifecycle, don't make this core architecture | — |
| R13 | MCP host integration | High | AI platform | Q13.1-Q13.2 | W09 | Difference between MCP and local tools; why namespace isolation; how MCP enters tool system | Don't say "implements full MCP protocol"; only claim covered integration points | — |
| R14 | MCP config, token, protocol cache | High | Platform, infra | Q14.1-Q14.2 | W09 | Why tokens separate from project config; why protocol caching accelerates connections | Platform-level point; suits those comfortable with config systems | — |
| R15 | Skills progressive loading | Medium | Agent apps, workflows | Q15.1-Q15.2 | W10 | Skills vs MCP difference; why not load all Skills at once; discovery priority design | Don't write as "auto-learns new skills"; this is a workflow loading mechanism | Skills carry Markdown process/instruction knowledge, not vector-retrieval knowledge bases; relevance is judged by the model from summaries, not a rule engine |
| R16 | TUI ScreenState | Medium | CLI, DevTools | Q16.1-Q16.2 | W11 | How terminal apps stay interactive; why state-driven redraw; how permission dialogs block Agent | Don't describe TUI as ordinary command-line output | — |
| R17 | Slash commands and local shortcuts | Low/Medium | CLI, tooling | Q17.1-Q17.2 | W11 | Which commands go to local tools, which go to Agent; why deterministic ops can bypass the model | Engineering UX point; don't package as core Agent intelligence | — |
| R18 | Session persistence and fork/resume | Medium | Backend, Agent | Q18.1-Q18.2 | W12 | Why JSONL; how session events reconstruct history; why fork needs parentUuid | Don't write as distributed storage or collaboration system | Provides structured process data (events) for replay/audit; metrics/ROI systems are a separate layer on top, not part of R18. Fork = exploration branches, not human handoff/escalation |
| R19 | Layered config system | Low/Medium | Backend, platform | Q19.1-Q19.2 | W13 | Config priority; why env vars are highest; boundary between user-level and project-level config | Basic but practical; pairs well with MCP or CLI points | — |
| R20 | Web search/fetch tools | Low/Medium | AI app | Q20.1-Q20.2 | W07 | Why search and fetch are two tools; how to control webpage content size entering context | Don't describe as a full crawler system | — |
| R21 | Progress/final response protocol | Medium | Agent UX, TUI | Q21.1-Q21.2 | W01/W11 | Why separate progress from final; how long tasks show users Agent is still working | Thin alone; pairs best with TUI or Agent Loop | — |
| R22 | Lightweight Claude Code reference implementation | Low | Project intro | Q22.1-Q22.2 | W00 | Why the project has learning value; difference from big platforms; why suitable for resume | Don't write "replicates Claude Code"; safer to say "references core interaction patterns" | Terminal single-process, not a scheduled/always-on system; "cross-day" = re-launch session, not background daemon |

| R23 | 受控验证闭环（Agent 评测） | Medium | AI app, Agent, LLM 工程 | Q23.1-Q23.3 | W01/W07/W12 | 为什么评测是 Agent 工程的反馈回路；确定性验证信号优先（测试通过/断言）而非模型判断；结构化轨迹回放作为回归依据；成本与任务量意识 | 评估基础设施在 MiniCode 是 ROADMAP 未实现项，不得写成已有基准集/LLM 裁判；严格区分【项目实现】与【前沿认知】 | 由 R03（MockModelAdapter 离线可测）、R10（diff 审查）、R11（测试执行）、R18（JSONL 轨迹）支撑，是对既有能力的评测视角整合；不含独立基准集与 LLM 裁判流水线 |
| R24 | Skills 渐进披露与技能治理（Skill 自进化） | Medium | Agent 应用、知识工程、工作流 | Q24.1-Q24.3 | W10 | Skill 是程序性知识工件而非 prompt/工具；渐进披露 L1/L2/L3 如何控制上下文成本；发现环节不是瓶颈、质量才是；防退化与治理意识 | 轨迹蒸馏/自进化/Ratchet 是前沿认知不是 MiniCode 已实现；不要说"自动生成技能" | 实现=R15 渐进披露与按需加载；治理与自进化概念仅作面试扩展表达，不写入已实现 |
| R25 | 受控执行与安全边界（Agent 安全） | Medium-High | Agent 安全、工具链、后端 | Q25.1-Q25.3 | W07/W08 | Agent 安全防"做"不防"说"；注入是结构性问题；信任边界下移；行动护栏（写盘审批、命令分级） | 本地单进程工具边界（无多租户/凭据托管/网络白名单）；不要把论文防御体系说成已实现 | 实现=R10/R11/R12/R04（diff 审批、命令风险分级、权限状态机、权限上下文注入）；容器隔离/凭据代理/网络白名单等平台级防御属前沿认知 |

## Resume Bullets

R01: 针对多轮编码任务中模型推理与工具调用缺乏统一编排、长任务易中断的问题，基于模型-工具-模型循环的 Agent 执行模式，设计了以 `runAgentTurn` 为核心的执行循环（协调模型推理、工具调用、结果回填与终止检查），实现了多轮编码任务的稳定闭环执行。

R02: 针对 Agent 单次请求无法表达进度、空响应与思考中断等异常导致任务悬挂的问题，基于状态机建模，设计了 Agent Turn 状态机（覆盖 assistant 消息、进度更新、工具调用、空响应恢复、可恢复思考中断与最大步数终止），实现了长链路任务的异常可恢复。

R03: 针对 Agent Loop 直连具体模型 SDK 导致核心逻辑耦合、难以测试的问题，基于适配器抽象，设计了 `ModelAdapter` 模型适配层（统一消息转换、响应解析与 mock 测试），实现了核心循环与模型供应商的解耦。

R04: 针对 Agent 运行缺乏能力边界约束、上下文信息零散注入的问题，基于系统提示词工程，设计了系统提示词装配流程（注入权限上下文、Skills 摘要、MCP 状态、记忆文件与响应协议），实现了每轮执行前能力边界的一致注入。

R05: 针对长会话上下文消耗不可见、压缩决策缺乏量化依据的问题，基于 Provider usage 统计与本地 token 估算，设计了上下文监控机制（双路用量统计与利用率分级），实现了压缩触发决策的量化驱动。

R06: 针对长会话 token 无限增长导致成本上升与上下文质量劣化的问题，基于分层压缩策略，设计了四层上下文压缩（microcompact、context collapse、snip compact 与 auto compact），实现了长会话 token 增长的受控。

R07: 针对超大工具结果挤占上下文导致关键信息丢失的问题，基于结果外置化设计，设计了大型工具结果外置机制（超长输出落盘并以预览/指针替换，保留本地可追溯性），实现了上下文占用与可追溯性的平衡。

R08: 针对模型输出到安全函数调用之间缺乏契约与校验的问题，基于 JSON Schema 与注册表模式，设计了统一 `ToolDefinition`/`ToolRegistry` 契约（工具描述、参数校验、运行时验证与执行句柄），实现了工具调用的安全落地与统一调度。

R09: 针对 Agent 观察代码库时无界读取与搜索导致上下文失控的问题，基于受控观察设计，设计了工作区感知的文件/搜索工具（目录列举、分页读取、ripgrep 搜索、路径安全与输出上限），实现了 Agent 观测行为的受控。

R10: 针对 Agent 直接写盘存在误改与静默破坏风险的问题，基于 diff 审查与审批流设计，设计了写前审查流程（所有文件修改生成统一 diff，审批通过后才落盘），实现了文件写入风险的可控。

R11: 针对 Agent 执行任意命令带来的安全与失控风险，基于命令风险分级与权限检查，设计了受控 Shell 执行（命令归一化、shell 片段检测、风险分类、权限审批与后台任务追踪），实现了高危命令的可拦截。

R12: 针对权限审批状态分散、难以统一管理的问题，基于最小权限原则，设计了 `PermissionManager`（路径访问、命令执行与编辑审批，支持一次性/回合级/持久/反馈拒绝决策），实现了权限状态的生命周期化管理。

R13: 针对外部 MCP 能力接入缺乏统一入口、工具命名冲突的问题，基于 MCP 协议与命名空间隔离，设计了 MCP 外部能力层集成（stdio/HTTP 服务工具包装为内部 ToolDefinition），实现了外部工具与内置工具的统一调度。

R14: 针对多 MCP 服务配置分散、连接建立开销大的问题，基于配置合并与协议缓存，设计了 MCP 服务管理体系（用户/项目配置合并、远程 token 独立存储、协议协商与协议缓存），实现了 MCP 连接建立的加速。

R15: 针对全量加载 Skills 导致上下文浪费与启动变慢的问题，基于渐进式加载设计，设计了 Skills 渐进式加载机制（仅暴露名称/描述摘要，任务触发时按需加载完整 `SKILL.md`），实现了扩展能力与上下文成本的平衡。

R16: 针对终端 Agent 长任务期间缺乏可视化反馈、交互体验差的问题，基于状态驱动重绘，设计了全屏 TUI 交互层（`ScreenState` 管理对话、工具动态、上下文统计与权限弹窗），实现了终端交互体验的工程化。

R17: 针对确定性操作走模型推理导致延迟高、响应不稳定问题，基于本地工具直连设计，设计了斜杠命令与本地快捷键（`/read`、`/grep`、`/cmd` 直接映射确定性工具），实现了常用操作的即时可靠响应。

R18: 针对会话中断丢失、无法恢复与复现的问题，基于 JSONL 事件流存储，设计了会话持久化机制（事件流记录、resume 恢复、fork 分支、压缩边界与自动清理），实现了会话的可恢复与可审计。

R19: 针对多来源配置优先级混乱、覆盖关系不可预期的问题，基于分层配置设计，设计了分层配置解析（Claude settings、全局/项目 MCP、应用设置与运行时环境变量按优先级合并），实现了配置冲突的可预期解析。

R20: 针对网页内容无界进入上下文导致污染与成本问题，基于工具边界与内容控制设计，设计了 `web_search`/`web_fetch` 工具（域名过滤、可读性提取、重试退避、超时与截断），实现了外部信息获取的受控。

R21: 针对长任务执行期间用户缺乏进度感知、误判卡死的问题，基于进度/最终响应分离协议，设计了 progress/final 响应协议（长任务持续反馈状态、中间消息不终止轮次），实现了长任务的进度可感知。

R22: 针对 Agent 学习型项目难以作为可信简历落点的问题，基于轻量级参考实现思路，设计了可追溯的 Claude Code 风格 Coding Agent 参考实现（聚焦工作区感知、工具使用、安全审查、上下文治理与终端 UX），实现了核心交互模式的可验证复现。

R23: 针对 Agent 改动效果无法量化验证、回归不可见的问题，基于确定性验证信号与结构化轨迹，设计了受控验证闭环（MockModelAdapter 离线测试、diff 审查后执行测试作为验收信号、JSONL 会话轨迹回放），实现了改动效果的确定性归因与回归可追踪。

R24: 针对技能库规模增长导致上下文浪费、技能质量难以治理的问题，基于渐进式披露机制，设计了 Skills 分级加载体系（L1 元数据常驻、L2 全文按需加载、L3 资源按需注入，发现优先级排序），实现了扩展能力与上下文成本的平衡。

R25: 针对 Agent 自主执行造成误改文件与高危命令失控的问题，基于信任边界下移原则，设计了受控执行体系（写前 diff 审批、命令风险分级、权限状态机与权限上下文注入），实现了高危操作的硬拦截与最小权限落地。

## Risk Guidance

Risk Tier is the `Level` column above. Use it as the single source of truth.

- Low-risk: R09, R22.
- Low/Medium: R08, R17, R19, R20.
- Medium: R01, R03, R04, R05, R10, R11, R15, R16, R18, R21, R23, R24.
- Medium-High: R25. 需要能讲清权限状态机与审批流，且能区分【项目实现】与【前沿认知】。
- High: R02, R06, R07, R12, R13, R14.

If the user cannot explain the data flow, downgrade or remove high-risk points.

## Mastery-to-Point Mapping

- **L1** (Can explain what MiniCode is, but cannot explain source flow): Use conservative points — `R01`, `R08`, `R09`, `R10`, `R22`.
- **L2** (Can explain module responsibilities and data flow): Use balanced points — `R01`, `R04`, `R08`, `R10`, `R15`, `R18`, `R19`, `R23`, `R24`.
- **L3** (Can explain implementation trade-offs and failure modes): Allow high-risk points — `R02`, `R05`, `R06`, `R07`, `R12`, `R13`, `R14`, `R25`.

Before recommending a high-risk point, verify the user can:
- Explain why the module exists.
- Draw the data flow.
- Avoid claiming metrics without measurements.
- Confirm the point comes from implemented behavior, not roadmap/future direction.
