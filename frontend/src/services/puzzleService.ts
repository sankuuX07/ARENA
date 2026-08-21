import { ApiService } from './api';

export interface PuzzleConstraint {
  value: string;
}

export interface PuzzleExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface PuzzleProblem {
  problemId: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  description: string;
  constraints: PuzzleConstraint[];
  inputFormat: string;
  outputFormat: string;
  examples: PuzzleExample[];
  supportedLanguages: string[];
  status: string;
  sourceType: string;
  tags?: string[];
  expectedComplexity?: Record<string, string>;
  functionSignature?: Record<string, string>;
}

export interface ProblemGenerationRequest {
  category: string;
  difficulty: string;
  problemType: string;
  language: string;
  topic?: string;
}

export interface PuzzleSubmissionRequest {
  uid: string;
  problemId: string;
  language: string;
  code: string;
}

export interface PuzzleSubmissionResponse {
  submissionId: string;
  uid: string;
  problemId: string;
  language: string;
  code: string;
  status: string;
  createdAt: string;
}

export interface CodingSubmissionRequest {
  problemId: string;
  language: string;
  code: string;
}

export interface CodingSubmissionResponse {
  submissionId: string;
  problemId: string;
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'compile_error' | 'runtime_error' | 'time_limit' | 'memory_limit' | 'system_error';
  language: string;
  passedTests: number;
  totalTests: number;
  score: number;
  executionTimeMs: number;
  memoryUsage: string;
  submittedAt: string;
  isFirstSolve: boolean;
  errorMessage?: string;
}

export interface PuzzleProgress {
  uid: string;
  problemsAttempted: number;
  problemsSolved: number;
  accuracy: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export const getPuzzleProblems = async (): Promise<PuzzleProblem[]> => {
  return await ApiService.get<PuzzleProblem[]>('/puzzles/problems');
};

export const getPuzzleProblem = async (problemId: string): Promise<PuzzleProblem> => {
  return await ApiService.get<PuzzleProblem>(`/puzzles/problems/${problemId}`);
};

export const submitPuzzleSolution = async (request: PuzzleSubmissionRequest): Promise<PuzzleSubmissionResponse> => {
  return await ApiService.post<PuzzleSubmissionResponse>('/puzzles/submissions', request);
};

export const getPuzzleProgress = async (uid: string): Promise<PuzzleProgress> => {
  return await ApiService.get<PuzzleProgress>(`/puzzles/progress/${uid}`);
};

export const generatePuzzleProblem = async (request: ProblemGenerationRequest): Promise<PuzzleProblem> => {
  return await ApiService.post<PuzzleProblem>('/puzzles/generate', request);
};

export const submitCodingSolution = async (request: CodingSubmissionRequest): Promise<CodingSubmissionResponse> => {
  return await ApiService.post<CodingSubmissionResponse>('/puzzles/submissions', request);
};

export const getSubmissionHistory = async (): Promise<CodingSubmissionResponse[]> => {
  return await ApiService.get<CodingSubmissionResponse[]>('/puzzles/submissions/history');
};
