const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 21 章 · 会话工具核心 · Craft Agents 图解精读</title>
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
<p class="crumb">第 21 章 / 23 · 会话与扩展 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 21 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>会话工具核心</h1>
<p class="lede">22 个会话工具写进同一份声明式清单，三家后端照单上菜；真要动火的数据脚本，必须先过「没收钥匙、断网、锁抽屉」三道防护。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>连锁餐厅的总部标准菜谱：菜名、配料校验（Zod 模式）、做法（handler）一次写死，Claude、Pi、session-mcp-server 三家门店不许私改配方，端出来的味道完全一致。要动火的菜（数据脚本）必须上带防护罩的操作台——门口没收随身钥匙（剥离 API 密钥环境变量）、屋里断网、废料只能丢进指定抽屉（只许写会话目录）。哪间店装不了防护罩？这道菜干脆不卖，而不是裸着做。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="脚本沙箱三层隔离"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="26" y="62" width="170" height="106" rx="14" fill="#fff" stroke="#f2b705" stroke-width="3"/>
    <text x="111" y="102" text-anchor="middle" font-size="24">📜🐍</text>
    <text x="111" y="130" text-anchor="middle" font-size="13.5" font-weight="700">待执行脚本</text>
    <text x="111" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">Python / Node / Bun</text>
    <line x1="200" y1="115" x2="252" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="256" y="24" width="180" height="182" rx="14" fill="#fff" stroke="#e5484d" stroke-width="3"/>
    <text x="346" y="56" text-anchor="middle" font-size="19">🚫🔑</text>
    <text x="346" y="82" text-anchor="middle" font-size="13.5" font-weight="700">环境净化</text>
    <text x="346" y="110" text-anchor="middle" font-size="12.5" fill="#5b6478">剥离密钥变量</text>
    <text x="346" y="134" text-anchor="middle" font-size="12.5" fill="#5b6478">缓存重定向进会话</text>
    <text x="346" y="176" text-anchor="middle" font-size="12" fill="#8a92a6">Anthropic/AWS/GitHub…</text>
    <line x1="440" y1="115" x2="492" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="496" y="24" width="180" height="182" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="586" y="56" text-anchor="middle" font-size="19">🛡️🌐</text>
    <text x="586" y="82" text-anchor="middle" font-size="13.5" font-weight="700">断网隔离</text>
    <text x="586" y="110" text-anchor="middle" font-size="12.5" fill="#5b6478">macOS sandbox-exec</text>
    <text x="586" y="134" text-anchor="middle" font-size="12.5" fill="#5b6478">Linux unshare -n</text>
    <text x="586" y="176" text-anchor="middle" font-size="12" fill="#8a92a6">出站连接全部拒绝</text>
    <line x1="680" y1="115" x2="732" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="736" y="24" width="118" height="182" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="795" y="56" text-anchor="middle" font-size="19">📁🔒</text>
    <text x="795" y="82" text-anchor="middle" font-size="13.5" font-weight="700">写入圈禁</text>
    <text x="795" y="110" text-anchor="middle" font-size="12.5" fill="#5b6478">bwrap / 配置档</text>
    <text x="795" y="150" text-anchor="middle" font-size="12" fill="#8a92a6">只许写会话目录</text>
    <text x="795" y="188" text-anchor="middle" font-size="11.5" fill="#8a92a6">realpath 防逃逸</text>
    <rect x="26" y="8" width="828" height="4" rx="2" fill="#ece7fc"/>
    <text x="440" y="222" text-anchor="middle" font-size="13" fill="#5b6478">任一层无法强制执行 → 整个 script_sandbox 拒绝运行（默认拒绝）</text>
</svg>
<p class="caption">🧤 三层依次过闸；平台做不到哪层就不开工，绝不无防护裸跑。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>Claude、Pi、session-mcp-server 各自实现 SessionToolContext 注入能力<small>工具处理程序全网只有一份；Pi 经 stderr 的 __CALLBACK__ JSON 收发暂停/认证事件</small></p></div><div class="step"><span class="n">2</span><p>agent 发起调用：Zod 校验入参，按 executionMode 分流<small>registry 工具直接跑本包 handler；browser_tool、call_llm、spawn_session 转交后端适配器</small></p></div><div class="step"><span class="n">3</span><p>Explore/Safe 权限模式下按 safeMode 过滤菜单<small>所有 OAuth 与凭证触发工具一律 block——绝不在无人点头时发起认证</small></p></div><div class="step"><span class="n">4</span><p>数据脚本进入多层沙箱执行，超时 30 秒<small>macOS 用单个 sandbox-exec 配置同时限网限写；Linux 先 unshare -n 再 bwrap 顺序套壳</small></p></div><div class="step"><span class="n">5</span><p>SubmitPlan 特殊：提交后不还控制权给模型<small>onPlanSubmitted 触发 forceAbort 整场暂停，用户接受或修改计划后才继续</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>22 个</b><span>会话工具，分六大功能类别</span></div><div class="stat"><b>19 + 3</b><span>注册表工具 + 后端声明工具</span></div><div class="stat"><b>30 秒</b><span>数据转换脚本的执行超时</span></div><div class="stat"><b>12 种</b><span>Mermaid 图类型离线语法校验</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>沙箱黑名单 BLOCKED_ENV_VARS 清走 Anthropic、AWS、GitHub、OpenAI、Google、Stripe、npm 七家密钥变量。</li><li>path-security 用 realpath 解析防符号链接逃逸：目录内造个指向外面的软链也钻不出去。</li><li>模板引擎是自带 HTML 转义的轻量 Mustache，渲染输出防 XSS；缺必填字段仅告警不阻塞。</li><li>Packaged 打包模式下默认禁止从 PATH 找解释器，防止执行不可信的系统 Python/Node。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>万一系统不支持沙箱，脚本会不会偷偷裸跑？</dt><dd>不会——这正是「默认拒绝」设计：网络或文件系统隔离无法强制执行时，script_sandbox 直接报错不开工。它保护的是脚本子进程的网络与写入边界；主 agent 自身其他已获批的工具权限不受这套沙箱管。</dd><dt>22 个工具在每个后端都长得一样吗？</dt><dd>处理逻辑完全一致，差异只在传输：Claude 直接函数调用，session-mcp-server 用 zodToJsonSchema 转成带 mcp__session__ 前缀的 MCP 定义。无头后端可省略可选能力（如凭证管理），缺失时返回错误响应而非崩溃。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../会话工具核心_lukilabs_craft-agents-oss/会话工具核心_lukilabs_craft-agents-oss.md">会话工具核心</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="20-oauth-ping-zheng.html">第 20 章 · OAuth 与凭证管理</a><a href="22-wu-tou-yuan-cheng.html">第 22 章 · 无头远程服务器</a></div>

<nav class="nav">
<a href="20-oauth-ping-zheng.html">上一章：OAuth 与凭证管理 ←</a>
<a href="index.html">返回目录</a>
<a href="22-wu-tou-yuan-cheng.html">下一章：无头远程服务器 →</a>
</nav>
<footer>Craft Agents 图解精读 · 21 / 23</footer>
</div></body></html>
`;export{t as default};
