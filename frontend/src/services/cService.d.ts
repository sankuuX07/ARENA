import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export declare const getCTopics: () => Promise<TechnicalTopic[]>;
export declare const getCTopic: (topicId: string) => Promise<TechnicalTopic>;
export declare const startCSession: (topic: string, difficulty: TechnicalDifficulty, questionType: TechnicalQuestionType, count?: number) => Promise<TechnicalSession>;
export declare const completeCSession: (sessionId: string) => Promise<TechnicalResult>;
export declare const submitCAnswer: (sessionId: string, questionId: string, selectedOption: number) => Promise<TechnicalAnswerResponse>;
//# sourceMappingURL=cService.d.ts.map