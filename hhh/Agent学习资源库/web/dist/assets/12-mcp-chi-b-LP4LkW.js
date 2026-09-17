const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 12 章 · MCP 客户端池 · Craft Agents 图解精读</title>
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
<p class="crumb">第 12 章 / 23 · 架构核心 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 12 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>MCP 客户端池</h1>
<p class="lede">所有会话要连外部 MCP 服务都得先经过这口机房：连接复用一份、令牌只锁一处、HTTP 还是本机子进程一视同仁。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像公司前台那部老式总机：各部门（一个个 agent 后端）找外部合作伙伴都不自拉电话线；总机替全公司保留一条线路，谁要说话就把听筒转给谁——同一个 Linear 合作方永远只占一根线。所有门禁卡（OAuth 令牌）锁在接线员抽屉里绝不发下去；新部门入职时只需报一份期望名单，接线员自动对账：该接的接通、该挂的挂掉。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="MCP 客户端池"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="20" y="30" width="215" height="46" rx="12" fill="#f1effb" stroke="#232733" stroke-width="2"/>
    <text x="127" y="59" text-anchor="middle" font-size="13" font-weight="700">🌐 远程来源 HTTP/SSE</text>
    <rect x="20" y="92" width="215" height="46" rx="12" fill="#f1effb" stroke="#232733" stroke-width="2"/>
    <text x="127" y="121" text-anchor="middle" font-size="13" font-weight="700">📁 本地 stdio 子进程</text>
    <rect x="20" y="154" width="215" height="46" rx="12" fill="#f1effb" stroke="#232733" stroke-width="2"/>
    <text x="127" y="183" text-anchor="middle" font-size="13" font-weight="700">⚙️ 进程内 API 来源</text>
    <rect x="330" y="55" width="220" height="120" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="440" y="95" text-anchor="middle" font-size="24">☎️ McpClientPool</text>
    <text x="440" y="126" text-anchor="middle" font-size="12.5" fill="#3a3f4e">mcp__linear__createIssue 这类代名</text>
    <text x="440" y="150" text-anchor="middle" font-size="12.5" fill="#3a3f4e">工具缓存 + 大响应保护 + 凭证安全</text>
    <rect x="640" y="28" width="218" height="42" rx="12" fill="#f1effb" stroke="#232733" stroke-width="2"/>
    <text x="749" y="55" text-anchor="middle" font-size="13" font-weight="700">🤖 ClaudeAgent · 进程内代理</text>
    <rect x="640" y="94" width="218" height="42" rx="12" fill="#f1effb" stroke="#232733" stroke-width="2"/>
    <text x="749" y="121" text-anchor="middle" font-size="13" font-weight="700">🧩 PiAgent · 经 JSONL 回传执行</text>
    <rect x="640" y="160" width="218" height="42" rx="12" fill="#f1effb" stroke="#232733" stroke-width="2"/>
    <text x="749" y="187" text-anchor="middle" font-size="13" font-weight="700">📡 外部 SDK · 走 HTTP 桥接</text>
    <line x1="237" y1="53" x2="324" y2="88" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="237" y1="115" x2="324" y2="115" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="237" y1="177" x2="324" y2="142" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="552" y1="90" x2="634" y2="55" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="552" y1="115" x2="634" y2="115" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="552" y1="140" x2="634" y2="177" stroke="#232733" stroke-width="3.5" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">三种消费者殊途同归：最终都汇到同一个 callTool() 方法，享受一致的内容清洗、二进制处理与超长响应保护。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>sync() 收到期望名单后自动对账<small>不在名单上的断开、没连上的接通；URL 或授权头变了就重建，且刻意不比对 stdio 来源</small></p></div><div class="step"><span class="n">2</span><p>接通瞬间列一遍工具并缓存，同时造好代名册<small>mcp__{slug}__{toolName} 命名与 Claude SDK 的前缀习惯对齐，多余 $schema 键被剥掉防止校验翻车</small></p></div><div class="step"><span class="n">3</span><p>任一后端喊名字，总机按代名反查出真实来源并送达参数<small>本地 stdio 子进程拿到的环境变量先过滤：API 密钥、令牌、AWS 凭证一律滤除</small></p></div><div class="step"><span class="n">4</span><p>结果回程也要过三道工序才交到模型手里<small>图片/音频按魔数字节识别解码落盘；文本过长则存文件或请模型摘要，防止上下文溢出</small></p></div><div class="step"><span class="n">5</span><p>挂断同样干净利落<small>disconnect 收线并清缓存；对外 HTTP 桥只绑 127.0.0.1 随机端口、无状态运行</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3 个</b><span>PoolClient 接口的全部方法（列出·调用·关闭）</span></div><div class="stat"><b>127.0.0.1</b><span>对外桥接端口唯一绑定的地址</span></div><div class="stat"><b>64 字符</b><span>属性命名上限（字母数字下划线点短横）</span></div><div class="stat"><b>401/403</b><span>触发 needs-auth 状态的 HTTP 信号</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>API 来源连网线都省了：内存管道直连两端，进程内工具调用零网络开销。</li><li>接入前有独立健康检查：工具 schema 若违反 Anthropic 的属性命名约束会被标为 invalid-schema，精确列出问题键名供 UI 渲染修复建议。</li><li>失败结果都带 sourceSlug 归因：界面能明确指出是哪个来源的锅，并给出重新认证或禁用该来源的针对性操作。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>所有来源挤一部总机，会不会变成单点故障？</dt><dd>单点是事实，也是特性：集中换来了连接去重和统一错误归属，多会话不必各自重复握手同一个 Linear。但它只聚合连接，不担保上游服务质量——某个来源宕机时对应对话照样失败，只是错误信息更有指向性。</dd><dt>对方起的工具名五花八门也能接吗？</dt><dd>有底线：接入前的验证会拦下违反 Anthropic 命名约束的 schema（这是 Claude 特有的约束，MCP 规范本身没有）。禁用了本地 MCP 执行的工作区还会静默跳过全部 stdio 来源——这是工作区级的安全门控，不是全局开关。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../MCP_客户端池_lukilabs_craft-agents-oss.md">MCP 客户端池</a>（文字版，含 mcp-pool.ts 与 pool-server.ts 出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="11-piagent-xie-yi.html">第 11 章 · PiAgent 子进程协议</a><a href="13-quan-xian-mo-shi.html">第 13 章 · 权限模式系统</a></div>

<nav class="nav">
<a href="11-piagent-xie-yi.html">上一章：PiAgent 子进程协议 ←</a>
<a href="index.html">返回目录</a>
<a href="13-quan-xian-mo-shi.html">下一章：权限模式系统 →</a>
</nav>
<footer>Craft Agents 图解精读 · 12 / 23</footer>
</div></body></html>
`;export{t as default};
