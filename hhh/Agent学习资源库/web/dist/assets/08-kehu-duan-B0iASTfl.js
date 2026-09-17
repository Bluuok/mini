const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#6366F1">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第8章 · 客户端体验 · Miniclaw 新手图解</title>
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
<span class="chip">给完全新手 · 第 8 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>客户端体验：屏幕上的字是怎么蹦出来的</h1>
<p class="lede">你看到的回答不是一次给全，而是一段段飞过来——这一章讲网页和桌面窗口是怎么接住它们的。</p>

<h2>这是什么？</h2>
<p>Miniclaw 有两个"脸面"：浏览器里的网页（React 19 写的），和一个桌面窗口（Electron 薄壳）。它们自己不干活，只负责显示和收发消息。</p>
<p>真正生成答案的是后端。两边靠一条共享的事件类型清单说话，谁也不会听岔。</p>

<h2>一张图看懂</h2>
<svg viewBox="0 0 900 500" role="img" aria-label="客户端与后端同步图">
  <defs>
    <marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#232733"/>
    </marker>
    <marker id="arb" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#6366F1"/>
    </marker>
  </defs>
  <rect x="30" y="40" width="230" height="120" rx="14" fill="#6366F11F" stroke="#232733" stroke-width="3"/>
  <text x="145" y="80" text-anchor="middle" font-size="20" font-weight="bold" fill="#232733">网页端（浏览器）</text>
  <text x="145" y="108" text-anchor="middle" font-size="17" fill="#232733">React 19 + Zustand</text>
  <text x="145" y="134" text-anchor="middle" font-size="17" fill="#232733">收到文字就攒一攒再画</text>

  <rect x="30" y="330" width="230" height="120" rx="14" fill="#6366F11F" stroke="#232733" stroke-width="3"/>
  <text x="145" y="370" text-anchor="middle" font-size="20" font-weight="bold" fill="#232733">Electron 桌面壳</text>
  <text x="145" y="398" text-anchor="middle" font-size="17" fill="#232733">只是个受控浏览器</text>
  <text x="145" y="424" text-anchor="middle" font-size="17" fill="#232733">Preload 只开 5 个小口</text>

  <path d="M260,400 C330,400 340,300 380,290" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <text x="255" y="452" font-size="17" fill="#232733">加载同一套网页</text>

  <rect x="380" y="210" width="200" height="110" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="480" y="250" text-anchor="middle" font-size="19" font-weight="bold" fill="#232733">WebSocket 长连接</text>
  <text x="480" y="278" text-anchor="middle" font-size="17" fill="#232733">stream_event</text>
  <text x="480" y="302" text-anchor="middle" font-size="17" fill="#232733">事件一段段推过来</text>

  <path d="M380,245 C320,235 310,150 262,130" fill="none" stroke="#6366F1" stroke-width="3.5" marker-end="url(#arb)"/>
  <path d="M262,155 C315,170 325,225 378,238" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>

  <rect x="650" y="180" width="220" height="170" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="760" y="222" text-anchor="middle" font-size="20" font-weight="bold" fill="#232733">后端 + Agent Runner</text>
  <text x="760" y="252" text-anchor="middle" font-size="17" fill="#232733">记账、把关、过滤隐私</text>
  <text x="760" y="278" text-anchor="middle" font-size="17" fill="#232733">再广播给各端</text>
  <text x="760" y="312" text-anchor="middle" font-size="17" fill="#232733">shared/stream-event.ts</text>
  <circle cx="50" cy="62" r="13" fill="#6366F1"/><text x="50" y="67" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">1</text>
  <circle cx="400" cy="232" r="13" fill="#6366F1"/><text x="400" y="237" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">2</text>
  <circle cx="670" cy="202" r="13" fill="#6366F1"/><text x="670" y="207" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">3</text>
  <circle cx="50" cy="352" r="13" fill="#6366F1"/><text x="50" y="357" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">4</text>
  <text x="760" y="336" text-anchor="middle" font-size="17" fill="#232733">= 大家共用的词典</text>

  <path d="M582,250 C600,245 610,245 648,248" fill="none" stroke="#6366F1" stroke-width="3.5" marker-end="url(#arb)"/>
  <path d="M650,285 C620,292 605,290 584,278" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <text x="612" y="230" text-anchor="middle" font-size="17" fill="#6366F1" font-weight="bold">事件流</text>
  <text x="618" y="318" text-anchor="middle" font-size="17" fill="#232733">订阅</text>
</svg>
<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>网页端（浏览器）：</b>React 19 + Zustand 只负责接住事件、存好、画出来，答案全靠后端送来。</p></div>
<div class="step"><span class="n">2</span><p><b>WebSocket 长连接：</b>回答被拆成 stream_event 小事件，一段段推过来，页面不用刷新。</p></div>
<div class="step"><span class="n">3</span><p><b>后端 + Agent Runner：</b>真正干活的地方。先记账、把关、滤掉隐私，再广播给各端。</p></div>
<div class="step"><span class="n">4</span><p><b>Electron 桌面壳：</b>它加载的就是同一套网页，只多了一道 Preload 安全门，所以两边体验一致。</p></div>
</div>

<h2>三个关键词</h2>
<div class="grid">
  <div class="card"><h3>StreamEvent</h3><p>回答被拆成很多小事件：来一点文字、开一个工具、报一笔用量。前后端用同一份类型文件定义它们。</p></div>
  <div class="card"><h3>Zustand</h3><p>网页端的记忆仓库。每个事件到了先攒起来，凑够一帧才刷新画面，所以打字再快也不卡。</p></div>
  <div class="card"><h3>Preload 桥</h3><p>桌面窗口里的一道安全门。网页想用电脑的能力，只能走它开放的 5 个具名方法，别无他路。</p></div>
</div>

<h2>打个比方</h2>
<div class="card"><p>后端像一位念稿子的播音员，一句一句往外念。网页和桌面窗口是两个听众，手里拿着同一本台词本（共享类型），所以每句都听得懂。听众还自带一个速记习惯：先记在草稿上，每秒只誊一次到正式笔记本上，又快又整齐。</p></div>
<h2>再多懂一点</h2>
<ul class="more">
<li>Zustand 选型：16 个领域 store 全用最朴素的 create 写法，零中间件，持久化直接读写 localStorage。</li>
<li>rAF 攒帧：文字增量先攒进缓冲区，每个动画帧最多刷新一次画面，模型吐字再快也不卡。</li>
<li>contextIsolation：渲染进程被当成不可信环境，Preload 只开 5 个具名方法，测试还禁止它出现 fs 字样。</li>
</ul>

<h2>想读原版详解？</h2>
<p>
<a href="../wiki/versions/2026-08-25-103405/24-web-qian-duan-jia-gou-react-19-zustand-zhuang-tai-guan-li-yu-ye-mian-lu-you.md">Web 前端架构：React 19、Zustand 状态管理与页面路由</a><br>
<a href="../wiki/versions/2026-08-25-103405/25-streamevent-liu-shi-qi-yue-san-duan-gong-xiang-lei-xing-yu-tong-bu-ji-zhi.md">StreamEvent 流式契约：三端共享类型与同步机制</a><br>
<a href="../wiki/versions/2026-08-25-103405/26-electron-shou-xian-shell-contextisolation-yu-preload-ipc-qiao-jie.md">Electron 受限 Shell：contextIsolation 与 Preload IPC 桥接</a>
</p>

<nav class="nav">
<a href="07-zidonghua-jiyi.html">← 第 7 章 · 自动化记忆</a>
<a href="index.html">返回目录</a>
<a href="09-gongcheng-yunwei.html">第 9 章 · 工程运维 →</a>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{t as default};
