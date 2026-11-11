import os
import re
import uuid
import asyncio
import logging
from typing import Dict, Any, List, Optional
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import google.generativeai as genai
import edge_tts

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

# Chaves e Configurações
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
PUBLIC_API_URL = os.getenv("PUBLIC_API_URL", "https://manifest.elohdigital.com.br")

if GEMINI_API_KEY and GEMINI_API_KEY != "sua_chave_gemini_aqui":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Google Generative AI (Gemini) configurado.")
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

# Banco em memória para persistência de sessões
SESSIONS_DB: Dict[str, Any] = {}

def clean_script_for_tts(raw_text: str) -> str:
    """Remove caracteres de formatação markdown para a voz ler com naturalidade."""
    text = re.sub(r'#+\s*', '', raw_text)
    text = re.sub(r'[*_~`]', '', text)
    text = re.sub(r'[-•]\s*', '', text)
    text = re.sub(r'\n+', ' ', text)
    return text.strip()

def build_meditation_prompt(user_name: str, focus_area: str, answers: List[AnswerItem]) -> str:
    answers_text = "\n".join([f"- [{a.category}] {a.question}: {a.answer}" for a in answers])
    
    return f"""
Você é um mestre em reprogramação mental quântica e meditações guiadas estilo o app Stella.
Crie um roteiro de áudio guiado imersivo, compassivo, sereno e transformador em português do Brasil para: {user_name}.

Foco principal de manifestação escolhido: {focus_area}

Respostas completas do diagnóstico:
{answers_text}

ESTRUTURA DO ROTEIRO (dividido em 4 partes com títulos claros):
1. FASE 1: INDUÇÃO E RESPIRAÇÃO (Acalmar o sistema nervoso, desaceleração Alfa/Theta)
2. FASE 2: DISSOLUÇÃO DOS BLOQUEIOS (Limpeza das crenças limitantes específicas citadas pelo usuário)
3. FASE 3: AFIRMAÇÕES NO TEMPO PRESENTE (Reprogramação do subconsciente em 1ª pessoa)
4. FASE 4: ANCORAGEM DA NOVA IDENTIDADE (Visualização vívida da realização)

Retorne o texto pronto para ser falado, com pausas naturais e ritmo contemplativo.
"""

def generate_fallback_script(user_name: str, focus_area: str, answers: List[AnswerItem]) -> str:
    bloqueio = "as autocríticas do passado"
    for a in answers:
        if "Crenças" in (a.category or "") or a.question_id in [8, 10]:
            bloqueio = a.answer
            break

    return f"""### 🌬️ FASE 1: INDUÇÃO E DESACELERAÇÃO RESPIRATÓRIA
Feche suavemente os olhos, {user_name}. Puxe o ar profundamente pelas narinas... segure por um breve instante... e solte devagar, liberando todo o peso dos ombros e da mente. A cada respiração, seu corpo se acalma e entra em ressonância com o campo quântico.

### 🌊 FASE 2: DISSOLUÇÃO DOS BLOQUEIOS E MEMÓRIAS
Reconheça agora a sensação de {bloqueio} que você carregou até hoje. Você não precisa mais lutar contra ela. Simplesmente observe-a como uma folha flutuando em um rio e dissolvendo-se na água límpida. Você está livre para viver o seu verdadeiro potencial.

### ✨ FASE 3: AFIRMAÇÕES DE PODER E PROSPERIDADE
Repita mentalmente, sentindo a verdade em cada célula:
- Eu sou a personificação viva da minha nova realidade.
- Minha mente está alinhada com o fluxo contínuo de {focus_area}.
- Eu mereço, recebo e sustento toda a abundância que o Universo me oferece.
- Minhas decisões são guiadas por clareza, coragem e dignidade.

### 🔮 FASE 4: ANCORAGEM DA SUA VERSÃO REALIZADA
Visualize-se agora vivendo a sua vida exatamente como você planejou. Sinta a tranquilidade no seu olhar e a certeza inabalável no peito. Essa versão já existe, e hoje você assumiu o seu lugar nela. Respire fundo, sorria e ancore essa frequência."""

async def generate_speech_edge_tts(text: str, output_path: str) -> bool:
    """Gera áudio com voz neural gratuita em português de alta qualidade (pt-BR-FranciscaNeural)."""
    try:
        clean_text = clean_script_for_tts(text)
        communicate = edge_tts.Communicate(clean_text, "pt-BR-FranciscaNeural", rate="-12%", pitch="-2Hz")
        await communicate.save(output_path)
        if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
            logger.info(f"Áudio Edge-TTS gerado com sucesso ({os.path.getsize(output_path)} bytes)")
            return True
    except Exception as e:
        logger.error(f"Erro no Edge-TTS: {e}")
    return False

def generate_speech_elevenlabs(text: str, output_path: str) -> bool:
    """Sintetiza via ElevenLabs se a chave estiver configurada."""
    if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY == "sua_chave_elevenlabs_aqui":
        return False
    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        payload = {
            "text": text[:3500],
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.65, "similarity_boost": 0.75}
        }
        res = requests.post(url, json=payload, headers=headers, timeout=60)
        if res.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(res.content)
            logger.info(f"Áudio ElevenLabs gerado com sucesso em {output_path}")
            return True
        else:
            logger.warning(f"Erro ElevenLabs ({res.status_code}): {res.text}")
    except Exception as e:
        logger.warning(f"Falha ElevenLabs: {e}")
    return False

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Manifest Backend",
        "gemini_active": bool(GEMINI_API_KEY and GEMINI_API_KEY != "sua_chave_gemini_aqui"),
        "elevenlabs_active": bool(ELEVENLABS_API_KEY and ELEVENLABS_API_KEY != "sua_chave_elevenlabs_aqui"),
        "edge_tts_active": True
    }

@app.post("/api/generate-session", response_model=SessionResponse)
async def generate_session(data: DiagnosticSubmission):
    session_id = str(uuid.uuid4())
    logger.info(f"Gerando sessão {session_id} para {data.user_name} ({data.focus_area})")

    # 1. Geração do Roteiro (Gemini ou Fallback rico)
    script = ""
    if GEMINI_API_KEY and GEMINI_API_KEY != "sua_chave_gemini_aqui":
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = build_meditation_prompt(data.user_name, data.focus_area, data.answers)
            response = model.generate_content(prompt)
            script = response.text
            logger.info(f"Roteiro gerado via Gemini ({len(script)} chars)")
        except Exception as e:
            logger.warning(f"Gemini indisponível, usando roteiro base: {e}")
            script = generate_fallback_script(data.user_name, data.focus_area, data.answers)
    else:
        script = generate_fallback_script(data.user_name, data.focus_area, data.answers)

    # 2. Geração Real de Áudio (ElevenLabs se configurado, ou Edge-TTS gratuito)
    audio_filename = f"session_{session_id}.mp3"
    audio_path = os.path.join(AUDIO_DIR, audio_filename)

    audio_ok = generate_speech_elevenlabs(script, audio_path)
    if not audio_ok:
        audio_ok = await generate_speech_edge_tts(script, audio_path)

    # Se por algum motivo falhar, usa o sample 432Hz existente
    final_audio_filename = audio_filename if audio_ok else "sample_theta_432hz.mp3"
    audio_url = f"{PUBLIC_API_URL}/audios/{final_audio_filename}"

    # Estima a duração real (média de 125 palavras por minuto)
    word_count = len(script.split())
    estimated_duration = max(180, int((word_count / 125) * 60))

    result = {
        "session_id": session_id,
        "user_name": data.user_name,
        "focus_area": data.focus_area,
        "script": script,
        "audio_url": audio_url,
        "duration_seconds": estimated_duration
    }
    SESSIONS_DB[session_id] = result
    logger.info(f"Sessão pronta! Áudio disponível em: {audio_url}")
    return result

@app.get("/api/session/{session_id}", response_model=SessionResponse)
def get_session(session_id: str):
    if session_id not in SESSIONS_DB:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    return SESSIONS_DB[session_id]
