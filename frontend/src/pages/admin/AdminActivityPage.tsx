import React from 'react';
import { Activity } from 'lucide-react';

const AdminActivityPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Platform Activity</h2>
          <p className="text-gray-400 mt-2">View safe audit logs and system events.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No Recent Audits</h3>
        <p className="text-gray-400 max-w-sm mx-auto">
          Audit logs will appear here when administrative actions are taken. Safe metadata is recorded automatically.
        </p>
      </div>
    </div>
  );
};

export default AdminActivityPage;
