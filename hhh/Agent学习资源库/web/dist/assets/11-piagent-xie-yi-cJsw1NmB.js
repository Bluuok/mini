const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 11 章 · PiAgent 子进程协议 · Craft Agents 图解精读</title>
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
<p class="crumb">第 11 章 / 23 · 架构核心 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 11 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>PiAgent 子进程协议</h1>
<p class="lede">一整套塞不进 Electron 的 ESM 依赖被整体搬到隔壁小屋，双方只认一行一条的 JSON 纸条：指令递进去，事件传出来。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像请了一位只讲行话的外籍技师：他的整套工具箱和装修风格（纯 ESM 模块树）没法嵌进你家车间，硬塞会把整栋楼的水电搞崩。于是隔出一间小屋让他安家，中间只留一扇小窗——指令一张张递进去，事件一行行传出来；他的抱怨与调试笔记写在自己的本子上（stderr），绝不占用窗口通道；他想借用你家的设备，必须先递条子等你批复。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="JSONL stdio 协议"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="25" y="45" width="240" height="140" rx="14" fill="#f1effb" stroke="#232733" stroke-width="2.5"/>
    <text x="145" y="90" text-anchor="middle" font-size="22">🏠 宿主进程</text>
    <text x="145" y="122" text-anchor="middle" font-size="12.5" fill="#3a3f4e">Electron 主进程 或 CLI</text>
    <text x="145" y="148" text-anchor="middle" font-size="12.5" fill="#3a3f4e">权限判断都在这一侧</text>
    <rect x="610" y="45" width="245" height="140" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="732" y="90" text-anchor="middle" font-size="22">🛠️ 隔壁小屋</text>
    <text x="732" y="122" text-anchor="middle" font-size="12.5" fill="#3a3f4e">pi-agent-server 子进程</text>
    <text x="732" y="148" text-anchor="middle" font-size="12.5" fill="#3a3f4e">整个 Pi SDK 隔离于此（Bun 构建）</text>
    <rect x="355" y="42" width="160" height="34" rx="17" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="435" y="65" text-anchor="middle" font-size="13" font-weight="700">stdin → JSONL 命令</text>
    <rect x="355" y="150" width="160" height="34" rx="17" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="435" y="173" text-anchor="middle" font-size="13" font-weight="700">stdout ← 事件流</text>
    <line x1="267" y1="59" x2="349" y2="59" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="521" y1="167" x2="604" y2="167" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <text x="435" y="120" text-anchor="middle" font-size="12" fill="#8a92a6">stderr 只走调试日志，保持纸条纯净</text>
  </svg>
  <p class="caption">进出各管一条道：init / prompt / abort 从 stdin 进，ready / event / pre_tool_use_request 从 stdout 出。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>先递 init：小屋记下密钥、模型和工作目录，另开随机端口回报「就绪」<small>ready 消息带 callbackPort；真会话很懒——第一条 prompt 到了才创建，好让你先把代理工具注册进去</small></p></div><div class="step"><span class="n">2</span><p>任何工具要执行，小屋必先递 pre_tool_use_request 并原地等批复<small>权限逻辑全部集中在宿主侧；请求-响应用 requestId 配对，abort 时所有等待统一放行为阻断防卡死</small></p></div><div class="step"><span class="n">3</span><p>必须在宿主干的活反过来托付：代理工具经 register_tools 注册成「占位名片」<small>名片只有名字、描述、参数 schema；执行时发 tool_execute_request 回宿主拿结果</small></p></div><div class="step"><span class="n">4</span><p>一条消息冒出两个以上并行工具调用时，小屋不等 SDK 排队<small>推测性预取：提前全部并发发出，每个执行者命中缓存而非重复请求</small></p></div><div class="step"><span class="n">5</span><p>上下文爆了也不慌：自动压缩一轮再重发提示词<small>重试前每 200ms 轮询一次压缩状态、最多等 60 秒，防两个压缩任务抢方向盘</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>≥2 条</b><span>并行的工具调用即触发推测性预取</span></div><div class="stat"><b>200ms</b><span>压缩竞态防护的轮询间隔（上限 60 秒）</span></div><div class="stat"><b>128K</b><span>自定义端点的默认上下文窗口</span></div><div class="stat"><b>3 类</b><span>凭据形态：api_key / oauth / iam</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>关机有固定次序：退订事件 → 销毁会话 → 停回调服务器 → 以明确原因拒绝所有悬空 Promise → 退出，小屋里不留悬挂句柄。</li><li>临时摘要查询走用完即弃的内存会话，还带按提供商过滤的候选模型回退链——配置的迷你模型不存在时自动换备胎。</li><li>工具名大小写不一致也无妨：Pi 用小写 read/bash/grep，PI_TOOL_NAME_MAP 把它们规范成 Read/Bash/Grep 再交给权限系统。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>一个子进程扛所有对话，它崩了会不会全完？</dt><dd>崩溃被限制在小屋内——这正是隔离的目的：Electron 打包不会跟 ESM 依赖树打架，宿主的界面与其他会话不受连带。但它不保护消息本身：传输途中未落盘的内容仍可能随进程消失，重启后靠继续最近的 .jsonl 会话文件接续对话。</dd><dt>纸条万一丢了或顺序乱了怎么办？</dt><dd>协议靠 requestId 配对请求与响应：权限握手和工具执行各有一张按 ID 记账的待办表。本地端点（如 Ollama）允许不带密钥；非本地端点缺密钥时会明确警告而不是静默失败。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../PiAgent_子进程协议_lukilabs_craft-agents-oss.md">PiAgent 子进程协议</a>（文字版，含完整消息类型表出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="10-claudeagent-sdk.html">第 10 章 · ClaudeAgent SDK 集成</a><a href="12-mcp-chi.html">第 12 章 · MCP 客户端池</a></div>

<nav class="nav">
<a href="10-claudeagent-sdk.html">上一章：ClaudeAgent SDK 集成 ←</a>
<a href="index.html">返回目录</a>
<a href="12-mcp-chi.html">下一章：MCP 客户端池 →</a>
</nav>
<footer>Craft Agents 图解精读 · 11 / 23</footer>
</div></body></html>
`;export{t as default};
