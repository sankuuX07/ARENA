import { doc, setDoc, collection, query, where, orderBy, getDocs, serverTimestamp, } from 'firebase/firestore';
import { db } from './firebase';
import { ApiService } from './api';
import { recordStudentActivity } from './progressService';
/**
 * Start a new Formal Communication Session via FastAPI backend and save in Firestore
 */
export const startFormalSession = async (uid, category, difficulty = 'medium') => {
    let startData;
    try {
        startData = await ApiService.post('/v1/communication/formal/start', {
            category,
            difficulty,
        });
    }
    catch (err) {
        console.warn('[FormalCommunicationService] API start failed, using fallback:', err);
        startData = {
            session_id: `formal_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            category,
            difficulty,
            scenario: `You are in a formal setting for ${category}. Please proceed appropriately.`,
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
                mode: 'formal',
                category: startData.category,
                difficulty: startData.difficulty,
                status: 'active',
                startedAt: serverTimestamp(),
                turnCount: 0,
            });
        }
        catch (e) {
            console.error('[FormalCommunicationService] Error saving Firestore session:', e);
        }
    }
    return startData;
};
/**
 * Submit student response turn for formal evaluation
 */
export const submitFormalTurn = async (uid, sessionId, responseText, turnIndex, category, difficulty = 'medium', history = []) => {
    let respondData;
    try {
        respondData = await ApiService.post('/v1/communication/formal/respond', {
            session_id: sessionId,
            response_text: responseText,
            turn_index: turnIndex,
            category,
            difficulty,
            history,
        });
    }
    catch (err) {
        console.warn('[FormalCommunicationService] API respond failed, using fallback:', err);
        respondData = {
            session_id: sessionId,
            turn_index: turnIndex,
            evaluation: {
                professionalism: 80,
                clarity: 80,
                grammar: 80,
                vocabulary: 80,
                structure: 80,
                relevance: 80,
                tone: 80,
                conciseness: 80,
                confidence: 80,
                overallScore: 80,
                strengths: ['Good communication'],
                improvements: ['Improve vocabulary'],
                originalText: responseText,
                betterVersion: responseText,
                rewriteReason: 'Better structure',
            },
            next_prompt: 'Thank you. Let us continue.',
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
        }
        catch (e) {
            console.error('[FormalCommunicationService] Error saving turn message:', e);
        }
    }
    return respondData;
};
/**
 * Complete Formal session, save evaluation summary, and update Progress Tracking Engine
 */
export const completeFormalSession = async (uid, sessionId, category, difficulty, evaluations) => {
    let completeData;
    try {
        completeData = await ApiService.post('/v1/communication/formal/complete', {
            session_id: sessionId,
            category,
            difficulty,
            evaluations,
        });
    }
    catch (err) {
        console.warn('[FormalCommunicationService] API complete failed, using fallback summary:', err);
        completeData = {
            session_id: sessionId,
            overall_score: 80,
            category_breakdown: {
                professionalism: 80,
                clarity: 80,
                grammar: 80,
                vocabulary: 80,
                structure: 80,
                relevance: 80,
                tone: 80,
                conciseness: 80,
                confidence: 80,
            },
            strengths: ['Active participation'],
            improvements: ['Vocabulary expansion'],
            summary: `Formal Session Complete! Score: 80/100.`,
            timestamp: new Date().toISOString(),
        };
    }
    // Update session document & evaluation summary in Firestore
    if (db) {
        try {
            const sessionRef = doc(db, 'users', uid, 'communicationSessions', sessionId);
            await setDoc(sessionRef, {
                status: 'completed',
                completedAt: serverTimestamp(),
                interactionCount: evaluations.length,
                overallScore: completeData.overall_score,
                summary: completeData.summary,
            }, { merge: true });
            const summaryRef = doc(db, 'users', uid, 'communicationSessions', sessionId, 'evaluation', 'summary');
            await setDoc(summaryRef, {
                ...completeData,
                timestamp: serverTimestamp(),
            });
        }
        catch (e) {
            console.error('[FormalCommunicationService] Error persisting completion data:', e);
        }
    }
    // Record completed formal communication activity
    try {
        await recordStudentActivity(uid, {
            module: 'communication',
            activityType: 'formal_communication_session',
            topic: `Formal Communication: ${category}`,
            difficulty: difficulty,
            status: 'completed',
            isCorrect: true,
            score: completeData.overall_score,
            timeSpent: 300,
        });
    }
    catch (e) {
        console.error('[FormalCommunicationService] Error recording Progress Engine activity:', e);
    }
    return completeData;
};
/**
 * Fetch completed Formal Communication session history for a student
 */
export const getFormalSessionHistory = async (uid) => {
    if (!db)
        return [];
    try {
        const sessionsCol = collection(db, 'users', uid, 'communicationSessions');
        const q = query(sessionsCol, where('mode', '==', 'formal'), where('status', '==', 'completed'), orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let dateStr = 'Recent';
            if (data.completedAt) {
                try {
                    const dateObj = data.completedAt.toDate ? data.completedAt.toDate() : new Date(data.completedAt);
                    dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
                catch (e) {
                    dateStr = 'Recent';
                }
            }
            return {
                sessionId: docSnap.id,
                dateStr,
                category: data.category || 'general',
                difficulty: data.difficulty || 'medium',
                score: data.overallScore || 0,
                status: data.status || 'completed',
            };
        });
    }
    catch (e) {
        console.error('[FormalCommunicationService] Error fetching formal history:', e);
        return [];
    }
};
//# sourceMappingURL=formalCommunicationService.js.map