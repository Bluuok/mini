# Craft Agents 项目使用指南（付费版）

## 一句话定位

Craft Agents 可以被包装成一个“高阶 Agent 架构与多端工程化平台项目”：它不是只会调模型，而是围绕 Agent 执行、权限、安全、会话、工具、协议、多端客户端和工程验证建立了一套完整系统。

## 推荐使用顺序

### 第一步：先确定目标岗位

不同岗位不要选同一套点：

- AI / Agent 架构：优先 `R03 R04 R06 R10 R11`
- 后端 / 平台工程：优先 `R08 R12 R18 R20 R21`
- 桌面应用 / 全栈：优先 `R14 R15 R16 R812 R23`
- MCP / 工具生态：优先 `R17 R18 R19 R06 R20`
- 基础保守：优先 `R01 R02 R08 R12 R24`

### 第二步：只选 4-5 个 R 点

Craft Agents 的技术点很多，但简历不是目录。建议只写 4-5 个点：

- 1 个架构总览点：说明你理解系统边界。
- 1-2 个 Agent Core 点：说明你理解 Agent 执行机制。
- 1 个工程化点：说明你不是只会写 demo。
- 1 个你最能深挖的高阶点：用来应对追问。

### 第三步：用 Q&A 反向筛选

每选一个 `Rxx`，去 `03-CraftAgents项目面试Q&A-付费版.md` 找对应 `Qxx.x`。

如果你无法回答：

- 这个点解决什么问题？
- Craft Agents 里怎么实现？
- 为什么不直接写一个更简单的版本？
- 这个设计有什么局限？

那这个点暂时不要写，或者降级成更保守的表达。

### 第四步：套用组合方案

先从 `04-CraftAgents简历组合方案-付费版.md` 选一个方案，再替换其中 1 个不熟悉的点。

不建议自己随意混搭 8-10 个点，因为这会让面试官追问范围变大。

### 第五步：生成自己的简历版本

推荐结构：

```
Craft Agents — 高阶 Agent 架构与多端执行平台
技术栈：TypeScript、Bun、Electron、React、Vite、WebSocket、MCP、OAuth、JSONL、Monorepo

- [Rxx] ...
- [Rxx] ...
- [Rxx] ...
- [Rxx] ...
```

## 简历 bullet 写法

推荐写法：

```
围绕 AgentBackend 抽象设计多模型后端适配层，将 ClaudeAgent、PiAgent 等后端统一为 provider-agnostic 的流式 AgentEvent，降低 UI 与模型提供商的耦合。
```

不推荐写法：

```
实现了最强 Agent 平台，支持所有模型和所有工具。
```

好的 bullet 要满足：

- 有具体工程对象。
- 有设计动作。
- 有解决的问题。
- 不编造不可证明结果。
- 面试时能讲实现和取舍。

## 风险分级

- 低风险：架构拆分、会话隔离、协议层、测试验证。
- 中风险：AgentBackend、多后端、系统提示词、Session Tools。
- 高风险：Permission / PreToolUse、MCP ServerBuilder、OAuth Token Refresh、Pi Agent Server、Messaging Gateway。

高风险点不是不能写，但必须能讲清楚源码层设计。

## Agent Skill 使用方式

如果使用 `craft-agents-resume-skill`，建议这样问：

```
请使用 Craft Agents Resume Skill，根据我的背景生成一版高阶 Agent 架构项目经历。

我的背景：
- 目标岗位：AI Agent 架构 / 后端工程
- 技术栈：TypeScript、React、Node/Bun
- 熟悉：后端接口、状态管理、工程化
- 不熟：OAuth 和 MCP 协议细节

要求：
1. 只选 4-5 个 R 点
2. 每条 bullet 标注 Rxx
3. 给出对应 Qxx 面试题
4. 标注高风险点和降级建议
```

深挖某个点时：

```
请基于 Craft Agents CodeWiki 深挖 R06 Permission Mode 与 PreToolUse 安全管线，要求解释实现路径、面试追问、误区和降级说法。
```
