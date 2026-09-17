import copy
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from validate_agent_project_model import validate_model


class AgentProjectModelTests(unittest.TestCase):
    def setUp(self):
        root = Path(__file__).resolve().parents[1]
        self.document = json.loads((root / "assets" / "agent-project-model-template.json").read_text(encoding="utf-8"))

    def test_template_is_valid(self):
        count, errors, _ = validate_model(self.document)
        self.assertEqual(count, 1)
        self.assertEqual(errors, [])

    def test_design_only_cannot_claim_production(self):
        model = copy.deepcopy(self.document)
        model["artifacts"][0]["artifact_status"] = "Design-only"
        model["artifacts"][0]["effect"] = "已上线并实际提升业务效率"
        _, errors, _ = validate_model(model)
        self.assertTrue(any("不能声称生产落地" in error for error in errors))

    def test_invalid_layer_is_rejected(self):
        model = copy.deepcopy(self.document)
        model["artifacts"][0]["agent_layer"] = "Backend"
        _, errors, _ = validate_model(model)
        self.assertTrue(any("agent_layer" in error for error in errors))

    def test_unknown_ownership_warns(self):
        _, errors, warnings = validate_model(self.document)
        self.assertEqual(errors, [])
        self.assertTrue(any("ownership 未确认" in warning for warning in warnings))


if __name__ == "__main__":
    unittest.main()
