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

const STARTER_TEMPLATES: Record<string, string> = {
  python: 'def solution():\n    pass\n',
  java: 'class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}\n'
};

export const PuzzleWorkspacePage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [problem, setProblem] = useState<PuzzleProblem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  
  // Submission State
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  
  // Execution State
  const [customInput, setCustomInput] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<CodeExecutionResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Evaluation State
  const [submissionResult, setSubmissionResult] = useState<CodingSubmissionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (problemId) {
      loadProblem(problemId);
    }
  }, [problemId]);

  const loadProblem = async (id: string) => {
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
    } catch (err) {
      console.error('Failed to load problem', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    if (!problem) return;
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
    } catch (err: any) {
      setExecutionResult({
        executionId: 'err',
        status: 'system_error',
        stdout: '',
        stderr: err.message || 'Failed to connect to execution service.',
        executionTimeMs: 0,
        exitCode: -1
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!problem || !currentUser) return;
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
          difficulty: problem.difficulty.toLowerCase() as any,
          status: 'completed',
          isCorrect: true,
          score: result.score
        });
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to connect to evaluation service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading problem workspace...</div>;
  }

  if (!problem) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Problem not found.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', width: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/puzzles')}>Back</Button>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{problem.title}</h2>
          <Badge variant={problem.difficulty.toLowerCase() === 'easy' ? 'success' : problem.difficulty.toLowerCase() === 'medium' ? 'warning' : 'error'}>
            {problem.difficulty}
          </Badge>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" icon={<RotateCcw size={16} />} onClick={handleResetCode}>Reset</Button>
          <Button variant="outline" icon={<Play size={16} />} onClick={handleRunCode} disabled={isExecuting || isSubmitting}>
            {isExecuting ? 'Running...' : 'Run Code'}
          </Button>
          <Button variant="primary" icon={<Send size={16} />} onClick={handleSubmitSolution} disabled={isExecuting || isSubmitting}>
            {isSubmitting ? 'Evaluating...' : 'Submit Solution'}
          </Button>
        </div>
      </div>

      {/* Main Workspace Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }} className="workspace-container">
        
        {/* Left Pane: Problem Description */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid var(--border-color)' }}>
          <div className="markdown-content" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{problem.description}</div>
            
            <h3 style={{ marginTop: '2rem', fontSize: '1.1rem' }}>Constraints:</h3>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              {problem.constraints.map((c, i) => (
                <li key={i}><code style={{ background: 'var(--bg-surface-elevated)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{c.value}</code></li>
              ))}
            </ul>

            <h3 style={{ marginTop: '2rem', fontSize: '1.1rem' }}>Examples:</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div><strong>Input:</strong> <code style={{ color: 'var(--primary)' }}>{ex.input}</code></div>
                <div style={{ margin: '0.5rem 0' }}><strong>Output:</strong> <code style={{ color: 'var(--success)' }}>{ex.output}</code></div>
                {ex.explanation && <div><strong>Explanation:</strong> {ex.explanation}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Code Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)', padding: '1rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <select 
              value={language} 
              onChange={handleLanguageChange}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {problem.supportedLanguages.map(lang => (
                <option key={lang} value={lang}>{lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CodeEditor
              language={language}
              value={code}
              onChange={setCode}
            />
          </div>

          {/* Execution Panel */}
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '250px' }}>
            {/* Custom Input */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Custom Input</label>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontFamily: 'monospace',
                  resize: 'none'
                }}
                placeholder="Enter input here..."
              />
            </div>

            {/* Execution Result */}
            {executionResult && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: executionResult.status === 'completed' ? 'var(--success)' : 'var(--error)' }}>
                    Status: {executionResult.status}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>Time: {executionResult.executionTimeMs} ms</span>
                </div>
                
                {executionResult.stdout && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Output</div>
                    <pre style={{ margin: 0, padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {executionResult.stdout}
                    </pre>
                  </div>
                )}

                {executionResult.stderr && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--error)' }}>Errors / System Message</div>
                    <pre style={{ margin: 0, padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--error)' }}>
                      {executionResult.stderr}
                    </pre>
                  </div>
                )}
              </div>
            )}
            
            {/* Submission Result */}
            {submissionResult && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: `1px solid ${submissionResult.status === 'accepted' ? 'var(--success)' : 'var(--error)'}`, overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600, color: submissionResult.status === 'accepted' ? 'var(--success)' : 'var(--error)' }}>
                  {submissionResult.status === 'accepted' ? '✓ Accepted' : '✗ ' + submissionResult.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Test Cases Passed</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{submissionResult.passedTests} / {submissionResult.totalTests}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Score</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{submissionResult.score}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Execution Time</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{submissionResult.executionTimeMs} ms</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Language</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'capitalize' }}>{submissionResult.language}</div>
                  </div>
                </div>

                {submissionResult.errorMessage && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--error)', marginBottom: '0.5rem' }}>Compiler / Runtime Message</div>
                    <pre style={{ margin: 0, padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--error)' }}>
                      {submissionResult.errorMessage}
                    </pre>
                  </div>
                )}
                
                {submissionResult.isFirstSolve && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', borderRadius: '4px', textAlign: 'center', fontWeight: 600 }}>
                    🎉 First Solve! Progress and Ranking updated.
                  </div>
                )}
              </div>
            )}
          </div>

          {actionMessage && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <strong>Notice:</strong> {actionMessage}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .workspace-container {
            flex-direction: column;
          }
          .workspace-container > div {
            border-right: none !important;
            border-bottom: 1px solid var(--border-color);
          }
        }
      `}</style>
    </div>
  );
};
