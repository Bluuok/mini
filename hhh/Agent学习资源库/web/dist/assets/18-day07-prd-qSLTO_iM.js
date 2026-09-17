const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#4F46E5">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>18 · 项目选型与 PRD</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.75;color:#24292f;background:#fbfbfc;padding-bottom:56px}.wrap{max-width:760px;margin:0 auto;padding:0 20px}.crumb{font-size:13px;color:#8b95a1;padding:18px 0 0}.chip{display:inline-block;font-size:12px;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:1px 11px;margin-top:14px}.kicker{font-size:12px;letter-spacing:.12em;color:#a0aab6;margin-top:8px}h1{font-size:31px;line-height:1.28;color:#14181f;margin:8px 0 8px}.lede{color:#57606a;margin-bottom:8px}h2{font-size:21px;line-height:1.4;margin:38px 0 12px;padding-left:11px;border-left:4px solid var(--accent)}p{margin:0 0 12px}.note{color:#6e7781;font-size:14px}.card{background:#fff;border:1px solid #e4e8ee;border-radius:10px;padding:14px 16px;margin:12px 0}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px;margin:14px 0}.num{font-size:26px;font-weight:700;color:var(--accent);line-height:1.2}.lab{font-size:13px;color:#6e7781;margin-top:3px}ol.steps{padding-left:22px}ol.steps li{margin-bottom:12px}ul.tight{padding-left:22px}ul.tight li{margin-bottom:9px}.qa{background:#fff;border:1px solid #e4e8ee;border-radius:10px;padding:13px 16px;margin:11px 0}.qa b.q{color:var(--accent)}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.92em;background:#f0f3f6;border-radius:4px;padding:0 5px}nav.pager{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:40px}nav.pager a{flex:1;display:block;padding:11px 14px;border:1px solid #e0e4ea;border-radius:10px;background:#fff;text-decoration:none;color:var(--accent);font-size:15px;line-height:1.45}nav.pager a.next{text-align:right}nav.pager span{text-align:left}.dir{font-size:12px;color:#8b95a1;display:block}footer{margin-top:40px;border-top:1px solid #dde2e8;padding-top:16px;text-align:center;font-size:13px;color:#98a2ad}svg{width:100%;height:auto}</style>
</head>
<body>
<div class="wrap">
<div class="crumb">AI 应用开发工程师三十天速成计划 · Week 1 · Day 04–07 · 给想建立直觉的初学者</div>
<span class="chip">第 18 章 · 共 32 章</span>
<div class="kicker">速成计划 图解</div>
<h1>项目选型与 PRD</h1>
<p class="lede">学了一周概念，别急着做"万能助手"。今天的交付物是两样：一个过了闸门的主项目方向，和一份写清"怎么实现、怎么评测、怎么分阶段交付、风险在哪"的技术 PRD。</p>

<h2>先打个比方</h2>
<p>技术 PRD 就是施工图纸：盖楼之前先画清楚承重在哪、验收标准是什么、哪面墙明确不打。Day 8 起的代码都是照图施工，图上有多少细节，工程就有多少底气。</p>

<h2>全景图解</h2>
<p>整条链路是三道工序：先过七问闸门定方向，再按五个维度比候选，最后把方向落成 PRD 七节骨架。任何一关卡住，先回头改方向，不硬写文档。</p>
<svg viewBox="0 0 720 400" role="img" aria-label="项目选型与 PRD 结构示意">
<defs><marker id="d7-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0L8,4.5L0,9z" fill="#57606a"/></marker></defs>
<rect x="16" y="20" width="204" height="330" rx="10" fill="#eef2ff" stroke="#4F46E5"/><text x="118" y="46" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#312e81">第一道闸门：七问</text><text x="30" y="76" font-size="12" fill="#374151">① 是否解决真实问题</text><text x="30" y="100" font-size="12" fill="#374151">② 是否需要 Agent（工具/状态/检索）</text><text x="30" y="124" font-size="12" fill="#374151">③ 是否能演示（5–10 分钟）</text><text x="30" y="148" font-size="12" fill="#374151">④ 是否能评测（样本/指标/bad case）</text><text x="30" y="172" font-size="12" fill="#374151">⑤ 是否有工程结构</text><text x="30" y="196" font-size="12" fill="#374151">⑥ 是否能失败恢复</text><text x="30" y="220" font-size="12" fill="#374151">⑦ 是否能写进简历</text><text x="30" y="252" font-size="11.5" fill="#4338ca">不是打分表，是闸门：</text><text x="30" y="269" font-size="11.5" fill="#4338ca">任何一行答不上来就换方向。</text><text x="30" y="294" font-size="11.5" fill="#991b1b">只展示"我调了模型 API"</text><text x="30" y="311" font-size="11.5" fill="#991b1b">的项目，不够格当主项目。</text>
<path d="M220,120 L256,120" stroke="#57606a" stroke-width="1.6" marker-end="url(#d7-arrow)"/>
<rect x="258" y="66" width="150" height="238" rx="10" fill="#fff" stroke="#94a3b8"/><text x="333" y="94" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#334155">五维度比较</text><text x="272" y="124" font-size="12" fill="#374151">兴趣 · 数据 · 工具</text><text x="272" y="146" font-size="12" fill="#374151">评测 · 简历证明</text><text x="272" y="180" font-size="11.5" fill="#B45309">硬闸门：数据和评测——</text><text x="272" y="197" font-size="11.5" fill="#B45309">拿不到样本、写不出</text><text x="272" y="214" font-size="11.5" fill="#B45309">case，直接换项目。</text><text x="272" y="246" font-size="11.5" fill="#374151">兴趣排第一但不是第一</text><text x="272" y="263" font-size="11.5" fill="#374151">权重：连续做两到三周，</text><text x="272" y="280" font-size="11.5" fill="#374151">做不完等于零。</text>
<path d="M408,120 L444,120" stroke="#57606a" stroke-width="1.6" marker-end="url(#d7-arrow)"/>
<rect x="446" y="14" width="260" height="342" rx="10" fill="#fff" stroke="#4F46E5"/><text x="576" y="42" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#312e81">交付物：docs/PRD-v1.0.md 七节骨架</text><text x="460" y="74" font-size="12" fill="#374151"><tspan font-weight="bold">1 背景</tspan>　普通脚本为什么不够</text><text x="460" y="98" font-size="12" fill="#374151"><tspan font-weight="bold">2 用户故事</tspan>　谁在什么情况下完成什么</text><text x="460" y="122" font-size="12" fill="#374151"><tspan font-weight="bold">3 功能清单</tspan>　P0 / P1 / 明确不做</text><text x="460" y="146" font-size="12" fill="#374151"><tspan font-weight="bold">4 技术架构</tspan>　六层 = Day 1–6 知识地图</text><text x="460" y="170" font-size="12" fill="#374151"><tspan font-weight="bold">5 评测指标</tspan>　准确率/P0 通过率/延迟/成本/介入率</text><text x="460" y="194" font-size="12" fill="#374151"><tspan font-weight="bold">6 里程碑</tspan>　每周一个可验收节点</text><text x="460" y="218" font-size="12" fill="#374151"><tspan font-weight="bold">7 风险登记</tspan>　工具超时、检索为空……</text><rect x="458" y="240" width="236" height="52" rx="8" fill="#fef2f2" stroke="#dc2626"/><text x="576" y="262" text-anchor="middle" font-size="11.5" fill="#991b1b">最容易被漏的两节：</text><text x="576" y="280" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#991b1b">「明确不做什么」+「评测指标」</text><text x="460" y="320" font-size="11.5" fill="#4338ca">判断标准：这份文档能不能</text><text x="460" y="337" font-size="11.5" fill="#4338ca">指导 Day 8 的编码？</text>
<rect x="250" y="340" width="160" height="30" rx="15" fill="#eef2ff" stroke="#4F46E5"/><text x="330" y="360" text-anchor="middle" font-size="12" fill="#312e81">对照反面教材：万能助手功能多却没焦点</text>
</svg>

<h2>走一遍真实场景</h2>
<p>以原文的"诊断 Agent"为例，看一套合格判断长什么样：</p>
<ol class="steps">
<li><b>过闸门：输入报错日志或告警，Agent 调工具查证并给出归因。</b><span class="note">场景明确（故障诊断）、有真实约束（要查证不能瞎猜）、可演示可评测——七问全过。对比"万能助手"，它讲得清解决谁的什么问题。</span></li>
<li><b>填骨架：P0 是输入日志 + 查证 + 归因；P1 是生成修复命令；明确不做自动执行修复。</b><span class="note">一句话钉死范围天花板，演示和评测都不必覆盖自动修复；功能清单不会一路疯长。</span></li>
<li><b>给指标：20 条标注故障样本上归因准确率 ≥80%，P0 通过率 100%，单次 ≤3 分钟、成本 ≤0.5 元。</b><span class="note">五个指标里前两个管效果，中间两个管能用多贵，人工介入率管替人省了多少事。</span></li>
<li><b>排里程碑与风险：M1 跑通 P0 → M2 补 P1 和评测脚本 → M3 打磨 bad case 并复盘。</b><span class="note">风险提前登记：工具超时设超时重试，检索为空时明确"答不出就说不确定"。这份文档就是 Day 8 起的施工图。</span></li>
</ol>

<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><div class="num">七问</div><div class="lab">选型闸门：任何一行答不上来，换方向或降级</div></div>
<div class="card"><div class="num">七节骨架</div><div class="lab">背景→用户故事→功能清单→技术架构→评测指标→里程碑→风险登记</div></div>
<div class="card"><div class="num">五指标</div><div class="lab">准确率、P0 通过率、延迟、成本、人工介入率</div></div>
<div class="card"><div class="num">≥80%</div><div class="lab">示例项目的归因准确率底线（20 条标注样本、≤3 分钟/次）</div></div>
</div>

<h2>再多懂一点</h2>
<ul class="tight">
<li><b>技术 PRD ≠ 产品 PRD。</b>产品 PRD 回答"要不要做这个产品"（市场、用户、商业价值）；技术 PRD 回答"怎么实现、怎么验证"。<span class="note">读者是你自己和未来协作者。一秒判别法：这篇文档能不能指导 Day 8 的编码？不能，就只是宣传文档。</span></li>
<li><b>"普通脚本或聊天为什么不够"必须自己写出答案。</b>第 1 节要回答的是"这确实是 Agent 的问题，不是 if/else 能糊弄过去的"。<span class="note">这一段写不出来，多半说明你的项目根本不需要 Agent——这正是第一周结束时最诚实的自我审查。</span></li>
<li><b>P0 与 P1 的划分有严格定义。</b>P0 是"没有它演示就立不住"的功能，P1 是"做完 P0 还有时间才碰"的增强。<span class="note">技术架构节列出的模型、提示、循环、工具、RAG、框架观测六层，正好对应 Day 1–6 学过的全部内容——第一周知识的地图就藏在 PRD 第 4 节里。</span></li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><p><b class="q">Q：还没写一行代码就先写文档，会不会拖慢进度？</b></p><p>A：恰好相反，这是在防最大的坑。原文章点破的现象是：几乎所有"30 天最后一周烂尾"，根因都在选题阶段——边界太宽没法验收。三步动手流程本身也只有一天工作量：选题过闸门、新建 <span class="mono">docs/PRD-v1.0.md</span> 写上七个标题、逐节填到"能回答那一问"为止。</p></div>
<div class="qa"><p><b class="q">Q：为什么兴趣排第一，却又说数据、评测才是硬闸门？</b></p><p>A：两个问题不同层次。兴趣决定你愿不愿意做完，数据、工具、评测、时间决定你能不能做完——后者更硬。原文章原话：某个项目数据拿不到、范围太大，就算兴趣高也要降级；能做完比功能全更重要。</p></div>
<div class="qa"><p><b class="q">Q：质疑一下——PRD 里那些指标现在根本没数据，写了不就是空话吗？</b></p><p>A：写下来本身就是承诺的具体形式。评测指标一节要求具体到"P0 case 10 条 + P1 case 20 条 + 评测脚本怎么跑"；没有这节，项目只能演示 happy path，做完无法验证。空话和承诺的区别在于：承诺会在 M2 被验收脚本兑现，空话不会。</p></div>

<h2>深入入口</h2>
<p>对应文字版：Day 07《项目选型与技术 PRD》，见课程 week1-reading/每日正文。好 Agent 项目的维度评估、选型可行性闸门等，见配套八股·01 基础概念，以及作者文章《什么样的 Agent 项目才算好项目》。</p>

<nav class="pager"><a href="17-day06-frameworks.html"><span class="dir">上一章</span>框架对比：各自解决什么问题</a><a class="next" href="19-day08-react-loop.html"><span class="dir">下一章</span>从零写 ReAct Loop</a></nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{t as default};
