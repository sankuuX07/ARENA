export interface FormalEvaluationData {
    professionalism: number;
    clarity: number;
    grammar: number;
    vocabulary: number;
    structure: number;
    relevance: number;
    tone: number;
    conciseness: number;
    confidence: number;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    originalText: string;
    betterVersion?: string;
    rewriteReason?: string;
}
export interface FormalStartResponseData {
    session_id: string;
    category: string;
    difficulty: string;
    scenario: string;
    timestamp: string;
}
export interface FormalRespondResponseData {
    session_id: string;
    turn_index: number;
    evaluation: FormalEvaluationData;
    next_prompt: string;
    is_completed: boolean;
    timestamp: string;
}
export interface FormalCompleteResponseData {
    session_id: string;
    overall_score: number;
    category_breakdown: Record<string, number>;
    strengths: string[];
    improvements: string[];
    summary: string;
    timestamp: string;
}
export interface FormalHistoryItem {
    sessionId: string;
    dateStr: string;
    category: string;
    difficulty: string;
    score: number;
    status: string;
}
/**
 * Start a new Formal Communication Session via FastAPI backend and save in Firestore
 */
export declare const startFormalSession: (uid: string, category: string, difficulty?: 'easy' | 'medium' | 'hard') => Promise<FormalStartResponseData>;
/**
 * Submit student response turn for formal evaluation
 */
export declare const submitFormalTurn: (uid: string, sessionId: string, responseText: string, turnIndex: number, category: string, difficulty?: string, history?: any[]) => Promise<FormalRespondResponseData>;
/**
 * Complete Formal session, save evaluation summary, and update Progress Tracking Engine
 */
export declare const completeFormalSession: (uid: string, sessionId: string, category: string, difficulty: string, evaluations: FormalEvaluationData[]) => Promise<FormalCompleteResponseData>;
/**
 * Fetch completed Formal Communication session history for a student
 */
export declare const getFormalSessionHistory: (uid: string) => Promise<FormalHistoryItem[]>;
//# sourceMappingURL=formalCommunicationService.d.ts.map