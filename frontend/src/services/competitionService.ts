import api from './api';
import {
  Competition,
  CompetitionSession,
  CompetitionResult,
  CompetitionLeaderboardResponse,
  CompetitionHistoryItem
} from '../types/competition';

class CompetitionService {
  async getAll(): Promise<Competition[]> {
    const res = await api.get('/competitions/');
    return res;
  }

  async getLive(): Promise<Competition[]> {
    const res = await api.get('/competitions/live');
    return res;
  }

  async getUpcoming(): Promise<Competition[]> {
    const res = await api.get('/competitions/upcoming');
    return res;
  }

  async getHistory(): Promise<CompetitionHistoryItem[]> {
    const res = await api.get('/competitions/history');
    return res;
  }

  async getById(id: string): Promise<Competition> {
    const res = await api.get(`/competitions/${id}`);
    return res;
  }

  async register(id: string): Promise<any> {
    const res = await api.post(`/competitions/${id}/register`);
    return res;
  }

  async start(id: string): Promise<CompetitionSession> {
    const res = await api.post(`/competitions/${id}/start`);
    return res;
  }

  async getSession(id: string): Promise<CompetitionSession> {
    const res = await api.get(`/competitions/${id}/session`);
    return res;
  }

  async updateSession(id: string, answers: Record<string, any>): Promise<CompetitionSession> {
    const res = await api.patch(`/competitions/${id}/session`, answers);
    return res;
  }

  async submit(id: string): Promise<CompetitionResult> {
    const res = await api.post(`/competitions/${id}/submit`);
    return res;
  }

  async getResult(id: string): Promise<CompetitionResult> {
    const res = await api.get(`/competitions/${id}/result`);
    return res;
  }

  async getLeaderboard(id: string): Promise<CompetitionLeaderboardResponse> {
    const res = await api.get(`/competitions/${id}/leaderboard`);
    return res;
  }
}

export const competitionService = new CompetitionService();
