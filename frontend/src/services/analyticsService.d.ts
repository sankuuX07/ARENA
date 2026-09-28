import { AnalyticsOverview, CommunicationAnalytics, AptitudeAnalytics, CodingAnalytics, TechnicalAnalytics, AssessmentAnalytics, InterviewAnalytics, ResumeAnalytics, AnalyticsActivity } from '../types/analytics';
declare class AnalyticsService {
    getOverview(): Promise<AnalyticsOverview>;
    refreshOverview(): Promise<AnalyticsOverview>;
    getCommunicationAnalytics(): Promise<CommunicationAnalytics>;
    getAptitudeAnalytics(): Promise<AptitudeAnalytics>;
    getCodingAnalytics(): Promise<CodingAnalytics>;
    getTechnicalAnalytics(): Promise<TechnicalAnalytics>;
    getAssessmentAnalytics(): Promise<AssessmentAnalytics>;
    getInterviewAnalytics(): Promise<InterviewAnalytics>;
    getResumeAnalytics(): Promise<ResumeAnalytics>;
    getActivityTimeline(): Promise<AnalyticsActivity[]>;
}
export declare const analyticsService: AnalyticsService;
export {};
//# sourceMappingURL=analyticsService.d.ts.map