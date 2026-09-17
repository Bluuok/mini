const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 14 章 · 自动化引擎 · Craft Agents 图解精读</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#F8F7FE;color:#232733;line-height:1.75;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.crumb{font-size:13.5px;color:#8A8F9E;margin-bottom:8px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:13px}
h1{font-size:34px;line-height:1.2;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:26px}
h2{font-size:22px;margin:36px 0 10px;padding-top:18px;border-top:1px solid #E6E3F2}
.card{background:#fff;border:2.5px solid #232733;border-radius:18px;box-shadow:6px 6px 0 rgba(35,39,51,.10);padding:20px;margin:20px 0}
.analogy{background:#fff;border-left:5px solid var(--accent);border-radius:6px 14px 14px 6px;box-shadow:0 2px 12px rgba(35,39,51,.07);padding:18px 22px;margin:18px 0}
.analogy p{font-size:16.5px;color:#3A3F4E}
.analogy .tag{font-weight:800;color:var(--accent);font-size:14px;letter-spacing:.15em}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.card h3{font-size:19px;margin-bottom:5px}
.card p{font-size:16.5px;color:#4A5060}
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
.rel{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
.rel a{text-decoration:none;font-size:15px;background:#fff;border:1.5px solid var(--accent);color:var(--accent);border-radius:999px;padding:4px 14px}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:46px;font-weight:700;font-size:16px}
a{color:var(--accent)}
footer{margin-top:44px;color:#8A8F9E;font-size:14px;text-align:center}</style></head>
<body><div class="wrap">
<p class="crumb">第 14 章 / 23 · 权限与自动化 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 14 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>自动化引擎</h1>
<p class="lede">工作区里发生任何风吹草动——打标签、改权限、Agent 收工——管家都拿着一本 automations.json 规则手册比对，符合就派活：开新会话或发 Webhook。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一位按规章制度办事的大楼值班管家：进出刷卡、快件签收（事件）都记录在案；他的值机手册上写着——「晚上九点后有人进机房，立刻打电话叫值班工程师」（规则=事件+条件+动作）。手册是雇员编的、可以随时改写（automations.json 声明式配置），但派活之前必须过三道核对：在岗吗？符合时间吗？条件满足吗？三关全过才动手。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="发布订阅流水线"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="20" y="60" width="200" height="110" rx="14" fill="#eef1fb" stroke="#7C5CFC" stroke-width="3"/>
    <text x="120" y="100" text-anchor="middle" font-size="26">🛎️📡</text>
    <text x="120" y="130" text-anchor="middle" font-size="14.5" fill="#5b6478">事件不断涌入</text>
    <text x="120" y="153" text-anchor="middle" font-size="12.5" fill="#8a92a6">应用事件 + Agent 钩子事件</text>
    <rect x="300" y="60" width="230" height="110" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="415" y="98" text-anchor="middle" font-size="24">📋✅✅✅</text>
    <text x="415" y="126" text-anchor="middle" font-size="14.5" font-weight="700">匹配流水线三道关</text>
    <text x="415" y="152" text-anchor="middle" font-size="12.5" fill="#8a92a6">启用检查 → 正则/cron 匹配 → 条件评估</text>
    <rect x="640" y="25" width="220" height="66" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="750" y="52" text-anchor="middle" font-size="14.5" font-weight="700">💬 提示词动作</text>
    <text x="750" y="74" text-anchor="middle" font-size="12.5" fill="#5b6478">排队生成新的 Agent 会话</text>
    <rect x="640" y="130" width="220" height="66" rx="12" fill="#eef1fb" stroke="#7C5CFC" stroke-width="2.5"/>
    <text x="750" y="157" text-anchor="middle" font-size="14.5" font-weight="700">📤 Webhook 动作</text>
    <text x="750" y="179" text-anchor="middle" font-size="12.5" fill="#5b6478">向外发 HTTP，失败可重试</text>
    <line x1="222" y1="115" x2="296" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="532" y1="95" x2="636" y2="65" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="532" y1="135" x2="636" y2="160" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">整条链路是发布/订阅：三个处理器并行收听同一台事件总线，谁匹配谁执行。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>每分钟开头，调度器准时发出一个 SchedulerTick 心跳<small>SchedulerService 定时器是 cron 规则的时间骨架</small></p></div><div class="step"><span class="n">2</span><p>某条规则的三关依次过关：已启用、cron 表达式命中「工作日 09:00」、时间条件 after 09:00 且时区匹配<small>cron 走 croner 库求值；时区从条件逐级向上回退到系统本地时间</small></p></div><div class="step"><span class="n">3</span><p>提示词动作把 $VARIABLE 替换成事件里的 CRAFT_* 环境变量，解析 @mention，入队一个 PendingPrompt<small>模式、标签、模型等元数据随单携带，直接决定新会话的样子</small></p></div><div class="step"><span class="n">4</span><p>若改发 Webhook 而 endpoint 失败：当场指数退避重试，仍败则进重试队列<small>延迟重试固定三班：5 分钟、30 分钟、1 小时，最多 3 次</small></p></div><div class="step"><span class="n">5</span><p>这次执行写进 automations-history.jsonl 审计日志<small>每条规则留最近 20 条，全局封顶 1000 条</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>10/分</b><span>多数事件的限流上限；SchedulerTick 为 60/分</span></div><div class="stat"><b>3 次</b><span>Webhook 延迟重试上限：5 分→30 分→1 小时</span></div><div class="stat"><b>20 条</b><span>每个规则的执行历史保留量，全局最多 1000 条</span></div><div class="stat"><b>4KB</b><span>开启 captureResponse 时响应正文截断存档的上限</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>会话打标签、切权限模式不会凭空触发：引擎先对内存快照做逐字段差异比对，变了什么才发什么事件，加载旧会话则静默不发。</li>
<li>条件支持三种积木——挂钟与星期的时间条件、查新旧值的状态条件、and/or/not 的逻辑组合——最深嵌套 8 层（超 4 层告警）。</li>
<li>处理器用 Promise.allSettled 并行调用，单个处理器崩了不影响其他处理器；preToolUse 校验还能在你保存前拦下写坏的 automations.json。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>Webhook 把数据往外发，会不会顺手泄密？</dt><dd>有多层护栏：URL 强制 http:/https: 协议、日志里只留协议和主机名、环境变量扩展仅限受控的 CRAFT_* 命名空间而不用原始 process.env。边界要说清：它不保护的是「你自己在 URL 或请求体里明文塞进去的密钥」，以及接收端如何处置数据。</dd>
<dt>自动化会不会被高频事件刷爆？</dt><dd>事件总线内置滑动窗口限流：普通事件每分钟 10 个、SchedulerTick 每分钟 60 个，配合 per-source 每分钟 30 个请求的 Webhook 限速兜底。</dd>
<dt>手滑写错配置会弄坏系统吗？</dt><dd>Zod Schema 先审结构，再验跨字段约束与标签 ID；规则缺 ID 会自动补上 6 位十六进制并写回磁盘。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../自动化引擎_lukilabs_craft-agents-oss/自动化引擎_lukilabs_craft-agents-oss.md">自动化引擎</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="13-quan-xian-mo-shi.html">第 13 章 · 权限模式系统</a><a href="15-electron-zhu-jin-cheng.html">第 15 章 · Electron 主进程</a></div>

<nav class="nav">
<a href="13-quan-xian-mo-shi.html">上一章：权限模式系统 ←</a>
<a href="index.html">返回目录</a>
<a href="15-electron-zhu-jin-cheng.html">下一章：Electron 主进程 →</a>
</nav>
<footer>Craft Agents 图解精读 · 14 / 23</footer>
</div></body></html>
`;export{t as default};
