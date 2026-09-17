const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C3AED">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第13章 · Prompt 工程：把话说清楚 · 三十天速成计划 图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#FFF9F0;color:#232733;line-height:1.7;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.crumb{font-size:14.5px;color:#8A8F9E;margin-bottom:14px}
.crumb b{color:var(--accent)}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:15px}
h1{font-size:32px;line-height:1.25;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:26px}
h2{font-size:23px;margin:34px 0 8px}
.card{background:#fff;border:2.5px solid #232733;border-radius:18px;box-shadow:6px 6px 0 rgba(35,39,51,.10);padding:20px;margin:20px 0}
.card p{font-size:16.5px;color:#4A5060;margin:6px 0}
.chip{display:inline-block;border:3px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 16px;font-weight:700}
svg{width:100%;height:auto;display:block;margin:16px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}
.num{font-size:30px;font-weight:800;color:var(--accent)}
.num small{display:block;font-size:15px;font-weight:400;color:#4A5060;line-height:1.5;margin-top:4px}
.step{display:flex;gap:12px;margin:15px 0;align-items:flex-start}
.step .n{flex:0 0 34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px}
.step p{font-size:16.5px;color:#3A3F4E}
.step .note{display:block;font-size:14.5px;color:#8A8F9E}
.more{padding-left:24px}
.more li{margin:9px 0;font-size:16.5px;color:#3A3F4E}
.qa{margin:14px 0}
.qa b{color:#232733}
.qa p{font-size:16.5px;color:#4A5060;margin-top:2px}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:46px;font-weight:700;font-size:16px}
a{color:var(--accent)}
footer{margin-top:44px;color:#8A8F9E;font-size:14px;text-align:center}
</style></head>
<body><div class="wrap">
<p class="crumb">AI 应用开发工程师三十天速成计划 · <b>Week 1</b> · 给想建立直觉的初学者</p>
<span class="chip">第 13 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>Prompt 工程：把话说清楚</h1>
<p class="lede">模型的输出经常不是给人看，而是给下一段程序看的——prompt 是一份协议，输出要过格式关和内容关两道关。</p>

<h2>先打个比方</h2>
<p>好 prompt 更像一张写了填写规范的申报表：每一栏标清字段名、格式和「没有就填 null」，而不是一句客气的口头拜托。收表的程序只有拿到口径一致的表才能逐格比对；一团自然语言它一格也读不了。</p>

<h2>全景图解</h2>
<div class="card">
<svg viewBox="0 0 900 640" role="img" aria-label="从协议到评分的抽取链路：协议、样例、调用模型、两道关卡与逐字段打分">
  <defs>
    <marker id="d2-arw" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M2,2 L10,6 L2,10 z" fill="#232733"/></marker>
  </defs>
  <rect x="28" y="20" width="270" height="176" rx="14" fill="#F5F3FF" stroke="#7C3AED" stroke-width="3"/>
  <text x="163" y="50" text-anchor="middle" font-size="18" font-weight="bold" fill="#5B21B6">SYSTEM_PROMPT＝协议</text>
  <text x="48" y="82" font-size="15.5" fill="#4C1D95">角色｜你是发票抽取器</text>
  <text x="48" y="108" font-size="15.5" fill="#4C1D95">任务｜提取 6 个字段</text>
  <text x="48" y="134" font-size="15.5" fill="#4C1D95">输出格式｜只输出 JSON</text>
  <text x="48" y="160" font-size="15.5" fill="#4C1D95">约束｜原文没有就填 null</text>
  <text x="163" y="186" text-anchor="middle" font-size="13.5" fill="#8B8BA0">放 system 角色，只发一次全轮生效</text>
  <line x1="302" y1="108" x2="352" y2="108" stroke="#232733" stroke-width="3" marker-end="url(#d2-arw)"/>
  <rect x="356" y="20" width="264" height="176" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="488" y="50" text-anchor="middle" font-size="18" font-weight="bold" fill="#232733">few-shot 样例（2 条）</text>
  <text x="372" y="82" font-size="14" fill="#4A5060">标准样例：锚定「什么算对」</text>
  <text x="372" y="106" font-size="14" fill="#4A5060">边界样例集中三个易错点：</text>
  <text x="384" y="130" font-size="14" fill="#4A5060">缺字段 · 中文大写金额 · 日期不规范</text>
  <text x="488" y="162" text-anchor="middle" font-size="13.5" fill="#8A8F9E">user 给样例文本 → assistant 回 JSON</text>
  <text x="488" y="186" text-anchor="middle" font-size="13.5" fill="#8A8F9E">最后一条 user 才是真问题</text>
  <line x1="624" y1="108" x2="674" y2="108" stroke="#232733" stroke-width="3" marker-end="url(#d2-arw)"/>
  <rect x="678" y="24" width="194" height="168" rx="14" fill="#EFF6FF" stroke="#2563EB" stroke-width="3"/>
  <text x="775" y="58" text-anchor="middle" font-size="17" font-weight="bold" fill="#1E40AF">调模型（Day 1 入口）</text>
  <text x="775" y="92" text-anchor="middle" font-size="13" fill="#1E3A8A">response_format=</text>
  <text x="775" y="112" text-anchor="middle" font-size="13" fill="#1E3A8A">json_object（格式保障）</text>
  <text x="775" y="140" text-anchor="middle" font-size="13" fill="#1E3A8A">temperature=0 · max_tokens=512</text>
  <text x="775" y="172" text-anchor="middle" font-size="13.5" fill="#8A8F9E">评测场景永远优先确定性</text>
  <line x1="775" y1="196" x2="775" y2="240" stroke="#232733" stroke-width="3" marker-end="url(#d2-arw)"/>
  <text x="490" y="272" text-anchor="middle" font-size="17" font-weight="bold" fill="#232733">输出的 JSON 要连过两道关，「能解析」≠「答案正确」</text>
  <line x1="775" y1="288" x2="775" y2="308" stroke="#232733" stroke-width="3" marker-end="url(#d2-arw)"/>
  <rect x="452" y="312" width="420" height="104" rx="14" fill="#FFF7ED" stroke="#F59E0B" stroke-width="3"/>
  <text x="474" y="344" font-size="17" font-weight="bold" fill="#B45309">第一道关：json.loads 格式关</text>
  <text x="474" y="372" font-size="15" fill="#92400E">解析不成 JSON → 记「JSON 解析失败」</text>
  <text x="474" y="398" font-size="15" fill="#92400E">两类错误分开记，评测时才能精确归因</text>
  <line x1="446" y1="364" x2="396" y2="364" stroke="#232733" stroke-width="3" marker-end="url(#d2-arw)"/>
  <rect x="28" y="312" width="364" height="128" rx="14" fill="#FEF2F2" stroke="#EF4444" stroke-width="3"/>
  <text x="48" y="344" font-size="17" font-weight="bold" fill="#B91C1C">第二道关：Invoice 业务校验</text>
  <text x="48" y="372" font-size="15" fill="#7F1D1D">发票号必须恰好 8 位数字</text>
  <text x="48" y="396" font-size="15" fill="#7F1D1D">金额、税额不能为负；日期统一 YYYY-MM-DD</text>
  <text x="48" y="422" font-size="15" fill="#7F1D1D">不满足 → 记「业务校验失败」，进业务前拦下</text>
  <line x1="210" y1="444" x2="210" y2="480" stroke="#232733" stroke-width="3" marker-end="url(#d2-arw)"/>
  <rect x="28" y="484" width="552" height="120" rx="14" fill="#ECFDF5" stroke="#059669" stroke-width="3"/>
  <text x="52" y="516" font-size="17" font-weight="bold" fill="#065F46">grade：逐字段严格比对标准答案</text>
  <text x="52" y="546" font-size="15" fill="#065F46">每个字段与人工标注 expected 严格相等才算对</text>
  <text x="52" y="572" font-size="15" fill="#065F46">出错整条记 0 分；输出形如「正确 4/6」，一眼看出错在哪</text>
  <text x="52" y="594" font-size="13.5" fill="#6B7280">评分标准写死在程序里，不让模型自评</text>
  <rect x="600" y="484" width="272" height="120" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="622" y="516" font-size="17" font-weight="bold" fill="#232733">账本照记</text>
  <text x="622" y="546" font-size="15" fill="#4A5060">每个样本打印字段级得分，</text>
  <text x="622" y="570" font-size="15" fill="#4A5060">成本随行记账；few-shot 多塞样例</text>
  <text x="622" y="594" font-size="15" fill="#4A5060">token 更高——改动要能量化</text>
</svg>
</div>

<h2>走一遍真实场景</h2>
<div class="step"><div class="n">1</div><p>把任务写成协议：角色（发票抽取器）、任务（提取 6 个字段）、输出格式（只输出 JSON）、约束（原文没有就填 null）。<span class="note">协议放在 system 角色里——一次对话的全局行为边界，正是上一章结论的延续。</span></p></div>
<div class="step"><div class="n">2</div><p>build_messages 把样例伪装成一问一答塞进消息列表：user 发样例原文，assistant 回标准 JSON。<span class="note">模型只认对话格式；不转义中文，保证样例可读。</span></p></div>
<div class="step"><div class="n">3</div><p>调模型时开 JSON mode（response_format=json_object），temperature=0 保证评测可复现。它把「输出格式」从 prompt 约束升级为平台级保证——但只保格式。</p></div>
<div class="step"><div class="n">4</div><p>extract_invoice 连过两道关：先 json.loads 验格式，再 Invoice 模型验业务规则。两道 try 分开写，错误前缀不同，失败也能精确归因。<span class="note">就算 JSON 合法，amount 带「元」或 date 是原始中文格式也过不了第二道。</span></p></div>
<div class="step"><div class="n">5</div><p>grade 与标准答案逐字段严格相等才算对，答案与被测对象分离；每个样本同时打印字段级得分和调用成本。</p></div>

<h2>值得记住的数字</h2>
<div class="grid">
  <div class="card"><div class="num">6 个字段<small>协议里的 invoice_no / seller / buyer / amount / tax / date，每个都带类型 + 规则</small></div></div>
  <div class="card"><div class="num">2 条样例<small>一条标准 + 一条边界就钉死三个易错点——价值在覆盖边界，不在数量</small></div></div>
  <div class="card"><div class="num">4 条样本<small>三种典型输入 + 一个故意设计的负例，验证坏输入真的会被拦下</small></div></div>
  <div class="card"><div class="num">8 位数字<small>发票号的正则校验规则；金额 ge=0 不许为负</small></div></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
  <li>CoT 在生产里的用法是「内部推理、最终只输出 JSON」：长篇推理文本是下游解析的头号杀手，不要把它直接喂给下一段代码。</li>
  <li>结构化输出不止一种做法：JSON mode / schema 最稳但要业务校验；Pydantic + Instructor 带类型校验和重试；XML tag 边界清楚但约束弱于 schema。</li>
  <li>负例不是凑数：没有那条「5 位号码 + 负金额」的故意坑，评测会显得什么都能过。格式错和内容错是两类问题，评分要分开记录。</li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><b>Q：prompt 是不是写得越长越稳？</b><p>不是。样例的价值在覆盖边界不在堆数量，坏样例只是浪费 token；真正影响稳定性的是输出格式和约束这两块——它们最容易被漏。</p></div>
<div class="qa"><b>Q：已经开了 JSON mode，为什么还要 pydantic 再验一遍？</b><p>JSON mode 只保证语法合法。"amount": "1130 元"、"date": "2025年3月14日" 都能通过 json.loads，却通不过业务规则——「格式对」和「内容对」是两类问题。</p></div>
<div class="qa"><b>Q：让模型自己检查一遍输出再交上来，不是更省事吗？</b><p>这等于让考生给自己打分。评测的标准答案必须来自人工标注并与模型输出严格比对，自评不是评测，是表演。</p></div>

<h2>深入入口</h2>
<p>对应文字版：Day 02《Prompt 工程与结构化输出》，见课程 week1-reading/每日正文。文中附有 v1→v2→v3 三版 prompt 的推演题与完整的 196 行代码走读；想深入注入防御与 prompt cache 的权衡，原文给了通往八股·09 Prompt 工程的路标。</p>

<div class="nav">
  <a href="12-day01-llm-api.html">← LLM API 基础：请求、响应与 Token</a>
  <a href="14-day03-agent-paradigm.html">Agent 范式：从一次调用到循环 →</a>
</div>
<footer>三十天速成计划 · 图解小白版</footer>
</div></body></html>
`;export{t as default};
