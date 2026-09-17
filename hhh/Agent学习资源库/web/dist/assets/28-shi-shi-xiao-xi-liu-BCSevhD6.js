const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 28 章 · 实时消息流、终端与流式渲染 · HappyClaw 图解精读</title>
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
<p class="crumb">第 28 章 / 30 · Web 前端 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 28 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>实时消息流、终端与流式渲染</h1>
<p class="lede">Agent 的每个动作以 StreamEvent 从容器一路直播到浏览器，增量文本按动画帧合并渲染；终端则以 PTY 优先、管道兜底双模式接入。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>看装修师傅干活的直播：他每拧完一颗螺丝说一句（text_delta），后台现场切画面（流式卡片）；工头在门口核对工单号（RunStreamFence 按 run 界定归属），拿着别家图纸来的旧通知一律拦下。信号断了也不怕——重新连线会先收到一张施工进度快照（stream_snapshot），接着画就是，不会从头重来也不会画串楼层。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="流式事件端到端管线"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="60" width="196" height="110" rx="14" fill="#EFEAFE" stroke="var(--accent)" stroke-width="3"/>
    <text x="122" y="98" text-anchor="middle" font-size="25">🏗️🎙️</text>
    <text x="122" y="128" text-anchor="middle" font-size="14.5" font-weight="700">Runner 缓冲</text>
    <text x="122" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">100ms / 200 字符批量冲刷</text>
    <rect x="252" y="60" width="200" height="110" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="352" y="98" text-anchor="middle" font-size="25">🚧🪪</text>
    <text x="352" y="128" text-anchor="middle" font-size="14.5" font-weight="700">RunStreamFence</text>
    <text x="352" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">旧 run 迟到事件丢弃</text>
    <rect x="484" y="60" width="180" height="110" rx="14" fill="#fdf0f0" stroke="#e5484d" stroke-width="3"/>
    <text x="574" y="98" text-anchor="middle" font-size="25">📡♾️</text>
    <text x="574" y="128" text-anchor="middle" font-size="14.5" font-weight="700">WebSocket 推送</text>
    <text x="574" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">快照同步写入内存</text>
    <rect x="696" y="60" width="172" height="110" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="782" y="98" text-anchor="middle" font-size="25">🖥️🎞️</text>
    <text x="782" y="128" text-anchor="middle" font-size="14.5" font-weight="700">rAF 合帧渲染</text>
    <text x="782" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">一帧一次合并写 store</text>
    <line x1="220" y1="115" x2="248" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="452" y1="115" x2="480" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="664" y1="115" x2="692" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">🎬 流式卡片自顶向下四层：系统状态 → 思考块 → 工具/任务 → 正文；权限拒绝单独红色醒目呈现。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>Runner 里攒台词不逐字外发<small>StreamEventProcessor 把 text_delta/thinking_delta 按缓冲键聚合，100ms 定时或 200 字符阈值冲刷；message_stop 到达强制收尾，保证消息边界闭合</small></p></div><div class="step"><span class="n">2</span><p>主服务过围栏再广播<small>context_audit 属运维诊断数据绝不进用户 WebSocket；只有当前活跃 run 的事件被接受，迟到的旧 run 回调直接丢弃</small></p></div><div class="step"><span class="n">3</span><p>浏览器按帧合并增量<small>rAF 批处理队列在同一动画帧内合并多次 delta 再一次性写 store；工具结束生成「✓ 工具名 (耗时)」条目</small></p></div><div class="step"><span class="n">4</span><p>思考转正文的瞬间自动折叠<small>琥珀色 Reasoning 面板展示「已思考 Xs」耗时，折叠动作消除流式卡片与落库消息之间的布局跳变</small></p></div><div class="step"><span class="n">5</span><p>断线重连收两批恢复数据<small>先是 active_run_snapshot（活跃与排队），随后逐会话 stream_snapshot；30 分钟内的快照才推送，墓碑机制阻止已结束 run 重建快照</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>100ms</b><span>增量冲刷定时（攒满 200 字符也会提前触发）</span></div><div class="stat"><b>5000 行</b><span>xterm.js 终端 scrollback 缓存</span></div><div class="stat"><b>30s 封顶</b><span>WebSocket 重连指数退避区间（1 秒起步）</span></div><div class="stat"><b>10s</b><span>心跳判定孤儿等待态，自动清理「永远转圈」</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>PTY worker 若 2 秒健康窗口内失败则永久降级 pipe 模式：自己处理退格、Ctrl-U 清行等行编辑，仅回车时送整行进 shell。</li><li>xterm.js 约 488KB 由 React.lazy 从聊天主包拆出，首次打开终端面板才下载。</li><li>proactive 模式下未提交的回复绝不渲染成正式消息，卡片只留「正在处理…」占位信号。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>A 任务切到 B 之后，迟到的流式数据会污染界面吗？</dt><dd>不会：服务端围栏只放行当前活跃 run 的回调，前端栅栏同样只接受 runId 精确匹配的载荷，新快照取代旧尝试时本地投影先清除，墓碑机制封死重建路径。它不保护什么——这些机制管的是「谁的事件」与「过没过期」，内容本身的正确性取决于模型输出质量。</dd><dt>为什么终端要先试 PTY？</dt><dd>PTY 提供完整终端语义：xterm-256color、行编辑、光标控制、全屏程序；管道模式没有行规程只能模拟基础编辑行为，所以它只是兜底而非首选。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../28-shi-shi-xiao-xi-liu-zhong-duan-yu-liu-shi-xuan-ran-ti-yan.md">实时消息流、终端与流式渲染体验</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="27-qian-duan-jia-gou.html">第 27 章 · 前端架构与路由</a><a href="29-ce-shi-ti-xi.html">第 29 章 · 测试体系</a></div>

<nav class="nav">
<a href="27-qian-duan-jia-gou.html">上一章：前端架构与路由 ←</a>
<a href="index.html">返回目录</a>
<a href="29-ce-shi-ti-xi.html">下一章：测试体系 →</a>
</nav>
<footer>HappyClaw 图解精读 · 28 / 30</footer>
</div></body></html>
`;export{t as default};
