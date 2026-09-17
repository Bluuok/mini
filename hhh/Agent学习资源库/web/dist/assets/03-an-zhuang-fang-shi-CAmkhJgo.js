const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 3 章 · 安装方式 · Craft Agents 图解精读</title>
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
<p class="crumb">第 3 章 / 23 · 安装与上手 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 3 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>安装方式</h1>
<p class="lede">一键安装、源码构建、Docker、服务器脚本、CLI——五种方法最终跑的都是同一个核心引擎，差别只在打包方式、传输层和运营模式。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>同一台咖啡机有五种到家方式：官方直邮整机插电即用（一键安装的桌面二进制）、自己按图纸组装顺便改装（源码构建，热重载调机）、连机房一起托运到数据中心（Docker 容器化无头服务器）、请师傅上门把机器装进你的后厨（install-server.sh 裸机部署）、或者干脆只带一根吸管去咖啡馆接咖啡带走喝（CLI 客户端）。豆子都一样香。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="五扇门与三种产物"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="25" y="35" width="200" height="66" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="125" y="62" text-anchor="middle" font-size="15">🖥️ 桌面应用二进制</text>
<text x="125" y="86" text-anchor="middle" font-size="12.5" fill="#5b6478">macOS arm64/x64 · Win x64 · Linux x64</text>
<rect x="25" y="130" width="200" height="66" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="125" y="157" text-anchor="middle" font-size="15">🛰️ 无头服务器容器/裸机</text>
<text x="125" y="181" text-anchor="middle" font-size="12.5" fill="#5b6478">远程 VPS · CI/CD · 持久会话</text>
<rect x="340" y="82" width="200" height="66" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="440" y="109" text-anchor="middle" font-size="15">⌨️ CLI 终端客户端</text>
<text x="440" y="133" text-anchor="middle" font-size="12.5" fill="#5b6478">任何支持 Bun 的平台</text>
<rect x="655" y="70" width="200" height="90" rx="14" fill="#f3effe" stroke="#7C5CFC" stroke-width="3"/>
<text x="755" y="103" text-anchor="middle" font-size="15" font-weight="700">5 种安装方法任选</text>
<text x="755" y="128" text-anchor="middle" font-size="12.5" fill="#5b6478">一键 · 源码 · Docker</text>
<text x="755" y="148" text-anchor="middle" font-size="12.5" fill="#5b6478">服务器脚本 · CLI</text>
<line x1="655" y1="115" x2="544" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="340" y1="115" x2="229" y2="88" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="340" y1="120" x2="229" y2="150" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
</svg>
<p class="caption">先想清楚要什么产物：图形界面、后台服务，还是终端里的一发入魂。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>绝大多数用户选一键安装，一条 shell 命令完事<small>无需构建工具、无需 Git、无需运行时依赖；清单 YAML 里带着版本元数据、架构下载 URL 和 SHA-512 校验和</small></p></div><div class="step"><span class="n">2</span><p>macOS 上 .app 进 /Applications 并顺带移除隔离属性；Linux 上 AppImage 落在 ~/.craft-agent/app/<small>Linux 版同时建立 ~/.local/bin/craft-agents 启动器；Windows 用 PowerShell 脚本走 NSIS 安装器并注册 PATH</small></p></div><div class="step"><span class="n">3</span><p>要贡献代码或定制 UI 就从源码走：clone → bun install → bun run electron:start<small>它串联主进程、预加载脚本、渲染器 UI 与打包资源四步构建；日常改 UI 用 electron:dev 热重载</small></p></div><div class="step"><span class="n">4</span><p>提交贡献前先过一遍 TypeScript 严格模式检查<small>bun run typecheck:all 按顺序检查核心包、服务器和 Electron 应用</small></p></div><div class="step"><span class="n">5</span><p>远程场景交给 Docker：<code>docker buildx build -f Dockerfile.server -t craft-agent-server .</code> 再 <code>docker run -p 9100:9100 …</code><small>同一容器在 9100 端口同时提供 WebSocket RPC 和浏览器可访问的 WebUI</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>9100</b><span>Docker/WebUI 共用的 WebSocket RPC 端口</span></div><div class="stat"><b>30–60秒</b><span>源码构建首次耗时，之后吃 esbuild 缓存红利</span></div><div class="stat"><b>39</b><span>Electron 大版本号（桌面外壳）</span></div><div class="stat"><b>≥1.0</b><span>Bun 与 Git 的最低要求（仅构建路径）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>Dockerfile 基于 oven/bun:1.3-slim，镜像里装好 ca-certificates、git、ripgrep，预编译 MCP 辅助服务器并用 Vite 打包 WebUI。</li><li>容器用 <code>--user $(id -u):$(id -g)</code> 把进程映射回宿主身份，挂载卷的文件权限才不会错位。</li><li>CRAFT_SERVER_TOKEN 由 openssl rand -hex 32 生成、客户端认证必需——无法恢复，丢了只能换新的。</li><li>Linux 跑 AppImage 需要 FUSE（libfuse2），缺了装一个：sudo apt install fuse libfuse2。</li>
<li>关键环境变量一图流：CRAFT_RPC_HOST 绑定地址默认 0.0.0.0、CRAFT_RPC_PORT 端口，配合 CRAFT_WEBUI_DIR 指向 WebUI 静态资源，无头服务器即可对外服务。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>校验和没通过就退出，会不会把我正常下载也拦了？</dt><dd>拦下来的就是该拦的：校验失败意味着下载损坏或中间人篡改，脚本会立即删除文件并以错误状态退出，保证你不会运行被动手脚的二进制。但边界也要说清——它只守护这一次下载本身，不审查你机器上的其他软件或网络环境。</dd><dt>五种都要会吗？</dt><dd>不用。多数人一辈子只用一键安装；写脚本自动化学 CLI；自托管团队看 Docker 或服务器脚本；打算提 PR 才需要完整的源码路径。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../安装方式_lukilabs_craft-agents-oss/安装方式_lukilabs_craft-agents-oss.md">安装方式：一键、源码、Docker 全览</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="02-kuai-su-shang-shou.html">第 2 章 · 快速开始</a><a href="04-yi-jian-an-zhuang.html">第 4 章 · 一键安装脚本</a></div>

<nav class="nav">
<a href="02-kuai-su-shang-shou.html">← 上一章：上手四条路</a>
<a href="04-yi-jian-an-zhuang.html">下一章：一键安装脚本 →</a>
</nav>
<footer>Craft Agents 图解精读 · 3 / 23</footer>
</div></body></html>
`;export{n as default};
