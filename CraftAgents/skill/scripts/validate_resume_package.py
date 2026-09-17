#!/usr/bin/env python3
"""Cross-validate Agent Project Model, Claim Ledger, and optional paste-ready resume text."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

from validate_agent_project_model import validate_model
from validate_claim_ledger import validate_ledger


STATUS_RANK = {"Design-only": 0, "Scenario Extension": 1, "Prototype": 2, "Implemented": 3}
DESIGN_COMPLETION_WORDS = re.compile(r"实现了|构建了|开发了|部署了|交付了|完成了|打通了|落地了|已上线|投产|投入使用")
PRODUCTION_WORDS = re.compile(r"已上线|投产|生产运行|线上运行|投入使用|业务提升|实际提升|实际降低")
VALIDATION_WORDS = re.compile(r"验证了|完成验证|经验证")
VALIDATION_EVIDENCE = re.compile(r"测试|验证|trace|benchmark|test|eval", re.IGNORECASE)
PRODUCTION_EVIDENCE = re.compile(r"生产|上线|部署记录|监控|production", re.IGNORECASE)
OWNER_WORDS = re.compile(r"主导|负责人|Owner|owner|0\s*[→到-]\s*1")
INTERNAL_MARKERS = re.compile(
    r"(?<![A-Za-z0-9])(?:RT|R|H|S)\d{1,2}(?![A-Za-z0-9])|"
    r"(?<![A-Za-z0-9])L[0-4](?![A-Za-z0-9])|route_id|claim-[A-Za-z0-9-]+|"
    r"Scenario Extension|Design-only|Implemented|Prototype"
)


def validate_package(model: Any, ledger: Any, resume_text: str | None = None) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    _, model_errors, model_warnings = validate_model(model)
    _, ledger_errors, ledger_warnings = validate_ledger(ledger)
    errors.extend(f"project_model: {item}" for item in model_errors)
    errors.extend(f"claim_ledger: {item}" for item in ledger_errors)
    warnings.extend(f"project_model: {item}" for item in model_warnings)
    warnings.extend(f"claim_ledger: {item}" for item in ledger_warnings)
    if errors:
        return errors, warnings

    artifacts = {
        item.get("id"): item
        for item in model.get("artifacts", [])
        if isinstance(item, dict) and isinstance(item.get("id"), str)
    }
    if model.get("project") not in {claim.get("project") for claim in ledger.get("claims", []) if isinstance(claim, dict)}:
        warnings.append("Claim Ledger 中没有与 Project Model 同项目的 Claim")

    for index, claim in enumerate(ledger.get("claims", [])):
        if not isinstance(claim, dict):
            continue
        path = f"claims[{index}]"
        refs = claim.get("artifact_refs")
        if not isinstance(refs, list) or not refs:
            errors.append(f"{path}.artifact_refs：新生成包必须引用至少一个 Artifact")
            continue
        unknown = [ref for ref in refs if ref not in artifacts]
        if unknown:
            errors.append(f"{path}.artifact_refs 引用了未知 Artifact：{unknown}")
            continue
        linked = [artifacts[ref] for ref in refs]
        wording = str(claim.get("candidate_wording", ""))
        final = "resume_final" in claim.get("allowed_uses", [])
        weakest = min(linked, key=lambda item: STATUS_RANK.get(item.get("artifact_status"), -1))
        status = weakest.get("artifact_status")
        evidence_text = " ".join(
            str(value)
            for item in linked
            for value in item.get("artifact_evidence", [])
        )

        if final and any(item.get("ownership") == "unknown" for item in linked):
            errors.append(f"{path}：Ownership 未确认的 Artifact 不能进入 resume_final")
        if final and all(item.get("agent_relevance") == "ordinary_infra" for item in linked):
            errors.append(f"{path}：纯 ordinary_infra Claim 不能作为 Agent 核心简历 Bullet")
        if status in {"Scenario Extension", "Design-only"} and DESIGN_COMPLETION_WORDS.search(wording):
            errors.append(f"{path}.candidate_wording：{status} 使用了完成式实现动词")
        if status in {"Scenario Extension", "Design-only"} and VALIDATION_WORDS.search(wording) and not VALIDATION_EVIDENCE.search(evidence_text):
            errors.append(f"{path}.candidate_wording：缺少验证证据却声称已验证")
        if status == "Prototype" and PRODUCTION_WORDS.search(wording):
            errors.append(f"{path}.candidate_wording：Prototype 不能声称生产落地或实际业务提升")
        if status == "Implemented" and PRODUCTION_WORDS.search(wording) and not PRODUCTION_EVIDENCE.search(evidence_text):
            errors.append(f"{path}.candidate_wording：Implemented 不等于生产落地，缺少生产证据")
        if OWNER_WORDS.search(wording) and any(item.get("ownership") != "owner" for item in linked):
            errors.append(f"{path}.candidate_wording：Artifact Ownership 不足以支撑 Owner/主导表述")

    if resume_text is not None:
        markers = sorted(set(INTERNAL_MARKERS.findall(resume_text)))
        if markers:
            errors.append(f"paste-ready resume 泄漏内部标记：{markers}")
    return errors, warnings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="联合校验 Agent Project Model、Claim Ledger 与可贴简历。")
    parser.add_argument("model", type=Path)
    parser.add_argument("ledger", type=Path)
    parser.add_argument("--resume", type=Path, help="仅包含可贴简历区的 UTF-8 文本")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args(argv)
    try:
        model = json.loads(args.model.read_text(encoding="utf-8-sig"))
        ledger = json.loads(args.ledger.read_text(encoding="utf-8-sig"))
        resume_text = args.resume.read_text(encoding="utf-8-sig") if args.resume else None
        errors, warnings = validate_package(model, ledger, resume_text)
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        errors, warnings = [str(exc)], []
    result = {"ok": not errors, "errors": errors, "warnings": warnings}
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif errors:
        print(f"resume package validation: {len(errors)} error(s)", file=sys.stderr)
        for error in errors:
            print(f"  FAIL  {error}", file=sys.stderr)
        for warning in warnings:
            print(f"  WARN  {warning}", file=sys.stderr)
    else:
        print("resume package validation: passed")
        for warning in warnings:
            print(f"  WARN  {warning}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
