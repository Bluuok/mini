const e=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 1 章 · 项目概览：自托管多用户 Claude Code 工作台 · HappyClaw 图解精读</title>
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
<p class="crumb">第 1 章 / 30 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 1 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>项目概览：自托管多用户 Claude Code 工作台</h1>
<p class="lede">HappyClaw 不是又一层聊天套壳，而是把完整的 Claude Code 运行时封装成常驻在你自己服务器上的多用户工作台：网页和 7 种 IM 随时唤醒，任务在宿主机或 Docker 沙箱里真刀真枪地跑。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像把一位全能员工从「有事才找的外包」改成「常驻坐班」：以前每个问题都要打包寄给云端咨询公司（API 转发），如今他坐进你的办公室，有自己的工牌（智能体身份）、专属工位（工作区）和一柜子项目档案（会话与记忆）。前台换成飞书、微信、Telegram 也没关系——单子照样递到他桌上。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="消息从入口到执行的全景"><defs><marker id="ar1" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="28" y="22" width="216" height="84" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="136" y="60" text-anchor="middle" font-size="24">🌐📱</text>
    <text x="136" y="92" text-anchor="middle" font-size="14" fill="#5b6478">Web / PWA 浏览器</text>
    <rect x="28" y="124" width="216" height="84" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="136" y="160" text-anchor="middle" font-size="22">💬✈️🐧</text>
    <text x="136" y="194" text-anchor="middle" font-size="14" fill="#5b6478">7 种 IM 消息渠道</text>
    <line x1="246" y1="64" x2="306" y2="94" stroke="#232733" stroke-width="4" marker-end="url(#ar1)"/>
    <line x1="246" y1="166" x2="306" y2="138" stroke="#232733" stroke-width="4" marker-end="url(#ar1)"/>
    <rect x="312" y="52" width="252" height="128" rx="16" fill="#f1ecfe" stroke="var(--accent)" stroke-width="3"/>
    <text x="438" y="98" text-anchor="middle" font-size="26">🏢⚙️</text>
    <text x="438" y="130" text-anchor="middle" font-size="15" font-weight="700">Node 主服务（唯一进程）</text>
    <text x="438" y="156" text-anchor="middle" font-size="13" fill="#5b6478">认证 RBAC · 路由队列 · 任务调度</text>
    <line x1="566" y1="92" x2="626" y2="64" stroke="#232733" stroke-width="4" marker-end="url(#ar1)"/>
    <line x1="566" y1="140" x2="626" y2="168" stroke="#232733" stroke-width="4" marker-end="url(#ar1)"/>
    <rect x="632" y="24" width="220" height="82" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="742" y="58" text-anchor="middle" font-size="20">🖥️</text>
    <text x="742" y="88" text-anchor="middle" font-size="13.5" fill="#5b6478">Host Runner · 宿主机执行</text>
    <rect x="632" y="126" width="220" height="82" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="742" y="160" text-anchor="middle" font-size="20">📦</text>
    <text x="742" y="190" text-anchor="middle" font-size="13.5" fill="#5b6478">Container Runner · 沙箱</text>
  </svg>
  <p class="caption">两类访客进门都能派单：Runner 内是真实的 Claude Code，普通成员固定走 Docker 沙箱。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>消息从浏览器或飞书等 IM 渠道进来，汇到单一的常驻主服务<small>Docker 只隔离智能体执行环境，从不承载主服务本身</small></p></div><div class="step"><span class="n">2</span><p>主服务做身份核验，再把任务放进对应的会话队列<small>REST、WebSocket、IM 命令分别执行身份、owner、角色检查</small></p></div><div class="step"><span class="n">3</span><p>Provider 池挑出这一次使用的模型提供商<small>轮询 / 加权 / 故障转移，已开始的会话保持粘性</small></p></div><div class="step"><span class="n">4</span><p>Host 或 Container Runner 拉起真实的 Claude Code 运行时<small>它可以读写项目文件、执行终端命令、用浏览器、调用 MCP</small></p></div><div class="step"><span class="n">5</span><p>流式事件沿 WebSocket 或原渠道回复送回给你<small>前端能看到工具轨迹与 Markdown / Mermaid 实时渲染</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>7</b><span>种 IM 渠道随时唤醒智能体</span></div><div class="stat"><b>168</b><span>个后端源码文件（src/ 约 11.4 万行）</span></div><div class="stat"><b>320+</b><span>个测试文件守护工程质量</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>三层产品模型一句话：智能体管「你是谁」，工作区管「在哪干活」，会话管「这段对话进行到哪」（第 6 章展开）。</li><li>执行有两种模式：Host 直连本机目录（管理员授权），Container 跑在非 root Docker 沙箱（普通成员固定用它）。</li><li>项目刻意只用 npm/Node 工具链：bun 的 HTTP server 不触发 WebSocket upgrade 握手，实时流式输出会全体失效。</li><li>所有持久化数据集中在根目录 data/ 且不进 Git；迁移实例用 make backup / make restore。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>在自己服务器上跑一个会执行代码的服务，不会很危险吗？</dt><dd>它是多层防御的组合：用户、工作区、记忆、密钥用量按 owner 严格隔离；普通成员固定非 root 容器执行；Provider 与渠道密钥用 AES-256-GCM 本机加密、密钥文件权限 0600。但要清楚它不保护什么：弱密码、开着注册 welcome 到处撒邀请、不走 HTTPS 的裸奔链路，都不在系统能兜住的范围内——所以公网部署建议反向代理 + 强密码 + 关闭开放注册 + 定期备份 data/。</dd><dt>它和直接调 Claude API 的聊天机器人有什么区别？</dt><dd>区别在于智能体活在真实的 Claude Code 环境里：不止回文本，还能改代码、跑脚本、控浏览器，并在多个独立工作区和会话之间保持清晰的权限与上下文边界——是把「项目级 AI 工程师」部署到自己服务器，而不是把对话转发给云端。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../01-%E9%A1%B9%E7%9B%AE%E6%A6%82%E8%A7%88%EF%BC%9A%E8%87%AA%E6%89%98%E7%AE%A1%E5%A4%9A%E7%94%A8%E6%88%B7%20Claude%20Code%20%E6%99%BA%E8%83%BD%E4%BD%93%E5%B7%A5%E4%BD%9C%E5%8F%B0.md">项目概览：自托管多用户 Claude Code 智能体工作台</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="02-kuai-su-shang-shou.html">第 2 章 · 快速开始</a><a href="06-san-ceng-mo-xing.html">第 6 章 · 三层产品模型</a></div>

<nav class="nav">
<span style="opacity:.45">这是第一章 ←</span>
<a href="02-kuai-su-shang-shou.html">下一章：快速开始 →</a>
</nav>
<footer>HappyClaw 图解精读 · 1 / 30</footer>
</div></body></html>
`;export{e as default};
