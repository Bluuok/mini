const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第3章 · 配置的三层叠叠乐 · TinyCode 图解精读</title>
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
<p class="crumb">第 3 章 / 27 · 快速入门 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 3 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>配置的三层叠叠乐</h1>
<p class="lede">同一项设置有三个入口：命令行参数、环境变量、配置文件。优先级固定：上面说了算，下面兜底。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像公司的三级行政：老板（命令行）当面发话最优先；规章制度（环境变量）次之；部门惯例文档（config.json）兜底。谁都每发话时，按行业默认惯例来（内置默认值）。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 260" role="img" aria-label="配置优先级">
    <rect x="240" y="20"  width="400" height="56" rx="12" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
    <text x="440" y="55" text-anchor="middle" font-size="18" font-weight="700">⌨️ 命令行参数（最说了算）</text>
    <rect x="240" y="92"  width="400" height="56" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="440" y="127" text-anchor="middle" font-size="18" font-weight="700">🌍 环境变量</text>
    <rect x="240" y="164" width="400" height="56" rx="12" fill="#eef4ff" stroke="#3b82f6" stroke-width="3"/>
    <text x="440" y="199" text-anchor="middle" font-size="18" font-weight="700">📄 .tinycode/config.json（可提交）</text>
  </svg>
  <p class="caption">🔑 钥匙（API Key）<b>只准住环境变量</b>，配置文件里出现 <code>apiKey</code>/<code>sk-</code> 这类字段，启动时会大声警告你 —— 防止不小心把钥匙提交到 GitHub。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>临时改一次模型<small>用命令行参数，优先级最高，不落盘</small></p></div><div class="step"><span class="n">2</span><p>固定用某个模型<small>写进环境变量（如 TINYCODE_MODEL）</small></p></div><div class="step"><span class="n">3</span><p>给项目定制权限和工具<small>写进 .tinycode/config.json，可以随仓库提交共享给团队</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3</b><span>层配置来源</span></div><div class="stat"><b>0</b><span>配置文件里允许出现的密钥</span></div><div class="stat"><b>即</b><span>刻 启动时扫描密钥误放并警告</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>API 钥匙只允许住在环境变量里；config.json 设计为可提交，因此不放任何秘密。</li><li>启动时会扫描配置文件：字段名含 apiKey/secret/token 或值以 sk- 开头，立即大声警告。</li><li>.gitignore 默认排除 .env*、*.key、*.pem 等密钥类文件。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>把钥匙写进 config.json 会怎样？</dt><dd>配置不生效（钥匙只读环境变量），且启动时收到警告——防止这个可提交的文件把秘密带上版本库。</dd><dt>团队共享配置怎么做？</dt><dd>把 .tinycode/config.json 提交进仓库即可；钥匙各自配置在自己的环境变量里。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../03-pei-zhi-ti-xi-config-json-huan-jing-bian-liang-yu-mi-yao-an-quan-guan-li.md">config.json、环境变量与密钥安全管理</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="16-an-quan-mo-xing-sheng-ming-shen-pi-ceng-jia-lu-jing-shou-wei-bing-fei-cao-zuo-xi-tong-sha-xiang.html">第 16 章 · 安全模型：哪些保障是承诺的</a><a href="02-kuai-su-kai-shi-an-zhuang-gou-jian-yu-mock-mo-shi-ling-pei-zhi-yun-xing.html">第 2 章 · 快速开始：零配置先跑起来</a></div>

<nav class="nav">
<a href="02-kuai-su-kai-shi-an-zhuang-gou-jian-yu-mock-mo-shi-ling-pei-zhi-yun-xing.html">上一章：三条命令跑起来 ←</a>
<a href="index.html">返回目录</a>
<a href="04-jiao-hu-shi-tui-shi-yong-zhi-nan-kuai-jie-jian-shu-ru-yu-xie-gang-ming-ling.html">下一章：一屏四块的终端界面 →</a>
</nav>
<footer>TinyCode 图解精读 · 3 / 27</footer>
</div></body></html>
`;export{n as default};
