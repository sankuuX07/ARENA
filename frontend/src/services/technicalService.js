import { ApiService } from './api';
export const getTechnicalModules = async () => {
    return await ApiService.get('/technical/modules');
};
export const getTechnicalModule = async (moduleId) => {
    return await ApiService.get(`/technical/modules/${moduleId}`);
};
export const startTechnicalSession = async (language, topic, difficulty, count = 5) => {
    return await ApiService.post('/technical/sessions/start', {
        language,
        topic,
        difficulty,
        count
    });
};
export const completeTechnicalSession = async (sessionId) => {
    return await ApiService.post(`/technical/sessions/${sessionId}/complete`, {});
};
export const submitTechnicalAnswer = async (sessionId, questionId, selectedOption) => {
    return await ApiService.post(`/technical/sessions/${sessionId}/answer`, {
        questionId,
        selectedOption
    });
};
//# sourceMappingURL=technicalService.js.map