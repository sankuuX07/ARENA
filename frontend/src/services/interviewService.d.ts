export interface InterviewMode {
    id: string;
    name: string;
}
export interface InterviewConfig {
    mode: string;
    difficulty: string;
    durationMinutes: number;
    maxQuestions: number;
    responseMode: string;
    topic?: string;
}
export interface InterviewMessage {
    messageId: string;
    sessionId: string;
    role: 'interviewer' | 'student' | 'system';
    content: string;
    timestamp: string;
    questionType?: string;
}
export interface InterviewSession {
    sessionId: string;
    userId: string;
    mode: string;
    difficulty: string;
    responseMode: string;
    topic?: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'expired' | 'abandoned';
    startedAt?: string;
    expiresAt?: string;
    questionCount: number;
    maxQuestions: number;
    messages: InterviewMessage[];
}
export interface InterviewResponseRequest {
    responseMode: string;
    content: string;
}
export interface InterviewResponse {
    studentMessage: InterviewMessage;
    interviewerMessage: InterviewMessage;
    nextQuestionType: string;
    currentDifficulty: string;
    sessionStatus: string;
}
export interface InterviewStatusResponse {
    status: string;
    startedAt?: string;
    expiresAt?: string;
    serverTime: string;
}
export declare const getInterviewModes: () => Promise<InterviewMode[]>;
export declare const startInterviewSession: (config: InterviewConfig) => Promise<InterviewSession>;
export declare const getInterviewSession: (sessionId: string) => Promise<InterviewSession>;
export declare const respondToInterview: (sessionId: string, request: InterviewResponseRequest) => Promise<InterviewResponse>;
export declare const endInterviewSession: (sessionId: string) => Promise<InterviewSession>;
export declare const getInterviewStatus: (sessionId: string) => Promise<InterviewStatusResponse>;
//# sourceMappingURL=interviewService.d.ts.map