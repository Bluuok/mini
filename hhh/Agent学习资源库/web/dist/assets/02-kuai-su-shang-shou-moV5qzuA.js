const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 2 章 · 快速开始：环境要求与一键启动 · HappyClaw 图解精读</title>
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
<p class="crumb">第 2 章 / 30 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 2 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>快速开始：环境要求与一键启动</h1>
<p class="lede">克隆仓库、敲 make start，剩下的交给一条自动流水线：依赖、内置 Skills、Agent 镜像、增量编译全替你备齐，浏览器打开 localhost:3000 就能看到工作台。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像按全自动咖啡机的开机键：一次按下，机器先自查水箱（依赖缺了就自动 npm ci 补齐），再摆上标配胶囊（内置 Skills 物化），看到有气泡水才进气泡（Docker 可用才拉镜像），锅热了才出第一杯（node dist/index.js 前台运行）。第二次开机每项都带着「过期没」的记忆，几秒就能出杯。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="make start 流水线"><defs><marker id="ar2" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="28" y="66" width="188" height="100" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="122" y="106" text-anchor="middle" font-size="24">⬇️📦</text>
    <text x="122" y="136" text-anchor="middle" font-size="14" fill="#5b6478">依赖缺失？npm ci ×3</text>
    <line x1="218" y1="116" x2="278" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar2)"/>
    <rect x="284" y="66" width="176" height="100" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="372" y="106" text-anchor="middle" font-size="24">🧩</text>
    <text x="372" y="136" text-anchor="middle" font-size="14" fill="#5b6478">物化内置 Skills</text>
    <line x1="462" y1="116" x2="522" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar2)"/>
    <rect x="528" y="66" width="180" height="100" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="618" y="102" text-anchor="middle" font-size="22">🐳⬇️</text>
    <text x="618" y="132" text-anchor="middle" font-size="13.5" fill="#5b6478">拉 Agent 镜像</text>
    <text x="618" y="154" text-anchor="middle" font-size="12.5" fill="#8a92a6">Docker 可用才执行</text>
    <line x1="710" y1="116" x2="764" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar2)"/>
    <rect x="704" y="30" width="152" height="172" rx="16" fill="#f1ecfe" stroke="var(--accent)" stroke-width="3"/>
    <text x="780" y="80" text-anchor="middle" font-size="24">🔨🖥️</text>
    <text x="780" y="112" text-anchor="middle" font-size="13.5" font-weight="700">增量编译</text>
    <text x="780" y="138" text-anchor="middle" font-size="13.5" font-weight="700">node dist/index.js</text>
    <text x="780" y="170" text-anchor="middle" font-size="12.5" fill="#5b6478">localhost:3000</text>
  </svg>
  <p class="caption">每一步都是「需要才做」：源码不比产物新就直接跳过，所以二次启动通常秒级完成。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>git clone 拉取仓库并 cd happyclaw<small>仓库地址：github.com/riba2534/happyclaw.git</small></p></div><div class="step"><span class="n">2</span><p>敲下 make start——生产模式一键启动，前台阻塞运行<small>Ctrl+C 即停；后台运行可重定向日志后用 make status / make stop 管理</small></p></div><div class="step"><span class="n">3</span><p>流水线逐项自检：三端依赖、内置 Skills、Agent 镜像、三个子项目按需增量编译<small>_check-sync 检查 shared/ 类型漂移；时间戳哨兵比较源码与产物，无变更就跳过</small></p></div><div class="step"><span class="n">4</span><p>Docker 可用则拉取 riba2534/happyclaw-agent:latest<small>镜像只由 GitHub Actions 构建发布，本地从不执行 docker build</small></p></div><div class="step"><span class="n">5</span><p>浏览器打开 http://localhost:3000 进入初始化向导<small>curl /api/health 无需认证即可确认数据库、队列与进程健康三项检查</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>≥20</b><span>Node 版本硬门槛（CI 同款为 24）</span></div><div class="stat"><b>3000</b><span>生产模式唯一端口：Web + API + WS</span></div><div class="stat"><b>4</b><span>类首次启动自动准备的任务</span></div><div class="stat"><b>0</b><span>条 CLI 手动安装步骤（SDK 已版本锁定内置）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>Node 至少 20 的原因：package.json engines 声明 node >= 20，且加载 .env 用到 20.12 才稳定的 process.loadEnvFile()。</li><li>Claude Code CLI 不用单独装：@anthropic-ai/claude-agent-sdk 以精确版本固定配套运行时，npm install -g 可省。</li><li>Docker 是可选的：只用管理员 Host 工作区可以不装；不可用时 make start 自动跳过拉镜像，不影响主服务。</li><li>首启会生成 data/config/session-secret.key（权限 0600）并持久复用，重启后登录态不掉线；data/ 不要提交 Git。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>不装 Docker 行不行？到底缺了什么？</dt><dd>行。主服务本身是单一 Node 进程，不靠 Docker；缺的是隔离执行环境——普通成员的 Container 工作区无法运行任务，容器镜像里预装的 Chromium、Python 等工具链也一并缺席。只想管理员在宿主机使用，完全可以先跳过 Docker，之后再补装并重启 make start。</dd><dt>make reset-init 这个「彻底回滚」会不会很危险？</dt><dd>确实危险：它直接删除 data/、store/、groups/ 回到首装状态，删掉的数据无法恢复，只适合开发环境玩坏了重来。区分边界：想清掉编译产物用 make clean（只动三个 dist 目录）；镜像问题反复出现时也别本地 build，去手动执行 make docker-pull 重试即可。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../02-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B%EF%BC%9A%E7%8E%AF%E5%A2%83%E8%A6%81%E6%B1%82%E4%B8%8E%E4%B8%80%E9%94%AE%E5%90%AF%E5%8A%A8.md">快速开始：环境要求与一键启动</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="01-xiang-mu-gai-lan.html">第 1 章 · 项目概览</a><a href="03-kai-fa-yu-ming-ling.html">第 3 章 · 开发模式与常用命令</a></div>

<nav class="nav">
<a href="01-xiang-mu-gai-lan.html">上一章：项目概览 ←</a>
<a href="03-kai-fa-yu-ming-ling.html">下一章：开发模式与常用命令 →</a>
</nav>
<footer>HappyClaw 图解精读 · 2 / 30</footer>
</div></body></html>
`;export{t as default};
