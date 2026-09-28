export type TechnicalLanguage = 'c' | 'cpp' | 'java' | 'python' | 'cs_core';
export type TechnicalQuestionType = 'mcq' | 'output' | 'debugging' | 'code_completion' | 'coding' | 'interview';
export type TechnicalDifficulty = 'easy' | 'medium' | 'hard';
export interface TechnicalTopic {
    topicId: string;
    name: string;
    language: TechnicalLanguage;
    description?: string;
    questionCount: number;
}
export interface TechnicalModule {
    moduleId: string;
    language: TechnicalLanguage;
    title: string;
    description: string;
    status: string;
    order: number;
    topics: TechnicalTopic[];
}
export interface TechnicalQuestion {
    questionId: string;
    language: TechnicalLanguage;
    topic: string;
    difficulty: TechnicalDifficulty;
    questionType: TechnicalQuestionType;
    question: string;
    codeSnippet?: string;
    options?: string[];
    correctOption?: number;
    explanation: string;
}
export interface TechnicalAnswerResponse {
    isCorrect: boolean;
    correctOption?: number;
    explanation: string;
}
export interface TechnicalSession {
    sessionId: string;
    uid: string;
    language: TechnicalLanguage;
    topic: string;
    difficulty: TechnicalDifficulty;
    questionCount: number;
    currentQuestionIndex: number;
    score: number;
    status: 'active' | 'completed' | 'abandoned';
    startedAt: string;
    completedAt?: string;
    questions: TechnicalQuestion[];
}
export interface TechnicalResult {
    sessionId: string;
    score: number;
    totalQuestions: number;
    accuracy: number;
    completedAt: string;
}
export declare const getTechnicalModules: () => Promise<TechnicalModule[]>;
export declare const getTechnicalModule: (moduleId: string) => Promise<TechnicalModule>;
export declare const startTechnicalSession: (language: TechnicalLanguage, topic: string, difficulty: TechnicalDifficulty, count?: number) => Promise<TechnicalSession>;
export declare const completeTechnicalSession: (sessionId: string) => Promise<TechnicalResult>;
export declare const submitTechnicalAnswer: (sessionId: string, questionId: string, selectedOption: number) => Promise<TechnicalAnswerResponse>;
//# sourceMappingURL=technicalService.d.ts.map