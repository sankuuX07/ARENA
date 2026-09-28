import { ApiService } from './api';
import { TechnicalQuestionType, TechnicalDifficulty, TechnicalSession, TechnicalResult, TechnicalAnswerResponse } from './technicalService';
export const getCSCoreSubjects = async () => {
    return await ApiService.get('/technical/cs-core/subjects');
};
export const getCSCoreSubject = async (subjectId) => {
    return await ApiService.get(`/technical/cs-core/subjects/${subjectId}`);
};
export const getCSCoreTopics = async (subjectId) => {
    return await ApiService.get(`/technical/cs-core/subjects/${subjectId}/topics`);
};
export const startCSCoreSession = async (subjectId, topicId, difficulty, questionType, count = 10) => {
    return await ApiService.post('/technical/cs-core/sessions/start', {
        subjectId,
        topicId,
        difficulty,
        questionType,
        count
    });
};
export const completeCSCoreSession = async (sessionId) => {
    return await ApiService.post(`/technical/cs-core/sessions/${sessionId}/complete`, {});
};
export const submitCSCoreAnswer = async (sessionId, questionId, selectedOption) => {
    return await ApiService.post(`/technical/cs-core/sessions/${sessionId}/answer`, {
        questionId,
        selectedOption
    });
};
//# sourceMappingURL=csCoreService.js.map