const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第15章 · 同一道闸门，两种前台 · TinyCode 图解精读</title>
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
<p class="crumb">第 15 章 / 27 · 权限与安全 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 15 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>同一道闸门，两种前台</h1>
<p class="lede">有没有人能按按钮，决定了「问一下」变成什么。差异全部收敛在一个可选的弹窗回调上。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像银行审批：网点柜台（TUI）能当面让你签字（一次性批准 / 长期授权 / 拒绝）；电话银行（无头模式）找不到你本人，按规程只能拒绝——绝不代替你签字。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#eef4ff;"><span class="big">🖥️</span><b>TUI：弹窗问你</b><small>三个按钮：只这次 / 总是允许 / 拒绝</small></div>
    <div class="card" style="background:#fdeeee;"><span class="big">👻</span><b>无头 -p：没人按</b><small>回调缺席 → 自动拒绝，不崩溃不放行</small></div>
  </div>
  <p class="caption">同一个 <code>PermissionManager</code>，靠一个<b>可选的弹窗回调</b>适配两种世界 —— 缺席即安全拒绝。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>TUI 模式：弹窗展示工具名、理由、详情<small>你看到的就是分类器给的判定理由</small></p></div><div class="step"><span class="n">2</span><p>三个按钮：只这次 / 总是允许 / 拒绝<small>对应 once / always / deny</small></p></div><div class="step"><span class="n">3</span><p>无头 -p 模式：回调缺席<small>系统检测到没人能应答</small></p></div><div class="step"><span class="n">4</span><p>自动拒绝，进程正常继续<small>不崩溃、不挂起、不代替你决定</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>1</b><span>个可选字段决定全部差异</span></div><div class="stat"><b>3</b><span>种人工答复：once/always/deny</span></div><div class="stat"><b>deny</b><span>回调缺席时的安全默认</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>PromptFn 在 ManagerOptions 中是可选字段——宿主可以不提供。</li><li>无头模式不是「放行版」，而是「拒绝版」：无人值守时宁可拒绝。</li><li>弹窗内容与分类器判定理由共用同一数据结构，信息一致。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>脚本里怎么让它自动批准？</dt><dd>显式加 --permission-mode auto；但静态规则的红灯仍然生效。</dd><dt>「总是允许」影响以后所有会话吗？</dt><dd>不会，记忆是会话级的；这正是防止一次授权被永久滥用的设计。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../15-shen-pi-jiao-hu-mian-tui-dui-hua-kuang-yu-wu-tou-mo-shi-de-chai-yi-hua-yu-yi.md">TUI 对话框与无头模式的差异化语义</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="14-quan-xian-zha-men-cai-jue-shun-xu-ying-ju-jue-ji-yi-mo-shi-auto-yu-ask-hui-tui.html">第 14 章 · 裁决顺序的全景</a><a href="05-ci-xing-mo-shi-p-wu-tou-yun-xing-yu-quan-xian-mo-ren-ju-jue-yu-yi.html">第 5 章 · 无头模式的整体行为</a></div>

<nav class="nav">
<a href="14-quan-xian-zha-men-cai-jue-shun-xu-ying-ju-jue-ji-yi-mo-shi-auto-yu-ask-hui-tui.html">上一章：排队规则：谁先发言谁说了算 ←</a>
<a href="index.html">返回目录</a>
<a href="16-an-quan-mo-xing-sheng-ming-shen-pi-ceng-jia-lu-jing-shou-wei-bing-fei-cao-zuo-xi-tong-sha-xiang.html">下一章：门卫不是监狱：安全的边界 →</a>
</nav>
<footer>TinyCode 图解精读 · 15 / 27</footer>
</div></body></html>
`;export{n as default};
