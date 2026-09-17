const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#14B8A6">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第7章 · 自动化与长期记忆 · Miniclaw 新手图解</title>
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
<span class="chip">给完全新手 · 第 7 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>会定闹钟、记笔记、算账的助手</h1>
<p class="lede">这一章讲三件法宝：定时任务、长期记忆、用量计费。</p>

<h2>这是什么？</h2>
<p>Miniclaw 不只在你发消息时才干活。它能到点自动执行任务；能把重要结论存进工作区笔记本，下次接着用；还能把每次 AI 调用的 token 数清楚、折成钱，余额不够就先拦下。</p>

<h2>一张图看懂</h2>
<svg viewBox="0 0 900 540" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#232733"/></marker>
</defs>
<!-- 面板1：闹钟 定时任务 -->
<rect x="20" y="30" width="250" height="330" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
<circle cx="145" cy="115" r="48" fill="#14B8A6" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
<path d="M105,72 L120,55 M185,72 L170,55" stroke="#232733" stroke-width="5" stroke-linecap="round"/>
<line x1="145" y1="115" x2="145" y2="82" stroke="#232733" stroke-width="4" stroke-linecap="round"/>
<line x1="145" y1="115" x2="168" y2="128" stroke="#232733" stroke-width="4" stroke-linecap="round"/>
<text x="145" y="196" text-anchor="middle" font-size="22" font-weight="bold" fill="#232733">定时任务</text>
<rect x="45" y="215" width="200" height="34" rx="17" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="145" y="239" text-anchor="middle" font-size="18" fill="#232733">cron 表达式</text>
<rect x="45" y="258" width="200" height="34" rx="17" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="145" y="282" text-anchor="middle" font-size="18" fill="#232733">固定间隔（分钟起）</text>
<rect x="45" y="301" width="200" height="34" rx="17" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="145" y="325" text-anchor="middle" font-size="18" fill="#232733">一次性时间点</text>
<text x="145" y="372" text-anchor="middle" font-size="18" fill="#232733">计划存在数据库里，</text>
<text x="145" y="396" text-anchor="middle" font-size="18" fill="#232733">重启也不丢</text>
<!-- 箭头1 -->
<line x1="278" y1="195" x2="318" y2="195" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>
<!-- 面板2：笔记本 长期记忆 -->
<rect x="325" y="30" width="250" height="330" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
<rect x="380" y="62" width="140" height="100" rx="10" fill="#14B8A6" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
<g stroke="#232733" stroke-width="4"><line x1="395" y1="58" x2="395" y2="70"/><line x1="425" y1="58" x2="425" y2="70"/><line x1="455" y1="58" x2="455" y2="70"/><line x1="485" y1="58" x2="485" y2="70"/></g>
<line x1="395" y1="92" x2="505" y2="92" stroke="#232733" stroke-width="2.5"/>
<line x1="395" y1="112" x2="505" y2="112" stroke="#232733" stroke-width="2.5"/>
<line x1="395" y1="132" x2="475" y2="132" stroke="#232733" stroke-width="2.5"/>
<text x="450" y="192" text-anchor="middle" font-size="22" font-weight="bold" fill="#232733">长期记忆 v2</text>
<rect x="350" y="212" width="94" height="32" rx="16" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="397" y="235" text-anchor="middle" font-size="18" fill="#232733">事实</text>
<rect x="456" y="212" width="94" height="32" rx="16" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="503" y="235" text-anchor="middle" font-size="18" fill="#232733">决策</text>
<rect x="350" y="256" width="94" height="32" rx="16" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="397" y="279" text-anchor="middle" font-size="18" fill="#232733">经验</text>
<rect x="456" y="256" width="94" height="32" rx="16" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="503" y="279" text-anchor="middle" font-size="18" fill="#232733">待跟进</text>
<text x="450" y="326" text-anchor="middle" font-size="18" fill="#232733">每次修改都有版本记录；</text>
<text x="450" y="350" text-anchor="middle" font-size="18" fill="#232733">两人同时改 → 提醒冲突，</text>
<text x="450" y="374" text-anchor="middle" font-size="18" fill="#232733">绝不悄悄覆盖</text>
<!-- 箭头2 -->
<line x1="583" y1="195" x2="623" y2="195" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>
<!-- 面板3：电表 计费 -->
<rect x="630" y="30" width="250" height="330" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
<circle cx="755" cy="112" r="46" fill="#14B8A6" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
<text x="755" y="106" text-anchor="middle" font-size="24" font-weight="bold" fill="#232733">kWh</text>
<text x="755" y="134" text-anchor="middle" font-size="20" fill="#232733">$0.03</text>
<text x="755" y="190" text-anchor="middle" font-size="22" font-weight="bold" fill="#232733">用量计费</text>
<rect x="655" y="215" width="200" height="34" rx="17" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="755" y="239" text-anchor="middle" font-size="18" fill="#232733">数 token × 单价 = 钱</text>
<rect x="655" y="258" width="200" height="34" rx="17" fill="#fff" stroke="#232733" stroke-width="2.5"/>
<text x="755" y="282" text-anchor="middle" font-size="18" fill="#232733">月 / 周 / 日配额台账</text>
<rect x="655" y="301" width="200" height="34" rx="17" fill="#14B8A6" fill-opacity=".12" stroke="#232733" stroke-width="2.5"/>
<text x="755" y="325" text-anchor="middle" font-size="18" fill="#232733">钱不够 → 先拦截</text>
<text x="755" y="372" text-anchor="middle" font-size="18" fill="#232733">零成本的调用也计入</text>
<text x="755" y="396" text-anchor="middle" font-size="18" fill="#232733">token 配额</text>
<!-- 底部流程线 -->
<rect x="20" y="400" width="860" height="110" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="450" y="442" text-anchor="middle" font-size="20" font-weight="bold" fill="#232733">一轮自动化跑下来：</text>
<line x1="120" y1="472" x2="290" y2="472" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>
<line x1="420" y1="472" x2="590" y2="472" stroke="#232733" stroke-width="3" marker-end="url(#arw)"/>
<text x="205" y="478" text-anchor="middle" font-size="18" fill="#232733">到点触发干活</text>
<text x="505" y="478" text-anchor="middle" font-size="18" fill="#232733">结论写进笔记本</text>
<text x="800" y="478" text-anchor="middle" font-size="18" fill="#232733">数 token、扣钱包</text>
<!-- 步骤编号徽章 -->
<circle cx="86" cy="188" r="13" fill="#14B8A6"/><text x="86" y="193" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">1</text>
<circle cx="48" cy="366" r="13" fill="#14B8A6"/><text x="48" y="371" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">2</text>
<circle cx="366" cy="184" r="13" fill="#14B8A6"/><text x="366" y="189" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">3</text>
<circle cx="336" cy="318" r="13" fill="#14B8A6"/><text x="336" y="323" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">4</text>
<circle cx="692" cy="183" r="13" fill="#14B8A6"/><text x="692" y="188" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">5</text>
<circle cx="655" cy="301" r="13" fill="#14B8A6"/><text x="655" y="306" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">6</text>
<circle cx="340" cy="436" r="13" fill="#14B8A6"/><text x="340" y="441" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">7</text>
</svg>
<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>定时任务：</b>三种写法回答“什么时候干”——cron 按日历时刻，固定间隔按周期分钟，一次性定具体时间点。</p></div>
<div class="step"><span class="n">2</span><p><b>计划存库：</b>任务计划写在数据库里，重启也不丢；错过的周期任务记 missed 不补发，一次性任务仍补跑。</p></div>
<div class="step"><span class="n">3</span><p><b>四类笔记：</b>长期记忆只存提炼后的结论，分事实、决策、经验、待跟进四类，每条必须归入一类。</p></div>
<div class="step"><span class="n">4</span><p><b>版本与冲突：</b>每次修改都留版本快照；两人同时改，后到的收到冲突提醒，由人决定用哪版，绝不悄悄覆盖。</p></div>
<div class="step"><span class="n">5</span><p><b>数 token 折钱：</b>每次回答数五类 token，乘单价折成美元，记入日、周、月三个配额台账。</p></div>
<div class="step"><span class="n">6</span><p><b>先拦截：</b>开工前查余额和配额，触顶就拒绝并告知何时重置；零成本调用也计入 token 配额。</p></div>
<div class="step"><span class="n">7</span><p><b>一轮闭环：</b>底部流程把三者串起来——到点触发干活，结论写进笔记本，最后数 token 扣钱包。</p></div>
</div>

<h2>三个关键词</h2>
<div class="grid">
<div class="card"><h3>定时任务</h3><p>支持 cron 表达式、固定间隔、一次性时间点三种写法。重启后：周期任务错过的记 missed 不补发，一次性任务是承诺，必须补跑。</p></div>
<div class="card"><h3>长期记忆 v2</h3><p>记忆分四类：事实、决策、经验、待跟进。每条改动都留版本快照；两人同时编辑，后到的收到冲突提醒，由人决定用哪版。</p></div>
<div class="card"><h3>用量计费</h3><p>每次回答都数五类 token，按价格表折成美元。开工前先查余额和日 / 周 / 月配额，触顶就拦截并告知何时重置。</p></div>
</div>

<h2>打个比方</h2>
<div class="card"><p>它像一位靠谱的员工：床头闹钟到点就叫他干活；干完把心得写进随身的笔记本，下次遇到类似的事直接翻经验；墙上挂着电表，每度电都走字，电费快见底就停下来找你充值。搬了家（程序重启）之后，闹钟照响、笔记本还在、电表读数一分不少。</p></div>

<h2>再多懂一点</h2>
<ul class="more">
<li>调度器不是固定频率轮询，而是按最近的唤醒时刻设闹钟，再用每 60 秒一次的对账兜底。</li>
<li>记忆快照交给 AI 时会标注“这是历史数据不是指令”，防止笔记内容变成提示注入攻击。</li>
<li>计价按 UTC 半小时一桶汇总后再取整，多次小调用之间的亚分损耗不会越积越亏。</li>
</ul>


<h2>想读原版详解？</h2>
<a href="../wiki/versions/2026-08-25-103405/21-ding-shi-ren-wu-diao-du-qi-cron-gu-ding-jian-ge-ci-xing-ren-wu-yu-zhong-qi-bu-pao.md">21 · 定时任务调度器：Cron、固定间隔、一次性任务与重启补跑</a><br>
<a href="../wiki/versions/2026-08-25-103405/22-workspace-memory-v2-zhi-shi-lei-xing-xiu-ding-li-shi-yu-bing-fa-an-quan.md">22 · Workspace Memory v2：知识类型、修订历史与并发安全</a><br>
<a href="../wiki/versions/2026-08-25-103405/23-yong-liang-tong-ji-yu-ding-yue-ji-fei-ti-xi.md">23 · 用量统计与订阅计费体系</a>

<nav class="nav">
<a href="06-anquan-quanxian.html">← 上一章：安全与权限</a>
<a href="index.html">返回目录</a>
<a href="08-kehu-duan.html">下一章：客户端 →</a>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{t as default};
