const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第21章 · 先看菜单，点菜才上菜 · TinyCode 图解精读</title>
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
<p class="crumb">第 21 章 / 27 · 扩展机制 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 21 章</span>
<p class="kicker">TINYCODE 图解精读</p>
<h1>先看菜单，点菜才上菜</h1>
<p class="lede">技能是项目里的领域说明书。启动时只把「有哪些技能」放进菜单（名字 + 一句描述），点了菜（load_skill）才上完整正文——渐进式披露。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像律所的专业资料库：前台有一张索引卡（每份专长一行摘要）；真接到相关案子，律师才去调阅完整卷宗。卷宗再多，前台桌面永远只有一张卡。</p></div>

<h2>全景图解</h2>
<div class="cards">
    <div class="card" style="background:#eef4ff;"><span class="big">📋</span><b>菜单（常驻）</b><small>只放名字 + 一句描述，各占一行</small></div>
    <div class="card" style="background:#edfaf2;"><span class="big">🍽️</span><b>上菜（按需）</b><small>AI 调 <code>load_skill</code> 才读全文</small></div>
  </div>
  <p class="caption">文件放 <code>.tinycode/skills/名字/SKILL.md</code>。100 个技能也不撑爆脑子 —— 因为正文平时根本不进上下文。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>项目维护者写 .tinycode/skills/review/SKILL.md<small>frontmatter 声明 name 与 description</small></p></div><div class="step"><span class="n">2</span><p>启动时扫描，只取两行元数据进系统提示词<small>100 个技能也只占 100 行</small></p></div><div class="step"><span class="n">3</span><p>模型判断当前任务相关，调用 load_skill<small>此时才读完整正文</small></p></div><div class="step"><span class="n">4</span><p>正文进入上下文，按说明书执行<small>用完即止，不留残余</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>2</b><span>行元数据常驻上下文</span></div><div class="stat"><b>1</b><span>次 load_skill 调用加载全文</span></div><div class="stat"><b>100+</b><span>个技能也不会撑爆上下文</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>SKILL.md 的 frontmatter 只支持 name 与 description 两个必需字段。</li><li>技能发现是双层的：项目目录优先，兼容更多位置。</li><li>load_skill 本身也是注册表里的一件普通工具。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>技能和直接写进系统提示词有什么区别？</dt><dd>区别在成本：全量塞入会随技能数量线性膨胀，且大多数与当前任务无关；渐进式披露只为用到的技能付费。</dd><dt>谁能创建技能？</dt><dd>任何能写文件的人：按目录约定放一个 SKILL.md 即可，无需改代码。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../21-ji-neng-xi-tong-skill-md-fa-xian-yu-load_skill-jian-jin-shi-pi-lu.md">SKILL.md 发现与 load_skill 渐进式披露</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="11-tong-gong-ju-zhu-ce-biao-nei-zhi-mcp-yu-zi-dai-li-gong-ju-de-ming-ming-kong-jian-he-bing.html">第 11 章 · load_skill 工具在哪张桌子上</a><a href="03-pei-zhi-ti-xi-config-json-huan-jing-bian-liang-yu-mi-yao-an-quan-guan-li.html">第 3 章 · 配置体系怎么发现技能目录</a></div>

<nav class="nav">
<a href="20-hui-hua-sheng-ming-zhou-qi-xin-jian-continue-mu-lu-pi-pei-yu-new-lun-huan.html">上一章：新本子、旧本子、换本子 ←</a>
<a href="index.html">返回目录</a>
<a href="22-mcp-ji-cheng-stdio-fu-wu-qi-bing-xing-lian-jie-yu-dan-dian-gu-zhang-ge-chi.html">下一章：插线板：外挂工具，坏了不炸 →</a>
</nav>
<footer>TinyCode 图解精读 · 21 / 27</footer>
</div></body></html>
`;export{n as default};
