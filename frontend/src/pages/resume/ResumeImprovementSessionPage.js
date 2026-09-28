import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ResumeImprovementSuggestionCard } from '../../components/resume/improvement/ResumeImprovementSuggestionCard';
import { resumeImprovementService } from '../../services/resumeImprovementService';
import { ResumeImprovementSummary } from '../../types/resumeImprovement';
import { Activity, ArrowLeft, Wand2 } from 'lucide-react';
export const ResumeImprovementSessionPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generateSection, setGenerateSection] = useState('Professional Summary');
    const fetchSummary = async () => {
        if (!sessionId)
            return;
        try {
            const data = await resumeImprovementService.getSessionSummary(sessionId);
            setSummary(data);
        }
        catch (err) {
            console.error(err);
            navigate('/resume/improve');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchSummary();
    }, [sessionId]);
    const handleGenerate = async () => {
        if (!sessionId)
            return;
        setIsGenerating(true);
        try {
            await resumeImprovementService.generateSuggestions(sessionId, generateSection);
            await fetchSummary(); // Refresh to show new suggestions
        }
        catch (err) {
            console.error(err);
            alert('Failed to generate suggestions. Please try again.');
        }
        finally {
            setIsGenerating(false);
        }
    };
    const handleAccept = async (suggestionId) => {
        if (!sessionId)
            return;
        await resumeImprovementService.acceptSuggestion(sessionId, suggestionId);
        await fetchSummary();
    };
    const handleReject = async (suggestionId) => {
        if (!sessionId)
            return;
        await resumeImprovementService.rejectSuggestion(sessionId, suggestionId);
        await fetchSummary();
    };
    const handleEdit = async (suggestionId, editedText) => {
        if (!sessionId)
            return;
        await resumeImprovementService.editSuggestion(sessionId, suggestionId, editedText);
        await resumeImprovementService.acceptSuggestion(sessionId, suggestionId);
        await fetchSummary();
    };
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (!summary)
        return _jsx("div", { children: "Session not found." });
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '900px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Resume Improvement Session", subtitle: "Review AI suggestions, compare before & after, and build your draft.", icon: _jsx(Activity, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/resume/improve'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back" }) }), _jsxs(Card, { style: { marginBottom: '2rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }, children: [_jsxs("select", { value: generateSection, onChange: (e) => setGenerateSection(e.target.value), style: { padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', flex: 1 }, children: [_jsx("option", { value: "Professional Summary", children: "Professional Summary" }), _jsx("option", { value: "Projects", children: "Projects" }), _jsx("option", { value: "Experience", children: "Experience" }), _jsx("option", { value: "Technical Skills", children: "Technical Skills" })] }), _jsx(Button, { onClick: handleGenerate, disabled: isGenerating, icon: _jsx(Wand2, { size: 16 }), children: isGenerating ? 'Generating...' : 'Generate New Suggestions' })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: summary.suggestions.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }, children: [_jsx(Wand2, { size: 48, style: { opacity: 0.5, marginBottom: '1rem' } }), _jsx("h3", { children: "No suggestions yet" }), _jsx("p", { children: "Select a section above and click Generate to get started." })] })) : (summary.suggestions
                    .sort((a, b) => {
                    const pMap = { high: 0, medium: 1, low: 2 };
                    return pMap[a.priority] - pMap[b.priority];
                })
                    .map(suggestion => (_jsx(ResumeImprovementSuggestionCard, { suggestion: suggestion, onAccept: handleAccept, onReject: handleReject, onEdit: handleEdit }, suggestion.suggestionId)))) })] }));
};
//# sourceMappingURL=ResumeImprovementSessionPage.js.map