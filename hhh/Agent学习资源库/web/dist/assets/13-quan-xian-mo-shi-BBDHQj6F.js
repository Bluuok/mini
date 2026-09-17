const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 13 章 · 权限模式系统 · Craft Agents 图解精读</title>
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
<p class="crumb">第 13 章 / 23 · 权限与自动化 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 13 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>权限模式系统</h1>
<p class="lede">Agent 每次要动一下电脑，都得先过一道门禁：Explore 只看不摸、Ask to Edit 动手先问、Execute 直接放行。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像写字楼的门禁卡分三级：访客证只能在大厅参观，读写区碰都别想碰；外协工牌要办什么事先找负责人签个字；长期员工的通行卡则刷卡即进。三层制度还能叠加——写字楼有基本章程，你的公司再补细则，你自己的工位还能再加约定，规定只会加多、不会被下层推翻。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="权限决策流"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="20" y="55" width="215" height="120" rx="14" fill="#eef1fb" stroke="#7C5CFC" stroke-width="3"/>
    <text x="127" y="100" text-anchor="middle" font-size="26">🎫🤖</text>
    <text x="127" y="132" text-anchor="middle" font-size="14.5" fill="#5b6478">一次工具调用到来</text>
    <text x="127" y="155" text-anchor="middle" font-size="13" fill="#8a92a6">读文件 / 改文件 / 跑命令</text>
    <rect x="315" y="55" width="250" height="120" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="440" y="98" text-anchor="middle" font-size="26">👮</text>
    <text x="440" y="126" text-anchor="middle" font-size="14.5" font-weight="700">守门人判决</text>
    <text x="440" y="150" text-anchor="middle" font-size="13" fill="#8a92a6">唯一入口 shouldAllowToolInMode</text>
    <rect x="645" y="18" width="215" height="56" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="752" y="45" text-anchor="middle" font-size="14.5" font-weight="700">✅ 只读工具直接放行</text>
    <text x="752" y="64" text-anchor="middle" font-size="12.5" fill="#5b6478">Read/Glob/Grep/WebFetch…</text>
    <rect x="645" y="88" width="215" height="56" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="752" y="115" text-anchor="middle" font-size="14.5" font-weight="700">❓ 写入类按当前模式问</text>
    <text x="752" y="134" text-anchor="middle" font-size="12.5" fill="#5b6478">编辑前询问 · 弹确认</text>
    <rect x="645" y="158" width="215" height="52" rx="12" fill="#fdeeee" stroke="#e5484d" stroke-width="2.5"/>
    <text x="752" y="182" text-anchor="middle" font-size="14.5" font-weight="700">⛔ 探索模式下硬拦</text>
    <text x="752" y="201" text-anchor="middle" font-size="12.5" fill="#5b6478">四个写入工具永不放行</text>
    <line x1="237" y1="115" x2="311" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="567" y1="95" x2="641" y2="52" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="567" y1="115" x2="641" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="567" y1="137" x2="641" y2="180" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">所有判决出自同一个函数 <code>shouldAllowToolInMode()</code>——不管请求来自哪里，都走这一扇门。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>你按下 SHIFT+TAB，把会话从 Explore 切到 Ask to Edit<small>切换顺序固定为 safe → ask → allow-all，由 PERMISSION_MODE_ORDER 定义</small></p></div><div class="step"><span class="n">2</span><p>每会话独立的状态记下：新模式、上一模式、谁改的、几点改的<small>ModeManager 单例但无全局状态，lastChangedBy 标注 user/system/automation 等来源</small></p></div><div class="step"><span class="n">3</span><p>下一条消息里悄悄塞进一段 XML 状态块，告诉 Agent 现在的权限约束<small>modeChangeUserSignal 是一次性信号，用完即耗，防止 Agent 反复念叨旧通知</small></p></div><div class="step"><span class="n">4</span><p>Agent 想跑一条 Shell 命令，守门人层层查验<small>危险控制字符、管道/重定向、参数扩展先筛一遍，再对照合并后的只读命令白名单</small></p></div><div class="step"><span class="n">5</span><p>想写文件？只有 plans 和 data 文件夹例外放行<small>即使探索模式也允许，路径检查防同前缀绕过与符号链接逃逸</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3 级</b><span>信任梯度：探索 / 编辑前询问 / 执行</span></div><div class="stat"><b>11 个</b><span>全模式放行的只读工具（读取、检索、调研等）</span></div><div class="stat"><b>4 个</b><span>写入工具在探索模式永远被拦，配置也救不了</span></div><div class="stat"><b>3 层</b><span>应用默认 + 工作区 + 来源级，累加合并不覆盖</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>权限分层像俄罗斯套娃：首次启动把 default.json 复制到 ~/.craft-agent/permissions/，升级时只追加新规则，坏文件自动修复。</li>
<li>来源级的 MCP 白名单会自动加前缀 mcp__&lt;来源名&gt;__，为 A 集成开的口子绝不会顺带放行 B 集成。</li>
<li>MCP 工具走四路分流：文档工具全放行、会话工具查安全名单、API 工具验方法加路径正则、其余查 readOnlyMcpPatterns。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>切到 Execute 全自动执行，是不是等于裸奔？</dt><dd>Execute 不再逐条询问，但 blockedTools 黑名单照样生效、始终允许名单也不变。要说清边界：它不保护的是「不在黑名单里的任何写入和网络操作」，模式只控制“要不要问”，不审查操作结果本身的质量与后果。</dd>
<dt>Agent 怎么知道自己被限权了？</dt><dd>formatSessionState() 每轮把当前模式、变更历史和可写入的 plans/data 路径注入用户消息，Agent 无需额外调用就能实时感知约束。</dd>
<dt>三层配置打架怎么办？</dt><dd>不打架——每一层都是向下扩展而非覆盖，最终合成一份运行时配置；来源规则还被自动限定作用域，杜绝意外扩权。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../权限模式系统_lukilabs_craft-agents-oss/权限模式系统_lukilabs_craft-agents-oss.md">权限模式系统</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="12-mcp-chi.html">第 12 章 · MCP 客户端池</a><a href="14-zi-dong-hua-yin-qing.html">第 14 章 · 自动化引擎</a></div>

<nav class="nav">
<a href="12-mcp-chi.html">上一章：MCP 客户端池 ←</a>
<a href="index.html">返回目录</a>
<a href="14-zi-dong-hua-yin-qing.html">下一章：自动化引擎 →</a>
</nav>
<footer>Craft Agents 图解精读 · 13 / 23</footer>
</div></body></html>
`;export{t as default};
