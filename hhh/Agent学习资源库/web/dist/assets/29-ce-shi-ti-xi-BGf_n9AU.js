const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 29 章 · 测试体系：单元测试、契约测试与模型冒烟 · HappyClaw 图解精读</title>
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
<p class="crumb">第 29 章 / 30 · 质量保障 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 29 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>测试体系：单元测试、契约测试与模型冒烟</h1>
<p class="lede">绝大多数验证落在毫秒级 Vitest 上，契约测试在编译前锁死跨模块约定；真正要花钱的模型冒烟，只在发布节点手动点火。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像医院体检分级：血常规几十块钱人人都做（Vitest 单元测试，数百个用例文件毫秒级出结果）；手术前的核查清单逐项对勾（契约测试：源码文本、类型同步、SDK 运行时、工程脚本四种形态）；全身 CT 又贵又有辐射（真实模型与镜像冒烟）——不是不做，而是攒到关键节点，由医生亲自安排。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="测试金字塔分层"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="40" y="70" width="240" height="100" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="160" y="106" text-anchor="middle" font-size="24">🧪⚡</text>
    <text x="160" y="134" text-anchor="middle" font-size="14.5" font-weight="700">Vitest 单元 · 全量常跑</text>
    <text x="160" y="156" text-anchor="middle" font-size="12.5" fill="#5b6478">纯函数状态机穷举 · 毫秒级</text>
    <rect x="320" y="70" width="240" height="100" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="440" y="106" text-anchor="middle" font-size="24">📜🔗</text>
    <text x="440" y="134" text-anchor="middle" font-size="14.5" font-weight="700">契约测试 · 编译前锁定</text>
    <text x="440" y="156" text-anchor="middle" font-size="12.5" fill="#5b6478">源码 / 类型同步 / SDK / 脚本四形态</text>
    <rect x="600" y="70" width="240" height="100" rx="14" fill="#EFEAFE" stroke="var(--accent)" stroke-width="3"/>
    <text x="720" y="106" text-anchor="middle" font-size="24">🔥💰</text>
    <text x="720" y="134" text-anchor="middle" font-size="14.5" font-weight="700">冒烟 · 手动/发布门禁</text>
    <text x="720" y="156" text-anchor="middle" font-size="12.5" fill="#5b6478">真实模型计费请求 · 镜像 CDP 探针</text>
    <line x1="282" y1="120" x2="316" y2="120" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="562" y1="120" x2="596" y2="120" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">💸 金字塔尖的两类冒烟被排除在常规 CI 之外：真实模型可能产生付费请求，镜像冒烟仅作为 main 分支发布门禁。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>改了一段游标状态机<small>turn-outcome.test.ts 对 resolveTurnOutcome 输入穷举断言：「runner 关闭但回合未健康完成 → 可重试、游标保持」精确匹配</small></p></div><div class="step"><span class="n">2</span><p>重构动了跨文件约定<small>源码文本契约读取 Makefile 断言：生产启动必须是 make start → node dist/index.js、禁止 pm2、备份必须走 sqlite-snapshot.mjs</small></p></div><div class="step"><span class="n">3</span><p>手滑改了 shared/ 的副本<small>CI 里 make sync-types 后 git diff --exit-code 当场失败——三端副本逐字节一致，禁止手工编辑</small></p></div><div class="step"><span class="n">4</span><p>验证子 Agent 不偷看主对话<small>integration 测试起 fake Anthropic SSE 服务器捕获全部上游请求：main 带 MAIN_ONLY_MARKER，子 Agent 请求绝不得泄漏它</small></p></div><div class="step"><span class="n">5</span><p>发布前点火真实模型<small>test:real-model 要求模型逐字返回固定标记 HAPPYCLAW_REAL_SMOKE_OK_20260721，超时 90 秒；失败只输出一行日志，绝不打印 Provider 信息</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>323 个</b><span>*.test.ts 后端与契约测试文件</span></div><div class="stat"><b>26 个</b><span>文件名含 contract 的契约测试</span></div><div class="stat"><b>90 秒</b><span>真实模型冒烟超时上限</span></div><div class="stat"><b>32 字符</b><span>模型必须逐字返回的标记长度</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>check-agent-runner-prompts.sh 带防漏网守卫：源码里任何未被模式捕获的 .md 字面量都让构建直接失败，而不是静默缩小检查范围。</li><li>vitest 显式排除 data/** 与 web/tests/e2e/**——用户工作区可能嵌套自带测试套件的项目，E2E 归 Playwright 独立运行。</li><li>Agent runner self-test 是零依赖的「事故重放」：模拟后台任务还在跑时模型给出看似最终的回复，验证能在两次尝试内强制续写。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>模型冒烟为什么不让 CI 自动跑？还藏着掖着不打日志？</dt><dd>因为每次执行都是一次真实的付费 Provider 请求；注释明确 catch 分支只写一行 real-model smoke failed——Provider 错误文本可能夹带端点或上游响应片段，宁可少说也不泄密。它不保护什么：固定标记问答只验证连通性与格式忠实度，不代表业务功能正确，那是底下几层的职责。</dd><dt>读源码文本做断言的「契约测试」，不显得另类吗？</dt><dd>恰恰是它的价值所在：不执行代码也能在编译前锁定「多实现必须保持同步」「生成物必须入库且最新」这类架构纪律，重构悄悄偏离时立即报错。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../29-ce-shi-ti-xi-dan-yuan-ce-shi-qi-yue-ce-shi-yu-zhen-shi-mo-xing-mou-yan.md">测试体系：单元测试、契约测试与真实模型冒烟</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="28-shi-shi-xiao-xi-liu.html">第 28 章 · 实时消息流与渲染</a><a href="30-ci-liu-shui-xian.html">第 30 章 · CI 流水线</a></div>

<nav class="nav">
<a href="28-shi-shi-xiao-xi-liu.html">上一章：实时消息流与渲染 ←</a>
<a href="index.html">返回目录</a>
<a href="30-ci-liu-shui-xian.html">下一章：CI 流水线 →</a>
</nav>
<footer>HappyClaw 图解精读 · 29 / 30</footer>
</div></body></html>
`;export{t as default};
