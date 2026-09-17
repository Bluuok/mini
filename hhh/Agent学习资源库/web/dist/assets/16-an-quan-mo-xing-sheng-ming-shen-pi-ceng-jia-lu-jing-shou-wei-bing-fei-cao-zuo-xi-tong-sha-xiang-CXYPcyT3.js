const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第16章 · 门卫不是监狱：安全的边界 · TinyCode 图解精读</title>
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
<p class="crumb">第 16 章 / 27 · 权限与安全 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 16 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>门卫不是监狱：安全的边界</h1>
<p class="lede">审批闸门 + 路径守卫，是应用内的两道检查，不是操作系统级隔离。AI 干活用的是你的账号、你的钥匙、你的环境变量。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像小区门禁：它能拦住陌生访客（路径越界）和可疑行为（危险命令需审批），但拦不住持有你门禁卡的住户（你的用户权限）。要让不可信的客人绝对隔离，得用独立单元（容器/虚拟机）。</p></div>

<h2>全景图解</h2>
<div style="background:#fdeeee;border:3px solid #e5484d;border-radius:16px;padding:22px;text-align:center;font-size:19px;">
    <b>这是门卫，不是监狱。</b><br>
    <span style="font-size:15.5px;color:#5b6478;">审批闸门 + 路径守卫 ≠ 操作系统沙箱。AI 干活时用的是<b>你的账号、你的钥匙</b>。</span>
  </div>
  <p class="caption">跑真正不可信的代码？请关进容器 / 虚拟机。🔑 密钥只住环境变量。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>README 的 Security notes 写明边界<small>面向使用者的声明</small></p></div><div class="step"><span class="n">2</span><p>paths.ts 注释：「这是路径守卫，不是 OS 沙箱」<small>实现处的自我声明</small></p></div><div class="step"><span class="n">3</span><p>classifier.ts 注释：「启发式路由器，非沙箱」<small>第三处互相印证</small></p></div><div class="step"><span class="n">4</span><p>结论：不可信代码请进容器/虚拟机运行<small>使用守则</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3</b><span>处声明互相印证（README/守卫/分类器）</span></div><div class="stat"><b>你的</b><span>用户权限，即 AI 的全部权限</span></div><div class="stat"><b>0</b><span>项 OS 级隔离承诺</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>审批层看所有工具调用（含 MCP 与子代理工具，未分类者默认 ask）。</li><li>路径守卫只存在于七个内置工具内部——bash 命令靠审批层约束。</li><li>API 钥匙只住环境变量，也是这份安全模型的一部分。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>那它到底保护了什么？</dt><dd>防「不小心」：路径越界、误删、误改；对「故意使坏」需要外部隔离手段配合。</dd><dt>跑来路不明的任务前该做什么？</dt><dd>放进 Docker 容器或虚拟机，并确认环境变量里没有敏感钥匙。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../16-an-quan-mo-xing-sheng-ming-shen-pi-ceng-jia-lu-jing-shou-wei-bing-fei-cao-zuo-xi-tong-sha-xiang.md">审批层加路径守卫并非操作系统沙箱</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="12-gong-zuo-qu-lu-jing-shou-wei-fu-hao-lian-jie-gan-zhi-de-shuang-ce-realpath-xiao-yan.html">第 12 章 · 路径守卫的机制细节</a><a href="03-pei-zhi-ti-xi-config-json-huan-jing-bian-liang-yu-mi-yao-an-quan-guan-li.html">第 3 章 · 密钥安全管理</a></div>

<nav class="nav">
<a href="15-shen-pi-jiao-hu-mian-tui-dui-hua-kuang-yu-wu-tou-mo-shi-de-chai-yi-hua-yu-yi.html">上一章：同一道闸门，两种前台 ←</a>
<a href="index.html">返回目录</a>
<a href="17-gong-ju-jie-guo-jie-duan-ce-lue-tou-wei-bao-liu-yu-wan-zheng-shu-chu-gui-dang-wei-gong-jian.html">下一章：长日志：掐中间，留两头 →</a>
</nav>
<footer>TinyCode 图解精读 · 16 / 27</footer>
</div></body></html>
`;export{n as default};
