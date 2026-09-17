const e=`<!doctype html>
<html lang="zh-CN" style="--accent:#3B82F6">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第2章 · 核心架构与产品模型 · Miniclaw 新手图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#FFF9F0;color:#232733;line-height:1.7;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:15px}
h1{font-size:34px;line-height:1.2;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:28px}
h2{font-size:23px;margin:34px 0 8px}
.card{background:#fff;border:2.5px solid #232733;border-radius:18px;box-shadow:6px 6px 0 rgba(35,39,51,.10);padding:20px;margin:20px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.card h3{font-size:19px;margin-bottom:5px}
.card p{font-size:16.5px;color:#4A5060}
.chip{display:inline-block;border:3px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 16px;font-weight:700}
svg{width:100%;height:auto;display:block;margin:16px 0}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:46px;font-weight:700;font-size:16px}
a{color:var(--accent)}
footer{margin-top:44px;color:#8A8F9E;font-size:14px;text-align:center}
.walk h3{font-size:19px;margin:22px 0 4px}
.step{display:flex;gap:12px;margin:14px 0;align-items:flex-start}
.step .n{flex:0 0 34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px}
.step p{font-size:16.5px;color:#3A3F4E}
.more{padding-left:24px}
.more li{margin:9px 0;font-size:16.5px;color:#3A3F4E}
</style></head>
<body><div class="wrap">
<span class="chip">给完全新手 · 第 2 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>核心架构与产品模型</h1>
<p class="lede">Miniclaw 把活儿分给四个角色，每个角色只干自己那份，谁也不越界。</p>

<h2>这是什么？</h2>
<p>Miniclaw 是一个能同时挂在飞书、微信等聊天软件上的 AI 助手平台。它拆成四个部分：<b>客户端</b>负责让你说话，<b>后端</b>负责管事，<b>Pi Runner</b> 负责让 AI 干活，<b>Workspace</b> 是 AI 的文件小房间。对应到文件夹：后端在 <b>src/</b>，Runner 在 <b>container/agent-runner/</b>，网页界面在 <b>web/</b>。</p>

<h2>一张图看懂</h2>
<svg viewBox="0 0 900 500" role="img" aria-label="用户端到后端到Runner到Workspace的分层架构图">
  <defs>
    <marker id="arw" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M2,2 L10,6 L2,10 z" fill="#232733"/>
    </marker>
  </defs>
  <!-- 客户端层 -->
  <rect x="40" y="30" width="260" height="86" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="170" y="66" text-anchor="middle" font-size="21" font-weight="bold" fill="#232733">网页 / 桌面应用</text>
  <text x="170" y="96" text-anchor="middle" font-size="18" fill="#232733">只画界面，不存数据</text>
  <rect x="340" y="30" width="240" height="86" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="460" y="66" text-anchor="middle" font-size="21" font-weight="bold" fill="#232733">聊天软件渠道</text>
  <text x="460" y="96" text-anchor="middle" font-size="18" fill="#232733">飞书 · 微信 · QQ 等</text>
  <rect x="620" y="30" width="240" height="86" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="740" y="66" text-anchor="middle" font-size="21" font-weight="bold" fill="#232733">Electron 桌面壳</text>
  <text x="740" y="96" text-anchor="middle" font-size="18" fill="#232733">薄壳，复用网页界面</text>
  <line x1="300" y1="73" x2="336" y2="73" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>
  <line x1="580" y1="73" x2="616" y2="73" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>

  <line x1="460" y1="116" x2="460" y2="156" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>
  <text x="480" y="143" font-size="18" fill="#232733">一律先到后端</text>

  <!-- Backend -->
  <rect x="120" y="160" width="660" height="92" rx="14" fill="#3B82F622" stroke="#232733" stroke-width="3"/>
  <text x="450" y="198" text-anchor="middle" font-size="23" font-weight="bold" fill="#232733">后端 Backend（src/）—— 大管家</text>
  <text x="450" y="230" text-anchor="middle" font-size="18" fill="#232733">认证 · 排队 · 调度 · 权限 · 数据库，但不懂 AI 怎么思考</text>

  <line x1="330" y1="252" x2="330" y2="296" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>
  <text x="200" y="280" font-size="18" fill="#232733">派活：stdin / IPC 文件</text>
  <line x1="570" y1="252" x2="570" y2="296" stroke="#232733" stroke-width="3" marker-end="url(#arw)" stroke-dasharray="7 5"/>
  <text x="588" y="280" font-size="18" fill="#232733">挂载文件目录</text>

  <!-- Runner + Workspace -->
  <rect x="120" y="300" width="380" height="100" rx="14" fill="#3B82F622" stroke="#232733" stroke-width="3"/>
  <text x="310" y="340" text-anchor="middle" font-size="23" font-weight="bold" fill="#232733">Pi Runner（container/）</text>
  <text x="310" y="372" text-anchor="middle" font-size="18" fill="#232733">真正带 AI 干活的引擎</text>

  <rect x="540" y="300" width="240" height="100" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="660" y="340" text-anchor="middle" font-size="23" font-weight="bold" fill="#232733">Workspace</text>
  <text x="660" y="372" text-anchor="middle" font-size="18" fill="#232733">AI 的文件房间</text>
  <line x1="500" y1="350" x2="536" y2="350" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>

  <!-- 产品层级 -->
  <rect x="120" y="424" width="660" height="56" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="450" y="459" text-anchor="middle" font-size="19" fill="#232733">产品层级：Agent Profile（身份）→ Workspace（文件边界）→ Session（一次执行记录）</text>
  <!-- 步骤编号徽章 -->
  <circle cx="56" cy="30" r="13" fill="#3B82F6"/><text x="56" y="35" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">1</text>
  <circle cx="356" cy="30" r="13" fill="#3B82F6"/><text x="356" y="35" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">2</text>
  <circle cx="636" cy="30" r="13" fill="#3B82F6"/><text x="636" y="35" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">3</text>
  <circle cx="136" cy="160" r="13" fill="#3B82F6"/><text x="136" y="165" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">4</text>
  <circle cx="136" cy="300" r="13" fill="#3B82F6"/><text x="136" y="305" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">5</text>
  <circle cx="556" cy="300" r="13" fill="#3B82F6"/><text x="556" y="305" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">6</text>
  <circle cx="136" cy="424" r="13" fill="#3B82F6"/><text x="136" y="429" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">7</text>
</svg>
<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>网页 / 桌面应用：</b>只画界面、不存数据，靠 Cookie 向后端发请求。</p></div>
<div class="step"><span class="n">2</span><p><b>聊天软件渠道：</b>飞书、微信等各自长连接接入，消息同样先进后端。</p></div>
<div class="step"><span class="n">3</span><p><b>Electron 桌面壳：</b>刻意做薄的壳，复用网页界面，仍指向同一个后端。</p></div>
<div class="step"><span class="n">4</span><p><b>后端大管家：</b>认证、排队、调度、权限都归它，是唯一碰数据库的进程。</p></div>
<div class="step"><span class="n">5</span><p><b>不懂 AI 的管家：</b>它不解释提示词、不跑工具，推理活儿整个交给 Runner。</p></div>
<div class="step"><span class="n">6</span><p><b>Pi Runner：</b>唯一加载 AI 引擎的组件，stdin 收活、stdout 交结果，不连数据库。</p></div>
<div class="step"><span class="n">7</span><p><b>Workspace 与产品层级：</b>文件房间按 folder 隔离；Agent 身份之下是工作区，工作区里记着一次次 Session。</p></div>
</div>

<h2>三个关键词</h2>
<div class="grid">
  <div class="card"><h3>Agent Profile</h3><p>Agent 的「身份证」：用四段提示词说清它是谁、怎么干活。一改动就生成新哈希、版本加一。</p></div>
  <div class="card"><h3>Workspace</h3><p>文件的隔离边界，对应 data/groups/&lt;folder&gt; 目录。同一房间的文件大家共用，对话却各自独立。</p></div>
  <div class="card"><h3>Session</h3><p>工作区里的一次执行记录，不是又一个 Agent。默认一个主会话，还能派生子代理和定时任务。</p></div>
</div>

<h2>打个比方</h2>
<div class="card">
<p>把 Miniclaw 想成一家餐厅：后端是<b>前台经理</b>——接待客人、排号、记账，但从不下厨；Pi Runner 是<b>厨房厨师</b>，拿到订单专心做菜；Workspace 是给每位厨师配的<b>储物间</b>；Agent Profile 是厨师的菜谱和人设卡。客人可以从三个门进来（网页、桌面应用、聊天软件），但都得先过前台。</p>
</div>
<h2>再多懂一点</h2>
<ul class="more">
<li>目录即角色：后端在 <b>src/</b>，Runner 在 <b>container/agent-runner/</b>，网页在 <b>web/</b>，四个包依赖各自安装、互不共享。</li>
<li>Session 不是又一个 Agent，只是工作区里的一次执行记录；默认一个主会话，另有子代理与定时任务等派生会话。</li>
<li>改 Agent 提示词会算出新哈希、版本加一，并先停掉相关 Runner 再提交，防止旧身份继续干活。</li>
</ul>

<h2>想读原版详解？</h2>
<a href="../wiki/versions/2026-08-25-103405/4-zheng-ti-jia-gou-backend-pi-runner-workspace-yu-ke-hu-duan-de-bian-jie-hua-fen.md">整体架构：Backend、Pi Runner、Workspace 与客户端的边界划分</a><br>
<a href="../wiki/versions/2026-08-25-103405/5-agent-first-chan-pin-mo-xing-agent-profile-workspace-yu-session-ceng-ji.md">Agent-first 产品模型：Agent Profile、Workspace 与 Session 层级</a><br>
<a href="../wiki/versions/2026-08-25-103405/6-mu-lu-dao-hang-yu-mo-kuai-di-tu-cong-src-dao-container-zai-dao-web.md">目录导航与模块地图：从 src 到 container 再到 web</a>

<nav class="nav">
  <a href="01-rumen-zhinan.html">← 第 1 章：入门指南</a>
  <a href="index.html">返回目录</a>
  <a href="03-houdu-neihe.html">第 3 章：后端内河 →</a>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{e as default};
