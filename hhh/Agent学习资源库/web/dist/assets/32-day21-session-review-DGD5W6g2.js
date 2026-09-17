const e=`<!DOCTYPE html><html lang="zh-CN" style="--accent:#607D8B"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第 32 章 · 会话连续性与整合复盘 · 图解</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.8;color:#26292e;background:#f6f6f8;padding:28px 14px}
.page{max-width:780px;margin:0 auto;background:#fff;border-radius:14px;padding:38px 36px 30px;box-shadow:0 2px 14px rgba(0,0,0,.07)}
.crumb{font-size:13px;color:#8b909a;margin-bottom:16px}
.chip{display:inline-block;background:var(--accent);color:#fff;font-size:13px;font-weight:600;padding:3px 13px;border-radius:999px}
.kicker{margin:14px 0 4px;color:var(--accent);font-size:13px;font-weight:700;letter-spacing:.14em}
h1{font-size:30px;line-height:1.35;margin-bottom:8px}
.lede{color:#5a5f68;font-size:17px;margin-bottom:22px}
h2{font-size:20px;margin:30px 0 12px;padding-left:11px;border-left:4px solid var(--accent);line-height:1.5}
.metaphor{background:#f4f7f9;border:1px solid #d6e0e5;border-radius:10px;padding:14px 18px;font-size:16px;color:#4c4f56}
figure{margin:6px 0 2px}
figcaption{font-size:13px;color:#8b909a;text-align:center;margin-top:6px}
svg{width:100%;height:auto;display:block}
ol.steps{padding-left:0;list-style:none;counter-reset:s}
ol.steps li{counter-increment:s;position:relative;padding-left:38px;margin-bottom:14px}
ol.steps li::before{content:counter(s);position:absolute;left:0;top:3px;width:24px;height:24px;border-radius:50%;background:var(--accent);color:#fff;font-size:14px;font-weight:700;text-align:center;line-height:24px}
.note{display:block;color:#8b909a;font-size:14px;line-height:1.7}
.cards{display:flex;flex-wrap:wrap;gap:12px;margin-top:4px}
.card{flex:1 1 150px;border:1px solid #e7e9ee;border-top:3px solid var(--accent);border-radius:10px;padding:12px 14px;background:#fcfcfd}
.card .num{font-size:26px;font-weight:800;color:var(--accent);line-height:1.3}
.card p{font-size:13.5px;color:#5a5f68;line-height:1.6}
ul.more{padding-left:20px}
ul.more li{margin-bottom:10px}
.qa{margin-top:2px}
.qa .q{font-weight:700;margin:16px 0 4px}
.qa .a{color:#4c4f56;font-size:16px}
.deep{background:#f8f8fa;border-radius:10px;padding:14px 18px;font-size:15.5px;color:#4c4f56}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:34px;padding-top:18px;border-top:1px solid #eceef2}
.nav a,.nav span.ph{flex:1;display:block;padding:12px 14px;border:1px solid #e7e9ee;border-radius:10px;text-decoration:none;font-size:14px;line-height:1.6;color:#26292e;background:#fff}
.nav a:hover{border-color:var(--accent)}
.nav .dir{display:block;font-size:12px;color:#8b909a}
.nav .next{text-align:right}
footer{text-align:center;font-size:13px;color:#a0a5ae;margin-top:24px}
@media(max-width:600px){.page{padding:26px 18px}}
</style></head><body><div class="page"><div class="crumb">AI 应用开发工程师三十天速成计划 · Week 3 · 给想建立直觉的初学者</div><span class="chip">第 32 章 · 共 32 章</span><p class="kicker">速成计划 图解</p><h1>会话连续性与整合复盘</h1><p class="lede">任务会被中断、要等审批、第二天换人接手。会话连续性的本质是一份状态协议：把「任务做到哪」持久化下来，再用同一个 thread_id 找回来；复盘则诚实记录整周边界。</p>

<h2>先打个比方</h2><p class="metaphor">医院交接班：接班的护士不看上一位的记忆，只看交接单——做到哪一步、哪些已验证、哪些待办。会话连续性写给机器的就是这份交接单：不靠谁「记得」，靠写下来的记录和统一的编号。</p>

<h2>全景图解</h2><figure><svg viewBox="0 0 760 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="thread_id 串起三张表，写入与读回拼出中断恢复"><defs><marker id="p32arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9aa0a6"/></marker><marker id="p32ac" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#607D8B"/></marker></defs><g font-size="13"><rect x="260" y="14" width="240" height="38" rx="19" fill="#607D8B"/><text x="380" y="39" text-anchor="middle" font-weight="700" fill="#fff" font-size="14">thread_id · 串起一切的钥匙</text>

<path d="M340 52 L120 84" fill="none" stroke="#9aa0a6" stroke-width="1.4" marker-end="url(#p32arr)"/><path d="M380 52 L380 82" fill="none" stroke="#607D8B" stroke-width="1.6" marker-end="url(#p32ac)"/><path d="M420 52 L640 84" fill="none" stroke="#9aa0a6" stroke-width="1.4" marker-end="url(#p32arr)"/>

<text x="105" y="76" text-anchor="middle" font-size="11.5" fill="#777">写（append_message / append_event）</text><text x="668" y="76" text-anchor="middle" font-size="11.5" fill="#777">读（get_session / messages / events）</text>

<rect x="15" y="96" width="185" height="118" rx="9" fill="#fbfbfc" stroke="#d4d7de"/><text x="107" y="120" text-anchor="middle" font-weight="700" fill="#333">写入方向</text><text x="107" y="141" text-anchor="middle" font-size="11" fill="#555">写前自动确保会话存在</text><text x="107" y="159" text-anchor="middle" font-size="11" fill="#555">INSERT OR IGNORE 幂等续接</text><text x="107" y="177" text-anchor="middle" font-size="11" fill="#555">每次写入刷新 updated_at</text><text x="107" y="198" text-anchor="middle" font-size="11" fill="#607D8B">参数化查询，转义交给驱动</text>

<rect x="565" y="96" width="180" height="118" rx="9" fill="#fbfbfc" stroke="#d4d7de"/><text x="655" y="120" text-anchor="middle" font-weight="700" fill="#333">读回方向 = 恢复</text><text x="655" y="141" text-anchor="middle" font-size="11" fill="#555">get_session 判断全新/续接</text><text x="655" y="159" text-anchor="middle" font-size="11" fill="#555">get_messages 原序回放</text><text x="655" y="177" text-anchor="middle" font-size="11" fill="#555">get_events 拿回结构化结论</text><text x="655" y="198" text-anchor="middle" font-size="11" fill="#607D8B">三个原语拼出恢复，没有魔法方法</text>

<line x1="200" y1="155" x2="252" y2="155" stroke="#9aa0a6" stroke-width="1.4" marker-end="url(#p32arr)"/><line x1="512" y1="155" x2="561" y2="155" stroke="#9aa0a6" stroke-width="1.4" marker-end="url(#p32arr)"/>

<rect x="255" y="86" width="250" height="54" rx="8" fill="#fff" stroke="#607D8B" stroke-width="1.5"/><text x="380" y="106" text-anchor="middle" font-weight="700" fill="#455a64">sessions · 会话登记簿</text><text x="380" y="126" text-anchor="middle" font-size="11" fill="#777">只记「存在、活到什么时候」，不含对话内容</text>

<line x1="380" y1="140" x2="380" y2="156" stroke="#607D8B" stroke-width="1.6" marker-end="url(#p32ac)"/>

<rect x="255" y="158" width="250" height="54" rx="8" fill="#fff" stroke="#607D8B" stroke-width="1.5"/><text x="380" y="178" text-anchor="middle" font-weight="700" fill="#455a64">messages · 对话内容</text><text x="380" y="198" text-anchor="middle" font-size="11" fill="#777">role/content；ORDER BY id 按写入顺序回放给模型</text>

<line x1="380" y1="212" x2="380" y2="228" stroke="#607D8B" stroke-width="1.6" marker-end="url(#p32ac)"/>

<rect x="255" y="230" width="250" height="54" rx="8" fill="#fff" stroke="#607D8B" stroke-width="1.5"/><text x="380" y="250" text-anchor="middle" font-weight="700" fill="#455a64">events · 结构化事件</text><text x="380" y="270" text-anchor="middle" font-size="11" fill="#777">guardrail 判定 / 工具调用 / HITL 审批，可检索复盘</text>

<line x1="380" y1="284" x2="380" y2="308" stroke="#607D8B" stroke-width="1.6" marker-end="url(#p32ac)"/>

<rect x="130" y="310" width="500" height="50" rx="8" fill="#f4f7f9" stroke="#d6e0e5"/><text x="380" y="330" text-anchor="middle" font-size="12.5" font-weight="600" fill="#455a64">SQLite 单文件数据库：默认 :memory: 测试即焚；传磁盘路径则进程重启仍在</text><text x="380" y="349" text-anchor="middle" font-size="11" fill="#888">零部署、整文件可拷走备份；边界：不适合高并发写、多进程同写</text>

<text x="380" y="390" text-anchor="middle" font-size="12" fill="#777">Week 3 七件套在 week3_demo 端到端串起来 → 复盘定下周起点</text>

<rect x="20" y="404" width="220" height="72" rx="8" fill="#fff" stroke="#d4d7de"/><text x="130" y="426" text-anchor="middle" font-size="12" font-weight="700" fill="#333">week3-retro.md</text><text x="130" y="446" text-anchor="middle" font-size="11" fill="#555">已完成 7 条 ＝ 每天一个模块</text><text x="130" y="463" text-anchor="middle" font-size="11" fill="#555">＋仍是 mock 的 4 条（诚实边界）</text><rect x="270" y="404" width="220" height="72" rx="8" fill="#fff" stroke="#d4d7de"/><text x="380" y="426" text-anchor="middle" font-size="12" font-weight="700" fill="#333">week4-integration-plan.md</text><text x="380" y="446" text-anchor="middle" font-size="11" fill="#555">「不再补概念」先立边界</text><text x="380" y="463" text-anchor="middle" font-size="11" fill="#555">入口优先级＋API 草案＋验收标准</text><rect x="520" y="404" width="225" height="72" rx="8" fill="#f4f7f9" stroke="#607D8B" stroke-width="1.3"/><text x="632" y="426" text-anchor="middle" font-size="12" font-weight="700" fill="#455a64">Week 4 优先级（排过序）</text><text x="632" y="444" text-anchor="middle" font-size="11" fill="#555">① FastAPI 服务化 ② 接一个 IM 入口</text><text x="632" y="462" text-anchor="middle" font-size="11" fill="#555">③ 接一个真实系统 ④ 保留 baseline 重跑</text></g></svg><figcaption>持久化＋恢复：sessions / messages / events 三张表各管一件事，thread_id 作主键；复盘文档自证整周成果</figcaption></figure>

<h2>走一遍真实场景</h2><ol class="steps"><li><strong>任务开始，先登记会话。</strong><span class="note">没传 thread_id 就现场生成 thread-{uuid 前 12 位}；传了旧 id 则 INSERT OR IGNORE 静默复用而不是报错或覆盖；这个可以外部传入的 thread_id 就是跨进程恢复的钥匙。</span></li><li><strong>过程中消息与事件分开记。</strong><span class="note">append_message 存 role/content 对话，append_event 存 guardrail 判定、工具调用、HITL 审批等事件——它们查询模式完全不同，所以不分在一起。</span></li><li><strong>任务被中断：库文件还在。</strong><span class="note">默认 ":memory:" 是纯内存库，进程结束即消失，适合测试；传磁盘路径即持久化——SQLite 就是一个文件，能整文件拷走、备份。事件载荷以 JSON 文本存取，写 dumps 读 loads 严格互逆。</span></li><li><strong>第二天恢复，不用从头诊断。</strong><span class="note">get_session 返回 None 就是全新任务、返回记录就能继续；get_messages 按 ORDER BY id 原样回放对话历史；get_events 拿回已验证结论和待办动作——「接着上次的进度」的前提就是顺序保真。</span></li><li><strong>端到端 demo 串联整周，复盘自证完成度。</strong><span class="note">week3_demo.py 把整整一周的模块串起来；week3-retro.md 用「已完成 / 仍是 mock / Week 4 优先级」三段诚实收尾——复盘的价值恰恰在于敢写没做完的部分。</span></li></ol>

<h2>值得记住的数字</h2><div class="cards"><div class="card"><div class="num">3 张表</div><p>sessions 登记 / messages 回放 / events 检索。thread_id 在 sessions 里是主键、另两表引用它做外键。</p></div><div class="card"><div class="num">4 个概念</div><p>Session ≠ Memory ≠ Trace ≠ Context：分别管一次任务的对话事件 / 跨会话长期信息 / 运行时遥测审计 / 单次调用拼进的内容。</p></div><div class="card"><div class="num">7 条已完成</div><p>复盘第一段正好对应 Week 3 七天一个模块，每条都写到「做到了什么程度」。</p></div><div class="card"><div class="num">4 条 mock</div><p>指标来自本地模拟数据、SOP 来自内置文本、日志分析是关键词规则、LLM Judge 只预留接口——这就是 Week 4 要补的清单。</p></div></div>

<h2>再多懂一点</h2><ul class="more"><li><strong>「恢复」被拆成可组合的读原语，而不是塞一个 resume 魔法方法。</strong>判断「任务做到哪、哪些动作还 pending」是调用方的职责——存储只负责存取，不负责业务。这是本模块 docstring 写死的定位：「轻量级」「供离线 demo 跨进程恢复」。</li><li><strong>序列化参数是刻意选的，不是默认值。</strong>写入 json.dumps(payload, ensure_ascii=False, sort_keys=True)：中文可读、键序稳定；读出 json.loads 严格互逆。另外每次写入都顺手更新 updated_at，「最后活跃在什么时候」随时可查。</li><li><strong>存储边界写在代码第一行。</strong>docstring 明说只适合单进程低频读写，高并发写要换 PostgreSQL/Redis，接口语义（按 thread_id 读写）不变。Week 3 整周的主线就在这里：把「能跑的 Agent」做成「可交付的 Agent」，Week 4 只做服务化和接真实能力，核心不再变复杂。</li></ul>

<h2>常见疑问</h2><div class="qa"><p class="q">没有 resume(thread_id) 方法，怎么「从断点继续」？</p><p class="a">恢复是三个读操作拼出来的：get_session 当探针判断全新还是续接，get_messages 把对话按真实发生顺序回放，get_events 拿回当时的判定与审批状态。「做到哪、还欠什么」由调用方读出来再决定下一步。</p><p class="q">为什么消息和事件一定要分成两张表？</p><p class="a">因为它们的查询模式完全不同：messages 要按写入顺序整段回放给模型，字段是 role/content；events 要按 event_type 检索、看 JSON 载荷。混在一张表里，要么互相塞满空列，要么查询时到处过滤。SessionRecord 本身也只有三个字段——它只标识「哪个会话存在、活到什么时候」。</p><p class="q">都往 SQLite 里塞，将来并发上去怎么办？这不是把坑留给自己吗？</p><p class="a">边界已经写在类 docstring 里：只适合单进程、低频读写，高并发写请换 PostgreSQL/Redis。SQLite 在这里是刻意的取舍：接口语义不变，实现随时可替换，这正是 Week 4 计划里明确写过的事。</p></div>

<h2>深入入口</h2><p class="deep">对应文字版：Day 21《会话连续性与整合复盘》，见课程 week3-reading/每日正文（本篇代码：agent_app/session.py 与 week3_demo.py；文档：docs/week3-retro.md 与 docs/week4-integration-plan.md）。想再深入了解 Session Lifecycle、长时任务连续性、仓库作系统记录，见八股·08 工程化实践和八股·12 上下文工程。</p>

<nav class="nav"><a href="31-day20-safety-hitl.html"><span class="dir">← 上一章</span>可观测性、HITL 与安全护栏</a><span class="ph next"><span class="dir">下一章 →</span>已是最后一章（系列共 32 章）</span></nav><footer>三十天速成计划 · 图解小白版</footer></div></body></html>
`;export{e as default};
