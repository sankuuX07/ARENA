import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';

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
  ): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(`/technical/python/sessions/${sessionId}/complete`, {});
};

export const submitPythonAnswer = async (
  sessionId: string,
  questionId: string,
  selectedOption: number
): Promise<TechnicalAnswerResponse> => {
  return await ApiService.post<TechnicalAnswerResponse>(`/technical/python/sessions/${sessionId}/answer`, {
    questionId,
    selectedOption
  });
};
