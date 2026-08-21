export type ResumeImprovementSessionStatus = 'draft' | 'active' | 'completed' | 'archived';
export type ResumeImprovementPriority = 'high' | 'medium' | 'low';
export type ResumeImprovementSuggestionStatus = 'pending' | 'accepted' | 'rejected';

export interface ResumeImprovementSuggestion {
  suggestionId: string;
  sessionId: string;
  section: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  priority: ResumeImprovementPriority;
  status: ResumeImprovementSuggestionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeImprovementDraft {
  draftId: string;
  sessionId: string;
  resumeId: string;
  sections: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeImprovementSession {
  sessionId: string;
  userId: string;
  resumeId: string;
  screeningResultId?: string;
  status: ResumeImprovementSessionStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  suggestionsCount: number;
  acceptedCount: number;
  rejectedCount: number;
}

export interface GenerateSuggestionRequest {
  section: string;
  context?: string;
}

export interface EditSuggestionRequest {
  editedText: string;
}

export interface ResumeImprovementSummary {
  session: ResumeImprovementSession;
  suggestions: ResumeImprovementSuggestion[];
  draft?: ResumeImprovementDraft;
}
