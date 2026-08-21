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
    return res.data;
  }

  async getLive(): Promise<Competition[]> {
    const res = await api.get('/competitions/live');
    return res.data;
  }

  async getUpcoming(): Promise<Competition[]> {
    const res = await api.get('/competitions/upcoming');
    return res.data;
  }

  async getHistory(): Promise<CompetitionHistoryItem[]> {
    const res = await api.get('/competitions/history');
    return res.data;
  }

  async getById(id: string): Promise<Competition> {
    const res = await api.get(`/competitions/${id}`);
    return res.data;
  }

  async register(id: string): Promise<any> {
    const res = await api.post(`/competitions/${id}/register`);
    return res.data;
  }

  async start(id: string): Promise<CompetitionSession> {
    const res = await api.post(`/competitions/${id}/start`);
    return res.data;
  }

  async getSession(id: string): Promise<CompetitionSession> {
    const res = await api.get(`/competitions/${id}/session`);
    return res.data;
  }

  async updateSession(id: string, answers: Record<string, any>): Promise<CompetitionSession> {
    const res = await api.patch(`/competitions/${id}/session`, answers);
    return res.data;
  }

  async submit(id: string): Promise<CompetitionResult> {
    const res = await api.post(`/competitions/${id}/submit`);
    return res.data;
  }

  async getResult(id: string): Promise<CompetitionResult> {
    const res = await api.get(`/competitions/${id}/result`);
    return res.data;
  }

  async getLeaderboard(id: string): Promise<CompetitionLeaderboardResponse> {
    const res = await api.get(`/competitions/${id}/leaderboard`);
    return res.data;
  }
}

export const competitionService = new CompetitionService();
