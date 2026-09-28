export interface AIResponseData {
    speaker: string;
    content: string;
}
export interface GroupDiscussionEvaluation {
    communication: number;
    clarity: number;
    grammar: number;
    vocabulary: number;
    relevance: number;
    confidence: number;
    participation: number;
    leadership: number;
    teamwork: number;
    respectfulness: number;
    argumentQuality: number;
    responsiveness: number;
    adaptability: number;
    timeManagement: number;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    improved_responses?: {
        original: string;
        improved: string;
        reason: string;
    }[];
}
export interface GroupDiscussionStartResponse {
    session_id: string;
    topic: string;
    category: string;
    difficulty: string;
    moderator_intro: string;
}
export interface GroupDiscussionRespondResponse {
    session_id: string;
    round: number;
    ai_responses: AIResponseData[];
    is_complete: boolean;
}
export interface GroupDiscussionSummary {
    session_id: string;
    category: string;
    difficulty: string;
    topic: string;
    evaluation: GroupDiscussionEvaluation;
    completed_at: string;
}
export interface GroupDiscussionHistoryItem {
    sessionId: string;
    dateStr: string;
    difficulty: string;
    category: string;
    topic: string;
    score: number;
    status: 'active' | 'completed';
}
export declare const startGroupDiscussion: (uid: string, category: string, difficulty: string) => Promise<GroupDiscussionStartResponse>;
export declare const respondGroupDiscussion: (uid: string, sessionId: string, studentMessage: string, currentRound: number, topic: string, messages: any[]) => Promise<GroupDiscussionRespondResponse>;
export declare const completeGroupDiscussion: (uid: string, sessionId: string, topic: string, category: string, difficulty: string, messages: any[]) => Promise<GroupDiscussionSummary>;
export declare const getGroupDiscussionHistory: (uid: string) => Promise<GroupDiscussionHistoryItem[]>;
//# sourceMappingURL=groupDiscussionService.d.ts.map