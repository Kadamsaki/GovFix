import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

raw_db_url = os.getenv("DATABASE_URL")

if raw_db_url:
    # Normalize postgres:// to postgresql:// for modern SQLAlchemy compatibility
    if raw_db_url.startswith("postgres://"):
        DATABASE_URL = raw_db_url.replace("postgres://", "postgresql://", 1)
    else:
        DATABASE_URL = raw_db_url
else:
    # Check if running in Vercel Serverless environment
    if os.getenv("VERCEL"):
        tmp_db_path = "/tmp/govfix.db"
        # Copy bundled seed SQLite database to /tmp so write operations succeed in read-only lambda
        seed_candidates = [
            os.path.join(os.path.dirname(__file__), "..", "..", "govfix.db"),
            os.path.join(os.getcwd(), "backend", "govfix.db"),
            os.path.join(os.getcwd(), "govfix.db"),
        ]
        if not os.path.exists(tmp_db_path):
            for candidate in seed_candidates:
                if os.path.exists(candidate):
                    try:
                        shutil.copyfile(candidate, tmp_db_path)
                        break
                    except Exception as e:
                        print(f"Notice: unable to copy seed db to /tmp: {e}")
        DATABASE_URL = f"sqlite:///{tmp_db_path}"
    else:
        # Standard local development database path
        local_db = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "govfix.db"))
        DATABASE_URL = f"sqlite:///{local_db}"

is_sqlite = DATABASE_URL.startswith("sqlite")

if is_sqlite:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency that provides a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
