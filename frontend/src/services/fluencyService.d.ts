export interface FluencyEvaluationData {
    grammar: number;
    vocabulary: number;
    sentenceStructure: number;
    clarity: number;
    coherence: number;
    relevance: number;
    fluency: number;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    originalText: string;
    betterVersion?: string;
}
export interface FluencyStartResponseData {
    session_id: string;
    topic: string;
    prompt: string;
    difficulty: string;
    timestamp: string;
}
export interface FluencyRespondResponseData {
    session_id: string;
    turn_index: number;
    evaluation: FluencyEvaluationData;
    next_prompt: string;
    is_completed: boolean;
    timestamp: string;
}
export interface FluencyCompleteResponseData {
    session_id: string;
    overall_score: number;
    category_breakdown: Record<string, number>;
    strengths: string[];
    improvements: string[];
    summary: string;
    timestamp: string;
}
export interface FluencyHistoryItem {
    sessionId: string;
    dateStr: string;
    difficulty: string;
    score: number;
    topic: string;
}
/**
 * Start a new Fluency Session via FastAPI backend and save in Firestore
 */
export declare const startFluencySession: (uid: string, difficulty?: 'easy' | 'medium' | 'hard', topic?: string) => Promise<FluencyStartResponseData>;
/**
 * Submit student response turn for 7-criteria AI evaluation
 */
export declare const submitFluencyTurn: (uid: string, sessionId: string, responseText: string, turnIndex: number, difficulty?: string, history?: any[]) => Promise<FluencyRespondResponseData>;
/**
 * Complete Fluency session, save evaluation summary, and update Progress Tracking Engine
 */
export declare const completeFluencySession: (uid: string, sessionId: string, evaluations: FluencyEvaluationData[]) => Promise<FluencyCompleteResponseData>;
/**
 * Fetch completed Fluency session history for a student
 */
export declare const getFluencySessionHistory: (uid: string) => Promise<FluencyHistoryItem[]>;
//# sourceMappingURL=fluencyService.d.ts.map