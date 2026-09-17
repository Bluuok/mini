const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 1 章 · Craft Agents 项目概述 · Craft Agents 图解精读</title>
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
<p class="crumb">第 1 章 / 23 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 1 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>Craft Agents 项目概述</h1>
<p class="lede">Craft Agents 是一个开源（Apache 2.0）的 Agent 桌面应用：每次 AI 交互是一个可管理的单元，有状态、能归档，还住在各自的「项目抽屉」里。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一间团队用的项目室：每一件事是一张卡片，从「待办」一路走到「待审查」「已完成」，可标记、可归档；每张卡住在一个抽屉里，抽屉自带资料来源、技能手册和门禁钥匙；干活的人可以随时换——Claude、Google AI Studio、ChatGPT Plus (Codex)、GitHub Copilot 都派得上场——但工位和资料不动。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="收件箱、工作区与多提供商"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="25" y="55" width="250" height="120" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="150" y="95" text-anchor="middle" font-size="26">📥🗂️</text>
<text x="150" y="128" text-anchor="middle" font-size="15" font-weight="700">多会话收件箱</text>
<text x="150" y="153" text-anchor="middle" font-size="13" fill="#5b6478">待办 → 进行中 → 待审查 → 已完成</text>
<rect x="320" y="55" width="240" height="120" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="440" y="95" text-anchor="middle" font-size="26">🗃️</text>
<text x="440" y="128" text-anchor="middle" font-size="15" font-weight="700">工作区（项目容器）</text>
<text x="440" y="153" text-anchor="middle" font-size="13" fill="#5b6478">来源 · 技能 · 凭证 · 配置各自独立</text>
<rect x="605" y="55" width="250" height="120" rx="14" fill="#f3effe" stroke="#7C5CFC" stroke-width="3"/>
<text x="730" y="95" text-anchor="middle" font-size="26">🧠🔄</text>
<text x="730" y="128" text-anchor="middle" font-size="15" font-weight="700">大脑随时可换</text>
<text x="730" y="153" text-anchor="middle" font-size="13" fill="#5b6478">Claude / Google AI Studio / Codex / Copilot</text>
<line x1="277" y1="115" x2="316" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="562" y1="115" x2="601" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
</svg>
<p class="caption">对话不再是一条滚不到头的聊天记录，而是一张张会被推进、归档的任务卡。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>按 Cmd+N 新开一个会话，它会带着状态进收件箱<small>AI 自动生成标题，历史完整持久化，还能分支</small></p></div><div class="step"><span class="n">2</span><p>会话住进某个工作区——独立的来源、技能、凭证配置<small>相当于项目容器，各工作区互不串味</small></p></div><div class="step"><span class="n">3</span><p>对 Agent 说一句「将 Linear 添加为来源」<small>它自己发现 API、阅读文档、处理凭证；MCP 服务器、REST API、本地文件系统同理</small></p></div><div class="step"><span class="n">4</span><p>不用离开应用就能换一家模型供应商<small>可添加多个连接并为每个工作区设默认项</small></p></div>
<div class="step"><span class="n">5</span><p>交代出去的任务不用盯梢<small>长任务带进度跟踪在后台跑；事件驱动的自动化还能在标签变更或定时到达时自动开会话</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>4</b><span>家提供商可同屏切换</span></div><div class="stat"><b>3</b><span>种运行形态：桌面 / 无头 / 瘦客户端</span></div><div class="stat"><b>3</b><span>档权限模式：探索 · 编辑需询问 · 自动</span></div><div class="stat"><b>3</b><span>种界面语言：英 / 西 / 简中</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>要读懂整个系统，最重要的文件是 <code>packages/shared/src/agent/base-agent.ts</code>——所有 Agent 后端（Claude、Pi、Codex、Copilot）共享的契约。</li><li>UI 和 Agent 后端通过 WebSocket RPC 通信，所以这个 Monorepo（packages 放库、apps 放入口）能让桌面版退化为瘦客户端。</li><li>Pi 这类后端跑在独立 Bun 子进程里，靠 stdin/stdout 的 JSON 消息与主程序对话（init、prompt、compact、shutdown……），把 SDK 运行时隔离开。</li><li>拖入图片、PDF、Office 文档即可作附件并自动转换；一轮改动可用类似 VS Code 的多文件对比窗口审查。</li>
<li>它有三种打开方式：完整 Electron 桌面应用、在远程 VPS 上跑 <code>bun run packages/server/src/index.ts</code> 的无头服务器，以及用 CRAFT_SERVER_URL 连远程的瘦客户端——后者只渲染界面，活儿全在远端干。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>不就是套了个界面，凭什么叫「平台」？</dt><dd>因为逻辑不在壳里：会话管理、工具执行、模型调用都在共享包与服务器侧，UI 只是通过 WebSocket RPC 传话——因此浏览器 WebUI、CLI 也能接同一个引擎。</dd><dt>Agent 能自己接外部服务，会不会闯祸？</dt><dd>有三档权限闸门：探索（只读）、编辑需询问（弹窗审批）、自动（完全自主），还能按工作区或来源加自定义规则。但要清楚它不拦什么：凡是落在你预先放行范围内的操作，它都会径直去做——放得越宽，自主越大。</dd><dt>已经有终端里的 Claude Code 了，为什么还要它？</dt><dd>定位不同：它用「以文档为中心」的界面取代「以 CLI 为中心」的工作流——收件箱式会话、来源集成、技能与自动化都长在图形界面上。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../概述_lukilabs_craft-agents-oss/概述_lukilabs_craft-agents-oss.md">概述：架构与项目全景</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="02-kuai-su-shang-shou.html">第 2 章 · 快速开始</a><a href="08-monorepo-jia-gou.html">第 8 章 · Monorepo 架构</a></div>

<nav class="nav">
<span style="opacity:.4">已是第一章</span>
<a href="02-kuai-su-shang-shou.html">下一章：快速开始 →</a>
</nav>
<footer>Craft Agents 图解精读 · 1 / 23</footer>
</div></body></html>
`;export{t as default};
