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
    return response;
  },

  getSimulation: async (simulationId: string): Promise<PlacementSimulation> => {
    const response = await api.get(`${PLACEMENT_URL}/simulations/${simulationId}`);
    return response;
  },

  startSession: async (simulationId: string): Promise<PlacementSimulationSession> => {
    const response = await api.post(`${PLACEMENT_URL}/sessions`, { simulationId });
    return response;
  },

  getActiveSession: async (): Promise<PlacementSimulationSession | null> => {
    try {
      const response = await api.get(`${PLACEMENT_URL}/sessions/active`);
      return response;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // No active session
      }
      throw error;
    }
  },

  getSession: async (sessionId: string): Promise<PlacementSimulationSession> => {
    const response = await api.get(`${PLACEMENT_URL}/sessions/${sessionId}`);
    return response;
  },

  startRound: async (sessionId: string, roundId: string): Promise<PlacementStartRoundResponse> => {
    const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/rounds/${roundId}/start`);
    return response;
  },

  completeRound: async (
    sessionId: string,
    roundId: string,
    data: PlacementRoundCompleteRequest
  ): Promise<PlacementSimulationSession> => {
    const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/rounds/${roundId}/complete`, data);
    return response;
  },

  abandonSession: async (sessionId: string): Promise<PlacementSimulationSession> => {
    const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/abandon`);
    return response;
  },

  getSummary: async (sessionId: string): Promise<PlacementSimulationSummary> => {
    const response = await api.get(`${PLACEMENT_URL}/sessions/${sessionId}/summary`);
    return response;
  },

  getHistory: async (): Promise<PlacementSimulationSession[]> => {
    const response = await api.get(`${PLACEMENT_URL}/history`);
    return response;
  }
};
