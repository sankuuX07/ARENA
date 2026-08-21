export interface HealthCheckResponse {
  status: string;
  service: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: 'student';
  phone?: string;
  profilePhotoUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: string;
  bio?: string;
  skills?: string[];
  programmingLanguages?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface RegisterParams {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface AuthState {
  currentUser: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

/* ==========================================================
   PROGRESS TRACKING ENGINE TYPES
   ========================================================== */

export type ProgressModuleId =
  | 'communication'
  | 'aptitude'
  | 'puzzles'
  | 'technical'
  | 'assessments'
  | 'mock-interview'
  | 'resume';

export type ActivityType =
  | 'question'
  | 'quiz'
  | 'speaking_session'
  | 'formal_communication_session'
  | 'situational_communication_session'
  | 'group_discussion_session'
  | 'aptitude_session'
  | 'quantitative_session'
  | 'coding_problem'
  | 'assessment'
  | 'interview_session'
  | 'resume_scan';

export type ActivityStatus = 'started' | 'in-progress' | 'completed' | 'abandoned';

export interface ActivityRecordInput {
  activityId?: string;
  module: ProgressModuleId;
  activityType: ActivityType;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status: ActivityStatus;
  isCorrect?: boolean;
  score?: number;
  timeSpent?: number;
}

export interface ActivityRecord extends ActivityRecordInput {
  activityId: string;
  timestamp: any;
}

export interface SingleModuleProgress {
  attempted: number;
  completed: number;
  solved: number;
  correct: number;
  incorrect: number;
  score: number;
  accuracy: number;
  progressPercentage: number;
}

export interface ProgressSummary {
  totalActivities: number;
  totalAttempted: number;
  totalCompleted: number;
  totalSolved: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalScore: number;
  accuracy: number;
  overallProgress: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  moduleProgress: Record<ProgressModuleId, SingleModuleProgress>;
  updatedAt?: any;
}

/* ==========================================================
   RANKING & LEADERBOARD ENGINE TYPES
   ========================================================== */

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  profilePhotoUrl?: string;
  score: number;
  accuracy: number;
  problemsSolved: number;
  rank?: number;
  updatedAt?: any;
}

export interface StudentRankSummary {
  rank: number | null;
  rankFormatted: string;
  totalStudents: number;
  score: number;
  accuracy: number;
  problemsSolved: number;
}
