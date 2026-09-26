import { getApiBaseUrl } from '../utils/config';
import { memoizePromise } from '../utils/cache';

export interface GetOptions {
  skipCache?: boolean;
  ttlMs?: number;
}

export class ApiService {
  private static baseUrl = getApiBaseUrl();

  private static formatUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    let base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    
    // If base doesn't end with /api/v1 and doesn't end with /v1, and endpoint doesn't start with /v1
    // It's getting messy. Let's just append carefully.
    
    // If base URL already includes /api/v1, we just need to make sure the endpoint doesn't duplicate it.
    let finalEndpoint = cleanEndpoint;
    if (!base.endsWith('/v1') && !base.endsWith('/v1/') && !finalEndpoint.startsWith('/v1/')) {
        finalEndpoint = `/v1${finalEndpoint}`;
    } else if (base.endsWith('/v1') && finalEndpoint.startsWith('/v1/')) {
        finalEndpoint = finalEndpoint.substring(3); // remove /v1
    }

    return `${base}${finalEndpoint}`;
  }

  private static async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    try {
      // If we're using local auth, just pass a dummy token or uid so the backend passes dev checks
      const isLocalAuth = import.meta.env.VITE_AUTH_MODE === 'local';
      if (isLocalAuth) {
        const uid = localStorage.getItem('arena_local_session');
        if (uid) {
          headers['Authorization'] = `Bearer local-dev-token-${uid}`;
        }
        return headers;
      }

      // Import auth dynamically to avoid circular dependencies if any
      const { auth } = await import('./firebase');
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('[ApiService] Failed to get auth token', e);
    }

    return headers;
  }

  public static async get<T = any>(endpoint: string, options?: GetOptions): Promise<T> {
    const url = this.formatUrl(endpoint);

    const fetcher = async () => {
      try {
        const headers = await this.getHeaders();
        const response = await fetch(url, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) errorMsg = errorData.detail;
          } catch(e) {}
          throw new Error(errorMsg);
        }

        return (await response.json()) as T;
      } catch (error) {
        console.error(`API GET call failed for ${url}:`, error);
        throw error;
      }
    };

    if (options?.skipCache) {
      return fetcher();
    }

    return memoizePromise(`api_get_${endpoint}`, fetcher, options?.ttlMs ?? 30000);
  }

  public static async post<T = any>(endpoint: string, body?: any): Promise<T> {
    const url = this.formatUrl(endpoint);
    try {
      const headers = await this.getHeaders();
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`API POST call failed for ${url}:`, error);
      throw error;
    }
  }

  public static async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    const url = this.formatUrl(endpoint);
    try {
      const headers = await this.getHeaders();
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body || {}),
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`API PATCH call failed for ${url}:`, error);
      throw error;
    }
  }

  public static async delete<T = any>(endpoint: string, body?: any): Promise<T> {
    const url = this.formatUrl(endpoint);
    try {
      const headers = await this.getHeaders();
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`API DELETE call failed for ${url}:`, error);
      throw error;
    }
  }
}

export default ApiService;
