import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export const getJavaTopics = async () => {
    return await ApiService.get('/technical/java/topics');
};
export const getJavaTopic = async (topicId) => {
    return await ApiService.get(`/technical/java/topics/${topicId}`);
};
export const startJavaSession = async (topic, difficulty, questionType, count = 10) => {
    return await ApiService.post('/technical/java/sessions/start', {
        topic,
        difficulty,
        questionType,
        count
    });
};
export const completeJavaSession = async (sessionId) => {
    return await ApiService.post(`/technical/java/sessions/${sessionId}/complete`, {});
};
export const submitJavaAnswer = async (sessionId, questionId, selectedOption) => {
    return await ApiService.post(`/technical/java/sessions/${sessionId}/answer`, {
        questionId,
        selectedOption
    });
};
//# sourceMappingURL=javaService.js.map