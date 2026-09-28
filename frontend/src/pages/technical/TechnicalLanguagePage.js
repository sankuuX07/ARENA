import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getTechnicalModules, TechnicalModule } from '../../services/technicalService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
export const TechnicalLanguagePage = () => {
    const { language } = useParams();
    const navigate = useNavigate();
    const [moduleData, setModuleData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData();
    }, [language]);
    const loadData = async () => {
        try {
            const mods = await getTechnicalModules();
            const match = mods.find(m => m.language === language);
            setModuleData(match || null);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading language..." });
    if (!moduleData)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Language module not found." });
    return (_jsxs("div", { style: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/technical'), style: { marginBottom: '1rem' }, children: "Back to Dashboard" }), _jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '0.5rem' }, children: moduleData.title }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }, children: moduleData.description }), _jsx("h2", { style: { fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }, children: "Topics" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }, children: [moduleData.topics.map(topic => (_jsxs("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.5rem',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)'
                        }, children: [_jsxs("div", { children: [_jsxs("h3", { style: { margin: '0 0 0.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(BookOpen, { size: 18, style: { color: 'var(--primary)' } }), topic.name] }), _jsx("div", { style: { display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }, children: _jsxs(Badge, { variant: "primary", children: [topic.questionCount, " Questions"] }) })] }), _jsx(Button, { variant: "outline", onClick: () => navigate(`/technical/${language}/${topic.topicId}`), children: "Start Practice" })] }, topic.topicId))), moduleData.topics.length === 0 && (_jsx("div", { style: { color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem' }, children: "Topics will be populated in upcoming language-specific milestones." }))] })] }));
};
//# sourceMappingURL=TechnicalLanguagePage.js.map