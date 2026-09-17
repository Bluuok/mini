const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#F59E0B">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第1章 · 入门指南 · Miniclaw 新手图解</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#FFF9F0;color:#232733;line-height:1.7;font-size:17px}
.wrap{max-width:960px;margin:0 auto;padding:36px 28px}
.kicker{letter-spacing:.2em;color:var(--accent);font-weight:700;font-size:15px}
h1{font-size:34px;line-height:1.2;margin:10px 0 8px}
.lede{font-size:18px;color:#5A6072;margin-bottom:28px}
h2{font-size:23px;margin:34px 0 8px}
.card{background:#fff;border:2.5px solid #232733;border-radius:18px;box-shadow:6px 6px 0 rgba(35,39,51,.10);padding:20px;margin:20px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.card h3{font-size:19px;margin-bottom:5px}
.card p{font-size:16.5px;color:#4A5060}
.chip{display:inline-block;border:3px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 16px;font-weight:700}
svg{width:100%;height:auto;display:block;margin:16px 0}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:46px;font-weight:700;font-size:16px}
a{color:var(--accent)}
footer{margin-top:44px;color:#8A8F9E;font-size:14px;text-align:center}
.walk h3{font-size:19px;margin:22px 0 4px}
.step{display:flex;gap:12px;margin:14px 0;align-items:flex-start}
.step .n{flex:0 0 34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px}
.step p{font-size:16.5px;color:#3A3F4E}
.more{padding-left:24px}
.more li{margin:9px 0;font-size:16.5px;color:#3A3F4E}
</style></head>
<body><div class="wrap">
<span class="chip">给完全新手 · 第 1 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>入门指南</h1>
<p class="lede">Miniclaw 是放在你自己服务器上的「AI 管家」：你在微信、Telegram 这些聊天软件里发话，它就帮你干活。</p>

<h2>这是什么？</h2>
<p>Miniclaw 的官方定义是「自托管的多渠道智能体工作台」。「自托管」是数据都放在你自己的机器上，不交给别人保管；「多渠道」是同一个 AI 助手能同时从网页和微信、Telegram、飞书等七种聊天软件找到。</p>
<p>真正干活的是现成的引擎——Pi Agent Runtime 智能体运行时。Miniclaw 负责组装：管账号、数据和消息渠道，再让 AI 在隔离工作区里安全干活。</p>

<h2>一张图看懂</h2>
<div class="card">
<svg viewBox="0 0 900 470" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#232733"/></marker>
</defs>
<g font-family="-apple-system,'PingFang SC','Microsoft YaHei',sans-serif">
<rect x="30" y="60" width="180" height="120" rx="14" stroke="#232733" stroke-width="3" fill="#FEF3D7"/>
<text x="120" y="100" text-anchor="middle" font-size="20" fill="#232733" font-weight="bold">① 克隆代码</text>
<text x="120" y="135" text-anchor="middle" font-size="18" fill="#232733">git clone</text>
<text x="120" y="162" text-anchor="middle" font-size="18" fill="#232733">把项目搬回家</text>
<rect x="270" y="60" width="180" height="120" rx="14" stroke="#232733" stroke-width="3" fill="#FEF3D7"/>
<text x="360" y="100" text-anchor="middle" font-size="20" fill="#232733" font-weight="bold">② 配置</text>
<text x="360" y="135" text-anchor="middle" font-size="18" fill="#232733">make install</text>
<text x="360" y="162" text-anchor="middle" font-size="18" fill="#232733">装好依赖和工具</text>
<rect x="510" y="60" width="180" height="120" rx="14" stroke="#232733" stroke-width="3" fill="#FEF3D7"/>
<text x="600" y="100" text-anchor="middle" font-size="20" fill="#232733" font-weight="bold">③ 启动</text>
<text x="600" y="135" text-anchor="middle" font-size="18" fill="#232733">make dev</text>
<text x="600" y="162" text-anchor="middle" font-size="18" fill="#232733">一条命令全拉起</text>
<rect x="750" y="60" width="130" height="120" rx="14" stroke="#232733" stroke-width="3" fill="#FEF3D7"/>
<text x="815" y="100" text-anchor="middle" font-size="20" fill="#232733" font-weight="bold">④ 对话</text>
<text x="815" y="135" text-anchor="middle" font-size="18" fill="#232733">浏览器或</text>
<text x="815" y="162" text-anchor="middle" font-size="18" fill="#232733">聊天软件里说</text>
<line x1="210" y1="120" x2="266" y2="120" stroke="#232733" stroke-width="3" marker-end="url(#arr)"/>
<line x1="450" y1="120" x2="506" y2="120" stroke="#232733" stroke-width="3" marker-end="url(#arr)"/>
<line x1="690" y1="120" x2="746" y2="120" stroke="#232733" stroke-width="3" marker-end="url(#arr)"/>
<rect x="90" y="290" width="330" height="110" rx="14" stroke="#232733" stroke-width="3" fill="#fff"/>
<text x="255" y="333" text-anchor="middle" font-size="19" fill="#232733">浏览器打开 localhost:5173</text>
<text x="255" y="365" text-anchor="middle" font-size="18" fill="#232733">首次进入会引导你创建管理员</text>
<line x1="815" y1="180" x2="500" y2="285" stroke="#232733" stroke-width="3" marker-end="url(#arr)"/>
<rect x="480" y="290" width="340" height="110" rx="14" stroke="#232733" stroke-width="3" fill="rgba(245,158,11,.12)"/>
<text x="650" y="333" text-anchor="middle" font-size="19" fill="#232733">AI 管家开始干活</text>
<text x="650" y="365" text-anchor="middle" font-size="18" fill="#232733">在你专属的隔离工作区里读写文件</text>
<line x1="420" y1="345" x2="474" y2="345" stroke="#232733" stroke-width="3" marker-end="url(#arr)"/>
<circle cx="105" cy="305" r="13" fill="#F59E0B"/>
<text x="105" y="310" text-anchor="middle" font-size="15" fill="#fff" font-weight="bold">5</text>
</g>
</svg>
<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>① 克隆代码：</b>git clone 把整个项目搬回你的电脑，相当于把「AI 管家」请进家门。</p></div>
<div class="step"><span class="n">2</span><p><b>② 配置：</b>make install 装好三处依赖和内置技能包，并编译 Runner——管家上岗前先受训。</p></div>
<div class="step"><span class="n">3</span><p><b>③ 启动：</b>make dev 自己检查缺什么就补什么，然后同时拉起后端（3000）和网页前端（5173）。</p></div>
<div class="step"><span class="n">4</span><p><b>④ 对话：</b>在网页或微信、Telegram 等聊天软件里说一句话，任务就派出去了。</p></div>
<div class="step"><span class="n">5</span><p><b>⑤ 首次初始化：</b>第一次打开 localhost:5173 不是登录页，而是向导：设好管理员账号密码才能进工作台。</p></div>
<div class="step"><span class="n">6</span><p><b>⑥ 隔离干活：</b>AI 只在你专属的隔离工作区里读写文件，动不了你的其他目录。</p></div>
</div>
</div>
<p>前三步各只需一条命令。\`make dev\` 会自己检查缺什么、补什么，最后同时启动后端（3000 端口）和网页前端（5173 端口）。没装 Docker 也不要紧，会自动跳过这一步。</p>

<h2>三个关键词</h2>
<div class="grid">
<div class="card">
<h3>自托管</h3>
<p>系统跑在你自己的机器上，数据不出门，不用申请任何 API Key 就能跑起来。</p>
</div>
<div class="card">
<h3>多渠道</h3>
<p>同一个 AI 助手能从七个渠道找到：飞书、Telegram、微信、QQ、钉钉、Discord、WhatsApp，外加网页和桌面端。</p>
</div>
<div class="card">
<h3>Pi Agent Runtime</h3>
<p>真正执行任务的引擎。Miniclaw 负责调度和安全边界，脏活累活由它干。</p>
</div>
</div>

<h2>打个比方</h2>
<div class="card">
<p>Miniclaw 像你雇的住家管家：房子是你自己的（自托管），钥匙和数据不出门。管家会七国语言（多渠道），你在哪个聊天软件喊他都听得见。他背后还有一支专业施工队（Pi 引擎），你说「收拾这个房间」，他就派队伍进去干活——别的房间进不去。</p>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>真正干活的引擎 Pi Agent Runtime 是现成的第三方运行时，Miniclaw 不重造轮子，只负责组装账号、数据与渠道。</li>
<li>创建管理员的接口只在系统里一个用户都没有时才生效，重复调用直接被拒绝，不怕被人抢先注册。</li>
<li>Docker 是可选项，只用来隔离 AI 的执行环境；没装也行，系统会自动改用宿主机模式跑 Agent。</li>
</ul>

<h2>想读原版详解？</h2>
<a href="../wiki/versions/2026-08-25-103405/1-xiang-mu-gai-lan-miniclaw-shi-shi-yao.md">项目概览：Miniclaw 是什么</a><br>
<a href="../wiki/versions/2026-08-25-103405/2-kuai-su-kai-shi-cong-ke-long-dao-jian-qi-dong.md">快速开始：从克隆到一键启动</a><br>
<a href="../wiki/versions/2026-08-25-103405/3-kai-fa-gong-zuo-liu-yu-chang-yong-ming-ling-su-cha.md">开发工作流与常用命令速查</a>

<nav class="nav">
<span style="opacity:.4">已是第一章</span>
<a href="index.html">返回目录</a>
<a href="02-hexin-jiagou.html">下一章：核心架构 →</a>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{n as default};
