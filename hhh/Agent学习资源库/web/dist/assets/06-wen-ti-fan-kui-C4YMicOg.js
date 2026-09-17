const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 6 章 · 问题反馈与社区协作 · Craft Agents 图解精读</title>
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
<p class="crumb">第 6 章 / 23 · 概览 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 6 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>问题反馈与社区协作</h1>
<p class="lede">182 个开放、193 个已关闭议题（截至 2026 年 4 月中）是一张不断重绘的实况地图——会读的人既能快速自救，也能看清项目的脾气。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像一家医院的病历本：有些病人自己就懂医——不但描述症状，还写明病灶在第几节脊椎（源码位置）和自愈偏方，医生看一眼就能确诊；有些只是喊疼却给不出线索。同一个项目每两三天发一个新版，等于病历本被反复重写：旧病好了，新药带来了新副作用。读它比读广告真实得多。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="好报告的三段式路径"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="20" y="62" width="252" height="108" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="146" y="98" text-anchor="middle" font-size="22">🐞🔍</text>
<text x="146" y="128" text-anchor="middle" font-size="14.5" font-weight="700">复现 + 定位到文件</text>
<text x="146" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">#522 顺藤摸到 before-quit 处理器</text>
<rect x="306" y="62" width="268" height="108" rx="14" fill="#f3effe" stroke="#7C5CFC" stroke-width="3"/>
<text x="440" y="98" text-anchor="middle" font-size="22">🧠📋</text>
<text x="440" y="128" text-anchor="middle" font-size="14.5" font-weight="700">给出根因链 + 偏方</text>
<text x="440" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">锁文件没释放 → rm ~/.craft-agent/.server.lock</text>
<rect x="608" y="62" width="252" height="108" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="734" y="98" text-anchor="middle" font-size="22">🚂✅</text>
<text x="734" y="128" text-anchor="middle" font-size="14.5" font-weight="700">搭上版本列车</text>
<text x="734" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">每 2–3 天一班的修复节奏</text>
<line x1="274" y1="116" x2="302" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="576" y1="116" x2="604" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
</svg>
<p class="caption">最好的报告是「症状 → 病灶 → 偏方」三件套，维护者照单抓药。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>撞上问题先搜已关闭议题——193 个案例可能是现成答案<small>项目每 2–3 天发一版，很多坑前一班车已经填了</small></p></div><div class="step"><span class="n">2</span><p>学学 #522 的写法：不止步于「应用打不开」<small>报告者追到 before-quit 没挂 instance.stop() 导致锁文件永存、PID 检测易被重用误导，还附上 rm ~/.craft-agent/.server.lock 的临时解法</small></p></div><div class="step"><span class="n">3</span><p>功能请求同样有市场<small>#510「能否添加中文语言选项」提出约三天后随 v0.8.5 落地；数据可见性（#143 实时 token 用量显示）这类请求也在排队</small></p></div><div class="step"><span class="n">4</span><p>安全漏洞别直接开公开 issue<small>SECURITY.md 规定先发 security@craft.do，48 小时确认窗口、关键问题 30 天时限；曾有报告因 24 小时未获确认才转公开引发讨论</small></p></div><div class="step"><span class="n">5</span><p>Windows/Linux 用户先对号入座再发问<small>功能多在 macOS 上先行开发测试；#496 粘贴图片失败、#461 Wayland 暗色模式发灰等平台特供坑都有现成记录</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>182</b><span>个未解决议题（且随新功能攀升）</span></div><div class="stat"><b>193</b><span>个已关闭议题可当检索库用</span></div><div class="stat"><b>48小时</b><span>安全披露的确认承诺窗口</span></div><div class="stat"><b>40% vs 9%</b><span>#434：同任务耗掉 Claude Pro 配额对比 Claude Code</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>最重要的架构反馈来自 #434：Pi 后端把时间戳、会话状态等动态内容拼进系统提示词前缀，破坏 Anthropic 提示词缓存——41k token 可见上下文的任务单轮吃掉约四成配额。v0.7.8 的扩展缓存（TTL 一小时）只是止血。</li><li>摩擦地图三大高地：macOS 锁文件无声失败、Windows UI 回归与 DevTools 缺失、Linux/Wayland 暗色模式名不副实（macOS 专用的透明毛玻璃逻辑漏到了 Linux）。</li><li>自定义供应商端点仍是软肋：自动化弹窗硬编码 model:"sonnet"、自定义模型收不到图片等坑在 #514/#525 有详细分析，走 pi_compat 端点请重点测自动化与图片流程。</li><li>供应链倒是下过功夫：trustedDependencies 白名单、CI 强制 --frozen-lockfile、本地 MCP 子进程过滤 ANTHROPIC_API_KEY 等凭证。</li>
<li>这潭水也很活：中文支持、AWS 命名配置文件、OAuth 客户端密钥、复古终端主题等 PR（#516/#517/#507/#482）持续涌进；甚至还有 Copilot 代码审查在审 AI 项目——颇有些套娃式的实用。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>把安全问题公开挂出来，会不会让所有用户陷入险境？</dt><dd>这正是要按流程走的原因：SECURITY.md 明确敏感披露应先私下联系 security@craft.do，48 小时确认、关键问题 30 天处理——有序的私聊+公告能保护等待补丁的大多数用户。但它也不保护什么：流程管不了别人在你打补丁前利用旧版本漏洞，也拦不住像 #142 那样确认超时后被迫公开的争议情形。</dd><dt>提了 issue 到底有人理吗？</dt><dd>多数反馈响应积极：i18n 三天兑现、模型支持搭车 SDK 升级解决；但平台类 bug 可能挂着数周（Linux 暗色模式开放三周）。预期要对表维护者的优先级，而不是空等道歉。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../问题与反馈_lukilabs_craft-agents-oss/问题与反馈_lukilabs_craft-agents-oss.md">问题与反馈：议题区的完整摸底</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="05-zui-xin-geng-xin.html">第 5 章 · 最新更新与演进</a><a href="07-guan-yu-gong-xian-zhe.html">第 7 章 · 贡献者与维护模式</a></div>

<nav class="nav">
<a href="05-zui-xin-geng-xin.html">← 上一章：五周五班快车</a>
<a href="07-guan-yu-gong-xian-zhe.html">下一章：贡献者与维护模式 →</a>
</nav>
<footer>Craft Agents 图解精读 · 6 / 23</footer>
</div></body></html>
`;export{n as default};
