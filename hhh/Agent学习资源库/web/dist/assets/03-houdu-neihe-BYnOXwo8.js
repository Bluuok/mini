const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#10B981">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第3章 · 后端服务内核 · Miniclaw 新手图解</title>
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
<span class="chip">给完全新手 · 第 3 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>后端服务内核</h1>
<p class="lede">藏在聊天窗口背后、日夜干活的那台"总管家"。</p>

<h2>这是什么？</h2>
<p>Miniclaw 的后端是一个在服务器上运行的程序：收消息、排队派活、把结果送回去。它的几乎所有状态都写进一个 SQLite 文件，内存里的东西只是临时便签——重启后全靠数据库恢复现场。</p>

<h2>一张图看懂</h2>
<svg viewBox="0 0 900 520" role="img" aria-label="消息主链路示意图">
  <defs>
    <marker id="ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 Z" fill="#232733"/>
    </marker>
  </defs>
  <!-- 主链路五个框 -->
  <rect x="15" y="50" width="150" height="90" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="90" y="88" text-anchor="middle" font-size="19" fill="#232733">消息进来</text>
  <text x="90" y="116" text-anchor="middle" font-size="17" fill="#5A6072">微信 / 飞书 / 网页</text>

  <rect x="210" y="50" width="150" height="90" rx="14" fill="#10B98122" stroke="#232733" stroke-width="3"/>
  <text x="285" y="88" text-anchor="middle" font-size="19" fill="#232733">路由分发</text>
  <text x="285" y="116" text-anchor="middle" font-size="17" fill="#5A6072">Hono 找到入口</text>

  <rect x="405" y="50" width="150" height="90" rx="14" fill="#10B98122" stroke="#232733" stroke-width="3"/>
  <text x="480" y="82" text-anchor="middle" font-size="19" fill="#232733">门禁与排队</text>
  <text x="480" y="108" text-anchor="middle" font-size="17" fill="#5A6072">验 Cookie</text>
  <text x="480" y="130" text-anchor="middle" font-size="17" fill="#5A6072">同一会话排队做</text>

  <rect x="600" y="50" width="135" height="90" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="667" y="88" text-anchor="middle" font-size="19" fill="#232733">Agent 干活</text>
  <text x="667" y="116" text-anchor="middle" font-size="17" fill="#5A6072">调用模型思考</text>

  <rect x="762" y="50" width="123" height="90" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="823" y="88" text-anchor="middle" font-size="19" fill="#232733">回复送达</text>
  <text x="823" y="116" text-anchor="middle" font-size="17" fill="#5A6072">原路返回</text>

  <line x1="165" y1="95" x2="203" y2="95" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <line x1="360" y1="95" x2="398" y2="95" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <line x1="555" y1="95" x2="593" y2="95" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <line x1="750" y1="95" x2="755" y2="95" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>

  <!-- 数据库 -->
  <ellipse cx="480" cy="270" rx="110" ry="18" fill="#10B98122" stroke="#232733" stroke-width="3"/>
  <path d="M370,270 L370,330 A110,18 0 0 0 590,330 L590,270" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <ellipse cx="480" cy="270" rx="110" ry="18" fill="#10B98122" stroke="#232733" stroke-width="3"/>
  <text x="480" y="305" text-anchor="middle" font-size="19" fill="#232733">SQLite 数据库</text>
  <text x="480" y="352" text-anchor="middle" font-size="17" fill="#5A6072">唯一可信的状态来源</text>

  <!-- 落库与推送箭头 -->
  <line x1="480" y1="140" x2="480" y2="248" stroke="#10B981" stroke-width="3" marker-end="url(#ar)"/>
  <text x="497" y="200" font-size="17" fill="#232733">每一步都记账落库</text>

  <line x1="590" y1="290" x2="800" y2="290" stroke="#232733" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#ar)"/>
  <line x1="800" y1="290" x2="800" y2="148" stroke="#232733" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#ar)"/>
  <text x="700" y="278" text-anchor="middle" font-size="17" fill="#5A6072">WebSocket 实时推送给网页</text>

  <!-- 启动顺序 -->
  <rect x="15" y="420" width="200" height="72" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="115" y="450" text-anchor="middle" font-size="18" fill="#232733">① 清理僵尸任务</text>
  <text x="115" y="474" text-anchor="middle" font-size="16" fill="#5A6072">上次没干完的先收拾</text>

  <rect x="250" y="420" width="200" height="72" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="350" y="450" text-anchor="middle" font-size="18" fill="#232733">② 从库中恢复游标</text>
  <text x="350" y="474" text-anchor="middle" font-size="16" fill="#5A6072">读到哪了，接着来</text>

  <rect x="485" y="420" width="185" height="72" rx="14" fill="#10B98122" stroke="#232733" stroke-width="3"/>
  <text x="577" y="450" text-anchor="middle" font-size="18" fill="#232733">③ 提前开 Web 服务</text>
  <text x="577" y="474" text-anchor="middle" font-size="16" fill="#5A6072">登录页面不卡壳</text>

  <rect x="705" y="420" width="180" height="72" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="795" y="450" text-anchor="middle" font-size="18" fill="#232733">④ 再连各渠道</text>
  <text x="795" y="474" text-anchor="middle" font-size="16" fill="#5A6072">最后才接外部消息</text>

  <line x1="215" y1="456" x2="243" y2="456" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <line x1="450" y1="456" x2="478" y2="456" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <line x1="670" y1="456" x2="698" y2="456" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
  <!-- 节点编号徽章 -->
  <circle cx="27" cy="50" r="13" fill="#10B981"/><text x="27" y="55" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">1</text>
  <circle cx="222" cy="50" r="13" fill="#10B981"/><text x="222" y="55" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">2</text>
  <circle cx="417" cy="50" r="13" fill="#10B981"/><text x="417" y="55" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">3</text>
  <circle cx="612" cy="50" r="13" fill="#10B981"/><text x="612" y="55" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">4</text>
  <circle cx="774" cy="50" r="13" fill="#10B981"/><text x="774" y="55" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">5</text>
  <circle cx="384" cy="254" r="13" fill="#10B981"/><text x="384" y="259" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">6</text>
</svg>

<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>消息进来：</b>微信、飞书或网页上的每条消息，先由对应渠道的适配器接收，并立刻写进数据库留底。</p></div>
<div class="step"><span class="n">2</span><p><b>路由分发：</b>网页请求进来时，Hono 按网址前缀把请求分给约 19 个子模块之一，找到对应的处理入口。</p></div>
<div class="step"><span class="n">3</span><p><b>门禁与排队：</b>先验带 HMAC 签名的 Cookie，再过权限、配额等门控；同一会话排成一队，严格按顺序做。</p></div>
<div class="step"><span class="n">4</span><p><b>Agent 干活：</b>队列把消息交给 Agent——会话已有活跃 Runner 就直接注入，否则冷启动一个新回合调用模型。</p></div>
<div class="step"><span class="n">5</span><p><b>回复送达：</b>结果经持久化投递队列送回原渠道；网页端则通过 WebSocket 实时收到推送，不用刷新页面。</p></div>
<div class="step"><span class="n">6</span><p><b>SQLite 数据库：</b>内存只是临时便签，重启后全靠库里的游标和消息恢复现场；升级改表前还先备份整库。</p></div>
</div>
<h2>三个关键词</h2>
<div class="grid">
  <div class="card">
    <h3>编排巨石</h3>
    <p>启动、调度、收发消息都集中在一个超大的入口文件里统一指挥。好处是规则不会散落各处，代价是这个文件特别长。</p>
  </div>
  <div class="card">
    <h3>Cookie 门禁</h3>
    <p>网页登录后会领到一块带防伪签名（HMAC）的 Cookie。每个请求都要验签才放行；WebSocket 升级时也单独查一遍。</p>
  </div>
  <div class="card">
    <h3>版本化迁移</h3>
    <p>数据库里存着版本号。程序升级时先自动备份整个库，再把旧表结构一步一步改成新样子，改坏了能退回来。</p>
  </div>
</div>

<h2>打个比方</h2>
<div class="card">
  <p>后端像一家餐厅：迎宾把客人领到对应桌号（路由），服务员核对会员卡（Cookie 认证），同一桌的菜按顺序一道道做（会话内严格串行）。账本（SQLite）记下每笔订单——就算突然停电，重开后翻账本就知道哪些菜还没上，补上就行。这就是"崩溃恢复"。</p>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>启动四步的顺序是正确性要求：先清理并恢复状态，再提前开网页服务，对账完成前不接外部消息。</li>
<li>Cookie 值是"令牌.HMAC 签名"两段拼接：就算数据库泄漏，偷到库里存的令牌也伪造不出能用的 Cookie。</li>
<li>WebSocket 升级不走 Hono 中间件，需单独验 Origin 与签名 Cookie；推送按白名单过滤，宁漏发不泄漏。</li>
</ul>
<h2>想读原版详解？</h2>
<div class="card">
  <a href="../wiki/versions/2026-08-25-103405/7-fu-wu-qi-dong-yu-xiao-xi-bian-pai-zhu-liu-cheng-pou-xi.md">第 7 页 · 服务器启动与消息编排主流程</a><br>
  <a href="../wiki/versions/2026-08-25-103405/8-hono-web-fu-wu-lu-you-zu-cookie-ren-zheng-yu-websocket.md">第 8 页 · Hono 路由、Cookie 认证与 WebSocket</a><br>
  <a href="../wiki/versions/2026-08-25-103405/9-sqlite-chi-jiu-hua-schema-ban-ben-hua-qian-yi-ce-lue-yu-he-xin-biao-zu.md">第 9 页 · SQLite 持久化与版本化迁移</a>
</div>

<nav class="nav">
  <a href="02-hexin-jiagou.html">← 上一章：核心架构</a>
  <a href="index.html">返回目录</a>
  <a href="04-agent-yinqing.html">下一章：Agent 引擎 →</a>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{t as default};
