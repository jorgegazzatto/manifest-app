// Altere para o IP público ou domínio da sua VPS em produção
export const API_BASE_URL = "http://SEU_IP_VPS_AQUI:8000";

export interface AnswerItem {
  question_id: number;
  question: string;
  answer: string;
}

export interface SessionData {
  session_id: string;
  user_name: string;
  script: string;
  audio_url: string;
  duration_seconds: number;
}
