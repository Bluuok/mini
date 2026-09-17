const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第18章 · 行李箱超重：自动压缩 · TinyCode 图解精读</title>
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
<p class="crumb">第 18 章 / 27 · 上下文工程 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 18 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>行李箱超重：自动压缩</h1>
<p class="lede">聊得越久，上下文越满。超过预算时，最老的对话被 AI 自己压缩成一页摘要，最近的则被「保护窗口」牢牢保住。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像年度工作交接：三年前的旧项目打包成一段摘要（「Q1 完成 X，Q2 上线 Y」）；最近一个季度的细节必须原文保留——新同事最需要的是近况，不是考古。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="自动压缩"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="30" y="60" width="200" height="110" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="130" y="105" text-anchor="middle" font-size="30">🧳💥</text>
    <text x="130" y="145" text-anchor="middle" font-size="14.5" fill="#5b6478">超过窗口 80% → 触发</text>
    <rect x="300" y="60" width="240" height="110" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="420" y="100" text-anchor="middle" font-size="26">📜✨</text>
    <text x="420" y="132" text-anchor="middle" font-size="14.5" fill="#5b6478">最老的一沓 → 压成摘要</text>
    <text x="420" y="155" text-anchor="middle" font-size="13" fill="#8a92a6">由 AI 自己写摘要</text>
    <rect x="610" y="60" width="240" height="110" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="730" y="100" text-anchor="middle" font-size="26">🛡️</text>
    <text x="730" y="132" text-anchor="middle" font-size="14.5" font-weight="700">保护窗口</text>
    <text x="730" y="155" text-anchor="middle" font-size="13" fill="#5b6478">最近的事永不压缩</text>
    <line x1="232" y1="115" x2="296" y2="115" stroke="#1a2233" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="542" y1="115" x2="606" y2="115" stroke="#1a2233" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">🛡️ 里装的是：你最新的要求、最近的改动、最近的报错。也可 <code>/compact</code> 手动打包。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>每次请求前估算 token 总量<small>transformContext 钩子值守</small></p></div><div class="step"><span class="n">2</span><p>超过窗口 80%（或 10 万）触发压缩<small>可配置，也可设 0 关闭</small></p></div><div class="step"><span class="n">3</span><p>从后往前找用户消息边界，切出最老的一段<small>边界对齐用户消息，不拦腰截断</small></p></div><div class="step"><span class="n">4</span><p>模型生成摘要替换旧段；近期原文不动<small>保护窗口：最新要求/改动/报错</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>80%</b><span>上下文窗口占用即触发</span></div><div class="stat"><b>0</b><span>设为 0 可彻底关闭自动压缩</span></div><div class="stat"><b>1</b><span>条摘要替换最老的一段对话</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>摘要由真实 LLM 调用生成，bootstrap 负责注入这个摘要器。</li><li>/compact 命令可以随时手动触发压缩。</li><li>保护窗口保证：最近用户任务、最近工具调用、最近错误永不进摘要。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>压缩会丢关键信息吗？</dt><dd>设计上丢失的只有「最老且已完结」的对话；近期工作被保护窗口原样保留。</dd><dt>我能控制压缩时机吗？</dt><dd>可以：配置 compactAboveTokens 调整阈值，或用 /compact 手动触发。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../18-token-yu-suan-yu-zi-dong-ya-suo-hui-hua-zhai-yao-sheng-cheng-yu-bao-hu-chuang-kou.md">会话摘要生成与保护窗口</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="17-gong-ju-jie-guo-jie-duan-ce-lue-tou-wei-bao-liu-yu-wan-zheng-shu-chu-gui-dang-wei-gong-jian.html">第 17 章 · 单条结果怎么截断</a><a href="19-zhui-jia-shi-jsonl-cun-chu-beng-kui-an-quan-de-hui-hua-chi-jiu-hua-she-ji.html">第 19 章 · 压缩后的内容还存在会话里吗</a></div>

<nav class="nav">
<a href="17-gong-ju-jie-guo-jie-duan-ce-lue-tou-wei-bao-liu-yu-wan-zheng-shu-chu-gui-dang-wei-gong-jian.html">上一章：长日志：掐中间，留两头 ←</a>
<a href="index.html">返回目录</a>
<a href="19-zhui-jia-shi-jsonl-cun-chu-beng-kui-an-quan-de-hui-hua-chi-jiu-hua-she-ji.html">下一章：只加页、不撕页的日记本 →</a>
</nav>
<footer>TinyCode 图解精读 · 18 / 27</footer>
</div></body></html>
`;export{n as default};
