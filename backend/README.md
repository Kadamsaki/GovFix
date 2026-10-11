# GovFix – Backend API Service

FastAPI-powered backend service for the **GovFix – AI-Powered Municipal Grievance Management System**.

---

## 🏗️ Architecture

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **Settings & Validation:** [Pydantic v2](https://docs.pydantic.dev/) & `pydantic-settings`
- **ASGI Server:** [Uvicorn](https://www.uvicorn.org/)
- **CORS:** Configured for local development (`http://localhost:5173`)

### Directory Layout

```
backend/
├── app/
│   ├── api/             # API routes
│   │   └── v1/
│   │       └── router.py# Health check and system endpoints
│   ├── core/            # Configuration and settings
│   │   └── config.py
│   ├── models/          # Database models (placeholder)
│   ├── schemas/         # Pydantic data schemas
│   ├── services/        # Business logic & AI pipelines (placeholder)
│   └── main.py          # FastAPI application factory
├── .env.example         # Environment template
├── requirements.txt     # Python dependencies
└── README.md
```

---

## 🚀 Getting Started

### 1. Create a Python Virtual Environment

```bash
# In the backend directory:
python -m venv .venv

# Activate on Windows:
.venv\Scripts\activate

# Or on Linux / macOS:
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 4. Run the Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access Interactive API Documentation

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
