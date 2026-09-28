import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startFluencySession, submitFluencyTurn, completeFluencySession, getFluencySessionHistory, FluencyEvaluationData, FluencyHistoryItem, FluencyStartResponseData, } from '../services/fluencyService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VoiceInput } from '../components/communication/VoiceInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Mic, Send, Award, TrendingUp, CheckCircle2, AlertCircle, Play, RotateCcw, ArrowLeft, Sparkles, Zap, } from 'lucide-react';
const TOPIC_OPTIONS = [
    "Introduce yourself and your career goals",
    "My college experience and key learnings",
    "Technology's role in modern education",
    "A major technical challenge I solved",
    "The importance of effective communication",
    "Teamwork and handling project conflicts",
    "Time management strategies during exams",
];
export const FluencyPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    // Session State
    const [session, setSession] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0]);
    const [difficulty, setDifficulty] = useState('medium');
    // Turn State
    const [currentTurn, setCurrentTurn] = useState(1);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [responseText, setResponseText] = useState('');
    const [turnEvaluations, setTurnEvaluations] = useState([]);
    const [latestEvaluation, setLatestEvaluation] = useState(null);
    // Status & History
    const [loading, setLoading] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [finalResult, setFinalResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        if (currentUser) {
            loadHistoryData(currentUser.uid);
        }
    }, [currentUser]);
    const loadHistoryData = async (uid) => {
        try {
            const hist = await getFluencySessionHistory(uid);
            setHistory(hist);
        }
        catch (e) {
            console.error('[FluencyPage] Error loading history:', e);
        }
    };
    const handleStartSession = async () => {
        if (!currentUser)
            return;
        setLoading(true);
        setErrorMessage(null);
        setIsSessionComplete(false);
        setFinalResult(null);
        setTurnEvaluations([]);
        setLatestEvaluation(null);
        setCurrentTurn(1);
        try {
            const data = await startFluencySession(currentUser.uid, difficulty, selectedTopic);
            setSession(data);
            setCurrentPrompt(data.prompt);
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to start Fluency session.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmitTurn = async () => {
        if (!currentUser || !session || !responseText.trim() || isEvaluating)
            return;
        if (responseText.trim().length < 10) {
            setErrorMessage('Please provide a little more detail in your response for accurate evaluation.');
            return;
        }
        setIsEvaluating(true);
        setErrorMessage(null);
        try {
            const data = await submitFluencyTurn(currentUser.uid, session.session_id, responseText.trim(), currentTurn, difficulty);
            const updatedEvals = [...turnEvaluations, data.evaluation];
            setTurnEvaluations(updatedEvals);
            setLatestEvaluation(data.evaluation);
            setResponseText('');
            if (data.is_completed || currentTurn >= 5) {
                // Complete 5-turn session
                const completion = await completeFluencySession(currentUser.uid, session.session_id, updatedEvals);
                setFinalResult(completion);
                setIsSessionComplete(true);
                loadHistoryData(currentUser.uid);
            }
            else {
                // Move to next turn
                setCurrentTurn((prev) => prev + 1);
                setCurrentPrompt(data.next_prompt);
            }
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to evaluate response. Please try again.');
        }
        finally {
            setIsEvaluating(false);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitTurn();
        }
    };
    if (loading) {
        return (_jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, { message: "Starting AI Fluency Practice Session...", size: 22 }) }));
    }
    return (_jsxs("div", { style: { maxWidth: 1050, margin: '0 auto', width: '100%' }, children: [_jsx(PageHeader, { title: "Spoken & Written Fluency Module", description: "Improve English speaking rhythm, vocabulary flow, and sentence clarity through 5-turn AI practice sessions.", icon: _jsx(Mic, { size: 24 }), action: _jsx(Button, { variant: "outline", size: "sm", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/communication'), children: "Communication Landing" }) }), errorMessage && (_jsxs("div", { className: "error-alert", style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "error-alert-header", children: [_jsx(AlertCircle, { size: 18 }), _jsx("span", { className: "error-title", children: "Fluency Error" })] }), _jsx("div", { className: "error-message", style: { marginBottom: 0 }, children: errorMessage })] })), !session && !isSessionComplete && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }, children: [_jsxs(Card, { style: { gridColumn: 'span 2' }, children: [_jsxs("div", { className: "arena-card-header", style: { marginBottom: '1.25rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Sparkles, { size: 20, style: { color: 'var(--primary)' } }), _jsx("h2", { className: "card-title", children: "Setup Your Fluency Practice Session" })] }), _jsx(Badge, { variant: "primary", children: "5-Turn AI Coaching" })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }, children: "Select Practice Topic" }), _jsx("select", { value: selectedTopic, onChange: (e) => setSelectedTopic(e.target.value), style: {
                                                    width: '100%',
                                                    padding: '0.75rem 0.9rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-input)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                    fontSize: '0.95rem',
                                                }, children: TOPIC_OPTIONS.map((t, idx) => (_jsx("option", { value: t, children: t }, idx))) })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }, children: "Select Difficulty Level" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }, children: ['easy', 'medium', 'hard'].map((level) => (_jsx("button", { type: "button", onClick: () => setDifficulty(level), style: {
                                                        padding: '0.75rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: difficulty === level ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                        background: difficulty === level ? 'var(--primary-light)' : 'var(--bg-surface-elevated)',
                                                        color: difficulty === level ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                    }, children: level }, level))) })] })] }), _jsx(Button, { variant: "primary", fullWidth: true, size: "lg", icon: _jsx(Play, { size: 18 }), onClick: handleStartSession, children: "Start Fluency Practice" })] }), _jsxs(Card, { style: { gridColumn: 'span 1' }, children: [_jsx("div", { className: "arena-card-header", style: { marginBottom: '1rem' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(TrendingUp, { size: 18, style: { color: 'var(--secondary)' } }), _jsx("h3", { className: "card-title", children: "Fluency History" })] }) }), history.length === 0 ? (_jsx(EmptyState, { title: "No completed sessions yet", description: "Complete your first 5-turn session to see your fluency score history.", icon: _jsx(Award, { size: 28 }) })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: history.slice(0, 5).map((item) => (_jsxs("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.65rem 0.85rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-surface-elevated)',
                                        border: '1px solid var(--border-color)',
                                    }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }, children: item.dateStr }), _jsxs("div", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' }, children: ["Difficulty: ", item.difficulty] })] }), _jsxs(Badge, { variant: "success", style: { fontWeight: 800 }, children: [item.score, " / 100"] })] }, item.sessionId))) }))] })] })), session && !isSessionComplete && (_jsxs("div", { children: [_jsxs(Card, { style: { marginBottom: '1.25rem', padding: '0.85rem 1.25rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsxs(Badge, { variant: "primary", children: ["Turn ", currentTurn, " of 5"] }), _jsxs(Badge, { variant: "neutral", style: { textTransform: 'capitalize' }, children: ["Difficulty: ", difficulty] }), _jsxs("span", { style: { fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }, children: ["Topic: ", session.topic] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                            setSession(null);
                                            setCurrentTurn(1);
                                        }, children: "Exit Session" })] }), _jsx("div", { style: { display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }, children: [1, 2, 3, 4, 5].map((step) => (_jsx("div", { style: {
                                        flex: 1,
                                        height: 6,
                                        borderRadius: 3,
                                        background: step < currentTurn
                                            ? 'var(--success)'
                                            : step === currentTurn
                                                ? 'var(--primary)'
                                                : 'var(--bg-surface-elevated)',
                                    } }, step))) })] }), _jsx(Card, { style: { marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }, children: [_jsx("div", { style: {
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        background: 'var(--primary-gradient)',
                                        color: '#ffffff',
                                        display: 'flex',
                                    }, children: _jsx(Sparkles, { size: 20 }) }), _jsxs("div", { children: [_jsxs("span", { style: { fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }, children: ["AI Coach Prompt (Turn ", currentTurn, ")"] }), _jsx("p", { style: { fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: 1.5 }, children: currentPrompt })] })] }) }), _jsxs(Card, { style: { marginBottom: '1.5rem' }, children: [_jsx("label", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }, children: "Your Response (Speak via Microphone or Type Below)" }), _jsx("textarea", { rows: 4, placeholder: "Speak using the voice button or type your response here... (Press Enter to submit)", value: responseText, onChange: (e) => setResponseText(e.target.value), onKeyDown: handleKeyDown, disabled: isEvaluating, style: {
                                    width: '100%',
                                    padding: '0.85rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.95rem',
                                    resize: 'vertical',
                                    outline: 'none',
                                    marginBottom: '0.75rem',
                                } }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx(VoiceInput, { disabled: isEvaluating, onSpeechResult: (text) => setResponseText((prev) => (prev ? `${prev} ${text}` : text)) }), _jsxs("span", { style: { fontSize: '0.75rem', color: 'var(--text-dim)' }, children: [responseText.length, " chars"] })] }), _jsx(Button, { variant: "primary", icon: _jsx(Send, { size: 16 }), loading: isEvaluating, disabled: !responseText.trim() || isEvaluating, onClick: handleSubmitTurn, children: currentTurn === 5 ? 'Submit & Complete Session' : 'Submit Turn Response' })] })] }), latestEvaluation && (_jsxs(Card, { style: { marginBottom: '1.5rem', border: '1px solid var(--border-color-glow)' }, children: [_jsxs("div", { className: "arena-card-header", style: { marginBottom: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Zap, { size: 18, style: { color: 'var(--warning)' } }), _jsxs("h3", { className: "card-title", children: ["Turn ", currentTurn - 1, " AI Evaluation Breakdown"] })] }), _jsxs(Badge, { variant: "success", style: { fontSize: '0.9rem', fontWeight: 800 }, children: ["Turn Score: ", latestEvaluation.overallScore, " / 100"] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }, children: [
                                    { name: 'Grammar', val: latestEvaluation.grammar },
                                    { name: 'Vocabulary', val: latestEvaluation.vocabulary },
                                    { name: 'Structure', val: latestEvaluation.sentenceStructure },
                                    { name: 'Clarity', val: latestEvaluation.clarity },
                                    { name: 'Coherence', val: latestEvaluation.coherence },
                                    { name: 'Relevance', val: latestEvaluation.relevance },
                                    { name: 'Fluency', val: latestEvaluation.fluency },
                                ].map((cat, i) => (_jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }, children: [_jsx("span", { style: { color: 'var(--text-muted)' }, children: cat.name }), _jsx("span", { style: { fontWeight: 700 }, children: cat.val })] }), _jsx("div", { className: "skill-track", style: { height: 4 }, children: _jsx("div", { className: "skill-fill", style: { width: `${cat.val}%` } }) })] }, i))) }), latestEvaluation.betterVersion && (_jsxs("div", { style: {
                                    padding: '0.85rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-surface-elevated)',
                                    border: '1px solid var(--border-color)',
                                    marginBottom: '1rem',
                                }, children: [_jsx("div", { style: { fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }, children: "Suggested Polished Version:" }), _jsxs("div", { style: { fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--text-main)' }, children: ["\"", latestEvaluation.betterVersion, "\""] })] })), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.3rem' }, children: "\u2713 Key Strengths" }), _jsx("ul", { style: { paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }, children: latestEvaluation.strengths.map((s, i) => (_jsx("li", { children: s }, i))) })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.3rem' }, children: "\u2022 Areas to Refine" }), _jsx("ul", { style: { paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }, children: latestEvaluation.improvements.map((imp, i) => (_jsx("li", { children: imp }, i))) })] })] })] }))] })), isSessionComplete && finalResult && (_jsxs(Card, { style: {
                    textAlign: 'center',
                    padding: '2.5rem 1.5rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(34, 197, 94, 0.08) 100%)',
                    border: '2px solid var(--border-color-glow)',
                }, children: [_jsx("div", { style: {
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: 'var(--primary-gradient)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                            boxShadow: 'var(--shadow-glow)',
                        }, children: _jsx(CheckCircle2, { size: 36 }) }), _jsx("h2", { className: "section-title", style: { fontSize: '1.85rem', marginBottom: '0.35rem' }, children: "Fluency Session Complete! \uD83C\uDF89" }), _jsx("p", { style: { fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }, children: finalResult.summary }), _jsxs("div", { style: {
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 140,
                            height: 140,
                            borderRadius: '50%',
                            border: '4px solid var(--primary)',
                            background: 'var(--bg-surface-elevated)',
                            marginBottom: '1.75rem',
                        }, children: [_jsx("span", { style: { fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }, children: finalResult.overall_score }), _jsx("span", { style: { fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }, children: "out of 100" }), _jsx(Badge, { variant: "primary", style: { marginTop: '0.35rem', fontSize: '0.62rem' }, children: "AI Evaluation" })] }), _jsx("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                            gap: '0.85rem',
                            maxWidth: 800,
                            margin: '0 auto 2rem',
                            textAlign: 'left',
                        }, children: Object.entries(finalResult.category_breakdown || {}).map(([key, scoreVal], idx) => (_jsxs("div", { style: { background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }, children: key }), _jsxs("div", { style: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }, children: [scoreVal, " / 100"] })] }, idx))) }), _jsxs("div", { style: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }, children: [_jsx(Button, { variant: "secondary", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/communication'), children: "Back to Communication" }), _jsx(Button, { variant: "primary", icon: _jsx(RotateCcw, { size: 16 }), onClick: () => {
                                    setSession(null);
                                    setIsSessionComplete(false);
                                    setFinalResult(null);
                                }, children: "Practice Again" })] })] }))] }));
};
//# sourceMappingURL=FluencyPage.js.map