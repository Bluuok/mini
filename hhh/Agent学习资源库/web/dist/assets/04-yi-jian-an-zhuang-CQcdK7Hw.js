const t=`<!doctype html>
<html lang="zh-CN" style="--accent:#7C5CFC">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 4 章 · 一键安装脚本 · Craft Agents 图解精读</title>
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
<p class="crumb">第 4 章 / 23 · 安装与上手 · 适合：想搞懂原理的非技术读者</p>
<span class="chip">由浅入深 · 第 4 章</span>
<p class="kicker">CRAFT AGENTS 图解精读</p>
<h1>一键安装脚本</h1>
<p class="lede">粘贴一行命令，安装脚本便走完平台检测、清单解析、下载验证、落地安置四道关卡——从零到能用，每一步都有检查点。</p>

<h2>先打个比方</h2>
<div class="analogy"><span class="tag">ANALOGY</span><p>像机场的安检流水线：先验身份证确认你是哪国旅客（uname 检测系统和 CPU 架构），再查航班信息屏拿到准确的登机口（拉取 YAML 发布清单，全系统没有一处硬编码版本），然后行李过 X 光逐件核对（SHA-512 校验和），最后按舱位引到座位（macOS 进 /Applications、Linux 落 ~/.local/bin、Windows 注册进 PATH）。任何一关不过，立刻终止、原路退回。</p></div>

<h2>全景图解</h2>
<svg viewBox="0 0 880 230" role="img" aria-label="安装脚本四阶段流水线"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,4.5 L0,9 z" fill="#232733"/></marker></defs>
<rect x="20" y="62" width="188" height="108" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="114" y="98" text-anchor="middle" font-size="24">🔍</text>
<text x="114" y="128" text-anchor="middle" font-size="14.5" font-weight="700">阶段一 平台检测</text>
<text x="114" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">darwin/linux × arm64/x64</text>
<rect x="242" y="62" width="188" height="108" rx="14" fill="#fff" stroke="#232733" stroke-width="3"/>
<text x="336" y="98" text-anchor="middle" font-size="24">📜</text>
<text x="336" y="128" text-anchor="middle" font-size="14.5" font-weight="700">阶段二 清单解析</text>
<text x="336" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">版本 + URL + 校验和</text>
<rect x="464" y="62" width="188" height="108" rx="14" fill="#fdeeee" stroke="#e5484d" stroke-width="3"/>
<text x="558" y="98" text-anchor="middle" font-size="24">🔒</text>
<text x="558" y="128" text-anchor="middle" font-size="14.5" font-weight="700">阶段三 下载与校验</text>
<text x="558" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">不过关 → 删文件退出</text>
<rect x="686" y="62" width="174" height="108" rx="14" fill="#edfaf2" stroke="#2fae6d" stroke-width="3"/>
<text x="773" y="98" text-anchor="middle" font-size="24">📦</text>
<text x="773" y="128" text-anchor="middle" font-size="14.5" font-weight="700">阶段四 安装落地</text>
<text x="773" y="152" text-anchor="middle" font-size="12.5" fill="#5b6478">/Applications 或 bin 启动器</text>
<line x1="210" y1="116" x2="238" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="432" y1="116" x2="460" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
<line x1="654" y1="116" x2="682" y2="116" stroke="#232733" stroke-width="4" marker-end="url(#ar)"/>
</svg>
<p class="caption">发布清单是唯一事实来源——latest-mac.yml 与 latest-linux.yml 说哪里有最新版。</p>

<h2>走一遍真实场景</h2>
<div class="walk">
<div class="step"><span class="n">1</span><p><code>curl -fsSL https://agents.craft.do/install-app.sh | bash</code> 敲下去，脚本先认系统<small>除 curl/wget 外零依赖；Linux 只有 x64——在 arm64 Linux 上会直接明确报错</small></p></div><div class="step"><span class="n">2</span><p>取回对应架构的 YAML 清单并抽出版本、URL 和 SHA-512<small>装了 yq 就用 yq -r，没装就走内置的正则式 YAML 解析函数逐行抠字段</small></p></div><div class="step"><span class="n">3</span><p>带进度条下载后当场算哈希比对<small>清单里是 base64 编码格式（88 字符），所以先把本地 hex 经 xxd -r -p | base64 再比；不匹配立即删除文件退出</small></p></div><div class="step"><span class="n">4</span><p>各归其位：macOS 先用 osascript 请出旧实例、解压进 /Applications 并摘掉隔离属性<small>xattr -rd com.apple.quarantine 让它绕过 Gatekeeper 告警启动；Linux 的包装脚本顺手清过期缓存并以 --no-sandbox 启动 AppImage</small></p></div>
</div>

<h2>值得记住的数字</h2>
<div class="stats">
<div class="stat"><b>4</b><span>道关卡构成同一条流水线（三端一致）</span></div><div class="stat"><b>88字符</b><span>base64 编码的 SHA-512 校验串长度</span></div><div class="stat"><b>365天</b><span>配套 generate-dev-cert.sh 自签证书有效期（EC P-256）</span></div><div class="stat"><b>1</b><span>行命令即可完成桌面端安装</span></div>
</div>

<h2>再多懂一点</h2>
<ul class="more">
<li>Windows 版 install-app.ps1 用同一套思路的原生工具实现：Is64BitOperatingSystem 判架构、HttpWebRequest 带自定义进度条下载、[System.Security.Cryptography.SHA512] 验签，最后把 craft-agents.cmd 写进用户 PATH——重开终端即生效。</li>
<li>另一条独立分支 install-server.sh 不下二进制：它在仓库根目录跑 bun install --frozen-lockfile、构建 MCP 子进程服务器与 WebUI，再以 --generate-token 出令牌——令牌只打印一次且无法恢复，也可随时用 openssl rand -hex 32 自造一个。</li>
<li>Linux 包装脚本的 --no-sandbox 不是偷懒：AppImage 解压到 /tmp 会弄丢 chrome-sandbox 的 SUID 位，不加参数根本起不来；它还会打印 FUSE 缺失提醒。</li>
<li>git clone 后想从源码配无头服务器的开发者用 install-server.sh；不想克隆源码就去看 Dockerfile.server 的预打包镜像路线，配套 docker-smoke-test.sh 能端到端验证镜像可用。</li>
</ul>

<h2>常见疑问</h2>
<dl class="faq">
<dt>--no-sandbox 模式跑浏览器内核，会不会很危险？</dt><dd>这是 Electron 在特定部署形态下的已知取舍：关闭的是 Chromium 的内置沙盒封装层，因为 SUID 助手文件缺失时它反而会阻止启动。但要明白它不保护什么——它不会替你圈定应用能读写哪些文件，真正的隔离要靠操作系统权限或容器方案。介意的话可改走源码构建或 Docker 路径。</dd><dt>报「Checksum verification failed」怎么办？</dt><dd>两个来源：网络把包截坏了，或是中间人篡改。直接重新运行脚本通常就好；反复失败就要警惕当前网络环境了。</dd>
</dl>

<h2>想读原版详解？</h2>
<p><a href="../一键安装脚本_lukilabs_craft-agents-oss/一键安装脚本_lukilabs_craft-agents-oss.md">一键安装脚本：三平台实现细节</a>（文字版，含源码出处）</p>

<h2>相关章节</h2>
<div class="rel"><a href="03-an-zhuang-fang-shi.html">第 3 章 · 安装方式</a><a href="05-zui-xin-geng-xin.html">第 5 章 · 最新更新与演进</a></div>

<nav class="nav">
<a href="03-an-zhuang-fang-shi.html">← 上一章：一扇引擎五扇门</a>
<a href="05-zui-xin-geng-xin.html">下一章：最新更新与演进 →</a>
</nav>
<footer>Craft Agents 图解精读 · 4 / 23</footer>
</div></body></html>
`;export{t as default};
