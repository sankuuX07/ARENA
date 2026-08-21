import React from 'react';

const AdminContentPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Content Management</h2>
          <p className="text-gray-400 mt-2">Manage coding problems, questions, and learning modules safely.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-medium text-white mb-2">Content Library</h3>
        <p className="text-gray-400">Content management functionality is currently operating in headless mode.</p>
        <p className="text-sm text-gray-500 mt-4">Note: Private test cases remain strictly isolated server-side.</p>
      </div>
    </div>
  );
};

export default AdminContentPage;
