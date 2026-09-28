import { UserProfile } from '../types';
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
export declare const calculateProfileCompletion: (profile: UserProfile | null) => ProfileCompletionData;
/**
 * Generate time-of-day greeting
 */
export declare const getTimeOfDayGreeting: () => string;
/**
 * Fetch real Progress Engine summary and recent activities for the Student Dashboard
 */
export declare const getDashboardSummary: (profile: UserProfile | null) => unknown;
//# sourceMappingURL=dashboardService.d.ts.map