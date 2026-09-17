const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 6 章 · 智能体-工作区-会话三层模型 · HappyClaw 图解精读</title>
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
<p class="crumb">第 6 章 / 30 · 智能体优先产品模型 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 6 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>智能体-工作区-会话三层模型</h1>
<p class="lede">智能体回答「你是谁」，工作区圈定「在哪干活」，会话记录「此刻说到哪」——三层各有独立的存储与生命周期，靠绑定表和身份指纹联动。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一位外聘顾问的三大件：人设卡（智能体：名片、价值观、行为守则）可以挂到多个项目组办公（工作区：独立文件夹、执行模式、环境变量）；而在某个工位上的一通通电话互不相通（会话：共享工位的文件，但不共享对话内容）。人设卡改版当天，所有正等他回电的分机一律挂断重来——warm runner 全停，下次冷启动注入新人设。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="三层模型关系"><defs><marker id="ar6" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="46" width="220" height="140" rx="16" fill="#f1ecfe" stroke="var(--accent)" stroke-width="3"/>
    <text x="134" y="86" text-anchor="middle" font-size="24">🪪</text>
    <text x="134" y="114" text-anchor="middle" font-size="14.5" font-weight="700">智能体 agent_profiles</text>
    <text x="134" y="140" text-anchor="middle" font-size="12.5" fill="#5b6478">身份·灵魂·规则·工具提示词</text>
    <text x="134" y="164" text-anchor="middle" font-size="12.5" fill="#5b6478">runtime_policy + identity_hash</text>
    <line x1="246" y1="116" x2="310" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar6)"/>
    <text x="278" y="100" text-anchor="middle" font-size="11.5" fill="#8a92a6">绑定</text>
    <rect x="316" y="30" width="234" height="172" rx="16" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="433" y="70" text-anchor="middle" font-size="24">🗂️🖥️</text>
    <text x="433" y="98" text-anchor="middle" font-size="14.5" font-weight="700">工作区 Workspace</text>
    <text x="433" y="124" text-anchor="middle" font-size="12.5" fill="#5b6478">data/groups/{folder} 项目文件</text>
    <text x="433" y="148" text-anchor="middle" font-size="12.5" fill="#5b6478">Host / Container 执行模式</text>
    <text x="433" y="174" text-anchor="middle" font-size="12.5" fill="#5b6478">Workspace Memory 跨会话知识</text>
    <line x1="552" y1="82" x2="618" y2="56" stroke="#232733" stroke-width="4" marker-end="url(#ar6)"/>
    <line x1="552" y1="150" x2="618" y2="176" stroke="#232733" stroke-width="4" marker-end="url(#ar6)"/>
    <rect x="624" y="20" width="228" height="84" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="738" y="52" text-anchor="middle" font-size="17">📞 主会话（常驻）</text>
    <text x="738" y="80" text-anchor="middle" font-size="12.5" fill="#5b6478">chat_jid = 工作区 JID 本身</text>
    <rect x="624" y="128" width="228" height="84" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="738" y="160" text-anchor="middle" font-size="17">📱 对话会话（可多个）</text>
    <text x="738" y="188" text-anchor="middle" font-size="12.5" fill="#5b6478">{workspaceJid}#agent:{id}</text>
  </svg>
  <p class="caption">同一张人设可坐多个工位；会话共享工位文件，但各自的对话历史与 SDK 会话目录互相独立。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>每位用户自带内置智能体 HappyClaw，Home 工作区被代码钉死绑给它<small>任何把 Home 工作区绑给其他智能体的操作都会被 assignWorkspaceAgentProfile 拒绝</small></p></div><div class="step"><span class="n">2</span><p>新建自定义智能体只有身份策略，没有隐式工作区<small>创建工作区必须显式携带 agent_profile_id，未指定时回落到默认智能体</small></p></div><div class="step"><span class="n">3</span><p>工作区目录名走统一契约的正则校验<small>^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$——注册期接受的，清理时一定安全处理</small></p></div><div class="step"><span class="n">4</span><p>工作区内主会话常驻；对话会话用虚拟 JID 路由消息<small>列表 API 把两者合并返回，主会话固定 id='main'、is_main=true</small></p></div><div class="step"><span class="n">5</span><p>编辑身份提示词 → 重算 identity_hash、version+1 → 停掉全部 warm runner<small>运行时会话快照指纹不符即重置 SDK 会话行，并保留近期历史注入</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>7</b><span>类提示词字段（前四个构成人格分层）</span></div><div class="stat"><b>3</b><span>种会话形态：主/对话/运行时投影</span></div><div class="stat"><b>128</b><span>字符内的工作区目录名长度上限</span></div><div class="stat"><b>+1</b><span>编辑身份后 version 自增触发失效</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>命名陷阱要记牢：产品级智能体在 agent_profiles 表；遗留的 agents 表其实是工作区内的运行会话。</li><li>Provider 粘性是硬规则：恢复含 thinking 块的 Claude 会话必须回到同一 Provider，否则签名无法校验；切换 Provider 会先 deleteSession 再重绑。</li><li>删除非默认智能体前必须迁走它名下全部工作区；渠道挂载归属随工作区映射一起变更。</li><li>前端导航也按三层展开：侧边栏先按智能体分组（HappyClaw 置顶），组下列工作区，进入后再列主会话与对话会话。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>代码里两处都叫 Agent，会不会认错？搞混了会怎样？</dt><dd>真的要分清：agent_profiles 才是产品级智能体，遗留 agents 表存的是工作区里的对话/任务/子代理会话——数据库注释明文警告不要混淆。连运行时元数据都刻意命名为 workspace_runtime_sessions，避免与产品会话撞名。看错表会把「某次对话」当成一个完整人格来编辑或删除。</dd><dt>同一个智能体挂在多个工作区，记忆会不会互相串台？</dt><dd>不会串台，但要分开看：对话历史严格按会话隔离，永不跨工作区共享；跨会话复用的是单个工作区自己的 Workspace Memory（事实、决策、经验），且资源全部按 owner 隔离。渠道侧还有所有权粘性——第二个连接器观察到后续消息也不会静默迁移会话归属，只有跨越不同会话/账号/Provider 时才可能更换。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../06-%E6%99%BA%E8%83%BD%E4%BD%93-%E5%B7%A5%E4%BD%9C%E5%8C%BA-%E4%BC%9A%E8%AF%9D%E4%B8%89%E5%B1%82%E6%A8%A1%E5%9E%8B.md">智能体-工作区-会话三层模型</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="05-bu-shu-yun-wei.html">第 5 章 · 部署与运维</a><a href="07-shuang-zhi-xing-mo-shi.html">第 7 章 · 双执行模式</a></div>

<nav class="nav">
<a href="05-bu-shu-yun-wei.html">上一章：部署与运维 ←</a>
<a href="07-shuang-zhi-xing-mo-shi.html">下一章：双执行模式 →</a>
</nav>
<footer>HappyClaw 图解精读 · 6 / 30</footer>
</div></body></html>
`;export{t as default};
