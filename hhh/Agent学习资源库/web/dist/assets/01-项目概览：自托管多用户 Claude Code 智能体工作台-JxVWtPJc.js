const n=`本文是 HappyClaw 维基的**起点页面**，面向初次接触该项目的开发者。你将了解：HappyClaw 是什么、能做什么、系统如何分层、代码仓库如何组织，以及该按什么顺序阅读后续文档。本页只做整体介绍，不展开实现细节——每个主题都在目录中有对应的深挖页面。

## HappyClaw 是什么

HappyClaw 是一个**自托管、多用户、智能体优先的 Claude Code 工作台**。它基于 Anthropic 的 [Claude Agent SDK for TypeScript](https://github.com/anthropics/claude-agent-sdk-typescript)，把完整的 Claude Code 运行时封装成一个可持续运行的 Web 服务，让你从浏览器或 7 种 IM 消息渠道随时唤醒智能体执行任务。

项目采用 MIT 协议开源，主仓库为 \`riba2534/happyclaw\`，核心定位是一句话：**让 Claude Code 通过 Web 与消息渠道长期在线，在宿主机或 Docker 沙箱中安全执行任务**。

Sources: [README.md](README.md#L43-L57)、[package.json](package.json#L1-L10)

关键在于，HappyClaw **不是一个简单的聊天 API Wrapper**：智能体运行在真实的 Claude Code 环境中，可以读写项目文件、执行终端命令、使用浏览器、调用 MCP、加载 Skills，并在多个独立工作区和会话之间保持清晰的权限与上下文边界。这意味着你可以把"项目级 AI 工程师"真正部署到自己的服务器上，而不是把对话转发给云端。

Sources: [README.md](README.md#L49-L57)

## 功能总览

下表汇总了 HappyClaw 的主要能力模块。阅读时不必记住每一项，后续章节会逐个展开。

| 模块 | 主要能力 |
| --- | --- |
| **智能体** | 对话式创建/编辑、自定义智能体、头像、结构化提示词、AI 优化、版本历史与恢复 |
| **工作区** | 智能体归属、宿主机/容器执行、独立目录、项目环境变量、项目 Claude 上下文、多会话 |
| **能力治理** | 用户 Skills、系统/用户 MCP、Claude Code Plugins 与最终生效预览；智能体工具权限完整开放 |
| **消息渠道** | 飞书、Telegram、QQ、钉钉、微信、Discord、WhatsApp，多账号、扫码登录、工作区/会话绑定 |
| **模型提供商** | Anthropic 官方与第三方兼容端点、多 Provider、轮询/加权/故障转移、健康检查、会话粘性 |
| **定时任务** | Cron、固定间隔、一次性任务，智能体/Script 执行，隔离上下文，幂等立即运行，通知重试 |
| **记忆与文件** | Workspace Memory（事实、决策、经验、待跟进）、来源与修订、CAS 编辑、搜索、文件与终端 |
| **用量与计费** | Token 分类统计、筛选、明细与 CSV 导出、订阅、余额、兑换码与配额 |
| **运维与安全** | RBAC、邀请注册、登录设备、审计日志、运行监控、Docker 镜像管理、备份与安全恢复 |
| **客户端体验** | 实时流式输出、工具轨迹、Markdown/Mermaid/KaTeX、消息分享图片、响应式布局与 PWA |

Sources: [README.md](README.md#L58-L72)

## 核心设计：智能体优先的三层模型

HappyClaw 的产品模型围绕一个统一的层级展开：**智能体（Agent Profile）→ 工作区（Workspace）→ 运行会话（Runtime Session）**。这是理解整个系统的第一把钥匙。

\`\`\`mermaid
flowchart TD
    A["智能体 Agent Profile<br/>身份 · 四段 Prompt · Skills · MCP"] --> W["工作区 Workspace<br/>文件目录 · 执行模式 · 环境变量"]
    W --> M["Main Session<br/>工作区主会话"]
    W --> R["Runtime Session<br/>独立对话 / 渠道原生话题"]
    W --> S["Scheduled Run<br/>定时任务的普通或隔离运行"]
    W --> Mem["Workspace Memory<br/>事实 · 决策 · 经验 · 待跟进"]
    R -. 绑定 .-> CH["IM 私聊 / 群聊 / 原生话题"]
\`\`\`

阅读这张图时注意三点：**智能体**只负责"身份与能力"——它定义自己是谁、擅长什么、能用哪些工具；**工作区**才是文件与执行的隔离边界——同一个智能体可以有多个工作区，每个工作区有独立的项目目录、环境变量和记忆；**会话**则是工作区内的一段独立对话上下文，多个会话可以并行存在，共享工作区文件但不共享对话历史。

Sources: [README.md](README.md#L73-L104)、[CLAUDE.md](CLAUDE.md#L20-L44)

几个重要的边界规则：内置 **HappyClaw** 是不可删除的平台主 Agent；**Home Workspace** 是不可删除的系统工作区并永久归属它；自定义智能体创建后没有隐式工作区，需要显式新建；**Workspace Memory** 是跨会话复用的结构化知识，与聊天历史分开保存。命名上要注意历史包袱：\`agent_profiles\` 才是产品级 Agent，而 \`agents\` 表实际表示工作区内的运行会话。

Sources: [CLAUDE.md](CLAUDE.md#L20-L44)

### 两种执行模式

HappyClaw 支持宿主机与容器两种执行方式，这也是它区别于普通聊天机器人的核心能力之一：

| 模式 | 适用对象 | 行为 |
| --- | --- | --- |
| **Host** | 管理员授权的宿主机工作区 | 直接在指定本机目录运行，适合已有代码仓库和本机工具链 |
| **Container** | 普通成员与需要隔离的工作区 | 在非 root Docker 容器中运行，使用独立工作目录和预装工具链 |

普通成员不能把容器工作区降级为宿主机执行；Script 定时任务也只允许管理员在有权限的 Host 工作区运行。管理员可以开启"纯宿主机模式"强制自己的工作区使用 Host。

Sources: [README.md](README.md#L105-L117)、[CLAUDE.md](CLAUDE.md#L112-L130)

## 系统架构总览

从进程视角看，HappyClaw 只有**一个常驻 Node.js 主服务**，Docker 仅用于隔离智能体执行环境，不承载主服务本身。

\`\`\`mermaid
flowchart LR
    Web["Web / PWA"] --> Core["HappyClaw Node 主服务"]
    IM["7 种 IM 渠道"] --> Core
    Core --> Auth["认证与 RBAC"]
    Core --> Router["消息路由与会话队列"]
    Core --> Sched["任务调度与恢复"]
    Core --> DB[("SQLite + data/ 运行数据")]
    Router --> Pool["Provider 池<br/>轮询 / 加权 / 故障转移"]
    Sched --> Pool
    Pool --> HR["Host Runner<br/>宿主机 Node 进程"]
    Pool --> CR["Container Runner<br/>Docker 非 root 沙箱"]
    HR --> SDK["Claude Agent SDK / Claude Code"]
    CR --> SDK
    SDK <--> MCP["内置 MCP / IPC"]
    MCP --> Core
    Core --> Stream["WebSocket / 渠道回复"]
    Stream --> Web
    Stream --> IM
\`\`\`

读图路径建议：消息从**左侧两个入口**（Web 或 IM）进入主服务 → 经过**认证与路由队列** → 通过 **Provider 池**选择模型提供商 → 由 **Host 或 Container Runner** 拉起真实的 Claude Code 运行时 → 执行过程中的流式事件通过 **WebSocket 或渠道回复**送回用户。图中"内置 MCP / IPC"是主服务与 Runner 之间的双向通信通道，智能体通过它发送消息、查询渠道、读写记忆。

Sources: [README.md](README.md#L345-L373)

### 技术栈

| 层 | 技术 |
| --- | --- |
| **主服务** | Node.js、TypeScript、Hono、WebSocket、SQLite（better-sqlite3） |
| **智能体运行时** | Claude Agent SDK、Claude Code CLI、MCP、文件 IPC |
| **Web** | React 19、Vite、Tailwind CSS、Radix UI、Zustand、Recharts、xterm.js |
| **渠道** | Feishu SDK、grammY、QQ Bot API、DingTalk Stream、Discord.js、Baileys、微信 iLink |
| **隔离执行** | Docker、非 root Node.js 容器、Chromium、常用开发与浏览器工具 |
| **质量保障** | TypeScript、Vitest、Prettier、GitHub Actions |

Sources: [README.md](README.md#L374-L384)、[package.json](package.json#L19-L63)、[web/package.json](web/package.json#L12-L42)、[container/agent-runner/package.json](container/agent-runner/package.json#L11-L27)

### 主服务核心模块

主服务代码集中在 \`src/\`，关键模块的职责划分如下（完整索引见 [docs/API.md](docs/API.md)）：

| 文件 | 职责 |
| --- | --- |
| \`src/index.ts\` | 启动、消息消费、渠道路由、IPC、调度与 Agent 运行编排 |
| \`src/web.ts\` | Hono 应用、路由挂载、Cookie 认证、WebSocket 与静态资源 |
| \`src/db.ts\` | SQLite Schema、迁移和持久化访问器 |
| \`src/group-queue.ts\` | Session 串行、Runner 生命周期、重试与容量控制 |
| \`src/container-runner.ts\` | Host/Container Runner、挂载、环境与能力快照 |
| \`src/task-scheduler.ts\` | Cron、interval、once 调度和重启恢复 |
| \`src/channel-mount-service.ts\` | 工作区/会话绑定和原生线程路由 |
| \`src/channel-reliability-store.ts\` | Inbox、Turn、Outbox、Streaming Card 的持久状态机 |
| \`src/im-manager.ts\` | 多用户、多账号渠道连接池 |

HTTP 路由在 \`src/web.ts\` 统一挂载，覆盖认证、工作区、智能体、渠道账号、配置、任务、记忆、Skills、MCP、Plugins、用量、计费等约 20 个路由族；WebSocket 走 \`/ws\`。前端页面路由以 \`web/src/App.tsx\` 为准，工作台主页面为 \`/chat/:groupFolder?\`。

Sources: [CLAUDE.md](CLAUDE.md#L45-L74)、[src/web.ts](src/web.ts#L265-L288)、[docs/API.md](docs/API.md#L18-L40)、[web/src/App.tsx](web/src/App.tsx#L126-L281)

### Agent Runner：两种模式的共用执行器

\`container/agent-runner/\` 同时服务 Host 与 Container 两种模式：主服务通过 stdin 传入任务输入，Runner 以标记化 stdout 输出结构化结果，后续消息与工具请求通过独立 IPC 目录传递。Runner 内置 Claude Agent SDK、Claude Code CLI 与 agent-browser，容器镜像还预装了 Chromium、Python、常用数据库客户端与文档工具。执行环境的关键细节（如非 root 身份、只读挂载、npm 全局包持久化、Chromium CDP 端口）由 \`container/entrypoint.sh\` 在容器启动时配置。

Sources: [CLAUDE.md](CLAUDE.md#L98-L111)、[container/agent-runner/package.json](container/agent-runner/package.json#L1-L39)、[container/Dockerfile](container/Dockerfile#L1-L120)、[container/entrypoint.sh](container/entrypoint.sh#L1-L80)

## 仓库结构速览

\`\`\`text
happyclaw/
├── src/                         # 主服务：路由、调度、渠道、权限与持久化
├── web/                         # React Web/PWA 前端
├── container/
│   ├── agent-runner/            # Host/Container 共用的 Agent 执行器
│   ├── Dockerfile               # 智能体沙箱镜像
│   └── entrypoint.sh            # 容器启动时的身份与挂载配置
├── shared/                      # 三端共享的 StreamEvent 类型源
├── scripts/                     # 构建、校验、备份和恢复脚本
├── tests/                       # 后端、前端契约、迁移与安全回归测试
├── docs/                        # API、权限矩阵与设计文档
├── config/                      # 挂载白名单、插件依赖覆盖等静态配置
├── Makefile                     # 统一开发、构建和运维入口
└── data/                        # 本地运行数据，不进入 Git
\`\`\`

规模上，这是一个相当成熟的项目：\`src/\` 下 168 个 TypeScript 文件（约 11.4 万行），\`web/src/\` 下 240 个前端文件（约 6.3 万行），\`tests/\` 下超过 320 个测试文件（约 8 万行）。一个值得注意的工程决策：**项目只使用 Node.js/npm 工具链，不使用 Bun**——因为主服务的 WebSocket 依赖 Node HTTP Upgrade 握手，在 Bun 下会全部失败。

Sources: [README.md](README.md#L416-L431)、[CLAUDE.md](CLAUDE.md#L98-L111)、[Makefile](Makefile#L5-L16)

## 数据与运行存储

所有持久化数据默认位于 \`data/\`，不进入 Git。核心是 SQLite 主数据库 \`data/db/messages.db\`，Schema 版本以 \`src/db.ts\` 中的 \`CURRENT_SCHEMA_VERSION\` 为准：

\`\`\`text
data/
├── db/messages.db     # SQLite 主数据库（用户、工作区、消息、任务、记忆等）
├── config/            # 加密配置、密钥与系统设置
├── groups/            # 工作区目录和项目文件
├── sessions/          # 主会话与 Runtime Session 的 Claude 数据
├── ipc/               # Runner 输入、工具请求和回执
├── skills/            # 用户 Skills
├── builtin-skills/    # 固定版本内置 Skills 清单
├── mcp-servers/       # 用户 MCP 配置
├── plugins/           # Plugin catalog、用户状态与运行快照
└── extra/             # Container 工作区持久工具数据
\`\`\`

迁移实例时优先使用 \`make backup\` / \`make restore\`；恢复流程会检查归档路径、文件类型、符号链接、清单和数据库完整性。

Sources: [README.md](README.md#L324-L343)、[CLAUDE.md](CLAUDE.md#L218-L260)

## 质量保障与工程规范

每个 Pull Request 都会经过 CI 全量验证，这是项目可靠性的重要保证：

1. 三端（主服务/Web/Runner）\`npm ci\` 可复现安装。
2. 改动文件格式检查。
3. **共享事件类型一致性检查**——\`shared/stream-event.ts\` 是唯一真相源，构建时同步到三端副本，任何漂移都会导致 CI 失败。
4. 三端类型检查。
5. 全量 Vitest 测试（含契约测试、迁移测试与安全回归）。
6. 三端生产构建。
7. Agent Runner 自检与 Playwright 端到端测试。

Sources: [.github/workflows/ci.yml](.github/workflows/ci.yml#L1-L64)、[README.md](README.md#L432-L443)、[shared/stream-event.ts](shared/stream-event.ts#L1-L16)

## 安全模型要点

HappyClaw 会执行代码并连接第三方消息平台，部署前请理解以下边界：

- 用户、渠道账号、工作区及其 Memory、Skills、MCP、Plugin 状态和用量记录按 owner 隔离。
- Provider 与渠道密钥使用本机 **AES-256-GCM** 加密存储，密钥文件权限限制为 \`0600\`。
- REST、WebSocket、IM 命令和 MCP 工具分别执行身份、owner、角色与能力策略检查。
- 普通成员固定使用 Container 模式；管理员 Host 模式只允许访问授权目录。
- Skill ZIP、文件上传、备份恢复和 Git 操作包含路径、符号链接、大小与目标校验。
- 对公网开放时，建议使用 HTTPS 反向代理、强密码、关闭开放注册，并定期备份 \`data/\`。

Sources: [README.md](README.md#L385-L399)

## 建议的阅读路线

如果你已理解本页内容，接下来按目录顺序推进即可。**先跑起来，再读原理**：

1. 环境要求与一键启动 → [快速开始：环境要求与一键启动](2-kuai-su-kai-shi-huan-jing-yao-qiu-yu-jian-qi-dong)——用 \`make start\` 在本地拉起完整系统。
2. 日常开发命令 → [开发模式与常用命令](3-kai-fa-mo-shi-yu-chang-yong-ming-ling)——\`make dev\` 前后端联调。
3. 首次使用流程 → [首次配置向导：管理员、模型提供商与渠道接入](4-shou-ci-pei-zhi-xiang-dao-guan-li-yuan-mo-xing-ti-gong-shang-yu-qu-dao-jie-ru)——创建管理员、配置 Provider、接入 IM。
4. 生产部署准备 → [部署与运维：环境变量、Docker 镜像与备份恢复](5-bu-shu-yu-yun-wei-huan-jing-bian-liang-docker-jing-xiang-yu-bei-fen-hui-fu)。

跑通之后，按兴趣进入 **Deep Dive** 区：先读 [智能体-工作区-会话三层模型](6-zhi-neng-ti-gong-zuo-qu-hui-hua-san-ceng-mo-xing) 与 [Host 与 Container 双执行模式](7-host-yu-container-shuang-zhi-xing-mo-shi) 巩固本页概念，再读 [主服务架构与核心模块划分](9-zhu-fu-wu-jia-gou-yu-he-xin-mo-kuai-hua-fen) 进入系统内部。`;export{n as default};
