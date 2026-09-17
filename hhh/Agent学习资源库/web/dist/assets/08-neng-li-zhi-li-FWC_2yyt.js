const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 8 章 · Agent 能力治理：Skills、MCP 与 Plugins · HappyClaw 图解精读</title>
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
<p class="crumb">第 8 章 / 30 · 智能体优先产品模型 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 8 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>Agent 能力治理：Skills、MCP 与 Plugins</h1>
<p class="lede">技能（Skills）、外部工具（MCP）、插件（Plugins）三条能力通道再复杂，都走同一条流水线：先登记来源，再按每个 Agent 的策略筛选，最后以只读、隔离的安全形态注入会话。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像大型活动的物料进场管理：所有物资先写进供货来源登记册（来源层，带内容哈希可审计），每个分场馆持有一份自己的允许清单（策略层：全要、挑选、都不要三选一），进场前统一换成场馆专用贴标箱（物化层：只读挂载或隔离拷贝）——后台观众永远摸不到原材料纸箱。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="能力治理三层流水线"><defs><marker id="ar8" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="70" width="190" height="92" rx="14" fill="#eef3fd" stroke="#4a7df0" stroke-width="2.5"/>
    <text x="119" y="104" text-anchor="middle" font-size="20">🗂️ ① 来源层</text>
    <text x="119" y="128" text-anchor="middle" font-size="12.5" fill="#5b6478">目录树 · 双作用域文件</text>
    <text x="119" y="146" text-anchor="middle" font-size="12.5" fill="#5b6478">不可变快照树</text>
    <line x1="216" y1="116" x2="234" y2="116" stroke="#232733" stroke-width="3" marker-end="url(#ar8)"/>
    <rect x="236" y="70" width="192" height="92" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="332" y="104" text-anchor="middle" font-size="20">🧾 ② 策略层</text>
    <text x="332" y="128" text-anchor="middle" font-size="12.5" fill="#5b6478">inherit / custom / disabled</text>
    <text x="332" y="146" text-anchor="middle" font-size="12.5" fill="#5b6478">哪个 Agent 能用什么</text>
    <line x1="430" y1="116" x2="448" y2="116" stroke="#232733" stroke-width="3" marker-end="url(#ar8)"/>
    <rect x="450" y="70" width="190" height="92" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="545" y="104" text-anchor="middle" font-size="20">📦 ③ 物化层</text>
    <text x="545" y="128" text-anchor="middle" font-size="12.5" fill="#5b6478">逐技能只读挂载</text>
    <text x="545" y="146" text-anchor="middle" font-size="12.5" fill="#5b6478">settings.json 全量替换 · 独立拷贝</text>
    <line x1="642" y1="116" x2="660" y2="116" stroke="#232733" stroke-width="3" marker-end="url(#ar8)"/>
    <rect x="662" y="70" width="194" height="92" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="759" y="106" text-anchor="middle" font-size="20">🤖 Agent Runner</text>
    <text x="759" y="130" text-anchor="middle" font-size="12.5" fill="#5b6478">Host / Container 两种路径</text>
    <text x="759" y="148" text-anchor="middle" font-size="12.5" fill="#5b6478">以安全形态拿到能力</text>
  </svg>
  <p class="caption">差异只在第一层的货架摆法：技能是六层层叠目录、MCP 是双作用域合并、插件是不可变快照；后两层三家通用。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>装一个技能或插件，进入带内容哈希的目录树<small>技能经 Git 导入或 ZIP 包导入；Git 上限 64MB、ZIP 展开上限 25MB、条目上限 1000，URL 必须是解析到公网的 HTTPS。</small></p></div><div class="step"><span class="n">2</span><p>给某个 Agent 配置 runtime_policy 策略<small>三态模式 inherit（全量托管）/ custom（按 ID 白名单）/ disabled（关闭）；保存前有生效预览，来源与遮蔽关系看得见。</small></p></div><div class="step"><span class="n">3</span><p>解析器按从低到高的固定顺序裁决六层技能来源<small>builtin → host → project → managed → workspace → plugin；被禁用的技能直接移除而非留「墓碑」，低层级同名技能仍可用。</small></p></div><div class="step"><span class="n">4</span><p>物化成会话用的安全形态<small>Skill 逐个只读挂载进 /workspace/effective-skills；MCP 写入 settings.json 全量替换；Plugin 拷贝为独立 inode 的运行时树——绝不用硬链接/符号链接，防止反写污染共享目录。</small></p></div><div class="step"><span class="n">5</span><p>能力变更时要先安静：停掉引用它的 Runner 再提交<small>作用域锁按键字典序获取防死锁；失败按三种语义返回可重试的 503 或确定性错误 agent_profile_unavailable。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>64MB</b><span>Git 方式导入技能仓库的上限</span></div><div class="stat"><b>25MB</b><span>ZIP 压缩包展开后的体积上限</span></div><div class="stat"><b>6 层</b><span>Skills 来源层叠：builtin 到 plugin 从低到高</span></div><div class="stat"><b>3 种</b><span>策略模式：inherit / custom / disabled</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>内容哈希（全量 SHA-256）是一致性基石：manifest 顶层的 hash 驱动「要不要重建会话、重启 Runner」的全部判断。</li>
<li>MCP 机密拆出独立 secrets store，API 只回传键名与存在性标记，取值永不返回；system 级服务器对非管理员在运行层面直接过滤。</li>
<li>插件快照一次写入绝不覆盖（rename 原子落盘）；斜杠命令由自建索引展开，$ARGUMENTS 走环境/位置参数注入，绝不做字符串拼接——命令注入没有入口。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>把 MCP 服务器的密钥存进平台安全吗？</dt><dd>取值永远不出系统：API 摘要只暴露 envKeys/headerKeys 与存在性；system 级服务器对成员连运行时都会被过滤。但它不保护 secrets store 文件所在的宿主机本身——文件权限、磁盘加密属于另一道安全边界。</dd>
<dt>我装了个坏技能会不会污染别的会话？</dt><dd>会话目录整体可重建：旧文件先进 orphaned-skills 隔离区（不删除），再两段式重建符号链接；容器启动还会清空 skills 目录后重新 --link-skill。这层管的是「引用与挂载」的干净，技能脚本被 Agent 执行后的行为不在本层保护范围。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../08-Agent 能力治理：Skills、MCP 与 Plugins.md">Agent 能力治理：Skills、MCP 与 Plugins</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="07-shuang-zhi-xing-mo-shi.html">第 7 章 · 双执行模式</a><a href="09-fu-wu-jia-gou.html">第 9 章 · 主服务架构</a></div>

<nav class="nav">
<a href="07-shuang-zhi-xing-mo-shi.html">上一章：双执行模式 ←</a>
<a href="index.html">返回目录</a>
<a href="09-fu-wu-jia-gou.html">下一章：主服务架构 →</a>
</nav>
<footer>HappyClaw 图解精读 · 8 / 30</footer>
</div></body></html>
`;export{n as default};
