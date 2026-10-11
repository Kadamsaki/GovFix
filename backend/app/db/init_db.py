import datetime
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.complaint import Complaint
from app.models.audit import AuditLog


def run_migrations():
    """Ensures database schema is up-to-date with SLA, attachment, and assignment columns."""
    with engine.connect() as conn:
        result = conn.execute(text("PRAGMA table_info(complaints)"))
        existing_cols = [row[1] for row in result.fetchall()]
        
        if "assigned_at" not in existing_cols:
            conn.execute(text("ALTER TABLE complaints ADD COLUMN assigned_at DATETIME"))
        if "resolution_deadline" not in existing_cols:
            conn.execute(text("ALTER TABLE complaints ADD COLUMN resolution_deadline DATETIME"))
        if "attachment_url" not in existing_cols:
            conn.execute(text("ALTER TABLE complaints ADD COLUMN attachment_url TEXT"))
        
        conn.commit()


def init_db():
    """Initializes tables, runs migrations, and seeds test accounts and sample complaints."""
    Base.metadata.create_all(bind=engine)
    run_migrations()

    db = SessionLocal()

    try:
        now = datetime.datetime.utcnow()

        # Officers list covering all 5 municipal departments
        required_officers = [
            User(
                id="officer-1",
                name="Er. Amit Deshmukh",
                email="amit.deshmukh@govfix.municipal.gov.in",
                mobile="9823011440",
                role="officer",
                department="Water Supply Department",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Executive Engineer (Water Works)",
            ),
            User(
                id="officer-2",
                name="Er. Rajesh Sharma",
                email="rajesh.sharma@govfix.municipal.gov.in",
                mobile="9820044912",
                role="officer",
                department="Roads & Public Works Department",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Junior Engineer (Roads Maintenance)",
            ),
            User(
                id="officer-3",
                name="Er. Sandeep More",
                email="sandeep.more@govfix.municipal.gov.in",
                mobile="9821155290",
                role="officer",
                department="Electrical Department",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Junior Engineer (Electrical & Lighting)",
            ),
            User(
                id="officer-4",
                name="Er. Ramesh Shinde",
                email="ramesh.shinde@govfix.municipal.gov.in",
                mobile="9820055123",
                role="officer",
                department="Sanitation Department",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Sanitation Superintendent",
            ),
            User(
                id="officer-5",
                name="Er. Ganesh Jadhav",
                email="ganesh.jadhav@govfix.municipal.gov.in",
                mobile="9820077890",
                role="officer",
                department="Drainage Department",
                ward="Ward No. 14 (Shivaji Chowk)",
                designation="Drainage & Sewerage Inspector",
            ),
        ]

        # Check if users already seeded
        existing_users = {u.id: u for u in db.query(User).all()}
        if not existing_users:
            print("Seeding initial GovFix users across all 4 roles...")
            seed_users = [
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
            ] + required_officers

            for u in seed_users:
                db.add(u)
            db.commit()
        else:
            # Add missing officers if not present
            for off in required_officers:
                if off.id not in existing_users:
                    db.add(off)
                else:
                    # Update department name to official naming
                    existing_users[off.id].department = off.department
            db.commit()

        # Seed complaints if none exist
        if db.query(Complaint).count() == 0:
            # Complaint 1: IN_PROGRESS (Urgent, Water Supply)
            c1_created = now - datetime.timedelta(hours=5)
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
                assigned_department="Water Supply Department",
                assigned_at=now - datetime.timedelta(hours=4),
                resolution_deadline=c1_created + datetime.timedelta(hours=6),
                attachment_url="https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80",
                created_at=c1_created,
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
                timestamp=c1_created,
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
                timestamp=now - datetime.timedelta(hours=4, minutes=30),
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

            # Complaint 2: ASSIGNED (Medium, Streetlights)
            c2_created = now - datetime.timedelta(hours=18)
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
                assigned_department="Electrical Department",
                assigned_at=now - datetime.timedelta(hours=3),
                resolution_deadline=c2_created + datetime.timedelta(hours=48),
                attachment_url="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
                created_at=c2_created,
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
                timestamp=c2_created,
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

            # Complaint 3: RESOLVED (High, Roads & Potholes)
            c3_created = now - datetime.timedelta(days=2)
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
                assigned_department="Roads & Public Works Department",
                assigned_at=now - datetime.timedelta(days=1, hours=10),
                resolution_deadline=c3_created + datetime.timedelta(hours=24),
                attachment_url="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
                resolution_remarks="Pothole excavated to solid base, filled with premium hot-mix asphalt and compacted with vibratory roller. Curing complete.",
                resolution_proof_url="https://images.unsplash.com/photo-1584463699039-4448558eb8d5?auto=format&fit=crop&w=400&q=80",
                created_at=c3_created,
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
                timestamp=c3_created,
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

            # Complaint 4: SUBMITTED (High, Waste Management & Sanitation)
            c4_created = now - datetime.timedelta(minutes=45)
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
                status="ASSIGNED",
                assigned_officer_id="officer-4",
                assigned_officer_name="Er. Ramesh Shinde",
                assigned_department="Sanitation Department",
                assigned_at=c4_created,
                resolution_deadline=c4_created + datetime.timedelta(hours=24),
                attachment_url="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
                created_at=c4_created,
                updated_at=c4_created,
            )
            db.add(c4)

            db.add(AuditLog(
                complaint_id="GFX-2026-4421",
                user_id="citizen-2",
                user_name="Priya Patil",
                user_role="citizen",
                previous_status="NONE",
                requested_status="ASSIGNED",
                action="AUTO_ASSIGN_OFFICER",
                is_accepted=True,
                reason="System automatically assigned field officer Er. Ramesh Shinde (Sanitation Superintendent) based on problem category. Direct dispatch to field officer.",
                timestamp=c4_created,
            ))

            db.commit()
            print("Database initialization and initial seeding completed successfully.")
        else:
            # Backfill any complaints in existing DB with missing deadlines, departments, or assigned officers
            complaints = db.query(Complaint).all()
            sla_hours = {"Urgent": 6, "High": 24, "Medium": 48, "Low": 72}
            
            # Department routing mapping
            dept_map = {
                "water": "Water Supply Department",
                "road": "Roads & Public Works Department",
                "pothole": "Roads & Public Works Department",
                "light": "Electrical Department",
                "sanitation": "Sanitation Department",
                "waste": "Sanitation Department",
                "garbage": "Sanitation Department",
                "drainage": "Drainage Department",
                "sewage": "Drainage Department",
            }
            officer_cat_map = {
                "water": ("officer-1", "Er. Amit Deshmukh", "Water Supply Department"),
                "road": ("officer-2", "Er. Rajesh Sharma", "Roads & Public Works Department"),
                "pothole": ("officer-2", "Er. Rajesh Sharma", "Roads & Public Works Department"),
                "light": ("officer-3", "Er. Sandeep More", "Electrical Department"),
                "sanitation": ("officer-4", "Er. Ramesh Shinde", "Sanitation Department"),
                "waste": ("officer-4", "Er. Ramesh Shinde", "Sanitation Department"),
                "garbage": ("officer-4", "Er. Ramesh Shinde", "Sanitation Department"),
                "drain": ("officer-5", "Er. Ganesh Jadhav", "Drainage Department"),
                "sewag": ("officer-5", "Er. Ganesh Jadhav", "Drainage Department"),
            }

            for c in complaints:
                # 1. Backfill department if missing
                if not c.assigned_department or c.assigned_department in ["Water Supply", "Roads & Potholes", "Streetlights"]:
                    cat_lower = (c.category or "").lower()
                    matched = False
                    for key, dept in dept_map.items():
                        if key in cat_lower:
                            c.assigned_department = dept
                            matched = True
                            break
                    if not matched:
                        c.assigned_department = "Public Works & Grievance Cell"

                # 2. Backfill deadline if missing
                if not c.resolution_deadline and c.created_at:
                    hrs = sla_hours.get(c.priority, 48)
                    c.resolution_deadline = c.created_at + datetime.timedelta(hours=hrs)

                # 3. Auto-assign officer if not assigned
                if not c.assigned_officer_id or c.status == "SUBMITTED":
                    cat_lower = (c.category or "").lower()
                    off_id, off_name, dept = ("officer-2", "Er. Rajesh Sharma", "Roads & Public Works Department")
                    for k, v in officer_cat_map.items():
                        if k in cat_lower:
                            off_id, off_name, dept = v
                            break
                    c.assigned_officer_id = off_id
                    c.assigned_officer_name = off_name
                    if not c.assigned_department:
                        c.assigned_department = dept
                    if not c.assigned_at:
                        c.assigned_at = c.created_at or now
                    if c.status == "SUBMITTED":
                        c.status = "ASSIGNED"

                # 4. Backfill assigned_at if assigned but empty
                if c.assigned_officer_id and not c.assigned_at:
                    c.assigned_at = c.created_at + datetime.timedelta(hours=1)

            db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    init_db()
