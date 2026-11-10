import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

interface PlayerProps {
  userName: string;
  focusArea: string;
  script?: string;
  audioUrl?: string;
  durationSeconds?: number;
  onReset: () => void;
}

const AMBIENT_TRACKS = [
  { id: '432', label: '432 Hz Solfeggio', sub: 'Cura & Equilíbrio' },
  { id: 'theta', label: 'Ondas Theta (6Hz)', sub: 'Reprogramação Profunda' },
  { id: 'rain', label: 'Chuva Cósmica', sub: 'Relaxamento do Sistema' },
];

export const PlayerScreen: React.FC<PlayerProps> = ({
  userName,
  focusArea,
  script,
  durationSeconds = 360,
  onReset,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'player' | 'script'>('player');
  const [selectedAmbient, setSelectedAmbient] = useState('432');
  const [currentSeconds, setCurrentSeconds] = useState(0);

  // Simulação de cronômetro quando em reprodução
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds((prev) => (prev >= durationSeconds ? 0 : prev + 1));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentSeconds / durationSeconds) * 100;

  // Barras de onda para o visualizador sonoro
  const waveHeights = isPlaying
    ? [28, 44, 18, 56, 32, 48, 22, 60, 36, 42, 20, 52, 38, 26]
    : [14, 20, 12, 22, 16, 20, 14, 24, 18, 16, 12, 20, 16, 14];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060410" />

      {/* Glow Cósmico Central */}
      <View style={styles.centralGlow} />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.badgeWrapper}>
          <Text style={styles.badgeText}>SESSÃO QUÂNTICA PERSONALIZADA</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{focusArea}</Text>
        <Text style={styles.subtitle}>Frequência sintonizada para {userName}</Text>

        {/* Seletor de Abas */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'player' && styles.tabItemActive]}
            onPress={() => setActiveTab('player')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'player' && styles.tabTextActive]}>
              🎧 Áudio & Frequência
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'script' && styles.tabItemActive]}
            onPress={() => setActiveTab('script')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'script' && styles.tabTextActive]}>
              📜 Roteiro Sagrado
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo: Aba Player ou Aba Roteiro */}
      {activeTab === 'player' ? (
        <View style={styles.playerBody}>
          {/* Anéis de Ressonância Harmônica (Geometria Sagrada) */}
          <View style={styles.visualizerContainer}>
            <View style={[styles.outerRing, isPlaying && styles.outerRingActive]}>
              <View style={[styles.middleRing, isPlaying && styles.middleRingActive]}>
                <View style={styles.innerOrb}>
                  <Text style={styles.frequencyValue}>432 Hz</Text>
                  <Text style={styles.frequencyType}>ONDAS THETA</Text>
                  <View style={styles.liveIndicator}>
                    <View style={[styles.liveDot, isPlaying && styles.liveDotPulsing]} />
                    <Text style={styles.liveText}>
                      {isPlaying ? 'RESSONÂNCIA ATIVA' : 'EM REPOUSO'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Barras de Ondas Sonoras */}
            <View style={styles.waveBarContainer}>
              {waveHeights.map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: h },
                    isPlaying && { backgroundColor: i % 2 === 0 ? '#D4AF37' : '#A855F7' }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Seletor de Frequência Ambiente */}
          <View style={styles.ambientSelector}>
            <Text style={styles.ambientLabel}>AMBIENTAÇÃO SONORA</Text>
            <View style={styles.ambientList}>
              {AMBIENT_TRACKS.map((t) => {
                const isCurrent = selectedAmbient === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.ambientChip, isCurrent && styles.ambientChipActive]}
                    onPress={() => setSelectedAmbient(t.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.ambientChipTitle, isCurrent && styles.ambientChipTitleActive]}>
                      {t.label}
                    </Text>
                    <Text style={[styles.ambientChipSub, isCurrent && styles.ambientChipSubActive]}>
                      {t.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Barra de Progresso do Áudio */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineTrack}>
              <View style={[styles.timelineFill, { width: `${progressPercent}%` }]} />
              <View style={[styles.timelineKnob, { left: `${Math.min(96, progressPercent)}%` }]} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(currentSeconds)}</Text>
              <Text style={styles.timeText}>{formatTime(durationSeconds)}</Text>
            </View>
          </View>
        </View>
      ) : (
        /* Aba Roteiro Sagrado */
        <ScrollView style={styles.scriptScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.scriptCard}>
            <View style={styles.scriptHeader}>
              <Text style={styles.scriptHeaderTag}>✦ ARQUÉTIPO PERSONALIZADO</Text>
              <Text style={styles.scriptHeaderTitle}>Instruções de Reprogramação</Text>
            </View>
            <Text style={styles.scriptBody}>
              {script || 'Aguardando sincronização do roteiro...'}
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Controles Principais Inferiores */}
      <View style={styles.footerControls}>
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          activeOpacity={0.85}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '►'}</Text>
          <Text style={styles.playLabel}>
            {isPlaying ? 'PAUSAR SESSÃO' : 'INICIAR MANIFESTAÇÃO'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={onReset} activeOpacity={0.7}>
          <Text style={styles.resetButtonText}>↺ Refazer Diagnóstico de 22 Etapas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060410',
    justifyContent: 'space-between',
  },
  centralGlow: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(155, 81, 224, 0.08)',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  badgeWrapper: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  badgeText: {
    color: '#E5C158',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '800',
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 20, 48, 0.7)',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#9B51E0',
    shadowColor: '#9B51E0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  tabText: {
    color: '#8882A2',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  playerBody: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(155, 81, 224, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRingActive: {
    borderColor: 'rgba(155, 81, 224, 0.55)',
  },
  middleRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRingActive: {
    borderColor: 'rgba(212, 175, 55, 0.7)',
  },
  innerOrb: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#120D26',
    borderWidth: 1.5,
    borderColor: '#9B51E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9B51E0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  frequencyValue: {
    color: '#E5C158',
    fontSize: 21,
    fontWeight: '800',
  },
  frequencyType: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#655F7E',
  },
  liveDotPulsing: {
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#8A85A5',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  waveBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    gap: 6,
    marginTop: 18,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  ambientSelector: {
    marginVertical: 4,
  },
  ambientLabel: {
    color: '#716C8A',
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  ambientList: {
    flexDirection: 'row',
    gap: 8,
  },
  ambientChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  ambientChipActive: {
    backgroundColor: 'rgba(155, 81, 224, 0.18)',
    borderColor: '#9B51E0',
  },
  ambientChipTitle: {
    color: '#9E98BA',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  ambientChipTitleActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  ambientChipSub: {
    color: '#5C5774',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  ambientChipSubActive: {
    color: '#D4AF37',
  },
  timelineContainer: {
    marginTop: 6,
  },
  timelineTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  timelineFill: {
    height: '100%',
    backgroundColor: '#9B51E0',
    borderRadius: 2,
  },
  timelineKnob: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D4AF37',
    top: -4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#7A7596',
    fontSize: 12,
    fontWeight: '500',
  },
  scriptScroll: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  scriptCard: {
    backgroundColor: 'rgba(18, 14, 38, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(155, 81, 224, 0.2)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  scriptHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 12,
    marginBottom: 14,
  },
  scriptHeaderTag: {
    color: '#D4AF37',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
  },
  scriptHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  scriptBody: {
    color: '#E0DBF5',
    fontSize: 15,
    lineHeight: 25,
  },
  footerControls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
    gap: 12,
  },
  playButton: {
    backgroundColor: '#9B51E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#9B51E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
    gap: 10,
  },
  playButtonActive: {
    backgroundColor: '#7A32C2',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  playLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  resetButtonText: {
    color: '#6B6687',
    fontSize: 12,
    fontWeight: '600',
  },
});
