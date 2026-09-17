const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第23章 · 蜂后最多派三只工蜂 · TinyCode 图解精读</title>
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
<p class="crumb">第 23 章 / 27 · 扩展机制 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 23 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>蜂后最多派三只工蜂</h1>
<p class="lede">根代理可以把只读研究任务派给子代理：它们是各自独立的 AI 实例（不是系统线程），只带眼睛不带手，干完只交结构化报告。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像主编派实习生查资料：最多同时派三个（并发上限），实习生只有阅览室通行证（只读工具），回来说结论不带回整摞复印材料（结构化报告）——主编的桌面永远整洁。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 220" role="img" aria-label="子代理"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="40" y="60" width="220" height="100" rx="16" fill="#f5f0ff" stroke="#8b5cf6" stroke-width="3"/>
    <text x="150" y="100" text-anchor="middle" font-size="26">👑 根代理</text>
    <text x="150" y="132" text-anchor="middle" font-size="13.5" fill="#5b6478">全套工具 + 派活权</text>
    <rect x="420" y="26"  width="200" height="56" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="520" y="60" text-anchor="middle" font-size="15">🐝 工蜂 1（只读）</text>
    <rect x="420" y="92"  width="200" height="56" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="520" y="126" text-anchor="middle" font-size="15">🐝 工蜂 2（只读）</text>
    <rect x="420" y="158" width="200" height="56" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="2.5"/>
    <text x="520" y="192" text-anchor="middle" font-size="15">🐝 工蜂 3（只读）</text>
    <rect x="700" y="80" width="150" height="70" rx="12" fill="#edfaf2" stroke="#2fae6d" stroke-width="2.5"/>
    <text x="775" y="110" text-anchor="middle" font-size="14.5" font-weight="700">📄 结构化报告</text>
    <text x="775" y="133" text-anchor="middle" font-size="12" fill="#5b6478">只交结论</text>
    <line x1="262" y1="95"  x2="416" y2="60"  stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="262" y1="115" x2="416" y2="118" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="262" y1="140" x2="416" y2="180" stroke="#1a2233" stroke-width="3" marker-end="url(#ar)"/>
    <line x1="622" y1="115" x2="696" y2="115" stroke="#2fae6d" stroke-width="3" marker-end="url(#ar)"/>
  </svg>
  <p class="caption"><b>并发上限 3，超了直接拒绝</b>；工蜂不是系统线程，是各自独立的 AI 实例，互相不串门。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>根代理调用 spawn_agent 派任务<small>携带给定的问题</small></p></div><div class="step"><span class="n">2</span><p>工蜂在自己的独立实例里检索研究<small>独立工具集、权限、上下文、历史</small></p></div><div class="step"><span class="n">3</span><p>并发已满 3 个？新派遣直接被拒<small>超限即拒绝，防蜂群失控</small></p></div><div class="step"><span class="n">4</span><p>wait_agent 收报告，close_agent 释放<small>结构化结论回收到根对话</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>3</b><span>个并发上限，超限直接拒绝</span></div><div class="stat"><b>只读</b><span>工蜂的工具集权限</span></div><div class="stat"><b>4</b><span>件管理工具：spawn/list/wait/close</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>隔离边界是内存中的对象图，不是执行栈——本质是多个 Promise 各自驱动独立循环。</li><li>工蜂与根对话不共享任何可变状态，各有专属 AbortController。</li><li>单向数据流：报告只进不出，根上下文永远只看结论。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么限制只读？</dt><dd>子代理的定位是研究而非改动；防止多实例并发写同一批文件造成混乱。</dd><dt>工蜂会用我的 API 额度吗？</dt><dd>会——每个实例都是真实的模型调用；并发上限 3 同时也是成本上限。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../23-zi-dai-li-jian-du-zhi-du-gong-zuo-xian-cheng-bing-fa-shang-xian-yu-jie-gou-hua-bao-gao-hui-shou.md">只读工作线程、并发上限与结构化报告回收</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="11-tong-gong-ju-zhu-ce-biao-nei-zhi-mcp-yu-zi-dai-li-gong-ju-de-ming-ming-kong-jian-he-bing.html">第 11 章 · 工蜂工具在注册表里的位置</a><a href="09-dai-li-xun-huan-yu-gong-ju-zhi-xing-liu-shui-xian-cong-liu-shi-xiang-ying-dao-jie-guo-luo-pan.html">第 9 章 · 派生出的研究也走同样的循环</a></div>

<nav class="nav">
<a href="22-mcp-ji-cheng-stdio-fu-wu-qi-bing-xing-lian-jie-yu-dan-dian-gu-zhang-ge-chi.html">上一章：插线板：外挂工具，坏了不炸 ←</a>
<a href="index.html">返回目录</a>
<a href="24-liu-shi-tui-zu-cheng-zu-jian-shu-shi-jian-ying-she-yu-xian-shi-zhong-hui-gui-ze.html">下一章：积木界面：叫了才动 →</a>
</nav>
<footer>TinyCode 图解精读 · 23 / 27</footer>
</div></body></html>
`;export{n as default};
