const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第10章 · 七件工具，三个工位 · TinyCode 图解精读</title>
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
<p class="crumb">第 10 章 / 27 · 工具体系 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 10 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>七件工具，三个工位</h1>
<p class="lede">文件读写（read/write/edit）、命令执行（bash）、只读侦察（grep/find/ls）。每件都有明确的使用说明书和防失控上限。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一套精简的手术器械：不是十八般兵器，而是三组各司其职——查看类只看不摸（侦察），操作类精准介入（读写），高风险的（bash）单独归入需要审批的托盘。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#eef4ff;"><span class="big">👀✏️📄</span><b>文件读写</b><small>read / write / edit<br>read 默认最多 2000 行 · 单行 2000 字 · 文件 ≤5MB</small></div>
    <div class="card" style="background:#fdeeee;"><span class="big">⚡</span><b>命令执行</b><small>bash（要过红绿灯）</small></div>
    <div class="card" style="background:#edfaf2;"><span class="big">🔍🗺️📂</span><b>只读侦察</b><small>grep / find / ls（随便看，不动手）</small></div>
  </div>
  <p class="caption">报错信息是写给 AI 看的：<b>可行动</b>（告诉你下一步怎么办）、<b>可续读</b>（告诉你翻页参数）。edit 的 diff 预览封顶 80 行。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>模型想看代码：read / grep / ls<small>侦察组：只读，绿灯放行</small></p></div><div class="step"><span class="n">2</span><p>确定修改方案：read 定位 → edit 精准替换<small>必须给出精确的旧文本与新文本</small></p></div><div class="step"><span class="n">3</span><p>需要跑测试：bash npm test<small>黄灯：先过风险分类器</small></p></div><div class="step"><span class="n">4</span><p>输出超长？自动截断并归档全量<small>模型永远不会被日志淹没</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>2000</b><span>行，read 默认单次上限</span></div><div class="stat"><b>2000</b><span>字符，单行截断阈值</span></div><div class="stat"><b>80</b><span>行，edit diff 预览封顶</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>read 的文件大小上限 5MB，超大文件会被引导改用 bash 的 head/tail/grep。</li><li>edit 多处匹配时拒绝执行，要求补充上下文或显式 replaceAll——防误伤。</li><li>所有错误消息面向模型设计：可行动（给出下一步）、可续读（提示翻页参数）。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>工具这么少，够用吗？</dt><dd>七件覆盖了读写、检索、执行三大类；复杂需求通过 bash 组合命令完成，工具面越小模型越不容易选错。</dd><dt>edit 改错位置怎么办？</dt><dd>必须提供唯一的 oldText，多处匹配直接拒绝执行；这比「猜一个位置」安全得多。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../10-qi-da-nei-zhi-gong-ju-xiang-jie-read-edit-bash-deng-de-xing-wei-qi-yue.md">read/edit/bash 等的行为契约</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="11-tong-gong-ju-zhu-ce-biao-nei-zhi-mcp-yu-zi-dai-li-gong-ju-de-ming-ming-kong-jian-he-bing.html">第 11 章 · 工具如何统一注册给模型</a><a href="17-gong-ju-jie-guo-jie-duan-ce-lue-tou-wei-bao-liu-yu-wan-zheng-shu-chu-gui-dang-wei-gong-jian.html">第 17 章 · 超长输出怎么被截断</a></div>

<nav class="nav">
<a href="09-dai-li-xun-huan-yu-gong-ju-zhi-xing-liu-shui-xian-cong-liu-shi-xiang-ying-dao-jie-guo-luo-pan.html">上一章：一句话的完整旅行 ←</a>
<a href="index.html">返回目录</a>
<a href="11-tong-gong-ju-zhu-ce-biao-nei-zhi-mcp-yu-zi-dai-li-gong-ju-de-ming-ming-kong-jian-he-bing.html">下一章：一张桌子，四个来源 →</a>
</nav>
<footer>TinyCode 图解精读 · 10 / 27</footer>
</div></body></html>
`;export{n as default};
