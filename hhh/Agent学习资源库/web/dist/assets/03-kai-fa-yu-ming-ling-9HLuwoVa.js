const e=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 3 章 · 开发模式与常用命令 · HappyClaw 图解精读</title>
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
<p class="crumb">第 3 章 / 30 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 3 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>开发模式与常用命令</h1>
<p class="lede">一条 make dev 同时点亮前后端：tsx 直跑 TypeScript、Vite 热更新跟着改动实时刷屏，本地五道质量关卡提前拦下 CI 的七步返工。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像后厨开了双灶：厨师（tsx 直跑后端 TS，免编译）和小二（Vite Dev Server）同时开工。灶上还有个勤快的规矩——食谱没改绝不重炒：Makefile 用时间戳哨兵比较源码与产物，谁比产物新才重新编译谁，别人原地待命。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="开发模式三进程"><defs><marker id="ar3" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="30" y="62" width="230" height="108" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="145" y="102" text-anchor="middle" font-size="24">🖥️🔥</text>
    <text x="145" y="132" text-anchor="middle" font-size="14.5" font-weight="700">Vite 前端</text>
    <text x="145" y="156" text-anchor="middle" font-size="13" fill="#5b6478">localhost:5173 热更新</text>
    <line x1="262" y1="96" x2="330" y2="96" stroke="#232733" stroke-width="4" marker-end="url(#ar3)"/>
    <text x="296" y="84" text-anchor="middle" font-size="12" fill="#5b6478">/api</text>
    <line x1="262" y1="136" x2="330" y2="136" stroke="#232733" stroke-width="4" marker-end="url(#ar3)"/>
    <text x="296" y="162" text-anchor="middle" font-size="12" fill="#5b6478">/ws</text>
    <rect x="338" y="52" width="252" height="128" rx="16" fill="#f1ecfe" stroke="var(--accent)" stroke-width="3"/>
    <text x="464" y="98" text-anchor="middle" font-size="26">🛎️⚙️</text>
    <text x="464" y="128" text-anchor="middle" font-size="15" font-weight="700">Hono API + WebSocket</text>
    <text x="464" y="154" text-anchor="middle" font-size="13" fill="#5b6478">localhost:3000 · tsx 直跑 TS</text>
    <line x1="592" y1="116" x2="654" y2="80" stroke="#232733" stroke-width="4" marker-end="url(#ar3)"/>
    <line x1="592" y1="116" x2="654" y2="152" stroke="#232733" stroke-width="4" marker-end="url(#ar3)"/>
    <rect x="660" y="34" width="192" height="76" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="756" y="64" text-anchor="middle" font-size="17">🖥️ Host Runner</text>
    <text x="756" y="92" text-anchor="middle" font-size="12.5" fill="#5b6478">主服务子进程</text>
    <rect x="660" y="122" width="192" height="76" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="756" y="152" text-anchor="middle" font-size="17">📦 Container</text>
    <text x="756" y="180" text-anchor="middle" font-size="12.5" fill="#5b6478">Docker 沙箱</text>
  </svg>
  <p class="caption">前端地址在 5173，接口和 WebSocket 都被 Vite 代理回 3000 端口的后端。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>make dev 先判依赖是否过期<small>package.json 或 lockfile 比 node_modules 新就 npm ci；三端独立判定互不影响</small></p></div><div class="step"><span class="n">2</span><p>补齐内置 Skills、拉取 Agent 镜像、编译 agent-runner<small>与 make start 共享同一套准备逻辑，只是运行形态不同</small></p></div><div class="step"><span class="n">3</span><p>concurrently 以 backend,frontend 双进程并发启动<small>带时间戳日志前缀；只想点单端用 make dev-backend 或 make dev-web</small></p></div><div class="step"><span class="n">4</span><p>改完代码直接去 localhost:5173 看效果<small>Vite 把 /api 与 /ws（WebSocket 模式）代理到 3000 的后端</small></p></div><div class="step"><span class="n">5</span><p>提交前本地过一遍 CI 等价命令<small>make typecheck 串行五项检查，含三份 StreamEvent 副本的内容级 diff 校验</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>5173</b><span>Vite 开发服务器端口</span></div><div class="stat"><b>3000</b><span>API 与 WebSocket 所在后端端口</span></div><div class="stat"><b>5</b><span>项 typecheck 串行质量检查</span></div><div class="stat"><b>7</b><span>步 CI 合并验证即你的提交门槛</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>增量编译的基准各有其主：后端看 dist/index.js，前端看 web/dist/index.html，agent-runner 看 dist/.tsbuildinfo。</li><li>make sync-types 只在内容不同时才复制副本——刻意避免无谓的时间戳变化触发冗余重建。</li><li>SDK 升级走显式流程：make ensure-latest-sdk 只读查看差距，make update-sdk 写回 lockfile 后必须 typecheck && test 再提交。</li><li>vitest.config.ts 显式排除 data/**：那是用户工作区（已 gitignore），可能嵌套自带测试套件的项目，而 Vitest 不尊重 .gitignore。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>用 bun 启动是不是更快？会出什么乱子？</dt><dd>这正是项目的工具链铁律：不行。WebSocket 走 ws 包 + @hono/node-server 的 server.on('upgrade') 握手，该事件在 bun 的 HTTP server 下不触发——后果是 HTTP 接口看似正常，但前端实时流式卡片与通知全部静音。所有命令都围绕 npm/npx/tsx 组织，老实走 make dev / make start。</dd><dt>少一个 Markdown 文件，真的会让容器一启动就崩吗？</dt><dd>会。agent-runner 在模块加载时同步 readFileSync 读取 Prompt 文件，缺文件即 ENOENT 启动崩溃。check-agent-runner-prompts.sh 把这种失败提前到 typecheck 阶段拦截；docs:check 则保证仓库文档里的本地链接不悬空。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../03-%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%E4%B8%8E%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4.md">开发模式与常用命令</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="02-kuai-su-shang-shou.html">第 2 章 · 快速开始</a><a href="04-pei-zhi-xiang-dao.html">第 4 章 · 首次配置向导</a></div>

<nav class="nav">
<a href="02-kuai-su-shang-shou.html">上一章：快速开始 ←</a>
<a href="04-pei-zhi-xiang-dao.html">下一章：首次配置向导 →</a>
</nav>
<footer>HappyClaw 图解精读 · 3 / 30</footer>
</div></body></html>
`;export{e as default};
