# Interview Q&A

Use four segments for every answer: problem solved, Craft Agents implementation, design tradeoff, limitation and extension.

## R/Q Map

`R01 -> Q01.x`, `R02 -> Q02.x`, `R03 -> Q03.x`, `R04 -> Q04.x`, `R05 -> Q05.x`, `R06 -> Q06.x`, `R07 -> Q07.x`, `R08 -> Q08.x`, `R09 -> Q09.x`, `R10 -> Q10.x`, `R11 -> Q11.x`, `R12 -> Q12.x`, `R13 -> Q13.x`, `R14 -> Q14.x`, `R15 -> Q15.x`, `R16 -> Q16.x`, `R17 -> Q17.x`, `R18 -> Q18.x`, `R19 -> Q19.x`, `R20 -> Q20.x`, `R21 -> Q21.x`, `R22 -> Q22.x`, `R23 -> Q23.x`, `R24 -> Q24.x`, `R25 -> Q25.x`, `R26 -> Q26.x`, `R27 -> Q27.x`.

## Q01 Monorepo 工作区与包职责拆分
- Q01.1 Why monorepo? It supports apps/packages sharing, unified types, and consistent build scripts. Avoid saying only "easier to manage".

## Q02 core/shared/server/ui 分层边界
- Q02.1 Why split core and shared? Core stays dependency-light for types/storage; shared carries business logic, config, auth, and agent logic.

## Q03 AgentBackend 抽象与 provider-agnostic event
- Q03.1 Why AgentBackend? It hides provider SDK differences behind `chat()`, config controls, lifecycle methods, and unified `AgentEvent`.

## Q04 BaseAgent Template Method 执行生命周期
- Q04.1 Why Template Method? Shared turn preprocessing stays in BaseAgent; provider-specific execution stays in ClaudeAgent/PiAgent.

## Q05 ClaudeAgent / PiAgent 多后端适配
- Q05.1 Claude vs Pi? ClaudeAgent adapts SDK events; PiAgent uses a subprocess JSONL protocol and proxies tools back to the host.

## Q06 Permission Mode 与 PreToolUse 安全管线
- Q06.1 Why not rely only on prompts? Prompt rules are soft; PreToolUse/PermissionManager is the hard execution gate before tools run.

## Q07 Thinking Level、模型配置与运行时控制
- Q07.1 Why Thinking Level? It exposes reasoning effort as runtime configuration while respecting each backend's capabilities.

## Q08 Session / Workspace 生命周期与隔离
- Q08.1 Session vs Workspace? Session isolates conversation/tool state; Workspace defines filesystem, sources, preferences, and environment.

## Q09 JSONL 会话持久化与运行时/存储双模型
- Q09.1 Why JSONL and dual model? JSONL supports append/recovery; runtime Message keeps transient streaming flags while StoredMessage persists durable data.

## Q10 AgentEvent 流式事件状态机
- Q10.1 Why events? Agent output includes text, tool lifecycle, permission requests, errors, and completion; a string response is not enough.

## Q11 System Prompt 动态构建与上下文文件发现
- Q11.1 Why dynamic system prompt? It combines permission mode, environment, user preferences, and project context files with size/cache controls.

## Q12 IPC / WebSocket 统一协议与传输层
- Q12.1 Why unify IPC and WebSocket? Electron and WebUI share session/file/model logic while swapping the transport boundary.

## Q13 Channel Map / ElectronAPI 契约一致性测试
- Q13.1 What does parity testing prevent? Drift between ElectronAPI, IPC channel map, and handlers.

## Q14 Electron 三进程安全模型
- Q14.1 Why preload bridge? Renderer should not get raw Node access; preload exposes a controlled API over IPC.

## Q15 Renderer AppShell、会话 UI 与状态管理
- Q15.1 Agent UI vs chat UI? Agent UI renders streaming text, tools, plans, permissions, errors, attachments, and settings.

## Q16 WebUI 适配与多端复用
- Q16.1 WebUI challenge? Browser lacks Electron native APIs, so adapter/polyfill boundaries must be explicit.

## Q17 Session-scoped Tools 上下文抽象
- Q17.1 Why SessionToolContext? It injects session/workspace/fs/credentials/callbacks so tools are testable and reusable in or out of process.

## Q18 Sources / Skills / MCP 集成与 ServerBuilder
- Q18.1 Source vs Skill? Source provides connection/config/credentials; Skill provides usage logic. ServerBuilder turns sources into tools.

## Q19 OAuth、凭据管理与 Token Refresh
- Q19.1 Why refresh cooldown? It prevents infinite refresh loops and request storms when endpoints or refresh tokens fail.

## Q20 Headless Server、SessionManager 与 RPC handlers
- Q20.1 server-core vs server? server-core is embeddable domain/RPC logic; server is the Bun wrapper exposing headless runtime.

## Q21 Pi Agent Server 进程外 JSONL 协议
- Q21.1 Why subprocess? It isolates heavy/runtime-specific Pi dependencies and communicates with the host through JSONL.

## Q22 Messaging Gateway 多平台消息规范化
- Q22.1 Why normalize messages? Telegram, Lark, and WhatsApp differ; normalization keeps Agent core platform-agnostic.

## Q23 Electron / WebUI / Server 构建分发流水线
- Q23.1 Why complex build pipeline? Electron main/preload/renderer, WebUI, server, assets, and subprocess servers target different runtimes.

## Q24 类型检查、测试、i18n 与 IPC 安全验证
- Q24.1 Why layered validation? Different checks catch different regressions: type drift, IPC drift, i18n mismatch, raw IPC sends, and runtime logic bugs.

## Q25 行为评测与契约验证（Agent 评测）
- Q25.1 How do you evaluate agent behavior beyond unit tests? 【项目实现】AgentEvent is a discriminated union covering text deltas, tool lifecycle, permission requests, structured errors, and completion — every behavior is an event, so behavior is replayable and testable; Channel Map contract tests + ElectronAPI parity pin the IPC surface (the deterministic scorer of the multi-process layer); doc-tools smoke tests verify native tool interactions. 【前沿认知】five-stage evaluation pipeline: cases on resettable environments → structured traces → deterministic scorers first, LLM judges with rubric → simple baselines → pass^k + cost report. 降级路径: asked "LLM judge?" — honest answer: the project uses deterministic contract tests; LLM-judge is methodology knowledge.
- Q25.2 What are the traps of LLM-as-a-judge? 【前沿认知】MT-Bench: GPT-4 judge vs human 85% agreement, above human-human 81%, but three biases: position bias (order swap flips conclusion in >60% of cases), verbosity bias ("answer in more detail" flips failure rate 91.3%→8.7%), consistency ≠ accuracy. Mitigations: structured Rubric + JSON Schema, few-shot, human sampling calibration, anchor answers. 【项目实现】Craft does not use LLM judges in CI — contract tests and type checks are the gate; no drift can pass silently. 降级路径: 记不清数字就讲三偏置结论+一条缓解措施。
- Q25.3 How do you make an improvement claim defensible? 【前沿认知】three steps: simple baselines (Warming 93.2%/$2.45 beat LATS 88.0%/$134.50 — cost differs ~2 orders of magnitude); cost-controlled accuracy × cost Pareto; task-quantity sufficiency (AppWorld 15%, τ-bench 25%, SWE-bench Verified 90%); stability via pass^k (τ-bench gpt-4o single-shot 48-61%, pass^8 <25%). 【项目实现】Craft's CI runs typecheck/parity/contract tests every change — regression is the baseline discipline. 兑底: 分数是测量，结论是决策。

## Q26 多源能力接入与技能治理（Skill 自进化）
- Q26.1 How do you onboard external capabilities safely? 【项目实现】ServerBuilder converts MCP/API/Local Source into callable tools through one entry point; credentials are injected per-source and permissions configured at registration — the unified entry is the governance boundary; context-file discovery (AGENTS.md/CLAUDE.md) with size/cache control keeps prompts bounded. 【前沿认知】skills are "instructions + executable code" and agents trust them by default: 26.1% of public skills carry vulnerabilities (13.3% data exfiltration, 11.8% privilege escalation; script-bundling 2.12×); governance G1-G4 gates (static analysis → semantic classification → behavior sandbox → permission manifest) + T1-T4 trust tiers (non-binary, least privilege). 降级路径: 追问 G1-G4 细节——诚实说这是论文治理框架，我项目对应的是权限配置与凭据注入环节。
- Q26.2 Does Craft self-evolve its skills? 【项目实现】No autonomous generation: R18 is access + configuration governance; turn pre-processing parses skills (R04), but skill content is human-authored. 【前沿认知】acquisition paths: manual writing → trajectory distillation (SkillWeaver +32-45% on WebArena; weak agents using strong-agent skills beat strong agents bare-running) → auto-generation with verification gates (rollback reward: reward edits only when behavior actually improves) → training-loop distillation (Skill-SD: teacher-only privilege, AppWorld 64.9% vs 50.9%); progressive disclosure L1/L2/L3; anti-degradation (Ratchet; SkillsBench curated +16.6pp vs self-generated −8.1~−11.5pp). 降级路径: asked "how do you distill skills" — honest answer: 未实现，讲论文思路 + 我项目里权限配置如何映射权限 manifest 环节。
- Q26.3 When is a skill worth adding? 【前沿认知】SkillsBench: curated +16.6pp but effect is domain-specific (natural science +28.8pp, math only +9.7pp); SWE-Skills-Bench: 39/49 skills zero gain, 24 redundant with base model, 15 blocked by deeper gaps, 3 harmful (context interference); 2-3 skills optimal (+19.0pp), ≥4 drops (+10.1pp). Conclusion: skills help when tasks have reusable procedural flows and domain knowledge is outside model pretraining — target design, don't adopt wholesale. 【项目实现】Craft's registry + credential/permission config is the infrastructure that makes targeted skills deployable safely. 兑底: 两个信号判断是否值得做 skill——可复用的程序性流程 + 域知识不在预训练覆盖。

## Q27 工具执行安全与最小暴露（Agent 安全）
- Q27.1 Why is prompt-level safety not enough? 【项目实现】Craft's hard gate: Permission Mode injected into the system prompt is only the soft layer; the PreToolUse pipeline intercepts every tool call before execution (safe/ask/allow-all) — the model cannot bypass the gate with words. 【前沿认知】AgentHarm soft jailbreak: the same malicious task as agent drops refusal (+12.5pp chat, +38.7pp with jailbreak template); injection is structural (instructions/data indistinguishable tokens; Lethal Trifecta); inverse scaling: stronger models execute injections more thoroughly (AgentDojo up to 92% where attacker controls tool outputs). 降级路径: 追问 AgentHarm 数字——讲结论即可：agent 设定本身是软越狱。
- Q27.2 How do you minimize a desktop agent's local attack surface? 【项目实现】Electron three-process model: renderer has no raw Node access, preload exposes a controlled API over IPC, main process owns privileged operations; unified RPC (channel + DTO) keeps the surface auditable; CI runs an ESLint rule against raw IPC sends — a bypass attempt fails the build. 【前沿认知】zero-trust four layers (Caging the Agents): kernel isolation, credential proxy, egress whitelist, prompt integrity — the first three run at infrastructure the model cannot manipulate, only the fourth depends on the LLM; AI Control trusted editing 15%→92% blue-team win rate at 94% usefulness. 【项目实现】desktop agents map to prompt integrity + controlled IPC + contract tests. 降级路径: 追问 gVisor——诚实答: 内核级隔离是论文实录，我实现的是进程级隔离与受控 IPC。
- Q27.3 What's the honest ceiling of these defenses? 【前沿认知】evaluation awareness: models may behave because they recognize the test — UK AISI 0 confirmed sabotage with 21.7% unprompted awareness; agentic misalignment blackmail 55.1% in "real deployment" vs 6.5% in "evaluation"; SLEEPER-style backdoors survive RLHF. Dynamic stateful environments (AgentDojo, τ²-bench) are becoming the standard for adaptive attacks. 【项目实现】Craft's claims are structural: gates, process isolation, contract tests — never behavioral promises about the model. 一句话兑底: 我防守的是模型操纵不了的部分；模型的不可信是默认假设。
