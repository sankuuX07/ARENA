export type PlacementRoundType = 'aptitude' | 'technical' | 'coding' | 'communication' | 'interview';
export type PlacementRoundStatus = 'locked' | 'not_started' | 'in_progress' | 'completed' | 'passed' | 'failed' | 'skipped';
export type PlacementSessionStatus = 'not_started' | 'in_progress' | 'completed' | 'failed' | 'abandoned' | 'expired';

export interface PlacementRound {
  roundId: string;
  name: string;
  type: PlacementRoundType;
  order: number;
  durationMinutes: number;
  passingScore?: number;
  required: boolean;
  configuration: Record<string, any>;
}

export interface PlacementSimulation {
  simulationId: string;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  totalRounds: number;
  rounds: PlacementRound[];
  isActive: boolean;
}

export interface PlacementRoundSession {
  roundSessionId: string;
  placementSessionId: string;
  roundId: string;
  order: number;
  status: PlacementRoundStatus;
  moduleSessionId?: string;
  startedAt?: string;
  completedAt?: string;
  resultReference?: string;
  passed?: boolean;
  score?: number;
}

export interface PlacementSimulationSession {
  sessionId: string;
  simulationId: string;
  userId: string;
  status: PlacementSessionStatus;
  currentRoundOrder: number;
  startedAt?: string;
  updatedAt?: string;
  completedAt?: string;
  failedRoundId?: string;
  rounds: PlacementRoundSession[];
}

export interface PlacementSimulationSummary {
  sessionId: string;
  simulationId: string;
  simulationName: string;
  status: PlacementSessionStatus;
  startedAt: string;
  completedAt: string;
  rounds: PlacementRoundSession[];
}

export interface PlacementRoundCompleteRequest {
  resultReference: string;
}

export interface PlacementStartRoundResponse {
  roundSessionId: string;
  moduleSessionId: string;
  redirectUrl?: string;
}
