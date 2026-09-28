import { ApiService } from './api';
export const getPuzzleProblems = async () => {
    return await ApiService.get('/puzzles/problems');
};
export const getPuzzleProblem = async (problemId) => {
    return await ApiService.get(`/puzzles/problems/${problemId}`);
};
export const submitPuzzleSolution = async (request) => {
    return await ApiService.post('/puzzles/submissions', request);
};
export const getPuzzleProgress = async (uid) => {
    return await ApiService.get(`/puzzles/progress/${uid}`);
};
export const generatePuzzleProblem = async (request) => {
    return await ApiService.post('/puzzles/generate', request);
};
export const submitCodingSolution = async (request) => {
    return await ApiService.post('/puzzles/coding-submissions', request);
};
export const getSubmissionHistory = async () => {
    return await ApiService.get('/puzzles/submissions/history');
};
//# sourceMappingURL=puzzleService.js.map