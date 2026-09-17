const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 18 章 · 会话队列与并发控制 · HappyClaw 图解精读</title>
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
<p class="crumb">第 18 章 / 30 · 核心运行时 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 18 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>会话队列与并发控制</h1>
<p class="lede">同一个会话家族的消息永远排成单列、串行通过唯一的 Runner；入口闸机按"互斥 → 容量 → 计费"三层放行，别的工作区照常并行，失败的任务按指数退避重试。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像医院里的专用手术室：同一间手术室（串行化键，通常是同一个工作文件夹）同一时间只做一台手术，后面的按顺序排号；院长层面另有两本账——全院最多同时开几间手术（全局容器容量上限）、每位医生自费额度够不够（计费门控）。遇到要消毒换班（安全敏感变更，比如改插件配置），管理台按下同步锁把整条队列先停住再动手，免得换刀片换到一半又开一刀。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="队列准入与退避"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="78" width="170" height="84" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="109" y="112" text-anchor="middle" font-size="20">📨 + ⏰</text>
    <text x="109" y="140" text-anchor="middle" font-size="13" font-weight="700">新消息 / 定时任务</text>
    <rect x="252" y="14" width="238" height="56" rx="12" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="371" y="38" text-anchor="middle" font-size="13" font-weight="700">闸① 同车道已有车？排队等</text>
    <text x="371" y="58" text-anchor="middle" font-size="11" fill="#8a92a6">留下哨兵，前任退出自动交接</text>
    <rect x="252" y="92" width="238" height="56" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="371" y="116" text-anchor="middle" font-size="13" font-weight="700">闸② 全院手术室没满？</text>
    <text x="371" y="136" text-anchor="middle" font-size="11" fill="#5b6478">默认最多 20 个容器并行</text>
    <rect x="252" y="168" width="238" height="52" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="371" y="190" text-anchor="middle" font-size="13" font-weight="700">闸③ 医生额度够？</text>
    <text x="371" y="210" text-anchor="middle" font-size="11" fill="#8a92a6">计费开启时才启用</text>
    <rect x="552" y="82" width="304" height="76" rx="14" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="704" y="112" text-anchor="middle" font-size="20">🚦 → 🏃</text>
    <text x="704" y="140" text-anchor="middle" font-size="13.5" font-weight="700">立即启动 Runner</text>
    <line x1="196" y1="104" x2="244" y2="46" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="196" y1="118" x2="244" y2="118" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="196" y1="132" x2="244" y2="190" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="492" y1="120" x2="544" y2="120" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">三道闸顺序放行，任何一道不过就排队而非报错；Host 模式豁免闸②③，只认串行化键这一条硬规矩。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>消息先试热注入：Runner 还活着就把内容递进去合并成一次提问<small>@ 群里连续转发加评论这类输入会在处理中自然并成一条</small></p></div><div class="step"><span class="n">2</span><p>打不上热的走冷启动闸机：关停中拒绝 → 已删会话丢弃 → 变更暂停门先扣下<small>每一级都有明确的拒绝理由，绝不静默吞掉</small></p></div><div class="step"><span class="n">3</span><p>同车道已有活跃 Runner：排队并留下交接哨兵<small>#agent: 子代理和 #task: 定时任务解析为独立车道，各有自己的 Runner</small></p></div><div class="step"><span class="n">4</span><p>处理失败按指数退避重试，最多 5 次，超限发失败通知<small>重试批次被快照钉死，之后到达的新消息不会被冤枉进失败批</small></p></div><div class="step"><span class="n">5</span><p>定时巡检卡死的 Runner：先探测 CPU 活跃度，再核对身份没漂移，才敢重启<small>探测是异步的，期间出现新情况旧决策即刻作废</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>20 个</b><span>容器并发默认上限（Container 模式）</span></div><div class="stat"><b>×2</b><span>指数退避倍率：5s → 10s → 20s → 40s → 80s</span></div><div class="stat"><b>5 次</b><span>最大重试次数，超限通知用户</span></div><div class="stat"><b>10 分钟</b><span>IPC 债务绝对上限，到期直接重启</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>变更暂停门比直觉更快：在相关操作第一次等待之前就同步暂停整个家族的工作，从源头堵住"旧运行时代理收到新策略消息"的窗口。</li><li>停止容器靠握手不靠猜：停止方一直等到执行方真正收尾复位才返回，之后还有 30 秒冷却窗防止刚停就复活。</li><li>误杀要先看证据：容器内看不到进程 CPU 就先缓一缓不做处置。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>失败的批重试好几遍，会不会同一条消息跑两遍、回复两份？</dt><dd>不会。每轮重试的消费范围被不可变批次快照钉死，游标推进也以这批的最后位置为界；之后到达的新消息保持待办不进失败批。它不保护什么：这层保证的是批次边界与队列秩序，Agent 自己在同一轮内写重复内容不属于队列能管的范围。</dd><dt>为什么网页端和其他聊天渠道也被算进同一条车道？</dt><dd>因为它们共享同一个工作文件夹，最终对应同一个主 Agent 进程；串行化键就是文件夹级别的键，这正是"多入口、一个大脑"不会打架的原因。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../18-hui-hua-dui-lie-yu-bing-fa-kong-zhi.md">会话队列与并发控制</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="17-im-ming-ling.html">第 17 章 · IM 命令系统</a><a href="19-ding-shi-ren-wu.html">第 19 章 · 定时任务调度</a></div>

<nav class="nav">
<a href="17-im-ming-ling.html">上一章：IM 命令系统 ←</a>
<a href="../index.html">返回目录</a>
<a href="19-ding-shi-ren-wu.html">下一章：定时任务调度 →</a>
</nav>
<footer>HappyClaw 图解精读 · 18 / 30</footer>
</div></body></html>
`;export{n as default};
