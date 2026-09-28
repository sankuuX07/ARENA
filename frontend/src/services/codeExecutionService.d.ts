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
export declare const executeCode: (request: CodeExecutionRequest) => Promise<CodeExecutionResponse>;
//# sourceMappingURL=codeExecutionService.d.ts.map