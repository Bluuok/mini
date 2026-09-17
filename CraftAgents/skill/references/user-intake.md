# User Intake

Ask only missing high-impact questions. Do not interrogate the user if the background is already clear.

## Required Signals

1. Target role: Agent architecture, backend/platform, desktop/fullstack, MCP/tooling, or unsure.
2. Existing stack: TypeScript, React, Electron, Bun/Node, WebSocket/RPC, MCP, OAuth, testing.
3. Mastery level:
   - L1: Can explain architecture and basic data flow.
   - L2: Can explain module boundaries, events, sessions, protocol, and tests.
   - L3: Can explain AgentBackend, PreToolUse, MCP/Sources, OAuth, Pi server, and tradeoffs.
4. Risk preference: conservative, balanced, or high-end.
5. Constraints: points the user cannot explain, technologies to avoid, resume length.

## Mapping

- L1: Prefer `R01 R02 R08 R12 R24`.
- L2: Can use `R03 R09 R10 R13 R14 R15 R16 R20 R23`.
- L3: Can use high-risk points `R06 R18 R19 R21 R22`.

## Layer Tracks (Harness / Runtime)

Beyond mastery levels, classify the user's target by layer:

- **Harness track** (AI application / Agent architecture roles): select from H series (H01–H08 in `05-CraftAgents-Harness与Runtime要点扩充-付费版.md`) + platform R points. Mix: 3H + 1R + 1RT.
- **Runtime track** (backend/platform/infra background): select from RT series (RT01–RT05) + platform R points. Mix: 1H + 3RT + 1R.
- Ask one signal question when unclear: "你更想讲 Agent 本身怎么跑起来（Prompt/工具/循环/子代理），还是 Agent 在什么环境里被治理（进程隔离/凭据/消息网关/传输）？"

## Red Flags

- User wants more than 5 bullets: reduce to 4-5.
- User wants metrics but provides none: do not invent metrics.
- User chooses high-risk points but cannot explain source design: downgrade.
- User frames Craft Agents as personally built production system without evidence: rewrite as architecture study / reference implementation / project deep-dive.

## Output Contract

Return:

- User profile summary.
- Selected plan.
- 4-5 selected `Rxx`.
- Resume project entry.
- Matching `Qxx.x`.
- Risk and downgrade notes.

## Claim Checkpoint

After recommending points, obtain one compact confirmation of the selected set. Treat points the user selects or explicitly accepts as user_attested for interview ownership; do not infer precise metrics, production results, or project leadership from selection alone. Build the Claim Ledger before writing bullets and keep Claim status, evidence, boundary, result type, and interview details in the audit view.
