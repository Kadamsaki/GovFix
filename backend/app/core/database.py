import os
import shutil
from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

def normalize_database_url(raw_url: str) -> str:
    if not raw_url:
        return raw_url
    url = raw_url.strip()
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    
    if "://" in url:
        scheme_part, rest = url.split("://", 1)
        at_parts = rest.split("@")
        if len(at_parts) > 2:
            host_db = at_parts[-1]
            user_pass = "@".join(at_parts[:-1])
            if ":" in user_pass:
                user, password = user_pass.split(":", 1)
                url = f"{scheme_part}://{user}:{quote_plus(password)}@{host_db}"
    return url

raw_db_url = os.getenv("DATABASE_URL")

if raw_db_url:
    DATABASE_URL = normalize_database_url(raw_db_url)
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
