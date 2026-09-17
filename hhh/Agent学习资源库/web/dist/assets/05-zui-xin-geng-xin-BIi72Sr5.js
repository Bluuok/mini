const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 5 章 · 最新更新与版本演进 · Craft Agents 图解精读</title>
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
<p class="crumb">第 5 章 / 23 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 5 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>最新更新与版本演进</h1>
<p class="lede">约五周（2026 年 3 月初到 4 月中）连发 15 个版本，从 v0.7.2 跑到 v0.8.5——看懂这三段旅程，就看懂了这个项目的战略方向。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一家餐厅五周换了一轮全部门面：前两周猛添灶台——什么菜系的外卖平台都能接进来（多供应商、自定义端点、Bedrock）；中间两周打通堂食外卖和三公里配送（WebUI、Docker、移动端适配）；最后一周给菜单配上各国语言并擦亮桌椅（i18n、OAuth 加固、UX 修复）。灶还是那口灶（Claude Agent SDK 内核），但客人已经从「进店吃饭」扩展到「在家点单」。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="版本列车三个阶段"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="20" y="62" width="252" height="108" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="146" y="98" text-anchor="middle" font-size="22">🔌🧩</text>
<text x="146" y="128" text-anchor="middle" font-size="14.5" font-weight="700">阶段一 供应商扩展</text>
<text x="146" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">v0.7.2–v0.7.12 · Pi SDK 作通用后端</text>
<rect x="306" y="62" width="268" height="108" rx="14" fill="#f3effe" stroke="#7C5CFC" stroke-width="3"/>
<text x="440" y="98" text-anchor="middle" font-size="22">🌐📱</text>
<text x="440" y="128" text-anchor="middle" font-size="14.5" font-weight="700">阶段二 远程与 Web</text>
<text x="440" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">v0.8.0–v0.8.3 · 从纯桌面走向跨平台</text>
<rect x="608" y="62" width="252" height="108" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="734" y="98" text-anchor="middle" font-size="22">🌍✨</text>
<text x="734" y="128" text-anchor="middle" font-size="14.5" font-weight="700">阶段三 本地化与打磨</text>
<text x="734" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">v0.8.4–v0.8.5 · 单语言转向多语言</text>
<line x1="274" y1="116" x2="302" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="576" y1="116" x2="604" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
</svg>
<p class="caption">每一次发布都带实质变更；0.7.x → 0.8.x 的跨越标志着架构野心的升级。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>v0.7.x 清扫供应商接入门槛：自定义 OpenAI 兼容端点走 Pi SDK 的 registerProvider 进来<small>v0.7.6 修掉 customEndpoint 重启后被静默丢弃的老毛病（issue #413）；v0.7.12 把 Bedrock 模型 ID 标准化成 us.anthropic.claude-*</small></p></div><div class="step"><span class="n">2</span><p>v0.7.5 连基础管道一起铺：HTTP/HTTPS 代理（支持 NO_PROXY 绕过）加 Webhook 自动化动作<small>指数退避重试、响应捕获都齐了；v0.7.7 再送上一套 5 级思考系统</small></p></div><div class="step"><span class="n">3</span><p>v0.8.0 是最大一跳——「WebUI 版本」让应用变成平台<small>混合本地/远程传输、多个远程工作区选择器、无头服务器同端口提供浏览器 WebUI、移动端 1.3 倍触摸目标缩放</small></p></div><div class="step"><span class="n">4</span><p>v0.8.1–v0.8.3 集中加固安全面<small>jose 替掉手写 JWT、argon2id 哈希密码、认证端点全局限流；会话还拿到自我管理工具（set_session_labels 等），自动关闭工作流由此成为可能</small></p></div><div class="step"><span class="n">5</span><p>v0.8.5 冲线：全套 i18n 加 Pi SDK 大版本升级<small>英/西/简中/日四种语言、1050+ 翻译字符串；Pi SDK 0.56.2→0.66.1 带来 GLM 5、MiniMax 2.7 模型支持</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>15</b><span>个版本在约五周内发布</span></div><div class="stat"><b>1050+</b><span>条翻译字符串覆盖四种界面语言</span></div><div class="stat"><b>5级</b><span>思考强度档位：关闭/低/中/高/最高</span></div><div class="stat"><b>0.66.1</b><span>Pi SDK 升级落点（从 0.56.2）</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>本地化不是手工堆翻译：规范化的语言环境注册表让加新语言只需改一个文件；pre-commit 钩子拦截硬编码英文，一致性测试保证四语同步。</li>
<li>Pi SDK 是整个架构的枢纽，几乎供应商相关能力都经它路由；社区也点名了代价——动态上下文每轮进系统提示词，可能击穿提示词缓存、抬高 token 开销（issue #434）。</li>
<li>已知限制：无论界面选哪种语言，无头服务器的响应仍是英语；按客户端的语言支持排在了未来版本。</li>
<li>仓库里定期出现「Sync from internal repository」提交——开源仓库是私有 monorepo 的下游镜像，提交历史并不等于真实开发顺序。</li>
<li>值得盯的未决问题：macOS 无窗口启动可用临时招 rm ~/.craft-agent/.server.lock 绕过；PWA 只差一个 Service Worker（约七成就绪）。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>更新这么猛，质量会不会被牺牲？</dt><dd>回归确实存在：Windows 打包版缺了 DevTools 菜单项（issue #521）、Win11 全新安装界面破损（#519）。但 CI 每次推送都跑 Validate，回归大多很快修复。它的边界在于：高速迭代并不承诺三大平台体验时刻对齐——未解决议题数仍在涨。</dd><dt>新功能请求一般多久落地？</dt><dd>快的惊人：中文支持请求（#510/#520）提出后数天便随 v0.8.5 兑现；MiniMax 2.7（#513）四月八日提出、同样搭上这班 SDK 升级的车。但具体看优先级，不能当 SLA 用。</dd>
<dt>这些版本号里藏着什么「未来预告」？</dt><dd>Docker 从基础构建（v0.7.12）到内置 WebUI 的 compose（v0.8.1）再到多架构 CI（v0.8.3），说明自托管团队部署已是核心场景；不过它也不能替你预知路线图——未决 issue（如 PWA 支持）才是最好的风向标。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../最新更新_lukilabs_craft-agents-oss/最新更新_lukilabs_craft-agents-oss.md">最新更新：15 个版本的演进拆解</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="04-yi-jian-an-zhuang.html">第 4 章 · 一键安装脚本</a><a href="06-wen-ti-fan-kui.html">第 6 章 · 问题反馈与协作</a></div>

<nav class="nav">
<a href="04-yi-jian-an-zhuang.html">← 上一章：一行命令四道关</a>
<a href="06-wen-ti-fan-kui.html">下一章：问题反馈与协作 →</a>
</nav>
<footer>Craft Agents 图解精读 · 5 / 23</footer>
</div></body></html>
`;export{n as default};
