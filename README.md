# ManifestApp (Estilo Stella) - Mobile & VPS Backend

Aplicativo de reprogramação mental e manifestação guiada personalizada, inspirado na experiência mobile do Stella, com backend preparado para VPS.

## Estrutura do Projeto

```
manifest-app/
├── backend/                  # API e processador de áudio em Python (FastAPI + Docker)
│   ├── main.py               # Endpoints de diagnóstico, IA e áudio
│   ├── requirements.txt      # Dependências (FastAPI, Uvicorn, FFmpeg, etc.)
│   └── Dockerfile            # Containerização para deploy na VPS
├── mobile/                   # App Mobile em React Native com Expo
│   ├── App.tsx               # Navegação entre Onboarding e Player
│   ├── package.json          # Dependências do app (Expo, Expo-AV, etc.)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── QuizScreen.tsx    # Fluxo guiado de perguntas (diagnóstico)
│   │   │   └── PlayerScreen.tsx  # Player imersivo com ondas e afirmações
│   │   └── config/api.ts         # Conexão com o backend da VPS
│   └── app.json              # Configurações do Expo
├── docker-compose.yml        # Orquestração do Backend + Nginx + Redis na VPS
└── .env.example              # Chaves de API (Gemini, ElevenLabs)
```

## Como executar o Mobile (Local)

1. Entre na pasta `mobile`:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
2. Abra o app **Expo Go** no celular (Android ou iOS) e escaneie o QR Code no terminal.

## Como fazer deploy na VPS

1. Clone ou copie a pasta para a sua VPS.
2. Configure o arquivo `.env` com suas chaves de API.
3. Suba os serviços:
   ```bash
   docker compose up -d --build
   ```
4. A API estará respondendo em `http://IP_DA_VPS/api` ou sob seu domínio com SSL.

## Para visualizar o aplicativo pelo Expo Go, abra o terminal no seu computador e execute:

1. Entrar na pasta do mobile:

   cd c:\Users\jorge\.gemini\antigravity\scratch\manifest-app\mobile

2. Iniciar o Expo:
   
   Se o celular estiver no mesmo Wi-Fi do computador:

      npx expo start -c

   Se o celular estiver no 4G / Dados Móveis (ou em rede diferente):
   
      npx expo start --tunnel -c