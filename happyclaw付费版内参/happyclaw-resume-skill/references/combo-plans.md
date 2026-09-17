# Combo Plans

Use one plan as the starting point. Replace at most one point unless the user gives a strong reason.

## A. Beginner / Conservative

- Points: `R02 R13 R18 R21 R24`
- Use when: user is junior, risk-averse, or mainly wants a defensible project.
- Fallback: none needed.

## B. Agent Core Architecture

- Points: `R01 R03 R05 R06 R15`
- Use when: target is AI Agent architecture, AI Infra, or agent platform.
- Risk: `R03 R05 R06` are medium-high.
- Fallback: replace `R03` with `R02`; replace `R05` with `R18`; replace `R06` with `R07`.

## C. Multi-Channel IM Platform / Digital Employee

- Points: `R07 R08 R09 R10 R11`
- Use when: target is digital employee, IM integration, messaging platform.
- Risk: `R09 R10` are medium-high.
- Fallback: replace `R09` with `R08`; replace `R10` with `R07`.

## D. Data and Scheduling Engineering

- Points: `R13 R14 R09 R20 R08`
- Use when: target is backend, platform, fullstack architecture.
- Risk: `R14 R09 R20` are medium-high.
- Fallback: replace `R14` with `R13`; replace `R09` with `R08`; replace `R20` with `R19`.

## E. Frontend and Real-Time Experience

- Points: `R21 R22 R06 R18 R17`
- Use when: target is frontend, fullstack, client engineering.
- Risk: `R06 R17` are medium-high.
- Fallback: replace `R06` with `R07`; replace `R17` with `R15`.

## F. Agent Capability Governance / MCP Ecosystem

- Points: `R15 R16 R17 R01 R03`
- Use when: target is tool calling, MCP, Skills, Plugins, agent lifecycle.
- Risk: `R16` is high.
- Fallback: replace `R16` with `R15`; replace `R03` with `R02`.

## G. Enterprise Digital Employee (Full)

- Points: `R07 R14 R15 R20 R23`
- Use when: target is enterprise AI application, digital employee, agent platform.
- Risk: `R23` is high.
- Fallback: replace `R23` with `R19`.
- **Downgrade positioning**: R23 is the only point delivering multi-tenant isolation. After R23->R19, the "multi-tenant / security baseline" positioning loses support; project name must drop "multi-tenant" and shift to "multi-user Agent workstation + digital employee", or replace R19 with R20 (workspace ownership) to partially retain isolation narrative.

## H. Paid-Member Default

- Points: `R01 R07 R11 R15 R23`
- Use when: user is unsure but wants the multi-user Agent workstation + digital employee positioning.
- Risk: `R23` is high.
- Fallback: replace `R23` with `R19`.
- **Downgrade positioning**: same as Plan G. After R23->R19, drop "multi-tenant / runtime security" from project name; keep "multi-user Agent workstation + digital employee". If multi-tenant narrative is required, swap R19 back to R20 (Medium-High, L2 borderline) or keep R23 with L3 preparation.
- **Post-downgrade checklist**: re-check every positioning term in project name against the selected R points; any term without R-point support must be removed or the point swapped.

## I. Frontier Hot Topics（Agent 评测 / Skill 自进化 / Agent 安全）

- Points: `R25 R26 R27 R06 R15`
- Use when: target is high-salary Agent platform / AI Infra / safety roles; interviewer likely to probe evaluation, self-evolution, and safety.
- Risk: `R26 R27` are high (source-level governance and security).
- Fallback: replace `R26` with `R16`; if still shaky, `R15`. Replace `R27` with `R23`; if still shaky, `R19`.
- Note: 三个前沿点必须标注【项目实现】/【前沿认知】——论文数字（SkillsBench +16.6pp、AI Control 15%→92%、26.1% 技能漏洞率）只作面试展开，不写进简历 bullet；R25 侧重运行期行为评测（Trace/回归），与 R24 编译期验证区分开。
