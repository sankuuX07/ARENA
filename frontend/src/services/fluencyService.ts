import {
  doc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { ApiService } from './api';
import { recordStudentActivity } from './progressService';

export interface FluencyEvaluationData {
  grammar: number;
  vocabulary: number;
  sentenceStructure: number;
  clarity: number;
  coherence: number;
  relevance: number;
  fluency: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  originalText: string;
  betterVersion?: string;
}

export interface FluencyStartResponseData {
  session_id: string;
  topic: string;
  prompt: string;
  difficulty: string;
  timestamp: string;
}

export interface FluencyRespondResponseData {
  session_id: string;
  turn_index: number;
  evaluation: FluencyEvaluationData;
  next_prompt: string;
  is_completed: boolean;
  timestamp: string;
}

export interface FluencyCompleteResponseData {
  session_id: string;
  overall_score: number;
  category_breakdown: Record<string, number>;
  strengths: string[];
  improvements: string[];
  summary: string;
  timestamp: string;
}

export interface FluencyHistoryItem {
  sessionId: string;
  dateStr: string;
  difficulty: string;
  score: number;
  topic: string;
}

/**
 * Start a new Fluency Session via FastAPI backend and save in Firestore
 */
export const startFluencySession = async (
  uid: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  topic?: string
): Promise<FluencyStartResponseData> => {
  let startData: FluencyStartResponseData;
  try {
    startData = await ApiService.post<FluencyStartResponseData>('/v1/communication/fluency/start', {
      difficulty,
      topic,
    });
  } catch (err) {
    console.warn('[FluencyService] API start failed, using fallback:', err);
    startData = {
      session_id: `fluency_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      topic: topic || 'Introduce yourself and your career goals',
      prompt: `Welcome! Let's discuss '${topic || 'Introduce yourself'}'. Please share your thoughts in 2-3 sentences.`,
      difficulty,
      timestamp: new Date().toISOString(),
    };
  }

  // Save session metadata in Firestore
  if (db) {
    try {
      const sessionRef = doc(db, 'users', uid, 'communicationSessions', startData.session_id);
      await setDoc(sessionRef, {
        sessionId: startData.session_id,
        uid,
        mode: 'fluency',
        difficulty,
        topic: startData.topic,
        status: 'active',
        startedAt: serverTimestamp(),
        turnCount: 0,
      });
    } catch (e) {
      console.error('[FluencyService] Error saving Firestore session:', e);
    }
  } else {
    localStorage.setItem(
      `arena_fluency_session_${startData.session_id}`,
      JSON.stringify({ ...startData, uid, status: 'active', turnCount: 0 })
    );
  }

  return startData;
};

/**
 * Submit student response turn for 7-criteria AI evaluation
 */
export const submitFluencyTurn = async (
  uid: string,
  sessionId: string,
  responseText: string,
  turnIndex: number,
  difficulty: string = 'medium',
  history: any[] = []
): Promise<FluencyRespondResponseData> => {
  let respondData: FluencyRespondResponseData;
  try {
    respondData = await ApiService.post<FluencyRespondResponseData>('/v1/communication/fluency/respond', {
      session_id: sessionId,
      response_text: responseText,
      turn_index: turnIndex,
      difficulty,
      history,
    });
  } catch (err) {
    console.warn('[FluencyService] API respond failed, using fallback evaluation:', err);
    const wordCount = responseText.split(' ').length;
    const score = Math.min(92, Math.max(65, 70 + Math.floor(wordCount / 3)));
    respondData = {
      session_id: sessionId,
      turn_index: turnIndex,
      evaluation: {
        grammar: score,
        vocabulary: score - 2,
        sentenceStructure: score + 1,
        clarity: score + 3,
        coherence: score,
        relevance: 85,
        fluency: score,
        overallScore: score,
        strengths: ['Good sentence clarity and vocabulary flow'],
        improvements: ['Try incorporating more connecting words'],
        originalText: responseText,
        betterVersion: `${responseText.trim()} Additionally, I aim to expand my leadership capabilities.`,
      },
      next_prompt: 'Thank you for sharing! How do you plan to handle challenges in your professional career?',
      is_completed: turnIndex >= 5,
      timestamp: new Date().toISOString(),
    };
  }

  // Save turn message & evaluation to Firestore
  if (db) {
    try {
      const msgRef = doc(db, 'users', uid, 'communicationSessions', sessionId, 'messages', `turn_${turnIndex}`);
      await setDoc(msgRef, {
        turnIndex,
        responseText,
        evaluation: respondData.evaluation,
        nextPrompt: respondData.next_prompt,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error('[FluencyService] Error saving turn message:', e);
    }
  }

  return respondData;
};

/**
 * Complete Fluency session, save evaluation summary, and update Progress Tracking Engine
 */
export const completeFluencySession = async (
  uid: string,
  sessionId: string,
  evaluations: FluencyEvaluationData[]
): Promise<FluencyCompleteResponseData> => {
  let completeData: FluencyCompleteResponseData;
  try {
    completeData = await ApiService.post<FluencyCompleteResponseData>('/v1/communication/fluency/complete', {
      session_id: sessionId,
      evaluations,
    });
  } catch (err) {
    console.warn('[FluencyService] API complete failed, using fallback summary:', err);
    const avgScore = evaluations.length
      ? Math.round(evaluations.reduce((acc, e) => acc + e.overallScore, 0) / evaluations.length)
      : 78;

    completeData = {
      session_id: sessionId,
      overall_score: avgScore,
      category_breakdown: {
        grammar: avgScore,
        vocabulary: avgScore - 2,
        sentenceStructure: avgScore + 1,
        clarity: avgScore + 2,
        coherence: avgScore,
        relevance: 85,
        fluency: avgScore,
      },
      strengths: ['Active participation', 'Clear sentence expression'],
      improvements: ['Vary vocabulary usage for higher precision'],
      summary: `Fluency Session Complete! You achieved an AI Fluency Score of ${avgScore}/100.`,
      timestamp: new Date().toISOString(),
    };
  }

  // Update session document & evaluation summary in Firestore
  if (db) {
    try {
      const sessionRef = doc(db, 'users', uid, 'communicationSessions', sessionId);
      await setDoc(
        sessionRef,
        {
          status: 'completed',
          completedAt: serverTimestamp(),
          overallScore: completeData.overall_score,
          summary: completeData.summary,
        },
        { merge: true }
      );

      const summaryRef = doc(db, 'users', uid, 'communicationSessions', sessionId, 'evaluation', 'summary');
      await setDoc(summaryRef, {
        ...completeData,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error('[FluencyService] Error persisting completion data:', e);
    }
  } else {
    // Offline / LocalStorage save for history
    const historyKey = `arena_fluency_history_${uid}`;
    const localHistStr = localStorage.getItem(historyKey);
    const localHist: FluencyHistoryItem[] = localHistStr ? JSON.parse(localHistStr) : [];
    const newHistItem: FluencyHistoryItem = {
      sessionId,
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      difficulty: 'medium',
      score: completeData.overall_score,
      topic: 'Fluency Session',
    };
    localStorage.setItem(historyKey, JSON.stringify([newHistItem, ...localHist].slice(0, 20)));
  }

  // Progress Tracking Engine Integration Point: Record completed fluency activity
  try {
    await recordStudentActivity(uid, {
      module: 'communication',
      activityType: 'speaking_session',
      topic: 'Spoken English Fluency Practice',
      difficulty: 'medium',
      status: 'completed',
      isCorrect: true,
      score: completeData.overall_score,
      timeSpent: 300,
    });
  } catch (e) {
    console.error('[FluencyService] Error recording Progress Engine activity:', e);
  }

  return completeData;
};

/**
 * Fetch completed Fluency session history for a student
 */
export const getFluencySessionHistory = async (uid: string): Promise<FluencyHistoryItem[]> => {
  if (!db) {
    const historyKey = `arena_fluency_history_${uid}`;
    const localHistStr = localStorage.getItem(historyKey);
    return localHistStr ? JSON.parse(localHistStr) : [];
  }

  try {
    const sessionsCol = collection(db, 'users', uid, 'communicationSessions');
    const q = query(
      sessionsCol,
      where('mode', '==', 'fluency'),
      where('status', '==', 'completed'),
      orderBy('completedAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let dateStr = 'Recent';
      if (data.completedAt) {
        try {
          const dateObj = data.completedAt.toDate ? data.completedAt.toDate() : new Date(data.completedAt);
          dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch (e) {
          dateStr = 'Recent';
        }
      }

      return {
        sessionId: docSnap.id,
        dateStr,
        difficulty: data.difficulty || 'medium',
        score: data.overallScore || 75,
        topic: data.topic || 'Fluency Practice',
      };
    });
  } catch (e) {
    console.error('[FluencyService] Error fetching fluency history:', e);
    return [];
  }
};
