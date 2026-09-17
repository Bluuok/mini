const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第22章 · 插线板：外挂工具，坏了不炸 · TinyCode 图解精读</title>
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
<p class="crumb">第 22 章 / 27 · 扩展机制 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 22 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>插线板：外挂工具，坏了不炸</h1>
<p class="lede">MCP 把外部工具服务器当独立子进程接入：多台并行握手，单台故障记为状态，绝不拖垮主程序。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像家里的插线板：每个电器（外部服务器）独立插孔，一个电器短路跳闸只断它自己的保险（状态化为 failed），整块板和家里的电（主程序启动路径）照常工作。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#eef4ff;"><span class="big">🔌🔌🔌</span><b>并行连接</b><small>多台服务器同时握手<br>默认等 10 秒，上限 120 秒</small></div>
    <div class="card" style="background:#fdeeee;"><span class="big">💀</span><b>单台挂了？</b><small>记成“故障”状态，绝不拖垮全局</small></div>
    <div class="card" style="background:#fff7e6;"><span class="big">🏷️</span><b>重名加前缀</b><small>服务器名_工具名</small></div>
  </div>
  <p class="caption">没配 <code>mcpServers</code>？整条链路压根不启动，零开销。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>config.json 里声明 mcpServers<small>command/args/env/cwd/timeoutMs</small></p></div><div class="step"><span class="n">2</span><p>启动时并行连接所有服务器<small>握手有界等待：默认 10 秒</small></p></div><div class="step"><span class="n">3</span><p>某台不存在或超时<small>记为故障状态，其余照常</small></p></div><div class="step"><span class="n">4</span><p>连通服务器的工具注入注册表<small>撞名自动加 服务器名_ 前缀</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>10,000</b><span>ms 默认握手等待</span></div><div class="stat"><b>120,000</b><span>ms 配置上限，防无限挂起</span></div><div class="stat"><b>1 台</b><span>故障也不影响其余与主程序</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>stdio 传输：子进程通过 stdin/stdout 说 JSON-RPC，v1 不做 HTTP/SSE。</li><li>没配 mcpServers 时整条链路不启动，零开销。</li><li>集成测试用 mock 服务器验证：指向不存在二进制也不会让 startAll() 崩溃。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>外部服务器会不会拖慢启动？</dt><dd>握手有界等待（默认 10 秒封顶 120 秒），慢的先跳过标记故障，不阻塞其余启动。</dd><dt>外部工具能越过权限系统吗？</dt><dd>不能。所有工具调用（含 MCP）都要过权限闸门，未分类者默认 ask。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../22-mcp-ji-cheng-stdio-fu-wu-qi-bing-xing-lian-jie-yu-dan-dian-gu-zhang-ge-chi.md">stdio 服务器并行连接与单点故障隔离</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="11-tong-gong-ju-zhu-ce-biao-nei-zhi-mcp-yu-zi-dai-li-gong-ju-de-ming-ming-kong-jian-he-bing.html">第 11 章 · 外部工具的命名冲突消解</a><a href="14-quan-xian-zha-men-cai-jue-shun-xu-ying-ju-jue-ji-yi-mo-shi-auto-yu-ask-hui-tui.html">第 14 章 · 闸门如何覆盖外部工具</a></div>

<nav class="nav">
<a href="21-ji-neng-xi-tong-skill-md-fa-xian-yu-load_skill-jian-jin-shi-pi-lu.html">上一章：先看菜单，点菜才上菜 ←</a>
<a href="index.html">返回目录</a>
<a href="23-zi-dai-li-jian-du-zhi-du-gong-zuo-xian-cheng-bing-fa-shang-xian-yu-jie-gou-hua-bao-gao-hui-shou.html">下一章：蜂后最多派三只工蜂 →</a>
</nav>
<footer>TinyCode 图解精读 · 22 / 27</footer>
</div></body></html>
`;export{n as default};
