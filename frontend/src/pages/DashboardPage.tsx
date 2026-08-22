import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getDashboardSummary,
  DashboardStats,
  ModuleProgressItem,
  QuickActionItem,
  RecentActivityItem,
  RecommendationItem,
} from '../services/dashboardService';
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

export const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [modules, setModules] = useState<ModuleProgressItem[]>([]);
  const [quickActions, setQuickActions] = useState<QuickActionItem[]>([]);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

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
    } catch (err: any) {
      setError(err.message || 'Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [userProfile]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading your ARENA Student Dashboard..." size={22} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 500, margin: '3rem auto', textAlign: 'center' }}>
        <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
          <div className="error-alert-header" style={{ justifyContent: 'center' }}>
            <AlertCircle size={20} />
            <span className="error-title">Dashboard Loading Error</span>
          </div>
          <div className="error-message" style={{ textAlign: 'center' }}>
            {error}
          </div>
        </div>
        <Button variant="primary" icon={<RefreshCw size={16} />} onClick={loadDashboardData}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="dashboard-page-container" 
      style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative' }}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <Suspense fallback={null}>
        <DashboardHero3D />
      </Suspense>

      {/* Dynamic Welcome Greeting */}
      <DashboardHeader profile={userProfile} />

      {/* Profile Completion Nudge Banner */}
      <ProfileCompletionCard profile={userProfile} />

      {/* 4 Stat Cards Grid (Connected to Real Progress Engine) */}
      <motion.div className="stat-card-grid" variants={staggerItem}>
        <StatCard
          label="Overall Score"
          value={stats ? `${stats.overallScore}` : '0'}
          subtext={`Accuracy: ${stats?.accuracy || 0}%`}
          icon={<Award size={20} />}
          badge={<Badge variant="success">Progress Engine</Badge>}
        />
        <StatCard
          label="Current Rank"
          value={stats?.currentRank || '#--'}
          subtext={stats?.rankCohort || 'CS Cohort'}
          icon={<Trophy size={20} />}
          badge={<Badge variant="primary">Ranked</Badge>}
        />
        <StatCard
          label="Problems Solved"
          value={stats ? `${stats.problemsSolved}` : '0'}
          subtext={`Target: ${stats?.problemsTarget || 200}`}
          icon={<CheckCircle2 size={20} />}
          badge={<Badge variant="info">Solved</Badge>}
        />
        <StatCard
          label="Current Streak"
          value={stats ? `${stats.streakDays} days` : '0 days'}
          subtext="Active learning streak"
          icon={<Flame size={20} style={{ color: 'var(--warning)' }} />}
          badge={<Badge variant="warning">{stats?.streakDays || 0} 🔥</Badge>}
        />
      </motion.div>

      {/* Main Dashboard Layout Grid */}
      <motion.div className="dashboard-grid" variants={staggerItem}>
        {/* Left Column (Span 8): Module Progress, Quick Actions, Recommendations */}
        <div className="dash-col-8">
          <div className="dashboard-grid">
            <CompetitionDashboardWidget />
            <RecommendationWidget />
            <AnalyticsWidget />
            <ResumeWidget />
            <ModuleProgressSection modules={modules} />
            <QuickActionsGrid actions={quickActions} />
            <RecommendedPracticeGrid recommendations={recommendations} />
          </div>
        </div>

        {/* Right Column (Span 4): Activity & Performance Overview */}
        <div className="dash-col-4">
          <RecentActivityList activities={activities} />
          <PerformanceOverviewCard />
        </div>
      </motion.div>
    </motion.div>
  );
};
