const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 21 章 · Runner 生命周期、卡死检测与故障恢复 · HappyClaw 图解精读</title>
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
<p class="crumb">第 21 章 / 30 · 核心运行时 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 21 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>Runner 生命周期、卡死检测与故障恢复</h1>
<p class="lede">一单送完骑手并不撤退，蹲在门口等下一单省去冷启动；平台挂着两块表专抓「欠活却不干活」，探针核实后果断换车手，用户毫无感觉。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像外卖平台的驻点骑手：接完一单在原地等派（温存 Runner），再派不用重新报到。系统里挂着两块表——一块「活动表」骑手每次有动静都会重置；另一块「欠账表」只要手上还压着没回的单就永远走个不停。第二块表一到顶，说明该干活的人没干活：先看定位是不是真不动了（CPU 探针），确认后强制换人，手里没送出去的原样移交新车手。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="双时钟卡死检测"><defs><marker id="ar21" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="24" y="58" width="190" height="114" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="119" y="96" text-anchor="middle" font-size="26">💬</text>
<text x="119" y="128" text-anchor="middle" font-size="14.5" font-weight="700">活动时钟</text>
<text x="119" y="150" text-anchor="middle" font-size="13" fill="#5b6478">有任何输出就重置</text>
<rect x="254" y="58" width="190" height="114" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="349" y="96" text-anchor="middle" font-size="26">⏰</text>
<text x="349" y="128" text-anchor="middle" font-size="14.5" font-weight="700">债务时钟</text>
<text x="349" y="150" text-anchor="middle" font-size="13" fill="#5b6478">欠着回复永不重置</text>
<rect x="484" y="58" width="180" height="114" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="574" y="96" text-anchor="middle" font-size="26">🔎</text>
<text x="574" y="128" text-anchor="middle" font-size="14.5" font-weight="700">每约 30 秒巡查</text>
<text x="574" y="150" text-anchor="middle" font-size="13" fill="#5b6478">CPU 探针＋代际校验</text>
<rect x="704" y="40" width="152" height="74" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="780" y="72" text-anchor="middle" font-size="20">🔧 重启换手</text>
<text x="780" y="98" text-anchor="middle" font-size="12.5" fill="#5b6478">确认卡死或到硬上限</text>
<rect x="704" y="126" width="152" height="66" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="780" y="154" text-anchor="middle" font-size="20">😴 继续宽限</text>
<text x="780" y="178" text-anchor="middle" font-size="12.5" fill="#5b6478">真在干活/观测不到</text>
<line x1="216" y1="115" x2="250" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar21)"/>
<line x1="446" y1="115" x2="480" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar21)"/>
<line x1="666" y1="90" x2="700" y2="77" stroke="#232733" stroke-width="4" marker-end="url(#ar21)"/>
<line x1="666" y1="140" x2="700" y2="159" stroke="#232733" stroke-width="4" marker-end="url(#ar21)"/>
</svg>
<p class="caption">⚖️ 宽限只是缓刑不是赦免：空闲与债务各有硬上限，时间一到必被处理。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>回合结束进程不退出，转入温存等待新的 IPC 消息<small>_close 立即收摊、_drain 问完这答再走、_interrupt 打断当前查询</small></p></div>
<div class="step"><span class="n">2</span><p>跟进消息原子写入 IPC 目录，同时记下债务时钟<small>普通输出能刷活动钟，永远刷不了债务钟——这是修掉 #618 隐身卡死的关键</small></p></div>
<div class="step"><span class="n">3</span><p>主循环约每 30 秒扫一轮：空闲满 3 分钟、或债务老化的都成候选<small>定时任务和子代理不在巡查范围，它们各走各的恢复通道</small></p></div>
<div class="step"><span class="n">4</span><p>CPU 探针核实后代进程真的零负载，决策前再比对代际未变<small>探针期间旧回合若已完成、新轮次若已启动，过期决策立即作废</small></p></div>
<div class="step"><span class="n">5</span><p>决定重启：哨兵加 SIGTERM 收尾，超时升级强杀，随后自动补位新 Runner<small>未提交的读取游标原封不动，新进程接手重放消息，会话全程无感</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3 分钟</b><span>进入卡死候选的空闲阈值</span></div>
<div class="stat"><b>10 分钟</b><span>债务时钟的绝对上限，谁也豁免不了</span></div>
<div class="stat"><b>0.5%</b><span>CPU 探针判定「还在干活」的活跃线</span></div>
<div class="stat"><b>137×2</b><span>连续两次退出码 137 自动清空会话（OOM）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>外层看门狗必须严格晚于空闲回收：历史上两者同为 30 分钟导致竞态误杀健康温存会话，现在用公式保证顺序再加 15 秒缓冲。</li>
<li>用户刚点了停止的会话有 30 秒保护窗——期间退出流程不触发「杀掉即自启」的自愈重亮。</li>
<li>启动时会扫描所有用户会话的 IPC 残留投递，先落库回退再删除崩溃现场文件，任务命名空间刻意排除在外。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>强制重启会不会误杀一个正在认真思考的 Runner？</dt><dd>三层防线兜着：CPU 在忙、容器里观测不到工作、探针失败，都只宽限不裁决。但它不保护什么也很明确——10 分钟绝对上限不给任何宽限期，宁可偶尔慢待一个大计算，也不给永久卡死留生存空间。</dd>
<dt>重启之后用户的消息会丢吗？</dt><dd>不会。读取游标只有在真正处理完成后才推进，新 Runner 启动后把未消费的消息原样重放；同一批消息失败还带指数退避，最多重试 5 次，上下文溢出则直接放弃不等。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../21-runner-sheng-ming-zhou-qi-qia-si-jian-ce-yu-gu-zhang-hui-fu.md">Runner 生命周期、卡死检测与故障恢复</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="20-provider-chi.html">第 20 章 · Provider 池</a><a href="22-memory-v2.html">第 22 章 · Workspace Memory v2</a></div>

<nav class="nav">
<a href="20-provider-chi.html">上一章：Provider 池 ←</a>
<a href="22-memory-v2.html">下一章：Workspace Memory v2 →</a>
</nav>
<footer>HappyClaw 图解精读 · 21 / 30</footer>
</div></body></html>
`;export{n as default};
