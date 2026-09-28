import { ApiService } from './api';
export const getAssessments = async () => {
    return await ApiService.get('/assessments');
};
export const getAssessment = async (assessmentId) => {
    return await ApiService.get(`/assessments/${assessmentId}`);
};
export const startAssessmentSession = async (assessmentId) => {
    return await ApiService.post(`/assessments/${assessmentId}/sessions`, {});
};
export const getAssessmentSession = async (sessionId) => {
    return await ApiService.get(`/assessments/sessions/${sessionId}`);
};
export const saveAssessmentAnswer = async (sessionId, answer) => {
    return await ApiService.post(`/assessments/sessions/${sessionId}/answers`, {
        sessionId,
        ...answer
    });
};
export const submitAssessment = async (sessionId) => {
    return await ApiService.post(`/assessments/sessions/${sessionId}/submit`, {});
};
export const getAssessmentHistory = async () => {
    return await ApiService.get('/assessments/results/history');
};
export const getAssessmentResult = async (resultId) => {
    return await ApiService.get(`/assessments/results/${resultId}`);
};
export const getAssessmentReview = async (resultId) => {
    return await ApiService.get(`/assessments/results/${resultId}/review`);
};
export const getAssessmentSessionStatus = async (sessionId) => {
    return await ApiService.get(`/assessments/sessions/${sessionId}/status`);
};
//# sourceMappingURL=assessmentService.js.map