const n=`# 概述 | lukilabs/craft-agents-oss


---
**Craft Agents** 是一个开源的、以 Agent 为核心的桌面应用程序，它为与强大的 AI Agent 交互提供了图形界面——主要包括 Claude，同时也支持 Google AI Studio、ChatGPT Plus (Codex) 以及 GitHub Copilot。该项目由 craft.do 团队打造，通过用流畅的、以文档为中心的 UI（具备会话管理、来源集成、技能系统和自动化功能）取代传统的以 CLI 为中心的工作流，重新定义了开发者使用 AI 的方式。整个项目基于 Apache 2.0 许可证开源，并且顺理成章的是，该团队正是使用 Craft Agents 本身来构建 Craft Agents 的。

![Craft Agents 桌面 UI](images/img_001.jpg)

## Craft Agents 的功能[](#craft-agents-的功能)

其核心在于，Craft Agents 为 AI 对话提供了一个**多会话收件箱**。与单一的聊天窗口不同，它将每次交互视为一个可管理的单元，具备工作流状态（待办 → 进行中 → 待审查 → 已完成）、标记、归档和持久化历史记录等功能。每个会话运行在一个**工作区**内，该工作区作为项目容器，包含独立的来源、技能、凭证和配置。

该平台支持**同时接入多个 LLM 提供商**：Anthropic (Claude)、Google AI Studio、OpenAI (ChatGPT Plus / Codex) 以及 GitHub Copilot。你可以添加多个连接并为每个工作区设置默认选项，无需离开应用即可在不同提供商之间切换。

**来源**功能允许你连接外部服务——MCP 服务器、REST API（Gmail、Slack、Linear、Notion、Microsoft Graph）以及本地文件系统——从而使 Agent 能够与真实数据交互。添加来源通常只需简单地向 Agent 发送指令“将 Linear 添加为来源”。Agent 会自动发现 API、阅读文档、处理凭证并完成所有配置。

来源：[README.md](README.md#L1-L30)、[packages/shared/CLAUDE.md](packages/shared/CLAUDE.md#L1-L15)

## 架构概览[](#架构概览)

Craft Agents 是一个 **Bun monorepo**，分为两个主要层级：包含所有业务逻辑、类型和服务器基础设施的共享包（\`packages/\`），以及提供桌面、无头和 Web 界面的应用程序入口（\`apps/\`）。UI 与 Agent 后端之间的通信通过 WebSocket RPC 传输层进行，这使得将桌面端作为连接远程无头服务器的瘦客户端运行成为可能。

Syntax error in textmermaid version 11.6.0

来源：[package.json](package.json#L1-L50)、[packages/core/CLAUDE.md](packages/core/CLAUDE.md#L1-L15)、[packages/server-core/README.md](packages/server-core/README.md#L1-L19)

## 项目结构[](#项目结构)

该 monorepo 在可复用库与可运行应用之间遵循清晰的分离原则。以下是结构映射：

Copy code

\`\`\`
craft-agents-oss/
├── apps/
│   ├── electron/          ← 主桌面应用 (Electron 主进程 + 预加载 + 渲染进程)
│   ├── cli/               ← 命令行界面
│   ├── viewer/            ← 公开会话查看器 (通过 URL 共享会话)
│   └── webui/             ← 基于浏览器的 UI，用于无头服务器模式
├── packages/
│   ├── core/              ← 共享 TypeScript 类型 (Workspace, Session, Message, AgentEvent)
│   ├── shared/            ← 核心业务逻辑：Agent、来源、会话、凭证、i18n
│   ├── server-core/       ← WS RPC 传输层、SessionManager、平台抽象
│   ├── server/            ← 无头服务器入口 (引导 + CLI)
│   ├── session-tools-core/← 会话作用域内的 MCP 工具定义与处理器
│   ├── session-mcp-server/← 用于会话工具的 MCP 桥接子进程
│   ├── pi-agent-server/   ← Pi SDK 子进程 (stdin/stdout 协议)
│   └── ui/                ← 共享 React UI 组件库
├── scripts/               ← 构建、安装和部署脚本
└── docs/                  ← 附加文档
\`\`\`

来源：[package.json](package.json#L1-L10)、[packages/core/README.md](packages/core/README.md#L1-L20)

## 核心包详解[](#核心包详解)

### \`@craft-agent/core\` — 类型基础[](#craft-agentcore--类型基础)

该技术栈中最轻量的包。它导出了纯 TypeScript 类型，如 \`Workspace\`、\`Session\`、\`Message\`、\`AgentEvent\`、\`TokenUsage\`，以及一小部分工具函数，如 \`generateMessageId()\` 和 \`debug()\`。所有其他包都依赖这些类型以保持一致性，团队将此处的更改视为高影响操作——在任何类型修改后，都必须对下游包进行验证。

来源：[packages/core/CLAUDE.md](packages/core/CLAUDE.md#L1-L15)、[packages/core/src/index.ts](packages/core/src/index.ts#L11-L15)

### \`@craft-agent/shared\` — 业务逻辑核心[](#craft-agentshared--业务逻辑核心)

这是最大且最重要的包。它包含了 Agent 后端系统（Claude SDK 集成、Pi SDK 子进程协议、基础 Agent 抽象）、来源管理（MCP 服务器、REST API、本地文件系统）、凭证加密、会话持久化、权限模式、技能管理、自动化引擎、i18n 支持以及完整的配置系统。Agent 的层级结构通过 \`BaseAgent\` 抽象类传递，该类提供了共享基础设施（权限管理、来源追踪、提示词构建、技能解析、标题生成），而具体的子类（\`ClaudeAgent\`、\`PiAgent\` 等）则实现了特定于提供商的逻辑。

来源：[packages/shared/CLAUDE.md](packages/shared/CLAUDE.md#L1-L28)、[packages/shared/src/agent/index.ts](packages/shared/src/agent/index.ts#L1-L166)、[packages/shared/src/agent/base-agent.ts](packages/shared/src/agent/base-agent.ts#L160-L270)

### \`@craft-agent/server-core\` — 无头服务器基础设施[](#craft-agentserver-core--无头服务器基础设施)

从 Electron 主进程中剥离而出，以支持无头运行模式。它提供了 WebSocket RPC 传输层（\`codec\`、\`server\`、\`capabilities\`）、负责编排 Agent 生命周期的 \`SessionManager\` 类、将所有内容连接在一起的 \`bootstrapServer()\` 函数，以及 \`PlatformServices\` 抽象层——该抽象层允许相同的服务器代码在 Electron（具备原生对话框、文件访问、Shell）或 Node.js/Bun（具备无头桩实现）中运行。这正是实现瘦客户端架构的关键所在。

来源：[packages/server-core/README.md](packages/server-core/README.md#L1-L19)、[packages/server/src/index.ts](packages/server/src/index.ts#L148-L167)

### \`pi-agent-server\` — Pi SDK 子进程[](#pi-agent-server--pi-sdk-子进程)

一个独立的 Bun 进程，通过 stdin/stdout JSON 消息与主应用程序通信。它封装了 \`@mariozechner/pi-coding-agent\` SDK，负责管理 Pi Agent 会话、工具执行、权限审批流和模型切换。该协议支持 \`init\`、\`prompt\`、\`register_tools\`、\`tool_execute_response\`、\`pre_tool_use_response\`、\`abort\`、\`compact\` 和 \`shutdown\` 等消息。这种子进程架构将 Pi SDK 运行时与主进程隔离开来。

来源：[packages/pi-agent-server/src/index.ts](packages/pi-agent-server/src/index.ts#L74-L178)

## 部署模式[](#部署模式)

Craft Agents 支持三种不同的运行时配置：

模式

运行方式

使用场景

**桌面端**

带有嵌入式 WS 服务器的完整 Electron 应用

主要的本地开发工作流

**无头服务器**

在远程 VPS 上运行 \`bun run packages/server/src/index.ts\`

在高性能服务器上运行会话，从任何机器进行访问

**瘦客户端**

通过 \`CRAFT_SERVER_URL\` 连接到远程服务器的 Electron 应用

多台机器访问同一个无头实例

在瘦客户端模式下，桌面端会渲染完整的 UI，但所有的会话逻辑、工具执行和 LLM 调用都在远程服务器上进行——本地的 Electron 实例纯粹是一个渲染外壳。

来源：[packages/server/src/index.ts](packages/server/src/index.ts#L148-L167)、[apps/electron/src/main/index.ts](apps/electron/src/main/index.ts#L431-L440)

## 功能概览[](#功能概览)

类别

功能

**会话**

多会话收件箱、状态工作流（待办 → 已完成）、标记、归档、AI 生成标题、完整历史记录持久化、会话分支

**提供商**

Anthropic Claude、Google AI Studio、ChatGPT Plus (Codex OAuth)、GitHub Copilot OAuth、OpenAI API 密钥

**来源**

MCP 服务器、REST API (Google、Slack、Microsoft)、本地文件系统、Obsidian 知识库、Git 仓库

**技能**

每个工作区的 Agent 指令、\`@skill\` 提及语法、Claude Code 技能导入

**权限**

三种模式——探索（只读）、编辑需询问（提示词审批）、自动（完全自主）——支持按工作区/来源自定义规则

**自动化**

事件驱动的触发器——在标签更改、定时计划、工具使用等情况下创建会话

**后台任务**

带有进度跟踪的长时间运行操作

**多文件对比**

类似 VS Code 的对比窗口，用于审查一轮对话中的所有文件更改

**文件附件**

拖放图片、PDF、Office 文档，支持自动转换

**主题**

应用层和工作区层的级联主题

**i18n**

英语、西班牙语、简体中文——具备完整的语言环境注册表

来源：[README.md](README.md#L86-L128)

## 技术栈[](#技术栈)

层级

技术

**运行时**

Bun、Electron 39、Node.js (无头模式)

**AI SDK**

\`@anthropic-ai/claude-agent-sdk\`、\`@mariozechner/pi-coding-agent\`、\`@github/copilot-sdk\`

**协议**

MCP (\`@modelcontextprotocol/sdk\`)

**前端**

React 18、Vite 6、Tailwind CSS 4、Radix UI、TipTap (富文本)

**传输层**

WebSocket RPC (自定义编解码器)

**状态管理**

Jotai (渲染器原子状态)

**构建工具**

esbuild、electron-builder

**编程语言**

TypeScript 5、严格模式

**测试**

Bun 测试运行器

来源：[package.json](package.json#L90-L204)

## 推荐阅读路径[](#推荐阅读路径)

本文档的结构旨在引导你从表面理解深入到具体的实现细节。以下是建议的进阶路径：

1.  **[概述](/lukilabs/craft-agents-oss/1-overview)** ← 你在这里。高层架构与项目映射。
2.  **[快速开始](/lukilabs/craft-agents-oss/2-quick-start)** — 在五分钟内运行应用。
3.  **[安装方式](/lukilabs/craft-agents-oss/3-installation-methods)** — 一键安装、从源码构建或使用 Docker。
4.  **[Monorepo 架构](/lukilabs/craft-agents-oss/8-monorepo-architecture)** — 深入了解包依赖图和工作区约定。
5.  在此之后，探索与你兴趣相符的**深度解析**部分——Agent 后端系统、核心基础设施、桌面应用、数据模型，或部署与扩展。

要理解完整的 Agent 系统，**最重要的文件**是 [\`packages/shared/src/agent/base-agent.ts\`](packages/shared/src/agent/base-agent.ts#L160-L270)。这个抽象类定义了所有 Agent 后端（Claude、Pi、Codex、Copilot）的共享契约——包括权限管理、来源追踪、提示词构建、技能解析、会话恢复以及模板方法 \`chat()\` 入口点。每个具体的 Agent 都继承自该基类。

**会话生命周期**区分了**硬中止**（通过 \`UserStop\` 或重定向回退实现的真正取消/拆除）与 **UI 交接中断**（控制权转移到 UI 的暂停点，如 \`AuthRequest\` 或 \`PlanSubmitted\`）。在处理会话状态时，这一区别至关重要——请参阅 [\`packages/shared/CLAUDE.md\`](packages/shared/CLAUDE.md#L40-L44) 获取权威解释。`;export{n as default};
