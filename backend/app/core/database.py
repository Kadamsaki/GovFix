import os
import shutil
from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import re
from urllib.parse import quote_plus, unquote_plus

def normalize_database_url(raw_url: str) -> str:
    if not raw_url:
        return raw_url
    url = raw_url.strip()
    
    if url.startswith("postgres://"):
        scheme = "postgresql+psycopg2"
        rest = url[len("postgres://"):]
    elif url.startswith("postgresql://"):
        scheme = "postgresql+psycopg2"
        rest = url[len("postgresql://"):]
    elif "://" in url:
        scheme, rest = url.split("://", 1)
    else:
        return url

    if "@" in rest:
        last_at = rest.rfind("@")
        user_pass = rest[:last_at]
        host_db = rest[last_at + 1:]
    else:
        return url

    if ":" in user_pass:
        first_colon = user_pass.find(":")
        user = user_pass[:first_colon]
        password = user_pass[first_colon + 1:]
    else:
        user = user_pass
        password = ""

    db_name = "postgres"
    if "/" in host_db:
        host_port, db_name = host_db.split("/", 1)
        if "?" in db_name:
            db_name = db_name.split("?")[0]
    else:
        host_port = host_db

    host = host_port.split(":")[0]
    
    # Supabase direct host (db.<ref>.supabase.co) only resolves on IPv6.
    # AWS Lambda / Vercel requires the IPv4 pooler: aws-0-ap-southeast-1.pooler.supabase.com:6543
    supabase_match = re.search(r"db\.([a-z0-9]+)\.supabase\.co", host)
    if supabase_match:
        project_ref = supabase_match.group(1)
        host_port = "aws-0-ap-southeast-1.pooler.supabase.com:6543"
        if not user.endswith(f".{project_ref}"):
            user = f"{user}.{project_ref}"
    elif "pooler.supabase.com" in host and "modfhiksytvojuwshcnp" not in user:
        user = f"{user}.modfhiksytvojuwshcnp"

    encoded_pw = quote_plus(unquote_plus(password)) if password else ""
    auth = f"{user}:{encoded_pw}" if encoded_pw else user
    
    return f"{scheme}://{auth}@{host_port}/{db_name}"

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
