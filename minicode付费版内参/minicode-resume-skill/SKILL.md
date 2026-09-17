---
name: minicode-resume-skill
description: Generate MiniCode-based AI Agent resume projects, scenario-align resumes to target company JDs, predict interview Q&A, and deep-dive into technical points. Use when the user asks to package MiniCode as a resume project, adapt MiniCode to a specific job/company scenario, prepare interview Q&A predictions, or deep-dive into a technical point using the bundled CodeWiki.
---

# MiniCode Resume Skill

## Mode Detection

This skill supports five modes. Detect which mode the user needs based on their input:

- **Resume mode**: User provides their background (role, mastery level, risk preference) without a specific JD. Follow the standard Workflow below (Steps 1-6).
- **Scenario mode**: User pastes a job description (JD) and/or company background. Enter the Scenario Alignment Path (Step 1a) to reframe the resume project to that company's business scenario, then optionally run adversarial review.
- **Q&A Prediction mode**: User asks to predict interview questions ("面试预测", "面试问题", "Q&A 预测", "面试官会问什么"). Enter the Q&A Prediction Path (Step 1b) to generate JD-aware predicted questions with four-segment answers, scenario-specific follow-ups, vulnerability-based downgrade advice, and a project story summary.
- **Story mode**: User asks to generate project stories ("项目故事", "讲清楚项目", "STAR 故事", "实习经历", "项目迭代"). Enter the Story Generation Path (Step 1c) to produce a full 8-module project story pack based on selected R points and interview-qa materials.
- **Full-flow mode**: User pastes a JD AND wants interview prep. Run Scenario mode -> Q&A Prediction mode (with Part 4 story summary) -> adversarial review in sequence. Story mode can be triggered separately for the full story pack.

When the user's intent is ambiguous, ask: "你有目标岗位的 JD 吗？需要场景化对齐、面试 Q&A 预测，还是项目故事生成？"

## Workflow (Resume Mode)

Use this workflow to help a user turn MiniCode into a credible resume project and interview prep pack.

1. Read `references/user-intake.md` first when the user's background, target role, or mastery level is missing. Ask only the missing high-impact questions.
2. Read `references/combo-plans.md` to pick a default plan for the user's target role.
2b. **Cross-check mastery level**: Compare the selected plan's points against user-intake.md mastery level restrictions. If any point exceeds the user's level (e.g., L2 user getting High-risk R06 from Plan B), warn the user and offer a downgrade (e.g., R06->R05). Apply the fallback from combo-plans.md where available.
3. Read `references/resume-points.md` to select 4-5 `Rxx` points the user can plausibly explain. Review the per-point "What to Explain", "Interview Risk", and "Scope Boundary" fields before finalizing.
4. Generate a resume project entry: **one-sentence project summary (项目简介一句话)**, tech stack, and 4-5 bullets. **Every bullet MUST follow the four-segment structure: 针对[业务问题]，基于[技术]，设计了[工程方案]，实现了[验证效果]。** Use the pre-written bullets from `references/resume-points.md` verbatim (already in this format) for consistent technical precision. Adapt wording only if the user has domain-specific framing needs; the four-segment structure must be preserved.
5. Read `references/interview-qa.md` and return the corresponding `Qxx.x` prep list. When returning Q&A, instruct the user to structure answers in four segments: (1) what problem this solves, (2) how MiniCode implements it, (3) why not a simpler or more complex approach, (4) limitations and extensibility.
6. If the user asks to deep-dive, verify, strengthen, or explain a specific technology point, read `references/codewiki-index.md` and then load only the relevant section of `references/MiniCode-Complete-CN.md`.

## Scenario Alignment Path (Step 1a)

When the user provides a JD and/or company background, reframe MiniCode to that company's business scenario using these steps:

1. **Deconstruct input**: Extract target role, business scenario, key pain points, and keywords from the JD and company background. If the JD's scenario is not obvious, fall back to industry-common collaboration/data/automation pain points, mark as reasonable assumptions, and do not fabricate precise metrics.
2. **Load capabilities**: Read `resume-points.md`, `combo-plans.md`, `interview-qa.md`, and `user-intake.md`. If the user hasn't selected a plan, default to Plan G (`R01 R08 R10 R15 R18`). Downgrade high-risk points per `user-intake.md` rules.
3. **Map scenario to capabilities**: Use "Best For" in resume-points.md and "Use for" in combo-plans.md to match each business scenario to MiniCode capabilities.
4. **Reframe descriptions** (core rewrite): Transform "I did X" into "To solve [company scenario]'s [pain point], did X, achieving [business effect]". Use precise numbers only when the JD provides them; otherwise use "target / expected". **Rewritten bullets must keep the four-segment resume structure: 针对[公司场景业务问题]，基于[技术]，设计了[工程方案]，实现了[验证效果] — replace the business-problem slot with the JD scenario's pain point; verification effects stay qualitative (target / expected) unless the JD gives numbers.**
   - **Frontier topic mapping**: JD keywords 评测/评估/质检 -> R23；技能/知识沉淀/进化/经验复用 -> R24；安全/合规/权限/风险/审计 -> R25。前沿点输出时必须带【项目实现】/【前沿认知】标注：项目真实能力进简历 bullet，论文证据（SkillsBench +16.6pp、AI Control 15%→92%、LATS $134.5 vs Warming $2.45、26.1% 技能漏洞率）只进面试 talking points，严禁写进 bullet。
   - **Capability attribution guardrail**: Reframing only changes the narrative frame, not the capability level. Each R point may only claim capabilities within its Scope Boundary. Non-native capabilities (business APIs, external system integration) must be labeled with their R point attribution and whether they are self-built. Common overreach patterns: relabeling a data-collection layer as a metrics system, extending file-level diff review to non-file actions, relabeling load balancing as task routing.
5. **IM bridge (landing enhancement)**: MiniCode has no native IM. Use cc-connect (external dependency) to bridge to the company's IM. cc-connect only does text message bridging; it does not provide IM-internal diff approval cards or rich interactive confirmation.
6. **Output alignment package**: Produce scenario mapping table, rewritten bullets, talking points (four-segment), and IM bridge plan.
7. **Post-downgrade positioning recheck**: If high-risk points were downgraded in step 2, verify that project name positioning terms still have selected R-point support. Remove or swap any unsupported terms.

## Q&A Prediction Path (Step 1b)

When the user wants interview Q&A prediction, generate JD-aware predicted questions based on their selected R points, mastery level, JD, and company background:

### Inputs
- JD (extract keywords, responsibilities, tech stack requirements)
- Company background (industry, business model, team size, IM)
- Selected R points (determines prediction scope)
- Mastery level L2/L3 (determines follow-up depth and downgrade advice)

### Outputs (four parts)

**Part 1: Per-R-point high-frequency predicted questions + four-segment answers**
- Baseline: Start from `interview-qa.md` static questions for each selected R point.
- Overlay: Add JD-specific follow-ups (e.g., if JD requires RAG, predict RAG-related追问 on the relevant R point).
- Answers: Four-segment format (problem solved / implementation / design tradeoff / limitations). Must comply with Scope Boundary-do not claim capabilities beyond the R point's defined scope.
- Label each question source: [R-point baseline] or [JD-specific prediction].

**Part 2: Scenario-specific follow-ups**
- Predict job-specific questions that `interview-qa.md` does not cover (derived from JD responsibilities and tech stack).
- Predict company-specific questions based on company background (e.g., cross-border company may ask about data compliance; securities company may ask about audit trails).
- Label each source: [JD-specific] or [scenario-specific].

**Part 3: Vulnerable follow-ups + downgrade advice**
- Based on mastery level, predict source-level follow-ups that the user cannot defend at their level.
- For each, give a concrete downgrade path (e.g., "R06 layered compaction: if you can't explain the four compaction triggers, downgrade to R05 context monitoring and prepare a 'understood design layer' talking point").
- Label severity: high / medium / low.

**Part 4: Project story summary**
- Brief STAR/CAR summary for each selected R point's resume bullet: 30-second elevator version + key follow-up defense.
- Points to the full Story Generation Path (Step 1c) for the complete 8-module story pack.
- Label: [story summary - see Step 1c for full version].

### Constraints
- Predicted questions must be labeled with source (R-point baseline / JD-specific / scenario-specific).
- Four-segment answers must comply with Scope Boundary; do not exceed the R point's defined capability range.
- Vulnerable follow-ups must include a concrete downgrade path, not just "avoid this topic".
- Do not fabricate questions unrelated to the JD or R point's real scope.

## Story Generation Path (Step 1c)

When the user wants to generate project stories to explain how the project works, what they contributed, and how it evolved, produce a full 8-module story pack. Fact sources are the skill's existing materials (resume-points, interview-qa, combo-plans, user-intake, and scenario-aligned resume if available).

### Inputs
- Selected R points (determines story scope)
- Mastery level (determines story depth and vulnerability labels)
- Optional JD/company background (if scenario-aligned resume exists, use as story material)
- Optional: user-provided resume/project materials (if provided, use as primary fact source per priority: user materials > skill materials)

### Truthfulness labels (must apply to all story content)
- `【本人实际参与】`: content supported by R points and resume materials.
- `【项目整体架构】`: system capabilities described by R points, not equal to personal responsibility.
- `【待确认】`: details not available in materials (models, databases, metrics, deployment, team size). Tell the user what to recall, who to confirm with, and how to answer honestly in interviews.

Forbidden: fabricating metrics/users/performance/team size/deployment; presenting reference projects as personal work; presenting collaborative work as independent; fabricating implementation details to appear "watertight".

### Outputs (8 modules)

**Module 1: Project fact card**
- Fields: project name, business users, original workflow & pain points, project goals, system inputs, core flow, system outputs, my actual responsibilities, collaboration boundaries, known tech & facts, known risks/exceptions, known results, pending questions.
- Each field labeled with truthfulness labels above.

**Module 2: Business story**
- Who are the users, how did they work before, why was it inefficient or risky.
- What the project changes, what success looks like.
- My role and real boundaries when entering the project.
- A natural-language walkthrough of the "input -> process -> output -> feedback" business loop.

**Module 3: Architecture & data flow**
- One Mermaid architecture diagram.
- One input/output/state/exception table.
- One "architecture walkthrough" paragraph.
- Diagram must include: user/upstream data, frontend/entry, Agent/Workflow, Knowledge/Tool/MCP (if applicable), data/task state, output, log/Trace/Eval, human review/fallback.
- Mark `【本人参与】` on modules the user actually worked on.

**Module 4: Technical story**
- For each key R point, explain: what business problem it solves; its input/process/output; why not a simpler approach; its boundary with rules/permissions/human review/state machines; one typical failure and recovery.
- Must comply with Scope Boundary-do not claim capabilities beyond the R point's defined scope.

**Module 5: My story (STAR/CAR)**
- Transform each resume bullet into a STAR/CAR story: background/problem -> my goal -> specific actions -> tech & collaboration approach -> output/result -> review & boundaries.
- Each story provides: 30-second elevator version, 90-second standard version, 3-minute deep version, first-person answer to "what exactly did you do", `【待确认】` details and honest answer approach.

**Module 6: Grilling question tree**
- At least 8 rounds of questions per project, each with 2+ layers of follow-up: main question -> why this design -> how failure is handled / what your specific contribution was.
- Each round provides: brief answer, expanded answer, honest answer when uncertain.
- Questions cover: business judgment, architecture choice, data quality, permissions/security, failures, evaluation, collaboration boundaries, review.

**Module 7: Multi-project linkage (if applicable)**
- Capability evolution timeline: what new capabilities each project added.
- Method reuse line: how structured state, reference validation, RAG, Skill/Workflow, Tool permissions, Trace/Eval, Schema, RPA/API migrated across projects.
- A 3-minute "why these experiences prove I'm suited for the target role" narrative.
- At least 10 rounds of cross-project grilling: what's similar, what's different, why tech choices changed, how to avoid falsely linking unrelated projects.
- Emphasis: if projects are not from the same company/system, only link capability growth, never fabricate shared databases/code/models/services.

**Module 8: Tech relationship quick reference**
- A review-friendly cheat sheet with "plain analogy + strict definition + where in my project" for each concept.
- Covers: RAG vs Deep Research; Agent/Skill/Workflow/Tool/MCP relationships; Prompt/Schema/rule engine/human review boundaries; Agent Runtime/Trace/Eval/Bad Case quality loop; API/RPA Worker/task state machine/retry/human handoff; data warehouse vs knowledge base vs vector search vs business database boundaries.

### Constraints
- All story content must use truthfulness labels.
- STAR stories must stay within selected R points' Scope Boundary.
- Architecture diagrams must label `【本人参与】` on actual modules.
- If multiple projects are not truly connected, only link capability growth, not system integration.
- Do not fabricate metrics, team size, deployment details, or implementation specifics.

## Output Rules

- Do not tell the user to write every point. Recommend 4-5 points only.
- Match every selected `Rxx` to corresponding `Qxx.x` interview prep.
- Warn when a selected point is high risk for the user's stated mastery level.
- Do not present roadmap, future plans, or extension ideas from the CodeWiki as already implemented capabilities.
- Prefer credible wording such as "designed", "implemented reference flow", "supported", "built mechanism", and "reduced risk"; do not invent metrics.
- **Resume output format (mandatory)**: the project summary must be exactly one sentence (项目简介一句话); every bullet must follow the four-segment structure 针对[业务问题]，基于[技术]，设计了[工程方案]，实现了[验证效果]. The verification effect must be a qualitative, defensible claim (e.g., 风险收敛/一致性/受控), never an invented metric.
- **Frontier points (评测/自进化/安全)**: every frontier bullet must separate 【项目实现】(grounded in selected R points) from 【前沿认知】(paper knowledge). Paper numbers never enter resume bullets — they are interview expansion material. If the user cannot defend the frontier layer, downgrade to the underlying capability point (e.g., R25->R10, R24->R15, R23->R18).
- **Capability attribution**: each bullet may only claim capabilities within the selected R point's Scope Boundary (see `resume-points.md`). Do not name components belonging to unselected or higher-risk R points (e.g., naming `PermissionManager` in an R10 bullet pulls it into R12 territory). Business tools (DB query, external API, IM send) must be marked as self-built adapters, not native. Do not relabel a data-collection mechanism as a metrics/ROI system.
- **Scenario mode**: outputs must follow the capability attribution guardrail and post-downgrade positioning recheck defined in Step 1a.
- **Q&A Prediction mode**: predicted questions must be labeled with source; four-segment answers must comply with Scope Boundary; vulnerable follow-ups must include concrete downgrade paths; Part 4 story summary points to Step 1c for full version.
- **Story mode**: project stories must use truthfulness labels (【本人实际参与】/【项目整体架构】/【待确认】); do not fabricate metrics/users/team size/deployment; STAR stories must stay within selected R points' Scope Boundary; architecture diagrams must label 【本人参与】 on actual modules; if multiple projects are not truly connected, only link capability growth not system integration.
- If the user wants a high-end version, keep it technically defensible and point to CodeWiki-backed evidence.

## Default Selection Logic

- AI application role: prefer `R01`, `R04`, `R06`, `R13`, `R15`.
- Backend role: prefer `R08`, `R12`, `R18`, `R19`, `R14`.
- CLI/tooling role: prefer `R09`, `R11`, `R16`, `R17`, `R21`.
- Agent architecture role: prefer `R02`, `R03`, `R05`, `R06`, `R07`.
- Unsure or beginner: prefer `R01`, `R08`, `R10`, `R15`, `R18`.
- **Scenario mode trigger**: When the user pastes a JD, automatically enter Scenario Alignment Path (Step 1a).
- **Frontier hot-topic trigger**: When the JD/user emphasizes 评测/评估/质检、技能/知识沉淀/进化/经验复用、安全/合规/权限/风险/审计, prefer the frontier points (R23/R24/R25) and their Q&A 兑底. Output MUST label every frontier bullet with 【项目实现】and 【前沿认知】.
- **Q&A Prediction trigger**: When the user mentions "面试预测", "面试问题", "Q&A 预测", or asks what an interviewer would ask, enter Q&A Prediction Path (Step 1b).
- **Full-flow trigger**: When the user pastes a JD AND asks for interview prep, run Step 1a -> Step 1b (with Part 4 story summary) -> adversarial review.
- **Story mode trigger**: When the user mentions "项目故事", "讲清楚项目", "STAR 故事", "实习经历", "项目迭代", or asks how to tell the project story, enter Story Generation Path (Step 1c).

## Deep-Dive Rule

For normal resume generation, do not load the full CodeWiki. For deep technical questions, use `references/codewiki-index.md` to find the section, then read the relevant part of `references/MiniCode-Complete-CN.md`.

Deep-dive triggers include:

- "深入讲 R06"
- "这个点面试官会怎么追问"
- "帮我优化某个 bullet 的技术含量"
- "基于源码/CodeWiki 解释"
- "这个设计为什么这么做"
- "场景化简历审查" / "对抗式审查" / "找漏洞" -> trigger adversarial review (5-item checklist: gaps, logical conflicts, capability attribution, scenario-capability coverage, positioning integrity)
- "评测" / "自进化" / "Agent 安全" / "前沿热点" -> prefer frontier points R23/R24/R25 and return Q23-Q25 with 【项目实现】/【前沿认知】/降级路径 labels
- "面试预测" / "面试问题预测" -> trigger Q&A Prediction Path (Step 1b)
- "项目故事" / "讲清楚项目" / "STAR 故事" / "实习经历" / "项目迭代" -> trigger Story Generation Path (Step 1c)

