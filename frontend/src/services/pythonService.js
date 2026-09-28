import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalTopic, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export const getPythonTopics = async () => {
    return await ApiService.get('/technical/python/topics');
};
export const getPythonTopic = async (topicId) => {
    return await ApiService.get(`/technical/python/topics/${topicId}`);
};
export const startPythonSession = async (topic, difficulty, questionType, count = 10) => {
    return await ApiService.post('/technical/python/sessions/start', {
        topic,
        difficulty,
        questionType,
        count
    });
};
export const completePythonSession = async (sessionId) => {
    return await ApiService.post(`/technical/python/sessions/${sessionId}/complete`, {});
};
export const submitPythonAnswer = async (sessionId, questionId, selectedOption) => {
    return await ApiService.post(`/technical/python/sessions/${sessionId}/answer`, {
        questionId,
        selectedOption
    });
};
//# sourceMappingURL=pythonService.js.map