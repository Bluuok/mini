const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第20章 · 新本子、旧本子、换本子 · TinyCode 图解精读</title>
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
<p class="crumb">第 20 章 / 27 · 会话管理 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 20 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>新本子、旧本子、换本子</h1>
<p class="lede">命令行参数先折叠成二选一（新建 / 接旧），装配层据此决定开新文件还是挂载旧历史，界面里还能随时轮换。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像体检本：新体检开新本子（裸启动）；「接着上次的查」必须出示身份证（--continue 按当前项目目录匹配）；体检中途想换新本子（/new），旧本子归档保留，绝不撕毁。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#eef4ff;"><span class="big">▶️</span><b>tinycode 裸启动</b><small>总是开新本子</small></div>
    <div class="card" style="background:#edfaf2;"><span class="big">↩️</span><b>--continue</b><small>只接<b>本项目</b>最近的旧本子</small></div>
    <div class="card" style="background:#fff7e6;"><span class="big">🔄</span><b>/new</b><small>界面里换新本子，旧本子永不撕</small></div>
  </div>
  <p class="caption"><code>--continue</code> 按<b>当前目录</b>匹配 —— 在 A 项目敲它，绝不会接出 B 项目的对话。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>tinycode 裸启动<small>总是开新本子，最可预期</small></p></div><div class="step"><span class="n">2</span><p>tinycode --continue<small>在当前项目目录找最近的会话接上</small></p></div><div class="step"><span class="n">3</span><p>在 A 项目敲 --continue<small>绝不会接出 B 项目的对话——目录隔离</small></p></div><div class="step"><span class="n">4</span><p>界面里 /new 或 /resume<small>进程内轮换，旧文件永不删除</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>2</b><span>种入口形态：new / attach</span></div><div class="stat"><b>1</b><span>个匹配维度：当前工作目录</span></div><div class="stat"><b>0</b><span>个会话文件会被自动删除</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>CLI 解析层把三种参数归约为二选一的 SessionOption。</li><li>attach 只读加载历史，不会重放或改写旧记录。</li><li>/new 之后工具调用依然可用——轮换的是本子，不是能力。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>--continue 找不到历史会话怎么办？</dt><dd>stderr 提示后自动改为新建会话，不会报错中断。</dd><dt>两个项目的历史会混吗？</dt><dd>不会。会话按项目目录隔离，--continue 只匹配当前目录的记录。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../20-hui-hua-sheng-ming-zhou-qi-xin-jian-continue-mu-lu-pi-pei-yu-new-lun-huan.md">新建、--continue 目录匹配与 /new 轮换</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="19-zhui-jia-shi-jsonl-cun-chu-beng-kui-an-quan-de-hui-hua-chi-jiu-hua-she-ji.html">第 19 章 · 本子的纸张为什么撕不坏</a><a href="04-jiao-hu-shi-tui-shi-yong-zhi-nan-kuai-jie-jian-shu-ru-yu-xie-gang-ming-ling.html">第 4 章 · 界面里的会话命令</a></div>

<nav class="nav">
<a href="19-zhui-jia-shi-jsonl-cun-chu-beng-kui-an-quan-de-hui-hua-chi-jiu-hua-she-ji.html">上一章：只加页、不撕页的日记本 ←</a>
<a href="index.html">返回目录</a>
<a href="21-ji-neng-xi-tong-skill-md-fa-xian-yu-load_skill-jian-jin-shi-pi-lu.html">下一章：先看菜单，点菜才上菜 →</a>
</nav>
<footer>TinyCode 图解精读 · 20 / 27</footer>
</div></body></html>
`;export{n as default};
