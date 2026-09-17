const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 25 章 · 密钥加密与凭据管理 · HappyClaw 图解精读</title>
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
<p class="crumb">第 25 章 / 30 · 认证与安全 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 25 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>密钥加密与凭据管理</h1>
<p class="lede">四类凭据一条规矩：能加密的都用同一把 32 字节主密钥的 AES-256-GCM 加密落盘；不方便加密的靠 0o600 文件权限兜底，而任何 API 都只回给你打了码的样子。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像酒店贵重物品保管处：整面墙的分格保险柜共用同一把母钥匙（主密钥，收在带门禁的前台抽屉里）；少数不便入柜的大件（MCP 密钥、容器环境变量）放进不上锁但贴着「仅限当班员工」封条的抽屉——用严格的 0o600 权限替代加密。柜台窗口永远只递寄存小票，不会把实物交到你手上——这就是「API 永不回读明文」。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="凭据分层防护"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="30" y="60" width="210" height="110" rx="14" fill="#EFEAFE" stroke="var(--accent)" stroke-width="3"/>
    <text x="135" y="100" text-anchor="middle" font-size="26">🔐🗝️</text>
    <text x="135" y="132" text-anchor="middle" font-size="14.5" font-weight="700">主密钥</text>
    <text x="135" y="155" text-anchor="middle" font-size="13" fill="#5b6478">32B hex · 0o600 · 全系统唯一</text>
    <rect x="300" y="60" width="250" height="110" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="425" y="100" text-anchor="middle" font-size="26">📦🔒</text>
    <text x="425" y="132" text-anchor="middle" font-size="14.5" font-weight="700">AES-256-GCM 密文</text>
    <text x="425" y="155" text-anchor="middle" font-size="13" fill="#5b6478">Provider 密钥 · 渠道账号密钥</text>
    <rect x="610" y="60" width="240" height="110" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="730" y="100" text-anchor="middle" font-size="26">🎟️</text>
    <text x="730" y="132" text-anchor="middle" font-size="14.5" font-weight="700">API 出口</text>
    <text x="730" y="155" text-anchor="middle" font-size="13" fill="#5b6478">只有打码值：前 3 后 4</text>
    <line x1="242" y1="115" x2="296" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="552" y1="115" x2="606" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">🗄️ 不便加密的 MCP 密钥与容器 env 走「明文 + 0o600」路线；Web 会话另有独立 session-secret.key 做 HMAC-SHA256 签名。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>你在设置页保存 Anthropic API Key<small>normalizeSecret 先剥非 ASCII、折叠空白，再整体加密写入 claude-provider.json：0o600 临时文件 → rename 原子替换 → 补一次 chmod（APFS 上 mode 可能不随 inode 跟随）</small></p></div><div class="step"><span class="n">2</span><p>刷新页面查看配置<small>GET 接口只返回 hasXxx 布尔与 maskSecret 打码值（短值保末 2 位）；数据库里渠道账号只存 secret_ref 引用字符串，SAFE_REF_RE 只放字母数字与 - _ ，杜绝路径穿越</small></p></div><div class="step"><span class="n">3</span><p>任务启动容器<small>密钥解密后写入 container-env 只读挂载文件——动机是把凭据移出进程列表，因为环境变量会暴露在 /proc/PID/environ 里；OAuth 切换第三方 Provider 时残留的 .credentials.json 被主动删除</small></p></div><div class="step"><span class="n">4</span><p>出了问题，翻开日志找原因<small>三层脱敏把关：Bearer/sk-/JWT 等格式优先于关键词正则；Axios 错误对象里的 config.headers 永不跨界；结构化日志再逐键替换为 [REDACTED]</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>32 字节</b><span>随机 hex 主密钥，全系统唯一</span></div><div class="stat"><b>0o600</b><span>密钥、密文与环境变量文件的统一权限</span></div><div class="stat"><b>3 层</b><span>日志脱敏纵深：格式 → 错误对象 → 逐键清洗</span></div><div class="stat"><b>12 rounds</b><span>登录口令 bcrypt 哈希强度</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>GCM 解密必须先 setAuthTag 再 final：密文在磁盘被篡改、或备份被部分回滚时直接抛错，而不是产出损坏的明文 JSON。</li><li>创建主密钥用 link(2) 而非 rename：双进程竞争时，抢不到的一方复用已存在的密钥——link 天生不可覆盖。</li><li>API 语义是「只增改、显式清除」：传 clearAnthropicApiKey: true 才删字段，每次变更写审计日志。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>主密钥跟着备份一起出去，会不会很危险？</dt><dd>这是刻意的取舍：backup-manifest 把 config 作为整体纳入备份，密钥与密文同箱，恢复后立刻可用；对应的边界是「备份文件本身必须按敏感数据对待」。它不保护什么——能直接读服务器磁盘或进程内存的人本来就能拿到底层明文，这套体系防的是静态落盘泄漏，不是整机失守。</dd><dt>前端要展示密钥状态，明文漏出去怎么办？</dt><dd>所有 GET 端点只暴露 hasXxx 布尔与 masked 值，明文只存在于服务端内存；MCP 更彻底，API 连键名都可能不给——system MCP 对非管理员只显示 enabled/type 最小定义。而且每条边界都有契约测试锚定：微信 botToken 不得出现在任何 API 响应、secrets.json 权限恒为 0o600 等。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../25-mi-yao-jia-mi-yu-ping-ju-guan-li.md">密钥加密与凭据管理</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="24-rbac-quan-xian.html">第 24 章 · RBAC 权限模型</a><a href="26-gua-zai-an-quan.html">第 26 章 · 挂载安全与文件校验</a></div>

<nav class="nav">
<a href="24-rbac-quan-xian.html">上一章：RBAC 权限模型 ←</a>
<a href="index.html">返回目录</a>
<a href="26-gua-zai-an-quan.html">下一章：挂载安全与文件校验 →</a>
</nav>
<footer>HappyClaw 图解精读 · 25 / 30</footer>
</div></body></html>
`;export{n as default};
