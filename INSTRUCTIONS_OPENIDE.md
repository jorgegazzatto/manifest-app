# 🧭 Instruções do Projeto para Continuar no OpenIDE

Este documento foi preparado para orientar o desenvolvimento contínuo do **ManifestApp** diretamente pelo **OpenIDE** (ou qualquer IDE com suporte a IA/Copilot).

---

## 1. Como Abrir o Projeto no OpenIDE

1. Abra o **OpenIDE**.
2. Vá em **File > Open Folder** (ou **Abrir Pasta**).
3. Selecione o diretório raiz do projeto:
   ```text
   C:\Users\jorge\.gemini\antigravity\scratch\manifest-app
   ```

---

## 2. Inicialização dos Ambientes

Abra dois terminais integrados no OpenIDE:

### Terminal 1: Mobile (React Native / Expo)
```bash
cd mobile
npm install
npx expo start
```
* **Para testar no celular:** Baixe o app **Expo Go** (Android/iOS) e aponte a câmera para o QR Code do terminal.
* **Para testar no navegador:** Pressione `w` no terminal para abrir no Chrome.

### Terminal 2: Backend (FastAPI / VPS Local)
```bash
cd backend
python -m venv venv
# No Windows PowerShell:
.\venv\Scripts\Activate.ps1
# No Windows CMD:
.\venv\Scripts\activate.bat

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
* A documentação interativa da API ficará disponível em: `http://localhost:8000/docs`.

---

## 3. Roteiro de Próximas Tarefas (Backlog Priorizado)

### Fase 1: Mobile (Interface e UX Estilo Stella)
- [ ] **Expandir as Perguntas (22 Etapas):** Em `mobile/src/screens/QuizScreen.tsx`, expandir a lista de perguntas cobrindo todas as 6 áreas:
  1. Identidade e Autoimagem
  2. Momento Atual e Desafios
  3. Bloqueios e Crenças Limitantes
  4. Metas Financeiras e Carreira
  5. Relacionamentos e Conexões
  6. Saúde, Energia e Vitalidade
- [ ] **Player de Áudio Real com `expo-av`:** 
  Instalar a biblioteca de áudio nativa no mobile:
  ```bash
  cd mobile
  npx expo install expo-av
  ```
  Implementar reprodução em segundo plano e barra de progresso no `PlayerScreen.tsx`.

### Fase 2: Backend & IA (Geração de Áudio Personalizado)
- [ ] **Integração Real com Gemini:** Em `backend/main.py`, conectar com `google-generativeai` para receber as 22 respostas e gerar um roteiro de 3 a 5 minutos dividido em:
  - Indução respiratória e relaxamento;
  - Limpeza dos bloqueios citados;
  - Afirmações no tempo presente;
  - Ancoragem futura.
- [ ] **Geração de Voz (TTS):** Chamar a API da ElevenLabs ou OpenAI Audio para converter o roteiro em MP3.
- [ ] **Mixagem com FFmpeg:** Sobrepor uma trilha ambiente (ex: 432 Hz ou frequências theta binaurais) em volume baixo (-18 dB) atrás da voz do narrador.

### Fase 3: VPS & Produção
- [ ] Apontar o IP da VPS no arquivo `mobile/src/config/api.ts`.
- [ ] Na VPS, rodar `docker compose up -d --build` para subir o Nginx e o Backend com reinicialização automática.
- [ ] Configurar certificado SSL grátis (Let's Encrypt / Certbot) no Nginx.

---

## 4. Prompts Prontos para Usar com o Copilot no OpenIDE

Você pode copiar e colar estes prompts diretamente no assistente/copiloto do OpenIDE:

### 💬 Prompt 1: Implementar as 22 Perguntas
> *"Copilot, expanda o array de perguntas no arquivo `mobile/src/screens/QuizScreen.tsx` para termos uma jornada completa de 22 perguntas inspirada no onboarding do app Stella. Divida em categorias (Identidade, Finanças, Relacionamentos, Saúde e Bloqueios) e mantenha a mesma estrutura de opções."*

### 💬 Prompt 2: Ativar Áudio Real no Player Mobile
> *"Copilot, altere o arquivo `mobile/src/screens/PlayerScreen.tsx` para usar o `expo-av`. Quero que ele toque o áudio vindo da URL da API, tenha controle de play/pause real, controle de volume e mostre o tempo decorrido e total da faixa."*

### 💬 Prompt 3: Conectar a API do Gemini no Backend
> *"Copilot, no arquivo `backend/main.py`, implemente a função com `google.generativeai` que recebe a lista de 22 respostas do usuário e gera um roteiro detalhado de meditação guiada de manifestação em português do Brasil."*

---

## 5. Estrutura de Arquivos

```text
manifest-app/
├── INSTRUCTIONS_OPENIDE.md   <-- Este guia
├── README.md                 <-- Visão geral do projeto
├── docker-compose.yml        <-- Orquestração para a VPS
├── nginx.conf                <-- Configuração do proxy reverso
├── .env.example              <-- Modelo de variáveis de ambiente
├── backend/                  <-- API FastAPI em Python
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
└── mobile/                   <-- App React Native / Expo
    ├── App.tsx
    ├── package.json
    └── src/
        ├── config/api.ts
        └── screens/
            ├── QuizScreen.tsx
            └── PlayerScreen.tsx
```
