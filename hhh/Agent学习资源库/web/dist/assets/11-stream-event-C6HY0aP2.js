const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 11 章 · StreamEvent 流式事件体系与类型同步 · HappyClaw 图解精读</title>
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
<p class="crumb">第 11 章 / 30 · 系统架构 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 11 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>StreamEvent 流式事件体系与类型同步</h1>
<p class="lede">容器里的模型、宿主服务与浏览器要说同一种「进度语言」：24 种流式事件出自唯一类型定义，构建时复制成三份副本，CI 用 git diff 门禁盯死任何漂移。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像新闻机构发通稿：总部只写一份母版（shared/stream-event.ts），三个地方台各自原样照抄一份排版播出；每天有人逐字比对四个版本，谁私自改稿谁过不了审。通稿还自带「可见性规则」——哪些段落播给观众、哪些只给值班室，都印在稿头。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="单一事实源与副本同步"><defs><marker id="ar11" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="26" y="62" width="234" height="108" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="143" y="98" text-anchor="middle" font-size="19" font-weight="700">📜 唯一事实源</text>
    <text x="143" y="124" text-anchor="middle" font-size="12.5" fill="#5b6478">shared/stream-event.ts</text>
    <text x="143" y="146" text-anchor="middle" font-size="11.5" fill="#8a92a6">「DO NOT edit the copies」</text>
    <line x1="262" y1="116" x2="324" y2="116" stroke="#232733" stroke-width="3" marker-end="url(#ar11)"/>
    <rect x="328" y="80" width="200" height="72" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="428" y="110" text-anchor="middle" font-size="17">⚙️ make sync-types</text>
    <text x="428" y="133" text-anchor="middle" font-size="12" fill="#5b6478">cmp -s 仅复制差异内容</text>
    <line x1="530" y1="104" x2="600" y2="72" stroke="#232733" stroke-width="3" marker-end="url(#ar11)"/>
    <text x="556" y="76" font-size="12" fill="#5b6478">三份抄本</text>
    <rect x="606" y="20" width="248" height="34" rx="9" fill="#eef3fd" stroke="#4a7df0" stroke-width="2"/>
    <text x="730" y="42" text-anchor="middle" font-size="12.5">🤖 agent-runner /stream-event.types.ts</text>
    <rect x="606" y="68" width="248" height="34" rx="9" fill="#eef3fd" stroke="#4a7df0" stroke-width="2"/>
    <text x="730" y="90" text-anchor="middle" font-size="12.5">🖥️ 主服务 src/ 同名副本</text>
    <rect x="606" y="116" width="248" height="34" rx="9" fill="#eef3fd" stroke="#4a7df0" stroke-width="2"/>
    <text x="730" y="138" text-anchor="middle" font-size="12.5">🌐 前端 web/src/ 同名副本</text>
    <line x1="730" y1="152" x2="730" y2="164" stroke="#232733" stroke-width="2.5" marker-end="url(#ar11)"/>
    <rect x="606" y="168" width="248" height="46" rx="10" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="730" y="188" text-anchor="middle" font-size="12.5" font-weight="700">🛡️ CI 双保险门禁</text>
    <text x="730" y="206" text-anchor="middle" font-size="11.5" fill="#5b6478">git diff --exit-code，有漂移即红</text>
  </svg>
  <p class="caption">同步这套模式是通用的：image-detector 与 channel-prefixes 等共享文件也走同一条复制与校验流水线。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>SDK 的原始帧先交给 StreamEventProcessor 做语义翻译<small>message_start/stop 转为 raw_sdk_event 边界帧——宿主靠它们判定「一段完整回复结束」，普通叙述文本不误当最终答案。</small></p></div><div class="step"><span class="n">2</span><p>文字增量攒一批再出门<small>每 100ms 或累计 200 字符刷出一次缓冲；高频 thinking_tokens 被合成最多每 2 秒一条心跳（isSynthetic 标记），原始计数永不透传。</small></p></div><div class="step"><span class="n">3</span><p>事件包进 ContainerOutput 随 stdout 回到主服务<small>usage 事件带稳定 eventId 并走与账本相同的计价入口，流式金额与最终统计一致且可幂等去重。</small></p></div><div class="step"><span class="n">4</span><p>广播前有两道过滤闸<small>context_audit 携带宿主机路径等诊断信息，永远留在服务端不推 WebSocket；proactive 模式只放行 requesting/idle/interrupted 三种边界状态。</small></p></div><div class="step"><span class="n">5</span><p>浏览器合并同帧增量再渲染<small>requestAnimationFrame 批量处理 text_delta/thinking_delta；累积文本分别截断至 16000 与 8000 字符，子 Agent 文本路由到对应任务面板不污染主对话。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>24 种</b><span>事件类型分六个族系（可扩展字符串联合）</span></div><div class="stat"><b>+3 副本</b><span>同一份定义复制到 Runner、主服务、前端</span></div><div class="stat"><b>100ms</b><span>文本增量的缓冲刷出周期之一</span></div><div class="stat"><b>200 条</b><span>追踪时间线在前端裁剪的上限</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>eventType 是字符串联合不是枚举：SDK 新形态落进 raw_sdk_event 兜底，前端 switch 对陌生类型静默跳过，不会因类型爆炸崩溃。</li>
<li>displayLevel 三档决定归宿：primary 内联展示、detail 追踪面板、debug 开发者专用；raw_sdk_event 默认 debug，只有错误类被升为 primary 才进用户时间线。</li>
<li>防乱序有一整套围栏：turnId/queryRunId/sessionId/messageUuid 四层关联键之外，主服务宁可丢弃未携带 runId 的迟到事件也不错标给新轮次。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>谁偷改一份副本文件会立刻被发现吗？</dt><dd>会。本地 typecheck 在四工程检查后跑 diff 校验脚本；CI 先 make sync-types 再 git diff --exit-code——副本能被改写出差异就意味着存在未被 canonical 涵盖的改动，PR 直接红。但要说清它不保护什么：门禁保证「三端同步」这一件事，不审查你改 canonical 本身的方案是否合理，那是代码评审与契约测试的职责。</dd>
<dt>模型思考时的 token 计数怎么看不到？</dt><dd>被有意折成低频心跳：界面只知道「正在深入分析…」，原始 estimated_tokens 永不出现在事件里，避免把思维链细节透传给展示层。同时这降低了数千帧高频消息对前端渲染的冲击。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../11-streamevent-liu-shi-shi-jian-ti-xi-yu-lei-xing-tong-bu.md">StreamEvent 流式事件体系与类型同步</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="10-runner-ipc.html">第 10 章 · Runner 与 IPC 协议</a><a href="12-sqlite-qian-yi.html">第 12 章 · SQLite 与迁移机制</a></div>

<nav class="nav">
<a href="10-runner-ipc.html">上一章：Runner 与 IPC 协议 ←</a>
<a href="index.html">返回目录</a>
<a href="12-sqlite-qian-yi.html">下一章：SQLite 与迁移机制 →</a>
</nav>
<footer>HappyClaw 图解精读 · 11 / 30</footer>
</div></body></html>
`;export{t as default};
