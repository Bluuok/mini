const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第4章 · 一屏四块的终端界面 · TinyCode 图解精读</title>
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
<p class="crumb">第 4 章 / 27 · 快速入门 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 4 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>一屏四块的终端界面</h1>
<p class="lede">进入全屏模式后，整个界面分四块：上面是可以滚动的对话记录，下面固定三行——忙碌指示、输入框、状态栏。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>布局像工单系统：上方是工单往来记录（你和助理的完整对话），下方是回复框和当前状态灯。键盘焦点在谁身上，谁的边框就发亮。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 300" role="img" aria-label="TUI 布局">
    <rect x="60" y="20" width="760" height="170" rx="14" fill="#f0f2f7" stroke="#c9cfdb" stroke-width="3"/>
    <text x="440" y="70" text-anchor="middle" font-size="16" fill="#5b6478">📜 对话记录区（可滚动）</text>
    <text x="150" y="105" font-size="15">🧑 “修一下登录 bug”</text>
    <text x="150" y="132" font-size="15" fill="#8b5cf6">🐹 在改 src/login.ts…</text>
    <text x="150" y="159" font-size="15" fill="#2fae6d">🐹 修好了，测试通过 ✅</text>
    <rect x="60" y="200" width="760" height="34" rx="8" fill="#eef4ff" stroke="#3b82f6" stroke-width="2"/>
    <text x="80" y="223" font-size="14" fill="#3b82f6">⌨️ 输入框（聚焦时发亮）_</text>
    <rect x="60" y="240" width="760" height="30" rx="8" fill="#f7f8fb" stroke="#c9cfdb" stroke-width="2"/>
    <text x="80" y="260" font-size="13" fill="#5b6478">📊 状态栏：模型 · 权限模式 · 会话</text>
  </svg>
  <p class="caption"><b>12 条斜杠命令</b>（<code>/help</code> <code>/new</code> <code>/model</code> <code>/compact</code>…）都是真功能，没有 TODO。<br>Ctrl+C 按两下的语义：第一下打断 AI，第二下才退出。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>启动后直接输入任务，回车发送<small>不需要任何斜杠前缀</small></p></div><div class="step"><span class="n">2</span><p>观察状态栏：当前模型、权限模式、会话<small>随时知道 AI 处于什么状态</small></p></div><div class="step"><span class="n">3</span><p>AI 干活中途想反悔？按一下 Ctrl+C<small>只打断当前动作，不退出程序</small></p></div><div class="step"><span class="n">4</span><p>想退出？空闲时再按一次 Ctrl+C<small>两段式设计防误触</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>12</b><span>条斜杠命令，全部真实可用</span></div><div class="stat"><b>3</b><span>行，底部固定区域</span></div><div class="stat"><b>2 次</b><span>Ctrl+C：先打断，再退出</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>斜杠命令包括 /help /new /resume /model /compact /sessions /mcp /agents 等。</li><li>输入框聚焦时边框亮蓝，失焦变灰——一眼判断键盘控制权。</li><li>对话记录区自动滚动到底部，支持翻页回看。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>忘 了命令怎么办？</dt><dd>输入 /help 随时查看全部 12 条命令的说明。</dd><dt>AI 响应很慢想换指示？</dt><dd>按一次 Ctrl+C 打断当前生成，直接输入新任务即可。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../04-jiao-hu-shi-tui-shi-yong-zhi-nan-kuai-jie-jian-shu-ru-yu-xie-gang-ming-ling.md">快捷键、输入与斜杠命令</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="24-liu-shi-tui-zu-cheng-zu-jian-shu-shi-jian-ying-she-yu-xian-shi-zhong-hui-gui-ze.html">第 24 章 · 界面内部如何渲染</a><a href="20-hui-hua-sheng-ming-zhou-qi-xin-jian-continue-mu-lu-pi-pei-yu-new-lun-huan.html">第 20 章 · 会话怎么新建和恢复</a></div>

<nav class="nav">
<a href="03-pei-zhi-ti-xi-config-json-huan-jing-bian-liang-yu-mi-yao-an-quan-guan-li.html">上一章：配置的三层叠叠乐 ←</a>
<a href="index.html">返回目录</a>
<a href="05-ci-xing-mo-shi-p-wu-tou-yun-xing-yu-quan-xian-mo-ren-ju-jue-yu-yi.html">下一章：干完就跑的无头模式 →</a>
</nav>
<footer>TinyCode 图解精读 · 4 / 27</footer>
</div></body></html>
`;export{n as default};
