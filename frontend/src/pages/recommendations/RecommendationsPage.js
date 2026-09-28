import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NextBestActionCard } from '../../components/recommendations/NextBestActionCard';
import { RecommendationSection } from '../../components/recommendations/RecommendationSection';
import { recommendationService } from '../../services/recommendationService';
import { RecommendationOverview } from '../../types/recommendation';
import { Compass, RefreshCw, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const RecommendationsPage = () => {
    const navigate = useNavigate();
    const [overview, setOverview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const fetchRecommendations = async (forceRefresh = false) => {
        if (forceRefresh)
            setIsRefreshing(true);
        setError(null);
        try {
            const data = forceRefresh
                ? await recommendationService.refreshRecommendations()
                : await recommendationService.getOverview();
            setOverview(data);
        }
        catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load recommendations');
        }
        finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };
    useEffect(() => {
        fetchRecommendations();
    }, []);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (error) {
        return (_jsxs("div", { className: "page-container", style: { textAlign: 'center', padding: '4rem' }, children: [_jsx("h2", { children: "Error loading your personalized plan" }), _jsx("p", { style: { color: 'var(--danger)' }, children: error }), _jsx(Button, { onClick: () => fetchRecommendations(true), children: "Try Again" })] }));
    }
    if (!overview)
        return null;
    // Filter recommendations by priority for sections (excluding nextBestAction if it's there)
    const remainingRecs = overview.activeRecommendations.filter(r => r.recommendationId !== overview.nextBestAction?.recommendationId);
    const critical = remainingRecs.filter(r => r.priority === 'critical');
    const high = remainingRecs.filter(r => r.priority === 'high');
    const medium = remainingRecs.filter(r => r.priority === 'medium');
    const low = remainingRecs.filter(r => r.priority === 'low');
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '1000px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Your Personalized Plan", subtitle: "AI-driven recommendations based on your performance and goals.", icon: _jsx(Compass, { size: 28 }), action: _jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx(Button, { variant: "outline", onClick: () => navigate('/recommendations/history'), icon: _jsx(History, { size: 16 }), children: "History" }), _jsx(Button, { onClick: () => fetchRecommendations(true), disabled: isRefreshing, icon: _jsx(RefreshCw, { size: 16, className: isRefreshing ? 'spin' : '' }), children: isRefreshing ? 'Refreshing...' : 'Refresh Plan' })] }) }), overview.nextBestAction ? (_jsx("div", { style: { marginBottom: '3rem' }, children: _jsx(NextBestActionCard, { recommendation: overview.nextBestAction }) })) : (_jsxs("div", { style: { textAlign: 'center', padding: '3rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '3rem' }, children: [_jsx("h3", { style: { marginBottom: '1rem', color: 'var(--text-secondary)' }, children: "No Critical Actions Found" }), _jsx("p", { style: { color: 'var(--text-muted)' }, children: "Complete more activities to receive personalized guidance." }), _jsx(Button, { onClick: () => navigate('/dashboard'), style: { marginTop: '1rem' }, children: "Return to Dashboard" })] })), remainingRecs.length > 0 && (_jsxs("div", { children: [_jsx(RecommendationSection, { title: "Critical Priorities", recommendations: critical, onDismissed: () => fetchRecommendations() }), _jsx(RecommendationSection, { title: "High Priority", recommendations: high, onDismissed: () => fetchRecommendations() }), _jsx(RecommendationSection, { title: "Medium Priority", recommendations: medium, onDismissed: () => fetchRecommendations() }), _jsx(RecommendationSection, { title: "Keep Improving / Coverage", recommendations: low, onDismissed: () => fetchRecommendations() })] })), _jsxs("div", { style: { textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2rem' }, children: ["Last refreshed: ", new Date(overview.lastRefreshed).toLocaleString()] })] }));
};
//# sourceMappingURL=RecommendationsPage.js.map