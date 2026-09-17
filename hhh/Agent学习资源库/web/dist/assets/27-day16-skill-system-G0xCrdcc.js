const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#0284C7">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>27 · Skill 系统</title>
<style>
body{margin:0;background:#f6f9fb;color:#16232b;line-height:1.8;font-size:17px;
  font-family:-apple-system,"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif;}
.wrap{max-width:860px;margin:0 auto;padding:30px 20px 54px}
.crumb{font-size:13px;color:#76898f}
.chip{display:inline-block;border:1.5px solid var(--accent);color:var(--accent);
  border-radius:999px;padding:2px 13px;font-size:13px;font-weight:600;margin-top:14px}
.kicker{display:block;letter-spacing:.22em;font-size:12px;color:#9aa7ab;margin-top:6px}
h1{font-size:30px;line-height:1.35;margin:.35em 0 .2em;color:#101a20}
.lede{color:#3f5159;font-size:17px}
section{margin-top:38px}
h2{font-size:21px;margin:0 0 12px;padding-left:11px;border-left:4px solid var(--accent);line-height:1.4}
.fyi{background:#eaf4fa;border:1px solid #cbe4f2;border-radius:14px;padding:14px 18px;color:#2b4a58}
p{margin:.5em 0}
figure{margin:0;background:#fff;border:1px solid #dbe4e9;border-radius:16px;padding:18px 14px}
figcaption{font-size:14px;color:#76898f;padding:10px 8px 2px;line-height:1.7}
svg{width:100%;height:auto;display:block}
ol.steps{padding-left:22px;margin:0}
ol.steps li{margin:12px 0}
.small{font-size:14px;color:#76898f}
.stats{display:flex;gap:12px;flex-wrap:wrap}
.stat{flex:1 1 160px;background:#fff;border:1px solid #dbe4e9;border-radius:14px;padding:14px 16px}
.stat b{display:block;font-size:26px;color:var(--accent);line-height:1.2}
.stat span{font-size:14px;color:#47555c}
ul.plus{padding-left:20px;margin:0}
ul.plus li{margin:10px 0}
.qa{background:#fff;border:1px solid #dbe4e9;border-radius:14px;padding:14px 18px;margin:12px 0}
.qa .q{font-weight:700;color:#28353c;margin:0}
.entry{background:#fff;border:1px dashed #b9c8cf;border-radius:14px;padding:14px 18px;color:#47555c}
.pager{display:flex;justify-content:space-between;gap:14px;margin-top:46px}
.pager a{color:var(--accent);font-weight:600;text-decoration:none;border-bottom:1px solid currentColor}
footer{margin-top:40px;text-align:center;font-size:13px;color:#9aa7ab}
@media(max-width:560px){body{font-size:16px}.stats{flex-direction:column}}
</style>
</head>
<body>
<div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 3 · 给想建立直觉的初学者</p>
<span class="chip">第 27 章 · 共 32 章</span>
<span class="kicker">速成计划 图解</span>

<h1>Skill 系统</h1>
<p class="lede">Skill 不是一段更长的 Prompt，而是把一类可复用的专业工作流封装成"可触发、按需加载"的能力包：触发条件、流程、工具白名单、输出契约、边界，五样缺一不可。</p>

<section id="metaphor">
<h2>先打个比方</h2>
<div class="fyi">像医院值班室墙上的处置预案卡：封面只印两行小字——遇到什么情况取哪张卡；真出事时医生取下整张卡照步骤执行，卡上同时写明哪些动作禁止、什么情况必须请上级点头。没有人把整册预案背进脑子里随身携带——封面常驻，内容按需取用。Skill 的"摘要常驻、正文按需加载"就是这个道理。</div>
</section>

<section id="map">
<h2>全景图解</h2>
<figure>
<svg viewBox="0 0 920 560" role="img" aria-label="SKILL.md 分层结构与 runtime 三步链路">
<defs>
<marker id="d27-arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#0284C7"/></marker>
</defs>
<rect x="30" y="40" width="480" height="64" rx="12" fill="#eef3f5" stroke="#b9c8cf"/>
<text x="48" y="66" font-size="14" font-weight="700" fill="#28353c">System Prompt（常驻上下文）</text>
<rect x="330" y="56" width="160" height="34" rx="17" fill="#0284C7"/>
<text x="410" y="78" text-anchor="middle" font-size="13" fill="#fff">diagnosis-reviewer 摘要</text>
<text x="40" y="122" font-size="12" fill="#76898f">只放几百 token 的元数据摘要，不放完整 Skill</text>
<path d="M410,104 C410,140 310,138 280,164" stroke="#0284C7" stroke-width="2" fill="none" marker-end="url(#d27-arr)"/>
<text x="318" y="142" font-size="12" fill="#0284C7">description 即触发条件</text>
<rect x="40" y="168" width="470" height="360" rx="14" fill="#fff" stroke="#28353c" stroke-width="2"/>
<text x="275" y="196" text-anchor="middle" font-size="16" font-weight="700" fill="#101a20">skills/diagnosis-reviewer/SKILL.md</text>
<rect x="62" y="212" width="426" height="74" rx="8" fill="#e6f2fa" stroke="#0284C7" stroke-dasharray="5 4"/>
<text x="76" y="236" font-size="13.5" font-weight="700" fill="#065a82">frontmatter —— 给机器读</text>
<text x="76" y="260" font-size="13" fill="#28353c">name · description · allowed-tools（共 3 个键）</text>
<text x="76" y="279" font-size="12" fill="#76898f">解析失败或缺 name 都是硬错误，不给下游留半成品</text>
<rect x="62" y="302" width="426" height="206" rx="8" fill="#f7fafc" stroke="#cbd8de"/>
<text x="76" y="326" font-size="13.5" font-weight="700" fill="#28353c">正文 —— 给模型按需读（触发后才加载）</text>
<text x="88" y="356" font-size="13.5" fill="#3f5159">· Trigger Examples：4 条用户真实问法</text>
<text x="88" y="384" font-size="13.5" fill="#3f5159">· Workflow：6 步专业流程（先证据后结论）</text>
<text x="88" y="412" font-size="13.5" fill="#3f5159">· Boundaries：4 条，高危动作一律禁止</text>
<text x="88" y="440" font-size="13.5" fill="#3f5159">· Output Contract：6 字段 JSON 交付规范</text>
<text x="88" y="480" font-size="12.5" fill="#76898f">examples/ 里还有一份 P1 告警示例输入当测试用例</text>
<g>
<line x1="560" y1="250" x2="618" y2="250" stroke="#0284C7" stroke-width="2.5" marker-end="url(#d27-arr)"/>
</g>
<g font-family="inherit">
<rect x="630" y="150" width="256" height="440" rx="14" fill="#fff" stroke="#0284C7" stroke-width="2"/>
<text x="758" y="182" text-anchor="middle" font-size="16" font-weight="700" fill="#05557d">skill_runtime.py 只做三件事</text>
<rect x="650" y="204" width="216" height="96" rx="10" fill="#eef7fc" stroke="#9ccde6"/>
<text x="665" y="230" font-size="13.5" font-weight="700" fill="#065a82">① 加载元数据 load_skill</text>
<text x="665" y="252" font-size="12.5" fill="#3f5159">手工解析 frontmatter，</text>
<text x="665" y="272" font-size="12.5" fill="#3f5159">凝固成只读的 SkillDefinition</text>
<rect x="650" y="322" width="216" height="112" rx="10" fill="#eef7fc" stroke="#9ccde6"/>
<text x="665" y="348" font-size="13.5" font-weight="700" fill="#065a82">② 声明触发 trigger</text>
<text x="665" y="370" font-size="12.5" fill="#3f5159">比对 8 个关键词白名单，</text>
<text x="665" y="390" font-size="12.5" fill="#3f5159">把"为什么触发"写进记录；</text>
<text x="665" y="410" font-size="12.5" fill="#3f5159">可复现、可审计的白盒规则</text>
<rect x="650" y="456" width="216" height="112" rx="10" fill="#eef7fc" stroke="#9ccde6"/>
<text x="665" y="482" font-size="13.5" font-weight="700" fill="#065a82">③ 校验契约 validate</text>
<text x="665" y="504" font-size="12.5" fill="#3f5159">报告对照 6 个必填字段验收，</text>
<text x="665" y="524" font-size="12.5" fill="#3f5159">缺什么记成数据，不抛异常：</text>
<text x="665" y="544" font-size="12.5" fill="#3f5159">不合格是状态，不是崩溃</text>
</g>
<path d="M758,372 v76" stroke="#0284C7" stroke-width="2" marker-end="url(#d27-arr)"/>
</svg>
<figcaption>机器读元数据、模型读正文：摘要常驻 system prompt 让"轻量发现"成立；触发后又有一份 invocation 记录把 skill_name、trigger_reason、allowed_tools、校验结果单独记账。</figcaption>
</figure>
</section>

<section id="scene">
<h2>走一遍真实场景</h2>
<p>一条 P1 告警进来：trade-order 下单接口 5xx 从 1% 升到 18%，CPU 96%，近 10 分钟大量 timeout，附一句草稿诊断"可能要重启服务"。</p>
<ol class="steps">
<li><b>轻量发现</b>：system prompt 里只有 diagnosis-reviewer 的几十字摘要，没有完整流程。<span class="small">不占用本就很贵的上下文。</span></li>
<li><b>命中即声明</b>：告警文本包含"告警/P1/5xx/CPU/timeout"多个关键词，任一命中即记 trigger_reason 为 production incident diagnosis。<span class="small">同一段输入永远得到同一个理由，事后能审计这次为什么走了诊断复核。</span></li>
<li><b>正文上线，按流程取证</b>：完整 Workflow 六步加载进上下文——提取事实 → 先查指标证据 → 查日志关键词 → 搜 SOP → 汇总证据表 → 出最终诊断。<span class="small">第 2 步是命令句：没有指标证据不许推断资源根因。</span></li>
<li><b>全程困在白名单里</b>：只能调 query_metric、search_sop、grep_files、read_file 四个工具；Boundary 第 1 条禁止执行重启、回滚、删除、扩容、清磁盘、改配置。<span class="small">草稿那句"重启服务"在这条线上根本执行不了。</span></li>
<li><b>按契约交付并被校验</b>：报告必须是 root_cause、category、confidence、evidence、next_steps、requires_human 六字段 JSON；runtime 逐项核对，缺哪个记哪个。危险场景把 requires_human 置 true，交给上层人工审批。<span class="small">置信度低于 0.8 不许推荐不可逆动作。</span></li>
</ol>
</section>

<section id="numbers">
<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>5</b><span>要素构成一个 Skill：触发条件、流程、工具白名单、输出契约、边界</span></div>
<div class="stat"><b>6</b><span>个必填输出字段，SKILL.md 与 runtime 两端各存一份同一契约</span></div>
<div class="stat"><b>8</b><span>个触发关键词（告警、故障、p1、p2、5xx、timeout、cpu、oom），命中任一即声明触发</span></div>
<div class="stat"><b>4</b><span>个白名单工具：query_metric、search_sop、grep_files、read_file</span></div>
</div>
</section>

<section id="more">
<h2>再多懂一点</h2>
<ul class="plus">
<li><b>Skill 与近邻的分界</b>：Prompt 是一次性指导，Tool 是单步动作，Workflow 是步骤可预测的固定编排；Skill 针对"高频、复杂、需要边界和契约"的一类任务。Tool 回答"我能做什么动作"，Skill 回答"遇到这类问题按什么专业流程工作、交付什么可验证结果"。</li>
<li><b>契约校验失败不抛异常</b>：这是有意设计——输出不合格不是程序 bug，应作为数据记进 invocation（valid=False 加上排序稳定的 missing_fields），正好对齐 Boundary 第 2 条"证据不足就明说并列出缺什么"。</li>
<li><b>语言选择跟随受众</b>：Workflow 用英文写给模型消费，指令文本更稳、歧义更少；Trigger Examples 用中文口语，因为触发语料就是用户的中文输入。description 的写法是"何时用、为谁用"的职责描述，而不是"我能做什么"的能力罗列。</li>
</ul>
</section>

<section id="qa">
<h2>常见疑问</h2>
<div class="qa"><p class="q">Q：我把"你是资深 SRE 专家……"写得又长又细，这难道不是 Skill？</p>
<p>A：不是，那只是角色设定：没有触发条件、没有输入输出契约、没有边界，既无法被复用也无法被审计，而且每次对话都得整段塞进 system prompt，浪费 token 还稀释重要约束。Skill 是"一类任务的复用"，不是"一次调用的表达"。</p></div>
<div class="qa"><p class="q">Q：边界写得这么死，会不会束缚模型的判断力、得不偿失？</p>
<p>A：边界管住的是危险半径，不是推理方式。不许执行重启/回滚这类不可逆动作、置信度低于 0.8 不推荐不可逆操作，这些反而通过 requires_human 把关键决策交还给人——比起指望模型在一次输出里自觉，把红线固化进能力包是代价更小的做法。证据如何组织、根因如何推断，模型仍有充分空间。</p></div>
<div class="qa"><p class="q">Q：为什么不把完整 Skill 内容全部塞进 system prompt，省得"按需加载"这套机制？</p>
<p>A：多个 Skill 的全文会让常驻上下文迅速膨胀，长上下文会稀释真正重要的约束；正确的放法是只留每个 Skill 几百 token 的摘要（来自 frontmatter），命中触发后再加载完整正文。runtime 也只解析 frontmatter 三键，正文属于模型，不属于代码。</p></div>
</section>

<section id="entry">
<h2>深入入口</h2>
<div class="entry">对应文字版：Day 16《Skill 系统》，见课程 week3-reading/每日正文。想继续往下：第 28 章《MCP 协议》讲外部工具怎么以统一协议进入 ToolRegistry。</div>
</section>

<nav class="pager">
<a href="26-day15-harness.html">上一章 · Harness 工程化整理</a>
<a href="28-day17-mcp.html">下一章 · MCP 协议</a>
</nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{t as default};
