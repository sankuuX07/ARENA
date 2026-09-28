import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { startTechnicalSession, completeTechnicalSession, submitTechnicalAnswer, TechnicalSession, TechnicalLanguage, TechnicalDifficulty } from '../../services/technicalService';
import { recordStudentActivity } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
export const TechnicalSessionPage = () => {
    const { sessionId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answerData, setAnswerData] = useState(null);
    // Note: For Milestone 21, the session is purely structural with 1 question.
    // In full implementation, we'll iterate through `session.questions`.
    useEffect(() => {
        if (sessionId === 'new') {
            initSession();
        }
    }, [sessionId]);
    const initSession = async () => {
        try {
            setLoading(true);
            const language = searchParams.get('language');
            const topic = searchParams.get('topic') || '';
            const difficulty = searchParams.get('difficulty');
            const newSession = await startTechnicalSession(language, topic, difficulty, 1);
            setSession(newSession);
            // For a real app, we'd navigate to replace '/new' with the actual ID, but keeping it simple for foundation
        }
        catch (err) {
            setError(err.message || 'Failed to start session');
        }
        finally {
            setLoading(false);
        }
    };
    const handleComplete = async () => {
        if (!session || selectedOption === null || !currentUser)
            return;
        try {
            setLoading(true);
            const result = await completeTechnicalSession(session.sessionId);
            const isCorrect = (result.score / result.totalQuestions) > 0.5;
            const score = Math.round((result.score / result.totalQuestions) * 100);
            // Update Progress Engine
            await recordStudentActivity(currentUser.uid, {
                module: 'technical',
                activityType: 'quiz', // Using quiz as a proxy for MCQ tech questions
                topic: session.topic,
                difficulty: session.difficulty,
                status: 'completed',
                isCorrect: isCorrect,
                score: score
            });
            navigate('/technical');
        }
        catch (err) {
            setError(err.message || 'Failed to complete session');
            setLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { style: { padding: '4rem', textAlign: 'center' }, children: "Generating Technical Session..." });
    if (error)
        return _jsx("div", { style: { padding: '4rem', textAlign: 'center', color: 'var(--error)' }, children: error });
    if (!session || session.questions.length === 0)
        return null;
    const currentQ = session.questions[session.currentQuestionIndex];
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto', padding: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }, children: [_jsxs("h2", { style: { margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }, children: ["Practice: ", _jsxs("span", { style: { color: 'var(--text-main)', textTransform: 'capitalize' }, children: [session.language, " / ", session.topic.replace('_', ' ')] })] }), _jsxs("div", { style: { fontWeight: 600 }, children: ["Question ", session.currentQuestionIndex + 1, " of ", session.questionCount] })] }), _jsxs("div", { style: { background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }, children: [_jsx("div", { style: { fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }, children: currentQ.question }), currentQ.codeSnippet && (_jsx("pre", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }, children: _jsx("code", { children: currentQ.codeSnippet }) })), _jsx("div", { style: { display: 'grid', gap: '0.75rem' }, children: currentQ.options?.map((opt, idx) => (_jsxs("div", { onClick: () => !showExplanation && setSelectedOption(idx), style: {
                                padding: '1rem',
                                border: `2px solid ${selectedOption === idx ? 'var(--primary)' : 'var(--border-color)'}`,
                                borderRadius: '8px',
                                cursor: showExplanation ? 'default' : 'pointer',
                                background: selectedOption === idx ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }, children: [_jsx("div", { style: { width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${selectedOption === idx ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: selectedOption === idx && _jsx("div", { style: { width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' } }) }), _jsx("span", { style: { fontSize: '1rem' }, children: opt }), showExplanation && idx === answerData?.correctOption && (_jsx(CheckCircle, { size: 20, color: "var(--success)", style: { marginLeft: 'auto' } })), showExplanation && selectedOption === idx && idx !== answerData?.correctOption && (_jsx(XCircle, { size: 20, color: "var(--error)", style: { marginLeft: 'auto' } }))] }, idx))) })] }), showExplanation && (_jsxs("div", { style: { padding: '1.5rem', background: selectedOption === answerData?.correctOption ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${selectedOption === answerData?.correctOption ? 'var(--success)' : 'var(--error)'}`, borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }, children: [_jsx("h3", { style: { margin: '0 0 0.5rem', color: selectedOption === answerData?.correctOption ? 'var(--success)' : 'var(--error)' }, children: selectedOption === answerData?.correctOption ? 'Correct!' : 'Incorrect' }), _jsx("p", { style: { margin: 0, lineHeight: 1.5 }, children: answerData?.explanation })] })), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: '1rem' }, children: !showExplanation ? (_jsx(Button, { variant: "primary", disabled: selectedOption === null, onClick: async () => {
                        try {
                            setLoading(true);
                            const q = session.questions[session.currentQuestionIndex];
                            const data = await submitTechnicalAnswer(session.sessionId, q.questionId, selectedOption);
                            setAnswerData(data);
                            setShowExplanation(true);
                        }
                        catch (e) {
                            setError(e.message);
                        }
                        finally {
                            setLoading(false);
                        }
                    }, children: "Submit Answer" })) : (_jsx(Button, { variant: "primary", onClick: handleComplete, children: "Complete Session" })) })] }));
};
//# sourceMappingURL=TechnicalSessionPage.js.map