import { ApiService } from './api';

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

class AdminService {
    async getDashboardStats(): Promise<AdminDashboardStats> {
        return ApiService.get<AdminDashboardStats>('/admin/dashboard');
    }

    async getStudents(): Promise<AdminStudent[]> {
        return ApiService.get<AdminStudent[]>('/admin/students');
    }

    async updateStudentStatus(uid: string, status: string): Promise<any> {
        return ApiService.post(`/admin/students/${uid}/status`, { status }); // Using post/patch wrapper if needed. ApiService only has get and post from what I saw earlier.
    }

    async getCompetitions(): Promise<any[]> {
        return ApiService.get<any[]>('/admin/competitions');
    }

    async createCompetition(data: any): Promise<any> {
        return ApiService.post('/admin/competitions', data);
    }
}

export const adminService = new AdminService();
