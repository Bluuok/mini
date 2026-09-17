const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 7 章 · 贡献者与维护模式 · Craft Agents 图解精读</title>
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
<p class="crumb">第 7 章 / 23 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 7 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>贡献者与维护模式</h1>
<p class="lede">一个创始人对自己下了两周的战书——赢了自己打不了赖的那种。结果这一局长成了全公司天天在用、平均两三天就发一版的亲儿子开源项目。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一家从赌局里诞生的口碑餐厅：老板在圣诞假期跟自己打赌「两周内必须开业」，赌赢了全员从此每天吃自家饭菜。真正天天掌勺出餐的是一位全职主厨——几乎每一版新菜单都出自他手，报修当天就能响应；熟客们则不断递来新菜谱和差评，下一批菜单里就能看到回应。老板不是职业厨师出身，是设计师转行——所以他盯的不只是菜的味道，还有端上桌的盘子好不好看。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="贡献者生态"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="25" y="55" width="240" height="120" rx="14" fill="#f1effb" stroke="#232733" stroke-width="2.5"/>
    <text x="145" y="98" text-anchor="middle" font-size="28">🎲</text>
    <text x="145" y="130" text-anchor="middle" font-size="15" font-weight="700">创始人 · 远见者</text>
    <text x="145" y="155" text-anchor="middle" font-size="12.5" fill="#5b6478">两周赌约开局，定方向管同步</text>
    <rect x="320" y="55" width="250" height="120" rx="14" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
    <text x="445" y="98" text-anchor="middle" font-size="28">🧑‍🍳</text>
    <text x="445" y="130" text-anchor="middle" font-size="15" font-weight="700">全职引擎 rjulius23</text>
    <text x="445" y="155" text-anchor="middle" font-size="12.5" fill="#5b6478">几乎每个版本发布都经他手</text>
    <rect x="625" y="55" width="235" height="120" rx="14" fill="#f1effb" stroke="#232733" stroke-width="2.5"/>
    <text x="742" y="98" text-anchor="middle" font-size="28">👥</text>
    <text x="742" y="130" text-anchor="middle" font-size="15" font-weight="700">社区贡献者</text>
    <text x="742" y="155" text-anchor="middle" font-size="12.5" fill="#5b6478">提 PR、报 bug，反哺路线图</text>
    <line x1="267" y1="115" x2="314" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="572" y1="115" x2="619" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">几周内便以 Apache 2.0 许可证开源；到 2026 年 4 月已收获约 3,700 个 Star 与 580 个 Fork。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>有人报告 Linux 上非 AVX2 的 Bun 跑不起来<small>数小时内维护者就切换到基线 Bun 构建完成修复</small></p></div><div class="step"><span class="n">2</span><p>你想改点什么：照 CONTRIBUTING.md fork 仓库、开 feature/ 或 fix/ 分支提交 PR<small>核心技术栈 TypeScript + Bun + Electron，本地开发用 bun run electron:dev</small></p></div><div class="step"><span class="n">3</span><p>PR 推上去后 CI 的 Validate 工作流开始跑测试套件<small>GitHub Copilot 还会先做一轮自动代码审查，充当机器初筛</small></p></div><div class="step"><span class="n">4</span><p>维护者以全职频率响应 issue，多数 bug 当天关闭<small>发版节奏约每 2–3 天一次；更新日志会点名感谢 PR 作者与报 bug 用户</small></p></div>
<div class="step"><span class="n">5</span><p>发现缺功能？别只发牢骚，开成 issue 参与讨论<small>当前待解决议题 182 个：从 PWA 支持、单工作区笔记到实时 Token 用量显示，讨论都相当活跃</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>2 周</b><span>创始人给自己定下的开发期限</span></div><div class="stat"><b>~3,700</b><span>Star（另有 580 Fork，2026 年 4 月）</span></div><div class="stat"><b>2–3 天</b><span>一次版本发布的大致节奏</span></div><div class="stat"><b>182 个</b><span>当前待解决的 issue 数量</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>中文语言支持（@alihoowayne 的 #516）、复古终端主题、Bedrock 命名 AWS 配置文件支持等都来自外部 PR 并进了正式版本。</li><li>公司层面：Luki Labs 注册于冰岛，获 Creandum 领投的 800 万美元 A 轮融资，员工既用 Craft Docs 也用 Craft Agents——全员吃自家狗粮。</li><li>起源故事：赌约条件是若成功，全体 Craft Docs 员工自 2026 年 1 月 5 日起人手每月 200 美元的 Claude Max 订阅并被要求设定「不可能目标」。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>把代码交出去会不会有法律风险？</dt><dd>项目按 Apache 2.0 许可证开源，CONTRIBUTING.md 明确写明所有贡献均按该许可证授权——你提交的东西进了仓库，使用方就按同一份许可拿去用。它不担保的是「贡献一定被采纳」：合入与否仍由维护者的架构方向说了算。</dd>
<dt>社区贡献会不会只是装饰品？</dt><dd>有实际落地的例子：中文 i18n、模型用量指示器、AWS 配置文件支持都来自外部 PR。但要说明边界：目前内部开发节奏明显快于社区 PR 吞吐量，深度架构改动仍主要来自公司团队，外部多在边缘补位。</dd><dt>我随手报的 bug 真有人理吗？</dt><dd>有。issue 是路线图的输入之一：可消除的工作目录历史记录项、MiniMax CN 认证修复等都源于用户报告并进了正式版本；报告者在更新日志中会被点名致谢。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../关于贡献者_lukilabs_craft-agents-oss.md">关于贡献者</a>（文字版，含源码与 GitHub 深链出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="06-wen-ti-fan-kui.html">第 6 章 · 问题反馈与协作</a><a href="08-monorepo-jia-gou.html">第 8 章 · Monorepo 架构</a></div>

<nav class="nav">
<a href="06-wen-ti-fan-kui.html">上一章：问题反馈与协作 ←</a>
<a href="index.html">返回目录</a>
<a href="08-monorepo-jia-gou.html">下一章：Monorepo 架构 →</a>
</nav>
<footer>Craft Agents 图解精读 · 7 / 23</footer>
</div></body></html>
`;export{n as default};
