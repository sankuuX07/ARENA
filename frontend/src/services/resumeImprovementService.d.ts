import { ResumeImprovementSession, ResumeImprovementSuggestion, ResumeImprovementSummary, ResumeImprovementDraft } from '../types/resumeImprovement';
declare class ResumeImprovementService {
    createSession(resumeId: string, screeningResultId?: string): Promise<ResumeImprovementSession>;
    getSessions(): Promise<ResumeImprovementSession[]>;
    getSessionSummary(sessionId: string): Promise<ResumeImprovementSummary>;
    generateSuggestions(sessionId: string, section: string, context?: string): Promise<ResumeImprovementSuggestion[]>;
    getSuggestions(sessionId: string): Promise<ResumeImprovementSuggestion[]>;
    acceptSuggestion(sessionId: string, suggestionId: string): Promise<ResumeImprovementSuggestion>;
    rejectSuggestion(sessionId: string, suggestionId: string): Promise<ResumeImprovementSuggestion>;
    editSuggestion(sessionId: string, suggestionId: string, editedText: string): Promise<ResumeImprovementSuggestion>;
    getDraft(sessionId: string): Promise<ResumeImprovementDraft>;
}
export declare const resumeImprovementService: ResumeImprovementService;
export {};
//# sourceMappingURL=resumeImprovementService.d.ts.map