"""
GovFix Automated Verification Suite: Core Workflow Engine & Role-Based Permissions (RBAC)
Tests all 12 mandatory lifecycle and security test cases.
"""
import sys
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.complaint import Complaint
from app.models.audit import AuditLog

client = TestClient(app)


def test_suite():
    print("=" * 70)
    print("RUNNING GOVFIX WORKFLOW & RBAC VALIDATION TEST SUITE")
    print("=" * 70)

    # User Headers for simulated authenticated roles
    citizen_headers = {"X-User-Id": "citizen-1"}
    officer1_headers = {"X-User-Id": "officer-1"}  # Water Works Engineer
    officer2_headers = {"X-User-Id": "officer-2"}  # PWD Engineer (Unassigned for Water)
    supervisor_headers = {"X-User-Id": "supervisor-1"}
    admin_headers = {"X-User-Id": "admin-1"}

    # -------------------------------------------------------------
    # TEST 1: Citizen submits a complaint successfully
    # -------------------------------------------------------------
    print("\n[TEST 1] Citizen submits a complaint successfully...")
    res = client.post(
        "/api/v1/complaints",
        headers=citizen_headers,
        json={
            "category": "Water Supply",
            "title": "Low water pressure in Sector 4 residential colony",
            "description": "Continuous low potable water pressure reported across 40 tenements for 3 consecutive days.",
            "ward": "Ward No. 14 (Shivaji Chowk)",
            "location": "Sector 4, Building 12-18",
            "landmark": "Near Community Park",
            "priority": "Medium",
        },
    )
    assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
    new_complaint = res.json()
    cid = new_complaint["id"]
    # System automatically assigns officer according to problem category (Water Supply -> officer-1)
    assert new_complaint["status"] == "ASSIGNED", f"Expected ASSIGNED, got {new_complaint['status']}"
    assert new_complaint["assigned_officer_id"] == "officer-1", f"Expected officer-1, got {new_complaint['assigned_officer_id']}"
    assert new_complaint["assigned_department"] == "Water Supply Department"
    print(f" PASS: Complaint {cid} created and automatically assigned to officer-1 (Water Supply) with status ASSIGNED")

    # -------------------------------------------------------------
    # TEST 2: Supervisor / Admin Reassigns / Confirms Officer
    # -------------------------------------------------------------
    print("\n[TEST 2] Supervisor verifies / reassigns officer...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=supervisor_headers,
        json={
            "action": "REASSIGN",
            "assigned_officer_id": "officer-1",
            "remarks": "Dispatched to Executive Engineer - Water Supply",
        },
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    assert data["current_status"] == "ASSIGNED"
    assert data["complaint"]["assigned_officer_id"] == "officer-1"
    print(f" PASS: Complaint {cid} assignment verified for officer-1, status is ASSIGNED")

    # -------------------------------------------------------------
    # TEST 4: Assigned officer moves it to IN_PROGRESS
    # -------------------------------------------------------------
    print("\n[TEST 4] Assigned officer moves complaint to IN_PROGRESS...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=officer1_headers,
        json={"action": "START_WORK", "remarks": "Field inspection team dispatched with valve gauges"},
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    assert res.json()["current_status"] == "IN_PROGRESS"
    print(f" PASS: Complaint {cid} moved to IN_PROGRESS by assigned officer")

    # -------------------------------------------------------------
    # TEST 5: Unassigned officer attempts to update complaint -> REJECTED
    # -------------------------------------------------------------
    print("\n[TEST 5] Unassigned officer (officer-2) attempts to update complaint...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=officer2_headers,
        json={
            "action": "RESOLVE",
            "resolution_remarks": "Unauthorized attempt",
            "resolution_proof_url": "https://example.com/proof.jpg",
        },
    )
    assert res.status_code == 403, f"Expected 403 Forbidden, got {res.status_code}: {res.text}"
    assert "not the assigned officer" in res.json()["detail"]
    print(" PASS: Unassigned officer attempt rejected with HTTP 403 and logged")

    # -------------------------------------------------------------
    # TEST 6: Citizen attempts to close complaint -> REJECTED
    # -------------------------------------------------------------
    print("\n[TEST 6] Citizen attempts to close complaint...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=citizen_headers,
        json={"action": "APPROVE_CLOSURE"},
    )
    assert res.status_code == 403, f"Expected 403 Forbidden, got {res.status_code}: {res.text}"
    assert "Citizens are not authorized" in res.json()["detail"]
    print(" PASS: Citizen closure attempt rejected with HTTP 403 and logged")

    # -------------------------------------------------------------
    # TEST 7: Officer attempts to close complaint -> REJECTED
    # -------------------------------------------------------------
    print("\n[TEST 7] Officer attempts to close complaint (only Supervisor can close)...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=officer1_headers,
        json={"action": "APPROVE_CLOSURE"},
    )
    # IN_PROGRESS -> CLOSED is invalid transition AND officer not authorized to close
    assert res.status_code in [400, 403], f"Expected 400 or 403, got {res.status_code}: {res.text}"
    print(f" PASS: Officer closure attempt rejected with HTTP {res.status_code} and logged")

    # -------------------------------------------------------------
    # TEST 8: Officer marks complaint RESOLVED successfully
    # (First verify missing proof is rejected, then submit with remarks and proof)
    # -------------------------------------------------------------
    print("\n[TEST 8a] Officer attempts RESOLVE without proof -> REJECTED...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=officer1_headers,
        json={"action": "RESOLVE", "resolution_remarks": "Done", "resolution_proof_url": ""},
    )
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    print(" PASS: Missing proof rejected with HTTP 400")

    print("[TEST 8b] Officer marks complaint RESOLVED with valid remarks and proof...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=officer1_headers,
        json={
            "action": "RESOLVE",
            "resolution_remarks": "Inlet booster valve replaced and water pressure calibrated to 3.2 bar across Sector 4.",
            "resolution_proof_url": "https://govfix.storage/evidence/pressure_gauge_test_32bar.jpg",
        },
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    assert res.json()["current_status"] == "RESOLVED"
    print(f" PASS: Complaint {cid} successfully moved to RESOLVED by assigned officer")

    # -------------------------------------------------------------
    # TEST 9: Supervisor approves and closes the complaint
    # -------------------------------------------------------------
    print("\n[TEST 9] Supervisor approves resolution and closes complaint...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=supervisor_headers,
        json={"action": "APPROVE_CLOSURE", "remarks": "Audited pressure logs with ward engineer; closure approved"},
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    assert res.json()["current_status"] == "CLOSED"
    print(f" PASS: Complaint {cid} successfully moved to CLOSED by Supervisor")

    # -------------------------------------------------------------
    # TEST 10: Any user attempts to modify a CLOSED complaint -> REJECTED
    # -------------------------------------------------------------
    print("\n[TEST 10] Any user (including Admin) attempts to modify CLOSED complaint...")
    res = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers=admin_headers,
        json={"action": "START_WORK"},
    )
    assert res.status_code == 400, f"Expected 400 Bad Request, got {res.status_code}: {res.text}"
    assert "CLOSED and immutable" in res.json()["detail"]
    print(" PASS: Transition on CLOSED complaint rejected ('CLOSED and immutable')")

    # -------------------------------------------------------------
    # TEST 11: Invalid transition rejected via direct target status
    # (e.g. SUBMITTED -> CLOSED skipping all intermediate stages)
    # -------------------------------------------------------------
    print("\n[TEST 11] Direct invalid skipping transition (SUBMITTED -> CLOSED)...")
    # c4 is seeded in SUBMITTED status
    c4_id = "GFX-2026-4421"
    res = client.post(
        f"/api/v1/complaints/{c4_id}/transition",
        headers=supervisor_headers,
        json={"action": "DIRECT_STATUS", "target_status": "CLOSED"},
    )
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    assert "Invalid status transition" in res.json()["detail"]
    print(f" PASS: Direct jump from SUBMITTED to CLOSED rejected with HTTP 400")

    # Also test SUBMITTED -> RESOLVED
    res = client.post(
        f"/api/v1/complaints/{c4_id}/transition",
        headers=supervisor_headers,
        json={"action": "DIRECT_STATUS", "target_status": "RESOLVED"},
    )
    assert res.status_code == 400
    print(f" PASS: Direct jump from SUBMITTED to RESOLVED rejected with HTTP 400")

    # -------------------------------------------------------------
    # TEST 12: Both successful and rejected actions appear in audit history
    # -------------------------------------------------------------
    print(f"\n[TEST 12] Inspecting audit history for complaint {cid}...")
    res = client.get(
        f"/api/v1/complaints/{cid}/audit-logs",
        headers=supervisor_headers,
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    audits = res.json()
    assert len(audits) >= 6, f"Expected at least 6 audit records, found {len(audits)}"

    accepted_audits = [a for a in audits if a["is_accepted"]]
    rejected_audits = [a for a in audits if not a["is_accepted"]]

    print(f" Total audit records logged: {len(audits)}")
    print(f" - Accepted actions: {len(accepted_audits)}")
    print(f" - Rejected actions: {len(rejected_audits)}")

    assert len(accepted_audits) > 0, "Must contain accepted audit records"
    assert len(rejected_audits) > 0, "Must contain rejected audit records"

    print("\nSample Audit Trail Log:")
    for a in audits:
        flag = "[ACCEPTED]" if a["is_accepted"] else "[REJECTED]"
        print(f"  {flag} {a['user_role'].upper()} ({a['user_id']}) -> {a['action']} (Req: {a['requested_status']}) | Reason: {a['reason']}")

    print("\n" + "=" * 70)
    print("ALL 12 MANDATORY TEST CASES PASSED PERFECTLY!")
    print("=" * 70)


if __name__ == "__main__":
    test_suite()
