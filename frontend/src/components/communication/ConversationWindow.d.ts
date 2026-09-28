import React from 'react';
import { CommunicationMessage } from '../../services/communicationService';
export interface ConversationWindowProps {
    messages: CommunicationMessage[];
    isGenerating: boolean;
    studentName?: string;
    studentPhotoUrl?: string;
}
export declare const ConversationWindow: React.FC<ConversationWindowProps>;
//# sourceMappingURL=ConversationWindow.d.ts.map