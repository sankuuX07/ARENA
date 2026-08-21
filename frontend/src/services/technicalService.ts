import { ApiService } from './api';

export type TechnicalLanguage = 'c' | 'cpp' | 'java' | 'python' | 'cs_core';
export type TechnicalQuestionType = 'mcq' | 'output' | 'debugging' | 'code_completion' | 'coding' | 'interview';
export type TechnicalDifficulty = 'easy' | 'medium' | 'hard';

export interface TechnicalTopic {
  topicId: string;
  name: string;
  language: TechnicalLanguage;
  description?: string;
  questionCount: number;
}

export interface TechnicalModule {
  moduleId: string;
  language: TechnicalLanguage;
  title: string;
  description: string;
  status: string;
  order: number;
  topics: TechnicalTopic[];
}

export interface TechnicalQuestion {
  questionId: string;
  language: TechnicalLanguage;
  topic: string;
  difficulty: TechnicalDifficulty;
  questionType: TechnicalQuestionType;
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctOption?: number;
  explanation: string;
}

export interface TechnicalSession {
  sessionId: string;
  uid: string;
  language: TechnicalLanguage;
  topic: string;
  difficulty: TechnicalDifficulty;
  questionCount: number;
  currentQuestionIndex: number;
  score: number;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  questions: TechnicalQuestion[];
}

export interface TechnicalResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  completedAt: string;
}

export const getTechnicalModules = async (): Promise<TechnicalModule[]> => {
  return await ApiService.get<TechnicalModule[]>('/technical/modules');
};

export const getTechnicalModule = async (moduleId: string): Promise<TechnicalModule> => {
  return await ApiService.get<TechnicalModule>(`/technical/modules/${moduleId}`);
};

export const startTechnicalSession = async (
  language: TechnicalLanguage,
  topic: string,
  difficulty: TechnicalDifficulty,
  count: number = 5
): Promise<TechnicalSession> => {
  return await ApiService.post<TechnicalSession>('/technical/sessions/start', {
    language,
    topic,
    difficulty,
    count
  });
};

export const completeTechnicalSession = async (
  sessionId: string,
  score: number
): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(`/technical/sessions/${sessionId}/complete`, {
    score
  });
};
