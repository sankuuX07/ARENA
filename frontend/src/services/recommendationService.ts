import api from './api';
import {
  RecommendationOverview,
  StudentRecommendation,
  RecommendationHistoryItem
} from '../types/recommendation';

class RecommendationService {
  async getOverview(): Promise<RecommendationOverview> {
    const response = await api.get('/recommendations/overview');
    return response.data;
  }

  async getActiveRecommendations(): Promise<StudentRecommendation[]> {
    const response = await api.get('/recommendations/active');
    return response.data;
  }

  async getNextAction(): Promise<StudentRecommendation> {
    const response = await api.get('/recommendations/next-action');
    return response.data;
  }

  async refreshRecommendations(): Promise<RecommendationOverview> {
    const response = await api.post('/recommendations/refresh');
    return response.data;
  }

  async getHistory(): Promise<RecommendationHistoryItem[]> {
    const response = await api.get('/recommendations/history');
    return response.data;
  }

  async completeRecommendation(id: string): Promise<StudentRecommendation> {
    const response = await api.patch(`/recommendations/${id}/complete`);
    return response.data;
  }

  async dismissRecommendation(id: string): Promise<StudentRecommendation> {
    const response = await api.patch(`/recommendations/${id}/dismiss`);
    return response.data;
  }
}

export const recommendationService = new RecommendationService();
