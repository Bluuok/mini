const e=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#EC4899;--soft:#FDF2F8;--line:#E6E9ED">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>06 · 需求采访、Spec 与 TDD</title>
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
code{background:#F1F5F9;border-radius:4px;padding:1px 5px;font-size:.92em}
</style>
</head>
<body>
<div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 0 概念篇 · 给想建立直觉的初学者</p>
<span class="chip">第 6 章 · 共 32 章</span><span class="kicker">速成计划 图解</span>
<h1>需求采访、Spec 与 TDD</h1>
<p class="lede">不要对 AI 说「帮我优化一下」——那是个没标准、没法验收的词。把模糊需求变成有目标、有范围、有验收条件的任务，再用 Red → Green → Refactor 的节奏动手。</p>

<section>
<h2>先打个比方</h2>
<p>像请装修队开工前谈合同：图纸（目标）、只动哪几间房（范围）、明确不做什么（非目标）、完工按什么标准验收（完成条件），开工前一条条写清楚。没有这份清单，活儿会越做越大，收尾时双方各执一词。</p>
</section>

<section>
<h2>全景图解</h2>
<figure class="figcard">
<svg viewBox="0 0 900 660" role="img" aria-label="从模糊需求到 TDD 的流程">
<defs>
<marker id="g6arr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#94A3B8"/></marker>
<marker id="g6pk" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#EC4899"/></marker>
</defs>
<!-- stage 1 -->
<rect x="120" y="16" width="660" height="50" rx="12" fill="#F1F5F9"/>
<text x="450" y="47" text-anchor="middle" font-size="15" fill="#64748B">模糊需求：「帮我优化一下」——没有标准，无法验收</text>
<line x1="450" y1="66" x2="450" y2="96" stroke="#94A3B8" stroke-width="2" marker-end="url(#g6arr)"/>
<!-- stage 2 five elements -->
<rect x="60" y="100" width="780" height="106" rx="12" fill="#FDF2F8" stroke="#FBCFE8"/>
<text x="450" y="130" text-anchor="middle" font-size="14.5" font-weight="600" fill="#9D174D">第一步 需求采访：五要素一项都不能少</text>
<g font-size="13.5" text-anchor="middle">
<rect x="86" y="148" width="92" height="38" rx="19" fill="#fff" stroke="#F9A8D4"/><text x="132" y="172" fill="#BE185D">目标</text>
<rect x="196" y="148" width="92" height="38" rx="19" fill="#fff" stroke="#F9A8D4"/><text x="242" y="172" fill="#BE185D">背景</text>
<rect x="306" y="148" width="92" height="38" rx="19" fill="#fff" stroke="#F9A8D4"/><text x="352" y="172" fill="#BE185D">范围</text>
<rect x="416" y="144" width="118" height="46" rx="23" fill="#EC4899"/><text x="475" y="173" fill="#fff" font-weight="600">非目标 ★</text>
<rect x="552" y="148" width="126" height="38" rx="19" fill="#fff" stroke="#F9A8D4"/><text x="615" y="172" fill="#BE185D">完成条件</text>
</g>
<text x="722" y="166" font-size="12" fill="#C26798">划出「什么不做」</text>
<text x="722" y="182" font-size="12" fill="#C26798">防止需求越做越大</text>
<line x1="450" y1="206" x2="450" y2="236" stroke="#94A3B8" stroke-width="2" marker-end="url(#g6arr)"/>
<!-- stage 3 samples -->
<rect x="60" y="240" width="780" height="170" rx="12" fill="#fff" stroke="#E6E9ED"/>
<text x="90" y="272" font-size="14.5" font-weight="600" fill="#161C24">第二步 写三条验收样例：把「完成」具象成可检查的输入/期望</text>
<g font-size="13">
<rect x="90" y="290" width="700" height="32" rx="7" fill="#FDF2F8"/>
<text x="106" y="311" fill="#374151">① 输入「账号泄露，今天必须处理」→ 期望：分类=安全，优先级=P0</text>
<rect x="90" y="330" width="700" height="32" rx="7" fill="#FDF2F8"/>
<text x="106" y="351" fill="#374151">② 输入「权限异常，影响一个项目」→ 期望：分类=安全</text>
<rect x="90" y="370" width="700" height="32" rx="7" fill="#FFFBEB" stroke="#FDE68A"/>
<text x="106" y="391" fill="#92400E">③ 输入「普通活动排期」→ 期望：分类=运营，不被误判为安全　★反例样例</text>
</g>
<line x1="450" y1="410" x2="450" y2="440" stroke="#94A3B8" stroke-width="2" marker-end="url(#g6arr)"/>
<text x="585" y="432" font-size="12.5" fill="#8b95a1">交给 AI：只输出计划，明确要求「不要修改文件」</text>
<!-- stage 4 plan -->
<rect x="150" y="444" width="600" height="52" rx="12" fill="#fff" stroke="#F9A8D4"/>
<text x="450" y="470" text-anchor="middle" font-size="14" font-weight="600" fill="#9D174D">第三步 AI 输出简化 Plan</text>
<text x="450" y="489" text-anchor="middle" font-size="12" fill="#C26798">改哪些文件｜先加什么测试｜再改哪条规则｜最后跑什么命令｜哪些明确不做</text>
<line x1="450" y1="496" x2="450" y2="526" stroke="#94A3B8" stroke-width="2" marker-end="url(#g6arr)"/>
<!-- stage 5 RGR -->
<g>
<rect x="110" y="530" width="200 " height="86" rx="12" fill="#FEF2F2" stroke="#FECACA"/>
<text x="210" y="562" text-anchor="middle" font-size="15" font-weight="700" fill="#DC2626">Red 红</text>
<text x="210" y="586" text-anchor="middle" font-size="12.5" fill="#B91C1C">先跑测试确认它失败——</text>
<text x="210" y="603" text-anchor="middle" font-size="12.5" fill="#B91C1C">证明测试真能抓住问题</text>
<line x1="310" y1="573" x2="350" y2="573" stroke="#94A3B8" stroke-width="2" marker-end="url(#g6arr)"/>
<rect x="354" y="530" width="192" height="86" rx="12" fill="#ECFDF5" stroke="#A7F3D0"/>
<text x="450" y="562" text-anchor="middle" font-size="15" font-weight="700" fill="#059669">Green 绿</text>
<text x="450" y="586" text-anchor="middle" font-size="12.5" fill="#047857">只写让当前样例通过的</text>
<text x="450" y="603" text-anchor="middle" font-size="12.5" fill="#047857">最小改动，不多做</text>
<line x1="546" y1="573" x2="586" y2="573" stroke="#94A3B8" stroke-width="2" marker-end="url(#g6arr)"/>
<rect x="590" y="530" width="220" height="86" rx="12" fill="#EFF6FF" stroke="#BFDBFE"/>
<text x="700" y="562" text-anchor="middle" font-size="15" font-weight="700" fill="#2563EB">Refactor 重构</text>
<text x="700" y="586" text-anchor="middle" font-size="12.5" fill="#1D4ED8">整理命名和结构，</text>
<text x="700" y="603" text-anchor="middle" font-size="12.5" fill="#1D4ED8">但不顺便加新功能</text>
<path d="M590 596 h-230 c-40 0 -60 -10 -88 -34" fill="none" stroke="#FDA4AF" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#g6pk)"/>
<text x="360" y="642" text-anchor="middle" font-size="12" fill="#DB7699">TDD 循环：下一轮从 Red 开始（测试驱动开发 Test-Driven Development）</text>
</g>
</svg>
<figcaption>一图一意：模糊需求经过五要素采访、三条验收样例和一份不许动手的 Plan，最后进入 Red → Green → Refactor 的循环。</figcaption>
</figure>
</section>

<section>
<h2>走一遍真实场景</h2>
<p style="margin-bottom:14px;color:#5c6875">示例任务：让前面的「工作问题分诊」系统多识别一类「安全问题」（账号泄露、权限异常）。用它演示怎么把需求说清楚：</p>
<ol class="steps">
<li>用五要素写需求采访。<b>目标</b>：增加「安全问题」分类；<b>背景</b>：账号泄露、权限异常要交给安全负责人；<b>范围</b>：只改分类规则文件和相关测试；<b>非目标</b>：不新增数据库、页面、登录、通知或模型调用；<b>完成条件</b>：含「账号泄露」的输入判为「安全」，原有分类不受影响。<span class="note">每一项都不能少，「非目标」尤其关键。</span></li>
<li>动手之前，先写三条验收样例：两条说「应该怎样」，一条专门查「不该被误判的情况」——普通活动排期必须仍是运营分类。<span class="note">这是在动手前把「完成」写成可观察、可验证的结果。</span></li>
<li>把目标和样例发给 AI，只要它输出计划：只修改哪些文件、先加什么测试、再改哪条规则、最后运行哪些命令、哪些事情明确不做。<span class="note">提示词末尾写明：「不要修改文件。」</span></li>
<li><b>Red</b>：先运行测试或验收样例，确认新行为还没实现、处于失败状态。<span class="note">这一步是确认「测试真的能抓住问题」，失败的测试是正常且必要的。</span></li>
<li><b>Green 只写最小改动</b>让样例通过；<b>Refactor 整理结构</b>但不顺便加新功能。<span class="note">要建立的习惯是：让验证先于「我觉得代码应该可以」。Week 0 不要求真的改代码，读懂即可。</span></li>
</ol>
</section>

<section>
<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><div class="n">5 要素</div><div class="t">需求采访模板：目标、背景、范围、非目标、完成条件</div></div>
<div class="card"><div class="n">3 条</div><div class="t">验收样例起步配置，其中至少 1 条专门检查「不应该怎样」的误判情况</div></div>
<div class="card"><div class="n">3 步</div><div class="t">TDD 节奏：Red（先失败）→ Green（最小改动）→ Refactor（只整理不加功能）</div></div>
<div class="card"><div class="n">0 处</div><div class="t">执行阶段允许 AI 私自修改文件的地方数：出计划阶段明令「不要修改文件」</div></div>
</div>
</section>

<section>
<h2>再多懂一点</h2>
<ul class="facts">
<li><b>「非目标」是最容易被省略也最重要的一项。</b>没有它，「增加一个分类」会悄悄长成「新增数据库 + 页面 + 通知系统」。把它写进模板，等于预先签下「什么不做」的约定。</li>
<li><b>反例样例的价值常被低估。</b>很多人只写「应该怎样」，忘了写「不应该怎样」，结果系统把所有输入都判成安全问题——而这条错误恰好只会被第三类样例抓住。</li>
<li><b>Green 的纪律在「最小」二字。</b>只写让当前样例通过的那一点改动；Refactor 时整理命名和结构，但顺手加的新功能没有样例保护，等于回到不可验收的状态。</li>
</ul>
</section>

<section>
<h2>常见疑问</h2>
<div class="qa"><p class="q">又采访、又样例、又要等 Plan，效率是不是太低了？</p><p class="a">这些步骤都不改一行代码，只是把「完成的定义」提前几分钟写清楚。换来的是可验收的任务边界：AI 知道在哪停，你知道怎么检查。返工一次的成本远高于写这三段文字。</p></div>
<div class="qa"><p class="q">TDD 是不是意味着我要先掌握完整的测试理论？</p><p class="a">不需要。本篇只要求建立习惯：先定好「怎样算完成」，让验证先于「我觉得代码应该可以」。Red / Green / Refactor 是这个习惯的三步节奏，不是一门考试科目。</p></div>
<div class="qa"><p class="q">直接说「帮我优化一下」让 AI 自由发挥，效果会不会更好？（这样做会不会有风险？）</p><p class="a">风险大于收益。「优化」没有标准、没法验收：AI 只能猜你要什么，做完你也无法判断是否达标。而五要素把委托变成可观察、可验证的结果——哪条样例没过，一眼就知道问题在哪，这才是对双方都更快的路径。</p></div>
</section>

<section>
<h2>深入入口</h2>
<p class="deep">对应文字版：《需求采访Spec与TDD》，见课程 week0-reading/概念篇。前置阅读：《认识Coding-Agent》（图解第 05 章）；这套方法在完整闭环中的位置，见《完整实践与Week1交接》（图解第 07 章）。</p>
</section>

<nav>
<a href="05-coding-agent.html"><span class="lab">← 上一章</span><span class="t">认识 Coding Agent</span></a>
<a class="nx" href="07-week1-handoff.html"><span class="lab">下一章 →</span><span class="t">完整实践与 Week 1 交接</span></a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{e as default};
