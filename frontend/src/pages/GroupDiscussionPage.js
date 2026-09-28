import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { startGroupDiscussion, respondGroupDiscussion, completeGroupDiscussion, getGroupDiscussionHistory, GroupDiscussionStartResponse, GroupDiscussionHistoryItem, GroupDiscussionSummary } from '../services/groupDiscussionService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VoiceInput } from '../components/communication/VoiceInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Users, Send, Award, TrendingUp, CheckCircle2, AlertCircle, Play, ArrowLeft, Settings, BarChart } from 'lucide-react';
const CATEGORIES = [
    'Technology', 'Education', 'Business', 'Society', 'Environment',
    'Career', 'Current Trends', 'Abstract Topics', 'Workplace', 'Placement Topics'
];
export const GroupDiscussionPage = () => {
    const { currentUser } = useAuth();
    // Session State
    const [session, setSession] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [difficulty, setDifficulty] = useState('medium');
    const [currentRound, setCurrentRound] = useState(1);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    // Status & History
    const [loading, setLoading] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [finalResult, setFinalResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    useEffect(() => {
        if (currentUser) {
            loadHistoryData(currentUser.uid);
        }
    }, [currentUser]);
    const loadHistoryData = async (uid) => {
        try {
            const hist = await getGroupDiscussionHistory(uid);
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
        setFinalResult(null);
        setCurrentRound(1);
        setMessages([]);
        try {
            const data = await startGroupDiscussion(currentUser.uid, selectedCategory, difficulty);
            setSession(data);
            setMessages([{ role: 'moderator', content: data.moderator_intro }]);
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to start Group Discussion session.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSendMessage = async () => {
        if (!currentUser || !session || !inputText.trim() || isEvaluating)
            return;
        const textToSend = inputText.trim();
        setInputText('');
        setIsEvaluating(true);
        setErrorMessage(null);
        const studentMsg = { role: 'student', content: textToSend };
        const updatedMessages = [...messages, studentMsg];
        setMessages(updatedMessages);
        try {
            if (currentRound >= 5) {
                // Complete the session
                const summary = await completeGroupDiscussion(currentUser.uid, session.session_id, session.topic, session.category, session.difficulty, updatedMessages);
                setFinalResult(summary);
                setIsSessionComplete(true);
                loadHistoryData(currentUser.uid);
            }
            else {
                const data = await respondGroupDiscussion(currentUser.uid, session.session_id, textToSend, currentRound, session.topic, updatedMessages);
                setCurrentRound(data.round);
                const aiMessages = data.ai_responses.map(resp => ({
                    role: resp.speaker,
                    content: resp.content
                }));
                setMessages(prev => [...prev, ...aiMessages]);
                if (data.is_complete) {
                    // If the AI says it's complete, end it (though we track round client side primarily)
                    const summary = await completeGroupDiscussion(currentUser.uid, session.session_id, session.topic, session.category, session.difficulty, [...updatedMessages, ...aiMessages]);
                    setFinalResult(summary);
                    setIsSessionComplete(true);
                    loadHistoryData(currentUser.uid);
                }
            }
        }
        catch (err) {
            setErrorMessage('Failed to generate AI response. Please try again.');
        }
        finally {
            setIsEvaluating(false);
        }
    };
    const getSpeakerLabel = (role) => {
        if (role === 'student')
            return 'You';
        if (role === 'moderator')
            return 'Moderator';
        if (role === 'participant_A')
            return 'AI Participant A';
        if (role === 'participant_B')
            return 'AI Participant B';
        if (role === 'participant_C')
            return 'AI Participant C';
        return role;
    };
    const getSpeakerColor = (role) => {
        if (role === 'student')
            return 'var(--primary)';
        if (role === 'moderator')
            return 'var(--text-secondary)';
        if (role === 'participant_A')
            return '#eab308';
        if (role === 'participant_B')
            return '#3b82f6';
        if (role === 'participant_C')
            return '#10b981';
        return 'var(--text-secondary)';
    };
    if (showHistory) {
        return (_jsxs("div", { style: { maxWidth: 1000, margin: '0 auto', width: '100%' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 18 }), onClick: () => setShowHistory(false), style: { marginRight: '1rem' }, children: "Back" }), _jsx("h2", { className: "section-title", style: { margin: 0 }, children: "Group Discussion History" })] }), history.length === 0 ? (_jsx(EmptyState, { icon: _jsx(TrendingUp, {}), title: "No History Yet", description: "Complete your first group discussion to see your progress." })) : (_jsx("div", { style: { display: 'grid', gap: '1rem' }, children: history.map((h, i) => (_jsxs(Card, { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: '1.1rem' }, children: h.topic }), _jsxs("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }, children: [h.dateStr, " \u2014 ", h.category, " \u2014 ", h.difficulty] })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsx(Badge, { variant: h.status === 'completed' ? 'success' : 'neutral', children: h.status.toUpperCase() }), h.status === 'completed' && (_jsxs("div", { style: { fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem', color: 'var(--primary)' }, children: [h.score, "/100"] }))] })] }, i))) }))] }));
    }
    return (_jsxs("div", { style: { maxWidth: 1100, margin: '0 auto', width: '100%' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }, children: [_jsx(PageHeader, { title: "Group Discussion", description: "Simulate a realistic placement group discussion with AI participants.", icon: _jsx(Users, { size: 24 }) }), !session && (_jsx(Button, { variant: "outline", icon: _jsx(BarChart, { size: 16 }), onClick: () => setShowHistory(true), children: "View History" }))] }), errorMessage && (_jsxs("div", { className: "error-alert", style: { marginBottom: '1.5rem' }, children: [_jsx(AlertCircle, { size: 18 }), " ", errorMessage] })), !session && !isSessionComplete && (_jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: 600, margin: '0 auto' }, children: _jsxs(Card, { children: [_jsxs("h3", { style: { marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Settings, { size: 18 }), " Session Settings"] }), _jsxs("div", { style: { marginBottom: '1.25rem' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '0.5rem', fontWeight: 500 }, children: "Category" }), _jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), style: { width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }, children: CATEGORIES.map(c => _jsx("option", { value: c, children: c }, c)) })] }), _jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '0.5rem', fontWeight: 500 }, children: "Difficulty" }), _jsx("div", { style: { display: 'flex', gap: '1rem' }, children: ['easy', 'medium', 'hard'].map(level => (_jsx(Button, { variant: difficulty === level ? 'primary' : 'outline', onClick: () => setDifficulty(level), style: { flex: 1, textTransform: 'capitalize' }, children: level }, level))) })] }), _jsx(Button, { variant: "primary", fullWidth: true, size: "lg", icon: _jsx(Play, { size: 18 }), loading: loading, onClick: handleStartSession, children: "Start Group Discussion" })] }) })), session && !isSessionComplete && (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: [_jsx(Card, { style: { borderLeft: '4px solid var(--primary)' }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }, children: "Topic" }), _jsx("h3", { style: { fontSize: '1.2rem', margin: 0 }, children: session.topic })] }), _jsxs(Badge, { variant: "neutral", children: ["Round ", currentRound, " / 5"] })] }) }), _jsxs(Card, { style: { minHeight: '400px', maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }, children: [messages.map((msg, idx) => {
                                const isStudent = msg.role === 'student';
                                return (_jsxs("div", { style: { alignSelf: isStudent ? 'flex-end' : 'flex-start', maxWidth: '80%' }, children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textAlign: isStudent ? 'right' : 'left' }, children: getSpeakerLabel(msg.role) }), _jsx("div", { style: {
                                                background: isStudent ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                                                color: isStudent ? '#fff' : 'var(--text-main)',
                                                padding: '0.85rem 1.25rem',
                                                borderRadius: 'var(--radius-lg)',
                                                borderLeft: !isStudent ? `3px solid ${getSpeakerColor(msg.role)}` : 'none',
                                                lineHeight: 1.5
                                            }, children: msg.content })] }, idx));
                            }), isEvaluating && (_jsxs("div", { style: { alignSelf: 'flex-start', color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(LoadingSpinner, {}), " AI is typing..."] }))] }), _jsx(Card, { children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsx("div", { style: { fontWeight: 500 }, children: "Your Contribution:" }), _jsx("textarea", { rows: 3, placeholder: "Type your response here...", value: inputText, onChange: (e) => setInputText(e.target.value), disabled: isEvaluating, style: {
                                        width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)', outline: 'none', resize: 'vertical'
                                    } }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(VoiceInput, { disabled: isEvaluating, onSpeechResult: (text) => setInputText((prev) => (prev ? `${prev} ${text}` : text)) }), _jsx(Button, { variant: "primary", icon: _jsx(Send, { size: 16 }), onClick: handleSendMessage, disabled: !inputText.trim() || isEvaluating, loading: isEvaluating, children: "Submit" })] })] }) })] })), isSessionComplete && finalResult && (_jsxs("div", { style: { display: 'grid', gap: '1.5rem' }, children: [_jsxs("div", { className: "health-status success", style: { marginBottom: '0.5rem' }, children: [_jsx(CheckCircle2, { size: 24 }), _jsxs("div", { children: [_jsx("div", { className: "status-label", children: "Discussion Completed" }), _jsx("div", { className: "status-detail", children: "Your progress has been recorded." })] })] }), _jsxs(Card, { style: { textAlign: 'center', padding: '3rem 1rem' }, children: [_jsx(Award, { size: 48, color: "var(--primary)", style: { marginBottom: '1rem' } }), _jsx("h2", { style: { fontSize: '1.5rem', marginBottom: '0.5rem' }, children: "ARENA Group Discussion Report" }), _jsxs("div", { style: { fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }, children: [finalResult.evaluation.overallScore, " ", _jsx("span", { style: { fontSize: '1.2rem', color: 'var(--text-secondary)' }, children: "/ 100" })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }, children: [_jsxs(Card, { children: [_jsx("h3", { style: { marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }, children: "Score Breakdown" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }, children: [
                                            { label: 'Communication', val: finalResult.evaluation.communication },
                                            { label: 'Clarity', val: finalResult.evaluation.clarity },
                                            { label: 'Relevance', val: finalResult.evaluation.relevance },
                                            { label: 'Confidence', val: finalResult.evaluation.confidence },
                                            { label: 'Participation', val: finalResult.evaluation.participation },
                                            { label: 'Leadership', val: finalResult.evaluation.leadership },
                                            { label: 'Teamwork', val: finalResult.evaluation.teamwork },
                                            { label: 'Argument Quality', val: finalResult.evaluation.argumentQuality },
                                            { label: 'Respectfulness', val: finalResult.evaluation.respectfulness },
                                            { label: 'Vocabulary', val: finalResult.evaluation.vocabulary },
                                            { label: 'Grammar', val: finalResult.evaluation.grammar },
                                        ].map(item => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsxs("span", { style: { color: 'var(--text-secondary)' }, children: [item.label, ":"] }), _jsx("span", { style: { fontWeight: 600 }, children: item.val })] }, item.label))) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: [_jsxs(Card, { children: [_jsx("h3", { style: { marginBottom: '1rem', color: 'var(--success)' }, children: "Strengths" }), _jsx("ul", { style: { paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: finalResult.evaluation.strengths.map((s, i) => _jsx("li", { children: s }, i)) })] }), _jsxs(Card, { children: [_jsx("h3", { style: { marginBottom: '1rem', color: 'var(--warning)' }, children: "Areas to Improve" }), _jsx("ul", { style: { paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: finalResult.evaluation.improvements.map((s, i) => _jsx("li", { children: s }, i)) })] })] })] }), finalResult.evaluation.improved_responses && finalResult.evaluation.improved_responses.length > 0 && (_jsxs(Card, { children: [_jsx("h3", { style: { marginBottom: '1.25rem' }, children: "Sample Improvements" }), _jsx("div", { style: { display: 'grid', gap: '1.5rem' }, children: finalResult.evaluation.improved_responses.map((ir, i) => (_jsxs("div", { style: { padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }, children: [_jsxs("div", { style: { color: 'var(--error)', marginBottom: '0.5rem', fontStyle: 'italic' }, children: [_jsx("span", { style: { fontWeight: 600, color: 'var(--text-main)', fontStyle: 'normal' }, children: "Student statement: " }), "\"", ir.original, "\""] }), _jsxs("div", { style: { color: 'var(--success)', marginBottom: '0.5rem' }, children: [_jsx("span", { style: { fontWeight: 600, color: 'var(--text-main)' }, children: "Improved: " }), "\"", ir.improved, "\""] }), _jsxs("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: [_jsx("span", { style: { fontWeight: 600 }, children: "Why: " }), ir.reason] })] }, i))) })] })), _jsx("div", { style: { textAlign: 'center', marginTop: '1rem' }, children: _jsx(Button, { variant: "primary", onClick: () => setSession(null), children: "Start New Discussion" }) })] }))] }));
};
//# sourceMappingURL=GroupDiscussionPage.js.map