import os
import uuid
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Manifest API - Stella Style Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnswerItem(BaseModel):
    question_id: int
    question: str
    answer: str

class DiagnosticSubmission(BaseModel):
    user_name: str
    focus_area: str
    answers: List[AnswerItem]

class SessionResponse(BaseModel):
    session_id: str
    user_name: str
    script: str
    audio_url: str
    duration_seconds: int

# Banco em memória simulado para protótipo
SESSIONS_DB: Dict[str, Any] = {}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Manifest Backend"}

@app.post("/api/generate-session", response_model=SessionResponse)
def generate_session(data: DiagnosticSubmission):
    session_id = str(uuid.uuid4())
    
    # 1. Monta o script de afirmação e reprogramação baseado nas respostas
    summary_answers = "\n".join([f"- {a.question}: {a.answer}" for a in data.answers])
    script = (
        f"Olá, {data.user_name}. Respire fundo e feche os olhos. "
        f"Você está alinhando sua mente para expandir sua área de {data.focus_area}. "
        f"Reconhecemos os bloqueios trazidos e liberamos cada um deles agora. "
        f"Sua nova realidade está sendo construída a partir de hoje."
    )
    
    # 2. Em produção com ElevenLabs/TTS e FFmpeg:
    # sintetiza voz + sobrepõe trilha sonora binaural 432Hz/theta
    audio_filename = f"session_{session_id}.mp3"
    audio_url = f"/audios/{audio_filename}"
    
    result = {
        "session_id": session_id,
        "user_name": data.user_name,
        "script": script,
        "audio_url": audio_url,
        "duration_seconds": 360
    }
    SESSIONS_DB[session_id] = result
    return result

@app.get("/api/session/{session_id}", response_model=SessionResponse)
def get_session(session_id: str):
    if session_id not in SESSIONS_DB:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    return SESSIONS_DB[session_id]
