import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const QUESTIONS = [
  {
    id: 1,
    title: "Qual é a sua principal intenção de manifestação no momento?",
    category: "Foco Principal",
    options: ["Abundância Financeira", "Amor & Relacionamento", "Saúde & Vitalidade", "Paz Mental & Clareza"]
  },
  {
    id: 2,
    title: "O que você sente que mais bloqueia suas realizações hoje?",
    category: "Bloqueio Interno",
    options: ["Medo de falhar ou julgamento", "Procrastinação e falta de foco", "Sensação de não merecimento", "Ansiedade em relação ao futuro"]
  },
  {
    id: 3,
    title: "Em quanto tempo você gostaria de ver os primeiros sinais dessa transformação?",
    category: "Linha do Tempo",
    options: ["Nos próximos 7 dias", "Em 30 dias", "Nos próximos 3 meses", "Ainda este ano"]
  }
];

interface QuizProps {
  onComplete: (answers: any[]) => void;
}

export const QuizScreen: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any[]>([]);

  const currentQ = QUESTIONS[currentIndex];

  const handleSelectOption = (option: string) => {
    const updated = [
      ...selectedAnswers,
      { question_id: currentQ.id, question: currentQ.title, answer: option }
    ];
    setSelectedAnswers(updated);

    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(updated);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.categoryBadge}>{currentQ.category.toUpperCase()}</Text>
        <Text style={styles.progressText}>
          Pergunta {currentIndex + 1} de {QUESTIONS.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.questionTitle}>{currentQ.title}</Text>

        <View style={styles.optionsContainer}>
          {currentQ.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionButton}
              activeOpacity={0.8}
              onPress={() => handleSelectOption(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0814',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  categoryBadge: {
    color: '#D4AF37',
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressText: {
    color: '#8A85A5',
    fontSize: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#201A3A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9B51E0',
  },
  content: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  questionTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 36,
  },
  optionsContainer: {
    gap: 14,
  },
  optionButton: {
    backgroundColor: '#16122C',
    borderColor: '#2D2554',
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  optionText: {
    color: '#E0DBF5',
    fontSize: 16,
    fontWeight: '500',
  },
});
