import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startAptitudeSession, completeAptitudeSession, getAptitudeHistory, AptitudeStartResponse, AptitudeHistoryItem, AptitudeSessionSummary, AptitudeQuestion } from '../services/aptitudeService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { BrainCircuit, ArrowRight, ArrowLeft, CheckCircle2, XCircle, Clock, Award, BarChart, Settings, Target, ListOrdered, RefreshCcw, BookOpen, Play } from 'lucide-react';
const CATEGORIES = [
    { id: 'quantitative', label: 'Quantitative Mathematics', available: true, milestone: 'Active', path: '/aptitude/quantitative' },
    { id: 'verbal', label: 'Verbal Ability', available: true, milestone: 'Active', path: '/aptitude/verbal' },
    { id: 'logical', label: 'Logical Reasoning', available: true, milestone: 'Active', path: '/aptitude/logical' },
    { id: 'mixed', label: 'Engine Test (Mixed)', available: true, milestone: 'Testing Engine', path: '/aptitude' } // Exposed for testing
];
export const AptitudePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    // Session State
    const [session, setSession] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('mixed');
    const [difficulty, setDifficulty] = useState('medium');
    const [questions, setQuestions] = useState([]);
    // UI State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes default
    const [timeTaken, setTimeTaken] = useState(0);
    // Status & History
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [finalResult, setFinalResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const timerRef = useRef(null);
    useEffect(() => {
        if (currentUser) {
            loadHistoryData(currentUser.uid);
        }
        return () => clearInterval(timerRef.current);
    }, [currentUser]);
    useEffect(() => {
        if (session && !isSessionComplete) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleCompleteSession(true); // Auto-submit
                        return 0;
                    }
                    return prev - 1;
                });
                setTimeTaken(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [session, isSessionComplete]);
    const loadHistoryData = async (uid) => {
        try {
            const hist = await getAptitudeHistory(uid);
            setHistory(hist);
        }
        catch (e) {
            console.error('Error loading history:', e);
        }
    };
    const handleStartSession = async () => {
        if (!currentUser)
            return;
        setLoading(true);
        setErrorMessage(null);
        setIsSessionComplete(false);
        setIsReviewMode(false);
        setFinalResult(null);
        setCurrentIndex(0);
        setAnswers({});
        setTimeRemaining(600);
        setTimeTaken(0);
        try {
            const data = await startAptitudeSession(currentUser.uid, selectedCategory, difficulty, 10);
            setSession(data);
            setQuestions(data.questions);
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to start Aptitude session.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSelectOption = (optionIndex) => {
        if (isSessionComplete || isReviewMode)
            return;
        const currentQ = questions[currentIndex];
        setAnswers(prev => ({
            ...prev,
            [currentQ.question_id]: optionIndex
        }));
    };
    const handleCompleteSession = async (autoSubmit = false) => {
        if (!currentUser || !session)
            return;
        if (!autoSubmit && Object.keys(answers).length < questions.length) {
            if (!window.confirm(`You have unanswered questions. Are you sure you want to submit?`)) {
                return;
            }
        }
        setIsSubmitting(true);
        clearInterval(timerRef.current);
        try {
            const summary = await completeAptitudeSession(currentUser.uid, session.session_id, session.category, session.difficulty, questions, answers, timeTaken);
            setFinalResult(summary);
            if (summary.questions_with_answers) {
                setQuestions(summary.questions_with_answers);
            }
            setIsSessionComplete(true);
            loadHistoryData(currentUser.uid);
        }
        catch (err) {
            setErrorMessage('Failed to submit test. Please try again.');
            // Restart timer if failed
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => Math.max(0, prev - 1));
                setTimeTaken(prev => prev + 1);
            }, 1000);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };
    if (showHistory) {
        return (_jsxs("div", { style: { maxWidth: 1000, margin: '0 auto', width: '100%' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 18 }), onClick: () => setShowHistory(false), style: { marginRight: '1rem' }, children: "Back" }), _jsx("h2", { className: "section-title", style: { margin: 0 }, children: "Aptitude History" })] }), history.length === 0 ? (_jsx(EmptyState, { icon: _jsx(BarChart, {}), title: "No History Yet", description: "Complete your first aptitude test to see your progress." })) : (_jsx("div", { style: { display: 'grid', gap: '1rem' }, children: history.map((h, i) => (_jsxs(Card, { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontWeight: 600, fontSize: '1.1rem', textTransform: 'capitalize' }, children: [h.category, " Aptitude"] }), _jsxs("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', textTransform: 'capitalize' }, children: [h.dateStr, " \u2014 ", h.difficulty, " Difficulty"] })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsx(Badge, { variant: h.status === 'completed' ? 'success' : 'neutral', children: h.status.toUpperCase() }), h.status === 'completed' && (_jsxs("div", { style: { fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem', color: 'var(--primary)' }, children: [h.score, " / ", h.accuracy, "%"] }))] })] }, i))) }))] }));
    }
    // Active or Review Mode Question Display
    if (session && (isReviewMode || !isSessionComplete)) {
        const currentQ = questions[currentIndex];
        const selectedOpt = answers[currentQ.question_id];
        return (_jsxs("div", { style: { maxWidth: 800, margin: '0 auto', width: '100%' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }, children: [_jsxs("div", { children: [_jsxs("h2", { style: { fontSize: '1.25rem', margin: 0, textTransform: 'capitalize' }, children: [session.category, " Aptitude"] }), _jsxs("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem' }, children: [_jsx("span", { style: { textTransform: 'capitalize' }, children: session.difficulty }), " | Question ", currentIndex + 1, " of ", questions.length] })] }), _jsx("div", { style: { textAlign: 'right' }, children: !isSessionComplete ? (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeRemaining < 60 ? 'var(--error)' : 'var(--text-main)', fontWeight: 600, fontSize: '1.25rem' }, children: [_jsx(Clock, { size: 20 }), " ", formatTime(timeRemaining)] })) : (_jsx(Button, { variant: "outline", size: "sm", onClick: () => { setIsReviewMode(false); setSession(null); }, children: "Exit Review" })) })] }), _jsxs(Card, { style: { marginBottom: '1.5rem', padding: '2rem' }, children: [_jsx("div", { style: { fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }, children: currentQ.question }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: currentQ.options.map((opt, idx) => {
                                const isSelected = selectedOpt === idx;
                                let bgColor = 'var(--bg-surface-elevated)';
                                let borderColor = 'var(--border-color)';
                                if (isSelected) {
                                    bgColor = 'var(--bg-active)';
                                    borderColor = 'var(--primary)';
                                }
                                if (isReviewMode) {
                                    const isCorrect = idx === currentQ.correctOption;
                                    if (isCorrect) {
                                        bgColor = 'rgba(16, 185, 129, 0.1)';
                                        borderColor = 'var(--success)';
                                    }
                                    else if (isSelected && !isCorrect) {
                                        bgColor = 'rgba(239, 68, 68, 0.1)';
                                        borderColor = 'var(--error)';
                                    }
                                }
                                return (_jsxs("div", { onClick: () => handleSelectOption(idx), style: {
                                        padding: '1rem 1.25rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: `1.5px solid ${borderColor}`,
                                        background: bgColor,
                                        cursor: isSessionComplete ? 'default' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        transition: 'all 0.2s'
                                    }, children: [_jsx("div", { style: {
                                                width: 20, height: 20, borderRadius: '50%',
                                                border: `2px solid ${isSelected || (isReviewMode && idx === currentQ.correctOption) ? borderColor : 'var(--text-secondary)'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }, children: (isSelected || (isReviewMode && idx === currentQ.correctOption)) && (_jsx("div", { style: { width: 10, height: 10, borderRadius: '50%', background: borderColor } })) }), _jsx("span", { style: { fontSize: '1rem', color: 'var(--text-main)' }, children: opt }), isReviewMode && idx === currentQ.correctOption && (_jsx(CheckCircle2, { size: 18, color: "var(--success)", style: { marginLeft: 'auto' } })), isReviewMode && isSelected && idx !== currentQ.correctOption && (_jsx(XCircle, { size: 18, color: "var(--error)", style: { marginLeft: 'auto' } }))] }, idx));
                            }) }), isReviewMode && currentQ.explanation && (_jsxs("div", { style: { marginTop: '2rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }, children: [_jsx("div", { style: { fontWeight: 600, marginBottom: '0.5rem' }, children: "Explanation:" }), _jsx("div", { style: { color: 'var(--text-secondary)', lineHeight: 1.5 }, children: currentQ.explanation })] }))] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(Button, { variant: "outline", icon: _jsx(ArrowLeft, { size: 18 }), onClick: () => setCurrentIndex(prev => Math.max(0, prev - 1)), disabled: currentIndex === 0, children: "Previous" }), _jsxs("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem' }, children: [Object.keys(answers).length, " / ", questions.length, " Answered"] }), currentIndex < questions.length - 1 ? (_jsx(Button, { variant: "primary", icon: _jsx(ArrowRight, { size: 18 }), iconPosition: "right", onClick: () => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1)), children: "Next" })) : (!isSessionComplete && (_jsx(Button, { variant: "primary", icon: _jsx(CheckCircle2, { size: 18 }), onClick: () => handleCompleteSession(), loading: isSubmitting, children: "Submit Test" })))] })] }));
    }
    // Final Results Phase
    if (isSessionComplete && finalResult && !isReviewMode) {
        return (_jsxs("div", { style: { maxWidth: 800, margin: '0 auto', width: '100%' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '2.5rem' }, children: [_jsx(Award, { size: 64, color: "var(--primary)", style: { marginBottom: '1rem' } }), _jsx("h2", { style: { fontSize: '2rem', marginBottom: '0.5rem' }, children: "Aptitude Complete \uD83C\uDF89" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '1.1rem' }, children: "Your results have been recorded in the Progress Engine." })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }, children: [_jsxs(Card, { style: { textAlign: 'center', padding: '2rem' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.1rem' }, children: "Score" }), _jsxs("div", { style: { fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }, children: [finalResult.score, " ", _jsxs("span", { style: { fontSize: '1.25rem', color: 'var(--text-dim)' }, children: ["/ ", finalResult.total_questions] })] })] }), _jsxs(Card, { style: { textAlign: 'center', padding: '2rem' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.1rem' }, children: "Accuracy" }), _jsxs("div", { style: { fontSize: '3rem', fontWeight: 800, color: 'var(--success)' }, children: [finalResult.accuracy, "%"] })] })] }), _jsxs(Card, { style: { marginBottom: '2.5rem' }, children: [_jsx("h3", { style: { marginBottom: '1.5rem', fontSize: '1.25rem' }, children: "Performance Breakdown" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }, children: [_jsxs("span", { style: { color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(CheckCircle2, { size: 16, color: "var(--success)" }), " Correct"] }), _jsx("span", { style: { fontWeight: 600 }, children: finalResult.correct })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }, children: [_jsxs("span", { style: { color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(XCircle, { size: 16, color: "var(--error)" }), " Incorrect"] }), _jsx("span", { style: { fontWeight: 600 }, children: finalResult.incorrect })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }, children: [_jsxs("span", { style: { color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(ListOrdered, { size: 16, color: "var(--warning)" }), " Unanswered"] }), _jsx("span", { style: { fontWeight: 600 }, children: finalResult.unanswered })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }, children: [_jsxs("span", { style: { color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Clock, { size: 16, color: "var(--primary)" }), " Time Taken"] }), _jsx("span", { style: { fontWeight: 600 }, children: formatTime(finalResult.time_taken) })] })] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }, children: [_jsx(Button, { variant: "outline", icon: _jsx(BookOpen, { size: 18 }), onClick: () => { setIsReviewMode(true); setCurrentIndex(0); }, children: "Review Answers" }), _jsx(Button, { variant: "primary", icon: _jsx(RefreshCcw, { size: 18 }), onClick: () => setSession(null), children: "Practice Again" })] })] }));
    }
    // Setup / Landing Phase
    return (_jsxs("div", { style: { maxWidth: 1100, margin: '0 auto', width: '100%' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }, children: [_jsx(PageHeader, { title: "ARENA Aptitude", description: "Practice. Improve. Compete.", icon: _jsx(BrainCircuit, { size: 28 }) }), _jsx(Button, { variant: "outline", icon: _jsx(BarChart, { size: 16 }), onClick: () => setShowHistory(true), children: "View History" })] }), _jsxs("div", { style: { textAlign: 'center', marginBottom: '3rem' }, children: [_jsx("h2", { style: { fontSize: '1.75rem', marginBottom: '1rem' }, children: "Select Aptitude Category" }), _jsx("p", { style: { color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }, children: "Master quantitative, verbal, and logical reasoning to prepare for elite placement tests." })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }, children: CATEGORIES.map(cat => (_jsxs(Card, { style: {
                        opacity: cat.available ? 1 : 0.7,
                        border: selectedCategory === cat.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        cursor: cat.available ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        transform: selectedCategory === cat.id ? 'translateY(-4px)' : 'none'
                    }, onClick: () => {
                        if (cat.available) {
                            if (cat.path && cat.path !== '/aptitude') {
                                navigate(cat.path);
                            }
                            else {
                                setSelectedCategory(cat.id);
                            }
                        }
                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }, children: [_jsx("div", { style: {
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: cat.available ? 'var(--primary-gradient)' : 'var(--bg-surface-elevated)',
                                        color: '#fff'
                                    }, children: _jsx(Target, { size: 24 }) }), !cat.available && _jsx(Badge, { variant: "neutral", children: cat.milestone }), cat.available && _jsx(Badge, { variant: "success", children: "Active" })] }), _jsx("h3", { style: { fontSize: '1.2rem', marginBottom: '0.5rem' }, children: cat.label })] }, cat.id))) }), _jsxs(Card, { style: { maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '2rem' }, children: [_jsxs("h3", { style: { marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }, children: [_jsx(Settings, { size: 20 }), " Practice Settings"] }), _jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 500 }, children: "Select Difficulty" }), _jsx("div", { style: { display: 'flex', gap: '1rem', justifyContent: 'center' }, children: ['easy', 'medium', 'hard'].map(level => (_jsx(Button, { variant: difficulty === level ? 'primary' : 'outline', onClick: () => setDifficulty(level), style: { flex: 1, maxWidth: 120, textTransform: 'capitalize' }, children: level }, level))) })] }), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, icon: _jsx(Play, { size: 18 }), loading: loading, onClick: handleStartSession, style: { maxWidth: 300 }, children: "Start Practice Session" }), errorMessage && (_jsx("div", { style: { color: 'var(--error)', marginTop: '1rem', fontSize: '0.9rem' }, children: errorMessage }))] })] }));
};
//# sourceMappingURL=AptitudePage.js.map