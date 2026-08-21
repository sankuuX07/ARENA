import { recordStudentActivity, getProgressSummary } from '../services/progressService';
import { ProgressModuleId, ActivityType } from '../types';

export interface TestActivityOptions {
  module?: ProgressModuleId;
  activityType?: ActivityType;
  topic?: string;
  isCorrect?: boolean;
  score?: number;
  timeSpent?: number;
}

/**
 * Development test helper to record a sample activity and verify Progress Engine calculations
 */
export const recordSampleTestActivity = async (
  uid: string,
  options: TestActivityOptions = {}
) => {
  const sampleInput = {
    module: options.module || 'aptitude',
    activityType: options.activityType || 'question',
    topic: options.topic || 'Quantitative Math',
    difficulty: 'medium' as const,
    status: 'completed' as const,
    isCorrect: options.isCorrect !== undefined ? options.isCorrect : true,
    score: options.score !== undefined ? options.score : 10,
    timeSpent: options.timeSpent !== undefined ? options.timeSpent : 45,
  };

  console.log('[TestProgressHelper] Recording test activity for user:', uid, sampleInput);
  const updatedSummary = await recordStudentActivity(uid, sampleInput);
  console.log('[TestProgressHelper] Progress Engine summary updated:', updatedSummary);
  return updatedSummary;
};

// Attach helper to window in development mode for easy manual console testing
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__ARENA_TEST_PROGRESS__ = {
    recordSampleTestActivity,
    getProgressSummary,
  };
}
