import api from './api';
import { clearCache } from '../utils/cache';
import { AnalyticsOverview, CommunicationAnalytics, AptitudeAnalytics, CodingAnalytics, TechnicalAnalytics, AssessmentAnalytics, InterviewAnalytics, ResumeAnalytics, AnalyticsActivity } from '../types/analytics';
class AnalyticsService {
    async getOverview() {
        const response = await api.get('/analytics/overview');
        return response;
    }
    async refreshOverview() {
        const response = await api.post('/analytics/refresh');
        // Clear cache to ensure subsequent GETs get fresh data
        clearCache('analytics');
        return response;
    }
    async getCommunicationAnalytics() {
        const response = await api.get('/analytics/communication');
        return response;
    }
    async getAptitudeAnalytics() {
        const response = await api.get('/analytics/aptitude');
        return response;
    }
    async getCodingAnalytics() {
        const response = await api.get('/analytics/coding');
        return response;
    }
    async getTechnicalAnalytics() {
        const response = await api.get('/analytics/technical');
        return response;
    }
    async getAssessmentAnalytics() {
        const response = await api.get('/analytics/assessments');
        return response;
    }
    async getInterviewAnalytics() {
        const response = await api.get('/analytics/interviews');
        return response;
    }
    async getResumeAnalytics() {
        const response = await api.get('/analytics/resume');
        return response;
    }
    async getActivityTimeline() {
        const response = await api.get('/analytics/activity');
        return response;
    }
}
export const analyticsService = new AnalyticsService();
//# sourceMappingURL=analyticsService.js.map