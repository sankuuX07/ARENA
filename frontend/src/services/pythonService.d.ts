import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export declare const getPythonTopics: () => Promise<TechnicalTopic[]>;
export declare const getPythonTopic: (topicId: string) => Promise<TechnicalTopic>;
export declare const startPythonSession: (topic: string, difficulty: TechnicalDifficulty, questionType: TechnicalQuestionType, count?: number) => Promise<TechnicalSession>;
export declare const completePythonSession: (sessionId: string) => Promise<TechnicalResult>;
export declare const submitPythonAnswer: (sessionId: string, questionId: string, selectedOption: number) => Promise<TechnicalAnswerResponse>;
//# sourceMappingURL=pythonService.d.ts.map