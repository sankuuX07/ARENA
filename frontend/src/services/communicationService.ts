import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { ApiService } from './api';
import { recordStudentActivity } from './progressService';

export interface CommunicationMessage {
  id: string;
  role: 'student' | 'ai' | 'system';
  content: string;
  timestamp: string;
}

export interface CommunicationSession {
  sessionId: string;
  uid: string;
  mode: 'general' | 'fluency' | 'formal' | 'situational' | 'group_discussion';
  status: 'active' | 'completed' | 'abandoned';
  startedAt: string;
  endedAt?: string;
  messageCount: number;
}

export interface ChatApiResponse {
  session_id: string;
  message: string;
  timestamp: string;
  status: string;
  mode: string;
  evaluation?: any;
}

/**
 * Start a new AI Communication practice session
 */
export const startCommunicationSession = async (
  uid: string,
  mode: 'general' | 'fluency' | 'formal' | 'situational' | 'group_discussion' = 'general'
): Promise<{ session: CommunicationSession; initialMessage: CommunicationMessage }> => {
  const sessionId = `comm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const nowStr = new Date().toISOString();

  const sessionData: CommunicationSession = {
    sessionId,
    uid,
    mode,
    status: 'active',
    startedAt: nowStr,
    messageCount: 1,
  };

  const initialGreetingText =
    "Hello! Welcome to the ARENA AI Communication Practice Session. " +
    "I'm here to help you build speaking confidence and placement readiness. " +
    "To get started, tell me briefly about yourself and your career goals!";

  const initialMessage: CommunicationMessage = {
    id: `msg_init_${Date.now()}`,
    role: 'ai',
    content: initialGreetingText,
    timestamp: nowStr,
  };

  // Firestore Session Persistence
  if (db) {
    try {
      const sessionRef = doc(db, 'users', uid, 'communicationSessions', sessionId);
      await setDoc(sessionRef, {
        ...sessionData,
        startedAt: serverTimestamp(),
      });

      const msgRef = doc(db, 'users', uid, 'communicationSessions', sessionId, 'messages', initialMessage.id);
      await setDoc(msgRef, {
        ...initialMessage,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('[CommunicationService] Error saving initial session:', err);
    }
  } else {
    // Offline / Demo LocalStorage fallback
    localStorage.setItem(`arena_comm_session_${sessionId}`, JSON.stringify(sessionData));
    localStorage.setItem(`arena_comm_messages_${sessionId}`, JSON.stringify([initialMessage]));
  }

  return { session: sessionData, initialMessage };
};

/**
 * Send student message to FastAPI Gemini backend & store resulting conversation thread
 */
export const sendChatMessage = async (
  uid: string,
  sessionId: string,
  messageContent: string,
  mode: 'general' | 'fluency' | 'formal' | 'situational' | 'group_discussion' = 'general',
  existingHistory: CommunicationMessage[] = []
): Promise<{ studentMessage: CommunicationMessage; aiMessage: CommunicationMessage }> => {
  const nowStr = new Date().toISOString();
  const studentMessage: CommunicationMessage = {
    id: `msg_std_${Date.now()}`,
    role: 'student',
    content: messageContent.trim(),
    timestamp: nowStr,
  };

  // Format recent conversation history for backend context [{role: 'user'|'model', content: ''}]
  const formattedHistory = existingHistory.map((m) => ({
    role: m.role === 'student' ? 'user' : 'model',
    content: m.content,
  }));

  let aiResponseText = '';
  try {
    const apiRes = await ApiService.post<ChatApiResponse>('/v1/communication/chat', {
      session_id: sessionId,
      message: messageContent.trim(),
      mode,
      history: formattedHistory,
    });
    aiResponseText = apiRes.message;
  } catch (err: any) {
    console.warn('[CommunicationService] API request failed, using fallback:', err);
    aiResponseText =
      "Thank you for sharing that! Your response demonstrates good clarity. " +
      "In a competitive interview, structuring your thoughts clearly helps interviewers follow your logic. " +
      "What specific skills or topics would you like to practice next?";
  }

  const aiMessage: CommunicationMessage = {
    id: `msg_ai_${Date.now()}`,
    role: 'ai',
    content: aiResponseText,
    timestamp: new Date().toISOString(),
  };

  // Firestore Persistence
  if (db) {
    try {
      const studentMsgRef = doc(db, 'users', uid, 'communicationSessions', sessionId, 'messages', studentMessage.id);
      await setDoc(studentMsgRef, { ...studentMessage, timestamp: serverTimestamp() });

      const aiMsgRef = doc(db, 'users', uid, 'communicationSessions', sessionId, 'messages', aiMessage.id);
      await setDoc(aiMsgRef, { ...aiMessage, timestamp: serverTimestamp() });
    } catch (err) {
      console.error('[CommunicationService] Error persisting messages:', err);
    }
  } else {
    const key = `arena_comm_messages_${sessionId}`;
    const localMsgsStr = localStorage.getItem(key);
    const localMsgs: CommunicationMessage[] = localMsgsStr ? JSON.parse(localMsgsStr) : [];
    localStorage.setItem(key, JSON.stringify([...localMsgs, studentMessage, aiMessage]));
  }

  return { studentMessage, aiMessage };
};

/**
 * End an active communication session & record progress integration point
 */
export const endCommunicationSession = async (
  uid: string,
  sessionId: string,
  totalMessages: number = 0
): Promise<void> => {
  const endedAtStr = new Date().toISOString();

  if (db) {
    try {
      const sessionRef = doc(db, 'users', uid, 'communicationSessions', sessionId);
      await setDoc(
        sessionRef,
        {
          status: 'completed',
          endedAt: serverTimestamp(),
          messageCount: totalMessages,
        },
        { merge: true }
      );
    } catch (err) {
      console.error('[CommunicationService] Error completing session:', err);
    }
  } else {
    const key = `arena_comm_session_${sessionId}`;
    const localStr = localStorage.getItem(key);
    if (localStr) {
      const session: CommunicationSession = JSON.parse(localStr);
      session.status = 'completed';
      session.endedAt = endedAtStr;
      session.messageCount = totalMessages;
      localStorage.setItem(key, JSON.stringify(session));
    }
  }

  // Progress Engine Integration Point: Record completed communication session if >= 3 messages exchanged
  if (totalMessages >= 3) {
    try {
      await recordStudentActivity(uid, {
        module: 'communication',
        activityType: 'speaking_session',
        topic: 'AI Communication Practice',
        difficulty: 'medium',
        status: 'completed',
        isCorrect: true,
        score: 25,
        timeSpent: 180,
      });
    } catch (err) {
      console.error('[CommunicationService] Error recording progress activity:', err);
    }
  }
};
