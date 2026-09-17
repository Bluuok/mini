# CodeWiki Index

> 本 skill 不含捆绑的中文技术手册/DeepWiki。全量 codewiki 按运行时定位读取：默认 `03-定稿/付费群文档汇总/三项目codewiki/craft-agents-oss/`（主题目录 + `craft-agents-oss_zread_full.md` + `manifest.md`），找不到时询问用户实际路径。下表行号是原捆绑手册的定位；运行时用主题词匹配主题目录名（如 Monorepo → `Monorepo_架构_lukilabs_craft-agents-oss`）或在 zread_full 中按段落定位。

Use this file only when the user asks for deep explanation, source-backed verification, stronger interview prep, or bullet optimization.

## W00 Overview and Concept Map
- Supports: project positioning, overall architecture.
- Chinese manual: lines 64-183.
- DeepWiki: lines 1-123.

## W01 Monorepo and Package Layout
- Supports: `R01 R02`.
- Chinese manual: lines 359-506.
- DeepWiki: lines 298-445.

## W02 Core Architecture
- Supports: `R02 R03 R08 R12`.
- Chinese manual: lines 506-617.
- DeepWiki: lines 445-556.

## W03 Agent Execution Engine
- Supports: `R03 R04 R05 R06 R07 R10`.
- Chinese manual: lines 617-767.
- DeepWiki: lines 556-707.

## W04 LLM Connections and Model Configuration
- Supports: `R05 R07`.
- Chinese manual: lines 767-905.
- DeepWiki: lines 707-845.

## W05 System Prompt and Permission Injection
- Supports: `R06 R11`.
- Chinese manual: lines 1123-1236 and 3577-3635.
- DeepWiki: lines 1063-1177.

## W06 Session and Workspace Management
- Supports: `R08 R09`.
- Chinese manual: lines 905-1026 and 3471-3575.
- DeepWiki: lines 845-966.

## W07 Protocol and Transport Layer
- Supports: `R10 R12 R13`.
- Chinese manual: lines 1026-1123.
- DeepWiki: lines 966-1063.

## W08 Electron Desktop Application
- Supports: `R14 R15`.
- Chinese manual: lines 1322-1557.
- DeepWiki: lines 1263-1498.

## W09 WebUI, Renderer, Session Viewer, CLI
- Supports: `R15 R16`.
- Chinese manual: lines 1419-1740.
- DeepWiki: lines 1360-1681.

## W10 Session Tools, Sources, Skills, MCP
- Supports: `R17 R18 R19`.
- Chinese manual: lines 2033-2121 and 2506-2622.
- DeepWiki: lines 1976-2064.

## W11 Server Infrastructure and Pi Agent Server
- Supports: `R20 R21`.
- Chinese manual: lines 2226-2506.
- DeepWiki: lines 2169-2251.

## W12 Messaging Gateway, Authentication, OAuth
- Supports: `R19 R22`.
- Chinese manual: lines 2121-2226 and 2622-2720.
- DeepWiki: lines 2064-2169.

## W13 Build, CI/CD, Testing, Validation
- Supports: `R13 R23 R24`.
- Chinese manual: lines 2894-3183.

## W14 Deep Agent Core Source Analysis
- Supports: `R03 R04 R05 R06 R09 R10 R11`.
- Chinese manual: lines 3311-3635.

## Rules

- Do not load full manuals during normal resume generation.
- For deep dives, locate the `Wxx` section first, then read only matching ranges from the full source materials.
- If the evidence describes design, architecture, or possible extension rather than implemented behavior, phrase it as design understanding or extensibility, not completed production work.
