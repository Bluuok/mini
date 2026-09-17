const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#65A30D">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>28 · MCP 协议</title>
<style>
body{margin:0;background:#f7f9f3;color:#1a2114;line-height:1.8;font-size:17px;
  font-family:-apple-system,"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif;}
.wrap{max-width:860px;margin:0 auto;padding:30px 20px 54px}
.crumb{font-size:13px;color:#7f8a72}
.chip{display:inline-block;border:1.5px solid var(--accent);color:var(--accent);
  border-radius:999px;padding:2px 13px;font-size:13px;font-weight:600;margin-top:14px}
.kicker{display:block;letter-spacing:.22em;font-size:12px;color:#a3ac93;margin-top:6px}
h1{font-size:30px;line-height:1.35;margin:.35em 0 .2em;color:#121609}
.lede{color:#454f38;font-size:17px}
section{margin-top:38px}
h2{font-size:21px;margin:0 0 12px;padding-left:11px;border-left:4px solid var(--accent);line-height:1.4}
.fyi{background:#eff5e2;border:1px solid #d8e6ba;border-radius:14px;padding:14px 18px;color:#3d4a25}
p{margin:.5em 0}
figure{margin:0;background:#fff;border:1px solid #e0e6d4;border-radius:16px;padding:18px 14px}
figcaption{font-size:14px;color:#7f8a72;padding:10px 8px 2px;line-height:1.7}
svg{width:100%;height:auto;display:block}
ol.steps{padding-left:22px;margin:0}
ol.steps li{margin:12px 0}
.small{font-size:14px;color:#7f8a72}
.stats{display:flex;gap:12px;flex-wrap:wrap}
.stat{flex:1 1 160px;background:#fff;border:1px solid #e0e6d4;border-radius:14px;padding:14px 16px}
.stat b{display:block;font-size:26px;color:var(--accent);line-height:1.2}
.stat span{font-size:14px;color:#4b5540}
ul.plus{padding-left:20px;margin:0}
ul.plus li{margin:10px 0}
.qa{background:#fff;border:1px solid #e0e6d4;border-radius:14px;padding:14px 18px;margin:12px 0}
.qa .q{font-weight:700;color:#2d3520;margin:0}
.entry{background:#fff;border:1px dashed #bfc9ab;border-radius:14px;padding:14px 18px;color:#4b5540}
.pager{display:flex;justify-content:space-between;gap:14px;margin-top:46px}
.pager a{color:var(--accent);font-weight:600;text-decoration:none;border-bottom:1px solid currentColor}
footer{margin-top:40px;text-align:center;font-size:13px;color:#a3ac93}
@media(max-width:560px){body{font-size:16px}.stats{flex-direction:column}}
</style>
</head>
<body>
<div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 3 · 给想建立直觉的初学者</p>
<span class="chip">第 28 章 · 共 32 章</span>
<span class="kicker">速成计划 图解</span>

<h1>MCP 协议</h1>
<p class="lede">MCP（Model Context Protocol）是一个开放标准：规定 AI 应用和外部工具之间怎么通信，让外部工具能被 Agent 用统一协议发现和调用——不用每接一个服务就重写一套适配。</p>

<section id="metaphor">
<h2>先打个比方</h2>
<div class="fyi">原文说得直白：MCP 像 AI 侧的 USB-C。外设厂商不必关心你的电脑是什么型号，只做一个标准接口；电脑这边也不用为每台设备单独设计一套对接电路——线一插，设备先报家门，再用。MCP 让外部工具同理：server 按统一协议自我介绍，Agent 有一个标准客户端就够。</div>
</section>

<section id="map">
<h2>全景图解</h2>
<figure>
<svg viewBox="0 0 920 540" role="img" aria-label="MCP 的 Host、Client、Server 三层结构">
<defs>
<marker id="d28-ar" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#65A30D"/></marker>
<marker id="d28-ab" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#57534e"/></marker>
</defs>
<rect x="42" y="118" width="230" height="200" rx="14" fill="#f4f8ee" stroke="#3f4a2c" stroke-width="2"/>
<text x="157" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#121609">Host</text>
<text x="157" y="178" text-anchor="middle" font-size="13" fill="#454f38">管理会话、调模型、</text>
<text x="157" y="198" text-anchor="middle" font-size="13" fill="#454f38">把工具结果回填</text>
<text x="157" y="228" text-anchor="middle" font-size="12.5" fill="#7f8a72">例：ReActLoop</text>
<text x="157" y="264" text-anchor="middle" font-size="12" fill="#7f8a72">只见过 ToolRegistry</text>
<text x="157" y="284" text-anchor="middle" font-size="12" fill="#7f8a72">完全不知道 MCP 存在</text>
<rect x="350" y="118" width="230" height="200" rx="14" fill="#fff" stroke="#65A30D" stroke-width="2.5"/>
<text x="465" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#3f6212">Client（适配层）</text>
<text x="465" y="178" text-anchor="middle" font-size="13" fill="#3d4a25">mcp_adapter.py：</text>
<text x="465" y="200" text-anchor="middle" font-size="13" fill="#3d4a25">① 发现 list_tools()</text>
<text x="465" y="222" text-anchor="middle" font-size="13" fill="#3d4a25">② 调用 call_tool()</text>
<text x="465" y="244" text-anchor="middle" font-size="13" fill="#3d4a25">③ 结果归一 normalize</text>
<text x="465" y="276" text-anchor="middle" font-size="12" fill="#7f8a72">任意形状进，ToolResult 一种形状出</text>
<rect x="652" y="118" width="232" height="200" rx="14" fill="#f4f8ee" stroke="#3f4a2c" stroke-width="2"/>
<text x="768" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#121609">MCP Server</text>
<text x="768" y="176" text-anchor="middle" font-size="13" fill="#454f38">暴露工具，执行具体能力</text>
<text x="768" y="198" text-anchor="middle" font-size="13" fill="#454f38">可能是另一台机器、另一种语言</text>
<text x="768" y="228" text-anchor="middle" font-size="12.5" fill="#7f8a72">例：diagnosis_tools.py</text>
<text x="768" y="248" text-anchor="middle" font-size="12.5" fill="#7f8a72">query_metric ＋ search_sop</text>
<text x="768" y="274" text-anchor="middle" font-size="12" fill="#7f8a72">异常不抛出，转结构化错误</text>
<path d="M280,180 H342" stroke="#65A30D" stroke-width="2.5" marker-end="url(#d28-ar)"/>
<text x="465" y="352" text-anchor="middle" font-size="12.5" fill="#57534e">Host 与 Server 之间隔着传输层：stdio（本地子进程）或 HTTP（远程服务）——</text>
<text x="465" y="374" text-anchor="middle" font-size="12.5" fill="#57534e">server 跑在哪、用什么语言写，Host 都不关心，只认协议</text>
<rect x="120" y="410" width="200" height="58" rx="10" fill="#fbfdf8" stroke="#c6d3a4"/>
<text x="220" y="434" text-anchor="middle" font-size="13" fill="#3d4a25">GitHub 类 Server</text>
<text x="220" y="454" text-anchor="middle" font-size="12" fill="#7f8a72">按同一协议暴露工具</text>
<rect x="364" y="410" width="200" height="58" rx="10" fill="#fbfdf8" stroke="#c6d3a4"/>
<text x="464" y="434" text-anchor="middle" font-size="13" fill="#3d4a25">数据库类 Server</text>
<text x="464" y="454" text-anchor="middle" font-size="12" fill="#7f8a72">按同一协议暴露工具</text>
<rect x="608" y="410" width="200" height="58" rx="10" fill="#fbfdf8" stroke="#c6d3a4"/>
<text x="708" y="434" text-anchor="middle" font-size="13" fill="#3d4a25">文件系统类 Server</text>
<text x="708" y="454" text-anchor="middle" font-size="12" fill="#7f8a72">按同一协议暴露工具</text>
<path d="M220,402 C240,352 280,300 336,252" stroke="#a3ac93" stroke-width="1.8" stroke-dasharray="5 4" fill="none" marker-end="url(#d28-ab)"/>
<path d="M464,402 V330" stroke="#a3ac93" stroke-width="1.8" stroke-dasharray="5 4" fill="none"/>
<path d="M708,402 C690,352 650,300 592,252" stroke="#a3ac93" stroke-width="1.8" stroke-dasharray="5 4" fill="none" marker-end="url(#d28-ab)"/>
<text x="465" y="504" text-anchor="middle" font-size="13" fill="#57534e">没有 MCP：每接一个服务写一套适配，换一个 Agent 又重来一遍</text>
</svg>
<figcaption>三方分工：Host 调度循环，Client 做翻译与归一，Server 暴露并执行能力。发现、调用、结构化结果这三个动作收口在 Client 侧，主循环不膨胀。</figcaption>
</figure>
</section>

<section id="scene">
<h2>走一遍真实场景</h2>
<p>以课程里的进程内诊断 server 为例，看一次"发现—调用—回填"的完整往返。</p>
<ol class="steps">
<li><b>注册阶段</b>：adapter 调 server.list_tools()，拿回两份工具定义（query_metric、search_sop），每份都带名字、描述、JSON Schema 参数契约。<span class="small">description 是模型决定"什么时候用这个工具"的唯一依据。</span></li>
<li><b>映射进本地注册表</b>：每份定义转成本地 ToolSpec 注册进 ToolRegistry；本地名＝前缀＋远端名，防止多个 server 的同名工具互相覆盖。<span class="small">handler 内部仍传远端原始名——前缀只是本地命名空间的私事。</span></li>
<li><b>模型发起请求</b>：ReActLoop 请模型挑工具并生成参数，registry 按名字找到 handler。<span class="small">对 Loop 来说，MCP 工具和本地函数工具没区别。</span></li>
<li><b>远端执行</b>：handler 经 client.call_tool("query_metric", args) 到达 server，分发表派发到实现，返回结构化 dict（service/metric/value/status/evidence），例如 trade-order cpu=96% status=critical。<span class="small">server 只给结构化数据；异常也被捕获成结构化错误——错误也是模型能推理的数据。</span></li>
<li><b>归一回填</b>：normalize_tool_result 把任意形状的结果归一本地 ToolResult，回填进对话，模型基于它决定下一步。<span class="small">JSON 结构化返回才能被 Day 19 评测打分、Day 20 护栏判断。</span></li>
</ol>
</section>

<section id="numbers">
<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3</b><span>个角色：Host、Client、Server——调度、适配、暴露执行各司其职</span></div>
<div class="stat"><b>3</b><span>类能力：Tools、Resources、Prompts；本课程只实现 Tools 这个最小闭环</span></div>
<div class="stat"><b>2</b><span>份工具定义由教学 server 暴露：query_metric、search_sop</span></div>
<div class="stat"><b>2</b><span>个 Client 协议方法撑起一切：list_tools() 发现、call_tool() 调用</span></div>
</div>
</section>

<section id="more">
<h2>再多懂一点</h2>
<ul class="plus">
<li><b>MCP 与 Function Calling、ToolRegistry 不互斥也不替代</b>：模型用 Function Calling 表达"我要调工具"，工具用 MCP 暴露能力，ToolRegistry 在本地统一分发。三者在本课程的实现里同时在场，各自回答不同的问题。</li>
<li><b>工厂函数避开 Python 迟绑定陷阱</b>：循环里直接内联闭包，所有 handler 会一起指向最后一个工具名；make_mcp_tool_handler 把当前工具名作为参数传入，一次调用生成一个名字被钉死的独立闭包——一工厂、一闭包、一名。</li>
<li><b>工具描述里绝不能出现生产密钥和内网地址</b>：description 和 input_schema 是公开元数据，会随"发现"扩散到模型和日志；能写的是用途、参数类型与含义。这也呼应全局规矩——密钥永远只住在 .env。</li>
</ul>
</section>

<section id="qa">
<h2>常见疑问</h2>
<div class="qa"><p class="q">Q：都有了 Function Calling，MCP 是不是多余的？</p>
<p>A：不多余，两者不替代。Function Calling 解决的是模型侧的问题——模型怎么表达"我要调工具"；MCP 解决的是集成侧的问题——外部工具怎么被发现和调用；ToolRegistry 再在本地把两者接到一起。在本课程的实现里三者同时在场，各自回答不同层面的问题。</p>
</div>
<div class="qa"><p class="q">Q：教学版刻意不用官方 MCP SDK，学到的东西算真协议吗？会不会白学？</p>
<p>A：算，且这是刻意的取舍。实现只建模三个协议级思想：list_tools() 发现、call_tool() 调用、结构化错误；换来零依赖、可单测、逻辑透明。代价是 stdio/HTTP 传输层没做，留给 Week 4 接真实 SDK——届时 server 换掉、adapter 一行不改，上层无感，这恰好证明"协议变化封装在适配层"不是口号。</p></div>
<div class="qa"><p class="q">Q：把重启、删除这类危险操作也做成 MCP 工具，是不是效率更高？</p>
<p>A：不建议这样暴露给模型自动调用。工具一旦注册就可能被模型选中，危险动作需要经过 Day 20 的护栏与人工确认环节再执行，而不是躺在工具列表里等待某次推理波动。MCP Server 本身也不是 Agent——它只暴露能力和执行动作，自主协商任务是 Multi-agent 层的事。</p></div>
</section>

<section id="entry">
<h2>深入入口</h2>
<div class="entry">对应文字版：Day 17《MCP 协议》，见课程 week3-reading/每日正文。想继续往下：第 29 章《Multi-agent 诊断分工》讲任务分解后的协作。</div>
</section>

<nav class="pager">
<a href="27-day16-skill-system.html">上一章 · Skill 系统</a>
<a href="29-day18-multi-agent.html">下一章 · Multi-agent 诊断分工</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{t as default};
