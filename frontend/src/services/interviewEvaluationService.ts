import api from './api';
import { InterviewEvaluation, InterviewHistoryItem } from '../types/interviewEvaluation';

class InterviewEvaluationService {
  async evaluateSession(sessionId: string): Promise<InterviewEvaluation> {
    const response = await api.post(`/interviews/sessions/${sessionId}/evaluate`);
    return response.data;
  }

  async getResult(resultId: string): Promise<InterviewEvaluation> {
    const response = await api.get(`/interviews/results/${resultId}`);
    return response.data;
  }

  async getSessionResult(sessionId: string): Promise<InterviewEvaluation> {
    const response = await api.get(`/interviews/sessions/${sessionId}/result`);
    return response.data;
  }

  async getHistory(): Promise<InterviewHistoryItem[]> {
    const response = await api.get('/interviews/history');
    return response.data;
  }
}

export const interviewEvaluationService = new InterviewEvaluationService();
