# User Intake

Ask only missing high-impact questions. Do not interrogate the user if the background is already clear.

## Required Signals

1. Target role: enterprise AI application / digital employee, Agent architecture, backend/platform, frontend/fullstack, MCP/tooling, or unsure.
2. Existing stack: TypeScript, Node.js, Hono, SQLite, React, Docker, WebSocket, Claude Agent SDK, testing.
3. Mastery level:
   - L1: Can explain architecture and basic data flow.
   - L2: Can explain module boundaries, events, sessions, protocol, IM channels, and tests.
   - L3: Can explain Docker sandbox, IPC protocol, StreamEvent, scheduling, RBAC, multi-tenant security, and tradeoffs.
4. Risk preference: conservative, balanced, or high-end.
5. Constraints: points the user cannot explain, technologies to avoid, resume length.

## Mapping

- L1: Prefer `R02 R13 R18 R21 R24`.
- L2: Can use `R01 R07 R08 R11 R15 R19 R22`.
- L3: Can use high-risk points `R03 R04 R05 R06 R09 R10 R14 R16 R17 R20 R23`.

## Red Flags

- User wants more than 5 bullets: reduce to 4-5.
- User wants metrics but provides none: do not invent metrics.
- User chooses high-risk points but cannot explain source design: downgrade.
- User frames HappyClaw as personally built production system without evidence: rewrite as architecture study / reference implementation / project deep-dive.

## Output Contract

Return:

- User profile summary.
- Selected plan.
- 4-5 selected `Rxx`.
- Resume project entry.
- Matching `Qxx.x`.
- Risk and downgrade notes.
