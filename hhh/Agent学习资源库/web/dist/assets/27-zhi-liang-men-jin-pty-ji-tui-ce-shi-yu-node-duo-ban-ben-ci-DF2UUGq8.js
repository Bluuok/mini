const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第27章 · 测试金字塔，塔尖是真终端 · TinyCode 图解精读</title>
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
<p class="crumb">第 27 章 / 27 · 测试工程 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 27 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>测试金字塔，塔尖是真终端</h1>
<p class="lede">组件测试在进程内验证纯文本输出；E2E 用假模型驱动真循环；塔尖的 PTY 测试真的启动一个终端进程、真的敲键盘、真的看退出码。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像新车下线检测：台架测发动机（组件）、场地试驾（E2E），最后还得真上路（PTY）——用真方向盘、真红绿灯、真行人。用户会遇到的事，检测线上先遇一遍。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 260" role="img" aria-label="测试金字塔">
    <polygon points="440,20 560,90 320,90" fill="#eef4ff" stroke="#3b82f6" stroke-width="3"/>
    <text x="440" y="72" text-anchor="middle" font-size="14" font-weight="700">PTY 真终端</text>
    <polygon points="300,100 580,100 500,170 380,170" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="440" y="140" text-anchor="middle" font-size="14.5" font-weight="700">E2E：假模型演真循环</text>
    <polygon points="360,180 520,180 560,240 320,240" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="440" y="212" text-anchor="middle" font-size="14.5" font-weight="700">组件级测试 ×145</text>
    <text x="740" y="60" text-anchor="middle" font-size="14" fill="#5b6478">☁️ CI：Node 22 + 24 双版本</text>
    <text x="740" y="84" text-anchor="middle" font-size="14" fill="#5b6478">全绿才准进主干</text>
  </svg>
  <p class="caption">PTY 测试 = 启动真正的 CLI 进程、真的按键、真的看退出码 —— 用户会遇到的事，CI 里先遇一遍。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>组件级：进程内渲染视图，断言文本<small>金字塔底层，最快最多</small></p></div><div class="step"><span class="n">2</span><p>E2E：假模型驱动真循环修坏项目<small>中层：协作契约</small></p></div><div class="step"><span class="n">3</span><p>PTY：node-pty 启动 dist CLI，真敲按键<small>顶层：全链路真实进程</small></p></div><div class="step"><span class="n">4</span><p>CI 在 Node 22 / 24 双版本跑全部门禁<small>全绿才准进主干</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3</b><span>层测试金字塔</span></div><div class="stat"><b>2</b><span>个 Node 大版本矩阵</span></div><div class="stat"><b>100%</b><span>推送前全绿才合入</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>PTY 测试覆盖：启动、双击 Ctrl+C 退出、无钥匙引导面板、暗色渲染。</li><li>PT T 测试在 CI 中与本地行为一致——终端环境由内核伪终端保证。</li><li>门禁顺序：typecheck → lint → test → build，缺一不可。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么需要 PTY 层？窗口内测试不够吗？</dt><dd>终端交互（全屏、按键、退出码）只在真实伪终端里暴露问题；这是用户实际触碰的最后一公里。</dd><dt>CI 慢吗？</dt><dd>全量门禁约 1 分钟（145+ 测试 + 构建），双版本并行；慢测试换来的回归信心值得。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../27-zhi-liang-men-jin-pty-ji-tui-ce-shi-yu-node-duo-ban-ben-ci.md">PTY 级 TUI 测试与 Node 多版本 CI</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="26-quan-chi-xian-ce-shi-ce-lue-jiao-ben-hua-mock-mo-xing-qu-dong-zhen-shi-dai-li-xun-huan-de-e2e.html">第 26 章 · 中层的 E2E 怎么做</a><a href="02-kuai-su-kai-shi-an-zhuang-gou-jian-yu-mock-mo-shi-ling-pei-zhi-yun-xing.html">第 2 章 · 被测的启动流程本身</a></div>

<nav class="nav">
<a href="26-quan-chi-xian-ce-shi-ce-lue-jiao-ben-hua-mock-mo-xing-qu-dong-zhen-shi-dai-li-xun-huan-de-e2e.html">上一章：只换演员，不换舞台 ←</a>
<a href="index.html">返回目录</a>
<span style="opacity:.4">已是最后一章</span>
</nav>
<footer>TinyCode 图解精读 · 27 / 27</footer>
</div></body></html>
`;export{n as default};
