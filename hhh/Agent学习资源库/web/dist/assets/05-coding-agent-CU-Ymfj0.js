const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#8B5CF6;--soft:#F5F3FF;--line:#E6E9ED">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>05 · 认识 Coding Agent</title>
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
<span class="chip">第 5 章 · 共 32 章</span><span class="kicker">速成计划 图解</span>
<h1>认识 Coding Agent</h1>
<p class="lede">普通聊天助手只能「说」，Coding Agent 还能在你的授权范围内「动手」：读取项目、搜索文件、运行命令、修改文件并检查结果。</p>

<section>
<h2>先打个比方</h2>
<p>Coding Agent 像一位能力不错、刚入职的同事：你要先让他读项目并提交方案，批准后只允许他改指定范围，最后亲自核对结果——而不是听他汇报一句「搞定了」就签字。授权范围和事后验收，决定这位「同事」是帮手还是隐患。</p>
</section>

<section>
<h2>全景图解</h2>
<figure class="figcard">
<svg viewBox="0 0 900 560" role="img" aria-label="Coding Agent 工作循环">
<defs>
<marker id="g5arr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#94A3B8"/></marker>
<marker id="g5loop" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#C4B5FD"/></marker>
</defs>
<!-- left rail -->
<rect x="24" y="86" width="168" height="266" rx="14" fill="#F5F3FF" stroke="#DDD6FE"/>
<text x="108" y="118" text-anchor="middle" font-size="14" font-weight="600" fill="#5B45B0">权限边界</text>
<g font-size="13.5" fill="#4B3F8F">
<rect x="42" y="136" width="132" height="34" rx="8" fill="#fff" stroke="#DDD6FE"/><text x="108" y="158" text-anchor="middle">工作目录</text>
<rect x="42" y="182" width="132" height="34" rx="8" fill="#fff" stroke="#DDD6FE"/><text x="108" y="204" text-anchor="middle">可用工具</text>
<rect x="42" y="228" width="132" height="34" rx="8" fill="#fff" stroke="#DDD6FE"/><text x="108" y="250" text-anchor="middle">权限设置</text>
<rect x="42" y="274" width="132" height="34" rx="8" fill="#fff" stroke="#DDD6FE"/><text x="108" y="296" text-anchor="middle">人类确认</text>
</g>
<text x="108" y="334" text-anchor="middle" font-size="11.5" fill="#7A6CC1">它们共同决定了</text>
<text x="108" y="350" text-anchor="middle" font-size="11.5" fill="#7A6CC1">Agent 能做什么</text>
<line x1="196" y1="240" x2="300" y2="240" stroke="#DDD6FE" stroke-width="1.6" stroke-dasharray="5 4"/>
<!-- flow nodes -->
<g>
<rect x="310" y="26" width="280" height="52" rx="12" fill="#fff" stroke="#E6E9ED"/>
<circle cx="340" cy="52" r="12" fill="#8B5CF6"/><text x="340" y="57" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">1</text>
<text x="360" y="58" font-size="15" font-weight="600" fill="#161C24">用户目标：你想做成什么事</text>
<line x1="450" y1="78" x2="450" y2="108" stroke="#94A3B8" stroke-width="2" marker-end="url(#g5arr)"/>
<rect x="290" y="112" width="320" height="62" rx="12" fill="#fff" stroke="#E6E9ED"/>
<circle cx="322" cy="143" r="12" fill="#8B5CF6"/><text x="322" y="148" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">2</text>
<text x="344" y="138" font-size="15" font-weight="600" fill="#161C24">Agent 读取上下文</text>
<text x="344" y="160" font-size="12.5" fill="#8b95a1">项目里的文件、代码、配置</text>
<line x1="450" y1="174" x2="450" y2="204" stroke="#94A3B8" stroke-width="2" marker-end="url(#g5arr)"/>
<rect x="290" y="208" width="320" height="52" rx="12" fill="#8B5CF6"/>
<circle cx="322" cy="234" r="12" fill="#fff"/><text x="322" y="239" text-anchor="middle" font-size="13" fill="#8B5CF6" font-weight="700">3</text>
<text x="344" y="240" font-size="15" font-weight="600" fill="#fff">提出计划 或 调用工具</text>
<line x1="450" y1="260" x2="450" y2="290" stroke="#94A3B8" stroke-width="2" marker-end="url(#g5arr)"/>
<rect x="290" y="294" width="320" height="52" rx="12" fill="#fff" stroke="#E6E9ED"/>
<circle cx="322" cy="320" r="12" fill="#8B5CF6"/><text x="322" y="325" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">4</text>
<text x="344" y="326" font-size="15" font-weight="600" fill="#161C24">程序：读取 / 修改 / 运行</text>
<line x1="450" y1="346" x2="450" y2="376" stroke="#94A3B8" stroke-width="2" marker-end="url(#g5arr)"/>
<rect x="290" y="380" width="320" height="52" rx="12" fill="#fff" stroke="#E6E9ED"/>
<circle cx="322" cy="406" r="12" fill="#8B5CF6"/><text x="322" y="411" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">5</text>
<text x="344" y="412" font-size="15" font-weight="600" fill="#161C24">Agent 根据结果继续</text>
<path d="M610 406 h68 a14 14 0 0 0 14 -14 v-160 a14 14 0 0 0 -14 -14 h-52" fill="none" stroke="#C4B5FD" stroke-width="2.2" stroke-dasharray="6 4" marker-end="url(#g5loop)"/>
<text x="748" y="308" font-size="12.5" fill="#8B74D6" transform="rotate(90 748 308)" text-anchor="middle">没做完就再来一轮</text>
<line x1="450" y1="432" x2="450" y2="462" stroke="#94A3B8" stroke-width="2" marker-end="url(#g5arr)"/>
<rect x="270" y="466" width="360" height="66" rx="12" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="1.8"/>
<circle cx="304" cy="499" r="12" fill="#8B5CF6"/><text x="304" y="504" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">6</text>
<text x="326" y="494" font-size="15" font-weight="600" fill="#4B3591">人类检查证据并验收</text>
<text x="326" y="517" font-size="12.5" fill="#7A6CC1">看实际输出和变更，不只听它说「完成了」</text>
</g>
<!-- right reminder -->
<rect x="704" y="20" width="180" height="84" rx="12" fill="#FFFBEB" stroke="#FDE68A"/>
<text x="794" y="50" text-anchor="middle" font-size="13.5" font-weight="600" fill="#92400E">注意：</text>
<text x="794" y="72" text-anchor="middle" font-size="12.5" fill="#A16207">它不是自动接管电脑，</text>
<text x="794" y="90" text-anchor="middle" font-size="12.5" fill="#A16207">每一步都可能出错</text>
</svg>
<figcaption>一图一意：一次受托任务的完整循环——读上下文、出计划或调工具、执行、根据结果续推，最终由人类拿着证据验收；左侧权限边界限制全程能做什么。</figcaption>
</figure>
</section>

<section>
<h2>走一遍真实场景</h2>
<p style="margin-bottom:14px;color:#5c6875">以后你有了真实项目，第一次委托任务大致这样走（现在只记住流程的样子）：</p>
<ol class="steps">
<li>先让它<b>只读分析</b>，明确「不要修改文件」，要求回答六个问题：输入在哪、程序入口在哪、哪个文件负责校验、哪个文件负责处理规则、正常与异常如何运行、加一个分类关键词要改哪些文件。<span class="note">每个判断都必须引用具体文件名和代码位置（函数名 / 变量名）。</span></li>
<li>打开它提到的文件逐一核对，看它是不是真的读对了。<span class="note">要求引用函数名是在逼它「指给你看」——「函数」就是代码里一段有名字、能完成某件事的小段落。</span></li>
<li>确认无误后，让它<b>先出计划</b>：说清楚打算改哪个文件、怎么改，不许直接动手。<span class="note">流程五步的前两步：先出计划 → 人工确认范围。</span></li>
<li>你同意后放行，且<b>只改允许范围</b>，比如只允许改某一个文件。<span class="note">核心思想之一：「小步改」。</span></li>
<li>改完让它<b>运行验证命令</b>，并展示 <code>git diff</code> 和实际输出。你亲自看完，这一步才算结束。<span class="note">核心思想四词：先计划、再确认、小步改、看证据。</span></li>
</ol>
</section>

<section>
<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><div class="n">1 句话</div><div class="t">关键区别：聊天助手只能「说」，Agent 还能在授权范围内「动手」（读取、搜索、运行、修改并检查）</div></div>
<div class="card"><div class="n">6 问</div><div class="t">一份好的只读提问包含的六项内容，从输入在哪到要改哪些文件</div></div>
<div class="card"><div class="n">5 步</div><div class="t">受控小修改的标准流程：出计划→确认范围→限定改动→运行验证→展示变更</div></div>
<div class="card"><div class="n">4 要素</div><div class="t">共同划定 Agent 权限的东西：工作目录、可用工具、权限、人类确认</div></div>
</div>
</section>

<section>
<h2>再多懂一点</h2>
<ul class="facts">
<li><b>Agent 不是自动接管电脑。</b>工作目录圈住它能碰的地方，可用工具圈住它能做的事，权限和人工确认再补一层——四者合起来才是它的行动空间。</li>
<li><b>「每一步都可能出错」是默认假设。</b>所以验收的对象是你亲眼看到的证据（实际输出、git diff），而不是它的总结陈述；听信「应该可以」等于把信息盲区留给自己。</li>
<li><b>Week 0 不需要安装任何东西。</b>这篇只讲区别与协作方式，等 Week 1 有真实项目时才真正上手。</li>
</ul>
</section>

<section>
<h2>常见疑问</h2>
<div class="qa"><p class="q">为什么第一步是只读分析，而不是直接让它修？</p><p class="a">因为未经核实的理解之上做出的任何修改都建立在猜测上。先逼它引用文件名、函数名给你核对，双方对项目形成同一份事实，后面的修改才有讨论基础。</p></div>
<div class="qa"><p class="q">Agent 都能自己运行命令了，会不会有风险？（这样做会不会有风险？）</p><p class="a">会——这正是安全协作提示词里写明「不要删除文件、不要安装新依赖、不要上传或推送」的原因。风险不来自 Agent 本身，而来自把权限边界和人工确认全部撤掉。给它行动能力的同时，必须保留范围限制和证据验收两个闸门。</p></div>
<div class="qa"><p class="q">它汇报「完成了」，我还要自己打开 git diff 看吗？</p><p class="a">要。「完成了」只是它的说法，验收需要的是你的观察：展示实际改了什么（git diff）和实际输出，由你对照预期判断。这也是下一章 Spec 与 TDD 存在的理由。</p></div>
</section>

<section>
<h2>深入入口</h2>
<p class="deep">对应文字版：《认识Coding-Agent》，见课程 week0-reading/概念篇。前置阅读：《Git配置与安全边界》（图解第 04 章）；如何把任务变成可验收的形式，见《需求采访Spec与TDD》（图解第 06 章）。</p>
</section>

<nav>
<a href="04-git-safety.html"><span class="lab">← 上一章</span><span class="t">Git 与安全边界：可追踪、可恢复</span></a>
<a class="nx" href="06-spec-tdd.html"><span class="lab">下一章 →</span><span class="t">需求采访、Spec 与 TDD</span></a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{t as default};
