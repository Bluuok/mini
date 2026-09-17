const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第6章 · 三层三明治：引擎与规矩分离 · TinyCode 图解精读</title>
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
<p class="crumb">第 6 章 / 27 · 架构总览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 6 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>三层三明治：引擎与规矩分离</h1>
<p class="lede">整个项目分三层：表现层（界面）、策略层（规矩）、内核层（引擎）。依赖箭头只准从上往下。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一家连锁餐厅：内核层是标准化中央厨房（Pi 提供炒菜流水线），策略层是本店菜单和食安规范（TinyCode 自研），表现层是门面和服务员（终端界面）。中央厨房不认识顾客，服务员不进厨房改菜谱。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 300" role="img" aria-label="三层架构"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="140" y="20" width="600" height="70" rx="14" fill="#eef4ff" stroke="#3b82f6" stroke-width="3"/>
    <text x="440" y="50" text-anchor="middle" font-size="19" font-weight="700">🎨 表现层（自研）</text>
    <text x="440" y="75" text-anchor="middle" font-size="14" fill="#5b6478">TUI 界面 · CLI 命令行</text>
    <rect x="140" y="115" width="600" height="70" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="440" y="145" text-anchor="middle" font-size="19" font-weight="700">📋 策略层（自研精华）</text>
    <text x="440" y="170" text-anchor="middle" font-size="14" fill="#5b6478">权限 · 截断 · 压缩 · 落盘 · 工具</text>
    <rect x="140" y="210" width="600" height="70" rx="14" fill="#f5f0ff" stroke="#8b5cf6" stroke-width="3"/>
    <text x="440" y="240" text-anchor="middle" font-size="19" font-weight="700">🚂 内核层（Pi 库）</text>
    <text x="440" y="265" text-anchor="middle" font-size="14" fill="#5b6478">代理循环 · 流式 · 工具调用机制</text>
    <line x1="440" y1="92" x2="440" y2="110" stroke="#1a2233" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="440" y1="187" x2="440" y2="205" stroke="#1a2233" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption"><b>循环怎么转，全归 Pi 管；转的时候守什么规矩，归 TinyCode 管。</b>这就是它只有 6 千行的秘密。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>你在界面输入需求<small>表现层：只负责收发</small></p></div><div class="step"><span class="n">2</span><p>需求进入策略层：先过权限、后接结果<small>策略层：TinyCode 的精华都在这</small></p></div><div class="step"><span class="n">3</span><p>策略层把标准化的调用递给 Pi 循环<small>内核层：流式响应、工具调用机制</small></p></div><div class="step"><span class="n">4</span><p>结果原路返回，逐层上抛<small>箭头只允许从上往下，绝不反向侵入</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3</b><span>层，职责边界清晰</span></div><div class="stat"><b>5</b><span>个注入点：策略进内核的全部入口</span></div><div class="stat"><b>0</b><span>行内核代码被复制或重写</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>「何时停止」「如何解析工具调用」这些控制流全部归 Pi，TinyCode 零重写。</li><li>策略对内核的介入只经过五个明确定义的扩展点。</li><li>这是整个项目能保持 6 千行的根本原因：不造轮子，只定规矩。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么不自己写循环？</dt><dd>循环的通用机制（流式、解析、终止）又难又通用，Pi 已经做好并经过验证；TinyCode 的价值在策略，不在重复造轮子。</dd><dt>策略会破坏内核的稳定性吗？</dt><dd>不会。策略只能通过五个注入点介入，内核行为可预测，升级 Pi 也不影响策略层。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../06-fen-ceng-jia-gou-di-tu-pi-yun-xing-shi-yu-tinycode-zi-yan-ceng-de-zhi-ze-bian-jie.md">Pi 运行时与 TinyCode 自研层的职责边界</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="08-tinycoderuntime-jie-pou-wu-ge-ce-lue-gou-zi-jie-ru-pi-dai-li-xun-huan.html">第 8 章 · 五个注入点的具体接线</a><a href="07-harness-zhuang-pei-liu-cheng-bootstrap-ru-he-chuan-lian-quan-bu-zi-xi-tong.html">第 7 章 · 装配层怎么把它们拼起来</a></div>

<nav class="nav">
<a href="05-ci-xing-mo-shi-p-wu-tou-yun-xing-yu-quan-xian-mo-ren-ju-jue-yu-yi.html">上一章：干完就跑的无头模式 ←</a>
<a href="index.html">返回目录</a>
<a href="07-harness-zhuang-pei-liu-cheng-bootstrap-ru-he-chuan-lian-quan-bu-zi-xi-tong.html">下一章：总装车间 bootstrap.ts →</a>
</nav>
<footer>TinyCode 图解精读 · 6 / 27</footer>
</div></body></html>
`;export{n as default};
