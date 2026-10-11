import datetime
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.complaint import Complaint
from app.models.audit import AuditLog


def init_db():
    """Initializes tables and seeds test accounts and sample complaints."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if users already seeded
        if db.query(User).first():
            return

        print("Seeding initial GovFix users across all 4 roles...")

        # 1. Seed Users
        users = [
            # Citizens
            User(
                id="citizen-1",
                name="Aarav Sharma",
                email="aarav.sharma@example.com",
                mobile="8448005148",
                role="citizen",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Citizen / Resident",
            ),
            User(
                id="citizen-2",
                name="Priya Patil",
                email="priya.patil@example.com",
                mobile="9822014589",
                role="citizen",
                ward="Ward No. 03 (Central Market)",
                designation="Citizen / Trader",
            ),
            # Municipal Officers
            User(
                id="officer-1",
                name="Er. Amit Deshmukh",
                email="amit.deshmukh@govfix.municipal.gov.in",
                mobile="9823011440",
                role="officer",
                department="Water Supply",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Executive Engineer (Water Works)",
            ),
            User(
                id="officer-2",
                name="Er. Rajesh Sharma",
                email="rajesh.sharma@govfix.municipal.gov.in",
                mobile="9820044912",
                role="officer",
                department="Roads & Potholes",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Junior Engineer (Roads Maintenance)",
            ),
            User(
                id="officer-3",
                name="Er. Sandeep More",
                email="sandeep.more@govfix.municipal.gov.in",
                mobile="9821155290",
                role="officer",
                department="Streetlights",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Junior Engineer (Electrical & Lighting)",
            ),
            # Supervisor
            User(
                id="supervisor-1",
                name="Sh. Vikas Patil",
                email="vikas.patil@govfix.municipal.gov.in",
                mobile="9819922110",
                role="supervisor",
                department="Public Works & Grievance Cell",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Zonal Grievance Supervisor (Ward 14)",
            ),
            # Admin
            User(
                id="admin-1",
                name="Smt. Neha Kulkarni",
                email="admin.neha@govfix.municipal.gov.in",
                mobile="9900011223",
                role="admin",
                department="Municipal Commissioner's Office",
                ward="All Wards (Municipal HQ)",
                designation="Chief Redressal Administrator",
            ),
        ]

        for u in users:
            db.add(u)
        db.commit()

        # 2. Seed Initial Complaints & Audits
        now = datetime.datetime.utcnow()

        # Complaint 1: IN_PROGRESS
        c1 = Complaint(
            id="GFX-2026-3109",
            citizen_id="citizen-1",
            citizen_name="Aarav Sharma",
            citizen_mobile="8448005148",
            category="Water Supply",
            category_code="CIV-WAT-02",
            title="Major Drinking Water Pipeline Burst & Flooding",
            description="High-pressure water main burst near Station Road. Clean drinking water flooding street and low pressure in residential buildings.",
            ward="Ward No. 14 (Shivaji Chowk)",
            location="Opposite Railway Reservation Counter, Station Road",
            landmark="Near Electric Substation #4",
            priority="Urgent",
            status="IN_PROGRESS",
            assigned_officer_id="officer-1",
            assigned_officer_name="Er. Amit Deshmukh",
            assigned_department="Water Supply",
            created_at=now - datetime.timedelta(hours=6),
            updated_at=now - datetime.timedelta(hours=2),
        )
        db.add(c1)

        # Audits for c1
        db.add(AuditLog(
            complaint_id="GFX-2026-3109",
            user_id="citizen-1",
            user_name="Aarav Sharma",
            user_role="citizen",
            previous_status="NONE",
            requested_status="SUBMITTED",
            action="SUBMIT_COMPLAINT",
            is_accepted=True,
            reason="Citizen registered grievance with photo proof of burst pipeline.",
            timestamp=now - datetime.timedelta(hours=6),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-3109",
            user_id="supervisor-1",
            user_name="Sh. Vikas Patil",
            user_role="supervisor",
            previous_status="SUBMITTED",
            requested_status="UNDER_REVIEW",
            action="REVIEW",
            is_accepted=True,
            reason="Supervisor triaged grievance and confirmed water grid urgency.",
            timestamp=now - datetime.timedelta(hours=5),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-3109",
            user_id="supervisor-1",
            user_name="Sh. Vikas Patil",
            user_role="supervisor",
            previous_status="UNDER_REVIEW",
            requested_status="ASSIGNED",
            action="ASSIGN",
            is_accepted=True,
            reason="Assigned to Er. Amit Deshmukh (Executive Engineer - Water Works).",
            timestamp=now - datetime.timedelta(hours=4),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-3109",
            user_id="officer-1",
            user_name="Er. Amit Deshmukh",
            user_role="officer",
            previous_status="ASSIGNED",
            requested_status="IN_PROGRESS",
            action="START_WORK",
            is_accepted=True,
            reason="Emergency isolation valve closed; 300mm ductile pipe sleeve replacement underway.",
            timestamp=now - datetime.timedelta(hours=2),
        ))

        # Complaint 2: ASSIGNED
        c2 = Complaint(
            id="GFX-2026-1044",
            citizen_id="citizen-1",
            citizen_name="Aarav Sharma",
            citizen_mobile="8448005148",
            category="Streetlights",
            category_code="CIV-ELE-04",
            title="Series of 5 Streetlights Not Working on Main Road",
            description="Dark stretch of 200 meters near school junction creating safety risk for pedestrians and women commuters at night.",
            ward="Ward No. 14 (Shivaji Chowk)",
            location="Behind Municipal School No. 6, Shivaji Chowk",
            landmark="Pillar #12 to #16",
            priority="Medium",
            status="ASSIGNED",
            assigned_officer_id="officer-3",
            assigned_officer_name="Er. Sandeep More",
            assigned_department="Streetlights",
            created_at=now - datetime.timedelta(days=1),
            updated_at=now - datetime.timedelta(hours=3),
        )
        db.add(c2)

        db.add(AuditLog(
            complaint_id="GFX-2026-1044",
            user_id="citizen-1",
            user_name="Aarav Sharma",
            user_role="citizen",
            previous_status="NONE",
            requested_status="SUBMITTED",
            action="SUBMIT_COMPLAINT",
            is_accepted=True,
            reason="Citizen submitted dark streetlight hazard report.",
            timestamp=now - datetime.timedelta(days=1),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-1044",
            user_id="supervisor-1",
            user_name="Sh. Vikas Patil",
            user_role="supervisor",
            previous_status="SUBMITTED",
            requested_status="UNDER_REVIEW",
            action="REVIEW",
            is_accepted=True,
            reason="Supervisor verified feeder pillar and assigned priority.",
            timestamp=now - datetime.timedelta(hours=8),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-1044",
            user_id="supervisor-1",
            user_name="Sh. Vikas Patil",
            user_role="supervisor",
            previous_status="UNDER_REVIEW",
            requested_status="ASSIGNED",
            action="ASSIGN",
            is_accepted=True,
            reason="Work order dispatched to Er. Sandeep More for cherry-picker inspection.",
            timestamp=now - datetime.timedelta(hours=3),
        ))

        # Complaint 3: RESOLVED (Awaiting Supervisor Closure Approval!)
        c3 = Complaint(
            id="GFX-2026-8942",
            citizen_id="citizen-1",
            citizen_name="Aarav Sharma",
            citizen_mobile="8448005148",
            category="Roads & Potholes",
            category_code="CIV-ROD-03",
            title="Severe Deep Pothole on Busy Bus Route",
            description="Deep road cave-in and dangerous pothole causing traffic snarls and two-wheeler skid hazards near Shivaji Chowk.",
            ward="Ward No. 14 (Shivaji Chowk)",
            location="Near Shivaji Chowk, Station Road Junction",
            landmark="Opposite City Medical Store",
            priority="High",
            status="RESOLVED",
            assigned_officer_id="officer-2",
            assigned_officer_name="Er. Rajesh Sharma",
            assigned_department="Roads & Potholes",
            resolution_remarks="Pothole excavated to solid base, filled with premium hot-mix asphalt and compacted with vibratory roller. Curing complete.",
            resolution_proof_url="https://images.unsplash.com/photo-1584463699039-4448558eb8d5?auto=format&fit=crop&w=400&q=80",
            created_at=now - datetime.timedelta(days=2),
            updated_at=now - datetime.timedelta(hours=1),
        )
        db.add(c3)

        db.add(AuditLog(
            complaint_id="GFX-2026-8942",
            user_id="citizen-1",
            user_name="Aarav Sharma",
            user_role="citizen",
            previous_status="NONE",
            requested_status="SUBMITTED",
            action="SUBMIT_COMPLAINT",
            is_accepted=True,
            reason="Citizen reported deep pothole on bus lane.",
            timestamp=now - datetime.timedelta(days=2),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-8942",
            user_id="supervisor-1",
            user_name="Sh. Vikas Patil",
            user_role="supervisor",
            previous_status="SUBMITTED",
            requested_status="UNDER_REVIEW",
            action="REVIEW",
            is_accepted=True,
            reason="Verified location on PWD arterial map.",
            timestamp=now - datetime.timedelta(days=1, hours=18),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-8942",
            user_id="supervisor-1",
            user_name="Sh. Vikas Patil",
            user_role="supervisor",
            previous_status="UNDER_REVIEW",
            requested_status="ASSIGNED",
            action="ASSIGN",
            is_accepted=True,
            reason="Assigned to Er. Rajesh Sharma (PWD Roads).",
            timestamp=now - datetime.timedelta(days=1, hours=10),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-8942",
            user_id="officer-2",
            user_name="Er. Rajesh Sharma",
            user_role="officer",
            previous_status="ASSIGNED",
            requested_status="IN_PROGRESS",
            action="START_WORK",
            is_accepted=True,
            reason="Hot-mix asphalt gang deployed with vibratory compactor.",
            timestamp=now - datetime.timedelta(hours=6),
        ))
        db.add(AuditLog(
            complaint_id="GFX-2026-8942",
            user_id="officer-2",
            user_name="Er. Rajesh Sharma",
            user_role="officer",
            previous_status="IN_PROGRESS",
            requested_status="RESOLVED",
            action="RESOLVE",
            is_accepted=True,
            reason="Road patch completed with hot mix and post-repair photo uploaded. Submitted for supervisor closure.",
            timestamp=now - datetime.timedelta(hours=1),
        ))

        # Complaint 4: SUBMITTED (Ready for Supervisor to Review!)
        c4 = Complaint(
            id="GFX-2026-4421",
            citizen_id="citizen-2",
            citizen_name="Priya Patil",
            citizen_mobile="9822014589",
            category="Waste Management & Sanitation",
            category_code="CIV-SAN-01",
            title="Overflowing Garbage Dump near Central Market",
            description="Municipal garbage bin overflowing since yesterday; stray animals scattering waste on pedestrian walkway.",
            ward="Ward No. 03 (Central Market)",
            location="Vegetable Market Gate No. 2, Station Road",
            landmark="Opposite New Mandi Complex",
            priority="High",
            status="SUBMITTED",
            created_at=now - datetime.timedelta(minutes=45),
            updated_at=now - datetime.timedelta(minutes=45),
        )
        db.add(c4)

        db.add(AuditLog(
            complaint_id="GFX-2026-4421",
            user_id="citizen-2",
            user_name="Priya Patil",
            user_role="citizen",
            previous_status="NONE",
            requested_status="SUBMITTED",
            action="SUBMIT_COMPLAINT",
            is_accepted=True,
            reason="Citizen submitted sanitation report.",
            timestamp=now - datetime.timedelta(minutes=45),
        ))

        db.commit()
        print("Database initialization and initial seeding completed successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    init_db()
