const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#059669">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>15 · 工具调用 Tool Calling</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.75;color:#24292f;background:#fbfbfc;padding-bottom:56px}.wrap{max-width:760px;margin:0 auto;padding:0 20px}.crumb{font-size:13px;color:#8b95a1;padding:18px 0 0}.chip{display:inline-block;font-size:12px;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:1px 11px;margin-top:14px}.kicker{font-size:12px;letter-spacing:.12em;color:#a0aab6;margin-top:8px}h1{font-size:31px;line-height:1.28;color:#14181f;margin:8px 0 8px}.lede{color:#57606a;margin-bottom:8px}h2{font-size:21px;line-height:1.4;margin:38px 0 12px;padding-left:11px;border-left:4px solid var(--accent)}p{margin:0 0 12px}.note{color:#6e7781;font-size:14px}.card{background:#fff;border:1px solid #e4e8ee;border-radius:10px;padding:14px 16px;margin:12px 0}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px;margin:14px 0}.num{font-size:26px;font-weight:700;color:var(--accent);line-height:1.2}.lab{font-size:13px;color:#6e7781;margin-top:3px}ol.steps{padding-left:22px}ol.steps li{margin-bottom:12px}ul.tight{padding-left:22px}ul.tight li{margin-bottom:9px}.qa{background:#fff;border:1px solid #e4e8ee;border-radius:10px;padding:13px 16px;margin:11px 0}.qa b.q{color:var(--accent)}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.92em;background:#f0f3f6;border-radius:4px;padding:0 5px}nav.pager{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:40px}nav.pager a{flex:1;display:block;padding:11px 14px;border:1px solid #e0e4ea;border-radius:10px;background:#fff;text-decoration:none;color:var(--accent);font-size:15px;line-height:1.45}nav.pager a.next{text-align:right}nav.pager span{text-align:left}.dir{font-size:12px;color:#8b95a1;display:block}footer{margin-top:40px;border-top:1px solid #dde2e8;padding-top:16px;text-align:center;font-size:13px;color:#98a2ad}svg{width:100%;height:auto}</style>
</head>
<body>
<div class="wrap">
<div class="crumb">AI 应用开发工程师三十天速成计划 · Week 1 · Day 04–07 · 给想建立直觉的初学者</div>
<span class="chip">第 15 章 · 共 32 章</span>
<div class="kicker">速成计划 图解</div>
<h1>工具调用 Tool Calling</h1>
<p class="lede">Function Calling 让模型在需要外部信息时输出一份结构化的"我要调哪个工具、用什么参数"的请求，由程序真正执行，再把结果喂回模型——转一圈才算数。</p>

<h2>先打个比方</h2>
<p>像医院里医生开检查单：医生不开刀也不碰仪器，只在单子上写清楚"做什么检查、查什么部位"；真正抽血化验的是检验科，报告回给医生，医生据此下诊断。模型就是那个只写申请单的医生，程序是检验科。</p>

<h2>全景图解</h2>
<p>整个 Function Calling 就是一圈循环：<b>本体与规格分开存在</b>——程序里的真函数模型永远看不到，它能读到的只有那份 JSON 规格。</p>
<svg viewBox="0 0 720 400" role="img" aria-label="工具调用闭环示意">
<defs><marker id="d4-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0L8,4.5L0,9z" fill="#57606a"/></marker></defs>
<rect x="230" y="18" width="260" height="52" rx="10" fill="#ecfdf5" stroke="#059669"/><text x="360" y="39" text-anchor="middle" font-size="15" font-weight="bold" fill="#065f46">用户问题「上海今天适合带伞吗」</text><text x="360" y="59" text-anchor="middle" font-size="12" fill="#047857">messages 初始 = system + user</text>
<path d="M330,70 L300,110" stroke="#57606a" stroke-width="1.6" fill="none" marker-end="url(#d4-arrow)"/>
<rect x="185" y="112" width="250" height="66" rx="10" fill="#fff" stroke="#059669"/><text x="310" y="136" text-anchor="middle" font-size="14" font-weight="bold" fill="#14181f">模型读问题 + 工具清单</text><text x="310" y="156" text-anchor="middle" font-size="12" fill="#57606a">tools 作为调用参数单独传入，</text><text x="310" y="172" text-anchor="middle" font-size="12" fill="#57606a">不和消息混在一起</text>
<path d="M310,178 L310,214" stroke="#57606a" stroke-width="1.6" fill="none" marker-end="url(#d4-arrow)"/>
<rect x="150" y="216" width="320" height="46" rx="10" fill="#fefce8" stroke="#ca8a04"/><text x="310" y="237" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#713f12">模型输出结构化调用请求</text><text x="310" y="255" text-anchor="middle" font-size="12" font-family="monospace" fill="#713f12">weather_query({"city":"上海"})</text>
<path d="M212,254 L140,290" stroke="#57606a" stroke-width="1.6" fill="none" marker-end="url(#d4-arrow)"/>
<rect x="24" y="288" width="196" height="86" rx="10" fill="#fff" stroke="#94a3b8"/><text x="122" y="312" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#334155">工具本体（真函数）</text><text x="122" y="332" text-anchor="middle" font-size="12" fill="#57606a">模型看不到，由程序执行</text><text x="122" y="350" text-anchor="middle" font-size="12" fill="#57606a">返回纯文本：</text><text x="122" y="366" text-anchor="middle" font-size="11.5" font-family="monospace" fill="#57606a">{condition:"雨", 22°C}</text>
<path d="M222,331 L500,331" stroke="#57606a" stroke-width="1.6" fill="none" marker-end="url(#d4-arrow)"/>
<text x="360" y="323" text-anchor="middle" font-size="11.5" fill="#047857">回填为 role:"tool" 消息（tool_call_id 配对）</text>
<rect x="500" y="296" width="200" height="72" rx="10" fill="#eff6ff" stroke="#2563eb"/><text x="600" y="320" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#1e40af">带着结果再调一次模型</text><text x="600" y="340" text-anchor="middle" font-size="12" fill="#374151">assistant(tool_calls) 与</text><text x="600" y="356" text-anchor="middle" font-size="12" fill="#374151">N 条 tool 消息一并进历史</text>
<path d="M600,294 C600,240 470,196 412,150" stroke="#57606a" stroke-width="1.6" fill="none" stroke-dasharray="5 4" marker-end="url(#d4-arrow)"/>
<text x="560" y="176" text-anchor="middle" font-size="12" fill="#047857">不再请求工具 → 输出最终答案「今天有雨，建议带伞」</text>
<rect x="508" y="130" width="184" height="46" rx="10" fill="#fff" stroke="#cbd5e1"/><text x="600" y="149" text-anchor="middle" font-size="12.5" font-weight="bold" fill="#334155">工具规格（JSON Schema）</text><text x="600" y="166" text-anchor="middle" font-size="11.5" fill="#6e7781">模型唯一能"看到"的东西</text>
</svg>

<h2>走一遍真实场景</h2>
<ol class="steps">
<li><b>模型读到问题与工具规格，决定需要天气信息。</b><span class="note">它会输出一条 <span class="mono">tool_calls</span> 请求，而不是直接编天气数据。</span></li>
<li><b>程序按名字把请求映射到真函数 <span class="mono">weather_query</span> 执行。</b><span class="note">名字必须和规格里的 name 一致，对不上执行环节就断了。</span></li>
<li><b>把执行结果作为 role:"tool" 消息回填进对话历史。</b><span class="note">用 <span class="mono">tool_call_id</span> 标明这条结果回应哪次请求；要几个请求回几条消息。</span></li>
<li><b>带着新消息再调一次模型。</b><span class="note">这次它看到了"雨"，综合出最终回答，不再请求工具，循环结束。</span></li>
</ol>

<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><div class="num">129 行</div><div class="lab">教学文件 openai_weather.py 一个文件走完整个闭环</div></div>
<div class="card"><div class="num">三大段</div><div class="lab">工具本体（19–37 行）→ 工具规格（40–65 行）→ 多轮闭环（68–116 行）</div></div>
<div class="card"><div class="num">N 对 N</div><div class="lab">N 个 tool_call 必须回 N 条 tool 消息，错误也要回</div></div>
<div class="card"><div class="num">temperature = 0</div><div class="lab">每圈封死随机性；max_tokens = 512 是每圈的硬顶</div></div>
</div>

<h2>再多懂一点</h2>
<ul class="tight">
<li><b>两份东西缺一不可。</b>"规格"是模型看得到的纯文本（name、description、parameters），"本体"是能跑的真函数。<span class="note">description 决定模型选不选得对：第一句写做什么，第二句写负例边界——"只用于天气相关问题，不要用它回答其他问题"。边界不写清，它连订机票都想调天气。</span></li>
<li><b>工具失败也是结果。</b>查不到的城市返回一句 <span class="mono">error: 没有 广州 的天气数据</span> 而不是抛异常；参数 JSON 解析失败同样回填一行错误文本。<span class="note">对话继续转下去，模型会基于错误信息调整——协议不因为一次坏参数而中断。</span></li>
<li><b>换厂商字段名变了，形状没变。</b>OpenAI 叫 <span class="mono">tool_calls</span>／role:"tool"；Anthropic 叫 <span class="mono">tool_use</span>／<span class="mono">tool_result</span>。<span class="note">但"请求 → 执行 → 回填 → 再调"的闭环一模一样——课程原话：循环长在协议上，不长在具体工具上。把假天气表换成真实 API，只改函数体，循环一行不动。</span></li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><p><b class="q">Q：模型会不会自己去上网查天气、跑代码？</b></p><p>A：不会。它从头到尾只生成文本——包括那份看起来像命令的调用请求。真正的执行权在你手里的程序这一侧，这带来两个直接好处：鉴权和审计都可以卡在执行层。</p></div>
<div class="qa"><p><b class="q">Q：为什么要把 assistant 消息连同 tool_calls 一起放回历史？丢掉不行吗？</b></p><p>A：不行，这是协议硬约束。下一轮模型必须看到"我上一轮请求过什么"，且 N 个请求对应 N 条 tool 消息，少一条服务端就报错或失去配对关系。</p></div>
<div class="qa"><p><b class="q">Q：质疑一下——把这个设计说成很安全，可它真能挡住风险吗？</b></p><p>A：它挡住的是"模型越权执行"：没有你的程序按下执行键，模型的任何调用请求都只是一段文字。但它挡不住另一类问题——工具描述写得含糊导致模型选错工具、传错参数。那部分风险要靠把 description 写清边界、在工具层再做权限校验来处理，两者不能互相替代。</p></div>

<h2>深入入口</h2>
<p>对应文字版：Day 04《工具调用》，见课程 week1-reading/每日正文。工具路由、参数校验分层、"模型作为安全边界"的权衡等更深的主题，见配套八股·04 工具调用。</p>

<nav class="pager"><a href="14-day03-agent-paradigm.html"><span class="dir">上一章</span>Agent 范式：从一次调用到循环</a><a class="next" href="16-day05-rag.html"><span class="dir">下一章</span>RAG 基础：先查资料再回答</a></nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{t as default};
