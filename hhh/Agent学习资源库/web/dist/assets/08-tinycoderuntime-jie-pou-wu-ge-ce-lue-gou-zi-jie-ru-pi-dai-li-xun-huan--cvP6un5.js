const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第8章 · 五根线，插进转圈圈 · TinyCode 图解精读</title>
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
<p class="crumb">第 8 章 / 27 · 智能体运行时 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 8 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>五根线，插进转圈圈</h1>
<p class="lede">103 行的接线板：代理循环还是 Pi 的循环，TinyCode 的规矩从五个口注入。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像小区物业给市政水管加装五种阀门：水还是市政的水（循环控制流不变），但进楼前过滤（权限）、出水后计量（截断）、水压过高泄压（压缩）、全程抄表（事件订阅）——管道本身一根不改。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 320" role="img" aria-label="五个钩子"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <circle cx="440" cy="160" r="86" fill="none" stroke="#8b5cf6" stroke-width="6" stroke-dasharray="14 10"/>
    <text x="440" y="152" text-anchor="middle" font-size="22" font-weight="700">🚂 Pi 循环</text>
    <text x="440" y="180" text-anchor="middle" font-size="13" fill="#5b6478">控制流不许碰</text>
    <g font-size="15" font-weight="700">
      <rect x="30"  y="40"  width="230" height="46" rx="10" fill="#eef4ff" stroke="#3b82f6" stroke-width="2.5"/><text x="145" y="69"  text-anchor="middle">1️⃣ streamFn 发请求</text>
      <rect x="620" y="40"  width="230" height="46" rx="10" fill="#fdeeee" stroke="#e5484d" stroke-width="2.5"/><text x="735" y="69"  text-anchor="middle">2️⃣ beforeToolCall 权限</text>
      <rect x="30"  y="234" width="230" height="46" rx="10" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/><text x="145" y="263" text-anchor="middle">3️⃣ afterToolCall 截断</text>
      <rect x="620" y="234" width="230" height="46" rx="10" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/><text x="735" y="263" text-anchor="middle">4️⃣ transformContext 压缩</text>
    </g>
    <line x1="262" y1="63"  x2="366" y2="118" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="618" y1="63"  x2="514" y2="118" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="262" y1="257" x2="366" y2="202" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="618" y1="257" x2="514" y2="202" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
    <text x="440" y="305" text-anchor="middle" font-size="15" fill="#5b6478">5️⃣ onEvent 订阅事件 → 界面跟着动 + 会话跟着记</text>
  </svg>
  <p class="caption">每个钩子只在固定时机被叫一声，回答完就退下 —— <b>策略</b>，不是<b>控制流</b>。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>模型请求前：transformContext 检查预算<small>必要时先压缩上下文</small></p></div><div class="step"><span class="n">2</span><p>模型要求调用工具：beforeToolCall 拦下裁决<small>红灯直接拒绝，黄灯转问用户</small></p></div><div class="step"><span class="n">3</span><p>工具执行完：afterToolCall 截断超长结果<small>全量另存为工件</small></p></div><div class="step"><span class="n">4</span><p>全程 onEvent 订阅事件<small>界面实时渲染，会话实时落盘</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>103</b><span>行，运行时全部代码</span></div><div class="stat"><b>5</b><span>个钩子，覆盖一次循环的关键时机</span></div><div class="stat"><b>1</b><span>个必填项 streamFn 负责传输</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>每个钩子只在固定时机被调用，回答完立即退场——是策略，不是控制流。</li><li>没选用的钩子（如终止判定）完全沿用 Pi 的默认语义。</li><li>ARCHITECTURE.md 的集成点表格与源码一一对应，可对照验证。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>钩子执行出错会怎样？</dt><dd>错误按 Pi 定义的事件体系上报，不会让循环失速；权限钩子的「拒绝」本身就是正常返回值。</dd><dt>能再加第六个钩子吗？</dt><dd>Pi 还预留了其他扩展点（如 shouldStopAfterTurn），按需启用即可，不需要改内核。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../08-tinycoderuntime-jie-pou-wu-ge-ce-lue-gou-zi-jie-ru-pi-dai-li-xun-huan.md">五个策略钩子接入 Pi 代理循环</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="09-dai-li-xun-huan-yu-gong-ju-zhi-xing-liu-shui-xian-cong-liu-shi-xiang-ying-dao-jie-guo-luo-pan.html">第 9 章 · 钩子之间发生了什么</a><a href="06-fen-ceng-jia-gou-di-tu-pi-yun-xing-shi-yu-tinycode-zi-yan-ceng-de-zhi-ze-bian-jie.html">第 6 章 · 为什么策略不写成控制流</a></div>

<nav class="nav">
<a href="07-harness-zhuang-pei-liu-cheng-bootstrap-ru-he-chuan-lian-quan-bu-zi-xi-tong.html">上一章：总装车间 bootstrap.ts ←</a>
<a href="index.html">返回目录</a>
<a href="09-dai-li-xun-huan-yu-gong-ju-zhi-xing-liu-shui-xian-cong-liu-shi-xiang-ying-dao-jie-guo-luo-pan.html">下一章：一句话的完整旅行 →</a>
</nav>
<footer>TinyCode 图解精读 · 8 / 27</footer>
</div></body></html>
`;export{n as default};
