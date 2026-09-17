const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第12章 · 小抄骗不过双面镜 · TinyCode 图解精读</title>
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
<p class="crumb">第 12 章 / 27 · 工具体系 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 12 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>小抄骗不过双面镜</h1>
<p class="lede">符号链接是路径的「小抄」：字面上在项目里，实际指向项目外。守卫的办法是把比较的两边都还原成真实磁盘位置再判定。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像海关查行李的目的地：票面上写「市内」（词法检查通过），但真身是一张飞往境外的机票。守卫不看票面，直接查两个人的真实身份证（双侧 realpath），比对实际去向。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 240" role="img" aria-label="双侧 realpath"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="30" y="50" width="250" height="130" rx="16" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="155" y="95" text-anchor="middle" font-size="17" font-weight="700">🪤 小抄陷阱</text>
    <text x="155" y="125" text-anchor="middle" font-size="14" fill="#5b6478">项目里的链接</text>
    <text x="155" y="150" text-anchor="middle" font-size="13.5" font-family="monospace">link → /tmp/secret</text>
    <rect x="340" y="50" width="220" height="130" rx="16" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="450" y="100" text-anchor="middle" font-size="17" font-weight="700">🪞 双面镜</text>
    <text x="450" y="130" text-anchor="middle" font-size="14" fill="#5b6478">两边都查真身</text>
    <text x="450" y="155" text-anchor="middle" font-size="13.5" font-family="monospace">realpath(两边)</text>
    <rect x="620" y="50" width="230" height="130" rx="16" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="735" y="100" text-anchor="middle" font-size="17" font-weight="700">✅ 结果</text>
    <text x="735" y="130" text-anchor="middle" font-size="14" fill="#5b6478">真身在项目外？</text>
    <text x="735" y="155" text-anchor="middle" font-size="14" fill="#2fae6d" font-weight="700">拒绝 ❌</text>
    <line x1="282" y1="115" x2="336" y2="115" stroke="#1a2233" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="562" y1="115" x2="616" y2="115" stroke="#1a2233" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">对「已存在 / 悬空链接 / 还不存在」三种目标分别处理，七个内置工具全部走这道门。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>模型给出路径 project/link.txt<small>词法上看完全在项目内</small></p></div><div class="step"><span class="n">2</span><p>守卫对它做 realpath：真身是 /tmp/secret<small>小抄被照出原形</small></p></div><div class="step"><span class="n">3</span><p>项目根也做 realpath，排除根自身是链接的情况<small>两侧都验，不偏袒</small></p></div><div class="step"><span class="n">4</span><p>真身越界 → 拒绝访问<small>已存在/悬空/尚不存在三种情况分别处理</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>≈100</b><span>行，路径守卫全部代码</span></div><div class="stat"><b>2</b><span>侧，都做 realpath 规范化</span></div><div class="stat"><b>7/7</b><span>内置工具全部走这道门</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>悬空链接（指向不存在的目标）单独处理，不会被误判为「项目内」。</li><li>遍历层还有纵深防御：目录遍历也遵循同样的边界检查。</li><li>权限闸门管「审批」，路径守卫管「边界」——职责分工明确。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么不能只做字符串检查？</dt><dd>符号链接的字面形态完全合法，只有还原到磁盘真身才能发现越界；这是文件系统级的安全常识。</dd><dt>守卫会拖慢文件操作吗？</dt><dd>realpath 是本地系统调用，微秒级；相比安全收益完全可以忽略。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../12-gong-zuo-qu-lu-jing-shou-wei-fu-hao-lian-jie-gan-zhi-de-shuang-ce-realpath-xiao-yan.md">符号链接感知的双侧 realpath 校验</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="13-shell-feng-xian-fen-lei-qi-safe-write-yu-destructive-san-ji-pan-ding.html">第 13 章 · bash 命令的另一道审查</a><a href="16-an-quan-mo-xing-sheng-ming-shen-pi-ceng-jia-lu-jing-shou-wei-bing-fei-cao-zuo-xi-tong-sha-xiang.html">第 16 章 · 这套机制的边界声明</a></div>

<nav class="nav">
<a href="11-tong-gong-ju-zhu-ce-biao-nei-zhi-mcp-yu-zi-dai-li-gong-ju-de-ming-ming-kong-jian-he-bing.html">上一章：一张桌子，四个来源 ←</a>
<a href="index.html">返回目录</a>
<a href="13-shell-feng-xian-fen-lei-qi-safe-write-yu-destructive-san-ji-pan-ding.html">下一章：给每条命令判个级 →</a>
</nav>
<footer>TinyCode 图解精读 · 12 / 27</footer>
</div></body></html>
`;export{n as default};
