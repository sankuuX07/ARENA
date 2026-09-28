import { ProgressModuleId, ActivityRecordInput, ActivityRecord, SingleModuleProgress, ProgressSummary } from '../types';
export declare const createEmptyProgressSummary: () => ProgressSummary;
/**
 * Calculate accuracy percentage (0-100) handling division-by-zero
 */
export declare const calculateAccuracy: (correct: number, attempted: number) => number;
/**
 * Calculate progress percentage (0-100)
 */
export declare const calculateProgressPercentage: (completed: number, target?: number) => number;
/**
 * Calculate overall progress across all modules
 */
export declare const calculateOverallProgress: (moduleMap: Record<ProgressModuleId, SingleModuleProgress>) => number;
/**
 * Calculate streak update based on last activity date (YYYY-MM-DD)
 */
export declare const calculateStreakUpdate: (lastDateStr: string | null, currentStreak: number, longestStreak: number) => {
    newCurrentStreak: number;
    newLongestStreak: number;
    todayStr: string;
};
/**
 * Fetch a student's Progress Summary document from Firestore
 */
export declare const getProgressSummary: (uid: string) => Promise<ProgressSummary>;
/**
 * Fetch recent student activity history from Firestore
 */
export declare const getRecentActivities: (uid: string, limitCount?: number) => Promise<ActivityRecord[]>;
/**
 * Record a new student learning activity and update summary atomically
 */
export declare const recordStudentActivity: (uid: string, input: ActivityRecordInput) => Promise<ProgressSummary>;
//# sourceMappingURL=progressService.d.ts.map