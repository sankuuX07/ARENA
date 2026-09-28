import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary, DashboardStats, ModuleProgressItem, QuickActionItem, RecentActivityItem, RecommendationItem, } from '../services/dashboardService';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ProfileCompletionCard } from '../components/dashboard/ProfileCompletionCard';
import { ModuleProgressSection } from '../components/dashboard/ModuleProgressSection';
import { QuickActionsGrid } from '../components/dashboard/QuickActionsGrid';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { RecommendedPracticeGrid } from '../components/dashboard/RecommendedPracticeGrid';
import { PerformanceOverviewCard } from '../components/dashboard/PerformanceOverviewCard';
import { ResumeWidget } from '../components/dashboard/ResumeWidget';
import { AnalyticsWidget } from '../components/dashboard/AnalyticsWidget';
import { RecommendationWidget } from '../components/dashboard/RecommendationWidget';
import { CompetitionDashboardWidget } from '../components/dashboard/CompetitionDashboardWidget';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Award, Trophy, CheckCircle2, Flame, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/motion';
const DashboardHero3D = React.lazy(() => import('../components/3d/DashboardHero3D').then(m => ({ default: m.DashboardHero3D })));
export const DashboardPage = () => {
    const { userProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [modules, setModules] = useState([]);
    const [quickActions, setQuickActions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDashboardSummary(userProfile);
            setStats(data.stats);
            setModules(data.moduleProgress);
            setQuickActions(data.quickActions);
            setActivities(data.recentActivities);
            setRecommendations(data.recommendations);
        }
        catch (err) {
            setError(err.message || 'Unable to load dashboard data. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadDashboardData();
    }, [userProfile]);
    return (_jsxs(motion.div, { className: "dashboard-page-container", style: { maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative' }, variants: staggerContainer, initial: "hidden", animate: "visible", children: [_jsx(Suspense, { fallback: null, children: _jsx(DashboardHero3D, {}) }), _jsx(DashboardHeader, { profile: userProfile }), _jsx(ProfileCompletionCard, { profile: userProfile }), error && (_jsxs("div", { style: { margin: '1rem 0' }, children: [_jsxs("div", { className: "error-alert", children: [_jsxs("div", { className: "error-alert-header", children: [_jsx(AlertCircle, { size: 20 }), _jsx("span", { className: "error-title", children: "Dashboard Loading Error" })] }), _jsx("div", { className: "error-message", children: error })] }), _jsx(Button, { variant: "primary", icon: _jsx(RefreshCw, { size: 16 }), onClick: loadDashboardData, style: { marginTop: '1rem' }, children: "Try Again" })] })), loading && !error && (_jsx("div", { style: { display: 'flex', padding: '1rem', justifyContent: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }, children: _jsx(LoadingSpinner, { message: "Syncing your progress...", size: 20 }) })), !error && (_jsxs(_Fragment, { children: [_jsxs(motion.div, { className: "stat-card-grid", variants: staggerItem, style: { opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }, children: [_jsx(StatCard, { label: "Overall Score", value: stats ? `${stats.overallScore}` : '0', subtext: `Accuracy: ${stats?.accuracy || 0}%`, icon: _jsx(Award, { size: 20 }), badge: _jsx(Badge, { variant: "success", children: "Progress Engine" }) }), _jsx(StatCard, { label: "Current Rank", value: stats?.currentRank || '#--', subtext: stats?.rankCohort || 'CS Cohort', icon: _jsx(Trophy, { size: 20 }), badge: _jsx(Badge, { variant: "primary", children: "Ranked" }) }), _jsx(StatCard, { label: "Problems Solved", value: stats ? `${stats.problemsSolved}` : '0', subtext: `Target: ${stats?.problemsTarget || 200}`, icon: _jsx(CheckCircle2, { size: 20 }), badge: _jsx(Badge, { variant: "info", children: "Solved" }) }), _jsx(StatCard, { label: "Current Streak", value: stats ? `${stats.streakDays} days` : '0 days', subtext: "Active learning streak", icon: _jsx(Flame, { size: 20, style: { color: 'var(--warning)' } }), badge: _jsxs(Badge, { variant: "warning", children: [stats?.streakDays || 0, " \uD83D\uDD25"] }) })] }), _jsxs(motion.div, { className: "dashboard-grid", variants: staggerItem, children: [_jsx("div", { className: "dash-col-8", children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '0px' }, children: [_jsx(CompetitionDashboardWidget, {}), _jsx(RecommendationWidget, {}), _jsx(AnalyticsWidget, {}), _jsx(ResumeWidget, {}), _jsx(ModuleProgressSection, { modules: modules }), _jsx(QuickActionsGrid, { actions: quickActions }), _jsx(RecommendedPracticeGrid, { recommendations: recommendations })] }) }), _jsxs("div", { className: "dash-col-4", children: [_jsx(RecentActivityList, { activities: activities }), _jsx(PerformanceOverviewCard, {})] })] })] }))] }));
};
//# sourceMappingURL=DashboardPage.js.map