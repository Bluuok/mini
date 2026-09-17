const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#DC2626">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 22 章 · Memory：三层记忆 · 三十天速成计划 图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#FDF5F5;color:#232733;line-height:1.75;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.crumb{font-size:13.5px;color:#8A8F9E;margin-bottom:8px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:13px}
h1{font-size:34px;line-height:1.2;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:26px}
h2{font-size:22px;margin:36px 0 10px;padding-top:18px;border-top:1px solid #F0DDDD}
.card{background:#fff;border:2.5px solid #232733;border-radius:18px;box-shadow:6px 6px 0 rgba(35,39,51,.10);padding:20px;margin:20px 0}
.analogy{background:#fff;border-left:5px solid var(--accent);border-radius:6px 14px 14px 6px;box-shadow:0 2px 12px rgba(35,39,51,.07);padding:18px 22px;margin:18px 0}
.analogy p{font-size:16.5px;color:#3A3F4E}
.analogy .tag{font-weight:800;color:var(--accent);font-size:14px;letter-spacing:.15em}
.chip{display:inline-block;border:2.5px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 14px;font-weight:700;font-size:15px}
svg{width:100%;height:auto;display:block;margin:16px 0}
.caption{text-align:center;color:#5A6072;font-size:14.5px;margin-top:10px}
.walk .step{display:flex;gap:12px;margin:13px 0;align-items:flex-start}
.walk .n{flex:0 0 30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px}
.walk .step p{font-size:16.5px;color:#3A3F4E}
.walk .step p small{display:block;color:#8A8F9E;font-size:14px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin:16px 0}
.stat{background:#fff;border:2px solid var(--accent);border-radius:14px;padding:14px 12px;text-align:center}
.stat b{display:block;font-size:26px;color:var(--accent);font-weight:800;line-height:1.2}
.stat span{font-size:13.5px;color:#5A6072}
.more{padding-left:22px}
.more li{margin:9px 0;font-size:16.5px;color:#3A3F4E}
.faq dt{font-weight:800;font-size:16.5px;margin-top:14px;color:#232733}
.faq dt::before{content:'Q ';color:var(--accent)}
.faq dd{margin:4px 0 0 0;font-size:16px;color:#4A5060;padding-left:24px}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:46px;font-weight:700;font-size:16px;flex-wrap:wrap}
a{color:var(--accent)}
footer{margin-top:44px;color:#8A8F9E;font-size:14px;text-align:center}</style></head>
<body><div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · Week 2 · 给想建立直觉的初学者</p>
<span class="chip">第 22 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>Memory：三层记忆</h1>
<p class="lede">模型本身无状态，每次调用都从零开始。"记得之前说过什么"靠把相关信息重新放进上下文——但上下文窗口有限，全塞进去又贵又装不下。答案是分层：不同类型的记忆用不同的存取方式。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一套规范的财务档案制度：合同编号、凭证号这类要一字不差对上的，去登记册按编号翻（键值库）；会议纪要、往来邮件这类记不清原文但记得大意，按主题柜里的相似内容找（语义库）。最关键的一条规矩：任何一笔记录入档都必须有人签字审核——绝不允许经办人随手把道听途说的东西写成正式档案。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 900 330" role="img" aria-label="三层记忆的双路召回"><defs><marker id="m22-ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="20" y="120" width="150" height="86" rx="14" fill="#FDECEC" stroke="#232733" stroke-width="2.5"/>
<text x="95" y="155" text-anchor="middle" font-size="14" font-weight="700">用户消息到来</text>
<text x="95" y="180" text-anchor="middle" font-size="11.5" fill="#5b6478">先召回，再回答</text>
<rect x="215" y="112" width="140" height="100" rx="14" fill="#fff" stroke="#DC2626" stroke-width="3"/>
<text x="285" y="147" text-anchor="middle" font-size="15" font-weight="700">recall</text>
<text x="285" y="170" text-anchor="middle" font-size="11.5" fill="#5b6478">双路同时查</text>
<text x="285" y="190" text-anchor="middle" font-size="11.5" fill="#5b6478">每路 top_k=3</text>
<rect x="405" y="40" width="225" height="88" rx="14" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="517" y="68" text-anchor="middle" font-size="14.5" font-weight="700">长期 KV · SQLite</text>
<text x="517" y="92" text-anchor="middle" font-size="11.5" fill="#5b6478">结构化键值：用户偏好、上次指标</text>
<text x="517" y="112" text-anchor="middle" font-size="11.5" fill="#B45555">子串精确匹配，毫秒级零歧义</text>
<rect x="405" y="196" width="225" height="88" rx="14" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="517" y="224" text-anchor="middle" font-size="14.5" font-weight="700">长期语义 · Chroma 向量库</text>
<text x="517" y="248" text-anchor="middle" font-size="11.5" fill="#5b6478">历史对话、SOP 文档等大段文本</text>
<text x="517" y="268" text-anchor="middle" font-size="11.5" fill="#B45555">按语义相近检索，接受字面不同</text>
<rect x="685" y="108" width="195" height="110" rx="14" fill="#FDECEC" stroke="#DC2626" stroke-width="3"/>
<text x="782" y="137" text-anchor="middle" font-size="14" font-weight="700">MemoryHit 统一格式</text>
<text x="782" y="183" text-anchor="middle" font-size="11.5" fill="#B45555">每条截到 200 字</text>
<text x="782" y="203" text-anchor="middle" font-size="11.5" fill="#B45555">由调用方拼进 system</text>
<line x1="170" y1="163" x2="209" y2="163" stroke="#232733" stroke-width="3.5" marker-end="url(#m22-ar)"/>
<line x1="355" y1="135" x2="399" y2="94" stroke="#232733" stroke-width="3" marker-end="url(#m22-ar)"/>
<line x1="355" y1="192" x2="399" y2="230" stroke="#232733" stroke-width="3" marker-end="url(#m22-ar)"/>
<line x1="630" y1="84" x2="679" y2="126" stroke="#232733" stroke-width="3" marker-end="url(#m22-ar)"/>
<line x1="630" y1="240" x2="679" y2="198" stroke="#232733" stroke-width="3" marker-end="url(#m22-ar)"/>
<rect x="20" y="300" width="860" height="0" fill="none"/>
<path d="M95,206 L95,296 Q95,306 105,306 L795,306 Q805,306 805,296 L805,222" fill="none" stroke="#B45555" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#m22-ar)"/>
<rect x="255" y="286" width="390" height="40" rx="10" fill="#FFF7F7"/>
<text x="450" y="312" text-anchor="middle" font-size="12.5" fill="#B45555" font-weight="700">写入侧：只有显式 remember() 能入档，防记忆投毒</text>
</svg>
<p class="caption">短期那第三层（当前会话的对话历史）不在这个体系里加工——它就在 loop 的 messages 列表中，随会话生灭。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>会话 1：用户说"我最近关心 cpu_usage 这个指标"。代码通过显式的 remember() 把这条偏好写进长期 KV。<small>写入是审查点：模型无权自动决定记什么——幻觉一旦入库，之后每次召回都在污染上下文。</small></p></div>
<div class="step"><span class="n">2</span><p>会话 2：用户问"帮我看看现在有什么异常"。消息一进来，第一件事不是回答，而是召回。<small>约定死的时机：user msg → 召回 → 拼进 system。</small></p></div>
<div class="step"><span class="n">3</span><p>recall 双路并发：KV 库按 cpu_usage 子串命中"用户关心 cpu_usage"；语义库按向量找语义相关的历史记录，每路最多取 3 条。<small>命中统一包成 key / value / score；两层库的 score 方向已统一为"越大越相关"。</small></p></div>
<div class="step"><span class="n">4</span><p>每条命中截到 200 字符，由调用方拼进 system prompt。<small>recall 只负责捞，不负责拼——怎么截断排版是应用层的策略，记忆库不替它决定。</small></p></div>
<div class="step"><span class="n">5</span><p>模型在 system 里看到"用户关心 cpu_usage"，于是优先检查这个指标作答。<small>要让这段记忆跨会话存活，建库时须传文件路径（如 agent.db）：默认 :memory: 内存库重启即丢。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3 层</b><span>短期 messages ＋ 长期 KV ＋ 长期语义，各司其职互不越界</span></div>
<div class="stat"><b>3 个</b><span>存储的公共操作：put / get / search，三层共用同一协议</span></div>
<div class="stat"><b>top_k=3</b><span>每层召回默认取回的最大条数</span></div>
<div class="stat"><b>200 字</b><span>召回结果拼进上下文前单条截断的上限</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>更新不发明新方法：KV 层 INSERT OR REPLACE、语义层 upsert——同一个 (namespace, key) 再写一次就是覆盖，全文件没有单独的 update 方法；"遗忘"目前只有 KV 层提供 delete，语义层尚未实现删除。</li>
<li>为什么简单 KV 查询别走向量库：两种检索解决的是不同问题，不是同一问题的两个档位。向量擅长"相关但字面不同"，查"上次 cpu_usage 这个精确键"反而不如一条 SQL 又准又快——混用属于过度工程。</li>
<li>默认配置（SQLite :memory: ＋ 不依赖 chromadb 的 mock 替身）让整套记忆系统零外部依赖就能跑；换真库只改注入参数，上层代码一行不动——这正是协议接口存在的意义。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>都塞进向量库不是省事吗？看起来还更"现代"？</dt><dd>省事是真，代价也是真：向量库做精确键匹配既慢又不准，用户偏好、上次指标这类必须查准的信息会经常漏。分层不是为了好看——精确查的精确查，语义查的语义查。</dd>
<dt>让模型顺手把对话总结存下来，不就是最自然的记忆方式？这样会有什么风险？</dt><dd>这正是要堵住的洞，叫记忆投毒：自动写入等于让模型决定记什么，幻觉一旦写进库，每次召回都会把它带回上下文，错误自我强化。所以唯一写入口是显式 remember()，写什么、何时写留在调用方手里。</dd>
<dt>memory.py 里怎么找不到短期记忆的代码？</dt><dd>因为短期那层根本不在里面——模块 docstring 写明它在 loop 的 messages 列表中。这里只管长期两层，外加把它们组织起来的 ThreeLayerMemory 入口。</dd>
</dl>

<h2>深入入口</h2>
<p>对应文字版：Day 11《Memory 三层记忆》，见课程 week2-reading/每日正文。想继续钻研记忆的分类（情景 / 语义 / 程序性）、防投毒与多租户隔离等话题，原文末尾给了延伸指路。</p>

<nav class="nav">
<a href="21-day10-todowrite.html">上一章：TodoWrite：计划与执行分离 ←</a>
<a href="23-day12-context-compress.html">下一章：Context 压缩：保留重点 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版 · 22 / 32</footer>
</div></body></html>
`;export{t as default};
