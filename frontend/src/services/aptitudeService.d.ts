export interface AptitudeQuestion {
    question_id: string;
    question: string;
    options: string[];
    correctOption?: number;
    explanation?: string;
}
export interface AptitudeStartResponse {
    session_id: string;
    category: string;
    topic?: string;
    difficulty: string;
    questions: AptitudeQuestion[];
}
export interface AptitudeSessionSummary {
    session_id: string;
    category: string;
    topic?: string;
    difficulty: string;
    total_questions: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    score: number;
    accuracy: number;
    time_taken: number;
    completed_at: string;
    questions_with_answers?: AptitudeQuestion[];
}
export interface AptitudeHistoryItem {
    sessionId: string;
    dateStr: string;
    category: string;
    topic?: string;
    difficulty: string;
    score: number;
    accuracy: number;
    status: 'active' | 'completed';
}
export declare const startAptitudeSession: (uid: string, category: string, difficulty: string, numQuestions?: number, topic?: string) => Promise<AptitudeStartResponse>;
export declare const completeAptitudeSession: (uid: string, sessionId: string, category: string, difficulty: string, questions: AptitudeQuestion[], answers: Record<string, number>, timeTakenSecs: number, topic?: string) => Promise<AptitudeSessionSummary>;
export declare const getAptitudeHistory: (uid: string) => Promise<AptitudeHistoryItem[]>;
//# sourceMappingURL=aptitudeService.d.ts.map