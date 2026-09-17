const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 2 章 · 快速开始：四种运行形态 · Craft Agents 图解精读</title>
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
<p class="crumb">第 2 章 / 23 · 安装与上手 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 2 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>快速开始：四种运行形态</h1>
<p class="lede">桌面应用、CLI 客户端、无头服务器、Docker——四种入门路径针对四种场景，走完任何一条，你都拥有一个能对话、执行工具、连接外部服务的 AI agent。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像入住同一栋公寓的四种方式：拎包入住精装房（一键安装，一条命令下载成品）、买毛坯自己装修（从源码构建，边改边住）、把行李寄存在物业租个储物间长期托管（无头服务器跑在远程机器上随取随用）、短租集装箱试住几天（Docker 容器，可复现可丢弃）。地址不同，户型一样。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="四种路径汇入同一个引擎"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="25" y="28" width="190" height="72" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="120" y="58" text-anchor="middle" font-size="17">🖥️ 桌面应用</text>
<text x="120" y="84" text-anchor="middle" font-size="13" fill="#5b6478">约 1 分钟起</text>
<rect x="237" y="28" width="190" height="72" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="332" y="58" text-anchor="middle" font-size="17">⌨️ CLI 客户端</text>
<text x="332" y="84" text-anchor="middle" font-size="13" fill="#5b6478">单次提示词最快</text>
<rect x="449" y="28" width="190" height="72" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="544" y="58" text-anchor="middle" font-size="17">🛰️ 无头服务器</text>
<text x="544" y="84" text-anchor="middle" font-size="13" fill="#5b6478">远程托管约 3 分钟</text>
<rect x="661" y="28" width="190" height="72" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="756" y="58" text-anchor="middle" font-size="17">🐳 Docker</text>
<text x="756" y="84" text-anchor="middle" font-size="13" fill="#5b6478">约 2 分钟，物理隔离</text>
<line x1="120" y1="100" x2="345" y2="150" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="332" y1="100" x2="395" y2="150" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="544" y1="100" x2="485" y2="150" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="756" y1="100" x2="535" y2="150" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<rect x="300" y="152" width="280" height="62" rx="14" fill="#f3effe" stroke="#7C5CFC" stroke-width="3"/>
<text x="440" y="180" text-anchor="middle" font-size="15" font-weight="700">同一个 Craft Agents 引擎</text>
<text x="440" y="202" text-anchor="middle" font-size="13" fill="#5b6478">区别只在打包方式、传输层和运营模式</text>
</svg>
<p class="caption">选路只看使用场景，不必担心「错过哪条更好的」。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>先挑路径：要图形界面走桌面应用；写脚本、进 CI 走 CLI；远程多端访问走无头服务器；要可复现部署走 Docker<small>后两条都需要克隆源码，CLI 也可用全局别名代替克隆后的每次 cd</small></p></div><div class="step"><span class="n">2</span><p>桌面上，一条命令完成安装：<code>curl -fsSL https://agents.craft.do/install-app.sh | bash</code>（Windows 用 <code>irm …ps1 | iex</code>）<small>脚本自动探测系统架构、取最新版本并校验 SHA-512</small></p></div><div class="step"><span class="n">3</span><p>首次启动是简短引导：选 API 连接 → 建工作区 → Cmd+N 开聊<small>API 密钥解析顺序：显式参数 → $LLM_API_KEY → 各家专用变量如 $ANTHROPIC_API_KEY</small></p></div><div class="step"><span class="n">4</span><p>等不及装界面？CLI 的 <code>run</code> 一条龙：<code>bun run apps/cli/src/index.ts run "Hello!"</code><small>它后台拉起临时无头服务器、建临时会话、流式输出响应、跑完干净退出</small></p></div><div class="step"><span class="n">5</span><p>要常驻就把 <code>bun run scripts/install-server.sh</code> 交给服务器<small>脚本装依赖、编译 WebUI、生成令牌并打印启动命令；之后客户端凭 CRAFT_SERVER_URL=ws://127.0.0.1:9100 连上来</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>4</b><span>条入门路径按场景各司其职</span></div><div class="stat"><b>7</b><span>家开箱即用的供应商：Anthropic/OpenAI/Google/OpenRouter/Groq/Mistral/xAI</span></div><div class="stat"><b>3</b><span>级密钥查找顺序：参数 → $LLM_API_KEY → 供应商变量</span></div><div class="stat"><b>≥1.0</b><span>Bun 运行时版本门槛</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>CLI 支持换供应商与模型：<code>--provider google --model gemini-2.0-flash</code>，也能用 <code>--workspace-dir ./project --source github</code> 带着指定来源跑，输出可选 text 或 stream-json。</li><li>给 CLI 起个顺手的名字：<code>alias craft-cli="bun run $(pwd)/apps/cli/src/index.ts"</code>，从此 craft-cli run 直接发提示词。</li><li>连上无头服务器后，桌面应用变成瘦客户端——本地只渲染 UI，所有会话逻辑、工具执行、LLM 调用都在远端发生。</li><li>想热重载开发就用 <code>bun run electron:dev</code>（Vite 监听模式）；electron:start 则每次做生产构建。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>curl 直接管道给 bash，万一脚本有问题不是完了？</dt><dd>脚本流程透明：探测系统、从官方 YAML 清单取最新版本与 SHA-512 校验和，验证不过就不落盘。但要说清边界——校验值来自同一个分发服务器，它能拦住传输损坏，并不为上游供应链背书；介意的人可以跳过脚本改走源码构建。</dd><dt>究竟该推荐同事用哪条路？</dt><dd>交互式日常使用选桌面应用（多会话收件箱、流式输出、权限控制齐全）；只想在终端里问一句拿个答案，CLI 最快；团队共享算力或长时间驻留任务，无头服务器加瘦客户端组合最划算。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../快速开始_lukilabs_craft-agents-oss/快速开始_lukilabs_craft-agents-oss.md">快速开始：五分钟内跑起来</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="01-gai-shu.html">第 1 章 · 项目概述</a><a href="03-an-zhuang-fang-shi.html">第 3 章 · 安装方式</a></div>

<nav class="nav">
<a href="01-gai-shu.html">← 上一章：把会话当邮件管</a>
<a href="03-an-zhuang-fang-shi.html">下一章：安装方式 →</a>
</nav>
<footer>Craft Agents 图解精读 · 2 / 23</footer>
</div></body></html>
`;export{t as default};
