const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#2563EB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第12章 · LLM API 基础：请求、响应与 Token · 三十天速成计划 图解</title>
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
<span class="chip">第 12 章 · 共 32 章</span>
<p class="kicker">速成计划 图解</p>
<h1>LLM API 基础：请求、响应与 Token</h1>
<p class="lede">把大模型从「网页里聊天的机器人」变成程序可以调用的服务：输入什么、返回什么、花多少钱，一次看清。</p>

<h2>先打个比方</h2>
<p>调大模型像打一通付费电话：拨号前的准备就是你的请求——说什么（消息列表）、语气怎么定（参数）、最多说多久（上限）；挂断后服务商送来一张话单——本次说了多少 token、折多少钱。每通电话都是从头开始，没有客服记得你上次说过什么。</p>

<h2>全景图解</h2>
<div class="card">
<svg viewBox="0 0 900 610" role="img" aria-label="一次 LLM API 调用：请求组装、模型返回、成本账本与 token 计量">
  <defs>
    <marker id="d1-arw" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M2,2 L10,6 L2,10 z" fill="#232733"/></marker>
  </defs>
  <rect x="28" y="20" width="304" height="158" rx="14" fill="#EFF6FF" stroke="#2563EB" stroke-width="3"/>
  <text x="180" y="50" text-anchor="middle" font-size="19" font-weight="bold" fill="#1E40AF">你的程序：组装输入</text>
  <rect x="48" y="66" width="264" height="32" rx="8" fill="#fff" stroke="#93C5FD"/>
  <text x="64" y="88" font-size="15" fill="#232733">system｜行为边界：一句话回答</text>
  <rect x="48" y="104" width="264" height="32" rx="8" fill="#fff" stroke="#93C5FD"/>
  <text x="64" y="126" font-size="15" fill="#232733">user｜用户的真实问题</text>
  <text x="180" y="162" text-anchor="middle" font-size="15" fill="#475569">temperature=0.2 · max_tokens=256</text>
  <line x1="336" y1="99" x2="392" y2="99" stroke="#232733" stroke-width="3" marker-end="url(#d1-arw)"/>
  <rect x="396" y="42" width="216" height="112" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="504" y="80" text-anchor="middle" font-size="19" font-weight="bold" fill="#232733">大语言模型</text>
  <text x="504" y="106" text-anchor="middle" font-size="15" fill="#4A5060">概率生成器 · 无状态</text>
  <text x="504" y="130" text-anchor="middle" font-size="14.5" fill="#8A8F9E">每次调用都从零开始</text>
  <line x1="616" y1="99" x2="672" y2="99" stroke="#232733" stroke-width="3" marker-end="url(#d1-arw)"/>
  <rect x="676" y="20" width="196" height="158" rx="14" fill="#ECFDF5" stroke="#059669" stroke-width="3"/>
  <text x="774" y="52" text-anchor="middle" font-size="19" font-weight="bold" fill="#065F46">LLMResponse</text>
  <text x="692" y="82" font-size="15" fill="#065F46">text｜生成的正文</text>
  <text x="692" y="108" font-size="15" fill="#065F46">input / output tokens</text>
  <text x="692" y="134" font-size="15" fill="#065F46">model｜实际用的模型名</text>
  <text x="692" y="160" font-size="13.5" fill="#6B7280">六个字段一次打包带出</text>
  <line x1="774" y1="182" x2="774" y2="222" stroke="#232733" stroke-width="3" marker-end="url(#d1-arw)"/>
  <text x="800" y="208" font-size="14.5" fill="#475569">用量入账</text>
  <rect x="28" y="226" width="844" height="92" rx="14" fill="#FFF7ED" stroke="#F59E0B" stroke-width="3"/>
  <text x="450" y="258" text-anchor="middle" font-size="19" font-weight="bold" fill="#B45309">成本账本 cost.from_usage</text>
  <text x="450" y="290" text-anchor="middle" font-size="16" fill="#92400E">(input_tokens × 输入单价 ＋ output_tokens × 输出单价) ÷ 1,000,000 ＝ 本次花费（元）</text>
  <line x1="220" y1="354" x2="220" y2="388" stroke="#232733" stroke-width="3" marker-end="url(#d1-arw)"/>
  <text x="240" y="376" font-size="14.5" fill="#475569">token 是怎么算出来的？</text>
  <rect x="28" y="392" width="844" height="96" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
  <text x="52" y="424" font-size="17" font-weight="bold" fill="#232733">token：tokenizer 切出的最小处理单位，它影响三件事</text>
  <circle cx="62" cy="452" r="6" fill="#2563EB"/>
  <text x="78" y="458" font-size="15.5" fill="#4A5060">上下文容量｜system、历史、工具结果都要占 token</text>
  <circle cx="62" cy="476" r="6" fill="#2563EB"/>
  <text x="78" y="482" font-size="15.5" fill="#4A5060">延迟｜越长响应越慢　　成本｜每一分钱都按它算</text>
  <rect x="28" y="512" width="412" height="84" rx="14" fill="#FEF2F2" stroke="#EF4444" stroke-width="2.5"/>
  <text x="52" y="544" font-size="16.5" font-weight="bold" fill="#B91C1C">属性一：概率性</text>
  <text x="52" y="572" font-size="15" fill="#7F1D1D">同样输入，输出可能不同；参数只调发散程度</text>
  <rect x="460" y="512" width="412" height="84" rx="14" fill="#FEF2F2" stroke="#EF4444" stroke-width="2.5"/>
  <text x="484" y="544" font-size="16.5" font-weight="bold" fill="#B91C1C">属性二：无状态</text>
  <text x="484" y="572" font-size="15" fill="#7F1D1D">「记忆」靠你把历史消息重新放进上下文</text>
</svg>
</div>

<h2>走一遍真实场景</h2>
<div class="step"><div class="n">1</div><p>程序组装输入：消息列表（system 定行为边界、user 放问题）加两个参数。<span class="note">temperature=0.2 是「稳定为主、略带变化」的折中值；max_tokens=256 同时是生成长度与成本上限。</span></p></div>
<div class="step"><div class="n">2</div><p>_client() 从环境变量读取密钥和接口地址；缺配置直接报错退出，绝不带着空密钥发必失败的请求。<span class="note">失败要失败得早、失败得清楚——这是 Week 1 的底线约定。</span></p></div>
<div class="step"><div class="n">3</div><p>client.chat.completions.create() 发出真正的网络请求。前面全是准备，到这一步才花钱。</p></div>
<div class="step"><div class="n">4</div><p>拿回 LLMResponse：文本、三段用量、模型名、原始对象六个字段一次打包。<span class="note">部分服务商不回传 usage，缺字段记 0 而不是报异常——账本不能断。</span></p></div>
<div class="step"><div class="n">5</div><p>from_usage 把用量换算成金额并打印三行输出：正文、分隔线、模型名 + 成本。从 Day 1 起养成记账习惯。</p></div>

<h2>值得记住的数字</h2>
<div class="grid">
  <div class="card"><div class="num">0.2<small>默认采样温度：「稳定为主、略带变化」，比 SDK 宽松默认更有主见</small></div></div>
  <div class="card"><div class="num">1024<small>默认 max_tokens 上限——既是生成长度，也是成本上限</small></div></div>
  <div class="card"><div class="num">6 个字段<small>LLMResponse 一次打包：文本、三段用量、模型名、原始对象</small></div></div>
  <div class="card"><div class="num">每 100 万 token<small>单价的环境变量口径，换算公式只是小学算术 ÷ 1,000,000</small></div></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
  <li>为什么全周共用一个 call_model？如果每篇代码各写一遍调用，默认值和错误处理会七处八个样；tools 与 response_format 两个参数今天留 None，却是给 Day 2 和 Day 4 预留的通道——单一入口是工程代码的常态。</li>
  <li>缺配置抛的是 SystemExit 而不是普通异常：CLI 场景下这是「程序没法继续」的硬错误，以非零码退出更诚实，shell 脚本能据此判断成败。</li>
  <li>max_tokens 不是建议而是硬顶：Day 3 的循环每一轮都在花钱，没有这个上限会烧钱失控。默认值服务于未来的调用方，不只是今天的舒适。</li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><b>Q：把 temperature 调到 0，模型就不胡说了吧？</b><p>不能。温度只控制采样时的发散程度，不补知识、不保证事实正确；即使调到最稳，也不能把它当成绝对确定的函数。事实信息要靠你在程序里查好放进上下文。</p></div>
<div class="qa"><b>Q：多轮对话里模型「记得」之前说的话吗？</b><p>不记得。模型本身无状态，「记得之前说过什么」是你把历史消息重新放回上下文实现的——记忆是被你拼进去的，不是模型自带的。</p></div>
<div class="qa"><b>Q：只是打印回复、不记 usage，能省事不少吧？</b><p>省下的账单迟早要还：没有 usage，你就无法解释一次任务为什么变慢变贵，也无法对比两版 prompt 的消耗差异。不知道单价可以先记 0，但字段必须保留。</p></div>

<h2>深入入口</h2>
<p>对应文字版：Day 01《LLM API 基础》，见课程 week1-reading/每日正文。Week 0 已经铺垫过「模型输出并非绝对确定」和 Token 的雏形概念，本章把它们接上正题：确定性交给参数与约束去管理，Token 变成一笔一笔记下来的账。</p>

<div class="nav">
  <a href="11-terminal-hands-on.html">← 终端实操：会跑命令会报错</a>
  <a href="13-day02-prompt.html">Prompt 工程：把话说清楚 →</a>
</div>
<footer>三十天速成计划 · 图解小白版</footer>
</div></body></html>
`;export{t as default};
