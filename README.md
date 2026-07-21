# Reelify-2.0 – AI Powered Short Video Generator

> Turn your ideas into short-form videos in seconds using Generative AI.

![Tech Stack](https://img.shields.io/badge/React.js-18-61DAFB?style=flat&logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat&logo=flask)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat&logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat&logo=openai)

---

## Features

- **Unified Server** — Frontend and Backend run from a single Flask server on a single port (5000)
- **AI Script Generation** — Gemini 1.5 Flash / GPT-4o-mini writes an optimised short-form script
- **Video Generation Flow** — Step-by-step progress UI (script → visuals → voice → render)
- **Authentication** — JWT-based login and registration
- **Persistent Storage** — SQLite database; all users and videos survive server restarts
- **Dashboard** — View and manage all generated videos with stats
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Multiple Options** — Duration, format (9:16 / 16:9 / 1:1), style, voice, music, captions
- **Rate Limiting** — 10 requests/min per IP to protect API quotas
- **Secure Uploads** — JWT-protected, extension-checked, 16 MB cap

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Vite, Tailwind CSS |
| Backend | Python, Flask, Flask-JWT-Extended |
| Database | SQLite (via stdlib `sqlite3`) |
| AI | Gemini 1.5 Flash (primary), OpenAI GPT-4o-mini (fallback) |
| State | React Context API |
| HTTP | Axios, REST APIs |
| Auth | JWT (JSON Web Tokens) |

---

## Project Structure

```
reelify/
├── start.bat                 # One-click launcher (builds UI + runs Flask server)
├── server.js                 # Dev runner utility
├── frontend/
│   ├── dist/                 # Built frontend production files (served by Flask)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Top navigation bar
│   │   │   ├── Sidebar.jsx   # Dashboard sidebar
│   │   │   ├── AuthModal.jsx # Login / Signup modal
│   │   │   └── VideoCard.jsx # Video card component
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx # Home / Hero page
│   │   │   ├── Dashboard.jsx # User video dashboard
│   │   │   └── Generator.jsx # AI video generation page
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── App.jsx           # Routes and layout
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── app.py                # Flask Server (serves React + API routes)
│   ├── reelify.db            # SQLite database (auto-created on first run)
│   ├── requirements.txt
│   ├── .env.example          # Template — copy to .env and fill in keys
│   └── .env                  # ⚠️ Never commit this file
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- API keys (all optional — app works in demo mode without them)

---

### 1. Clone the repository

```bash
git clone https://github.com/Aman-Farmer19/Reelify-2.0.git
cd Reelify-2.0/reelify
```

---

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your keys. At minimum, set a strong `JWT_SECRET`:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

### 3. Run the App

#### Option A: One-click launcher (Windows)
```powershell
.\start.bat
```

#### Option B: Manual Startup

**Step 1: Build the Frontend**
```bash
cd frontend
npm install
npm run build
cd ..
```

**Step 2: Start the Server**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python app.py
```

---

### 4. Open in Browser

Go to **[http://localhost:5000](http://localhost:5000)**

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Log in | No |
| POST | `/api/generate` | Generate AI video (rate limited: 10/min) | Optional |
| GET | `/api/videos` | Get user's videos | ✅ Required |
| POST | `/api/upload` | Upload custom asset | ✅ Required |
| GET | `/api/health` | Health check | No |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ Production | Long random string for JWT signing |
| `FLASK_DEBUG` | No | Set `true` for local dev only |
| `OPENAI_API_KEY` | No | GPT-4o-mini script generation |
| `GEMINI_API_KEY` | No | Gemini 1.5 Flash (primary AI) |
| `PEXELS_API_KEY` | No | Stock video search |
| `PIXABAY_API_KEY` | No | Stock video fallback |

---

## Deployment (Render / Railway)

Since the frontend is served statically by Flask, the entire app deploys as a single service.

### Steps

1. Push your repository to GitHub (**ensure `.env` is in `.gitignore`** ✅)
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app)
3. Set the following in the platform's environment variables dashboard:

   | Key | Value |
   |-----|-------|
   | `JWT_SECRET` | A 32+ char random string |
   | `FLASK_DEBUG` | `false` |
   | `OPENAI_API_KEY` | Your key (optional) |
   | `GEMINI_API_KEY` | Your key (optional) |
   | `PEXELS_API_KEY` | Your key (optional) |

4. **Build Command:**
   ```
   cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt
   ```

5. **Start Command:**
   ```
   cd backend && gunicorn app:app
   ```

> **Note:** SQLite `reelify.db` is stored on the server's local disk. On Render's free tier, the disk resets on deploy. For persistent storage across deploys, upgrade to Render's **Persistent Disk** add-on or migrate to PostgreSQL.

---

## Built by

**Aman Tiwari** — B.Tech CSE, Kashi Institute of Technology  
[GitHub](https://github.com/Aman-Farmer19) | [LinkedIn](https://linkedin.com)

---

*Built with React.js, Flask, SQLite, Tailwind CSS and Generative AI*
