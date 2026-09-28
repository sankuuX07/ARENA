import api from './api';
import { Competition, CompetitionSession, CompetitionResult, CompetitionLeaderboardResponse, CompetitionHistoryItem } from '../types/competition';
class CompetitionService {
    async getAll() {
        const res = await api.get('/competitions/');
        return res;
    }
    async getLive() {
        const res = await api.get('/competitions/live');
        return res;
    }
    async getUpcoming() {
        const res = await api.get('/competitions/upcoming');
        return res;
    }
    async getHistory() {
        const res = await api.get('/competitions/history');
        return res;
    }
    async getById(id) {
        const res = await api.get(`/competitions/${id}`);
        return res;
    }
    async register(id) {
        const res = await api.post(`/competitions/${id}/register`);
        return res;
    }
    async start(id) {
        const res = await api.post(`/competitions/${id}/start`);
        return res;
    }
    async getSession(id) {
        const res = await api.get(`/competitions/${id}/session`);
        return res;
    }
    async updateSession(id, answers) {
        const res = await api.patch(`/competitions/${id}/session`, answers);
        return res;
    }
    async submit(id) {
        const res = await api.post(`/competitions/${id}/submit`);
        return res;
    }
    async getResult(id) {
        const res = await api.get(`/competitions/${id}/result`);
        return res;
    }
    async getLeaderboard(id) {
        const res = await api.get(`/competitions/${id}/leaderboard`);
        return res;
    }
}
export const competitionService = new CompetitionService();
//# sourceMappingURL=competitionService.js.map