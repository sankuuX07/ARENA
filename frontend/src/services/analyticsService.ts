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
    return response;
  }

  async refreshOverview(): Promise<AnalyticsOverview> {
    const response = await api.post('/analytics/refresh');
    // Clear cache to ensure subsequent GETs get fresh data
    clearCache('analytics');
    return response;
  }

  async getCommunicationAnalytics(): Promise<CommunicationAnalytics> {
    const response = await api.get('/analytics/communication');
    return response;
  }

  async getAptitudeAnalytics(): Promise<AptitudeAnalytics> {
    const response = await api.get('/analytics/aptitude');
    return response;
  }

  async getCodingAnalytics(): Promise<CodingAnalytics> {
    const response = await api.get('/analytics/coding');
    return response;
  }

  async getTechnicalAnalytics(): Promise<TechnicalAnalytics> {
    const response = await api.get('/analytics/technical');
    return response;
  }

  async getAssessmentAnalytics(): Promise<AssessmentAnalytics> {
    const response = await api.get('/analytics/assessments');
    return response;
  }

  async getInterviewAnalytics(): Promise<InterviewAnalytics> {
    const response = await api.get('/analytics/interviews');
    return response;
  }

  async getResumeAnalytics(): Promise<ResumeAnalytics> {
    const response = await api.get('/analytics/resume');
    return response;
  }

  async getActivityTimeline(): Promise<AnalyticsActivity[]> {
    const response = await api.get('/analytics/activity');
    return response;
  }
}

export const analyticsService = new AnalyticsService();
