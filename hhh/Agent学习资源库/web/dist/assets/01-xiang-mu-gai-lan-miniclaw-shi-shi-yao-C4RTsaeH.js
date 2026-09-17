const n=`本页是整个文档站的起点，面向初次接触 Miniclaw 的开发者。我们将回答三个问题：这个项目解决什么问题、它由哪些部分组成、以及它的代码仓库如何组织。读完本页，你将建立起一张整体心智地图——后续所有深入页面都建立在这张地图之上。本页只做概览，不涉及安装步骤与实现细节。

## 一句话定位：自托管的智能体工作台

Miniclaw 的官方定义是「自托管、Pi Agent 驱动的多渠道智能体工作台」（Self-hosted, multi-channel AI agent workbench powered by the Pi Agent Runtime）。对初学者而言，这三个修饰词各自代表一层含义：「自托管」意味着所有数据由你自己的服务器管理，不依赖第三方云服务；「多渠道」指同一个智能体可以同时从网页、桌面端和七种即时通讯软件访问；「Pi Agent 驱动」则表明真正执行任务的引擎是 Pi Agent Runtime 这个第三方编码智能体运行时，而非项目自己从零造的轮子。

与普通聊天机器人最大的区别在于：Miniclaw 的每个 Agent 不只是保存聊天记录的对话框，而是拥有三项核心资产——**长期运行的工作区**（独立的文件目录、Session 与 Memory）、**可审计的能力边界**（Skills、MCP、Plugins 按策略注入，越权请求在边界层直接拒绝）、以及**全渠道触达能力**（Web、桌面端、飞书、Telegram、微信、QQ、钉钉、Discord、WhatsApp）。

Sources: [README.md](README.md#L7-L9), [README.md](README.md#L37-L43)

## 智能体优先的产品模型

Miniclaw 采用「智能体优先」的工作模型，理解这个三层结构是读懂后续所有文档的前提：

- **Agent Profile** 是顶层身份与策略所有者，保存身份设定、四段 Prompt、模型选择与能力策略；
- **Workspace** 是隔离的执行边界，拥有自己的文件目录、执行模式与环境变量；
- **Runtime Session** 只是执行记录——同一个 Workspace 内的多个会话共享文件目录，但各自拥有独立的对话上下文。

用官方的产品层级图表达即：Agent Profile 下挂 Workspace，Workspace 下再分出 Main Session、Runtime Session、Native Context Session（如飞书话题原生线程）与 Scheduled Run（定时运行）。本页只需记住「身份 → 边界 → 记录」这条链路；完整展开见 [Agent-first 产品模型：Agent Profile、Workspace 与 Session 层级](5-agent-first-chan-pin-mo-xing-agent-profile-workspace-yu-session-ceng-ji)。

Sources: [CLAUDE.md](CLAUDE.md#L19-L36), [README.md](README.md#L45-L46)

## 整体架构鸟瞰

在阅读架构图之前，先建立一个直觉：Miniclaw 就像一家「外包工作室」。客户端是前台接待窗口，Backend 是调度一切的中枢办公室，Pi Agent Runner 是真正干活的外包工程师，而 Workspace 是工程师的工作现场。下面这张图描述了数据与指令的流动方向：

\`\`\`mermaid
flowchart TB
    subgraph clients["① 客户端入口（多种触达方式）"]
        direction LR
        WEB["Web 工作台<br/>React 单页应用"]
        DESK["Electron 桌面端<br/>仅作受限外壳"]
        IM["IM 渠道适配器 × 7<br/>飞书 / Telegram / 微信 / QQ<br/>钉钉 / Discord / WhatsApp"]
    end

    subgraph backend["② Miniclaw Backend（中枢，Node.js 主服务）"]
        direction LR
        AUTH["Cookie 认证 · ACL 授权"]
        API["Hono HTTP API · WebSocket"]
        QUEUE["会话串行队列 · 任务调度器"]
        DB[("SQLite 持久化")]
    end

    subgraph engine["③ Pi Agent Runner（执行引擎）"]
        direction LR
        HOST["Host 模式<br/>宿主机 Node 进程"]
        DOCKER["Container 模式<br/>非 root Docker 容器"]
    end

    WS["④ Workspace 工作现场<br/>文件目录 · Memory · Session 记录"]

    clients -- "HTTP + WebSocket / 渠道消息" --> backend
    backend -- "stdin 派发任务" --> engine
    engine <-- "读写文件、调用工具" --> WS
\`\`\`

四个组成部分的职责边界在代码库中被严格划分，这是 Miniclaw 架构上最重要的设计决策：

| 组成部分 | 职责 | 明确不做的事 |
| --- | --- | --- |
| **Backend** | 认证、持久化、队列、调度、渠道连接与授权 | 不执行 Agent 的具体任务 |
| **Pi Runner** | Agent 执行（工具调用、流式输出、子代理） | 不负责授权，也不持有业务数据 |
| **Workspace** | 决定文件与运行边界 | 不是聊天记录的存放地 |
| **Electron Renderer** | 只负责界面和受限的桌面桥接 | 无文件、数据库、凭证的直接权限 |

值得初学者特别注意的安全设计：Docker 只隔离 Agent 执行环境，并不承载桌面 UI，也不能替代 Backend 的授权层；Electron BrowserWindow 启用 \`contextIsolation\` 并关闭 \`nodeIntegration\`，Renderer 中运行的网页代码无法直接读取本机文件或数据库。任何一层的权限都不能自动越过其他边界。

Sources: [README.md](README.md#L127-L151), [README.md](README.md#L165-L170)

## 核心能力一览

Miniclaw 的功能可以归纳为七个领域。这张表同时是全站的「功能索引」——每个领域都有对应的深入页面：

| 领域 | 能力 | 对应深入页面 |
| --- | --- | --- |
| 🤖 Agent 与工作区 | Agent Profile 保存身份/模型/策略；Workspace 隔离文件与执行；Host 与 Docker 双执行模式 | [整体架构](4-zheng-ti-jia-gou-backend-pi-runner-workspace-yu-ke-hu-duan-de-bian-jie-hua-fen)、[双执行模式](11-host-yu-container-shuang-zhi-xing-mo-shi-rong-liang-chao-shi-yu-nuan-runner) |
| 🧠 Pi Runtime | 流式输出、工具调用、JSONL Session 持久化/恢复、abort、follow-up、Subagents | [Pi Agent Runner 协议](10-pi-agent-runner-xie-yi-stdin-stdout-jie-gou-hua-jie-guo-yu-ipc-tong-dao) |
| 📓 Memory | Workspace 级记忆：事实/偏好/决策/经验，版本历史与并发安全 | [Workspace Memory v2](22-workspace-memory-v2-zhi-shi-lei-xing-xiu-ding-li-shi-yu-bing-fa-an-quan) |
| 🧰 能力体系 | 六层 Skills 统一解析；MCP 工具映射为稳定的 \`mcp__miniclaw__*\`；Plugin Catalog 扫描导入 | [能力解析管线](13-neng-li-jie-xi-guan-xian-skills-mcp-plugins-liu-ceng-lai-yuan-yu-jing-que-qing-dan) |
| 💬 消息渠道 | 七大渠道接入，绑定 Workspace/Session 并按 owner 与群聊规则做 ACL | [七大渠道适配器](15-qi-da-qu-dao-gua-pei-qi-fei-shu-telegram-wei-xin-qq-ding-ding-discord-whatsapp) |
| ⏰ 自动化 | Cron / 固定间隔 / 一次性任务，运行历史、结果投递与失败恢复 | [定时任务调度器](21-ding-shi-ren-wu-diao-du-qi-cron-gu-ding-jian-ge-ci-xing-ren-wu-yu-zhong-qi-bu-pao) |
| 🖥️ 桌面端 | Electron 仅作 Shell，复用 Web Client，支持连接远程 Backend | [Electron 受限 Shell](26-electron-shou-xian-shell-contextisolation-yu-preload-ipc-qiao-jie) |

Sources: [README.md](README.md#L62-L72)

## 技术栈速览

Miniclaw 是一个 TypeScript 全栈单体仓库，但对运行环境的要求非常克制：只需要 Node.js ≥ 20 和 npm，容器执行模式下额外需要 Docker。各层技术选型如下：

| 层次 | 核心技术 | 说明 |
| --- | --- | --- |
| Backend 运行时 | Node.js ≥ 20、TypeScript（ESM） | 入口为 \`src/index.ts\`，单文件逾两万行，承载启动与消息编排 |
| Web 服务框架 | Hono + \`@hono/node-server\` | 轻量 HTTP 框架，配合 \`ws\` 提供 WebSocket |
| 持久化 | better-sqlite3 | 内嵌 SQLite，无外部数据库依赖，契合自托管定位 |
| 渠道 SDK | Lark SDK、grammY、Baileys、dingtalk-stream、discord.js 等 | 分别对应飞书、Telegram、WhatsApp、钉钉、Discord |
| Agent 引擎 | \`@earendil-works/pi-coding-agent\` | Pi Agent Runtime，主服务与 Runner 锁定同一版本 \`0.84.2\` |
| Web 前端 | React 19、React Router 7、Zustand 5、Tailwind CSS 4、Radix UI | Vite 构建，附带 xterm 终端与 mermaid 图表渲染 |
| 桌面端 | Electron 39 | 仅作外壳，通过 esbuild 打包 Main/Preload |

从依赖清单可以直接验证这些选型：根 \`package.json\` 同时引入了 Hono、better-sqlite3 与全部七个渠道 SDK；Runner 子包独立声明了对 Pi Runtime 及其 Subagents 扩展的依赖；前端包则清一色是 React 生态的最新主线版本。

Sources: [package.json](package.json#L41-L78), [container/agent-runner/package.json](container/agent-runner/package.json#L11-L17), [web/package.json](web/package.json#L14-L38)

## 仓库目录导览

最后用一棵注释过的目录树收束全局。初学者不必记住每个目录，只需在脑中建立「哪类代码住在哪个抽屉」的映射：

\`\`\`text
miniclaw/
├── src/                     # Backend 主服务：Hono 路由(src/web.ts)、队列、调度器、
│   │                        # SQLite Schema(src/db.ts)、七大渠道适配器(如 src/feishu.ts)
│   └── routes/              # 按资源划分的 HTTP 路由族（groups、tasks、plugins…）
├── web/                     # React 19 前端：页面(pages/)、状态(stores/)、组件(components/)
├── container/agent-runner/  # Pi Agent Runner：stdin/stdout 协议、IPC 通道、Prompt 模板
├── shared/                  # 三端共享契约：stream-event.ts 等流式类型定义
├── electron/                # Electron 外壳：Main 进程 + 受限 Preload IPC
├── config/                  # 静态配置：默认群组、宿主机挂载白名单、插件依赖覆盖
├── docs/                    # 设计文档：API 参考、ACL 权限矩阵、迁移记录
├── scripts/                 # 运维脚本：备份恢复、冒烟测试、文档一致性检查
└── tests/                   # 数百个 Vitest 用例：单元、契约、Schema 迁移测试
\`\`\`

这份导览与官方工程指南中的模块表一一对应：主服务的九个核心文件（启动编排、Hono 应用、数据库、队列、Runner、调度器、渠道绑定、可靠性状态机、连接池）各有明确职责边界；Agent Runner 则以 stdin 接收任务输入、用标记包裹的结构化输出返回结果。每个抽屉的内部构造将在 [目录导航与模块地图：从 src 到 container 再到 web](6-mu-lu-dao-hang-yu-mo-kuai-di-tu-cong-src-dao-container-zai-dao-web) 中逐层展开。

Sources: [CLAUDE.md](CLAUDE.md#L47-L110), [container/agent-runner/package.json](container/agent-runner/package.json#L2-L5)

## 它能跑起来吗：30 秒启动预览

本页不给完整安装教程，但值得让你先看一眼终点站长什么样。在克隆仓库后，一条 \`make dev\` 命令即可完成全部准备工作——Makefile 会自动检测依赖是否需要安装、确保内置 Skills 就位、拉取或构建容器镜像、编译 Agent Runner，最后并行启动 Backend 与前端热更新服务。随后打开浏览器访问 \`http://localhost:5173\`，完成管理员初始化即可进入工作台。

完整的从零到运行的步骤、环境变量说明与常见故障排查，请继续阅读下一页 [快速开始：从克隆到一键启动](2-kuai-su-kai-shi-cong-ke-long-dao-jian-qi-dong)。

Sources: [Makefile](Makefile#L24-L30), [README.md](README.md#L80-L88)

## 建议的阅读路线

基于目录结构与依赖关系，推荐初学者按以下顺序推进。前三站属于「入门指南」，建议按序完成；之后可依据兴趣在「深入解析」中自由跳转：

1. **本页** —— 建立整体认知；
2. [快速开始：从克隆到一键启动](2-kuai-su-kai-shi-cong-ke-long-dao-jian-qi-dong) —— 让系统在你机器上真正跑起来；
3. [开发工作流与常用命令速查](3-kai-fa-gong-zuo-liu-yu-chang-yong-ming-ling-su-cha) —— 学会日常开发所需的 make 与 npm 命令；
4. [整体架构：Backend、Pi Runner、Workspace 与客户端的边界划分](4-zheng-ti-jia-gou-backend-pi-runner-workspace-yu-ke-hu-duan-de-bian-jie-hua-fen) —— 把本页的架构鸟瞰图放大成细节图；
5. [目录导航与模块地图：从 src 到 container 再到 web](6-mu-lu-dao-hang-yu-mo-kuai-di-tu-cong-src-dao-container-zai-dao-web) —— 从「知道有哪些抽屉」进阶到「知道每个抽屉里有什么」。

若你是带着具体问题而来的读者，也可以直接跳转到兴趣领域：关心消息如何可靠送达，看[可靠性状态机](17-ke-kao-xing-zhuang-tai-ji-inbox-turn-outbox-yu-streaming-card-de-chi-jiu-tou-di)；关心权限隔离，看[ACL 权限矩阵](19-acl-quan-xian-ju-zhen-ceng-ci-hua-shou-quan-yu-wu-admin-pang-lu-de-zi-yuan-ge-chi)；关心 Prompt 如何组装，看[四段 Prompt 体系](12-si-duan-prompt-ti-xi-identity-soul-agents-tools-de-zu-zhuang-yu-shang-xia-wen-yu-suan)。`;export{n as default};
