export type InterviewEvaluationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type InterviewPerformanceLevel = 
  | 'excellent' 
  | 'strong' 
  | 'good' 
  | 'needs_improvement' 
  | 'needs_significant_improvement';

export interface InterviewQuestionEvaluation {
  questionId: string;
  question: string;
  studentAnswer: string;
  score?: number | null;
  strengths: string[];
  improvementAreas: string[];
  feedback: string;
  followUpContext?: string | null;
}

export interface InterviewPracticeArea {
  area: string;
  reason: string;
}

export interface InterviewEvaluation {
  resultId: string;
  sessionId: string;
  userId: string;
  status: InterviewEvaluationStatus;
  mode: string;
  topic?: string | null;
  overallScore?: number | null;
  maxScore: number;
  performanceLevel?: InterviewPerformanceLevel | null;
  
  communicationScore?: number | null;
  technicalScore?: number | null;
  relevanceScore?: number | null;
  clarityScore?: number | null;
  structureScore?: number | null;
  
  strengths: string[];
  improvementAreas: string[];
  questionEvaluations: InterviewQuestionEvaluation[];
  summary?: string | null;
  practiceAreas: InterviewPracticeArea[];
  createdAt: string;
}

export interface InterviewHistoryItem {
  resultId: string;
  sessionId: string;
  mode: string;
  topic?: string | null;
  status: InterviewEvaluationStatus;
  overallScore?: number | null;
  performanceLevel?: InterviewPerformanceLevel | null;
  createdAt: string;
}
