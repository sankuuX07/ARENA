export type AnalyticsPerformanceLevel = 
  | 'Excellent'
  | 'Strong'
  | 'Good Foundation'
  | 'Needs Improvement'
  | 'Needs Significant Improvement'
  | 'Insufficient Data';

export type AnalyticsTrend = 
  | 'Improving'
  | 'Stable'
  | 'Declining'
  | 'Insufficient Data';

export interface AnalyticsCoverage {
  availableCategories: number;
  exploredCategories: number;
  coveragePercentage: number;
  unexploredCategories: string[];
}

export interface AnalyticsCategory {
  id: string;
  name: string;
  score: number | null;
  performanceLevel: AnalyticsPerformanceLevel;
  completedActivities: number;
  trend: AnalyticsTrend;
  weight: number;
}

export interface AnalyticsStrength {
  categoryName: string;
  score: number;
}

export interface AnalyticsImprovementArea {
  categoryName: string;
  score: number;
}

export interface AnalyticsActivity {
  activityId: string;
  activityName: string;
  module: string;
  timestamp: string;
  score: number | null;
}

export interface AnalyticsInsight {
  id: string;
  text: string;
  isPositive: boolean;
}

export interface AnalyticsOverview {
  userId: string;
  overallScore: number;
  performanceLevel: AnalyticsPerformanceLevel;
  coverage: AnalyticsCoverage;
  categories: AnalyticsCategory[];
  strengths: AnalyticsStrength[];
  improvementAreas: AnalyticsImprovementArea[];
  insights: AnalyticsInsight[];
  recentActivity: AnalyticsActivity[];
  lastUpdated: string;
}

// Module Specific Breakdowns
export interface CommunicationAnalytics {
  overallScore: number | null;
  completedSessions: number;
  fluencyScore: number | null;
  formalScore: number | null;
  situationalScore: number | null;
  groupDiscussionScore: number | null;
}

export interface AptitudeAnalytics {
  overallScore: number | null;
  questionsAttempted: number;
  accuracy: number;
  quantScore: number | null;
  verbalScore: number | null;
  logicalScore: number | null;
}

export interface CodingLanguageAnalytics {
  language: string;
  problemsSolved: number;
  successRate: number;
}

export interface CodingAnalytics {
  overallScore: number | null;
  problemsAttempted: number;
  problemsSolved: number;
  successRate: number;
  languages: CodingLanguageAnalytics[];
}

export interface TechnicalAnalytics {
  overallScore: number | null;
  completedActivities: number;
  cScore: number | null;
  cppScore: number | null;
  javaScore: number | null;
  pythonScore: number | null;
  csCoreScore: number | null;
}

export interface AssessmentAnalytics {
  overallScore: number | null;
  totalCompleted: number;
  highestScore: number | null;
  averageScore: number | null;
}

export interface InterviewAnalytics {
  overallScore: number | null;
  interviewsCompleted: number;
}

export interface ResumeAnalytics {
  overallScore: number | null;
  screeningAttempts: number;
  improvementSessions: number;
  acceptedImprovements: number;
}
