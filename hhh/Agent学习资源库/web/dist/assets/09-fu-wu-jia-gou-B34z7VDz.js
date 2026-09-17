const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 9 章 · 主服务架构与核心模块划分 · HappyClaw 图解精读</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#F8F7FE;color:#232733;line-height:1.75;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.crumb{font-size:13.5px;color:#8A8F9E;margin-bottom:8px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:13px}
h1{font-size:34px;line-height:1.2;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:26px}
h2{font-size:22px;margin:36px 0 10px;padding-top:18px;border-top:1px solid #E6E3F2}
.card{background:#fff;border:2.5px solid #232733;border-radius:18px;box-shadow:6px 6px 0 rgba(35,39,51,.10);padding:20px;margin:20px 0}
.analogy{background:#fff;border-left:5px solid var(--accent);border-radius:6px 14px 14px 6px;box-shadow:0 2px 12px rgba(35,39,51,.07);padding:18px 22px;margin:18px 0}
.analogy p{font-size:16.5px;color:#3A3F4E}
.analogy .tag{font-weight:800;color:var(--accent);font-size:14px;letter-spacing:.15em}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.card h3{font-size:19px;margin-bottom:5px}
.card p{font-size:16.5px;color:#4A5060}
.chip{display:inline-block;border:2.5px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 14px;font-weight:700;font-size:15px}
svg{width:100%;height:auto;display:block;margin:16px 0}
.caption{text-align:center;color:#5A6072;font-size:14.5px;margin-top:10px}
.walk .step{display:flex;gap:12px;margin:13px 0;align-items:flex-start}
.walk .n{flex:0 0 30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px}
.walk .step p{font-size:16.5px;color:#3A3F4E}
.walk .step p small{display:block;color:#8A8F9E;font-size:14px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin:16px 0}
.stat{background:#fff;border:2px solid var(--accent);border-radius:14px;padding:14px 12px;text-align:center}
.stat b{display:block;font-size:26px;color:var(--accent);font-weight:800;line-height:1.2}
.stat span{font-size:13.5px;color:#5A6072}
.more{padding-left:22px}
.more li{margin:9px 0;font-size:16.5px;color:#3A3F4E}
.faq dt{font-weight:800;font-size:16.5px;margin-top:14px;color:#232733}
.faq dt::before{content:'Q ';color:var(--accent)}
.faq dd{margin:4px 0 0 0;font-size:16px;color:#4A5060;padding-left:24px}
.rel{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
.rel a{text-decoration:none;font-size:15px;background:#fff;border:1.5px solid var(--accent);color:var(--accent);border-radius:999px;padding:4px 14px}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:46px;font-weight:700;font-size:16px}
a{color:var(--accent)}
footer{margin-top:44px;color:#8A8F9E;font-size:14px;text-align:center}</style></head>
<body><div class="wrap">
<p class="crumb">第 9 章 / 30 · 系统架构 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 9 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>主服务架构与核心模块划分</h1>
<p class="lede">主服务是一个 Node.js 进程，内部分工却像一栋大楼：前台（Web API）、接线室（IM 渠道）、调度室（队列）、施工队（执行层）与档案室（SQLite），靠一套固定顺序的开灯流程跑起来。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一栋自建办公楼：一楼前台接待网页访客，二楼接线员接七种聊天软件的电话，三楼调度室排班派活但不亲自干活，四楼施工队按单开工，地下室档案室只增不改地记账。整栋楼其实只有一个「当班团队」（单进程），但每个部门门牌清晰、单向传递文件——没人越级进档案室翻东西。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="主服务单进程分层"><defs><marker id="ar9" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="210" y="6" width="460" height="218" rx="18" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="7 6"/>
    <text x="440" y="32" text-anchor="middle" font-size="15" font-weight="700">🏢 同一个 Node.js 进程</text>
    <rect x="232" y="44" width="416" height="28" rx="8" fill="#eef3fd"/>
    <text x="440" y="63" text-anchor="middle" font-size="13">🌐 Web / API 层 · Hono ＋ 20 个路由 ＋ WebSocket</text>
    <rect x="232" y="80" width="416" height="28" rx="8" fill="#fff7e6"/>
    <text x="440" y="99" text-anchor="middle" font-size="13">☎️ IM 渠道层 · 飞书 / TG / QQ / 微信等七种连接池</text>
    <rect x="232" y="116" width="416" height="28" rx="8" fill="#edfaf2"/>
    <text x="440" y="135" text-anchor="middle" font-size="13">🎛️ 核心编排层 · 会话队列 · 消息泵 · 定时任务</text>
    <rect x="232" y="152" width="416" height="28" rx="8" fill="#fdeeee"/>
    <text x="440" y="171" text-anchor="middle" font-size="13">🔨 执行层 · Docker 容器 / 宿主机子进程</text>
    <rect x="232" y="188" width="416" height="28" rx="8" fill="#f3effc"/>
    <text x="440" y="207" text-anchor="middle" font-size="13">🗄️ 持久化层 · SQLite 单库 · WAL 日志</text>
  </svg>
  <p class="caption">依赖方向单向收敛：编排 → 领域 → 基础设施；db.ts 被各层共享，却不反向认识任何业务模块。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>main() 固定顺序开灯：迁数据目录 → 初始化 SQLite → 清理僵尸任务 → 从库里恢复内存态<small>重启后不存在真正运行中的 SDK 任务，统一标记 error，避免界面出现「僵尸 running」。</small></p></div><div class="step"><span class="n">2</span><p>尽早把 Web 服务器开起来<small>startWebServer 用参数对象注入全部依赖——前端登录与 API 不被 IM 渠道就绪阻塞。</small></p></div><div class="step"><span class="n">3</span><p>IM 入站先挂起，等可靠性恢复完成再放行<small>deferInbound 挂起 → 渠道收尾旧卡片、失效过期栅栏、IPC watcher 就绪后才 resumeDeferredInbound，否则同一轮可能出现两张活跃卡片。</small></p></div><div class="step"><span class="n">4</span><p>消息泵轮询新消息，逐组交给编排管线<small>GroupQueue 以 chatJid 为粒度让同一会话严格串行、不同会话并行；管线靠游标机制保证崩溃后不重放不丢失。</small></p></div><div class="step"><span class="n">5</span><p>关门的次序也有讲究：先停入口后断出口<small>IM 入站立即暂停但底层客户端保活，供运行中的 Agent 收尾卡片；30 秒强制退出兜底，与队列 15 秒宽限＋容器强停约 10 秒匹配。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>21,551 行</b><span>index.ts —— 全部编排逻辑所在</span></div><div class="stat"><b>14,496 行</b><span>db.ts —— 唯一的持久化面</span></div><div class="stat"><b>20 个</b><span>路由模块挂在 /api 前缀之下</span></div><div class="stat"><b>30 秒</b><span>shutdown 的强制退出兜底线</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>Provider 池的健康检查纯内存维护：连续 3 次失败标记不健康，5 分钟恢复间隔后自动复检；负载均衡有 round-robin、加权、failover 三种策略。</li>
<li>WebSocket 承载三类实时通道：每 5 秒状态广播、node-pty 终端、流式事件推送 broadcastStreamEvent。</li>
<li>虚拟 JID（#agent: / #task: 后缀）映射为独立序列化键，子 Agent 与定时任务各占自己的并发槽位，互不挡道。</li>
<li>编排管线在入队前依次过五道闸：激活模式检查、提取游标以来消息、解析回复路由（sticky owner）、插件斜杠命令展开、归属者门禁＋计费配额检查。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>一个进程管所有事，挂了是不是全瘫？</dt><dd>是的，这是刻意取舍：单进程换来跨表事务零协调与简单部署。崩了不怕丢状态——重启走固定顺序从 SQLite 恢复现场。它不承诺的是高可用（不宕机）：可用性要靠进程守护或外部监控补位。</dd>
<dt>启动顺序换一下会出什么事？</dt><dd>细节都是正确性边界：IM 入站若早于渠道可靠性恢复与 IPC watcher 放行，会出现重复活跃卡片；第 8–10 步的 deferInbound → 恢复 → resumeDeferredInbound 是硬性排序，不是风格偏好。</dd>
<dt>数据库「约 35 张表」会不会越滚越大？</dt><dd>表族按归属拆分：db.ts 内联核心表，渠道可靠性、记忆等模块各自声明自己的表并通过共享连接引用——单一文件换来跨表族的原子事务，不需要分布式协调；冷数据治理另有专门的迁移与备份机制负责。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../09-主服务架构与核心模块划分.md">主服务架构与核心模块划分</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="08-neng-li-zhi-li.html">第 8 章 · 能力治理</a><a href="10-runner-ipc.html">第 10 章 · Runner 与 IPC 协议</a></div>

<nav class="nav">
<a href="08-neng-li-zhi-li.html">上一章：能力治理 ←</a>
<a href="index.html">返回目录</a>
<a href="10-runner-ipc.html">下一章：Runner 与 IPC 协议 →</a>
</nav>
<footer>HappyClaw 图解精读 · 9 / 30</footer>
</div></body></html>
`;export{n as default};
