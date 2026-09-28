import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { startPythonSession, completePythonSession, submitPythonAnswer } from '../../../services/pythonService';
import { TechnicalSession, TechnicalDifficulty, TechnicalQuestionType } from '../../../services/technicalService';
import { recordStudentActivity } from '../../../services/progressService';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
export const PythonSessionPage = () => {
    const { sessionId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answerData, setAnswerData] = useState(null);
    useEffect(() => {
        if (sessionId === 'new') {
            initSession();
        }
    }, [sessionId]);
    const initSession = async () => {
        try {
            setLoading(true);
            const topic = searchParams.get('topic') || '';
            const difficulty = searchParams.get('difficulty');
            const qType = searchParams.get('qType');
            const count = parseInt(searchParams.get('count') || '5', 10);
            const newSession = await startPythonSession(topic, difficulty, qType, count);
            setSession(newSession);
        }
        catch (err) {
            setError(err.message || 'Failed to start session');
        }
        finally {
            setLoading(false);
        }
    };
    const handleNext = async () => {
        if (!session || selectedOption === null || !currentUser)
            return;
        if (currentIndex + 1 < session.questionCount) {
            setCurrentIndex(i => i + 1);
            setSelectedOption(null);
            setShowExplanation(false);
            setAnswerData(null);
        }
        else {
            // Complete Session
            try {
                setLoading(true);
                const result = await completePythonSession(session.sessionId);
                await recordStudentActivity(currentUser.uid, {
                    module: 'technical',
                    activityType: 'quiz',
                    topic: session.topic,
                    difficulty: session.difficulty,
                    status: 'completed',
                    isCorrect: (result.score / session.questionCount) > 0.5,
                    score: Math.round((result.score / session.questionCount) * 100)
                });
                navigate('/technical/python/result', { state: { result: { score: result.score, total: session.questionCount, topic: session.topic } } });
            }
            catch (err) {
                setError(err.message || 'Failed to complete session');
                setLoading(false);
            }
        }
    };
    if (loading)
        return _jsxs("div", { style: { padding: '4rem', textAlign: 'center' }, children: ["Generating Python Programming Questions...", _jsx("br", {}), _jsx("small", { style: { color: 'var(--text-secondary)' }, children: "(This may take a moment for larger sets)" })] });
    if (error)
        return _jsx("div", { style: { padding: '4rem', textAlign: 'center', color: 'var(--error)' }, children: error });
    if (!session || session.questions.length === 0)
        return null;
    const currentQ = session.questions[currentIndex];
    const isConceptual = !currentQ.options || currentQ.options.length === 0;
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto', padding: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }, children: [_jsxs("h2", { style: { margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }, children: ["Practice: ", _jsxs("span", { style: { color: 'var(--text-main)', textTransform: 'capitalize' }, children: ["Python / ", session.topic.replace('_', ' ')] })] }), _jsxs("div", { style: { fontWeight: 600 }, children: ["Question ", currentIndex + 1, " of ", session.questionCount] })] }), _jsx("div", { style: { width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }, children: _jsx("div", { style: { height: '100%', background: 'var(--primary)', width: `${((currentIndex) / session.questionCount) * 100}%`, transition: 'width 0.3s' } }) }), _jsxs("div", { style: { background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }, children: [_jsx("div", { style: { fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }, children: currentQ.question }), currentQ.codeSnippet && (_jsx("pre", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }, children: _jsx("code", { children: currentQ.codeSnippet }) })), !isConceptual && (_jsx("div", { style: { display: 'grid', gap: '0.75rem' }, children: currentQ.options?.map((opt, idx) => (_jsxs("div", { onClick: () => !showExplanation && setSelectedOption(idx), style: {
                                padding: '1rem',
                                border: `2px solid ${selectedOption === idx ? 'var(--primary)' : 'var(--border-color)'}`,
                                borderRadius: '8px',
                                cursor: showExplanation ? 'default' : 'pointer',
                                background: selectedOption === idx ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }, children: [_jsx("div", { style: { width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${selectedOption === idx ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: selectedOption === idx && _jsx("div", { style: { width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' } }) }), _jsx("span", { style: { fontSize: '1rem' }, children: opt }), showExplanation && idx === answerData?.correctOption && (_jsx(CheckCircle, { size: 20, color: "var(--success)", style: { marginLeft: 'auto' } })), showExplanation && selectedOption === idx && idx !== answerData?.correctOption && (_jsx(XCircle, { size: 20, color: "var(--error)", style: { marginLeft: 'auto' } }))] }, idx))) }))] }), showExplanation && (_jsxs("div", { style: { padding: '1.5rem', background: (isConceptual || selectedOption === answerData?.correctOption) ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${(isConceptual || selectedOption === answerData?.correctOption) ? 'var(--success)' : 'var(--error)'}`, borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }, children: [!isConceptual && (_jsx("h3", { style: { margin: '0 0 0.5rem', color: selectedOption === answerData?.correctOption ? 'var(--success)' : 'var(--error)' }, children: selectedOption === answerData?.correctOption ? 'Correct!' : 'Incorrect' })), _jsx("p", { style: { margin: 0, lineHeight: 1.5 }, children: answerData?.explanation })] })), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: '1rem' }, children: !showExplanation ? (_jsx(Button, { variant: "primary", disabled: !isConceptual && selectedOption === null, onClick: async () => {
                        try {
                            setLoading(true);
                            const q = session.questions[currentIndex];
                            const data = await submitPythonAnswer(session.sessionId, q.questionId, selectedOption);
                            setAnswerData(data);
                            setShowExplanation(true);
                        }
                        catch (e) {
                            setError(e.message);
                        }
                        finally {
                            setLoading(false);
                        }
                    }, children: isConceptual ? 'Show Answer' : 'Submit Answer' })) : (_jsx(Button, { variant: "primary", onClick: handleNext, icon: _jsx(ArrowRight, { size: 16 }), children: currentIndex + 1 < session.questionCount ? 'Next Question' : 'Complete Session' })) })] }));
};
//# sourceMappingURL=PythonSessionPage.js.map