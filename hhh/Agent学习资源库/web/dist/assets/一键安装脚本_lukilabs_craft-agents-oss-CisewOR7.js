const n=`# 一键安装脚本 | lukilabs/craft-agents-oss


---
Craft Agents 为每个主要平台提供了单命令安装程序——只需在终端中粘贴一行代码，脚本就会处理从版本发现、校验和验证到安装后清理的所有事宜。这些脚本是让你从零开始到运行 Craft Agents 桌面应用程序的最快路径。

这些安装程序存放在代码仓库的 [\`scripts/\`](../scripts/) 目录中，也可通过 \`https://agents.craft.do/\` 进行分发，以便通过 \`curl | bash\` 或 \`irm | iex\` 直接执行。每个平台对应一个脚本：[\`install-app.sh\`](scripts/install-app.sh)（macOS + Linux）、[\`install-app.ps1\`](scripts/install-app.ps1)（Windows），以及一个独立的用于从源码配置无头服务器的 [\`install-server.sh\`](scripts/install-server.sh)。

## 架构概览[](#架构概览)

这三个桌面安装程序都遵循相同的四阶段流水线，仅在特定于平台的细节上有所不同，例如归档格式、安装目标和校验和工具：

Syntax error in textmermaid version 11.6.0

发布清单是唯一的真实来源。所有脚本均查询 \`https://agents.craft.do/electron/latest/<yml-file>\` 以发现最新版本、检测到的架构所对应的正确二进制文件 URL，以及相应的 SHA-512 校验和——任何地方都没有硬编码的版本。

来源：[install-app.sh](scripts/install-app.sh#L5-L6), [install-app.ps1](scripts/install-app.ps1#L7-L9)

## 快速参考[](#快速参考)

平台

命令

输出

**macOS**

\`curl -fsSL https://agents.craft.do/install-app.sh | bash\`

\`/Applications\` 中的 \`.app\`

**Linux**

\`curl -fsSL https://agents.craft.do/install-app.sh | bash\`

\`~/.local/bin/\` 中的 AppImage 及启动器

**Windows**

\`irm https://agents.craft.do/install-app.ps1 | iex\`

已安装的应用程序及 PATH 中的 \`craft-agents\`

来源：[README.md](README.md#L63-L73)

## 桌面应用程序安装程序[](#桌面应用程序安装程序)

### macOS 与 Linux — \`install-app.sh\`[](#macos-与-linux--install-appsh)

这个单一的 Bash 脚本同时服务于 macOS 和 Linux，在内部根据 \`uname -s\` 和 \`uname -m\` 的检测结果进行分支处理。除了 \`curl\` 或 \`wget\`（必须存在其中之一）外，它不需要任何外部依赖。如果可用，会使用可选的 \`yq\` 工具进行 YAML 解析，但脚本会回退到使用纯 Bash 编写的基于正则表达式的内置 YAML 解析器。

**阶段 1 — 平台检测**（[第 22–159 行](scripts/install-app.sh#L22-L159)）：

脚本会识别操作系统（\`darwin\` 或 \`linux\`）和 CPU 架构（\`x64\` 或 \`arm64\`）。Linux 目前仅限于 \`x64\`——尝试在 \`arm64\` Linux 上安装会产生明确的错误提示。每种组合都映射到特定的清单文件和归档格式：

平台

清单文件

归档格式

安装目标

macOS (x64)

\`latest-mac.yml\`

\`.zip\`

\`/Applications/Craft Agents.app\`

macOS (arm64)

\`latest-mac.yml\`

\`.zip\`

\`/Applications/Craft Agents.app\`

Linux (x64)

\`latest-linux.yml\`

\`.AppImage\`

\`~/.craft-agent/app/\` + \`~/.local/bin/craft-agents\`

**阶段 2 — 清单获取与解析**（[第 167–199 行](scripts/install-app.sh#L167-L199)）：

脚本从 \`https://agents.craft.do/electron/latest/\` 下载相应的 YAML 清单，并提取版本字符串、文件 URL 以及特定于架构的 SHA-512 校验和。如果安装了 \`yq\`，它会使用简洁的 \`yq -r\` 管道；否则，两个自定义函数（[\`get_sha512_from_yaml\`](scripts/install-app.sh#L79-L108) 和 [\`get_filename_from_yaml\`](scripts/install-app.sh#L111-L133)）将逐行解析 YAML。

**阶段 3 — 下载与验证**（[第 209–236 行](scripts/install-app.sh#L209-L236)）：

使用带有进度条的方式下载二进制文件（\`curl --progress-bar\` 或 \`wget --show-progress\`）。下载完成后，在本地计算 SHA-512 哈希值，并使用 \`xxd -r -p | base64\` 将其从十六进制转换为 base64（以匹配清单中 base64 编码的格式）。一旦发现不匹配，会立即删除文件并退出。

校验和格式为 **SHA-512 base64 编码**（88 个字符），符合 electron-builder YAML 清单标准——而不是 \`sha512sum\` 典型的十六进制输出。脚本在比较之前会执行一次十六进制到 base64 的转换。

**阶段 4 — 特定于平台的安装**：

在 **macOS** 上（[第 239–311 行](scripts/install-app.sh#L239-L311)），脚本通过 \`osascript\` 退出任何正在运行的实例，移除之前的 \`.app\`，将 ZIP 解压到临时目录，将其复制到 \`/Applications\`，移除 macOS 隔离属性（\`xattr -rd com.apple.quarantine\`），并打印启动命令。

在 **Linux** 上（[第 313–404 行](scripts/install-app.sh#L313-L404)），脚本将 AppImage 移动到 \`~/.craft-agent/app/\`，为其赋予可执行权限，并在 \`~/.local/bin/craft-agents\` 创建一个包装脚本。此包装脚本处理了 Linux AppImage 常见的两个陷阱：它会清除引用旧 \`/tmp/.mount_Craft-*\` 路径的过时 Electron 缓存条目，并使用 \`--no-sandbox\` 启动（这是必需的，因为 AppImage 解压到 \`/tmp\` 会导致 \`chrome-sandbox\` 丢失 SUID 位）。如果未检测到 FUSE，它还会发出警告。

来源：[install-app.sh](scripts/install-app.sh#L1-L405)

### Windows — \`install-app.ps1\`[](#windows--install-appps1)

PowerShell 安装程序遵循相同的架构，但使用的是 Windows 原生工具。它通过将 \`irm\`（Invoke-RestMethod）管道传输到 \`iex\`（Invoke-Expression）来调用——这是标准的 PowerShell 单行命令模式。

**关键实现细节：**

-   **架构检测**（[第 23 行](scripts/install-app.ps1#L23)）：使用 \`[Environment]::Is64BitOperatingSystem\` 选择 \`x64\` 或 \`x86\`，然后获取 \`latest.yml\`（统一的 Windows 清单）。
-   **YAML 解析**（[第 65–92 行](scripts/install-app.ps1#L65-L92)）：纯 PowerShell 函数 \`Get-YamlEntryForArch\` 使用正则表达式逐行迭代以提取 \`url\`、\`sha512\`、\`size\` 和 \`arch\` 字段——不需要类似 \`yq\` 的工具。
-   **带进度的下载**（[第 127–171 行](scripts/install-app.ps1#L127-L171)）：使用 \`System.Net.HttpWebRequest\` 进行底层控制，实现带有 \`###---\` 视觉输出的自定义进度条。失败时，会自动清理部分下载的文件。
-   **校验和验证**（[第 179–189 行](scripts/install-app.ps1#L179-L189)）：通过 \`[System.Security.Cryptography.SHA512]\` 计算 SHA-512，并使用 \`[Convert]::ToBase64String\` 转换为 base64。
-   **安装**（[第 194–223 行](scripts/install-app.ps1#L194-L223)）：停止任何正在运行的 Craft Agents 进程，通过 \`Start-Process\` 启动下载的 \`.exe\` 安装程序，并等待其完成。
-   **PATH 注册**（[第 229–251 行](scripts/install-app.ps1#L229-L251)）：在 \`%LOCALAPPDATA%\\Craft Agents\\bin\\\` 中创建 \`craft-agents.cmd\` 启动器，并将其追加到用户的 PATH 环境变量中，以便在重启后可以从任何终端使用 \`craft-agents\`。

来源：[install-app.ps1](scripts/install-app.ps1#L1-L265)

## 无头服务器配置 — \`install-server.sh\`[](#无头服务器配置--install-serversh)

与下载预编译二进制文件的桌面安装程序不同，[\`install-server.sh\`](scripts/install-server.sh) 会**从源码**构建无头服务器。它专为已克隆代码仓库并希望获得完整本地服务器环境的开发者而设计。

Syntax error in textmermaid version 11.6.0

**前提条件** —— 此脚本需要 [Bun](https://bun.sh/) ≥ 1.0，并且必须从仓库根目录运行（它会在[第 45 行](scripts/install-server.sh#L45-L48)验证 \`packages/server/package.json\` 是否存在）。

**它的作用**（[第 54–106 行](scripts/install-server.sh#L54-L106)）：

1.  通过 \`bun install --frozen-lockfile\` 安装所有 monorepo 依赖项（回退到非冻结安装）
2.  构建子进程服务器（\`session-mcp-server\` 和 \`pi-agent-server\`）以及 Web UI
3.  通过 \`--generate-token\` 生成加密的服务器令牌
4.  打印三种配置下即可使用的启动命令：

模式

关键环境变量

用例

**基础**

\`CRAFT_SERVER_TOKEN\`, \`CRAFT_WEBUI_DIR\`, \`CRAFT_BUNDLED_ASSETS_ROOT\`

带 Web UI 的本地开发

**自定义主机/端口**

\\+ \`CRAFT_RPC_HOST\`, \`CRAFT_RPC_PORT\`

可通过网络访问的服务器

**TLS**

\\+ \`CRAFT_RPC_TLS_CERT\`, \`CRAFT_RPC_TLS_KEY\`

生产环境 / 远程访问

生成的令牌仅打印一次且**无法恢复**。脚本会明确警告：_"保存你的令牌——它无法被恢复。"_ 你也可以随时使用 \`openssl rand -hex 32\` 生成一个新令牌。

来源：[install-server.sh](scripts/install-server.sh#L1-L107)

## 相关脚本[](#相关脚本)

\`scripts/\` 目录中包含作为安装程序补充的其他实用工具：

脚本

用途

相关性

[\`generate-dev-cert.sh\`](scripts/generate-dev-cert.sh)

创建自签名 TLS 证书（EC P-256，有效期 365 天）

为本地服务器开发启用 \`wss://\`

[\`docker-smoke-test.sh\`](scripts/docker-smoke-test.sh)

启动 Docker 容器，等待就绪，运行 \`--validate-server\`

端到端验证基于 Docker 构建的服务器镜像

若要在不克隆源码的情况下部署服务器，请参阅 [\`Dockerfile.server\`](Dockerfile.server#L1-L94) 中记录的 Docker 方案，该方案会构建一个多平台镜像，其中预捆绑了 Web UI 资源和 MCP 子进程服务器。

## 各平台安装路径[](#各平台安装路径)

运行单行安装程序后，文件在各平台上的落地位置如下：

Copy code

\`\`\`
macOS
├── /Applications/Craft Agents.app        ← 主应用程序包
└── ~/.craft-agent/downloads/              ← 临时文件（已清理）

Linux
├── ~/.craft-agent/app/Craft-Agents-x64.AppImage   ← 主二进制文件
├── ~/.local/bin/craft-agents                        ← 启动器包装脚本
└── ~/.config/@craft-agent/                          ← Electron 缓存（自动清理）

Windows
├── %LOCALAPPDATA%\\Programs\\Craft Agents\\    ← 已安装的应用程序
├── %LOCALAPPDATA%\\Craft Agents\\bin\\         ← craft-agents.cmd 启动器
└── %TEMP%\\craft-agent-install\\              ← 临时文件（已清理）
\`\`\`

来源：[install-app.sh](scripts/install-app.sh#L143-L158), [install-app.sh](scripts/install-app.sh#L317-L320), [install-app.ps1](scripts/install-app.ps1#L8-L9), [install-app.ps1](scripts/install-app.ps1#L232-L234)

## 故障排除[](#故障排除)

症状

可能原因

解决方案

Linux ARM 上出现 \`Unsupported architecture\`

Linux 仅提供 \`x64\` AppImage

使用 Docker 或从源码构建

\`Checksum verification failed\`

下载损坏或中间人攻击

重新运行脚本；检查网络

\`FUSE required but not detected\` (Linux)

缺少 \`libfuse2\`

\`sudo apt install fuse libfuse2\`

安装后找不到 \`craft-agents\` (Linux)

\`~/.local/bin\` 未在 PATH 中

将 \`export PATH="$HOME/.local/bin:$PATH"\` 添加到 \`~/.bashrc\`

安装后找不到 \`craft-agents\` (Windows)

PATH 未刷新

重启你的终端会话

应用在 macOS 上无法打开

隔离标志

重新运行安装程序（它会移除隔离标志）或执行 \`xattr -rd com.apple.quarantine /Applications/Craft\\ Agents.app\`

来源：[install-app.sh](scripts/install-app.sh#L150-L153), [install-app.sh](scripts/install-app.sh#L299-L300), [install-app.sh](scripts/install-app.sh#L398-L403), [install-app.sh](scripts/install-app.sh#L393-L396), [install-app.ps1](scripts/install-app.ps1#L247-L248)

## 后续步骤[](#后续步骤)

一旦安装好桌面应用程序，请前往 [快速入门](/lukilabs/craft-agents-oss/2-quick-start) 查看首次启动指南（API 连接设置、工作区创建以及发送你的第一条消息）。如果你想了解所有可用的安装方法——包括 Docker、源码构建和 CLI——请参阅 [安装方法](/lukilabs/craft-agents-oss/3-installation-methods) 。若要了解为桌面客户端提供支持的服务端架构，请深入阅读 [无头远程服务器](/lukilabs/craft-agents-oss/22-headless-remote-server) 。`;export{n as default};
