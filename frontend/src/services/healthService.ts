import { ApiService } from './api';
import { HealthCheckResponse } from '../types';

export const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  return await ApiService.get<HealthCheckResponse>('/api/health');
};
