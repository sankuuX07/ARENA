import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalSession, TechnicalResult } from './technicalService';

export interface CSTopic {
  topicId: string;
  name: string;
  subjectId: string;
  description: string;
  questionCount: number;
}

export interface CSSubject {
  subjectId: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  status: string;
  topics?: CSTopic[];
}

export const getCSCoreSubjects = async (): Promise<CSSubject[]> => {
  return await ApiService.get<CSSubject[]>('/technical/cs-core/subjects');
};

export const getCSCoreSubject = async (subjectId: string): Promise<CSSubject> => {
  return await ApiService.get<CSSubject>(`/technical/cs-core/subjects/${subjectId}`);
};

export const getCSCoreTopics = async (subjectId: string): Promise<CSTopic[]> => {
  return await ApiService.get<CSTopic[]>(`/technical/cs-core/subjects/${subjectId}/topics`);
};

export const startCSCoreSession = async (
  subjectId: string,
  topicId: string,
  difficulty: TechnicalDifficulty,
  questionType: TechnicalQuestionType,
  count: number = 10
): Promise<TechnicalSession> => {
  return await ApiService.post<TechnicalSession>('/technical/cs-core/sessions/start', {
    subjectId,
    topicId,
    difficulty,
    questionType,
    count
  });
};

export const completeCSCoreSession = async (
  sessionId: string,
  score: number
): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(`/technical/cs-core/sessions/${sessionId}/complete`, {
    score
  });
};
