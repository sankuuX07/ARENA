import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';
import { getPythonTopics } from '../../../services/pythonService';
import { TechnicalTopic } from '../../../services/technicalService';
import { getProgressSummary } from '../../../services/progressService';
import { getPuzzleProgress } from '../../../services/puzzleService';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
export const PythonProgrammingPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [techProgress, setTechProgress] = useState(0);
    const [attempted, setAttempted] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [codingSolved, setCodingSolved] = useState(0);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [fetchedTopics, progSummary, puzzleProg] = await Promise.all([
                getPythonTopics(),
                getProgressSummary(currentUser.uid),
                getPuzzleProgress(currentUser.uid)
            ]);
            setTopics(fetchedTopics);
            const tp = progSummary.moduleProgress['technical'];
            if (tp) {
                setTechProgress(tp.progressPercentage);
                setAttempted(tp.attempted);
                setAccuracy(tp.accuracy);
            }
            setCodingSolved(puzzleProg.problemsSolved);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading Python Programming Module..." });
    return (_jsxs("div", { style: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/technical'), style: { marginBottom: '1rem' }, children: "Back to Technical" }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }, children: [_jsxs("div", { children: [_jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '0.5rem' }, children: "Python Programming" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '1.1rem' }, children: "Master Python and prepare for technical placement rounds." })] }), _jsxs("div", { style: { background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', gap: '2rem' }, children: [_jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem' }, children: "Progress" }), _jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }, children: [techProgress, "%"] })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem' }, children: "Attempted" }), _jsx("div", { style: { fontSize: '1.5rem', fontWeight: 600 }, children: attempted })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem' }, children: "Accuracy" }), _jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 600 }, children: [accuracy, "%"] })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem' }, children: "Coding Solved" }), _jsx("div", { style: { fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }, children: codingSolved })] })] })] }), _jsx("h2", { style: { fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }, children: "Topics" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }, children: topics.map(topic => (_jsxs("div", { style: {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                    }, onClick: () => navigate(`/technical/python/${topic.topicId}`), children: [_jsxs("h3", { style: { margin: '0 0 0.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Terminal, { size: 18, style: { color: 'var(--primary)' } }), topic.name] }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, margin: 0 }, children: topic.description })] }, topic.topicId))) })] }));
};
//# sourceMappingURL=PythonProgrammingPage.js.map