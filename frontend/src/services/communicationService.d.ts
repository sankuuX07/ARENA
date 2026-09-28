export interface CommunicationMessage {
    id: string;
    role: 'student' | 'ai' | 'system';
    content: string;
    timestamp: string;
}
export interface CommunicationSession {
    sessionId: string;
    uid: string;
    mode: 'general' | 'fluency' | 'formal' | 'situational' | 'group_discussion';
    status: 'active' | 'completed' | 'abandoned';
    startedAt: string;
    endedAt?: string;
    messageCount: number;
}
export interface ChatApiResponse {
    session_id: string;
    message: string;
    timestamp: string;
    status: string;
    mode: string;
    evaluation?: any;
}
/**
 * Start a new AI Communication practice session
 */
export declare const startCommunicationSession: (uid: string, mode?: 'general' | 'fluency' | 'formal' | 'situational' | 'group_discussion') => Promise<{
    session: CommunicationSession;
    initialMessage: CommunicationMessage;
}>;
/**
 * Send student message to FastAPI Gemini backend & store resulting conversation thread
 */
export declare const sendChatMessage: (uid: string, sessionId: string, messageContent: string, mode?: 'general' | 'fluency' | 'formal' | 'situational' | 'group_discussion', existingHistory?: CommunicationMessage[]) => Promise<{
    studentMessage: CommunicationMessage;
    aiMessage: CommunicationMessage;
}>;
/**
 * End an active communication session & record progress integration point
 */
export declare const endCommunicationSession: (uid: string, sessionId: string, totalMessages?: number) => Promise<void>;
//# sourceMappingURL=communicationService.d.ts.map