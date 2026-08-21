import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult } from './technicalService';

export const getJavaTopics = async (): Promise<TechnicalTopic[]> => {
  return await ApiService.get<TechnicalTopic[]>('/technical/java/topics');
};

export const getJavaTopic = async (topicId: string): Promise<TechnicalTopic> => {
  return await ApiService.get<TechnicalTopic>(`/technical/java/topics/${topicId}`);
};

export const startJavaSession = async (
  topic: string,
  difficulty: TechnicalDifficulty,
  questionType: TechnicalQuestionType,
  count: number = 10
): Promise<TechnicalSession> => {
  return await ApiService.post<TechnicalSession>('/technical/java/sessions/start', {
    topic,
    difficulty,
    questionType,
    count
  });
};

export const completeJavaSession = async (
  sessionId: string,
  score: number
): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(`/technical/java/sessions/${sessionId}/complete`, {
    score
  });
};
