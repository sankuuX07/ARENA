import api from './api';
import { InterviewEvaluation, InterviewHistoryItem } from '../types/interviewEvaluation';

class InterviewEvaluationService {
  async evaluateSession(sessionId: string): Promise<InterviewEvaluation> {
    const response = await api.post(`/interviews/sessions/${sessionId}/evaluate`);
    return response;
  }

  async getResult(resultId: string): Promise<InterviewEvaluation> {
    const response = await api.get(`/interviews/results/${resultId}`);
    return response;
  }

  async getSessionResult(sessionId: string): Promise<InterviewEvaluation> {
    const response = await api.get(`/interviews/sessions/${sessionId}/result`);
    return response;
  }

  async getHistory(): Promise<InterviewHistoryItem[]> {
    const response = await api.get('/interviews/history');
    return response;
  }
}

export const interviewEvaluationService = new InterviewEvaluationService();
