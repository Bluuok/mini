const t=`<!DOCTYPE html><html lang="zh-CN" style="--accent:#E11D48"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第 31 章 · 可观测性、HITL 与安全护栏 · 图解</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.8;color:#26292e;background:#f6f6f8;padding:28px 14px}
.page{max-width:780px;margin:0 auto;background:#fff;border-radius:14px;padding:38px 36px 30px;box-shadow:0 2px 14px rgba(0,0,0,.07)}
.crumb{font-size:13px;color:#8b909a;margin-bottom:16px}
.chip{display:inline-block;background:var(--accent);color:#fff;font-size:13px;font-weight:600;padding:3px 13px;border-radius:999px}
.kicker{margin:14px 0 4px;color:var(--accent);font-size:13px;font-weight:700;letter-spacing:.14em}
h1{font-size:30px;line-height:1.35;margin-bottom:8px}
.lede{color:#5a5f68;font-size:17px;margin-bottom:22px}
h2{font-size:20px;margin:30px 0 12px;padding-left:11px;border-left:4px solid var(--accent);line-height:1.5}
.metaphor{background:#fdf2f5;border:1px solid #f2cdd7;border-radius:10px;padding:14px 18px;font-size:16px;color:#4c4f56}
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
.nav a{flex:1;display:block;padding:12px 14px;border:1px solid #e7e9ee;border-radius:10px;text-decoration:none;font-size:14px;line-height:1.6;color:#26292e;background:#fff}
.nav a:hover{border-color:var(--accent)}
.nav .dir{display:block;font-size:12px;color:#8b909a}
.nav .next{text-align:right}
footer{text-align:center;font-size:13px;color:#a0a5ae;margin-top:24px}
@media(max-width:600px){.page{padding:26px 18px}}
</style></head><body><div class="page"><div class="crumb">AI 应用开发工程师三十天速成计划 · Week 3 · 给想建立直觉的初学者</div><span class="chip">第 31 章 · 共 32 章</span><p class="kicker">速成计划 图解</p><h1>可观测性、HITL 与安全护栏</h1><p class="lede">能跑通不等于能交付：让结论可还原（观测）、高危动作先停下来等人确认（HITL）、越权请求在代码层拦住（护栏）。三者齐备，Agent 才「可还原、可暂停、可拒绝」。</p>

<h2>先打个比方</h2><p class="metaphor">机场安检：每位旅客都过同一套金属探测和行李扫描——这是护栏，确定性规则，条条输入必过；发现可疑物品不当场处置，而是扣下来交值班主管裁决——这是 HITL；全程监控录像逐帧留存备查——这是 trace。规则是死的，签字权在人。</p>

<h2>全景图解</h2><figure><svg viewBox="0 0 760 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="左侧护栏三值裁决链与右侧可观测事件流"><defs><marker id="p31arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9aa0a6"/></marker><marker id="p31ac" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#E11D48"/></marker><marker id="p31gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9aa0a6"/></marker></defs><g font-size="13"><rect x="15" y="16" width="350" height="34" rx="7" fill="#fdf2f5"/><text x="190" y="38" text-anchor="middle" font-weight="700" fill="#a41234">进门之前 · 护栏裁决链</text><rect x="395" y="16" width="350" height="34" rx="7" fill="#fdf2f5"/><text x="570" y="38" text-anchor="middle" font-weight="700" fill="#a41234">运行之中 · 可观测事件流</text>

<rect x="15" y="62" width="350" height="46" rx="8" fill="#fbfbfc" stroke="#d4d7de"/><text x="190" y="82" text-anchor="middle" font-weight="600" fill="#333">用户输入 · 唯一入口</text><text x="190" y="100" text-anchor="middle" font-size="11" fill="#777">第一步永远先脱敏 → 命中串换成 [REDACTED]</text><line x1="190" y1="108" x2="190" y2="128" stroke="#9aa0a6" stroke-width="1.4" marker-end="url(#p31arr)"/>

<rect x="15" y="130" width="350" height="52" rx="8" fill="#fff" stroke="#E11D48" stroke-width="1.5"/><text x="190" y="150" text-anchor="middle" font-weight="700" fill="#a41234">① 含敏感信息？→ block</text><text x="190" y="170" text-anchor="middle" font-size="11" fill="#777">密钥（值≥12位）/ 手机号 / 身份证 —— 最硬的一关</text>

<line x1="95" y1="182" x2="95" y2="208" stroke="#9aa0a6" stroke-width="1.4"/><text x="103" y="200" font-size="10.5" fill="#999">未命中</text><path d="M95 210 L118 222" stroke="none"/>

<rect x="15" y="210" width="350" height="52" rx="8" fill="#fff" stroke="#E11D48" stroke-width="1.5"/><text x="190" y="230" text-anchor="middle" font-weight="700" fill="#a41234">② 危险动作？→ needs_approval</text><text x="190" y="250" text-anchor="middle" font-size="11" fill="#777">rm -rf、重启、回滚… 挂起等人批，不执行</text>

<rect x="395" y="130" width="350" height="60" rx="8" fill="#fbfbfc" stroke="#d4d7de"/><text x="570" y="150" text-anchor="middle" font-weight="700" fill="#333">HITL 审批单据 ApprovalRequest</text><text x="570" y="170" text-anchor="middle" font-size="11" fill="#777">状态机 pending → approved / rejected</text><text x="570" y="185" text-anchor="middle" font-size="11" fill="#777">一创建就在等待中；批准/拒绝是唯一出口</text><line x1="365" y1="236" x2="391" y2="176" stroke="#9aa0a6" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#p31arr)"/>

<rect x="395" y="220" width="350" height="86" rx="8" fill="#fff" stroke="#E11D48" stroke-width="1.5"/><text x="570" y="243" text-anchor="middle" font-weight="700" fill="#a41234">Agent 运行中的每一步都被记录</text><text x="570" y="263" text-anchor="middle" font-size="11" fill="#777">tool_call 字段钉死：name/arguments/ok/result_preview</text><text x="570" y="280" text-anchor="middle" font-size="11" fill="#777">llm_call 记 model 与 input/output/total_tokens</text><text x="570" y="297" text-anchor="middle" font-size="11" fill="#777">timed() 自动记耗时，异常照常上抛不吞掉</text>

<line x1="105" y1="262" x2="105" y2="290" stroke="#9aa0a6" stroke-width="1.4"/><text x="113" y="281" font-size="10.5" fill="#999">未命中</text>

<rect x="15" y="292" width="350" height="52" rx="8" fill="#fff" stroke="#d4d7de"/><text x="190" y="312" text-anchor="middle" font-weight="700" fill="#333">③ 聊出诊断范围？→ block</text><text x="190" y="332" text-anchor="middle" font-size="11" fill="#777">该 Agent 只管故障诊断，范围外拦截（out_of_scope）</text>

<line x1="395" y1="306" x2="369" y2="336" stroke="#9aa0a6" stroke-width="1.4" marker-end="url(#p31arr)"/><rect x="240" y="338" width="135" height="40" rx="8" fill="#f4f8ef" stroke="#33691E" stroke-width="1.3"/><text x="307" y="356" text-anchor="middle" font-size="12" font-weight="700" fill="#33581c">allow 放行</text><text x="307" y="371" text-anchor="middle" font-size="10" fill="#777">进入 Agent 正常执行</text>

<line x1="570" y1="306" x2="570" y2="330" stroke="#E11D48" stroke-width="1.4" marker-end="url(#p31ac)"/><rect x="395" y="332" width="350" height="72" rx="8" fill="#fbfbfc" stroke="#d4d7de"/><text x="570" y="353" text-anchor="middle" font-weight="700" fill="#333">TraceRecorder 事件序列</text><text x="570" y="372" text-anchor="middle" font-size="11" fill="#777">RuntimeEvent：event_type＋payload＋UTC 时间戳</text><text x="570" y="388" text-anchor="middle" font-size="11" fill="#777">trace_id 注入每条 payload；长文本超 500 字符截断</text><line x1="570" y1="404" x2="570" y2="424" stroke="#9aa0a6" stroke-width="1.4" marker-end="url(#p31arr)"/><rect x="395" y="426" width="350" height="64" rx="8" fill="#fff" stroke="#E11D48" stroke-width="1.3" stroke-dasharray="6 4"/><text x="570" y="447" text-anchor="middle" font-weight="700" fill="#a41234">JSONL 落盘 · 一行一条事件</text><text x="570" y="466" text-anchor="middle" font-size="11" fill="#777">用途①：还原「结论怎么来的」失败归因</text><text x="570" y="481" text-anchor="middle" font-size="11" fill="#777">用途②：Day 19 评测 bad case 归因的依据</text>

<rect x="15" y="420" width="360" height="70" rx="8" fill="#fdf2f5" stroke="#E11D48" stroke-width="1.3" stroke-dasharray="6 4"/><text x="195" y="444" text-anchor="middle" font-weight="700" fill="#a41234">模型不是安全边界</text><text x="195" y="464" text-anchor="middle" font-size="11" fill="#777">Prompt 是软约束，模型可能不听；</text><text x="195" y="480" text-anchor="middle" font-size="11" fill="#777">权限与护栏是代码层的硬边界，判定确定、零成本</text></g></svg><figcaption>左：每条输入过同一套确定性裁决（敏感→危险→范围）；右：放行后的运行全程变成带 trace_id 的结构化事件</figcaption></figure>

<h2>走一遍真实场景</h2><ol class="steps"><li><strong>用户敲进一句话，先脱敏再裁决。</strong><span class="note">evaluate_user_input 是所有输入的唯一入口：无论最后走哪个分支，下游拿到的都是脱敏后的文本——密钥、手机号、身份证永远不上磁盘、也不进审批单。</span></li><li><strong>三层判定按安全优先级排序。</strong><span class="note">一条「带着密钥的删除请求」若先走审批，密钥就进了审批单——所以敏感信息最硬、直接 block；其次危险动作转 HITL；再次范围外 block；全部通过才 allow。顺序错了就会漏掉脱敏。</span></li><li><strong>危险动作生成一张「审批单据」，挂起而不是执行。</strong><span class="note">ApprovalRequest 一创建就在 pending 状态，没有中间态；人工 decide 之后才变 approved 或 rejected——批准/拒绝是状态的唯一出口，最终责任留在人手里。</span></li><li><strong>放行的输入交给 Agent，过程被逐步记录。</strong><span class="note">工具调用与模型调用各有专用方法钉死字段格式（谁调用都得按这个来），trace_id 自动注入每条 payload，把散落的事件粘成一次任务的完整时间线。</span></li><li><strong>事件落盘成 JSONL 文件。</strong><span class="note">一行一事件、键有序可 diff；payload 里超 500 字符的长文本截断留预览加标记——观测的目标是还原结论，不是把工具的全量输出再存一份成磁盘炸弹。</span></li></ol>

<h2>值得记住的数字</h2><div class="cards"><div class="card"><div class="num">3 个词</div><p>整个护栏系统的词汇表只有三个值：allow / block / needs_approval，所有判定最后都归约到它。</p></div><div class="card"><div class="num">3 条正则</div><p>抓三类敏感信息：密钥（值至少 12 位防误伤）、大陆手机号、18 位身份证号（末位可为 X）。</p></div><div class="card"><div class="num">13 个词</div><p>中英混合的危险动作关键词表：rm -rf、kubectl delete、drop table、重启、回滚、删除、扩容、缩容……</p></div><div class="card"><div class="num">500 字符</div><p>payload 默认截断阈值，外加统一 UTC 时间戳跨时区对账无歧义。</p></div></div>

<h2>再多懂一点</h2><ul class="more"><li><strong>大小写也要防变体绕过。</strong>危险词匹配前先统一转小写再查——否则 RESTART 这种大写变体就能穿过关键词表。硬边界必须对变体也硬，这一行 lower() 不是可有可无的风格问题。</li><li><strong>护栏为什么不用大模型判断？</strong>它要在每一条输入上跑：如果每次都花一次 LLM 调用，护栏自己就成了最贵也最不确定的一环。确定性规则可能漏网，漏网由 HITL 兜住——这就是纵深防御：规则先拦一层，人工再兜一层。</li><li><strong>日志、trace、指标是一份数据的三种视角。</strong>事件本身是日志；靠 trace_id 串起来就是「一次任务的完整故事」即 trace；落盘后按 event_type 聚合就是指标（如今天平均花了多少 token）。这也是字段要统一、时间戳要用 UTC 的原因。</li></ul>

<h2>常见疑问</h2><div class="qa"><p class="q">脱敏为什么单独一个函数？拦截时顺便做不行吗？</p><p class="a">不行，两者职责不同：拦截之后往往还要留记录，否则「为什么拦」无从追溯，而留下的必须是干净版本。contains_sensitive 负责说「拦」，mask_sensitive 保证「留的东西干净」。</p><p class="q">加了这么多关卡，正常用户会不会被误伤？</p><p class="a">可能会有——这正是规则护栏的代价。所以三值里才有 needs_approval 这个中间态：拿不准的动作不直接拦死，而是挂起等人裁决；宁可多问一句人，也不能放走删库请求。</p><p class="q">能不能只靠 prompt 写一句「不要执行危险操作」就完事？</p><p class="a">不能。「用户说顺便把生产库删了，模型可能照做」就是本篇开头的例子。Prompt 是软约束，模型可能不听；删除、重启这类事必须在代码层用确定性规则拦住或挂起——这就是「模型不是安全边界」的全部含义。</p></div>

<h2>深入入口</h2><p class="deep">对应文字版：Day 20《可观测性、HITL 与安全护栏》，见课程 week3-reading/每日正文（本篇代码：agent_app/observability.py 与 agent_app/guardrails.py）。想再深入了解权限五对象（身份/资源/动作/策略/审计）、CLI 六层纵深防御、trace/span，见八股·11 Agent 权限设计和八股·08 工程化实践。</p>

<nav class="nav"><a href="30-day19-evals.html"><span class="dir">← 上一章</span>评测体系</a><a class="next" href="32-day21-session-review.html"><span class="dir">下一章 →</span>会话连续性与整合复盘</a></nav><footer>三十天速成计划 · 图解小白版</footer></div></body></html>
`;export{t as default};
