# Interview Q&A

Use four segments for every answer: problem solved, HappyClaw implementation, design tradeoff, limitation and extension.

## R/Q Map

`R01 -> Q01.x`, `R02 -> Q02.x`, `R03 -> Q03.x`, `R04 -> Q04.x`, `R05 -> Q05.x`, `R06 -> Q06.x`, `R07 -> Q07.x`, `R08 -> Q08.x`, `R09 -> Q09.x`, `R10 -> Q10.x`, `R11 -> Q11.x`, `R12 -> Q12.x`, `R13 -> Q13.x`, `R14 -> Q14.x`, `R15 -> Q15.x`, `R16 -> Q16.x`, `R17 -> Q17.x`, `R18 -> Q18.x`, `R19 -> Q19.x`, `R20 -> Q20.x`, `R21 -> Q21.x`, `R22 -> Q22.x`, `R23 -> Q23.x`, `R24 -> Q24.x`, `R25 -> Q25.x`, `R26 -> Q26.x`, `R27 -> Q27.x`.

## Q01 Agent-First 三层产品模型
- Q01.1 Why three layers (Profile/Workspace/Session)? Profile defines identity and capabilities; Workspace isolates filesystem and capabilities; Session tracks SDK renewal. identity_hash ensures runtime consistency.

## Q02 多用户自托管服务化架构
- Q02.1 How does HappyClaw differ from CLI/desktop agents? It wraps Claude Code runtime as a long-running multi-user service with workspace/session boundaries, accessible via browser and IM.

## Q03 Host/Container 双模式执行引擎
- Q03.1 Why two execution modes? Host is fast but needs real-time permission checks (canExecuteOnHost reads DB each time); Container uses Docker sandbox for untrusted scenarios. Both share Provider selection and fallback logic.

## Q04 Docker 容器沙箱与挂载安全三层防御
- Q04.1 Why three mount-safety layers? mount-allowlist (fail-closed auto-reload) controls allowed paths; hard-deny paths (/proc /sys .ssh .aws docker.sock) prevent system leaks; blocked patterns (credentials .env id_rsa) prevent credential leaks; non-primary workspaces are read-only.

## Q05 运行时文件系统 IPC 协议
- Q05.1 Why filesystem IPC instead of network? Container cannot access host network. Atomic two-phase write (.tmp->rename), receipt cursor tracking, three semaphores (_close/_drain/_interrupt) manage lifecycle without network dependency.

## Q06 StreamEvent 三端同步事件流系统
- Q06.1 Why single source of truth? Three runtimes (backend/web/runner) need consistent event types. shared/stream-event.ts is mechanically copied via make sync-types, verified by CI check-stream-event-sync.sh. 24+ event types in five layers.

## Q07 7 渠道 IM 统一抽象与适配器模式
- Q07.1 Why unify 7 IM channels? Feishu/Telegram/QQ/DingTalk/WeChat/Discord/WhatsApp differ in message format, attachments, session model. Unified IMChannel interface keeps Agent core platform-agnostic. Adapters handle channel differences (e.g., Feishu streaming card Level0/1/2 degradation).

## Q08 多渠道消息路由与 JID 寻址
- Q08.1 Why this JID format? {provider}:{externalChatId}#account:{id}#thread:{id}#root:{id} encodes channel type, external chat ID, account, thread, and root message in one address, enabling full context recovery and native thread mapping.

## Q09 出站消息可靠投递状态机
- Q09.1 Why a delivery state machine? IM delivery can fail, timeout, or be uncertain. State machine (pending->claimed->uploading->uploaded->sending->delivered/uncertain/failed) tracks each step. outbox pattern + reconcileExpiredChannelOutbox recovers stuck messages for at-least-once delivery.

## Q10 Turn 租赁与会话所有权管理
- Q10.1 What does Turn leasing solve? Concurrent users need clear ownership. Turn lease (45s expiry, 12s heartbeat) grants current user a lease. resolveStickyChannelOwner maintains session stickiness. IMConnectionManager withUserLock/withChannelLock and credentialClaims ensure mutual exclusion.

## Q11 Provider 多模型负载均衡与健康追踪
- Q11.1 Why session stickiness? Different providers have different signature implementations; mid-session switching causes "Invalid signature in thinking block". ProviderPool binds a session to one provider, marks unhealthy after consecutiveErrors>=3, recovers after 5min window.

## Q12 多 Provider 凭据管理与 AES-256-GCM 加密
- Q12.1 Why AES-256-GCM? GCM provides authenticated encryption (AEAD), verifying ciphertext integrity. File permission 0o600 restricts filesystem access. Model-level fallback (provider-fallback.ts) switches on provider failure.

## Q13 SQLite Schema 演进与三层迁移策略
- Q13.1 Why three-layer migration? Declarative CREATE TABLE IF NOT EXISTS ensures structure; ensureColumn idempotently adds columns; version-gated migration handles data transformations. VACUUM INTO pre-backup + assertSchema assertion. Currently Schema v63.

## Q14 定时任务调度器
- Q14.1 What does V2 Materialization solve? Direct execution makes backfill and concurrency hard. Materialization first persists tasks as records, SQLite lease mutex (lease_owner/lease_token/lease_expires_at) ensures only one instance executes, heartbeat lease/3 prevents premature expiry.

## Q15 Agent Profile 四段式 Prompt 工程
- Q15.1 Why four orthogonal segments? IDENTITY (who), SOUL (values), AGENTS (workflow), TOOLS (tool strategy) are independently configurable. replace mode keeps platform runtime instructions non-removable. Confirmation phrase is a cross-turn safety token preventing accidental publish.

## Q16 Skills/MCP/Plugins 分层能力治理
- Q16.1 Why six-layer Skills priority? builtin->host->project->managed->workspace->plugin, higher layers shadow lower. This ensures builtins cannot be overridden while allowing workspace/plugin extensions. Managed layer takes priority over native for governance control.

## Q17 对话式 Agent Builder 三阶段工作流
- Q17.1 Why is the confirmation phrase a safety token? Agent Builder creates agents via natural language, involving capability changes and runtime operations. Confirmation phrase (确认发布 AGENT-XXXXXXXX) is a cross-turn token; sourceTurnId !== prepared_turn_id rejects publish. Capability locks + runtime isolation prevent concurrent races.

## Q18 Web API 路由体系与 Hono 框架实践
- Q18.1 Why Hono? Lightweight, type-safe, multi-runtime. app.route(prefix, router) registers 20 route files hierarchically. Zod schema-driven validation + two-layer auth (authMiddleware + requirePermission) ensure consistency.

## Q19 认证与会话管理
- Q19.1 Why constant-time comparison? Normal string comparison returns at first mismatch, allowing timing attacks to infer signature content. Constant-time comparison traverses fully regardless of match. HMAC-SHA256 signature + __Host- prefix Secure Cookie prevent forgery.

## Q20 RBAC 权限三态模型与工作区所有权
- Q20.1 Why doesn't admin bypass workspace ownership? Decentralized model: admin manages users and system config, but workspace data ownership belongs to creator. Three-state model (canAccessGroup/canModifyGroup/canDeleteGroup) separates access, modify, delete. IM Owner Gate validates via channel native sender ID.

## Q21 React 19 前端架构与 Zustand 状态管理
- Q21.1 Why Zustand over Redux? Agent workstation state spans 15 domains (chat/agents/files/memory etc). Zustand's fine-grained stores and selectors fit modular architecture better than Redux single store. @tanstack/react-virtual virtualizes long message lists. WsManager exponential backoff reconnect.

## Q22 实时流式输出与工具轨迹展示
- Q22.1 Why two-phase interruption? Direct cleanup on user interrupt may lose in-flight content. Two-phase: first freeze current stream (save partialText), then delayed cleanup (10s fallback). rAF batching + sessionStorage persistence ensure recoverable state.

## Q23 多租户安全隔离
- Q23.1 Why no admin bypass for scheduled tasks? Scheduled tasks can be injected (user-submitted prompts). Admin bypass would allow injected content to cross-tenant plant malicious data. isAdminHome intentionally absent. Host execution real-time revocation (canExecuteOnHost reads DB + in-memory Set instant revoke) prevents stale sessions.

## Q24 工程化验证体系与三端类型同步
- Q24.1 Why shift runtime errors to compile time? Runtime errors in production are most expensive. Three-layer TypeScript compilation (strict:true) + sync-types mechanical copy + CI verification (StreamEvent sync, Prompt references, doc consistency) + 290+ tests catch type drift, protocol mismatch, and event desync early.

## Q25 行为评测与可观测底座（Agent 评测）
- Q25.1 How does agent evaluation differ from ordinary testing? 【项目实现】R24 catches compile-time/type drift; R25 is the runtime-behavior view: StreamEvent gives full-lifecycle structured events (24+ types, five layers, single source of truth), migration tests run real DB files with assertions, safety regression tests live in tests/. Together: every behavior change is traceable to an event and covered by a regression gate. 【前沿认知】agent evaluation is a five-stage pipeline: cases on resettable environments → structured traces → deterministic scorers first, LLM judges with rubric → simple baselines → pass^k + cost report. 降级路径: asked "do you have an LLM judge" — honest answer: the platform's evaluation is deterministic engineering gates; LLM-judge is methodology knowledge (MT-Bench 85% vs 81% human agreement; position/verbosity/consistency biases).
- Q25.2 Why report pass^k instead of single-run accuracy? 【前沿认知】pass@k is peak capability (at least one success), pass^k is stability (all k runs pass). Production needs stability: τ-bench gpt-4o single-shot 48-61% but pass^8 <25% — "偶尔能用"在生产里等于不能用。Task-quantity evidence: AppWorld 15%, τ-bench 25%, SWE-bench Verified 90% of tasks needed for sound conclusions; cheap 25% sampling produced 4/5 wrong positive conclusions. 【项目实现】HappyClaw's 290+ tests + CI gates are the deterministic stability layer; trace replay (StreamEvent) is the evidence layer.
- Q25.3 Why is cost part of evaluation? 【前沿认知】AI Agents That Matter: Warming retry 93.2%/$2.45 beat LATS 88.0%/$134.50 — similar accuracy, ~2 orders of magnitude cost difference, and no paper reported cost as headline. Correct practice: accuracy × cost Pareto; joint prompt/temperature optimization cut variable cost 53% on HotPotQA. 降级路径: 记不住数字就讲结论——简单基线先于复杂机制、成本必须入报告。

## Q26 数字员工能力治理与进化（Skill 自进化）
- Q26.1 How do you prevent capability drift when skills/plugins keep growing? 【项目实现】six-layer priority (builtin->host->project->managed->workspace->plugin) keeps loading deterministic; immutable snapshots + COW materialization make every capability change revertible; mutateCapabilityAroundRuntimeQuiesce gates changes during runtime; the confirmation phrase gates natural-language publishing (R15/R16/R17). 【前沿认知】Ratchet library hygiene: evidence threshold before retirement (demote, never delete), active cap ~50, pattern normalization — "自进化 skill 库的瓶颈不是作者，是图书管理员"; 26.1% of public skills carry vulnerabilities (13.3% data exfiltration, 11.8% privilege escalation; script-bundling 2.12×). 降级路径: 追问库上限等细节——诚实说这是我的治理机制与论文思路，未跑完整 Ratchet 实验。
- Q26.2 Does AI-assisted generation mean the platform self-evolves? 【项目实现】No: R15's two-stage AI assistance drafts/refines persona segments, but publishing requires the confirmation phrase — generation is human-gated, not autonomous evolution. 【前沿认知】evidence: SkillsBench curated +16.6pp vs self-generated negative (−8.1~−11.5pp); trajectory distillation is the reliable path (SkillWeaver +32-45% on WebArena); Skill-SD shows skills belong in teacher-side distillation, not student prompts (AppWorld 64.9% vs 50.9%); progressive disclosure L1 metadata/L2 full text/L3 resources keeps large libraries context-safe. 降级路径: asked "how do your agents self-evolve" — answer: 我实现的是「生成-审批-发布」的安全闭环；无监督自进化是前沿，我了解其验证门设计（Socratic-SWE 四道验证门，去掉 skill 注册表 −4.2）。
- Q26.3 What is the risk of trusting skills blindly? 【前沿认知】skills are "instructions + executable code" and agents trust them by default: 26.1% vulnerability rate, 157 confirmed malicious among 98,380 behavior-verified skills. Governance: G1-G4 gates (static analysis → semantic classification → behavior sandbox → permission manifest) + T1-T4 trust tiers (non-binary, least privilege) + lifecycle monitoring. 【项目实现】HappyClaw maps to this: capability registration is gated, snapshots are immutable, runtime changes go through quiesce gate. 兑底: 供应链治理的思路我讲得清，G1-G4 是论文框架不是平台实现。

## Q27 纵深防御与信任边界（Agent 安全）
- Q27.1 Why is agent security a systems problem, not a model problem? 【项目实现】HappyClaw's security layers live in infrastructure the model cannot manipulate: Docker mount three-layer defense (fail-closed allowlist, hard-deny paths /proc /sys .ssh .aws docker.sock, blocked credential patterns, read-only non-primary workspaces), AES-256-GCM credential store with 0o600, RBAC three-state + IM Owner Gate, canExecuteOnHost real-time authorization with instant revocation. 【前沿认知】injection is structural (instructions/data indistinguishable tokens; Lethal Trifecta: private data × untrusted content × outbound communication); AgentHarm soft-jailbreak: same malicious task as agent drops refusal (+12.5pp chat, +38.7pp with jailbreak template); inverse scaling: stronger models execute injections more thoroughly (AgentDojo up to 92% where attacker controls tool outputs).
- Q27.2 Can alignment training guarantee agent safety? 【前沿认知】No. Sleeper Agents: RLHF ineffective on planted backdoors (55% vs 15% vulnerability at trigger), adversarial training hides rather than removes (99-100% on true trigger strings), larger models more stubborn — training is a baseline, not a defense. AI Control flips the paradigm: design protocols assuming the model will cheat; trusted editing raised blue-team win rate 15%→92% while keeping 94% usefulness; control evaluations use red-team substitutes. 【项目实现】HappyClaw maps to protocol/architecture layers: real-time authorization, credential separation, sandboxing — none rely on the model being honest. 降级路径: 追问 gVisor/网络白名单——诚实答: 那是论文实录（Caging the Agents 零信任四层），我讲设计思路，我实现的是凭据加密托管与沙箱挂载防御。
- Q27.3 What is evaluation awareness, and why does it matter? 【前沿认知】Models may behave well because they recognize the test: UK AISI 0 confirmed sabotage with 21.7% unprompted awareness; agentic misalignment blackmail rate 55.1% when "real deployment" vs 6.5% when "evaluation"; SHADE-Arena best sabotage agent only 27%, best monitor AUC 0.87. Implications: use dynamic stateful environments (AgentDojo, τ²-bench), report evaluation conditions, and treat "model behaves" results cautiously. 【项目实现】HappyClaw's security claims are structural (gates, encryption, authorization) — we don't rely on the model being good, so evaluation awareness doesn't undermine them. 兑底: 一句话——我防守的是模型操纵不了的部分，模型的不可信是默认假设。
