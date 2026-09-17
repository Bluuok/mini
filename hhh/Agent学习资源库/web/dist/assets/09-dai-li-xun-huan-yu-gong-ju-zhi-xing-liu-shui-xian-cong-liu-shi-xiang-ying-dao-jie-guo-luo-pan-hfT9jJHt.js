const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第9章 · 一句话的完整旅行 · TinyCode 图解精读</title>
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
<p class="crumb">第 9 章 / 27 · 智能体运行时 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 9 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>一句话的完整旅行</h1>
<p class="lede">从你按下回车到结果写进硬盘，一共八站。没干完就带着新结果回炉，再走一遍。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一趟跨境快递：揽件（你的指令）→ 分拣（模型推理）→ 生成运单（工具调用）→ 海关查验（权限裁决）→ 派送（真实执行）→ 称重贴标（截断归档）→ 回单确认（结果喂回）→ 归档（落盘）。中转站里有两个是 TinyCode 加装的。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 190" role="img" aria-label="数据旅程"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <g font-size="14.5" font-weight="700">
      <rect x="14"  y="60" width="94" height="60" rx="10" fill="#eef4ff" stroke="#3b82f6" stroke-width="2.5"/><text x="61"  y="86" text-anchor="middle">🗣️ 你</text><text x="61" y="106" text-anchor="middle" font-size="11" fill="#5b6478" font-weight="400">下指令</text>
      <rect x="122" y="60" width="94" height="60" rx="10" fill="#f5f0ff" stroke="#8b5cf6" stroke-width="2.5"/><text x="169" y="86" text-anchor="middle">🧠 想</text><text x="169" y="106" text-anchor="middle" font-size="11" fill="#5b6478" font-weight="400">流式吐字</text>
      <rect x="230" y="60" width="94" height="60" rx="10" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/><text x="277" y="86" text-anchor="middle">🎫 点菜</text><text x="277" y="106" text-anchor="middle" font-size="11" fill="#5b6478" font-weight="400">工具调用</text>
      <rect x="338" y="60" width="94" height="60" rx="10" fill="#fdeeee" stroke="#e5484d" stroke-width="2.5"/><text x="385" y="86" text-anchor="middle">🚦 查票</text><text x="385" y="106" text-anchor="middle" font-size="11" fill="#5b6478" font-weight="400">权限裁决</text>
      <rect x="446" y="60" width="94" height="60" rx="10" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/><text x="493" y="86" text-anchor="middle">🛠️ 干活</text><text x="493" y="106" text-anchor="middle" font-size="11" fill="#5b6478" font-weight="400">真执行</text>
      <rect x="554" y="60" width="94" height="60" rx="10" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/><text x="601" y="86" text-anchor="middle">✂️ 打包</text><text x="601" y="106" text-anchor="middle" font-size="11" fill="#5b6478" font-weight="400">截断+归档</text>
      <rect x="662" y="60" width="94" height="60" rx="10" fill="#f5f0ff" stroke="#8b5cf6" stroke-width="2.5"/><text x="709" y="86" text-anchor="middle">🧠 再想</text><text x="709" y="106" text-anchor="middle" font-size="11" fill="#5b6478" font-weight="400">结果喂回</text>
      <rect x="770" y="60" width="96" height="60" rx="10" fill="#f0f2f7" stroke="#c9cfdb" stroke-width="2.5"/><text x="818" y="86" text-anchor="middle">💾 落盘</text><text x="818" y="106" text-anchor="middle" font-size="11" fill="#5b6478" font-weight="400">写进会话</text>
    </g>
    <line x1="110" y1="90" x2="118" y2="90" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="218" y1="90" x2="226" y2="90" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="326" y1="90" x2="334" y2="90" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="434" y1="90" x2="442" y2="90" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="542" y1="90" x2="550" y2="90" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="650" y1="90" x2="658" y2="90" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="758" y1="90" x2="766" y2="90" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <path d="M 709 124 Q 709 160 169 160 Q 169 140 169 126" fill="none" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#ar)"/>
    <text x="440" y="178" text-anchor="middle" font-size="13.5" fill="#8b5cf6">没干完？带着新结果回到「想」，再走一遍</text>
  </svg>
  <p class="caption">控制流全在 Pi 手里；TinyCode 的三个钩子守在「查票」「打包」「落盘」三个站台上。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>你输入指令<small>第 1 站：进入循环</small></p></div><div class="step"><span class="n">2</span><p>模型流式吐字，边想边说<small>第 2-3 站：推理与生成调用计划</small></p></div><div class="step"><span class="n">3</span><p>权限裁决 → 真实执行 → 截断归档<small>第 4-6 站：TinyCode 的钩子站岗</small></p></div><div class="step"><span class="n">4</span><p>结果喂回模型；若未完成则再走一轮<small>第 7-8 站：直到回答你并落盘</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>8</b><span>站，一次 prompt 的全程</span></div><div class="stat"><b>3</b><span>站由 TinyCode 钩子值守</span></div><div class="stat"><b>2</b><span>条落盘路径：转录 + JSONL</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>流式输出、调用解析、并发执行都由 Pi 的双层循环驱动。</li><li>工具结果同时写进内存转录与磁盘会话文件，两条路互为备份。</li><li>循环的终止条件由模型自己判断：不再发起工具调用即结束。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>一轮循环最多走多少次？</dt><dd>由模型判断任务是否完成；权限或错误会提前终结某一站，循环整体有 Pi 的兜底约束。</dd><dt>中途断电会丢什么？</dt><dd>已定稿的消息已落盘，未完成的这一站在下次会话恢复时从上次定稿处继续。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../09-dai-li-xun-huan-yu-gong-ju-zhi-xing-liu-shui-xian-cong-liu-shi-xiang-ying-dao-jie-guo-luo-pan.md">从流式响应到结果落盘</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="08-tinycoderuntime-jie-pou-wu-ge-ce-lue-gou-zi-jie-ru-pi-dai-li-xun-huan.html">第 8 章 · 五根线是怎么接上的</a><a href="19-zhui-jia-shi-jsonl-cun-chu-beng-kui-an-quan-de-hui-hua-chi-jiu-hua-she-ji.html">第 19 章 · 落盘的文件长什么样</a></div>

<nav class="nav">
<a href="08-tinycoderuntime-jie-pou-wu-ge-ce-lue-gou-zi-jie-ru-pi-dai-li-xun-huan.html">上一章：五根线，插进转圈圈 ←</a>
<a href="index.html">返回目录</a>
<a href="10-qi-da-nei-zhi-gong-ju-xiang-jie-read-edit-bash-deng-de-xing-wei-qi-yue.html">下一章：七件工具，三个工位 →</a>
</nav>
<footer>TinyCode 图解精读 · 9 / 27</footer>
</div></body></html>
`;export{t as default};
