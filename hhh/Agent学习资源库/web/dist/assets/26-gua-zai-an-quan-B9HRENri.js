const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 26 章 · 挂载安全与文件校验 · HappyClaw 图解精读</title>
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
<p class="crumb">第 26 章 / 30 · 认证与安全 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 26 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>挂载安全与文件校验</h1>
<p class="lede">容器要读写宿主机目录，必须先过部署方白名单与 validateMount 的七层检查；持久化配置不算长期授权——每次启动前都要重新验证一遍。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像机场行李托运：先看机场今天开不开门（部署方白名单，缺失或损坏就全员停运——fail-closed），再过安检机逐件查验（validateMount 七层检查）。就算行李过了检，登机口起飞前还要再看一眼你的证件是否仍然有效（docker run 前重验 owner 权限）——管理员昨天被降级，今天挂着旧配置也上不了飞机。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="挂载双边界验证管线"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="60" width="196" height="110" rx="14" fill="#EFEAFE" stroke="var(--accent)" stroke-width="3"/>
    <text x="122" y="98" text-anchor="middle" font-size="25">📋🛂</text>
    <text x="122" y="128" text-anchor="middle" font-size="14.5" font-weight="700">部署方白名单</text>
    <text x="122" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">缺失/损坏 → 全部拒绝</text>
    <rect x="252" y="60" width="216" height="110" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="360" y="98" text-anchor="middle" font-size="25">🕵️✅</text>
    <text x="360" y="128" text-anchor="middle" font-size="14.5" font-weight="700">validateMount × 7 层</text>
    <text x="360" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">路径→真实目录→硬拒区→匹配</text>
    <rect x="500" y="60" width="180" height="110" rx="14" fill="#fdf0f0" stroke="#e5484d" stroke-width="3"/>
    <text x="590" y="98" text-anchor="middle" font-size="25">🐋🔍</text>
    <text x="590" y="128" text-anchor="middle" font-size="14.5" font-weight="700">docker run 前复核</text>
    <text x="590" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">owner 此刻须 admin+active</text>
    <rect x="712" y="60" width="156" height="110" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="790" y="98" text-anchor="middle" font-size="25">🧱👤</text>
    <text x="790" y="128" text-anchor="middle" font-size="14.5" font-weight="700">容器内侧归一化</text>
    <text x="790" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">umask 0077 · fd 逐级开</text>
    <line x1="220" y1="115" x2="248" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="468" y1="115" x2="496" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="680" y1="115" x2="708" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">🧱 两层各自独立 fail-closed：宿主侧管「挂了什么」，容器内侧管「以什么身份访问」；任一层失守都不会直接放行全部。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>部署方编辑 mount-allowlist.json<small>内置 .ssh、.aws、.kube、credentials 等 17 项敏感模式只能追加不能删；文件内容一变按五元组签名自动热重载，进程不重启即生效收紧</small></p></div><div class="step"><span class="n">2</span><p>管理员提交一条额外挂载<small>仅 active 管理员可行：member 得 403、host 模式得 400；IPC 路径走完全相同的校验函数，不存在旁路</small></p></div><div class="step"><span class="n">3</span><p>每次 docker run 前重新判定<small>buildVolumeMounts 每次从数据库重读 owner 记录——降级、禁用或发起权限撤销后，旧的持久化挂载下一次启动立即抛错</small></p></div><div class="step"><span class="n">4</span><p>有人把目录换成指向外部的 symlink？<small>realpathSync 解析真实路径防逃逸；批量挂载原子性：任何一条无效整组作废，containerPath 相互嵌套返回 409 冲突</small></p></div><div class="step"><span class="n">5</span><p>前端目录树可以看，但不一定能选<small>selectable 由 validateMount 实时判定，「可导航但不可选」的灰色项让用户看到全貌却只放行真正过检的目录</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>7 层</b><span>单条挂载按序通过的检查，层层否决</span></div><div class="stat"><b>17 项</b><span>内置不可删除的敏感路径屏蔽模式</span></div><div class="stat"><b>50MB</b><span>工作区上传默认大小上限</span></div><div class="stat"><b>200 字符</b><span>IM 文件名清洗后的最长保留长度</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>findAllowedRoot 按 realpath 长度取最长匹配：~/projects 声明可写，也覆盖不了嵌套声明只读的 ~/projects/secret。</li><li>上传写入用 O_NOFOLLOW 标志，堵住「校验通过后文件被替换成 symlink」的 TOCTOU 窗口。</li><li>文本提取白名单扩展名 + 统一截断 20KB，失败返回 null 回退为只引用路径——绝不把半成品当成功结果喂给 Agent。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>默认模板放行整个家目录可读写，会不会很危险？</dt><dd>确实是宽松的起点，但两条底线托底：17 项敏感模式谁也删不掉，且挂载在创建时和每次启动前各验一次。它不保护什么——宿主侧路径策略管不到容器内进程以什么身份访问文件，那由另一层独立兜底：entrypoint 以 umask 0077 开局、权限 watcher 用 openat 描述符逐级操作（永不给 other 权限）；userns 等探测不到安全身份桥时干脆拒绝启动。</dd><dt>做这么多检查，性能会拖慢启动吗？</dt><dd>白名单加载带签名缓存只在内容变化时重读，路径检查是本地 stat/realpath 级开销；真正的安全收益是「配置漂移无处遁形」——白名单被改成拒绝 A 目录后，下一次校验立即生效。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../26-gua-zai-an-quan-yu-wen-jian-xiao-yan.md">挂载安全与文件校验</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="25-mi-yao-jia-mi.html">第 25 章 · 密钥加密与凭据管理</a><a href="27-qian-duan-jia-gou.html">第 27 章 · 前端架构与路由</a></div>

<nav class="nav">
<a href="25-mi-yao-jia-mi.html">上一章：密钥加密与凭据管理 ←</a>
<a href="index.html">返回目录</a>
<a href="27-qian-duan-jia-gou.html">下一章：前端架构与路由 →</a>
</nav>
<footer>HappyClaw 图解精读 · 26 / 30</footer>
</div></body></html>
`;export{t as default};
