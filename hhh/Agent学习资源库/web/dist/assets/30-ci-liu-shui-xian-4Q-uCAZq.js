const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 30 章 · CI 流水线与工程规范 · HappyClaw 图解精读</title>
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
<p class="crumb">第 30 章 / 30 · 质量保障 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 30 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>CI 流水线与工程规范</h1>
<p class="lede">ci.yml 按从快到慢跑 11 步守合并门槛；发布链先按 digest 构建冒烟，两个平台都过检并签名之后才敢打上 ：latest。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像汽车出厂检验线：最便宜的目视检查排在最前，几秒钟就能挑出明显瑕疵（格式检查），越往后越贵的台架测试（构建、浏览器 E2E）放得越靠后——便宜的检查先失败，没人再等昂贵的环节。而新车标牌（latest 标签）只有两块试车场（amd64/arm64 原生 runner）都实测通过、盖了防伪钢印（cosign 签名）之后才会挂上去；贴标牌之前，车只有不可变的底盘编号（digest）。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="双流水线分工与发布顺序"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
    <rect x="24" y="60" width="240" height="110" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
    <text x="144" y="98" text-anchor="middle" font-size="25">🚦🧰</text>
    <text x="144" y="128" text-anchor="middle" font-size="14.5" font-weight="700">ci.yml · 合并门槛</text>
    <text x="144" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">每次 PR/push · 从快到慢 11 步</text>
    <rect x="300" y="60" width="250" height="110" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
    <text x="425" y="98" text-anchor="middle" font-size="25">🏷️🚫→🔢</text>
    <text x="425" y="128" text-anchor="middle" font-size="14.5" font-weight="700">按 digest 构建（无标签）</text>
    <text x="425" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">真实启动 + CDP 探针 × 双平台</text>
    <rect x="586" y="60" width="270" height="110" rx="14" fill="#EFEAFE" stroke="var(--accent)" stroke-width="3"/>
    <text x="721" y="98" text-anchor="middle" font-size="25">✍️🏷️✅</text>
    <text x="721" y="128" text-anchor="middle" font-size="14.5" font-weight="700">promote · 签名后才打标签</text>
    <text x="721" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">cosign 无密钥签名 → git-&lt;sha&gt;/latest</text>
    <line x1="264" y1="115" x2="296" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
    <line x1="550" y1="115" x2="582" y2="115" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
  </svg>
  <p class="caption">🔒 发布顺序本身就是一条测试断言：workflow 里 smoke 的位置必须早于 latest，有人调换步骤时契约测试当场变红。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>提交 PR 触发 validate<small>format:check 只看本次改动文件：以 merge-base 计算 diff，历史遗留的格式问题不背锅</small></p></div><div class="step"><span class="n">2</span><p>改了 shared/ 类型却忘了同步？<small>Step 6 重新生成三端副本后 git diff --exit-code 当场失败——生成物必须作为普通代码提交进仓库</small></p></div><div class="step"><span class="n">3</span><p>镜像构建完毕但没有标签<small>push-by-digest 先推不带标签的候选镜像：哪怕冒烟失败，也不会有任何「已发布但未验证」的名字暴露给用户</small></p></div><div class="step"><span class="n">4</span><p>两台原生 runner 各自实测<small>不覆盖 entrypoint 走完整生产启动路径，轮询容器内 http://127.0.0.1:9222/json/version 要求 Browser 非空且 ws:// 开头，最多等 120 秒</small></p></div><div class="step"><span class="n">5</span><p>promote 任务最后一锤定音<small>imagetools create 合并双平台清单 → cosign 基于_OIDC token 无密钥签名 → 打 git-<sha> 与 :latest；标签传播延迟用最多 12 次 × 5 秒读后写校验兜住</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>11 步</b><span>ci.yml validate 串行验证链</span></div><div class="stat"><b>20 分钟</b><span>ci.yml 任务超时上限</span></div><div class="stat"><b>40 位</b><span>所有第三方 Action 钉住的 commit SHA</span></div><div class="stat"><b>2 个</b><span>amd64/arm64 原生架构 runner，不用 QEMU 模拟</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>lockfile 是构建输入不是产物：三个工程全量提交，全仓禁止裸 npm install，只许按 lockfile 严格安装的 npm ci。</li><li>TOOL_REFRESH 把 commit sha 写进镜像第一层：每次 main push 强制失效工具层缓存，生成 happyclaw-tool-versions.txt 审计文件记录实际版本。</li><li>CI 自己也在被测试：三个契约测试文件锁定 workflow 形状、可复现构建与 make start 运行时契约，绕规范的手改在单元测试阶段即被拦截。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>为了速度，先把 latest 发出去再补冒烟不行吗？</dt><dd>不行：标签是可变的会移动的名字，一旦先发，「已发布但未验证」的镜像立刻对所有用户可见且难以召回。所以镜像只先推不可变的 digest，双平台探针通过并签名后 promote 才挪标签——宁可多等一轮传播延迟，也不赌一次回滚。它不保护什么：CI 门槛挡得住流程违规与环境污染，挡不住已通过全部检查但仍潜伏逻辑缺陷的代码。</dd><dt>提交前我要在本地跑什么？</dt><dd>官方清单按序是 format:changed、docs:check、make typecheck、make test、make build、git diff --check——与 CI 同一套门槛提前跑一遍；SDK 升级必须显式走 make update-sdk，生产启动路径故意不触碰依赖图。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../30-ci-liu-shui-xian-yu-gong-cheng-gui-fan.md">CI 流水线与工程规范</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="29-ce-shi-ti-xi.html">第 29 章 · 测试体系</a><a href="01-xiang-mu-gai-lan.html">第 01 章 · 项目概览</a></div>

<nav class="nav">
<a href="29-ce-shi-ti-xi.html">上一章：测试体系 ←</a>
<a href="index.html">返回目录</a>
<span style="opacity:.4">已是最后一章</span>
</nav>
<footer>HappyClaw 图解精读 · 30 / 30</footer>
</div></body></html>
`;export{t as default};
