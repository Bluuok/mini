# Interview Q&A

Use this file after selecting `Rxx` points.

## Answer Structure

When returning Q&A prep, instruct the user to structure each answer in four segments (四段式):

1. What problem does this design solve?
2. How does MiniCode roughly implement it?
3. Why not a simpler or more complex approach?
4. What are the limitations or extensibility directions?

## Q01 Agent Loop

### Q01.1
Q: How does MiniCode's Agent Loop work?
A: User input enters `runAgentTurn`; the model returns text or tool calls; tool calls are executed through `ToolRegistry`; tool results are appended to messages; the loop continues until final answer or termination.

### Q01.2
Q: Why multi-turn tool calling?
A: Coding tasks require observing files, command results, and edits. A single LLM request cannot know current workspace state.

### Q01.3
Q: How do you prevent infinite Agent Loop execution?
A: MiniCode uses `maxSteps` to limit maximum steps; retry and fallback for empty responses and thinking stops; the loop terminates when the model returns a final assistant message; irrecoverable errors return diagnostics instead of continuing to spin.

## Q02 Agent Turn State Machine

### Q02.1
Q: Why separate progress from final answer?
A: Progress updates keep the TUI responsive without ending the turn; final assistant messages terminate the loop.

### Q02.2
Q: How are empty responses and thinking stops handled?
A: Empty responses trigger retry with continuation prompts; recoverable thinking stops prompt the model to continue from the interrupt point. If still empty after retries, return diagnostics instead of infinite looping.

### Q02.3
Q: What happens when `maxSteps` is reached? How is it different from timeout?
A: `maxSteps` limits turn count to prevent infinite execution; upon hitting the limit, the task terminates with diagnostics. It differs from timeout: `maxSteps` counts step quantity, timeout guards single-step or total execution time. Both coexist to protect the system from different failure modes.

## Q03 ModelAdapter

### Q03.1
Q: Why add `ModelAdapter` instead of calling Anthropic directly in Agent Loop?
A: It isolates provider-specific API conversion and response parsing from the Agent Loop, which only cares about "what's next."

### Q03.2
Q: What is the value of MockModelAdapter?
A: It makes Agent Loop and tool orchestration testable without real LLM calls, avoiding instability from network, model randomness, or API costs.

## Q04 System Prompt

### Q04.1
Q: What goes into the system prompt?
A: Base behavior, permission summary, available Skills, MCP server status, memory/instruction files, and response protocol. The system prompt is the Agent's capability boundary declaration.

### Q04.2
Q: Why not load all detail directly into the system prompt?
A: It would waste context. Summaries expose capabilities while detailed Skills load only when needed.

## Q05 Context Monitoring

### Q05.1
Q: Why estimate tokens?
A: Long Agent sessions accumulate messages and tool results; context utilization must be tracked before the model window is exceeded. MiniCode combines provider usage and local estimation to calculate utilization levels (normal, warning, critical, blocked).

### Q05.2
Q: Why combine provider usage and estimation?
A: Provider usage is accurate for previous calls; local estimation covers newly appended tail messages not yet in provider counts.

## Q06 Context Compaction

### Q06.1
Q: Why layered compaction?
A: Different context pressure needs different treatment. Light bloating only needs old tool result cleanup; approaching limits needs collapse or snip; severe overflow uses model summarization. Layering avoids expensive or lossy auto-compaction as the first resort.

### Q06.2
Q: What are the differences between microcompact, context collapse, snip compact, and auto compact?
A: microcompact clears old tool results; context collapse creates a model-view projection while preserving original transcripts; snip compact hard-deletes non-protected middle-range messages; auto compact uses the model to summarize old history. They differ in trigger thresholds and information loss.

### Q06.3
Q: Why not simply delete all old messages?
A: Agent tasks depend on historical state: edited files, tool call results, error context. Simple deletion breaks task continuity. MiniCode protects key tool calls, recent messages, and edit-related context.

## Q07 Tool Result Offloading

### Q07.1
Q: Why are large tool results dangerous?
A: Large file reads, extensive search results, or long command outputs can rapidly fill the context window. The model often only needs summary, preview, or an on-demand pointer, not the full raw output.

### Q07.2
Q: How is offloading different from truncation?
A: Truncation discards information; offloading persists full results to local storage and places previews/pointers in context. Context is reduced while audit and retrieval capability is preserved.

### Q07.3
Q: What is the lifecycle of offloaded results? How can users review full content?
A: Offloaded results live in session-associated local storage for the session's lifetime. Users can access the full content via pointer paths in tool output — no model context memory is needed. Results are cleaned up when the session expires or is purged. This is context replacement, not long-term memory.

## Q08 Tool Registry

### Q08.1
Q: Why both JSON Schema and Zod/runtime validation?
A: JSON Schema guides model generation (what parameters to produce); Zod/runtime validation protects execution (what parameters actually arrived). Together they reduce invalid tool call inputs.

### Q08.2
Q: What does `ToolRegistry` solve?
A: It unifies tool registration, lookup, execution, and disposal. Agent Loop calls tools by name without knowing implementation details; built-in, MCP, and Skill-related tools share the same scheduling system.

## Q09 File/Search Tools

### Q09.1
Q: Why does Agent need `list_files`, `read_file`, `grep_files`?
A: Coding Agents must observe the codebase first. `list_files` reveals structure, `grep_files` locates symbols, `read_file` fetches context. Without them, the model can only guess from user descriptions.

### Q09.2
Q: Why paginate reads and limit output?
A: Source files can be large; unbounded reads waste context. Pagination and limits let the Agent read key slices first and continue on demand, with metadata (total, offset, truncated) guiding subsequent requests.

## Q10 Review Before Write

### Q10.1
Q: What is the complete write review flow?
A: File modification tools compute a unified diff, then call `PermissionManager.ensureEdit` for user approval. Only after confirmation is the file written to disk. If content is unchanged, it returns success without requiring review.

### Q10.2
Q: Why is diff review better than a simple "confirm write" prompt?
A: Users need to see exactly what the Agent changed. A bare confirmation provides insufficient information; unified diffs show additions, deletions, and surrounding context so users can judge safety and correctness before approving.

## Q11 Shell Execution

### Q11.1
Q: How are commands classified for risk?
A: The system normalizes the command, then classifies it as readonly, development, unknown, or shell snippet. Readonly commands are lower risk; development and unknown commands may trigger permission checks. Shell snippets with pipes, redirects, or variables get stricter scrutiny because static analysis is harder.

### Q11.2
Q: How are background tasks tracked?
A: The spawned process is registered with PID, command, and status. The system periodically checks process existence to refresh running/completed state, suitable for dev servers and other long-running commands.

## Q12 PermissionManager

### Q12.1
Q: What three permission types does PermissionManager handle?
A: Path access (prevent boundary escape), command execution (prevent dangerous shell ops), and file edits (connect to write review flow).

### Q12.2
Q: What is the difference between allow_once, allow_turn, and allow_always?
A: `allow_once` permits only this single operation; `allow_turn` permits related operations within the current turn; `allow_always` persists the decision for future similar operations. Different scopes, different convenience and risk trade-offs.

### Q12.3
Q: What value does deny_with_feedback provide?
A: It not only rejects the operation but feeds the reason back to the model, so the Agent can adjust its approach based on the user's rationale instead of receiving just a failure signal.

## Q13 MCP

### Q13.1
Q: What role does MCP play in MiniCode?
A: MiniCode acts as MCP host, connecting external MCP servers and wrapping their tools, resources, and prompts as internal ToolDefinitions. This lets the Agent dynamically access specialized services beyond built-in file and shell tools.

### Q13.2
Q: Why namespaced tool names like `mcp__server__tool`?
A: Different servers may have identically-named tools, and external tools may collide with built-in names. The namespace pattern avoids conflicts and keeps tool names stable.

## Q14 MCP Management

### Q14.1
Q: Why store MCP tokens separately?
A: Project-level `.mcp.json` may enter version control; embedding tokens would leak credentials. MiniCode stores remote server tokens in a separate `mcp-tokens.json`, separating config from secrets.

### Q14.2
Q: Why cache protocol negotiation?
A: Different MCP servers may use content-length, newline-json, or streamable-http frame formats. Probing once and caching the preference avoids repeated detection overhead, making reconnects faster and more stable.

## Q15 Skills

### Q15.1
Q: Difference between Skill and MCP?
A: MCP provides executable external tools, resources, and prompts; Skills provide Markdown workflow knowledge and domain instructions. One is tool capability; the other is process knowledge.

### Q15.2
Q: Why progressive loading instead of putting all Skills in the system prompt?
A: Full Skill text can be long, and most tasks only need a small subset. MiniCode exposes names and descriptions initially, then loads full `SKILL.md` via `load_skill` only when relevant. This is progressive context loading.

## Q16 TUI

### Q16.1
Q: Why does TUI need `ScreenState`?
A: The terminal UI maintains input buffer, scroll history, active tools, context stats, busy state, and pending approvals simultaneously. `ScreenState` centralizes these and triggers re-render on each state change.

### Q16.2
Q: How does the permission dialog block Agent execution?
A: When permission is requested, the TUI sets `pendingApproval` and shifts focus to the approval interface. Agent Loop waits for user decision; execution continues only after approval resolves.

## Q17 Slash Commands

### Q17.1
Q: Why provide local shortcuts like `/read`, `/grep`, `/cmd`?
A: Some operations are deterministic and don't need LLM reasoning — reading a file, listing directories, searching text. Shortcuts bypass the model, reducing latency and token costs while giving power users more control.

### Q17.2
Q: How do shortcuts relate to Agent tools?
A: They ultimately map to the same built-in tools: `/read` maps to `read_file`, `/grep` to `grep_files`. The difference is the invocation entry point: explicit user command vs. model tool call.

## Q18 Sessions

### Q18.1
Q: Why JSONL for session storage?
A: JSONL is append-friendly. Each message, tool call, or boundary marker is one line — simple to write, robust against crashes, and easy to reconstruct history for audit and resume.

### Q18.2
Q: Why fork sessions?
A: Fork allows users to branch from the current context to explore different approaches without mutating the original session. `parentUuid` or `logicalParentUuid` preserves the branch relationship for history reconstruction.

## Q19 Config

### Q19.1
Q: What is MiniCode's configuration priority?
A: From low to high: Claude settings, global MCP, project MCP, MiniCode user settings, then environment variables. Environment variables are typically highest because they suit runtime overrides for model, API address, and tokens.

### Q19.2
Q: Difference between `loadEffectiveSettings` and `loadRuntimeConfig`?
A: `loadEffectiveSettings` merges config files into file-level effective settings; `loadRuntimeConfig` layers environment variables and defaults on top, producing the config Agent actually uses at runtime.

## Q20 Web Tools

### Q20.1
Q: Why split search and fetch into two tools?
A: Search discovers candidate URLs; fetch reads selected page content. The Agent can first evaluate which results are worth opening before consuming context on multiple fetches.

### Q20.2
Q: Why readability extraction and truncation for Web Fetch?
A: Web pages contain navigation, scripts, ads, and irrelevant structure. Readability extraction preserves main content; truncation controls context size. The Agent gets external information without filling the prompt with noise.

## Q21 Progress Protocol

### Q21.1
Q: What value do progress messages provide?
A: During long tasks, Agent needs to show it's still working — searching files, running tests, waiting for tool results. Without progress feedback, the user may assume it's stuck.

### Q21.2
Q: Why not treat all assistant text as final answers?
A: Intermediate status does not mean task completion. If the loop terminates prematurely, subsequent tool execution and summarization would never occur. The protocol distinguishes intermediate progress from final answers for clear loop semantics.

## Q22 Project Positioning

### Q22.1
Q: How should MiniCode's relationship to Claude Code be described?
A: "A lightweight Claude Code-style reference implementation" — a learnable, traceable Coding Agent prototype. Never claim "clone of Claude Code" or "full Claude Code capability."

### Q22.2
Q: Why is this project resume-worthy?
A: It covers real Agent engineering problems: tool calling, context governance, permission safety, session persistence, extension mechanisms, and terminal interaction. It's not just wrapping an LLM API — it has a complete local development workflow loop.

## Q23 受控验证闭环（Agent 评测）

### Q23.1
Q: How can Agent behavior be evaluated when there is no ground-truth spec?
A: 【项目实现】Evaluation targets the system, not the model. MiniCode's controlled verification loop: `MockModelAdapter` makes the Agent Loop deterministic and testable offline (no network/model randomness); the shell tool runs test suites so a change is accepted only when tests flip from fail to pass (fail-to-pass, the same judgment SWE-bench uses); JSONL session events give replayable structured traces, so any "it feels better" claim can be traced to a specific change. This is an evaluation perspective on existing capabilities (R03/R10/R11/R18) — MiniCode has no benchmark suite or LLM-judge pipeline (roadmap item, not implemented).

### Q23.2
Q: Why prefer deterministic signals over LLM judging?
A: 【项目实现】MiniCode's verification signals are deterministic: test results, diff review, command outcomes — zero cost, fully stable, no model bias. 【前沿认知】MT-Bench: GPT-4 judge vs human agreement 85%, higher than human-human 81%, but three biases: position bias (swapping order flips conclusion in >60% of cases), verbosity bias (asking for more detail flips failure rate 91.3%→8.7%), and consistency ≠ accuracy. Mitigations: structured Rubric + JSON Schema, few-shot, human sampling calibration, anchor answers for critical domains. 降级路径: if you forget exact numbers, say "三偏置：位置、冗长、一致≠准确" plus the one number you remember.

### Q23.3
Q: How do you prove an improvement is real, not luck or more cost?
A: 【前沿认知】(methodology, not a MiniCode feature) three steps: add simple baselines — Warming (temperature-escalation retry) hit 93.2% at $2.45, beating LATS 88.0% at $134.50 (cost differs by ~2 orders of magnitude); report cost-controlled accuracy × cost Pareto; check task-quantity sufficiency (AppWorld 15%, τ-bench 25%, SWE-bench Verified 90%; cheap 25% sampling fails 100% coverage and 4/5 positive conclusions were wrong). Stability: report pass^k (all k runs pass), not single-run success — τ-bench gpt-4o single-shot 48-61% but pass^8 <25%. 降级路径: asked about "your project's task volume" — answer honestly: MiniCode has no public benchmark set; this is methodology knowledge.

## Q24 Skills 渐进披露与技能治理

### Q24.1
Q: What is a Skill, and how is it different from a tool or a prompt?
A: 【项目实现】A Skill is a self-contained file package (SKILL.md: name/description/usage), loaded on demand via `load_skill`. Tools execute and return results; skills prepare the agent by injecting procedural knowledge. R15 implements progressive disclosure: L1 metadata (names/descriptions) resident in the system prompt, L2 full `SKILL.md` loaded when relevant, L3 resources loaded on demand. 【前沿认知】"Skill 是文件不是指令" — discoverable, testable, versioned, model-agnostic; code carriers beat pure docs (Voyager; the linkerd-patterns doc skill caused three-stage degradation when copied verbatim).

### Q24.2
Q: Does a bigger skill library mean better capability?
A: 【前沿认知】No. SkillsBench: curated skills +16.6pp (33.9%→50.5%, 18/18 configs), but self-generated skills are negative on all configs (−8.1~−11.5pp); 2-3 skills optimal (+19.0pp), ≥4 drops to +10.1pp; SWE-Skills-Bench: 39/49 skills zero gain. Discovery is not the bottleneck — skill quality is. 【项目实现】This is exactly why MiniCode keeps only names/descriptions resident and defers loading: context cost is bounded regardless of library size. 降级路径: if numbers slip, keep the three conclusions: 策展为正、自生成为负、2-3 个最优。

### Q24.3
Q: What about skill self-evolution and degradation?
A: 【前沿认知】(not implemented in MiniCode — label clearly) four generations: weight updates (STaR) → reflection memory (Reflexion, +11pp) → external workflows (AWM) → skill closed loop (Socratic-SWE +7.8pp on SWE-bench Verified; removing the skill registry costs −4.2). Anti-degradation: Ratchet hygiene (pattern normalization, evidence-threshold retirement with demotion-not-deletion, active cap ~50, meta-skill templates); SEVerA formal contracts (0% violation vs 76.3% unconstrained); 26.1% of public skills carry vulnerabilities. 【项目实现】MiniCode's lever is load-on-demand + user-managed skill directories; no auto-generation. 兑底: asked "how does your project self-evolve" — answer honestly: I implemented disclosure and loading governance; autonomous evolution is frontier research I follow for its verification-gate thinking.

## Q25 受控执行与安全边界

### Q25.1
Q: Why is Agent safety different from model safety?
A: 【项目实现】Model safety guards what the model says; Agent safety guards what it does. MiniCode gates every destructive action: file writes need diff review + approval (R10), shell commands are risk-classified with permission checks (R11), `PermissionManager` holds the permission state machine (R12), and permission context is injected into the system prompt (R04). 【前沿认知】AgentHarm: the same malicious task wrapped as an agent task drops refusal rates (+12.5pp chat version, +38.7pp with jailbreak template) — the agent setting is a soft jailbreak. Injection is structural: instructions and data are indistinguishable tokens; Lethal Trifecta (private data × untrusted content × outbound communication) makes exfiltration inevitable.

### Q25.2
Q: Why can't a stronger model or better prompts fix safety?
A: 【前沿认知】Inverse scaling: stronger models execute injected instructions more thoroughly (AgentDojo: up to 92% attack success where the attacker controls most tool outputs). Sleeper Agents: RLHF doesn't remove backdoors (55% vs 15% vulnerability at trigger; stable across training steps), adversarial training hides rather than removes (99-100% on real trigger strings), larger models are more stubborn. So the trust boundary must move to layers the model cannot manipulate. 【项目实现】MiniCode's approval flow and permission state machine live outside the model's decision path — the model cannot self-approve. 降级路径: asked "how do you defend against prompt injection" — honest answer: local single-process terminal, whitelist + approval narrow the action surface; content-tagging defense is a platform-level topic I understand as a design direction.

### Q25.3
Q: What does defense in depth look like for agents?
A: 【前沿认知】AI Control: design protocols assuming the model will cheat; trusted editing raised blue-team win rate 15%→92% while keeping 94% usefulness. Zero-trust four layers (Caging the Agents): kernel isolation (gVisor), credential proxy (agent never sees raw keys), egress whitelist, prompt integrity — the first three run at an infrastructure layer the model cannot manipulate; only the fourth depends on the LLM. Evaluation awareness: "0 breakdowns" results must exclude "the model knew it was a test" (UK AISI 21.7% unprompted awareness; agentic misalignment 55.1% blackmail in "real deployment" vs 6.5% in "evaluation"). 【项目实现】MiniCode's scope is the action-guardrail layer: approvals and risk classification sit outside the model. 一句话兑底: 安全边界建在模型操纵不了的层；平台级隔离是论文认知，我讲设计思路。
