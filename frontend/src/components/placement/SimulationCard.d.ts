import React from 'react';
import { PlacementSimulation } from '../../types/placement';
interface SimulationCardProps {
    simulation: PlacementSimulation;
    onStart: (simulationId: string) => void;
    isLoading?: boolean;
}
export declare const SimulationCard: React.FC<SimulationCardProps>;
export {};
//# sourceMappingURL=SimulationCard.d.ts.map