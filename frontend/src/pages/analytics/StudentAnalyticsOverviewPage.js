import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AnalyticsCategoryCard } from '../../components/analytics/AnalyticsCategoryCard';
import { AnalyticsScoreCard } from '../../components/analytics/AnalyticsScoreCard';
import { AnalyticsCoverageCard } from '../../components/analytics/AnalyticsCoverageCard';
import { AnalyticsStrengthsCard } from '../../components/analytics/AnalyticsStrengthsCard';
import { AnalyticsInsightsCard } from '../../components/analytics/AnalyticsInsightsCard';
import { AnalyticsActivityTimeline } from '../../components/analytics/AnalyticsActivityTimeline';
import { NextBestActionCard } from '../../components/recommendations/NextBestActionCard';
import { analyticsService } from '../../services/analyticsService';
import { recommendationService } from '../../services/recommendationService';
import { AnalyticsOverview } from '../../types/analytics';
import { StudentRecommendation } from '../../types/recommendation';
import { BarChart2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeIn } from '../../utils/motion';
export const StudentAnalyticsOverviewPage = () => {
    const [overview, setOverview] = useState(null);
    const [nextAction, setNextAction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const fetchOverview = async (forceRefresh = false) => {
        if (forceRefresh)
            setIsRefreshing(true);
        setError(null);
        try {
            const data = forceRefresh
                ? await analyticsService.refreshOverview()
                : await analyticsService.getOverview();
            setOverview(data);
            const recData = await recommendationService.getNextAction().catch(() => null);
            setNextAction(recData);
        }
        catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load analytics data');
        }
        finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };
    useEffect(() => {
        fetchOverview();
    }, []);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (error) {
        return (_jsxs("div", { className: "page-container", style: { textAlign: 'center', padding: '4rem' }, children: [_jsx("h2", { children: "Error loading analytics" }), _jsx("p", { style: { color: 'var(--error)' }, children: error }), _jsx(Button, { onClick: () => fetchOverview(true), children: "Try Again" })] }));
    }
    if (!overview)
        return null;
    return (_jsxs(motion.div, { className: "page-container", variants: staggerContainer, initial: "hidden", animate: "visible", children: [_jsx(motion.div, { variants: fadeIn, children: _jsx(PageHeader, { title: "Unified Student Analytics", subtitle: "Your complete learning and placement preparation progress.", icon: _jsx(BarChart2, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => fetchOverview(true), disabled: isRefreshing, icon: _jsx(RefreshCw, { size: 16, className: isRefreshing ? 'spin' : '' }), children: isRefreshing ? 'Refreshing...' : 'Refresh Analytics' }) }) }), _jsxs(motion.div, { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }, variants: staggerItem, children: [_jsx(AnalyticsScoreCard, { title: "Overall Preparation Score", score: overview.overallScore, performanceLevel: overview.performanceLevel, subtitle: `Based on ${overview.coverage.exploredCategories} of ${overview.coverage.availableCategories} preparation areas` }), _jsx(AnalyticsCoverageCard, { coverage: overview.coverage }), _jsx(AnalyticsStrengthsCard, { strengths: overview.strengths, improvementAreas: overview.improvementAreas })] }), nextAction && (_jsxs(motion.div, { style: { marginBottom: '2rem' }, variants: staggerItem, children: [_jsx("h2", { style: { marginBottom: '1rem' }, children: "Personalized Next Steps" }), _jsx(NextBestActionCard, { recommendation: nextAction })] })), _jsxs(motion.div, { style: { display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem', marginBottom: '2rem' }, variants: staggerItem, children: [_jsxs("div", { children: [_jsx("h2", { style: { marginBottom: '1.5rem' }, children: "Category Breakdown" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }, children: overview.categories.map(category => (_jsx(AnalyticsCategoryCard, { category: category, viewRoute: `/analytics/${category.id}` }, category.id))) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: [_jsx(AnalyticsInsightsCard, { insights: overview.insights }), _jsx(AnalyticsActivityTimeline, { activities: overview.recentActivity })] })] }), _jsxs(motion.div, { style: { textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }, variants: fadeIn, children: ["Last updated: ", new Date(overview.lastUpdated).toLocaleString()] })] }));
};
//# sourceMappingURL=StudentAnalyticsOverviewPage.js.map