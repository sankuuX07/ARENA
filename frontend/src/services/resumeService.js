import api from './api';
import { ResumeListItem, ResumeDetail, ResumeUploadResponse, ResumeDeleteResponse } from '../types/resume';
class ResumeService {
    async uploadResume(file, onProgress) {
        const formData = new FormData();
        formData.append('file', file);
        // fetch doesn't support upload progress out of the box like axios
        // we'll just fake it or omit it for now
        if (onProgress) {
            onProgress(50);
        }
        const response = await api.post('/resumes/upload', formData);
        if (onProgress) {
            onProgress(100);
        }
        return response;
    }
    async getResumes() {
        const response = await api.get('/resumes/');
        return response;
    }
    async getActiveResume() {
        try {
            const response = await api.get('/resumes/active');
            return response;
        }
        catch (error) {
            // Simplistic check for 404
            return null;
        }
    }
    async getResumeDetails(resumeId) {
        const response = await api.get(`/resumes/${resumeId}`);
        return response;
    }
    async setActiveResume(resumeId) {
        const response = await api.post(`/resumes/${resumeId}/set-active`, {});
        return response;
    }
    async deleteResume(resumeId) {
        const response = await api.post(`/resumes/${resumeId}/delete`, {});
        return response;
    }
    getDownloadUrl(resumeId) {
        return `/api/v1/resumes/${resumeId}/download`;
    }
}
export const resumeService = new ResumeService();
//# sourceMappingURL=resumeService.js.map