const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#0891B2">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第20章 · 多工具注册与执行 · 三十天速成计划 图解</title>
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
code{background:#E6F4F8;border-radius:6px;padding:0 6px;font-size:.92em}
</style></head>
<body><div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 2 · 给想建立直觉的初学者</p>
<span class="chip">第 20 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>多工具注册与执行</h1>
<p class="lede">Day 08 的 loop 只会调一两个工具，真实 Agent 要调十几个。今天的答案是一张 dispatch map：加工具只是往注册表加一条，循环一行不改——而且不同工具风险不同，防护要分别治理。</p>

<h2>先打个比方</h2>
<div class="card"><p>像公司总机的接线员：接线员背不出每个部门的内线电话，只认一本分机通讯录。来电报名字、查表转接；没登记的号码一律礼貌回绝「查无此人」。以后新增部门，只需往通讯录里加一行，接线员本人大可不必重新培训。</p></div>

<h2>全景图解</h2>
<div class="fig">
<svg viewBox="0 0 940 520" role="img" aria-label="工具注册表分发结构图">
<defs>
<marker id="m20a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 Z" fill="#0891B2"/></marker>
<marker id="m20b" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 Z" fill="#8A8F9E"/></marker>
</defs>
<g font-family="-apple-system,'PingFang SC','Microsoft YaHei',sans-serif">
<!-- model -->
<rect x="24" y="64" width="200" height="88" rx="12" fill="#fff" stroke="#0891B2" stroke-width="2.5"/>
<text x="124" y="98" text-anchor="middle" font-size="15" font-weight="700">模型的请求</text>
<text x="124" y="122" text-anchor="middle" font-size="12" fill="#5A6072">「调 shell：cat notes.txt」</text>
<line x1="224" y1="108" x2="270" y2="108" stroke="#0891B2" stroke-width="2" marker-end="url(#m20a)"/>
<!-- registry -->
<rect x="272" y="44" width="352" height="212" rx="12" fill="#EFF8FB" stroke="#0891B2" stroke-width="2.5"/>
<text x="448" y="72" text-anchor="middle" font-size="15.5" font-weight="700" fill="#0891B2">ToolRegistry · dispatch map</text>
<g font-size="12.5" fill="#333A48">
<rect x="288" y="86" width="154" height="142" rx="8" fill="#fff" stroke="#BBDCE8"/>
<text x="365" y="106" text-anchor="middle" font-weight="700">_specs 字典</text>
<text x="298" y="128">名字 → 规格</text>
<text x="298" y="150">· description 说明</text>
<text x="298" y="172">· input_schema 参数面</text>
<text x="298" y="198" font-size="11.5" fill="#8A8F9E">发给模型的唯一依据</text>
<rect x="454" y="86" width="154" height="142" rx="8" fill="#fff" stroke="#BBDCE8"/>
<text x="531" y="106" text-anchor="middle" font-weight="700">_handlers 字典</text>
<text x="464" y="128">名字 → 执行函数</text>
<text x="464" y="150">收 arguments 字典</text>
<text x="464" y="172">返回 ToolResult</text>
<text x="464" y="198" font-size="11.5" fill="#8A8F9E">机器真正执行的代码</text>
</g>
<text x="448" y="248" text-anchor="middle" font-size="12.5" fill="#5A6072">register(spec, handler)：把两份按名字钉在一起</text>
<!-- banner -->
<rect x="664" y="64" width="252" height="126" rx="12" fill="#fff" stroke="#8A8F9E" stroke-dasharray="6 4" stroke-width="2"/>
<text x="790" y="100" text-anchor="middle" font-size="14.5" font-weight="700">要加第四个工具？</text>
<text x="790" y="126" text-anchor="middle" font-size="12.5" fill="#5A6072">写一对 make_spec / make_handler 工厂</text>
<text x="790" y="148" text-anchor="middle" font-size="12.5" fill="#5A6072">再 register 一次 ——</text>
<text x="790" y="170" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0891B2">循环代码一行不改</text>
<!-- unknown tool -->
<rect x="24" y="300" width="204" height="96" rx="12" fill="#fff" stroke="#8A8F9E" stroke-dasharray="6 4" stroke-width="2"/>
<text x="126" y="330" text-anchor="middle" font-size="13.5" font-weight="700" fill="#5A6072">未注册的名字？</text>
<text x="126" y="354" text-anchor="middle" font-size="12.5" fill="#8A8F9E">ok=False：unknown tool</text>
<text x="126" y="376" text-anchor="middle" font-size="11.5" fill="#8A8F9E">当 observation 喂回，不崩循环</text>
<path d="M272,348 H228" stroke="#8A8F9E" stroke-width="2" fill="none" marker-end="url(#m20b)"/>
<!-- three tools -->
<g font-size="12.5">
<rect x="264" y="360" width="188" height="140" rx="12" fill="#fff" stroke="#0891B2" stroke-width="2.5"/>
<text x="358" y="388" text-anchor="middle" font-size="15" font-weight="700">http_get</text>
<text x="358" y="408" text-anchor="middle" fill="#5A6072">只读网络 · 风险最低</text>
<text x="278" y="434">防护：</text>
<text x="278" y="454">· 协议白名单</text>
<text x="278" y="472">· 超时 10 秒</text>
<text x="278" y="490">· 结果截断 4000 字符</text>
<rect x="480" y="360" width="188" height="140" rx="12" fill="#fff" stroke="#0891B2" stroke-width="2.5"/>
<text x="574" y="388" text-anchor="middle" font-size="15" font-weight="700">grep_files</text>
<text x="574" y="408" text-anchor="middle" fill="#5A6072">只读本地文件</text>
<text x="494" y="434">防护：</text>
<text x="494" y="454">· work_dir 边界校验</text>
<text x="494" y="472">· max_matches 默认 50 条</text>
<text x="494" y="490">· 结果截断</text>
<rect x="700" y="360" width="216" height="140" rx="12" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="808" y="388" text-anchor="middle" font-size="15" font-weight="700">shell</text>
<text x="808" y="408" text-anchor="middle" fill="#5A6072">可执行命令 · 风险最高</text>
<text x="714" y="430">四道防线：</text>
<text x="714" y="450">① 白名单 ls/cat/wc/echo</text>
<text x="714" y="466">② 超时（默认 10 秒）</text>
<text x="714" y="482">③ cwd 锁定在工作目录内</text>
<text x="714" y="498">④ 输出超长即截断</text>
</g>
<g stroke="#0891B2" stroke-width="2" fill="none" marker-end="url(#m20a)">
<path d="M340,256 V310 H358 V360"/>
<path d="M448,256 V310 H574 V360"/>
<path d="M556,256 V310 H788 V360"/>
</g>
<text x="470" y="286" text-anchor="middle" font-size="12" fill="#5A6072">execute(名字) 查 _handlers 分发 · loop 本身不认识任何具体工具名</text>
<text x="790" y="30" text-anchor="middle" font-size="12.5" fill="#5A6072">所有安全旋钮集中在 build_week2_registry 顶部一眼可见</text>
</g>
</svg>
<p class="fn">风险分级决定防护重量：http_get 只读网络、grep_files 只读本地文件，最坏是信息越界；shell 能执行任意命令，也是 prompt injection（通过操纵模型输入间接操纵它手里的工具）的首选目标，所以防护最重。</p>
</div>

<h2>走一遍真实场景</h2>
<ol class="walk">
<li><span class="n">1</span><div><p>装配阶段：build_week2_registry 先拿 Day 08 的内置工具（延迟导入避免 import 循环），在其基础上依次 register http_get、grep_files、shell。</p><small>四个安全参数 work_dir / shell_whitelist / http_timeout=10.0 / max_result_chars=4000 全部强制关键字传参——都点名出现，杜绝错位传参这种「不报错但行为全变」的隐患。</small></div></li>
<li><span class="n">2</span><div><p>运行中：模型说「调 shell(command='cat notes.txt')」。它敢这么调的依据，就是随请求发给它的 description 和 input_schema。</p><small>shell 的 schema 只有一个 command 字符串——cwd、超时、白名单全锁死在 handler 内部，模型能控制的输入面被压到最小。</small></div></li>
<li><span class="n">3</span><div><p>loop 只认注册表：拿着工具名查 _handlers 分发执行，自己从头到尾不知道任何具体工具叫什么。</p><small>没有 if name=='calculator' 的分支链——那是做法 A，工具越多循环越膨胀；做法 B 把「分发」和「执行」解耦了。</small></div></li>
<li><span class="n">4</span><div><p>shell handler 里四道防线依次落地：shlex.split 分词取命令名 → 前缀必须在白名单内 → 子进程锁在 work_dir 里跑且最多 10 秒 → 输出超 4000 字符截断并注明总数。</p><small>stdout 和 stderr 拼在一起返回：模型只看得见 content 一个字段，权限报错这类 stderr 信息丢了就看不见；非零退出码会打上 [exit=N] 前缀当「失败诊断书」。</small></div></li>
<li><span class="n">5</span><div><p>成败都装进 ToolResult 返回。下次想加新工具？写一对工厂函数再 register 一次，到此为止。</p><small>每个工具都拆成 spec（给模型看的说明书）+ handler（给机器执行的动作）两个工厂函数成对登记。</small></div></li>
</ol>

<h2>值得记住的数字</h2>
<div class="grid">
<div class="num"><b>3 类</b><span>本周工具：http_get / grep_files / shell，按只读网络、只读本地、可执行命令分风险级</span></div>
<div class="num"><b>4 个</b><span>集中暴露在装配函数顶部的安全配置项，一眼看清「允许什么、限制多少」</span></div>
<div class="num"><b>4 道</b><span>shell 工具防线：白名单 / 超时 / 工作目录锁定 / 结果截断</span></div>
<div class="num"><b>10 秒 · 4000 字</b><span>默认超时与结果截断上限——一条卡死的命令最多拖 10 秒，拖不死整个循环</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li><b>为什么必须 shlex.split 而不是字符串 startswith？</b>命令是一整串字符串，要先分词取 parts[0] 才得到干净的命令名；偷懒用前缀匹配，「cat_evil.py」这种名字就能骗过校验。引号不配对抛出的 ValueError 也被接住转成结构化错误。</li>
<li><b>工厂函数捕获配置是为了避开闭包 late-binding。</b>allowed 转成 set 让成员判断 O(1)；cwd 在工厂阶段就 resolve 成绝对路径——边界「出生时」算死，运行时不再变。</li>
<li><b>check=False 是有意为之。</b>命令失败不抛异常——失败信息应当作为结果交给模型看，让它自己调整策略；抛异常打断循环，Agent 就失去了自我修正的机会。</li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><p><b>问：为什么要区分 spec 和 handler，一个对象不行吗？</b></p><p>答：两者的读者不同。spec（description + input_schema）会被序列化成 OpenAI tools 协议发给模型，是模型决定「调什么、传什么」的唯一依据；handler 是机器真跑的代码。register 的职责就是把这两份按名字钉在一起。</p></div>
<div class="qa"><p><b>问：有了白名单是不是就绝对安全了？</b></p><p>答：不能这么说。默认只放 ls/cat/wc/echo 四个只读命令是底线设计（不给白名单宁可少用），但真正的思路是纵深防御——即便假设白名单有漏洞，还有 cwd 锁定、超时和截断兜着。防护降低风险，不承诺消除风险；正因为如此，不同风险级的工具才需要不同的治理强度。</p></div>
<div class="qa"><p><b>问：模型编造了一个没注册的工具名怎么办？</b></p><p>答：execute 查表落空，返回 ToolResult(ok=False, error="unknown tool: …") 而不是 raise。这条错误作为 observation 回到上下文，模型读到后下一轮自己换正确的工具名。</p></div>

<h2>深入入口</h2>
<p class="entry">对应文字版：Day 09《多工具注册与执行》，见课程 week2-reading/每日正文；文中含 registry.py 与三个工具文件的完整走读，以及 prompt injection 的岔路讲解。</p>

<nav class="nav">
<a href="19-day08-react-loop.html">← 上一章：从零写 ReAct Loop</a>
<a href="21-day10-todowrite.html">下一章：TodoWrite：计划与执行分离 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div></body></html>
`;export{t as default};
