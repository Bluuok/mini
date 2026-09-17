const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 19 章 · 定时任务调度与异常恢复 · HappyClaw 图解精读</title>
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
<p class="crumb">第 19 章 / 30 · 核心运行时 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 19 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>定时任务调度与异常恢复</h1>
<p class="lede">定时任务把「计划是什么」和「这一次跑没跑」分开记账：租约决定谁能接管，递增的令牌让被顶替者的提交作废，已经开始执行的事至多做一次。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像小区物业代收快递：墙上贴的是长期排班表（任务定义），每天按表打出一张张当天的派送单（发生记录）。快递员领单要在登记簿上签到拿号（租约）；号一旦被后来者顶替，前任回来交差就会被拒收。而只要包裹已经出门派送，哪怕骑车摔了也绝不补送一遍——宁可登记「派送失败」，也不能把同一份快递塞两次信箱。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="一次定时触发从计划到结算的流水线"><defs><marker id="ar19" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="24" y="58" width="160" height="114" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="104" y="98" text-anchor="middle" font-size="26">🗓️</text>
<text x="104" y="130" text-anchor="middle" font-size="14.5" font-weight="700">计划到期</text>
<text x="104" y="152" text-anchor="middle" font-size="13" fill="#5b6478">next_run ≤ 现在</text>
<rect x="250" y="58" width="160" height="114" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="330" y="98" text-anchor="middle" font-size="26">🧾</text>
<text x="330" y="130" text-anchor="middle" font-size="14.5" font-weight="700">物化发生记录</text>
<text x="330" y="152" text-anchor="middle" font-size="13" fill="#5b6478">原子事务，游标同推</text>
<rect x="476" y="58" width="160" height="114" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="556" y="98" text-anchor="middle" font-size="26">🔑</text>
<text x="556" y="130" text-anchor="middle" font-size="14.5" font-weight="700">租约认领</text>
<text x="556" y="152" text-anchor="middle" font-size="13" fill="#5b6478">心跳持续续租</text>
<rect x="702" y="58" width="154" height="114" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="779" y="98" text-anchor="middle" font-size="26">▶️</text>
<text x="779" y="130" text-anchor="middle" font-size="14.5" font-weight="700">至多一次执行</text>
<text x="779" y="152" text-anchor="middle" font-size="13" fill="#5b6478">开始后不重放</text>
<line x1="186" y1="115" x2="246" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar19)"/>
<text x="440" y="35" text-anchor="middle" font-size="13" fill="#8a92a6">⏭️ 已有进行中记录？新触发只能记 missed，不补跑</text>
<line x1="638" y1="115" x2="698" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar19)"/>
<rect x="250" y="182" width="160" height="34" rx="10" fill="#fdeeee" stroke="#e5484d" stroke-width="2"/>
<text x="330" y="204" text-anchor="middle" font-size="13" fill="#e5484d">重叠/错失 → missed</text>
<line x1="330" y1="172" x2="330" y2="180" stroke="#232733" stroke-width="3"/>
</svg>
<p class="caption">📌 同一任务同一时刻最多一条「进行中」的记录，是数据库唯一索引从底层担保的。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>调度泵每次醒来，先把到期计划物化成一条发生记录<small>插入记录与推进游标在同一事务里，任何一步失败整体回滚</small></p></div>
<div class="step"><span class="n">2</span><p>上一条还在排队或运行中？这次触发直接落为 missed<small>宁可跳过一次，也绝不允许同一任务并发执行</small></p></div>
<div class="step"><span class="n">3</span><p>Worker 凭租约认领任务，心跳按租约的三分之一频率续期<small>脚本被中止或丢失租约时，结算权随之放弃</small></p></div>
<div class="step"><span class="n">4</span><p>开始时间一落库，就进入「至多一次」保护区<small>此后崩溃只会被标为 failed，绝不重放，避免重复副作用</small></p></div>
<div class="step"><span class="n">5</span><p>租约过期被新人接管：令牌递增，旧 Worker 的提交当场作废<small>没人接管时，老 Worker 仍可用自己的令牌提交结果</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>60 秒</b><span>运行租约时长，心跳按 1/3 续租</span></div>
<div class="stat"><b>32 个</b><span>调度泵单轮最多认领的发生记录</span></div>
<div class="stat"><b>5 次</b><span>通知投递的最大尝试上限</span></div>
<div class="stat"><b>24 小时</b><span>日志清理周期，保留最近 30 天</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>新旧两代并存：V1 重启后无条件清除遗留租约；V2 启动时绝不清除，靠租约自然过期接管——磁盘上的租约可能属于还活着的 worker。</li>
<li>cron 解析失败或最小间隔（60 秒）不达标时，系统物化一条 missed 记录并把任务置为 paused，绝不静默放行失控循环。</li>
<li>手动触发自带 24 小时轮换的幂等键去重；任务输出的 IM 通知是与记录绑定的持久化重试，不是尽力而为的旁路。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>跑到一半崩了，自动重跑一次不是更贴心吗？</dt><dd>不行——重放可能重复发消息、重复执行脚本。系统的原则是「至多一次」：此类崩溃只标 failed。它不保护的是成功率：一次成功的执行如果错过结算时机且无人接管，同样随运行一起作废，这套设计买的是确定性，不是高产出。</dd>
<dt>租约刚过期，老 Worker 的成果会被拒收吗？</dt><dd>只要还没被别人接管，它仍可凭自己的令牌正常结算；一旦新 Worker 认领、令牌递增，旧的写入立即被栅栏拒绝，不存在两边同时写成功的窗口。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../19-ding-shi-ren-wu-diao-du-yu-yi-chang-hui-fu.md">定时任务调度与异常恢复</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="18-hui-hua-dui-lie.html">第 18 章 · 会话队列与并发</a><a href="20-provider-chi.html">第 20 章 · Provider 池</a></div>

<nav class="nav">
<a href="18-hui-hua-dui-lie.html">上一章：会话队列与并发 ←</a>
<a href="20-provider-chi.html">下一章：Provider 池 →</a>
</nav>
<footer>HappyClaw 图解精读 · 19 / 30</footer>
</div></body></html>
`;export{t as default};
