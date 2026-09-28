import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Settings2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TechnicalDifficulty } from '../../services/technicalService';
export const TechnicalTopicPage = () => {
    const { language, topicId } = useParams();
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState('medium');
    const handleStart = () => {
        // Navigating directly to session page with query params to start session
        navigate(`/technical/session/new?language=${language}&topic=${topicId}&difficulty=${difficulty}`);
    };
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto', padding: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate(`/technical/${language}`), style: { marginBottom: '1rem' }, children: "Back to Topics" }), _jsxs("div", { style: { background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }, children: [_jsxs("h1", { style: { fontSize: '2rem', margin: '0 0 1rem' }, children: ["Prepare: ", topicId?.replace('_', ' ')] }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: '2rem' }, children: "Test your knowledge and problem-solving skills with AI-curated practice questions." }), _jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsxs("h3", { style: { fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Settings2, { size: 16 }), " Select Difficulty"] }), _jsx("div", { style: { display: 'flex', gap: '1rem' }, children: ['easy', 'medium', 'hard'].map((d) => (_jsx(Button, { variant: difficulty === d ? 'primary' : 'outline', onClick: () => setDifficulty(d), style: { textTransform: 'capitalize' }, children: d }, d))) })] }), _jsx(Button, { variant: "primary", icon: _jsx(Play, { size: 16 }), onClick: handleStart, size: "lg", fullWidth: true, children: "Start Practice Session" })] })] }));
};
//# sourceMappingURL=TechnicalTopicPage.js.map