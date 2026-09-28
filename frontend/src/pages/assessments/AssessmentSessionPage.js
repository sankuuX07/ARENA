import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, ArrowLeft, Bookmark, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAssessmentSession, saveAssessmentAnswer, submitAssessment, getAssessmentSessionStatus, AssessmentSession, AssessmentAnswer } from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';
import { CodeEditor } from '../../components/puzzles/CodeEditor';
import { VoiceInput } from '../../components/communication/VoiceInput';
export const AssessmentSessionPage = () => {
    const { sessionId, assessmentId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    // Timer State
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef(null);
    useEffect(() => {
        if (sessionId) {
            loadSession(sessionId);
        }
        return () => clearTimer();
    }, [sessionId]);
    const loadSession = async (id) => {
        try {
            const data = await getAssessmentSession(id);
            if (data.status === 'submitted' || data.status === 'evaluated') {
                if (data.metadata?.resultId) {
                    navigate(`/assessments/results/${data.metadata.resultId}`, { replace: true });
                }
                else {
                    navigate('/assessments', { replace: true });
                }
                return;
            }
            setSession(data);
            // Calculate initial time left from server expiration
            if (data.expiresAt) {
                const expires = new Date(data.expiresAt).getTime();
                const now = new Date().getTime();
                const remain = Math.max(0, Math.floor((expires - now) / 1000));
                setTimeLeft(remain);
                startTimer(expires);
            }
        }
        catch (err) {
            alert(err.message || 'Failed to load session');
            navigate(`/assessments/${assessmentId}`);
        }
        finally {
            setLoading(false);
        }
    };
    const startTimer = (expiresMs) => {
        clearTimer();
        timerRef.current = window.setInterval(async () => {
            const now = new Date().getTime();
            const remain = Math.max(0, Math.floor((expiresMs - now) / 1000));
            setTimeLeft(remain);
            if (remain <= 0) {
                clearTimer();
                await handleAutoSubmit();
            }
            else if (remain % 60 === 0) {
                // Sync with server every minute
                syncStatus();
            }
        }, 1000);
    };
    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };
    const syncStatus = async () => {
        if (!sessionId)
            return;
        try {
            const status = await getAssessmentSessionStatus(sessionId);
            if (status.status === 'expired' || status.status === 'submitted') {
                clearTimer();
                alert('Session has expired or been submitted remotely.');
                navigate('/assessments');
            }
        }
        catch (err) {
            console.error('Failed to sync status', err);
        }
    };
    const handleAutoSubmit = async () => {
        if (!sessionId)
            return;
        try {
            setSubmitting(true);
            const res = await submitAssessment(sessionId);
            alert('Time expired. Assessment automatically submitted.');
            if (res.metadata?.resultId) {
                navigate(`/assessments/results/${res.metadata.resultId}`, { replace: true });
            }
            else {
                navigate('/assessments', { replace: true });
            }
        }
        catch (err) {
            console.error(err);
            navigate('/assessments');
        }
    };
    const handleManualSubmit = async () => {
        if (!sessionId)
            return;
        try {
            setSubmitting(true);
            const res = await submitAssessment(sessionId);
            if (res.metadata?.resultId) {
                navigate(`/assessments/results/${res.metadata.resultId}`, { replace: true });
            }
            else {
                navigate('/assessments', { replace: true });
            }
        }
        catch (err) {
            alert(err.message || 'Failed to submit');
            setSubmitting(false);
        }
    };
    const handleOptionSelect = async (optIndex) => {
        await saveCurrentAnswer({ selectedOption: optIndex });
    };
    const handleTextResponse = async (text) => {
        await saveCurrentAnswer({ textResponse: text });
    };
    const saveCurrentAnswer = async (updates) => {
        if (!session || !sessionId)
            return;
        const q = session.questions[currentIndex];
        // Optimistic update
        const updatedAnswers = [...session.answers];
        const existingIdx = updatedAnswers.findIndex(a => a.questionId === q.questionId);
        const newState = 'answered';
        if (existingIdx >= 0) {
            updatedAnswers[existingIdx] = { ...updatedAnswers[existingIdx], ...updates, state: newState };
        }
        else {
            updatedAnswers.push({ sessionId, questionId: q.questionId, selectedOption: null, textResponse: undefined, ...updates, state: newState });
        }
        setSession({ ...session, answers: updatedAnswers });
        // Background save
        try {
            const a = updatedAnswers.find(x => x.questionId === q.questionId);
            await saveAssessmentAnswer(sessionId, {
                questionId: a.questionId,
                selectedOption: a.selectedOption,
                textResponse: a.textResponse,
                state: a.state
            });
        }
        catch (err) {
            console.error("Failed to save answer", err);
        }
    };
    const toggleReviewMark = async () => {
        if (!session || !sessionId)
            return;
        const q = session.questions[currentIndex];
        const updatedAnswers = [...session.answers];
        const existingIdx = updatedAnswers.findIndex(a => a.questionId === q.questionId);
        let newState = 'marked_for_review';
        if (existingIdx >= 0) {
            const current = updatedAnswers[existingIdx];
            newState = current.state === 'marked_for_review' ? (current.selectedOption !== null ? 'answered' : 'unanswered') : 'marked_for_review';
            updatedAnswers[existingIdx] = { ...current, state: newState };
        }
        else {
            updatedAnswers.push({ sessionId, questionId: q.questionId, selectedOption: null, state: 'marked_for_review' });
        }
        setSession({ ...session, answers: updatedAnswers });
        try {
            const a = updatedAnswers.find(x => x.questionId === q.questionId);
            await saveAssessmentAnswer(sessionId, {
                questionId: a.questionId,
                selectedOption: a.selectedOption,
                textResponse: a.textResponse,
                state: a.state
            });
        }
        catch (err) {
            console.error(err);
        }
    };
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };
    if (loading || !session)
        return _jsx("div", { style: { padding: '4rem', textAlign: 'center' }, children: "Loading Session..." });
    const currentQ = session.questions[currentIndex];
    const currentAnswer = session.answers.find((a) => a.questionId === currentQ.questionId);
    const answeredCount = session.answers.filter((a) => a.selectedOption !== null || a.textResponse).length;
    const reviewCount = session.answers.filter((a) => a.state === 'marked_for_review').length;
    const unansweredCount = session.questions.length - answeredCount;
    return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }, children: [_jsx("div", { style: { fontSize: '1.2rem', fontWeight: 600 }, children: "Technical Assessment" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: (timeLeft && timeLeft < 300) ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface-elevated)', padding: '0.5rem 1rem', borderRadius: '20px', color: (timeLeft && timeLeft < 300) ? 'var(--error)' : 'var(--text-main)', border: `1px solid ${(timeLeft && timeLeft < 300) ? 'var(--error)' : 'var(--border-color)'}` }, children: [_jsx(Clock, { size: 16 }), _jsx("span", { style: { fontWeight: 600, fontSize: '1.1rem', fontVariantNumeric: 'tabular-nums' }, children: timeLeft !== null ? formatTime(timeLeft) : '--:--' })] }), _jsx(Button, { variant: "primary", onClick: () => setShowSubmitConfirm(true), children: "Submit Assessment" })] })] }), _jsxs("div", { style: { display: 'flex', flex: 1, overflow: 'hidden' }, children: [_jsxs("div", { style: { width: '300px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }, children: [_jsx("h3", { style: { margin: '0 0 1rem', fontSize: '1rem' }, children: "Navigator" }), _jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }, children: session.questions.map((q, idx) => {
                                            const ans = session.answers.find((a) => a.questionId === q.questionId);
                                            const isCurrent = idx === currentIndex;
                                            const isAnswered = ans && (ans.selectedOption !== null || !!ans.textResponse);
                                            const isReview = ans && ans.state === 'marked_for_review';
                                            let bg = 'var(--bg-surface-elevated)';
                                            let color = 'var(--text-main)';
                                            let border = '1px solid var(--border-color)';
                                            if (isCurrent) {
                                                border = '1px solid var(--primary)';
                                                bg = 'rgba(59, 130, 246, 0.1)';
                                                color = 'var(--primary)';
                                            }
                                            else if (isReview) {
                                                bg = 'rgba(234, 179, 8, 0.1)';
                                                border = '1px solid var(--warning)';
                                                color = 'var(--warning)';
                                            }
                                            else if (isAnswered) {
                                                bg = 'rgba(34, 197, 94, 0.1)';
                                                border = '1px solid var(--success)';
                                                color = 'var(--success)';
                                            }
                                            return (_jsx("button", { onClick: () => setCurrentIndex(idx), style: {
                                                    width: '36px', height: '36px', borderRadius: '4px',
                                                    background: bg, border: border, color: color,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 600, cursor: 'pointer'
                                                }, children: idx + 1 }, q.questionId));
                                        }) })] }), _jsxs("div", { style: { padding: '1.5rem', flex: 1 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }, children: [_jsx("div", { style: { width: '12px', height: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--success)', borderRadius: '2px' } }), " Answered (", answeredCount, ")"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }, children: [_jsx("div", { style: { width: '12px', height: '12px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid var(--warning)', borderRadius: '2px' } }), " Marked for Review (", reviewCount, ")"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }, children: [_jsx("div", { style: { width: '12px', height: '12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '2px' } }), " Unanswered (", unansweredCount, ")"] })] })] }), _jsx("div", { style: { flex: 1, padding: '2rem', overflowY: 'auto' }, children: _jsxs("div", { style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }, children: [_jsxs("h2", { style: { margin: 0, fontSize: '1.5rem' }, children: ["Question ", currentIndex + 1, " of ", session.questions.length] }), _jsxs("div", { style: { display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }, children: [_jsxs("span", { children: ["Marks: +", currentQ.marks] }), currentQ.negativeMarks > 0 && _jsxs("span", { children: ["Penalty: -", currentQ.negativeMarks] })] })] }), _jsxs("div", { style: { background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }, children: [_jsx("div", { style: { fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.6 }, children: currentQ.questionText }), currentQ.codeSnippet && (_jsx("pre", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }, children: _jsx("code", { children: currentQ.codeSnippet }) })), currentQ.type === 'mcq' && (_jsx("div", { style: { display: 'grid', gap: '0.75rem' }, children: currentQ.options?.map((opt, idx) => {
                                                const isSelected = currentAnswer?.selectedOption === idx;
                                                return (_jsxs("div", { onClick: () => handleOptionSelect(idx), style: {
                                                        padding: '1rem',
                                                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem'
                                                    }, children: [_jsx("div", { style: { width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: isSelected && _jsx("div", { style: { width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' } }) }), _jsx("span", { style: { fontSize: '1rem' }, children: opt })] }, idx));
                                            }) })), currentQ.type === 'coding' && (_jsxs("div", { style: { height: '400px', marginTop: '1rem' }, children: [_jsx(CodeEditor, { language: currentQ.metadata?.language || 'python', value: currentAnswer?.textResponse || currentQ.metadata?.starterCode || '', onChange: handleTextResponse }), _jsx("div", { style: { marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }, children: "Your code is automatically saved. Background evaluation will run upon submission." })] })), currentQ.type === 'communication' && (_jsxs("div", { style: { marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsx("textarea", { value: currentAnswer?.textResponse || '', onChange: (e) => handleTextResponse(e.target.value), placeholder: "Type your response here or use Voice Input...", style: {
                                                        width: '100%', height: '120px', padding: '1rem',
                                                        background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)',
                                                        borderRadius: '8px', color: 'var(--text-main)', resize: 'vertical'
                                                    } }), currentQ.metadata?.mode === 'voice' && (_jsx(VoiceInput, { onSpeechResult: (text) => handleTextResponse((currentAnswer?.textResponse ? currentAnswer.textResponse + ' ' : '') + text) }))] }))] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(Button, { variant: "outline", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => setCurrentIndex(i => Math.max(0, i - 1)), disabled: currentIndex === 0, children: "Previous" }), _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx(Button, { variant: currentAnswer?.state === 'marked_for_review' ? 'primary' : 'outline', icon: _jsx(Bookmark, { size: 16 }), onClick: toggleReviewMark, children: currentAnswer?.state === 'marked_for_review' ? 'Unmark Review' : 'Mark for Review' }), _jsxs(Button, { variant: "primary", onClick: () => setCurrentIndex(i => Math.min(session.questions.length - 1, i + 1)), disabled: currentIndex === session.questions.length - 1, children: ["Next ", _jsx(ArrowRight, { size: 16, style: { marginLeft: '0.5rem' } })] })] })] })] }) })] }), showSubmitConfirm && (_jsx("div", { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsxs("div", { style: { background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', border: '1px solid var(--border-color)' }, children: [_jsxs("h2", { style: { margin: '0 0 1rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(AlertTriangle, { color: "var(--warning)" }), " Submit Assessment?"] }), _jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }, children: [_jsx("span", { style: { color: 'var(--text-secondary)' }, children: "Answered" }), _jsx("span", { style: { fontWeight: 600, color: 'var(--success)' }, children: answeredCount })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }, children: [_jsx("span", { style: { color: 'var(--text-secondary)' }, children: "Marked for Review" }), _jsx("span", { style: { fontWeight: 600, color: 'var(--warning)' }, children: reviewCount })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { style: { color: 'var(--text-secondary)' }, children: "Unanswered" }), _jsx("span", { style: { fontWeight: 600 }, children: unansweredCount })] })] }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }, children: "Once you submit, you will not be able to change your answers. Are you sure you want to finish?" }), _jsxs("div", { style: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "outline", onClick: () => setShowSubmitConfirm(false), disabled: submitting, children: "Cancel" }), _jsx(Button, { variant: "primary", onClick: handleManualSubmit, disabled: submitting, icon: _jsx(CheckCircle, { size: 16 }), children: submitting ? 'Submitting...' : 'Confirm Submit' })] })] }) }))] }));
};
//# sourceMappingURL=AssessmentSessionPage.js.map