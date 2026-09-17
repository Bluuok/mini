const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第19章 · 只加页、不撕页的日记本 · TinyCode 图解精读</title>
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
<p class="crumb">第 19 章 / 27 · 会话管理 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 19 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>只加页、不撕页的日记本</h1>
<p class="lede">把「突然断电」当日常来设计：会话记录只追加、不重写，就算进程被硬杀，已写入的内容也安然无恙。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像会计的流水账：每一笔只往后追加，绝不回头涂改。就算账本最后一行被咖啡渍糊了（崩溃残页），前面的账目分毫不差——重新对账时把糊掉那行划掉即可。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#eef4ff;"><span class="big">➕</span><b>只追加</b><small>每条记录一行，写完立刻刷盘</small></div>
    <div class="card" style="background:#fff7e6;"><span class="big">✂️</span><b>残页？撕掉就行</b><small>读的时候跳过最后一行坏数据</small></div>
    <div class="card" style="background:#edfaf2;"><span class="big">🔎</span><b>人也能读</b><small>grep / tail 直接看，零数据库</small></div>
  </div>
  <p class="caption">一个会话一个 <code>.jsonl</code> 文件，第 1 行永远是“封面”，后面每行一条消息。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>新会话创建：写入第 1 行「封面」<small>含会话元信息</small></p></div><div class="step"><span class="n">2</span><p>每条消息定稿 → 追加一行，同步刷盘<small>崩溃最多丢最后半行</small></p></div><div class="step"><span class="n">3</span><p>进程被硬杀（kill -9）<small>已刷盘的内容完好</small></p></div><div class="step"><span class="n">4</span><p>恢复时逐行解析，跳过残缺尾行<small>容忍性解析兑现崩溃安全承诺</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>1</b><span>个会话一个 .jsonl 文件</span></div><div class="stat"><b><250</b><span>行，存储层三模块总量</span></div><div class="stat"><b>0</b><span>数据库依赖，node:fs 同步 API 足够</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>文件人类可读：grep / tail 就能检查，排障不需要专门工具。</li><li>第 1 行永远是会话头，其后每行一条消息，契约固定。</li><li>追加式写入从第一性原理上消除了「半新半旧」状态。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么不用 SQLite？</dt><dd>追加式 JSONL 天然崩溃安全、零依赖、人类可读；会话场景是典型的一次写多次读，用不着数据库。</dd><dt>文件会不会越来越大？</dt><dd>会随对话增长，但文本行级体积很小；上下文压缩（第 18 章）控制的是发给模型的量，磁盘留存全史。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../19-zhui-jia-shi-jsonl-cun-chu-beng-kui-an-quan-de-hui-hua-chi-jiu-hua-she-ji.md">崩溃安全的会话持久化设计</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="20-hui-hua-sheng-ming-zhou-qi-xin-jian-continue-mu-lu-pi-pei-yu-new-lun-huan.html">第 20 章 · 会话怎么新建、恢复、轮换</a><a href="18-token-yu-suan-yu-zi-dong-ya-suo-hui-hua-zhai-yao-sheng-cheng-yu-bao-hu-chuang-kou.html">第 18 章 · 发给模型的内容怎么瘦身</a></div>

<nav class="nav">
<a href="18-token-yu-suan-yu-zi-dong-ya-suo-hui-hua-zhai-yao-sheng-cheng-yu-bao-hu-chuang-kou.html">上一章：行李箱超重：自动压缩 ←</a>
<a href="index.html">返回目录</a>
<a href="20-hui-hua-sheng-ming-zhou-qi-xin-jian-continue-mu-lu-pi-pei-yu-new-lun-huan.html">下一章：新本子、旧本子、换本子 →</a>
</nav>
<footer>TinyCode 图解精读 · 19 / 27</footer>
</div></body></html>
`;export{n as default};
