const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#475569">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 25 章 · Subagent 子任务隔离 · 三十天速成计划 图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#F6F7F9;color:#232733;line-height:1.75;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.crumb{font-size:13.5px;color:#8A8F9E;margin-bottom:8px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:13px}
h1{font-size:34px;line-height:1.2;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:26px}
h2{font-size:22px;margin:36px 0 10px;padding-top:18px;border-top:1px solid #DFE3EA}
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
<span class="chip">第 25 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>Subagent 子任务隔离</h1>
<p class="lede">主 Agent 跑复杂任务时，读过的文件、搜过的代码全堆进主上下文，又挤又乱还干扰判断。子 Agent 把子任务装进独立上下文里跑完，只把结论摘要交回来。隔离靠的是四道机制，不是"多开几个"。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像总部把尽调分给三家中介所做专项调查：各家在自己所里翻材料、打电话、反复核对，草稿纸堆满自己桌子；交付时只交两页结论报告——总部既省地方，也不会被过程中的噪音带偏判断。但每开一家所都有成本：查个日期这种事自己去翻一眼就好。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 900 360" role="img" aria-label="主 Agent 派发三个子 Agent"><defs><marker id="m25-ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="20" y="120" width="160" height="130" rx="16" fill="#EEF1F5" stroke="#475569" stroke-width="3"/>
<text x="100" y="152" text-anchor="middle" font-size="15" font-weight="700">主 Agent</text>
<text x="100" y="176" text-anchor="middle" font-size="11.5" fill="#5b6478">持有完整工具表</text>
<text x="100" y="196" text-anchor="middle" font-size="11.5" fill="#5b6478">派发器决定发什么</text>
<text x="100" y="222" text-anchor="middle" font-size="11" fill="#55607A">最后只看摘要做综合</text>
<rect x="300" y="20" width="290" height="88" rx="14" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="445" y="47" text-anchor="middle" font-size="13.5" font-weight="700">子 Agent A · 独立 messages[]</text>
<text x="445" y="69" text-anchor="middle" font-size="11.5" fill="#5b6478">上下文 = system ＋ 一行任务描述</text>
<text x="445" y="90" text-anchor="middle" font-size="11" fill="#55607A">工具白名单里的那几个，别无其他</text>
<rect x="300" y="140" width="290" height="88" rx="14" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="445" y="167" text-anchor="middle" font-size="13.5" font-weight="700">子 Agent B · 独立 messages[]</text>
<text x="445" y="189" text-anchor="middle" font-size="11.5" fill="#5b6478">现场 new 的全新 ReActLoop</text>
<text x="445" y="210" text-anchor="middle" font-size="11" fill="#55607A">看不到 A 与主对话的任何历史</text>
<rect x="300" y="260" width="290" height="88" rx="14" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="445" y="287" text-anchor="middle" font-size="13.5" font-weight="700">子 Agent C · 独立 messages[]</text>
<text x="445" y="309" text-anchor="middle" font-size="11.5" fill="#5b6478">读文档 → 在自己的上下文推理</text>
<text x="445" y="330" text-anchor="middle" font-size="11" fill="#55607A">跑完整个 trace 就地丢弃</text>
<path d="M180,150 L292,74" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#m25-ar)"/>
<path d="M184,185 L292,184" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#m25-ar)"/>
<path d="M180,220 L292,294" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#m25-ar)"/>
<text x="240" y="118" text-anchor="middle" font-size="11" fill="#55607A">派发：任务＋工具子集</text>
<rect x="700" y="52" width="180" height="96" rx="14" fill="#EEF1F5" stroke="#475569" stroke-width="3"/>
<text x="790" y="80" text-anchor="middle" font-size="13" font-weight="700">synthesize 综合</text>
<text x="790" y="102" text-anchor="middle" font-size="11.5" fill="#5b6478">只要摘要，不要过程</text>
<text x="790" y="122" text-anchor="middle" font-size="11" fill="#55607A">temperature=0 稳定作答</text>
<text x="790" y="140" text-anchor="middle" font-size="11" fill="#B45F5F">失败任务直接过滤</text>
<line x1="598" y1="64" x2="692" y2="84" stroke="#475569" stroke-width="3" marker-end="url(#m25-ar)"/>
<line x1="598" y1="184" x2="692" y2="128" stroke="#475569" stroke-width="3" marker-end="url(#m25-ar)"/>
<line x1="598" y1="304" x2="692" y2="146" stroke="#475569" stroke-width="3" marker-end="url(#m25-ar)"/>
<text x="672" y="110" text-anchor="middle" font-size="11" fill="#55607A">≤200 字摘要</text>
</svg>
<p class="caption">隔离三道闸门依次落下：每次现场 new 独立循环（独立 messages）、只发工具子集（最小权限）、只收 SubAgentResult 摘要（完整 trace 无处安放）。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>任务："读三篇文档并总结共同主题"。主 Agent 给每个子任务一行描述："读取文档 X，用 200 字总结其核心内容"。<small>受限上下文：这就是子 Agent 全部的输入——主对话历史一个字都不传。</small></p></div>
<div class="step"><span class="n">2</span><p>每次 dispatch 现场 new 一个全新的 ReActLoop，messages[] 从空开始。<small>复用共享 loop 会把上一个子任务的中间过程漏给下一个——隔离必须结构上保证，不靠模型自觉。</small></p></div>
<div class="step"><span class="n">3</span><p>工具白名单只含 read_file 和 count_chars；白名单外的工具在子注册表里根本不存在。<small>最小权限不是 prompt 里"提醒你别乱用"，而是想调也只有 unknown tool。</small></p></div>
<div class="step"><span class="n">4</span><p>子 Agent 在自己的上下文里读完、推完，只交出结果对象：任务、摘要、成败、步数。<small>每一步的思考与观测在返回前就被丢弃；撞上轮数上限也要以失败状态汇报，不静默吞掉。</small></p></div>
<div class="step"><span class="n">5</span><p>综合阶段把成功子任务的摘要拼给主模型（明令"只给结论"，temperature=0），产出最终答案。<small>主上下文自始至终只有"问题＋摘要"，没有过程——这正是不用 sub-agent 时三篇全文堆进来的反例。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>200 字</b><span>每个子 Agent 返回摘要的字数上限</span></div>
<div class="stat"><b>≤5 轮</b><span>单个子 Agent 循环上限（max_iter 默认 5）</span></div>
<div class="stat"><b>≥15 次</b><span>三个子 Agent 各跑满 5 轮的 LLM 调用开销下限</span></div>
<div class="stat"><b>2 个工具</b><span>读文档子 Agent 的白名单：read_file ＋ count_chars</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>本日名为并行实为顺序执行：隔离的收益不依赖真并发——上下文干净靠独立 loop 加摘要返回；asyncio 那套协程复杂度留到 Day 17 的 multi-agent 才引入，避免混淆主线。</li>
<li>典型适用场景是长文档分析、代码 review、并行检索这类复杂子任务。判断标准是任务复杂度（要不要多轮工具调用加推理），不是"想要隔离"本身。</li>
<li>派发器"持有"完整工具表不等于"会给出去"：allowed_tools 不传是显式选择继承全部，最小权限在派发那一刻才落地——权限应当在派发时确定，而不是跑起来再回收。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>把全部工具都发给子 Agent 不是更灵活？万一中途需要别的工具呢？</dt><dd>灵活正是要防的东西：拿全工具意味着没有最小权限，子 Agent 可能越权操作。正确做法是在派发时就看准任务需要什么——读文档的两个工具就够，权限缺口应该在规划阶段解决，而不是靠事后补救。</dd>
<dt>单次查个时间也开个 sub-agent 隔离一下，岂不是更干净？</dt><dd>恰恰相反，这叫性能崩：每一轮循环都是一次模型调用，一个子 Agent 跑 5 轮至少 5 次，三个就是 15 次——单次 get_time 直接调一次模型即可。为简单操作付这个成本，收益为零。</dd>
<dt>让子 Agent 把完整过程也传回来参考，信息不是更多吗？这有什么坏处？</dt><dd>坏处大于好处：过程中的噪音、试错、中间推理会全数灌进主上下文，和不用 sub-agent 时把全文堆进来没有本质区别，隔离等于白做。返回格式上干脆不给通道——结果对象里连 messages 字段都没有，想污染都无处安放。</dd>
</dl>

<h2>深入入口</h2>
<p>对应文字版：Day 14《Sub-agent 与子任务隔离》，见课程 week2-reading/每日正文。想继续钻研多 agent 协作模式、生成者 / 验证者分离、协调成本等话题，原文末尾给了延伸指路。</p>

<nav class="nav">
<a href="24-day13-langgraph.html">上一章：LangGraph 工作流编排 ←</a>
<a href="26-day15-harness.html">下一章：Harness 工程化整理 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版 · 25 / 32</footer>
</div></body></html>
`;export{t as default};
