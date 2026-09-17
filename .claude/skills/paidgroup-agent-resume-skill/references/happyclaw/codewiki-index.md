# CodeWiki Index

> 本 skill 不含捆绑的 `references/wiki/` 目录。全量 codewiki 按运行时定位读取：默认 `03-定稿/付费群文档汇总/三项目codewiki/happyclaw-main/`（01-30 编号 md，可用 `wiki.json` 做 slug→文件映射），找不到时询问用户实际路径。下表 Source File 是原捆绑 wiki 的文件名，运行时按编号+主题匹配（如“Agent-First 三层模型”→“06-智能体-工作区-会话三层模型.md”）。

Use this file only when the user asks for deep explanation, source-backed verification, stronger interview prep, or bullet optimization. Locate the relevant `Wxx` section first, then read only the matching runtime file.

## Topic Map

| Wxx | Topic | Related Points | Source File |
| --- | --- | --- | --- |
| W00 | 概述与概念图 | R02 | `wiki/1-gai-shu-happyclaw-shi-shi-yao-yu-wei-shi-yao.md` |
| W01 | 快速开始 | R02 | `wiki/2-kuai-su-kai-shi-cong-ling-da-jian-dao-shou-ci-dui-hua.md` |
| W02 | 系统要求与开发环境 | R02 R24 | `wiki/3-xi-tong-yao-qiu-yu-kai-fa-huan-jing-da-jian.md` |
| W03 | Provider 配置与负载均衡 | R11 R12 | `wiki/4-provider-pei-zhi-yu-duo-mo-xing-fu-zai-jun-heng.md` |
| W04 | 渠道接入 7 大 IM | R07 | `wiki/5-qu-dao-jie-ru-fei-shu-telegram-qq-ding-ding-wei-xin-discord-whatsapp-ji-cheng.md` |
| W05 | Agent-First 三层模型 | R01 | `wiki/6-agent-first-san-ceng-mo-xing-agent-workspace-runtime-session.md` |
| W06 | Agent Runner 执行引擎 | R03 | `wiki/7-agent-runner-zhi-xing-yin-qing-host-mo-shi-yu-container-mo-shi.md` |
| W07 | 多渠道 IM 系统架构 | R07 R08 R09 R10 | `wiki/8-duo-qu-dao-im-xi-tong-jia-gou-yu-xiao-xi-lu-you.md` |
| W08 | Web API 路由体系 | R18 | `wiki/9-web-api-lu-you-ti-xi-yu-hono-kuang-jia-shi-jian.md` |
| W09 | 认证与会话管理 | R12 R19 R20 | `wiki/10-ren-zheng-yu-hui-hua-guan-li-cookie-session-permission-middleware-yu-acl-quan-xian-ju-zhen.md` |
| W10 | SQLite Schema 与迁移 | R13 | `wiki/11-sqlite-shu-ju-ku-schema-yu-ban-ben-hua-qian-yi-ce-lue.md` |
| W11 | 定时任务调度器 | R14 | `wiki/12-ding-shi-ren-wu-diao-du-qi-cron-jian-ge-yu-ci-xing-ren-wu.md` |
| W12 | Agent Profile 与 Prompt 工程 | R15 | `wiki/13-agent-profile-she-ji-yu-si-duan-shi-prompt-gong-cheng.md` |
| W13 | Skills/MCP/Plugins 管理 | R16 | `wiki/14-skills-mcp-server-yu-claude-code-plugins-neng-li-fen-ceng-guan-li.md` |
| W14 | 对话式 Agent Builder | R17 | `wiki/15-dui-hua-shi-agent-builder-duo-lun-jiao-hu-chuang-jian-yu-bian-ji-agent.md` |
| W15 | Docker 容器执行环境 | R03 R04 | `wiki/16-docker-rong-qi-zhi-xing-huan-jing-gua-zai-an-quan-ge-chi-yu-jing-xiang-gou-jian.md` |
| W16 | 运行时 IPC 协议 | R05 | `wiki/17-yun-xing-shi-ipc-xie-yi-agent-runner-yu-zhu-jin-cheng-tong-xin-ji-zhi.md` |
| W17 | StreamEvent 事件流系统 | R06 | `wiki/18-streamevent-shi-shi-shi-jian-liu-xi-tong-cong-qian-duan-dao-runner-duan-dao-duan-tong-bu.md` |
| W18 | React 前端架构 | R21 | `wiki/19-react-qian-duan-jia-gou-lu-you-zhuang-tai-guan-li-yu-zu-jian-shu.md` |
| W19 | 实时流式输出 | R22 | `wiki/20-shi-shi-liu-shi-shu-chu-yu-gong-ju-gui-ji-zhan-shi.md` |
| W20 | 用量统计与计费 | (background context) | `wiki/21-yong-liang-tong-ji-yu-ji-fei-xi-tong-she-ji.md` |
| W21 | 多租户安全隔离 | R20 R23 | `wiki/22-duo-zu-hu-an-quan-ge-chi-host-zhi-xing-quan-xian-zi-yuan-ge-chi-yu-min-gan-cao-zuo-bao-hu.md` |
| W22 | 开发工作流 | R24 | `wiki/23-kai-fa-gong-zuo-liu-lei-xing-jian-cha-ce-shi-ti-xi-ci-yu-ti-jiao-gui-fan.md` |

## Deep-Dive Procedure

1. Identify the `Rxx` the user wants to deep-dive.
2. Look up the corresponding `Wxx` in the Topic Map above.
3. Read only the matching runtime file(s) (by number + topic) from the codewiki runtime directory, per the note above.
4. If multiple `Wxx` map to the same point, read all listed files.
5. Cross-reference the four-segment answer structure (problem / implementation / tradeoff / limitation).

## Resume Verification Rule

- Do not load wiki files during normal resume generation.
- For deep dives, locate the `Wxx` section first, then read only the matching wiki file.
- If the wiki evidence describes design, architecture, or possible extension rather than implemented behavior, phrase it as design understanding or extensibility, not completed production work.
- Do not present channel capabilities as "all 7 channels fully implemented with identical features" -- the wiki documents capability differences (e.g., WeChat is P2P only, WhatsApp uses reverse protocol with ban risk).
