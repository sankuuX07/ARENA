export interface GetOptions {
    skipCache?: boolean;
    ttlMs?: number;
}
export declare class ApiService {
    private static baseUrl;
    private static formatUrl;
    private static getHeaders;
    static get<T = any>(endpoint: string, options?: GetOptions): Promise<T>;
    static post<T = any>(endpoint: string, body?: any): Promise<T>;
    static patch<T = any>(endpoint: string, body?: any): Promise<T>;
    static delete<T = any>(endpoint: string, body?: any): Promise<T>;
}
export default ApiService;
//# sourceMappingURL=api.d.ts.map