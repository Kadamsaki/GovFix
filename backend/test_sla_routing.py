import sys
import datetime
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_sla_and_routing():
    print("=" * 70)
    print("RUNNING SLA & DEPARTMENT ROUTING TEST SUITE")
    print("=" * 70)

    # 1. Citizen submits URGENT Garbage complaint
    res = client.post(
        "/api/v1/complaints",
        headers={"X-User-Id": "citizen-1"},
        json={
            "category": "Garbage & Sanitation",
            "title": "Overflowing waste near market entrance",
            "description": "Commercial waste heaps accumulating for 2 days.",
            "ward": "Ward No. 14 (Shivaji Chowk)",
            "location": "Near Gate 1, Town Hall Market",
            "priority": "Urgent",
            "attachment_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400",
        },
    )
    assert res.status_code == 201, f"Failed: {res.text}"
    c = res.json()
    assert c["assigned_department"] == "Sanitation Department", f"Expected Sanitation Department, got {c['assigned_department']}"
    assert c["priority"] == "Urgent"
    assert c["attachment_url"] is not None
    # System automatically assigns officer according to problem category (Garbage -> officer-4 Er. Ramesh Shinde)
    assert c["assigned_officer_id"] == "officer-4", f"Expected auto-assigned officer-4, got {c['assigned_officer_id']}"
    assert c["status"] == "ASSIGNED", f"Expected status ASSIGNED, got {c['status']}"
    assert c["assigned_at"] is not None, "assigned_at should be recorded on auto-assignment"
    
    # Check deadline is ~6 hours from created_at
    created_at = datetime.datetime.fromisoformat(c["created_at"])
    deadline = datetime.datetime.fromisoformat(c["resolution_deadline"])
    diff_hours = (deadline - created_at).total_seconds() / 3600
    assert abs(diff_hours - 6.0) < 0.1, f"Expected 6h SLA, got {diff_hours}"
    print(f" PASS: Urgent Garbage complaint auto-routed to {c['assigned_department']} and auto-assigned to officer-4 with 6h deadline.")

    # 2. Check Officer Workload in /auth/officers
    res_off = client.get("/api/v1/auth/officers", headers={"X-User-Id": "supervisor-1"})
    assert res_off.status_code == 200
    officers = res_off.json()
    assert len(officers) >= 5, f"Expected at least 5 officers, got {len(officers)}"
    for off in officers:
        assert "active_complaints_count" in off, f"Missing workload count in officer {off['name']}"
    print(f" PASS: Supervisor received all {len(officers)} officers with active workload counts.")

    # 3. Optional Supervisor Re-assignment / Verification (Supervisor can reassign if needed, but not required for triage)
    cid = c["id"]
    res_reassign = client.post(
        f"/api/v1/complaints/{cid}/transition",
        headers={"X-User-Id": "supervisor-1"},
        json={"action": "REASSIGN", "assigned_officer_id": "officer-4"},
    )
    assert res_reassign.status_code == 200
    assigned_data = res_reassign.json()["complaint"]
    assert assigned_data["assigned_officer_id"] == "officer-4"
    assert assigned_data["assigned_at"] is not None
    assert assigned_data["resolution_deadline"] == c["resolution_deadline"], "Deadline should not reset on assignment!"
    print(f" PASS: Officer auto-assignment confirmed and reassignment supported; deadline preserved.")

    # 4. Officer-4 lists complaints and sees this complaint
    res_my = client.get("/api/v1/complaints", headers={"X-User-Id": "officer-4"})
    assert res_my.status_code == 200
    my_tasks = res_my.json()
    assert any(task["id"] == cid for task in my_tasks), f"Officer-4 should see complaint {cid}"
    print(f" PASS: Complaint {cid} immediately visible in officer-4 dashboard.")

    print("\nALL SLA & ROUTING TESTS PASSED!")

if __name__ == "__main__":
    test_sla_and_routing()
