# CodeWiki Index

> 本 skill 不含 MiniCode-Complete-CN.md 等捆绑手册。全量 codewiki 按运行时定位读取：默认 `03-定稿/付费群文档汇总/三项目codewiki/MiniCode-main/`（01-30 编号 md，可用 `wiki.json` 做 slug→文件映射），找不到时询问用户实际路径。下表 CodeWiki Section 与行号是原捆绑手册的定位；运行时改用主题词匹配编号文件（如“工具系统”→“05-内置工具与本地快捷指令.md”）。

Use this index before reading codewiki runtime files. Load only the relevant section.

## Topic Map

| Wiki | Related Points | CodeWiki Section | Approx Lines |
| --- | --- | --- | --- |
| W00 | R22 | MiniCode 概览; 设计原则与路线图 | 1-143, 271-407 |
| W01 | R01, R02, R21 | 核心代理循环; 代理轮次生命周期 | 421-720 |
| W02 | R03 | 模型适配器与 API 集成 | 720-872 |
| W03 | R04 | 系统提示词构建 | 872-995 |
| W04 | R05, R06, R07 | 上下文压缩 | 995-1176 |
| W05 | R08 | 工具系统 | 1174-1306 |
| W06 | R09 | 内置文件与搜索工具 | 1307-1457 |
| W07 | R11, R20 | Shell 执行工具; Web、技能与交互工具 | 1457-1698 |
| W08 | R10, R12 | 权限与安全; 权限管理器; 文件审查和差异流程 | 1698-2027 |
| W09 | R13, R14 | MCP 集成; MCP 客户端架构; MCP 服务器管理 CLI | 2093-2568 |
| W10 | R15 | 技能系统; 技能发现与加载; 技能管理 CLI | 2568-2966 |
| W11 | R16, R17, R21 | 终端用户界面; TUI 应用编排; 输入解析与历史 | 2965-3502 |
| W12 | R07, R18 | 会话管理; 会话存储和 JSONL 格式; 会话生命周期命令 | 3936-4310 |
| W13 | R19 | 配置与基础设施; 配置系统 | 3502-3796 |

## Deep-Dive Procedure

1. Identify selected `Rxx`.
2. Find its `Wxx`.
3. Read the matching runtime file (by topic) from the codewiki runtime directory, per the note above.
4. Extract only implementation facts, data flow, trade-offs, and failure modes.
5. Do not convert roadmap/future plans into implemented claims.

## Resume Verification Rule

Before strengthening a bullet, check:

- Is the mechanism explicitly described in CodeWiki?
- Is the source file/module named?
- Is the claim about implemented behavior, not a future direction?
- Can the user explain the data flow without reading notes?

