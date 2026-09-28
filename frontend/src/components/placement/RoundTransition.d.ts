import React from 'react';
import { PlacementRoundSession } from '../../types/placement';
interface RoundTransitionProps {
    round: PlacementRoundSession;
    nextRoundName?: string;
    onContinue: () => void;
    onSummary: () => void;
}
export declare const RoundTransition: React.FC<RoundTransitionProps>;
export {};
//# sourceMappingURL=RoundTransition.d.ts.map