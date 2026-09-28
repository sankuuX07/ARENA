import { TechnicalQuestionType, TechnicalDifficulty, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export interface CSTopic {
    topicId: string;
    name: string;
    subjectId: string;
    description: string;
    questionCount: number;
}
export interface CSSubject {
    subjectId: string;
    name: string;
    description: string;
    icon: string;
    order: number;
    status: string;
    topics?: CSTopic[];
}
export declare const getCSCoreSubjects: () => Promise<CSSubject[]>;
export declare const getCSCoreSubject: (subjectId: string) => Promise<CSSubject>;
export declare const getCSCoreTopics: (subjectId: string) => Promise<CSTopic[]>;
export declare const startCSCoreSession: (subjectId: string, topicId: string, difficulty: TechnicalDifficulty, questionType: TechnicalQuestionType, count?: number) => Promise<TechnicalSession>;
export declare const completeCSCoreSession: (sessionId: string) => Promise<TechnicalResult>;
export declare const submitCSCoreAnswer: (sessionId: string, questionId: string, selectedOption: number) => Promise<TechnicalAnswerResponse>;
//# sourceMappingURL=csCoreService.d.ts.map