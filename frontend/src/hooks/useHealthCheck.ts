import { useState, useEffect, useCallback } from 'react';
import { fetchHealthCheck } from '../services/healthService';
import { HealthCheckResponse } from '../types';

export const useHealthCheck = () => {
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHealthCheck();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to ARENA backend');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return { data, loading, error, refetch: checkHealth };
};
