const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第17章 · 长日志：掐中间，留两头 · TinyCode 图解精读</title>
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
<p class="crumb">第 17 章 / 27 · 上下文工程 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 17 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>长日志：掐中间，留两头</h1>
<p class="lede">构建日志开头是配置回显、结尾是报错摘要，中间是海量重复进度——所以截断策略是掐中间、留两头。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像整理会议纪要：开场（议题与出席）和结尾（决议与行动项）必须保留，中间两小时的讨论可以只写「此处略去 N 字」，但原始录音（工件）存档备查。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 190" role="img" aria-label="头尾保留截断"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="40"  y="50" width="180" height="70" rx="10" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="130" y="92" text-anchor="middle" font-size="16" font-weight="700">头部 ✅ 留</text>
    <rect x="240" y="50" width="300" height="70" rx="10" fill="#f0f2f7" stroke="#c9cfdb" stroke-width="3" stroke-dasharray="8 6"/>
    <text x="390" y="92" text-anchor="middle" font-size="15" fill="#8a92a6">[… 3 万字符被掐掉 …]</text>
    <rect x="560" y="50" width="180" height="70" rx="10" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="650" y="92" text-anchor="middle" font-size="16" font-weight="700">尾部 ✅ 留</text>
    <rect x="770" y="50" width="80" height="70" rx="10" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="810" y="80" text-anchor="middle" font-size="26">📁</text>
    <text x="810" y="105" text-anchor="middle" font-size="12" fill="#5b6478">全量存档</text>
    <line x1="222" y1="85" x2="236" y2="85" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="542" y1="85" x2="556" y2="85" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="742" y1="85" x2="766" y2="85" stroke="#f2b705" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#ar)"/>
    <text x="440" y="165" text-anchor="middle" font-size="14" fill="#5b6478">掐掉的内容一个字都不丢 —— 完整版写进磁盘工件，模型和人都能取回</text>
  </svg>
  <p class="caption">两道防线：工具内部 <span class="badge">10 万字符</span>护内存 → 上下文层 <span class="badge">3 万字符</span>护大脑。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>bash 跑了 npm test，输出 5 万字符<small>远超 3 万字符的上下文预算</small></p></div><div class="step"><span class="n">2</span><p>头部与尾部各留一半预算<small>错误摘要一定在尾部，绝不丢</small></p></div><div class="step"><span class="n">3</span><p>中间写回显式标记：[… N characters truncated …]<small>模型知道有洞，不会脑补</small></p></div><div class="step"><span class="n">4</span><p>完整输出生成工件文件，路径附在文末<small>你或模型按需取回全量</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>100,000</b><span>字符，工具内部流式捕获上限</span></div><div class="stat"><b>30,000</b><span>字符，进入上下文的预算</span></div><div class="stat"><b>1</b><span>份全量工件永远保留</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>内部 10 万字符上限是护 Node 进程内存的，与模型上下文无关。</li><li>截断发生在会话持久化之前：会话文件里存的是精简版。</li><li>工件是唯一的完整副本，人和模型都能按路径读取。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么不只保留头部？</dt><dd>测试失败的关键信息（错误摘要、失败用例）集中在尾部；只留头会恰好丢掉最有诊断价值的部分。</dd><dt>模型会假装看过中间内容吗？</dt><dd>不会。显式标记告诉它中间被截断了，它可以选择读取工件获取全量。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../17-gong-ju-jie-guo-jie-duan-ce-lue-tou-wei-bao-liu-yu-wan-zheng-shu-chu-gui-dang-wei-gong-jian.md">头尾保留与完整输出归档为工件</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="18-token-yu-suan-yu-zi-dong-ya-suo-hui-hua-zhai-yao-sheng-cheng-yu-bao-hu-chuang-kou.html">第 18 章 · 整个会话级别的预算与压缩</a><a href="09-dai-li-xun-huan-yu-gong-ju-zhi-xing-liu-shui-xian-cong-liu-shi-xiang-ying-dao-jie-guo-luo-pan.html">第 9 章 · 截断站在流水线的位置</a></div>

<nav class="nav">
<a href="16-an-quan-mo-xing-sheng-ming-shen-pi-ceng-jia-lu-jing-shou-wei-bing-fei-cao-zuo-xi-tong-sha-xiang.html">上一章：门卫不是监狱：安全的边界 ←</a>
<a href="index.html">返回目录</a>
<a href="18-token-yu-suan-yu-zi-dong-ya-suo-hui-hua-zhai-yao-sheng-cheng-yu-bao-hu-chuang-kou.html">下一章：行李箱超重：自动压缩 →</a>
</nav>
<footer>TinyCode 图解精读 · 17 / 27</footer>
</div></body></html>
`;export{n as default};
