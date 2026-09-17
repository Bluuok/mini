const e=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#D946EF">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>10 · 环境变量与配置文件</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.78;color:#1f2937;background:#faf7fc;padding:32px 14px}
main{max-width:780px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:38px clamp(20px,5vw,50px) 28px}
.crumb{font-size:13px;color:#9ca3af;margin-bottom:16px}
.chip{display:inline-block;font-size:12px;font-weight:700;color:#fff;background:var(--accent);border-radius:999px;padding:3px 12px}
.kicker{margin-top:12px;font-size:13px;letter-spacing:.18em;color:#6b7280;font-weight:700}
h1{font-size:30px;line-height:1.3;margin:6px 0 10px;color:#111827}
.lede{color:#4b5563;margin-bottom:24px}
h2{font-size:21px;margin:36px 0 14px;padding-left:11px;border-left:4px solid var(--accent);color:#111827}
p{margin-bottom:12px}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#FBEAFD;border-radius:5px;padding:1px 6px;font-size:.87em;color:#86198F}
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
nav.bottom{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:42px;border-top:1px solid #e5e7eb;padding-top:18px}
nav.bottom a{color:var(--accent);text-decoration:none;font-weight:700;font-size:14.5px}
footer{text-align:center;color:#9ca3af;font-size:12.5px;margin-top:24px}
svg{width:100%;height:auto;display:block}
</style>
</head>
<body>
<main>
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 0 前置基础 · 给想建立直觉的初学者</p>
<span class="chip">第 10 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>环境变量与配置文件</h1>
<p class="lede">API Key 怎么放、程序怎么读到它——靠的就是环境变量和 .env 文件。这是「敏感信息不能进代码、不能进 Git」这条规矩的具体实现。</p>

<h2>先打个比方</h2>
<p>源文的说法：操作系统给每个运行中的程序发了一份「<b>环境小抄</b>」，上面写着一行行 <code>名字=值</code> 的条目。程序要用某个值，就按名字去小抄上查。注意这份小抄在操作系统层面、不在你的代码文件里——这正是它能隔离敏感信息的原因。</p>

<h2>全景图解</h2>
<svg viewBox="0 0 760 468" role="img" aria-label="API Key 从 .env 文件到请求头的五步旅程，以及三条安全红线">
<defs><marker id="p10a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#D946EF"/></marker></defs>
<rect x="36" y="12" width="430" height="66" rx="10" fill="#FDF2FB" stroke="#D946EF"/>
<text x="56" y="37" font-size="13.5" font-weight="bold" fill="#86198F">① 本地 .env 文件</text>
<g font-family="Menlo,monospace" font-size="11.5" fill="#701A75">
<text x="56" y="58">API_KEY=sk-abcdef123456</text>
<text x="56" y="73">MODEL_NAME=deepseek-chat</text>
</g>
<line x1="150" y1="80" x2="150" y2="108" stroke="#D946EF" stroke-width="2" marker-end="url(#p10a)"/>
<rect x="36" y="112" width="430" height="60" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
<text x="56" y="137" font-size="13.5" font-weight="bold" fill="#991B1B">② .gitignore 里写明 .env —— 提交被挡下</text>
<text x="56" y="158" font-size="12" fill="#B91C1C">所以它永远只待在你自己的电脑上</text>
<line x1="150" y1="174" x2="150" y2="202" stroke="#D946EF" stroke-width="2" marker-end="url(#p10a)"/>
<rect x="36" y="206" width="430" height="60" rx="10" fill="#FDF2FB" stroke="#D946EF"/>
<text x="56" y="231" font-size="13.5" font-weight="bold" fill="#86198F">③ python-dotenv 在程序启动时把 .env 读入环境变量</text>
<text x="56" y="252" font-size="12" fill="#9D174D">之后照常按名字查那份「环境小抄」即可</text>
<line x1="150" y1="268" x2="150" y2="296" stroke="#D946EF" stroke-width="2" marker-end="url(#p10a)"/>
<rect x="36" y="300" width="430" height="62" rx="10" fill="#FDF2FB" stroke="#D946EF"/>
<text x="56" y="325" font-size="13.5" font-weight="bold" fill="#86198F">④ 代码里取值：os.environ.get("API_KEY")</text>
<g font-size="11.5" fill="#701A75">
<text x="230" y="318" font-family="Menlo,monospace">["KEY"] 没有就报错</text>
<text x="398" y="337" font-family="Menlo,monospace">.get("KEY","") 兜底</text>
</g>
<line x1="150" y1="364" x2="150" y2="392" stroke="#D946EF" stroke-width="2" marker-end="url(#p10a)"/>
<rect x="36" y="396" width="430" height="58" rx="10" fill="#ECFDF5" stroke="#059669"/>
<text x="56" y="421" font-size="13.5" font-weight="bold" fill="#065F46">⑤ key 装进请求头 Authorization: Bearer 去调 API</text>
<text x="56" y="442" font-size="12" fill="#047857">全程代码里没有出现过真实的 key —— 隔离完成</text>
<g>
<rect x="500" y="12" width="244" height="442" rx="10" fill="#FFFBEB" stroke="#F59E0B"/>
<text x="520" y="42" font-size="14.5" font-weight="bold" fill="#78350F">安全红线 · 再强调一次</text>
<g font-size="12.5" fill="#92400E">
<text x="516" y="74">1. .env 永远不提交 Git，</text>
<text x="516" y="96">　 永远不分享给别人。</text>
<text x="516" y="128">2. 永远不发完整 key 给 AI，</text>
<text x="516" y="150">　 要发就打码 sk-***xxxx。</text>
<text x="516" y="182">3. 泄露了就立刻去平台吊销重生成；</text>
<text x="516" y="204">　 删掉文件不代表没泄露。</text>
</g>
<line x1="516" y1="228" x2="728" y2="228" stroke="#FDE68A"/>
<text x="520" y="256" font-size="13" font-weight="bold" fill="#111827">为什么不写在代码里？</text>
<g font-size="12.5" fill="#4B5563">
<text x="516" y="284">安全：代码会被分享、提交 Git、</text>
<text x="516" y="306">被别人看到。</text>
<text x="516" y="334">换环境：本地和服务器上的 key</text>
<text x="516" y="356">可能不一样；同一份代码不用改，</text>
<text x="516" y="378">换个环境换个值就行。</text>
</g>
<line x1="516" y1="402" x2="728" y2="402" stroke="#FDE68A"/>
<text x="520" y="430" font-size="12.5" font-weight="bold" fill="#065F46">规矩：代码只写「按名读」</text>
</g>
</svg>

<h2>走一遍真实场景</h2>
<ol class="walk">
<li>你在 <code>.env</code> 文件里写下 <code>API_KEY=sk-xxxx</code>。<small>这就是个普通文本文件，一行一个「名字=值」；<code>#</code> 开头是注释。</small></li>
<li><code>.gitignore</code> 里已经写了 <code>.env</code>。<small>Git 见到它就绕道走，所以这个文件永远不会被提交——它只放在你自己的电脑上。</small></li>
<li>程序启动时，python-dotenv 这个小工具自动把 <code>.env</code> 读进环境变量。<small>没有它你也可以手动逐条设环境变量，但那样太麻烦——工具替你把值送到「小抄」上。</small></li>
<li>代码里用 <code>os.environ.get("API_KEY")</code> 取到 sk-xxxx。<small><code>os.environ</code> 用起来像 dict：直接用方括号取，变量没设会报错；用 <code>.get(...)</code> 更稳，没有也不崩，还能给默认值兜底。</small></li>
<li>把这个 key 放进请求头去调 API。<small>对应上一章的 <code>Authorization: Bearer</code> 那一行。五步下来，真实的 key 从未出现在代码文本里。</small></li>
</ol>

<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><b>5 步</b><span>.env → .gitignore → dotenv 读入 → os.environ 取 → 请求头调用</span></div>
<div class="card"><b>0 处</b><span>代码里出现真实 API Key 的位置数——这就是隔离要达到的效果</span></div>
<div class="card"><b>3 条</b><span>安全红线：不提交、打码给 AI、泄露即吊销重生</span></div>
<div class="card"><b>2 个理由</b><span>不把 Key 写进代码：安全 + 换环境不改代码</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="facts">
<li>环境变量是「操作系统层面的一组带名字的值」，不在某个项目文件夹里。这意味着同一台电脑上不同程序可以共享同一套值，也可以各自拿到不同的值——这正是换环境时同一份代码不用改的原因。</li>
<li>两种取法差异真实存在：<code>os.environ["API_KEY"]</code> 没设就直接报错（fail fast）；<code>os.environ.get("API_KEY", "")</code> 返回空字符串继续跑。调试期前者反而更能帮你及早发现漏配。</li>
<li>上一章讲过 key 放请求头 Authorization 里发给服务方是正路；本篇补上另一半——key 从哪来。两章合起来才是完整链条：来源安全（.env / 环境变量）+ 传输正常（HTTPS 到官方地址）。</li>
</ul>

<h2>常见疑问</h2>
<dl class="qa">
<dt>Q：我已经不小心把带 Key 的代码提交到 Git 了，删掉那一行还有事吗？</dt>
<dd>A：有事。源文原话：Key 不小心泄露了，立刻去平台吊销重新生成，不是「删掉文件」就没事。历史提交里的内容仍然能翻出来，删除现状挡不住过去的记录。</dd>
<dt>Q：给 AI 发报错时带上完整上下文，会不会把 Key 也带出去？</dt>
<dd>A：源文给了明确操作规程：发给 AI 时用 <code>sk-***xxxx</code> 打码形式。贴 traceback 前顺手检查有没有整串 key 即可；报错信息本身通常不包含 key 明文，怕的是你把 .env 内容整个贴上去。</dd>
<dt>Q：.env 不就是个本地文本文件吗，会有风险？</dt>
<dd>A：文件本身放本地没问题，它的风险来自三件事的叠加：误提交 Git、误打包分享、误粘贴给人或 AI。守住这三处，「一个文本文件」的安全性就够了。</dd>
</dl>

<h2>深入入口</h2>
<p>对应文字版：《环境变量与配置文件（.env）》，见课程 week0-reading/概念篇。概念篇《Git 与安全边界》一文交代了为什么要隔离，本篇是它的落地篇。</p>

<nav class="bottom">
<a href="09-http-api.html">← 上一篇：HTTP 与 API 常识</a>
<a href="11-terminal-hands-on.html">下一篇：终端实操：会跑命令会报错 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</main>
</body>
</html>
`;export{e as default};
