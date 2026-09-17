const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 15 章 · 飞书会话语义与原生话题映射 · HappyClaw 图解精读</title>
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
<p class="crumb">第 15 章 / 30 · 消息渠道 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 15 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>飞书会话语义与原生话题映射</h1>
<p class="lede">飞书用同一套 oc_ 开头的编号混装私聊和群聊，所以系统不猜：元数据说了算；群里的每个话题配一间独立 AI 包间，@ 一次即可开门，后续对话免 @ 继续讲。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一家宴会厅：大厅（普通群）里大家共享一张长桌，说什么服务员都听（always 模式）；想私下讨论就在门口喊一声"@服务员，包间"（@ 触发），每个话题分到一间小包间、各自有专属记忆。规矩写在门上：没喊名字不开席（mention 门控）；请柬看不懂的客人一律谢绝入内（识别不了就 fail-closed，绝不猜）；已坐在包间里的人继续聊天不用反复报名。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="飞书会话分流与话题映射"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="88" width="180" height="76" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="114" y="118" text-anchor="middle" font-size="20">🪪 feishu:oc_xxx</text>
    <text x="114" y="146" text-anchor="middle" font-size="12" fill="#8a92a6">私聊群聊同编号，不猜</text>
    <rect x="278" y="8" width="256" height="62" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="406" y="34" text-anchor="middle" font-size="14" font-weight="700">p2p → 私聊直接放行</text>
    <text x="406" y="56" text-anchor="middle" font-size="12" fill="#5b6478">共享一个会话，免 @</text>
    <rect x="278" y="84" width="256" height="62" rx="12" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="406" y="110" text-anchor="middle" font-size="14" font-weight="700">group/topic → 群聊走激活判定</text>
    <text x="406" y="132" text-anchor="middle" font-size="12" fill="#5b6478">@ 开新包间 / 已激活免 @</text>
    <rect x="278" y="160" width="256" height="62" rx="12" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="406" y="186" text-anchor="middle" font-size="14" font-weight="700">无元数据 → unknown 拒绝</text>
    <text x="406" y="208" text-anchor="middle" font-size="12" fill="#8a92a6">fail-closed，绝不猜测</text>
    <rect x="600" y="60" width="256" height="112" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="728" y="92" text-anchor="middle" font-size="20">🎓🎓🎓</text>
    <text x="728" y="120" text-anchor="middle" font-size="14" font-weight="700">每话题一间包间（子代理）</text>
    <text x="728" y="144" text-anchor="middle" font-size="12" fill="#5b6478">im_context_bindings 记住门牌</text>
    <line x1="206" y1="120" x2="270" y2="45" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="206" y1="126" x2="270" y2="115" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="206" y1="132" x2="270" y2="185" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="536" y1="115" x2="592" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">绑定的主键是（来源会话, 上下文类型, 话题编号），其中来源会话含账号作用域——不同账号的相同话题编号永不相交。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>消息到达先查元数据定身份：chat_mode 是 p2p 还是 group/topic<small>durable 存档或实时接口返回的元数据才作数，编号本身不可猜</small></p></div><div class="step"><span class="n">2</span><p>私聊免 @ 直接进共享会话开聊<small>p2p 的回复锚点取最近一条消息定位</small></p></div><div class="step"><span class="n">3</span><p>群里首次在某个话题下 @ 机器人：新建一间话题子代理并持久化绑定<small>新代理标记 source_kind='native_thread'，身份可回溯、标题源自首条消息</small></p></div><div class="step"><span class="n">4</span><p>同一话题的后续消息免 @ 继续：命中既有包间，不嵌套再开新房<small>候选编号按 话题 → 根消息 → 当前消息 依次查找</small></p></div><div class="step"><span class="n">5</span><p>飞书说这个会话不支持话题内回复（错误码 230071/230072）：只把这一步降级为普通回复重试<small>附件上传与已发送内容不受影响</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>5 种</b><span>激活模式：auto / always / when_mentioned / owner_mentioned / disabled</span></div><div class="stat"><b>7 种</b><span>判定结论 reason，覆盖免 @ 与否 × 是否独立上下文</span></div><div class="stat"><b>230071</b><span>话题内回复不支持时的降级错误码之一</span></div><div class="stat"><b>16 个</b><span>测试用例锁定整张会话决策表</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>@ 门控有三条边界：机器人身份未知时拒绝而非放行；disabled 是硬停止，连 @ 也绕不过；已激活话题内无需再次 @。</li><li>"投递位置"和"会话身份"刻意分开：普通群可以在既有的话题气泡里回复，但仍然共享该群唯一的工作区会话。</li><li>解绑不清历史：工作区导航还原为手动/横向模式，重新绑定同一话题渠道即可恢复全部包间。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>A 包间的讨论会不会串进 B 包间？机器人认错话题怎么办？</dt><dd>不会。包间绑定表的主键是（来源会话 + 上下文类型 + 话题编号），来源会话含账号作用域，不同渠道不同账号的相同话题编号天然隔离；查找时会校验代理仍归属期望的工作区。它不保护什么：这层只管身份归属，你自己在文本里粘贴的敏感内容它拦不住。</dd><dt>为什么不能只看消息里带的话题编号就决定归属？</dt><dd>因为普通群里的"回复链"并不是真话题——若沿用会把新请求错误并入旧会话。普通群的 @ 触发始终锚定触发消息自身开启新会话，旧回复链只作为有限的引用背景保留。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../15-fei-shu-hui-hua-yu-yi-yu-yuan-sheng-hua-ti-ying-she.md">飞书会话语义与原生话题映射</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="14-qu-dao-gua-zai.html">第 14 章 · 渠道挂载与绑定</a><a href="16-ke-kao-xing-zhuang-tai-ji.html">第 16 章 · 渠道可靠性状态机</a></div>

<nav class="nav">
<a href="14-qu-dao-gua-zai.html">上一章：渠道挂载与绑定 ←</a>
<a href="../index.html">返回目录</a>
<a href="16-ke-kao-xing-zhuang-tai-ji.html">下一章：渠道可靠性状态机 →</a>
</nav>
<footer>HappyClaw 图解精读 · 15 / 30</footer>
</div></body></html>
`;export{t as default};
