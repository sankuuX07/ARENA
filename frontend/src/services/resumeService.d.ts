import { ResumeListItem, ResumeDetail, ResumeUploadResponse, ResumeDeleteResponse } from '../types/resume';
declare class ResumeService {
    uploadResume(file: File, onProgress?: (progress: number) => void): Promise<ResumeUploadResponse>;
    getResumes(): Promise<ResumeListItem[]>;
    getActiveResume(): Promise<ResumeDetail | null>;
    getResumeDetails(resumeId: string): Promise<ResumeDetail>;
    setActiveResume(resumeId: string): Promise<ResumeDetail>;
    deleteResume(resumeId: string): Promise<ResumeDeleteResponse>;
    getDownloadUrl(resumeId: string): string;
}
export declare const resumeService: ResumeService;
export {};
//# sourceMappingURL=resumeService.d.ts.map