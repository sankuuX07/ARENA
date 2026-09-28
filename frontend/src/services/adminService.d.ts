export interface AdminDashboardStats {
    totalStudents: number;
    activeStudents: number;
    totalCompetitions: number;
    liveCompetitions: number;
    completedAssessments: number;
    codingSubmissions: number;
    recentActivity: any[];
}
export interface AdminStudent {
    uid: string;
    displayName: string;
    email: string;
    status: string;
    lastActive?: string;
}
declare class AdminService {
    getDashboardStats(): Promise<AdminDashboardStats>;
    getStudents(): Promise<AdminStudent[]>;
    updateStudentStatus(uid: string, status: string): Promise<any>;
    getCompetitions(): Promise<any[]>;
    createCompetition(data: any): Promise<any>;
}
export declare const adminService: AdminService;
export {};
//# sourceMappingURL=adminService.d.ts.map