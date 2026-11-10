import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export interface QuizAnswer {
  question_id: number;
  question: string;
  category: string;
  answer: string;
}

export const QUESTIONS = [
  // --- PILAR 1: Identidade e Autoimagem ---
  {
    id: 1,
    category: "Identidade & Autoimagem",
    title: "Como você se descreve no momento em relação ao seu potencial?",
    options: [
      "Sinto que estou muito abaixo do que posso alcançar",
      "Tenho lampejos de grandeza, mas perco a consistência",
      "Estou em expansão, mas quero acelerar minha evolução",
      "Totalmente alinhado e pronto para o próximo nível"
    ]
  },
  {
    id: 2,
    category: "Identidade & Autoimagem",
    title: "Qual é a sua principal intenção de manifestação nesta jornada?",
    options: [
      "Abundância Financeira e Prosperidade",
      "Amor, Conexão e Relacionamento",
      "Saúde, Energia Vital e Paz Interior",
      "Clareza de Propósito e Carreira"
    ]
  },
  {
    id: 3,
    category: "Identidade & Autoimagem",
    title: "Quando você pensa no seu futuro ideal, qual sentimento predomina?",
    options: [
      "Entusiasmo e certeza absoluta",
      "Esperança misturada com receio de falhar",
      "Ansiedade por ainda não ver os resultados",
      "Dúvida se sou realmente merecedor(a)"
    ]
  },
  {
    id: 4,
    category: "Identidade & Autoimagem",
    title: "Com que frequência você pratica afirmações ou visualização consciente?",
    options: [
      "Nunca pratiquei de forma consistente",
      "Às vezes, quando me sinto angustiado(a)",
      "Regularmente, mas quero aprofundar a técnica",
      "Diariamente, como parte da minha rotina"
    ]
  },

  // --- PILAR 2: Momento Atual e Desafios ---
  {
    id: 5,
    category: "Momento Atual",
    title: "Qual é o maior desafio que você enfrenta no seu dia a dia?",
    options: [
      "Sobrecarga mental e estresse constante",
      "Falta de foco e procrastinação nas prioridades",
      "Instabilidade financeira ou medo da escassez",
      "Sensação de solidão ou descompasso com as pessoas ao redor"
    ]
  },
  {
    id: 6,
    category: "Momento Atual",
    title: "Qual o seu nível médio de energia ao acordar pela manhã?",
    options: [
      "Baixo, já acordo cansado(a) e preocupado(a)",
      "Médio, preciso de esforço para engrenar",
      "Bom, mas oscila bastante ao longo do dia",
      "Alto, acordo grato(a) e disposto(a)"
    ]
  },
  {
    id: 7,
    category: "Momento Atual",
    title: "Em quanto tempo você quer consolidar essa nova fase de realizações?",
    options: [
      "Nos próximos 7 a 21 dias (mudança imediata de frequência)",
      "Em até 3 meses (reprogramação profunda)",
      "Ao longo deste ano (transformação estrutural)",
      "Quero manter isso como estilo de vida contínuo"
    ]
  },

  // --- PILAR 3: Bloqueios e Crenças Limitantes ---
  {
    id: 8,
    category: "Crenças & Bloqueios",
    title: "Qual frase ressoa mais com a sua voz interna autocrítica?",
    options: [
      "\"Eu preciso trabalhar até a exaustão para ter valor\"",
      "\"E se der tudo errado e eu passar vergonha?\"",
      "\"As coisas boas duram pouco na minha vida\"",
      "\"Eu nunca termino com excelência o que começo\""
    ]
  },
  {
    id: 9,
    category: "Crenças & Bloqueios",
    title: "O que você sente ao falar de grandes quantias financeiras?",
    options: [
      "Tensão ou desconforto corporal sutil",
      "Ceticismo de que seja viável para mim",
      "Desejo ardente, mas sensação de distância",
      "Tranquilidade e consciência de fluxo natural"
    ]
  },
  {
    id: 10,
    category: "Crenças & Bloqueios",
    title: "Qual padrão negativo você mais deseja quebrar definitivamente?",
    options: [
      "Autossabotagem quando estou prestes a vencer",
      "Necessidade constante de aprovação dos outros",
      "Medo de cobrar o valor justo ou se posicionar",
      "Ficar preso(a) no passado e em arrependimentos"
    ]
  },
  {
    id: 11,
    category: "Crenças & Bloqueios",
    title: "Qual memória ou fase passada ainda drena sua energia mental?",
    options: [
      "Fracassos ou dívidas em projetos anteriores",
      "Términos ou mágoas de relacionamentos passados",
      "Críticas duras que ouvi na infância/adolescência",
      "Nenhuma, já ressignifiquei e quero focar adiante"
    ]
  },

  // --- PILAR 4: Finanças e Abundância ---
  {
    id: 12,
    category: "Finanças & Abundância",
    title: "Qual é a sua relação com o fluxo de dinheiro hoje?",
    options: [
      "O dinheiro entra e sai rapidamente com urgências",
      "Tenho estabilidade, mas não consigo alavancar patrimônio",
      "Estou construindo múltiplas fontes e quero destravar a mente",
      "Prospero com facilidade e busco liberdade financeira total"
    ]
  },
  {
    id: 13,
    category: "Finanças & Abundância",
    title: "Qual marco financeiro faria você se sentir verdadeiramente livre?",
    options: [
      "Quitar todas as pendências e ter reserva de segurança",
      "Renda mensal de 5 dígitos (R$ 10k a R$ 30k+)",
      "Independência geográfica trabalhando de qualquer lugar",
      "Patrimônio sólido gerando renda passiva perpétua"
    ]
  },
  {
    id: 14,
    category: "Finanças & Abundância",
    title: "O que a prosperidade representa para você no nível mais alto?",
    options: [
      "Tranquilidade para cuidar de quem eu amo",
      "Poder de escolha, liberdade de tempo e viagens",
      "Impactar vidas e contribuir com grandes causas",
      "Autonomia e soberania pessoal completa"
    ]
  },
  {
    id: 15,
    category: "Finanças & Abundância",
    title: "Como você reage quando investe no seu próprio desenvolvimento?",
    options: [
      "Sinto culpa ou medo de não ter retorno",
      "Hesito, mas reconheço que é necessário",
      "Investir em mim é a minha prioridade absoluta",
      "Faço com entusiasmo sabendo que multiplica"
    ]
  },

  // --- PILAR 5: Relacionamentos e Conexões ---
  {
    id: 16,
    category: "Relacionamentos & Afeto",
    title: "Como está o círculo de pessoas mais próximas a você hoje?",
    options: [
      "Muitas pessoas tóxicas ou pessimistas ao meu redor",
      "Gente boa, mas sem a mesma ambição de crescimento",
      "Estou em transição, buscando novas amizades e parcerias",
      "Cercado(a) por mentores e parceiros inspiradores"
    ]
  },
  {
    id: 17,
    category: "Relacionamentos & Afeto",
    title: "No amor, qual é a sua busca central neste momento?",
    options: [
      "Curar feridas passadas e recuperar meu amor-próprio",
      "Atrair um parceiro(a) consciente e leal de alto valor",
      "Harmonizar e elevar a chama da minha relação atual",
      "Foco total em mim agora, sem buscar relacionamento"
    ]
  },
  {
    id: 18,
    category: "Relacionamentos & Afeto",
    title: "Você consegue estabelecer limites saudáveis sem se sentir culpado(a)?",
    options: [
      "Raramente, costumo agradar aos outros em prejuízo próprio",
      "Tenho dificuldade, mas estou aprendendo a dizer não",
      "Consigo na maioria das situações profissionais e pessoais",
      "Sim, respeito meu tempo e energia com firmeza e carinho"
    ]
  },

  // --- PILAR 6: Saúde, Vitalidade e Ancoragem ---
  {
    id: 19,
    category: "Saúde & Vitalidade",
    title: "Como você cuida do seu templo físico (corpo, sono e nutrição)?",
    options: [
      "Tenho negligenciado por falta de tempo ou ânimo",
      "Faço o básico, mas preciso de mais disciplina",
      "Tenho bons hábitos e busco alta performance corporal",
      "Totalmente dedicado(a) à saúde física, mental e espiritual"
    ]
  },
  {
    id: 20,
    category: "Saúde & Vitalidade",
    title: "Qual o melhor momento do seu dia para reprogramação mental?",
    options: [
      "Logo ao acordar (em estado alfa matinal)",
      "Durante uma pausa no meio do dia para recarregar",
      "À noite, antes de dormir (ancoragem no sono theta)",
      "Em momentos aleatórios conforme minha necessidade"
    ]
  },
  {
    id: 21,
    category: "Saúde & Vitalidade",
    title: "Qual som ambiente conecta mais profundamente a sua mente?",
    options: [
      "Frequências Theta e 432 Hz de cura harmônica",
      "Sons de chuva suave e tempestade relaxante",
      "Ondas do oceano e brisa do mar",
      "Tigelas tibetanas e campainhas zen"
    ]
  },
  {
    id: 22,
    category: "Ancoragem Final",
    title: "Você está pronto(a) para assumir a identidade da sua versão realizada agora?",
    options: [
      "Sim! Abro mão do velho eu e aceito minha nova realidade",
      "Estou pronto(a), com o coração aberto para aprender",
      "Sim, preciso apenas de um guia diário consistente",
      "Com certeza, nada vai me parar a partir de hoje"
    ]
  }
];

interface QuizProps {
  onComplete: (answers: QuizAnswer[]) => void;
}

export const QuizScreen: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizAnswer[]>([]);

  const currentQ = QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleSelectOption = (option: string) => {
    const newAnswer: QuizAnswer = {
      question_id: currentQ.id,
      category: currentQ.category,
      question: currentQ.title,
      answer: option,
    };

    const updated = [...selectedAnswers, newAnswer];
    setSelectedAnswers(updated);

    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(updated);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswers(selectedAnswers.slice(0, -1));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com Categoria, Progresso e Botão Voltar */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          {currentIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}

          <Text style={styles.categoryBadge}>{currentQ.category.toUpperCase()}</Text>
          <View style={{ width: 60 }} />
        </View>

        <Text style={styles.progressText}>
          Pergunta {currentIndex + 1} de {QUESTIONS.length}
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Conteúdo da Pergunta */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionTitle}>{currentQ.title}</Text>

        <View style={styles.optionsContainer}>
          {currentQ.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionButton}
              activeOpacity={0.75}
              onPress={() => handleSelectOption(opt)}
            >
              <View style={styles.optionNumberCircle}>
                <Text style={styles.optionNumberText}>{String.fromCharCode(65 + idx)}</Text>
              </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backButtonText: {
    color: '#8A85A5',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBadge: {
    color: '#D4AF37',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    textAlign: 'center',
  },
  progressText: {
    color: '#8A85A5',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#1E1838',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9B51E0',
    borderRadius: 3,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  questionTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 28,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#15102A',
    borderColor: '#2D2354',
    borderWidth: 1.2,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(155, 81, 224, 0.15)',
    borderWidth: 1,
    borderColor: '#9B51E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionNumberText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700',
  },
  optionText: {
    color: '#E0DBF5',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    lineHeight: 21,
  },
});
