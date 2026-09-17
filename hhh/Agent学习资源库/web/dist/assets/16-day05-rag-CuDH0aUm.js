const t=`<!DOCTYPE html>
<html lang="zh-CN" style="--accent:#DB2777">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>16 · RAG 基础：先查资料再回答</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:17px;line-height:1.75;color:#24292f;background:#fbfbfc;padding-bottom:56px}.wrap{max-width:760px;margin:0 auto;padding:0 20px}.crumb{font-size:13px;color:#8b95a1;padding:18px 0 0}.chip{display:inline-block;font-size:12px;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:1px 11px;margin-top:14px}.kicker{font-size:12px;letter-spacing:.12em;color:#a0aab6;margin-top:8px}h1{font-size:31px;line-height:1.28;color:#14181f;margin:8px 0 8px}.lede{color:#57606a;margin-bottom:8px}h2{font-size:21px;line-height:1.4;margin:38px 0 12px;padding-left:11px;border-left:4px solid var(--accent)}p{margin:0 0 12px}.note{color:#6e7781;font-size:14px}.card{background:#fff;border:1px solid #e4e8ee;border-radius:10px;padding:14px 16px;margin:12px 0}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px;margin:14px 0}.num{font-size:26px;font-weight:700;color:var(--accent);line-height:1.2}.lab{font-size:13px;color:#6e7781;margin-top:3px}ol.steps{padding-left:22px}ol.steps li{margin-bottom:12px}ul.tight{padding-left:22px}ul.tight li{margin-bottom:9px}.qa{background:#fff;border:1px solid #e4e8ee;border-radius:10px;padding:13px 16px;margin:11px 0}.qa b.q{color:var(--accent)}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.92em;background:#f0f3f6;border-radius:4px;padding:0 5px}nav.pager{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:40px}nav.pager a{flex:1;display:block;padding:11px 14px;border:1px solid #e0e4ea;border-radius:10px;background:#fff;text-decoration:none;color:var(--accent);font-size:15px;line-height:1.45}nav.pager a.next{text-align:right}nav.pager span{text-align:left}.dir{font-size:12px;color:#8b95a1;display:block}footer{margin-top:40px;border-top:1px solid #dde2e8;padding-top:16px;text-align:center;font-size:13px;color:#98a2ad}svg{width:100%;height:auto}</style>
</head>
<body>
<div class="wrap">
<div class="crumb">AI 应用开发工程师三十天速成计划 · Week 1 · Day 04–07 · 给想建立直觉的初学者</div>
<span class="chip">第 16 章 · 共 32 章</span>
<div class="kicker">速成计划 图解</div>
<h1>RAG 基础：先查资料再回答</h1>
<p class="lede">RAG（Retrieval-Augmented Generation，检索增强生成）在回答前先从外部资料里找出相关片段放进上下文，让模型基于证据回答，而不是凭参数记忆编造。</p>

<h2>先打个比方</h2>
<p>像开卷考试：题目答不答得对，一半取决于你翻到的是不是正确的那几页。书翻错了页，再好的脑子也写不出正确答案——这就是 RAG 里"召回"决定答案上限的意思。</p>

<h2>全景图解</h2>
<p>RAG 的核心问题不是"用哪个向量库"，而是"面对一个问题，把哪些资料、以什么粒度放进上下文"。链路分两半：离线的 ingest 建索引，在线的 rag 检索加生成。</p>
<svg viewBox="0 0 720 410" role="img" aria-label="RAG 五步链路示意">
<defs><marker id="d5-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0L8,4.5L0,9z" fill="#57606a"/></marker></defs>
<rect x="20" y="16" width="300" height="30" rx="8" fill="#fdf2f8" stroke="#DB2777"/><text x="170" y="37" text-anchor="middle" font-size="14" font-weight="bold" fill="#831843">离线：ingest.py（先跑一次建索引）</text>
<rect x="20" y="62" width="92" height="66" rx="9" fill="#fff" stroke="#DB2777"/><text x="66" y="88" text-anchor="middle" font-size="13" font-weight="bold">① 切分</text><text x="66" y="107" text-anchor="middle" font-size="11.5" fill="#6e7781">按字符切块</text><text x="66" y="121" text-anchor="middle" font-size="11.5" fill="#6e7781">120 / 重叠 30</text>
<path d="M112,95 L138,95" stroke="#57606a" stroke-width="1.6" marker-end="url(#d5-arrow)"/>
<rect x="140" y="62" width="92" height="66" rx="9" fill="#fff" stroke="#DB2777"/><text x="186" y="84" text-anchor="middle" font-size="13" font-weight="bold">② embedding</text><text x="186" y="103" text-anchor="middle" font-size="11.5" fill="#6e7781">bigram 计数</text><text x="186" y="119" text-anchor="middle" font-size="11.5" fill="#6e7781">+ L2 归一化</text>
<path d="M232,95 L258,95" stroke="#57606a" stroke-width="1.6" marker-end="url(#d5-arrow)"/>
<rect x="260" y="62" width="60" height="66" rx="9" fill="#fff" stroke="#94a3b8"/><text x="290" y="90" text-anchor="middle" font-size="13" font-weight="bold">③ 入库</text><text x="290" y="110" text-anchor="middle" font-size="11.5" fill="#6e7781">vectors.json</text>
<path d="M290,128 L290,168" stroke="#57606a" stroke-width="1.6" marker-end="url(#d5-arrow)"/>
<rect x="380" y="16" width="320" height="30" rx="8" fill="#eff6ff" stroke="#2563eb"/><text x="540" y="37" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e3a8a">在线：rag.py（每次提问执行）</text>
<rect x="400" y="168" width="300" height="56" rx="9" fill="#fff" stroke="#2563eb"/><text x="550" y="192" text-anchor="middle" font-size="13" font-weight="bold">④ 检索 retrieve</text><text x="550" y="212" text-anchor="middle" font-size="12" fill="#6e7781">问题也转向量（复用同一 embed_text）→ 全库算点积</text>
<path d="M320,95 C340,130 420,150 480,166" stroke="#94a3b8" stroke-width="1.4" fill="none" stroke-dasharray="5 4"/>
<path d="M550,224 L550,252" stroke="#57606a" stroke-width="1.6" marker-end="url(#d5-arrow)"/>
<text x="600" y="243" text-anchor="middle" font-size="12" fill="#047857">相似度降序，取 top-3</text>
<rect x="400" y="254" width="300" height="52" rx="9" fill="#fefce8" stroke="#ca8a04"/><text x="550" y="277" text-anchor="middle" font-size="13" font-weight="bold">⑤ 拼进 prompt</text><text x="550" y="296" text-anchor="middle" font-size="12" fill="#713f12">【资料】每段带编号与来源 + 【问题】</text>
<path d="M550,306 L550,332" stroke="#57606a" stroke-width="1.6" marker-end="url(#d5-arrow)"/>
<rect x="360" y="334" width="340" height="58" rx="9" fill="#ecfdf5" stroke="#059669"/><text x="530" y="358" text-anchor="middle" font-size="13" font-weight="bold">生成：call_model 带证据回答</text><text x="530" y="378" text-anchor="middle" font-size="12" fill="#065f46">system 划边界：「资料里没有就说资料中没有提到」</text>
<rect x="20" y="190" width="330" height="200" rx="10" fill="#fff" stroke="#e4e8ee"/><text x="185" y="216" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#be185d">答错了？先看检索到了什么</text><text x="42" y="248" font-size="12.5" fill="#374151">▸ 召回错：检索到的片段就不对，</text><text x="58" y="267" font-size="12.5" fill="#374151">模型再强也没依据</text><text x="42" y="296" font-size="12.5" fill="#374151">▸ 生成错：片段是对的，但模型</text><text x="58" y="315" font-size="12.5" fill="#374151">没正确利用</text><text x="42" y="344" font-size="12.5" fill="#6e7781">代码里回答生成前先打印</text><text x="42" y="362" font-size="12.5" fill="#6e7781">检索阶段，就是为了这个归因。</text>
<rect x="120" y="150" width="150" height="28" rx="14" fill="#fafafa" stroke="#cbd5e1"/><text x="195" y="169" text-anchor="middle" font-size="11.5" fill="#57ab5a">文档没变就不用重建索引</text>
</svg>

<h2>走一遍真实场景</h2>
<ol class="steps">
<li><b>你问："公司的报销流程是什么？"</b><span class="note">没有 RAG 时，模型只能凭训练记忆编一套流程；公司私有文档它根本没见过。</span></li>
<li><b>库里的 4 篇文档早已被 ingest 切块向量化存进 <span class="mono">vectors.json</span>。</b><span class="note">报销流程、员工手册-考勤、设备申请、假期制度——四个字段：来自哪篇、第几段、原文、向量。</span></li>
<li><b>问题用同一个函数转成向量，和每个片段算余弦相似度，取最高的 top-3。</b><span class="note">向量都归一化过，相似度就是简单的点积，全库扫一遍毫秒级。</span></li>
<li><b>把三个片段拼成【资料】块，每条标注出处，再附上你的问题，发给模型。</b><span class="note">模型据此回答"根据员工手册第 3 章……"；也让你在排查时知道每句结论出自哪个文件第几段。</span></li>
</ol>

<h2>值得记住的数字</h2>
<div class="cards">
<div class="card"><div class="num">五步链路</div><div class="lab">切分 → embedding → 入库 → 检索 top-k → 带证据生成</div></div>
<div class="card"><div class="num">120 / 30</div><div class="lab">CHUNK_SIZE 每片 120 字符、CHUNK_OVERLAP 相邻重叠 30 字符（步长 90）</div></div>
<div class="card"><div class="num">top-3</div><div class="lab">TOP_K = 3：召回宁可多找候选，判断交给生成阶段</div></div>
<div class="card"><div class="num">2 类错</div><div class="lab">召回错 vs 生成错——归因永远先看检索到了什么</div></div>
</div>

<h2>再多懂一点</h2>
<ul class="tight">
<li><b>入库和查询必须落在同一个向量空间。</b>问题和文档如果用不同的方式转向量，相似度数值就没有意义——这是检索的一条铁律。<span class="note">教学版用 bigram 字面重合当向量：同义改写（"费用申请" vs "报销"）它就"看不见"了；换真语义 embedding 时只改 embed_text 一个函数，链路其余不动。</span></li>
<li><b>"不许编造"是显式指令，不是道德期待。</b>system prompt 三句话立了边界：基于资料回答、没有就说"资料中没有提到"、不要编造。<span class="note">RAG 能降低幻觉但消除不了：检索错、片段质量差、模型忽略证据都会出错。</span></li>
<li><b>参数没有通用最优值。</b>chunk 太小缺上下文，太大噪音多还占 token；top-k 小了漏信息，大了塞进无关内容干扰模型；overlap 防止一句话被拦腰切断时丢衔接。<span class="note">复杂场景可再加一层精排（rerank），第一版可以不做，但要观察 top-k 变化对答案的影响。</span></li>
</ul>

<h2>常见疑问</h2>
<div class="qa"><p><b class="q">Q：用了 RAG 是不是就等于上了保险，模型不会再胡说？</b></p><p>A：不是。RAG 只保证模型"有东西可依"，不保证它一定依据得对。所以答案要能溯源（编号和来源标注）、答错时要先看检索结果再下结论——这套习惯才是兜底的部分。</p></div>
<div class="qa"><p><b class="q">Q：为什么"入库"只是一个 JSON 文件，不是真的向量数据库？</b></p><p>A：教学版诚实地说了这点：几十个 chunk 全量扫点积很快，JSON 够用。真正的向量库（Chroma、FAISS）负责大规模存储和近似检索，换库只改 load_vectors 的读法，链路形状不变。</p></div>
<div class="qa"><p><b class="q">Q：质疑一下——RAG 上线后维护成本是不是被低估了？</b></p><p>A：确实容易被低估。chunk 参数要按文档类型调，文档一变就要重建索引，评测还要专门设计。原文章的立场很清楚：这些成本买来的是"回答有据可查"，比起让模型对着企业私有数据硬编，这是值得付的钱，但你要知道自己在付什么。</p></div>

<h2>深入入口</h2>
<p>对应文字版：Day 05《RAG 基础》，见课程 week1-reading/每日正文。RAG vs 微调 vs 长上下文的权衡、rerank、查询改写、GraphRAG 等，见配套八股·03 RAG 技术。</p>

<nav class="pager"><a href="15-day04-tool-calling.html"><span class="dir">上一章</span>工具调用 Tool Calling</a><a class="next" href="17-day06-frameworks.html"><span class="dir">下一章</span>框架对比：各自解决什么问题</a></nav>
<footer>三十天速成计划 · 图解小白版</footer>
</div>
</body>
</html>
`;export{t as default};
