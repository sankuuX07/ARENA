import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPuzzleProblem, PuzzleProblem, submitCodingSolution, CodingSubmissionResponse } from '../../services/puzzleService';
import { executeCode, CodeExecutionResponse } from '../../services/codeExecutionService';
import { recordStudentActivity } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { CodeEditor } from '../../components/puzzles/CodeEditor';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Play, Send, RotateCcw } from 'lucide-react';
const STARTER_TEMPLATES = {
    python: 'def solution():\n    pass\n',
    java: 'class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n',
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n',
    c: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}\n'
};
export const PuzzleWorkspacePage = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    // Editor State
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState('');
    // Submission State
    const [actionMessage, setActionMessage] = useState(null);
    // Execution State
    const [customInput, setCustomInput] = useState('');
    const [executionResult, setExecutionResult] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    // Evaluation State
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (problemId) {
            loadProblem(problemId);
        }
    }, [problemId]);
    const loadProblem = async (id) => {
        setLoading(true);
        try {
            const p = await getPuzzleProblem(id);
            setProblem(p);
            if (p.supportedLanguages.length > 0) {
                setLanguage(p.supportedLanguages[0]);
                const langCode = p.supportedLanguages[0].toLowerCase();
                const starter = p.functionSignature?.[langCode] || STARTER_TEMPLATES[langCode] || '';
                setCode(starter);
            }
        }
        catch (err) {
            console.error('Failed to load problem', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleLanguageChange = (e) => {
        const newLang = e.target.value.toLowerCase();
        const defaultStarter = problem?.functionSignature?.[newLang] || STARTER_TEMPLATES[newLang] || '';
        if (code !== defaultStarter && code.trim() !== '') {
            if (!window.confirm("Changing languages will reset your code. Continue?")) {
                return;
            }
        }
        setLanguage(newLang);
        setCode(defaultStarter);
    };
    const handleResetCode = () => {
        if (window.confirm("Are you sure you want to reset the code to the starter template?")) {
            const defaultStarter = problem?.functionSignature?.[language] || STARTER_TEMPLATES[language] || '';
            setCode(defaultStarter);
            setActionMessage(null);
        }
    };
    const handleRunCode = async () => {
        if (!problem)
            return;
        setIsExecuting(true);
        setActionMessage(null);
        setExecutionResult(null);
        try {
            const result = await executeCode({
                problemId: problem.problemId,
                language: language,
                code: code,
                stdin: customInput
            });
            setExecutionResult(result);
        }
        catch (err) {
            setExecutionResult({
                executionId: 'err',
                status: 'system_error',
                stdout: '',
                stderr: err.message || 'Failed to connect to execution service.',
                executionTimeMs: 0,
                exitCode: -1
            });
        }
        finally {
            setIsExecuting(false);
        }
    };
    const handleSubmitSolution = async () => {
        if (!problem || !currentUser)
            return;
        setIsSubmitting(true);
        setActionMessage(null);
        setSubmissionResult(null);
        setExecutionResult(null); // Clear execution panel to focus on evaluation
        try {
            const result = await submitCodingSolution({
                problemId: problem.problemId,
                language: language,
                code: code
            });
            setSubmissionResult(result);
            // Integrate with Progress Engine
            if (result.isFirstSolve && result.status === 'accepted') {
                await recordStudentActivity(currentUser.uid, {
                    module: 'puzzles',
                    activityType: 'coding_problem',
                    topic: problem.category,
                    difficulty: problem.difficulty.toLowerCase(),
                    status: 'completed',
                    isCorrect: true,
                    score: result.score
                });
            }
        }
        catch (err) {
            setActionMessage(err.message || 'Failed to connect to evaluation service.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (loading) {
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading problem workspace..." });
    }
    if (!problem) {
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Problem not found." });
    }
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', width: '100%' }, children: [_jsxs("div", { style: { padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/puzzles'), children: "Back" }), _jsx("h2", { style: { margin: 0, fontSize: '1.25rem' }, children: problem.title }), _jsx(Badge, { variant: problem.difficulty.toLowerCase() === 'easy' ? 'success' : problem.difficulty.toLowerCase() === 'medium' ? 'warning' : 'error', children: problem.difficulty })] }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx(Button, { variant: "outline", icon: _jsx(RotateCcw, { size: 16 }), onClick: handleResetCode, children: "Reset" }), _jsx(Button, { variant: "outline", icon: _jsx(Play, { size: 16 }), onClick: handleRunCode, disabled: isExecuting || isSubmitting, children: isExecuting ? 'Running...' : 'Run Code' }), _jsx(Button, { variant: "primary", icon: _jsx(Send, { size: 16 }), onClick: handleSubmitSolution, disabled: isExecuting || isSubmitting, children: isSubmitting ? 'Evaluating...' : 'Submit Solution' })] })] }), _jsxs("div", { style: { display: 'flex', flex: 1, overflow: 'hidden' }, className: "workspace-container", children: [_jsx("div", { style: { flex: 1, padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid var(--border-color)' }, children: _jsxs("div", { className: "markdown-content", style: { fontSize: '1rem', lineHeight: 1.6 }, children: [_jsx("div", { style: { whiteSpace: 'pre-wrap' }, children: problem.description }), _jsx("h3", { style: { marginTop: '2rem', fontSize: '1.1rem' }, children: "Constraints:" }), _jsx("ul", { style: { paddingLeft: '1.5rem', color: 'var(--text-secondary)' }, children: problem.constraints.map((c, i) => (_jsx("li", { children: _jsx("code", { style: { background: 'var(--bg-surface-elevated)', padding: '0.2rem 0.4rem', borderRadius: '4px' }, children: c.value }) }, i))) }), _jsx("h3", { style: { marginTop: '2rem', fontSize: '1.1rem' }, children: "Examples:" }), problem.examples.map((ex, i) => (_jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Input:" }), " ", _jsx("code", { style: { color: 'var(--primary)' }, children: ex.input })] }), _jsxs("div", { style: { margin: '0.5rem 0' }, children: [_jsx("strong", { children: "Output:" }), " ", _jsx("code", { style: { color: 'var(--success)' }, children: ex.output })] }), ex.explanation && _jsxs("div", { children: [_jsx("strong", { children: "Explanation:" }), " ", ex.explanation] })] }, i)))] }) }), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)', padding: '1rem' }, children: [_jsx("div", { style: { marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }, children: _jsx("select", { value: language, onChange: handleLanguageChange, style: {
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-surface-elevated)',
                                        color: 'var(--text-main)',
                                        border: '1px solid var(--border-color)',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }, children: problem.supportedLanguages.map(lang => (_jsx("option", { value: lang, children: lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1) }, lang))) }) }), _jsx("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: _jsx(CodeEditor, { language: language, value: code, onChange: setCode }) }), _jsxs("div", { style: { marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '250px' }, children: [_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: [_jsx("label", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }, children: "Custom Input" }), _jsx("textarea", { value: customInput, onChange: e => setCustomInput(e.target.value), style: {
                                                    flex: 1,
                                                    padding: '0.75rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-surface-elevated)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                    fontFamily: 'monospace',
                                                    resize: 'none'
                                                }, placeholder: "Enter input here..." })] }), executionResult && (_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', overflowY: 'auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: [_jsxs("span", { style: { fontWeight: 600, color: executionResult.status === 'completed' ? 'var(--success)' : 'var(--error)' }, children: ["Status: ", executionResult.status] }), _jsxs("span", { style: { color: 'var(--text-secondary)' }, children: ["Time: ", executionResult.executionTimeMs, " ms"] })] }), executionResult.stdout && (_jsxs("div", { style: { marginBottom: '0.5rem' }, children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--text-secondary)' }, children: "Output" }), _jsx("pre", { style: { margin: 0, padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }, children: executionResult.stdout })] })), executionResult.stderr && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--error)' }, children: "Errors / System Message" }), _jsx("pre", { style: { margin: 0, padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--error)' }, children: executionResult.stderr })] }))] })), submissionResult && (_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: `1px solid ${submissionResult.status === 'accepted' ? 'var(--success)' : 'var(--error)'}`, overflowY: 'auto' }, children: [_jsx("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600, color: submissionResult.status === 'accepted' ? 'var(--success)' : 'var(--error)' }, children: submissionResult.status === 'accepted' ? '✓ Accepted' : '✗ ' + submissionResult.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--text-secondary)' }, children: "Test Cases Passed" }), _jsxs("div", { style: { fontSize: '1.1rem', fontWeight: 600 }, children: [submissionResult.passedTests, " / ", submissionResult.totalTests] })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--text-secondary)' }, children: "Score" }), _jsx("div", { style: { fontSize: '1.1rem', fontWeight: 600 }, children: submissionResult.score })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--text-secondary)' }, children: "Execution Time" }), _jsxs("div", { style: { fontSize: '1.1rem', fontWeight: 600 }, children: [submissionResult.executionTimeMs, " ms"] })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--text-secondary)' }, children: "Language" }), _jsx("div", { style: { fontSize: '1.1rem', fontWeight: 600, textTransform: 'capitalize' }, children: submissionResult.language })] })] }), submissionResult.errorMessage && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--error)', marginBottom: '0.5rem' }, children: "Compiler / Runtime Message" }), _jsx("pre", { style: { margin: 0, padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--error)' }, children: submissionResult.errorMessage })] })), submissionResult.isFirstSolve && (_jsx("div", { style: { marginTop: '1rem', padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', borderRadius: '4px', textAlign: 'center', fontWeight: 600 }, children: "\uD83C\uDF89 First Solve! Progress and Ranking updated." }))] }))] }), actionMessage && (_jsxs("div", { style: { marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }, children: [_jsx("strong", { children: "Notice:" }), " ", actionMessage] }))] })] }), _jsx("style", { children: `
        @media (max-width: 768px) {
          .workspace-container {
            flex-direction: column;
          }
          .workspace-container > div {
            border-right: none !important;
            border-bottom: 1px solid var(--border-color);
          }
        }
      ` })] }));
};
//# sourceMappingURL=PuzzleWorkspacePage.js.map