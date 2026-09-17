const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 10 章 · ClaudeAgent SDK 集成 · Craft Agents 图解精读</title>
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
<p class="crumb">第 10 章 / 23 · 架构核心 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 10 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>ClaudeAgent SDK 集成</h1>
<p class="lede">Anthropic 官方引擎自带的闸机被刻意关掉：每一次动工具，都要先过宿主自设的六道关卡——安全模式、白名单、限时审批都在这里落地。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像请来一位自成流派的外籍大厨（SDK 子进程）：他确实手艺好，但自带的出入管理太粗放。于是店主在他后厨门口设了质检台——先核对配方是否要求先看菜谱（前置追踪）、盘子女大就挡在门外（图像守卫）、动危险刀具前必须请你签字（权限门控）；你中途隔着玻璃喊话，他下次转身时会听到。SDK 自带的简单「允许/拒绝」被特意绕开（bypassPermissions），因为你的质检台更细。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="PreToolUse 钩子链"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="20" y="70" width="160" height="90" rx="14" fill="#f1effb" stroke="#232733" stroke-width="2.5"/>
    <text x="100" y="108" text-anchor="middle" font-size="22">🤖</text>
    <text x="100" y="138" text-anchor="middle" font-size="13" font-weight="700">SDK 想用工具</text>
    <rect x="230" y="55" width="360" height="120" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="410" y="86" text-anchor="middle" font-size="16" font-weight="700">PreToolUse 安检链（依次过）</text>
    <text x="410" y="112" text-anchor="middle" font-size="12.5" fill="#3a3f4e">① 前置追踪 ② 图像大小守卫 ~3.5MB</text>
    <text x="410" y="134" text-anchor="middle" font-size="12.5" fill="#3a3f4e">③ 安全模式·危险命令·白名单 ④ 权限门控</text>
    <text x="410" y="158" text-anchor="middle" font-size="12" fill="#8a92a6">⑤ 中途引导注入 ⑥ 用户自动化钩子并入</text>
    <rect x="650" y="70" width="200" height="42" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="750" y="97" text-anchor="middle" font-size="13" font-weight="700">✅ 放行执行</text>
    <rect x="650" y="126" width="200" height="42" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="750" y="153" text-anchor="middle" font-size="13" font-weight="700">🙋 弹窗请你批准</text>
    <line x1="182" y1="115" x2="224" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="592" y1="95" x2="644" y2="90" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="592" y1="135" x2="644" y2="148" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">图像守卫排在最前不是随意：超大图片一旦混进对话历史，API 会以 400 拒绝后续轮次——会话就此永久报废。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>第一次开口前，postInit 先把钥匙递进后厨<small>凭据按优先级解析：OAuth 令牌 → 凭据管理器 → ANTHROPIC_API_KEY 环境变量；陈旧的 Bedrock/Vertex 路由变量会被清掉防误连</small></p></div><div class="step"><span class="n">2</span><p>chatImpl 组装选项并启动查询流<small>bypassPermissions 关掉 SDK 自带闸机，安检权整体移交宿主钩子；stderr 只留最后 20 行备诊断</small></p></div><div class="step"><span class="n">3</span><p>SDK 每次要动手，PreToolUse 链依次过关<small>Read 图像文件先查体积：超约 3.5MB 触发异步缩小或直接拦下</small></p></div><div class="step"><span class="n">4</span><p>需要批准时弹出权限请求，通过后干活继续<small>你中途纠偏的话会成为 pendingSteerMessage，附在下一次工具调用的 additionalContext 上送达</small></p></div><div class="step"><span class="n">5</span><p>事件经适配器翻译成统一的 AgentEvent 流回界面<small>错误分 provider / network / unknown 三类，各配可操作建议；销毁时级联清理 MCP 池与监听器</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>1 处</b><span>全仓库唯一的 Claude Agent SDK 依赖点</span></div><div class="stat"><b>1M</b><span>默认开启的上下文上限选择（Opus 4.6）</span></div><div class="stat"><b>~3.5MB</b><span>单张图片的原始体积红线（5MB base64）</span></div><div class="stat"><b>−70%</b><span>mini 模式相对完整模式的每轮 token 消耗</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>百万级上下文靠后缀开关：给模型标识符追加 [1m] 选择加入扩展窗口，拦截器同时剥掉 SDK 注入的 Beta 请求头避免冲突，enable1MContext 默认为 true。</li><li>五档思考等级会看人下菜：真 Anthropic 后端用自适应 effort；兼容 API 退化成显式 token 预算——Haiku 只有 2K–8K，默认模型是 4K–32K。</li><li>MCP 来源从不直连：每个已连接 slug 包成一个进程内代理服务器转交池子处理，连接生命周期全部集中管理。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>权限检查全揽到自己手里，会不会比 SDK 原生更弱？</dt><dd>方向相反：绕过原生的允许/拒绝语义正是为了换来更丰富的控制面——安全模式全禁变更、会话内白名单、限时审批 TTL、命令哈希去重都在宿主侧实现。边界也直说：它保护的范围取决于宿主的判断质量，而用户自己写进 automations.json 的自动化钩子也会被合并进这条链——自定义行为同样在安检之内，不等于额外豁免。</dd><dt>中途插话一定能送达吗？</dt><dd>不保证。如果到本轮结束都没触发任何工具，会产生 steer_undelivered 事件让上层重新排队——消息不会悄悄消失，但也不会强行打断 SDK 的内部节奏。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../ClaudeAgent_SDK_集成_lukilabs_craft-agents-oss.md">ClaudeAgent SDK 集成</a>（文字版，含钩子链与选项表出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="09-baseagent-chou-xiang.html">第 9 章 · BaseAgent 抽象</a><a href="11-piagent-xie-yi.html">第 11 章 · PiAgent 子进程协议</a></div>

<nav class="nav">
<a href="09-baseagent-chou-xiang.html">上一章：BaseAgent 抽象 ←</a>
<a href="index.html">返回目录</a>
<a href="11-piagent-xie-yi.html">下一章：PiAgent 子进程协议 →</a>
</nav>
<footer>Craft Agents 图解精读 · 10 / 23</footer>
</div></body></html>
`;export{t as default};
