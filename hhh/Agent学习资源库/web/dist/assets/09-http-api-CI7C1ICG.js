const e=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#0EA5E9">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>09 · HTTP 与 API 常识</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.78;color:#1f2937;background:#f7f7fb;padding:32px 14px}
main{max-width:780px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:38px clamp(20px,5vw,50px) 28px}
.crumb{font-size:13px;color:#9ca3af;margin-bottom:16px}
.chip{display:inline-block;font-size:12px;font-weight:700;color:#fff;background:var(--accent);border-radius:999px;padding:3px 12px}
.kicker{margin-top:12px;font-size:13px;letter-spacing:.18em;color:#6b7280;font-weight:700}
h1{font-size:30px;line-height:1.3;margin:6px 0 10px;color:#111827}
.lede{color:#4b5563;margin-bottom:24px}
h2{font-size:21px;margin:36px 0 14px;padding-left:11px;border-left:4px solid var(--accent);color:#111827}
p{margin-bottom:12px}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#E3F4FC;border-radius:5px;padding:1px 6px;font-size:.87em;color:#075985}
pre{background:#181b25;color:#dfe3ee;border-radius:10px;padding:14px 16px;overflow-x:auto;font-size:13.5px;line-height:1.65;margin:10px 0 16px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;margin-top:8px}
.card{border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px}
.card b{display:block;font-size:25px;color:var(--accent);line-height:1.2}
.card span{font-size:13.5px;color:#4b5563;display:block;margin-top:6px}
ol.walk{padding-left:24px}
ol.walk li{margin-bottom:12px}
ol.walk small{color:#6b7280;display:block;font-size:13.5px}
ul.facts li{margin:9px 0 9px 22px}
dl.qa dt{font-weight:700;color:#111827;margin-top:16px}
dl.qa dd{color:#4b5563;margin:4px 0 0}
table.codes{width:100%;border-collapse:collapse;font-size:14.5px;margin:8px 0 16px}
table.codes th,table.codes td{border:1px solid #e5e7eb;padding:7px 10px;text-align:left;vertical-align:top}
table.codes th{background:#F0F9FE;color:#0C4A6E}
nav.bottom{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:42px;border-top:1px solid #e5e7eb;padding-top:18px}
nav.bottom a{color:var(--accent);text-decoration:none;font-weight:700;font-size:14.5px}
footer{text-align:center;color:#9ca3af;font-size:12.5px;margin-top:24px}
svg{width:100%;height:auto;display:block}
</style>
</head>
<body>
<main>
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 0 前置基础 · 给想建立直觉的初学者</p>
<span class="chip">第 9 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>HTTP 与 API 常识</h1>
<p class="lede">Agent 本质上是「反复调用大模型 API」，所以 HTTP 和 API 的基本常识就是排错的底气。读懂这套「递单子—收回执」的流程就够。</p>

<h2>先打个比方</h2>
<p>源文原话：把调 API 想成<b>去柜台办事</b>。你递一张申请单过去（<code>请求</code>），柜台处理完递回一张回执（<code>响应</code>），回执上有个编号告诉你办得怎么样（<code>状态码</code>）。HTTP 就是这套「递单子—收回执」的规矩；API 是柜台提供的具体服务，比如「让大模型回答问题」。</p>

<h2>全景图解</h2>
<svg viewBox="0 0 760 500" role="img" aria-label="一次 API 调用的请求与响应往返全景">
<defs><marker id="p9a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#0EA5E9"/></marker><marker id="p9b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#D97706"/></marker></defs>
<rect x="16" y="150" width="130" height="140" rx="10" fill="#E0F2FE" stroke="#0EA5E9"/>
<text x="81" y="208" text-anchor="middle" font-size="15" font-weight="bold" fill="#0C4A6E">你的程序</text>
<text x="81" y="232" text-anchor="middle" font-size="12.5" fill="#075985">（Agent）</text>
<rect x="614" y="150" width="130" height="140" rx="10" fill="#E0F2FE" stroke="#0EA5E9"/>
<text x="679" y="202" text-anchor="middle" font-size="15" font-weight="bold" fill="#0C4A6E">API 服务</text>
<text x="679" y="226" text-anchor="middle" font-size="12.5" fill="#075985">（柜台）</text>
<text x="679" y="248" text-anchor="middle" font-size="11.5" fill="#0C4A6E">例如：大模型服务</text>
<line x1="150" y1="180" x2="600" y2="180" stroke="#0EA5E9" stroke-width="2.5" marker-end="url(#p9a)"/>
<text x="375" y="170" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#0369A1">请求（单次调用永远成对出现之一）</text>
<g font-size="12.5" fill="#334155">
<rect x="220" y="36" width="320" height="104" rx="10" fill="#F8FAFC" stroke="#CBD5E1"/>
<text x="238" y="60" font-weight="bold" fill="#111827">去哪 / 用什么方法 / 带什么数据</text>
<text x="238" y="84" font-family="Menlo,monospace" font-size="11.5" fill="#075985">Authorization: Bearer sk-***</text>
<text x="238" y="103" font-family="Menlo,monospace" font-size="11.5" fill="#075985">Content-Type: application/json</text>
<text x="238" y="127" fill="#4B5563">请求体也是 JSON：model + messages + 参数</text>
</g>
<line x1="600" y1="330" x2="160" y2="330" stroke="#D97706" stroke-width="2.5" marker-end="url(#p9b)"/>
<text x="380" y="352" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#B45309">响应（回执）</text>
<g>
<rect x="196" y="368" width="368" height="112" rx="10" fill="#FFFBEB" stroke="#F59E0B"/>
<text x="214" y="392" font-size="13" font-weight="bold" fill="#78350F">状态码（三位数编号）+ 回来的数据</text>
<g font-family="Menlo,monospace" font-size="12">
<rect x="214" y="404" width="60" height="24" rx="6" fill="#ECFDF5"/><text x="244" y="420" text-anchor="middle" fill="#047857">200</text>
<rect x="282" y="404" width="66" height="24" rx="6" fill="#FEF2F2"/><text x="315" y="420" text-anchor="middle" fill="#B91C1C">4xx</text>
<rect x="356" y="404" width="66" height="24" rx="6" fill="#FFF7ED"/><text x="389" y="420" text-anchor="middle" fill="#C2410C">5xx</text>
<rect x="430" y="404" width="66" height="24" rx="6" fill="#EEF2FF"/><text x="463" y="420" text-anchor="middle" fill="#4338CA">429</text>
</g>
<text x="214" y="452" font-size="12.5" fill="#92400E">响应体是 JSON：choices 里取模型回答，usage 里看 token 花销</text>
<text x="214" y="471" font-size="12.5" fill="#92400E">排序口诀：4xx 先查自己，5xx 多半怪服务端</text>
</g>
<g font-size="13" fill="#334155">
<rect x="494" y="20" width="250" height="86" rx="10" fill="#FAFAFA" stroke="#E5E7EB"/>
<text x="512" y="44" font-weight="bold" fill="#111827">护栏一 · 超时</text>
<text x="512" y="67">如 30 秒没回就算失败：</text>
<text x="512" y="88">防止程序无限等待、卡死挂住。</text>
<rect x="16" y="20" width="250" height="86" rx="10" fill="#FAFAFA" stroke="#E5E7EB"/>
<text x="34" y="44" font-weight="bold" fill="#111827">护栏二 · 别死磕</text>
<text x="34" y="67">4xx 先查自己、5xx 找官方；</text>
<text x="34" y="88">一次任务要发几十次请求，慢慢来。</text>
</g>
</svg>
<h2>走一遍真实场景</h2>
<ol class="walk">
<li>你在代码里把「问题 + 模型名 + 一些参数」打包成 JSON，放进请求体发出。<small>发之前确认三件事都齐了：地址对、方法对、数据格式是 JSON——这也呼应请求头里的 <code>Content-Type: application/json</code>。</small></li>
<li>请求头里带上身份那行：<code>Authorization: Bearer sk-xxxxxx</code>。<small>Bearer 后面跟的就是 API Key。Key 错了或漏了，直接拿到 <code>401</code>——这是新手最常见的第一撞。</small></li>
<li>响应回来，先看那个三位数状态码。<small><code>200</code> 办好了；<code>4xx</code> 是你这边的问题（参数错、没权限、地址错）；<code>5xx</code> 是柜台自己出故障了，不怪你；<code>429</code> 是调用太频繁被限流了。</small></li>
<li>状态码没问题，再从响应体里取模型的回答。<small>JSON 里 <code>choices</code> 数组套着 message 的 content；同时能看到 usage 统计的 token 总数。</small></li>
<li>一轮结束就完了吗？往往没有。<small>Agent 干活是一个循环：任务打包 → 发请求 → 取回答 → 模型说要调某个工具 → 再发一次……一次任务可能发几十次请求，中间任何一次出错都要你分得清「是我错了」还是「服务挂了」。</small></li>
</ol>

<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><b>3 位</b><span>状态码永远是三位数，一眼看出办得怎么样</span></div>
<div class="card"><b>30 秒</b><span>源文举例的超时值：迟迟不回就按失败处理，别死等</span></div>
<div class="card"><b>几十次</b><span>一次 Agent 任务可能发出的请求数量级</span></div>
<div class="card"><b>2 分法</b><span>排错第一刀：4xx 先查自己（key/地址/参数/JSON 格式），5xx 找官方或等等再试</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="facts">
<li>常见状态码各管一段：<code>400</code> 请求格式不对（比如 JSON 写错了）、<code>401</code> 没带 key 或 key 不对、<code>403</code> 带了 key 但没权限、<code>404</code> 地址不对没有这个服务、<code>500</code>/<code>502</code>/<code>503</code> 服务端挂了。看到就能对号入座。</li>
<li>超时不是错误本身，而是防止程序卡死的保护。Week 1 写调用代码时一定要设超时，不然网络一抽风程序就挂住不动了。</li>
<li>「认得 JSON」和「会调 API」几乎是同一件事：看到花括号和「标签: 值」就是 JSON。这层亲近感来自概念篇讲过的 dict 结构——Python 的 dict 和 JSON 长得几乎一样。</li>
</ul>

<h2>常见疑问</h2>
<dl class="qa">
<dt>Q：我不动手发请求，学这些是不是白学？</dt>
<dd>A：不是白学。Week 1 真正发请求时，第一次失败大概率就是 401 或 400，而能不能在两分钟内定位取决于你现在有没有建立「状态码分组」这张地图。本篇不要求动命令行，只要求读懂办事流程。</dd>
<dt>Q：把 Key 放在请求头里发出去，会不会很危险？</dt>
<dd>A：走正规渠道不会。Key 就该放在 Authorization 请求头里发给授权的服务方；真正的危险是把它写进代码仓库、贴给 AI 或分享给别人——那是下一章《环境变量与配置文件》要解决的问题。</dd>
<dt>Q：返回 500 了，我多试几次重试会不会闯祸？</dt>
<dd>A：源文口径是「服务端挂了，等待再试或找官方」。注意 429 不是让你硬怼——那是被限流了，说明调用太急，正确反应是放缓节奏，而不是刷新频率猛试。</dd>
</dl>

<h2>深入入口</h2>
<p>对应文字版：《HTTP 与 API 常识》，见课程 week0-reading/概念篇。读完接第 10 章《环境变量与配置文件》，看 API Key 该放在哪里才安全。</p>

<nav class="bottom">
<a href="08-python-basics.html">← 上一篇：Python 基础语法最小集</a>
<a href="10-env-config.html">下一篇：环境变量与配置文件 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</main>
</body>
</html>
`;export{e as default};
