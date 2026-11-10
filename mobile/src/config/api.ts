// URL de produção com domínio e SSL gerenciado pelo Dokploy / Cloudflare
export const API_BASE_URL = "https://manifest.elohdigital.com.br";

export interface AnswerItem {
  question_id: number;
  question: string;
  answer: string;
}

export interface SessionData {
  session_id: string;
  user_name: string;
  focus_area: string;
  script: string;
  audio_url: string;
  duration_seconds: number;
}
