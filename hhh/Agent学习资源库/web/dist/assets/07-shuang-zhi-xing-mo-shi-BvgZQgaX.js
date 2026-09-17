const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 7 章 · Host 与 Container 双执行模式 · HappyClaw 图解精读</title>
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
<p class="crumb">第 7 章 / 30 · 智能体优先产品模型 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 7 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>Host 与 Container 双执行模式</h1>
<p class="lede">每个工作区都要选一种执行方式：默认把 AI 关进用完即弃的 Docker 沙箱；只有在岗管理员的实时授权下，才允许直接在宿主机上开工——而且每次开工前都要重新验一遍身份。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像写字楼的会议室政策：散客只能订公共会议舱，用完清场还原；行政总监可以申请在自己办公室见人——但保安不认「曾经是总监」的旧门禁卡，每进一次刷一次卡，当天降级当天失效。执行模式是工作区（房间）的属性，不是某个人终身自带的特权。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="执行模式决策链"><defs><marker id="ar7" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="28" y="72" width="186" height="84" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="2.5"/>
    <text x="121" y="108" text-anchor="middle" font-size="26">📨</text>
    <text x="121" y="134" text-anchor="middle" font-size="14.5" font-weight="700">新回合开始</text>
    <text x="121" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">IM / Web / 定时任务</text>
    <line x1="216" y1="114" x2="290" y2="114" stroke="#232733" stroke-width="3" marker-end="url(#ar7)"/>
    <rect x="296" y="58" width="252" height="112" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="422" y="92" text-anchor="middle" font-size="24">⚖️</text>
    <text x="422" y="120" text-anchor="middle" font-size="14.5" font-weight="700">每次执行前重读数据库</text>
    <text x="422" y="141" text-anchor="middle" font-size="13" fill="#5b6478">owner 仍是活跃管理员吗？</text>
    <text x="422" y="159" text-anchor="middle" font-size="12" fill="#8a92a6">曾当过 ≠ 现在算数</text>
    <line x1="550" y1="88" x2="612" y2="62" stroke="#232733" stroke-width="3" marker-end="url(#ar7)"/>
    <text x="562" y="56" font-size="12.5" fill="#5b6478">是</text>
    <line x1="550" y1="140" x2="612" y2="166" stroke="#232733" stroke-width="3" marker-end="url(#ar7)"/>
    <text x="558" y="182" font-size="12.5" fill="#5b6478">否 / 成员</text>
    <rect x="618" y="26" width="234" height="76" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="735" y="58" text-anchor="middle" font-size="19">🖥️ Host 宿主机直跑</text>
    <text x="735" y="82" text-anchor="middle" font-size="12.5" fill="#5b6478">仅当前管理员授权可用</text>
    <rect x="618" y="124" width="234" height="76" rx="14" fill="#eef3fd" stroke="#4a7df0" stroke-width="2.5"/>
    <text x="735" y="156" text-anchor="middle" font-size="19">📦 Container 沙箱</text>
    <text x="735" y="180" text-anchor="middle" font-size="12.5" fill="#5b6478">Docker 隔离 · 默认兜底</text>
  </svg>
  <p class="caption">房间的属性决定在哪干活；但「钥匙」每次进门都要重新验——写进配置不等于永久通行。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>您发出一条消息，系统先决定「在哪干活」<small>模式持久化在工作区的 executionMode 字段；普通成员从创建端就被挡在 host 之外，永远只能用 container。</small></p></div><div class="step"><span class="n">2</span><p>若记录说 host，执行前一刻仍要重读数据库核实身份<small>canExecuteOnHost 要求 owner 当前 role 是 admin 且 status 为 active；定时任务同点抛出 HOST_EXECUTION_FORBIDDEN_ERROR，角色降级立即生效。</small></p></div><div class="step"><span class="n">3</span><p>容器路径：拼好挂载清单后 docker run -i --rm 拉起一次性容器<small>默认镜像 riba2534/happyclaw-agent:latest；env 凭据写成 0600 权限文件只读挂载，不会泄漏到进程列表。</small></p></div><div class="step"><span class="n">4</span><p>宿主机路径：直接 spawn 一个 Node 子进程开工<small>四件套随行：目录白名单复查、工具预检、依赖编译检查、环境变量净化；customCwd 每次都按 mount-allowlist.json 重验，防数据库被塞进来路不明的路径。</small></p></div><div class="step"><span class="n">5</span><p>收尾方式各不相同，上层却毫无感知<small>容器由 docker kill/stop 终结；宿主机进程组先 SIGTERM 再 SIGKILL。两者共用同一套输入/输出契约，队列与恢复逻辑对两种模式透明。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>container</b><span>三个入口共用的兜底默认值（'container'）</span></div><div class="stat"><b>0600</b><span>容器 env 凭据文件的权限，只读挂载进沙箱</span></div><div class="stat"><b>400</b><span>host 工作区提交宿主机挂载时被直接拒绝的错误码</span></div><div class="stat"><b>3 次</b><span>创建、回合执行、定时任务三处独立校验点</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>两套特权面要分清：host 执行是一回事，「宿主机目录挂载（additional mounts）」是另一回事——后者仅限 container 模式且仅限管理员，目标必须在 allowlist 允许根之下，并叠加 .ssh、.aws、.env 等默认阻断模式。</li>
<li>身份桥接只在 rootful Linux 直通模式下把宿主机 uid/gid 透传进容器；rootless 或探测不出来的一律 fail-closed：宁可拒绝也不猜。</li>
<li>adminHostOnlyMode 开启后会把活跃管理员的工作区整体迁去 host 并清理旧会话；关闭开关只是恢复「能选」，已有工作区不会自动迁回来。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>普通成员偷偷要求 host 会怎样？</dt><dd>在创建端就会被挡住：hasHostExecutionPermission 只对 admin 放行，Web 发消息路由还有二次校验。这不是一道开关而是三处独立关卡；它保护不了已通过验证的管理员本身的误操作——那类风险靠 mount-allowlist 白名单与凭据文件的阻断模式兜着。</dd>
<dt>为什么默认不是更快的宿主机直跑？</dt><dd>容器模式只暴露挂载清单内的目录、工具链镜像预装、凭据隔离，出事范围天然有限；host 模式直接访问宿主机文件系统，属于管理员主动承担额外风险的例外形态，所以默认门朝着沙箱开。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../07-Host 与 Container 双执行模式.md">Host 与 Container 双执行模式</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="06-san-ceng-mo-xing.html">第 6 章 · 三层产品模型</a><a href="08-neng-li-zhi-li.html">第 8 章 · 能力治理</a></div>

<nav class="nav">
<a href="06-san-ceng-mo-xing.html">上一章：三层产品模型 ←</a>
<a href="index.html">返回目录</a>
<a href="08-neng-li-zhi-li.html">下一章：能力治理 →</a>
</nav>
<footer>HappyClaw 图解精读 · 7 / 30</footer>
</div></body></html>
`;export{t as default};
