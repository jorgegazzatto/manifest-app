import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, StatusBar } from 'react-native';
import { QuizScreen, QuizAnswer } from './src/screens/QuizScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { API_BASE_URL, SessionData } from './src/config/api';

const LOADING_STEPS = [
  "✦ Decodificando seus padrões mentais...",
  "✦ Sintonizando ressonância de 432 Hz...",
  "✦ Dissolvendo crenças limitantes no subconsciente...",
  "✦ Estruturando afirmações quânticas personalizadas...",
];

export default function App() {
  const [stage, setStage] = useState<'quiz' | 'generating' | 'player'>('quiz');
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionData, setSessionData] = useState<SessionData>({
    session_id: 'default',
    user_name: 'Você',
    focus_area: 'Abundância Financeira',
    script: '',
    audio_url: '',
    duration_seconds: 360,
  });

  // Ciclo de frases inspiradoras durante o carregamento
  useEffect(() => {
    let interval: any = null;
    if (stage === 'generating') {
      interval = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleQuizComplete = async (answers: QuizAnswer[]) => {
    setStage('generating');
    setStepIndex(0);

    const focusAnswer = answers.find(a => a.question_id === 2)?.answer || 'Abundância Financeira';

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: 'Você',
          focus_area: focusAnswer,
          answers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionData({
          session_id: data.session_id,
          user_name: data.user_name,
          focus_area: data.focus_area || focusAnswer,
          script: data.script,
          audio_url: data.audio_url,
          duration_seconds: data.duration_seconds || 360,
        });
      } else {
        throw new Error('Falha na resposta da API');
      }
    } catch (e) {
      console.log('Modo preview / fallback ativo', e);
      setSessionData({
        session_id: 'local-session',
        user_name: 'Você',
        focus_area: focusAnswer,
        script: `### 🌬️ FASE 1: INDUÇÃO E RESPIRAÇÃO CONSCIENTE
Feche suavemente os olhos. Puxe o ar pelas narinas... e solte devagar, liberando qualquer peso acumulado.

### 🌊 FASE 2: DISSOLUÇÃO DE PADRÕES LIMITANTES
Deixe ir todo o cansaço e a necessidade de controle. Você está seguro(a) para prosperar.

### ✨ FASE 3: AFIRMAÇÕES DE PODER
- Eu sou um campo magnético de prosperidade e clareza.
- A cada instante, minha vida se alinha com ${focusAnswer}.
- Eu aceito e sustento toda a abundância que me pertence por direito de consciência.

### 🔮 FASE 4: ANCORAGEM DA NOVA IDENTIDADE
Sinta a certeza da sua vitória. Você já é essa versão. Respire fundo e viva essa realidade agora.`,
        audio_url: '/audios/sample_theta_432hz.mp3',
        duration_seconds: 360,
      });
    }

    setTimeout(() => {
      setStage('player');
    }, 2800);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070512" />

      {stage === 'quiz' && <QuizScreen onComplete={handleQuizComplete} />}

      {stage === 'generating' && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingGlow} />

          <View style={styles.spinnerWrapper}>
            <ActivityIndicator size="large" color="#D4AF37" />
          </View>

          <Text style={styles.loadingBadge}>SINTONIZAÇÃO QUÂNTICA</Text>
          <Text style={styles.loadingTitle}>Criando sua Frequência</Text>

          <View style={styles.stepBox}>
            <Text style={styles.stepText}>{LOADING_STEPS[stepIndex]}</Text>
          </View>

          <Text style={styles.loadingSub}>
            Estruturando ondas Theta, áudio binaural e afirmações personalizadas
          </Text>
        </View>
      )}

      {stage === 'player' && (
        <PlayerScreen
          userName={sessionData.user_name}
          focusArea={sessionData.focus_area || 'Abundância'}
          script={sessionData.script}
          audioUrl={sessionData.audio_url}
          durationSeconds={sessionData.duration_seconds}
          onReset={() => setStage('quiz')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070512',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  loadingGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(155, 81, 224, 0.12)',
  },
  spinnerWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingBadge: {
    color: '#D4AF37',
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '800',
    marginBottom: 6,
  },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 16,
    minHeight: 46,
    justifyContent: 'center',
  },
  stepText: {
    color: '#E0DBF5',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSub: {
    color: '#716C8A',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
});
