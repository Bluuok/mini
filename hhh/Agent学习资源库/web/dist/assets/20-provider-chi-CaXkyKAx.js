const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 20 章 · Provider 池与负载均衡策略 · HappyClaw 图解精读</title>
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
<p class="crumb">第 20 章 / 30 · 核心运行时 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 20 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>Provider 池与负载均衡策略</h1>
<p class="lede">多个模型账号像一排窗口按策略分流；会话因「思考签名」粘住某一位，谁亮红灯谁立即下线，修没修好全看倒计时，不靠猜。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像银行大厅有多个人工窗口：平时叫号器按人头或权重分流（轮询／加权轮询）；VIP 有专属理财师，根本不上叫号器（Agent 钉住直选）。某位柜员终端一亮红灯（上报故障），她立刻下线不再接任何人（即时隔离），顶班半小时后才试探着让她回来（时间恢复）。而老客户的资料夹还压在某位柜员手里没办完（会话粘性）——换人就得整套流程推倒重来。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="Provider 选择管线的优先级"><defs><marker id="ar20" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="24" y="62" width="180" height="106" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="114" y="100" text-anchor="middle" font-size="26">📌</text>
<text x="114" y="132" text-anchor="middle" font-size="14.5" font-weight="700">① Agent 钉住配置？</text>
<text x="114" y="154" text-anchor="middle" font-size="13" fill="#5b6478">权威直选，绕过池</text>
<rect x="244" y="62" width="180" height="106" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="334" y="100" text-anchor="middle" font-size="26">🔑</text>
<text x="334" y="132" text-anchor="middle" font-size="14.5" font-weight="700">② 工作区自带凭据？</text>
<text x="334" y="154" text-anchor="middle" font-size="13" fill="#5b6478">整池跳过</text>
<rect x="464" y="62" width="180" height="106" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="554" y="100" text-anchor="middle" font-size="26">🧲</text>
<text x="554" y="132" text-anchor="middle" font-size="14.5" font-weight="700">③ 有粘性绑定且健康？</text>
<text x="554" y="154" text-anchor="middle" font-size="13" fill="#5b6478">复用上次的 Provider</text>
<rect x="684" y="62" width="172" height="106" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="770" y="100" text-anchor="middle" font-size="26">⚖️</text>
<text x="770" y="132" text-anchor="middle" font-size="14.5" font-weight="700">④ 池按策略挑选</text>
<text x="770" y="154" text-anchor="middle" font-size="13" fill="#5b6478">仅 enabled 且 healthy</text>
<line x1="206" y1="115" x2="240" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar20)"/>
<line x1="426" y1="115" x2="460" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar20)"/>
<line x1="646" y1="115" x2="680" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar20)"/>
</svg>
<p class="caption">🚦 四道关卡从左到右依次短路：只有全都「否」时，负载均衡才真正登场。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>会话发起，先查这个 Agent 是否钉住了模型配置<small>钉住就是权威答案：enabled 开关只管自动池成员资格，管不到显式绑定</small></p></div>
<div class="step"><span class="n">2</span><p>工作区自己配了凭据？整个池被跳过<small>凭据归属的边界不被全局选择破坏</small></p></div>
<div class="step"><span class="n">3</span><p>会话已有粘性绑定且对方健康 → 直接复用<small>Claude Code 的 thinking block 签名与账号绑定，换账号会报 400 签名错误</small></p></div>
<div class="step"><span class="n">4</span><p>落到池选择：过滤出启用且健康的候选，按策略挑人<small>round-robin 均匀消耗、加权轮询按比例、failover 恒选第一个健康者</small></p></div>
<div class="step"><span class="n">5</span><p>运行中亮红灯 → 立即隔离；还有别的健康者就保留输入换家重放<small>池耗尽才向用户终局失败；输入游标不消费，同一份输入等下一轮重拾</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>20 个</b><span>系统最多容纳的 Provider 数</span></div>
<div class="stat"><b>3 次</b><span>默认连续失败几次即隔离（阈值可调 1–20）</span></div>
<div class="stat"><b>300 秒</b><span>默认恢复间隔，过后重新试探（30–3600s 可调）</span></div>
<div class="stat"><b>1–100</b><span>加权轮询的权重钳制范围，默认 1</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>健康状态是纯内存态，重启即全部复位；恢复纯靠计时——额度类故障（如「凌晨 2:10 重置」）过了间隔就会被再次试探，这是务实的折中。</li>
<li>真要换 Provider 时必须「先删旧 SDK 会话再写新绑定」：deleteSession 会连整行一起删，顺序反了绑定就丢，下一回合又开始漂移。</li>
<li>Agent 钉住模型配置时重试上限是 1——不跨 Provider 重试，因为一个 Agent 只归属一套完整模型环境，换网关会破坏契约。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>让 AI 干到一半突然换个账号接着写，会不会很危险？</dt><dd>危险点很具体：thinking block 的签名与生成它的账号绑定，会话中途换 Provider 会直接报签名 400 错误。所以切换前必须先删掉旧 SDK 会话再重绑。它不保护什么也不含糊：已经产生的思考链路本身救不回来，切换保的是之后的回合可用。</dd>
<dt>模型限流和账号挂了不是一回事吗？为什么分两级处理？</dt><dd>不一样。Opus/Sonnet 五小时七日限额这类「模型级」问题在容器内透明切到 fallback 模型继续干，不必牵连整个账号；「账号级」问题（认证失败、overload）才会隔离整个 Provider。误伤面因此小很多——一条模型的限额不该把好端端的账号拉下线。</dd>
<dt>刚发现账号坏了，为什么其他会话还可能撞上去？</dt><dd>所以上报通道设计了「先隔离再投影」：流式输出里一报 providerFailure，宿主先把错误数直接抬过阈值、让该 Provider 当场出列，之后才渲染卡片或通知用户——不给并发中的新选择留撞枪口的窗口。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../20-provider-chi-yu-fu-zai-jun-heng-ce-lue.md">Provider 池与负载均衡策略</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="19-ding-shi-ren-wu.html">第 19 章 · 定时任务调度</a><a href="21-runner-zhou-qi.html">第 21 章 · Runner 生命周期</a></div>

<nav class="nav">
<a href="19-ding-shi-ren-wu.html">上一章：定时任务调度 ←</a>
<a href="21-runner-zhou-qi.html">下一章：Runner 生命周期 →</a>
</nav>
<footer>HappyClaw 图解精读 · 20 / 30</footer>
</div></body></html>
`;export{n as default};
