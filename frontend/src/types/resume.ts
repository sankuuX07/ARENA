export type ResumeStatus = 'active' | 'archived' | 'deleted';

export interface ResumeMetadata {
  resumeId: string;
  userId: string;
  originalFileName: string;
  storagePath: string;
  fileType: string;
  fileExtension: string;
  fileSize: number;
  uploadedAt: string;
  updatedAt: string;
  isActive: boolean;
  status: ResumeStatus;
  analysisStatus: string;
}

export interface ResumeListItem {
  resumeId: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
  status: string;
}

export interface ResumeDetail {
  resumeId: string;
  userId: string;
  originalFileName: string;
  fileType: string;
  fileExtension: string;
  fileSize: number;
  uploadedAt: string;
  updatedAt: string;
  isActive: boolean;
  status: string;
  analysisStatus: string;
}

export interface ResumeUploadResponse {
  message: string;
  resume: ResumeMetadata;
}

export interface ResumeDeleteResponse {
  message: string;
}
