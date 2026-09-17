const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 17 章 · 传输与 RPC 层 · Craft Agents 图解精读</title>
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
<p class="crumb">第 17 章 / 23 · 桌面应用层 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 17 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>传输与 RPC 层</h1>
<p class="lede">弃用 Electron 自带 IPC，改走自定义 WebSocket RPC：每句话装进标准信封，秘书按频道分单——本地机房还是远程分部，UI 完全无感。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一套写字楼无线对讲系统：每个口信必须写在制式传票上（MessageEnvelope，type 字段决定这票是干嘛的）；传呼台按广播范围喊人（发给所有人/某工作区/某台机）。前台养了两条线路——一条直通楼里机房（本地嵌入式服务器），一条接异地分部（远程无头服务器）——接线员盯着频道前缀自动选线：修窗户、换灯泡这类「本地事务」永远找楼内师傅；看订单、查资料则跟着当前工作区走线。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="RoutedClient 双路分发"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="25" y="70" width="205" height="95" rx="14" fill="#eef1fb" stroke="#7C5CFC" stroke-width="3"/>
    <text x="127" y="110" text-anchor="middle" font-size="24">🖥️📨</text>
    <text x="127" y="138" text-anchor="middle" font-size="14.5">渲染器发起调用</text>
    <rect x="315" y="70" width="200" height="95" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="415" y="105" text-anchor="middle" font-size="22">🔀🧭</text>
    <text x="415" y="130" text-anchor="middle" font-size="13.5" font-weight="700">RoutedClient 按频道分类</text>
    <text x="415" y="150" text-anchor="middle" font-size="12.5" fill="#8a92a6">isLocalOnly(channel)</text>
    <rect x="600" y="22" width="255" height="62" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="727" y="46" text-anchor="middle" font-size="14" font-weight="700">🏠 仅本地的 ~50 个频道</text>
    <text x="727" y="68" text-anchor="middle" font-size="12.5" fill="#5b6478">窗口管理、应用更新、主题 → 本地服务器</text>
    <rect x="600" y="128" width="255" height="62" rx="12" fill="#eef9fd" stroke="#3a9bc9" stroke-width="2.5"/>
    <text x="727" y="152" text-anchor="middle" font-size="14" font-weight="700">🌐 可走远程的 ~250 个频道</text>
    <text x="727" y="174" text-anchor="middle" font-size="12.5" fill="#5b6478">会话、文件、来源、技能 → 当前工作区服务器</text>
    <line x1="230" y1="117" x2="311" y2="117" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="517" y1="100" x2="596" y2="60" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="517" y1="136" x2="596" y2="155" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">同一套 UI 代码因此既能连进程内的本地服务器，也能透明切换到网络上的远程服务器。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>连线先递名片：handshake 报上协议版本 1.0、工作区 ID 和令牌<small>版本对不上会被 PROTOCOL_VERSION_UNSUPPORTED 直接拒之门外</small></p></div><div class="step"><span class="n">2</span><p>日常一来一回：request 带 id/channel/args 出门，response 凭同一 id 回家<small>JSON 信封是客户端与服务端共享的稳定契约</small></p></div><div class="step"><span class="n">3</span><p>闲时不掉线靠点名：服务端每 30 秒 ping 一次<small>连续漏掉 2 次 pong 判定死亡，合计约 60 秒容错</small></p></div><div class="step"><span class="n">4</span><p>网一闪断也别慌：最近 500 条事件在环形缓冲区里躺 30 秒<small>60 秒保留期内重连可按 seq 补投；缺了档就发 stale:true 让客户端全量刷新</small></p></div><div class="step"><span class="n">5</span><p>你切到另一个远程工作区：接线员先建后断换线路、重订所有监听器<small>RoutedClient 还顺手把本地工作区 ID 映射成远端 ID，零事件丢失</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>500 条</b><span>每客户端事件环形缓冲区容量，TTL 30 秒</span></div><div class="stat"><b>30 秒</b><span>心跳间隔；漏答 2 次 pong 即断开</span></div><div class="stat"><b>50 台</b><span>服务器默认最大并发客户端数</span></div><div class="stat"><b>380 项</b><span>CHANNEL_MAP 声明式映射取代 329 行手写桥接代码</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>传输是真双向的：服务器也能反向调用客户端——client:openExternal、client:openPath 等能力让远程/无头模式照样能在用户机器上开链接、弹对话框。</li>
<li>编解码器把二进制附件变成 base64 的 {__craftRpcType:'u8'} 往返，业务代码对此完全无感，消灭了一整类 JSON.stringify 弄坏二进制的 Bug。</li>
<li>重连退避从约 1 秒起步封顶 30 秒；成功后发出合成事件触发渲染器恢复陈旧会话。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>用明文 ws:// 连远程服务器会不会被窃听？</dt><dd>预加载层明确拒绝到非本地主机的未加密 ws:// 连接，就是防令牌以明文外泄；需要远程时配 TLS 用 wss://。边界要说清：这保护的是传输途中的令牌，它不保护两端已被入侵的机器本身。</dd>
<dt>新客户端调旧服务器没有的接口怎么办？</dt><dd>握手响应会宣告 registeredChannels，调用前可用 isChannelAvailable() 查询，优雅降级而不是报死。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../传输与_RPC_层_lukilabs_craft-agents-oss/传输与_RPC_层_lukilabs_craft-agents-oss.md">传输与 RPC 层</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="16-xuan-ran-qi-ui.html">第 16 章 · 渲染器 UI 组件</a><a href="18-hui-hua-gong-zuo-qu.html">第 18 章 · 会话与工作区模型</a></div>

<nav class="nav">
<a href="16-xuan-ran-qi-ui.html">上一章：渲染器 UI 组件 ←</a>
<a href="index.html">返回目录</a>
<a href="18-hui-hua-gong-zuo-qu.html">下一章：会话与工作区模型 →</a>
</nav>
<footer>Craft Agents 图解精读 · 17 / 23</footer>
</div></body></html>
`;export{n as default};
