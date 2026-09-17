const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 4 章 · 首次配置向导：管理员、模型与渠道接入 · HappyClaw 图解精读</title>
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
<p class="crumb">第 4 章 / 30 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 4 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>首次配置向导：管理员、模型与渠道接入</h1>
<p class="lede">空系统只放行首任管理员：先建号，再配好能用的模型 Provider，IM 渠道可接可不接——needsSetup 清零之前，管理员会被向导一路押着走。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像新餐厅开业：工商所只在店面还空着时受理执照（POST /api/auth/setup 的「无任何用户」事务检查），首证到手即赠旗舰店门面（Home 工作区）并当场上岗；接着签食材供应商——官方直供（OAuth 一键登录）或第三方兼容渠道三件套；外卖接线（7 种 IM 渠道）晚点补办也不影响堂食。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="首次配置向导流程"><defs><marker id="ar4" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="66" width="196" height="100" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="122" y="104" text-anchor="middle" font-size="22">👮✅</text>
    <text x="122" y="132" text-anchor="middle" font-size="13.5" font-weight="700">/setup 建首任管理员</text>
    <text x="122" y="156" text-anchor="middle" font-size="12.5" fill="#5b6478">仅当用户数为 0</text>
    <line x1="222" y1="116" x2="286" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar4)"/>
    <rect x="292" y="66" width="200" height="100" rx="14" fill="#f1ecfe" stroke="var(--accent)" stroke-width="3"/>
    <text x="392" y="102" text-anchor="middle" font-size="22">🔑🤖</text>
    <text x="392" y="130" text-anchor="middle" font-size="13.5" font-weight="700">/setup/providers 配 Provider</text>
    <text x="392" y="154" text-anchor="middle" font-size="12.5" fill="#5b6478">官方三种 / 第三方三件套</text>
    <line x1="494" y1="116" x2="558" y2="116" stroke="#232733" stroke-width="4" stroke-dasharray="8 6" marker-end="url(#ar4)"/>
    <text x="526" y="98" text-anchor="middle" font-size="12" fill="#8a92a6">可跳过</text>
    <rect x="564" y="66" width="150" height="100" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="639" y="104" text-anchor="middle" font-size="22">💬📋</text>
    <text x="639" y="134" text-anchor="middle" font-size="13.5">IM 渠道接入</text>
    <line x1="716" y1="116" x2="762" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar4)"/>
    <rect x="706" y="52" width="152" height="128" rx="16" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="782" y="96" text-anchor="middle" font-size="24">🎉</text>
    <text x="782" y="126" text-anchor="middle" font-size="13.5" font-weight="700">/chat 工作台</text>
    <text x="782" y="150" text-anchor="middle" font-size="12" fill="#5b6478">跳过则顶部黄横幅</text>
  </svg>
  <p class="caption">建号同一场事务里还送四件事：审计日志、Home 工作区、绑定默认智能体、自动登录。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>打开 localhost:3000，GET /api/auth/status 报告系统是否已有用户<small>没有任何用户才导向 /setup；之后所有人一律先经 /login 登录</small></p></div><div class="step"><span class="n">2</span><p>提交建号表单，SQLite 事务内原子检查「用户数为 0」<small>用户名 3-32 位统一小写，密码 8-128 位；并发请求抢不走首号（403 already_initialized）</small></p></div><div class="step"><span class="n">3</span><p>拿到向导第二页 STEP 2/2：配置模型提供商<small>setupStatus 遍历所有启用 Provider 判断 needsSetup，保存后 checkAuth 确认清零才放行</small></p></div><div class="step"><span class="n">4</span><p>官方凭据三选一：OAuth 一键登录、Setup Token、API Key<small>第三方只需 Endpoint + Auth Token + 模型名三个必填字段</small></p></div><div class="step"><span class="n">5</span><p>渠道页可点「稍后设置」，跳过后 /chat 顶部出黄色横幅提醒<small>忘记密码不慌：npm run reset:admin -- 用户名 新密码 就地重置并强制重新登录</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>0</b><span>用户存在时才允许 /setup 建号</span></div><div class="stat"><b>3</b><span>种官方凭据接入方式可选</span></div><div class="stat"><b>7</b><span>种 IM 渠道可接、可随时补</span></div><div class="stat"><b>8+</b><span>位密码底线（上限 128 位）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>注册策略在首个管理员诞生前被硬性锁死：接口强制返回 allowRegistration: false + 必须邀请码，把人挡在门外。</li><li>渠道凭据走 AES-256-GCM 加密落盘（iv + authTag + ciphertext），密钥文件权限 0600，账号写库失败会回滚已加密文件。</li><li>微信与 WhatsApp 用扫码配对，Telegram 类渠道用一次性配对码在 Bot 私聊发 /pair 完成授权。</li><li>Provider 管理后续都在设置页完成：密钥字段永远只回掩码（hasXxx 与 xxxMasked），健康阈值默认连续失败 3 次、恢复窗口 5 分钟。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>问一下 API 就能把存好的 Key 吐出来吗？会不会泄漏？</dt><dd>不会明文外泄：toPublicProvider 只返回「是否已配置」布尔值和掩码串，数据库里每个账号是独立的 iv + authTag + ciphertext 密文。但要说清它不保护什么：一旦攻击者拿到 data/config/ 目录连同密钥文件本身，加密也就形同虚设——所以备份要控制权限、服务器要做好准入。</dd><dt>渠道这步真的可以一直拖着吗？</dt><dd>可以。它完全不影响进入工作台，只影响 IM 消息能否与 Web 对话互通；横幅可手动关闭（记忆在 localStorage）。哪天想接了，随时回到设置页补——微信扫码、Telegram 找 @BotFather 建 Bot，各渠道都有分步引导。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../04-%E9%A6%96%E6%AC%A1%E9%85%8D%E7%BD%AE%E5%90%91%E5%AF%BC%EF%BC%9A%E7%AE%A1%E7%90%86%E5%91%98%E3%80%81%E6%A8%A1%E5%9E%8B%E6%8F%90%E4%BE%9B%E5%95%86%E4%B8%8E%E6%B8%A0%E9%81%93%E6%8E%A5%E5%85%A5.md">首次配置向导：管理员、模型提供商与渠道接入</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="03-kai-fa-yu-ming-ling.html">第 3 章 · 开发模式与常用命令</a><a href="05-bu-shu-yun-wei.html">第 5 章 · 部署与运维</a></div>

<nav class="nav">
<a href="03-kai-fa-yu-ming-ling.html">上一章：开发模式与常用命令 ←</a>
<a href="05-bu-shu-yun-wei.html">下一章：部署与运维 →</a>
</nav>
<footer>HappyClaw 图解精读 · 4 / 30</footer>
</div></body></html>
`;export{t as default};
