import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QuizScreen, QuizAnswer } from './src/screens/QuizScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { API_BASE_URL, SessionData } from './src/config/api';

export default function App() {
  const [stage, setStage] = useState<'quiz' | 'generating' | 'player'>('quiz');
  const [sessionData, setSessionData] = useState<SessionData>({
    session_id: 'default',
    user_name: 'Você',
    focus_area: 'Abundância Financeira',
    script: '',
    audio_url: '',
    duration_seconds: 360,
  });

  const handleQuizComplete = async (answers: QuizAnswer[]) => {
    setStage('generating');

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
      console.log('Modo preview / offline ativo', e);
      setSessionData({
        session_id: 'local-session',
        user_name: 'Você',
        focus_area: focusAnswer,
        script: `### 🌬️ FASE 1: INDUÇÃO E RESPIRAÇÃO\nRespire fundo, sinta seus ombros relaxarem e sua mente se acalmar.\n\n### 🌊 FASE 2: DISSOLUÇÃO DE BLOQUEIOS\nLiberamos todas as amarras passadas em relação a ${focusAnswer}.\n\n### ✨ FASE 3: AFIRMAÇÕES\nEu sou merecedor(a) da minha mais alta realização agora.\n\n### 🔮 FASE 4: ANCORAGEM\nVocê já vive essa realidade. Sinta a gratidão no peito.`,
        audio_url: '/audios/sample_theta_432hz.mp3',
        duration_seconds: 360,
      });
    }

    setTimeout(() => {
      setStage('player');
    }, 1800);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {stage === 'quiz' && <QuizScreen onComplete={handleQuizComplete} />}

      {stage === 'generating' && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9B51E0" />
          <Text style={styles.loadingTitle}>Sintonizando sua frequência...</Text>
          <Text style={styles.loadingSub}>A IA está estruturando suas afirmações e ondas theta</Text>
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
    backgroundColor: '#0A0814',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
  },
  loadingSub: {
    color: '#8A85A5',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
