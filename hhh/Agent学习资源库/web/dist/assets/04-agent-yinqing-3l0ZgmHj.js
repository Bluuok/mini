const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#8B5CF6">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第4章 · Agent 执行引擎 · Miniclaw 新手图解</title>
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
<span class="chip">给完全新手 · 第 4 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>Agent 执行引擎</h1>
<p class="lede">AI 不是凭空干活的：每条消息都要走一遍「排队 → 启动 → 喂料 → 回话」的流水线。</p>

<h2>这是什么？</h2>
<p>Miniclaw 里真正动手干活的「员工」叫 <b>Runner</b>——一个独立的小程序。你发的每条消息都会被排好队，交给一个 Runner，再把提示词喂给它；它一边干活一边把结果一帧帧报回来。</p>

<h2>一张图看懂</h2>
<div class="card" style="padding:14px">
<svg viewBox="0 0 900 520" role="img" aria-label="任务排队到流式回传的执行管线">
<defs>
<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#232733"/></marker>
<marker id="arv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#8B5CF6"/></marker>
</defs>

<!-- top row -->
<rect x="30" y="50" width="150" height="95" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="105" y="92" font-size="19" fill="#232733" text-anchor="middle" font-weight="bold">① 你发消息</text>
<text x="105" y="122" font-size="18" fill="#232733" text-anchor="middle">来自飞书、Web 等</text>

<rect x="235" y="50" width="185" height="95" rx="14" fill="#8B5CF6" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
<text x="327" y="82" font-size="19" fill="#232733" text-anchor="middle" font-weight="bold">② 排队等待</text>
<text x="327" y="112" font-size="18" fill="#232733" text-anchor="middle">同一会话</text>
<text x="327" y="136" font-size="18" fill="#232733" text-anchor="middle">一次只跑一个</text>

<rect x="470" y="50" width="175" height="95" rx="14" fill="#8B5CF6" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
<text x="557" y="80" font-size="19" fill="#232733" text-anchor="middle" font-weight="bold">③ 启动 Runner</text>
<rect x="485" y="94" width="145" height="22" rx="11" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="557" y="111" font-size="17" fill="#232733" text-anchor="middle">Docker 容器（隔离）</text>
<rect x="485" y="120" width="145" height="22" rx="11" fill="#fff" stroke="#232733" stroke-width="2"/>
<text x="557" y="137" font-size="17" fill="#232733" text-anchor="middle">宿主机子进程（快）</text>

<rect x="695" y="50" width="175" height="95" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="782" y="78" font-size="19" fill="#232733" text-anchor="middle" font-weight="bold">④ 喂 Prompt</text>
<text x="782" y="103" font-size="17" fill="#232733" text-anchor="middle">stdin 一次性 JSON</text>
<text x="782" y="128" font-size="17" fill="#232733" text-anchor="middle">四段拼装：</text>

<!-- four prompt segments -->
<g font-size="16" fill="#232733" text-anchor="middle" font-weight="bold">
<rect x="697" y="168" width="86" height="30" rx="8" fill="#8B5CF6" fill-opacity=".12" stroke="#232733" stroke-width="2"/><text x="740" y="189">IDENTITY</text>
<rect x="791" y="168" width="77" height="30" rx="8" fill="#fff" stroke="#232733" stroke-width="2"/><text x="829" y="189">SOUL</text>
</g>

<!-- down arrow on right -->
<path d="M782,205 L782,255" stroke="#8B5CF6" stroke-width="3" fill="none" marker-end="url(#arv)"/>

<!-- middle row: streaming output -->
<rect x="500" y="260" width="370" height="85" rx="14" fill="#8B5CF6" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
<text x="685" y="295" font-size="19" fill="#232733" text-anchor="middle" font-weight="bold">⑤ 边干边说（流式回传）</text>
<text x="685" y="325" font-size="18" fill="#232733" text-anchor="middle">stdout 上的「帧」：想一句、报一句</text>

<!-- AGENTS TOOLS labels near segment row -->
<text x="700" y="222" font-size="16" fill="#5A6072" text-anchor="middle">我是谁 · 我信什么 · 我怎么做 · 我用什么</text>

<path d="M495,302 L400,302" stroke="#232733" stroke-width="3" fill="none" marker-end="url(#ar)"/>

<rect x="170" y="260" width="225" height="85" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="282" y="295" font-size="19" fill="#232733" text-anchor="middle" font-weight="bold">⑥ 回复送到你手上</text>
<text x="282" y="325" font-size="18" fill="#232733" text-anchor="middle">逐帧解析，不会听岔</text>

<!-- arrows into warm zone -->
<path d="M685,350 L685,395" stroke="#8B5CF6" stroke-width="3" stroke-dasharray="7 6" fill="none" marker-end="url(#arv)"/>
<text x="700" y="382" font-size="17" fill="#8B5CF6">答完不关门，原地待命</text>

<!-- warm runner zone -->
<rect x="30" y="400" width="400" height="95" rx="14" fill="#8B5CF6" fill-opacity=".12" stroke="#232733" stroke-width="3"/>
<text x="230" y="432" font-size="19" fill="#232733" text-anchor="middle" font-weight="bold">⑦ 暖 Runner 待命</text>
<text x="230" y="462" font-size="18" fill="#232733" text-anchor="middle">新消息经共享文件夹直接塞进去</text>
<text x="230" y="486" font-size="18" fill="#232733" text-anchor="middle">不用重新启动</text>

<!-- stuck recovery zone -->
<rect x="470" y="400" width="400" height="95" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="670" y="430" font-size="19" fill="#232733" text-anchor="middle" font-weight="bold">⑧ 卡了怎么办？</text>
<text x="670" y="460" font-size="18" fill="#232733" text-anchor="middle">沉默太久 → 先看 CPU 在不在干活</text>
<text x="670" y="484" font-size="18" fill="#232733" text-anchor="middle">再核对身份 → 确认真的死了才重启</text>

<!-- sentinel remote control -->
<path d="M470,447 L435,447" stroke="#8B5CF6" stroke-width="3" stroke-dasharray="7 6" fill="none" marker-end="url(#arv)"/>
<text x="452" y="436" font-size="16" fill="#8B5CF6" text-anchor="middle">哨兵文件遥控</text>

<!-- top row arrows -->
<path d="M182,97 L228,97" stroke="#232733" stroke-width="3" fill="none" marker-end="url(#ar)"/>
<path d="M422,97 L463,97" stroke="#232733" stroke-width="3" fill="none" marker-end="url(#ar)"/>
<path d="M647,97 L688,97" stroke="#232733" stroke-width="3" fill="none" marker-end="url(#ar)"/>

<!-- loop back from warm zone to queue -->
<path d="M115,395 L115,152" stroke="#8B5CF6" stroke-width="3" stroke-dasharray="7 6" fill="none" marker-end="url(#arv)"/>
<text x="98" y="290" font-size="17" fill="#8B5CF6" transform="rotate(-90 98 290)" text-anchor="middle">下一句继续聊</text>
</svg>
<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>① 你发消息：</b>来自飞书、Web 等渠道的消息先落进主进程，按会话归位，这是整条流水线的入口。</p></div>
<div class="step"><span class="n">2</span><p><b>② 排队等待：</b>同一会话一次只跑一个 Runner，免得两个回复打架；共用同一工作区的兄弟渠道也排同一条队。</p></div>
<div class="step"><span class="n">3</span><p><b>③ 启动 Runner：</b>容器模式用一次性 Docker，隔离干净、总量有上限；Host 模式直接起子进程，快但只留给管理员。</p></div>
<div class="step"><span class="n">4</span><p><b>④ 喂 Prompt：</b>任务连同凭证经 stdin 一次性写成 JSON 直到关闭——管道只适合单向流，后续输入改走文件通道。</p></div>
<div class="step"><span class="n">5</span><p><b>⑤ 边干边说：</b>结果包在标记帧里写上 stdout，一帧一件事；主进程按括号配对找帧尾，正文里出现同款标记也不怕。</p></div>
<div class="step"><span class="n">6</span><p><b>⑥ 回复送到你手上：</b>每帧都带着回合编号，主进程据此归属输出、拒收迟到的旧尝试，不会把两轮话混在一起。</p></div>
<div class="step"><span class="n">7</span><p><b>⑦ 暖 Runner 待命：</b>答完不关进程；新消息经共享文件夹直接塞进正在运行的进程，跳过冷启动，闲置超时才优雅回收。</p></div>
<div class="step"><span class="n">8</span><p><b>⑧ 卡了怎么办：</b>沉默太久先探 CPU（只有 Host 进程探得到），再核对代数与进程号的身份指纹，确认真死了才重启。</p></div>
</div>
</div>

<h2>三个关键词</h2>
<div class="grid">
<div class="card"><h3>双执行模式</h3><p>Runner 可以装进一次性的 Docker 容器里跑（隔离干净、总数有上限），也可以直接在宿主机上当子进程跑（零等待、但只留给管理员）。</p></div>
<div class="card"><h3>四段 Prompt</h3><p>每个 Agent 的提示词固定切成四段：IDENTITY（我是谁）、SOUL（我信什么）、AGENTS（我怎么做）、TOOLS（我用什么），按顺序拼好再喂给模型。</p></div>
<div class="card"><h3>精确能力清单</h3><p>Skill 有六层来源（内置、宿主机、项目、托管、工作区、插件），每次开跑前重算一遍谁说了算，连同 MCP 工具一起列成带指纹的清单。</p></div>
</div>

<h2>打个比方</h2>
<div class="card">
<p>像一家只有一张餐桌的餐厅：一次只服务一位客人；菜单（任务单）一次性递进厨房；菜做好一盘端一盘，不是全做完才上；客人中途加菜，写张纸条从小窗口递进去；厨师半天没动静时，经理先探头看他是不是在忙，确认在摸鱼才换人。</p>
</div>
<h2>再多懂一点</h2>
<ul class="more">
<li>暖 Runner 有两套时钟：普通输出只会刷新活动时钟，注入消息欠下的"债务时钟"要等查询真正完成才清零。</li>
<li>Skill 的六层来源里，被禁用的定义不做"墓碑"，不会挡住更低层级中同名的启用版本。</li>
<li>Host 权限是"活体特权"：每次启动前都重新读库复检管理员身份，降级的瞬间就失去执行资格。</li>
</ul>

<h2>想读原版详解？</h2>
<p>
<a href="../wiki/versions/2026-08-25-103405/10-pi-agent-runner-xie-yi-stdin-stdout-jie-gou-hua-jie-guo-yu-ipc-tong-dao.md">Pi Agent Runner 协议：stdin/stdout 结构化结果与 IPC 通道</a><br>
<a href="../wiki/versions/2026-08-25-103405/11-host-yu-container-shuang-zhi-xing-mo-shi-rong-liang-chao-shi-yu-nuan-runner.md">Host 与 Container 双执行模式：容量、超时与暖 Runner</a><br>
<a href="../wiki/versions/2026-08-25-103405/12-si-duan-prompt-ti-xi-identity-soul-agents-tools-de-zu-zhuang-yu-shang-xia-wen-yu-suan.md">四段 Prompt 体系：IDENTITY、SOUL、AGENTS、TOOLS 的组装与上下文预算</a><br>
<a href="../wiki/versions/2026-08-25-103405/13-neng-li-jie-xi-guan-xian-skills-mcp-plugins-liu-ceng-lai-yuan-yu-jing-que-qing-dan.md">能力解析管线：Skills、MCP、Plugins 六层来源与精确清单</a><br>
<a href="../wiki/versions/2026-08-25-103405/14-hui-hua-chuan-xing-dui-lie-runner-sheng-ming-zhou-qi-zhong-shi-tui-bi-yu-qia-si-hui-fu.md">会话串行队列：Runner 生命周期、重试退避与卡死恢复</a>
</p>

<nav class="nav">
<a href="03-houdu-neihe.html">← 上一章：后端内核</a>
<a href="index.html">返回目录</a>
<a href="05-duo-qudao.html">下一章：多渠道 →</a>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{t as default};
