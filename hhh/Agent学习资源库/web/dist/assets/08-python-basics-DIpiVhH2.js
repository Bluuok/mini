const e=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#6366F1">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>08 · Python 基础语法最小集</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.78;color:#1f2937;background:#f7f7fb;padding:32px 14px}
main{max-width:780px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:38px clamp(20px,5vw,50px) 28px}
.crumb{font-size:13px;color:#9ca3af;margin-bottom:16px}
.chip{display:inline-block;font-size:12px;font-weight:700;color:#fff;background:var(--accent);border-radius:999px;padding:3px 12px}
.kicker{margin-top:12px;font-size:13px;letter-spacing:.18em;color:#6b7280;font-weight:700}
h1{font-size:30px;line-height:1.3;margin:6px 0 10px;color:#111827}
.lede{color:#4b5563;margin-bottom:24px}
h2{font-size:21px;margin:36px 0 14px;padding-left:11px;border-left:4px solid var(--accent);color:#111827}
p{margin-bottom:12px}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#eef0ff;border-radius:5px;padding:1px 6px;font-size:.87em;color:#3730a3}
pre{background:#181b25;color:#dfe3ee;border-radius:10px;padding:14px 16px;overflow-x:auto;font-size:13.5px;line-height:1.65;margin:10px 0 16px}
pre code{background:none;padding:0;color:inherit}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;margin-top:8px}
.card{border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px}
.card b{display:block;font-size:25px;color:var(--accent);line-height:1.2}
.card span{font-size:13.5px;color:#4b5563;display:block;margin-top:6px}
ol.walk{padding-left:24px}
ol.walk li{margin-bottom:12px}
ol.walk small{color:#6b7280;display:block;font-size:13.5px}
ul.facts li{margin:9px 0 9px 22px}
dl.qa dt{font-weight:700;color:#111827;margin-top:16px}
dl.qa dd{color:#4b5563;margin:4px 0 0}
nav.bottom{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:42px;border-top:1px solid #e5e7eb;padding-top:18px}
nav.bottom a{color:var(--accent);text-decoration:none;font-weight:700;font-size:14.5px}
footer{text-align:center;color:#9ca3af;font-size:12.5px;margin-top:24px}
svg{width:100%;height:auto;display:block}
</style>
</head>
<body>
<main>
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 0 前置基础 · 给想建立直觉的初学者</p>
<span class="chip">第 8 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>Python 基础语法最小集</h1>
<p class="lede">目标不是会写，而是能读懂：看清一段代码里「数据从哪来、被怎么处理、放到哪去」，大意就出来了。</p>

<h2>先打个比方</h2>
<p>把变量想成一个<b>贴了名字标签的储物格</b>：<code>name = "张三"</code> 就是把这张字条放进叫 <code>name</code> 的格子里。注意 <code>=</code> 在这里是「放进去」，不是数学上的「等于」。其余概念没有包装：list 就是一排按顺序的东西，dict 就是带标签的东西，都有固定写法和固定脾气。</p>

<h2>全景图解</h2>
<svg viewBox="0 0 760 452" role="img" aria-label="Python 代码自上而下执行与 traceback 自下而上排错">
<defs><marker id="p8a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6366F1"/></marker></defs>
<rect x="18" y="10" width="450" height="52" rx="10" fill="#EEF0FF" stroke="#6366F1"/>
<text x="243" y="32" text-anchor="middle" font-size="15" font-weight="bold" fill="#312E81">demo.py：一份从上往下的指令清单</text>
<text x="243" y="51" text-anchor="middle" font-size="12" fill="#6B7280">Python 解释器一行一行执行，没有跳来跳去</text>
<line x1="243" y1="66" x2="130" y2="98" stroke="#6366F1" stroke-width="2" marker-end="url(#p8a)"/>
<line x1="243" y1="66" x2="243" y2="98" stroke="#6366F1" stroke-width="2" marker-end="url(#p8a)"/>
<line x1="243" y1="66" x2="356" y2="98" stroke="#6366F1" stroke-width="2" marker-end="url(#p8a)"/>
<g font-size="13" fill="#1F2937">
<rect x="18" y="102" width="145" height="88" rx="10" fill="#fff" stroke="#C7CBF8"/>
<text x="90" y="126" text-anchor="middle" font-weight="bold">变量 / list / dict</text>
<text x="90" y="147" text-anchor="middle" fill="#4B5563">数据放在哪、</text>
<text x="90" y="166" text-anchor="middle" fill="#4B5563">组织成什么样</text>
<rect x="170" y="102" width="146" height="88" rx="10" fill="#fff" stroke="#C7CBF8"/>
<text x="243" y="126" text-anchor="middle" font-weight="bold">if·elif·else / for</text>
<text x="243" y="147" text-anchor="middle" fill="#4B5563">走哪条岔路、</text>
<text x="243" y="166" text-anchor="middle" fill="#4B5563">同一件事做几遍</text>
<rect x="323" y="102" width="145" height="88" rx="10" fill="#fff" stroke="#C7CBF8"/>
<text x="395" y="126" text-anchor="middle" font-weight="bold">def / import / with</text>
<text x="395" y="147" text-anchor="middle" fill="#4B5563">def 打包动作</text>
<text x="395" y="166" text-anchor="middle" fill="#4B5563">import 借工具，with 开文件</text>
</g>
<line x1="243" y1="194" x2="243" y2="228" stroke="#6366F1" stroke-width="2" marker-end="url(#p8a)"/>
<rect x="18" y="232" width="450" height="50" rx="10" fill="#ECFDF5" stroke="#059669"/>
<text x="243" y="253" text-anchor="middle" font-size="14" font-weight="bold" fill="#065F46">print(...) 把结果打给你看 —— 这就是「放到哪去」</text>
<text x="243" y="272" text-anchor="middle" font-size="12" fill="#047857">读任何代码都套这个框架：从哪来 → 怎么处理 → 放哪去</text>
<rect x="18" y="306" width="450" height="132" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
<text x="38" y="332" font-size="14" font-weight="bold" fill="#991B1B">出错时的红字叫 traceback，从下往上看</text>
<g font-size="12.5" fill="#7F1D1D">
<text x="38" y="360">① 最后一行：错误类型和原因（如除以零了）</text>
<text x="38" y="384">② 往上一行有行号：错在第几行的哪个动作</text>
<text x="38" y="408">③ 再往上：被哪一行调用进来的</text>
<text x="38" y="428">④ 整段原样复制给 AI —— 别只说「报错了」</text>
</g>
<rect x="496" y="10" width="246" height="428" rx="10" fill="#FAFAFA" stroke="#E5E7EB"/>
<text x="619" y="40" text-anchor="middle" font-size="14" font-weight="bold" fill="#111827">缩进是有意义的</text>
<g font-size="12.5" fill="#4B5563">
<text x="512" y="68">if / for / def 下面属于它们</text>
<text x="512" y="89">的语句都要往里缩。</text>
<text x="512" y="118">这是 Python 和很多语言</text>
<text x="512" y="139">不一样的地方：行首空格</text>
<text x="512" y="160">不是装饰，是结构本身。</text>
</g>
<line x1="514" y1="182" x2="724" y2="182" stroke="#E5E7EB"/>
<text x="619" y="212" text-anchor="middle" font-size="14" font-weight="bold" fill="#111827"># 号是注释</text>
<g font-size="12.5" fill="#4B5563">
<text x="512" y="240"># 后面的内容给人看，</text>
<text x="512" y="261">Python 不执行它。</text>
</g>
<line x1="514" y1="284" x2="724" y2="284" stroke="#E5E7EB"/>
<text x="619" y="314" text-anchor="middle" font-size="14" font-weight="bold" fill="#111827">字符串要引号</text>
<g font-size="12.5" fill="#4B5563">
<text x="512" y="342">文字必须用引号包起来，</text>
<text x="512" y="363">数字不用：</text>
<text x="512" y="389" font-family="Menlo,monospace" font-size="12" fill="#312E81">name = "张三"</text>
<text x="512" y="412" font-family="Menlo,monospace" font-size="12" fill="#312E81">count = 3</text>
</g>
</svg>

<h2>走一遍真实场景</h2>
<ol class="walk">
<li>读到 <code>names = ["张三", "李四", "王五"]</code>，认出这是 list。<small>方括号包一排东西、逗号隔开；取第一个写 <code>names[0]</code>，因为从 0 开始数——新手最容易踩的坑。</small></li>
<li>读到 <code>person = {"名字": "张三", "年龄": 28}</code>，认出这是 dict。<small>花括号里「标签: 值」成对出现；取值用 <code>person["名字"]</code>。JSON 长得很像 dict，认得 dict 就基本认得 JSON。</small></li>
<li>读到 <code>if age >= 18:</code> 往下的缩进块，知道条件成立才执行这一段。<small><code>elif</code> 是「再如果」，<code>else</code> 是「以上都不成立」；<code>print(...)</code> 把内容打给你看。</small></li>
<li>读到 <code>for name in names:</code>，知道是把 list 里的东西一个个拿出来轮流处理。<small>源文例子里 names 有三个人，所以输出正好是三行：张三、李四、王五。</small></li>
<li>读到 <code>with open("报名名单.txt", "r", encoding="utf-8")</code>，知道在读写文件。<small><code>"r"</code> 读、<code>"w"</code> 写；<code>with</code> 会自动关文件；中文文件要带 <code>encoding="utf-8"</code>，不然容易乱码。</small></li>
</ol>

<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><b>[0]</b><span>list 的第一个元素下标是 0，第二个才是 [1]</span></div>
<div class="card"><b>4 个</b><span>源文示例名单原本 3 人，<code>append("赵六")</code> 后 len(names) 变 4</span></div>
<div class="card"><b>3 行</b><span>for 循环遍历三个名字，就打印出三行</span></div>
<div class="card"><b>最后一行</b><span>traceback 排错永远先看最后一行：那里写着「什么错」</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="facts">
<li><code>int("abc")</code> 会抛 <code>ValueError</code>；try-except 让程序碰到坏数据不直接崩，而是按你准备的默认方案处理。except 后面跟的是错误类型，具体有哪些以后见得多自然认识。</li>
<li><code>import json</code> 之后就能用 <code>json.loads('{"名字": "张三"}')</code> 把 JSON 文字变成 dict——Python 的大量现成工具包让你不必自己造轮子；看到 import 就知道这段借用了别人写好的东西。</li>
<li>函数用 <code>def greet(name):</code> 定义，<code>return</code> 把结果交出去；<code>greet("张三")</code> 是调用。能不能自己写出函数不重要——Week 0 的及格线只有一条：<b>能读懂</b>。真正会写在 Week 1 边做边练出来。</li>
</ul>

<h2>常见疑问</h2>
<dl class="qa">
<dt>Q：为什么第一件事竟是学「读报错」，而不是多学几个语法？</dt>
<dd>A：因为初学阶段最高频的事件就是报错。traceback 自带错误类型、行号和调用链，你只要掌握「从下往上看」这一个动作，再整段复制给 AI，绝大多数问题当场定位——这比背一百个语法的性价比高得多。</dd>
<dt>Q：照网上教程学着写，会不会养成坏习惯甚至搞坏电脑？</dt>
<dd>A：Week 0 这篇主张的正确姿势恰恰相反：现在只读不写，没有风险；Week 1 会交代环境搭建和边界。「先读懂大概在干嘛」是课程设计的入门线，不算偷懒。</dd>
<dt>Q：别人写的代码我一行也看不懂怎么办？</dt>
<dd>A：按本篇路线拆：先找变量的来源（赋值、open 读文件、os.environ 取环境变量），再看 if / for 的走向，最后看 return 和 print 输出到哪。大头认出来之后，剩下的生词交给 AI 或搜索即可。</dd>
</dl>

<h2>深入入口</h2>
<p>对应文字版：《Python 基础语法》，见课程 week0-reading/概念篇。配合同目录《终端实操》一文一起消化效果最好。</p>

<nav class="bottom">
<a href="07-week1-handoff.html">← 上一篇：完整实践与 Week 1 交接</a>
<a href="09-http-api.html">下一篇：HTTP 与 API 常识 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</main>
</body>
</html>
`;export{e as default};
