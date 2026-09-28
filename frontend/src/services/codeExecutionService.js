import { ApiService } from './api';
export const executeCode = async (request) => {
    return await ApiService.post('/code/execute', request);
};
//# sourceMappingURL=codeExecutionService.js.map