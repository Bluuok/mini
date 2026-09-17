const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#3B82F6">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>02 · 让程序跑起来：文件、路径与终端</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{background:#F3F6FC}
body{font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.75;color:#1E2A44;padding:28px 18px 48px}
main{max-width:860px;margin:0 auto}
.crumb{font-size:13px;color:#7C88A0;letter-spacing:.02em}
.chip{display:inline-block;background:color-mix(in srgb,var(--accent) 12%,white);color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 35%,white);border-radius:999px;font-size:13px;padding:2px 12px;margin-top:14px}
.kicker{font-size:13px;color:#7C88A0;margin-top:8px;letter-spacing:.08em}
h1{font-size:30px;line-height:1.3;color:var(--accent);margin-top:6px}
.lede{margin-top:10px;color:#41506E;font-size:17px}
h2{font-size:20px;color:var(--accent);margin:38px 0 14px;padding-left:12px;border-left:4px solid var(--accent)}
p{margin:10px 0}
.muted{color:#76829C;font-size:14px}
.card{background:#fff;border:1px solid #DDE5F2;border-radius:12px;padding:16px 18px;margin:12px 0}
.numgrid{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px}
.num{flex:1 1 160px;background:#fff;border:1px solid #DDE5F2;border-radius:12px;padding:14px 16px;text-align:left}
.num b{display:block;font-size:26px;color:var(--accent)}
.num span{font-size:14px;color:#55648A}
ol.walk{counter-reset:s;list-style:none;margin-top:10px}
ol.walk li{position:relative;padding-left:44px;margin:14px 0}
ol.walk li::before{counter-increment:s;content:counter(s);position:absolute;left:0;top:2px;width:28px;height:28px;border-radius:50%;background:var(--accent);color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:15px}
.qa{margin:14px 0}
.qa .q{font-weight:600;color:var(--accent)}
.qa .a{color:#41506E}
code.k{background:#EDF2FB;border:1px solid #D9E3F5;border-radius:5px;padding:1px 7px;font-family:"SF Mono",Menlo,Consolas,monospace;font-size:14px;color:#2451B3}
.note{background:color-mix(in srgb,var(--accent) 6%,#fff);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:12px 16px;margin:12px 0}
svg{width:100%;height:auto;display:block;background:#fff;border:1px solid #DDE5F2;border-radius:12px;margin-top:10px}
nav.pager{display:flex;justify-content:space-between;gap:12px;margin-top:42px;padding-top:18px;border-top:1px solid #CFD9EC;font-size:15px}
nav.pager a{color:var(--accent);text-decoration:none;font-weight:600}
footer{margin-top:34px;text-align:center;font-size:13px;color:#8593AC}
</style>
</head>
<body>
<main>
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 0 概念篇 · 给想建立直觉的初学者</p>
<span class="chip">第 2 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>让程序跑起来：文件、路径与终端</h1>
<p class="lede">当有人对电脑说「运行某个程序」时，电脑需要先搞清楚三个问题：我在哪个文件夹？我要运行哪个文件？用什么来运行它？本篇只建立语境，不动手。</p>

<h2>先打个比方</h2>
<div class="card">想象你在整理电脑里的照片：有一个「旅行」文件夹，里面有「2023-青海」「2024-云南」等子文件夹，每个文件夹里是照片。软件世界里的文件、目录、路径用的就是同一套组织方式——这也是源文自己的讲法，我们直接沿用。</div>

<h2>全景图解</h2>
<svg viewBox="0 0 900 660" role="img" aria-label="目录树、当前目录与运行程序三问">
<defs>
<marker id="fp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#3B82F6"/></marker>
<linearGradient id="fp-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF1FD"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
</defs>
<rect width="900" height="660" fill="url(#fp-bg)"/>
<text x="450" y="36" text-anchor="middle" font-size="19" font-weight="700" fill="#1E2A44">左边认路，右边回答「怎么让程序跑起来」</text>

<!-- directory tree -->
<g font-size="14">
<rect x="24" y="66" width="400" height="330" rx="14" fill="#FFFFFF" stroke="#CBD9EF"/>
<text x="40" y="94" font-size="15" font-weight="700" fill="#1E56B8">文件夹的样子（目录树）</text>
<path d="M64 116 L64 130 M52 130 H210" stroke="#9DB6DC" fill="none"/>
<rect x="52" y="112" width="150" height="22" rx="11" fill="#3B82F6"/>
<text x="127" y="128" text-anchor="middle" fill="#fff" font-size="13">旅行</text>
<path d="M78 134 L78 148 M62 148 H176" stroke="#9DB6DC" fill="none"/>
<rect x="62" y="146" width="120" height="21" rx="10" fill="#DBEAFE"/>
<text x="122" y="161" text-anchor="middle" fill="#1E56B8" font-size="13">2023-青海/</text>
<path d="M172 168 v6 m-24 0 h48" stroke="#9DB6DC" fill="none"/>
<rect x="86" y="174" width="124" height="21" rx="10" fill="#EFF5FF"/>
<text x="148" y="189" text-anchor="middle" fill="#44608F" font-size="13">IMG_001.jpg</text>
<path d="M140 138 v24 m-26 0 h64" stroke="#9DB6DC" fill="none"/>
<rect x="196" y="146" width="124" height="21" rx="10" fill="#DBEAFE"/>
<text x="258" y="161" text-anchor="middle" fill="#1E56B8" font-size="13">2024-云南/</text>
<path d="M234 168 h-58 m58 0 h22 v6" stroke="#9DB6DC" fill="none"/>
<rect x="212" y="174" width="126" height="21" rx="10" fill="#EFF5FF" stroke="#3B82F6"/>
<text x="275" y="189" text-anchor="middle" fill="#1E56B8" font-size="13" font-weight="700">IMG_001.jpg ←目标</text>
<line x1="40" y1="216" x2="408" y2="216" stroke="#E3EBF8"/>
<text x="40" y="240" font-weight="700" fill="#1E56B8">四种概念 · 一一对应</text>
<text x="40" y="264" fill="#33436A">文件 = 一张照片（有名字和扩展名：<tspan fill="#2451B3">.md .json .py</tspan>）</text>
<text x="40" y="288" fill="#33436A">目录 = 组织文件的文件夹 = 「旅行」</text>
<text x="40" y="312" fill="#33436A">当前目录 = 终端命令默认寻找文件的位置</text>
<text x="40" y="336" fill="#33436A">　　　　　= 你现在正打开看的那个文件夹</text>
<text x="40" y="360" fill="#33436A">路径 = 文件在电脑中的位置，有两种写法：</text>
<text x="40" y="382" fill="#2451B3" font-weight="600">相对：2024-云南/IMG_001.jpg（取决于你在哪）</text>
</g>

<!-- terminal window -->
<g font-family="Menlo,monospace" font-size="13.5">
<rect x="452" y="66" width="424" height="330" rx="14" fill="#16203A"/>
<circle cx="476" cy="88" r="6" fill="#F87171"/><circle cx="496" cy="88" r="6" fill="#FBBF24"/><circle cx="516" cy="88" r="6" fill="#4ADE80"/>
<text x="664" y="93" text-anchor="middle" fill="#8FA3C8" font-size="12">终端里常见的几条命令（先认识，不运行）</text>
<text x="470" y="120" fill="#4ADE80">$ pwd <tspan fill="#8FA3C8"># 显示当前目录（我在哪）</tspan></text>
<text x="470" y="145" fill="#7DD3FC">$ ls <tspan fill="#8FA3C8"># 列出当前目录里的文件和文件夹</tspan></text>
<text x="470" y="170" fill="#7DD3FC">$ cd 2024-云南 <tspan fill="#8FA3C8"># 进入某个子目录</tspan></text>
<text x="470" y="195" fill="#7DD3FC">$ cd .. <tspan fill="#8FA3C8"># 返回上一级目录</tspan></text>
<text x="470" y="220" fill="#7DD3FC">$ find . <tspan fill="#8FA3C8"># 列出所有文件（含子文件夹）</tspan></text>
<text x="470" y="245" fill="#7DD3FC">$ python --version <tspan fill="#8FA3C8"># 查看 Python 版本</tspan></text>
<line x1="470" y1="262" x2="858" y2="262" stroke="#2A3757"/>
<text x="470" y="286" fill="#FBBF24" font-weight="700">运行程序前，终端心里要过三个问题：</text>
<g>
<rect x="470" y="300" width="118" height="40" rx="9" fill="#1F2D50" stroke="#3B82F6"/><text x="529" y="317" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">我在哪？</text><text x="529" y="333" text-anchor="middle" fill="#7DA3E0" font-size="12">pwd / 当前目录</text>
<rect x="604" y="300" width="118" height="40" rx="9" fill="#1F2D50" stroke="#3B82F6"/><text x="663" y="317" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">运行什么？</text><text x="663" y="333" text-anchor="middle" fill="#7DA3E0" font-size="12">哪个文件的代码</text>
<rect x="738" y="300" width="120" height="40" rx="9" fill="#1F2D50" stroke="#3B82F6"/><text x="798" y="317" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">用什么跑？</text><text x="798" y="333" text-anchor="middle" fill="#7DA3E0" font-size="12">Python 解释器</text>
</g>
<path d="M592 320 h8 M694 320 h8 M732 320 h4" stroke="#3B82F6" fill="none" marker-end="url(#fp-arrow)"/>
<text x="470" y="370" fill="#8FA3C8" font-size="12.5">每一行 # 后面就是这条命令的作用；pwd 即 print working directory 的缩写。</text>
</g>

<!-- bottom band -->
<path d="M450 396 L450 430" stroke="#3B82F6" stroke-width="2" fill="none" marker-end="url(#fp-arrow)"/>
<rect x="24" y="438" width="852" height="100" rx="14" fill="#FFFFFF" stroke="#3B82F6" stroke-width="1.5"/>
<text x="44" y="466" font-size="15" font-weight="700" fill="#1E56B8">项目与虚拟环境：代码不是乱堆的，环境不是共用一间房</text>
<text x="44" y="492" font-size="13.5" fill="#33436A">· 稍大的项目把代码拆成多个文件、放进文件夹组织——这套组织方式叫「包」和「模块」（细节 Week 1 再走）。</text>
<text x="44" y="516" font-size="13.5" fill="#33436A">· .venv 是当前项目独立的 Python 环境：不同项目可用不同依赖（别人写好的、能直接用的代码），互不干扰。</text>
<rect x="700" y="452" width="156" height="72" rx="10" fill="#EFF5FF" stroke="#9DB6DC"/>
<text x="778" y="482" text-anchor="middle" font-size="13" fill="#1E56B8" font-weight="700">A 项目的库版本</text>
<text x="778" y="502" text-anchor="middle" font-size="13" fill="#1E56B8">弄不坏 B 项目</text>
<path d="M700 488 c-30 4 -34 -20 -14 -30" stroke="#3B82F6" fill="none" marker-end="url(#fp-arrow)"/>

<!-- path comparison strip -->
<rect x="24" y="556" width="852" height="88" rx="14" fill="#EAF1FD"/>
<text x="44" y="582" font-size="14" font-weight="700" fill="#1E56B8">同一张照片的两种指法</text>
<text x="44" y="608" font-family="Menlo,monospace" font-size="13" fill="#33436A">相对路径　2024-云南/IMG_001.jpg　<span fill="#76829C">← 从「当前目录」出发去找</span></text>
<text x="44" y="631" font-family="Menlo,monospace" font-size="13" fill="#33436A">绝对路径　/Users/你的名字/图片/旅行/2024-云南/IMG_001.jpg　<span fill="#76829C">← 从电脑最顶层写完整位置</span></text>
</svg>

<h2>走一遍真实场景</h2>
<ol class="walk">
<li>你打开终端，处在某个文件夹里——这就是「当前目录」，终端命令默认在这里找文件。<span class="muted">所以同一个命令在不同地方敲，结果可能完全不同。</span></li>
<li>想运行一个 Python 程序，第一件事是用类似 <code class="k">pwd</code> 的方式确认「我在哪」，再用相对或绝对路径指明要运行的文件。<span class="muted">相对路径从当前目录出发；绝对路径不管你在哪都指向同一个地方。</span></li>
<li>第三步由解释器接手：Python 既是一种编程语言，也是一台能执行 .py 文件里代码的解释器。<span class="muted">常见两种跑法：直接运行某个文件，或用 -m 按模块名运行——后者不用管文件在硬盘上的具体路径。</span></li>
<li>如果这个项目带有自己的 .venv 虚拟环境，用的是这个项目专属的那套依赖。<span class="muted">这正是 A 项目的库版本不会弄坏 B 项目的原因。</span></li>
<li>以上只读不用练：这些命令 Week 1 会真正用到，到时装 Python 环境时会再走一遍同样的概念。</li>
</ol>

<h2>值得记住的数字</h2>
<div class="numgrid">
<div class="num"><b>3 问</b><span>运行任何程序前都要答：我在哪 / 运行哪个文件 / 用什么来运行它</span></div>
<div class="num"><b>4 个</b><span>核心概念：文件、目录、当前目录、路径</span></div>
<div class="num"><b>2 种</b><span>路径写法：相对路径看你在哪，绝对路径永远指向同一处</span></div>
<div class="num"><b>6 条</b><span>本周要认识的终端命令：pwd、ls、cd、cd ..、find .、python --version</span></div>
</div>

<h2>再多懂一点</h2>
<div class="card"><p><b>扩展名也是信息的一部分。</b><code class="k">.md</code>、<code class="k">.json</code>、<code class="k">.py</code> 这类扩展名标记了文件的类型；「文件」在本篇的定义就是一份有名字和扩展名的数据。</p></div>
<div class="card"><p><b>-m 是一种省心用法。</b>用 <code class="k">python -m 某个模块名</code> 就是「按模块名运行，不用管它在硬盘上的具体路径」——相当于把找文件这件事交给 Python 自己的组织结构去处理。</p></div>
<div class="card"><p><b>虚拟环境解决的是依赖冲突，不是功能问题。</b>.venv 相当于给项目单独开了一个小房间；它的边界是不管语言内部机制，只保证项目之间互不干扰。</p></div>

<h2>常见疑问</h2>
<div class="qa"><p class="q">Q：我不会写代码，学这一篇有什么用？</p>
<p class="a">本篇只要求读懂一件事：当有人说「运行某个程序」时，背后其实是回答那三个问题。Week 1 真正动手时，你已经知道每条命令在做什么了。</p></div>
<div class="qa"><p class="q">Q：既然绝对路径更完整，为什么不一直用绝对路径？</p>
<p class="a">两种都有用途：相对路径短，且跟着「你现在在哪」走，在项目内部引用更自然；绝对路径稳，但把项目搬到别的位置就全失效了。理解差别比记死规则重要。</p></div>
<div class="qa"><p class="q">Q：多个项目共用一个环境会不会有问题？</p>
<p class="a">会。如果都用同一套全局环境，A 项目升级的库版本可能弄坏 B 项目——这正是每个项目配独立 .venv 存在的理由。</p></div>

<h2>深入入口</h2>
<p>对应文字版：《Week 0 文件、路径、终端与 Python 运行》，见课程 week0-reading/概念篇；第 3 章在此基础上讲清一个确定性程序内部如何处理 JSON 输入输出。</p>

<nav class="pager">
<a href="01-agent-map.html">← 上一章：大模型、AI 应用与 Agent 地图</a>
<a href="03-json-rule-programs.html">下一章：规则程序：JSON 与输入输出的边界 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</main>
</body>
</html>
`;export{t as default};
