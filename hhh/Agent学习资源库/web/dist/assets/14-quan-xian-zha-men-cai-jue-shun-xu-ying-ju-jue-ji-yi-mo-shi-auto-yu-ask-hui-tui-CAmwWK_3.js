const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第14章 · 排队规则：谁先发言谁说了算 · TinyCode 图解精读</title>
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
<p class="crumb">第 14 章 / 27 · 权限与安全 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 14 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>排队规则：谁先发言谁说了算</h1>
<p class="lede">静态规则 → 会话记忆 → 模式开关 → 问你本人。一条短路流水线：任何一站给出终局结论，后面全部跳过。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像出入境柜台：先过机器初检（静态规则，危险品直接没收），再看你有没有已办的长 channel 通行证（会话记忆），然后看今日通关模式（auto），最后才由人工柜台面谈（弹窗）。任何一关放行或拒绝，后面不用再排。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 210" role="img" aria-label="裁决顺序"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <g font-size="15.5" font-weight="700">
      <rect x="20"  y="70" width="170" height="64" rx="12" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/><text x="105" y="97" text-anchor="middle">1️⃣ 静态规则</text><text x="105" y="120" text-anchor="middle" font-size="12" fill="#5b6478" font-weight="400">rm -rf / 直接毙</text>
      <rect x="230" y="70" width="170" height="64" rx="12" fill="#eef4ff" stroke="#3b82f6" stroke-width="3"/><text x="315" y="97" text-anchor="middle">2️⃣ 本次会话记忆</text><text x="315" y="120" text-anchor="middle" font-size="12" fill="#5b6478" font-weight="400">你说过“总是允许”</text>
      <rect x="440" y="70" width="170" height="64" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/><text x="525" y="97" text-anchor="middle">3️⃣ 模式开关</text><text x="525" y="120" text-anchor="middle" font-size="12" fill="#5b6478" font-weight="400">auto 自动放行</text>
      <rect x="650" y="70" width="210" height="64" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/><text x="755" y="97" text-anchor="middle">4️⃣ 问你本人</text><text x="755" y="120" text-anchor="middle" font-size="12" fill="#5b6478" font-weight="400">弹窗；没人应=拒绝</text>
    </g>
    <line x1="192" y1="102" x2="226" y2="102" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="402" y1="102" x2="436" y2="102" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="612" y1="102" x2="646" y2="102" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
    <text x="440" y="185" text-anchor="middle" font-size="14" fill="#5b6478">任何一站给出结论（✅放行 / ❌拒绝）→ 后面的站全部短路跳过</text>
  </svg>
  <p class="caption">所以 <code>rm -rf /</code> 在<b>任何配置</b>下都活不到第 2 站。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>工具调用进入闸门 check()<small>所有工具调用无一例外</small></p></div><div class="step"><span class="n">2</span><p>静态规则：rm -rf / 判 deny<small>第一站直接毙，后面全部短路</small></p></div><div class="step"><span class="n">3</span><p>npm install：规则说 ask → 查记忆<small>你之前说过「总是允许」？直接放行</small></p></div><div class="step"><span class="n">4</span><p>没有记忆 → 看 auto 开关 → 问你本人<small>没人应答（无头模式）= 拒绝</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>4</b><span>站，固定优先级次序</span></div><div class="stat"><b>40</b><span>行左右的核心裁决逻辑</span></div><div class="stat"><b>100%</b><span>灾难性命令在任何配置下被拒</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>顺序是设计出来的：静态规则先于交互，硬拒绝先于一切放行。</li><li>记忆是会话级的：「总是允许」只对当前会话生效。</li><li>弹窗缺席时宁可拒绝也不崩溃——安全退化。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>我想让某条命令永久放行？</dt><dd>弹窗选「总是允许」，本会话内记入记忆；跨会话的放行请用配置文件的权限规则。</dd><dt>auto 模式是不是很危险？</dt><dd>它跳过弹窗但跳不过静态规则：红灯在任何模式下都直接拒绝。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../14-quan-xian-zha-men-cai-jue-shun-xu-ying-ju-jue-ji-yi-mo-shi-auto-yu-ask-hui-tui.md">硬拒绝、记忆模式、auto 与 ASK 回退</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="13-shell-feng-xian-fen-lei-qi-safe-write-yu-destructive-san-ji-pan-ding.html">第 13 章 · 第一站的分类器细节</a><a href="15-shen-pi-jiao-hu-mian-tui-dui-hua-kuang-yu-wu-tou-mo-shi-de-chai-yi-hua-yu-yi.html">第 15 章 · 弹窗的两种宿主形态</a></div>

<nav class="nav">
<a href="13-shell-feng-xian-fen-lei-qi-safe-write-yu-destructive-san-ji-pan-ding.html">上一章：给每条命令判个级 ←</a>
<a href="index.html">返回目录</a>
<a href="15-shen-pi-jiao-hu-mian-tui-dui-hua-kuang-yu-wu-tou-mo-shi-de-chai-yi-hua-yu-yi.html">下一章：同一道闸门，两种前台 →</a>
</nav>
<footer>TinyCode 图解精读 · 14 / 27</footer>
</div></body></html>
`;export{n as default};
