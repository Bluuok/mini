#!/usr/bin/env python3
"""Validate an exported interview Session Ledger."""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any


STATUSES = {"verified", "partial", "unverified", "contradictory", "not_covered"}
FEEDBACK_POLICIES = {"deferred", "immediate"}
HINT_POLICIES = {"on_request", "available"}
REQUIRED_SESSION = {
    "session_id", "role", "round", "duration_minutes", "feedback_policy",
    "hint_policy", "max_followups_per_claim", "updated_at",
}
REQUIRED_CLAIM = {
    "claim_id", "status", "evidence_found", "missing", "contradictions",
    "followup_depth", "last_question_id",
}


def _strings(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, list):
        errors.append(f"{path} 必须是数组")
        return
    for index, item in enumerate(value):
        if not isinstance(item, str) or not item.strip():
            errors.append(f"{path}[{index}] 必须是非空字符串")


def _date(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        errors.append(f"{path} 必须是 YYYY-MM-DD")
        return
    try:
        date.fromisoformat(value)
    except ValueError:
        errors.append(f"{path} 不是合法日期")


def validate_session(document: Any) -> tuple[int, list[str]]:
    errors: list[str] = []
    if not isinstance(document, dict):
        return 0, ["文档根节点必须是对象"]
    if document.get("schema_version") != 1:
        errors.append("schema_version 必须是 1")
    session = document.get("session")
    if not isinstance(session, dict):
        errors.append("session 必须是对象")
    else:
        missing = REQUIRED_SESSION - set(session)
        if missing:
            errors.append(f"session 缺少字段：{sorted(missing)}")
        if not isinstance(session.get("session_id"), str) or not session.get("session_id", "").strip():
            errors.append("session.session_id 必须是非空字符串")
        if not isinstance(session.get("duration_minutes"), int) or session.get("duration_minutes", 0) <= 0:
            errors.append("session.duration_minutes 必须是正整数")
        if session.get("feedback_policy") not in FEEDBACK_POLICIES:
            errors.append("session.feedback_policy 非法")
        if session.get("hint_policy") not in HINT_POLICIES:
            errors.append("session.hint_policy 非法")
        if not isinstance(session.get("max_followups_per_claim"), int) or session.get("max_followups_per_claim", -1) < 0:
            errors.append("session.max_followups_per_claim 必须是非负整数")
        if "updated_at" in session:
            _date(session["updated_at"], "session.updated_at", errors)
    claims = document.get("claims")
    if not isinstance(claims, list):
        errors.append("claims 必须是数组")
        return 0, errors
    seen: set[str] = set()
    for index, claim in enumerate(claims):
        path = f"claims[{index}]"
        if not isinstance(claim, dict):
            errors.append(f"{path} 必须是对象")
            continue
        missing = REQUIRED_CLAIM - set(claim)
        if missing:
            errors.append(f"{path} 缺少字段：{sorted(missing)}")
        claim_id = claim.get("claim_id")
        if not isinstance(claim_id, str) or not claim_id.strip():
            errors.append(f"{path}.claim_id 必须是非空字符串")
        elif claim_id in seen:
            errors.append(f"{path}.claim_id 重复：{claim_id}")
        else:
            seen.add(claim_id)
        if claim.get("status") not in STATUSES:
            errors.append(f"{path}.status 非法")
        for field in ("evidence_found", "missing", "contradictions"):
            if field in claim:
                _strings(claim[field], f"{path}.{field}", errors)
        if not isinstance(claim.get("followup_depth"), int) or claim.get("followup_depth", -1) < 0:
            errors.append(f"{path}.followup_depth 必须是非负整数")
        if not isinstance(claim.get("last_question_id"), str) or not claim.get("last_question_id", "").strip():
            errors.append(f"{path}.last_question_id 必须是非空字符串")
    return len(claims), errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="校验面试 Session Ledger。")
    parser.add_argument("session", type=Path)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args(argv)
    try:
        document = json.loads(args.session.read_text(encoding="utf-8-sig"))
        count, errors = validate_session(document)
    except OSError as exc:
        count, errors = 0, [f"无法读取 {args.session}：{exc}"]
    except (UnicodeError, json.JSONDecodeError) as exc:
        count, errors = 0, [f"{args.session} 不是合法 UTF-8 JSON：{exc}"]
    result = {"ok": not errors, "claim_count": count, "errors": errors}
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif errors:
        print(f"interview session validation: {len(errors)} error(s)", file=sys.stderr)
        for error in errors:
            print(f"  FAIL  {error}", file=sys.stderr)
    else:
        print(f"interview session validation: {count} claims passed")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
