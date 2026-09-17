const n=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 24 章 · RBAC 权限模型与资源隔离 · HappyClaw 图解精读</title>
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
<p class="crumb">第 24 章 / 30 · 认证与安全 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 24 章</span>
<p class="kicker">HAPPYCLAW 图解精读</p>
<h1>RBAC 权限模型与资源隔离</h1>
<p class="lede">两把锁各管各的：角色权限开系统管理面，资源所有权守用户数据；管理员免检的是前者，别人的工作区照样一道死锁，连他在不在都不告诉你。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像写字楼物业：总管手里有前台万能钥匙——会议室、配电室、档案室随便进出（系统管理面天然全通）。但这套权限对各家办公室无效：抽屉只认主人本人，总管来了照样吃闭门羹，而且物业不给任何解释——「门不存在」和「门不让你开」回的是同一句话。特殊区域另设第三道闸：动主机本体只认在职总管本人，当天被停职就立刻失效。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="同一个请求经过两道门的不同待遇"><defs><marker id="ar24" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="24" y="58" width="190" height="114" rx="14" fill="#fff7e6" stroke="#f2b705" stroke-width="3"/>
<text x="119" y="96" text-anchor="middle" font-size="26">👤</text>
<text x="119" y="126" text-anchor="middle" font-size="14.5" font-weight="700">一个请求进来</text>
<text x="119" y="150" text-anchor="middle" font-size="13" fill="#5b6478">先验登录会话身份</text>
<rect x="254" y="22" width="280" height="86" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="394" y="56" text-anchor="middle" font-size="15">🏛️ 第一道门：系统管理面</text>
<text x="394" y="82" text-anchor="middle" font-size="13" fill="#5b6478">admin 全部免检，成员按细粒度授权</text>
<rect x="254" y="124" width="280" height="86" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="394" y="158" text-anchor="middle" font-size="15">🗄️ 第二道门：资源所有权</text>
<text x="394" y="184" text-anchor="middle" font-size="13" fill="#5b6478">只认创建者本人，admin 也无旁路</text>
<rect x="604" y="22" width="252" height="86" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="730" y="52" text-anchor="middle" font-size="18">✅ 放行操作配置</text>
<text x="730" y="80" text-anchor="middle" font-size="13" fill="#5b6478">用户／邀请码／计费／审计…</text>
<rect x="604" y="124" width="252" height="86" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="730" y="154" text-anchor="middle" font-size="18">🚪 一律「404 不存在」</text>
<text x="730" y="182" text-anchor="middle" font-size="13" fill="#5b6478">无权与没有，回应完全一致</text>
<line x1="216" y1="90" x2="250" y2="65" stroke="#232733" stroke-width="4" marker-end="url(#ar24)"/>
<line x1="216" y1="140" x2="250" y2="167" stroke="#232733" stroke-width="4" marker-end="url(#ar24)"/>
<line x1="536" y1="65" x2="600" y2="65" stroke="#232733" stroke-width="4" marker-end="url(#ar24)"/>
<line x1="536" y1="167" x2="600" y2="167" stroke="#232733" stroke-width="4" marker-end="url(#ar24)"/>
</svg>
<p class="caption">🔐 同一个人、同样的管理徽章，过两道门的规则毫无关系——这正是模型反直觉之处。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p>登录后角色和权限清单随请求上下文随身携带<small>签名过的会话凭证防冒名；账号一被禁用或删除，下一个请求立刻吃 403</small></p></div>
<div class="step"><span class="n">2</span><p>改系统配置？先过第一道门的细粒度权限检查<small>判断逻辑一句话：admin 直接放行，其他人查名单</small></p></div>
<div class="step"><span class="n">3</span><p>访问某个工作区？第二道门只比对创建者字段<small>判定函数内部根本不看权限清单，admin 在这里没有任何特权分支</small></p></div>
<div class="step"><span class="n">4</span><p>对不上号？得到的答复与「工作区不存在」一字不差<small>同款 404 让人无法试探出别人名下有哪些空间</small></p></div>
<div class="step"><span class="n">5</span><p>想在宿主机直接执行命令？第三道闸实时核验身份状态<small>降级、停职或被列入撤销名单者当场失效，不必等服务重启</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>6 项</b><span>系统面细粒度权限的定义总数</span></div>
<div class="stat"><b>4 套</b><span>内置权限模板，一键套用到成员</span></div>
<div class="stat"><b>404</b><span>无权访问与资源不存在共用同一应答</span></div>
<div class="stat"><b>8 维</b><span>每次改动权限必须跑满的验证维度</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>IM 群主不靠先来后到：群里第一个说话的人不会自动成为主人，只有现任主人亲自发认领指令才作数；一人私聊才可从首条消息学习归属。</li>
<li>拿着用户管理权的非 admin 别想两步绕过——改密码前会先比对双方权限集，「先抹平对方权限再重置密码」的路被预先封死。</li>
<li>工作区主人被禁用时消息处理立即停摆：这个判定是随手就能做的纯函数检查，绝不等待下次服务重启。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>我是管理员，悄悄看看用户的聊天记录不行吗？</dt><dd>不行，而且技术上无从下手：所有权判定的函数压根不知道谁是管理员，所有角色走同一条比对；加上无权与不存在共用同一 404，连猜都没处猜。要说清它不保护什么——主机执行这类系统特权确实归 admin 独享，且是实时生效的特权，不继承任何历史记录；但它管的是执行方式，不是数据内容。</dd>
<dt>普通成员之间会不会互相看到东西？</dt><dd>防线层层叠叠：数据面只认所有者；跨群发消息要按四级规则链逐一放行，默认拒绝；定时任务这类无人盯守的执行体也不给全局豁免——因为它们的提示词会被反复重放，豁免等于允许有人借机往别人的地盘种任务。</dd>
<dt>第一个在群里叫机器人的人会自动变成主人吗？</dt><dd>群聊里不会，认领主人的口令是唯一免检的例外路径——因为无主的群不豁免就永远锁死；其余每条命令都先比对人。主人离群换号后还有管理员强制释放通道可走，之后由下一人重新认领。一人私聊倒是不同：发送者结构上无歧义，可以从首条消息学习归属。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../24-rbac-quan-xian-mo-xing-yu-zi-yuan-ge-chi.md">RBAC 权限模型与资源隔离</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="23-bei-fen-hui-fu.html">第 23 章 · 备份与恢复</a><a href="25-mi-yao-jia-mi.html">第 25 章 · 密钥加密与凭据管理</a></div>

<nav class="nav">
<a href="23-bei-fen-hui-fu.html">上一章：备份与恢复 ←</a>
<a href="25-mi-yao-jia-mi.html">下一章：密钥加密与凭据管理 →</a>
</nav>
<footer>HappyClaw 图解精读 · 24 / 30</footer>
</div></body></html>
`;export{n as default};
