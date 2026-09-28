import { PlacementSimulation, PlacementSimulationSession, PlacementSimulationSummary, PlacementRoundCompleteRequest, PlacementStartRoundResponse } from '../types/placement';
export declare const placementService: {
    getSimulations: () => Promise<PlacementSimulation[]>;
    getSimulation: (simulationId: string) => Promise<PlacementSimulation>;
    startSession: (simulationId: string) => Promise<PlacementSimulationSession>;
    getActiveSession: () => Promise<PlacementSimulationSession | null>;
    getSession: (sessionId: string) => Promise<PlacementSimulationSession>;
    startRound: (sessionId: string, roundId: string) => Promise<PlacementStartRoundResponse>;
    completeRound: (sessionId: string, roundId: string, data: PlacementRoundCompleteRequest) => Promise<PlacementSimulationSession>;
    abandonSession: (sessionId: string) => Promise<PlacementSimulationSession>;
    getSummary: (sessionId: string) => Promise<PlacementSimulationSummary>;
    getHistory: () => Promise<PlacementSimulationSession[]>;
};
//# sourceMappingURL=placementService.d.ts.map