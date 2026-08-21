import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult } from './technicalService';

export const getCTopics = async (): Promise<TechnicalTopic[]> => {
  return await ApiService.get<TechnicalTopic[]>('/technical/c/topics');
};

export const getCTopic = async (topicId: string): Promise<TechnicalTopic> => {
  return await ApiService.get<TechnicalTopic>(`/technical/c/topics/${topicId}`);
};

export const startCSession = async (
  topic: string,
  difficulty: TechnicalDifficulty,
  questionType: TechnicalQuestionType,
  count: number = 10
): Promise<TechnicalSession> => {
  return await ApiService.post<TechnicalSession>('/technical/c/sessions/start', {
    topic,
    difficulty,
    questionType,
    count
  });
};

export const completeCSession = async (
  sessionId: string,
  score: number
): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(`/technical/c/sessions/${sessionId}/complete`, {
    score
  });
};
