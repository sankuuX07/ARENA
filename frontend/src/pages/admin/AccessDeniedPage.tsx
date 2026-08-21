import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AccessDeniedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl shadow-red-500/5">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Access Restricted</h1>
        <p className="text-gray-400 leading-relaxed">
          You do not have permission to access the administrative section of ARENA. This action has been logged.
        </p>
        <div className="pt-4">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center justify-center w-full bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
