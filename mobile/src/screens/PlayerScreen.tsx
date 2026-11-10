import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

interface PlayerProps {
  userName: string;
  focusArea: string;
  onReset: () => void;
}

export const PlayerScreen: React.FC<PlayerProps> = ({ userName, focusArea, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tagline}>ÁUDIO REPROGRAMADOR EXCLUSIVO</Text>
        <Text style={styles.title}>Manifestando {focusArea}</Text>
        <Text style={styles.subtitle}>Sessão gerada especialmente para {userName}</Text>
      </View>

      <View style={styles.visualizerContainer}>
        <View style={styles.circleOuter}>
          <View style={styles.circleMiddle}>
            <View style={styles.circleInner}>
              <Text style={styles.frequencyText}>432 Hz</Text>
              <Text style={styles.frequencySub}>Ondas Theta</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.playButton}
          activeOpacity={0.8}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={styles.playButtonText}>{isPlaying ? '❚❚ Pausar' : '► Iniciar Sessão'}</Text>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  tagline: {
    color: '#D4AF37',
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8A85A5',
    fontSize: 15,
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(155, 81, 224, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleMiddle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#16122C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyText: {
    color: '#D4AF37',
    fontSize: 20,
    fontWeight: '700',
  },
  frequencySub: {
    color: '#8A85A5',
    fontSize: 11,
    marginTop: 2,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  playButton: {
    backgroundColor: '#9B51E0',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  resetButton: {
    padding: 10,
  },
  resetText: {
    color: '#656080',
    fontSize: 14,
  },
});
