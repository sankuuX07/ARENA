import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export declare const getJavaTopics: () => Promise<TechnicalTopic[]>;
export declare const getJavaTopic: (topicId: string) => Promise<TechnicalTopic>;
export declare const startJavaSession: (topic: string, difficulty: TechnicalDifficulty, questionType: TechnicalQuestionType, count?: number) => Promise<TechnicalSession>;
export declare const completeJavaSession: (sessionId: string) => Promise<TechnicalResult>;
export declare const submitJavaAnswer: (sessionId: string, questionId: string, selectedOption: number) => Promise<TechnicalAnswerResponse>;
//# sourceMappingURL=javaService.d.ts.map