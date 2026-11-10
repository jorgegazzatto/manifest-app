import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

interface PlayerProps {
  userName: string;
  focusArea: string;
  script?: string;
  audioUrl?: string;
  durationSeconds?: number;
  onReset: () => void;
}

export const PlayerScreen: React.FC<PlayerProps> = ({
  userName,
  focusArea,
  script,
  audioUrl,
  durationSeconds = 360,
  onReset,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'script'>('visualizer');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.tagline}>ÁUDIO REPROGRAMADOR QUÂNTICO</Text>
        <Text style={styles.title}>{focusArea}</Text>
        <Text style={styles.subtitle}>Sessão personalizada para {userName}</Text>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'visualizer' && styles.tabButtonActive]}
            onPress={() => setActiveTab('visualizer')}
          >
            <Text style={[styles.tabText, activeTab === 'visualizer' && styles.tabTextActive]}>
              Frequência
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'script' && styles.tabButtonActive]}
            onPress={() => setActiveTab('script')}
          >
            <Text style={[styles.tabText, activeTab === 'script' && styles.tabTextActive]}>
              Roteiro de Afirmações
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Body */}
      {activeTab === 'visualizer' ? (
        <View style={styles.visualizerContainer}>
          <View style={[styles.circleOuter, isPlaying && styles.circleOuterPulsing]}>
            <View style={styles.circleMiddle}>
              <View style={styles.circleInner}>
                <Text style={styles.frequencyText}>432 Hz</Text>
                <Text style={styles.frequencySub}>Ondas Theta</Text>
                <Text style={styles.frequencyNote}>Sintonia Quântica</Text>
              </View>
            </View>
          </View>

          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>
              {isPlaying ? 'Reproduzindo Sessão' : 'Pronto para Conectar'}
            </Text>
            <Text style={styles.timeCounter}>
              {isPlaying ? '01:24' : '00:00'} / {formatTime(durationSeconds)}
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.scriptContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.scriptText}>
            {script || 'Carregando o seu roteiro personalizado...'}
          </Text>
        </ScrollView>
      )}

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonPlaying]}
          activeOpacity={0.85}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '❚❚ Pausar Sessão' : '► Iniciar Reprogramação'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetText}>Refazer Questionário</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07050F',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  tagline: {
    color: '#D4AF37',
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8A85A5',
    fontSize: 13,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#15112A',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: '#262046',
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tabButtonActive: {
    backgroundColor: '#9B51E0',
  },
  tabText: {
    color: '#8A85A5',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  circleOuter: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1.5,
    borderColor: 'rgba(155, 81, 224, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOuterPulsing: {
    borderColor: 'rgba(212, 175, 55, 0.6)',
  },
  circleMiddle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#140F2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9B51E0',
  },
  frequencyText: {
    color: '#D4AF37',
    fontSize: 19,
    fontWeight: '800',
  },
  frequencySub: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  frequencyNote: {
    color: '#8A85A5',
    fontSize: 9,
    marginTop: 3,
    letterSpacing: 1,
  },
  timeInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  timeLabel: {
    color: '#8A85A5',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  timeCounter: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  scriptContainer: {
    flex: 1,
    backgroundColor: '#110D24',
    borderRadius: 16,
    padding: 18,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#241D42',
  },
  scriptText: {
    color: '#E0DBF5',
    fontSize: 14,
    lineHeight: 22,
  },
  controlsContainer: {
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    backgroundColor: '#9B51E0',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#9B51E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  playButtonPlaying: {
    backgroundColor: '#7A32C2',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  resetText: {
    color: '#656080',
    fontSize: 13,
  },
});
