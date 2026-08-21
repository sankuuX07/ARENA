import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult } from './technicalService';

export const getPythonTopics = async (): Promise<TechnicalTopic[]> => {
  return await ApiService.get<TechnicalTopic[]>('/technical/python/topics');
};

export const getPythonTopic = async (topicId: string): Promise<TechnicalTopic> => {
  return await ApiService.get<TechnicalTopic>(`/technical/python/topics/${topicId}`);
};

export const startPythonSession = async (
  topic: string,
  difficulty: TechnicalDifficulty,
  questionType: TechnicalQuestionType,
  count: number = 10
): Promise<TechnicalSession> => {
  return await ApiService.post<TechnicalSession>('/technical/python/sessions/start', {
    topic,
    difficulty,
    questionType,
    count
  });
};

export const completePythonSession = async (
  sessionId: string,
  score: number
): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(`/technical/python/sessions/${sessionId}/complete`, {
    score
  });
};
