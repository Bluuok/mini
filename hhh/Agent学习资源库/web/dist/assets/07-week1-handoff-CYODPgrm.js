const e=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#14B8A6;--soft:#F0FDFA;--line:#E6E9ED">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>07 · 完整实践与 Week 1 交接</title>
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
<span class="chip">第 7 章 · 共 32 章</span><span class="kicker">速成计划 图解</span>
<h1>完整实践与 Week 1 交接</h1>
<p class="lede">前面几篇是零散概念，这一篇把它们串成一条完整的验收闭环——也是 Week 1 起真实动手时要走的标准流程；最后是进入 Week 1 前的模型访问准备。</p>

<section>
<h2>先打个比方</h2>
<p>像交接班时的核对单：上一班做到哪一步、每一班按什么顺序操作、哪些钥匙由谁保管，一项项列清楚再离开。流程写在纸面上，责任才不会悬空——Week 0 到 Week 1 的交接，交的就是这张核对单。</p>
</section>

<section>
<h2>全景图解</h2>
<figure class="figcard">
<svg viewBox="0 0 900 600" role="img" aria-label="八步验收闭环">
<defs>
<marker id="g7arr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#94A3B8"/></marker>
<marker id="g7bk" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#F59E0B"/></marker>
</defs>
<ellipse cx="450" cy="300" rx="315" ry="205" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="6 5"/>
<!-- nodes -->
<g text-anchor="middle">
<g><rect x="362" y="66" width="176" height="58" rx="12" fill="#fff" stroke="#99F6E4"/><circle cx="386" cy="95" r="13" fill="#14B8A6"/><text x="386" y="100" font-size="13.5" fill="#fff" font-weight="700">1</text><text x="455" y="90" font-size="14" font-weight="600" fill="#161C24">检查目录和当前状态</text><text x="455" y="110" font-size="11.5" fill="#8b95a1">知道自己站在哪</text></g>
<g><rect x="585" y="126" width="176" height="58" rx="12" fill="#fff" stroke="#99F6E4"/><circle cx="609" cy="155" r="13" fill="#14B8A6"/><text x="609" y="160" font-size="13.5" fill="#fff" font-weight="700">2</text><text x="678" y="150" font-size="14" font-weight="600" fill="#161C24">阅读相关文件</text><text x="678" y="170" font-size="11.5" fill="#8b95a1">先看清要动的地方</text></g>
<g><rect x="677" y="271" width="176" height="58" rx="12" fill="#fff" stroke="#99F6E4"/><circle cx="701" cy="300" r="13" fill="#14B8A6"/><text x="701" y="305" font-size="13.5" fill="#fff" font-weight="700">3</text><text x="767" y="295" font-size="13.5" font-weight="600" fill="#161C24">Agent 分析并出计划</text><text x="767" y="315" font-size="11.5" fill="#8b95a1">只出计划，不动手</text></g>
<g><rect x="585" y="416" width="176" height="58" rx="12" fill="#FFF7ED" stroke="#FDBA74"/><circle cx="609" cy="445" r="13" fill="#F59E0B"/><text x="609" y="450" font-size="13.5" fill="#fff" font-weight="700">4</text><text x="678" y="442" font-size="14" font-weight="600" fill="#9A3412">人工确认范围</text><text x="678" y="462" font-size="11.5" fill="#C27030">你同意后它才能改</text></g>
<g><rect x="362" y="476" width="176" height="58" rx="12" fill="#fff" stroke="#99F6E4"/><circle cx="386" cy="505" r="13" fill="#14B8A6"/><text x="386" y="510" font-size="13.5" fill="#fff" font-weight="700">5</text><text x="455" y="500" font-size="14" font-weight="600" fill="#161C24">执行一个小修改</text><text x="455" y="520" font-size="11.5" fill="#8b95a1">小步改，不摊大饼</text></g>
<g><rect x="139" y="416" width="176" height="58" rx="12" fill="#fff" stroke="#99F6E4"/><circle cx="163" cy="445" r="13" fill="#14B8A6"/><text x="163" y="450" font-size="13.5" fill="#fff" font-weight="700">6</text><text x="227" y="440" font-size="13.5" font-weight="600" fill="#161C24">运行测试和真实命令</text><text x="227" y="460" font-size="11.5" fill="#8b95a1">亲自跑，看实际输出</text></g>
<g><rect x="47" y="271" width="176" height="58" rx="12" fill="#fff" stroke="#99F6E4"/><circle cx="71" cy="300" r="13" fill="#14B8A6"/><text x="71" y="305" font-size="13.5" fill="#fff" font-weight="700">7</text><text x="140" y="295" font-size="13.5" font-weight="600" fill="#161C24">查看变更与实际输出</text><text x="140" y="315" font-size="11.5" fill="#8b95a1">git diff + 真实结果</text></g>
<g><rect x="139" y="126" width="176" height="58" rx="12" fill="#ECFDF5" stroke="#5EEAD4"/><circle cx="163" cy="155" r="13" fill="#0D9488"/><text x="163" y="160" font-size="13.5" fill="#fff" font-weight="700">8</text><text x="230" y="152" font-size="13.5" font-weight="600" fill="#065F46">对照验收样例确认</text><text x="230" y="172" font-size="11.5" fill="#0F766E">依据完成条件，不凭感觉</text></g>
</g>
<!-- flow arrows -->
<line x1="496" y1="107" x2="627" y2="143" stroke="#94A3B8" stroke-width="2" marker-end="url(#g7arr)"/>
<line x1="699" y1="196" x2="739" y2="259" stroke="#94A3B8" stroke-width="2" marker-end="url(#g7arr)"/>
<line x1="739" y1="341" x2="699" y2="404" stroke="#94A3B8" stroke-width="2" marker-end="url(#g7arr)"/>
<line x1="627" y1="457" x2="496" y2="493" stroke="#94A3B8" stroke-width="2" marker-end="url(#g7arr)"/>
<line x1="404" y1="493" x2="273" y2="457" stroke="#94A3B8" stroke-width="2" marker-end="url(#g7arr)"/>
<line x1="201" y1="404" x2="161" y2="341" stroke="#94A3B8" stroke-width="2" marker-end="url(#g7arr)"/>
<line x1="161" y1="259" x2="201" y2="196" stroke="#94A3B8" stroke-width="2" marker-end="url(#g7arr)"/>
<line x1="273" y1="143" x2="404" y2="107" stroke="#94A3B8" stroke-width="2" marker-end="url(#g7arr)"/>
<!-- retry arc -->
<path d="M561 445 h-120 c-30 0 -55 -15 -72 -33" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#g7bk)"/>
<text x="448" y="428" text-anchor="middle" font-size="12" fill="#B45309">对不上时：回到确认范围，再小步改一轮</text>
<!-- center -->
<g text-anchor="middle">
<text x="450" y="266" font-size="17" font-weight="700" fill="#134E4A">可观察</text>
<text x="450" y="292" font-size="17" font-weight="700" fill="#134E4A">可回退</text>
<text x="450" y="318" font-size="17" font-weight="700" fill="#134E4A">可验收</text>
<text x="450" y="345" font-size="12" fill="#5EEAD4">每一步都要留下证据</text>
</g>
<!-- bottom strip -->
<rect x="60" y="556" width="800" height="2" fill="none"/>
</svg>
<figcaption>一图一意：八步闭环把「检查状态 → 出计划 → 小修改 → 验证 → 对照样例」连成一圈；中心三个词就是这条流程的本质。</figcaption>
</figure>
</section>

<section>
<h2>走一遍真实场景</h2>
<p style="margin-bottom:14px;color:#5c6875">假设你要按这套流程给分诊系统加一个分类关键词：</p>
<ol class="steps">
<li>先检查目录和当前状态：知道自己站在哪，别在错的地方改。<span class="note">关键节点之一：「先检查状态再动手」。</span></li>
<li>阅读相关文件，让 Agent 输出分析和计划。<span class="note">关键节点之二：「先出计划再确认」，不让 Agent 直接改。</span></li>
<li>人工确认范围后，才执行一个小的修改。<span class="note">范围以第 06 章五要素里的「范围 / 非目标」为准。</span></li>
<li>运行测试和真实命令，查看变更（git diff）与实际输出。<span class="note">关键节点之三：「看证据，不看总结」——不听「应该可以」。</span></li>
<li>对照事先写好的验收样例逐条确认。<span class="note">关键节点之四：判断依据是完成条件，而不是感觉。这条闭环在 Week 1 你会真正走一遍。</span></li>
</ol>
</section>

<section>
<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><div class="n">8 步</div><div class="t">完整验收闭环的步骤数：从检查状态到对照验收样例</div></div>
<div class="card"><div class="n">4 个节点</div><div class="t">先检查状态、先出计划、看证据不看总结、对照验收样例</div></div>
<div class="card"><div class="n">3 条路</div><div class="t">Week 1 前选一条模型访问路径：DeepSeek 官方平台（按量充值）、火山引擎方舟 Coding Plan（订阅套餐）、或其它官方模型服务</div></div>
<div class="card"><div class="n">6 题</div><div class="t">Week 0 自测题数：六题都能用自己的话答上来，才算读到位</div></div>
</div>
</section>

<section>
<h2>再多懂一点</h2>
<ul class="facts">
<li><b>这条闭环的本质是把每一步变成「可观察、可回退、可验收」。</b>它能成立，正是因为前几章铺垫了 Git（可回退）、受控协作（可观察）和 Spec / TDD（可验收）。</li>
<li><b>Coding Plan 和普通 API 按量计费不是同一种产品。</b>两者的 Base URL（服务入口地址）、模型名称和密钥不能混用；选了哪条路就按哪条路的文档来，别把两边的配置拼在一起。</li>
<li><b>准备阶段的分工必须清楚。</b>购买、充值、创建密钥由你本人完成；可以让 AI 只根据官方文档帮你列出开通产品、Base URL、.env 变量和最小验证命令，但完整 API Key 绝不发给它——Week 0 全程也确实不需要 API Key。</li>
</ul>
</section>

<section>
<h2>常见疑问</h2>
<div class="qa"><p class="q">Week 0 没花一分钱、没装任何东西，这样的学习有效吗？</p><p class="a">有效与否有明确的检验标准：那六道自测题——三者的关系、可控性差别、为什么看证据、受控修改五步、怎么把「优化」变成可验收任务、进 Week 1 要准备什么——都能用自己的话答出来。概念底座打好了，Week 1 从 LLM API、Prompt 和 Agent 范式开始的动手才有地方挂靠。</p></div>
<div class="qa"><p class="q">我把 DeepSeek 的 Key 和方舟 Coding Plan 的配置都留在 .env 里备用，行吗？（这样做会不会有风险？）</p><p class="a">不建议。两者不是同一种产品：Base URL、模型名称和密钥都不能混用，混着拼配置会指向错误的服务入口，排查起来非常混乱。选定一条路径，照它的官方文档来配置；同时记住 Key 属于敏感信息，.env 必须被 .gitignore 排除。</p></div>
<div class="qa"><p class="q">能不能直接把账号密码发给 AI，让它帮我全程开通套餐？</p><p class="a">不能。付款动作必须由你本人完成，完整 API Key、密码、Cookie 都绝不发送给 AI。AI 的角色边界是：根据官方文档帮你解释步骤、核对脱敏后的配置是否正确。</p></div>
</section>

<section>
<h2>深入入口</h2>
<p class="deep">对应文字版：《完整实践与Week1交接》，见课程 week0-reading/概念篇。它是《需求采访Spec与TDD》（图解第 06 章）的收束篇；Week 1 将从图解第 08 章《Python 基础语法最小集》起进入每日动手内容。</p>
</section>

<nav>
<a href="06-spec-tdd.html"><span class="lab">← 上一章</span><span class="t">需求采访、Spec 与 TDD</span></a>
<a class="nx" href="08-python-basics.html"><span class="lab">下一章 →</span><span class="t">Python 基础语法最小集</span></a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{e as default};
