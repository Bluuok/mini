const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第5章 · 干完就跑的无头模式 · TinyCode 图解精读</title>
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
<p class="crumb">第 5 章 / 27 · 快速入门 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 5 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>干完就跑的无头模式</h1>
<p class="lede">tinycode -p "一句话"：不进交互界面，执行完任务打印答案就退出。专为脚本和自动化设计。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像叫外卖 vs 下馆子：交互模式（TUI）是坐下来慢慢点菜；-p 模式是打包带走——说明放门口就走，没人接待你。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#eef4ff;"><span class="big">⌨️</span><code>tinycode -p "总结这个项目"</code></div>
    <div class="card" style="background:#fdeeee;"><span class="big">🚫</span><b>要批准？没人按按钮</b><small>无人值守时：宁可拒绝，不可臆测</small></div>
  </div>
  <p class="caption">所以无头模式下权限弹窗自动变成<b>默认拒绝</b>。想让它放开手脚，必须显式加 <code>--permission-mode auto</code>。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>tinycode -p "总结这个项目的结构"<small>提示词忘了加引号也能用，词会自动拼接</small></p></div><div class="step"><span class="n">2</span><p>它照常执行完整流程：读文件、调用工具<small>与交互模式唯一的区别是没有界面</small></p></div><div class="step"><span class="n">3</span><p>遇到需要人工批准的操作<small>无人值守，默认拒绝</small></p></div><div class="step"><span class="n">4</span><p>打印最终答案，进程退出<small>退出码可用于脚本判断成败</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>1 行</b><span>命令完成一次任务</span></div><div class="stat"><b>deny</b><span>无头模式下审批的默认结果</span></div><div class="stat"><b>auto</b><span>显式开启才允许自动批准</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>设计原则：无人值守时，宁可拒绝，不可臆测。</li><li>要放开手脚必须显式加 --permission-mode auto。</li><li>退出码和纯文本输出让它能安全地嵌入 CI 或脚本。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么我的操作被拒绝了？</dt><dd>无头模式没有弹窗可交互，需要人工批准的操作一律拒绝；确需自动批准请显式使用 auto 模式。</dd><dt>输出能被脚本解析吗？</dt><dd>最终答案就是标准输出的最后一段纯文本，配合退出码即可判断成败。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../05-ci-xing-mo-shi-p-wu-tou-yun-xing-yu-quan-xian-mo-ren-ju-jue-yu-yi.md">无头运行与权限默认拒绝语义</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="14-quan-xian-zha-men-cai-jue-shun-xu-ying-ju-jue-ji-yi-mo-shi-auto-yu-ask-hui-tui.html">第 14 章 · 审批裁决的完整顺序</a><a href="15-shen-pi-jiao-hu-mian-tui-dui-hua-kuang-yu-wu-tou-mo-shi-de-chai-yi-hua-yu-yi.html">第 15 章 · 两种宿主的差异语义</a></div>

<nav class="nav">
<a href="04-jiao-hu-shi-tui-shi-yong-zhi-nan-kuai-jie-jian-shu-ru-yu-xie-gang-ming-ling.html">上一章：一屏四块的终端界面 ←</a>
<a href="index.html">返回目录</a>
<a href="06-fen-ceng-jia-gou-di-tu-pi-yun-xing-shi-yu-tinycode-zi-yan-ceng-de-zhi-ze-bian-jie.html">下一章：三层三明治：引擎与规矩分离 →</a>
</nav>
<footer>TinyCode 图解精读 · 5 / 27</footer>
</div></body></html>
`;export{n as default};
