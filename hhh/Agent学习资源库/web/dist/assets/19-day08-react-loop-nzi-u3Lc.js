const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#1D4ED8">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第19章 · 从零写 ReAct Loop · 三十天速成计划 图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#F8FAFC;color:#232733;line-height:1.75;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 26px}
.crumb{font-size:13.5px;color:#8A8F9E;margin-bottom:14px}
.chip{display:inline-block;border:2.5px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 16px;font-weight:700;font-size:15px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:14px;margin-top:12px}
h1{font-size:32px;line-height:1.25;margin:8px 0 6px}
.lede{font-size:17.5px;color:#5A6072;margin-bottom:8px}
h2{font-size:22px;margin:32px 0 10px}
p.body{font-size:16.5px;color:#333A48;margin:8px 0}
.card{background:#fff;border:2px solid #232733;border-radius:14px;padding:16px 20px;margin:16px 0}
.fig{background:#fff;border:2px solid #232733;border-radius:14px;padding:12px;margin:16px 0}
.fn{font-size:13.5px;color:#8A8F9E;margin-top:6px}
svg{width:100%;height:auto;display:block}
.walk{list-style:none;margin:14px 0}
.walk li{display:flex;gap:12px;margin:14px 0;align-items:flex-start}
.walk .n{flex:0 0 30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px}
.walk p{font-size:16px;color:#333A48}
.walk small{display:block;color:#8A8F9E;font-size:13.5px;margin-top:2px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.num{background:#fff;border:2px solid #232733;border-radius:14px;padding:14px;text-align:center}
.num b{display:block;font-size:28px;color:var(--accent)}
.num span{font-size:13.5px;color:#5A6072}
.more{padding-left:22px}.more li{margin:8px 0;font-size:16px;color:#3A3F4E}
.qa{margin:14px 0;padding-left:16px;border-left:4px solid var(--accent)}
.qa b{color:var(--accent)}
.entry{color:#5A6072;font-size:16px}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:42px;font-weight:700;font-size:15.5px}
.nav span{color:#8A8F9E;font-weight:400}
footer{margin-top:40px;color:#8A8F9E;font-size:14px;text-align:center}
code{background:#EEF2FB;border-radius:6px;padding:0 6px;font-size:.92em}
</style></head>
<body><div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 2 · 给想建立直觉的初学者</p>
<span class="chip">第 19 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>从零写 ReAct Loop</h1>
<p class="lede">ReAct 说的是「边想边做」，而 Agent Loop 是把这套节奏写成程序的循环：调模型决定下一步、按它说的执行工具、把结果喂回去，直到三种终止信号之一触发。</p>

<h2>先打个比方</h2>
<div class="card"><p>像一名值班客服处理工单：看情况 → 动手查证 → 记录结果 → 再看情况，直到能给出答复为止。系统有两道保险：超时铃声响了不管办到哪里都必须停手（轮数上限）；客户中途来电取消也要立刻放下（主动中断）——且每一步动过什么、花了多少，都记在工作日志里。</p></div>

<h2>全景图解</h2>
<div class="fig">
<svg viewBox="0 0 940 540" role="img" aria-label="Agent Loop 结构图">
<defs>
<marker id="m19a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 Z" fill="#1D4ED8"/></marker>
</defs>
<g font-family="-apple-system,'PingFang SC','Microsoft YaHei',sans-serif">
<!-- messages panel -->
<rect x="24" y="64" width="204" height="436" rx="12" fill="#EFF4FE" stroke="#1D4ED8" stroke-width="2"/>
<text x="126" y="92" text-anchor="middle" font-size="15" font-weight="700" fill="#1D4ED8">messages</text>
<text x="126" y="112" text-anchor="middle" font-size="12" fill="#5A6072">唯一事实来源</text>
<g font-size="12.5" fill="#333A48">
<rect x="38" y="126" width="176" height="30" rx="6" fill="#fff" stroke="#C7D4F2"/><text x="126" y="145" text-anchor="middle">system 提示词</text>
<rect x="38" y="164" width="176" height="30" rx="6" fill="#fff" stroke="#C7D4F2"/><text x="126" y="183" text-anchor="middle">user 问题</text>
<rect x="38" y="202" width="176" height="30" rx="6" fill="#fff" stroke="#C7D4F2"/><text x="126" y="221" text-anchor="middle">assistant tool_calls</text>
<rect x="38" y="240" width="176" height="30" rx="6" fill="#fff" stroke="#C7D4F2"/><text x="126" y="259" text-anchor="middle">tool 结果</text>
<rect x="38" y="278" width="176" height="30" rx="6" fill="#fff" stroke="#C7D4F2"/><text x="126" y="297" text-anchor="middle">assistant tool_calls</text>
<rect x="38" y="316" width="176" height="30" rx="6" fill="#fff" stroke="#C7D4F2"/><text x="126" y="335" text-anchor="middle">tool 结果 ……</text>
</g>
<rect x="38" y="366" width="176" height="30" rx="6" fill="none" stroke="#8A8F9E" stroke-dasharray="4 4"/>
<text x="126" y="385" text-anchor="middle" font-size="12" fill="#8A8F9E">模型「记得什么」全靠这里累积</text>
<!-- main boxes -->
<rect x="272" y="64" width="250" height="76" rx="12" fill="#fff" stroke="#1D4ED8" stroke-width="2.5"/>
<text x="397" y="94" text-anchor="middle" font-size="15" font-weight="700">① 调模型 model call</text>
<text x="397" y="116" text-anchor="middle" font-size="12" fill="#5A6072">看消息列表，决定下一步</text>
<rect x="287" y="182" width="220" height="60" rx="12" fill="#fff" stroke="#1D4ED8" stroke-width="2.5"/>
<text x="397" y="218" text-anchor="middle" font-size="15" font-weight="700">它请求工具了吗？</text>
<rect x="272" y="288" width="250" height="76" rx="12" fill="#fff" stroke="#1D4ED8" stroke-width="2.5"/>
<text x="397" y="318" text-anchor="middle" font-size="15" font-weight="700">② 执行工具 tool executor</text>
<text x="397" y="340" text-anchor="middle" font-size="12" fill="#5A6072">按 tool registry 查表分发</text>
<rect x="272" y="410" width="250" height="70" rx="12" fill="#fff" stroke="#1D4ED8" stroke-width="2.5"/>
<text x="397" y="438" text-anchor="middle" font-size="15" font-weight="700">③ Observation 回填</text>
<text x="397" y="460" text-anchor="middle" font-size="12" fill="#5A6072">结果作为消息塞回列表</text>
<!-- exits -->
<g>
<rect x="610" y="88" width="306" height="68" rx="12" fill="#fff" stroke="#1D4ED8" stroke-width="2"/>
<text x="630" y="116" font-size="14.5" font-weight="700">出口 1 · final_answer</text>
<text x="630" y="138" font-size="12" fill="#5A6072">不再要工具 → 内容即最终答案</text>
<rect x="610" y="200" width="306" height="68" rx="12" fill="#fff" stroke="#1D4ED8" stroke-width="2"/>
<text x="630" y="228" font-size="14.5" font-weight="700">出口 2 · 达到 max_iter</text>
<text x="630" y="250" font-size="12" fill="#5A6072">默认 8 轮用完，强制止损</text>
<rect x="610" y="312" width="306" height="68" rx="12" fill="#fff" stroke="#1D4ED8" stroke-width="2"/>
<text x="630" y="340" font-size="14.5" font-weight="700">出口 3 · interrupted</text>
<text x="630" y="362" font-size="12" fill="#5A6072">每轮开始先问 interrupt 回调：要停吗？</text>
</g>
<!-- arrows -->
<g stroke="#1D4ED8" stroke-width="2" fill="none" marker-end="url(#m19a)">
<path d="M228,140 H250 V102 H272"/>
<path d="M397,140 V182"/>
<path d="M507,212 H558 V122 H610"/>
<path d="M397,242 V288"/>
<path d="M397,364 V410"/>
<path d="M272,445 H228"/>
<path d="M522,445 H582 V44 Q582,32 570,32 H392 Q380,32 380,44 V64"/>
<path d="M582,234 H610"/>
<path d="M582,346 H610" stroke-dasharray="5 4"/>
</g>
<g font-size="12" fill="#5A6072">
<text x="238" y="94" text-anchor="end">每轮读取</text>
<text x="410" y="168">请求了 ↓</text>
<text x="556" y="205">没请求 →</text>
<text x="594" y="226">满 8 轮</text>
<text x="594" y="338">喊停</text>
<text x="250" y="462">塞回去</text>
<text x="600" y="52" text-anchor="end">下一轮再来一遍</text>
</g>
<text x="470" y="524" text-anchor="middle" font-size="13" fill="#5A6072">Loop 在「消息列表」上反复转：调模型 → 执行工具 → 回填结果，三个出口决定何时停</text>
</g>
</svg>
<p class="fn">配套三个数据结构各管一段：ToolSpec（frozen，规格一旦注册不许改）｜ToolResult（ok=False 时 error 必填）｜AgentResult（answer + steps + stop_reason）。三样合起来就是循环内外的「契约」。</p>
</div>

<h2>走一遍真实场景</h2>
<ol class="walk">
<li><span class="n">1</span><div><p>用户说：「读这份文件并数有多少字。」此时 messages 里只有 system + user 两行。</p><small>模型没有记忆，「记得什么」取决于这份不断变长的列表累积了什么。</small></div></li>
<li><span class="n">2</span><div><p>第 1 轮：模型通过 tool_calls 协议请求 read_file → executor 查表执行 → 文件内容作为 tool 消息回填。</p><small>OpenAI 协议硬性规定：tool 消息必须紧跟对应的 assistant tool_calls 之后，否则下一次调用直接报错——这是新手最容易漏的一步。</small></div></li>
<li><span class="n">3</span><div><p>第 2 轮：模型看到内容，请求 count_chars → 得到 1234 → 回填。每一轮的 input/output token 数都记进 steps 账本。</p><small>要从 SDK 原始对象上读 tool_calls，靠的正是 Day 01 在 LLMResponse 里预留的 raw 字段。</small></div></li>
<li><span class="n">4</span><div><p>第 3 轮：模型不再请求工具 → msg.content 就是最终答案，stop_reason = final_answer。</p><small>没有 tool_calls 时用 getattr 兜底成空列表，「模型不想调」和「服务商没回字段」两种情况一次判断覆盖。</small></div></li>
<li><span class="n">5</span><div><p>若任务卡住反复绕圈：第 8 轮撞上 max_iter 强制结束；用户中途取消则每轮开头的 interrupt 回调直接带空答案退出。</p><small>max_iter&lt;1 在构造时就抛 ValueError——参数错误入口拦截，宁可早崩不可带病运行。</small></div></li>
</ol>

<h2>值得记住的数字</h2>
<div class="grid">
<div class="num"><b>432 行</b><span>loop.py 全文，不依赖框架<br>纯 SDK 复用 Day 01 的 call_model</span></div>
<div class="num"><b>5 块</b><span>最小 Loop 组成：messages / tool registry / model call / tool executor / stop condition</span></div>
<div class="num"><b>8 轮</b><span>max_iter 默认值——够做几轮推理、又不至于烧太多 token 的经验安全阀</span></div>
<div class="num"><b>3 种</b><span>终止信号：final_answer / interrupted / 满 max_iter</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li><b>查不到工具不抛异常。</b>execute 落空时返回 ToolResult(ok=False, error="unknown tool")，这个错误会被当 observation 喂回模型，模型看到后自己换个正确的工具名——错误恢复从入口贯彻到出口。</li>
<li><b>temperature 默认 0.0，比 Day 01 的 0.2 更保守。</b>循环里每一轮决策都影响后续轮次，稳定性优先于多样性。</li>
<li><b>call_model_fn 是注入式的。</b>测试注入 mock 就不烧钱，生产用默认实现；thread_id 目前仅作 trace 标记，持久化要到后面接入 checkpointer 的那一天。</li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><p><b>问：工具报错会不会把整个程序打断？</b></p><p>答：不会。handler 层永远不向循环抛业务异常，一切失败都转成结构化的 ToolResult(ok=False) 返回，再变成 observation 喂给模型。错误不是终点，是下一轮修正的输入。</p></div>
<div class="qa"><p><b>问：这样一个自动循环会不会失控、无限烧钱？</b></p><p>答：它有三层刹车——interrupt 回调随时可叫停、max_iter 默认 8、steps 记录每轮 token 账本。但要诚实地说：安全阀还不够，还需要检测重复行为模式、设置成本上限，并给模型「放弃」的选项，这是本章课后留的关键判断题。</p></div>
<div class="qa"><p><b>问：对话越滚越长怎么办？</b></p><p>答：本篇明确不做压缩与持久化——docstring 原话标注「本 Day 不做持久化」。上下文管理是后面的章节专门解决的问题，先把循环本身跑通。</p></div>

<h2>深入入口</h2>
<p class="entry">对应文字版：Day 08《Agent Loop：让 ReAct 真正跑起来的循环》，见课程 week2-reading/每日正文；文中含 loop.py 全部 432 行的逐段走读与课后习题。</p>

<nav class="nav">
<a href="18-day07-prd.html">← 上一章：项目选型与 PRD</a>
<a href="20-day09-tools-exec.html">下一章：多工具注册与执行 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div></body></html>
`;export{t as default};
