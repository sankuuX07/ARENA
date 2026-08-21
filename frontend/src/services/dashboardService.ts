import { UserProfile, ProgressSummary, ActivityRecord } from '../types';
import { getProgressSummary, getRecentActivities } from './progressService';
import { getStudentRank } from './rankingService';

export interface DashboardStats {
  overallScore: number;
  maxScore: number;
  currentRank: string;
  rankCohort: string;
  problemsSolved: number;
  problemsTarget: number;
  streakDays: number;
  accuracy: number;
}

export interface ModuleProgressItem {
  id: string;
  name: string;
  progressPercentage: number;
  status: 'In Progress' | 'Not Started' | 'Completed';
  path: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  category: string;
  path: string;
  iconName: string;
  description: string;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  category: string;
  timeAgo: string;
  scoreBadge?: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  path: string;
  description: string;
}

export interface ProfileCompletionData {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
}

/**
 * Calculate student profile completion percentage based on Milestone 4 fields
 */
export const calculateProfileCompletion = (profile: UserProfile | null): ProfileCompletionData => {
  if (!profile) {
    return {
      percentage: 20,
      missingFields: ['Full Name', 'Phone', 'College', 'Skills', 'Bio'],
      isComplete: false,
    };
  }

  const fieldsToTrack: { name: string; isFilled: boolean }[] = [
    { name: 'Full Name', isFilled: Boolean(profile.fullName?.trim()) },
    { name: 'Email', isFilled: Boolean(profile.email?.trim()) },
    { name: 'Phone Number', isFilled: Boolean(profile.phone?.trim()) },
    { name: 'College / University', isFilled: Boolean(profile.college?.trim()) },
    { name: 'Degree & Branch', isFilled: Boolean(profile.degree?.trim() || profile.branch?.trim()) },
    { name: 'Graduation Year', isFilled: Boolean(profile.graduationYear?.trim()) },
    { name: 'Technical Skills', isFilled: Boolean(profile.skills && profile.skills.length > 0) },
    { name: 'Programming Languages', isFilled: Boolean(profile.programmingLanguages && profile.programmingLanguages.length > 0) },
    { name: 'Biography', isFilled: Boolean(profile.bio?.trim()) },
    { name: 'Profile Photo', isFilled: Boolean(profile.profilePhotoUrl?.trim()) },
  ];

  const filledCount = fieldsToTrack.filter((f) => f.isFilled).length;
  const percentage = Math.round((filledCount / fieldsToTrack.length) * 100);
  const missingFields = fieldsToTrack.filter((f) => !f.isFilled).map((f) => f.name);

  return {
    percentage,
    missingFields,
    isComplete: percentage === 100,
  };
};

/**
 * Generate time-of-day greeting
 */
export const getTimeOfDayGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Capitalize module name for display
 */
const formatModuleName = (id: string): string => {
  switch (id) {
    case 'communication':
      return 'Communication';
    case 'aptitude':
      return 'Aptitude';
    case 'puzzles':
      return 'Puzzles';
    case 'technical':
      return 'Technical';
    case 'assessments':
      return 'Assessments';
    case 'mock-interview':
      return 'Mock Interview';
    case 'resume':
      return 'Resume';
    default:
      return id;
  }
};

const getModulePath = (id: string): string => {
  switch (id) {
    case 'communication':
      return '/communication';
    case 'aptitude':
      return '/aptitude';
    case 'puzzles':
      return '/puzzles';
    case 'technical':
      return '/technical';
    case 'assessments':
      return '/assessments';
    case 'mock-interview':
      return '/mock-interview';
    case 'resume':
      return '/resume';
    default:
      return '/dashboard';
  }
};

/**
 * Fetch real Progress Engine summary and recent activities for the Student Dashboard
 */
export const getDashboardSummary = async (profile: UserProfile | null) => {
  const uid = profile?.uid || 'guest';

  // Fetch real Firestore Progress Summary & Recent Activity list
  const progressSummary: ProgressSummary = await getProgressSummary(uid);
  const rawActivities: ActivityRecord[] = await getRecentActivities(uid, 5);
  const rankSummary = await getStudentRank(uid);

  const stats: DashboardStats = {
    overallScore: progressSummary.totalScore,
    maxScore: 1000,
    currentRank: rankSummary.rankFormatted,
    rankCohort: profile?.branch ? `${profile.branch} Batch` : 'CS Cohort',
    problemsSolved: progressSummary.totalSolved,
    problemsTarget: 200,
    streakDays: progressSummary.currentStreak,
    accuracy: progressSummary.accuracy,
  };

  const moduleProgress: ModuleProgressItem[] = Object.keys(progressSummary.moduleProgress).map((key) => {
    const modData = progressSummary.moduleProgress[key as keyof typeof progressSummary.moduleProgress];
    const pct = modData?.progressPercentage || 0;
    let status: 'In Progress' | 'Not Started' | 'Completed' = 'Not Started';
    if (pct >= 100) status = 'Completed';
    else if (pct > 0 || (modData?.attempted || 0) > 0) status = 'In Progress';

    return {
      id: key,
      name: formatModuleName(key),
      progressPercentage: pct,
      status,
      path: getModulePath(key),
    };
  });

  const quickActions: QuickActionItem[] = [
    { id: 'aptitude', title: 'Practice Aptitude', category: 'Aptitude', path: '/aptitude', iconName: 'Brain', description: 'Quant & logical reasoning drills' },
    { id: 'puzzles', title: 'Solve a Problem', category: 'Puzzles', path: '/puzzles', iconName: 'Puzzle', description: 'Analytical riddles & challenges' },
    { id: 'communication', title: 'Practice Communication', category: 'Communication', path: '/communication', iconName: 'MessageSquare', description: 'Fluency & GD AI speech coaching' },
    { id: 'technical', title: 'Technical Practice', category: 'Technical', path: '/technical', iconName: 'Code2', description: 'Data structures & algorithms' },
    { id: 'assessments', title: 'Take Assessment', category: 'Assessments', path: '/assessments', iconName: 'ClipboardCheck', description: 'Timed company hiring tests' },
    { id: 'mock-interview', title: 'Mock Interview', category: 'Mock Interview', path: '/mock-interview', iconName: 'Video', description: 'AI video & voice interview simulator' },
  ];

  // Convert raw activities to UI activity list
  const recentActivities: RecentActivityItem[] = rawActivities.map((act) => ({
    id: act.activityId,
    title: `${act.status === 'completed' ? 'Completed' : 'Started'} ${formatModuleName(act.module)} ${act.topic ? `- ${act.topic}` : ''}`,
    category: formatModuleName(act.module),
    timeAgo: typeof act.timestamp === 'string' ? act.timestamp : 'Recently',
    scoreBadge: act.score ? `+${act.score} pts` : act.isCorrect ? 'Correct' : undefined,
  }));

  const recommendations: RecommendationItem[] = [
    { id: 'rec-1', title: 'Java — OOP Fundamentals & Collections', category: 'Technical', difficulty: 'Medium', path: '/technical', description: 'Master core object-oriented principles and memory management.' },
    { id: 'rec-2', title: 'Quantitative Aptitude — Speed Math & Percentages', category: 'Aptitude', difficulty: 'Easy', path: '/aptitude', description: 'Sharpen mental calculation shortcuts for campus placement rounds.' },
    { id: 'rec-3', title: 'Data Structures — Array & String Manipulation', category: 'Technical', difficulty: 'Medium', path: '/technical', description: 'Practice top interview coding patterns.' },
  ];

  return {
    stats,
    moduleProgress,
    quickActions,
    recentActivities,
    recommendations,
    progressSummary,
  };
};
