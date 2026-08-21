export type CompetitionType = 'coding' | 'aptitude' | 'technical' | 'mixed';
export type CompetitionStatus = 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled';
export type CompetitionDifficulty = 'easy' | 'medium' | 'hard';
export type ParticipantStatus = 'registered' | 'in_progress' | 'submitted' | 'completed' | 'disqualified';

export interface CompetitionRules {
  scoringMethod: string;
  allowRetries: boolean;
  leaderboardVisibility: string;
  resultVisibility: string;
}

export interface CompetitionChallenge {
  challengeId: string;
  competitionId: string;
  sourceType: string;
  sourceId: string;
  title: string;
  difficulty: CompetitionDifficulty;
  order: number;
  points: number;
  timeLimit?: number;
}

export interface Competition {
  competitionId: string;
  title: string;
  description: string;
  type: CompetitionType;
  difficulty: CompetitionDifficulty;
  status: CompetitionStatus;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  maxParticipants: number;
  participantCount: number;
  rules: CompetitionRules;
  challenges: CompetitionChallenge[];
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionSession {
  sessionId: string;
  competitionId: string;
  userId: string;
  startedAt: string;
  lastActivityAt: string;
  expiresAt: string;
  status: string;
  answers: Record<string, any>;
}

export interface CompetitionResult {
  competitionId: string;
  userId: string;
  score: number;
  rank?: number;
  challengesCompleted: number;
  timeUsedSeconds: number;
  performanceSummary: string;
}

export interface CompetitionLeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  challengesCompleted: number;
  timeUsedSeconds: number;
  status: ParticipantStatus;
  rank?: number;
}

export interface CompetitionLeaderboardResponse {
  competitionId: string;
  entries: CompetitionLeaderboardEntry[];
  lastUpdated: string;
}

export interface CompetitionHistoryItem {
  competitionId: string;
  title: string;
  type: CompetitionType;
  score: number;
  rank?: number;
  status: ParticipantStatus;
  dateCompleted: string;
}
