const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#10B981">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>03 · 规则程序：JSON 与输入输出的边界</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{background:#F2FAF6}
body{font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.75;color:#17322A;padding:28px 18px 48px}
main{max-width:860px;margin:0 auto}
.crumb{font-size:13px;color:#74948A;letter-spacing:.02em}
.chip{display:inline-block;background:color-mix(in srgb,var(--accent) 12%,white);color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 35%,white);border-radius:999px;font-size:13px;padding:2px 12px;margin-top:14px}
.kicker{font-size:13px;color:#74948A;margin-top:8px;letter-spacing:.08em}
h1{font-size:30px;line-height:1.3;color:#0E8C67;margin-top:6px}
.lede{margin-top:10px;color:#3D5A50;font-size:17px}
h2{font-size:20px;color:#0E8C67;margin:38px 0 14px;padding-left:12px;border-left:4px solid var(--accent)}
p{margin:10px 0}
.muted{color:#6E877E;font-size:14px}
.card{background:#fff;border:1px solid #D4E8DF;border-radius:12px;padding:16px 18px;margin:12px 0}
.numgrid{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px}
.num{flex:1 1 160px;background:#fff;border:1px solid #D4E8DF;border-radius:12px;padding:14px 16px;text-align:left}
.num b{display:block;font-size:26px;color:#0E8C67}
.num span{font-size:14px;color:#4C6B60}
ol.walk{counter-reset:s;list-style:none;margin-top:10px}
ol.walk li{position:relative;padding-left:44px;margin:14px 0}
ol.walk li::before{counter-increment:s;content:counter(s);position:absolute;left:0;top:2px;width:28px;height:28px;border-radius:50%;background:var(--accent);color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:15px}
.qa{margin:14px 0}
.qa .q{font-weight:600;color:#0E8C67}
.qa .a{color:#3D5A50}
code.k{background:#E7F5EF;border:1px solid #CFE7DB;border-radius:5px;padding:1px 7px;font-family:"SF Mono",Menlo,Consolas,monospace;font-size:14px;color:#0B6E52}
.note{background:color-mix(in srgb,var(--accent) 6%,#fff);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:12px 16px;margin:12px 0}
svg{width:100%;height:auto;display:block;background:#fff;border:1px solid #D4E8DF;border-radius:12px;margin-top:10px}
nav.pager{display:flex;justify-content:space-between;gap:12px;margin-top:42px;padding-top:18px;border-top:1px solid #C8DED4;font-size:15px}
nav.pager a{color:#0E8C67;text-decoration:none;font-weight:600}
footer{margin-top:34px;text-align:center;font-size:13px;color:#7FA094}
table.simple{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;margin-top:10px;font-size:15px}
table.simple th,table.simple td{border:1px solid #DCEDE5;padding:9px 12px;text-align:left;vertical-align:top}
table.simple th{background:#E7F5EF;color:#0B6E52;font-weight:600}
</style>
</head>
<body>
<main>
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 0 概念篇 · 给想建立直觉的初学者</p>
<span class="chip">第 3 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>规则程序：JSON 与输入输出的边界</h1>
<p class="lede">所有 AI 应用最终都要落到数据输入、程序处理和结果输出。本篇先不用模型，看懂一个「确定性程序」是怎么工作的——以及它出错时为什么干脆。</p>

<h2>先打个比方</h2>
<div class="card">它像一位按规矩记账的老会计：凭证要素缺一项就退回重填，数字写错就整张退回，绝不替你猜着补上；账做完了就明明白白记一笔「完成」。这种「缺了就是不收」的死板，恰恰是它的可信之处。</div>

<h2>全景图解</h2>
<svg viewBox="0 0 900 700" role="img" aria-label="确定性程序的流水线与错误分支">
<defs>
<marker id="jp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#10B981"/></marker>
<marker id="jp-arrowr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#DC2626"/></marker>
<linearGradient id="jp-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF7F1"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
</defs>
<rect width="900" height="700" fill="url(#jp-bg)"/>
<text x="450" y="36" text-anchor="middle" font-size="19" font-weight="700" fill="#17322A">一个规则程序的流水线：一整条通道，两处岔口</text>

<!-- input json -->
<g font-family="Menlo,monospace">
<rect x="40" y="58" width="330" height="150" rx="14" fill="#16283F"/>
<text x="205" y="86" text-anchor="middle" font-size="14" fill="#7DD3FC">输入数据（JSON 格式的报名表）</text>
<text x="66" y="114" font-size="13" fill="#E7EEF7">{</text>
<text x="88" y="134" font-size="13" fill="#9AE6C8">"title": "登录页面报错",</text>
<text x="88" y="154" font-size="13" fill="#9AE6C8">"description": "同事无法登录内部系统",</text>
<text x="88" y="174" font-size="13" fill="#93C5FD">"urgency": 4</text>
<text x="66" y="194" font-size="13" fill="#E7EEF7">}</text>
</g>

<!-- rules of JSON -->
<g font-size="13" fill="#2E5447">
<rect x="396" y="58" width="480" height="150" rx="14" fill="#FFFFFF" stroke="#CBDCCF" stroke-dasharray="6 4"/>
<text x="416" y="84" font-size="14" font-weight="700" fill="#0B6E52">JSON 的基本规则（就这几条）</text>
<text x="416" y="108">· { } 表示一个「对象」，即一条记录</text>
<text x="416" y="130">· 字段名用双引号包起来；多个字段用逗号隔开</text>
<text x="416" y="152">· 文本值用双引号，数字（如 <tspan font-weight="700" fill="#0B6E52">4</tspan>）不加引号</text>
<text x="416" y="174">· 多条记录用方括号 [ ] 括起来，组成「数组」</text>
<text x="416" y="198" fill="#6E877E">· 它首先是一种人和程序都能读懂的数据格式，不是编程语言</text>
</g>

<path d="M370 133 h22" stroke="#10B981" stroke-width="2" fill="none" marker-end="url(#jp-arrow)"/>

<!-- pipeline -->
<g font-size="14">
<path d="M100 208 v30" stroke="#10B981" stroke-width="2" fill="none" marker-end="url(#jp-arrow)"/>
<g><rect x="40" y="242" width="120" height="56" rx="12" fill="#10B981"/><text x="100" y="266" text-anchor="middle" fill="#fff" font-weight="700">① 读取</text><text x="100" y="284" text-anchor="middle" fill="#DFF7EC" font-size="11.5">找到输入文件并解析</text></g>
<path d="M160 270 h34" stroke="#10B981" stroke-width="2" fill="none" marker-end="url(#jp-arrow)"/>
<g><rect x="198" y="242" width="130" height="56" rx="12" fill="#FFFFFF" stroke="#10B981" stroke-width="2"/><text x="263" y="266" text-anchor="middle" fill="#0B6E52" font-weight="700">② 校验</text><text x="263" y="284" text-anchor="middle" fill="#4C6B60" font-size="11.5">字段在不在？类型对不对？值合不合理？</text></g>
<path d="M328 270 h34" stroke="#10B981" stroke-width="2" fill="none" marker-end="url(#jp-arrow)"/>
<g><rect x="366" y="242" width="140" height="56" rx="12" fill="#FFFFFF" stroke="#10B981" stroke-width="2"/><text x="436" y="266" text-anchor="middle" fill="#0B6E52" font-weight="700">③ 处理</text><text x="436" y="284" text-anchor="middle" fill="#4C6B60" font-size="11.5">按固定规则分类、排序、算优先级</text></g>
<path d="M506 270 h34" stroke="#10B981" stroke-width="2" fill="none" marker-end="url(#jp-arrow)"/>
<g><rect x="544" y="242" width="130" height="56" rx="12" fill="#FFFFFF" stroke="#10B981" stroke-width="2"/><text x="609" y="266" text-anchor="middle" fill="#0B6E52" font-weight="700">④ 输出</text><text x="609" y="284" text-anchor="middle" fill="#4C6B60" font-size="11.5">把结果写成新的 JSON</text></g>
<path d="M674 270 h62 v96" stroke="#10B981" stroke-width="2" fill="none" marker-end="url(#jp-arrow)"/>
<!-- success box -->
<rect x="580" y="374" width="296" height="106" rx="12" fill="#DCF7EA" stroke="#10B981" stroke-width="1.5"/>
<text x="600" y="400" font-weight="700" fill="#0B6E52">成功输出（举例）</text>
<text x="600" y="424" font-family="Menlo,monospace" font-size="12.5" fill="#2E5447">{ category, priority,</text>
<text x="600" y="443" font-family="Menlo,monospace" font-size="12.5" fill="#2E5447">　next_step }</text>
<text x="600" y="467" font-size="12.5" fill="#2E5447">退出码 = 0 ✔</text>
</g>

<!-- error branches -->
<g font-size="13">
<circle cx="263" cy="298" r="4" fill="#DC2626"/>
<path d="M263 302 v54" stroke="#DC2626" stroke-width="2" fill="none" marker-end="url(#jp-arrowr)"/>
<rect x="60" y="360" width="250" height="92" rx="12" fill="#FDECEC" stroke="#DC2626"/>
<text x="76" y="386" font-weight="700" fill="#B91C1C">任一处校验不过 → 立刻停下</text>
<text x="76" y="410" fill="#7F1D1D">缺字段：「缺少字段 urgency」</text>
<text x="76" y="430" fill="#7F1D1D">解析失败：「第 X 行第 Y 列 JSON 格式错误」</text>
<circle cx="205" cy="200" r="4" fill="#DC2626"/>
<path d="M205 204 c0 40 130 20 118 148" stroke="#DC2626" stroke-width="1.6" stroke-dasharray="5 4" fill="none" marker-end="url(#jp-arrowr)"/>
</g>

<!-- exit code band -->
<path d="M185 456 v30" stroke="#DC2626" stroke-width="1.6" fill="none"/>
<g>
<rect x="40" y="492" width="836" height="94" rx="14" fill="#16283F"/>
<text x="62" y="520" font-size="14.5" font-weight="700" fill="#FBBF24">退出码：程序结束时交给系统的一个数字</text>
<text x="62" y="546" font-size="13.5" fill="#DCE7F5">· 0 = 成功　· 非 0（通常是 1）= 出错——它就是那句干脆的「我失败了」</text>
<text x="62" y="571" font-family="Menlo,monospace" font-size="12.5" fill="#7DA3E0">echo $? (macOS/Linux) ｜ $LASTEXITCODE (PowerShell) — Week 1 会用到</text>
</g>

<!-- five duties strip -->
<rect x="40" y="604" width="836" height="72" rx="14" fill="#FFFFFF" stroke="#CBDCCF"/>
<text x="60" y="630" font-size="13.5" font-weight="700" fill="#0B6E52">五块职责只有一种性格：输入一样 → 输出永远一样（这就是「确定性」，没有随机性）</text>
<g font-size="12.5" fill="#2E5447">
<rect x="60" y="640" width="70" height="24" rx="12" fill="#E7F5EF"/><text x="95" y="656" text-anchor="middle">读取</text>
<rect x="146" y="640" width="70" height="24" rx="12" fill="#E7F5EF"/><text x="181" y="656" text-anchor="middle">校验</text>
<rect x="232" y="640" width="70" height="24" rx="12" fill="#E7F5EF"/><text x="267" y="656" text-anchor="middle">处理</text>
<rect x="318" y="640" width="70" height="24" rx="12" fill="#E7F5EF"/><text x="353" y="656" text-anchor="middle">输出</text>
<rect x="404" y="640" width="128" height="24" rx="12" fill="#E7F5EF"/><text x="468" y="656" text-anchor="middle">错误提示（人能看懂）</text>
</g>
</svg>

<h2>走一遍真实场景</h2>
<p class="muted">源文用的场景是「活动报名表检查」：程序要检查每张报名表填得对不对，然后自动分流。假设校验规则要求每条记录必须有非空的 title、description 和 1–5 的整数 urgency。</p>
<ol class="walk">
<li>一张正常的报名表进来：读取 → 解析通过 → 校验通过（三个字段齐全，urgency 是 4）→ 分类排序 → 输出带 category、priority、next_step 的结果 JSON。<span class="muted">全程按固定规则走，没有任何一步需要「猜」。</span></li>
<li>换成缺字段的表（比如少了 urgency）：校验发现缺字段，程序停下，提示「缺少字段 urgency」，不再继续处理。<span class="muted">不会硬撑着往下走。</span></li>
<li>换成一份数学漏了引号的坏格式：第一步解析 JSON 就失败，停下并提示「第 X 行第 Y 列 JSON 格式错误」。<span class="muted">错在哪一格都告诉你。</span></li>
<li>再换成空数组 [ ]：校验发现没有可处理的记录，同样停下报错。<span class="muted">四种结局对应的正是它管住的边界——空到极端也要明确表态。</span></li>
<li>程序结束时给出退出码：成功是 0，失败通常是 1。下次在终端遇到一条命令没动静时，你可以查这个数字确认它是真成了还是悄悄败了。</li>
</ol>

<h2>值得记住的数字</h2>
<div class="numgrid">
<div class="num"><b>5 块</b><span>职责分工：读取、校验、处理、输出、错误提示</span></div>
<div class="num"><b>4 种</b><span>输入结局：正常成功 / 缺字段 / 格式错误 / 空数组</span></div>
<div class="num"><b>0 或非 0</b><span>退出码只有两种含义：0 成功，非 0（通常 1）出错</span></div>
<div class="num"><b>1–5</b><span>示例中 urgency 合法的取值范围，且必须是整数</span></div>
</div>

<h2>再多懂一点</h2>
<div class="card"><p><b>JSON 不是某种编程语言里的东西，不要去背语法书。</b>记住一句话即可：它首先是一种人和程序都能读懂的数据格式，上面那 5 条规则就够本课程起步用。</p></div>
<div class="card"><p><b>「错误提示」本身就是一块职责。</b>它要求出错时给出人能看懂的提示、并标记失败——提示信息属于设计的一部分，不是顺手打的日志。</p></div>
<div class="card"><p><b>和模型对照着看边界。</b>大模型被问同一个问题可能每次回答都不一样，也没有这么干脆的成功/失败信号；本章看的正是可控的那一半世界，后面章节再把两者接在一起。</p></div>

<h2>常见疑问</h2>
<div class="qa"><p class="q">Q：遇到小问题也整个停下来，会不会太脆弱了？</p>
<p class="a">这是刻意的设计选择：出错就停 + 清楚提示 + 标记失败，让问题在发生点就近暴露，而不是带着坏数据继续跑、把错误传到下游。可控性正来自这份死板。</p></div>
<div class="qa"><p class="q">Q：这样定的校验规则会不会误伤正常数据？</p>
<p class="a">有可能——规则是人定的，比如把 urgency 限制在 1–5 的整数就会拒绝超范围的紧急度。所以校验规则要随业务一起审视；但规则一旦定了，程序的表现就完全可预期。</p></div>
<div class="qa"><p class="q">Q：反正都是处理数据，直接用 AI 不行吗？</p>
<p class="a">不行也不必：确定性环节要的是同样的输入永远得到同样的输出，这正是引入模型之前必须先建立的地基。AI 应用最终也落在这个链路之上，只是把其中某几块换成了概率性的能力。</p></div>

<h2>深入入口</h2>
<p>对应文字版：《Week 0 从 JSON 到规则程序》，见课程 week0-reading/概念篇；第 4 章进入 Git 与安全边界，讲这些程序如何被追踪与恢复。</p>

<nav class="pager">
<a href="02-files-terminal-python.html">← 上一章：让程序跑起来：文件、路径与终端</a>
<a href="04-git-safety.html">下一章：Git 与安全边界：可追踪、可恢复 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</main>
</body>
</html>
`;export{t as default};
