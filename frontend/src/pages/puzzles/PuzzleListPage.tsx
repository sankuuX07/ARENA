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

export const PuzzleListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [problems, setProblems] = useState<PuzzleProblem[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<PuzzleProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Basic filter state
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  
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
        getPuzzleProgress(currentUser!.uid),
        getSubmissionHistory().catch(() => [] as CodingSubmissionResponse[])
      ]);
      setProblems(probs);
      setProgress(prog);
      
      const solved = new Set(history.filter(s => s.status === 'accepted').map(s => s.problemId));
      setSolvedIds(solved);
    } catch (err) {
      console.error('Failed to load puzzle data', err);
    } finally {
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
    } catch (err: any) {
      setGenError(err.message || 'Failed to generate problem');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <PageHeader
        title="ARENA Puzzle Arena"
        description="Think. Code. Solve. Compete. Master technical problem-solving."
        icon={<Terminal size={28} />}
        action={
          <Button variant="primary" icon={<Sparkles size={16} />} onClick={() => setShowGenerator(!showGenerator)}>
            {showGenerator ? 'Close Generator' : 'Generate Problem'}
          </Button>
        }
      />

      {showGenerator && (
        <Card style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Sparkles size={20} /> AI Problem Generator
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
              <select value={genCategory} onChange={e => setGenCategory(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Difficulty</label>
              <select value={genDifficulty} onChange={e => setGenDifficulty(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Type</label>
              <select value={genType} onChange={e => setGenType(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                <option value="Algorithmic">Algorithmic</option>
                <option value="Data Structure">Data Structure</option>
                <option value="Mathematical">Mathematical</option>
                <option value="Optimization">Optimization</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Target Language</label>
              <select value={genLang} onChange={e => setGenLang(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>
          
          {genError && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{genError}</div>}
          
          <Button variant="primary" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate AI Problem'}
          </Button>
        </Card>
      )}

      {/* Stats row - Foundation ready */}
      {progress && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Problems Solved</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{progress.problemsSolved}</div>
          </Card>
          <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Accuracy</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{progress.accuracy}%</div>
          </Card>
          <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Easy / Medium / Hard</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--success)' }}>{progress.easySolved}</span> / <span style={{ color: 'var(--warning)' }}>{progress.mediumSolved}</span> / <span style={{ color: 'var(--error)' }}>{progress.hardSolved}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '0 0.5rem', color: 'var(--text-secondary)' }}><Filter size={16} /></div>
          {['all', 'easy', 'medium', 'hard'].map(level => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: difficultyFilter === level ? 'var(--bg-active)' : 'transparent',
                color: difficultyFilter === level ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: difficultyFilter === level ? 600 : 400,
                textTransform: 'capitalize'
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Problem List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading problems...</div>
      ) : filteredProblems.length === 0 ? (
        <EmptyState icon={<Code2 />} title="No Problems Found" description="Try adjusting your filters or search." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredProblems.map(problem => (
            <Card 
              key={problem.problemId} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: problem.sourceType === 'ai_generated' ? '1px solid rgba(139, 92, 246, 0.4)' : undefined
              }}
              onClick={() => navigate(`/puzzles/${problem.problemId}`)}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {problem.title}
                  <Badge variant={
                    problem.difficulty.toLowerCase() === 'easy' ? 'success' : 
                    problem.difficulty.toLowerCase() === 'medium' ? 'warning' : 'error'
                  }>
                    {problem.difficulty}
                  </Badge>
                  {problem.sourceType === 'ai_generated' && (
                    <Badge variant="primary">AI Generated</Badge>
                  )}
                  {solvedIds.has(problem.problemId) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                      <CheckCircle size={14} /> Solved
                    </div>
                  )}
                </h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '1rem' }}>
                  <span>Category: {problem.category}</span>
                  <span>Languages: {problem.supportedLanguages.join(', ')}</span>
                </div>
              </div>
              <div>
                <Button variant="primary" icon={<ArrowRight size={16} />} iconPosition="right" onClick={(e) => { e.stopPropagation(); navigate(`/puzzles/${problem.problemId}`); }}>
                  Solve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
