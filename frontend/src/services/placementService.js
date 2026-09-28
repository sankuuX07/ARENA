import api from './api';
import { PlacementSimulation, PlacementSimulationSession, PlacementSimulationSummary, PlacementRoundCompleteRequest, PlacementStartRoundResponse } from '../types/placement';
const PLACEMENT_URL = '/placement';
export const placementService = {
    getSimulations: async () => {
        const response = await api.get(`${PLACEMENT_URL}/simulations`);
        return response;
    },
    getSimulation: async (simulationId) => {
        const response = await api.get(`${PLACEMENT_URL}/simulations/${simulationId}`);
        return response;
    },
    startSession: async (simulationId) => {
        const response = await api.post(`${PLACEMENT_URL}/sessions`, { simulationId });
        return response;
    },
    getActiveSession: async () => {
        try {
            const response = await api.get(`${PLACEMENT_URL}/sessions/active`);
            return response;
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                return null; // No active session
            }
            throw error;
        }
    },
    getSession: async (sessionId) => {
        const response = await api.get(`${PLACEMENT_URL}/sessions/${sessionId}`);
        return response;
    },
    startRound: async (sessionId, roundId) => {
        const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/rounds/${roundId}/start`);
        return response;
    },
    completeRound: async (sessionId, roundId, data) => {
        const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/rounds/${roundId}/complete`, data);
        return response;
    },
    abandonSession: async (sessionId) => {
        const response = await api.post(`${PLACEMENT_URL}/sessions/${sessionId}/abandon`);
        return response;
    },
    getSummary: async (sessionId) => {
        const response = await api.get(`${PLACEMENT_URL}/sessions/${sessionId}/summary`);
        return response;
    },
    getHistory: async () => {
        const response = await api.get(`${PLACEMENT_URL}/history`);
        return response;
    }
};
//# sourceMappingURL=placementService.js.map