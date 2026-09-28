import { ApiService } from './api';
class AdminService {
    async getDashboardStats() {
        return ApiService.get('/admin/dashboard');
    }
    async getStudents() {
        return ApiService.get('/admin/students');
    }
    async updateStudentStatus(uid, status) {
        return ApiService.post(`/admin/students/${uid}/status`, { status }); // Using post/patch wrapper if needed. ApiService only has get and post from what I saw earlier.
    }
    async getCompetitions() {
        return ApiService.get('/admin/competitions');
    }
    async createCompetition(data) {
        return ApiService.post('/admin/competitions', data);
    }
}
export const adminService = new AdminService();
//# sourceMappingURL=adminService.js.map