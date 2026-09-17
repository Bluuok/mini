const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 27 章 · 前端架构与页面路由设计 · HappyClaw 图解精读</title>
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
<p class="crumb">第 27 章 / 30 · Web 前端 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 27 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>前端架构与页面路由设计</h1>
<p class="lede">除登录注册等少数公开页外，页面全部懒加载分包；一次教训曾让访问登录页也要背上 517KB gzip 的包袱——从此按路由开灯成为铁律。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一栋自助餐厅大厦：进门大厅（公开路由）免票进入；用餐区（受保护路由）先刷工牌过闸机（AuthGuard）；厨房按桌开火——哪桌点了菜（进了哪个路由）才开始做哪桌的菜。没人会把整场宴席提前做好堆在大堂里：曾经有家供应商把全部厨具（KaTeX + highlight.js 的渲染链）搬进了一楼大厅，结果每位只来问路的客人都得背着它们走路。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="三类路由与懒加载"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="30" y="55" width="230" height="120" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="145" y="92" text-anchor="middle" font-size="24">🚪🌴</text>
    <text x="145" y="122" text-anchor="middle" font-size="14.5" font-weight="700">公开路由 · 免票区</text>
    <text x="145" y="146" text-anchor="middle" font-size="13" fill="#5b6478">/login /register /setup</text>
    <rect x="300" y="55" width="260" height="120" rx="14" fill="#EFEAFE" stroke="var(--accent)" stroke-width="3"/>
    <text x="430" y="92" text-anchor="middle" font-size="24">🎫灯💡</text>
    <text x="430" y="122" text-anchor="middle" font-size="14.5" font-weight="700">AuthGuard + AppLayout</text>
    <text x="430" y="146" text-anchor="middle" font-size="13" fill="#5b6478">/chat /tasks /capabilities… 懒加载分包</text>
    <rect x="600" y="55" width="250" height="120" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="725" y="92" text-anchor="middle" font-size="24">↪️📋</text>
    <text x="725" y="122" text-anchor="middle" font-size="14.5" font-weight="700">重定向 · 信息架构收敛</text>
    <text x="725" y="146" text-anchor="middle" font-size="13" fill="#5b6478">/groups→/chat /skills→/capabilities/skills</text>
    <line x1="262" y1="115" x2="296" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="562" y1="115" x2="596" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">💡 路由单一事实来源是 App.tsx 的 createRoutesFromElements；iOS PWA standalone 下切换为 hash 路由，其余环境一律 createBrowserRouter。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>打开 /login 登录页<small>index.html 在 HTML 解析阶段就发出 api/auth/me 认证预热——省掉「等入口 JS 跑完才发认证请求」的一整跳串行 RTT</small></p></div><div class="step"><span class="n">2</span><p>那个教训是怎么来的<small>CapabilitiesPage 静态引入的 MarkdownRenderer → KaTeX + highlight.js 整条链曾被提升进入口 chunk（约 1.74MB 原始 / 517KB gzip），连登录页都要下载它；此后 Memory、Users、Monitor、Capabilities 全部改为懒加载</small></p></div><div class="step"><span class="n">3</span><p>命中聊天路由才提前开火<small>shouldPreloadChatRoute 只对 / 、/chat 与子路径触发 loadChatPage()；/chatty 这类前缀相似的路由不会误命中——判定矩阵有专门单元测试锁住</small></p></div><div class="step"><span class="n">4</span><p>子路径部署也照常工作<small>normalizeBasePath 把任意 VITE_BASE_PATH 归一化，REST、WebSocket URL 与 SPA 跳转共用同一套基准路径语义</small></p></div><div class="step"><span class="n">5</span><p>进了聊天页，流式数据谁说了算<small>run 栅栏：只有 runId 精确匹配的流式载荷才写入状态；首屏并发请求以 jid\\0before 为键去重合并</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>15 个</b><span>Zustand store 按领域拆分状态</span></div><div class="stat"><b>19 个</b><span>pages/ 页面级组件</span></div><div class="stat"><b>~488KB</b><span>xterm.js 终端包延迟到面板挂载才加载</span></div><div class="stat"><b>12 秒</b><span>认证检查超时上限，之后显示可操作错误卡片</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>桌面侧边栏是条件挂载而非 CSS 隐藏——移动端根本不渲染那棵含大量 DropdownMenu 的子树。</li><li>AppLayout 里建全局 WebSocket 连接：计费、监控这些非聊天页面同样能收到实时推送。</li><li>前端不独立部署：生产环境由主服务 Hono 直接托管 web/dist，「单进程多面」架构的自然延伸。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>一个 4,400 多行的 chat store，改一行会不会牵动全页？</dt><dd>风险被三条纪律压制：窄 selector 订阅避免流式输出触发的每帧重渲染、请求去重避免重复拉取、run 栅栏过滤迟到事件。但要说清它不保护什么——这些机制守住的是性能与流式正确性，不替代业务逻辑测试本身，路由预载规则就另有单元测试矩阵单独看管。</dd><dt>Service Worker 缓存呢？</dt><dd>已整体退役：sw.js 变成自毁式清理脚本，会话级缓存迁入 IndexedDB（每个会话子 Agent 持久化最近 100 条消息），manifest 仅保留供 iOS standalone 使用。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../27-qian-duan-jia-gou-yu-ye-mian-lu-you-she-ji.md">前端架构与页面路由设计</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="26-gua-zai-an-quan.html">第 26 章 · 挂载安全与文件校验</a><a href="28-shi-shi-xiao-xi-liu.html">第 28 章 · 实时消息流与渲染</a></div>

<nav class="nav">
<a href="26-gua-zai-an-quan.html">上一章：挂载安全与文件校验 ←</a>
<a href="index.html">返回目录</a>
<a href="28-shi-shi-xiao-xi-liu.html">下一章：实时消息流与渲染 →</a>
</nav>
<footer>HappyClaw 图解精读 · 27 / 30</footer>
</div></body></html>
`;export{t as default};
