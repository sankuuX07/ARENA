import { ApiService } from './api';
import { HealthCheckResponse } from '../types';
export const fetchHealthCheck = async () => {
    return await ApiService.get('/api/health');
};
//# sourceMappingURL=healthService.js.map