# 🤖 Cognoid AI Chatbot

A production-grade, embeddable AI customer support chatbot built for **Cognoid** — powered by **Groq's ultra-fast LLMs**, a **FastAPI** backend, and a **React/Vite** frontend with a premium glassmorphism UI.

The chatbot floats on any website via a lightweight embed snippet and intelligently routes customer queries, providing instant answers while offering a direct WhatsApp handoff when needed.

---

## ✨ Features

- **⚡ Ultra-fast AI responses** via [Groq](https://groq.com/) (sub-second LLM inference)
- **🛡️ Secure backend** with Pydantic input/output validation and CORS protection
- **💎 Premium glassmorphism UI** with smooth animations and a bouncing typing indicator
- **📱 WhatsApp CTA integration** — bot intelligently surfaces a WhatsApp button when human help is needed
- **🔌 Embeddable anywhere** via a single `<script>` tag using Shadow DOM isolation
- **🚀 Cloud-ready** — pre-configured for Render (backend) and Vercel (frontend) deployment

---

## 🏗️ Architecture

```
cognoid-chatbot/
├── backend/                   # FastAPI Python server
│   ├── .env                   # 🔒 Secret keys (never committed to Git)
│   ├── requirements.txt       # Python dependencies
│   └── app/
│       ├── config.py          # Loads & validates environment variables
│       ├── schema.py          # Pydantic request/response models (gatekeeper)
│       ├── main.py            # FastAPI app, CORS settings, /api/chat route
│       └── services/
│           └── groq_service.py # Groq AI client, system prompt, chat history
│
├── frontend/                  # React + Vite UI
│   ├── index.html             # HTML entry point
│   └── src/
│       ├── main.jsx           # React root mount
│       ├── App.jsx            # Master control panel (open/close state)
│       ├── index.css          # Global styles & glassmorphism design system
│       ├── components/
│       │   ├── ChatBubble.jsx     # Floating trigger button
│       │   ├── ChatWindow.jsx     # Main chat layout frame
│       │   ├── ChatMessage.jsx    # Individual message bubble
│       │   └── WhatsAppButton.jsx # Glowing WhatsApp CTA button
│       └── hooks/
│           └── useChat.js     # Network engine: manages messages, loading state & API calls
│
└── embed-snippet.js           # Lightweight Shadow DOM injector for third-party sites
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **AI Model** | [Groq](https://groq.com/) (LLaMA / Mixtral) |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic |
| **Frontend** | React 19, Vite 8, Vanilla CSS |
| **Deployment** | Render.com (backend) · Vercel (frontend) |
| **Embed** | Pure JS Shadow DOM injector |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- A free [Groq API Key](https://console.groq.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Krishna-S-2007/Cognoid-Solution.git
cd Cognoid-Solution
```

---

### 2. Set Up the Backend

```bash
cd backend
```

**Create your `.env` file:**

```env
GROQ_API_KEY=your_groq_api_key_here
WHATSAPP_NUMBER=919962373399
FRONTEND_URL=http://localhost:5173
```

**Install dependencies and start the server:**

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend API will be live at **`http://localhost:8000`**

> Verify it's running by visiting `http://localhost:8000/api/health` in your browser.

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be live at **`http://localhost:5173`**

---

## ☁️ Deployment

This project is pre-configured for a standard cloud deployment.

### Backend → Render.com

| Setting | Value |
|---|---|
| **Environment** | Python |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

Add your `GROQ_API_KEY`, `WHATSAPP_NUMBER`, and `FRONTEND_URL` as environment variables in the Render dashboard.

### Frontend → Vercel

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |

Point the `fetch` URL in `frontend/src/hooks/useChat.js` to your Render backend URL before deploying.

> For the full step-by-step deployment walkthrough, see [deployment_guide.md](./deployment_guide.md).

---

## 🔌 Embedding on a Website

Once deployed, paste this single line into the host website's HTML before the closing `</body>` tag:

```html
<script src="https://your-vercel-url.vercel.app/embed-snippet.js" defer></script>
```

The `embed-snippet.js` injects the chatbot inside a **Shadow DOM** container, completely isolating its styles from the host website. No CSS conflicts. No extra setup required.

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your private API key from [console.groq.com](https://console.groq.com/) |
| `WHATSAPP_NUMBER` | WhatsApp number in international format without `+` (e.g. `919962373399`) |
| `FRONTEND_URL` | The allowed origin for CORS (e.g. `https://cognoid-chatbot.vercel.app`) |

> ⚠️ **Never commit your `.env` file to Git.** It is already listed in `.gitignore`.

---

## 📡 API Reference

### `POST /api/chat`

Sends a user message and returns the AI's response.

**Request Body:**
```json
{
  "message": "What services does Cognoid offer?"
}
```

**Response:**
```json
{
  "reply": "Cognoid offers AI-powered automation solutions including...",
  "show_whatsapp": false
}
```

### `GET /api/health`

Returns `200 OK` to confirm the server is live.

---

## 📂 Key Files Quick Reference

| File | Purpose |
|---|---|
| `backend/app/services/groq_service.py` | 🧠 Edit the chatbot's personality, system prompt, and business details here |
| `frontend/src/index.css` | 🎨 All visual styles, glassmorphism tokens, and animations |
| `embed-snippet.js` | 🚀 The embeddable script for external websites |
| `deployment_guide.md` | 📖 Full cloud deployment walkthrough |

---

## 📄 License

This project was built exclusively for **Cognoid**. All rights reserved.

---

<p align="center">Built with ❤️ using FastAPI · React · Groq</p>
