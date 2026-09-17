# 源码驱动的面试 QA

本规范只用于面试预测、技术深挖和对抗审查。普通预测先读题库和索引；用户要求深入解释某道 QA 或源码级追问时，再从 `references/craft-agents-oss-main.zip` 按 `assets/source-manifest.json` 和 `codewiki-index.md` 定位相关源码。源码 ZIP 是可核验的数据资产，不要整体读入上下文。

## 生成前置条件

1. 解析项目、场景、目标岗位和选中的简历 Bullet。
2. 为每条 Bullet 找到一个主 Claim，并把 Claim 映射到 Agent Architecture 的 Layer。
3. 读取 `codewiki-index.md` 找到相关 W 页，再用源码包核验至少一个实现文件和一个测试/契约文件；没有测试时明确记录“实现证据”而不是测试背书。
4. 场景化问题只能改变业务问题、Failure Mode、Domain Artifact 和追问角度，不得把场景设计写成基座已实现代码。

## 单题数据契约

每道预测题内部都要保存以下字段：

```yaml
question_id: qa-craft-<slug>
question: 面试官会怎么问
why_asked: 它在验证哪条能力或哪条 Bullet
claim_id: claim-...
agent_layer: Knowledge | Harness | Runtime | Memory | Eval | Workflow
answer: 一段可以直接口述的连贯回答
source_anchors:
  - path: packages/shared/src/agent/core/pre-tool-use.ts
    symbol: <函数/类/关键常量>
    role: implementation | test | contract | documentation
evidence_level: source_implemented | source_plus_test | documentation_only | scenario_design
followups:
  - architecture
  - implementation
  - tradeoff
  - failure_or_rollback
  - ownership
boundary: 不能声称的内容
fallback: 讲不深时的诚实降级路径
```

## 回答写法

回答不显示 S/T/A/R 标签，也不拆成四段；用一段自然语言完成“问题背景 → 任务目标 → 具体动作 → 技术取舍 → 结果/验证 → 局限”。结果必须来自源码、测试、用户材料或可观察 Artifact；没有指标时用可验证状态、契约或测试结果，不补造数字。

技术名词不能单独罗列。每个技术名词后面必须回答：它解决了什么故障、在哪个文件/符号落地、为什么不选更简单的方案。

## 追问生成规则

每道核心题至少生成 5 类追问：

- 架构：为什么放在这一层？边界在哪里？
- 实现：入口、数据结构、状态变化、错误分支是什么？
- 取舍：为什么不用单一 Backend、Prompt 约束或无状态工具注册？
- 失败：崩溃、重复、超时、权限拒绝或协议漂移时如何处理？
- Ownership：你亲自改了什么？能打开哪段代码、测试或 Trace？

场景题还要增加 Domain Failure Mode 追问，但不能凭空生成行业连接器的实现证据。

## 源码核验顺序

```text
source-manifest
→ CodeWiki topic map
→ 目标源码文件
→ 相关测试/契约
→ Claim / Bullet / QA 三方一致性
```

如果源码包不可读、哈希不匹配、路径不存在或只能从 Wiki 推断，题目降级为“源码分析题/设计题”，不得写成“项目已实现”。

## QA 通过标准

一套 QA 只有同时满足以下条件才算可交付：

- 每条核心 Bullet 至少有 1 道主问题和 2 道深挖问题；
- 每道主问题至少有 1 个实现源码锚点，核心结论最好还有测试/契约锚点；
- 回答能自然讲清问题、动作、取舍和结果，不靠技术栈清单撑长度；
- 至少覆盖 Agent Harness、Runtime/Memory、Eval 或 Workflow 中与项目实际相关的能力；
- 不能把场景扩展、文档推断、项目能力或公开源码能力冒充个人 Ownership；
- 任意追问下都能给出代码路径、符号、测试或诚实的降级答案。

## 对抗式审查问题

生成后逐题攻击：

1. 这道题的回答是否只是复述简历？如果是，补充实现细节或删除。
2. 删除所有技术名词后，是否仍然有明确的问题、动作和结果？如果没有，说明是术语堆砌。
3. 追问“哪一个文件、哪个函数、哪条测试”时，路径是否真的存在？
4. 追问“这是你写的还是项目已有”时，回答是否越过 Ownership 证据？
5. 追问“如果失败/重复/超时怎么办”时，是否只说原则，没有状态转移或错误分支？
6. 把场景名称替换掉后，题目是否仍完全成立？如果完全成立，说明场景没有新增问题；如果不成立，检查是否只是换皮。
7. 是否出现源码没有支持的精确数字、上线结果、业务收益或生产事故？出现即删除或降级。
