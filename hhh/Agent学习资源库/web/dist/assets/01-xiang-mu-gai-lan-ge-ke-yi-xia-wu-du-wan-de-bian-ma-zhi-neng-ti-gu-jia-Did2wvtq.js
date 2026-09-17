const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第1章 · 它是什么 · TinyCode 图解精读</title>
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
<p class="crumb">第 1 章 / 27 · 快速入门 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 1 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>它是什么</h1>
<p class="lede">TinyCode 是一个运行在终端里的编程助手：你用自然语言交代任务，它自己读代码、改文件、跑测试，再把结论交回给你。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像雇了一位常驻的工程助理。你只下需求，不盯过程。但他需要两样东西才能干活：一颗会推理的「大脑」——AI 模型，由 Pi 运行时负责接入；一套被严格约束的「手脚」——七件工具和一整套权限规则。TinyCode 就是后者的设计图。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#f5f0ff;"><span class="big">🧠</span>模型<b>大脑</b><small>别人提供（Pi / 各家 AI）</small></div>
    <div class="card" style="background:#eef4ff;"><span class="big">🛠️</span>工具<b>双手</b><small>7 件，真的能动你的文件</small></div>
    <div class="card" style="background:#fff7e6;"><span class="big">🚦</span>权限<b>刹车</b><small>危险动作先问你</small></div>
    <div class="card" style="background:#edfaf2;"><span class="big">📓</span>会话<b>记忆</b><small>关机也不丢</small></div>
  </div>
  <p class="caption">十个部件全都有：Model + Loop + Tools + Permission + Session + Context + Skill + MCP + 子代理 + TUI。<br>总共 <span class="badge">约 6 千行</span> —— 一个下午能读完，这是它存在的意义。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>打开终端，进入你的项目目录<small>它只在这个目录范围内活动</small></p></div><div class="step"><span class="n">2</span><p>输入任务：「修一下登录报错」<small>自然语言即可，不用记命令</small></p></div><div class="step"><span class="n">3</span><p>它自己读相关文件、提出改法、执行修改<small>每一步都会先经过权限检查</small></p></div><div class="step"><span class="n">4</span><p>跑测试验证，把过程和结论打印给你<small>你可以随时按 Ctrl+C 打断</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>≈6000</b><span>行源码，一个下午可读完</span></div><div class="stat"><b>10</b><span>个完整子系统</span></div><div class="stat"><b>396</b><span>行，最大的单文件</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>官方定位是 Coding Agent Harness（骨架/马具）：智能来自模型，工程约束来自骨架。</li><li>与 Claude Code 这类产品能力同构，区别在于全部源码可读，适合通读学习。</li><li>底层基于 Pi 运行时（pi-agent-core / pi-ai / pi-tui），循环机制不自己造轮子。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>它和我常用的 AI 网页助手有什么区别？</dt><dd>网页助手只能给建议；TinyCode 有「手」——在你授权后能真实读写文件、执行命令、跑测试，闭环完成任务。</dd><dt>它会乱动我电脑上的其他东西吗？</dt><dd>不会。它的工具被限定在你的项目目录内，危险操作还要经过审批，详见第 12、13、14 章。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../01-xiang-mu-gai-lan-ge-ke-yi-xia-wu-du-wan-de-bian-ma-zhi-neng-ti-gu-jia.md">一个可以一下午读完的编码智能体骨架</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="06-fen-ceng-jia-gou-di-tu-pi-yun-xing-shi-yu-tinycode-zi-yan-ceng-de-zhi-ze-bian-jie.html">第 6 章 · 分层架构：三层的职责划分</a><a href="13-shell-feng-xian-fen-lei-qi-safe-write-yu-destructive-san-ji-pan-ding.html">第 13 章 · 权限：危险动作怎么被拦住</a></div>

<nav class="nav">
<span style="opacity:.4">已是第一章</span>
<a href="index.html">返回目录</a>
<a href="02-kuai-su-kai-shi-an-zhuang-gou-jian-yu-mock-mo-shi-ling-pei-zhi-yun-xing.html">下一章：三条命令跑起来 →</a>
</nav>
<footer>TinyCode 图解精读 · 1 / 27</footer>
</div></body></html>
`;export{n as default};
