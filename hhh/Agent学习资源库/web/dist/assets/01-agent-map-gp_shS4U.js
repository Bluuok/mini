const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>01 · 大模型、AI 应用与 Agent 地图</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{background:#F6F5FB}
body{font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.75;color:#26243A;padding:28px 18px 48px}
main{max-width:860px;margin:0 auto}
.crumb{font-size:13px;color:#8A87A3;letter-spacing:.02em}
.chip{display:inline-block;background:color-mix(in srgb,var(--accent) 12%,white);color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 35%,white);border-radius:999px;font-size:13px;padding:2px 12px;margin-top:14px}
.kicker{font-size:13px;color:#8A87A3;margin-top:8px;letter-spacing:.08em}
h1{font-size:30px;line-height:1.3;color:var(--accent);margin-top:6px}
.lede{margin-top:10px;color:#4B4766;font-size:17px}
h2{font-size:20px;color:var(--accent);margin:38px 0 14px;padding-left:12px;border-left:4px solid var(--accent)}
p{margin:10px 0}
.muted{color:#77738E;font-size:14px}
.card{background:#fff;border:1px solid #E4E1F2;border-radius:12px;padding:16px 18px;margin:12px 0}
.numgrid{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px}
.num{flex:1 1 160px;background:#fff;border:1px solid #E4E1F2;border-radius:12px;padding:14px 16px;text-align:left}
.num b{display:block;font-size:26px;color:var(--accent)}
.num span{font-size:14px;color:#5C5875}
ol.walk{counter-reset:s;list-style:none;margin-top:10px}
ol.walk li{position:relative;padding-left:44px;margin:14px 0}
ol.walk li::before{counter-increment:s;content:counter(s);position:absolute;left:0;top:2px;width:28px;height:28px;border-radius:50%;background:var(--accent);color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:15px}
.qa{margin:14px 0}
.qa .q{font-weight:600;color:var(--accent)}
.qa .a{color:#4B4766}
.note{background:color-mix(in srgb,var(--accent) 6%,#fff);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:12px 16px;margin:12px 0}
svg{width:100%;height:auto;display:block;background:#fff;border:1px solid #E4E1F2;border-radius:12px;margin-top:10px}
nav.pager{display:flex;justify-content:space-between;gap:12px;margin-top:42px;padding-top:18px;border-top:1px solid #DDD9EE;font-size:15px}
nav.pager a{color:var(--accent);text-decoration:none;font-weight:600}
nav.pager span{color:#A09CB5}
footer{margin-top:34px;text-align:center;font-size:13px;color:#A09CB5}
</style>
</head>
<body>
<main>
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 0 概念篇 · 给想建立直觉的初学者</p>
<span class="chip">第 1 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>大模型、AI 应用与 Agent 地图</h1>
<p class="lede">先看懂软件的基本链路：输入是什么、程序如何处理、输出如何验证——之后才能看懂 LLM 和 Agent 到底增加了什么能力、又带来了什么不确定性。</p>

<h2>先打个比方</h2>
<div class="card">把三种系统想成机场安检台的三种工作方式：一种只认传送带上的标签，按固定规则分拣；一种像经验丰富的安检员，看一眼箱内画面自己做判断；还有一种发现可疑不放行也不瞎猜，而是打开箱子核实了再说。这章的任务是分清这三者各自怎么工作、分别会在哪里出错。</div>

<h2>全景图解</h2>
<svg viewBox="0 0 900 640" role="img" aria-label="同一条客户消息进入三种系统后的不同处理">
<defs>
<marker id="am-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#7C5CFC"/></marker>
<linearGradient id="am-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F0FF"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
</defs>
<rect width="900" height="640" fill="url(#am-bg)"/>
<text x="450" y="36" text-anchor="middle" font-size="19" font-weight="700" fill="#26243A">同一条消息，三种系统复杂度</text>
<g>
<rect x="250" y="54" width="400" height="46" rx="23" fill="#7C5CFC"/>
<text x="450" y="83" text-anchor="middle" font-size="16" fill="#fff">输入：客户重复扣款，希望今天处理</text>
</g>
<path d="M320 100 L150 158" stroke="#7C5CFC" stroke-width="2" fill="none" marker-end="url(#am-arrow)"/>
<path d="M450 100 L450 158" stroke="#7C5CFC" stroke-width="2" fill="none" marker-end="url(#am-arrow)"/>
<path d="M580 100 L750 158" stroke="#7C5CFC" stroke-width="2" fill="none" marker-end="url(#am-arrow)"/>

<!-- column 1 -->
<g>
<rect x="30" y="166" width="260" height="290" rx="14" fill="#FFFFFF" stroke="#D8D2F0"/>
<rect x="30" y="166" width="260" height="42" rx="14" fill="#7C5CFC"/><rect x="30" y="196" width="260" height="12" fill="#7C5CFC"/>
<text x="160" y="193" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">规则程序</text>
<text x="46" y="232" font-size="13.5" fill="#3B3760">① 在文本里命中关键词：</text>
<text x="60" y="252" font-size="13.5" fill="#7C5CFC" font-weight="600">“扣款”“今天”</text>
<text x="46" y="280" font-size="13.5" fill="#3B3760">② 按写死的规则打标</text>
<line x1="46" y1="292" x2="274" y2="292" stroke="#EEEAF9"/>
<text x="46" y="315" font-size="13" fill="#3B3760">category = 财务</text>
<text x="46" y="337" font-size="13" fill="#3B3760">priority = P0</text>
<text x="46" y="359" font-size="13" fill="#3B3760">next_step = 转给财务值班人</text>
<text x="46" y="392" font-size="12.5" fill="#6C67A8">靠关键词、死板但可控</text>
<text x="46" y="412" font-size="12.5" fill="#6C67A8">查不到语义之外的情况</text>
</g>
<!-- column 2 -->
<g>
<rect x="320" y="166" width="260" height="290" rx="14" fill="#FFFFFF" stroke="#D8D2F0"/>
<rect x="320" y="166" width="260" height="42" rx="14" fill="#5538DB"/><rect x="320" y="196" width="260" height="12" fill="#5538DB"/>
<text x="450" y="193" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">LLM 应用</text>
<text x="336" y="232" font-size="13.5" fill="#3B3760">① 把消息交给模型理解</text>
<text x="336" y="260" font-size="13.5" fill="#3B3760">② 模型判断类别、优先级</text>
<text x="336" y="280" font-size="13.5" fill="#3B3760">　 和下一步</text>
<line x1="336" y1="292" x2="564" y2="292" stroke="#EEEAF9"/>
<text x="336" y="315" font-size="13" fill="#3B3760">category = 财务</text>
<text x="336" y="337" font-size="13" fill="#3B3760">priority = P0</text>
<text x="336" y="359" font-size="13" fill="#3B3760">next_step = 建议先核对账单</text>
<text x="336" y="392" font-size="12.5" fill="#6C67A8">按语义判断、灵活</text>
<text x="336" y="412" font-size="12.5" fill="#6C67A8">措辞可能每次略有不同</text>
</g>
<!-- column 3 -->
<g>
<rect x="610" y="166" width="260" height="290" rx="14" fill="#FFFFFF" stroke="#D8D2F0" stroke-width="2"/>
<rect x="610" y="166" width="260" height="42" rx="14" fill="#33207F"/><rect x="610" y="196" width="260" height="12" fill="#33207F"/>
<text x="740" y="193" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">Agent</text>
<text x="626" y="232" font-size="13.5" fill="#3B3760">① 判断：需要先查证吗？</text>
<text x="626" y="260" font-size="13.5" fill="#3B3760">② 调用工具查这笔订单的</text>
<text x="626" y="280" font-size="13.5" fill="#3B3760">　 交易记录</text>
<line x1="626" y1="292" x2="854" y2="292" stroke="#EEEAF9"/>
<text x="626" y="315" font-size="13" fill="#3B3760">发现确实有两笔相同金额扣款</text>
<text x="626" y="337" font-size="13" fill="#3B3760">category = 财务, priority = P0</text>
<text x="626" y="359" font-size="13" fill="#3B3760">next_step = 附上重复扣款证据</text>
<text x="626" y="392" font-size="12.5" fill="#6C67A8">不靠猜，先查证再下结论</text>
<text x="626" y="412" font-size="12.5" fill="#6C67A8">多步判断并继续行动</text>
</g>

<path d="M160 456 L160 496" stroke="#7C5CFC" stroke-width="2" fill="none" marker-end="url(#am-arrow)"/>
<path d="M450 456 L450 496" stroke="#7C5CFC" stroke-width="2" fill="none" marker-end="url(#am-arrow)"/>
<path d="M740 456 L740 496" stroke="#7C5CFC" stroke-width="2" fill="none" marker-end="url(#am-arrow)"/>
<rect x="30" y="504" width="840" height="110" rx="14" fill="#EFEBFF" stroke="#7C5CFC" stroke-width="1.5"/>
<text x="52" y="532" font-size="15" font-weight="700" fill="#33207F">必须记住的边界：任何一列都不例外</text>
<text x="52" y="560" font-size="13.5" fill="#3B3760">· 模型输出可能合理，也可能错误。· Agent 说“完成了”不是证据。</text>
<text x="52" y="586" font-size="13.5" fill="#3B3760">· 工具真正执行动作的是程序，不是模型文字本身。</text>
<text x="52" y="604" font-size="13.5" fill="#3B3760">· 规则、测试和人工确认负责把概率性能力放进可控范围。</text>
</svg>

<h2>走一遍真实场景</h2>
<ol class="walk">
<li>同一条客服消息进来：「客户重复扣款，希望今天处理」。<span class="muted">这是本章贯穿始终的对比实验：全文不运行任何东西，只用读的。</span></li>
<li>交给规则程序：它在文本里命中「扣款」「今天」两个关键词，于是分类为财务、P0。<span class="muted">输出完全由规则决定，句式换掉就可能漏判。</span></li>
<li>交给 LLM 应用：模型根据语义判断类别、优先级和下一步——建议先核对账单再联系财务。<span class="muted">灵活，但措辞可能每次略有不同。</span></li>
<li>交给 Agent：它先判断要不要查证，主动调用工具查这笔订单的交易记录，发现确实有两笔相同金额扣款，才下结论并附上证据转给财务值班人。<span class="muted">差别就在这一步：根据真实工具结果继续行动。</span></li>
<li>回头看三份输出：结论可以一样，可靠程度完全不同——验证方式也不同，这正是后面所有章节要解决的事。</li>
</ol>

<h2>值得记住的数字</h2>
<div class="numgrid">
<div class="num"><b>3 种</b><span>系统复杂度：规则程序、LLM 应用、Agent——不是三个品牌，是三层复杂度</span></div>
<div class="num"><b>4 个</b><span>必懂词：LLM、AI 应用、Agent、Tool</span></div>
<div class="num"><b>4 条</b><span>必须记住的边界（见上图底部）</span></div>
<div class="num"><b>4 问</b><span>读完应能回答：LLM 与 AI 应用的区别等四个问题</span></div>
</div>

<h2>再多懂一点</h2>
<div class="card"><p><b>LLM ≠ 完整应用。</b>LLM 只是能理解和生成文本的模型；把它和界面、数据、规则、工具和工作流组合起来，才是 AI 应用。</p></div>
<div class="card"><p><b>Agent 的定义里有三个要件：</b>在目标和约束下、能多步判断、能调用工具并继续行动。缺一件就不叫 Agent。Tool 是 Agent 可以请求程序执行的能力——例如读文件、查数据或计算，真正执行的永远是程序。</p></div>
<div class="card"><p><b>听过即可的三件套：</b>Memory（记忆）、Workflow（工作流）、Guardrail（护栏）本篇只要求认识名字；而且一个 Agent 不一定同时具备所有组件。</p></div>

<h2>常见疑问</h2>
<div class="qa"><p class="q">Q：我直接从「让 AI 写代码」开始学不行吗？为什么 Week 0 先讲规则程序？</p>
<p class="a">因为你要先看懂软件的基本链路——输入、处理、输出如何验证。之后才能看清 LLM 和 Agent 到底增加了什么，而不是把它们的输出当成魔法。</p></div>
<div class="qa"><p class="q">Q：LLM 应用的回答看着更像人话，是不是比规则程序更好？</p>
<p class="a">只是更灵活，不必然更可靠：规则程序死板但可控，模型可能出错且没有干脆的成功/失败信号。选哪种取决于这个环节更需要灵活还是可控。</p></div>
<div class="qa"><p class="q">Q：Agent 都说「完成了」了，还会有风险吗？</p>
<p class="a">会。源文把这条单独列为边界：Agent 说「完成了」不是证据。要用工具的真实返回结果、测试和人工确认来核对——这也是概率性的系统能被放进可控范围的原因。</p></div>

<h2>深入入口</h2>
<p>对应文字版：《Week 0 建立 AI 应用与 Agent 的地图》，见课程 week0-reading/概念篇；第 2 章继续讲文件、路径与终端，为动手做铺垫。</p>

<nav class="pager">
<span>← 第一章</span>
<a href="02-files-terminal-python.html">下一章：让程序跑起来：文件、路径与终端 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</main>
</body>
</html>
`;export{t as default};
