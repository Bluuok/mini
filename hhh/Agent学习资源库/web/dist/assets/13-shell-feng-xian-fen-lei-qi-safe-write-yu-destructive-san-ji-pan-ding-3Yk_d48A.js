const a=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第13章 · 给每条命令判个级 · TinyCode 图解精读</title>
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
<p class="crumb">第 13 章 / 27 · 权限与安全 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 13 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>给每条命令判个级</h1>
<p class="lede">模型每次想执行 bash 命令，先经过一个约百行的纯函数交警：只看命令字符串，就开出 safe / write / destructive 三级罚单。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像机场安检的风险分级： laptop 单独过检（写操作要重点看），可疑物品开箱（危险操作直接拦），多数随身物品直接过（只读命令放行）。安检员给结论时还会说明理由，方便复核。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#edfaf2;"><span class="big">🟢</span><b>safe 放行</b><small>ls · cat · git status</small></div>
    <div class="card" style="background:#fff7e6;"><span class="big">🟡</span><b>write 先问</b><small>npm install · 会改东西的命令</small></div>
    <div class="card" style="background:#fdeeee;"><span class="big">🔴</span><b>destructive 拒</b><small>rm -rf · 强制推送</small></div>
  </div>
  <p class="caption">它自报家门：<b>启发式路由器</b> —— 负责在「放行」和「问你」之间指路，不是保险箱。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>模型提交命令 git status<small>分类器解析：纯只读</small></p></div><div class="step"><span class="n">2</span><p>判定 safe，附理由「只读命令」<small>绿灯：后续直接放行</small></p></div><div class="step"><span class="n">3</span><p>换一条 npm install foo<small>命中写操作特征 → 黄灯</small></p></div><div class="step"><span class="n">4</span><p>再换 rm -rf /<small>命中毁灭性模式 → 红灯，无条件拒绝</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3</b><span>级：safe / write / destructive</span></div><div class="stat"><b>100</b><span>行左右的纯函数，无副作用</span></div><div class="stat"><b>1</b><span>份人类可读的判定理由</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>它是启发式路由器：负责在「放行」与「问你」之间指路，不是操作系统沙箱。</li><li>无状态、无副作用，唯一的调用方是静态规则求值器。</li><li>分类理由会展示在审批弹窗里，帮你判断要不要放行。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>分类错了怎么办？</dt><dd>启发式总有边界：判轻了会被下一站的审批拦住（ask 模式），判重了最多多问一次——宁可多问，不可漏拦。</dd><dt>管道命令怎么判？</dt><dd>整条命令一起解析，取其中最危险的一段定级；拼接不会稀释风险。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../13-shell-feng-xian-fen-lei-qi-safe-write-yu-destructive-san-ji-pan-ding.md">safe、write 与 destructive 三级判定</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="14-quan-xian-zha-men-cai-jue-shun-xu-ying-ju-jue-ji-yi-mo-shi-auto-yu-ask-hui-tui.html">第 14 章 · 三级判定之后怎么裁决</a><a href="16-an-quan-mo-xing-sheng-ming-shen-pi-ceng-jia-lu-jing-shou-wei-bing-fei-cao-zuo-xi-tong-sha-xiang.html">第 16 章 · 这套机制的边界声明</a></div>

<nav class="nav">
<a href="12-gong-zuo-qu-lu-jing-shou-wei-fu-hao-lian-jie-gan-zhi-de-shuang-ce-realpath-xiao-yan.html">上一章：小抄骗不过双面镜 ←</a>
<a href="index.html">返回目录</a>
<a href="14-quan-xian-zha-men-cai-jue-shun-xu-ying-ju-jue-ji-yi-mo-shi-auto-yu-ask-hui-tui.html">下一章：排队规则：谁先发言谁说了算 →</a>
</nav>
<footer>TinyCode 图解精读 · 13 / 27</footer>
</div></body></html>
`;export{a as default};
