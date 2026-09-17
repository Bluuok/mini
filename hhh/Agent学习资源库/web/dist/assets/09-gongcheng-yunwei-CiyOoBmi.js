const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#64748B">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第9章 · 工程实践与运维 · Miniclaw 新手图解</title>
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
<span class="chip">给完全新手 · 第 9 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>工程实践与运维</h1>
<p class="lede">代码写完只是开始：怎么测、听谁的配置、数据怎么保住——这一章讲 Miniclaw 的日常家务事。</p>

<h2>这是什么？</h2>
<p>Miniclaw 把「跑得稳」也当成正经功能：一套三层测试守住代码质量，一套分层的配置规则决定「谁说了算」，一条备份恢复管线保护 <code>data/</code> 目录里的全部数据。所有日常操作都收敛到 <code>make</code> 命令里。</p>

<h2>一张图看懂</h2>
<div class="card">
<svg viewBox="0 0 900 560" role="img" aria-label="测试金字塔、配置优先级叠层与备份循环的运维全景图">
<defs>
<marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
<path d="M0,0 L8,4 L0,8 z" fill="#232733"/>
</marker>
</defs>

<!-- 面板一：测试金字塔 -->
<text x="160" y="42" text-anchor="middle" font-size="22" font-weight="700" fill="#232733">① 三层测试怎么摆</text>
<rect x="100" y="70" width="120" height="54" rx="14" stroke="#232733" stroke-width="3" fill="#64748B" fill-opacity=".12"/>
<text x="160" y="104" text-anchor="middle" font-size="19" fill="#232733">E2E 场景</text>
<rect x="66" y="146" width="188" height="58" rx="14" stroke="#232733" stroke-width="3" fill="#fff"/>
<text x="160" y="182" text-anchor="middle" font-size="19" fill="#232733">契约测试 · 26 个</text>
<rect x="26" y="226" width="268" height="58" rx="14" stroke="#232733" stroke-width="3" fill="#fff"/>
<text x="160" y="262" text-anchor="middle" font-size="19" fill="#232733">单元测试 · 约 280 个</text>
<line x1="310" y1="272" x2="310" y2="86" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
<text x="322" y="186" font-size="18" fill="#232733">越往上</text>
<text x="322" y="212" font-size="18" fill="#232733">越少、越慢、</text>
<text x="322" y="238" font-size="18" fill="#232733">但越真实</text>
<text x="160" y="322" text-anchor="middle" font-size="18" fill="#232733">一个 Vitest 全都管，</text>
<text x="160" y="346" text-anchor="middle" font-size="18" fill="#232733">靠文件名后缀分类</text>

<!-- 分隔线 -->
<line x1="385" y1="20" x2="385" y2="370" stroke="#D8DBE2" stroke-width="2"/>
<line x1="640" y1="20" x2="640" y2="370" stroke="#D8DBE2" stroke-width="2"/>

<!-- 面板二：配置优先级 -->
<text x="512" y="42" text-anchor="middle" font-size="22" font-weight="700" fill="#232733">② 配置谁说了算</text>
<rect x="392" y="66" width="240" height="72" rx="14" stroke="#232733" stroke-width="3" fill="#64748B" fill-opacity=".12"/>
<text x="512" y="96" text-anchor="middle" font-size="19" fill="#232733">Web 后台保存的文件</text>
<text x="512" y="124" text-anchor="middle" font-size="18" fill="#232733">最权威</text>
<rect x="392" y="158" width="240" height="72" rx="14" stroke="#232733" stroke-width="3" fill="#fff"/>
<text x="512" y="188" text-anchor="middle" font-size="19" fill="#232733">环境变量 .env</text>
<text x="512" y="216" text-anchor="middle" font-size="18" fill="#232733">首次部署的引导</text>
<rect x="392" y="250" width="240" height="72" rx="14" stroke="#232733" stroke-width="3" fill="#fff"/>
<text x="512" y="280" text-anchor="middle" font-size="19" fill="#232733">代码默认值</text>
<text x="512" y="308" text-anchor="middle" font-size="18" fill="#232733">最后的兜底</text>
<line x1="372" y1="102" x2="372" y2="300" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
<text x="356" y="206" text-anchor="end" font-size="18" fill="#232733">上层</text>
<text x="356" y="232" text-anchor="end" font-size="18" fill="#232733">压过</text>
<text x="356" y="258" text-anchor="end" font-size="18" fill="#232733">下层</text>

<!-- 面板三：备份循环 -->
<text x="770" y="42" text-anchor="middle" font-size="22" font-weight="700" fill="#232733">③ 数据备份循环</text>
<rect x="660" y="66" width="220" height="76" rx="14" stroke="#232733" stroke-width="3" fill="#64748B" fill-opacity=".12"/>
<text x="770" y="98" text-anchor="middle" font-size="19" fill="#232733">data/ 数据目录</text>
<text x="770" y="126" text-anchor="middle" font-size="18" fill="#232733">持久的东西全在这</text>
<rect x="660" y="238" width="220" height="76" rx="14" stroke="#232733" stroke-width="3" fill="#fff"/>
<text x="770" y="270" text-anchor="middle" font-size="19" fill="#232733">备份包 .tar.gz</text>
<text x="770" y="298" text-anchor="middle" font-size="18" fill="#232733">带清单和密钥</text>
<path d="M 700 142 Q 660 190 700 238" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
<text x="652" y="196" text-anchor="end" font-size="18" fill="#232733">make backup</text>
<text x="652" y="222" text-anchor="end" font-size="18" fill="#232733">在线快照+校验</text>
<path d="M 840 238 Q 880 190 840 142" fill="none" stroke="#232733" stroke-width="3" marker-end="url(#ar)"/>
<text x="888" y="196" text-anchor="start" font-size="18" fill="#232733">make restore</text>
<text x="888" y="222" text-anchor="start" font-size="18" fill="#232733">层层检查</text>
<text x="770" y="348" text-anchor="middle" font-size="18" fill="#232733">宁可拒绝，不可损坏</text>

<!-- 底部：Make 工作流 -->
<rect x="26" y="396" width="854" height="130" rx="14" stroke="#232733" stroke-width="3" fill="#FFF9F0"/>
<text x="453" y="432" text-anchor="middle" font-size="22" font-weight="700" fill="#232733">④ 所有日常操作都从 make 开始</text>
<text x="453" y="468" text-anchor="middle" font-size="19" fill="#232733">dev 开发 · start 生产启动 · status 排查健康 · typecheck 质量门禁</text>
<text x="453" y="500" text-anchor="middle" font-size="19" fill="#232733">backup 备份 · restore 恢复 · reset-init ⚠️ 清空重来（先备份！）</text>
</svg>
</div>
<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>① 三层测试：</b>底层约 280 个单元测试最快最多；越往上越少、越慢，但越接近真实场景。</p></div>
<div class="step"><span class="n">2</span><p><b>契约测试 · 26 个：</b>把架构规矩写成测试——安全开关必须开、启动只准一种方式，破坏约定当场点名。</p></div>
<div class="step"><span class="n">3</span><p><b>E2E 场景（塔尖）：</b>用真实浏览器和完整消息链路走一遍用户路径，数量最少，也最接近线上。</p></div>
<div class="step"><span class="n">4</span><p><b>② Web 后台文件：</b>界面保存后文件即唯一权威，环境变量整体让位——否则重启会悄悄覆盖你的修改。</p></div>
<div class="step"><span class="n">5</span><p><b>.env 与默认值：</b>环境变量只是首次部署的引导垫脚石；代码默认值兜底，非法数值静默回退不崩溃。</p></div>
<div class="step"><span class="n">6</span><p><b>③ 备份循环：</b>make backup 在线快照数据库、处置链接、写清单再原子打包；restore 层层校验后带回滚换装。</p></div>
<div class="step"><span class="n">7</span><p><b>④ make 工作流：</b>dev、start、status、typecheck、backup 全从 make 入口走；reset-init 清空数据，先备份！</p></div>
</div>

<h2>三个关键词</h2>
<div class="grid">
<div class="card">
<h3>契约测试</h3>
<p>把「架构规矩」写成测试：Electron 必须开安全隔离、生产启动只准用 <code>node dist/index.js</code>。谁改坏了约定，测试立刻报错。</p>
</div>
<div class="card">
<h3>配置优先级</h3>
<p>Web 后台保存的文件压过环境变量，环境变量又压过代码默认值。环境变量只是首次部署的垫脚石，界面保存后以文件为准。</p>
</div>
<div class="card">
<h3>备份恢复</h3>
<p><code>make backup</code> 在线快照数据库、剔除不可靠的链接再打包；<code>make restore</code> 层层校验、失败自动回滚，绝不留下半坏的数据。</p>
</div>
</div>

<h2>打个比方</h2>
<div class="card">
<p>像请了一位极谨慎的搬家师傅：贵重品逐件登记造册（备份清单），易碎品装车前先验货（快照校验），搬进新家时旧家具先不扔、摆在门口（带回滚的换装），任何一步不对就整箱退回。他的口头禅是——宁可拒单，也不弄坏你一件东西。</p>
</div>
<h2>再多懂一点</h2>
<ul class="more">
<li>契约测试连产品文案也管：页面术语统一叫「智能体」，写错会被测试拦下。</li>
<li>会话密钥的优先级正好相反：环境变量压过文件——它是纯运维资产，没有管理界面。</li>
<li>陈旧的恢复锁永不自动回收：宁可失败让人工核实，防止并发恢复互删回滚数据。</li>
</ul>

<h2>想读原版详解？</h2>
<p><a href="../wiki/versions/2026-08-25-103405/27-ce-shi-ti-xi-dan-yuan-ce-shi-qi-yue-ce-shi-yu-e2e-chang-jing-de-zu-zhi-fang-shi.md">测试体系：单元测试、契约测试与 E2E 场景的组织方式</a></p>
<p><a href="../wiki/versions/2026-08-25-103405/28-pei-zhi-you-xian-ji-yu-huan-jing-bian-liang-web-she-zhi-huan-jing-bian-liang-yu-dai-ma-mo-ren-zhi.md">配置优先级与环境变量：Web 设置、环境变量与代码默认值</a></p>
<p><a href="../wiki/versions/2026-08-25-103405/29-bei-fen-hui-fu-yu-ri-chang-yun-wei-shu-ju-mu-lu-bu-ju-yu-make-gong-zuo-liu.md">备份恢复与日常运维：数据目录布局与 make 工作流</a></p>

<nav class="nav">
<a href="08-kehu-duan.html">← 上一章：客户端</a>
<a href="index.html">返回目录</a>
<span style="color:#8A8F9E">已是最后一章</span>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{t as default};
