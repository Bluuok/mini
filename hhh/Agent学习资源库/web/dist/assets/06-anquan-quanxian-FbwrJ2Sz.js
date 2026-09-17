const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#EF4444">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第6章 · 安全与权限 · Miniclaw 新手图解</title>
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
<span class="chip">给完全新手 · 第 6 章</span>
<p class="kicker">MINICLAW 图解</p>
<h1>安全与权限</h1>
<p class="lede">两道门禁：网页上看身份，容器里靠隔离——而且这里没有万能钥匙。</p>

<h2>这是什么？</h2>
<p>Miniclaw 的安全分两层：网页层的 ACL 规则决定谁能碰哪个工作区；容器层则把 AI 关进隔离间，限制它能在主机上看到什么、改动什么。最特别的一条规则是：管理员 admin 只是「系统管家」，照样打不开别人工作区的门。</p>

<h2>一张图看懂</h2>
<svg viewBox="0 0 900 560" role="img" aria-label="ACL 门禁与容器隔离示意图">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#232733"/>
    </marker>
    <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#EF4444"/>
    </marker>
  </defs>

  <!-- 左区：网页门禁 -->
  <rect x="25" y="80" width="405" height="380" rx="14" fill="#FFFFFF" stroke="#232733" stroke-width="3"/>
  <text x="47" y="118" font-size="21" font-weight="bold" fill="#232733">① 网页门禁 · ACL</text>

  <rect x="50" y="145" width="165" height="105" rx="14" fill="#EF44441F" stroke="#232733" stroke-width="3"/>
  <text x="132" y="185" font-size="19" fill="#232733" text-anchor="middle">系统设置门</text>
  <text x="132" y="218" font-size="18" fill="#232733" text-anchor="middle">admin 工牌 ✓</text>

  <rect x="243" y="145" width="165" height="105" rx="14" fill="#FFFFFF" stroke="#232733" stroke-width="3"/>
  <text x="325" y="178" font-size="19" fill="#232733" text-anchor="middle">你的工作区门</text>
  <text x="325" y="207" font-size="18" fill="#232733" text-anchor="middle">只认主人钥匙</text>
  <text x="325" y="236" font-size="18" font-weight="bold" fill="#EF4444" text-anchor="middle">admin 工牌 ✗</text>

  <line x1="215" y1="197" x2="240" y2="197" stroke="#232733" stroke-width="3" marker-end="url(#arr)"/>

  <text x="50" y="300" font-size="18" fill="#232733">· 归属只看创建人 created_by</text>
  <text x="50" y="333" font-size="18" fill="#232733">· 没权限就答「查无此物」</text>
  <text x="50" y="361" font-size="18" fill="#232733">&#160;&#160;（404，防止外人试探）</text>
  <text x="50" y="400" font-size="18" fill="#232733">· 同一动作，四个入口</text>
  <text x="50" y="428" font-size="18" fill="#232733">&#160;&#160;（网页/WS/IM/IPC）同一裁决</text>

  <!-- 右区：容器密封舱 -->
  <rect x="470" y="80" width="405" height="380" rx="14" fill="#FFF9F0" stroke="#232733" stroke-width="3"/>
  <text x="492" y="118" font-size="21" font-weight="bold" fill="#232733">② 容器密封舱 · Docker</text>

  <rect x="495" y="135" width="355" height="272" rx="14" fill="#FFFFFF" stroke="#232733" stroke-width="3"/>
  <circle cx="558" cy="198" r="17" fill="#EF44441F" stroke="#232733" stroke-width="3"/>
  <rect x="540" y="220" width="36" height="48" rx="10" fill="#EF44441F" stroke="#232733" stroke-width="3"/>
  <text x="592" y="196" font-size="19" fill="#232733">node 用户干活</text>
  <text x="592" y="224" font-size="18" fill="#232733">（不是 root）</text>
  <text x="592" y="252" font-size="18" fill="#232733">被黑了也改不了系统</text>

  <rect x="520" y="292" width="155" height="78" rx="14" fill="#EF44441F" stroke="#232733" stroke-width="3"/>
  <text x="597" y="323" font-size="18" fill="#232733" text-anchor="middle">白名单小窗</text>
  <text x="597" y="350" font-size="18" fill="#232733" text-anchor="middle">只准清单内目录</text>

  <rect x="700" y="292" width="128" height="78" rx="14" fill="#FFFFFF" stroke="#232733" stroke-width="3"/>
  <path d="M713 320 v-9 a9 9 0 0 1 18 0 v9" fill="none" stroke="#232733" stroke-width="3"/>
  <rect x="707" y="320" width="30" height="22" rx="4" fill="none" stroke="#232733" stroke-width="3"/>
  <text x="744" y="323" font-size="18" fill="#232733">密钥上锁</text>
  <text x="764" y="350" font-size="18" fill="#232733">AES 加密</text>

  <text x="672" y="420" font-size="18" fill="#232733" text-anchor="middle">验证不了就拒绝启动 —— fail-closed</text>

  <g><circle cx="65" cy="160" r="13" fill="#EF4444"/><text x="65" y="166" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">1</text></g>
  <g><circle cx="258" cy="160" r="13" fill="#EF4444"/><text x="258" y="166" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">2</text></g>
  <g><circle cx="510" cy="150" r="13" fill="#EF4444"/><text x="510" y="156" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">3</text></g>
  <g><circle cx="535" cy="307" r="13" fill="#EF4444"/><text x="535" y="313" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">4</text></g>
  <g><circle cx="715" cy="307" r="13" fill="#EF4444"/><text x="715" y="313" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">5</text></g>
  <g><circle cx="490" cy="414" r="13" fill="#EF4444"/><text x="490" y="420" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">6</text></g>

  <!-- 底部连接箭头 -->
  <path d="M227 468 C 227 515 673 515 673 472" fill="none" stroke="#EF4444" stroke-width="3" marker-end="url(#arrR)"/>
  <text x="450" y="543" font-size="19" font-weight="bold" fill="#EF4444" text-anchor="middle">进了大门 ≠ 能进房间：容器里还有第二套门禁</text>
</svg>
<div class="walk">
<h3>图怎么读</h3>
<div class="step"><span class="n">1</span><p><b>系统设置门：</b>查的是「系统能力」——admin 角色隐含全部系统权限，管理用户、改配置这些事他畅通无阻。</p></div>
<div class="step"><span class="n">2</span><p><b>你的工作区门：</b>查的是「资源归属」，只比对创建人 created_by。这一层完全不看角色，admin 也照样吃闭门羹。</p></div>
<div class="step"><span class="n">3</span><p><b>查无此物：</b>没权限时不报 403 而是报 404——「不存在」和「无权访问」长得一模一样，外人没法试探出别人有哪些工作区。</p></div>
<div class="step"><span class="n">4</span><p><b>node 用户干活：</b>容器里的业务代码全程以非 root 身份运行，root 只在开机引导的一瞬出现；AI 即使被攻陷也改不了系统。</p></div>
<div class="step"><span class="n">5</span><p><b>白名单小窗：</b>主机目录想递进来，必须命中部署方持有的白名单，且启动前还会再校验一遍——配置过了不等于永久授权。</p></div>
<div class="step"><span class="n">6</span><p><b>验证不了就拒绝：</b>身份模式探测不出、白名单文件损坏……统统拒绝启动，绝不猜一个宽松默认值接着跑——这叫 fail-closed。</p></div>
</div>


<h2>三个关键词</h2>
<div class="grid">
  <div class="card">
    <h3>无 admin 后门</h3>
    <p>判断「这间工作区是谁的」时，代码只看创建者 id，根本不读角色字段。admin 想帮忙也进不去。</p>
  </div>
  <div class="card">
    <h3>非 root 运行</h3>
    <p>AI 在容器里以普通用户 node 干活，root 只在开机一瞬间做引导。就算 AI 被黑，也动不了系统。</p>
  </div>
  <div class="card">
    <h3>fail-closed</h3>
    <p>一切「验证不了就拒绝」：白名单文件坏了？直接禁止挂载。宁可不开门，绝不猜着放行。</p>
  </div>
</div>

<h2>打个比方</h2>
<div class="card">
  <p>把 Miniclaw 想成一栋公寓楼：前台认工牌，能开大楼的门，但每户户门只认自家钥匙。每个房间是密封舱，快递只能从物业批准的小窗递进来（挂载白名单），贵重物品全锁在保险柜里（AES 加密的密钥）。保安守则只有一句：看不清证件，一律拒收。</p>
</div>
<h2>再多懂一点</h2>
<ul class="more">
<li>三个工作区判定函数的签名明明接收 role 参数，函数体却从没读过它——代码结构上就不存在 admin 后门。</li>
<li>敏感目录黑名单（.ssh、.aws 等 18 类）由代码内置并与策略文件合并，部署方只能追加、删不掉基础防护。</li>
<li>凭据不走 docker run -e 环境变量，而是写进 0600 权限的只读 env 文件——环境变量会暴露在进程列表里。</li>
</ul>


<h2>想读原版详解？</h2>
<p>
<a href="../wiki/versions/2026-08-25-103405/19-acl-quan-xian-ju-zhen-ceng-ci-hua-shou-quan-yu-wu-admin-pang-lu-de-zi-yuan-ge-chi.md">ACL 权限矩阵：层次化授权与无 admin 旁路的资源隔离</a><br>
<a href="../wiki/versions/2026-08-25-103405/20-rong-qi-ge-chi-yu-gua-zai-an-quan-fei-root-yun-xing-bai-ming-dan-yu-mi-yao-jia-mi-bian-jie.md">容器隔离与挂载安全：非 root 运行、白名单与密钥加密边界</a>
</p>

<nav class="nav">
  <a href="05-duo-qudao.html">← 上一章：多渠道</a>
  <a href="index.html">返回目录</a>
  <a href="07-zidonghua-jiyi.html">下一章：自动化记忆 →</a>
</nav>
<footer>Miniclaw 新手图解</footer>
</div></body></html>
`;export{t as default};
