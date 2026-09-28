import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { History, ArrowLeft, ArrowRight } from 'lucide-react';
import { resumeImprovementService } from '../../services/resumeImprovementService';
import { ResumeImprovementSession } from '../../types/resumeImprovement';
export const ResumeImprovementHistoryPage = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await resumeImprovementService.getSessions();
                setSessions(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, []);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Improvement History", subtitle: "Review your past resume improvement sessions and drafts.", icon: _jsx(History, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/resume/improve'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back" }) }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: sessions.length === 0 ? (_jsxs(Card, { style: { padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }, children: [_jsx(History, { size: 48, style: { opacity: 0.5, marginBottom: '1rem' } }), _jsx("h3", { children: "No history available" }), _jsx("p", { children: "You haven't started any resume improvement sessions yet." })] })) : (sessions.map(session => (_jsxs(Card, { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '1.1rem' }, children: [new Date(session.createdAt).toLocaleDateString(), " at ", new Date(session.createdAt).toLocaleTimeString()] }), _jsxs("div", { style: { display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: [_jsxs("span", { children: [session.suggestionsCount, " Suggestions"] }), _jsx("span", { children: _jsxs("span", { style: { color: 'var(--success)' }, children: [session.acceptedCount, " Accepted"] }) }), _jsx("span", { children: _jsxs("span", { style: { color: 'var(--danger)' }, children: [session.rejectedCount, " Rejected"] }) })] })] }), _jsx(Button, { variant: "outline", onClick: () => navigate(`/resume/improvement/${session.sessionId}`), icon: _jsx(ArrowRight, { size: 16 }), children: "View Session" })] }, session.sessionId)))) })] }));
};
//# sourceMappingURL=ResumeImprovementHistoryPage.js.map