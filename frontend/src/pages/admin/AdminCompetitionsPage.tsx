import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Plus } from 'lucide-react';

const AdminCompetitionsPage: React.FC = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getCompetitions()
      .then(setCompetitions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Competition Management</h2>
          <p className="text-gray-400 mt-2">Create and manage coding and aptitude competitions.</p>
        </div>
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20">
          <Plus className="w-5 h-5" />
          Create Competition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-gray-400 text-center py-8">Loading competitions...</div>
        ) : competitions.map(comp => (
          <div key={comp.competitionId} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">{comp.title}</h3>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase ${
                comp.status === 'live' ? 'bg-green-500/10 text-green-400' :
                comp.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-400'
              }`}>
                {comp.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{comp.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{comp.type}</span>
              <span>{comp.participantCount} participants</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCompetitionsPage;
