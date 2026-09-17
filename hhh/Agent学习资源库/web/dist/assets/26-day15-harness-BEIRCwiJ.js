const n=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#B45309">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>26 · Harness 工程化整理</title>
<style>
body{margin:0;background:#f7f6f3;color:#1c1917;line-height:1.8;font-size:17px;
  font-family:-apple-system,"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif;}
.wrap{max-width:860px;margin:0 auto;padding:30px 20px 54px}
.crumb{font-size:13px;color:#8a837c}
.chip{display:inline-block;border:1.5px solid var(--accent);color:var(--accent);
  border-radius:999px;padding:2px 13px;font-size:13px;font-weight:600;margin-top:14px}
.kicker{display:block;letter-spacing:.22em;font-size:12px;color:#a8a196;margin-top:6px}
h1{font-size:30px;line-height:1.35;margin:.35em 0 .2em;color:#141210}
.lede{color:#514b45;font-size:17px}
section{margin-top:38px}
h2{font-size:21px;margin:0 0 12px;padding-left:11px;border-left:4px solid var(--accent);line-height:1.4}
.fyi{background:#fbf1e4;border:1px solid #eeddc4;border-radius:14px;padding:14px 18px;color:#574433}
p{margin:.5em 0}
figure{margin:0;background:#fff;border:1px solid #e8e2da;border-radius:16px;padding:18px 14px}
figcaption{font-size:14px;color:#8a837c;padding:10px 8px 2px;line-height:1.7}
svg{width:100%;height:auto;display:block}
ol.steps{padding-left:22px;margin:0}
ol.steps li{margin:12px 0}
.small{font-size:14px;color:#8a837c}
.stats{display:flex;gap:12px;flex-wrap:wrap}
.stat{flex:1 1 160px;background:#fff;border:1px solid #e8e2da;border-radius:14px;padding:14px 16px}
.stat b{display:block;font-size:26px;color:var(--accent);line-height:1.2}
.stat span{font-size:14px;color:#57534e}
ul.plus{padding-left:20px;margin:0}
ul.plus li{margin:10px 0}
.qa{background:#fff;border:1px solid #e8e2da;border-radius:14px;padding:14px 18px;margin:12px 0}
.qa .q{font-weight:700;color:#3d342c;margin:0}
.entry{background:#fff;border:1px dashed #cbc4bb;border-radius:14px;padding:14px 18px;color:#57534e}
.pager{display:flex;justify-content:space-between;gap:14px;margin-top:46px}
.pager a{color:var(--accent);font-weight:600;text-decoration:none;border-bottom:1px solid currentColor}
.pager span{color:#a8a196}
footer{margin-top:40px;text-align:center;font-size:13px;color:#a8a196}
@media(max-width:560px){body{font-size:16px}.stats{flex-direction:column}}
</style>
</head>
<body>
<div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 3 · 给想建立直觉的初学者</p>
<span class="chip">第 26 章 · 共 32 章</span>
<span class="kicker">速成计划 图解</span>

<h1>Harness 工程化整理</h1>
<p class="lede">Harness 是模型之外的工程外壳：它不负责让模型更聪明，而是让模型在一个可恢复、可验证、可审计的系统里行动。</p>

<section id="metaphor">
<h2>先打个比方</h2>
<div class="fyi">像一家公司的入职交接资料。差的交接让你到处追着人问"入口在哪、这个值怎么配"；好的交接是一份摆在固定位置的档案——先看目录再走流程，需要动敏感操作时有明文规定可查。Harness 就是给模型准备的这份档案，而且标准更高：连模型自己也要照着同一份档案工作。</div>
</section>

<section id="map">
<h2>全景图解</h2>
<figure>
<svg viewBox="0 0 920 560" role="img" aria-label="Harness 五个子系统包裹着 LLM">
<defs>
<marker id="d26-arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#B45309"/></marker>
</defs>
<rect x="128" y="86" width="664" height="410" rx="24" fill="#fbf3e9" stroke="#B45309" stroke-width="2" stroke-dasharray="8 6"/>
<text x="460" y="52" text-anchor="middle" font-size="18" font-weight="700" fill="#B45309">Harness · 模型之外的工程外壳</text>
<text x="460" y="76" text-anchor="middle" font-size="13" fill="#8a837c">它不负责思考，负责让行动可恢复、可验证、可审计</text>
<g stroke="#dccdb8" stroke-width="2">
<line x1="460" y1="300" x2="250" y2="152"/>
<line x1="460" y1="300" x2="672" y2="152"/>
<line x1="460" y1="300" x2="245" y2="304"/>
<line x1="460" y1="300" x2="675" y2="304"/>
<line x1="460" y1="300" x2="460" y2="447"/>
</g>
<circle cx="460" cy="300" r="84" fill="#ffffff" stroke="#1c1917" stroke-width="2"/>
<text x="460" y="294" text-anchor="middle" font-size="26" font-weight="700" fill="#141210">LLM</text>
<text x="460" y="320" text-anchor="middle" font-size="13" fill="#6b645c">只会推理的模型本身</text>
<g font-family="inherit">
<rect x="158" y="112" width="184" height="60" rx="11" fill="#fff" stroke="#B45309" stroke-width="1.5"/>
<text x="250" y="138" text-anchor="middle" font-size="15" font-weight="700" fill="#141210">① 指令 Instruction</text>
<text x="250" y="160" text-anchor="middle" font-size="12" fill="#8a837c">README · prompts</text>
<rect x="578" y="112" width="188" height="60" rx="11" fill="#fff" stroke="#B45309" stroke-width="1.5"/>
<text x="672" y="138" text-anchor="middle" font-size="15" font-weight="700" fill="#141210">② 工具 Tools</text>
<text x="672" y="160" text-anchor="middle" font-size="12" fill="#8a837c">ToolRegistry</text>
<rect x="148" y="274" width="192" height="60" rx="11" fill="#fff" stroke="#B45309" stroke-width="1.5"/>
<text x="244" y="300" text-anchor="middle" font-size="15" font-weight="700" fill="#141210">③ 环境 Environment</text>
<text x="244" y="322" text-anchor="middle" font-size="12" fill="#8a837c">pyproject · .env · configs</text>
<rect x="582" y="274" width="190" height="60" rx="11" fill="#fff" stroke="#B45309" stroke-width="1.5"/>
<text x="677" y="300" text-anchor="middle" font-size="15" font-weight="700" fill="#141210">④ 状态 State</text>
<text x="677" y="322" text-anchor="middle" font-size="12" fill="#8a837c">memory · session</text>
<rect x="367" y="418" width="186" height="60" rx="11" fill="#fff" stroke="#B45309" stroke-width="1.5"/>
<text x="460" y="444" text-anchor="middle" font-size="15" font-weight="700" fill="#141210">⑤ 反馈 Feedback</text>
<text x="460" y="466" text-anchor="middle" font-size="12" fill="#8a837c">tests · eval · 日志</text>
</g>
<text x="460" y="536" text-anchor="middle" font-size="13" fill="#8a837c">同一段模型权重，放进不同的外壳，产出质量完全不同</text>
</svg>
<figcaption>五个子系统各就各位，模型才能在真实工程环境里少犯不可复盘的错：只有 Prompt 没测试，会提前宣布完成；只有工具没边界，会越权操作。</figcaption>
</figure>
</section>

<section id="scene">
<h2>走一遍真实场景</h2>
<p>模拟一个新同学（或一个新 Agent）第一次接手 Day 15 整理出的仓库。</p>
<ol class="steps">
<li><b>打开 README</b>：两句话回答"这是什么"——第三周的参考代码快照、正在升级中的工程雏形；并划清边界："用于阅读对照，不要求解压后直接运行"。<span class="small">新手的第一问在第一屏就被回答，还不会浪费时间装环境。</span></li>
<li><b>照目录树认门牌</b>：每个模块一行注释一句职责（loop.py、todo.py、memory.py……），Day 8-14 学过的机制全都能对号入座。<span class="small">职责列表是系统真源的第一层。</span></li>
<li><b>读 ARCHITECTURE 看协作</b>：一张纯文本架构图从 alert 出发——guardrails 拦截 → skill_runtime 校验 → MCP 工具供数据 → multi_agent 分工 → evaluator 打分、observability 记 trace、session 持久化。<span class="small">一条告警从进来到留下痕迹，全程走完；纯文本图还能进 git diff、逐字符 review。</span></li>
<li><b>改参数去 configs</b>：温度、超时、10 分钟窗口、0.8 置信度门槛、五个必须人批的高危动作，全在 default.yaml 里，不碰一行 Python。<span class="small">密钥不在其中——密钥归 .env。</span></li>
<li><b>跑离线验证收尾</b>：健康检查、pytest、eval 脚本全部离线运行，不需要真实 API key。<span class="small">工程判断先练起来，真实接入留给 Week 4。</span></li>
</ol>
</section>

<section id="numbers">
<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>5</b><span>个子系统：指令、工具、环境、状态、反馈，缺一个都"看起来能跑但不可交付"</span></div>
<div class="stat"><b>4</b><span>件文档资产：README（入口）、ARCHITECTURE（协作）、configs（参数）、prompts（Prompt）</span></div>
<div class="stat"><b>0.8</b><span>动手置信度门槛：min_confidence_for_action 达标才允许执行动作</span></div>
<div class="stat"><b>5 条</b><span>高危动作进人工审批名单：restart、rollback、scale、delete、clean_disk</span></div>
</div>
</section>

<section id="more">
<h2>再多懂一点</h2>
<ul class="plus">
<li><b>密钥与配置的分界只有一条判据</b>：这份值能不能进 git。API key 进仓库等于公开，所以密钥归 .env、配置归 yaml——default.yaml 第一行注释就立了这条规矩，仓库才能整体公开分享。</li>
<li><b>"哪些动作必须人批"是数据，不是代码分支</b>：高危动作清单写在 yaml 里，改名单不动代码、可 diff、可 review；prompt 侧再从行为拦截一道（"不直接执行重启、删除、扩容等高风险动作"）。配置管阈值，Prompt 管行为，两层一起管住模型。</li>
<li><b>仓库即系统真源</b>：对 Agent 来说，不在仓库里的信息等于不存在。检验方法是只给一个新 Agent 读取 agent-app/，看它能否回答四问——是什么、怎么运行、模块在哪、怎么验证。必须靠你口头补充的，说明还不是事实来源。</li>
</ul>
</section>

<section id="qa">
<h2>常见疑问</h2>
<div class="qa"><p class="q">Q：又冒出一个新名词，Harness 是不是又一个要学的框架？</p>
<p>A：正相反。课程原话是"不是再写一个框架，而是把已有机制整理成可交接的骨架"：Loop、Tools、TodoWrite、Memory 这些都不重写，新增的只有四件文档资产。后面 Day 16-21 的 Skill、MCP、Multi-agent 只往这个骨架上逐日挂新能力，核心没变复杂。</p></div>
<div class="qa"><p class="q">Q：把这么多约定写进文档，会不会很快过期、反而误导后来的人？</p>
<p>A：过期风险存在，所以才要求"仓库即系统真源"：架构图用纯文本，能进 git diff、逐字符 review；README 开头就划清"不要求运行"的边界，负边界四条明确说"这些不在本包"。只要每次改动同步更新文档，文档远比散落在聊天记录和脑子里的约定可靠——后者恰恰是过期的重灾区。</p></div>
<div class="qa"><p class="q">Q：只有 Prompt、缺少测试和评测的 Agent，具体会坏在哪里？</p>
<p>A：坏在反馈层缺失。典型症状是提前宣布完成：模型自说自话认为任务结束了，没有任何机制去核实。这就是为什么 README 把目标定成"可组织、可扩展、可评测、可观测、可审计"五个词，评测也是第三周的重头戏之一。</p></div>
</section>

<section id="entry">
<h2>深入入口</h2>
<div class="entry">对应文字版：Day 15《Harness 工程化整理》，见课程 week3-reading/每日正文。想继续往下：第 27 章《Skill 系统》讲往骨架上挂的第一个新能力。</div>
</section>

<nav class="pager">
<a href="25-day14-subagent.html">上一章 · Subagent 子任务隔离</a>
<a href="27-day16-skill-system.html">下一章 · Skill 系统</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{n as default};
