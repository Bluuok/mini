#!/usr/bin/env python3
"""Validate the resume skill Claim-Evidence Ledger with deterministic rules."""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any


SUPPORTED_SCHEMA_VERSION = 1
PROJECTS = {"miniclaw", "craft-agents"}
CLAIM_BASES = {"project_source", "user_attested", "scenario_design", "jd_assumption"}
CLAIM_TYPES = {"ownership", "technical", "architecture", "metric", "result"}
ATTRIBUTION_SCOPES = {"personal", "team", "project", "scenario"}
RESPONSIBILITY_LEVELS = {"participated", "module_owner", "delivery_lead", "project_owner", "not_applicable"}
RESULT_TYPES = {"personal_actual", "team_actual", "phase_result", "estimate", "usage_reach", "deliverable", "none"}
VERIFICATION_STATUSES = {"confirmed", "pending", "stale", "excluded"}
ALLOWED_USES = {"audit", "resume_draft", "resume_final", "interview"}
REQUIRED_PROFILE_FIELDS = {"candidate_id", "target_roles", "updated_at"}
REQUIRED_CLAIM_FIELDS = {
    "id", "project", "support_points", "claim_types", "claim_basis", "source_fact",
    "candidate_wording", "sources", "attribution_scope", "responsibility_level",
    "result_type", "verification_status", "allowed_uses", "interview_details",
    "boundary", "risk_notes", "last_verified",
}
REQUIRED_SOURCE_FIELDS = {"type", "location", "public"}
REQUIRED_INTERVIEW_FIELDS = {"decisions", "difficulties", "verification", "result"}
ID_PATTERN = re.compile(r"^(R|H|RT|S)\d{1,2}$")
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
STRONG_WORDS = re.compile(r"主导|负责人|Owner|owner|0\s*[→到-]\s*1")
IMPLEMENTATION_WORDS = re.compile(r"上线|投产|生产环境|已实现|落地运行|实际提升|实际降低")
NUMBER_PATTERN = re.compile(r"(?<![A-Za-z])\d+(?:\.\d+)?\s*%?|\d+\s*万|\d+\s*人")
PROJECT_POINT_LIMITS = {
    "miniclaw": {"R": 27, "H": 9, "RT": 5, "S": 5},
    "craft-agents": {"R": 27, "H": 8, "RT": 5, "S": 5},
}


def _keys(keys: set[str]) -> str:
    return "[" + ", ".join(sorted(repr(key) for key in keys)) + "]"


def _require(value: dict[str, Any], required: set[str], path: str, errors: list[str]) -> None:
    missing = required - set(value)
    if missing:
        errors.append(f"{path} 缺少字段：{_keys(missing)}")


def _nonempty(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{path} 必须是非空字符串")


def _strings(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, list):
        errors.append(f"{path} 必须是数组")
        return
    for index, item in enumerate(value):
        _nonempty(item, f"{path}[{index}]", errors)


def _date(value: Any, path: str, errors: list[str], nullable: bool) -> None:
    if value is None and nullable:
        return
    if not isinstance(value, str) or not DATE_PATTERN.fullmatch(value):
        errors.append(f"{path} 必须是 YYYY-MM-DD" + (" 或 null" if nullable else ""))
        return
    try:
        date.fromisoformat(value)
    except ValueError:
        errors.append(f"{path} 不是合法日期")


def _source(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, dict):
        errors.append(f"{path} 必须是对象")
        return
    _require(value, REQUIRED_SOURCE_FIELDS, path, errors)
    if "type" in value:
        _nonempty(value["type"], f"{path}.type", errors)
    if "location" in value:
        _nonempty(value["location"], f"{path}.location", errors)
    if "public" in value and not isinstance(value["public"], bool):
        errors.append(f"{path}.public 必须是布尔值")
    if "note" in value and not isinstance(value["note"], str):
        errors.append(f"{path}.note 必须是字符串")


def _interview_details(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, dict):
        errors.append(f"{path} 必须是对象")
        return
    _require(value, REQUIRED_INTERVIEW_FIELDS, path, errors)
    for field in ("decisions", "difficulties", "verification"):
        if field in value:
            _strings(value[field], f"{path}.{field}", errors)
    if "result" in value and value["result"] is not None and not isinstance(value["result"], str):
        errors.append(f"{path}.result 必须是字符串或 null")


def _claim(value: Any, index: int, seen_ids: set[str], errors: list[str], warnings: list[str]) -> None:
    path = f"claims[{index}]"
    if not isinstance(value, dict):
        errors.append(f"{path} 必须是对象")
        return
    _require(value, REQUIRED_CLAIM_FIELDS, path, errors)
    for field in ("id", "source_fact", "candidate_wording", "boundary"):
        if field in value:
            _nonempty(value[field], f"{path}.{field}", errors)

    claim_id = value.get("id")
    if isinstance(claim_id, str) and claim_id.strip():
        if claim_id in seen_ids:
            errors.append(f"{path}.id 重复：{claim_id!r}")
        seen_ids.add(claim_id)

    for field, allowed in (
        ("project", PROJECTS),
        ("claim_basis", CLAIM_BASES),
        ("attribution_scope", ATTRIBUTION_SCOPES),
        ("responsibility_level", RESPONSIBILITY_LEVELS),
        ("result_type", RESULT_TYPES),
        ("verification_status", VERIFICATION_STATUSES),
    ):
        if field in value and value[field] not in allowed:
            errors.append(f"{path}.{field} 必须是：{_keys(allowed)}")

    if "support_points" in value:
        points = value["support_points"]
        _strings(points, f"{path}.support_points", errors)
        if isinstance(points, list):
            for point in points:
                if isinstance(point, str) and not ID_PATTERN.fullmatch(point):
                    errors.append(f"{path}.support_points 包含非法编号：{point!r}")
                elif isinstance(point, str):
                    prefix = "RT" if point.startswith("RT") else point[0]
                    number = int(point[len(prefix):])
                    limit = PROJECT_POINT_LIMITS.get(value.get("project"), {}).get(prefix)
                    if limit is None or number > limit:
                        errors.append(f"{path}.support_points 编号不属于项目 {value.get('project')}：{point!r}")

    if "artifact_refs" in value:
        _strings(value["artifact_refs"], f"{path}.artifact_refs", errors)
        if isinstance(value["artifact_refs"], list) and not value["artifact_refs"]:
            errors.append(f"{path}.artifact_refs 不能为空")
    else:
        warnings.append(f"{path}：旧版 Claim 缺少 artifact_refs；重新生成简历前需补做 Agent Project Model")

    for field in ("claim_types", "allowed_uses", "risk_notes"):
        if field in value:
            _strings(value[field], f"{path}.{field}", errors)
            allowed = CLAIM_TYPES if field == "claim_types" else ALLOWED_USES if field == "allowed_uses" else None
            if allowed and isinstance(value[field], list):
                for item in value[field]:
                    if item not in allowed:
                        errors.append(f"{path}.{field} 包含非法值：{item!r}")

    if "sources" in value:
        sources = value["sources"]
        if not isinstance(sources, list):
            errors.append(f"{path}.sources 必须是数组")
        else:
            for source_index, source in enumerate(sources):
                _source(source, f"{path}.sources[{source_index}]", errors)
    if "interview_details" in value:
        _interview_details(value["interview_details"], f"{path}.interview_details", errors)
    if "last_verified" in value:
        _date(value["last_verified"], f"{path}.last_verified", errors, nullable=True)

    wording = value.get("candidate_wording")
    status = value.get("verification_status")
    basis = value.get("claim_basis")
    uses = value.get("allowed_uses", [])
    result_type = value.get("result_type")
    responsibility = value.get("responsibility_level")
    if status == "confirmed" and isinstance(wording, str) and "待补" in wording:
        errors.append(f"{path}.candidate_wording：confirmed Claim 不能包含待补占位符")
    if status != "confirmed" and isinstance(uses, list) and "resume_final" in uses:
        errors.append(f"{path}.allowed_uses：非 confirmed Claim 不能进入 resume_final")
    if responsibility in {"participated", "module_owner"} and isinstance(wording, str) and STRONG_WORDS.search(wording):
        errors.append(f"{path}.candidate_wording：责任等级不足以支撑主导/负责人/Owner")
    if basis in {"scenario_design", "jd_assumption"} and isinstance(wording, str):
        if IMPLEMENTATION_WORDS.search(wording):
            errors.append(f"{path}.candidate_wording：场景设计/JD假设不能写成上线或实际结果")
        if NUMBER_PATTERN.search(wording) and result_type not in {"estimate", "deliverable", "none"}:
            errors.append(f"{path}.candidate_wording：场景设计中的数字必须明确为测算/目标")
    if isinstance(wording, str) and NUMBER_PATTERN.search(wording):
        source_types = {s.get("type") for s in value.get("sources", []) if isinstance(s, dict)}
        if not ({"user-attested", "metric-source", "jd"} & source_types):
            warnings.append(f"{path}.candidate_wording：检测到数字，但 sources 未声明 user-attested/metric-source/jd")


def validate_ledger(document: Any) -> tuple[int, list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    if not isinstance(document, dict):
        return 0, ["文档根节点必须是对象"], warnings
    if document.get("schema_version") != SUPPORTED_SCHEMA_VERSION:
        errors.append(f"schema_version 必须是 {SUPPORTED_SCHEMA_VERSION}")
    profile = document.get("profile")
    if not isinstance(profile, dict):
        errors.append("profile 必须是对象")
    else:
        _require(profile, REQUIRED_PROFILE_FIELDS, "profile", errors)
        if "candidate_id" in profile:
            _nonempty(profile["candidate_id"], "profile.candidate_id", errors)
        if "target_roles" in profile:
            _strings(profile["target_roles"], "profile.target_roles", errors)
        if "updated_at" in profile:
            _date(profile["updated_at"], "profile.updated_at", errors, nullable=False)
    claims = document.get("claims")
    if not isinstance(claims, list):
        errors.append("claims 必须是数组")
        return 0, errors, warnings
    seen_ids: set[str] = set()
    for index, claim in enumerate(claims):
        _claim(claim, index, seen_ids, errors, warnings)
    return len(claims), errors, warnings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="校验简历 Claim-Evidence Ledger。")
    parser.add_argument("ledger", type=Path)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args(argv)
    try:
        document = json.loads(args.ledger.read_text(encoding="utf-8-sig"))
        count, errors, warnings = validate_ledger(document)
    except OSError as exc:
        count, errors, warnings = 0, [f"无法读取 {args.ledger}：{exc}"], []
    except (UnicodeError, json.JSONDecodeError) as exc:
        count, errors, warnings = 0, [f"{args.ledger} 不是合法 UTF-8 JSON：{exc}"], []

    result = {"ok": not errors, "claim_count": count, "errors": errors, "warnings": warnings}
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif errors:
        print(f"claim ledger validation: {len(errors)} error(s)", file=sys.stderr)
        for error in errors:
            print(f"  FAIL  {error}", file=sys.stderr)
        for warning in warnings:
            print(f"  WARN  {warning}", file=sys.stderr)
    else:
        print(f"claim ledger validation: {count} claims passed")
        for warning in warnings:
            print(f"  WARN  {warning}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
