import { API_BASE_URL, STORAGE_KEYS } from './config';
import type { ApiResponse } from '@/types/api';

class ApiClient {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const token = this.getAuthToken();

        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string>),
        };

        // Add auth token if available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData (browser will set it with boundary)
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const url = `${this.baseURL}${endpoint}`;
            console.log(`[API] ${options.method || 'GET'} ${url}`, {
                hasToken: !!token,
                headers: Object.keys(headers),
            });

            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            console.log(`[API] Response ${response.status}:`, data);

            if (!response.ok) {
                throw {
                    success: false,
                    error: {
                        message: data.error?.message || data.message || 'An error occurred',
                        statusCode: response.status,
                    },
                };
            }

            return data;
        } catch (error: any) {
            console.error('[API] Error:', error);

            if (error.success === false) {
                return error;
            }

            return {
                success: false,
                error: {
                    message: error.message || 'Network error',
                    statusCode: 500,
                },
            };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return this.request<T>(endpoint, {
            method: 'POST',
            body,
        });
    }

    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        const options: RequestInit = {
            method: 'PATCH',
        };

        // Only add body if data is provided
        if (data !== undefined) {
            options.body = JSON.stringify(data);
        }

        return this.request<T>(endpoint, options);
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();
