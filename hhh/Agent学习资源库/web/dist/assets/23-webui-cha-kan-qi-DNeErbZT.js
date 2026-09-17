const e=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 23 章 · WebUI 与会话查看器 · Craft Agents 图解精读</title>
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
<p class="crumb">第 23 章 / 23 · 部署形态 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 23 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>WebUI 与会话查看器</h1>
<p class="lede">WebUI 是在浏览器里原样运行的 Electron 渲染器——同一批组件，改吃网络供电；会话查看器则是一盘只读录像带，拿到哪放到哪。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>同一场演出的两种消费方式：官方直播间（WebUI）里台上还是原来那批演员——Electron 渲染器的全部组件树一行不改，只是声光电改由 WebSocket 远程供给；演出光盘（会话查看器）则不需要乐队在场，塞进任何机器都能看，还能点击某一小节放大细瞧某个乐器的独奏谱面。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="一套 UI 内核两种供电方式"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="26" y="30" width="270" height="75" rx="14" fill="#fff" stroke="#f2b705" stroke-width="3"/>
    <text x="161" y="58" text-anchor="middle" font-size="15.5" font-weight="700">📺 WebUI · 现场直播</text>
    <text x="161" y="86" text-anchor="middle" font-size="12.5" fill="#5b6478">window.electronAPI ← createWebApi 伪造</text>
    <rect x="26" y="125" width="270" height="75" rx="14" fill="#fff" stroke="#2fae6d" stroke-width="3"/>
    <text x="161" y="153" text-anchor="middle" font-size="15.5" font-weight="700">📼 会话查看器 · 回放带</text>
    <text x="161" y="181" text-anchor="middle" font-size="12.5" fill="#5b6478">StoredSession JSON · URL / 上传 / 粘贴</text>
    <line x1="300" y1="67" x2="372" y2="95" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="300" y1="163" x2="372" y2="135" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="396" y="24" width="250" height="182" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="521" y="62" text-anchor="middle" font-size="19" font-weight="700">@craft-agent/ui</text>
    <text x="521" y="90" text-anchor="middle" font-size="13" fill="#5b6478">共享 UI 内核（完全相同代码）</text>
    <text x="521" y="120" text-anchor="middle" font-size="14">🧩 React.lazy 原样挂载</text>
    <text x="521" y="148" text-anchor="middle" font-size="14">SessionViewer readonly 模式</text>
    <text x="521" y="180" text-anchor="middle" font-size="12.5" fill="#5b6478">差异只在传输层：WS ↔ IPC</text>
    <line x1="650" y1="115" x2="722" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="726" y="66" width="128" height="98" rx="14" fill="#fff" stroke="#e5484d" stroke-width="3"/>
    <text x="790" y="100" text-anchor="middle" font-size="22">🖥️⚡</text>
    <text x="790" y="128" text-anchor="middle" font-size="12.5" fill="#5b6478">WebUI 连服务器</text>
    <text x="790" y="150" text-anchor="middle" font-size="12.5" fill="#5b6478">viewer 零依赖静态托管</text>
    <line x1="26" y1="10" x2="854" y2="10" stroke="#ece7fc" stroke-width="4"/>
    <text x="440" y="222" text-anchor="middle" font-size="13" fill="#5b6478">一根是活的电线（双向 RPC + 推送），一盘是录好的带子（一次性加载）</text>
</svg>
<p class="caption">🎬 直播间与光盘共用同一个「节目内核」，供电方式决定部署形态。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>WebUI 先 GET /api/config 取 WebSocket 地址<small>收到 401 立即跳 /login；登录页是零框架自包含 HTML，认证全靠 Cookie</small></p></div><div class="step"><span class="n">2</span><p>解析工作区：URL 的 ?workspace= 参数优先<small>缺省时向服务器要 defaultWorkspaceId；该 ID 决定推送哪些会话事件</small></p></div><div class="step"><span class="n">3</span><p>createWebApi 组合三层，伪造出 window.electronAPI 全局<small>RPC 代理层 + Web 覆盖（openUrl→window.open 等）+ 无法实现的空操作桩</small></p></div><div class="step"><span class="n">4</span><p>React.lazy 懒加载 Electron 渲染器组件树，页面与 Hook 一行不改<small>40 多个 Node.js 模块由垫片顶替；fs 导出运行时抛错而非静默失败</small></p></div><div class="step"><span class="n">5</span><p>回放带走另一条路：拖一个 .json 或直接粘贴即可观看<small>readonly 渲染按轮次折叠；点 Bash 弹 ANSI 终端覆层，Edit/Write 弹差异对比</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>5 步</b><span>WebUI 引导的确定性初始化序列</span></div><div class="stat"><b>40+</b><span>被垫片替换的 Node.js 模块说明符</span></div><div class="stat"><b>6 个</b><span>专用活动覆层组件两极分发</span></div><div class="stat"><b>3 种</b><span>查看器加载：URL / 上传 / 粘贴</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>两入口构建：index.html 主应用与 login.html 认证页（毛玻璃样式、无 React）；主题检测用 matchMedia 监听 prefers-color-scheme 实时切换。</li><li>活动覆层两级分发：Edit/Write 先进 MultiDiffPreviewOverlay，其余按 extractOverlayData 判别路由（Read 代码高亮、Bash 终端、JSON 折叠、Markdown 文档……未知工具走 GenericOverlay）。</li><li>开发端口 WebUI 5175、查看器 5174；查看器部署于 Cloudflare Pages，基础路径 /s/，dev 时把 /s/api 代理到 agents.craft.do 联调。</li><li>IS_WEBUI 标志让共享组件有条件关掉红绿灯窗口控件、原生菜单等 Electron 专属功能，无需单独构建。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>公开的会话查看器会不会泄露我的代码？</dt><dd>三种加载方式里，文件上传与剪贴板粘贴完全在本地解析、不发送任何数据；基于 URL 方式的记录托管在服务器侧。查看器本身没有任何认证与访问控制——保密靠你别外传含敏感内容的会话文件或链接。</dd><dt>浏览器里哪来的 window.electronAPI？</dt><dd>桌面端由 preload 注入的那个全局变量，这里被 createWebApi 造出的同构对象顶替——所有调用 openUrl()、getSystemTheme() 的共享组件零修改即可运行。Electron 才有的操作（红绿灯控件等）退化成空操作桩。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../WebUI_与会话查看器_lukilabs_craft-agents-oss/WebUI_与会话查看器_lukilabs_craft-agents-oss.md">WebUI 与会话查看器</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="22-wu-tou-yuan-cheng.html">第 22 章 · 无头远程服务器</a><a href="18-hui-hua-gong-zuo-qu.html">第 18 章 · 会话与工作区模型</a></div>

<nav class="nav">
<a href="22-wu-tou-yuan-cheng.html">上一章：无头远程服务器 ←</a>
<a href="index.html">返回目录</a>
<span style="opacity:.4">已是最后一章</span>
</nav>
<footer>Craft Agents 图解精读 · 23 / 23</footer>
</div></body></html>
`;export{e as default};
