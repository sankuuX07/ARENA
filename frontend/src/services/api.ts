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
    // If the endpoint doesn't already start with /v1, inject it
    const finalEndpoint = cleanEndpoint.startsWith('/v1/') || cleanEndpoint === '/v1'
      ? cleanEndpoint
      : `/v1${cleanEndpoint}`;
    return `${this.baseUrl}${finalEndpoint}`;
  }

  public static async get<T = any>(endpoint: string, options?: GetOptions): Promise<T> {
    const url = this.formatUrl(endpoint);

    const fetcher = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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

    // Use memoizePromise to cache the GET request
    // Default TTL is 30s, or specify custom ttlMs
    return memoizePromise(`api_get_${endpoint}`, fetcher, options?.ttlMs ?? 30000);
  }

  public static async post<T = any>(endpoint: string, body?: any): Promise<T> {
    const url = this.formatUrl(endpoint);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body || {}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`API DELETE call failed for ${url}:`, error);
      throw error;
    }
  }
}

export default ApiService;
