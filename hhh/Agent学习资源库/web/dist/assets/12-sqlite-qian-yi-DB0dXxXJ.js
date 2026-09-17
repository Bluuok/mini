const e=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 12 章 · SQLite Schema 与数据库迁移机制 · HappyClaw 图解精读</title>
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
<p class="crumb">第 12 章 / 30 · 系统架构 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 12 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>SQLite Schema 与数据库迁移机制</h1>
<p class="lede">单文件 SQLite 靠「声明式建表＋版本门控迁移＋启动期对账」演进：升级动工前强制拍一份完整快照，备份失败就拒绝开业，版本号只进不退。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像店铺翻新装修：开工前先把整间店拍成全景照片（VACUUM INTO 快照，验证不合格就不开工），装错了随时按照片复原；装修队照着版本图纸逐级施工，墙上钉一块「当前进度 v69」的牌子；遇到从没见过的新版号（比代码还新的库）干脆关门谢客。任何一步搞砸，牌子停在旧号上，明天照单重来一遍也不怕。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="迁移启动管线"><defs><marker id="ar12" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="64" width="186" height="102" rx="14" fill="#eef3fd" stroke="#4a7df0" stroke-width="2.5"/>
    <text x="117" y="98" text-anchor="middle" font-size="19">📂 开库读版本</text>
    <text x="117" y="122" text-anchor="middle" font-size="12" fill="#5b6478">存于 router_state 表</text>
    <text x="117" y="140" text-anchor="middle" font-size="11.5" fill="#8a92a6">&gt;69 拒绝降级不开门</text>
    <line x1="212" y1="115" x2="234" y2="115" stroke="#232733" stroke-width="3" marker-end="url(#ar12)"/>
    <rect x="238" y="64" width="186" height="102" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="2.5"/>
    <text x="331" y="98" text-anchor="middle" font-size="19">📸 预迁移快照</text>
    <text x="331" y="122" text-anchor="middle" font-size="12" fill="#5b6478">VACUUM INTO 独立文件</text>
    <text x="331" y="140" text-anchor="middle" font-size="11.5" fill="#8a92a6">quick_check 验证 · 失败即中止</text>
    <line x1="426" y1="115" x2="448" y2="115" stroke="#232733" stroke-width="3" marker-end="url(#ar12)"/>
    <rect x="452" y="64" width="190" height="102" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="547" y="94" text-anchor="middle" font-size="17">🧱 建表＋门控迁移</text>
    <text x="547" y="116" text-anchor="middle" font-size="12" fill="#5b6478">41 张核心表 · 模块化表族</text>
    <text x="547" y="134" text-anchor="middle" font-size="11.5" fill="#8a92a6">ensureColumn 轻量加列</text>
    <text x="547" y="150" text-anchor="middle" font-size="11.5" fill="#8a92a6">事务包裹的数据回填</text>
    <line x1="644" y1="115" x2="666" y2="115" stroke="#232733" stroke-width="3" marker-end="url(#ar12)"/>
    <rect x="670" y="64" width="182" height="102" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="761" y="96" text-anchor="middle" font-size="17">🏷️ 校验后落版本</text>
    <text x="761" y="120" text-anchor="middle" font-size="12" fill="#5b6478">assertSchema 结构不变量</text>
    <text x="761" y="138" text-anchor="middle" font-size="11.5" fill="#8a92a6">失败停旧值，下次重跑</text>
    <text x="761" y="154" text-anchor="middle" font-size="11.5" fill="#8a92a6">通过才写 schema_version=69</text>
  </svg>
  <p class="caption">顺序本身就是承诺：先保险、再建表、再迁移、最后才挂版本牌——中途任何一步失败都是「原样重来」。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>启动时先看清楚库现在几岁<small>版本号放在现成的 key-value 表 router_state 里而不是 PRAGMA user_version——迁移过程本身要读写多个运行时状态键。</small></p></div><div class="step"><span class="n">2</span><p>符合条件就强制拍照存证<small>版本 39–68 一律 VACUUM INTO 快照并用独立连接 quick_check 验证、chmod 0600；连未打版本的旧库都会凭遗留表被识别为 v0 补拍，绝不静默放行。</small></p></div><div class="step"><span class="n">3</span><p>声明式建表与模块化表族各就各位<small>db.ts 内联 41 条 CREATE TABLE；渠道可靠性 5 张、记忆 9 张＋FTS5 虚拟表等由所属模块的 createXxxSchema 工厂在自己的时点声明。</small></p></div><div class="step"><span class="n">4</span><p>补列与数据迁移分四种模式走<small>ensureColumn 加列约 70 处、版本门控事务迁移、整表重建（约束无法 ALTER 时）、废弃表 DROP——v66→v67 就删掉了占库 65% 的遗留 memory_chunks。</small></p></div><div class="step"><span class="n">5</span><p>全部核对无误才更新「进度牌」<small>assertSchema 校验关键表的必需列集合；INSERT OR REPLACE schema_version = 69 是整条管线的最后一个动作。</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>69</b><span>当前的 schema 头部版本</span></div><div class="stat"><b>41 张</b><span>db.ts 内联声明的核心 CREATE TABLE</span></div><div class="stat"><b>≈70 处</b><span>ensureColumn 轻量加列的集中出现次数</span></div><div class="stat"><b>21 倍</b><span>WAL＋NORMAL 组合实测同步写路径提速</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>v39 用户名小写化展示了迁移的分寸感：只改确定无冲突的行，撞车时拒绝该行并记日志留给运维——迁移代码从不替用户做二义性决策。</li>
<li>语义铁律：改变运行时行为的迁移必须使旧会话失效（身份哈希变化、版本递增）；纯默认值归一化的迁移必须保持身份稳定不动会话。</li>
<li>外键默认是关的：显式 PRAGMA foreign_keys=ON 后中断级联留下的 messages→chats 孤儿自动清除，其余违规类警告后回退 OFF 以免挡住下一次写入。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>迁移到一半断电，数据库会不会报废？</dt><dd>最坏情况是停在旧版本：头部版本号只在管线末尾写入，任一步失败 schema_version 保持旧值，下次启动整条管线安全重跑；加上动工前的快照保险，重复执行无副作用。它防不了磁盘本身的物理损坏——所以 migration-backups/ 目录被视为唯一回滚依据，不许删除。</dd>
<dt>拿旧程序去开新数据库行不行？</dt><dd>被硬性拒绝：schema_version 高于当前二进制认知（＞69）直接抛错中止启动，防止旧代码误写新结构；反向同理——版本只进不退是另一条铁律，开着降级口子只会让两套结构互相污染。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../12-sqlite-schema-yu-shu-ju-ku-qian-yi-ji-zhi.md">SQLite Schema 与数据库迁移机制</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="11-stream-event.html">第 11 章 · StreamEvent 类型同步</a><a href="13-im-qu-dao.html">第 13 章 · IM 渠道架构</a></div>

<nav class="nav">
<a href="11-stream-event.html">上一章：StreamEvent 类型同步 ←</a>
<a href="index.html">返回目录</a>
<a href="13-im-qu-dao.html">下一章：IM 渠道架构 →</a>
</nav>
<footer>HappyClaw 图解精读 · 12 / 30</footer>
</div></body></html>
`;export{e as default};
