import api from './api';
import { clearCache } from '../utils/cache';
import {
  AnalyticsOverview,
  CommunicationAnalytics,
  AptitudeAnalytics,
  CodingAnalytics,
  TechnicalAnalytics,
  AssessmentAnalytics,
  InterviewAnalytics,
  ResumeAnalytics,
  AnalyticsActivity
} from '../types/analytics';

class AnalyticsService {
  async getOverview(): Promise<AnalyticsOverview> {
    const response = await api.get('/analytics/overview');
    return response.data;
  }

  async refreshOverview(): Promise<AnalyticsOverview> {
    const response = await api.post('/analytics/refresh');
    // Clear cache to ensure subsequent GETs get fresh data
    clearCache('analytics');
    return response.data;
  }

  async getCommunicationAnalytics(): Promise<CommunicationAnalytics> {
    const response = await api.get('/analytics/communication');
    return response.data;
  }

  async getAptitudeAnalytics(): Promise<AptitudeAnalytics> {
    const response = await api.get('/analytics/aptitude');
    return response.data;
  }

  async getCodingAnalytics(): Promise<CodingAnalytics> {
    const response = await api.get('/analytics/coding');
    return response.data;
  }

  async getTechnicalAnalytics(): Promise<TechnicalAnalytics> {
    const response = await api.get('/analytics/technical');
    return response.data;
  }

  async getAssessmentAnalytics(): Promise<AssessmentAnalytics> {
    const response = await api.get('/analytics/assessments');
    return response.data;
  }

  async getInterviewAnalytics(): Promise<InterviewAnalytics> {
    const response = await api.get('/analytics/interviews');
    return response.data;
  }

  async getResumeAnalytics(): Promise<ResumeAnalytics> {
    const response = await api.get('/analytics/resume');
    return response.data;
  }

  async getActivityTimeline(): Promise<AnalyticsActivity[]> {
    const response = await api.get('/analytics/activity');
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
