import { ApiService } from './api';
export const getInterviewModes = async () => {
    return await ApiService.get('/interviews/modes');
};
export const startInterviewSession = async (config) => {
    return await ApiService.post('/interviews/sessions', config);
};
export const getInterviewSession = async (sessionId) => {
    return await ApiService.get(`/interviews/sessions/${sessionId}`);
};
export const respondToInterview = async (sessionId, request) => {
    return await ApiService.post(`/interviews/sessions/${sessionId}/respond`, request);
};
export const endInterviewSession = async (sessionId) => {
    return await ApiService.post(`/interviews/sessions/${sessionId}/end`, {});
};
export const getInterviewStatus = async (sessionId) => {
    return await ApiService.get(`/interviews/sessions/${sessionId}/status`);
};
//# sourceMappingURL=interviewService.js.map