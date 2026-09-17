const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#CA8A04">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>17 · 框架对比：各自解决什么问题</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.75;color:#24292f;background:#fbfbfc;padding-bottom:56px}.wrap{max-width:760px;margin:0 auto;padding:0 20px}.crumb{font-size:13px;color:#8b95a1;padding:18px 0 0}.chip{display:inline-block;font-size:12px;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:1px 11px;margin-top:14px}.kicker{font-size:12px;letter-spacing:.12em;color:#a0aab6;margin-top:8px}h1{font-size:31px;line-height:1.28;color:#14181f;margin:8px 0 8px}.lede{color:#57606a;margin-bottom:8px}h2{font-size:21px;line-height:1.4;margin:38px 0 12px;padding-left:11px;border-left:4px solid var(--accent)}p{margin:0 0 12px}.note{color:#6e7781;font-size:14px}.card{background:#fff;border:1px solid #e4e8ee;border-radius:10px;padding:14px 16px;margin:12px 0}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px;margin:14px 0}.num{font-size:26px;font-weight:700;color:var(--accent);line-height:1.2}.lab{font-size:13px;color:#6e7781;margin-top:3px}ol.steps{padding-left:22px}ol.steps li{margin-bottom:12px}ul.tight{padding-left:22px}ul.tight li{margin-bottom:9px}.qa{background:#fff;border:1px solid #e4e8ee;border-radius:10px;padding:13px 16px;margin:11px 0}.qa b.q{color:var(--accent)}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.92em;background:#f0f3f6;border-radius:4px;padding:0 5px}nav.pager{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:40px}nav.pager a{flex:1;display:block;padding:11px 14px;border:1px solid #e0e4ea;border-radius:10px;background:#fff;text-decoration:none;color:var(--accent);font-size:15px;line-height:1.45}nav.pager a.next{text-align:right}nav.pager span{text-align:left}.dir{font-size:12px;color:#8b95a1;display:block}footer{margin-top:40px;border-top:1px solid #dde2e8;padding-top:16px;text-align:center;font-size:13px;color:#98a2ad}svg{width:100%;height:auto}table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e4e8ee;border-radius:10px;overflow:hidden;font-size:14.5px;margin:12px 0}th,td{padding:9px 10px;text-align:left;border-bottom:1px solid #edf0f3;vertical-align:top}th{background:#fafbfc;font-size:13px;color:#57606a}tr:last-child td{border-bottom:none}</style>
</head>
<body>
<div class="wrap">
<div class="crumb">AI 应用开发工程师三十天速成计划 · Week 1 · Day 04–07 · 给想建立直觉的初学者</div>
<span class="chip">第 17 章 · 共 32 章</span>
<div class="kicker">速成计划 图解</div>
<h1>框架对比：各自解决什么问题</h1>
<p class="lede">Agent 框架帮你组织模型调用、工具注册、状态流转、记忆检索这些工程事务——它不让模型更聪明。选型不是选 star 数，而是选"替你做了什么、藏起了什么"的抽象层。</p>

<h2>先打个比方</h2>
<p>像装修选全包、半包还是清包：包得越多，越快住进去；可一旦墙里水管出了问题，查起来也最费劲。封装和透明度是一枚硬币的两面，先想清楚自己要哪一面。</p>

<h2>全景图解</h2>
<p>把同一件事"判断某城市某天是否适合户外活动"放到不同抽象层做，任务不变，变的是你能看到什么、控制什么。</p>
<svg viewBox="0 0 720 380" role="img" aria-label="Agent 框架抽象层对比示意">
<defs><marker id="d6-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0L8,4.5L0,9z" fill="#94a3b8"/></marker></defs>
<line x1="60" y1="330" x2="668" y2="330" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#d6-arrow)"/>
<text x="64" y="352" font-size="12.5" fill="#57606a">← 全透明，脚手架自己补</text>
<text x="668" y="352" text-anchor="end" font-size="12.5" fill="#57606a">封装多，上手快但中间过程不透明 →</text>
<rect x="24" y="70" width="118" height="200" rx="10" fill="#ecfdf5" stroke="#059669"/><text x="83" y="98" text-anchor="middle" font-size="14" font-weight="bold" fill="#065f46">纯 SDK</text><text x="83" y="120" text-anchor="middle" font-size="11.5" fill="#374151">messages + 工具调用</text><text x="83" y="142" text-anchor="middle" font-size="11.5" fill="#374151">什么都不替你做</text><text x="83" y="164" text-anchor="middle" font-size="11.5" fill="#374151">每一步都看得见</text><text x="83" y="196" text-anchor="middle" font-size="11" fill="#047857">Week 1 自写代码、</text><text x="83" y="212" text-anchor="middle" font-size="11" fill="#047857">llm.py 的 call_model</text><text x="83" y="236" text-anchor="middle" font-size="11" fill="#047857">就是这一层的实例</text>
<rect x="158" y="40" width="126" height="230" rx="10" fill="#fefce8" stroke="#ca8a04"/><text x="221" y="68" text-anchor="middle" font-size="14" font-weight="bold" fill="#713f12">LangChain</text><text x="221" y="90" text-anchor="middle" font-size="11.5" fill="#374151">组件拼装链</text><text x="221" y="108" text-anchor="middle" font-size="11.5" fill="#374151">+ AgentExecutor</text><text x="221" y="130" text-anchor="middle" font-size="11.5" fill="#374151">LLM/工具/检索串成链，</text><text x="221" y="146" text-anchor="middle" font-size="11.5" fill="#374151">循环被写成标准形状</text><text x="221" y="172" text-anchor="middle" font-size="11" fill="#854d0e">适合：单一工具循环的</text><text x="221" y="188" text-anchor="middle" font-size="11" fill="#854d0e">标准工具 Agent</text><text x="221" y="214" text-anchor="middle" font-size="11" fill="#854d0e">你只能换循环里的零件，</text><text x="221" y="230" text-anchor="middle" font-size="11" fill="#854d0e">改不了循环本身</text>
<rect x="300" y="56" width="126" height="214" rx="10" fill="#eff6ff" stroke="#2563eb"/><text x="363" y="84" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e3a8a">LangGraph</text><text x="363" y="106" text-anchor="middle" font-size="11.5" fill="#374151">图编排：节点/边/状态</text><text x="363" y="124" text-anchor="middle" font-size="11.5" fill="#374151">流程本身变成数据</text><text x="363" y="146" text-anchor="middle" font-size="11.5" fill="#374151">条件边按状态分支；</text><text x="363" y="162" text-anchor="middle" font-size="11.5" fill="#374151">人机审核节点一等公民</text><text x="363" y="188" text-anchor="middle" font-size="11" fill="#1d4ed8">适合：多阶段流水线、</text><text x="363" y="204" text-anchor="middle" font-size="11" fill="#1d4ed8">条件路由、回环修复</text><text x="363" y="228" text-anchor="middle" font-size="11" fill="#1d4ed8">代价：要先定义好状态</text>
<rect x="442" y="26" width="126" height="244" rx="10" fill="#fdf4ff" stroke="#a21caf"/><text x="505" y="54" text-anchor="middle" font-size="14" font-weight="bold" fill="#701a75">LlamaIndex</text><text x="505" y="76" text-anchor="middle" font-size="11.5" fill="#374151">数据索引 + 检索</text><text x="505" y="96" text-anchor="middle" font-size="11.5" fill="#374151">偏 RAG 不偏通用 Agent</text><text x="505" y="116" text-anchor="middle" font-size="11.5" fill="#374151">强项：文档解析、索引、</text><text x="505" y="132" text-anchor="middle" font-size="11.5" fill="#374151">检索、知识增强</text><text x="505" y="158" text-anchor="middle" font-size="11" fill="#86198f">适合：企业知识库、</text><text x="505" y="174" text-anchor="middle" font-size="11" fill="#86198f">文档问答</text><text x="505" y="198" text-anchor="middle" font-size="11" fill="#86198f">复杂 Agent Loop 或</text><text x="505" y="214" text-anchor="middle" font-size="11" fill="#86198f">多 agent 协作未必首选</text>
<rect x="584" y="42" width="118" height="228" rx="10" fill="#f8fafc" stroke="#64748b"/><text x="643" y="70" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#334155">AutoGen ＋</text><text x="643" y="88" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#334155">Coze / Dify</text><text x="643" y="112" text-anchor="middle" font-size="11.5" fill="#374151">多 agent 对话 /</text><text x="643" y="128" text-anchor="middle" font-size="11.5" fill="#374151">低代码拖拽</text><text x="643" y="152" text-anchor="middle" font-size="11.5" fill="#374151">角色分工出 demo 快</text><text x="643" y="176" text-anchor="middle" font-size="11" fill="#475569">多 agent 不是默认选项：</text><text x="643" y="192" text-anchor="middle" font-size="11" fill="#475569">拆角色必须换来隔离、</text><text x="643" y="208" text-anchor="middle" font-size="11" fill="#475569">并行、互审之一</text><text x="643" y="232" text-anchor="middle" font-size="11" fill="#475569">低代码可控性、版本化</text><text x="643" y="248" text-anchor="middle" font-size="11" fill="#475569">和评测通常弱于代码项目</text>
<rect x="180" y="292" width="360" height="26" rx="13" fill="#fffbeb" stroke="#ca8a04"/><text x="360" y="310" text-anchor="middle" font-size="12" fill="#713f12">坐标系两端：自写的 ReActLoop（Day 8）与纯 SDK 的 call_model（Day 1），所有框架都落在其间</text>
</svg>

<h2>走一遍真实场景</h2>
<p>任务：内部知识库问答机器人（检索 + 回答，回答必须标注来源）。用本篇的方法走一遍判断流程：</p>
<ol class="steps">
<li><b>先钉死任务形状。</b><span class="note">主语是"文档"而不是"流程"——数据索引 + 检索这行抽象最接近任务本来面目。</span></li>
<li><b>对框架抽象找匹配。</b><span class="note">指向 LlamaIndex 一类 RAG 框架；流程是单次问答、没有分支回环，所以不需要图编排。</span></li>
<li><b>约束自己补。</b><span class="note">"标注来源"是约束不是抽象——无论用哪个框架，检索结果和生成之间都要自己保留证据链（Day 5 的 retrieved chunks 就是它）。</span></li>
<li><b>得出结论并检查。</b><span class="note">"用 LlamaIndex 做检索 + 自己写几行生成"，而不是上一个全家桶。注意这不是标准答案，是判断过程本身。</span></li>
</ol>

<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><div class="num">6 个层次</div><div class="lab">纯 SDK / LangChain / LangGraph / LlamaIndex / AutoGen / 低代码——六种核心抽象各占一行</div></div>
<div class="card"><div class="num">2 个端点</div><div class="lab">call_model 与 ReActLoop 构成抽象层坐标系的两个实例</div></div>
<div class="card"><div class="num">3 个"能否"</div><div class="lab">数据能否导出？逻辑能否版本化？评测能否自动化？三个都是否 = 只配当 demo</div></div>
<div class="card"><div class="num">3 选 1</div><div class="lab">拆角色的门槛：换不来隔离、并行、互审中至少一种，就别拆</div></div>
</div>

<h2>再多懂一点</h2>
<ul class="tight">
<li><b>"用了框架 = 模型更强"是个错觉。</b>框架改的是工程组织，模型的能力边界一点没动。<span class="note">所以框架选错的症状不是"模型答错"，而是"流程跑不起来、状态对不上、问题难定位"。同理它也不替你负责权限、数据和评测设计。</span></li>
<li><b>接口稳定性要进选型清单。</b>框架迭代快、文档频繁改写，上个月学的 API 下个月可能换写法。<span class="note">越是关键系统，这栏权重越高——messages、tool_calls 这套底层反而不随框架变，这正是"先有底层证据"的价值。</span></li>
<li><b>给一条可执行的分界线。</b>学习与调试期自写循环（每一步可见）；标准工具 Agent 的快速交付用框架；强约束场景两者都要，但证据面必须自己留。<span class="note">检验懂没懂只问一句："它封装的是哪一段？"答不上来，说明还没看懂那两段自写代码，而不是框架太复杂。</span></li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><p><b class="q">Q：LangChain 和 LangGraph 到底怎么选？</b></p><p>A：看流程形状。单一工具循环（决策→调工具→回填→再决策）交给 LangChain 的 AgentExecutor 这类默认循环就够；需要条件路由、回环修复、人工审核节点时，这种"流程即数据"的任务才轮到 LangGraph 的图编排。</p></div>
<div class="qa"><p><b class="q">Q：star 数最高的框架是不是就是安全的选择？</b></p><p>A：star 数反映关注度和生态活跃度，不反映与你的任务形态的匹配度。选型要回答的问题是封闭的：我的流程需要分支吗？需要人机节点吗？需要审计吗？答案在任务里，不在排行榜里。</p></div>
<div class="qa"><p><b class="q">Q：质疑一下——先上全家桶省得以后迁移，这样想有问题吗？</b></p><p>A：有。全家桶意味着更多封装、更重的依赖、更长的消息路径，而出问题时证据仍要回到 messages、tool_calls、retrieved chunks 这些底层事实。而且每多一个角色都是一次次计费调用，token 成本随角色数成倍上涨。原文章的建议反过来：大部分任务先用单 agent + 多工具解决，够用就不升级。</p></div>

<h2>深入入口</h2>
<p>对应文字版：Day 06《Agent 框架对比》，见课程 week1-reading/每日正文。各框架在规划深度、验证、状态、错误恢复、成本等维度的系统对比，见配套八股·02 核心框架。</p>

<nav class="pager"><a href="16-day05-rag.html"><span class="dir">上一章</span>RAG 基础：先查资料再回答</a><a class="next" href="18-day07-prd.html"><span class="dir">下一章</span>项目选型与 PRD</a></nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{t as default};
