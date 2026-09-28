import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startSituationalSession, submitSituationalTurn, completeSituationalSession, getSituationalSessionHistory, SituationalEvaluationData, SituationalHistoryItem, SituationalStartResponseData, } from '../services/situationalCommunicationService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VoiceInput } from '../components/communication/VoiceInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Sparkles, AlertCircle, ArrowLeft, Send, CheckCircle2, } from 'lucide-react';
const CATEGORY_OPTIONS = [
    { id: 'college_situation', label: 'College Situation' },
    { id: 'team_situation', label: 'Team Situation' },
    { id: 'workplace_situation', label: 'Workplace Situation' },
    { id: 'manager_situation', label: 'Manager Situation' },
    { id: 'customer_situation', label: 'Customer Situation' },
    { id: 'conflict_situation', label: 'Conflict Situation' },
    { id: 'interview_situation', label: 'Interview Situation' },
    { id: 'leadership_situation', label: 'Leadership Situation' },
    { id: 'problem_solving_situation', label: 'Problem-Solving Situation' },
    { id: 'professional_etiquette', label: 'Professional Etiquette' },
];
export const SituationalCommunicationPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    // Session State
    const [session, setSession] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0].id);
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
            const hist = await getSituationalSessionHistory(uid);
            setHistory(hist);
        }
        catch (e) {
            console.error('[SituationalCommunicationPage] Error loading history:', e);
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
            const data = await startSituationalSession(currentUser.uid, selectedCategory, difficulty);
            setSession(data);
            setCurrentPrompt(data.scenario);
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to start Situational session.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmitTurn = async () => {
        if (!currentUser || !session || !responseText.trim() || isEvaluating)
            return;
        if (responseText.trim().length < 5) {
            setErrorMessage('Please explain how you would respond in this situation.');
            return;
        }
        setIsEvaluating(true);
        setErrorMessage(null);
        try {
            const data = await submitSituationalTurn(currentUser.uid, session.session_id, responseText.trim(), currentTurn, session.category, session.difficulty);
            const updatedEvals = [...turnEvaluations, data.evaluation];
            setTurnEvaluations(updatedEvals);
            setLatestEvaluation(data.evaluation);
            setResponseText('');
            if (data.is_completed || currentTurn >= 5) {
                const completion = await completeSituationalSession(currentUser.uid, session.session_id, session.category, session.difficulty, updatedEvals);
                setFinalResult(completion);
                setIsSessionComplete(true);
                loadHistoryData(currentUser.uid);
            }
            else {
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
        return (_jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, { message: "Generating situation...", size: 22 }) }));
    }
    return (_jsxs("div", { style: { maxWidth: 1050, margin: '0 auto', width: '100%' }, children: [_jsx(PageHeader, { title: "Situational Communication", description: "Practice real-world workplace, team, and placement situations.", icon: _jsx(Sparkles, { size: 24 }), action: _jsx(Button, { variant: "outline", size: "sm", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/communication'), children: "Communication Landing" }) }), errorMessage && (_jsxs("div", { className: "error-alert", style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "error-alert-header", children: [_jsx(AlertCircle, { size: 18 }), _jsx("span", { className: "error-title", children: "Error" })] }), _jsx("div", { className: "error-message", style: { marginBottom: 0 }, children: errorMessage })] })), !session && !isSessionComplete && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }, children: [_jsxs(Card, { style: { gridColumn: 'span 2' }, children: [_jsxs("div", { className: "arena-card-header", style: { marginBottom: '1.25rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Sparkles, { size: 20, style: { color: 'var(--primary)' } }), _jsx("h2", { className: "card-title", children: "Setup Practice Session" })] }), _jsx(Badge, { variant: "primary", children: "5-Turn Session" })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }, children: "Select Scenario Category" }), _jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), style: {
                                                    width: '100%',
                                                    padding: '0.75rem 0.9rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-input)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                    fontSize: '0.95rem',
                                                }, children: CATEGORY_OPTIONS.map((c) => (_jsx("option", { value: c.id, children: c.label }, c.id))) })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }, children: "Select Difficulty" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }, children: ['easy', 'medium', 'hard'].map((level) => (_jsx("button", { type: "button", onClick: () => setDifficulty(level), style: {
                                                        padding: '0.75rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: difficulty === level ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                        background: difficulty === level ? 'var(--primary-light)' : 'var(--bg-surface-elevated)',
                                                        color: difficulty === level ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        textTransform: 'capitalize',
                                                        transition: 'all 0.2s ease',
                                                    }, children: level }, level))) })] })] }), _jsx(Button, { variant: "primary", fullWidth: true, size: "lg", onClick: handleStartSession, children: "Generate Situation & Start" })] }), _jsxs(Card, { style: { gridColumn: 'span 2' }, children: [_jsx("div", { className: "arena-card-header", style: { marginBottom: '1.25rem' }, children: _jsx("h3", { className: "card-title", style: { fontSize: '1.1rem' }, children: "Session History" }) }), history.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }, children: "Complete more sessions to see your progress." })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: history.map((h, i) => (_jsxs("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 1rem',
                                        background: 'var(--bg-surface-elevated)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-color)',
                                    }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }, children: CATEGORY_OPTIONS.find(c => c.id === h.category)?.label || h.category }), _jsxs("div", { style: { fontSize: '0.75rem', color: 'var(--text-muted)' }, children: [h.dateStr, " \u2022 ", h.difficulty] })] }), _jsxs("div", { style: { fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }, children: [h.score, "/100"] })] }, i))) }))] })] })), session && !isSessionComplete && (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h2", { style: { fontSize: '1.25rem', fontWeight: 600 }, children: "Situational Practice" }), _jsxs(Badge, { variant: "neutral", children: ["Interaction ", currentTurn, " of 5"] })] }), _jsxs(Card, { style: { background: 'var(--primary-light)', borderColor: 'var(--primary)' }, children: [_jsx("div", { style: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }, children: "SITUATION" }), _jsx("div", { style: { fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-main)' }, children: currentPrompt })] }), _jsx(Card, { children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: [_jsx("div", { style: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }, children: "Your Response:" }), _jsx("textarea", { rows: 5, placeholder: "How would you respond in this situation? (Type or speak)", value: responseText, onChange: (e) => setResponseText(e.target.value), onKeyDown: handleKeyDown, disabled: isEvaluating, style: {
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.95rem',
                                        resize: 'vertical',
                                        outline: 'none',
                                    } }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }, children: [_jsx(VoiceInput, { disabled: isEvaluating, onSpeechResult: (text) => setResponseText((prev) => (prev ? `${prev} ${text}` : text)) }), _jsx(Button, { variant: "primary", icon: _jsx(Send, { size: 16 }), loading: isEvaluating, disabled: !responseText.trim() || isEvaluating, onClick: handleSubmitTurn, children: "Submit Response" })] })] }) }), latestEvaluation && (_jsxs(Card, { style: { marginTop: '1rem', borderLeft: '4px solid var(--success-main)' }, children: [_jsx("h3", { style: { fontSize: '1.1rem', marginBottom: '1rem' }, children: "AI Evaluation" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }, children: [_jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }, children: [latestEvaluation.overallScore, "/100"] }), _jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-muted)' }, children: "Score" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--success-main)', marginBottom: '0.5rem' }, children: "STRENGTHS" }), _jsx("ul", { style: { paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: latestEvaluation.strengths.map((s, idx) => (_jsx("li", { style: { marginBottom: '0.25rem' }, children: s }, idx))) })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--warning-main)', marginBottom: '0.5rem' }, children: "TO IMPROVE" }), _jsx("ul", { style: { paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: latestEvaluation.improvements.map((s, idx) => (_jsx("li", { style: { marginBottom: '0.25rem' }, children: s }, idx))) })] })] }), latestEvaluation.betterResponse && (_jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }, children: "BETTER RESPONSE SUGGESTION" }), _jsxs("div", { style: { fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontStyle: 'italic' }, children: ["\"", latestEvaluation.betterResponse, "\""] })] }))] }))] })), isSessionComplete && finalResult && (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }, children: _jsxs(Card, { style: { width: '100%', maxWidth: 700, textAlign: 'center', padding: '3rem 2rem' }, children: [_jsx(CheckCircle2, { size: 48, style: { color: 'var(--success-main)', margin: '0 auto 1.5rem' } }), _jsx("h2", { style: { fontSize: '1.75rem', marginBottom: '0.5rem' }, children: "Situational Session Complete" }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: '2.5rem' }, children: finalResult.summary }), _jsx("div", { style: { display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }, children: _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }, children: "OVERALL SCORE" }), _jsx("div", { style: { fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }, children: finalResult.overall_score }), _jsx("div", { style: { fontSize: '1rem', color: 'var(--text-muted)' }, children: "out of 100" })] }) }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'left', marginBottom: '2.5rem' }, children: Object.entries(finalResult.category_breakdown).map(([key, val]) => (_jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }, children: [_jsx("div", { style: { fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }, children: key }), _jsxs("div", { style: { fontSize: '1.1rem', fontWeight: 600 }, children: [String(val), "/100"] })] }, key))) }), _jsxs("div", { style: { display: 'flex', gap: '1rem', justifyContent: 'center' }, children: [_jsx(Button, { variant: "outline", onClick: () => navigate('/communication'), children: "Back to Communication" }), _jsx(Button, { variant: "primary", onClick: () => {
                                        setSession(null);
                                        setIsSessionComplete(false);
                                    }, children: "Practice Again" })] })] }) }))] }));
};
//# sourceMappingURL=SituationalCommunicationPage.js.map