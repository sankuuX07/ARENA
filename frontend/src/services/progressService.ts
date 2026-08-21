import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ProgressModuleId,
  ActivityRecordInput,
  ActivityRecord,
  SingleModuleProgress,
  ProgressSummary,
} from '../types';
import { syncLeaderboardRecord } from './rankingService';
import { getStudentProfile } from './profileService';

const VALID_MODULES: ProgressModuleId[] = [
  'communication',
  'aptitude',
  'puzzles',
  'technical',
  'assessments',
  'mock-interview',
  'resume',
];

const DEFAULT_MODULE_TARGET = 50;

const createEmptyModuleProgress = (): SingleModuleProgress => ({
  attempted: 0,
  completed: 0,
  solved: 0,
  correct: 0,
  incorrect: 0,
  score: 0,
  accuracy: 0,
  progressPercentage: 0,
});

export const createEmptyProgressSummary = (): ProgressSummary => ({
  totalActivities: 0,
  totalAttempted: 0,
  totalCompleted: 0,
  totalSolved: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  totalScore: 0,
  accuracy: 0,
  overallProgress: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  moduleProgress: {
    communication: createEmptyModuleProgress(),
    aptitude: createEmptyModuleProgress(),
    puzzles: createEmptyModuleProgress(),
    technical: createEmptyModuleProgress(),
    assessments: createEmptyModuleProgress(),
    'mock-interview': createEmptyModuleProgress(),
    resume: createEmptyModuleProgress(),
  },
});

/**
 * Calculate accuracy percentage (0-100) handling division-by-zero
 */
export const calculateAccuracy = (correct: number, attempted: number): number => {
  if (attempted <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((correct / attempted) * 100)));
};

/**
 * Calculate progress percentage (0-100)
 */
export const calculateProgressPercentage = (completed: number, target: number = DEFAULT_MODULE_TARGET): number => {
  if (target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / target) * 100)));
};

/**
 * Calculate overall progress across all modules
 */
export const calculateOverallProgress = (moduleMap: Record<ProgressModuleId, SingleModuleProgress>): number => {
  const keys = Object.keys(moduleMap) as ProgressModuleId[];
  if (keys.length === 0) return 0;
  const total = keys.reduce((acc, k) => acc + (moduleMap[k]?.progressPercentage || 0), 0);
  return Math.round(total / keys.length);
};

/**
 * Calculate streak update based on last activity date (YYYY-MM-DD)
 */
export const calculateStreakUpdate = (
  lastDateStr: string | null,
  currentStreak: number,
  longestStreak: number
): { newCurrentStreak: number; newLongestStreak: number; todayStr: string } => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newCurrentStreak = currentStreak;

  if (!lastDateStr) {
    newCurrentStreak = 1;
  } else if (lastDateStr === todayStr) {
    newCurrentStreak = Math.max(1, currentStreak);
  } else if (lastDateStr === yesterdayStr) {
    newCurrentStreak = currentStreak + 1;
  } else {
    // Missed 1+ days, reset streak to 1 for today's activity
    newCurrentStreak = 1;
  }

  const newLongestStreak = Math.max(longestStreak, newCurrentStreak);

  return { newCurrentStreak, newLongestStreak, todayStr };
};

/**
 * Fetch a student's Progress Summary document from Firestore
 */
export const getProgressSummary = async (uid: string): Promise<ProgressSummary> => {
  if (!db) {
    const local = localStorage.getItem('arena_progress_summary_' + uid);
    if (local) return JSON.parse(local);
    return createEmptyProgressSummary();
  }

  try {
    const summaryRef = doc(db, 'users', uid, 'progress', 'summary');
    const snapshot = await getDoc(summaryRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const empty = createEmptyProgressSummary();
      return {
        ...empty,
        ...data,
        moduleProgress: {
          ...empty.moduleProgress,
          ...(data.moduleProgress || {}),
        },
      };
    }

    // Initialize default empty summary for new user
    const defaultSummary = createEmptyProgressSummary();
    await setDoc(summaryRef, { ...defaultSummary, updatedAt: serverTimestamp() });
    return defaultSummary;
  } catch (error) {
    console.error('[ProgressService] Error fetching progress summary:', error);
    return createEmptyProgressSummary();
  }
};

/**
 * Fetch recent student activity history from Firestore
 */
export const getRecentActivities = async (uid: string, limitCount: number = 10): Promise<ActivityRecord[]> => {
  if (!db) {
    const local = localStorage.getItem('arena_progress_activities_' + uid);
    if (local) return JSON.parse(local);
    return [];
  }

  try {
    const activitiesRef = collection(db, 'users', uid, 'progress', 'activity', 'items');
    const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      activityId: docSnap.id,
      ...docSnap.data(),
    })) as ActivityRecord[];
  } catch (error) {
    console.error('[ProgressService] Error fetching recent activities:', error);
    return [];
  }
};

/**
 * Record a new student learning activity and update summary atomically
 */
export const recordStudentActivity = async (
  uid: string,
  input: ActivityRecordInput
): Promise<ProgressSummary> => {
  // 1. Data Validation
  if (!VALID_MODULES.includes(input.module)) {
    throw new Error(`Invalid progress module: '${input.module}'`);
  }
  if (input.score !== undefined && input.score < 0) {
    throw new Error('Score cannot be negative.');
  }
  if (input.timeSpent !== undefined && input.timeSpent < 0) {
    throw new Error('Time spent cannot be negative.');
  }

  const activityId = input.activityId || `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const score = input.score || 0;
  const timeSpent = input.timeSpent || 0;
  const isCompleted = input.status === 'completed';
  const isSolved = isCompleted && input.isCorrect === true;
  const isCorrect = input.isCorrect === true;
  const isAttempted = input.status === 'completed' || input.status === 'in-progress';

  // Demo / Offline fallback mode
  if (!db) {
    const currentSummary = await getProgressSummary(uid);
    const existingActivitiesStr = localStorage.getItem(`arena_progress_activities_${uid}`);
    const existingActivities: ActivityRecord[] = existingActivitiesStr ? JSON.parse(existingActivitiesStr) : [];

    // Idempotency check
    if (existingActivities.some((a) => a.activityId === activityId)) {
      return currentSummary;
    }

    const { newCurrentStreak, newLongestStreak, todayStr } = calculateStreakUpdate(
      currentSummary.lastActivityDate,
      currentSummary.currentStreak,
      currentSummary.longestStreak
    );

    const modKey = input.module;
    const prevMod = currentSummary.moduleProgress[modKey] || createEmptyModuleProgress();
    const modAttempted = prevMod.attempted + (isAttempted ? 1 : 0);
    const modCompleted = prevMod.completed + (isCompleted ? 1 : 0);
    const modSolved = prevMod.solved + (isSolved ? 1 : 0);
    const modCorrect = prevMod.correct + (isCorrect ? 1 : 0);
    const modIncorrect = prevMod.incorrect + (isCompleted && !isCorrect ? 1 : 0);
    const modScore = prevMod.score + score;
    const modAccuracy = calculateAccuracy(modCorrect, modAttempted);
    const modProgressPercentage = calculateProgressPercentage(modCompleted);

    const updatedModuleMap = {
      ...currentSummary.moduleProgress,
      [modKey]: {
        attempted: modAttempted,
        completed: modCompleted,
        solved: modSolved,
        correct: modCorrect,
        incorrect: modIncorrect,
        score: modScore,
        accuracy: modAccuracy,
        progressPercentage: modProgressPercentage,
      },
    };

    const newTotalAttempted = currentSummary.totalAttempted + (isAttempted ? 1 : 0);
    const newTotalCompleted = currentSummary.totalCompleted + (isCompleted ? 1 : 0);
    const newTotalSolved = currentSummary.totalSolved + (isSolved ? 1 : 0);
    const newTotalCorrect = currentSummary.totalCorrect + (isCorrect ? 1 : 0);
    const newTotalIncorrect = currentSummary.totalIncorrect + (isCompleted && !isCorrect ? 1 : 0);
    const newTotalScore = currentSummary.totalScore + score;
    const newOverallAccuracy = calculateAccuracy(newTotalCorrect, newTotalAttempted);
    const newOverallProgress = calculateOverallProgress(updatedModuleMap);

    const updatedSummary: ProgressSummary = {
      totalActivities: currentSummary.totalActivities + 1,
      totalAttempted: newTotalAttempted,
      totalCompleted: newTotalCompleted,
      totalSolved: newTotalSolved,
      totalCorrect: newTotalCorrect,
      totalIncorrect: newTotalIncorrect,
      totalScore: newTotalScore,
      accuracy: newOverallAccuracy,
      overallProgress: newOverallProgress,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: todayStr,
      moduleProgress: updatedModuleMap,
      updatedAt: new Date().toISOString(),
    };

    const newRecord: ActivityRecord = {
      ...input,
      activityId,
      score,
      timeSpent,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('arena_progress_summary_' + uid, JSON.stringify(updatedSummary));
    localStorage.setItem(
      'arena_progress_activities_' + uid,
      JSON.stringify([newRecord, ...existingActivities].slice(0, 50))
    );

    // Sync leaderboard record
    try {
      const profile = await getStudentProfile(uid);
      await syncLeaderboardRecord(uid, profile, updatedSummary);
    } catch (e) {
      // Ignore profile sync errors
    }

    return updatedSummary;
  }

  // 2. Atomic Transaction Execution in Firestore
  try {
    const resultSummary = await runTransaction(db!, async (transaction) => {
      const summaryRef = doc(db!, 'users', uid, 'progress', 'summary');
      const activityRef = doc(db!, 'users', uid, 'progress', 'activity', 'items', activityId);

      // Idempotency check: verify if activity already exists
      const activitySnap = await transaction.get(activityRef);
      const summarySnap = await transaction.get(summaryRef);

      const existingSummary = summarySnap.exists() ? summarySnap.data() : createEmptyProgressSummary();
      const empty = createEmptyProgressSummary();
      const summaryData: ProgressSummary = {
        ...empty,
        ...existingSummary,
        moduleProgress: {
          ...empty.moduleProgress,
          ...(existingSummary.moduleProgress || {}),
        },
      };

      if (activitySnap.exists()) {
        // Already processed, return summary without double counting
        return summaryData;
      }

      // Calculations
      const { newCurrentStreak, newLongestStreak, todayStr } = calculateStreakUpdate(
        summaryData.lastActivityDate,
        summaryData.currentStreak,
        summaryData.longestStreak
      );

      const modKey = input.module;
      const prevMod = summaryData.moduleProgress[modKey] || createEmptyModuleProgress();
      const modAttempted = prevMod.attempted + (isAttempted ? 1 : 0);
      const modCompleted = prevMod.completed + (isCompleted ? 1 : 0);
      const modSolved = prevMod.solved + (isSolved ? 1 : 0);
      const modCorrect = prevMod.correct + (isCorrect ? 1 : 0);
      const modIncorrect = prevMod.incorrect + (isCompleted && !isCorrect ? 1 : 0);
      const modScore = prevMod.score + score;
      const modAccuracy = calculateAccuracy(modCorrect, modAttempted);
      const modProgressPercentage = calculateProgressPercentage(modCompleted);

      const updatedModuleMap = {
        ...summaryData.moduleProgress,
        [modKey]: {
          attempted: modAttempted,
          completed: modCompleted,
          solved: modSolved,
          correct: modCorrect,
          incorrect: modIncorrect,
          score: modScore,
          accuracy: modAccuracy,
          progressPercentage: modProgressPercentage,
        },
      };

      const newTotalAttempted = summaryData.totalAttempted + (isAttempted ? 1 : 0);
      const newTotalCompleted = summaryData.totalCompleted + (isCompleted ? 1 : 0);
      const newTotalSolved = summaryData.totalSolved + (isSolved ? 1 : 0);
      const newTotalCorrect = summaryData.totalCorrect + (isCorrect ? 1 : 0);
      const newTotalIncorrect = summaryData.totalIncorrect + (isCompleted && !isCorrect ? 1 : 0);
      const newTotalScore = summaryData.totalScore + score;
      const newOverallAccuracy = calculateAccuracy(newTotalCorrect, newTotalAttempted);
      const newOverallProgress = calculateOverallProgress(updatedModuleMap);

      const updatedSummaryPayload = {
        totalActivities: summaryData.totalActivities + 1,
        totalAttempted: newTotalAttempted,
        totalCompleted: newTotalCompleted,
        totalSolved: newTotalSolved,
        totalCorrect: newTotalCorrect,
        totalIncorrect: newTotalIncorrect,
        totalScore: newTotalScore,
        accuracy: newOverallAccuracy,
        overallProgress: newOverallProgress,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: todayStr,
        moduleProgress: updatedModuleMap,
        updatedAt: serverTimestamp(),
      };

      const newActivityPayload = {
        activityId,
        module: input.module,
        activityType: input.activityType,
        topic: input.topic || '',
        difficulty: input.difficulty || 'medium',
        status: input.status,
        isCorrect: Boolean(input.isCorrect),
        score,
        timeSpent,
        timestamp: serverTimestamp(),
      };

      // Atomic Writes
      transaction.set(summaryRef, updatedSummaryPayload, { merge: true });
      transaction.set(activityRef, newActivityPayload);

      return {
        ...updatedSummaryPayload,
        updatedAt: new Date().toISOString(),
      } as ProgressSummary;
    });

    // Sync leaderboard entry after transaction completion
    try {
      const profile = await getStudentProfile(uid);
      await syncLeaderboardRecord(uid, profile, resultSummary);
    } catch (e) {
      // Ignore background sync errors
    }

    return resultSummary;
  } catch (error) {
    console.error('[ProgressService] Transaction failed:', error);
    throw new Error('Unable to record activity. Please try again.');
  }
};
