import api from './api';
import { ResumeListItem, ResumeDetail, ResumeUploadResponse, ResumeDeleteResponse } from '../types/resume';

class ResumeService {
  async uploadResume(file: File, onProgress?: (progress: number) => void): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // fetch doesn't support upload progress out of the box like axios
    // we'll just fake it or omit it for now
    if (onProgress) {
      onProgress(50);
    }
    const response = await api.post<ResumeUploadResponse>('/resumes/upload', formData);
    if (onProgress) {
      onProgress(100);
    }
    return response;
  }

  async getResumes(): Promise<ResumeListItem[]> {
    const response = await api.get<ResumeListItem[]>('/resumes/');
    return response;
  }

  async getActiveResume(): Promise<ResumeDetail | null> {
    try {
      const response = await api.get<ResumeDetail>('/resumes/active');
      return response;
    } catch (error: any) {
      // Simplistic check for 404
      return null;
    }
  }

  async getResumeDetails(resumeId: string): Promise<ResumeDetail> {
    const response = await api.get<ResumeDetail>(`/resumes/${resumeId}`);
    return response;
  }

  async setActiveResume(resumeId: string): Promise<ResumeDetail> {
    const response = await api.post<ResumeDetail>(`/resumes/${resumeId}/set-active`, {});
    return response;
  }

  async deleteResume(resumeId: string): Promise<ResumeDeleteResponse> {
    const response = await api.post<ResumeDeleteResponse>(`/resumes/${resumeId}/delete`, {});
    return response;
  }

  getDownloadUrl(resumeId: string): string {
    return `/api/v1/resumes/${resumeId}/download`;
  }
}

export const resumeService = new ResumeService();
