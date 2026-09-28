import { InterviewEvaluation, InterviewHistoryItem } from '../types/interviewEvaluation';
declare class InterviewEvaluationService {
    evaluateSession(sessionId: string): Promise<InterviewEvaluation>;
    getResult(resultId: string): Promise<InterviewEvaluation>;
    getSessionResult(sessionId: string): Promise<InterviewEvaluation>;
    getHistory(): Promise<InterviewHistoryItem[]>;
}
export declare const interviewEvaluationService: InterviewEvaluationService;
export {};
//# sourceMappingURL=interviewEvaluationService.d.ts.map