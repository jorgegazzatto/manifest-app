import os
import uuid
import logging
from typing import Dict, Any, List, Optional
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import google.generativeai as genai

# Configuração de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("manifest-backend")

app = FastAPI(title="Manifest API - Stella Style Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Diretório de armazenamento de áudio
AUDIO_DIR = os.path.join(os.path.dirname(__file__), "audio_storage")
os.makedirs(AUDIO_DIR, exist_ok=True)
app.mount("/audios", StaticFiles(directory=AUDIO_DIR), name="audios")

# Chaves de API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM") # Rachel (ou voz acolhedora)

if GEMINI_API_KEY and GEMINI_API_KEY != "sua_chave_gemini_aqui":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Google Generative AI (Gemini) configurado com sucesso.")
    except Exception as e:
        logger.warning(f"Erro ao configurar Gemini: {e}")

class AnswerItem(BaseModel):
    question_id: int
    category: Optional[str] = "Geral"
    question: str
    answer: str

class DiagnosticSubmission(BaseModel):
    user_name: str
    focus_area: str
    answers: List[AnswerItem]

class SessionResponse(BaseModel):
    session_id: str
    user_name: str
    focus_area: str
    script: str
    audio_url: str
    duration_seconds: int

# Banco em memória para persistência rápida de sessões
SESSIONS_DB: Dict[str, Any] = {}

def build_meditation_prompt(user_name: str, focus_area: str, answers: List[AnswerItem]) -> str:
    answers_text = "\n".join([f"- [{a.category}] {a.question}: {a.answer}" for a in answers])
    
    return f"""
Você é um especialista em reprogramação mental, física quântica e meditações guiadas estilo o aplicativo Stella.
Crie um roteiro de áudio guiado imersivo, acolhedor e profundo em português do Brasil para: {user_name}.

Foco principal de manifestação: {focus_area}

Respostas completas do diagnóstico do usuário:
{answers_text}

ESTRUTURA OBRIGATÓRIA DO ROTEIRO (dividido em 4 partes com títulos claros):

1. FASE 1: INDUÇÃO E RESPIRAÇÃO (Acalmar o sistema nervoso, ondas alfa/theta)
- Instrua respirações conscientes e relaxamento corporal progressivo.
- Crie um tom de voz íntimo, compassivo e seguro.

2. FASE 2: DISSOLUÇÃO DOS BLOQUEIOS (Limpeza de crenças limitantes específicas)
- Conecte diretamente com os medos, autossabotagens e memórias relatadas pelo usuário no diagnóstico.
- Promova o desapego e a transmutação dessas crenças em luz e espaço mental.

3. FASE 3: AFIRMAÇÕES NO TEMPO PRESENTE (Reprogramação do subconsciente)
- Apresente de 5 a 8 afirmações poderosas na 1ª pessoa ("Eu sou", "Eu manifesto", "Minha realidade é").
- Foque especificamente na expansão de {focus_area}.

4. FASE 4: ANCORAGEM E VISÃO DA NOVA IDENTIDADE
- Guie a pessoa para sentir e incorporar a sua versão futura já realizada agora.
- Fechamento com sensação duradoura de gratidão e poder pessoal.

Retorne apenas o texto do roteiro, pronto para ser gravado ou falado.
"""

def generate_fallback_script(user_name: str, focus_area: str, answers: List[AnswerItem]) -> str:
    """Gera um roteiro estruturado sob medida quando a chave de API não estiver disponível."""
    bloqueio = "as autocríticas do passado"
    for a in answers:
        if "Crenças" in (a.category or "") or a.question_id in [8, 10]:
            bloqueio = a.answer
            break

    return f"""### 🌬️ FASE 1: INDUÇÃO E DESACELERAÇÃO RESPIRATÓRIA
Feche suavemente os olhos, {user_name}. Puxe o ar profundamente pelas narinas... segure por um breve instante... e solte devagar, liberando todo o peso dos ombros e da mente. A cada respiração, seu corpo se acalma e entra em ressonância com o campo de infinitas possibilidades.

### 🌊 FASE 2: DISSOLUÇÃO DOS BLOQUEIOS E MEMÓRIAS
Reconheça agora a sensação de {bloqueio} que você carregou até hoje. Você não precisa mais lutar contra ela. Simplesmente observe-a como uma folha flutuando em um rio e dissolvendo-se na água límpida. Você está livre para viver o seu verdadeiro potencial.

### ✨ FASE 3: AFIRMAÇÕES DE PODER E PROSPERIDADE
Repita mentalmente, sentindo a verdade em cada célula:
- Eu sou a personificação viva da minha nova realidade.
- Minha mente está alinhada com o fluxo contínuo de {focus_area}.
- Eu mereço, recebo e sustento toda a abundância que o Universo me oferece.
- Minhas decisões são guiadas por clareza, coragem e dignidade.

### 🔮 FASE 4: ANCORAGEM DA SUA VERSÃO REALIZADA
Visualize-se agora vivendo a sua vida exatamente como você planejou. Sinta a textura das suas roupas, a tranquilidade no seu olhar e a certeza inabalável no peito. Essa versão já existe, e hoje você assumiu o seu lugar nela. Respire fundo, sorria e ancore essa frequência."""

def synthesize_audio_if_available(text: str, filename: str) -> bool:
    """Sintetiza áudio via ElevenLabs se a chave estiver configurada."""
    if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY == "sua_chave_elevenlabs_aqui":
        return False
        
    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        payload = {
            "text": text[:2500], # Limite seguro para teste
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.65,
                "similarity_boost": 0.75
            }
        }
        res = requests.post(url, json=payload, headers=headers, timeout=60)
        if res.status_code == 200:
            dest_path = os.path.join(AUDIO_DIR, filename)
            with open(dest_path, "wb") as f:
                f.write(res.content)
            logger.info(f"Áudio sintetizado com sucesso salvo em {dest_path}")
            return True
        else:
            logger.warning(f"Erro ElevenLabs ({res.status_code}): {res.text}")
    except Exception as e:
        logger.warning(f"Falha ao chamar ElevenLabs: {e}")
    return False

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Manifest Backend",
        "gemini_active": bool(GEMINI_API_KEY and GEMINI_API_KEY != "sua_chave_gemini_aqui"),
        "elevenlabs_active": bool(ELEVENLABS_API_KEY and ELEVENLABS_API_KEY != "sua_chave_elevenlabs_aqui")
    }

@app.post("/api/generate-session", response_model=SessionResponse)
def generate_session(data: DiagnosticSubmission):
    session_id = str(uuid.uuid4())
    logger.info(f"Gerando sessão {session_id} para {data.user_name} ({data.focus_area})")

    # 1. Geração do Roteiro com Gemini ou Fallback
    script = ""
    if GEMINI_API_KEY and GEMINI_API_KEY != "sua_chave_gemini_aqui":
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = build_meditation_prompt(data.user_name, data.focus_area, data.answers)
            response = model.generate_content(prompt)
            script = response.text
            logger.info(f"Roteiro gerado via Gemini com sucesso ({len(script)} caracteres).")
        except Exception as e:
            logger.warning(f"Falha na chamada ao Gemini, usando roteiro base: {e}")
            script = generate_fallback_script(data.user_name, data.focus_area, data.answers)
    else:
        script = generate_fallback_script(data.user_name, data.focus_area, data.answers)

    # 2. Síntese de Áudio (ElevenLabs se configurado)
    audio_filename = f"session_{session_id}.mp3"
    audio_created = synthesize_audio_if_available(script, audio_filename)
    
    # URL do áudio (se gerado ou mock local)
    audio_url = f"/audios/{audio_filename}" if audio_created else "/audios/sample_theta_432hz.mp3"

    result = {
        "session_id": session_id,
        "user_name": data.user_name,
        "focus_area": data.focus_area,
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
