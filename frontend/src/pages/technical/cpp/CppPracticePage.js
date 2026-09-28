import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Settings2, Target } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { getCppTopic } from '../../../services/cppService';
import { TechnicalDifficulty, TechnicalQuestionType, TechnicalTopic } from '../../../services/technicalService';
import { generatePuzzleProblem } from '../../../services/puzzleService';
export const CppPracticePage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [difficulty, setDifficulty] = useState('medium');
    const [qType, setQType] = useState('mcq');
    const [count, setCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    useEffect(() => {
        if (topicId) {
            getCppTopic(topicId).then(setTopic).catch(console.error);
        }
    }, [topicId]);
    const handleStart = async () => {
        if (qType === 'coding') {
            setIsGenerating(true);
            try {
                const p = await generatePuzzleProblem({
                    category: 'C++ Programming',
                    difficulty: difficulty,
                    problemType: 'coding',
                    language: 'cpp',
                    topic: topic?.name
                });
                navigate(`/puzzles/${p.problemId}`);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsGenerating(false);
            }
        }
        else {
            navigate(`/technical/cpp/session/new?topic=${topicId}&difficulty=${difficulty}&qType=${qType}&count=${count}`);
        }
    };
    if (!topic)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading Topic..." });
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto', padding: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate(`/technical/cpp`), style: { marginBottom: '1rem' }, children: "Back to C++ Topics" }), _jsxs("div", { style: { background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }, children: [_jsx("h1", { style: { fontSize: '2rem', margin: '0 0 1rem' }, children: topic.name }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }, children: topic.description }), _jsxs("div", { style: { display: 'grid', gap: '2rem', marginBottom: '2.5rem' }, children: [_jsxs("div", { children: [_jsxs("h3", { style: { fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Target, { size: 16 }), " Question Type"] }), _jsx("div", { style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }, children: ['mcq', 'output', 'debugging', 'conceptual', 'coding', 'interview'].map((t) => (_jsx(Button, { variant: qType === t ? 'primary' : 'outline', onClick: () => setQType(t), style: { textTransform: 'capitalize' }, children: t.replace('_', ' ') }, t))) })] }), _jsxs("div", { children: [_jsxs("h3", { style: { fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Settings2, { size: 16 }), " Difficulty"] }), _jsx("div", { style: { display: 'flex', gap: '0.75rem' }, children: ['easy', 'medium', 'hard'].map((d) => (_jsx(Button, { variant: difficulty === d ? 'primary' : 'outline', onClick: () => setDifficulty(d), style: { textTransform: 'capitalize' }, children: d }, d))) })] }), qType !== 'coding' && (_jsxs("div", { children: [_jsx("h3", { style: { fontSize: '1rem', marginBottom: '0.75rem' }, children: "Question Count" }), _jsx("div", { style: { display: 'flex', gap: '0.75rem' }, children: [5, 10, 20].map((c) => (_jsx(Button, { variant: count === c ? 'primary' : 'outline', onClick: () => setCount(c), children: c }, c))) })] }))] }), _jsx(Button, { variant: "primary", icon: _jsx(Play, { size: 16 }), onClick: handleStart, size: "lg", fullWidth: true, disabled: isGenerating, children: isGenerating ? 'Generating...' : qType === 'coding' ? 'Generate Coding Problem' : 'Start Practice Session' })] })] }));
};
//# sourceMappingURL=CppPracticePage.js.map