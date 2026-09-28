import { LeaderboardEntry, StudentRankSummary, ProgressSummary, UserProfile } from '../types';
/**
 * Deterministic tie-breaking sorter for leaderboard entries
 * 1. Higher score
 * 2. Higher accuracy
 * 3. More problems solved
 * 4. Alphabetical display name
 */
export declare const sortLeaderboardEntries: (entries: LeaderboardEntry[]) => LeaderboardEntry[];
/**
 * Synchronize a student's public competitive ranking document in `leaderboard/{uid}`
 * derived from their Progress Tracking Engine summary.
 */
export declare const syncLeaderboardRecord: (uid: string, profile: UserProfile | null, summary: ProgressSummary) => Promise<LeaderboardEntry>;
/**
 * Fetch public competitive leaderboard entries sorted deterministically with 1-based ranks
 */
export declare const getLeaderboard: () => Promise<LeaderboardEntry[]>;
/**
 * Get current student's calculated rank and competitive summary
 */
export declare const getStudentRank: (uid: string) => Promise<StudentRankSummary>;
//# sourceMappingURL=rankingService.d.ts.map