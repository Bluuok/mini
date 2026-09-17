const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#64748B">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>11 · 终端实操：会跑命令会报错</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.78;color:#1f2937;background:#f6f7f9;padding:32px 14px}
main{max-width:780px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:38px clamp(20px,5vw,50px) 28px}
.crumb{font-size:13px;color:#9ca3af;margin-bottom:16px}
.chip{display:inline-block;font-size:12px;font-weight:700;color:#fff;background:var(--accent);border-radius:999px;padding:3px 12px}
.kicker{margin-top:12px;font-size:13px;letter-spacing:.18em;color:#6b7280;font-weight:700}
h1{font-size:30px;line-height:1.3;margin:6px 0 10px;color:#111827}
.lede{color:#4b5563;margin-bottom:24px}
h2{font-size:21px;margin:36px 0 14px;padding-left:11px;border-left:4px solid var(--accent);color:#111827}
p{margin-bottom:12px}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#EEF1F5;border-radius:5px;padding:1px 6px;font-size:.87em;color:#334155}
pre{background:#181b25;color:#dfe3ee;border-radius:10px;padding:14px 16px;overflow-x:auto;font-size:13.5px;line-height:1.65;margin:10px 0 16px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;margin-top:8px}
.card{border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px}
.card b{display:block;font-size:23px;color:var(--accent);line-height:1.2;font-family:ui-monospace,Menlo,monospace}
.card span{font-size:13.5px;color:#4b5563;display:block;margin-top:6px;font-family:-apple-system,"PingFang SC",sans-serif}
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
<span class="chip">第 11 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>终端实操：会跑命令会报错</h1>
<p class="lede">概念篇让你「认了终端命令长什么样」，这篇让你「真会跑」：跑脚本、看输出、踩刹车、翻历史，以及出错时最该做的那个动作。</p>

<h2>先打个比方</h2>
<p>终端就是一个<b>用文字指挥电脑的窗口</b>——像只靠打字沟通的服务窗口：你完整说出要办的事（敲一行命令、回车），对方执行，再把结果打印回来。没有按钮可点，效率高但也意味着没有「手滑点错了」的撤销键，所以动什么命令要先知道影响范围。</p>

<h2>全景图解</h2>
<svg viewBox="0 0 760 470" role="img" aria-label="终端窗口中的五步小流程，与安全分区对照">
<defs><marker id="p11a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#94A3B8"/></marker></defs>
<rect x="16" y="16" width="440" height="330" rx="12" fill="#181B25"/>
<rect x="16" y="16" width="440" height="30" rx="12" fill="#0F1118"/>
<circle cx="34" cy="31" r="4.5" fill="#F87171"/><circle cx="52" cy="31" r="4.5" fill="#FBBF24"/><circle cx="70" cy="31" r="4.5" fill="#34D399"/>
<text x="236" y="36" text-anchor="middle" font-size="12" fill="#94A3B8">macOS 终端（Windows 用 PowerShell）</text>
<g font-family="Menlo,monospace" font-size="12.5">
<text x="34" y="76" fill="#A5B4FC">$ pwd</text>
<text x="34" y="98" fill="#6EE7B7">/Users/你的名字/week1</text>
<text x="34" y="126" fill="#A5B4FC">$ ls</text>
<text x="34" y="148" fill="#E2E8F0">demo.py  .env  pyproject.toml</text>
<text x="34" y="176" fill="#A5B4FC">$ python demo.py</text>
<text x="34" y="198" fill="#6EE7B7">你好，Week 1！</text>
<text x="34" y="226" fill="#A5B4FC">^C</text><text x="64" y="226" fill="#64748B">← 卡住时按 Ctrl+C 强制停</text>
<text x="34" y="254" fill="#A5B4FC">$ ↑</text><text x="58" y="254" fill="#64748B">调出上一条改几个字再回车</text>
<text x="34" y="282" fill="#CBD5E1">用户名@电脑名 项目名 %</text>
<text x="230" y="304" fill="#94A3B8">↑ 提示符后面的光标就是等你输入的地方</text>
</g>
<g font-size="13">
<rect x="80" y="318" width="82" height="20" rx="6" fill="#334155"/><text x="121" y="332" text-anchor="middle" font-family="Menlo,monospace" font-size="11.5" fill="#E2E8F0">step 1</text>
<rect x="180" y="318" width="82" height="20" rx="6" fill="#334155"/><text x="221" y="332" text-anchor="middle" font-family="Menlo,monospace" font-size="11.5" fill="#E2E8F0">step 2-3</text>
<rect x="280" y="318" width="82" height="20" rx="6" fill="#334155"/><text x="321" y="332" text-anchor="middle" font-family="Menlo,monospace" font-size="11.5" fill="#E2E8F0">step 4</text>
<line x1="124" y1="322" x2="178" y2="322" stroke="#94A3B8" marker-end="url(#p11a)"/>
<line x1="224" y1="322" x2="278" y2="322" stroke="#94A3B8" marker-end="url(#p11a)"/>
</g>
<g>
<rect x="480" y="16" width="264" height="140" rx="10" fill="#ECFDF5" stroke="#059669"/>
<text x="498" y="44" font-size="14.5" font-weight="bold" fill="#065F46">安全区 · 随便用</text>
<g font-size="12.5" fill="#047857">
<text x="500" y="72">pwd 我在哪 / ls 这里有什么 /</text>
<text x="500" y="93">cd 去别的目录……这三个只「看和走」，</text>
<text x="500" y="114">不改任何文件。cd .. 回上一级，</text>
<text x="500" y="135">cd ~ 回家目录。</text>
</g>
<rect x="480" y="170" width="264" height="150" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
<text x="498" y="198" font-size="14.5" font-weight="bold" fill="#991B1B">警戒区 · 先问 AI 再执行</text>
<g font-size="12.5" fill="#B91C1C">
<text x="500" y="226">rm 删除 · sudo 提权 · &gt; 覆盖写 ·</text>
<text x="500" y="247">curl | bash 下载并执行</text>
<text x="500" y="274">看到这些先让 AI 解释影响范围；</text>
<text x="500" y="295">网上的命令不要复制了直接跑；</text>
<text x="500" y="316">看不懂的一律先问「会改什么、删什么」。</text>
</g>
<rect x="480" y="334" width="264" height="120" rx="10" fill="#FFFBEB" stroke="#F59E0B"/>
<text x="498" y="362" font-size="14.5" font-weight="bold" fill="#78350F">最重要的一条</text>
<g font-size="12.5" fill="#92400E">
<text x="500" y="390">出错的全部红字从第一行到最后一行</text>
<text x="500" y="411">一个字不漏地复制给 AI，连同「我想</text>
<text x="500" y="432">干什么、在哪个目录、敲了什么命令」。</text>
<text x="500" y="452">绝对不要只说「报错了」。</text>
</g>
</g>
</svg>

<h2>走一遍真实场景</h2>
<ol class="walk">
<li>打开终端，先敲 <code>pwd</code>。<small>打印当前所在目录。「动手前先 pwd」确认自己站在对的地方，是最重要的习惯。</small></li>
<li>再敲 <code>ls</code> 看这里有什么。<small>列出当前目录下的文件和文件夹；<code>cd 概念篇</code> 进某个文件夹，<code>cd ..</code> 返回上一级，<code>cd ~</code> 回家。</small></li>
<li>到了项目目录，敲 <code>python demo.py</code> 跑脚本。<small><code>python</code> 启动解释器，后面跟要跑的文件名，中间有空格。正常的话 <code>print(...)</code> 的内容直接打在终端里——这就是「看输出」。</small></li>
<li>输出要从上往下读完，别只看最后一行。<small>关键信息常在中间、错误在最后；滚走了就 macOS 按 <code>Command+↑</code> 往上翻，Windows 拉滚动条。</small></li>
<li>程序卡住或死循环刷屏？按 <code>Ctrl+C</code>。<small>这是终端的通用紧急刹车，不会损坏文件，只是让程序停下来。之后按 ↑ 调出上一条命令，改几个字再回车，不用重打整条。</small></li>
</ol>

<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><b>pwd·ls·cd</b><span>三条核心命令，只会看和走，随便用不伤东西</span></div>
<div class="card"><b>4 个危险词</b><span>rm / sudo / &gt; / curl | bash —— 先问 AI 影响范围再执行</span></div>
<div class="card"><b>5 步小流程</b><span>pwd → ls → python demo.py → （卡住）Ctrl+C → ↑ 改历史</span></div>
<div class="card"><b>Ctrl+C</b><span>唯一的紧急刹车键，见到 ^C 或提示符回来了就是停住了</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="facts">
<li>提示符 <code>用户名@电脑名 项目名 %</code> 不是让你打的字：% 的位置是「等你输入」的意思，Windows 上同样的位置显示 <code>&gt;</code>。复制网上命令时不要把提示符一起粘进去。</li>
<li>上下箭头翻的是终端帮你记的历史命令，调出来可以修改后再执行。长命令打错一个字时，这条比重新手打一遍又快又不容易引入新错。</li>
<li>为什么「完整报错」如此重要：AI 看不到你的屏幕，traceback 和错误信息是它唯一能定位问题的线索。只说「报错了」或「运行不了」，AI 只能反问或瞎猜，来回好几轮都浪费在补信息上。</li>
</ul>

<h2>常见疑问</h2>
<dl class="qa">
<dt>Q：终端黑框里的命令那么多，会不会一不小心把系统搞坏？</dt>
<dd>A：会有这个风险，所以源文划了安全分区：<code>pwd</code>/<code>ls</code>/<code>cd</code> 这类「看和走」的命令不改任何文件，放心用；而 rm（删）、sudo（提权）、&gt;(覆盖写)、curl | bash（下载并执行）这四类有真实破坏力，先让 AI 解释影响范围再执行。</dd>
<dt>Q：现在不练，到 Week 1 才碰终端来得及吗？</dt>
<dd>A：课程就是这么设计的。Week 0 只要求读懂每条命令干嘛、会看到什么；Week 1 第一天打开终端照着本篇走即可，不会对着黑框发懵。</dd>
<dt>Q：终端里粘贴了 AI 给的一条长命令，怎么判断它安不安全？</dt>
<dd>A：回到红线本身：只要这条命令涉及删除、提权、覆盖写、下载并执行中的任何一样，就把原样命令发给 AI 问一句「这条会改什么、会删什么」，得到明确回答后再跑。看不懂的命令一律如此处理，不存在例外。</dd>
</dl>

<h2>深入入口</h2>
<p>对应文字版：《终端实操》，见课程 week0-reading/概念篇。命令语法的来龙去脉见概念篇《文件、路径与终端》；Python 脚本写法的最小集见第 8 章《Python 基础语法最小集》。</p>

<nav class="bottom">
<a href="10-env-config.html">← 上一篇：环境变量与配置文件</a>
<a href="12-day01-llm-api.html">下一篇：LLM API 基础：请求、响应与 Token →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</main>
</body>
</html>
`;export{t as default};
