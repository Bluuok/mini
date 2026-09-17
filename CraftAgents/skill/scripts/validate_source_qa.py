#!/usr/bin/env python3
"""Validate source-grounded interview QA samples against a source archive."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("qa_dir", type=Path)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text())
    archive = Path(manifest["archive"].get("skill_relative_path", manifest["archive"]["workspace_relative_path"]))
    if not archive.exists():
        archive = args.manifest.parent.parent / archive
    if not archive.exists():
        fail(f"archive not found: {archive}")
    actual = hashlib.sha256(archive.read_bytes()).hexdigest()
    expected = manifest["archive"]["sha256"]
    if actual != expected:
        fail(f"archive hash mismatch: expected {expected}, got {actual}")

    with zipfile.ZipFile(archive) as zf:
        names = set(zf.namelist())
    prefix = manifest["archive"]["root_directory"]
    docs = sorted(p for p in args.qa_dir.glob("*.md") if p.name != "README.md")
    if len(docs) != 4:
        fail(f"expected 4 route docs, got {len(docs)}")

    total = 0
    for doc in docs:
        text = doc.read_text()
        sections = re.findall(r"^## Q\d+｜.*?(?=^## Q|\Z)", text, re.M | re.S)
        if len(sections) != 3:
            fail(f"{doc}: expected 3 question sections, got {len(sections)}")
        for section in sections:
            required = ["建议回答", "源码锚点", "测试锚点", "必追问", "不能越界"]
            for label in required:
                if f"**{label}**" not in section:
                    fail(f"{doc}: missing {label}")
            followup = section.split("**必追问**：", 1)[1].split("\n", 1)[0]
            if len([part for part in followup.split("；") if part.strip()]) < 5:
                fail(f"{doc}: expected at least 5 follow-up prompts")
            if not any(term in followup for term in ("Ownership", "负责", "自己", "展示", "亲自")):
                fail(f"{doc}: follow-up missing ownership challenge")
            answer = section.split("**建议回答**：", 1)[1].split("\n", 1)[0]
            if re.search(r"\bS/T/A/R\b|\b[STAR]\s*[:：]", answer):
                fail(f"{doc}: visible STAR labels in answer")
            for anchor_line in re.findall(r"^[-*] \*\*源码锚点\*\*：(.+)$", section, re.M):
                paths = re.findall(r"`([^`]+)`", anchor_line)
                if not paths:
                    fail(f"{doc}: source anchor has no path")
                for path in paths:
                    if not path.startswith(("packages/", "apps/")):
                        fail(f"{doc}: non-project source path {path}")
                    if prefix + path not in names:
                        fail(f"{doc}: source path not in archive: {path}")
            for marker in ("场景", "基座"):
                if doc.stem != "base" and marker not in section:
                    fail(f"{doc}: scenario question does not distinguish {marker}")
            total += 1
    print(f"PASS: {len(docs)} route docs, {total} source-grounded questions, archive hash and anchors verified")
    return 0


if __name__ == "__main__":
    sys.exit(main())
