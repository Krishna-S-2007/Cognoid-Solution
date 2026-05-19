# backend/app/main.py

# Import FastAPI, our high-performance web framework.
from fastapi import FastAPI

# Import CORSMiddleware. Browsers have a strict security feature that blocks 
# a frontend website from asking for data from a different backend server 
# unless the backend explicitly says "I allow this website".
from fastapi.middleware.cors import CORSMiddleware

# Import our custom LEGO blocks! This is the "Coordinator" file that brings 
# all the other pieces together.
from app.config import settings
from app.schema import ChatRequest, ChatResponse
from app.services.groq_service import generate_chat_response

# Initialize the FastAPI application.
app = FastAPI(title="Cognoid AI Chatbot API")

# Configure CORS using our settings.
app.add_middleware(
    CORSMiddleware,
    # We grab the allowed frontend URL from our config (e.g. http://localhost:5173).
    # This prevents random websites from using your API and burning your Groq credits.
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"], # Allow all types of requests (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# ==========================================
# API ROUTES (The URLs)
# ==========================================
@app.get("/")
def read_server():
    return {"status":"Server working properly"}
# 1. Health Check Route
# A simple endpoint to quickly verify if the server is alive without wasting API calls.
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Cognoid Chatbot API is running perfectly!"}


# 2. The Main Chat Route
# This is the endpoint our React widget will send data to via POST.
# Notice how we use our Gatekeeper schemas (ChatRequest and ChatResponse) here!
# FastAPI uses them to automatically validate the incoming and outgoing data.
@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Receives a message from the user, passes it to the Groq AI service,
    and returns the structured JSON response.
    """
    # Step A: We take the perfectly validated message from the user.
    user_text = request.message
    
    # Step B: We hand it to our "Doctor" (groq_service).
    # The doctor talks to Groq, applies our rules, and hands back a ChatResponse object.
    bot_reply = generate_chat_response(user_text)
    
    # Step C: We ship the perfectly packaged reply back to the React widget!
    return bot_reply
