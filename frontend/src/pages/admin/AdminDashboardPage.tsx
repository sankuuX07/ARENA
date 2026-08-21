import React, { useEffect, useState } from 'react';
import { adminService, AdminDashboardStats } from '../../services/adminService';
import { Users, Activity, Trophy, BookOpen } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboardStats()
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Platform Overview</h2>
        <p className="text-gray-400 mt-2">Real-time statistics and activity for the ARENA platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="bg-blue-500" />
        <StatCard title="Active Students" value={stats.activeStudents} icon={Activity} color="bg-green-500" />
        <StatCard title="Live Competitions" value={stats.liveCompetitions} icon={Trophy} color="bg-yellow-500" />
        <StatCard title="Assessments Completed" value={stats.completedAssessments} icon={BookOpen} color="bg-purple-500" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <span className="text-gray-200">{activity.action}</span>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
          {stats.recentActivity.length === 0 && (
            <div className="text-gray-500 text-center py-8">No recent activity found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}/20 text-white`}>
      <Icon className={`w-8 h-8 text-${color.split('-')[1]}-400`} />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  </div>
);

export default AdminDashboardPage;
