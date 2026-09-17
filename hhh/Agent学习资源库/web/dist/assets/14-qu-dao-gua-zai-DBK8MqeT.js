const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 14 章 · 渠道挂载与会话绑定边界 · HappyClaw 图解精读</title>
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
<p class="crumb">第 14 章 / 30 · 消息渠道 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 14 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>渠道挂载与会话绑定边界</h1>
<p class="lede">一条外部聊天要穿过三道互不干扰的边界才能变成一次回复：地址决定"这是谁"，挂载决定"去往哪里"，所有权决定"回复从哪个门发出"——任何一步不确定，消息就不投递。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像写字楼前台分信：信封上的房间号是「地址」；收件部门登记簿是「挂载」——一封信只能投给一个去处，要么投给整层公共前台（工作区主对话），要么投到具体工位（某个会话），不能两个都填。最后还要核对「所有权」回执章：这间房的往来，永远从最初建立联系的那部内线电话回复，别的电话（包括网页端）不能抢线，只能递纸条进去。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="挂载与绑定的三条边界"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="78" width="180" height="96" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="114" y="116" text-anchor="middle" font-size="25">✉️</text>
    <text x="114" y="148" text-anchor="middle" font-size="14" font-weight="700">一条外部消息</text>
    <rect x="280" y="10" width="276" height="66" rx="14" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="418" y="38" text-anchor="middle" font-size="14.5" font-weight="700">① 地址边界：JID 四段门牌</text>
    <text x="418" y="62" text-anchor="middle" font-size="12.5" fill="#5b6478">provider : 外部聊天 # 账号 # 话题</text>
    <rect x="280" y="86" width="276" height="60" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="418" y="112" text-anchor="middle" font-size="14.5" font-weight="700">② 绑定边界：工作区 ↔ 会话 互斥</text>
    <text x="418" y="134" text-anchor="middle" font-size="12.5" fill="#5b6478">二选一，绝不双挂</text>
    <rect x="280" y="156" width="276" height="64" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="418" y="182" text-anchor="middle" font-size="14.5" font-weight="700">③ 所有权边界：粘性归属</text>
    <text x="418" y="204" text-anchor="middle" font-size="12.5" fill="#5b6478">首个 IM 源认领后不被转移</text>
    <rect x="656" y="78" width="200" height="96" rx="14" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="756" y="118" text-anchor="middle" font-size="24">🏗️🎯</text>
    <text x="756" y="150" text-anchor="middle" font-size="13.5">路由到正确的会话</text>
    <line x1="206" y1="126" x2="272" y2="43" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="206" y1="126" x2="272" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="206" y1="126" x2="272" y2="188" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="558" y1="126" x2="648" y2="126" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">registered_groups 表是路由唯一事实源；查询热路径另有 channel_mounts 规范化镜像，同一事务内双写保持一致。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>群消息进来，先解析四段式门牌：渠道前缀、平台原生会话号、账号片段、话题片段<small>没有 account 片段的历史地址标记为 legacy，由遗留默认账号继续认领</small></p></div><div class="step"><span class="n">2</span><p>判定它有没有资格绑定：群聊只能绑工作区、私聊只能绑会话，判不出来一律拒绝<small>飞书用同一套 oc_* 编号表示私聊和群聊，绝不靠编号猜类型</small></p></div><div class="step"><span class="n">3</span><p>原生话题容器（飞书话题群、Telegram Forum）必须走 thread_map 模式，绑死单个会话视为非法<small>升级原子提交、不清旧映射，重新绑定还能找回全部历史话题</small></p></div><div class="step"><span class="n">4</span><p>回复按粘性所有权发出：Web 可以向会话注入输入，但抢不走传输权<small>同对话内锚点跟随最新消息；跨对话、跨账号保持原主</small></p></div><div class="step"><span class="n">5</span><p>用户解绑不是清空路由，而是恢复该渠道账号的默认工作区<small>先纯解析再单次提交，解析失败保留旧路由，绝不出现悬空中间态</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3 本</b><span>正交台账：地址 / 绑定 / 所有权各管一事</span></div><div class="stat"><b>二选一</b><span>目标字段互斥：绑了具体会话就不能再设工作区目标</span></div><div class="stat"><b>7 / 7</b><span>个渠道全部支持绑定到工作区</span></div><div class="stat"><b>1 次提交</b><span>解绑先解析后原子落库，失败保留旧路由</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>改绑定不走手改字段：三个纯函数生成新状态——会话挂载、工作区挂载、解绑各有自己的构建器，互斥性由冲突检查函数显式维护。</li><li>/unbind 与 REST 删除端点共享同一套恢复逻辑，契约测试强制这一共享，防止两处语义漂移。</li><li>涉及网络调用的绑定接口在等待返回后会重读最新快照再写入——不然并发请求可能被旧数据静默覆盖。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>我点了 /unbind，这个群的聊天记录和消息会不会被清掉？</dt><dd>不会。用户侧解绑的真实语义是"恢复该渠道账号的默认工作区"，消息照常流动；解析不出默认目标时保留旧路由继续投递。它不保护什么：彻底删除路由目标的 buildUnmountUpdate 只用于内部清理整条记录的场景，正常操作碰不到它。</dd><dt>话题群已经攒了一堆会话，误绑成固定会话会怎样？</dt><dd>这正是系统防的事：话题容器绑定固定会话是不变量级非法状态，REST 直接拒绝；存量迁移时会自动把固定会话提升为其属主工作区的 thread_map 绑定，提升是唯一不丢消息的路径。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../14-qu-dao-gua-zai-yu-hui-hua-bang-ding-bian-jie.md">渠道挂载与会话绑定边界</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="13-im-qu-dao.html">第 13 章 · IM 渠道架构</a><a href="15-fei-shu-yu-yi.html">第 15 章 · 飞书会话语义</a></div>

<nav class="nav">
<a href="13-im-qu-dao.html">上一章：IM 渠道架构 ←</a>
<a href="../index.html">返回目录</a>
<a href="15-fei-shu-yu-yi.html">下一章：飞书会话语义 →</a>
</nav>
<footer>HappyClaw 图解精读 · 14 / 30</footer>
</div></body></html>
`;export{t as default};
