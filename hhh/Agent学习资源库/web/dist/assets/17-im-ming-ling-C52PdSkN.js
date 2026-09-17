const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 17 章 · IM 命令系统与消息分发 · HappyClaw 图解精读</title>
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
<p class="crumb">第 17 章 / 30 · 消息渠道 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 17 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>IM 命令系统与消息分发</h1>
<p class="lede">消息一进门就被分成两类活儿：以 / 开头的口令按固定清单逐级验身办理，谁都不认识的原样流向 AI 管线——每一层用"未命中"把控制权礼貌地交给下一层。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像写字楼大堂经理接待访客：进门先查工牌（发言者白名单，不合规连门都进不了）；听见你在念口令（斜杠命令）就按办理窗口分派，改房间钥匙这种要紧事必须核对房主身份（owner 门控）；柜台认不得的口令再去插件目录里翻一页；还找不到？那就当普通访客，原话转交给 AI 实习生处理——绝不因为听不懂口令而把你请出门。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="命令分发决策链"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="86" width="150" height="70" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="99" y="113" text-anchor="middle" font-size="20">💬 /口令?</text>
    <text x="99" y="138" text-anchor="middle" font-size="11.5" fill="#8a92a6">先过白名单</text>
    <rect x="226" y="30" width="200" height="64" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="326" y="56" text-anchor="middle" font-size="13.5" font-weight="700">内建柜台：switch 分发</text>
    <text x="326" y="78" text-anchor="middle" font-size="11.5" fill="#5b6478">7 条要紧命令先核 owner 身份</text>
    <rect x="226" y="146" width="200" height="66" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="326" y="172" text-anchor="middle" font-size="13.5" font-weight="700">柜台吐 null = 不认识</text>
    <text x="326" y="194" text-anchor="middle" font-size="11.5" fill="#8a92a6">撕掉 @机器人 前后缀再比对</text>
    <rect x="486" y="88" width="210" height="72" rx="12" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="591" y="116" text-anchor="middle" font-size="13.5" font-weight="700">插件展开三态</text>
    <text x="591" y="140" text-anchor="middle" font-size="11.5" fill="#5b6478">miss 回退 / expanded 改写 / reply 直接回话</text>
    <rect x="756" y="86" width="100" height="76" rx="14" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="806" y="118" text-anchor="middle" font-size="20">🤖</text>
    <text x="806" y="144" text-anchor="middle" font-size="13" font-weight="700">AI 管线</text>
    <line x1="176" y1="110" x2="218" y2="70" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="176" y1="120" x2="218" y2="172" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="366" y1="98" x2="478" y2="115" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="428" y1="180" x2="480" y2="140" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="698" y1="124" x2="748" y2="124" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">三层各自收窄职责：渠道差异留在拦截层、业务逻辑收在分发层、插件生态收在展开层。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>先查发言者白名单，不在册的直接丢弃<small>身份边界先于命令与 @ 门控，最无害的 /list 也一样受限</small></p></div><div class="step"><span class="n">2</span><p>渠道层用正则截出命令文本，顺手撕掉平台特有的 @机器人 前后缀<small>飞书的 "@bot /cmd"、Telegram 的 "/cmd@BotUsername" 都要能认出来</small></p></div><div class="step"><span class="n">3</span><p>内建柜台当场办理；涉及工作区变更的 7 条命令先核 owner 身份<small>私聊首条 owner 级命令自动认领发送者；群聊永不自动认领</small></p></div><div class="step"><span class="n">4</span><p>内建认不得就吐 null，接着查插件命令索引；短名撞车引导你改用全名<small>比如两个插件都有 /status 时提示改用 /codex:status 唯一寻址</small></p></div><div class="step"><span class="n">5</span><p>仍未命中，消息当普通内容进入 AI 管线<small>既不拦截也不报错，只是礼貌放过</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>17 个</b><span>内建命令名被索引保留，插件的短形式抢不走</span></div><div class="stat"><b>7 条</b><span>变更工作区的命令需要 owner 核身</span></div><div class="stat"><b>3 态</b><span>插件展开结果：miss / expanded / reply</span></div><div class="stat"><b>双重</b><span>冲突检测：短名与命名空间名分开计数</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>/clear 不止清屏：停相关队列进程、清空 session 文件、写入重置分隔消息并推进游标，防止旧消息混进新会话。</li><li>插件命令里的 inline 脚本有副作用：渲染结果作为存根持久化，崩溃恢复时逐字重放存根，绝不再执行第二遍。</li><li>Web 和 IM 共用同一套索引与展开实现，契约测试防止两条管线语义漂移。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>一个插件能不能造条 /status 抢掉系统自带命令？</dt><dd>抢不走。17 个内建名称被命令索引保留，同名的插件短形式直接丢弃；不过完整命名空间形式仍可寻址。它不保护什么：非内建、无撞车的名字完全归插件所有，短形式照常可用——这层只防覆盖，不管插件内容好坏。</dd><dt>为什么一条查询命令执行到一半崩溃不能自动重跑？</dt><dd>命令可能有副作用且无幂等保证，所以飞书为它记了持久化进度单：只有"回复未发出"的状态允许安全补发，其余中途状态一律停手等待人工核对。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../17-im-ming-ling-xi-tong-yu-xiao-xi-fen-fa.md">IM 命令系统与消息分发</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="16-ke-kao-xing-zhuang-tai-ji.html">第 16 章 · 渠道可靠性状态机</a><a href="18-hui-hua-dui-lie.html">第 18 章 · 会话队列与并发</a></div>

<nav class="nav">
<a href="16-ke-kao-xing-zhuang-tai-ji.html">上一章：渠道可靠性状态机 ←</a>
<a href="../index.html">返回目录</a>
<a href="18-hui-hua-dui-lie.html">下一章：会话队列与并发 →</a>
</nav>
<footer>HappyClaw 图解精读 · 17 / 30</footer>
</div></body></html>
`;export{t as default};
