const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 23 章 · 数据目录结构与一致性备份恢复 · HappyClaw 图解精读</title>
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
<p class="crumb">第 23 章 / 30 · 数据与记忆 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 23 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>数据目录结构与一致性备份恢复</h1>
<p class="lede">十一类家当照清单装箱，四类临时的留在原地；营业中拍的是某一瞬间的一致快照，恢复先全面验收，过不了关就原样奉还、分毫不动。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像连锁药店边营业边搬家：随箱清单列明十一个货架（数据库、配置、工作区文件、技能……）一件不落；正运转的传送带、员工保险柜钥匙、临时小票纸和记事本不装车。数据库用整卷复印机当场复印——印出来的是某个瞬间的一致画面，店门不用关。新店里所有货物先卸进隔离暂存区逐项验收：有一箱不合格就整车退回，老店货架上连一件都不会少。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="恢复管线的 fail-closed 校验链"><defs><marker id="ar23" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="24" y="58" width="200" height="114" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="124" y="96" text-anchor="middle" font-size="26">📦</text>
<text x="124" y="126" text-anchor="middle" font-size="14.5" font-weight="700">归档开箱验收</text>
<text x="124" y="148" text-anchor="middle" font-size="13" fill="#5b6478">路径／类型／数据库完整性</text>
<rect x="284" y="30" width="230" height="76" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="399" y="62" text-anchor="middle" font-size="21">✅ 全部过关 → 换装入位</text>
<text x="399" y="88" text-anchor="middle" font-size="12.5" fill="#5b6478">旧数据先挪进 rollback 保底</text>
<rect x="284" y="128" width="230" height="76" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="399" y="160" text-anchor="middle" font-size="21">⛔ 任一不过 → 立即中止</text>
<text x="399" y="186" text-anchor="middle" font-size="12.5" fill="#5b6478">已动的按逆序回滚</text>
<rect x="594" y="30" width="262" height="76" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="725" y="62" text-anchor="middle" font-size="20">🎉 data/ 换新成功</text>
<text x="725" y="88" text-anchor="middle" font-size="12.5" fill="#5b6478">此时才允许清扫暂存与孤儿目录</text>
<rect x="594" y="128" width="262" height="76" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="725" y="160" text-anchor="middle" font-size="20">🛡️ data/ 原状保留</text>
<text x="725" y="186" text-anchor="middle" font-size="12.5" fill="#5b6478">rollback 里的旧数据是最后退路</text>
<line x1="196" y1="98" x2="280" y2="70" stroke="#232733" stroke-width="4" marker-end="url(#ar23)"/>
<line x1="196" y1="132" x2="280" y2="163" stroke="#232733" stroke-width="4" marker-end="url(#ar23)"/>
<line x1="516" y1="68" x2="590" y2="68" stroke="#232733" stroke-width="4" marker-end="url(#ar23)"/>
<line x1="516" y1="166" x2="590" y2="166" stroke="#232733" stroke-width="4" marker-end="url(#ar23)"/>
</svg>
<p class="caption">🔒 整条恢复链 fail-closed：每一道校验失败都不碰真实数据目录一分一毫。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>备份不停服：对正在写的数据库当场复印一份事务一致快照<small>还没合并进主文件的日志页也会带上；随后自检并把权限收紧到仅主人可读</small></p></div>
<div class="step"><span class="n">2</span><p>打包前扫描符号链接和特殊文件，发现问题当场报警拒收<small>会话里可重建的链接直接删，逃出围栏的链接更是零容忍</small></p></div>
<div class="step"><span class="n">3</span><p>写入版本化的随箱清单再整体压缩成包<small>清单同时记录「收了哪些」「排除了哪些」，瞬态四目录有名有姓地缺席</small></p></div>
<div class="step"><span class="n">4</span><p>恢复前先把端口检查、归档内容、PID 排他锁全部办妥<small>路径出现越界或非常规条目？直接罢工，目标目录未动分毫</small></p></div>
<div class="step"><span class="n">5</span><p>逐组件换装：旧的挪进回滚区、新的就位；中途翻车则逆序搬回去<small>暂存区只在完全成功后才清扫——那是崩溃中断时最后的救命副本</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>11 个</b><span>受管组件全部进备份</span></div>
<div class="stat"><b>4 个</b><span>瞬态组件显式排除在备份外</span></div>
<div class="stat"><b>约 21 倍</b><span>NORMAL 同步级别换来的写提速</span></div>
<div class="stat"><b>818 行</b><span>安全测试文件的规模</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>数据库目录是唯一必须存在的组件：归档里缺了它，恢复器连聊都不聊直接拒绝。</li>
<li>配置目录权限层层加固；签名密钥若缺失，恢复后所有登录会话立即作废——工具会专门提醒你这一点。</li>
<li>陈旧的恢复锁绝不自动回收：删除锁是破坏性操作，必须由人来确认，程序宁可报错也不猜。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>备份显示成功了，是不是就万无一失了？</dt><dd>不能只看结果码。系统在生成阶段就会拒绝那些「看起来成功却永远恢复不了」的归档内容——硬链接、逃逸链接、管道设备一律不收。边界也要明白：它不保护什么——文件部分走的是逐目录复制，与数据库快照之间存在秒级漂移的可能，好在库内引用都是相对路径不会悬空，真正强一致的场合（升级迁移前）另有自包含快照兜底。</dd>
<dt>为什么有些目录明明在工作却不给备份？</dt><dd>四类瞬态数据各有理由：进程间管道每次运行都重建；宿主机侧的容器环境变量属于安全边界本身，打包它等于把围墙送人；流式缓冲和日志要么可再生要么不值一提。备份它们只会把体积和风险装进车里。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../23-shu-ju-mu-lu-jie-gou-yu-zhi-xing-bei-fen-hui-fu.md">数据目录结构与一致性备份恢复</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="22-memory-v2.html">第 22 章 · Workspace Memory v2</a><a href="24-rbac-quan-xian.html">第 24 章 · RBAC 权限模型</a></div>

<nav class="nav">
<a href="22-memory-v2.html">上一章：Workspace Memory v2 ←</a>
<a href="24-rbac-quan-xian.html">下一章：RBAC 权限模型 →</a>
</nav>
<footer>HappyClaw 图解精读 · 23 / 30</footer>
</div></body></html>
`;export{n as default};
