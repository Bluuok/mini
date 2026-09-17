import json
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from validate_claim_ledger import validate_ledger


class ClaimLedgerTests(unittest.TestCase):
    def setUp(self):
        root = Path(__file__).resolve().parents[1]
        template = root / "assets" / "claim-ledger-template.json"
        if not template.exists():
            template = root / "claim-ledger-template.json"
        self.document = json.loads(template.read_text(encoding="utf-8"))

    def test_template_is_valid(self):
        count, errors, warnings = validate_ledger(self.document)
        self.assertEqual(count, 1)
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_pending_claim_cannot_be_final(self):
        self.document["claims"][0]["verification_status"] = "pending"
        self.document["claims"][0]["allowed_uses"].append("resume_final")
        count, errors, _ = validate_ledger(self.document)
        self.assertEqual(count, 1)
        self.assertTrue(any("resume_final" in error for error in errors))

    def test_scenario_design_cannot_claim_launch(self):
        claim = self.document["claims"][0]
        claim["claim_basis"] = "scenario_design"
        claim["candidate_wording"] = "设计并上线价格监管 Agent"
        count, errors, _ = validate_ledger(self.document)
        self.assertEqual(count, 1)
        self.assertTrue(any("场景设计" in error for error in errors))

    def test_project_point_range_is_enforced(self):
        self.document["claims"][0]["support_points"] = ["H10"]
        count, errors, _ = validate_ledger(self.document)
        self.assertEqual(count, 1)
        self.assertTrue(any("不属于项目" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
