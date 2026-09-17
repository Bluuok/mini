const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第25章 · 加油站：换发动机不换车 · TinyCode 图解精读</title>
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
<p class="crumb">第 25 章 / 27 · 界面与模型层 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 25 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>加油站：换发动机不换车</h1>
<p class="lede">模型注册表是「发动机接口」：几十家提供商统一接入，上层永远只向一个入口要 LLM。钥匙只查环境变量，注册表自己永不存钥匙。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像加油站：无论后面接的是汽油车（Anthropic）还是电动车（OpenAI/本地模型），加油/充电的接口标准统一。加油站不保管你的油卡（环境变量钥匙），只负责计量（token 用量随事件上报）。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#f5f0ff;"><span class="big">🏪</span><b>内置提供商</b><small>Anthropic · OpenAI · OpenRouter…</small></div>
    <div class="card" style="background:#eef4ff;"><span class="big">🔑</span><b>钥匙只查环境变量</b><small>注册表自己永不存钥匙</small></div>
    <div class="card" style="background:#edfaf2;"><span class="big">🎭</span><b>Mock 注入</b><small>--mock / 测试：假 AI 上场</small></div>
  </div>
  <p class="caption"><code>tinycode --list-models</code> 看全部可选；没配钥匙时友好提示而不是崩溃。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>builtinModels() 注册数十家内置提供商<small>Anthropic/OpenAI/OpenRouter/Groq…</small></p></div><div class="step"><span class="n">2</span><p>选择模型：显式指定 > 配置文件 > 第一个可用<small>确定性选择链</small></p></div><div class="step"><span class="n">3</span><p>没钥匙？--list-models 查看，友好提示<small>不崩溃，指引你配置</small></p></div><div class="step"><span class="n">4</span><p>测试/试用时注入 Mock 提供商<small>懒加载单例，按剧本出牌</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>数十</b><span>家内置提供商开箱即用</span></div><div class="stat"><b>env</b><span>钥匙唯一合法来源</span></div><div class="stat"><b>1</b><span>个入口，上层全部通过它要模型</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>注册表是 pi-ai 的 MutableModels 薄封装，不实现任何网络协议。</li><li>streamFn 出口统一做 maxTokens 封顶（默认 16384，可配置）。</li><li>认证完全依赖环境变量，注册表自身零存储。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>换一家模型提供商要改多少代码？</dt><dd>零。换环境变量钥匙 + 模型名即可；上层的循环、工具、权限全部无感。</dd><dt>模型输出上限为什么默认 16384？</dt><dd>平衡长输出需求与费用/配额预检（部分服务商按 max_tokens 预扣费）；可配置调整。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../25-mo-xing-zhu-ce-biao-duo-ti-gong-shang-xuan-ze-lian-yu-mock-mo-xing-zhu-ru.md">多提供商选择链与 Mock 模型注入</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="02-kuai-su-kai-shi-an-zhuang-gou-jian-yu-mock-mo-shi-ling-pei-zhi-yun-xing.html">第 2 章 · 零钥匙的 Mock 模式怎么用</a><a href="03-pei-zhi-ti-xi-config-json-huan-jing-bian-liang-yu-mi-yao-an-quan-guan-li.html">第 3 章 · 钥匙放哪里最安全</a></div>

<nav class="nav">
<a href="24-liu-shi-tui-zu-cheng-zu-jian-shu-shi-jian-ying-she-yu-xian-shi-zhong-hui-gui-ze.html">上一章：积木界面：叫了才动 ←</a>
<a href="index.html">返回目录</a>
<a href="26-quan-chi-xian-ce-shi-ce-lue-jiao-ben-hua-mock-mo-xing-qu-dong-zhen-shi-dai-li-xun-huan-de-e2e.html">下一章：只换演员，不换舞台 →</a>
</nav>
<footer>TinyCode 图解精读 · 25 / 27</footer>
</div></body></html>
`;export{n as default};
