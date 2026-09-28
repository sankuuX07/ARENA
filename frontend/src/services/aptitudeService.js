import { doc, setDoc, collection, query, orderBy, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ApiService } from './api';
import { recordStudentActivity } from './progressService';
export const startAptitudeSession = async (uid, category, difficulty, numQuestions = 10, topic) => {
    let endpoint = '/aptitude/start';
    if (category === 'verbal')
        endpoint = '/aptitude/verbal/start';
    if (category === 'logical')
        endpoint = '/aptitude/logical/start';
    const data = await ApiService.post(endpoint, { uid, category, difficulty, num_questions: numQuestions, topic });
    const sessionRef = doc(db, `users/${uid}/aptitudeSessions/${data.session_id}`);
    await setDoc(sessionRef, {
        category,
        topic: topic || null,
        difficulty,
        status: 'active',
        questionCount: numQuestions,
        startedAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
    });
    return data;
};
export const completeAptitudeSession = async (uid, sessionId, category, difficulty, questions, answers, timeTakenSecs, topic) => {
    let endpoint = '/aptitude/complete';
    if (category === 'verbal')
        endpoint = '/aptitude/verbal/complete';
    if (category === 'logical')
        endpoint = '/aptitude/logical/complete';
    const data = await ApiService.post(endpoint, {
        uid,
        session_id: sessionId,
        category,
        difficulty,
        questions,
        answers,
        topic
    });
    data.time_taken = timeTakenSecs;
    const sessionRef = doc(db, `users/${uid}/aptitudeSessions/${sessionId}`);
    await updateDoc(sessionRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        score: data.score,
        accuracy: data.accuracy,
        correctAnswers: data.correct,
        incorrectAnswers: data.incorrect,
        unanswered: data.unanswered,
        timeTaken: timeTakenSecs
    });
    let activityType = 'aptitude_session';
    if (category === 'quantitative')
        activityType = 'quantitative_session';
    if (category === 'verbal')
        activityType = 'verbal_session';
    if (category === 'logical')
        activityType = 'logical_session';
    await recordStudentActivity(uid, {
        module: 'aptitude',
        activityType,
        topic: topic || undefined,
        status: 'completed',
        score: data.score,
        timeSpent: timeTakenSecs
    });
    return data;
};
export const getAptitudeHistory = async (uid) => {
    const sessionsRef = collection(db, `users/${uid}/aptitudeSessions`);
    const q = query(sessionsRef, orderBy('startedAt', 'desc'));
    const snapshot = await getDocs(q);
    const history = [];
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const dateStr = data.startedAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString();
        history.push({
            sessionId: docSnap.id,
            dateStr,
            category: data.category || 'Quantitative',
            topic: data.topic,
            difficulty: data.difficulty || 'Medium',
            score: data.score || 0,
            accuracy: data.accuracy || 0,
            status: data.status,
        });
    });
    return history;
};
//# sourceMappingURL=aptitudeService.js.map