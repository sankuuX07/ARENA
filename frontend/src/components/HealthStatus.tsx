import React from 'react';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { CheckCircle2, XCircle, RefreshCw, Server } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

export const HealthStatus: React.FC = () => {
  const { data, loading, error, refetch } = useHealthCheck();

  return (
    <div className="health-card">
      <div className="health-card-header">
        <div className="health-card-title">
          <Server size={18} className="text-accent" />
          <span>Backend Connectivity Test</span>
        </div>
        <button onClick={refetch} className="icon-button" title="Refresh health check" disabled={loading}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
        </button>
      </div>

      <div className="health-card-body">
        {loading ? (
          <LoadingSpinner message="Testing GET /api/health..." size={18} />
        ) : error ? (
          <div className="health-status error">
            <XCircle size={20} className="status-icon" />
            <div>
              <div className="status-label">Backend Unreachable</div>
              <div className="status-detail">{error}</div>
            </div>
          </div>
        ) : data ? (
          <div className="health-status success">
            <CheckCircle2 size={20} className="status-icon" />
            <div>
              <div className="status-label">Connected ({data.service})</div>
              <div className="status-detail">Status: <strong>{data.status}</strong></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
