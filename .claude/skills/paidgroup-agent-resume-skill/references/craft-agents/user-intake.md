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
