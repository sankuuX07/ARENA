import { ApiService } from './api';

export interface InterviewMode {
  id: string;
  name: string;
}

export interface InterviewConfig {
  mode: string;
  difficulty: string;
  durationMinutes: number;
  maxQuestions: number;
  responseMode: string;
  topic?: string;
}

export interface InterviewMessage {
  messageId: string;
  sessionId: string;
  role: 'interviewer' | 'student' | 'system';
  content: string;
  timestamp: string;
  questionType?: string;
}

export interface InterviewSession {
  sessionId: string;
  userId: string;
  mode: string;
  difficulty: string;
  responseMode: string;
  topic?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'expired' | 'abandoned';
  startedAt?: string;
  expiresAt?: string;
  questionCount: number;
  maxQuestions: number;
  messages: InterviewMessage[];
}

export interface InterviewResponseRequest {
  responseMode: string;
  content: string;
}

export interface InterviewResponse {
  studentMessage: InterviewMessage;
  interviewerMessage: InterviewMessage;
  nextQuestionType: string;
  currentDifficulty: string;
  sessionStatus: string;
}

export interface InterviewStatusResponse {
  status: string;
  startedAt?: string;
  expiresAt?: string;
  serverTime: string;
}

export const getInterviewModes = async (): Promise<InterviewMode[]> => {
  return await ApiService.get<InterviewMode[]>('/interviews/modes');
};

export const startInterviewSession = async (config: InterviewConfig): Promise<InterviewSession> => {
  return await ApiService.post<InterviewSession>('/interviews/sessions', config);
};

export const getInterviewSession = async (sessionId: string): Promise<InterviewSession> => {
  return await ApiService.get<InterviewSession>(`/interviews/sessions/${sessionId}`);
};

export const respondToInterview = async (sessionId: string, request: InterviewResponseRequest): Promise<InterviewResponse> => {
  return await ApiService.post<InterviewResponse>(`/interviews/sessions/${sessionId}/respond`, request);
};

export const endInterviewSession = async (sessionId: string): Promise<InterviewSession> => {
  return await ApiService.post<InterviewSession>(`/interviews/sessions/${sessionId}/end`, {});
};

export const getInterviewStatus = async (sessionId: string): Promise<InterviewStatusResponse> => {
  return await ApiService.get<InterviewStatusResponse>(`/interviews/sessions/${sessionId}/status`);
};
