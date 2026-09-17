const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 16 章 · 渠道可靠性状态机：Inbox、Turn 与 Outbox · HappyClaw 图解精读</title>
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
<p class="crumb">第 16 章 / 30 · 消息渠道 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 16 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>渠道可靠性状态机：Inbox、Turn 与 Outbox</h1>
<p class="lede">聊天平台的送达确认很弱、还爱重复推送；系统把每条输入、每次执行、每个输出都记成可查的存根——要么拿到签收回执，要么停下来等人裁决，绝不盲目重发第二遍。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像寄快递用的三联单：揽件时登记运单号（Inbox 唯一约束——重复投递只算一件）；派件中挂着任务卡（Turn 幂等键——崩溃重来还是同一个号，不会重复干活）；签收后留回执（Outbox delivered）。司机出发后断了联系怎么办？系统不敢替你"再发一份"——万一其实送到了，你就要收两份——这类件一律标成"结果未知"，转人工客服核对后才能销案。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="Inbox Turn Outbox 流水线"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="66" width="196" height="108" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="122" y="104" text-anchor="middle" font-size="24">📡📡</text>
    <text x="122" y="132" text-anchor="middle" font-size="13.5" font-weight="700">平台反复推送</text>
    <text x="122" y="154" text-anchor="middle" font-size="12" fill="#8a92a6">弱确认 + 网络闪断</text>
    <rect x="272" y="30" width="188" height="76" rx="14" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="366" y="60" text-anchor="middle" font-size="14.5" font-weight="700">① Inbox 入库去重</text>
    <text x="366" y="84" text-anchor="middle" font-size="12" fill="#5b6478">唯一键 + 五分钟租约</text>
    <rect x="272" y="136" width="188" height="70" rx="14" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="366" y="164" text-anchor="middle" font-size="14.5" font-weight="700">② Turn 幂等执行</text>
    <text x="366" y="186" text-anchor="middle" font-size="12" fill="#5b6478">同一逻辑输入同一行</text>
    <rect x="520" y="83" width="168" height="74" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="604" y="112" text-anchor="middle" font-size="14.5" font-weight="700">③ Outbox 出站</text>
    <text x="604" y="136" text-anchor="middle" font-size="12" fill="#5b6478">回执或人工裁决</text>
    <rect x="726" y="55" width="130" height="130" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="791" y="100" text-anchor="middle" font-size="21">✅</text>
    <text x="791" y="128" text-anchor="middle" font-size="13" font-weight="700">delivered</text>
    <text x="791" y="150" text-anchor="middle" font-size="11.5" fill="#8a92a6">持回执销案</text>
    <line x1="222" y1="110" x2="264" y2="75" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="222" y1="120" x2="264" y2="163" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="462" y1="80" x2="512" y2="115" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="462" y1="172" x2="512" y2="140" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="690" y1="120" x2="718" y2="120" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">五张 SQLite 表各管一段：Inbox 去重、游标防回退、Turn 记录执行、Outbox 幂等出站、流式卡片跨进程恢复。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>WebSocket 把昨天的消息又推了一遍：写入时撞唯一键，只算一条<small>(渠道, 账号, 平台消息号) 三元组唯一，重复返回已存在行</small></p></div><div class="step"><span class="n">2</span><p>消息被认领开始执行，租约五分钟一续，持有者崩溃后过期可被合法接管<small>认领在事务里原子抢占，保证不会两个进程同时处理一条</small></p></div><div class="step"><span class="n">3</span><p>进程崩溃重启后重放执行：命中同一个幂等键，尝试次数 +1 但身份不变<small>键由 渠道+账号+消息号+Agent 派生，不靠随机 UUID</small></p></div><div class="step"><span class="n">4</span><p>发送到一半进程崩了："发送中"状态栅栏为结果未知，绝不自动重试<small>超时断连证明不了对方没收到——只有明确拒绝才能安全重试</small></p></div><div class="step"><span class="n">5</span><p>运维打开对账清单逐条裁决：确认送达要附平台回执号<small>裁决接口要求带版本号做比对，改错版本返回 409 要求重读</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>5 张</b><span>SQLite 表构成入站→执行→出站流水线</span></div><div class="stat"><b>5 分钟</b><span>Inbox 租约时长，到期可被他人接管</span></div><div class="stat"><b>32 位</b><span>runId 取哈希前 32 位，重放永远同号</span></div><div class="stat"><b>15 秒</b><span>live 模式恢复循环周期，只碰启动前的旧账</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>completed 是硬承诺：Turn 下还有未落定的输出时永远不许宣告完成，所以看到 completed 就能信输出已全部送达。</li><li>带"已投递副作用"的崩溃最危险：启动恢复会把这些 Turn 标记为中断并写明需人工对账，杜绝同一消息的兄弟副本。</li><li>数据治理分两步走：先给终态行的大体积内容脱敏置空、保留幂等收据，再按时间窗删除。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>网都断了，直接重发一遍不是更省事吗？</dt><dd>不行。Outbox 的核心就是把"确定没送达（明确拒绝）"和"结果未知（超时断连）"分开：前者可安全重试，后者自动重试可能让你收到两条一样的回复。它不保护什么：这套机制承诺的是不重复、不丢失、可审计，并不保证 Agent 写出的内容本身正确——那是执行层的事。</dd><dt>怎么知道系统里有没有卡住的件？</dt><dd>有专门的扫描器横跨四张表列出所有非终态行支撑健康检查；监控端点也提供待对账清单，并刻意不展示消息正文以保护用户隐私。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../16-qu-dao-ke-kao-xing-zhuang-tai-ji-inbox-turn-yu-outbox.md">渠道可靠性状态机：Inbox、Turn 与 Outbox</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="15-fei-shu-yu-yi.html">第 15 章 · 飞书会话语义</a><a href="17-im-ming-ling.html">第 17 章 · IM 命令系统</a></div>

<nav class="nav">
<a href="15-fei-shu-yu-yi.html">上一章：飞书会话语义 ←</a>
<a href="../index.html">返回目录</a>
<a href="17-im-ming-ling.html">下一章：IM 命令系统 →</a>
</nav>
<footer>HappyClaw 图解精读 · 16 / 30</footer>
</div></body></html>
`;export{t as default};
