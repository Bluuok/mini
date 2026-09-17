const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#16A34A">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 24 章 · LangGraph 工作流编排 · 三十天速成计划 图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#F4FAF4;color:#232733;line-height:1.75;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.crumb{font-size:13.5px;color:#8A8F9E;margin-bottom:8px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:13px}
h1{font-size:34px;line-height:1.2;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:26px}
h2{font-size:22px;margin:36px 0 10px;padding-top:18px;border-top:1px solid #DCEFDA}
.card{background:#fff;border:2.5px solid #232733;border-radius:18px;box-shadow:6px 6px 0 rgba(35,39,51,.10);padding:20px;margin:20px 0}
.analogy{background:#fff;border-left:5px solid var(--accent);border-radius:6px 14px 14px 6px;box-shadow:0 2px 12px rgba(35,39,51,.07);padding:18px 22px;margin:18px 0}
.analogy p{font-size:16.5px;color:#3A3F4E}
.analogy .tag{font-weight:800;color:var(--accent);font-size:14px;letter-spacing:.15em}
.chip{display:inline-block;border:2.5px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 14px;font-weight:700;font-size:15px}
svg{width:100%;height:auto;display:block;margin:16px 0}
.caption{text-align:center;color:#5A6072;font-size:14.5px;margin-top:10px}
.walk .step{display:flex;gap:12px;margin:13px 0;align-items:flex-start}
.walk .n{flex:0 0 30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px}
.walk .step p{font-size:16.5px;color:#3A3F4E}
.walk .step p small{display:block;color:#8A8F9E;font-size:14px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin:16px 0}
.stat{background:#fff;border:2px solid var(--accent);border-radius:14px;padding:14px 12px;text-align:center}
.stat b{display:block;font-size:26px;color:var(--accent);font-weight:800;line-height:1.2}
.stat span{font-size:13.5px;color:#5A6072}
.more{padding-left:22px}
.more li{margin:9px 0;font-size:16.5px;color:#3A3F4E}
.faq dt{font-weight:800;font-size:16.5px;margin-top:14px;color:#232733}
.faq dt::before{content:'Q ';color:var(--accent)}
.faq dd{margin:4px 0 0 0;font-size:16px;color:#4A5060;padding-left:24px}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:46px;font-weight:700;font-size:16px;flex-wrap:wrap}
a{color:var(--accent)}
footer{margin-top:44px;color:#8A8F9E;font-size:14px;text-align:center}</style></head>
<body><div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 2 · 给想建立直觉的初学者</p>
<span class="chip">第 24 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>LangGraph 工作流编排</h1>
<p class="lede">同一个 Agent 反复做"先判断意图、再分支处理"，每次都靠 loop 临场决定，既不稳定也不好调试。工作流把这种反复出现的分支模式显式化为一张图：节点是步骤，边是流转，条件边按状态分支。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像客服中心的工单分派台：分派员只做一件事——听一句、判类别、打标签，工单沿既定路线流转到对口部门；各部门内部怎么处理各有一套章法。每一步去哪全在路线表上，谁也不会每接一单都临时开会商量。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 900 350" role="img" aria-label="StateGraph 流程图"><defs><marker id="m24-ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="20" y="140" width="130" height="80" rx="14" fill="#EAF6EB" stroke="#232733" stroke-width="2.5"/>
<text x="85" y="172" text-anchor="middle" font-size="13.5" font-weight="700">用户问题进来</text>
<text x="85" y="194" text-anchor="middle" font-size="11.5" fill="#5b6478">entry point</text>
<rect x="195" y="128" width="150" height="104" rx="14" fill="#fff" stroke="#16A34A" stroke-width="3"/>
<text x="270" y="157" text-anchor="middle" font-size="14.5" font-weight="700">router 节点</text>
<text x="270" y="180" text-anchor="middle" font-size="11.5" fill="#5b6478">关键词规则分类</text>
<text x="270" y="200" text-anchor="middle" font-size="11.5" fill="#4C8357">faq / calc / chat</text>
<text x="270" y="218" text-anchor="middle" font-size="11" fill="#B45F5F">不用 LLM 判边</text>
<rect x="395" y="128" width="155" height="104" rx="14" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="472" y="157" text-anchor="middle" font-size="14.5" font-weight="700">memory_recall</text>
<text x="472" y="180" text-anchor="middle" font-size="11.5" fill="#5b6478">复用 Day 11 双路召回</text>
<text x="472" y="200" text-anchor="middle" font-size="11.5" fill="#4C8357">命中截 200 字入 state</text>
<text x="472" y="218" text-anchor="middle" font-size="11" fill="#B45F5F">召回放在分叉之前</text>
<rect x="640" y="22" width="235" height="82" rx="14" fill="#fff" stroke="#16A34A" stroke-width="3"/>
<text x="757" y="48" text-anchor="middle" font-size="13.5" font-weight="700">faq 节点</text>
<text x="757" y="70" text-anchor="middle" font-size="11.5" fill="#5b6478">记忆拼进 system 作答</text>
<text x="757" y="90" text-anchor="middle" font-size="11.5" fill="#4C8357">temperature=0 稳定可引用</text>
<rect x="640" y="134" width="235" height="92" rx="14" fill="#fff" stroke="#16A34A" stroke-width="3"/>
<text x="757" y="160" text-anchor="middle" font-size="13.5" font-weight="700">calc 节点</text>
<text x="757" y="182" text-anchor="middle" font-size="11.5" fill="#5b6478">内嵌 Day 8 的 ReActLoop 跑工具</text>
<text x="757" y="202" text-anchor="middle" font-size="11.5" fill="#4C8357">max_iter 压到 5（默认 8）</text>
<text x="757" y="219" text-anchor="middle" font-size="11" fill="#B45F5F">图管路由，Loop 管推理</text>
<rect x="640" y="256" width="235" height="82" rx="14" fill="#fff" stroke="#16A34A" stroke-width="3"/>
<text x="757" y="282" text-anchor="middle" font-size="13.5" font-weight="700">chat 节点</text>
<text x="757" y="304" text-anchor="middle" font-size="11.5" fill="#5b6478">闲聊要一点温度</text>
<text x="757" y="324" text-anchor="middle" font-size="11.5" fill="#4C8357">temperature=0.7；unknown 也兜底到这</text>
<line x1="150" y1="180" x2="189" y2="180" stroke="#232733" stroke-width="3.5" marker-end="url(#m24-ar)"/>
<line x1="345" y1="180" x2="389" y2="180" stroke="#232733" stroke-width="3.5" marker-end="url(#m24-ar)"/>
<path d="M550,158 Q595,158 596,90 L634,68" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#m24-ar)"/>
<line x1="552" y1="180" x2="634" y2="180" stroke="#232733" stroke-width="3" marker-end="url(#m24-ar)"/>
<path d="M550,204 Q595,204 596,272 L634,294" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#m24-ar)"/>
<text x="585" y="52" text-anchor="end" font-size="11" fill="#4C8357">条件边：按 state.intent 查映射表</text>
</svg>
<p class="caption">三个处理节点殊途同归走到 END。State 在节点间传话、节点是纯函数、边是路由表——这就是图的全部心智模型。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>问题进来，入口是 router：三组关键词规则判出意图 faq / calc / chat，写进 state.intent 并往流水账 steps 记一行。<small>同一个输入永远走同一条边，错了改关键词就行；全部未命中落 chat。默认规则不产生 unknown——那是留给自定义分类器的出口。</small></p></div>
<div class="step"><span class="n">2</span><p>普通边到 memory_recall：一次调用同时查 KV 库与语义库，命中结果截到 200 字放进 state。<small>为什么放在分叉之前？FAQ 要用这些记忆——图的顺序由数据依赖决定，不是想当然排的。</small></p></div>
<div class="step"><span class="n">3</span><p>条件边按 state.intent 查映射表分发到对应处理节点；就算意图是图里不存在的 unknown，也兜底路由到 chat。<small>这就是"图永远不会因为非法意图而断"的保险丝。</small></p></div>
<div class="step"><span class="n">4</span><p>calc 节点里现造一个 ReActLoop 跑工具循环，轮数上限从默认 8 刻意压到 5。<small>子循环只是整张图的一步，不该在这一个节点里烧掉太多轮次——预算收敛的取舍。</small></p></div>
<div class="step"><span class="n">5</span><p>各节点把答案写进 state.answer 后沿边走到 END；调用 graph.invoke(state) 拿到的返回值是字典。<small>取答案要写 result["answer"] 而不是 result.answer——dataclass 被 invoke 序列化成 dict 返回。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>4 种</b><span>常用编排模式：Router / Map-Reduce / Loop / HITL</span></div>
<div class="stat"><b>3 + 1</b><span>三类意图路由，外加 unknown 兜底进 chat</span></div>
<div class="stat"><b>max_iter=5</b><span>calc 内嵌 Loop 的轮数预算（默认 8）</span></div>
<div class="stat"><b>0 / 0.7</b><span>FAQ 与闲聊各自选定的 temperature</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>工作流不替代 Loop：calc 节点里完整跑着 Day 8 的 ReActLoop。分工明确——图管粗粒度路由（走哪条路），Loop 管细粒度推理（路上怎么调工具），两者不互斥。</li>
<li>状态用 dataclass 而非 TypedDict：默认值、类型检查、slots 三条全占。intent 字段用 Literal 锁死合法值并留 unknown 兜底；TypedDict 少传一个字段会静默出错。</li>
<li>错误也是数据：节点的模型调用包在 try 里，异常被吞成"[FAQ 节点错误] …"放进 answer 沿 state 下传。图不会因为一个节点失败整条中断，还能靠 steps 的记账 trace 出问题在哪一步。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>直接让 LLM 判断走哪条边不是更聪明吗？规则的覆盖率明显低。</dt><dd>这里稳定性优先于覆盖率。LLM 判断是概率的：模型偶尔返回一个图里不存在的意图，条件边找不到目标节点，图当场断掉；且它付费、有延迟、难调试。正确姿势是规则保下限、LLM 补长尾，而 LLM 输出必须校验映射回合法节点集合，非法则兜底澄清。</dd>
<dt>什么时候不该上工作流？</dt><dd>单 Agent 加多工具能解决就别上。只有流程出现多阶段、条件路由、回环修复、人工审核这类反复模式时，画成图才换来清晰与可维护。</dd>
<dt>节点为什么必须是纯函数？顺手改个全局变量不行吗？</dt><dd>纯函数意味着所有输入输出都走 state：可测、可复现、可回放。一旦藏了副作用，图的行为就取决于执行历史而非结构本身，前面"显式化"换来的可控性就白给了。</dd>
</dl>

<h2>深入入口</h2>
<p>对应文字版：Day 13《工作流编排（LangGraph）》，见课程 week2-reading/每日正文。想继续钻研工作流拓扑模式、循环图终止条件、子图与 Loop 边界等话题，原文末尾给了延伸指路。</p>

<nav class="nav">
<a href="23-day12-context-compress.html">上一章：Context 压缩：保留重点 ←</a>
<a href="25-day14-subagent.html">下一章：Subagent 子任务隔离 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版 · 24 / 32</footer>
</div></body></html>
`;export{t as default};
