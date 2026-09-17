const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 18 章 · 会话与工作区模型 · Craft Agents 图解精读</title>
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
<p class="crumb">第 18 章 / 23 · 会话与扩展 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 18 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>会话与工作区模型</h1>
<p class="lede">工作区是大抽屉、会话是小档案袋，全躺在 ~/.craft-agent/workspaces/ 下——没有数据库，备份就是拷文件夹。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一排双层文件柜：外层抽屉贴着 URL 安全的标签（slug），里面每个牛皮纸袋是一个会话，名字自动取号成「日期-形容词-名词」，比如 260615-swift-river。账本是活页夹（JSONL）：首页是目录卡——消息数、开头预览、Token 累计全都预写好了，翻总账不用逐页数；写字先用铅笔在草稿纸上誊好，再「啪」地一次盖回正本（临时文件+改名），中途停电最多毁一张草稿。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="工作区与会话目录树"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="25" y="60" width="230" height="110" rx="14" fill="#eef1fb" stroke="#7C5CFC" stroke-width="3"/>
    <text x="140" y="100" text-anchor="middle" font-size="24">🗄️📁</text>
    <text x="140" y="128" text-anchor="middle" font-size="14.5" font-weight="700">工作区抽屉</text>
    <text x="140" y="151" text-anchor="middle" font-size="12.5" fill="#8a92a6">config.json · sources/ · skills/ · sessions/</text>
    <rect x="355" y="60" width="215" height="110" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="462" y="100" text-anchor="middle" font-size="22">🪪🔠</text>
    <text x="462" y="128" text-anchor="middle" font-size="14.5" font-weight="700">首行 Header 目录卡</text>
    <text x="462" y="151" text-anchor="middle" font-size="12.5" fill="#8a92a6">messageCount · preview · tokenUsage 预计算</text>
    <rect x="665" y="60" width="190" height="110" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="760" y="100" text-anchor="middle" font-size="22">✏️📄➡️📎</text>
    <text x="760" y="128" text-anchor="middle" font-size="14.5" font-weight="700">原子写入落盘</text>
    <text x="760" y="151" text-anchor="middle" font-size="12.5" fill="#8a92a6">先写 .tmp 再改名替换</text>
    <line x1="255" y1="115" x2="351" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="570" y1="115" x2="661" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">读取只看首行 Header 就能列出会话；解析坏行直接跳过，活页夹少一页不至于整本作废。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>新建会话：从当天约两万组形容词-名词词库取号<small>ID 格式 YYMMDD-形容词-名词；撞名加 -2 后缀，极端情况用加密随机十六进制兜底</small></p></div><div class="step"><span class="n">2</span><p>开袋前先把六个隔层全部备齐<small>ensureSessionDir() 创建 attachments/plans/data/long_responses/downloads 及 session.jsonl</small></p></div><div class="step"><span class="n">3</span><p>聊天中写盘先进持久化队列排队<small>500ms 防抖合并快速保存，单会话串行写入防止争抢同一个 .tmp 文件</small></p></div><div class="step"><span class="n">4</span><p>真正写入前查一眼：磁盘上的元数据若被别的窗口改过，先合回来再动笔<small>外部元数据保留：主线程绝不覆盖监听器或另一窗口刚改的名称/标签/状态</small></p></div><div class="step"><span class="n">5</span><p>把整个会话拷到另一台机器？路径已写成 {{SESSION_PATH}} 占位符<small>展开时还原成新机器的真实路径，打包迁移后照样能跑</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>~20,000</b><span>每天可用的形容词-名词组合取名空间</span></div><div class="stat"><b>500ms</b><span>持久化队列的写盘防抖间隔</span></div><div class="stat"><b>150 字</b><span>Header 预览截取第一条用户消息的前 150 字符</span></div><div class="stat"><b>2 层</b><span>类型系统：core 的传输 DTO 层 + shared 的持久化权威层</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>归档是软删除（isArchived 标志）；保留策略 deleteOldArchivedSessions 会按可配置天数把过期归档永久删掉。</li>
<li>分支像书签夹页：branchFromMessageId 是硬性上下文截断点，此后的父会话内容模型一律不许带过来。</li>
<li>跨服务器交接靠一次性摘要注入：transferredSessionSummary 在远端首轮对话被塞进去，打过 applied 标记就不会重复注入。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>明文 JSONL 直接躺磁盘上，会不会被人拿路径穿越攻击？</dt><dd>有一道专门闸门：validateSessionId() 比较 basename(sessionId) 与原始输入是否一致并强制 [\\w-]+ 模式，sanitizeSessionId 再做纵深防御过滤。边界要说清：它防的是恶意 ID 钻出会话目录，它不保护的是磁盘本身的加密与系统访问权限——同一台机器的其他用户本来就能读你家目录。</dd>
<dt>状态 todo / in-progress 是写死的吗？</dt><dd>不是：状态是引用工作区级配置的动态字符串，内置五个 ID 只是默认值；分类函数把它归为 open 或 closed，驱动收件箱与已完成两个视图。失效的状态 ID 会回落到 todo。</dd>
<dt>两份保存请求挤在一起会不会互相覆盖？</dt><dd>持久化队列串行化单会话写入，且检测到外部元数据变更时会把磁盘版本合并回来再写。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../会话与工作区模型_lukilabs_craft-agents-oss/会话与工作区模型_lukilabs_craft-agents-oss.md">会话与工作区模型</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="17-chuan-shu-rpc.html">第 17 章 · 传输与 RPC 层</a><a href="19-lai-yuan-yu-ji-neng.html">第 19 章 · 来源与技能系统</a></div>

<nav class="nav">
<a href="17-chuan-shu-rpc.html">上一章：传输与 RPC 层 ←</a>
<a href="index.html">返回目录</a>
<a href="19-lai-yuan-yu-ji-neng.html">下一章：来源与技能系统 →</a>
</nav>
<footer>Craft Agents 图解精读 · 18 / 23</footer>
</div></body></html>
`;export{n as default};
