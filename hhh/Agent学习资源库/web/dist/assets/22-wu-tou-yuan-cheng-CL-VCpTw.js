const e=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 22 章 · 无头远程服务器 · Craft Agents 图解精读</title>
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
<p class="crumb">第 22 章 / 23 · 部署形态 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 22 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>无头远程服务器</h1>
<p class="lede">脱离 Electron 的远程后端：握手验令牌才开工，断线事件能补投，要开浏览器就委托客户端代劳；想暴露公网？先配 TLS，否则拒绑。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>一位宅在机房的资深管家：自己没有眼睛和手——「打开网页」这类露脸的活全部保留为 undefined，打电话让连上来的客人代办。上岗规矩严格：工牌不足 16 位或拿单字重复糊弄，当场拒收；客人短暂掉线不慌，漏听的话都记在小本上（环形缓冲），重连后逐条补念。想在临街开窗营业？先装好加密专线，否则宁可不开门。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="WebSocket 握手与事件补投"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="30" y="46" width="230" height="120" rx="14" fill="#fff" stroke="#f2b705" stroke-width="3"/>
    <text x="145" y="84" text-anchor="middle" font-size="22">💻 客户端</text>
    <text x="145" y="114" text-anchor="middle" font-size="12.5" fill="#5b6478">桌面应用 · CLI · 浏览器 WebUI</text>
    <text x="145" y="140" text-anchor="middle" font-size="12.5" fill="#5b6478">附 Bearer 令牌或会话 Cookie</text>
    <rect x="380" y="46" width="200" height="120" rx="14" fill="#fff" stroke="#e5484d" stroke-width="3"/>
    <text x="480" y="82" text-anchor="middle" font-size="15" font-weight="700">① handshake 信封</text>
    <text x="480" y="106" text-anchor="middle" font-size="12.5" fill="#5b6478">令牌 + 协议版本 + 能力公告</text>
    <text x="480" y="138" text-anchor="middle" font-size="15" font-weight="700">② handshake_ack</text>
    <text x="480" y="160" text-anchor="middle" font-size="12.5" fill="#5b6478">服务器版本 + 分配 clientId</text>
    <rect x="700" y="46" width="152" height="120" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="776" y="84" text-anchor="middle" font-size="22">🗄️🧠</text>
    <text x="776" y="112" text-anchor="middle" font-size="13.5" font-weight="700">Headless 服务器</text>
    <text x="776" y="140" text-anchor="middle" font-size="12.5" fill="#5b6478">request / event 双向</text>
    <line x1="264" y1="92" x2="376" y2="92" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="584" y1="118" x2="696" y2="118" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="696" y1="80" x2="584" y2="80" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="376" y1="146" x2="264" y2="146" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="380" y="192" width="472" height="28" rx="14" fill="#ece7fc"/>
    <text x="616" y="211" text-anchor="middle" font-size="13" fill="#4a3d80">📢 推送事件按客户端编号存环形缓冲 → 断线重连后重放未确认部分</text>
</svg>
<p class="caption">🤝 一次握手建立长期互信；六种消息类型编解码，二进制转 base64 不丢包。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>启动第一步先验工牌：令牌至少 16 字符、不许单字重复<small>唯一字符少于 8 个警告但放行；--generate-token 直接打印 48 位随机十六进制令牌退出</small></p></div><div class="step"><span class="n">2</span><p>createHeadlessPlatform 用控制台日志与 sharp 图像处理顶替 Electron<small>openPath/openExternal 等保留 undefined，能力系统路由到客户端执行</small></p></div><div class="step"><span class="n">3</span><p>建 ~/.craft-agent 配置目录，抢 PID 锁防双开<small>.server.lock 感知 Docker PID-1 复用，容器遗留的过期锁会被覆盖</small></p></div><div class="step"><span class="n">4</span><p>客户端握手拿到 clientId 后开始收推送<small>CLI 走 Bearer 令牌；浏览器走 craft_session JWT Cookie（需启用 WebUI）</small></p></div><div class="step"><span class="n">5</span><p>SIGTERM 优雅关闭：广播 shuttingDown 清场<small>宽限 2 秒让客户端收尾，再清会话、关 WS、释放流程存储与锁文件</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>48 字符</b><span>--generate-token 生成的随机令牌长度</span></div><div class="stat"><b>9100</b><span>默认 RPC 端口（默认只绑 127.0.0.1）</span></div><div class="stat"><b>2 秒</b><span>关机广播后的客户端宽限期</span></div><div class="stat"><b>16 字符</b><span>服务器令牌的最小长度门槛</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>WebUI 与 RPC 共用同一端口：非 WebSocket 的 HTTP 请求经 nodeHttpAdapter 桥接给静态文件与登录路由。</li><li>CRAFT_HEALTH_PORT 开启独立健康检查：GET /health 健康 200 / 降级 503，专为 K8s 探针设计且无需认证。</li><li>Docker 镜像基于 oven/bun:1.3-slim，以非 root 用户 craftagents 运行——Claude Agent SDK 拒绝以 root 执行。</li><li>服务器把 CRAFT_SERVER_URL= 与 CRAFT_SERVER_TOKEN= 写到标准输出，CLI 读这两行判断「已就绪」。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>鉴权令牌会在公网上被人明文截走吗？</dt><dd>设计上不会：把 CRAFT_RPC_HOST 绑到非环回地址却没配 TLS 证书时，服务器拒绝绑定并报错退出。它强制的是传输层加密这条底线；一旦你显式加 --allow-insecure-bind 放行，系统就不再拦你——风险自负。</dd><dt>两个服务器实例同时跑会不会打架？</dt><dd>靠 ~/.craft-agent/.server.lock 的 PID 锁防双开，且该机制感知 Docker 里 PID-1 复用的场景，能清掉上一个容器生命周期遗留的过期锁。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../无头远程服务器_lukilabs_craft-agents-oss/无头远程服务器_lukilabs_craft-agents-oss.md">无头远程服务器</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="21-hui-hua-gong-ju-he-xin.html">第 21 章 · 会话工具核心</a><a href="23-webui-cha-kan-qi.html">第 23 章 · WebUI 与会话查看器</a></div>

<nav class="nav">
<a href="21-hui-hua-gong-ju-he-xin.html">上一章：会话工具核心 ←</a>
<a href="index.html">返回目录</a>
<a href="23-webui-cha-kan-qi.html">下一章：WebUI 与会话查看器 →</a>
</nav>
<footer>Craft Agents 图解精读 · 22 / 23</footer>
</div></body></html>
`;export{e as default};
