import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export declare const getCppTopics: () => Promise<TechnicalTopic[]>;
export declare const getCppTopic: (topicId: string) => Promise<TechnicalTopic>;
export declare const startCppSession: (topic: string, difficulty: TechnicalDifficulty, questionType: TechnicalQuestionType, count?: number) => Promise<TechnicalSession>;
export declare const completeCppSession: (sessionId: string) => Promise<TechnicalResult>;
export declare const submitCppAnswer: (sessionId: string, questionId: string, selectedOption: number) => Promise<TechnicalAnswerResponse>;
//# sourceMappingURL=cppService.d.ts.map