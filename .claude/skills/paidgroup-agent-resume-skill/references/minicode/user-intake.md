# User Intake

Use this file when user background is missing. Ask only what is necessary.

## Minimum Questions

Ask these before selecting points:

1. Target role: AI application, backend, CLI/tooling, Agent architecture, or unsure.
2. Tech background: main language and strongest project type.
3. MiniCode mastery: only read intro, can explain module flow, or can explain source-level details.
4. Risk appetite: conservative, balanced, or high-end.
5. Resume goal: internship, junior job, experienced job switch, or AI direction transition.

## Mastery Levels

- L1: Can explain what MiniCode is, but cannot explain source flow. Use conservative points: `R01`, `R08`, `R09`, `R10`, `R22`.
- L2: Can explain module responsibilities and data flow. Use balanced points: `R01`, `R04`, `R08`, `R10`, `R15`, `R18`, `R19`.
- L3: Can explain implementation trade-offs and failure modes. Allow high-risk points: `R02`, `R05`, `R06`, `R07`, `R12`, `R13`, `R14`.

## Red Flags

Do not recommend a high-risk point when:

- The user cannot explain why the module exists.
- The user cannot draw the data flow.
- The user wants to claim metrics without measurements.
- The point comes only from roadmap or future direction.

## Output Contract

After intake, output:

- Selected plan name.
- 4-5 selected `Rxx` points.
- One resume project entry.
- Corresponding `Qxx.x` interview prep.
- Risk notes and what to study next.

