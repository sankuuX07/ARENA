import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export const getCppTopics = async () => {
    return await ApiService.get('/technical/cpp/topics');
};
export const getCppTopic = async (topicId) => {
    return await ApiService.get(`/technical/cpp/topics/${topicId}`);
};
export const startCppSession = async (topic, difficulty, questionType, count = 10) => {
    return await ApiService.post('/technical/cpp/sessions/start', {
        topic,
        difficulty,
        questionType,
        count
    });
};
export const completeCppSession = async (sessionId) => {
    return await ApiService.post(`/technical/cpp/sessions/${sessionId}/complete`, {});
};
export const submitCppAnswer = async (sessionId, questionId, selectedOption) => {
    return await ApiService.post(`/technical/cpp/sessions/${sessionId}/answer`, {
        questionId,
        selectedOption
    });
};
//# sourceMappingURL=cppService.js.map