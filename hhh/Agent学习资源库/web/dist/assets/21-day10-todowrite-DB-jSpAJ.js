const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#9333EA">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第21章 · TodoWrite：计划与执行分离 · 三十天速成计划 图解</title>
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
footer{margin-top:40px;color:#8A8F9E;font-size:14px;text-align:center}
code{background:#F3EBFC;border-radius:6px;padding:0 6px;font-size:.92em}
</style></head>
<body><div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 2 · 给想建立直觉的初学者</p>
<span class="chip">第 21 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>TodoWrite：计划与执行分离</h1>
<p class="lede">Agent 跑着跑着容易忘掉最初目标，或做到一半草草收尾。TodoWrite 的解法是让模型把计划显式写成列表、放进上下文随时可见——注意它是软约束，不是任务管理器。</p>

<h2>先打个比方</h2>
<div class="card"><p>像灶台边挂着的一叠点菜单。它不替厨师决定先炒哪一盘——发现两道菜共用一锅底料，他完全可以换着做；但单子一直挂在眼前，做完一张划一张，快收档时一眼看出还欠哪几桌。划错了还能擦掉重新排队。</p></div>

<h2>全景图解</h2>
<div class="fig">
<svg viewBox="0 0 940 520" role="img" aria-label="TodoWrite 计划执行分离结构图">
<defs>
<marker id="m21a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 Z" fill="#9333EA"/></marker>
<marker id="m21b" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 Z" fill="#8A8F9E"/></marker>
</defs>
<g font-family="-apple-system,'PingFang SC','Microsoft YaHei',sans-serif">
<!-- ReAct loop column -->
<text x="132" y="52" text-anchor="middle" font-size="14" font-weight="700" fill="#9333EA">ReAct 循环（Day 08）</text>
<g font-size="14">
<rect x="36" y="72" width="192" height="62" rx="12" fill="#fff" stroke="#9333EA" stroke-width="2.5"/>
<text x="132" y="98" text-anchor="middle" font-weight="700">Reason 思考</text>
<text x="132" y="118" text-anchor="middle" font-size="11.5" fill="#5A6072">看得见当前列表再决定</text>
<rect x="36" y="182" width="192" height="62" rx="12" fill="#fff" stroke="#9333EA" stroke-width="2.5"/>
<text x="132" y="208" text-anchor="middle" font-weight="700">Act 行动</text>
<text x="132" y="228" text-anchor="middle" font-size="11.5" fill="#5A6072">todo_write 是普通工具之一</text>
<rect x="36" y="292" width="192" height="62" rx="12" fill="#fff" stroke="#9333EA" stroke-width="2.5"/>
<text x="132" y="318" text-anchor="middle" font-weight="700">Observe 观察</text>
<text x="132" y="338" text-anchor="middle" font-size="11.5" fill="#5A6072">读回进度快照</text>
</g>
<g stroke="#9333EA" stroke-width="2" fill="none" marker-end="url(#m21a)">
<path d="M132,134 V182"/>
<path d="M132,244 V292"/>
<path d="M228,354 H286 V116 Q286,103 274,103 H232 V103 H130 V75"/>
</g>
<text x="300" y="90" font-size="11.5" fill="#8A8F9E">循环继续</text>
<!-- todo_write tool -->
<g stroke="#9333EA" stroke-width="2" fill="none" marker-end="url(#m21a)">
<path d="M228,213 H296"/>
</g>
<rect x="296" y="164" width="236" height="100" rx="12" fill="#FAF5FE" stroke="#9333EA" stroke-width="2.5"/>
<text x="414" y="192" text-anchor="middle" font-size="15" font-weight="700">todo_write 工具</text>
<g font-size="12.5" fill="#333A48">
<text x="312" y="216">action = add / update / list</text>
<text x="312" y="238">status ∈ pending / in_progress / completed</text>
<text x="312" y="256" fill="#8A8F9E">schema 里没有 order 字段——结构上不支持硬约束</text>
</g>
<!-- state machine -->
<path d="M532,214 H586" stroke="#9333EA" stroke-width="2" fill="none" marker-end="url(#m21a)"/>
<rect x="586" y="66" width="330" height="196" rx="12" fill="#fff" stroke="#9333EA" stroke-width="2.5"/>
<text x="751" y="94" text-anchor="middle" font-size="15" font-weight="700" fill="#9333EA">TodoManager 状态机</text>
<g>
<ellipse cx="650" cy="150" rx="52" ry="26" fill="#EFF0F3" stroke="#5A6072" stroke-width="1.5"/>
<text x="650" y="155" text-anchor="middle" font-size="13" fill="#333A48">pending</text>
<ellipse cx="772" cy="150" rx="58" ry="26" fill="#EDE6FB" stroke="#9333EA" stroke-width="1.5"/>
<text x="772" y="155" text-anchor="middle" font-size="12.5" fill="#5B21B6">in_progress</text>
<ellipse cx="852" cy="226" rx="54" ry="26" fill="#EFF0F3" stroke="#5A6072" stroke-width="1.5"/>
<text x="852" y="231" text-anchor="middle" font-size="13" fill="#333A48">completed</text>
</g>
<g stroke="#9333EA" stroke-width="1.8" fill="none" marker-end="url(#m21a)">
<path d="M702,150 H714"/>
<path d="M802,168 Q838,180 850,202"/>
<path d="M800,240 Q720,210 706,166" stroke-dasharray="5 4"/>
</g>
<text x="600" y="188" font-size="11" fill="#8A8F9E">可回退 ↺</text>
<text x="751" y="45" text-anchor="middle" font-size="12" fill="#5A6072">软约束：不强制按序，update 只校验状态合法，从不检查顺序</text>
<!-- summary strip -->
<path d="M751,262 V330 H556 V368" stroke="#9333EA" stroke-width="2" fill="none" marker-end="url(#m21a)"/>
<rect x="250" y="368" width="656" height="110" rx="12" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="270" y="394" font-size="13.5" font-weight="700" fill="#9333EA">summary() 快照 —— 每次成功的 add/update 都拼在返回文本末尾：</text>
<g font-family="ui-monospace,Menlo,Consolas,monospace" font-size="13" fill="#333A48">
<text x="272" y="420">[ ] #1 读文件　　[&gt;] #2 统计行数　　[x] #3 返回结果</text>
<text x="272" y="444">进度: 1/3 完成, 1 进行中, 1 待办</text>
</g>
<text x="272" y="468" font-size="11.5" fill="#8A8F9E">空格=pending · &gt;=进行中 · x=完成；预览和操作共用同一套 #id 编号</text>
<!-- feedback arrow to Observe -->
<path d="M250,420 H156 V358" stroke="#9333EA" stroke-width="2" fill="none" marker-end="url(#m21a)"/>
</g>
</svg>
<p class="fn">闭环关键：模型无状态，「记忆」全靠回填上下文的文本。所以 todo_write 的每次返回都不只是「已更新 #1」，而是整张列表快照 + 进度统计——下一轮思考时它就摆在模型的眼前。</p>
</div>

<h2>走一遍真实场景</h2>
<ol class="walk">
<li><span class="n">1</span><div><p>接到多步任务「读文件并统计行数」，模型先调 todo_write(action=add) 登记三项计划：读文件 / 统计行数 / 返回结果。</p><small>id 由 manager 自增发号且只增不减——回退状态也不会让编号复用，每项身份唯一。</small></div></li>
<li><span class="n">2</span><div><p>动手前把 #1 标成 in_progress，然后才调别的工具去读文件。</p><small>推荐一次只标一个 in_progress（WIP=1），这是 system prompt 层的约定，不是代码锁死的。</small></div></li>
<li><span class="n">3</span><div><p>第 1 步完成，把 #1 标成 completed——返回文本末尾一定拼着整张列表快照和统计行「进度: 1/3 完成」。</p><small>summary 渲染成纯文本而非 JSON：省 token、一眼看懂。</small></div></li>
<li><span class="n">4</span><div><p>快照随 tool 消息回进上下文。下一轮思考时，模型看得见自己做到哪、还剩什么。</p><small>没有这一步，「显式化」就是空谈：Day 01 就讲过模型无状态，状态由调用方维护。</small></div></li>
<li><span class="n">5</span><div><p>三项全部 completed 才给出最终答案。中途若发现路线不对，可以把项改回 pending 重排。</p><small>允许回退是设计决定：禁止回退＝禁止纠错，比硬把 completed 当终态诚实。</small></div></li>
</ol>

<h2>值得记住的数字</h2>
<div class="grid">
<div class="num"><b>约 170 行</b><span>todo.py 全文，按数据 → 状态机 → 工具声明 → 工厂函数四层组织</span></div>
<div class="num"><b>3 个状态</b><span>pending → in_progress → completed，允许回退到 pending</span></div>
<div class="num"><b>3 个 action</b><span>add / update / list，required 只有一个 action 字段</span></div>
<div class="num"><b>≈37%</b><span>实验中 WIP=1（同时只推进一项）的 Agent 完成率提升幅度（lecture-07）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li><b>manager 的持有者决定计划的寿命。</b>handler 是捕获 manager 实例的闭包，loop 每轮都在同一个 manager 上操作；如果 handler 内部现 new 一个，列表每轮清零，「显式化」立刻失效。</li>
<li><b>WIP=1 靠引导实现而非代码强制。</b>summary 只是如实计数几个 in_progress；约束靠 system prompt 引导，这和软约束哲学一脉相承——但注意力是有限资源，同时在推的项越多越容易哪件都没做完。</li>
<li><b>所有校验错误都走返回值不往外抛。</b>非法 action、缺参数、查无此项一律 ToolResult(ok=False) 带着明确错误信息回去；错误也不是终点，而是模型下一轮修正的输入——和 Day 09 一脉相承的自愈机制。</li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><p><b>问：TodoWrite 就是个任务管理器吧？</b></p><p>答：模块 docstring 第一句就在纠偏：不是。它不做调度、不决定下一个执行哪个工具，只做一件事——把规划显式化放进上下文。作用有三：抗中途忘目标、抗草草收尾、给用户进度可见性（第三个常被忽略：这份列表同样给人看）。</p></div>
<div class="qa"><p><b>问：干脆用硬约束按顺序执行，不是更稳吗？</b></p><p>答：会失去 ReAct 的灵活性。硬约束下模型即使发现第 1 步的结果能让第 3 步更好做也不能跳。这个选择写进了代码结构本身：连 input_schema 里都没有 order 之类的字段，「不强制」体现在没有那段顺序检查代码。</p></div>
<div class="qa"><p><b>问：content 不加格式约束，模型写一句抽象空话怎么办？</b></p><p>答：dataclass 层确实不拦——三个字段足够小，代码不为它建类型。「内容要具体到可验证的动作」靠使用层约定；这也是唯一要求使用者自律的地方：计划质量取决于你教模型怎么写待办。</p></div>

<h2>深入入口</h2>
<p class="entry">对应文字版：Day 10《TodoWrite 与计划-执行分离》，见课程 week2-reading/每日正文；文中含 todo.py 全部四层的逐段走读与课后习题。</p>

<nav class="nav">
<a href="20-day09-tools-exec.html">← 上一章：多工具注册与执行</a>
<a href="22-day11-memory.html">下一章：Memory：三层记忆 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div></body></html>
`;export{t as default};
