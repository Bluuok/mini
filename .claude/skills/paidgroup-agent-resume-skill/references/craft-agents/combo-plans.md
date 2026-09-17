# Combo Plans

Use one plan as the starting point. Replace at most one point unless the user gives a strong reason.

## A. Beginner / Conservative

- Points: `R01 R02 R08 R12 R24`
- Use when: user is junior, risk-averse, or mainly wants a defensible project.
- Fallback: none needed.

## B. Agent Core Architecture

- Points: `R03 R04 R06 R10 R11`
- Use when: target is AI Agent architecture, AI Infra, or agent platform.
- Risk: `R06` is high.
- Fallback: replace `R06` with `R13` or `R24` if user cannot explain permission checks.

## C. Multi-Backend Model Runtime

- Points: `R03 R05 R07 R21 R02`
- Use when: target is model platform, provider abstraction, runtime config.
- Risk: `R21` is high.
- Fallback: replace `R21` with `R04`.

## D. Session and Protocol Engineering

- Points: `R08 R09 R10 R12 R13`
- Use when: target is backend, platform, fullstack architecture.
- Risk: medium-low.
- Fallback: replace `R10` with `R24` if user struggles with event state machines.

## E. Desktop Agent Product

- Points: `R14 R15 R16 R12 R23`
- Use when: target is Electron, React, desktop, fullstack.
- Risk: medium.
- Fallback: replace `R15` with `R01` if user cannot discuss UI data flow.

## F. MCP / Tool Ecosystem

- Points: `R17 R18 R19 R06 R20`
- Use when: target is tool calling, MCP, integrations, source systems.
- Risk: `R18 R19 R06` are high.
- Fallback: replace `R19` with `R24`, replace `R06` with `R13`.

## G. Server Platform

- Points: `R18 R20 R21 R22 R23`
- Use when: target is server platform or AI platform backend.
- Risk: `R18 R21 R22` are high.
- Fallback: replace `R22` with `R12`, replace `R21` with `R03`.

## H. Paid-Member Default

- Points: `R03 R06 R08 R12 R18`
- Use when: user is unsure but wants the high-end Agent architecture positioning.
- Risk: `R06 R18` are high.
- Fallback: replace `R06` with `R10`; replace `R18` with `R17`.

## I. Frontier Hot Topics（Agent 评测 / Skill 自进化 / Agent 安全）

- Points: `R25 R26 R27 R10 R24`
- Use when: target is high-salary Agent architecture / AI Infra / safety roles; interviewer likely to probe evaluation, self-evolution, and safety.
- Risk: `R26 R27` are high (source-level governance and security).
- Fallback: replace `R27` with `R06`; replace `R26` with `R18` (or `R17`).
- Note: 三个前沿点必须标注【项目实现】/【前沿认知】——论文数字（SkillsBench +16.6pp、AI Control 15%→92%、26.1% 技能漏洞率）只作面试展开，不写进简历 bullet；R25 侧重运行期行为评测（AgentEvent/契约测试），与 R24 编译期验证区分开。
