import { apiClient } from './api-client';
import { API_ENDPOINTS, STORAGE_KEYS } from './config';
import type {
    LoginCredentials,
    AuthResponse,
    User,
    ApiResponse,
} from '@/types/api';

export const authService = {
    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.LOGIN,
            credentials
        );

        if (response.success && response.data) {
            // Store tokens and user data
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        return response;
    },

    async logout(): Promise<ApiResponse<void>> {
        const response = await apiClient.post<void>(API_ENDPOINTS.LOGOUT);

        // Clear local storage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        return response;
    },

    async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.REFRESH, {
            refresh_token: refreshToken,
        });

        if (response.success && response.data) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        }

        return response;
    },

    async getProfile(): Promise<ApiResponse<User>> {
        return apiClient.get<User>(API_ENDPOINTS.PROFILE);
    },

    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    },
};
