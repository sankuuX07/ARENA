import api from './api';
import {
  ResumeImprovementSession,
  ResumeImprovementSuggestion,
  ResumeImprovementSummary,
  ResumeImprovementDraft
} from '../types/resumeImprovement';

class ResumeImprovementService {
  async createSession(resumeId: string, screeningResultId?: string): Promise<ResumeImprovementSession> {
    const response = await api.post('/resume-improvement/sessions', { resumeId, screeningResultId });
    return response.data;
  }

  async getSessions(): Promise<ResumeImprovementSession[]> {
    const response = await api.get('/resume-improvement/sessions');
    return response.data;
  }

  async getSessionSummary(sessionId: string): Promise<ResumeImprovementSummary> {
    const response = await api.get(`/resume-improvement/sessions/${sessionId}`);
    return response.data;
  }

  async generateSuggestions(sessionId: string, section: string, context?: string): Promise<ResumeImprovementSuggestion[]> {
    const response = await api.post(`/resume-improvement/sessions/${sessionId}/suggestions/generate`, { section, context });
    return response.data;
  }

  async getSuggestions(sessionId: string): Promise<ResumeImprovementSuggestion[]> {
    const response = await api.get(`/resume-improvement/sessions/${sessionId}/suggestions`);
    return response.data;
  }

  async acceptSuggestion(sessionId: string, suggestionId: string): Promise<ResumeImprovementSuggestion> {
    const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/accept?session_id=${sessionId}`);
    return response.data;
  }

  async rejectSuggestion(sessionId: string, suggestionId: string): Promise<ResumeImprovementSuggestion> {
    const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/reject?session_id=${sessionId}`);
    return response.data;
  }

  async editSuggestion(sessionId: string, suggestionId: string, editedText: string): Promise<ResumeImprovementSuggestion> {
    const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/edit?session_id=${sessionId}`, { editedText });
    return response.data;
  }

  async getDraft(sessionId: string): Promise<ResumeImprovementDraft> {
    const response = await api.get(`/resume-improvement/sessions/${sessionId}/draft`);
    return response.data;
  }
}

export const resumeImprovementService = new ResumeImprovementService();
