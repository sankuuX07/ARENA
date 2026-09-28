import api from './api';
import { InterviewEvaluation, InterviewHistoryItem } from '../types/interviewEvaluation';
class InterviewEvaluationService {
    async evaluateSession(sessionId) {
        const response = await api.post(`/interviews/sessions/${sessionId}/evaluate`);
        return response;
    }
    async getResult(resultId) {
        const response = await api.get(`/interviews/results/${resultId}`);
        return response;
    }
    async getSessionResult(sessionId) {
        const response = await api.get(`/interviews/sessions/${sessionId}/result`);
        return response;
    }
    async getHistory() {
        const response = await api.get('/interviews/history');
        return response;
    }
}
export const interviewEvaluationService = new InterviewEvaluationService();
//# sourceMappingURL=interviewEvaluationService.js.map