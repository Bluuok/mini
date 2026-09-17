const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第24章 · 积木界面：叫了才动 · TinyCode 图解精读</title>
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
<p class="crumb">第 24 章 / 27 · 界面与模型层 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 24 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>积木界面：叫了才动</h1>
<p class="lede">约 950 行界面代码搭在 pi-tui 积木上。没有魔法自动刷新——AI 每吐一个字触发事件，事件唤起 requestRender()，每一帧都有人负责。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像剧场的手动字幕机：投影内容（代理事件流）变了，放映员（事件映射）手动切一次片（requestRender）。没有自动轮播，所以永远不会闪帧、永远不会错帧。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 240" role="img" aria-label="组件树与重绘"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="240" y="20" width="400" height="52" rx="12" fill="#eef4ff" stroke="#3b82f6" stroke-width="3"/>
    <text x="440" y="52" text-anchor="middle" font-size="17" font-weight="700">📜 ScrollView 聊天区（自动滚到底）</text>
    <rect x="240" y="86" width="400" height="44" rx="12" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="440" y="114" text-anchor="middle" font-size="16">⌨️ 输入框 + ⏳ 忙碌指示</text>
    <rect x="240" y="144" width="400" height="44" rx="12" fill="#f0f2f7" stroke="#c9cfdb" stroke-width="3"/>
    <text x="440" y="172" text-anchor="middle" font-size="16">📊 状态栏</text>
    <line x1="440" y1="74" x2="440" y2="82" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
    <line x1="440" y1="132" x2="440" y2="140" stroke="#1a2233" stroke-width="3.5" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">AI 每吐一个字 → 事件 → <code>requestRender()</code> 显式重绘。<b>没有魔法自动刷新</b>，每一帧都有人叫，所以流畅又可预测。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>启动装配组件树：布局根两行结构<small>上方滚动区 + 下方固定三行</small></p></div><div class="step"><span class="n">2</span><p>模型流式吐字 → onEvent 收到 partial 事件<small>字一条条进来</small></p></div><div class="step"><span class="n">3</span><p>事件映射表查到对应 UI 变更<small>追加文本 / 更新工具卡片 / 状态栏</small></p></div><div class="step"><span class="n">4</span><p>requestRender() 显式重绘这一帧<small>可预测：每一帧都有明确原因</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>≈950</b><span>行，全部界面代码</span></div><div class="stat"><b>2</b><span>行布局：滚动区 + 底部栈</span></div><div class="stat"><b>3</b><span>行，布局系统承诺给输入区的最小高度</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>ScrollView 配置 follow:end 自动滚到底、primary:true 接收滚轮。</li><li>渲染帧完全由代码中的 requestRender() 驱动，无脏检查。</li><li>pi-tui v0.84.3 提供布局与渲染原语，TinyCode 只做事件映射。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为什么不用 React 那样的自动渲染？</dt><dd>终端渲染帧成本高且需要精确控制；显式重绘让性能可预测、无幽灵刷新。</dd><dt>流式输出时界面会闪吗？</dt><dd>不会。每个 partial 事件合并进缓冲，重绘节奏由渲染器统一调度。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../24-liu-shi-tui-zu-cheng-zu-jian-shu-shi-jian-ying-she-yu-xian-shi-zhong-hui-gui-ze.md">组件树、事件映射与显式重绘规则</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="04-jiao-hu-shi-tui-shi-yong-zhi-nan-kuai-jie-jian-shu-ru-yu-xie-gang-ming-ling.html">第 4 章 · 界面用起来是什么样</a><a href="08-tinycoderuntime-jie-pou-wu-ge-ce-lue-gou-zi-jie-ru-pi-dai-li-xun-huan.html">第 8 章 · 事件从哪个钩子来</a></div>

<nav class="nav">
<a href="23-zi-dai-li-jian-du-zhi-du-gong-zuo-xian-cheng-bing-fa-shang-xian-yu-jie-gou-hua-bao-gao-hui-shou.html">上一章：蜂后最多派三只工蜂 ←</a>
<a href="index.html">返回目录</a>
<a href="25-mo-xing-zhu-ce-biao-duo-ti-gong-shang-xuan-ze-lian-yu-mock-mo-xing-zhu-ru.html">下一章：加油站：换发动机不换车 →</a>
</nav>
<footer>TinyCode 图解精读 · 24 / 27</footer>
</div></body></html>
`;export{n as default};
