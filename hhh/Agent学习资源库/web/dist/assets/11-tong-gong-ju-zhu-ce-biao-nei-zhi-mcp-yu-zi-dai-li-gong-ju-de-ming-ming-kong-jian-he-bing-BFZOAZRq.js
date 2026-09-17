const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第11章 · 一张桌子，四个来源 · TinyCode 图解精读</title>
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
<p class="crumb">第 11 章 / 27 · 工具体系 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 11 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>一张桌子，四个来源</h1>
<p class="lede">不管工具来自内置、技能、子代理还是外部 MCP 服务器，模型看到的永远是一张扁平的工具菜单。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像酒店总机转接：客人（模型）只面对一个总机号码，内线来自客房部、餐厅还是外包服务商它不关心；重名的分机由总机强制改名（加前缀），绝不出现两个「8888」。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#f0f2f7;">🛠️ 内置七件</div>
    <div class="card" style="background:#fff7e6;">📖 load_skill</div>
    <div class="card" style="background:#f5f0ff;">🐝 子代理四件 spawn/list/wait/close</div>
    <div class="card" style="background:#edfaf2;">🔌 MCP 外部工具</div>
  </div>
  <p class="caption">重名？<b>当场报错</b>绝不悄悄覆盖；外部重名的自动改名 <code>服务器名_工具名</code>。菜单顺序永远一致，AI 不会看花眼。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>启动时装入内置七件工具<small>第一批入座</small></p></div><div class="step"><span class="n">2</span><p>技能系统提供 load_skill<small>第二批：加载技能说明书</small></p></div><div class="step"><span class="n">3</span><p>子代理提供 spawn/list/wait/close<small>第三批：派遣与回收</small></p></div><div class="step"><span class="n">4</span><p>MCP 外部工具最后入座，撞名自动加前缀<small>服务器名_工具名，冲突消解</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>1</b><span>张扁平菜单（Map 表）</span></div><div class="stat"><b>0</b><span>次静默覆盖：重名即报错</span></div><div class="stat"><b>固定</b><span>菜单顺序，利于模型复现</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>注册表实现只有三十余行，两条铁律：唯一性 fail-fast、插入序稳定。</li><li>顺序稳定让模型每次会话看到的工具列表完全一致，调用行为可复现。</li><li>子代理工作线程刻意使用另一张独立注册表，避免与主线程互相污染。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>两个工具重名了怎么办？</dt><dd>内置来源之间重名直接抛错（必须在装配期解决）；外部 MCP 与内置撞名则自动加前缀区分。</dd><dt>模型怎么知道该用哪个工具？</dt><dd>每个工具的说明书（参数 schema + 描述）都在菜单里，模型按描述选择；这也是工具描述要写清楚的原因。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../11-tong-gong-ju-zhu-ce-biao-nei-zhi-mcp-yu-zi-dai-li-gong-ju-de-ming-ming-kong-jian-he-bing.md">内置、MCP 与子代理工具的命名空间合并</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="21-ji-neng-xi-tong-skill-md-fa-xian-yu-load_skill-jian-jin-shi-pi-lu.html">第 21 章 · load_skill 这件工具的来历</a><a href="22-mcp-ji-cheng-stdio-fu-wu-qi-bing-xing-lian-jie-yu-dan-dian-gu-zhang-ge-chi.html">第 22 章 · 外部工具怎么安全接入</a></div>

<nav class="nav">
<a href="10-qi-da-nei-zhi-gong-ju-xiang-jie-read-edit-bash-deng-de-xing-wei-qi-yue.html">上一章：七件工具，三个工位 ←</a>
<a href="index.html">返回目录</a>
<a href="12-gong-zuo-qu-lu-jing-shou-wei-fu-hao-lian-jie-gan-zhi-de-shuang-ce-realpath-xiao-yan.html">下一章：小抄骗不过双面镜 →</a>
</nav>
<footer>TinyCode 图解精读 · 11 / 27</footer>
</div></body></html>
`;export{n as default};
