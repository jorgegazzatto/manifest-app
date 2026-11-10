import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

export interface QuizAnswer {
  question_id: number;
  question: string;
  category: string;
  answer: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Identidade & Autoimagem": "✨",
  "Momento Atual": "⚡",
  "Crenças & Bloqueios": "🔓",
  "Finanças & Abundância": "💎",
  "Relacionamentos & Afeto": "🕊️",
  "Saúde & Vitalidade": "🌱",
  "Ancoragem Final": "🔮",
};

export const QUESTIONS = [
  // --- PILAR 1: Identidade e Autoimagem ---
  {
    id: 1,
    category: "Identidade & Autoimagem",
    subtitle: "Consciência & Autoimagem",
    title: "Como você se descreve no momento em relação ao seu potencial?",
    options: [
      "Sinto que estou muito abaixo do que posso alcançar",
      "Tenho lampejos de grandeza, mas perco a consistência",
      "Estou em expansão, mas quero acelerar minha evolução",
      "Totalmente alinhado(a) e pronto(a) para o próximo nível"
    ]
  },
  {
    id: 2,
    category: "Identidade & Autoimagem",
    subtitle: "Vórtice Central",
    title: "Qual é a sua principal intenção de manifestação nesta jornada?",
    options: [
      "Abundância Financeira e Prosperidade Ilimitada",
      "Amor Consciente, Conexão e Magnetismo",
      "Saúde Vibrante, Vitalidade e Paz Interior",
      "Clareza de Propósito, Soberania e Carreira"
    ]
  },
  {
    id: 3,
    category: "Identidade & Autoimagem",
    subtitle: "Frequência Emocional",
    title: "Quando você pensa no seu futuro ideal, qual sentimento predomina?",
    options: [
      "Entusiasmo ardente e certeza absoluta",
      "Esperança misturada com receio de falhar",
      "Ansiedade por ainda não ver os resultados físicos",
      "Dúvida oculta se sou verdadeiramente merecedor(a)"
    ]
  },
  {
    id: 4,
    category: "Identidade & Autoimagem",
    subtitle: "Prática Diária",
    title: "Com que frequência você pratica afirmações ou visualização consciente?",
    options: [
      "Nunca pratiquei com disciplina contínua",
      "Às vezes, apenas quando sinto angústia ou pressão",
      "Regularmente, mas sinto falta de um método guiado",
      "Diariamente, como um pilar sagrado da minha rotina"
    ]
  },

  // --- PILAR 2: Momento Atual e Desafios ---
  {
    id: 5,
    category: "Momento Atual",
    subtitle: "Diagnóstico de Obstáculos",
    title: "Qual é o maior desafio que você enfrenta no seu dia a dia?",
    options: [
      "Sobrecarga mental, excesso de ruído e estresse",
      "Falta de foco e procrastinação nas prioridades-chave",
      "Insegurança financeira ou receio de escassez",
      "Solidão ou descompasso energético com quem me cerca"
    ]
  },
  {
    id: 6,
    category: "Momento Atual",
    subtitle: "Energia Vital",
    title: "Qual o seu nível de vitalidade ao abrir os olhos pela manhã?",
    options: [
      "Baixo, já acordo cansado(a) e com preocupações",
      "Médio, levo bastante tempo para engrenar o ritmo",
      "Bom, mas sinto quedas bruscas de energia à tarde",
      "Alto, acordo em estado de gratidão, foco e disposição"
    ]
  },
  {
    id: 7,
    category: "Momento Atual",
    subtitle: "Linha de Transmutação",
    title: "Em quanto tempo você quer consolidar essa nova fase de realizações?",
    options: [
      "Nos próximos 7 a 21 dias (salto quântico de frequência)",
      "Em até 3 meses (reprogramação profunda e sustentável)",
      "Ao longo deste ano (transformação estrutural de vida)",
      "Quero ancorar isso como um estilo de vida permanente"
    ]
  },

  // --- PILAR 3: Bloqueios e Crenças Limitantes ---
  {
    id: 8,
    category: "Crenças & Bloqueios",
    subtitle: "Voz Interna",
    title: "Qual frase oculta ressoa mais com a sua autocrítica subconsciente?",
    options: [
      "\"Eu preciso me desgastar até o limite para ter valor\"",
      "\"E se eu me expuser e for rejeitado(a) ou julgado(a)?\"",
      "\"As coisas boas demoram e duram pouco para mim\"",
      "\"Eu nunca consigo finalizar com maestria o que começo\""
    ]
  },
  {
    id: 9,
    category: "Crenças & Bloqueios",
    subtitle: "Ressonância do Dinheiro",
    title: "O que você experimenta corporalmente ao falar de grandes fortunas?",
    options: [
      "Uma contração ou aperto sutil na respiração",
      "Ceticismo de que essa realidade seja acessível a mim",
      "Desejo ardente, mas uma sensação de distância intransponível",
      "Paz natural, receptividade e certeza de merecimento"
    ]
  },
  {
    id: 10,
    category: "Crenças & Bloqueios",
    subtitle: "Quebra de Ciclo",
    title: "Qual padrão inconsciente você mais deseja romper hoje?",
    options: [
      "Autossabotagem exatamente quando estou prestes a triunfar",
      "Necessidade de validação e aprovação alheia",
      "Dificuldade de cobrar o valor justo pelo meu trabalho",
      "Apego emocional a erros e arrependimentos passados"
    ]
  },
  {
    id: 11,
    category: "Crenças & Bloqueios",
    subtitle: "Liberação de Memórias",
    title: "Qual experiência anterior ainda drena sua força mental se você lembrar?",
    options: [
      "Prejuízos, dívidas ou negócios que não deram certo",
      "Mágoas, rupturas ou traições em relacionamentos",
      "Críticas duras recebidas na infância ou juventude",
      "Nenhuma, já transmutou e meu olhar está 100% no horizonte"
    ]
  },

  // --- PILAR 4: Finanças e Abundância ---
  {
    id: 12,
    category: "Finanças & Abundância",
    subtitle: "Fluxo de Prosperidade",
    title: "Qual é a sua relação com o fluxo financeiro atualmente?",
    options: [
      "O dinheiro entra e sai rapidamente com urgências imprevistas",
      "Tenho estabilidade, mas não consigo multiplicar patrimônio",
      "Estou abrindo novas fontes e quero destravar a mentalidade",
      "Flui com leveza e já busco liberdade financeira integral"
    ]
  },
  {
    id: 13,
    category: "Finanças & Abundância",
    subtitle: "Marco de Conquista",
    title: "Qual marco prático faria você suspirar com alívio e plenitude?",
    options: [
      "Zero dívidas e uma reserva de tranquilidade intocável",
      "Faturamento mensal expressivo de 5 dígitos (R$ 15k a 50k+)",
      "Liberdade geográfica total para trabalhar de onde quiser",
      "Múltiplos ativos gerando renda passiva perpétua"
    ]
  },
  {
    id: 14,
    category: "Finanças & Abundância",
    subtitle: "Significado Superior",
    title: "O que a riqueza representa no seu nível mais espiritual e nobre?",
    options: [
      "Paz de espírito para cuidar e blindar minha família",
      "Soberania sobre meu próprio tempo e poder de viajar o mundo",
      "Capacidade de multiplicar impacto e financiar grandes causas",
      "Total desvinculação da escassez e da subserviência"
    ]
  },
  {
    id: 15,
    category: "Finanças & Abundância",
    subtitle: "Investimento Pessoal",
    title: "Como seu coração reage ao investir em você e na sua sabedoria?",
    options: [
      "Com medo da perda ou dúvida se terei retorno real",
      "Hesito um pouco, mas sei que não posso ficar estagnado(a)",
      "Invisto com certeza absoluta de que sou meu maior ativo",
      "Pago com gratidão sabendo que tudo retorna multiplicado"
    ]
  },

  // --- PILAR 5: Relacionamentos e Conexões ---
  {
    id: 16,
    category: "Relacionamentos & Afeto",
    subtitle: "Egrégora Social",
    title: "Como é o campo vibracional das pessoas mais próximas a você?",
    options: [
      "Muitas queixas, fofocas e pessimismo que me sobrecarregam",
      "Pessoas gentis, mas acomodadas e sem ambição de crescer",
      "Estou em transição, selecionando novas companhias e mentores",
      "Círculo nobre de pessoas inspiradoras, leais e prósperas"
    ]
  },
  {
    id: 17,
    category: "Relacionamentos & Afeto",
    subtitle: "Campo do Coração",
    title: "No amor e intimidade, qual é o seu anseio mais profundo agora?",
    options: [
      "Curar feridas passadas e elevar meu autoamor primeiro",
      "Atrair uma alma compatível, madura, leal e de alto valor",
      "Reacender a chama e a intimidade espiritual da relação atual",
      "Plena solitude construtiva, focado(a) na minha maestria pessoal"
    ]
  },
  {
    id: 18,
    category: "Relacionamentos & Afeto",
    subtitle: "Limites Sagrados",
    title: "Você consegue honrar o seu \"Não\" sem carregar culpa?",
    options: [
      "Raramente, me sacrifico para não decepcionar os outros",
      "Sinto desconforto, mas venho treinando minha firmeza",
      "Consigo impor respeito sem perder a gentileza",
      "Totalmente. Minha energia é sagrada e decido onde investi-la"
    ]
  },

  // --- PILAR 6: Saúde, Vitalidade e Ancoragem ---
  {
    id: 19,
    category: "Saúde & Vitalidade",
    subtitle: "Templo Físico",
    title: "Como você tem honrado o templo que abriga sua alma (corpo e sono)?",
    options: [
      "Tenho negligenciado pela correria e rotina frenética",
      "Cumpro o básico, mas preciso de muito mais disciplina",
      "Mantenho bons hábitos e busco longevidade e alta energia",
      "Cuido com reverência diária de cada detalhe da minha saúde"
    ]
  },
  {
    id: 20,
    category: "Saúde & Vitalidade",
    subtitle: "Janela Hipnagógica",
    title: "Qual momento do seu dia oferece mais quietude para reprogramar a mente?",
    options: [
      "Logo ao despertar, ainda sob o manto do estado Alfa matinal",
      "No meio do dia, em uma pausa de reconexão de 15 minutos",
      "À noite, na cama, permitindo que as ondas Theta ancorem o sono",
      "Em horários flexíveis, conforme minha intuição pedir"
    ]
  },
  {
    id: 21,
    category: "Saúde & Vitalidade",
    subtitle: "Acústica da Alma",
    title: "Qual sonoridade mais acalma seus pensamentos e conecta com o invisível?",
    options: [
      "Frequências solfeggio puras (432 Hz e ondas Theta binaurais)",
      "Sons de chuva profunda e tempestades suaves na floresta",
      "Ondas quebrando na praia com brisa marítima tranquila",
      "Tigelas de cristal tibetanas e harmônicos meditativos"
    ]
  },
  {
    id: 22,
    category: "Ancoragem Final",
    subtitle: "Salto Quântico",
    title: "Você está pronto(a) para se despedir da velha versão e assumir seu poder?",
    options: [
      "Sim! Abro mão de toda limitação e aceito minha nova identidade",
      "Estou com o coração pronto e receptivo para esta jornada",
      "Sim, assumo o compromisso sagrado de praticar diariamente",
      "Absolutamente sim. Minha nova vida começa neste exato instante!"
    ]
  }
];

interface QuizProps {
  onComplete: (answers: QuizAnswer[]) => void;
}

export const QuizScreen: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQ = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const categoryIcon = CATEGORY_ICONS[currentQ.category] || "✦";

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);

    setTimeout(() => {
      const newAnswer: QuizAnswer = {
        question_id: currentQ.id,
        category: currentQ.category,
        question: currentQ.title,
        answer: option,
      };

      const updated = [...selectedAnswers, newAnswer];
      setSelectedAnswers(updated);
      setSelectedOption(null);

      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete(updated);
      }
    }, 220);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswers(selectedAnswers.slice(0, -1));
      setSelectedOption(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070512" />

      {/* Glow Superior de Fundo */}
      <View style={styles.ambientGlow} />

      {/* Header com Navegação e Progresso */}
      <View style={styles.header}>
        <View style={styles.navRow}>
          {currentIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backButtonArrow}>‹</Text>
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 70 }} />
          )}

          {/* Badge da Categoria com Ícone e Borda Dourada */}
          <View style={styles.badgePill}>
            <Text style={styles.badgeIcon}>{categoryIcon}</Text>
            <Text style={styles.badgeText}>{currentQ.category.toUpperCase()}</Text>
          </View>

          <View style={styles.stepCounterWrapper}>
            <Text style={styles.stepCurrent}>{currentIndex + 1}</Text>
            <Text style={styles.stepTotal}>/{totalQuestions}</Text>
          </View>
        </View>

        {/* Barra de Progresso com Brilho */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        <Text style={styles.progressPercentLabel}>
          {Math.round(progressPercent)}% da sua sintonização
        </Text>
      </View>

      {/* Conteúdo Principal com Rolagem Suave */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtítulo / Tema */}
        <Text style={styles.questionSubtitle}>{currentQ.subtitle.toUpperCase()}</Text>

        {/* Título Principal da Pergunta */}
        <Text style={styles.questionTitle}>{currentQ.title}</Text>

        {/* Lista de Opções Estilizadas com Glassmorphism */}
        <View style={styles.optionsList}>
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const letter = String.fromCharCode(65 + idx);

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                activeOpacity={0.85}
                onPress={() => handleSelectOption(opt)}
              >
                {/* Indicador de Letra (A, B, C, D) */}
                <View
                  style={[
                    styles.letterBadge,
                    isSelected && styles.letterBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.letterText,
                      isSelected && styles.letterTextSelected,
                    ]}
                  >
                    {letter}
                  </Text>
                </View>

                {/* Texto da Opção */}
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {opt}
                </Text>

                {/* Marcador Sutil à Direita */}
                <View
                  style={[
                    styles.radioIndicator,
                    isSelected && styles.radioIndicatorSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dica Inspiradora no Rodapé */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            🔒 Suas respostas alimentam a IA para afinar a frequência da sua meditação
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070512',
  },
  ambientGlow: {
    position: 'absolute',
    top: -80,
    left: '20%',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(155, 81, 224, 0.12)',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    width: 70,
  },
  backButtonArrow: {
    color: '#9B51E0',
    fontSize: 22,
    marginRight: 4,
    fontWeight: '300',
  },
  backButtonText: {
    color: '#A29DB8',
    fontSize: 13,
    fontWeight: '600',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  badgeIcon: {
    fontSize: 12,
  },
  badgeText: {
    color: '#E5C158',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  stepCounterWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    width: 70,
  },
  stepCurrent: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  stepTotal: {
    color: '#655F7E',
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9B51E0',
    borderRadius: 2,
  },
  progressPercentLabel: {
    color: '#716C8A',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 40,
  },
  questionSubtitle: {
    color: '#D4AF37',
    fontSize: 11,
    letterSpacing: 2.2,
    fontWeight: '700',
    marginBottom: 8,
  },
  questionTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 33,
    marginBottom: 28,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 20, 48, 0.65)',
    borderWidth: 1.2,
    borderColor: 'rgba(155, 81, 224, 0.18)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 68,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(155, 81, 224, 0.18)',
    borderColor: '#9B51E0',
    transform: [{ scale: 1.01 }],
  },
  letterBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  letterBadgeSelected: {
    backgroundColor: '#9B51E0',
    borderColor: '#9B51E0',
  },
  letterText: {
    color: '#BDB7D4',
    fontSize: 13,
    fontWeight: '700',
  },
  letterTextSelected: {
    color: '#FFFFFF',
  },
  optionLabel: {
    color: '#E3DFF2',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
  },
  optionLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  radioIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioIndicatorSelected: {
    borderColor: '#D4AF37',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4AF37',
  },
  footerNote: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerNoteText: {
    color: '#7B7599',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
});
