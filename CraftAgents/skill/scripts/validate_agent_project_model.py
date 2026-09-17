#!/usr/bin/env python3
"""Validate the Agent Project Model used before resume Claim generation."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


LAYERS = {"External Knowledge", "Harness", "Runtime", "Memory", "Eval", "Workflow"}
STATUSES = {"Implemented", "Prototype", "Scenario Extension", "Design-only"}
OWNERSHIP = {"owner", "participated", "collaborated", "unknown"}
RELEVANCE = {"agent_core", "agent_supporting", "ordinary_infra"}
COVERAGE = {"covered", "weak", "absent", "not_applicable"}
PROJECTS = {"miniclaw", "craft-agents"}
REQUIRED_ROOT = {"schema_version", "project", "target_role", "scenario", "artifacts", "coverage"}
REQUIRED_ARTIFACT = {
    "id", "support_points", "agent_layer", "core_concept", "problem", "implementation",
    "artifact", "artifact_evidence", "effect", "ownership", "artifact_status", "scenario",
    "project_source", "scope_boundary", "interview_artifact", "agent_relevance",
}
REQUIRED_COVERAGE = {"knowledge_tool", "harness", "runtime_or_memory", "eval", "workflow"}
POINT_PATTERN = re.compile(r"^(R|H|RT|S)\d{1,2}$")
PRODUCTION_WORDS = re.compile(r"已上线|投产|生产运行|线上运行|实际提升|实际降低|业务提升")
DESIGN_COMPLETION_WORDS = re.compile(r"实现了|构建了|开发了|部署了|交付了|完成了|打通了|落地了|投入使用")
PLACEHOLDER_WORDS = re.compile(r"TODO|TBD|待补|示例文本")


def _nonempty(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{path} 必须是非空字符串")


def _string_list(value: Any, path: str, errors: list[str], *, allow_empty: bool = False) -> None:
    if not isinstance(value, list):
        errors.append(f"{path} 必须是数组")
        return
    if not allow_empty and not value:
        errors.append(f"{path} 不能为空")
    for index, item in enumerate(value):
        _nonempty(item, f"{path}[{index}]", errors)


def validate_model(document: Any) -> tuple[int, list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    if not isinstance(document, dict):
        return 0, ["文档根节点必须是对象"], warnings

    missing = REQUIRED_ROOT - set(document)
    if missing:
        errors.append(f"根节点缺少字段：{sorted(missing)}")
    if document.get("schema_version") != 1:
        errors.append("schema_version 必须是 1")
    if document.get("project") not in PROJECTS:
        errors.append(f"project 必须是：{sorted(PROJECTS)}")
    for field in ("target_role", "scenario"):
        if field in document:
            _nonempty(document[field], field, errors)

    coverage = document.get("coverage")
    if not isinstance(coverage, dict):
        errors.append("coverage 必须是对象")
    else:
        missing_coverage = REQUIRED_COVERAGE - set(coverage)
        if missing_coverage:
            errors.append(f"coverage 缺少字段：{sorted(missing_coverage)}")
        for field in REQUIRED_COVERAGE:
            if field in coverage and coverage[field] not in COVERAGE:
                errors.append(f"coverage.{field} 必须是：{sorted(COVERAGE)}")

    artifacts = document.get("artifacts")
    if not isinstance(artifacts, list):
        errors.append("artifacts 必须是数组")
        return 0, errors, warnings

    seen_ids: set[str] = set()
    for index, artifact in enumerate(artifacts):
        path = f"artifacts[{index}]"
        if not isinstance(artifact, dict):
            errors.append(f"{path} 必须是对象")
            continue
        missing_artifact = REQUIRED_ARTIFACT - set(artifact)
        if missing_artifact:
            errors.append(f"{path} 缺少字段：{sorted(missing_artifact)}")
        for field in (
            "id", "core_concept", "problem", "implementation", "artifact", "effect",
            "scenario", "project_source", "scope_boundary",
        ):
            if field in artifact:
                _nonempty(artifact[field], f"{path}.{field}", errors)
                if isinstance(artifact[field], str) and PLACEHOLDER_WORDS.search(artifact[field]):
                    errors.append(f"{path}.{field} 包含未完成占位符")

        artifact_id = artifact.get("id")
        if isinstance(artifact_id, str):
            if artifact_id in seen_ids:
                errors.append(f"{path}.id 重复：{artifact_id}")
            seen_ids.add(artifact_id)

        for field, allowed in (
            ("agent_layer", LAYERS),
            ("artifact_status", STATUSES),
            ("ownership", OWNERSHIP),
            ("agent_relevance", RELEVANCE),
        ):
            if field in artifact and artifact[field] not in allowed:
                errors.append(f"{path}.{field} 必须是：{sorted(allowed)}")

        _string_list(artifact.get("support_points"), f"{path}.support_points", errors, allow_empty=True)
        if isinstance(artifact.get("support_points"), list):
            for point in artifact["support_points"]:
                if isinstance(point, str) and not POINT_PATTERN.fullmatch(point):
                    errors.append(f"{path}.support_points 包含非法编号：{point}")
        _string_list(artifact.get("artifact_evidence"), f"{path}.artifact_evidence", errors)
        _string_list(artifact.get("interview_artifact"), f"{path}.interview_artifact", errors)

        status = artifact.get("artifact_status")
        evidence = artifact.get("artifact_evidence")
        combined = " ".join(str(artifact.get(field, "")) for field in ("implementation", "effect"))
        if status == "Implemented" and isinstance(evidence, list) and not evidence:
            errors.append(f"{path}：Implemented 必须有 artifact_evidence")
        if status in {"Scenario Extension", "Design-only"} and PRODUCTION_WORDS.search(combined):
            errors.append(f"{path}：{status} 不能声称生产落地或实际业务提升")
        if status in {"Scenario Extension", "Design-only"} and DESIGN_COMPLETION_WORDS.search(combined):
            errors.append(f"{path}：{status} 不能使用完成式实现动词")
        if artifact.get("ownership") == "unknown":
            warnings.append(f"{path}：ownership 未确认，不能生成个人 Owner 表述")
        if artifact.get("agent_relevance") == "ordinary_infra":
            warnings.append(f"{path}：普通 Infra 默认不进入 Agent 核心 Bullet")

    return len(artifacts), errors, warnings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="校验 Agent Project Model。")
    parser.add_argument("model", type=Path)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args(argv)
    try:
        document = json.loads(args.model.read_text(encoding="utf-8-sig"))
        count, errors, warnings = validate_model(document)
    except OSError as exc:
        count, errors, warnings = 0, [f"无法读取 {args.model}：{exc}"], []
    except (UnicodeError, json.JSONDecodeError) as exc:
        count, errors, warnings = 0, [f"{args.model} 不是合法 UTF-8 JSON：{exc}"], []

    result = {"ok": not errors, "artifact_count": count, "errors": errors, "warnings": warnings}
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif errors:
        print(f"agent project model validation: {len(errors)} error(s)", file=sys.stderr)
        for error in errors:
            print(f"  FAIL  {error}", file=sys.stderr)
        for warning in warnings:
            print(f"  WARN  {warning}", file=sys.stderr)
    else:
        print(f"agent project model validation: {count} artifacts passed")
        for warning in warnings:
            print(f"  WARN  {warning}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
