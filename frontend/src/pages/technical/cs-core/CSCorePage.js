import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Database, Activity, Server, Cpu, Globe, Box, Settings, HardDrive, Terminal, Share2, Shield } from 'lucide-react';
import { getCSCoreSubjects, CSSubject } from '../../../services/csCoreService';
import { getProgressSummary } from '../../../services/progressService';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
const iconMap = {
    'database': Database,
    'activity': Activity,
    'server': Server,
    'cpu': Cpu,
    'globe': Globe,
    'box': Box,
    'settings': Settings,
    'hard-drive': HardDrive,
    'terminal': Terminal,
    'share-2': Share2,
    'shield': Shield,
    'book-open': BookOpen
};
export const CSCorePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [techProgress, setTechProgress] = useState(0);
    const [attempted, setAttempted] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [fetchedSubjects, progSummary] = await Promise.all([
                getCSCoreSubjects(),
                getProgressSummary(currentUser.uid)
            ]);
            setSubjects(fetchedSubjects.sort((a, b) => a.order - b.order));
            const tp = progSummary.moduleProgress['technical'];
            if (tp) {
                setTechProgress(tp.progressPercentage);
                setAttempted(tp.attempted);
                setAccuracy(tp.accuracy);
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading CS Core Module..." });
    return (_jsxs("div", { style: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/technical'), style: { marginBottom: '1rem' }, children: "Back to Technical" }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }, children: [_jsxs("div", { children: [_jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '0.5rem' }, children: "CS Core Subjects" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '1.1rem' }, children: "Master Computer Science fundamentals for technical placement rounds." })] }), _jsxs("div", { style: { background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', gap: '2rem' }, children: [_jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem' }, children: "Progress" }), _jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }, children: [techProgress, "%"] })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem' }, children: "Attempted" }), _jsx("div", { style: { fontSize: '1.5rem', fontWeight: 600 }, children: attempted })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem' }, children: "Accuracy" }), _jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 600 }, children: [accuracy, "%"] })] })] })] }), _jsx("h2", { style: { fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }, children: "Subjects" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }, children: subjects.map(subject => {
                    const Icon = iconMap[subject.icon] || BookOpen;
                    return (_jsxs("div", { style: {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1.5rem',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                        }, onMouseEnter: (e) => e.currentTarget.style.borderColor = 'var(--primary)', onMouseLeave: (e) => e.currentTarget.style.borderColor = 'var(--border-color)', onClick: () => navigate(`/technical/cs-core/${subject.subjectId}`), children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }, children: [_jsx("div", { style: { width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Icon, { size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 0.25rem', fontSize: '1.2rem' }, children: subject.name }), _jsxs("div", { style: { fontSize: '0.85rem', color: 'var(--text-secondary)' }, children: [subject.topics?.length || 0, " Topics"] })] })] }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, margin: '0 0 1.5rem' }, children: subject.description }), _jsx(Button, { variant: "outline", fullWidth: true, children: "View Topics" })] }, subject.subjectId));
                }) })] }));
};
//# sourceMappingURL=CSCorePage.js.map