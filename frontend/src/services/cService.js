import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export const getCTopics = async () => {
    return await ApiService.get('/technical/c/topics');
};
export const getCTopic = async (topicId) => {
    return await ApiService.get(`/technical/c/topics/${topicId}`);
};
export const startCSession = async (topic, difficulty, questionType, count = 10) => {
    return await ApiService.post('/technical/c/sessions/start', {
        topic,
        difficulty,
        questionType,
        count
    });
};
export const completeCSession = async (sessionId) => {
    return await ApiService.post(`/technical/c/sessions/${sessionId}/complete`, {});
};
export const submitCAnswer = async (sessionId, questionId, selectedOption) => {
    return await ApiService.post(`/technical/c/sessions/${sessionId}/answer`, {
        questionId,
        selectedOption
    });
};
//# sourceMappingURL=cService.js.map