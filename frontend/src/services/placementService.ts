import api from './api';
import {
  PlacementSimulation,
  PlacementSimulationSession,
  PlacementSimulationSummary,
  PlacementRoundCompleteRequest,
  PlacementStartRoundResponse
} from '../types/placement';

const PLACEMENT_URL = '/placement';

export const placementService = {
  getSimulations: async (): Promise<PlacementSimulation[]> => {
    const response = await api.get(`${PLACEMENT_URL}/simulations`);
    return response.data;
  },

  getSimulation: async (simulationId: string): Promise<PlacementSimulation> => {
    const response = await api.get(`${PLACEMENT_URL}/simulations/${simulationId}`);
    return response.data;
  },

  startSession: async (simulationId: string): Promise<PlacementSimulationSession> => {
    const response = await api.post(`${PLACEMENT_URL}/sessions`, { simulationId });
    return response.data;
  },

  getActiveSession: async (): Promise<PlacementSimulationSession | null> => {
    try {
      const response = await api.get(`${PLACEMENT_URL}/sessions/active`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // No active session
      }
      throw error;
    }
  },

  getSession: async (sessionId: string): Promise<PlacementSimulationSession> => {
    const response = await api.get(`${PLACEMENT_URL}/sessions/${sessionId}`);
    return response.data;
  },

  startRound: async (sessionId: string, roundId: string): Promise<PlacementStartRoundResponse> => {
    const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/rounds/${roundId}/start`);
    return response.data;
  },

  completeRound: async (
    sessionId: string,
    roundId: string,
    data: PlacementRoundCompleteRequest
  ): Promise<PlacementSimulationSession> => {
    const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/rounds/${roundId}/complete`, data);
    return response.data;
  },

  abandonSession: async (sessionId: string): Promise<PlacementSimulationSession> => {
    const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/abandon`);
    return response.data;
  },

  getSummary: async (sessionId: string): Promise<PlacementSimulationSummary> => {
    const response = await api.get(`${PLACEMENT_URL}/sessions/${sessionId}/summary`);
    return response.data;
  },

  getHistory: async (): Promise<PlacementSimulationSession[]> => {
    const response = await api.get(`${PLACEMENT_URL}/history`);
    return response.data;
  }
};
