import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileText, ArrowRight, Activity, ArrowLeft } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { resumeImprovementService } from '../../services/resumeImprovementService';
import { ResumeDetail } from '../../types/resume';
import { ResumeImprovementSession } from '../../types/resumeImprovement';
export const ResumeImprovementOverview = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let currentResume = null;
                if (resumeId) {
                    currentResume = await resumeService.getResumeDetails(resumeId);
                }
                else {
                    currentResume = await resumeService.getActiveResume();
                }
                setResume(currentResume);
                if (currentResume) {
                    const userSessions = await resumeImprovementService.getSessions();
                    setSessions(userSessions.filter(s => s.resumeId === currentResume.resumeId));
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [resumeId]);
    const handleStartImprovement = async () => {
        if (!resume)
            return;
        setIsStarting(true);
        try {
            const activeSession = sessions.find(s => s.status === 'active');
            if (activeSession) {
                navigate(`/resume/improvement/${activeSession.sessionId}`);
                return;
            }
            const session = await resumeImprovementService.createSession(resume.resumeId);
            navigate(`/resume/improvement/${session.sessionId}`);
        }
        catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || 'Failed to start improvement session');
            setIsStarting(false);
        }
    };
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (!resume) {
        return (_jsx("div", { className: "page-container", style: { maxWidth: '800px', margin: '0 auto' }, children: _jsxs(Card, { style: { padding: '3rem', textAlign: 'center' }, children: [_jsx(FileText, { size: 48, style: { margin: '0 auto 1rem auto', color: 'var(--text-muted)' } }), _jsx("h2", { children: "No Resume Found" }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: '2rem' }, children: "Upload a resume before starting improvement." }), _jsx(Button, { onClick: () => navigate('/resume/upload'), children: "Upload Resume" })] }) }));
    }
    const activeSession = sessions.find(s => s.status === 'active');
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Resume Improvement", subtitle: "AI-assisted guidance to rewrite and polish your resume content.", icon: _jsx(Activity, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/resume'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back to Center" }) }), _jsxs(Card, { style: { marginBottom: '2rem' }, children: [_jsx("h3", { style: { marginBottom: '1rem' }, children: "Active Resume" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }, children: [_jsx(FileText, { size: 32, style: { color: 'var(--primary)' } }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 'bold' }, children: resume.originalFileName }), _jsxs("div", { style: { fontSize: '0.9rem', color: 'var(--text-muted)' }, children: ["Uploaded on ", new Date(resume.uploadedAt).toLocaleDateString()] })] })] }), activeSession ? (_jsxs("div", { style: { padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }, children: "Resume improvement in progress" }), _jsxs("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: ["You have an active session with ", activeSession.suggestionsCount, " total suggestions generated."] })] }), _jsx(Button, { onClick: () => navigate(`/resume/improvement/${activeSession.sessionId}`), icon: _jsx(ArrowRight, { size: 16 }), children: "Continue" })] })) : (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 'bold', marginBottom: '0.25rem' }, children: "Ready to improve your resume?" }), _jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: "Our AI will analyze your content and provide section-by-section rewriting suggestions." })] }), _jsx(Button, { onClick: handleStartImprovement, disabled: isStarting, icon: _jsx(ArrowRight, { size: 16 }), children: isStarting ? 'Starting...' : 'Start Improving' })] }))] }), sessions.length > 0 && (_jsx("div", { style: { textAlign: 'center' }, children: _jsx(Button, { variant: "ghost", onClick: () => navigate('/resume/improvement/history'), children: "View Improvement History" }) }))] }));
};
//# sourceMappingURL=ResumeImprovementOverview.js.map