export interface SituationalEvaluationData {
    relevance: number;
    clarity: number;
    professionalism: number;
    tone: number;
    appropriateness: number;
    empathy: number;
    decisionMaking: number;
    problemHandling: number;
    confidence: number;
    communicationQuality: number;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    originalText: string;
    betterResponse?: string;
    followUp?: string;
}
export interface SituationalStartResponseData {
    session_id: string;
    category: string;
    difficulty: string;
    scenario: string;
    timestamp: string;
}
export interface SituationalRespondResponseData {
    session_id: string;
    turn_index: number;
    evaluation: SituationalEvaluationData;
    next_prompt: string;
    is_completed: boolean;
    timestamp: string;
}
export interface SituationalCompleteResponseData {
    session_id: string;
    overall_score: number;
    category_breakdown: Record<string, number>;
    strengths: string[];
    improvements: string[];
    summary: string;
    timestamp: string;
}
export interface SituationalHistoryItem {
    sessionId: string;
    dateStr: string;
    category: string;
    difficulty: string;
    score: number;
    status: string;
}
/**
 * Start a new Situational Communication Session via FastAPI backend and save in Firestore
 */
export declare const startSituationalSession: (uid: string, category: string, difficulty?: 'easy' | 'medium' | 'hard') => Promise<SituationalStartResponseData>;
/**
 * Submit student response turn for situational evaluation
 */
export declare const submitSituationalTurn: (uid: string, sessionId: string, responseText: string, turnIndex: number, category: string, difficulty?: string, history?: any[]) => Promise<SituationalRespondResponseData>;
/**
 * Complete Situational session, save evaluation summary, and update Progress Tracking Engine
 */
export declare const completeSituationalSession: (uid: string, sessionId: string, category: string, difficulty: string, evaluations: SituationalEvaluationData[]) => Promise<SituationalCompleteResponseData>;
/**
 * Fetch completed Situational Communication session history for a student
 */
export declare const getSituationalSessionHistory: (uid: string) => Promise<SituationalHistoryItem[]>;
//# sourceMappingURL=situationalCommunicationService.d.ts.map