import { Competition, CompetitionSession, CompetitionResult, CompetitionLeaderboardResponse, CompetitionHistoryItem } from '../types/competition';
declare class CompetitionService {
    getAll(): Promise<Competition[]>;
    getLive(): Promise<Competition[]>;
    getUpcoming(): Promise<Competition[]>;
    getHistory(): Promise<CompetitionHistoryItem[]>;
    getById(id: string): Promise<Competition>;
    register(id: string): Promise<any>;
    start(id: string): Promise<CompetitionSession>;
    getSession(id: string): Promise<CompetitionSession>;
    updateSession(id: string, answers: Record<string, any>): Promise<CompetitionSession>;
    submit(id: string): Promise<CompetitionResult>;
    getResult(id: string): Promise<CompetitionResult>;
    getLeaderboard(id: string): Promise<CompetitionLeaderboardResponse>;
}
export declare const competitionService: CompetitionService;
export {};
//# sourceMappingURL=competitionService.d.ts.map