import { ApiService } from './api';

export interface CodeExecutionRequest {
  problemId: string;
  language: string;
  code: string;
  stdin?: string;
}

export interface CodeExecutionResponse {
  executionId: string;
  status: 'queued' | 'running' | 'completed' | 'compile_error' | 'runtime_error' | 'timeout' | 'memory_limit' | 'system_error';
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  exitCode: number;
}

export const executeCode = async (request: CodeExecutionRequest): Promise<CodeExecutionResponse> => {
  return await ApiService.post<CodeExecutionResponse>('/code/execute', request);
};
