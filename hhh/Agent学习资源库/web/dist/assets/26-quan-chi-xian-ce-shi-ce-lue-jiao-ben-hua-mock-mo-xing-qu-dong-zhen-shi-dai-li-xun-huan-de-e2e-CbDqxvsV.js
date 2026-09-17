const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第26章 · 只换演员，不换舞台 · TinyCode 图解精读</title>
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
<p class="crumb">第 26 章 / 27 · 测试工程 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 26 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>只换演员，不换舞台</h1>
<p class="lede">E2E 测试唯一的替身是「模型」——一个照剧本出牌的假提供商。循环、工具、权限、会话、上下文全部真枪实弹。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像话剧彩排用替身念台词：舞台、灯光、走位、对手戏全部真实，唯独主角的台词按剧本念（确定性输出）。彩排通过 = 真实演出（真模型）大概率不出意外。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#fff7e6;"><span class="big">🎭</span><b>假模型</b><small>照剧本吐台词（唯一 Mock）</small></div>
    <div class="card" style="background:#edfaf2;"><span class="big">✅</span><b>真循环 · 真工具 · 真红绿灯</b><small>真会话 · 真截断压缩</small></div>
  </div>
  <p class="caption">剧本演一整出「发现坏代码 → 修好 → 验证」，全程零网络。协作顺序（先权限后干活、先截断后落盘）就是这样测出来的。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>测试编排模型剧本：诊断 → 发起修复 → 验证<small>确定性 AssistantMessage 序列</small></p></div><div class="step"><span class="n">2</span><p>剧本驱动真实 Pi 循环<small>循环对假模型毫无察觉</small></p></div><div class="step"><span class="n">3</span><p>真实调用 read/edit/bash 工具<small>在 fixtures 的坏项目上真改代码</small></p></div><div class="step"><span class="n">4</span><p>断言最终状态：文件被修好、测试通过<small>全流程零网络</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>1</b><span>个被 Mock 的边界（streamFn）</span></div><div class="stat"><b>0</b><span>次网络访问，完全离线</span></div><div class="stat"><b>145+</b><span>个测试，全绿是进主干门槛</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>传统单元测试 mock 掉模块就验证不了协作顺序；这里刻意全真。</li><li>验证的协作契约：先权限后执行、先截断后落盘。</li><li>fixtures/broken-project 提供可复现的「坏项目」舞台。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>剧本驱动的测试会不会太脆？</dt><dd>恰恰相反：模型输出确定，断言可以精确到消息序列；真模型的随机性反而无法断言。</dd><dt>真模型上会不会表现不同？</dt><dd>会，所以还有 PTY 冒烟测试和真实调用验收（第 27 章）补最后一层。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../26-quan-chi-xian-ce-shi-ce-lue-jiao-ben-hua-mock-mo-xing-qu-dong-zhen-shi-dai-li-xun-huan-de-e2e.md">脚本化 Mock 模型驱动真实代理循环的 E2E</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="27-zhi-liang-men-jin-pty-ji-tui-ce-shi-yu-node-duo-ban-ben-ci.html">第 27 章 · 塔尖上的真终端测试</a><a href="07-harness-zhuang-pei-liu-cheng-bootstrap-ru-he-chuan-lian-quan-bu-zi-xi-tong.html">第 7 章 · 被测的装配全貌</a></div>

<nav class="nav">
<a href="25-mo-xing-zhu-ce-biao-duo-ti-gong-shang-xuan-ze-lian-yu-mock-mo-xing-zhu-ru.html">上一章：加油站：换发动机不换车 ←</a>
<a href="index.html">返回目录</a>
<a href="27-zhi-liang-men-jin-pty-ji-tui-ce-shi-yu-node-duo-ban-ben-ci.html">下一章：测试金字塔，塔尖是真终端 →</a>
</nav>
<footer>TinyCode 图解精读 · 26 / 27</footer>
</div></body></html>
`;export{n as default};
