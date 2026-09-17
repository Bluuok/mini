const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 20 章 · OAuth 与凭证管理 · Craft Agents 图解精读</title>
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
<p class="crumb">第 20 章 / 23 · 会话与扩展 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 20 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>OAuth 与凭证管理</h1>
<p class="lede">十一种凭证全锁进一个 AES-256-GCM 加密文件；门禁卡到期前 5 分钟自动换新，办卡流程永远是「先开单、后取卡」两步。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>整栋楼只有一台保险柜（credentials.enc），大模型间的钥匙、外部服务的门卡、工作区的通行证分格存放，格位标签用 :: 隔出类型、工作区和来源。办卡永远两步：前台先开预约单（准备授权链接和 PKCE 暗号），你亲自去窗口签字（浏览器授权），回来凭回执取卡（授权码换令牌）入柜。卡快到期系统自动续新，绝不带病上岗。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="OAuth 准备-交换两阶段流程"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="26" y="62" width="188" height="106" rx="14" fill="#fff" stroke="#f2b705" stroke-width="3"/>
    <text x="120" y="100" text-anchor="middle" font-size="24">📝🔑</text>
    <text x="120" y="128" text-anchor="middle" font-size="13.5" font-weight="700">准备阶段</text>
    <text x="120" y="150" text-anchor="middle" font-size="12.5" fill="#5b6478">authUrl + PKCE 质询 + state</text>
    <line x1="218" y1="115" x2="270" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="274" y="62" width="188" height="106" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="368" y="100" text-anchor="middle" font-size="24">🖥️✅</text>
    <text x="368" y="128" text-anchor="middle" font-size="13.5" font-weight="700">浏览器授权</text>
    <text x="368" y="150" text-anchor="middle" font-size="12.5" fill="#5b6478">你登录并点头同意</text>
    <line x1="466" y1="115" x2="518" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="522" y="62" width="188" height="106" rx="14" fill="#fff" stroke="#f2b705" stroke-width="3"/>
    <text x="616" y="100" text-anchor="middle" font-size="24">🔁🎟️</text>
    <text x="616" y="128" text-anchor="middle" font-size="13.5" font-weight="700">回调换令牌</text>
    <text x="616" y="150" text-anchor="middle" font-size="12.5" fill="#5b6478">本地端口 6477–6577 收码</text>
    <line x1="714" y1="115" x2="766" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="770" y="62" width="84" height="106" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="812" y="108" text-anchor="middle" font-size="26">🔐</text>
    <text x="812" y="140" text-anchor="middle" font-size="13" font-weight="700">加密入库</text>
    <rect x="26" y="20" width="828" height="26" rx="13" fill="#ece7fc"/>
    <text x="440" y="38" text-anchor="middle" font-size="13" fill="#4a3d80">准备（无副作用：不开浏览器、不起服务器）→ 交换（拿真令牌）→ 过期前 5 分钟自动刷新</text>
</svg>
<p class="caption">🧾 「准备-然后-交换」两步解耦，让本地与远程执行环境走同一条路。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>服务器生成授权链接：内含 PKCE 质询和 state 存进 OAuthFlowStore<small>TTL 只有 5 分钟且定期清理——过期没人领的单作废</small></p></div><div class="step"><span class="n">2</span><p>浏览器打开授权页，你登录并同意<small>Microsoft 与 Claude 用纯 PKCE 免密钥；Google 则要求桌面应用也交 client_secret</small></p></div><div class="step"><span class="n">3</span><p>提供商把浏览器重定向回本地回调服务器<small>在 6477–6577 范围最多试 100 个端口找空位，解析出授权码</small></p></div><div class="step"><span class="n">4</span><p>客户端带回码，服务器到 tokenEndpoint 换正式令牌<small>远程/WebUI 场景改经 agents.craft.do 的 OAuth 中继转发回调</small></p></div><div class="step"><span class="n">5</span><p>令牌连同 refreshToken、expiresAt 加密写盘；临期自动刷新<small>刷新失败进入 5 分钟冷却期，期间不再反复打扰提供商</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>11 种</b><span>凭证类型，分四个逻辑组</span></div><div class="stat"><b>AES-256-GCM</b><span>整个凭证文件的加密算法</span></div><div class="stat"><b>10 万次</b><span>PBKDF2 密钥派生迭代数</span></div><div class="stat"><b>128 字符</b><span>随机 code verifier（S256）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>所有密钥落进 ~/.craft-agent/credentials.enc 单个文件，文件头是 CRAFT01\\0 魔数字节＋64 字节头。</li><li>MCP OAuth 三段渐进发现（RFC 8414 → RFC 9728 → 动态客户端注册）；isUrlSafeToFetch() 拒绝私有 IP 和非 HTTPS。</li><li>ChatGPT 登录同时拿 id_token 与 access_token，id_token 可兑换成 API 密钥供后端使用。</li><li>Claude OAuth 刷新配内存互斥锁：多个会话同时启动只刷一次，其余等同一个 Promise。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>换台电脑，保险柜还打得开吗？这种硬件绑定靠得住吗？</dt><dd>打不开——加密密钥派生自本机硬件 UUID，文件拷过去也无用；启动自检 checkHealth 会报 decryption_failed 并给出迁移指引，旧版本加密的凭证有旧密钥路径迁出重加密。但它不保护的是「正在使用这台电脑的人」：本机上的进程按设计就能读到解密后的凭证。</dd><dt>这么多令牌到处飞，会不会明文裸奔？</dt><dd>不会：静态存储走 AES-256-GCM；用户名密码型来源另存为 source_basic，多请求头型（如 Datadog 双密钥）存结构化对象。环境变量是只读兜底后端（如 ANTHROPIC_API_KEY），能读不能写。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../OAuth_与凭证管理_lukilabs_craft-agents-oss/OAuth_与凭证管理_lukilabs_craft-agents-oss.md">OAuth 与凭证管理</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="19-lai-yuan-yu-ji-neng.html">第 19 章 · 来源与技能系统</a><a href="21-hui-hua-gong-ju-he-xin.html">第 21 章 · 会话工具核心</a></div>

<nav class="nav">
<a href="19-lai-yuan-yu-ji-neng.html">上一章：来源与技能系统 ←</a>
<a href="index.html">返回目录</a>
<a href="21-hui-hua-gong-ju-he-xin.html">下一章：会话工具核心 →</a>
</nav>
<footer>Craft Agents 图解精读 · 20 / 23</footer>
</div></body></html>
`;export{t as default};
