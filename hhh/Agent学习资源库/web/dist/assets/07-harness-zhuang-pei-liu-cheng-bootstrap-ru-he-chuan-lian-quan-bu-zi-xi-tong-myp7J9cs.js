const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第7章 · 总装车间 bootstrap.ts · TinyCode 图解精读</title>
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
<p class="crumb">第 7 章 / 27 · 架构总览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 7 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>总装车间 bootstrap.ts</h1>
<p class="lede">243 行的装配工：把散落在十几个目录里的零件，按正确顺序拼成一个完整的 Harness（背包）。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像汽车总装线：发动机、变速箱、底盘各自造好，总装线不发明任何零件，只负责按工艺顺序把它们装到一起，最后整车下线——这辆车同时交给家用司机（TUI）和网约车平台（无头模式）。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#f0f2f7;"><span class="big">🛠️⚙️🚦📓🧳📖🔌🐝</span>零件们<small>工具/权限/会话/上下文/技能/MCP/子代理</small></div>
    <div style="align-self:center;font-size:30px;">→</div>
    <div class="card" style="background:#edfaf2;"><span class="big">🎒 Harness</span><small>界面和无头模式共用这一个包</small></div>
  </div>
  <p class="caption">它自己<b>不干活</b>，只负责按正确顺序把零件递给彼此 —— 术语叫「组合根」。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>读取配置（三层来源合成一份）<small>配置先就位，后面的零件才知道参数</small></p></div><div class="step"><span class="n">2</span><p>依次构造：工具 → 权限 → 上下文 → 会话<small>依赖顺序不能乱</small></p></div><div class="step"><span class="n">3</span><p>挂接策略钩子，构造 TinyCodeRuntime<small>最后一件拼图</small></p></div><div class="step"><span class="n">4</span><p>把完成的 Harness 交给界面或无头模式<small>两种宿主，同一辆『车』</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>243</b><span>行，全部装配逻辑</span></div><div class="stat"><b>1</b><span>个组合根，服务所有宿主</span></div><div class="stat"><b>0</b><span>行业务逻辑混入</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>它自己不干活：只构造对象、传递引用，术语叫「组合根」。</li><li>交互式 TUI、无头 -p、--list-models 共享同一个装配产物。</li><li>想理解系统全貌，先读这一个文件就够了。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么装配逻辑单独一个文件？</dt><dd>集中才能保证依赖顺序正确、避免循环依赖；散落在各模块里就没人能说清全貌了。</dd><dt>加一个新子系统要动多少地方？</dt><dd>在装配线末尾插一段构造代码，再注册到注入点即可，不碰内核。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../07-harness-zhuang-pei-liu-cheng-bootstrap-ru-he-chuan-lian-quan-bu-zi-xi-tong.md">bootstrap 如何串联全部子系统</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="08-tinycoderuntime-jie-pou-wu-ge-ce-lue-gou-zi-jie-ru-pi-dai-li-xun-huan.html">第 8 章 · 装配的最后一站：运行时</a><a href="06-fen-ceng-jia-gou-di-tu-pi-yun-xing-shi-yu-tinycode-zi-yan-ceng-de-zhi-ze-bian-jie.html">第 6 章 · 三层职责：装配在其中的位置</a></div>

<nav class="nav">
<a href="06-fen-ceng-jia-gou-di-tu-pi-yun-xing-shi-yu-tinycode-zi-yan-ceng-de-zhi-ze-bian-jie.html">上一章：三层三明治：引擎与规矩分离 ←</a>
<a href="index.html">返回目录</a>
<a href="08-tinycoderuntime-jie-pou-wu-ge-ce-lue-gou-zi-jie-ru-pi-dai-li-xun-huan.html">下一章：五根线，插进转圈圈 →</a>
</nav>
<footer>TinyCode 图解精读 · 7 / 27</footer>
</div></body></html>
`;export{n as default};
