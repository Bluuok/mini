const n=`Miniclaw 的每个 Workspace（会话工作区）都可以选择两种截然不同的 Agent 执行方式：**Container 模式**将 Pi Agent Runner 放进一次性 Docker 容器中运行，以资源隔离换取可预算的容量池；**Host 模式**则直接在宿主机上以子进程运行同一个 agent-runner，换取零冷启动开销与宿主机原生工具链。本页剖析这两种模式的裁决机制、各自的启动路径、容量准入模型的差异、三层超时体系，以及让交互体验接近"常驻"的暖 Runner 生命周期与卡死恢复策略。

Sources: [types.ts](src/types.ts#L31-L37)

## 一、双模式总览：一次消息触发的裁决链

从一条用户消息到 Runner 真正被拉起，执行模式要经过三层裁决：Workspace 行存储中的 \`execution_mode\` 决定"默认走向"；\`GroupQueue.hasCapacityFor\` 决定"现在能不能跑"；而 Host 模式在 spawn 前的最后一刻还要通过一次**活体权限门**复检。整个决策链如下图所示：

\`\`\`mermaid
flowchart TD
    A[入站消息 / 定时任务] --> B{execution_mode?}
    B -->|默认 container| C[GroupQueue.hasCapacityFor]
    B -->|host| D[canExecuteOnHost 活体权限门]
    D -->|owner 非 active admin| E[返回 HOST_EXECUTION_FORBIDDEN_ERROR]
    D -->|通过| F[hasCapacityFor: host 直接放行]
    C -->|activeContainerCount < max 且用户限额允许| G[docker run 一次性容器]
    C -->|无容量| H[进入 waitingGroups 排队]
    F --> I[spawn node dist/pi-index.js 子进程]
\`\`\`

模式本身是 Workspace 的持久属性，存储在 \`registered_groups.execution_mode\` 列中；解析时任何非法值都会**失败关闭**回退到 \`container\`，保证未知数据不会意外逃逸出隔离边界。

Sources: [index.ts](src/index.ts#L9572-L9611), [db.ts](src/db.ts#L9317-L9326)

## 二、Host 权限是"活体特权"，不是持久授权

Host 执行被建模为一个需要持续验证的特权，而非 Workspace 创建时一次性继承的属性。\`canExecuteOnHost\` 要求 owner 在**执行时刻**同时满足三个条件：角色为 \`admin\`、状态为 \`active\`、且不在撤销中的用户集合内。这意味着管理员被降级或停用的瞬间，其名下的 Host 工作区立即失去执行资格——即使数据库里的行仍然写着 \`host\`。

在真正的 spawn 点之前，主流程会从数据库**重新读取** owner 记录并复检这个谓词。代码注释明确指出："持久化的 host 工作区不是授权授予"。此外系统还提供 \`adminHostOnlyMode\` 全局开关：开启后所有 active admin 拥有的工作区强制走 host，普通成员保持 container 隔离，且此时禁止创建 Docker 工作区（返回 409）。

Sources: [host-execution-policy.ts](src/host-execution-policy.ts#L12-L30), [routes/groups.ts](src/routes/groups.ts#L580-L600)

## 三、Container 执行路径：docker run 的完整生命周期

Container 模式下每次 turn 都由 \`runContainerAgent\` 发起一次全新的 \`docker run -i --rm\` 调用。容器名形如 \`miniclaw-{folder}[-{agentId}]-{时间戳}\`，保证并发实例互不冲突。\`buildContainerArgs\` 注入时区与宿主机身份探测结果，再拼接全部卷挂载。

一个关键设计是**宿主机身份探测**（\`resolveContainerHostIdentity\`）：它把 daemon 环境分为六种模式（direct / rootless / userns / virtualized / host-root / unknown），只有 rootful Linux 且未开启 userns 映射时才把宿主 UID/GID 直传容器用于文件属主对齐；macOS/Windows（Docker Desktop 虚拟化）、rootless、userns 一律走 entrypoint 内的权限调和器兜底，探测失败则 fail-closed。这个探测**每次启动都重新执行**而不缓存，因为 Docker context 与 daemon 安全选项可能在进程存活期间变化。

镜像本体基于 \`node:24-slim\`，预装浏览器、编译链、Python、数据库客户端等完整工具链；entrypoint 以 root 启动修复卷权限后，通过 \`runuser -u node\` 降权到非 root 用户执行 runner。

Sources: [container-runner.ts](src/container-runner.ts#L1615-L1647), [container-runner.ts](src/container-runner.ts#L1514-L1575), [Dockerfile](container/Dockerfile#L200-L262), [entrypoint.sh](container/entrypoint.sh#L160-L163)

## 四、Host 执行路径：进程模型与三重预检

Host 模式的 \`runHostAgent\` 不经过 Docker，而是直接解析宿主机 node 二进制后 spawn \`agent-runner/dist/pi-index.js\`，以 Workspace 目录为 cwd、\`detached: true\` 建立独立进程组。启动前有三道防线：

第一道是**工作目录校验**：自定义 cwd 必须是绝对路径，符号链接会被 \`realpathSync\` 解析以防 TOCTOU 攻击；随后用挂载白名单做运行时二次复核——即使 Web 层在校验后被收紧或 DB 行被注入非法路径，这里仍会拒绝。第二道是**依赖预检**：检查 agent-runner 的 node_modules 关键依赖与 dist 产物是否存在，缺失时直接返回带修复命令指引的错误。第三道是**自动重编译**：若 src 目录新于 dist，则自动执行构建，失败时降级使用旧版产物而不阻塞执行。

值得注意的是，Host 模式没有"容器名"概念——注册进程回调里 \`containerName\` 传 \`null\`，后续停止操作据此走 \`process.kill()\` 进程树路径而非 \`docker stop\`。

Sources: [container-runner.ts](src/container-runner.ts#L2273-L2340), [container-runner.ts](src/container-runner.ts#L2672-L2745), [container-runner.ts](src/container-runner.ts#L2760-L2777)

## 五、容量准入：同一队列下的两套资源模型

\`GroupQueue.hasCapacityFor\` 是容量准入的唯一咽喉，但它对两种模式采用了完全相反的策略：

| 维度 | Container 模式 | Host 模式 |
|------|---------------|-----------|
| 准入判据 | \`activeContainerCount < maxConcurrentContainers\` **且** 用户级计费限额通过 | 序列化 key 是唯一边界，无条件放行 |
| 设计理由 | 每个 turn 消耗一份受管 Docker 分配，需显式资源/计费预算 | 镜像 Claude Agent SDK 的自然进程模型，由操作系统管辖 |
| 无容量后果 | 进入 \`waitingGroups\`，槽位释放后由 drainWaiting 补跑 | 不会发生 |
| 典型风险 | 暖闲置会话占满全局槽位，阻塞无关渠道 | 无应用层池，理论上进程数仅受 OS 限制 |

Host 模式放弃全局计数的原因写在注释里：如果对 host 也套用全局限额，一个暖闲置的会话就能凭空阻塞其他飞书话题长达 IDLE_TIMEOUT。序列化 key（基于 folder）已足够保证同会话串行。Container 侧则叠加了第二维检查——用户级并发容器限额，用于计费场景下的公平性控制。

监控 API 对外暴露这两套计数：普通用户只能看到 \`activeContainers\`，admin 额外可见 \`activeHostProcessCount\` 与总活跃数。

Sources: [group-queue.ts](src/group-queue.ts#L873-L897), [runtime-config.ts](src/runtime-config.ts#L3963-L3970), [routes/monitor.ts](src/routes/monitor.ts#L329-L343)

## 六、三层超时体系：idleClose 与 watchdog 的严格时序

Runner 存活期由两个派生自同一组输入的超时值共同约束，定义在独立的 \`runner-liveness.ts\` 中：

- **idleCloseMs = min(executionTimeoutMs, idleTimeoutMs)** —— 暖 Runner 在最后一次输出后的保留时长，到期后宿主向 IPC 输入目录写入 \`_close\` 哨兵优雅收尾；
- **watchdogMs = max(executionTimeoutMs, idleCloseMs) + shutdownGraceMs(15s)** —— 外层进程/容器看门狗，在最后一次 stdout 活动后计时，触发即强杀。

这个"优雅回收必须严格先于看门狗"的不变式来自一次真实事故：历史上两个默认值都是 30 分钟，但宿主投影输出的时机导致 idle 计时器重置晚于 watchdog 重置，watchdog 确定性地赢得竞争，给健康的会话打出虚假超时。现在的公式从数学上排除了这种竞态。

\`\`\`mermaid
sequenceDiagram
    participant R as Runner 进程/容器
    participant H as 宿主 (index.ts)
    Note over R: 输出流持续 → 两个计时器不断重置
    R->>H: 最后一次输出
    Note over H: idleTimer 启动 (idleCloseMs)
    alt 闲置到期
        H->>R: 写 _close 哨兵 (优雅退出)
    else watchdog 先触发 (异常)
        H->>R: docker stop / killProcessTree
    end
    Note over H: watchdog = max(execTimeout, idleCloseMs) + 15s<br/>恒晚于 idleClose 触发
\`\`\`

两个超时值的来源有三级优先级：Workspace 级 \`containerConfig.timeout\`（正数校验）覆盖系统级 \`containerTimeout\`（默认 30 分钟，钳位区间 1 分钟–24 小时）；\`idleTimeout\` 仅系统级配置。环境变量 \`CONTAINER_TIMEOUT\` / \`IDLE_TIMEOUT\` 可作为文件配置之前的回退。看门狗的具体杀伤动作因模式而异：Container 用 \`docker stop\`（15 秒宽限）失败后升级 SIGKILL；Host 用 \`killProcessTree\` SIGTERM 后 5 秒升级 SIGKILL。

Sources: [runner-liveness.ts](src/runner-liveness.ts#L1-L35), [container-runner.ts](src/container-runner.ts#L1885-L1926), [container-runner.ts](src/container-runner.ts#L2806-L2830), [mount-security.ts](src/mount-security.ts#L356-L384), [runtime-config.ts](src/runtime-config.ts#L4090-L4114)

## 七、暖 Runner 生命周期：IPC 注入、身份护栏与闲置回收

传统模型里每条消息都要付出一次容器/进程冷启动。Miniclaw 的做法是：最终回复送达后调用 \`markRunnerQueryIdle\` 把 \`queryInFlight\` 翻为 false，但**不关闭 Runner**——它继续作为"暖进程"驻留，直到闲置超时才回收。下一条消息到达时，\`sendMessage\` 检测到活跃 Runner 后直接把 JSON 文件写入其 IPC 输入目录（临时文件 + 发布协议），返回 \`'sent'\`，完全跳过冷启动。

\`\`\`mermaid
sequenceDiagram
    participant U as 用户消息
    participant Q as GroupQueue
    participant W as 暖 Runner
    U->>Q: follow-up 消息
    Q->>Q: 身份护栏检查
    alt Bot 身份不匹配
        Q->>W: 写 _drain 哨兵排水
        Q-->>U: 'no_active' → 冷启动携带新凭证
    else 匹配 / Host 模式豁免
        Q->>W: 写 input/*.json (IPC 注入)
        Q-->>U: 'sent'
        W->>W: waitForIpcMessage 合并为一个 prompt
    end
    Note over Q,W: markRunnerActivity 刷新 lastActivityAt<br/>闲置计时器到期 → _close 哨兵回收
\`\`\`

这条快路上有两道关键护栏。**身份护栏**：容器的 Bot 凭证是不可变的进程环境变量，绝不允许把 Bot B 的 turn 注入用 Bot A 凭证启动的暖容器——检测到不匹配就写 \`_drain\` 排水哨兵并返回 \`no_active\`，让常规冷启动路径拉起携带正确凭证的新容器（Host 模式豁免，因为 feishu-cli 由宿主原生配置管辖）。**任务隔离护栏**：定时任务 Runner 不接收用户消息注入，防止回复丢失；唯一的例外是 \`#agent:\` 会话虚拟 JID——它们本身就是用户消息处理器，拦截反而会造成死锁。

Runner 正常退出后，\`cleanupIpcSentinels\` 清除残留的 \`_drain/_close/_interrupt\` 哨兵，避免下一个 Runner 一启动就看到陈旧信号提前自杀；\`recoverUnconsumedIpc\` 则兜住"消息刚写入进程就退出"的竞态（issue #240），把未被消费的消息重新点亮为 pendingMessages。回归测试明确锁定了这些语义：暖 Runner 在最终回复后必须仍是合法的下一跳目标、悬挂的工具调用不会搁浅进程、spawn 式子 Agent 保持一次性语义不受影响。

Sources: [group-queue.ts](src/group-queue.ts#L1543-L1626), [group-queue.ts](src/group-queue.ts#L1093-L1117), [group-queue.ts](src/group-queue.ts#L1769-L1815), [conversation-agent-warm-lifecycle.test.ts](tests/conversation-agent-warm-lifecycle.test.ts#L56-L160)

## 八、卡死恢复：CPU 探针与绝对债务时钟

暖 Runner 引入了新风险：注入消息后如果 Runner 静默挂死，既没有输出也没有退出，闲置计时器可能永远得不到重置机会。消息循环每轮轮询（POLL_INTERVAL = 2 秒）计数，每 15 轮（约 30 秒）扫描一次卡死候选：闲置超过 3 分钟（\`STUCK_RUNNER_IDLE_MS\`）且有欠账消息的 Runner 进入候选列表。

恢复决策区分两种运行时，体现"不跨运行时边界观测"的原则：

| 条件 | 动作 | 原因 |
|------|------|------|
| IPC 注入债务 ≥ 10 分钟 | 立即重启 (\`absolute_ipc_ceiling\`) | 债务时钟只随注入起点走，普通输出无法刷新 |
| 闲置 ≥ 10 分钟 | 强制重启 (\`idle_ceiling\`) | 宽限是有界的，不能无限否决恢复 |
| runtime=container（未达上限） | 延迟 (\`container_grace\`) | 宿主 \`ps\` 无法观测 Docker 内部 CPU |
| Host 进程树 CPU > 0.5% | 延迟 (\`cpu_active\`) | 真实在工作 |
| CPU 探测失败 | 延迟 (\`cpu_unknown\`) | fail-safe |

CPU 探针只对 Host 模式生效：遍历 \`ps\` 输出构建进程树，沿 Runner PID 向下搜索任一后代 CPU 占用超标即判定活跃。Docker 工作负载被刻意排除，因为容器进程属于 containerd 而非宿主侧 docker CLI 进程树——拿 CLI 的 PID 去探测只会得到误导性结论。异步探测结束后还有一道 TOCTOU 复验（\`revalidateStuckRecoveryCandidate\`）：runnerGeneration、queryId、PID 等身份指纹任一变化即放弃本次决策，确保旧 turn 的恢复判断永远不会误杀新生的健康查询。

Sources: [stuck-runner-recovery.ts](src/stuck-runner-recovery.ts#L120-L173), [stuck-runner-recovery.ts](src/stuck-runner-recovery.ts#L62-L118), [index.ts](src/index.ts#L1232-L1244), [index.ts](src/index.ts#L17386-L17460)

## 九、稳态防护：OOM 自动重置与终端预热

Container 模式还有一个 Host 模式不存在的故障形态：cgroup OOM killer 导致的 exit code 137。主循环精确匹配 \`code 137\` 字样（而非歧义的 \`signal SIGKILL\`），并且排除用户刚点过 stop 的场景（stopGroup 的 SIGTERM→grace→docker kill 链路同样产生 137）。连续两次 OOM 达到阈值后自动清空会话文件与 DB 记录，打破"加载大会话→OOM→重试加载"的死循环；计数器经 router_state 持久化，重启后可恢复。

与之对称的是**终端预热**：Container 模式的工作区在首次交互前会发起一次预热 run（提示词要求只回复 \`<terminal_ready>\`），让工具链、Chromium CDP 等重资产提前就绪；Host 模式直接跳过此步骤。两处入口都显式短路 \`(executionMode || 'container') === 'host'\`，这是双模式差异渗透到生命周期各环节的一个缩影。

Sources: [index.ts](src/index.ts#L9216-L9245), [index.ts](src/index.ts#L1241-L1244), [index.ts](src/index.ts#L9353-L9435)

## 十、配置速查表

| 配置项 | 默认值 | 取值范围 | 作用层级 | 说明 |
|--------|--------|----------|----------|------|
| \`execution_mode\` | \`container\` | \`container \\| host\` | Workspace 行 | 非法值失败关闭回退 container |
| \`maxConcurrentContainers\` | 20 | 1–100 | 系统设置 / \`MAX_CONCURRENT_CONTAINERS\` | 仅约束 Container 模式 |
| \`containerTimeout\` | 1800000ms | 60s–24h | 系统设置 / \`CONTAINER_TIMEOUT\` / Workspace \`containerConfig.timeout\` | 单次执行超时基准 |
| \`idleTimeout\` | 1800000ms | 60s–24h | 系统设置 / \`IDLE_TIMEOUT\` | 暖 Runner 保留窗口 |
| \`RUNNER_SHUTDOWN_GRACE_MS\` | 15000ms | 代码常量 | — | 叠加到 watchdog 上的收尾宽限 |
| \`STUCK_RUNNER_IDLE_MS\` | 3min | 代码常量 | — | 卡死候选判定阈值 |
| \`STUCK_RUNNER_FORCE_RESTART_MS\` | 10min | 代码常量 | — | 卡死强制重启上限 |
| \`OOM_AUTO_RESET_THRESHOLD\` | 2 次 | 代码常量 | — | 连续 OOM 后自动重置会话 |

Sources: [runtime-config.ts](src/runtime-config.ts#L3963-L3970), [schemas.ts](src/schemas.ts#L693-L693), [runner-liveness.ts](src/runner-liveness.ts#L1-L35)

## 小结

双执行模式的本质是一次**隔离粒度 vs 运维成本**的权衡被下沉到了架构层：Container 模式用显式容量池、计费联动和 OOM 自愈换取多租户下的可预算性；Host 模式用"活体特权门 + 操作系统托管"换取 admin 场景下的即时并发与原生工具链。两者共享同一套 GroupQueue 串行化骨架、同一套 IPC 注入协议和同一组派生超时公式，使得上层编排代码对执行位置几乎无感知——差异只在准入判据、杀伤动作和观测能力这三处被刻意收敛的接缝上。理解这套分层后，阅读下一页的四段 Prompt 体系时会发现：无论 Runner 跑在哪里，喂给它的上下文组装逻辑是完全一致的。

Sources: [container-runner.ts](src/container-runner.ts#L3067-L3080)

## 延伸阅读

- 了解 Runner 与宿主之间 stdin/stdout 协议与 IPC 通道细节：[Pi Agent Runner 协议：stdin/stdout 结构化结果与 IPC 通道](10-pi-agent-runner-xie-yi-stdin-stdout-jie-gou-hua-jie-guo-yu-ipc-tong-dao)
- 深入会话串行队列的重试退避与完整 Runner 生命周期：[会话串行队列：Runner 生命周期、重试退避与卡死恢复](14-hui-hua-chuan-xing-dui-lie-runner-sheng-ming-zhou-qi-zhong-shi-tui-bi-yu-qia-si-hui-fu)
- 容器非 root 运行与挂载白名单的安全细节：[容器隔离与挂载安全：非 root 运行、白名单与密钥加密边界](20-rong-qi-ge-chi-yu-gua-zai-an-quan-fei-root-yun-xing-bai-ming-dan-yu-mi-yao-jia-mi-bian-jie)`;export{n as default};
