# Combo Plans

Use these defaults before reading detailed resume points.

## A. Conservative Beginner

- Use for: low mastery, afraid of source-level interview.
- Min mastery: L1+.
- Points: `R01`, `R08`, `R09`, `R10`, `R22`.
- Summary: Lightweight terminal AI Coding Agent with multi-turn tool use, workspace file tools, and review-before-write safety.
- Avoid: `R06`, `R07`, `R13`, `R14` unless user can explain them.

## B. AI Application

- Use for: AI app developer, LLM application engineer, Agent app role.
- Min mastery: L2 (see warning).
- Points: `R01`, `R04`, `R06`, `R13`, `R15`.
- Summary: Agent application architecture with execution loop, system prompt assembly, context governance, MCP tool extension, and progressive Skills loading.
- Warning: R06 and R13 are High-risk (L3 recommended). For L2 users, offer downgrade.
- Fallback: For L2 users, replace `R06` with `R05`, yielding `R01, R04, R05, R15, R13`. For L1 users, use Plan G instead.

## C. Backend Engineering

- Use for: backend, platform, infrastructure.
- Min mastery: L2.
- Points: `R08`, `R12`, `R18`, `R19`, `R14`.
- Summary: Backend infrastructure for an AI Coding Agent: tool registry, permissions, session persistence, layered config, MCP server management.
- Fallback: Replace `R14` with `R10` for safer interview depth.

## D. CLI / Developer Tooling

- Use for: CLI tools, developer experience, terminal products.
- Min mastery: L2.
- Points: `R09`, `R11`, `R16`, `R17`, `R21`.
- Summary: Terminal-first AI Coding Agent with workspace tools, controlled shell execution, full-screen TUI, slash commands, and progress protocol.
- Fallback: Replace `R21` with `R18` for backend-heavy resumes; update Q-prep accordingly.

## E. Agent Architecture

- Use for: strong users targeting Agent infra or LLM engineering.
- Min mastery: L3 mandatory.
- Points: `R02`, `R03`, `R05`, `R06`, `R07`.
- Summary: Long-running Agent execution engine with turn state machine, model adapter, context monitoring, layered compaction, and large tool-result offloading.
- Warning: ⚠️ This plan contains 3 High-risk points (R02, R06, R07), exceeding the "max 1-2 high-end points" guideline. Only for users who can independently explain complete Agent architecture flow and face source-level questioning. If any high point is shaky, downgrade it to a Medium equivalent first.

## F. Safety-Controlled Agent

- Use for: user wants to emphasize real-world controllability.
- Min mastery: L2.
- Points: `R10`, `R11`, `R12`, `R04`, `R16`.
- Summary: Controllable local AI Coding Agent with permission context, command risk classification, diff review, and TUI approval flow.

## G. Default Paid Member Plan

- Use for: unsure users, balanced resume, MVP default.
- Min mastery: L1+.
- Points: `R01`, `R08`, `R10`, `R15`, `R18`.
- Summary: Lightweight terminal AI Coding Agent supporting multi-turn tool calls, unified tool registry, review-before-write safety, Skills extension, and JSONL session persistence.

## H. Web-Enhanced AI Coding Agent

- Use for: user wants to showcase external information retrieval alongside local coding capabilities.
- Min mastery: L2.
- Points: `R20`, `R08`, `R10`, `R01`, `R18`.
- Summary: Combine workspace-aware file tools with web search/fetch for an Agent that can supplement local code understanding with external context, wrapped in review-before-write safety and session persistence.

## I. Frontier Hot Topics（Agent 评测 / Skill 自进化 / Agent 安全）

- Use for: 冲高薪的 Agent 平台、LLM Infra、Agent 安全方向岗位；面试官大概率追问评测、自进化、安全三个热点。
- Min mastery: L2+（R25 需要讲清权限状态机；前沿层需要论文认知）。
- Points: `R23`, `R24`, `R25`, `R12`, `R18`.
- Summary: 以 Agent 评测闭环、Skills 渐进披露与治理、受控执行安全三个前沿热点为主线，用 PermissionManager 与 JSONL 会话体系做支撑，形成"会评测、懂进化、守安全"的高阶人设。
- Warning: 三个前沿点必须区分【项目实现】与【前沿认知】——论文数据（SkillsBench +16.6pp、AI Control 15%→92%、LATS $134.5 vs Warming $2.45）只进面试 talk，不进简历 bullet。
- Fallback: `R25` 讲不稳 -> 降级 `R10`；`R24` 前沿认知薄弱 -> 退回 `R15`；`R23` 讲不清轨迹回放 -> 退回 `R18`。

