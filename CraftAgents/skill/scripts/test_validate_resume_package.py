import copy
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from validate_resume_package import validate_package


class ResumePackageTests(unittest.TestCase):
    def setUp(self):
        root = Path(__file__).resolve().parents[1]
        self.model = json.loads((root / "assets" / "agent-project-model-template.json").read_text(encoding="utf-8"))
        self.ledger = json.loads((root / "assets" / "claim-ledger-template.json").read_text(encoding="utf-8"))

    def _make_final(self):
        self.model["artifacts"][0]["ownership"] = "participated"
        claim = self.ledger["claims"][0]
        claim["verification_status"] = "confirmed"
        claim["allowed_uses"] = ["audit", "resume_final", "interview"]

    def test_pending_template_is_structurally_valid(self):
        errors, _ = validate_package(self.model, self.ledger)
        self.assertEqual(errors, [])

    def test_unknown_ownership_blocks_final(self):
        claim = self.ledger["claims"][0]
        claim["verification_status"] = "confirmed"
        claim["allowed_uses"].append("resume_final")
        errors, _ = validate_package(self.model, self.ledger)
        self.assertTrue(any("Ownership 未确认" in error for error in errors))

    def test_scenario_extension_blocks_implemented_wording(self):
        self._make_final()
        self.model["artifacts"][0]["artifact_status"] = "Scenario Extension"
        self.ledger["claims"][0]["candidate_wording"] = "实现了电商数据适配器。"
        errors, _ = validate_package(self.model, self.ledger)
        self.assertTrue(any("完成式实现动词" in error for error in errors))

    def test_ordinary_infra_cannot_be_agent_core_final(self):
        self._make_final()
        self.model["artifacts"][0]["agent_relevance"] = "ordinary_infra"
        errors, _ = validate_package(self.model, self.ledger)
        self.assertTrue(any("ordinary_infra" in error for error in errors))

    def test_unknown_artifact_ref_is_rejected(self):
        self.ledger["claims"][0]["artifact_refs"] = ["artifact-missing"]
        errors, _ = validate_package(self.model, self.ledger)
        self.assertTrue(any("未知 Artifact" in error for error in errors))

    def test_internal_marker_in_resume_is_rejected(self):
        errors, _ = validate_package(self.model, self.ledger, "**Agent Runtime** 基于 R03 构建。")
        self.assertTrue(any("泄漏内部标记" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
