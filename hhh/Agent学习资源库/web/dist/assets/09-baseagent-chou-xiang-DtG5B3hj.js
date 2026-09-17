const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 9 章 · BaseAgent 抽象 · Craft Agents 图解精读</title>
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
<p class="crumb">第 9 章 / 23 · 架构核心 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 9 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>BaseAgent 抽象</h1>
<p class="lede">不管底下接哪家供应商的引擎，开局流程一模一样：先读技能、再备前置、走完公共步骤——只在最后「怎么炒菜」这一步留白给各家自己填。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像连锁企业总部编的标准作业手册：从客人进门到上菜的整套动线都写死了——核对手持文件（[skill:slug] 先读后用）、检查当日特殊备注（分支种子注入）、登记耗用台账（token 用量）。分店只需回答一个问题：这道菜到底怎么炒？手册里只留了七个空格，Anthropic 分店和 Pi 分店各自填上自己的做法。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="模板方法模式"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="20" y="70" width="170" height="90" rx="14" fill="#f1effb" stroke="#232733" stroke-width="2.5"/>
    <text x="105" y="108" text-anchor="middle" font-size="22">💬</text>
    <text x="105" y="138" text-anchor="middle" font-size="13.5" font-weight="700">用户消息进来</text>
    <rect x="240" y="55" width="290" height="120" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="385" y="88" text-anchor="middle" font-size="19">📋 chat() 公共四步</text>
    <text x="385" y="116" text-anchor="middle" font-size="12.5" fill="#3a3f4e">解析技能提及 → 注册前置条件</text>
    <text x="385" y="140" text-anchor="middle" font-size="12.5" fill="#3a3f4e">→ 注入分支种子 → 前置读取指令</text>
    <text x="385" y="164" text-anchor="middle" font-size="11.5" fill="#8a92a6">谁家都得照着走</text>
    <rect x="580" y="70" width="130" height="90" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="645" y="112" text-anchor="middle" font-size="17">🍳 空格</text>
    <text x="645" y="140" text-anchor="middle" font-size="13" font-weight="700">chatImpl()</text>
    <rect x="740" y="52" width="120" height="56" rx="12" fill="#f1effb" stroke="#232733" stroke-width="2"/>
    <text x="800" y="78" text-anchor="middle" font-size="12.5" font-weight="700">ClaudeAgent</text>
    <text x="800" y="97" text-anchor="middle" font-size="11" fill="#5b6478">约 2680 行</text>
    <rect x="740" y="122" width="120" height="56" rx="12" fill="#f1effb" stroke="#232733" stroke-width="2"/>
    <text x="800" y="148" text-anchor="middle" font-size="12.5" font-weight="700">PiAgent</text>
    <text x="800" y="167" text-anchor="middle" font-size="11" fill="#5b6478">约 2248 行</text>
    <line x1="192" y1="115" x2="234" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="532" y1="115" x2="574" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="712" y1="95" x2="734" y2="85" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="712" y1="135" x2="734" y2="145" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">手册背后的六个部门常年值岗：权限、来源、提示词、用量、前置条件、配置监听——各管一摊，子类免费继承。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>你 @ 了一个技能：chat() 把 [skill:slug] 提及解析成 SKILL.md 路径并注册「先读后用」前置<small>来源激活后也同理：没读过 guide.md 就不许动它的 MCP 工具</small></p></div><div class="step"><span class="n">2</span><p>若会话是从某一轮分支出来的，父消息被打包成种子块一次性注入<small>markBranchSeedApplied 保证只在第一轮触发，不会每轮重复垫底</small></p></div><div class="step"><span class="n">3</span><p>工厂按配置里的 provider 字段选类：anthropic 给 ClaudeAgent，pi 给 PiAgent<small>驱动注册表还负责解析运行时路径、校验凭据和拉模型列表</small></p></div><div class="step"><span class="n">4</span><p>干活途中每次工具调用都先过 PermissionManager 的评审<small>上下文用到 80% 和 95% 时 UsageTracker 分两级发预警</small></p></div><div class="step"><span class="n">5</span><p>SDK 找不到旧线程怎么办？恢复逻辑兜底接续对话<small>最近消息被格式化成 conversation_recovery XML 块垫在最前面继续聊</small></p></div>
</div>

<div class="stats">
<div class="stat"><b>7 个</b><span>每个提供商必答的抽象方法</span></div><div class="stat"><b>6 个</b><span>组合进基类的专职管理器</span></div><div class="stat"><b>80/95%</b><span>上下文占用的两级预警线</span></div><div class="stat"><b>~2680 行</b><span>ClaudeAgent 体量（PiAgent 约 2248 行），重复代码由此消除</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>AgentBackend 接口有意与供应商绝缘：任何 Anthropic 或 Pi 的专有类型都不允许漏过这道边界，宿主端（Electron、CLI、无头服务器）只见统一表面。</li><li>新增一家后端很便宜：实现七个方法即可继承权限、来源、恢复、标题生成等全套现成行为——唯一允许写 SDK 私货的地方就是那七个空格。</li><li>mini 模式也由基类集中定义：只许 Read/Edit/Write/Glob/Grep/Bash 六个工具外加唯一的 session MCP 键，两家解释各自落地。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>只有七个方法的契约会不会太死板，各家的特殊能力施展不开？</dt><dd>这是刻意收窄换稳定：接入成本降到最低。Claude 特有的花活（如 1M 上下文后缀）全被关在各家 chatImpl 内部消化，不污染公共接口；连能力差异都用 BACKEND_CAPABILITIES 声明式表达，会话层无需偷看 provider 字符串。</dd>
<dt>聊天到一半断了，还能接着聊吗？会不会满口胡言？</dt><dd>能续且可控：恢复块中每条消息截断到 1000 字符防撑爆上下文，分支场景注入的原始父消息上限 24 条、单条 1200 字符——恢复的是「接着聊」的语境，不是无限回放历史。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../BaseAgent_抽象_lukilabs_craft-agents-oss.md">BaseAgent 抽象</a>（文字版，含 base-agent.ts 各行号出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="08-monorepo-jia-gou.html">第 8 章 · Monorepo 架构</a><a href="10-claudeagent-sdk.html">第 10 章 · ClaudeAgent SDK 集成</a></div>

<nav class="nav">
<a href="08-monorepo-jia-gou.html">上一章：Monorepo 架构 ←</a>
<a href="index.html">返回目录</a>
<a href="10-claudeagent-sdk.html">下一章：ClaudeAgent SDK 集成 →</a>
</nav>
<footer>Craft Agents 图解精读 · 9 / 23</footer>
</div></body></html>
`;export{t as default};
