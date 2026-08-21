import { ApiService } from './api';

export type AssessmentCategory = 'aptitude' | 'technical' | 'coding' | 'communication' | 'mixed' | 'placement';
export type AssessmentDifficulty = 'easy' | 'medium' | 'hard';
export type AssessmentStatus = 'draft' | 'published' | 'archived';
export type AssessmentSessionStatus = 'not_started' | 'in_progress' | 'submitted' | 'expired' | 'abandoned' | 'evaluated';
export type AssessmentQuestionSource = 'static' | 'ai_generated' | 'module' | 'mixed';
export type AssessmentQuestionType = 'mcq' | 'coding' | 'communication';
export type AssessmentAnswerState = 'unanswered' | 'answered' | 'marked_for_review';

export interface AssessmentSection {
  sectionId: string;
  title: string;
  type: AssessmentCategory;
  source: string;
  questionCount: number;
  marks: number;
  negativeMarks: number;
  order: number;
  required: boolean;
}

export interface AssessmentConfig {
  durationMinutes: number;
  questionCount: number;
  passingScore: number;
  negativeMarking: boolean;
  allowBackNavigation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  sections?: AssessmentSection[];
}

export interface Assessment {
  assessmentId: string;
  title: string;
  description: string;
  category: AssessmentCategory;
  difficulty: AssessmentDifficulty;
  durationMinutes: number;
  questionCount: number;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
  config: AssessmentConfig;
}

export interface AssessmentQuestionReference {
  assessmentQuestionId: string;
  assessmentId: string;
  sectionId?: string;
  questionId: string;
  type: AssessmentQuestionType;
  source: AssessmentQuestionSource;
  order: number;
  marks: number;
  negativeMarks: number;
  questionText?: string;
  options?: string[];
  codeSnippet?: string;
  metadata?: any;
}

export interface QuestionResult {
  questionId: string;
  sectionId?: string;
  isCorrect: boolean;
  marksAwarded: number;
  studentAnswer?: string;
  correctAnswer?: string;
  explanation?: string;
}

export interface TopicResult {
  topic: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface SectionResult {
  sectionId: string;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracy: number;
}

export interface AssessmentResult {
  resultId: string;
  sessionId: string;
  assessmentId: string;
  userId: string;
  status: string;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  timeUsedSeconds: number;
  totalTimeSeconds: number;
  passed: boolean;
  completedAt: string;
  sections: SectionResult[];
  topics: TopicResult[];
  strengths: string[];
  improvementAreas: string[];
  performanceClassification: string;
  questionResults?: QuestionResult[];
}

export interface AssessmentAnswer {
  sessionId: string;
  questionId: string;
  selectedOption: number | null;
  textResponse?: string;
  state: AssessmentAnswerState;
  answeredAt?: string;
}

export interface AssessmentSession {
  sessionId: string;
  assessmentId: string;
  userId: string;
  status: AssessmentSessionStatus;
  currentQuestionIndex: number;
  startedAt?: string;
  submittedAt?: string;
  expiresAt?: string;
  metadata?: any;
  answers: AssessmentAnswer[];
  questions: AssessmentQuestionReference[];
}

export interface AssessmentStatusResponse {
  status: AssessmentSessionStatus;
  startedAt?: string;
  expiresAt?: string;
  serverTime: string;
}

export const getAssessments = async (): Promise<Assessment[]> => {
  return await ApiService.get<Assessment[]>('/assessments');
};

export const getAssessment = async (assessmentId: string): Promise<Assessment> => {
  return await ApiService.get<Assessment>(`/assessments/${assessmentId}`);
};

export const startAssessmentSession = async (assessmentId: string): Promise<AssessmentSession> => {
  return await ApiService.post<AssessmentSession>(`/assessments/${assessmentId}/sessions`, {});
};

export const getAssessmentSession = async (sessionId: string): Promise<AssessmentSession> => {
  return await ApiService.get<AssessmentSession>(`/assessments/sessions/${sessionId}`);
};

export const saveAssessmentAnswer = async (
  sessionId: string,
  answer: Omit<AssessmentAnswer, 'sessionId'>
): Promise<AssessmentSession> => {
  return await ApiService.post<AssessmentSession>(`/assessments/sessions/${sessionId}/answers`, {
    sessionId,
    ...answer
  });
};

export const submitAssessment = async (sessionId: string): Promise<AssessmentSession> => {
  return await ApiService.post<AssessmentSession>(`/assessments/sessions/${sessionId}/submit`, {});
};

export const getAssessmentHistory = async (): Promise<AssessmentResult[]> => {
  return await ApiService.get<AssessmentResult[]>('/assessments/results/history');
};

export const getAssessmentResult = async (resultId: string): Promise<AssessmentResult> => {
  return await ApiService.get<AssessmentResult>(`/assessments/results/${resultId}`);
};

export const getAssessmentReview = async (resultId: string): Promise<QuestionResult[]> => {
  return await ApiService.get<QuestionResult[]>(`/assessments/results/${resultId}/review`);
};

export const getAssessmentSessionStatus = async (sessionId: string): Promise<AssessmentStatusResponse> => {
  return await ApiService.get<AssessmentStatusResponse>(`/assessments/sessions/${sessionId}/status`);
};
