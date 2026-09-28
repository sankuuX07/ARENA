import { RecommendationOverview, StudentRecommendation, RecommendationHistoryItem } from '../types/recommendation';
declare class RecommendationService {
    getOverview(): Promise<RecommendationOverview>;
    getActiveRecommendations(): Promise<StudentRecommendation[]>;
    getNextAction(): Promise<StudentRecommendation>;
    refreshRecommendations(): Promise<RecommendationOverview>;
    getHistory(): Promise<RecommendationHistoryItem[]>;
    completeRecommendation(id: string): Promise<StudentRecommendation>;
    dismissRecommendation(id: string): Promise<StudentRecommendation>;
}
export declare const recommendationService: RecommendationService;
export {};
//# sourceMappingURL=recommendationService.d.ts.map