const e=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 8 章 · Monorepo 架构 · Craft Agents 图解精读</title>
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
<p class="crumb">第 8 章 / 23 · 架构核心 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 8 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>Monorepo 架构</h1>
<p class="lede">整个仓库是一间中央厨房：底层放原料、中间熬汤底、上层分开装盘——桌面端、无头服务器、终端 CLI 和网页查看器，吃到的是同一锅核心厨艺。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像连锁餐饮的中央厨房。最底层是基础原料仓——纯粹的说明书和类型定义，谁都不依赖谁；中间层把智能体业务逻辑熬成一锅高汤；最后各门店只负责装盘上桌。最关键的一招：堂食店（Electron 桌面端）和外卖档口（无头服务器）用的是同一口熬汤的灶——完全相同的 bootstrapServer 引导函数，所以两家端出来的味道必然一致。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="分层依赖"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="20" y="55" width="185" height="120" rx="14" fill="#f1effb" stroke="#232733" stroke-width="2.5"/>
    <text x="112" y="95" text-anchor="middle" font-size="24">🧱</text>
    <text x="112" y="126" text-anchor="middle" font-size="14" font-weight="700">第一层 · 基础包</text>
    <text x="112" y="150" text-anchor="middle" font-size="12" fill="#5b6478">core / session-tools-core</text>
    <text x="112" y="167" text-anchor="middle" font-size="11.5" fill="#8a92a6">零内部依赖</text>
    <rect x="255" y="55" width="215" height="120" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="362" y="95" text-anchor="middle" font-size="24">🍲</text>
    <text x="362" y="126" text-anchor="middle" font-size="14" font-weight="700">第二层 · 业务逻辑</text>
    <text x="362" y="150" text-anchor="middle" font-size="12" fill="#5b6478">shared（50+ 子路径出口）/ ui</text>
    <text x="362" y="167" text-anchor="middle" font-size="11.5" fill="#8a92a6">仓库中最大的包</text>
    <rect x="520" y="55" width="200" height="120" rx="14" fill="#f1effb" stroke="#232733" stroke-width="2.5"/>
    <text x="620" y="95" text-anchor="middle" font-size="24">🍽️</text>
    <text x="620" y="126" text-anchor="middle" font-size="14" font-weight="700">第三层 · 平台设施</text>
    <text x="620" y="150" text-anchor="middle" font-size="12" fill="#5b6478">server-core 等</text>
    <text x="620" y="167" text-anchor="middle" font-size="11.5" fill="#8a92a6">统一 bootstrapServer</text>
    <rect x="742" y="42" width="118" height="146" rx="14" fill="#fff" stroke="#232733" stroke-width="2.5"/>
    <text x="801" y="80" text-anchor="middle" font-size="17">🖥️📱</text>
    <text x="801" y="104" text-anchor="middle" font-size="12.5" font-weight="700">Electron</text>
    <text x="801" y="128" text-anchor="middle" font-size="12.5">⌨️ CLI</text>
    <text x="801" y="152" text-anchor="middle" font-size="12.5">🔎 Viewer</text>
    <text x="801" y="172" text-anchor="middle" font-size="11" fill="#8a92a6">+ WebUI 外壳</text>
    <line x1="207" y1="115" x2="249" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="472" y1="115" x2="514" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="722" y1="115" x2="736" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">包之间用 workspace:* 引用本地副本，绝不从 npm 注册表拉内部依赖；营销站点 online-docs 被 glob 排除在构建流水线之外。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>克隆仓库后由 Bun workspaces 统一装依赖<small>根 package.json 的 workspaces 字段声明一切；worktree 分工清晰防循环引用</small></p></div><div class="step"><span class="n">2</span><p>你改了 shared 里的一段智能体逻辑并跑 typecheck:all<small>core、shared、server-core、server、electron、cli 全栈统一类型检查</small></p></div><div class="step"><span class="n">3</span><p>Electron 主进程启动时调用 server-core 的 bootstrapServer<small>与无头服务器用的是同一个引导函数：会话管理、RPC 处理行为完全一致</small></p></div><div class="step"><span class="n">4</span><p>要部署独立服务器？先 server:build:subprocess 再 server:build<small>两个 stdio 子进程服务器先打好包，再被组装进自包含分发版（含 Bun 运行时）</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>50+</b><span>shared 包按领域拆分的子路径导出</span></div><div class="stat"><b>~290 行</b><span>独立服务器入口文件的全部体量</span></div><div class="stat"><b>4 个</b><span>apps/ 下可运行形态（Electron·CLI·Viewer·WebUI）</span></div><div class="stat"><b>1 个</b><span>贯穿桌面与服务器的共享引导函数</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>构建按需选工具而非一刀切：Electron 主进程和预加载脚本用 esbuild 编成 CJS，渲染器 / Viewer / WebUI 用 Vite，两个子进程服务器用 Bun 打包。</li><li>根目录 bunfig.toml 全局预加载统一网络拦截器——在任何工作区模块之前运行，凭据注入与代理路由对 Electron 主进程和无头服务器都透明生效。</li><li>CLI 刻意不依赖 ui 组件包以保终端场景的最小体积；WebUI 更是零工作区依赖，靠服务器的 /api/config 接口在运行时引导连接。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>monorepo 会不会一处改坏、全线崩盘？</dt><dd>有两层保险：严格的依赖层次让循环引用根本写不出来，第一层叶子包零内部依赖；typecheck:all 与 CI 的 validate:ci 在合入前兜底。边界也要说清：正因为业务逻辑共用一锅高汤，shared 的回归影响面就是所有形态——这正是那套测试流水线存在的理由。</dd><dt>为什么不干脆做成一个大而全的应用？</dt><dd>分层的回报在按需瘦身：CLI 只要 shared + server-core，Viewer 只要 core + ui，各自打包互不拖累。代价是理解成本上升，好处是桌面复用服务器代码而不重复造轮子。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../Monorepo_架构_lukilabs_craft-agents-oss.md">Monorepo 架构</a>（文字版，含各 package.json 与构建脚本出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="07-guan-yu-gong-xian-zhe.html">第 7 章 · 贡献者与维护模式</a><a href="09-baseagent-chou-xiang.html">第 9 章 · BaseAgent 抽象</a></div>

<nav class="nav">
<a href="07-guan-yu-gong-xian-zhe.html">上一章：贡献者与维护模式 ←</a>
<a href="index.html">返回目录</a>
<a href="09-baseagent-chou-xiang.html">下一章：BaseAgent 抽象 →</a>
</nav>
<footer>Craft Agents 图解精读 · 8 / 23</footer>
</div></body></html>
`;export{e as default};
