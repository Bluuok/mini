const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第2章 · 三条命令跑起来 · TinyCode 图解精读</title>
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
<p class="crumb">第 2 章 / 27 · 快速入门 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 2 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>三条命令跑起来</h1>
<p class="lede">不需要数据库、不需要容器、不需要 API 钥匙。唯一的门槛是一个够新的 Node.js。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像试用一台净水器：厂商预装了滤芯（Mock 模型），接上水管（npm install）就能出filtered水，你想喝真水（接真实 AI）随时可以换芯。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 210" role="img" aria-label="三步启动">
    <rect x="20" y="40" width="260" height="110" rx="16" fill="#f0f2f7" stroke="#c9cfdb" stroke-width="3"/>
    <text x="150" y="88" text-anchor="middle" font-size="19" font-family="monospace">npm install</text>
    <text x="150" y="122" text-anchor="middle" font-size="14" fill="#5b6478">装依赖（唯一要网的步骤）</text>
    <rect x="310" y="40" width="260" height="110" rx="16" fill="#f0f2f7" stroke="#c9cfdb" stroke-width="3"/>
    <text x="440" y="88" text-anchor="middle" font-size="19" font-family="monospace">npm run build</text>
    <text x="440" y="122" text-anchor="middle" font-size="14" fill="#5b6478">编译出 dist/</text>
    <rect x="600" y="40" width="260" height="110" rx="16" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="730" y="88" text-anchor="middle" font-size="16" font-family="monospace">TINYCODE_MODEL=mock</text>
    <text x="730" y="116" text-anchor="middle" font-size="16" font-family="monospace">npm run dev</text>
    <text x="730" y="140" text-anchor="middle" font-size="14" fill="#2fae6d">零密钥离线启动 ✨</text>
    <line x1="282" y1="95" x2="306" y2="95" stroke="#1a2233" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="572" y1="95" x2="596" y2="95" stroke="#1a2233" stroke-width="4" marker-end="url(#ar)"/>
    <defs><marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1a2233"/></marker></defs>
  </svg>
  <p class="caption"><b>Mock 模型</b> = 一个背好台词的假 AI，专门用来试玩和跑测试，一句真话不问、一分钱不花。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>确认 Node.js 版本 ≥ 22.19（node -v）<small>唯一的环境硬要求</small></p></div><div class="step"><span class="n">2</span><p>npm install 装依赖<small>唯一需要网络的步骤</small></p></div><div class="step"><span class="n">3</span><p>npm run build 编译<small>产出 dist/ 目录</small></p></div><div class="step"><span class="n">4</span><p>TINYCODE_MODEL=mock npm run dev 启动<small>零密钥、零花费，离线可跑</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>22.19</b><span>最低 Node.js 版本</span></div><div class="stat"><b>1 次</b><span>需要网络的步骤（仅安装）</span></div><div class="stat"><b>0</b><span>启动所需 API 钥匙（Mock 模式）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>Mock 模型是「背好台词的假 AI」：按剧本回复，专门用于试用和自动化测试。</li><li>运行期完全离线，CI 在 Node 22 / 24 两个版本上验证。</li><li>正式使用时通过环境变量配置任意一家模型提供商的钥匙。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>没有 API 钥匙能体验吗？</dt><dd>能。Mock 模式下功能全部可用，回复内容是预置剧本，适合先熟悉交互再接入真实模型。</dd><dt>Node 版本不够会怎样？</dt><dd>安装阶段就会被 engines 字段拦下并提示，不会带着隐患运行。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../02-kuai-su-kai-shi-an-zhuang-gou-jian-yu-mock-mo-shi-ling-pei-zhi-yun-xing.md">安装、构建与 Mock 模式零配置运行</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="25-mo-xing-zhu-ce-biao-duo-ti-gong-shang-xuan-ze-lian-yu-mock-mo-xing-zhu-ru.html">第 25 章 · 模型注册表：怎么接入真实 AI</a><a href="03-pei-zhi-ti-xi-config-json-huan-jing-bian-liang-yu-mi-yao-an-quan-guan-li.html">第 3 章 · 配置体系：钥匙放哪里</a></div>

<nav class="nav">
<a href="01-xiang-mu-gai-lan-ge-ke-yi-xia-wu-du-wan-de-bian-ma-zhi-neng-ti-gu-jia.html">上一章：它是什么 ←</a>
<a href="index.html">返回目录</a>
<a href="03-pei-zhi-ti-xi-config-json-huan-jing-bian-liang-yu-mi-yao-an-quan-guan-li.html">下一章：配置的三层叠叠乐 →</a>
</nav>
<footer>TinyCode 图解精读 · 2 / 27</footer>
</div></body></html>
`;export{n as default};
