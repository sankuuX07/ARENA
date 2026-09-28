import React from 'react';
import { ResumeImprovementSuggestion } from '../../../types/resumeImprovement';
interface ResumeImprovementSuggestionCardProps {
    suggestion: ResumeImprovementSuggestion;
    onAccept: (id: string) => Promise<void>;
    onReject: (id: string) => Promise<void>;
    onEdit: (id: string, text: string) => Promise<void>;
}
export declare const ResumeImprovementSuggestionCard: React.FC<ResumeImprovementSuggestionCardProps>;
export {};
//# sourceMappingURL=ResumeImprovementSuggestionCard.d.ts.map