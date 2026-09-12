import {
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { LeaderboardEntry, StudentRankSummary, ProgressSummary, UserProfile } from '../types';
import { memoizePromise } from '../utils/cache';

/**
 * Deterministic tie-breaking sorter for leaderboard entries
 * 1. Higher score
 * 2. Higher accuracy
 * 3. More problems solved
 * 4. Alphabetical display name
 */
export const sortLeaderboardEntries = (entries: LeaderboardEntry[]): LeaderboardEntry[] => {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.accuracy !== a.accuracy) {
      return b.accuracy - a.accuracy;
    }
    if (b.problemsSolved !== a.problemsSolved) {
      return b.problemsSolved - a.problemsSolved;
    }
    return (a.displayName || '').localeCompare(b.displayName || '');
  });
};

/**
 * Synchronize a student's public competitive ranking document in `leaderboard/{uid}`
 * derived from their Progress Tracking Engine summary.
 */
export const syncLeaderboardRecord = async (
  uid: string,
  profile: UserProfile | null,
  summary: ProgressSummary
): Promise<LeaderboardEntry> => {
  const displayName = profile?.fullName || 'Student';
  const profilePhotoUrl = profile?.profilePhotoUrl || '';
  const score = summary.totalScore || 0;
  const accuracy = summary.accuracy || 0;
  const problemsSolved = summary.totalSolved || 0;

  const payload: LeaderboardEntry = {
    uid,
    displayName,
    profilePhotoUrl,
    score,
    accuracy,
    problemsSolved,
    updatedAt: new Date().toISOString(),
  };

  if (!db) {
    const localStr = localStorage.getItem('arena_leaderboard_data');
    let localList: LeaderboardEntry[] = localStr ? JSON.parse(localStr) : [];
    const index = localList.findIndex((item) => item.uid === uid);
    if (index >= 0) {
      localList[index] = payload;
    } else {
      localList.push(payload);
    }
    localStorage.setItem('arena_leaderboard_data', JSON.stringify(localList));
    return payload;
  }

  try {
    const lbRef = doc(db, 'leaderboard', uid);
    await setDoc(
      lbRef,
      {
        uid,
        displayName,
        profilePhotoUrl,
        score,
        accuracy,
        problemsSolved,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return payload;
  } catch (error) {
    console.error('[RankingService] Error syncing leaderboard record:', error);
    return payload;
  }
};

/**
 * Fetch public competitive leaderboard entries sorted deterministically with 1-based ranks
 */
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  return memoizePromise('leaderboard_data', async () => {
    if (!db) {
      const localStr = localStorage.getItem('arena_leaderboard_data');
      const localList: LeaderboardEntry[] = localStr ? JSON.parse(localStr) : [];
      const sorted = sortLeaderboardEntries(localList);
      return sorted.map((item, idx) => ({ ...item, rank: idx + 1 }));
    }

  try {
    const lbCol = collection(db, 'leaderboard');
    const snapshot = await getDocs(lbCol);

    const rawList: LeaderboardEntry[] = snapshot.docs.map((docSnap) => ({
      uid: docSnap.id,
      ...docSnap.data(),
    })) as LeaderboardEntry[];

    const sorted = sortLeaderboardEntries(rawList);
    return sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  } catch (error) {
    console.error('[RankingService] Error fetching leaderboard:', error);
    return [];
  }
  });
};

/**
 * Get current student's calculated rank and competitive summary
 */
export const getStudentRank = async (uid: string): Promise<StudentRankSummary> => {
  const leaderboard = await getLeaderboard();
  const studentIndex = leaderboard.findIndex((e) => e.uid === uid);

  if (studentIndex >= 0) {
    const studentEntry = leaderboard[studentIndex];
    const rankNum = studentIndex + 1;
    return {
      rank: rankNum,
      rankFormatted: `#${rankNum}`,
      totalStudents: leaderboard.length,
      score: studentEntry.score,
      accuracy: studentEntry.accuracy,
      problemsSolved: studentEntry.problemsSolved,
    };
  }

  return {
    rank: null,
    rankFormatted: '#--',
    totalStudents: leaderboard.length,
    score: 0,
    accuracy: 0,
    problemsSolved: 0,
  };
};
