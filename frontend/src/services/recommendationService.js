import api from './api';
import { RecommendationOverview, StudentRecommendation, RecommendationHistoryItem } from '../types/recommendation';
class RecommendationService {
    async getOverview() {
        const response = await api.get('/recommendations/overview');
        return response;
    }
    async getActiveRecommendations() {
        const response = await api.get('/recommendations/active');
        return response;
    }
    async getNextAction() {
        const response = await api.get('/recommendations/next-action');
        return response;
    }
    async refreshRecommendations() {
        const response = await api.post('/recommendations/refresh');
        return response;
    }
    async getHistory() {
        const response = await api.get('/recommendations/history');
        return response;
    }
    async completeRecommendation(id) {
        const response = await api.patch(`/recommendations/${id}/complete`);
        return response;
    }
    async dismissRecommendation(id) {
        const response = await api.patch(`/recommendations/${id}/dismiss`);
        return response;
    }
}
export const recommendationService = new RecommendationService();
//# sourceMappingURL=recommendationService.js.map