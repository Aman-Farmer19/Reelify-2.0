# Reelify – AI Powered Short Video Generator

> Turn your ideas into short-form videos in seconds using Generative AI.

![Tech Stack](https://img.shields.io/badge/React.js-18-61DAFB?style=flat&logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat&logo=flask)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat&logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat&logo=openai)

---

## Features

- **AI Script Generation** — Describe your idea; GPT-4o-mini writes an optimised short-form script
- **Video Generation Flow** — Step-by-step progress UI (script → visuals → voice → render)
- **Authentication** — JWT-based login and registration
- **Dashboard** — View and manage all generated videos with stats
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Multiple Options** — Duration, format (9:16 / 16:9 / 1:1), style, voice, music, captions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Vite, Tailwind CSS |
| Backend | Python, Flask, Flask-JWT-Extended |
| AI | OpenAI GPT-4o-mini (script generation) |
| State | React Context API |
| HTTP | Axios, REST APIs |
| Auth | JWT (JSON Web Tokens) |

---

## Project Structure

```
reelify/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Top navigation bar
│   │   │   ├── Sidebar.jsx       # Dashboard sidebar
│   │   │   ├── AuthModal.jsx     # Login / Signup modal
│   │   │   └── VideoCard.jsx     # Video card component
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Home / Hero page
│   │   │   ├── Dashboard.jsx     # User video dashboard
│   │   │   └── Generator.jsx     # AI video generation page
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── App.jsx               # Routes and layout
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── app.py                    # Flask API (auth + generation)
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key (optional — app works in demo mode without it)

---

### 1. Clone the repository

```bash
git clone https://github.com/Aman-Farmer19/reelify.git
cd reelify
```

### 2. Setup the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key

# Run the Flask server
python app.py
# Backend runs at http://localhost:5000
```

### 3. Setup the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs at http://localhost:5173
```

### 4. Open in browser

Go to **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Log in | No |
| POST | `/api/generate` | Generate AI video | Optional |
| GET | `/api/videos` | Get user's videos | Yes |
| GET | `/api/health` | Health check | No |

---

## Environment Variables

```env
# backend/.env
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-your-key-here   # Optional — demo mode works without it
```

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render / Railway)
1. Push repo to GitHub
2. Connect on [render.com](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app`
5. Add environment variables in Render dashboard

---

## Built by

**Aman Tiwari** — B.Tech CSE, Kashi Institute of Technology  
[GitHub](https://github.com/Aman-Farmer19) | [LinkedIn](https://linkedin.com)

---

*Built with React.js, Flask, Tailwind CSS and Generative AI*
