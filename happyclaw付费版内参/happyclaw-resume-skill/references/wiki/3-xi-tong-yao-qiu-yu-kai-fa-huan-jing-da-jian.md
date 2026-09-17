本文档详细说明 HappyClaw 的软硬件前提条件、开发环境准备流程以及常见问题排查方法。无论你是首次接触项目的新手开发者，还是准备在生产环境部署的运维人员，本文都可以作为系统级的参考手册。

## 软硬件前提条件

HappyClaw 是一个基于 Node.js 的 TypeScript 全栈项目，前后端与 Agent 运行时三端分离。运行 HappyClaw 需要满足以下最低系统要求。

**操作系统**：macOS 或 Linux。Windows 用户推荐使用 WSL2（Windows Subsystem for Linux 2）运行 Ubuntu 24.04 或更新版本。项目在 macOS 和 Ubuntu 24.04 上持续集成测试，其他平台可能存在未覆盖的兼容性问题。

**Node.js 运行时**：必须使用 Node.js 20 或更高版本。项目 CI 使用 Node.js 22.22.3，这也是推荐版本。Node.js 的安装推荐使用 `nvm`（Node Version Manager），可以方便地在多个版本之间切换。安装命令如下：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
# 重新加载 shell 配置
source ~/.bashrc
# 安装并切换 Node.js 22
nvm install 22
nvm use 22
```

**包管理器**：npm（随 Node.js 一同安装）和 GNU Make。项目使用 npm 作为包管理器，不要使用 bun 或 pnpm 替代——主服务的 WebSocket 实现依赖 Node.js 原生 HTTP Server 的 `upgrade` 事件，而 bun 的 HTTP Server 不触发该事件，会导致 WebSocket 握手全部失败，前端实时流式卡片和通知功能完全失效（HTTP 接口正常）。

**Docker（可选但推荐）**：如果需要使用 Container 模式执行 Agent（即让普通成员在隔离的 Docker 沙箱中运行），需要安装 Docker。macOS 推荐使用 OrbStack（性能更优、资源占用更低）或 Docker Desktop；Linux 可以使用 Docker Engine。仅使用管理员 Host 模式时可以不安装 Docker。

**工具链**：Git（用于克隆代码仓库）、GNU Make（用于执行构建和运行命令）。macOS 用户需要安装 Xcode Command Line Tools，运行 `xcode-select --install` 即可。

综上所述，准备开发环境的核心命令序列如下：

```bash
# 1. 检查 Node.js 版本
node --version   # 须 >= 20

# 2. 检查 npm 版本
npm --version

# 3. 检查 Docker 是否可用（可选）
docker --version

# 4. 检查 Make 是否可用
make --version
```

Sources: [package.json](package.json#L18-L22), [Makefile](Makefile#L3-L6), [README.md](README.md#L149-L154)

## 仓库结构与三端分离

在克隆代码和安装依赖之前，理解 HappyClaw 的仓库结构至关重要。整个项目由三个独立的 npm 子项目组成，每个子项目都有自己的 `package.json`、依赖树和构建流程：

| 子项目 | 位置 | 职责 | 构建产物 |
|--------|------|------|----------|
| **后端主服务** | `src/` + `package.json`（根目录） | 路由、认证、消息队列、渠道连接、Provider 池、调度器、持久化 | `dist/index.js` |
| **Web 前端** | `web/` | 基于 React 19 的 SPA 用户界面 | `web/dist/` |
| **Agent Runner** | `container/agent-runner/` | 容器内运行 Claude Agent SDK 的执行器 | `container/agent-runner/dist/` |

三个子项目之间通过 `shared/` 目录共享类型定义。`shared/stream-event.ts` 定义了前后端与 Runner 之间实时事件流的类型契约；`shared/image-detector.ts` 和 `shared/channel-prefixes.ts` 提供跨端共用的工具类型。当 `shared/` 中的类型发生变更时，需要通过 `make sync-types` 命令将类型同步到三个子项目的源文件中。

这种三端分离的设计带来了一个重要的实践约束：**安装依赖时必须分别为三个子项目执行 `npm ci`**，而不是在根目录一次性安装。CI 流程中的安装命令清晰地展示了这一点：

```bash
npm ci                          # 安装后端依赖
npm --prefix web ci             # 安装前端依赖
npm --prefix container/agent-runner ci  # 安装 Agent Runner 依赖
```

Sources: [package.json](package.json#L1-L91), [web/package.json](web/package.json#L1-L61), [container/agent-runner/package.json](container/agent-runner/package.json#L1-L39), [.github/workflows/ci.yml](.github/workflows/ci.yml#L30-L35)

## 系统依赖与外部工具安装

除了 npm 包依赖之外，HappyClaw 还需要若干系统级的外部工具，尤其是在 Host 模式下运行时。`scripts/install-host-tools.sh` 脚本负责安装这些工具，它支持两种运行模式：

```bash
# 安装所有主机工具（feishu-cli、agent-browser、uv）
./scripts/install-host-tools.sh

# 仅刷新内置 Skills 缓存（当 want 更新 Skills 列表时）
./scripts/install-host-tools.sh skills
```

该脚本会检测当前操作系统（Darwin/macOS 或 Linux）和处理器架构（x86_64/arm64），自动下载对应平台的可执行文件。具体安装的工具包括：

- **feishu-cli**（v1.35.0）：飞书命令行工具，用于在 Agent 运行时中与飞书 API 交互。通过 GitHub Releases 下载，安装到 `/usr/local/bin`。
- **agent-browser**：浏览器自动化工具，通过 `npm install -g` 全局安装。
- **uv**（Astral 的快速 Python 包管理器）：通过官方安装脚本 `https://astral.sh/uv/install.sh` 安装。
- **内置 Skills 缓存**：从 feishu-cli 源码仓库中提取固定版本的 Skills 定义，物化到 `data/builtin-skills/` 目录下。

Makefile 中的 `make start` 和 `make dev` 命令会在启动时自动检查内置 Skills 是否已就绪，如果缺失会自动调用 `install-host-tools.sh skills` 进行物化。

Sources: [scripts/install-host-tools.sh](scripts/install-host-tools.sh#L1-L145), [Makefile](Makefile#L80-L87)

## 三步启动：从克隆到首次运行

HappyClaw 的设计目标是让开发者能够以最少的步骤完成本地开发环境的搭建。以下是标准的三步启动流程。

**第一步：克隆代码仓库**

```bash
git clone https://github.com/riba2534/happyclaw.git
cd happyclaw
```

**第二步：生产模式启动**

```bash
make start
```

`make start` 命令会自动执行以下操作：

1. 检查端口 3000 是否已被占用，如果已被占用则提示先执行 `make stop`。
2. 检测三端依赖是否已安装，如果 `node_modules` 缺失或 `package.json` 比 `node_modules` 更新，则自动执行 `npm ci`。
3. 调用 `_ensure-builtin-skills` 物化内置 Skills 列表。
4. 调用 `_ensure-docker-image` 检测 Docker 镜像，如果 Docker 可用且镜像不存在或源码变更，则自动构建 `happyclaw-agent:latest` 镜像。
5. 同步 `shared/` 类型到各个子项目。
6. 检测后端、前端、Agent Runner 三端源码变更，仅重新编译有变更的部分（增量构建）。
7. 最后以 Node.js 生产模式启动：`node dist/index.js`。

首次启动耗时较长，因为需要下载所有 npm 包、构建 Docker 镜像（约 440MB 基础层 + 工具层）。后续启动仅需数秒。

启动完成后，打开浏览器访问 **http://localhost:3000**。首次访问时，系统会引导你完成以下初始化步骤：

1. 创建第一个管理员账户（用户名、密码、邮箱）。
2. 配置 Anthropic 官方账号（通过 Claude OAuth 一键登录或 API Key）或第三方 Claude 兼容 Provider。
3. （可选）添加飞书、Telegram、QQ、钉钉、微信、Discord 或 WhatsApp 渠道账号。
4. 进入工作台开始创建 Agent 和工作区。

**第三步：开发模式启动**

```bash
make dev
```

开发模式与生产模式的核心区别在于：

| 对比维度 | `make start`（生产模式） | `make dev`（开发模式） |
|----------|-------------------------|------------------------|
| 后端运行方式 | 编译后的 `dist/index.js` | `tsx` 直接执行 TypeScript 源码 |
| 前端运行方式 | 编译后的静态文件 | Vite 开发服务器（HMR 热更新） |
| 前端端口 | 3000（由后端 ServeStatic） | 5173（Vite 独立端口） |
| 代码变更 | 需手动重新构建 | 自动热更新 |
| 启动速度 | 需先编译，较慢 | 即时启动，较快 |

开发模式启动后，后端在端口 3000 运行，前端在端口 5173 运行（Vite 自动将 `/api` 和 `/ws` 请求代理到后端）。日常开发中推荐使用 `make dev`，配合 TypeScript 的类型检查可以在编码阶段就发现大部分问题。

Sources: [Makefile](Makefile#L30-L65), [README.md](README.md#L157-L174), [web/vite.config.ts](web/vite.config.ts#L1-L49)

## 可选环境变量配置

HappyClaw 遵循"约定优于配置"的设计原则，绝大多数设置可以通过 Web 界面完成，无需手动维护环境变量。但以下环境变量在特定场景下仍然有用：

```bash
# 创建 .env 文件（位于项目根目录）
# 这是一个可选文件，缺失不影响启动

# 端口配置
WEB_PORT=3000

# 会话密钥（自动生成并持久化到 data/config/session-secret.key，通常无需手动设置）
# WEB_SESSION_SECRET=your-secret-here

# Docker 容器镜像名称
CONTAINER_IMAGE=happyclaw-agent:latest

# 容器超时设置（毫秒）
CONTAINER_TIMEOUT=1800000
IDLE_TIMEOUT=1800000

# 并发限制
MAX_CONCURRENT_CONTAINERS=20
MAX_CONCURRENT_SCRIPTS=10
SCRIPT_TIMEOUT=60000

# 文件上传大小限制（MB）
MAX_FILE_SIZE_MB=50

# 反向代理配置（部署在 nginx 等代理之后时设为 true）
TRUST_PROXY=false

# 时区设置
TZ=Asia/Shanghai
```

特别需要注意的是代理配置。如果部署环境位于中国大陆，Anthropic 的 API 可能无法直连。`src/load-env.ts` 模块会在服务启动的最早阶段加载代理配置，读取 `HTTPS_PROXY`、`HTTP_PROXY` 和 `NO_PROXY` 环境变量，并设置全局 fetch 的代理。配置示例如下：

```bash
# .env 文件中的代理配置
HTTPS_PROXY=http://127.0.0.1:7890
HTTP_PROXY=http://127.0.0.1:7890
NO_PROXY=localhost,127.0.0.1
```

Provider 和渠道凭据（如 API Key、Bot Token 等）建议只在 Web 界面的设置页面中填写，它们使用 AES-256-GCM 加密存储，相关 API 只返回是否已配置，不返回密钥明文。

Sources: [src/config.ts](src/config.ts#L1-L104), [src/load-env.ts](src/load-env.ts#L1-L45), [README.md](README.md#L262-L295)

## Docker 容器镜像构建

如果环境中有 Docker，HappyClaw 会在首次启动时自动构建 Agent 容器镜像。镜像构建由 `container/build.sh` 脚本完成，该脚本在 `Makefile` 的 `_ensure-docker-image` 目标中被调用。

构建过程的核心步骤如下：

1. **基础镜像**：使用 `node:22.22.3-slim`（Debian Bookworm 基础），通过 SHA256 摘要锁定镜像版本，确保可重现构建。
2. **系统包安装**：安装 Chromium 浏览器、构建工具（build-essential、cmake、pkg-config）、Python 3 生态（pip、venv、dev）、CLI 工具（curl、git、zsh、jq、ripgrep）、数据库客户端（sqlite3、mysql、postgres、redis）、文档处理工具（pandoc、poppler）等。这一层约 440MB。
3. **uv 安装**：通过多阶段构建从 `ghcr.io/astral-sh/uv` 复制编译好的 uv 二进制。
4. **npm 依赖安装**：在镜像中安装 Agent Runner 的 npm 依赖（包括 `@anthropic-ai/claude-agent-sdk` 和 `@anthropic-ai/claude-code`）。
5. **headroom-ai 安装**：安装工具输出压缩工具 headroom-ai（仅 code 和 mcp 扩展，不安装 memory 扩展以避免 torch 依赖）。
6. **feishu-cli 安装**：下载并校验 feishu-cli 二进制，支持 amd64 和 arm64 架构。
7. **TypeScript 编译**：编译 Agent Runner 源码。
8. **oh-my-zsh 安装**：为 node 用户安装 oh-my-zsh（ys 主题），通过 commit SHA 锁定版本。
9. **工作目录创建**：创建 `/workspace/group`、`/workspace/global`、`/workspace/memory`、`/workspace/ipc` 等目录。

构建网络默认使用 host 模式（`BUILD_NETWORK=host`），这是因为 Docker 默认的桥接 DNS（8.8.8.8）在 VPN/隧道环境中不可靠，会导致 feishu-cli 下载步骤失败。如果构建环境受限无法使用 host 网络，脚本会自动回退到默认桥接网络重试。

Sources: [container/Dockerfile](container/Dockerfile#L1-L199), [container/build.sh](container/build.sh#L1-L44)

## 运行数据目录结构

HappyClaw 的所有持久化数据默认存储在 `data/` 目录下，该目录被 `.gitignore` 排除，不会提交到版本控制。理解数据目录结构有助于排查问题和管理备份：

```
data/
├── db/messages.db          # SQLite 主数据库（消息、用户、会话、任务等）
├── config/                 # 加密配置（Provider 凭据、系统设置）
│   ├── session-secret.key  # 自动生成的会话签名密钥
│   ├── claude-provider.json       # Provider 配置（AES-256-GCM 加密）
│   └── claude-provider.key        # Provider 配置加密密钥
├── groups/                 # 工作区目录和项目文件（每个工作区一个子目录）
├── memory/                 # 日期记忆文件
├── sessions/               # 主会话与 Runtime Session 的 Claude 数据
├── ipc/                    # Runner 输入、工具请求和回执
│   ├── messages/           # IPC 消息
│   ├── tasks/              # IPC 任务
│   └── input/              # IPC 输入
├── skills/                 # 用户导入的 Skills
├── builtin-skills/         # 固定版本内置 Skills 清单
├── mcp-servers/            # 用户 MCP 配置
├── plugins/                # Plugin catalog、用户状态与运行快照
└── extra/                  # Container 工作区持久工具数据
```

迁移实例时，优先使用 `make backup` 和 `make restore` 命令创建一致性备份和恢复，而不是手动复制 `data/` 目录。备份流程会检查归档路径、文件类型、符号链接、清单和数据库完整性。

Sources: [README.md](README.md#L298-L315), [.gitignore](.gitignore#L1-L76), [src/config.ts](src/config.ts#L14-L25)

## 开发工作流常用命令

掌握以下命令可以显著提升开发效率：

| 命令 | 用途 | 说明 |
|------|------|------|
| `make dev` | 启动开发模式 | 前后端同时启动，支持热更新 |
| `make dev-backend` | 仅启动后端 | 适合只想调试 API 时使用 |
| `make dev-web` | 仅启动前端 | 需要后端已运行时使用 |
| `make start` | 生产模式启动 | 编译后运行，性能最优 |
| `make stop` | 停止服务 | 终止监听 `WEB_PORT` 的进程 |
| `make status` | 查看运行状态 | 显示端口占用、健康检查、日志和 Docker 容器 |
| `make typecheck` | 全量类型检查 | 检查三端类型 + 类型同步一致性 |
| `make test` | 运行单元测试 | 基于 Vitest 的测试套件 |
| `make format` | 格式化代码 | 使用 Prettier 统一代码风格 |
| `make format-check` | 检查格式 | CI 中用于检查变更文件的格式 |
| `make build` | 编译构建 | 编译三端产物 |
| `make install-host-tools` | 安装主机工具 | 安装 feishu-cli、agent-browser、uv |
| `make backup` | 创建备份 | 一致性运行数据备份 |
| `make restore FILE=...` | 恢复备份 | 停止服务后恢复指定备份 |
| `make logs` | 实时查看日志 | 配合后台运行模式使用 |
| `make help` | 查看所有命令 | 列出 Makefile 中的所有目标 |

Sources: [Makefile](Makefile#L1-L347), [README.md](README.md#L176-L192)

## 常见问题排查

**问题 1：启动时提示端口被占用**

```bash
❌ 端口 3000 已被占用，请先停掉旧进程：make stop
```

执行 `make stop` 停止旧进程，或设置 `WEB_PORT=8080 make start` 使用其他端口。

**问题 2：WebSocket 连接失败，前端实时功能不可用**

确认没有使用 bun 运行服务。HappyClaw 主服务必须使用 Node.js 运行。如果使用了反向代理（如 nginx），需要确保 WebSocket 升级请求被正确转发，并设置 `TRUST_PROXY=true` 环境变量。

**问题 3：Docker 镜像构建失败**

如果构建网络环境受限，可以尝试设置 `BUILD_NETWORK=default` 使用 Docker 默认桥接网络：

```bash
BUILD_NETWORK=default ./container/build.sh
```

或者，如果不需要 Container 模式，可以跳过 Docker 安装，仅使用 Host 模式运行。

**问题 4：Anthropic API 无法连接（403 Forbidden）**

如果位于中国大陆，需要配置代理。在 `.env` 文件中设置：

```bash
HTTPS_PROXY=http://127.0.0.1:7890
HTTP_PROXY=http://127.0.0.1:7890
```

代理配置会在服务启动的最早阶段生效，确保所有 Server-Side Fetch 请求都通过代理。

**问题 5：`make start` 卡在依赖安装步骤**

首次启动时，Makefile 会自动为三端安装依赖并构建 Docker 镜像。如果网络不稳定，可以手动分步执行：

```bash
# 手动安装依赖
npm ci
npm --prefix web ci
npm --prefix container/agent-runner ci

# 手动构建
npm run build:all

# 启动
node dist/index.js
```

Sources: [src/load-env.ts](src/load-env.ts#L1-L45), [Makefile](Makefile#L3-L6), [container/build.sh](container/build.sh#L1-L44)

## 下一步阅读

完成开发环境搭建后，建议按以下顺序阅读后续文档：

- [**Provider 配置与多模型负载均衡**](4-provider-pei-zhi-yu-duo-mo-xing-fu-zai-jun-heng) —— 配置 Claude 官方或第三方 Provider，理解负载均衡策略
- [**渠道接入：飞书、Telegram、QQ、钉钉、微信、Discord、WhatsApp 集成**](5-qu-dao-jie-ru-fei-shu-telegram-qq-ding-ding-wei-xin-discord-whatsapp-ji-cheng) —— 接入 IM 渠道，让 Agent 走向群聊
- [**Agent-First 三层模型：Agent → Workspace → Runtime Session**](6-agent-first-san-ceng-mo-xing-agent-workspace-runtime-session) —— 理解 HappyClaw 的核心产品模型