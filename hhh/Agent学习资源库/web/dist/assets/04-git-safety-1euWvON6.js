const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#F59E0B;--soft:#FFF7E6;--line:#E6E9ED">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>04 · Git 与安全边界：可追踪、可恢复</title>
<style>
*{box-sizing:border-box;margin:0}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16.5px;line-height:1.78;color:#26303d;background:#fbfbfa;padding:36px 18px 28px}
.wrap{max-width:840px;margin:0 auto}
.crumb{font-size:13px;color:#98a2ae}
.chip{display:inline-block;background:var(--soft);border:1px solid var(--line);color:var(--accent);font-size:12.5px;font-weight:600;padding:3px 12px;border-radius:999px;margin-top:12px}
.kicker{margin-left:8px;font-size:12px;letter-spacing:.14em;color:#a8b0ba}
h1{font-size:30px;line-height:1.3;margin:12px 0 8px;color:#161c24}
.lede{color:#5c6875;font-size:17px}
section{margin-top:40px}
h2{font-size:20px;display:flex;align-items:center;gap:10px;margin-bottom:14px;color:#161c24}
h2::before{content:"";flex:none;width:5px;height:20px;border-radius:3px;background:var(--accent)}
.figcard{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 12px 10px}
svg{width:100%;height:auto;display:block}
figcaption{font-size:13.5px;color:#8b95a1;text-align:center;padding:6px 8px 4px}
.steps{list-style:none;counter-reset:s}
.steps li{position:relative;padding-left:46px;margin-bottom:18px}
.steps li::before{counter-increment:s;content:counter(s);position:absolute;left:0;top:2px;width:30px;height:30px;border-radius:50%;background:var(--soft);border:1px solid var(--line);color:var(--accent);font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center}
.note{display:block;color:#8b95a1;font-size:14px;margin-top:2px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.card .n{font-size:28px;font-weight:700;color:var(--accent);line-height:1.2}
.card .t{font-size:14.5px;color:#5c6875}
.facts{padding-left:22px}
.facts li{margin-bottom:10px}
.facts b{color:#161c24}
.qa{margin-bottom:20px}
.qa .q{font-weight:600;color:#161c24;display:flex;gap:9px}
.qa .q::before{content:"问";flex:none;width:24px;height:24px;border-radius:7px;background:var(--accent);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:3px}
.qa .a{padding-left:33px;color:#4b5563}
.deep{background:#fff;border:1px dashed var(--line);border-radius:12px;padding:14px 18px;color:#4b5563}
nav{display:flex;justify-content:space-between;gap:12px;margin-top:46px}
nav a{flex:1;text-decoration:none;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 15px;display:block}
nav a:hover{border-color:var(--accent)}
.nx{text-align:right}
nav .lab{font-size:12px;color:#98a2ae;display:block}
nav .t{font-weight:600;font-size:14.5px;color:var(--accent)}
footer{margin-top:32px;text-align:center;color:#a8b0ba;font-size:13px}
</style>
</head>
<body>
<div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 0 概念篇 · 给想建立直觉的初学者</p>
<span class="chip">第 4 章 · 共 32 章</span><span class="kicker">速成计划 图解</span>
<h1>Git 与安全边界：可追踪、可恢复</h1>
<p class="lede">Git 把每次修改存成一个可以随时回看的快照，让变化可追踪、可比较、可恢复——同时它也忠实地记录一切，包括你绝不希望留下的秘密。</p>

<section>
<h2>先打个比方</h2>
<p>就像游戏存档：Repository 是你的整个存档文件夹，Commit 是点一次「保存进度」，Diff 是两次存档之间你多了哪些装备，History 是所有存档按时间排成的列表。存档的意义在于随时能回去——但存档不会替你判断这一局打得对不对，它只负责忠实记录。</p>
</section>

<section>
<h2>全景图解</h2>
<figure class="figcard">
<svg viewBox="0 0 900 585" role="img" aria-label="Git 全景图">
<defs>
<marker id="g4arr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#94A3B8"/></marker>
<marker id="g4grn" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#059669"/></marker>
<marker id="g4red" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#DC2626"/></marker>
</defs>
<!-- branch stub -->
<rect x="150" y="14" width="240" height="34" rx="17" fill="#fff" stroke="#C4B5FD" stroke-dasharray="4 3"/>
<text x="270" y="36" text-anchor="middle" font-size="13" fill="#7C6CCF">branch：另开一条路线，不影响主线</text>
<line x1="145" y1="98" x2="200" y2="50" stroke="#C4B5FD" stroke-width="1.5" stroke-dasharray="4 3"/>
<!-- working dir -->
<rect x="30" y="80" width="230" height="140" rx="12" fill="#fff" stroke="#E6E9ED"/>
<rect x="30" y="80" width="230" height="38" rx="12" fill="#26303D"/>
<text x="145" y="105" text-anchor="middle" font-size="14.5" fill="#fff" font-weight="600">工作目录（正在修改）</text>
<circle cx="60" cy="142" r="4.5" fill="#F59E0B"/><text x="76" y="147" font-size="13.5" fill="#374151">classify.py（已改动）</text>
<text x="76" y="171" font-size="13.5" fill="#374151">notes.md</text>
<circle cx="60" cy="196" r="4.5" fill="#CBD5E1"/><text x="76" y="201" font-size="13" fill="#94A3B8">改动还没存档，随时可对比</text>
<!-- commit chain -->
<line x1="260" y1="130" x2="420" y2="130" stroke="#94A3B8" stroke-width="2" marker-end="url(#g4arr)"/>
<text x="340" y="118" text-anchor="middle" font-size="13" fill="#64748B">commit 存档</text>
<g font-size="13" text-anchor="middle">
<rect x="430" y="104" width="66" height="52" rx="9" fill="#FFF7E6" stroke="#FDE68A"/>
<text x="463" y="126" fill="#92702B" font-weight="600">快照 c1</text><text x="463" y="146" fill="#B45309" font-size="11">最早</text>
<line x1="496" y1="130" x2="548" y2="130" stroke="#94A3B8" stroke-width="2" marker-end="url(#g4arr)"/>
<rect x="558" y="104" width="66" height="52" rx="9" fill="#FFF7E6" stroke="#FDE68A"/>
<text x="591" y="126" fill="#92702B" font-weight="600">快照 c2</text><text x="591" y="146" fill="#B45309" font-size="11">中间某次</text>
<line x1="624" y1="130" x2="676" y2="130" stroke="#94A3B8" stroke-width="2" marker-end="url(#g4arr)"/>
<rect x="686" y="98" width="74" height="64" rx="9" fill="#F59E0B"/>
<text x="723" y="124" fill="#fff" font-weight="600">快照 c3</text><text x="723" y="144" fill="#FEF3C7" font-size="11">最新一次</text>
</g>
<path d="M450 186 h300 a14 14 0 0 1 14 14 v6" fill="none" stroke="#CBD5E1" stroke-width="1.4" stroke-dasharray="5 4"/>
<text x="600" y="216" text-anchor="middle" font-size="13" fill="#94A3B8">History：过去保存过的版本记录，按时间排成列表</text>
<!-- three commands -->
<g>
<rect x="70" y="252" width="230" height="88" rx="12" fill="#fff" stroke="#E6E9ED"/>
<rect x="86" y="268" width="122" height="24" rx="6" fill="#26303D"/><text x="147" y="285" text-anchor="middle" font-size="13" fill="#fff" font-family="Menlo,monospace">git status</text>
<text x="90" y="320" font-size="13.5" fill="#374151">回答「现在的状态」：</text>
<text x="90" y="333" font-size="12.5" fill="#8b95a1">哪些文件改了、哪些还没存档</text>
<rect x="335" y="252" width="230" height="88" rx="12" fill="#fff" stroke="#E6E9ED"/>
<rect x="351" y="268" width="102" height="24" rx="6" fill="#26303D"/><text x="402" y="285" text-anchor="middle" font-size="13" fill="#fff" font-family="Menlo,monospace">git diff</text>
<text x="355" y="320" font-size="13.5" fill="#374151">回答「具体改了啥」：</text>
<text x="355" y="333" font-size="12.5" fill="#8b95a1">多了什么、少了什么</text>
<rect x="600" y="252" width="262" height="88" rx="12" fill="#fff" stroke="#E6E9ED"/>
<rect x="616" y="268" width="160" height="24" rx="6" fill="#26303D"/><text x="696" y="285" text-anchor="middle" font-size="12.5" fill="#fff" font-family="Menlo,monospace">git log --oneline</text>
<text x="620" y="320" font-size="13.5" fill="#374151">回答「过去存过哪些版本」：</text>
<text x="620" y="333" font-size="12.5" fill="#8b95a1">每条一行，简洁版历史</text>
</g>
<line x1="185" y1="252" x2="300" y2="228" stroke="#CBD5E1" stroke-width="1.2" stroke-dasharray="4 3"/>
<line x1="450" y1="252" x2="450" y2="228" stroke="#CBD5E1" stroke-width="1.2" stroke-dasharray="4 3"/>
<line x1="731" y1="252" x2="620" y2="222" stroke="#CBD5E1" stroke-width="1.2" stroke-dasharray="4 3"/>
<!-- gate row -->
<text x="30" y="392" font-size="14.5" font-weight="600" fill="#161C24">提交前的一道门：谁能进入快照记录？</text>
<rect x="60" y="420" width="180" height="56" rx="10" fill="#ECFDF5" stroke="#A7F3D0"/>
<text x="150" y="443" text-anchor="middle" font-size="13.5" fill="#065F46">classify.py、说明文档</text>
<text x="150" y="462" text-anchor="middle" font-size="11.5" fill="#059669">普通项目内容</text>
<line x1="250" y1="448" x2="392" y2="448" stroke="#059669" stroke-width="2" marker-end="url(#g4grn)"/>
<text x="322" y="438" text-anchor="middle" font-size="12.5" fill="#059669">✓ 忠实记录进快照</text>
<rect x="60" y="500" width="180" height="56" rx="10" fill="#FEF2F2" stroke="#FECACA"/>
<text x="150" y="523" text-anchor="middle" font-size="13.5" fill="#991B1B">.env（API Key、密码…）</text>
<text x="150" y="542" text-anchor="middle" font-size="11.5" fill="#DC2626">敏感信息专用配置文件</text>
<line x1="245" y1="528" x2="290" y2="528" stroke="#DC2626" stroke-width="2" marker-end="url(#g4red)"/>
<text x="330" y="520" font-size="13" fill="#DC2626" font-weight="600">被 .gitignore 挡下</text>
<text x="450" y="578" text-anchor="middle" font-size="12.5" fill="#B91C1C">.gitignore 的作用就是告诉 Git：「这个文件不要记录」——它挡在敏感信息进入快照之前</text>
<rect x="470" y="412" width="240" height="122" rx="12" fill="#FFFBEB" stroke="#FDE68A"/>
<text x="490" y="440" font-size="13.5" font-weight="600" fill="#92400E">绝不能提交的四类信息：</text>
<text x="490" y="464" font-size="13" fill="#A16207">API Key（调用模型服务的密钥）</text>
<text x="490" y="485" font-size="13" fill="#A16207">密码、Cookie、访问令牌</text>
<text x="490" y="506" font-size="13" fill="#A16207">银行卡和身份证信息</text>
<text x="490" y="527" font-size="13" fill="#A16207">未公开的客户数据</text>
</svg>
<figcaption>一图一意：Git 用快照链记住每次修改；三条命令各回答一个问题；而 .gitignore 是敏感信息进入快照前的最后一道门。</figcaption>
</figure>
</section>

<section>
<h2>走一遍真实场景</h2>
<ol class="steps">
<li>你刚改完分类规则文件，一切还在工作目录里，没有存档。<span class="note">此时修改「可比较」但还不可恢复——没存档就没有快照。</span></li>
<li>运行 <code>git status</code>：看看哪些文件被改动了、哪些还没存档。<span class="note">三个观察命令各回答一个不同的问题，先认长相即可，Week 0 不要求真的运行。</span></li>
<li>运行 <code>git diff</code>：逐行看具体改动——多了什么、少了什么。</li>
<li>确认无误后提交一个快照；以后 <code>git log --oneline</code> 随时列出所有历史版本。<span class="note">每条一行，简洁版。Week 1 会手把手带你真正走一遍。</span></li>
<li>提交前最后看一眼：<code>.env</code> 是否已被 <code>.gitignore</code> 排除？别把 API Key 存进永久存档。<span class="note">Git 会忠实记录所有内容，一旦提交就很难彻底删掉。</span></li>
</ol>
</section>

<section>
<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><div class="n">3 条</div><div class="t">观察命令 status / diff / log，分别回答状态、内容、历史三个不同的问题</div></div>
<div class="card"><div class="n">3 个词</div><div class="t">Git 的价值：可追踪、可比较、可恢复</div></div>
<div class="card"><div class="n">4 类</div><div class="t">绝不放进 Git 的信息：API Key、密码与 Cookie 与令牌、银行卡与身份证信息、未公开客户数据</div></div>
<div class="card"><div class="n">0 次</div><div class="t">本篇需要动手运行的命令数：全程只读理解，Week 1 才真正用</div></div>
</div>
</section>

<section>
<h2>再多懂一点</h2>
<ul class="facts">
<li><b>Git 不替你做判断。</b>它只负责忠实记录，不会自动判断一次修改是否符合你的目标——所以 diff 显示的是「改了什么」，不是「改得对不对」。</li>
<li><b>「还没提交」和「已经提交」是两个安全等级。</b>一旦秘密进入某次 Commit，它会留在 History 的每一份相关快照里，很难彻底删掉；唯一可靠的防线是第一次提交之前就用 <code>.gitignore</code> 挡住。</li>
<li><b>付款这类动作必须本人完成。</b>购买 Coding Plan 或充值 API 时由你自己操作，AI 只能帮助解释页面和检查脱敏后的配置。</li>
</ul>
</section>

<section>
<h2>常见疑问</h2>
<div class="qa"><p class="q">Week 0 连命令都不运行，我能学到什么？</p><p class="a">学到每个命令为什么存在：status 回答现在的状态，diff 回答具体改了啥，log 回答过去存过哪些版本。Week 1 手把手实操时，你不是在背命令，而是在用已经理解的问题找答案。</p></div>
<div class="qa"><p class="q">我用肉眼看过 git diff 了，还要人工验收吗？</p><p class="a">要。diff 只显示「改了什么」，不显示「改得对不对」。验收的标准是之前写好的完成条件，而不是「看起来改到位了」。</p></div>
<div class="qa"><p class="q">不小心把 API Key 提交了，删掉那一行不就行了？（这样做会不会有风险？）</p><p class="a">有风险。删掉当前版本并不意味着删除历史：每一份快照都保留在记录里，「一旦提交进去，就很难彻底删掉」。所以正确做法从来不是事后补救，而是事前用 .gitignore 排除 <code>.env</code> 这类本地配置文件，让秘密从一开始就不进入 Git。</p></div>
</section>

<section>
<h2>深入入口</h2>
<p class="deep">对应文字版：《Git配置与安全边界》，见课程 week0-reading/概念篇。前置阅读：《JSON规则程序与输入输出》（对应图解第 03 章）；后续协作方式见《认识Coding-Agent》（图解第 05 章）。</p>
</section>

<nav>
<a href="03-json-rule-programs.html"><span class="lab">← 上一章</span><span class="t">规则程序：JSON 与输入输出的边界</span></a>
<a class="nx" href="05-coding-agent.html"><span class="lab">下一章 →</span><span class="t">认识 Coding Agent</span></a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{t as default};
