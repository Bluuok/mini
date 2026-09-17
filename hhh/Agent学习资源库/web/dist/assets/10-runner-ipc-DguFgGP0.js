const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 10 章 · Agent Runner 与 IPC 通信协议 · HappyClaw 图解精读</title>
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
<p class="crumb">第 10 章 / 30 · 系统架构 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 10 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>Agent Runner 与 IPC 通信协议</h1>
<p class="lede">宿主进程管编排记账，Agent Runner 进程里跑模型：两个进程之间不打网络电话，全靠磁盘上一组约定好的文件夹互相投递 JSON「传票」完成协作，每张票都有回执。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像公司里只隔一堵墙的两个工位开的传票窗口：口头进度直接喊一嗓子（stdout 输出帧），正式业务必须填表投进共享文件格——前台把新任务投进「来件格」（input/），工匠要发消息、建任务就往「外发格」（messages/、tasks/）塞申请单，前台办完再把回执条放进独立的「回执格」（message-results/）。谁也没直接伸进对方抽屉，但每一单都可追查。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="宿主与 Runner 的文件 IPC"><defs><marker id="ar10" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="28" y="58" width="236" height="116" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="146" y="92" text-anchor="middle" font-size="17" font-weight="700">🏠 宿主进程</text>
    <text x="146" y="116" text-anchor="middle" font-size="12.5" fill="#5b6478">GroupQueue 队列派活</text>
    <text x="146" y="137" text-anchor="middle" font-size="12.5" fill="#5b6478">IpcWatcherManager 盯着文件夹</text>
    <text x="146" y="158" text-anchor="middle" font-size="12.5" fill="#5b6478">解析 stdout 输出帧</text>
    <line x1="270" y1="78" x2="338" y2="52" stroke="#232733" stroke-width="3" marker-end="url(#ar10)"/>
    <line x1="546" y1="54" x2="612" y2="78" stroke="#232733" stroke-width="3" marker-end="url(#ar10)"/>
    <line x1="610" y1="122" x2="544" y2="110" stroke="#232733" stroke-width="3" marker-end="url(#ar10)"/>
    <line x1="270" y1="140" x2="338" y2="170" stroke="#232733" stroke-width="3" marker-end="url(#ar10)"/>
    <line x1="610" y1="152" x2="544" y2="178" stroke="#232733" stroke-width="3" marker-end="url(#ar10)"/>
    <rect x="344" y="28" width="194" height="48" rx="10" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="441" y="49" text-anchor="middle" font-size="14" font-weight="700">📥 input/</text>
    <text x="441" y="66" text-anchor="middle" font-size="11.5" fill="#5b6478">后续消息热注入＋信号量</text>
    <rect x="344" y="94" width="194" height="44" rx="10" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="441" y="113" text-anchor="middle" font-size="14" font-weight="700">📤 messages/ · tasks/</text>
    <text x="441" y="129" text-anchor="middle" font-size="11.5" fill="#5b6478">发消息、建任务的申请单</text>
    <rect x="344" y="156" width="194" height="44" rx="10" fill="#f3effc" stroke="var(--accent)" stroke-width="2.5"/>
    <text x="441" y="175" text-anchor="middle" font-size="14" font-weight="700">🧾 message-results/</text>
    <text x="441" y="191" text-anchor="middle" font-size="11.5" fill="#5b6478">回执目录（独立存放）</text>
    <rect x="616" y="58" width="236" height="116" rx="14" fill="#fff" stroke="#4a7df0" stroke-width="3"/>
    <text x="734" y="92" text-anchor="middle" font-size="17" font-weight="700">🤖 Agent Runner</text>
    <text x="734" y="116" text-anchor="middle" font-size="12.5" fill="#5b6478">Claude Agent SDK 主循环</text>
    <text x="734" y="137" text-anchor="middle" font-size="12.5" fill="#5b6478">query → 等消息 → query</text>
    <text x="734" y="158" text-anchor="middle" font-size="12.5" fill="#5b6478">send_message 等 MCP 工具</text>
  </svg>
  <p class="caption">每个工作区有独立 IPC 根目录 data/ipc/{group}/；子代理与定时任务各自再开一层嵌套命名空间，互不串扰。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>冷启动：开工指令从管道一次性灌入<small>容器 entrypoint.sh 把 stdin 缓冲到 /tmp/input.json 再降权执行，以 EOF 为界携带完整 ContainerInput；之后宿主立即关闭管道。</small></p></div><div class="step"><span class="n">2</span><p>后续指令走「来件格」热注入<small>原子写 tmp 文件＋rename 落盘，同时在内存登记投递——同一同步临界区完成，杜绝「文件写了但恢复元数据缺失」的竞态窗口。</small></p></div><div class="step"><span class="n">3</span><p>Runner 要发消息时不打网络电话，写申请单<small>send_message/schedule_task 只往 messages/ 或 tasks/ 目录写 JSON；文件总是盖章 chatJid、groupFolder、timestamp，绝不直连 IM 与数据库。</small></p></div><div class="step"><span class="n">4</span><p>宿主看到申请单后代办并放回执条<small>IpcWatcherManager 事件驱动 fs.watch ＋ 5 秒兜底轮询消费；回执写在 messages/ 之外的 message-results/ 目录，防止宿主把自己的回执又当新申请消费一遍。</small></p></div><div class="step"><span class="n">5</span><p>收摊靠三张「读后即删」的信号量纸条<small>_close 空闲退出、_drain 问完即退、_interrupt 优雅中断当前 query（带 10 秒宽限），被中断轮次之后的输入仍可重新排队不丢失。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>500ms</b><span>Runner 轮询回执文件的间隔</span></div><div class="stat"><b>120s</b><span>消息类回执超时上限（默认 30 秒）</span></div><div class="stat"><b>5 秒</b><span>宿主 watcher 的兜底扫描周期</span></div><div class="stat"><b>10 分钟</b><span>重试去重 TTL，键含文本 MD5、上限 500 条</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>输出用成对标记切帧（OUTPUT_START/END 包 JSON），解析器做花括号深度匹配——JSON 字符串里就算包含分隔标记文本也不会误切。</li>
<li>失败一轮绝不假装成功：只有「健康完成的 SDK result」才确认交付，报错、中断、截断的输入 turn 保持可重放状态。</li>
<li>回执条分三种处置语义：staged（已暂存进当前回复）、delivered_separately（独立发送）等——Runner 据此给模型一句人话确认。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>让 AI 发消息，它会绕过平台私发给用户吗？</dt><dd>不会。send_message 这类工具摸不到网络与数据库，只能往目录里写一张「申请单」，由宿主审核路由后代为执行。但要知道它不保护「申请单获批之后」的部分：宿主一旦落盘副作用即生效，投递模式会被冻结进文件，事后不因工作区模式变更而重新解释。</dd>
<dt>写到一半断电，消息会丢吗？</dt><dd>关键步骤全是 tmp＋rename 原子写；崩溃后启动扫描会「先持久化回滚游标、再删除唯一崩溃证据」，两步都成功才清理文件，否则保留等下次重试。这套恢复明确不覆盖隔离任务命名空间——定时任务不是聊天消息，走各自的独立核销协议。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../10-agent-runner-yu-ipc-tong-xin-xie-yi.md">Agent Runner 与 IPC 通信协议</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="09-fu-wu-jia-gou.html">第 9 章 · 主服务架构</a><a href="11-stream-event.html">第 11 章 · StreamEvent 类型同步</a></div>

<nav class="nav">
<a href="09-fu-wu-jia-gou.html">上一章：主服务架构 ←</a>
<a href="index.html">返回目录</a>
<a href="11-stream-event.html">下一章：StreamEvent 类型同步 →</a>
</nav>
<footer>HappyClaw 图解精读 · 10 / 30</footer>
</div></body></html>
`;export{t as default};
