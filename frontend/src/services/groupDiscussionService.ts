import {
  doc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { ApiService } from './api';
import { recordStudentActivity } from './progressService';

export interface AIResponseData {
  speaker: string;
  content: string;
}

export interface GroupDiscussionEvaluation {
  communication: number;
  clarity: number;
  grammar: number;
  vocabulary: number;
  relevance: number;
  confidence: number;
  participation: number;
  leadership: number;
  teamwork: number;
  respectfulness: number;
  argumentQuality: number;
  responsiveness: number;
  adaptability: number;
  timeManagement: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  improved_responses?: { original: string; improved: string; reason: string }[];
}

export interface GroupDiscussionStartResponse {
  session_id: string;
  topic: string;
  category: string;
  difficulty: string;
  moderator_intro: string;
}

export interface GroupDiscussionRespondResponse {
  session_id: string;
  round: number;
  ai_responses: AIResponseData[];
  is_complete: boolean;
}

export interface GroupDiscussionSummary {
  session_id: string;
  category: string;
  difficulty: string;
  topic: string;
  evaluation: GroupDiscussionEvaluation;
  completed_at: string;
}

export interface GroupDiscussionHistoryItem {
  sessionId: string;
  dateStr: string;
  difficulty: string;
  category: string;
  topic: string;
  score: number;
  status: 'active' | 'completed';
}

export const startGroupDiscussion = async (
  uid: string,
  category: string,
  difficulty: string
): Promise<GroupDiscussionStartResponse> => {
  const data = await ApiService.post<GroupDiscussionStartResponse>(
    '/communication/group-discussion/start',
    { uid, category, difficulty }
  );

  const sessionRef = doc(db!, `users/${uid}/communicationSessions/${data.session_id}`);
  await setDoc(sessionRef, {
    mode: 'group_discussion',
    category,
    difficulty,
    topic: data.topic,
    status: 'active',
    round: 1,
    startedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });

  return data;
};

export const respondGroupDiscussion = async (
  uid: string,
  sessionId: string,
  studentMessage: string,
  currentRound: number,
  topic: string,
  messages: any[]
): Promise<GroupDiscussionRespondResponse> => {
  const data = await ApiService.post<GroupDiscussionRespondResponse>(
    '/communication/group-discussion/respond',
    {
      uid,
      session_id: sessionId,
      student_message: studentMessage,
      current_round: currentRound,
      topic,
      messages,
    }
  );

  const sessionRef = doc(db!, `users/${uid}/communicationSessions/${sessionId}`);
  await updateDoc(sessionRef, {
    round: currentRound + 1,
    lastActivityAt: serverTimestamp(),
  });

  return data;
};

export const completeGroupDiscussion = async (
  uid: string,
  sessionId: string,
  topic: string,
  category: string,
  difficulty: string,
  messages: any[]
): Promise<GroupDiscussionSummary> => {
  const data = await ApiService.post<GroupDiscussionSummary>(
    '/communication/group-discussion/complete',
    {
      session_id: sessionId,
      topic,
      category,
      difficulty,
      messages,
    }
  );

  const sessionRef = doc(db!, `users/${uid}/communicationSessions/${sessionId}`);
  await updateDoc(sessionRef, {
    status: 'completed',
    completedAt: serverTimestamp(),
    evaluation: data.evaluation,
    overallScore: data.evaluation.overallScore,
  });

  await recordStudentActivity(uid, {
    module: 'communication',
    activityType: 'group_discussion_session' as any,
    status: 'completed',
    score: data.evaluation.overallScore,
  });

  return data;
};

export const getGroupDiscussionHistory = async (uid: string): Promise<GroupDiscussionHistoryItem[]> => {
  const sessionsRef = collection(db!, `users/${uid}/communicationSessions`);
  const q = query(
    sessionsRef,
    where('mode', '==', 'group_discussion'),
    orderBy('startedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const history: GroupDiscussionHistoryItem[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const dateStr = data.startedAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString();

    history.push({
      sessionId: docSnap.id,
      dateStr,
      difficulty: data.difficulty || 'medium',
      category: data.category || 'technology',
      topic: data.topic || 'Unknown Topic',
      score: data.overallScore || 0,
      status: data.status as 'active' | 'completed',
    });
  });

  return history;
};
