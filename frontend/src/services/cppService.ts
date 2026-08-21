import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult } from './technicalService';

export const getCppTopics = async (): Promise<TechnicalTopic[]> => {
  return await ApiService.get<TechnicalTopic[]>('/technical/cpp/topics');
};

export const getCppTopic = async (topicId: string): Promise<TechnicalTopic> => {
  return await ApiService.get<TechnicalTopic>(`/technical/cpp/topics/${topicId}`);
};

export const startCppSession = async (
  topic: string,
  difficulty: TechnicalDifficulty,
  questionType: TechnicalQuestionType,
  count: number = 10
): Promise<TechnicalSession> => {
  return await ApiService.post<TechnicalSession>('/technical/cpp/sessions/start', {
    topic,
    difficulty,
    questionType,
    count
  });
};

export const completeCppSession = async (
  sessionId: string,
  score: number
): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(`/technical/cpp/sessions/${sessionId}/complete`, {
    score
  });
};
