const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 19 章 · 来源与技能系统 · Craft Agents 图解精读</title>
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
<p class="crumb">第 19 章 / 23 · 会话与扩展 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 19 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>来源与技能系统</h1>
<p class="lede">来源把外部服务的工具接到助手手上，技能把做事守则写进它的「脑内台词」——一根管子递家伙，一根管子递章法。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像给一位新管家组班子：外包专家（来源）自带工具箱上门——Linear 的接单扳手、GitHub 的查码螺丝刀，先签好准入合同（认证）才能进门干活。员工手册（技能）则是压在工位玻璃板下的守则，不发一件新工具，只叮嘱「审代码先看输入校验」。专家决定管家的手能伸多远，手册决定他的脑子怎么想。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="来源与技能双通道"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="28" y="30" width="250" height="75" rx="14" fill="#fff" stroke="#f2b705" stroke-width="3"/>
    <text x="153" y="62" text-anchor="middle" font-size="21">🧰 来源 sources/</text>
    <text x="153" y="88" text-anchor="middle" font-size="13" fill="#5b6478">mcp / api / local · config.json + guide.md</text>
    <rect x="28" y="125" width="250" height="75" rx="14" fill="#fff" stroke="#2fae6d" stroke-width="3"/>
    <text x="153" y="157" text-anchor="middle" font-size="21">📘 技能 skills/</text>
    <text x="153" y="183" text-anchor="middle" font-size="13" fill="#5b6478">项目 → 工作区 → 全局 · SKILL.md</text>
    <line x1="282" y1="67" x2="356" y2="67" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="282" y1="163" x2="356" y2="163" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="360" y="30" width="240" height="75" rx="14" fill="#fff" stroke="#f2b705" stroke-width="3"/>
    <text x="480" y="58" text-anchor="middle" font-size="15" font-weight="700">McpClientPool 统一接入</text>
    <text x="480" y="86" text-anchor="middle" font-size="13" fill="#5b6478">注册为 mcp__{slug}__{toolName}</text>
    <rect x="360" y="125" width="240" height="75" rx="14" fill="#fff" stroke="#2fae6d" stroke-width="3"/>
    <text x="480" y="153" text-anchor="middle" font-size="15" font-weight="700">注入系统提示词</text>
    <text x="480" y="181" text-anchor="middle" font-size="13" fill="#5b6478">正文成为推理时的行为指令</text>
    <line x1="604" y1="67" x2="668" y2="95" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="604" y1="163" x2="668" y2="135" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <rect x="672" y="68" width="180" height="94" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="762" y="108" text-anchor="middle" font-size="26">🤖✨</text>
    <text x="762" y="142" text-anchor="middle" font-size="14.5" font-weight="700">AI 助手</text>
</svg>
<p class="caption">🔌 上路给「能做什么」（工具），下路给「怎么做」（知识），汇进同一个大脑。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>在工作区新建 <code>sources/{slug}/config.json</code>，type 三选一：mcp / api / local<small>存储模块生成 UUID 和 URL 安全 slug，图标可从 URL 自动下载</small></p></div><div class="step"><span class="n">2</span><p>按类型完成认证：OAuth 走完整流程，bearer 则填一枚静态令牌<small>SourceCredentialManager 按 source_oauth::{workspaceId}::{sourceSlug} 命名保存</small></p></div><div class="step"><span class="n">3</span><p>SourceServerBuilder 把来源翻译成 SDK 能吃下的服务器配置<small>McpClientPool.sync 增量协调：仅当 URL 或认证头变化才重连</small></p></div><div class="step"><span class="n">4</span><p>工具以 mcp__{slug}__{toolName} 的名字挂进 agent 工具表<small>API 来源经 InMemoryTransport 进程内桥接，命名规则相同</small></p></div><div class="step"><span class="n">5</span><p>同目录的 guide.md 与技能 SKILL.md 正文注入系统提示词<small>指南含 Scope/Guidelines/Context/API Notes 四段；三层级同名时后者覆盖前者</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3 种</b><span>来源类型：mcp / api / local</span></div><div class="stat"><b>5 种</b><span>API 认证模式（bearer/header/query/basic/oauth）</span></div><div class="stat"><b>3 层</b><span>技能加载：项目 → 工作区 → 全局</span></div><div class="stat"><b>7 条</b><span>来源管理 RPC 通道（GET/CREATE/DELETE 等）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>requiredSources 是声明式依赖：启用「GitHub Review」技能会自动接上 github 来源，行为指令和工具一起到位。</li><li>guide.md 支持 Cache 代码围栏（JSON）嵌入结构化数据；没写 tagline 时自动取首段充当。</li><li>内置来源 craft-agents-docs 没有磁盘文件夹，却在每个工作区常驻，可经 SearchCraftAgents 工具搜索。</li><li>技能列表有 5 分钟 TTL 缓存，工作目录变更或文件系统事件触发清空。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>token 直接写在 config.json 里安全吗？</dt><dd>设计上就不这么干：配置文件只存连接信息，令牌统一交给 SourceCredentialManager 写进工作区凭证库（source_oauth::／source_bearer:: 等命名空间键）。它不保护的是你手工塞进配置文件里的其他敏感内容——那些不经凭证库。</dd><dt>三个地方的技能同名会打架吗？</dt><dd>不会：合并顺序固定为项目 → 工作区 → 全局，slug 冲突时后加载者覆盖前者。而且技能只注入指令、不附加权限——真正的敏感操作仍受各工具的安全模式等机制约束。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../来源与技能_lukilabs_craft-agents-oss/来源与技能_lukilabs_craft-agents-oss.md">来源与技能</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="18-hui-hua-gong-zuo-qu.html">第 18 章 · 会话与工作区模型</a><a href="20-oauth-ping-zheng.html">第 20 章 · OAuth 与凭证管理</a></div>

<nav class="nav">
<a href="18-hui-hua-gong-zuo-qu.html">上一章：会话与工作区模型 ←</a>
<a href="index.html">返回目录</a>
<a href="20-oauth-ping-zheng.html">下一章：OAuth 与凭证管理 →</a>
</nav>
<footer>Craft Agents 图解精读 · 19 / 23</footer>
</div></body></html>
`;export{t as default};
