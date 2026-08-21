export type RecommendationType = 
  | 'next_action'
  | 'practice'
  | 'improvement'
  | 'strength_maintenance'
  | 'coverage'
  | 'resume'
  | 'interview'
  | 'assessment';

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationConfidence = 'high' | 'medium' | 'low';
export type RecommendationStatus = 'active' | 'completed' | 'dismissed' | 'expired';

export interface StudentRecommendation {
  recommendationId: string;
  userId: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  confidence: RecommendationConfidence;
  title: string;
  description: string;
  reasonSummary: string;
  targetCategory: string;
  actionLabel: string;
  actionRoute: string;
  status: RecommendationStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  fingerprint: string;
}

export interface RecommendationOverview {
  nextBestAction: StudentRecommendation | null;
  activeRecommendations: StudentRecommendation[];
  lastRefreshed: string;
}

export interface RecommendationHistoryItem {
  recommendation: StudentRecommendation;
  resolvedAt: string;
  resolutionType: 'completed' | 'dismissed' | 'expired';
}
