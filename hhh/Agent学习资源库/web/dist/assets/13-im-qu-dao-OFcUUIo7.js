const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 13 章 · IM 渠道架构与多账号连接池 · HappyClaw 图解精读</title>
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
<p class="crumb">第 13 章 / 30 · 消息渠道 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 13 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>IM 渠道架构与多账号连接池</h1>
<p class="lede">飞书、Telegram、QQ、微信、钉钉、Discord、WhatsApp 七个平台各说各的"方言"，HappyClaw 用一个统一接口全部接住；每个渠道账号独占一个槽位，凭据互斥、状态落库。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像老式电话总机的插线板：一位住客（用户）名下可以登记多部话机（渠道账号），每部话机独占一个插孔（槽位）；同一把钥匙（Bot 凭据）同一时刻只能插在一部话机上，不然两边同时响铃就乱了。前台墙上还挂着两块表板：一块记录钥匙有没有办妥授权（认证状态），一块记录线路通不通（传输状态）——授权办妥不等于线路在线，两码事分开设。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="IM 渠道三层架构"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="55" width="196" height="120" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="122" y="98" text-anchor="middle" font-size="27">📱💬</text>
    <text x="122" y="132" text-anchor="middle" font-size="14.5" font-weight="700">七个外部平台</text>
    <text x="122" y="155" text-anchor="middle" font-size="12.5" fill="#8a92a6">飞书 / Telegram / QQ / 微信…</text>
    <rect x="288" y="55" width="204" height="120" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="390" y="96" text-anchor="middle" font-size="25">🔌</text>
    <text x="390" y="128" text-anchor="middle" font-size="14.5" font-weight="700">统一接口 IMChannel</text>
    <text x="390" y="150" text-anchor="middle" font-size="12.5" fill="#8a92a6">适配器抹平协议差异</text>
    <rect x="560" y="10" width="296" height="76" rx="14" fill="#f3eefe" stroke="var(--accent)" stroke-width="3"/>
    <text x="708" y="42" text-anchor="middle" font-size="14.5" font-weight="700">连接池：每用户 → 账号槽位</text>
    <text x="708" y="66" text-anchor="middle" font-size="12.5" fill="#5b6478">凭据互斥 + 双重锁 + sealed 封存</text>
    <rect x="560" y="140" width="296" height="80" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="708" y="172" text-anchor="middle" font-size="14.5" font-weight="700">数据库：channel_accounts 表</text>
    <text x="708" y="198" text-anchor="middle" font-size="12.5" fill="#5b6478">加密密钥引用 / 认证态 / 传输态</text>
    <line x1="222" y1="115" x2="280" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="494" y1="100" x2="552" y2="58" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="494" y1="130" x2="552" y2="172" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">消息进出的门牌号是 JID：feishu:oc_xxx#account:&lt;id&gt;#thread:&lt;t&gt;——account 片段让多账号在寻址层显式化。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>服务启动先搬旧账：把旧版单连接配置投影成"默认账号"，之后只连一等公民账号<small>启动契约测试专门锁定这条规则，确保不存在遗留直连路径</small></p></div><div class="step"><span class="n">2</span><p>所有启用的渠道账号并行重连：加载密钥 → 按 provider 分派连接器 → 置 connecting，成功后置 connected<small>重连前先暂停入站并压入延迟队列，防止半途消息乱入</small></p></div><div class="step"><span class="n">3</span><p>入站回调全被包了一层门控，消息地址强制补上 account 片段再交进来<small>暂停期、被封存用户、禁用账号的消息在门口直接拒绝</small></p></div><div class="step"><span class="n">4</span><p>出站发送按优先级找归属账号：JID 自带片段 &gt; 群组记录绑定 &gt; legacy 默认账号<small>找到后还要过数据库校验（用户 active + 账号 enabled），不过就拒绝发送</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>7</b><span>个外部平台统一接入一套接口</span></div><div class="stat"><b>2</b><span>个独立状态机：认证态 × 传输态正交</span></div><div class="stat"><b>3 次</b><span>connect 前后重复复查 sealed 封存，防竞态复活被禁用户</span></div><div class="stat"><b>AES-256-GCM</b><span>密钥本体加密落文件，权限收紧 0600/0700</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>同一把 Bot 凭据不能同时插两个槽位：claimCredential 以哈希做全局互斥声明，连接断开即释放，不留死锁。</li><li>微信/WhatsApp 这类二维码渠道有第三种认证方式 qr_session：扫码过程实时推给前端渲染，授权后登录态持久化保存。</li><li>JID 是贯穿全链路的路由载体；发消息给平台 SDK 前，HappyClaw 内部的 account 片段会被剥掉——平台 API 不认识它。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>socket 还连着，是不是就意味着可以直接发消息？</dt><dd>不行。出站授权以数据库为准（用户 active 且账号 enabled），连接池里存在 socket 本身不构成发送授权——因为断开操作可能失败留下"僵尸连接"。它不保护什么：这张网只管渠道连通与授权，群组绑到哪个工作区由挂载层另行裁决。</dd><dt>凭据会不会明文躺在数据库里？</dt><dd>不会。数据库行只存 secret_ref 引用，凭据本体 AES-256-GCM 加密后写入独立文件；创建采用原子硬链接发布，多进程竞争时后到者读已有密钥，杜绝覆盖。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../13-im-qu-dao-jia-gou-yu-duo-zhang-hao-lian-jie-chi.md">IM 渠道架构与多账号连接池</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="12-sqlite-qian-yi.html">第 12 章 · SQLite 与迁移机制</a><a href="14-qu-dao-gua-zai.html">第 14 章 · 渠道挂载与绑定</a></div>

<nav class="nav">
<a href="12-sqlite-qian-yi.html">上一章：SQLite 与迁移机制 ←</a>
<a href="../index.html">返回目录</a>
<a href="14-qu-dao-gua-zai.html">下一章：渠道挂载与绑定 →</a>
</nav>
<footer>HappyClaw 图解精读 · 13 / 30</footer>
</div></body></html>
`;export{t as default};
