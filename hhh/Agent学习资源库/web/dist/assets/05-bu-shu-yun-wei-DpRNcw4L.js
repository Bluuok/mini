const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 5 章 · 部署与运维：环境变量、Docker 与备份恢复 · HappyClaw 图解精读</title>
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
<p class="crumb">第 5 章 / 30 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 5 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>部署与运维：环境变量、Docker 与备份恢复</h1>
<p class="lede">环境变量只管启动期参数，日常配置交给 Web 设置；Agent 镜像永远拉现成的；数据安全押在不停机快照加层层校验的备份恢复上。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像打理一家 24 小时自助银行：门口告示牌写死营业参数（.env 启动期变量），大厅触屏才是真正万能的柜台（优先级 Web 设置 > 环境变量 > 默认值）。运钞绝不允许手工搬金库（直接复制 SQLite），必须走保险通道——点钞机（一致性快照）、出库安检（拒绝符号链接与硬链接）、换班交接锁（恢复前必须停业持锁）。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="备份恢复流水线"><defs><marker id="ar5" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="70" width="196" height="92" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="122" y="106" text-anchor="middle" font-size="22">💾⚡</text>
    <text x="122" y="134" text-anchor="middle" font-size="13.5" font-weight="700">在线一致性快照</text>
    <text x="122" y="154" text-anchor="middle" font-size="12.5" fill="#5b6478">不停服，含 WAL 已提交页</text>
    <line x1="222" y1="116" x2="282" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar5)"/>
    <rect x="288" y="70" width="188" height="92" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="382" y="104" text-anchor="middle" font-size="22">🚫🔗</text>
    <text x="382" y="132" text-anchor="middle" font-size="13.5" font-weight="700">备份树安全扫描</text>
    <text x="382" y="152" text-anchor="middle" font-size="12.5" fill="#c0392b">链接/硬链接/特殊文件 → 拒绝</text>
    <line x1="478" y1="116" x2="538" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar5)"/>
    <rect x="544" y="70" width="150" height="92" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="619" y="104" text-anchor="middle" font-size="22">📋📦</text>
    <text x="619" y="134" text-anchor="middle" font-size="13.5">manifest v2 归档</text>
    <text x="619" y="156" text-anchor="middle" font-size="12.5" fill="#5b6478">tar.gz · chmod 600</text>
    <line x1="696" y1="116" x2="752" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar5)"/>
    <rect x="692" y="52" width="164" height="128" rx="16" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="774" y="94" text-anchor="middle" font-size="22">🔓✅</text>
    <text x="774" y="124" text-anchor="middle" font-size="13.5" font-weight="700">make restore</text>
    <text x="774" y="148" text-anchor="middle" font-size="12" fill="#5b6478">停机 + PID 锁 + staging 回滚</text>
    <text x="774" y="170" text-anchor="middle" font-size="12" fill="#5b6478">数据库 integrity_check</text>
  </svg>
  <p class="caption">宁可当场报错也不打包出「永远无法恢复」的归档——不安全条目在创建时就 fail fast。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>load-env.ts 强制为第一个 import：最早载入 .env 并配好全局代理<small>undici 默认不读 HTTP_PROXY/HTTPS_PROXY，大陆网络下 Claude OAuth 会吃 403</small></p></div><div class="step"><span class="n">2</span><p>公网部署调三项：TRUST_PROXY=true、CORS_ALLOWED_ORIGINS 白名单、HTTPS 反代<small>WebSocket 不经过 CORS，upgrade 时单独做同源 + 白名单校验拒绝跨站来源</small></p></div><div class="step"><span class="n">3</span><p>make docker-pull 拉 CI 发布的现成镜像<small>amd64/arm64 双原生构建，真实 Chromium CDP 冒烟通过、cosign 签名后才提升 latest</small></p></div><div class="step"><span class="n">4</span><p>定期 make backup 打包运行时数据<small>11 个受管组件入包；ipc/env/logs 等瞬态组件明确排除——env 含宿主机侧机密</small></p></div><div class="step"><span class="n">5</span><p>迁移机器时 make restore FILE=xxx.tar.gz<small>服务必须已停止（双重端口检查）；逐组件原子替换，失败按逆序回滚</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>20</b><span>最大并发容器数上限</span></div><div class="stat"><b>11</b><span>个备份受管组件固定入包</span></div><div class="stat"><b>50</b><span>MB 单文件入站大小上限</span></div><div class="stat"><b>1800000</b><span>毫秒容器硬超时（30 分钟）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>WEB_SESSION_SECRET 按「环境变量 → 文件 → 随机生成」三级解析；备份缺了 config/ 组件，恢复后所有登录 cookie 失效。</li><li>镜像首层写入 TOOL_REFRESH 构建参数，每次 main 推送强制刷新 Debian 补丁与工具链；版本留 /usr/local/share/happyclaw-tool-versions.txt 审计。</li><li>容器身份模式 userns / unknown 直接拒绝启动（fail-closed）——没有安全身份桥就不跑。</li><li>数据库 schema 迁移前先 VACUUM INTO 自包含快照，备份失败会中止启动；WAL 在这道闸门通过后才开启。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>服务开着的时候直接 cp 一份 messages.db 行不行？会不会坏？</dt><dd>很可能拿到写了一半的不一致副本。一致性备份必须走 make backup：better-sqlite3 的 online backup API 读取事务一致快照且包含 WAL 中已提交页，全程无需停服。它也有明确的「不做的事」：扫描发现绝对路径符号链接、逃逸条目或硬链接（nlink>1）会直接拒绝打包——防止产出备份成功却永远无法恢复的归档。</dd><dt>恢复过程中忘了停服务会怎样？</dt><dd>进不去。Makefile 预检和脚本内紧邻文件操作前双重执行 assert-port-free，服务运行中拒绝覆盖数据库；进入后还要拿 .happyclaw-restore.lock 排他锁，陈旧锁绝不自动回收——破坏性操作必须人工确认后清理。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../05-%E9%83%A8%E7%BD%B2%E4%B8%8E%E8%BF%90%E7%BB%B4%EF%BC%9A%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E3%80%81Docker%20%E9%95%9C%E5%83%8F%E4%B8%8E%E5%A4%87%E4%BB%BD%E6%81%A2%E5%A4%8D.md">部署与运维：环境变量、Docker 镜像与备份恢复</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="04-pei-zhi-xiang-dao.html">第 4 章 · 首次配置向导</a><a href="06-san-ceng-mo-xing.html">第 6 章 · 三层产品模型</a></div>

<nav class="nav">
<a href="04-pei-zhi-xiang-dao.html">上一章：首次配置向导 ←</a>
<a href="06-san-ceng-mo-xing.html">下一章：三层产品模型 →</a>
</nav>
<footer>HappyClaw 图解精读 · 5 / 30</footer>
</div></body></html>
`;export{t as default};
