const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 16 章 · 渲染器 UI 组件 · Craft Agents 图解精读</title>
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
<p class="crumb">第 16 章 / 23 · 桌面应用层 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 16 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>渲染器 UI 组件</h1>
<p class="lede">窗口里的一切都是 React 画的：侧栏只挂轻量索引卡，整本相册按需才取——流式再猛也晃不到列表。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一家百货商场：楼层索引牌（侧边栏）上只有小卡片——店名、营业状态、未读红点，绝不动辄抄下店里全部货品；顾客真进店了（点开会话），仓库再把完整商品按需送来。楼上还有一个广播台：现场发生什么实时喊给各柜台听。商场的核心纪律是「广播不惊动索引牌」——某个专柜里试衣间换装（消息流式更新），索引牌一个字都不改。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="轻元数据与懒加载分离"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="25" y="55" width="250" height="120" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="150" y="98" text-anchor="middle" font-size="24">🗂️🏷️</text>
    <text x="150" y="126" text-anchor="middle" font-size="14.5" font-weight="700">侧栏索引牌</text>
    <text x="150" y="149" text-anchor="middle" font-size="12.5" fill="#8a92a6">SessionMeta：无 messages，只留名字/时间/未读</text>
    <rect x="360" y="55" width="215" height="120" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="467" y="98" text-anchor="middle" font-size="24">📡🎬</text>
    <text x="467" y="126" text-anchor="middle" font-size="14.5" font-weight="700">事件处理器管道</text>
    <text x="467" y="149" text-anchor="middle" font-size="12.5" fill="#8a92a6">纯函数：事件 → 新状态 + 副作用单</text>
    <rect x="660" y="55" width="195" height="120" rx="14" fill="#eef1fb" stroke="#7C5CFC" stroke-width="3"/>
    <text x="757" y="98" text-anchor="middle" font-size="24">🪄📖</text>
    <text x="757" y="126" text-anchor="middle" font-size="14.5" font-weight="700">按需的完整会话</text>
    <text x="757" y="149" text-anchor="middle" font-size="12.5" fill="#8a92a6">sessionAtomFamily 单会话隔离更新</text>
    <line x1="275" y1="115" x2="356" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="575" y1="115" x2="656" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">关键设计：更新某会话的流式内容时，读索引牌的会话列表纹丝不动、绝不重绘。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>启动时先把 Provider 一节节串好：错误边界 → Jotai 状态库 → 主题系统<small>App 组件用 5 态状态机管生命周期：loading/onboarding/reauth/workspace-picker/ready</small></p></div><div class="step"><span class="n">2</span><p>主外壳其实已经渲染在闪屏下面了，数据就绪后闪屏做两段式淡出<small>splashExiting 走 CSS 过渡、splashHidden 才删节点，避免白屏闪烁</small></p></div><div class="step"><span class="n">3</span><p>你往回翻一段很长的对话，反向分页每次从底部补 20 个轮次<small>不必一次吞下全部历史</small></p></div><div class="step"><span class="n">4</span><p>Agent 边跑边推事件：权限请求弹卡、出错吐 Toast 都由副作用单分派<small>流式期间直接更新 atom；交接类事件（完成/出错/中断）才同步侧栏并触发通知</small></p></div><div class="step"><span class="n">5</span><p>你点了消息里的一个文件，覆盖层按类型选车接客<small>FilePreviewRenderer 分六路：图像/PDF/代码/Markdown/JSON 树/兜底代码查看器</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>20 轮</b><span>反向分页每次从底部加载的轮次数</span></div><div class="stat"><b>5000 个</b><span>单会话搜索高亮匹配的上限（CSS Highlight API）</span></div><div class="stat"><b>768px</b><span>视口窄于此值时侧边栏自动折叠</span></div><div class="stat"><b>5 种</b><span>滚动流之外的覆盖层：活动卡/多重差异/代码/终端/Markdown 预览</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>共享 UI 包 @craft-agent/ui 让 Electron 应用和网页版会话查看器共用同一套组件；PlatformProvider 注入平台能力，组件自己不知道跑在哪。</li>
<li>TurnCard 的展开/折叠偏好按会话持久化到 localStorage，重启应用也不丢。</li>
<li>快捷键走集中注册表 useAction()：macOS 显示 ⌘、其他平台显示 Ctrl，还能按条件启用或禁用。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>聊得越久状态越多，内存会不会被撑爆？</dt><dd>正是为了防这个才有「轻卡片」设计：SessionMeta 刻意排除 messages 数组、上下文里也不传原始 sessions 列表，避免闭包长期攥着完整消息；MemoizedMessageBubble 还会让非流式气泡在增量更新时跳过重渲染。边界要说清：这套设计防的是闭包泄漏和无谓重渲染，它不限制单条消息本身的体积。</dd>
<dt>为什么不用现成的路由库？</dt><dd>页面按 NavigationState 直接渲染在 MainContentPanel 内部，路由逻辑集中在 NavigationProvider——带历史栈和 ? 参数深链，五类导航各有类型守卫把关。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../渲染器_UI_组件_lukilabs_craft-agents-oss/渲染器_UI_组件_lukilabs_craft-agents-oss.md">渲染器 UI 组件</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="15-electron-zhu-jin-cheng.html">第 15 章 · Electron 主进程</a><a href="17-chuan-shu-rpc.html">第 17 章 · 传输与 RPC 层</a></div>

<nav class="nav">
<a href="15-electron-zhu-jin-cheng.html">上一章：Electron 主进程 ←</a>
<a href="index.html">返回目录</a>
<a href="17-chuan-shu-rpc.html">下一章：传输与 RPC 层 →</a>
</nav>
<footer>Craft Agents 图解精读 · 16 / 23</footer>
</div></body></html>
`;export{n as default};
