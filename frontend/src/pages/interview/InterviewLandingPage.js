import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { getInterviewModes, startInterviewSession, InterviewConfig, InterviewMode } from '../../services/interviewService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
export const InterviewLandingPage = () => {
    const navigate = useNavigate();
    const [modes, setModes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [mode, setMode] = useState('technical');
    const [difficulty, setDifficulty] = useState('medium');
    const [durationMinutes, setDurationMinutes] = useState(15);
    const [responseMode, setResponseMode] = useState('text');
    const [topic, setTopic] = useState('General');
    useEffect(() => {
        getInterviewModes()
            .then(setModes)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const handleStart = async () => {
        setStarting(true);
        try {
            const config = {
                mode,
                difficulty,
                durationMinutes,
                maxQuestions: Math.max(5, Math.floor(durationMinutes * 0.5)),
                responseMode,
                topic: mode === 'technical' ? topic : undefined
            };
            const session = await startInterviewSession(config);
            navigate(`/interview/session/${session.sessionId}`);
        }
        catch (err) {
            alert(err.message || 'Failed to start interview');
            setStarting(false);
        }
    };
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto', padding: '2rem' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '3rem' }, children: [_jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '1rem' }, children: "ARENA AI Interview" }), _jsx("p", { style: { fontSize: '1.2rem', color: 'var(--text-secondary)' }, children: "Practice real interview conversations with an AI interviewer." })] }), _jsx("div", { style: { background: 'var(--bg-surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }, children: _jsxs("div", { style: { display: 'grid', gap: '2rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '0.5rem', fontWeight: 600 }, children: "Interview Mode" }), _jsx("select", { value: mode, onChange: (e) => setMode(e.target.value), style: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }, children: modes.map(m => (_jsx("option", { value: m.id, children: m.name }, m.id))) })] }), mode === 'technical' && (_jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '0.5rem', fontWeight: 600 }, children: "Technical Topic" }), _jsx("select", { value: topic, onChange: (e) => setTopic(e.target.value), style: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }, children: ['General', 'C', 'C++', 'Java', 'Python', 'DBMS', 'OS', 'Networks', 'DSA', 'OOP'].map(t => (_jsx("option", { value: t, children: t }, t))) })] })), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '0.5rem', fontWeight: 600 }, children: "Difficulty" }), _jsxs("select", { value: difficulty, onChange: (e) => setDifficulty(e.target.value), style: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }, children: [_jsx("option", { value: "easy", children: "Easy" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "hard", children: "Hard" })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '0.5rem', fontWeight: 600 }, children: "Duration (Minutes)" }), _jsxs("select", { value: durationMinutes, onChange: (e) => setDurationMinutes(Number(e.target.value)), style: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }, children: [_jsx("option", { value: 10, children: "10 Minutes" }), _jsx("option", { value: 15, children: "15 Minutes" }), _jsx("option", { value: 20, children: "20 Minutes" }), _jsx("option", { value: 30, children: "30 Minutes" })] })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '0.5rem', fontWeight: 600 }, children: "Response Mode" }), _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }, children: [_jsx("input", { type: "radio", value: "text", checked: responseMode === 'text', onChange: (e) => setResponseMode(e.target.value) }), "Text"] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }, children: [_jsx("input", { type: "radio", value: "voice", checked: responseMode === 'voice', onChange: (e) => setResponseMode(e.target.value) }), "Voice"] })] })] }), _jsx("div", { style: { marginTop: '1rem' }, children: _jsx(Button, { onClick: handleStart, variant: "primary", fullWidth: true, disabled: starting, children: starting ? 'Preparing Interview...' : 'Start Interview' }) })] }) })] }));
};
//# sourceMappingURL=InterviewLandingPage.js.map