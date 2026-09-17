import json
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from validate_interview_session import validate_session


class InterviewSessionTests(unittest.TestCase):
    def test_template_is_valid(self):
        root = Path(__file__).resolve().parents[1]
        template = root / "assets" / "interview-session-template.json"
        if not template.exists():
            template = root / "interview-session-template.json"
        count, errors = validate_session(json.loads(template.read_text(encoding="utf-8")))
        self.assertEqual(count, 1)
        self.assertEqual(errors, [])

    def test_invalid_status_is_rejected(self):
        document = {
            "schema_version": 1,
            "session": {
                "session_id": "s",
                "role": "r",
                "round": "技术面",
                "duration_minutes": 30,
                "feedback_policy": "deferred",
                "hint_policy": "on_request",
                "max_followups_per_claim": 4,
                "updated_at": "2026-09-13",
            },
            "claims": [{
                "claim_id": "c",
                "status": "score-9",
                "evidence_found": [],
                "missing": [],
                "contradictions": [],
                "followup_depth": 0,
                "last_question_id": "q",
            }],
        }
        _, errors = validate_session(document)
        self.assertTrue(any("status" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
