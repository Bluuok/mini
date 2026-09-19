#!/usr/bin/env python3
"""Check resume material consistency, not product execution or personal authorship."""

from __future__ import annotations
import argparse
import hashlib
import json
import re
from html import unescape
from pathlib import Path

BASE = "7fa4b34a08ba42867a4c39d2a705aee503654e92"
HTML_BLOB = "09e579edc66eed1c5244a7dee957718a0a08fccd"
PREV_BASE = "7c19a61181335f0c5b50e6ce92fa35d61fbb8a82"
PREV_HTML_BLOB = "211398bef953cb0c87a4a4e28f74868ae5540b31"
CURRENT_STATUS = "source_supported_user_attested_reproduction"
ATTESTATION = "修改/复审-2026-09-19/用户确认与使用边界.md"


def git_blob(data: bytes) -> str:
    # Git text blobs use LF; allow Windows checkout CRLF without accepting text changes.
    data = data.replace(b"\r\n", b"\n")
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()


def validate(root: Path, external_files: frozenset[str] = frozenset()) -> dict:
    checks = []

    def check(name, ok, detail=""):
        checks.append({"name": name, "ok": bool(ok), "detail": detail})

    def text(path):
        return (root / path).read_text(encoding="utf-8-sig")

    def read(path):
        return json.loads(text(path))

    try:
        c = Path("修改/CraftAgent")
        h = Path("修改/HappyClaw")
        mapping = read("修改/复审-2026-09-19/claim-map.json")
        baseline = read("修改/复审-2026-09-19/material-baseline.json")
        old_map = read("修改/复审-2026-09-18/claim-map.json")
        old_ver = read("修改/复审-2026-09-18/verification.json")
        model = read(c / "audit/agent-project-model.json")
        ledger = read(c / "audit/claim-evidence-ledger.json")
        happy = read(h / "claims.json")
        hqa = read(h / "qa.json")
        hdata = read(h / "resume-data.json")
        he = read(h / "evidence/evidence-index.json")
        ce = read(c / "audit/sources.json")
        cqa = read(c / "audit/qa-map.json")
        data = (root / "简历-AI应用开发.html").read_bytes()
        html = data.decode("utf-8")
        visible = unescape(re.sub(r"<[^>]+>", "", html))
        check(
            "baseline_pinned",
            mapping["material_base"] == BASE == baseline["material_base"]
            and baseline["review_date"] == "2026-09-19"
            and baseline["previous_html_blob"] == PREV_HTML_BLOB
            and baseline["source_commits"] == mapping["source_commits"],
        )
        # The saved review declares independent agent review; this script itself runs no agents.
        check(
            "review_not_misattributed",
            mapping["independent_agents_executed"] is True
            and mapping["business_tests_executed"] is False
            and mapping["review_date"] == "2026-09-19",
            "declaration in saved review; script executes no agents",
        )
        # Preserve the key historical declarations; full-file preservation needs a diff audit.
        check(
            "history_2026-09-18_flags_preserved",
            old_map["independent_agents_executed"] is False
            and old_map["business_tests_executed"] is False
            and old_map["material_base"] == PREV_BASE
            and old_ver["independent_agents_executed"] is False,
        )
        check("html_preserved", git_blob(data) == baseline["html_blob"] == HTML_BLOB)
        check(
            "html_mirror",
            data.replace(b"\r\n", b"\n")
            == (root / "修改/简历/简历-AI应用开发-合并修订版.html")
            .read_bytes()
            .replace(b"\r\n", b"\n"),
        )
        craft_rows = [r for r in mapping["claims"] if r["project"] == "ThreadCove"]
        happy_rows = [r for r in mapping["claims"] if r["project"] == "Clawtide"]
        check(
            "ten_unique_mappings",
            len(mapping["claims"]) == 10
            and len({x["claim"] for x in mapping["claims"]}) == 10
            and len(craft_rows) == 5
            and len({r["claim"] for r in craft_rows}) == 5
            and len(happy_rows) == 5
            and len({r["claim"] for r in happy_rows}) == 5,
        )
        check(
            "mapping_status_current",
            all(r["status"] == CURRENT_STATUS for r in mapping["claims"]),
        )
        artifacts = {a["id"]: a for a in model["artifacts"]}
        cc = {x["id"]: x for x in ledger["claims"]}
        hc = {x["id"]: x for x in happy["claims"]}
        core_ids = [r["claim"] for r in craft_rows]
        core_claims = [cc[i] for i in core_ids]
        core_ok = all(
            "resume_final" in x["allowed_uses"]
            and x["claim_basis"] == "user_attested"
            and x["attribution_scope"] == "personal"
            and x["verification_status"] == "confirmed"
            for x in core_claims
        )
        noncore_ok = all(
            "resume_final" not in x["allowed_uses"]
            for x in cc.values()
            if x["id"] not in core_ids
        )
        selected_artifacts = {a for x in core_claims for a in x["artifact_refs"]}
        check(
            "craft_gate",
            core_ok
            and noncore_ok
            and all(
                artifacts[a]["ownership"] in {"participated", "owner", "collaborated"}
                for a in selected_artifacts
            ),
        )
        check(
            "attestation_binding",
            mapping.get("ownership_basis") == "user_attested_reproduction"
            and mapping.get("ownership_attestation") == ATTESTATION
            and model.get("ownership_attestation") == ATTESTATION,
        )
        check(
            "happy_attestation",
            all(
                x["personal_attribution"].startswith("user_attested_reproduction")
                and x["resume_usage"] == "personal_reproduction_implementation"
                and x["ownership_evidence"] == ATTESTATION
                for x in happy["claims"]
            ),
        )
        check(
            "source_pins",
            ce["ref"] == mapping["source_commits"]["ThreadCove"]
            and happy["source_commit"]
            == hqa["source_commit"]
            == he["source_commit"]
            == mapping["source_commits"]["Clawtide"],
        )
        cs = text(c / "Craft-简历片段.md")
        hs = text(h / "HappyClaw-简历片段.md")
        check(
            "five_bullets_each",
            len(re.findall(r"^- \*\*", cs, re.M)) == 5
            and len(re.findall(r"^- \*\*", hs, re.M)) == 5,
        )
        for row in mapping["claims"]:
            is_craft = row["project"] == "ThreadCove"
            item = (cc if is_craft else hc)[row["claim"]]
            wording = item["candidate_wording"]
            clean = wording.replace("**", "")
            snippet = cs if is_craft else hs
            card = text("Craft-定稿.md" if is_craft else "HappyClaw-定稿.md")
            check(
                row["claim"] + ":wording",
                wording in snippet and wording in card and clean in visible,
            )
            check(
                row["claim"] + ":clean",
                not re.search(r"\b(?:R|RT|H|S)\d{2}\b|claim-|route_id", clean),
            )
            refs = (
                row.get("artifact_refs", [])
                if is_craft
                else row.get("evidence_refs", [])
            )
            item_refs = item["artifact_refs" if is_craft else "evidence_refs"]
            check(
                row["claim"] + ":refs",
                bool(refs)
                and len(refs) == len(set(refs))
                and set(refs) == set(item_refs),
            )
            story, section = row["story"].split("::")
            qa, group = row["qa"].split("::")
            check(row["claim"] + ":story", section in text(story))
            qids = re.findall(
                r"^#{2,6} (" + re.escape(group) + r"\.[123])\s", text(qa), re.M
            )
            check(row["claim"] + ":three_qa", len(set(qids)) == 3)
            if is_craft:
                check(
                    row["claim"] + ":artifacts",
                    set(row["artifact_refs"]) <= artifacts.keys(),
                )
            else:
                check(
                    row["claim"] + ":evidence",
                    set(row["evidence_refs"]) <= {e["id"] for e in he["evidence"]},
                )
        check(
            "craft_qa_index",
            len(cqa) == 5 and sum(len(q["questions"]) for q in cqa) == 15,
        )
        check(
            "happy_qa_index",
            len(hqa["questions"]) == 15
            and all(
                q["id"] in text(h / "HappyClaw-面试QA.md") for q in hqa["questions"]
            ),
        )
        check(
            "happy_four_fields",
            all(hdata.get(k) for k in ("name", "summary", "stack", "position")),
        )
        check(
            "happy_wording",
            all(
                b["text"] in hs
                and all(w in b["text"] for w in ("针对", "基于", "设计了", "实现了"))
                for b in hdata["bullets"]
            ),
        )
        check(
            "happy_qa_four_parts",
            all(
                "## Part " + str(i) in text(h / "HappyClaw-面试QA.md")
                for i in range(1, 5)
            ),
        )
        full_story = text(h / "HappyClaw-故事.md")
        craft_story = text(c / "Craft-故事.md")
        tiers = (r"30\s*秒\s*摘要", r"90\s*秒\s*讲法", r"3\s*分钟\s*讲法")
        check(
            "story_tier_headings",
            all(
                len(re.findall(t, story)) >= 5
                for story in (craft_story, full_story)
                for t in tiers
            ),
        )
        check(
            "happy_nine_stages",
            "## 九阶段主线" in full_story
            and all("| " + str(i) + " " in full_story for i in range(9)),
        )
        for path in ("Craft-故事.md", "HappyClaw-故事.md"):
            check(
                path + ":eight_modules",
                all("## M" + str(i) + " " in text(path) for i in range(1, 9)),
            )
        records = read(h / "fixtures/待执行记录.json")
        check(
            "fixtures_not_results",
            len(records) == 12
            and all(
                x["status"] == "not_run" and x["observed"] is None for x in records
            ),
        )
        check(
            "happy_execution_claims",
            all(
                x["test_execution"] == "not_run_this_revision" for x in happy["claims"]
            ),
        )
        # Only current entry links: archived historical text may intentionally retain old paths.
        paths = (
            "README.md",
            "Craft-定稿.md",
            "Craft-故事.md",
            "HappyClaw-定稿.md",
            "HappyClaw-故事.md",
            "三项目联动-步6.md",
            "修改/README.md",
            "修改/复审-2026-09-18/README.md",
            "修改/复审-2026-09-19/README.md",
            ATTESTATION,
        )
        broken = []
        for path in paths:
            for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", text(path)):
                if re.match(r"https?://|#", target):
                    continue
                file = target.split("#", 1)[0]
                if file:
                    resolved = (root / path).parent.joinpath(file).resolve()
                    relative = resolved.relative_to(root.resolve()).as_posix()
                    if not resolved.is_file() and relative not in external_files:
                        broken.append(path + " -> " + target)
        check("current_entry_links", not broken, broken)
    except (OSError, KeyError, TypeError, ValueError) as exc:
        check("complete_read", False, str(exc))
    # independent_agents_executed=False = this script ran no agents; saved review declaration is separate.
    return {
        "scope": "material structure/wording/links only; structural checks do not certify semantic support, product behavior, or independently verified authorship",
        "ok": all(c["ok"] for c in checks),
        "check_count": len(checks),
        "checks": checks,
        "business_tests_executed": False,
        "independent_agents_executed": False,
        "personal_authorship_verified": False,
        "semantic_support_verified": False,
        "external_link_targets": sorted(external_files),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root", type=Path, default=Path(__file__).resolve().parents[1]
    )
    parser.add_argument("--output", type=Path)
    parser.add_argument(
        "--external-file",
        action="append",
        default=[],
        help="Link target independently verified in the remote tree; for partial working copies only",
    )
    args = parser.parse_args()
    result = validate(args.root.resolve(), frozenset(args.external_file))
    payload = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(payload, encoding="utf-8")
    print(payload, end="")
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
