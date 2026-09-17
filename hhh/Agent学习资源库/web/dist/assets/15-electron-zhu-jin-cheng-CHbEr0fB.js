const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 15 章 · Electron 主进程 · Craft Agents 图解精读</title>
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
<p class="crumb">第 15 章 / 23 · 桌面应用层 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 15 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>Electron 主进程</h1>
<p class="lede">你看到的只是窗口，真正忙的是主进程：点火前配环境、开后厨（本地服务器）、发房卡（开窗）、接外线（通知/深链）、退房查房（关机清理）。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一家酒店的大堂总管：开业前先通水电煤气（加载 Shell 环境、备好工具路径）；再雇好后厨（引导本地 WebSocket RPC 服务器和会话管理器）；然后按预订给客人开房发卡（WindowManager 创建窗口）。客人在房间里怎么折腾他不管，但外线电话（系统通知）、访客登记（craftagents:// 深度链接）和凌晨退房时的逐层巡查（关机序列按固定顺序收尾）都是他的活。而且这家酒店可以只开后厨不开客房——那就是无头模式。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="主进程分层初始化"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="20" y="60" width="195" height="110" rx="14" fill="#eef1fb" stroke="#7C5CFC" stroke-width="3"/>
    <text x="117" y="100" text-anchor="middle" font-size="24">🔌🧰</text>
    <text x="117" y="128" text-anchor="middle" font-size="14.5">环境引导</text>
    <text x="117" y="150" text-anchor="middle" font-size="12.5" fill="#8a92a6">Shell 环境 · PATH · 运行时变量</text>
    <rect x="255" y="60" width="195" height="110" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="352" y="100" text-anchor="middle" font-size="24">🖥️⚙️</text>
    <text x="352" y="128" text-anchor="middle" font-size="14.5">服务器引导</text>
    <text x="352" y="150" text-anchor="middle" font-size="12.5" fill="#8a92a6">WS RPC 服务器 + 会话管理器</text>
    <rect x="490" y="60" width="185" height="110" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="582" y="100" text-anchor="middle" font-size="24">🪟🔑</text>
    <text x="582" y="128" text-anchor="middle" font-size="14.5">窗口创建</text>
    <text x="582" y="150" text-anchor="middle" font-size="12.5" fill="#8a92a6">WindowManager 发房卡</text>
    <rect x="705" y="60" width="155" height="110" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="782" y="100" text-anchor="middle" font-size="22">🔔🌙⬆️</text>
    <text x="782" y="128" text-anchor="middle" font-size="14.5">运行时服务</text>
    <text x="782" y="150" text-anchor="middle" font-size="12.5" fill="#8a92a6">通知·电源·更新</text>
    <line x1="215" y1="115" x2="251" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="450" y1="115" x2="486" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="675" y1="115" x2="701" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">分层初始化：环境 → 服务器 → 窗口 → 常驻服务；跑哪种模式决定哪些环节被跳过。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>app.whenReady 触发之前，loadShellEnv 先把你的 Shell 配置装进环境<small>保证后面所有子进程都能继承你日常终端里的路径与别名设置</small></p></div><div class="step"><span class="n">2</span><p>检查运行模式：默认完整模式，设了 CRAFT_SERVER_URL 变瘦客户端，设了 CRAFT_HEADLESS 就不创建窗口<small>三种模式各禁用不同子系统</small></p></div><div class="step"><span class="n">3</span><p>bootstrapServer 点亮嵌入式 WebSocket RPC 服务器并连好所有处理器<small>服务器绑网络地址却不配 TLS 时主动发安全警告——令牌会明文传输</small></p></div><div class="step"><span class="n">4</span><p>用户点关闭按钮但有弹窗开着？关闭被暂缓并留了超时兜底<small>Cmd+Q 用 setAppQuitting(true) 绕过拦截，干净退场</small></p></div><div class="step"><span class="n">5</span><p>退出前按序打扫：存窗口状态→刷会话写盘→销毁浏览器窗格→释放电源锁<small>若正在安装更新则把控制权交给 electron-updater 而非硬退</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3 种</b><span>运行模式：完整 / 仅客户端 / 无头</span></div><div class="stat"><b>3171 行</b><span>BrowserPaneManager——主进程最大子系统，管 Agent 的浏览器窗格</span></div><div class="stat"><b>3 套</b><span>未读徽章实现：macOS Dock 画布、Windows 叠加图标、Linux 计数 API</span></div><div class="stat"><b>≥1 个</b><span>有活跃 Agent 会话且开关打开时才阻止系统睡眠</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>Sentry 上报错误前用 beforeSend 钩子清洗授权头、Cookie 和 API 密钥；机器身份由「主机名+家目录」的 SHA-256 哈希生成，不含个人明文。</li>
<li>Windows 启动时会校验 Git Bash 路径并检查 VC++ 运行库，缺什么就在渲染器弹一条可操作的 Toast 提示。</li>
<li>网络代理分两级生效：Node 请求走自定义 undici 分发器支持 NO_PROXY 绕行；Electron 会话代理覆盖渲染器与浏览器窗格流量。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>Agent 能自己开网页浏览，会不会乱点出事？</dt><dd>每个浏览器实例用独立的 persist:browser-pane 会话分区隔离存储；OAuth 弹窗等 target=_blank 弹口会被重新挂回主浏览器窗口并用注册表记录父子关系以便销毁时清理。边界：这套机制管隔离与生命周期，它不保护的是 Agent 点击内容本身的正当性。</dd>
<dt>无头模式没有窗口，还算桌面应用吗？</dt><dd>此刻它就是一台后台服务器，供远程客户端连接——同一套主进程代码换了个岗位。</dd>
<dt>关机顺序乱一乱要紧吗？</dt><dd>要紧：会话没刷盘就丢消息、电源锁不放电脑就睡不着，所以 before-quit 是严格排序的，还有 isQuitting 标志防双重清理。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../Electron_主进程_lukilabs_craft-agents-oss/Electron_主进程_lukilabs_craft-agents-oss.md">Electron 主进程</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="14-zi-dong-hua-yin-qing.html">第 14 章 · 自动化引擎</a><a href="16-xuan-ran-qi-ui.html">第 16 章 · 渲染器 UI 组件</a></div>

<nav class="nav">
<a href="14-zi-dong-hua-yin-qing.html">上一章：自动化引擎 ←</a>
<a href="index.html">返回目录</a>
<a href="16-xuan-ran-qi-ui.html">下一章：渲染器 UI 组件 →</a>
</nav>
<footer>Craft Agents 图解精读 · 15 / 23</footer>
</div></body></html>
`;export{t as default};
