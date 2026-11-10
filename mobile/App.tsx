import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QuizScreen } from './src/screens/QuizScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { API_BASE_URL } from './src/config/api';

export default function App() {
  const [stage, setStage] = useState<'quiz' | 'generating' | 'player'>('quiz');
  const [sessionInfo, setSessionInfo] = useState<{ userName: string; focusArea: string }>({
    userName: 'Visitante',
    focusArea: 'Abundância Financeira',
  });

  const handleQuizComplete = async (answers: any[]) => {
    setStage('generating');

    const focusAnswer = answers.find(a => a.question_id === 1)?.answer || 'Abundância Financeira';
    setSessionInfo({
      userName: 'Você',
      focusArea: focusAnswer,
    });

    try {
      // Disparo para o backend na VPS (ou mock se offline)
      await fetch(`${API_BASE_URL}/api/generate-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: 'Você',
          focus_area: focusAnswer,
          answers,
        }),
      });
    } catch (e) {
      console.log('Modo preview / offline ativo');
    }

    // Transiciona para o player após processamento
    setTimeout(() => {
      setStage('player');
    }, 1500);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {stage === 'quiz' && <QuizScreen onComplete={handleQuizComplete} />}

      {stage === 'generating' && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9B51E0" />
          <Text style={styles.loadingTitle}>Sintonizando sua frequência...</Text>
          <Text style={styles.loadingSub}>Criando seu áudio meditativo personalizado</Text>
        </View>
      )}

      {stage === 'player' && (
        <PlayerScreen
          userName={sessionInfo.userName}
          focusArea={sessionInfo.focusArea}
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
  },
});
