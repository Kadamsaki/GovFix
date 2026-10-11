# GovFix – AI-Powered Municipal Grievance Management System

> **Transforming municipal complaint handling into a rapid, transparent, and intelligent civic resolution engine.**

GovFix is an enterprise-grade civic technology platform that empowers citizens to report public infrastructure and sanitation grievances while equipping municipal authorities with automated triage, AI classification, SLA tracking, and resolution verification.

---

## 🏛️ System Architecture Overview

GovFix is structured into decoupled frontend and backend services:

```
GovFix/
├── .gitignore               # Comprehensive Git exclusions (Python, Node, OS, env)
├── README.md                # Project documentation and quick start guide
├── backend/                 # FastAPI REST API Backend
│   ├── app/
│   │   ├── api/             # API routing (v1 endpoints)
│   │   │   └── v1/
│   │   │       └── router.py# Health check & system metadata endpoints
│   │   ├── core/            # App settings (Pydantic Settings & CORS)
│   │   │   └── config.py
│   │   ├── models/          # Database ORM models (placeholder)
│   │   ├── schemas/         # Request & response validation schemas
│   │   ├── services/        # Business logic & AI pipelines (placeholder)
│   │   └── main.py          # FastAPI application factory & middleware
│   ├── .env.example         # Environment template
│   ├── requirements.txt     # Python backend dependencies
│   └── README.md            # Backend documentation
└── frontend/                # React 18 + Vite Frontend
    ├── index.html           # HTML5 entry with Google Fonts
    ├── package.json         # NPM dependencies & scripts
    ├── vite.config.js       # Vite configuration with backend proxy
    ├── .env.example         # Frontend environment template
    ├── README.md            # Frontend documentation
    └── src/
        ├── App.jsx          # Starter dashboard with status & roadmap
        ├── App.css          # Layout, animations & component styles
        ├── index.css        # Civic design system tokens & resets
        ├── main.jsx         # React application root
        ├── components/
        │   ├── Navbar.jsx   # Header with status pills
        │   ├── HeroBanner.jsx # Civic overview banner
        │   ├── SystemStatus.jsx # Real-time backend connectivity checker
        │   └── RoadmapPreview.jsx # Modular milestone cards
        └── services/
            └── api.js       # Backend API client
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server with live reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **Interactive API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

### 2. Frontend Setup (React + Vite)

In a separate terminal:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)

---

## 🗺️ Implementation Roadmap

This initial setup marks the baseline foundation for GovFix. Features will be implemented incrementally across targeted commits:

| Commit / Phase | Focus | Key Deliverables |
| :--- | :--- | :--- |
| **Commit 1 (Current)** | **Initial Project Setup** | Clean decoupled structure, FastAPI health check, React Vite starter page, configuration files. |
| **Commit 2** | **Citizen Grievance Submission** | Citizen portal, complaint submission form, media upload, geolocation tagging, ticket tracking. |
| **Commit 3** | **AI Triage & Classification** | NLP grievance classification, automated department routing, urgency scoring, duplicate detection. |
| **Commit 4** | **Municipal Officer Portal** | Officer dashboard, complaint dispatch, status progression workflows, resolution proof upload. |
| **Commit 5** | **SLA Engine & Analytics** | Automated SLA breach alerts, ward heatmaps, grievance analytics, citizen feedback loops. |

---

## 📜 License

GovFix is open source and available under the [MIT License](LICENSE).
