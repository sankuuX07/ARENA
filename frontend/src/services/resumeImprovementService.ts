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
    return response;
  }

  async getSessions(): Promise<ResumeImprovementSession[]> {
    const response = await api.get('/resume-improvement/sessions');
    return response;
  }

  async getSessionSummary(sessionId: string): Promise<ResumeImprovementSummary> {
    const response = await api.get(`/resume-improvement/sessions/${sessionId}`);
    return response;
  }

  async generateSuggestions(sessionId: string, section: string, context?: string): Promise<ResumeImprovementSuggestion[]> {
    const response = await api.post(`/resume-improvement/sessions/${sessionId}/suggestions/generate`, { section, context });
    return response;
  }

  async getSuggestions(sessionId: string): Promise<ResumeImprovementSuggestion[]> {
    const response = await api.get(`/resume-improvement/sessions/${sessionId}/suggestions`);
    return response;
  }

  async acceptSuggestion(sessionId: string, suggestionId: string): Promise<ResumeImprovementSuggestion> {
    const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/accept?session_id=${sessionId}`);
    return response;
  }

  async rejectSuggestion(sessionId: string, suggestionId: string): Promise<ResumeImprovementSuggestion> {
    const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/reject?session_id=${sessionId}`);
    return response;
  }

  async editSuggestion(sessionId: string, suggestionId: string, editedText: string): Promise<ResumeImprovementSuggestion> {
    const response = await api.patch(`/resume-improvement/suggestions/${suggestionId}/edit?session_id=${sessionId}`, { editedText });
    return response;
  }

  async getDraft(sessionId: string): Promise<ResumeImprovementDraft> {
    const response = await api.get(`/resume-improvement/sessions/${sessionId}/draft`);
    return response;
  }
}

export const resumeImprovementService = new ResumeImprovementService();
