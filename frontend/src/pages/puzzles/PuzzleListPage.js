import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { getPuzzleProblems, PuzzleProblem, PuzzleProgress, getPuzzleProgress, generatePuzzleProblem, getSubmissionHistory, CodingSubmissionResponse } from '../../services/puzzleService';
import { Terminal, Search, Filter, Code2, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
const CATEGORIES = ["Arrays", "Strings", "Hashing", "Searching", "Sorting", "Two Pointers", "Sliding Window", "Stack", "Queue", "Linked List", "Recursion", "Mathematics", "Greedy", "Trees", "Graphs", "Dynamic Programming"];
export const PuzzleListPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [problems, setProblems] = useState([]);
    const [solvedIds, setSolvedIds] = useState(new Set());
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // Basic filter state
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    // Generator State
    const [showGenerator, setShowGenerator] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [genError, setGenError] = useState(null);
    const [genCategory, setGenCategory] = useState(CATEGORIES[0]);
    const [genDifficulty, setGenDifficulty] = useState('Medium');
    const [genType, setGenType] = useState('Algorithmic');
    const [genLang, setGenLang] = useState('Python');
    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]);
    const loadData = async () => {
        setLoading(true);
        try {
            const [probs, prog, history] = await Promise.all([
                getPuzzleProblems(),
                getPuzzleProgress(currentUser.uid),
                getSubmissionHistory().catch(() => [])
            ]);
            setProblems(probs);
            setProgress(prog);
            const solved = new Set(history.filter(s => s.status === 'accepted').map(s => s.problemId));
            setSolvedIds(solved);
        }
        catch (err) {
            console.error('Failed to load puzzle data', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleGenerate = async () => {
        setIsGenerating(true);
        setGenError(null);
        try {
            const newProblem = await generatePuzzleProblem({
                category: genCategory,
                difficulty: genDifficulty,
                problemType: genType,
                language: genLang
            });
            setProblems(prev => [newProblem, ...prev]);
            setShowGenerator(false);
            // Optional: immediately navigate
            // navigate(`/puzzles/${newProblem.problemId}`);
        }
        catch (err) {
            setGenError(err.message || 'Failed to generate problem');
        }
        finally {
            setIsGenerating(false);
        }
    };
    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
        return matchesSearch && matchesDifficulty;
    });
    return (_jsxs("div", { style: { maxWidth: 1200, margin: '0 auto', width: '100%' }, children: [_jsx(PageHeader, { title: "ARENA Puzzle Arena", description: "Think. Code. Solve. Compete. Master technical problem-solving.", icon: _jsx(Terminal, { size: 28 }), action: _jsx(Button, { variant: "primary", icon: _jsx(Sparkles, { size: 16 }), onClick: () => setShowGenerator(!showGenerator), children: showGenerator ? 'Close Generator' : 'Generate Problem' }) }), showGenerator && (_jsxs(Card, { style: { padding: '1.5rem', marginBottom: '2rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }, children: [_jsxs("h3", { style: { marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }, children: [_jsx(Sparkles, { size: 20 }), " AI Problem Generator"] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }, children: "Category" }), _jsx("select", { value: genCategory, onChange: e => setGenCategory(e.target.value), style: { width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }, children: CATEGORIES.map(c => _jsx("option", { value: c, children: c }, c)) })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }, children: "Difficulty" }), _jsxs("select", { value: genDifficulty, onChange: e => setGenDifficulty(e.target.value), style: { width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }, children: [_jsx("option", { value: "Easy", children: "Easy" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "Hard", children: "Hard" })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }, children: "Type" }), _jsxs("select", { value: genType, onChange: e => setGenType(e.target.value), style: { width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }, children: [_jsx("option", { value: "Algorithmic", children: "Algorithmic" }), _jsx("option", { value: "Data Structure", children: "Data Structure" }), _jsx("option", { value: "Mathematical", children: "Mathematical" }), _jsx("option", { value: "Optimization", children: "Optimization" })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }, children: "Target Language" }), _jsxs("select", { value: genLang, onChange: e => setGenLang(e.target.value), style: { width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }, children: [_jsx("option", { value: "Python", children: "Python" }), _jsx("option", { value: "Java", children: "Java" }), _jsx("option", { value: "C++", children: "C++" }), _jsx("option", { value: "C", children: "C" })] })] })] }), genError && _jsx("div", { style: { color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }, children: genError }), _jsx(Button, { variant: "primary", onClick: handleGenerate, disabled: isGenerating, children: isGenerating ? 'Generating...' : 'Generate AI Problem' })] })), progress && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }, children: [_jsxs(Card, { style: { textAlign: 'center', padding: '1.5rem' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }, children: "Problems Solved" }), _jsx("div", { style: { fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }, children: progress.problemsSolved })] }), _jsxs(Card, { style: { textAlign: 'center', padding: '1.5rem' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }, children: "Accuracy" }), _jsxs("div", { style: { fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }, children: [progress.accuracy, "%"] })] }), _jsxs(Card, { style: { textAlign: 'center', padding: '1.5rem' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }, children: "Easy / Medium / Hard" }), _jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }, children: [_jsx("span", { style: { color: 'var(--success)' }, children: progress.easySolved }), " / ", _jsx("span", { style: { color: 'var(--warning)' }, children: progress.mediumSolved }), " / ", _jsx("span", { style: { color: 'var(--error)' }, children: progress.hardSolved })] })] })] })), _jsxs("div", { style: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }, children: [_jsxs("div", { style: { flex: 1, position: 'relative', minWidth: '250px' }, children: [_jsx(Search, { size: 18, style: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' } }), _jsx("input", { type: "text", placeholder: "Search by title or category...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: {
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-main)',
                                    fontSize: '1rem'
                                } })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { padding: '0 0.5rem', color: 'var(--text-secondary)' }, children: _jsx(Filter, { size: 16 }) }), ['all', 'easy', 'medium', 'hard'].map(level => (_jsx("button", { onClick: () => setDifficultyFilter(level), style: {
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: difficultyFilter === level ? 'var(--bg-active)' : 'transparent',
                                    color: difficultyFilter === level ? 'var(--primary)' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontWeight: difficultyFilter === level ? 600 : 400,
                                    textTransform: 'capitalize'
                                }, children: level }, level)))] })] }), loading ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }, children: "Loading problems..." })) : filteredProblems.length === 0 ? (_jsx(EmptyState, { icon: _jsx(Code2, {}), title: "No Problems Found", description: "Try adjusting your filters or search." })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: filteredProblems.map(problem => (_jsxs(Card, { style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: problem.sourceType === 'ai_generated' ? '1px solid rgba(139, 92, 246, 0.4)' : undefined
                    }, onClick: () => navigate(`/puzzles/${problem.problemId}`), children: [_jsxs("div", { children: [_jsxs("h3", { style: { fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [problem.title, _jsx(Badge, { variant: problem.difficulty.toLowerCase() === 'easy' ? 'success' :
                                                problem.difficulty.toLowerCase() === 'medium' ? 'warning' : 'error', children: problem.difficulty }), problem.sourceType === 'ai_generated' && (_jsx(Badge, { variant: "primary", children: "AI Generated" })), solvedIds.has(problem.problemId) && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }, children: [_jsx(CheckCircle, { size: 14 }), " Solved"] }))] }), _jsxs("div", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '1rem' }, children: [_jsxs("span", { children: ["Category: ", problem.category] }), _jsxs("span", { children: ["Languages: ", problem.supportedLanguages.join(', ')] })] })] }), _jsx("div", { children: _jsx(Button, { variant: "primary", icon: _jsx(ArrowRight, { size: 16 }), iconPosition: "right", onClick: (e) => { e.stopPropagation(); navigate(`/puzzles/${problem.problemId}`); }, children: "Solve" }) })] }, problem.problemId))) }))] }));
};
//# sourceMappingURL=PuzzleListPage.js.map