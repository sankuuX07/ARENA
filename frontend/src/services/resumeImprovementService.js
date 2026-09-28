import api from './api';
import { ResumeImprovementSession, ResumeImprovementSuggestion, ResumeImprovementSummary, ResumeImprovementDraft } from '../types/resumeImprovement';
class ResumeImprovementService {
    async createSession(resumeId, screeningResultId) {
        const response = await api.post('/resume-improvement/sessions', { resumeId, screeningResultId });
        return response;
    }
    async getSessions() {
        const response = await api.get('/resume-improvement/sessions');
        return response;
    }
    async getSessionSummary(sessionId) {
        const response = await api.get(`/resume-improvement/sessions/${sessionId}`);
        return response;
    }
    async generateSuggestions(sessionId, section, context) {
        const response = await api.post(`/resume-improvement/sessions/${sessionId}/suggestions/generate`, { section, context });
        return response;
    }
    async getSuggestions(sessionId) {
        const response = await api.get(`/resume-improvement/sessions/${sessionId}/suggestions`);
        return response;
    }
    async acceptSuggestion(sessionId, suggestionId) {
        const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/accept?session_id=${sessionId}`);
        return response;
    }
    async rejectSuggestion(sessionId, suggestionId) {
        const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/reject?session_id=${sessionId}`);
        return response;
    }
    async editSuggestion(sessionId, suggestionId, editedText) {
        const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/edit?session_id=${sessionId}`, { editedText });
        return response;
    }
    async getDraft(sessionId) {
        const response = await api.get(`/resume-improvement/sessions/${sessionId}/draft`);
        return response;
    }
}
export const resumeImprovementService = new ResumeImprovementService();
//# sourceMappingURL=resumeImprovementService.js.map