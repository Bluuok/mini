const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#0D9488">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第14章 · Agent 范式：从一次调用到循环 · 三十天速成计划 图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#FFF9F0;color:#232733;line-height:1.7;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.crumb{font-size:14.5px;color:#8A8F9E;margin-bottom:14px}
.crumb b{color:var(--accent)}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:15px}
h1{font-size:32px;line-height:1.25;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:26px}
h2{font-size:23px;margin:34px 0 8px}
.card{background:#fff;border:2.5px solid #232733;border-radius:18px;box-shadow:6px 6px 0 rgba(35,39,51,.10);padding:20px;margin:20px 0}
.card p{font-size:16.5px;color:#4A5060;margin:6px 0}
.chip{display:inline-block;border:3px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 16px;font-weight:700}
svg{width:100%;height:auto;display:block;margin:16px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}
.num{font-size:30px;font-weight:800;color:var(--accent)}
.num small{display:block;font-size:15px;font-weight:400;color:#4A5060;line-height:1.5;margin-top:4px}
.step{display:flex;gap:12px;margin:15px 0;align-items:flex-start}
.step .n{flex:0 0 34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px}
.step p{font-size:16.5px;color:#3A3F4E}
.step .note{display:block;font-size:14.5px;color:#8A8F9E}
.more{padding-left:24px}
.more li{margin:9px 0;font-size:16.5px;color:#3A3F4E}
.qa{margin:14px 0}
.qa b{color:#232733}
.qa p{font-size:16.5px;color:#4A5060;margin-top:2px}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:46px;font-weight:700;font-size:16px}
a{color:var(--accent)}
footer{margin-top:44px;color:#8A8F9E;font-size:14px;text-align:center}
</style></head>
<body><div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · <b>Week 1</b> · 给想建立直觉的初学者</p>
<span class="chip">第 14 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>Agent 范式：从一次调用到循环</h1>
<p class="lede">复杂任务要模型多走几步、中途还能调工具。业界沉淀了三种组织方式，今天把其中最小的一种——ReAct 循环——完整看懂。</p>

<h2>先打个比方</h2>
<p>ReAct 循环像现场勘测的分工：测量员每提出一个坐标请求（Action），记录员必须实地量完才把读数念回来（Observation），图纸上只允许出现实测数据。测量员再有经验，也不能替仪器写字。</p>

<h2>全景图解</h2>
<div class="card">
<svg viewBox="0 0 900 600" role="img" aria-label="ReAct 循环：调模型、解析三种归宿、程序执行工具并填回 Observation，max_iter 安全阀兜底">
  <defs>
    <marker id="d3-arw" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M2,2 L10,6 L2,10 z" fill="#232733"/></marker>
    <marker id="d3-arwT" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M2,2 L10,6 L2,10 z" fill="#0D9488"/></marker>
    <marker id="d3-arwG" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M2,2 L10,6 L2,10 z" fill="#059669"/></marker>
  </defs>
  <rect x="340" y="30" width="240" height="64" rx="14" fill="#F0FDFA" stroke="#0D9488" stroke-width="3"/>
  <text x="460" y="58" text-anchor="middle" font-size="17" font-weight="bold" fill="#115E59">调模型 call_model</text>
  <text x="460" y="82" text-anchor="middle" font-size="13" fill="#7C8B88">temperature=0 · max_tokens=512</text>
  <line x1="460" y1="96" x2="460" y2="130" stroke="#232733" stroke-width="3" marker-end="url(#d3-arw)"/>
  <rect x="340" y="136" width="240" height="62" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="460" y="163" text-anchor="middle" font-size="17" font-weight="bold" fill="#232733">解析输出 parse_react</text>
  <text x="460" y="186" text-anchor="middle" font-size="13.5" fill="#8A8F9E">文本协议 → 三种归宿</text>
  <path d="M336,167 H120 V206" fill="none" stroke="#059669" stroke-width="3" marker-end="url(#d3-arwG)"/>
  <text x="278" y="152" text-anchor="end" font-size="13.5" font-weight="bold" fill="#059669">final｜唯一正常出口</text>
  <rect x="36" y="210" width="244" height="66" rx="14" fill="#ECFDF5" stroke="#059669" stroke-width="3"/>
  <text x="158" y="236" text-anchor="middle" font-size="16" font-weight="bold" fill="#065F46">Final Answer 返回答案</text>
  <text x="158" y="260" text-anchor="middle" font-size="13" fill="#6B7280">答案＋每步轨迹记录＋累计 token 成本</text>
  <line x1="584" y1="167" x2="626" y2="167" stroke="#232733" stroke-width="3" marker-end="url(#d3-arw)"/>
  <text x="605" y="153" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#B45309">action</text>
  <rect x="632" y="136" width="242" height="140" rx="14" fill="#FFF7ED" stroke="#F59E0B" stroke-width="3"/>
  <text x="753" y="166" text-anchor="middle" font-size="16" font-weight="bold" fill="#B45309">查 TOOLS 表，程序执行</text>
  <text x="650" y="196" font-size="13.5" fill="#92400E">get_time｜真实时钟，模型不知道</text>
  <text x="650" y="222" font-size="13.5" fill="#92400E">calculator｜白名单四则运算 ＋−×÷</text>
  <text x="650" y="248" font-size="12.5" fill="#92400E">模型只见 description，碰不到 run；</text>
  <text x="650" y="266" font-size="12.5" fill="#92400E">不存在的工具也返回 error 文本</text>
  <path d="M753,280 V303 H310 V73 H333" fill="none" stroke="#0D9488" stroke-width="3" marker-end="url(#d3-arwT)"/>
  <text x="430" y="297" font-size="13.5" font-weight="bold" fill="#0D9488">Observation 由程序执行后填入，追加回上下文</text>
  <line x1="460" y1="202" x2="460" y2="314" stroke="#EF4444" stroke-width="3" marker-end="url(#d3-arwG)"/>
  <text x="474" y="306" font-size="12.5" font-weight="bold" fill="#B91C1C">malformed</text>
  <rect x="340" y="320" width="240" height="62" rx="14" fill="#FEF2F2" stroke="#EF4444" stroke-width="3"/>
  <text x="460" y="348" text-anchor="middle" font-size="15" font-weight="bold" fill="#B91C1C">原文退回＋格式提醒</text>
  <text x="460" y="372" text-anchor="middle" font-size="12.5" fill="#7F1D1D">给一次修正机会，回到下一轮调用</text>
  <rect x="36" y="320" width="250" height="118" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="58" y="352" font-size="16" font-weight="bold" fill="#232733">两条铁律</text>
  <text x="58" y="380" font-size="13.5" fill="#4A5060">① Observation 只能来自工具执行，</text>
  <text x="74" y="400" font-size="13.5" fill="#4A5060">绝不能由模型编造</text>
  <text x="58" y="426" font-size="13.5" fill="#4A5060">② max_iter 是防死循环的安全阀，不能省</text>
  <rect x="36" y="486" width="400" height="92" rx="14" fill="#EFF6FF" stroke="#2563EB" stroke-width="3"/>
  <text x="58" y="512" font-size="15.5" font-weight="bold" fill="#1E40AF">轨迹＝上下文里累积的消息列表</text>
  <text x="58" y="536" font-size="13" fill="#1E3A8A">每轮把 assistant 原话和 Observation 拼回去——</text>
  <text x="58" y="554" font-size="13" fill="#1E3A8A">无状态模型靠历史消息「记得」走到哪了；</text>
  <text x="58" y="572" font-size="13" fill="#1E3A8A">协议还约定：同一工具连败 3 次就止损认输</text>
  <rect x="456" y="486" width="196" height="92" rx="14" fill="#FEFCE8" stroke="#CA8A04" stroke-width="2.5"/>
  <text x="478" y="512" font-size="15.5" font-weight="bold" fill="#854D0E">安全阀 max_iter=5</text>
  <text x="478" y="536" font-size="12.5" fill="#713F12">跑满 5 轮仍未结束：</text>
  <text x="478" y="554" font-size="12.5" fill="#713F12">强制停止，程序明确承认</text>
  <text x="478" y="572" font-size="12.5" fill="#713F12">这轮没跑出答案</text>
  <rect x="672" y="486" width="200" height="92" rx="14" fill="#fff" stroke="#232733" stroke-width="2.5"/>
  <text x="692" y="512" font-size="15.5" font-weight="bold" fill="#232733">另两种范式</text>
  <text x="692" y="534" font-size="12.5" fill="#4A5060">Plan-Execute：先计划再执行</text>
  <text x="692" y="552" font-size="12.5" fill="#4A5060">Reflexion：失败后记教训、</text>
  <text x="692" y="570" font-size="12.5" fill="#4A5060">带着反思重试；LATS 属进阶</text>
</svg>
</div>

<h2>走一遍真实场景</h2>
<div class="step"><div class="n">1</div><p>准备阶段：system 里写好文本协议（Thought / Action / Action Input / Final Answer 的输出格式说明书）和 user 的问题；TOOLS 表里登记两个工具。<span class="note">协议里的工具名清单从 TOOLS 自动生成，单一数据源，不会出现 prompt 与注册表不一致。</span></p></div>
<div class="step"><div class="n">2</div><p>调模型并用 parse_react 解析输出，只有三种归宿：final、action、malformed——循环的分支结构由它们决定。</p></div>
<div class="step"><div class="n">3</div><p>action 分支查 TOOLS 表执行工具：get_time 取真实时钟，calculator 只走白名单的四种运算。<span class="note">表达式来自模型输出、不可信，所以绝不 eval 任意字符串；AST 白名单之外一律报错。</span></p></div>
<div class="step"><div class="n">4</div><p>工具返回结果作为 Observation，以 user 消息拼回上下文；assistant 原话也一并保留，保证角色交替合法。<span class="note">这是 ReAct 的信任边界：模型下一轮能看到的，只有程序拼好的这些消息。</span></p></div>
<div class="step"><div class="n">5</div><p>出现 Final Answer 就带着轨迹和总成本退出；跑满 max_iter=5 轮还没结束，就强制停止并承认失败。<span class="note">steps 记录每一轮的行动留痕，事后评测和排错全靠它。</span></p></div>

<h2>值得记住的数字</h2>
<div class="grid">
  <div class="card"><div class="num">3 种范式<small>ReAct 边想边做、Plan-Execute 先计划后执行、Reflexion 反思重试；LATS 属进阶多路搜索，课程不实现</small></div></div>
  <div class="card"><div class="num">3 种归宿<small>parse_react 的输出只可能是 final / action / malformed，各走各的处理分支</small></div></div>
  <div class="card"><div class="num">max_iter = 5<small>默认安全阀：循环体没有天然终止条件，唯一的强制出口在程序层</small></div></div>
  <div class="card"><div class="num">4 种运算<small>_safe_eval 白名单只有加、减、乘、除；同一工具连败 3 次须按协议 Final Answer 止损</small></div></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
  <li>ReAct 是「怎么行动」的范式，和记忆、工具、规划这些「有什么能力」的组件是两层概念，互不绑定：一个 ReAct Agent 可以没有长期记忆，一个有记忆的 Agent 也未必是 ReAct。</li>
  <li>Observation 用 user 角色不用 tool 角色，是文本协议阶段的载体选择——Day 4 换成结构化 tool_calls 后它会变成专门的 tool 消息。角色怎么标是载体问题，Observation 由程序填是范式纪律。</li>
  <li>工具失败不抛异常而是把错误信息作为 Observation 回流：「error: …」回到模型眼里，让它自己决定修正还是止损；程序照常打印轨迹继续运行。</li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><b>Q：让模型顺手自己补一个 Observation，不就省了一次工具执行？</b><p>这会让循环变成自我催眠。Observation 是模型唯一的信息来源，一旦允许它自己写「工具返回了什么」，看起来合理的结果可能完全是编的；「世界真实发生了什么」只能来自程序执行。</p></div>
<div class="qa"><b>Q：模型多跑几轮会自觉停下来吗？</b><p>不可靠。只要输出里始终没有 Final Answer，就没有机制能让它主动停——比如工具坏了返回离谱结果时，模型没有理由怀疑，只会反复重试。拦住循环的是程序层的 max_iter，不是模型的自觉。</p></div>
<div class="qa"><b>Q：直接上 Reflexion 是不是更聪明？</b><p>要看任务有没有明确对错信号。代码、数学、有测试用例的生成才适合它；没有反馈信号的「反思」会退化成泛泛的自我解释，纠不了错。而且 Plan-Execute 的 Executor 单步也可以是 ReAct——三种范式并不互斥。</p></div>

<h2>深入入口</h2>
<p>对应文字版：Day 03《Agent 范式》，见课程 week1-reading/每日正文。原文附 190 行零框架的完整代码走读与 Loop 故障演练推演题；下一章将换载体——结构化 tool_calls 协议登场，但循环的形状不变。</p>

<div class="nav">
  <a href="13-day02-prompt.html">← Prompt 工程：把话说清楚</a>
  <a href="15-day04-tool-calling.html">工具调用 Tool Calling →</a>
</div>
<footer>三十天速成计划 · 图解小白版</footer>
</div></body></html>
`;export{t as default};
