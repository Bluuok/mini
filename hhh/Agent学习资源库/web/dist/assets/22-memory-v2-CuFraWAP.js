const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 22 章 · Workspace Memory v2：结构化跨会话知识 · HappyClaw 图解精读</title>
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
<p class="crumb">第 22 章 / 30 · 数据与记忆 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 22 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>Workspace Memory v2：结构化跨会话知识</h1>
<p class="lede">工作区长期记忆只存提炼过的结论，分四类入账、按版本修订、忘记也留痕；AI 想写必须持宿主发的一次性签名章，读则自动注入每个回合。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像项目组的公共白板：只贴结论和必要背景，不抄整段聊天记录；每张便签都有编号，别人动过你手里那份就过不了关（版本比对）；「撕掉」其实是翻到背面盖个作废章，底稿一张不少锁进档案柜。而且只有戴着宿主亲手发的一次性签字章的人才能上去写字——光会说「我是项目经理」没用。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="一条工作区记忆的生命线"><defs><marker id="ar22" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="24" y="58" width="160" height="114" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="104" y="96" text-anchor="middle" font-size="26">📝</text>
<text x="104" y="126" text-anchor="middle" font-size="14.5" font-weight="700">写入留验</text>
<text x="104" y="148" text-anchor="middle" font-size="13" fill="#5b6478">四类之一＋HMAC 签名</text>
<rect x="244" y="58" width="160" height="114" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="324" y="96" text-anchor="middle" font-size="26">🗂️</text>
<text x="324" y="126" text-anchor="middle" font-size="14.5" font-weight="700">版本化落库</text>
<text x="324" y="148" text-anchor="middle" font-size="13" fill="#5b6478">revision＋来源溯源</text>
<rect x="464" y="58" width="160" height="114" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="544" y="96" text-anchor="middle" font-size="26">🔍</text>
<text x="544" y="126" text-anchor="middle" font-size="14.5" font-weight="700">检索注入</text>
<text x="544" y="148" text-anchor="middle" font-size="13" fill="#5b6478">全文相关性排序</text>
<rect x="704" y="58" width="152" height="114" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="780" y="96" text-anchor="middle" font-size="26">🪦</text>
<text x="780" y="126" text-anchor="middle" font-size="14.5" font-weight="700">忘记留痕</text>
<text x="780" y="148" text-anchor="middle" font-size="13" fill="#5b6478">停止召回，档案仍在</text>
<line x1="186" y1="115" x2="240" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar22)"/>
<line x1="406" y1="115" x2="460" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar22)"/>
<line x1="626" y1="115" x2="700" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar22)"/>
</svg>
<p class="caption">🧷 每一步都在同一事务里完成：主表、全文索引、审计与投递事件要么全成、要么全回滚。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>每个用户回合自动拉一份最新记忆快照注入<small>默认取 12 条、上限一万二千字符；连温存回合也要拉全新的，不复用上一轮</small></p></div>
<div class="step"><span class="n">2</span><p>Agent 想记东西要调用配套工具，定时任务和子代理只能读不能写<small>写能力在工具注册层面就被裁掉，不是靠提示词求它别写</small></p></div>
<div class="step"><span class="n">3</span><p>每次写入都要 HMAC 签名校验，密钥走 stdin 不进环境变量<small>同一段签名字节想重放？消费一次即作废，进程活着也不行</small></p></div>
<div class="step"><span class="n">4</span><p>网页编辑靠版本比对提交，撞车返回 409 并保留你的草稿<small>页面绝不悄悄覆盖或合并，加载谁的新版必须由你点</small></p></div>
<div class="step"><span class="n">5</span><p>「忘记」只是停止检索并写入作废记录，历史照旧可查<small>真正的内容级清空是重建工作区：记忆、来源、待投递全部重来</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>4 类</b><span>事实／决策／经验／待跟进，白名单外直接拒绝</span></div>
<div class="stat"><b>12 条</b><span>快照默认注入的记忆条数</span></div>
<div class="stat"><b>32 字节</b><span>一次性签名密钥长度，随实例发放</span></div>
<div class="stat"><b>64KB</b><span>HTTP 请求体上限，超出即拒收</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>搜索双轨制：查询够长走全文索引的相关性排序加高亮；太短就退化成模糊匹配——再短的词也能搜，只是不再讲道理。</li>
<li>内置助手的 Home 工作区永久绑定、不可删除不可迁移；你的称呼存在平台保留项里，通用接口完全看不到它。</li>
<li>v1 的文件式记忆已退役（老端点一律返回 410）；迁移后 SQLite 是唯一在线真相源，不允许新旧两处双写。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>把攒下的对话记忆直接喂给 AI，会不会被当成指令执行？</dt><dd>快照被包进「这是工作区历史数据而非指令」的标签里注入，转义处理把内容里的尖括号与符号全部废掉武功。但要说清它不保护什么：这层防的是模型层面的注入，不代替权限体系——管理员同样不能跨主人读别人的工作区记忆，越界一律 404。</dd>
<dt>改错了或者冲突了，数据会被覆盖丢掉吗？</dt><dd>不会。提交时带着你看到的版本号比对，服务端已经变了就打回 409，本地草稿原样保留；页面也不会自作聪明帮你合并或重试。「忘记」更是软删除：召回消失、审计长存。</dd>
<dt>「重建工作区」听起来像一键格式化，危险吗？</dt><dd>它是明确的内容级永久重置：九张相关表在一个事务里整体清空重来，Home 的称呼与首次唤醒也一并复位，关联的定时任务停止并进回收站。但外壳工作区、文件和聊天历史不受影响——它擦的是记忆层，不碰会话与磁盘文件。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../22-workspace-memory-v2-jie-gou-hua-kua-hui-hua-zhi-shi.md">Workspace Memory v2：结构化跨会话知识</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="21-runner-zhou-qi.html">第 21 章 · Runner 生命周期</a><a href="23-bei-fen-hui-fu.html">第 23 章 · 备份与恢复</a></div>

<nav class="nav">
<a href="21-runner-zhou-qi.html">上一章：Runner 生命周期 ←</a>
<a href="23-bei-fen-hui-fu.html">下一章：备份与恢复 →</a>
</nav>
<footer>HappyClaw 图解精读 · 22 / 30</footer>
</div></body></html>
`;export{n as default};
