const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#EC4899">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第5章 · 多渠道接入层 · Miniclaw 新手图解</title>
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
<span class="chip">给完全新手 · 第 5 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>多渠道接入层</h1>
<p class="lede">七个聊天软件，一个大门卫。</p>

<h2>这是什么？</h2>
<p>Miniclaw 能同时接上飞书、Telegram、微信、QQ、钉钉、Discord、WhatsApp 这七个聊天软件。每个软件的"说话方式"都不一样，所以它给每个软件配了一位翻译官（适配器），把所有话翻译成同一种格式。消息进来先记在账本上，干完活再把回复稳稳地送回去，中途断电也不会弄丢。</p>

<h2>一张图看懂</h2>
<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#232733"/>
    </marker>
  </defs>
  <!-- 七个渠道 -->
  <g font-size="18" fill="#232733" text-anchor="middle">
    <rect x="18" y="26" width="112" height="52" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
    <text x="74" y="59">飞书</text>
    <rect x="144" y="26" width="112" height="52" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
    <text x="200" y="59">Telegram</text>
    <rect x="270" y="26" width="112" height="52" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
    <text x="326" y="59">微信</text>
    <rect x="396" y="26" width="112" height="52" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
    <text x="452" y="59">QQ</text>
    <rect x="522" y="26" width="112" height="52" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
    <text x="578" y="59">钉钉</text>
    <rect x="648" y="26" width="112" height="52" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
    <text x="704" y="59">Discord</text>
    <rect x="774" y="26" width="112" height="52" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
    <text x="830" y="59">WhatsApp</text>
  </g>
  <g><circle cx="18" cy="26" r="13" fill="#EC4899"/><text x="18" y="31" font-size="15" fill="#fff" font-weight="bold" text-anchor="middle">1</text></g>
  <!-- 汇入箭头 -->
  <g stroke="#232733" stroke-width="3" marker-end="url(#ar)">
    <line x1="74" y1="82" x2="330" y2="146"/>
    <line x1="200" y1="82" x2="360" y2="146"/>
    <line x1="326" y1="82" x2="420" y2="146"/>
    <line x1="452" y1="82" x2="450" y2="146"/>
    <line x1="578" y1="82" x2="480" y2="146"/>
    <line x1="704" y1="82" x2="540" y2="146"/>
    <line x1="830" y1="82" x2="570" y2="146"/>
  </g>
  <!-- 统一收件箱 -->
  <rect x="250" y="152" width="400" height="66" rx="14" fill="#EC4899" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
  <g font-size="18" fill="#232733" text-anchor="middle">
    <text x="450" y="179" font-size="21" font-weight="bold">统一收件箱 Inbox</text>
    <text x="450" y="205">先落账本再干活：不丢、不重复</text>
  </g>
  <g><circle cx="250" cy="152" r="13" fill="#EC4899"/><text x="250" y="157" font-size="15" fill="#fff" font-weight="bold" text-anchor="middle">2</text></g>
  <line x1="450" y1="222" x2="450" y2="272" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <!-- Agent 处理 -->
  <rect x="250" y="278" width="400" height="66" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <g font-size="18" fill="#232733" text-anchor="middle">
    <text x="450" y="305" font-size="21" font-weight="bold">AI 助手开工</text>
    <text x="450" y="331">/ 开头的命令在这里就被拦下，不惊动 AI</text>
  </g>
  <g><circle cx="250" cy="278" r="13" fill="#EC4899"/><text x="250" y="283" font-size="15" fill="#fff" font-weight="bold" text-anchor="middle">3</text></g>
  <line x1="450" y1="348" x2="450" y2="398" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <!-- 发件箱 -->
  <rect x="250" y="404" width="400" height="66" rx="14" fill="#EC4899" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
  <g font-size="18" fill="#232733" text-anchor="middle">
    <text x="450" y="431" font-size="21" font-weight="bold">发件箱 Outbox</text>
    <text x="450" y="457">一步步记账寄出，没把握就不硬发</text>
  </g>
  <g><circle cx="250" cy="404" r="13" fill="#EC4899"/><text x="250" y="409" font-size="15" fill="#fff" font-weight="bold" text-anchor="middle">4</text></g>
  <!-- 回程箭头 -->
  <path d="M654 437 L862 437 Q882 437 882 417 L882 106 Q882 86 862 86 L846 86"
        fill="none" stroke="#EC4899" stroke-width="3" stroke-dasharray="9 7" marker-end="url(#ar)"/>
  <text x="888" y="270" font-size="18" fill="#232733" text-anchor="middle" transform="rotate(90 888 270)">回复原路送回聊天软件</text>
</svg>
<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>七个渠道：</b>七家软件的接口五花八门，各自的适配器把它们全翻译成同一种格式，再统一送进门。</p></div>
<div class="step"><span class="n">2</span><p><b>统一收件箱 Inbox：</b>消息先写进数据库账本并靠唯一标记去重，落库成功才开工，所以不丢也不重复。</p></div>
<div class="step"><span class="n">3</span><p><b>AI 助手开工：</b>/ 开头的命令在这一层就被拦下直接处理，不惊动 AI；普通消息才排队交给助手。</p></div>
<div class="step"><span class="n">4</span><p><b>发件箱 Outbox：</b>回复一条条记账寄出，收到平台回执才算送达；拿不准结果就冻结等人确认，绝不盲目重发。</p></div>
</div>

<h2>三个关键词</h2>
<div class="grid">
  <div class="card">
    <h3>适配器</h3>
    <p>像一排插座转换头。七个软件的接口五花八门，适配器把它们全转成同一个标准插口，后面只管一套流程。</p>
  </div>
  <div class="card">
    <h3>账号绑定</h3>
    <p>每个群聊、私聊都要先"认主"才归你管。私聊靠一次性配对码，群里由主人发命令说了算。</p>
  </div>
  <div class="card">
    <h3>不丢账本</h3>
    <p>收件和寄件都先写进数据库这本大账。程序崩了重启，翻账本接着办；拿不准结果的事，宁可停下来等人确认。</p>
  </div>
</div>

<h2>打个比方</h2>
<div class="card"><p>把它想象成小区快递驿站：七家快递公司送来的包裹，进门先统一登记入库，再按单子分拣派工；往外寄的包裹也是逐件登记后才交出去。哪天驿站停电了，翻登记本就知道哪些送到了、哪些还没动，绝不多送一件，也绝不漏送一件。</p></div>

<h2>再多懂一点</h2>
<ul class="more">
<li>绑定方向是硬规定：群聊只能绑工作区，私聊只能绑会话，分不清类型时宁可拒绝也不猜。</li>
<li>群聊和私聊看地址就能分辨：群组绝不会被误判成私聊，最坏只是私聊要多发一条命令手动认领。</li>
<li>流式卡片也记在账本里：程序崩溃重启后能找回平台上的旧卡片接着续写收尾，不会另开一张新卡。</li>
</ul>

<h2>想读原版详解？</h2>
<p><a href="../wiki/versions/2026-08-25-103405/15-qi-da-qu-dao-gua-pei-qi-fei-shu-telegram-wei-xin-qq-ding-ding-discord-whatsapp.md">七大渠道适配器：飞书、Telegram、微信、QQ、钉钉、Discord、WhatsApp</a></p>
<p><a href="../wiki/versions/2026-08-25-103405/16-duo-zhang-hao-guan-li-yu-bang-ding-bian-jie-qun-liao-gua-zai-si-liao-session-yu-qu-dao-shen-fen-gui-shu.md">多账号管理与绑定边界：群聊挂载、私聊 Session 与渠道身份归属</a></p>
<p><a href="../wiki/versions/2026-08-25-103405/17-ke-kao-xing-zhuang-tai-ji-inbox-turn-outbox-yu-streaming-card-de-chi-jiu-tou-di.md">可靠性状态机：Inbox、Turn、Outbox 与 Streaming Card 的持久投递</a></p>
<p><a href="../wiki/versions/2026-08-25-103405/18-im-ming-ling-xi-tong-zhi-du-bian-geng-yu-owner-men-kong-ming-ling.md">IM 命令系统：制度变更与 Owner 门控命令</a></p>

<nav class="nav">
  <a href="04-agent-yinqing.html">← 上一章：Agent 引擎</a>
  <a href="index.html">返回目录</a>
  <a href="06-anquan-quanxian.html">下一章：安全与权限 →</a>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{n as default};
