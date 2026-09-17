const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#EA580C">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 23 章 · Context 压缩：保留重点 · 三十天速成计划 图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#FDF7F2;color:#232733;line-height:1.75;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.crumb{font-size:13.5px;color:#8A8F9E;margin-bottom:8px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:13px}
h1{font-size:34px;line-height:1.2;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:26px}
h2{font-size:22px;margin:36px 0 10px;padding-top:18px;border-top:1px solid #F2E2D6}
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
<span class="chip">第 23 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>Context 压缩：保留重点</h1>
<p class="lede">Agent 跑上几十轮，messages 膨胀到几万 token：要么超窗口报错，要么成本飙升。得压缩——但压太狠会丢掉系统约束，模型开始行为漂移。这一章讲清楚怎么压才不闯祸。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像整理会议室白板：安全守则和纪律条款是钉在墙上的一页纸，动都不动；最近的讨论保留原样；更早的讨论擦掉前先誊成一页纪要，贴在守则旁边。而最常见的错误做法恰恰是从板边一路擦过去——头一板就是那页守则。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 900 340" role="img" aria-label="压缩流水线：估算、抽system、分桶处理"><defs><marker id="m23-ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="20" y="130" width="150" height="86" rx="14" fill="#FEF0E4" stroke="#232733" stroke-width="2.5"/>
<text x="95" y="163" text-anchor="middle" font-size="14" font-weight="700">估算 token</text>
<text x="95" y="187" text-anchor="middle" font-size="11.5" fill="#5b6478">中文字≈2 token 粗估</text>
<text x="95" y="205" text-anchor="middle" font-size="11.5" fill="#B05C22">tool_calls 也算</text>
<rect x="215" y="122" width="150" height="100" rx="14" fill="#fff" stroke="#EA580C" stroke-width="3"/>
<text x="290" y="155" text-anchor="middle" font-size="14" font-weight="700">超过阈值？</text>
<text x="290" y="180" text-anchor="middle" font-size="11.5" fill="#5b6478">默认 6000</text>
<text x="290" y="200" text-anchor="middle" font-size="11.5" fill="#B05C22">没超就原样返回</text>
<rect x="405" y="30" width="190" height="70" rx="14" fill="#FFF3E8" stroke="#EA580C" stroke-width="3"/>
<text x="500" y="58" text-anchor="middle" font-size="13.5" font-weight="700">① 先抽出 system</text>
<text x="500" y="82" text-anchor="middle" font-size="11.5" fill="#B05C22">铁律：单独保管，永不裁剪</text>
<rect x="405" y="130" width="190" height="84" rx="14" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="500" y="158" text-anchor="middle" font-size="13.5" font-weight="700">② 最近几条保留</text>
<text x="500" y="182" text-anchor="middle" font-size="11.5" fill="#5b6478">原样留下当前上下文</text>
<text x="500" y="200" text-anchor="middle" font-size="11.5" fill="#B05C22">超长工具结果先截到 2000 字符</text>
<rect x="405" y="240" width="190" height="90" rx="14" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="500" y="266" text-anchor="middle" font-size="13.5" font-weight="700">③ 旧消息二选一</text>
<text x="500" y="289" text-anchor="middle" font-size="11.5" fill="#5b6478">截断：纯本地零成本丢细节</text>
<text x="500" y="308" text-anchor="middle" font-size="11.5" fill="#B05C22">摘要：一次 LLM 调用 ≤200 字</text>
<rect x="660" y="120" width="215" height="104" rx="14" fill="#FEF0E4" stroke="#EA580C" stroke-width="3"/>
<text x="767" y="150" text-anchor="middle" font-size="14" font-weight="700">组装新列表</text>
<text x="767" y="174" text-anchor="middle" font-size="11.5" fill="#5b6478">[system ＋ 历史摘要] ＋ 最近几条</text>
<text x="767" y="197" text-anchor="middle" font-size="11.5" fill="#B05C22">摘要失败自动降级为截断</text>
<line x1="170" y1="173" x2="209" y2="173" stroke="#232733" stroke-width="3.5" marker-end="url(#m23-ar)"/>
<line x1="365" y1="160" x2="397" y2="85" stroke="#232733" stroke-width="3" marker-end="url(#m23-ar)"/>
<line x1="384" y1="172" x2="397" y2="172" stroke="#232733" stroke-width="3" marker-end="url(#m23-ar)"/>
<line x1="384" y1="186" x2="397" y2="260" stroke="#232733" stroke-width="3" marker-end="url(#m23-ar)"/>
<line x1="595" y1="72" x2="654" y2="140" stroke="#232733" stroke-width="3" marker-end="url(#m23-ar)"/>
<line x1="595" y1="185" x2="654" y2="175" stroke="#232733" stroke-width="3" marker-end="url(#m23-ar)"/>
<line x1="595" y1="278" x2="654" y2="204" stroke="#232733" stroke-width="3" marker-end="url(#m23-ar)"/>
<path d="M290,230 L290,320 Q290,330 300,330 L500,330 Q510,330 510,320 L510,336" fill="none" stroke="#B05C22" stroke-width="2" stroke-dasharray="6 5"/>
<text x="400" y="323" text-anchor="middle" font-size="12" fill="#B05C22" font-weight="700">每轮检查很便宜，超阈值那一轮才真动手</text>
</svg>
<p class="caption">一条流水线走完："要不要压"由阈值决定，"怎么压"在剩余消息上动手——两个决策拆开，分别调测。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>Agent 已跑几十轮（演示数据 30 轮就有近 90 条消息）。先用启发式粗算当前 messages 的 token。<small>不求精确、够触发判断即可——为精确引入 tokenizer 甚至联网依赖，不值；工具调用的 arguments 是一大段 JSON，漏算会让压缩永远不触发。</small></p></div>
<div class="step"><span class="n">2</span><p>没超过阈值（默认 6000）就原样返回、什么都不做。<small>"别每轮都压"的代码形态：每轮调检查函数很便宜，只有超阈值的那一轮才真正动手。</small></p></div>
<div class="step"><span class="n">3</span><p>动手第一步是把第一条 system message 抽出来单独保管。<small>这就是"从最旧开始丢"之所以错误的解药：行为约束被物理隔离后，任何裁剪逻辑都碰不到它。</small></p></div>
<div class="step"><span class="n">4</span><p>剩余消息分两桶：最近几条原样保留，旧消息要么丢弃（截断），要么交给模型压成不超过 200 字的历史摘要。<small>摘要调用固定 temperature=0、max_tokens=300——要稳定复述不要发散创作；失败则自动降级回截断，绝不拖垮 loop。</small></p></div>
<div class="step"><span class="n">5</span><p>组装返回：system 与历史摘要合成同一条开头，后面接最近几条；省了多少 token 记进结果结构里随时可打印。<small>返回的是全新列表而非就地删改——调用方还想拿原始数据写日志、对比压前压后，主动权留在调用方手里。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>6000</b><span>token 触发阈值默认值：超过才压缩</span></div>
<div class="stat"><b>6 条</b><span>截断策略默认保留的最近消息数</span></div>
<div class="stat"><b>2000 字符</b><span>超长工具结果就地截断的上限</span></div>
<div class="stat"><b>≤200 字</b><span>摘要长度上限（调用硬顶 max_tokens=300）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>上下文 ≠ 记忆：上下文是单次调用拼进 messages 的内容，记忆是跨调用持久化的信息。压缩只瘦身当前 messages 列表，不往记忆库写东西——把它当成"遗忘/写记忆"是最常踩的概念坑。</li>
<li>三种策略激进程度递增：截断（纯本地零成本、丢中间细节）→ 摘要（多付一次 LLM 调用、仍会丢细节）→ 召回（每次检索、相关性判断不稳）。没有免费午餐，按场景选。</li>
<li>压缩永远不该成为 loop 的故障点：压缩是辅助逻辑，它出错要降级而不是上抛异常让主流程崩掉。代价是降级本身有损，长期频繁截断同样造成信息丢失，需配套监控与熔断意识。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>从最旧的消息开始丢听起来最公平，为什么说是错的？</dt><dd>因为 messages 列表最前面的正是 system prompt——承载行为约束的部分。丢了它模型失去约束开始"自由发挥"，越早发现越难排查。正确做法永远是先抽 system 再对剩余动手。</dd>
<dt>既然摘要比截断聪明，是不是该一直用摘要？</dt><dd>质疑得有道理但答案是否定的：每次摘要都是实打实的一次 LLM 调用与延迟，且摘要本身也丢细节。有东西可压时才付这笔钱；对话本来就短时直接原样返回，连模型都不必惊动。</dd>
<dt>压得太狠又有什么后果？</dt><dd>压太狠丢的是约束与关键事实，模型行为漂移；不压则是超窗口报错或成本飙升。压缩本质上是权衡——保 system 铁律 ＋ 阈值触发，是在两个坏结果之间守住下限。</dd>
</dl>

<h2>深入入口</h2>
<p>对应文字版：Day 12《Context 压缩》，见课程 week2-reading/每日正文。想继续钻研上下文分层、KV Cache 友好的压缩、以子 agent 隔离代替压缩等话题，原文末尾给了延伸指路。</p>

<nav class="nav">
<a href="22-day11-memory.html">上一章：Memory：三层记忆 ←</a>
<a href="24-day13-langgraph.html">下一章：LangGraph 工作流编排 →</a>
</nav>
<footer>三十天速成计划 · 图解小白版 · 23 / 32</footer>
</div></body></html>
`;export{t as default};
