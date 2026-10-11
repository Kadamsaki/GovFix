# GovFix – Frontend Application

Modern React 18 + Vite frontend for the **GovFix – AI-Powered Municipal Grievance Management System**.

---

## 🎨 Tech Stack

- **Framework:** React 18
- **Bundler & Dev Server:** [Vite](https://vitejs.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** Vanilla CSS with custom properties & responsive design system
- **Proxy:** Vite proxy configured to route `/api` to the local FastAPI backend (`http://localhost:8000`)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# In the frontend directory:
npm install
```

### 2. Configure Environment (Optional)

```bash
cp .env.example .env
```

Defaults to `VITE_API_URL=http://localhost:8000/api/v1`.

### 3. Start Development Server

```bash
npm run dev
```

Visit the app at [http://localhost:5173](http://localhost:5173).

### 4. Build for Production

```bash
npm run build
```
