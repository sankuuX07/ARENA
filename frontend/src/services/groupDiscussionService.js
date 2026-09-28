import { doc, setDoc, collection, query, where, orderBy, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ApiService } from './api';
import { recordStudentActivity } from './progressService';
export const startGroupDiscussion = async (uid, category, difficulty) => {
    const data = await ApiService.post('/communication/group-discussion/start', { uid, category, difficulty });
    const sessionRef = doc(db, `users/${uid}/communicationSessions/${data.session_id}`);
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
export const respondGroupDiscussion = async (uid, sessionId, studentMessage, currentRound, topic, messages) => {
    const data = await ApiService.post('/communication/group-discussion/respond', {
        uid,
        session_id: sessionId,
        student_message: studentMessage,
        current_round: currentRound,
        topic,
        messages,
    });
    const sessionRef = doc(db, `users/${uid}/communicationSessions/${sessionId}`);
    await updateDoc(sessionRef, {
        round: currentRound + 1,
        lastActivityAt: serverTimestamp(),
    });
    return data;
};
export const completeGroupDiscussion = async (uid, sessionId, topic, category, difficulty, messages) => {
    const data = await ApiService.post('/communication/group-discussion/complete', {
        session_id: sessionId,
        topic,
        category,
        difficulty,
        messages,
    });
    const sessionRef = doc(db, `users/${uid}/communicationSessions/${sessionId}`);
    await updateDoc(sessionRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        evaluation: data.evaluation,
        overallScore: data.evaluation.overallScore,
    });
    await recordStudentActivity(uid, {
        module: 'communication',
        activityType: 'group_discussion_session',
        status: 'completed',
        score: data.evaluation.overallScore,
    });
    return data;
};
export const getGroupDiscussionHistory = async (uid) => {
    const sessionsRef = collection(db, `users/${uid}/communicationSessions`);
    const q = query(sessionsRef, where('mode', '==', 'group_discussion'), orderBy('startedAt', 'desc'));
    const snapshot = await getDocs(q);
    const history = [];
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
            status: data.status,
        });
    });
    return history;
};
//# sourceMappingURL=groupDiscussionService.js.map