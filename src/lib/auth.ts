import { apiClient } from './api-client';
import { API_ENDPOINTS, STORAGE_KEYS } from './config';
import type {
    LoginCredentials,
    AuthResponse,
    User,
    ApiResponse,
} from '@/types/api';

// Storage key for token expiry
const TOKEN_EXPIRES_AT = 'token_expires_at';

// Helper to decode JWT payload without library
function decodeJWT(token: string): { exp?: number } | null {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch {
        return null;
    }
}

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

            // Store expiry time if provided
            if (response.data.expiresAt) {
                localStorage.setItem(TOKEN_EXPIRES_AT, String(response.data.expiresAt));
            }
        }

        return response;
    },

    async logout(): Promise<ApiResponse<void>> {
        const response = await apiClient.post<void>(API_ENDPOINTS.LOGOUT);
        this.clearAuth();
        return response;
    },

    // Clear all auth data from storage
    clearAuth(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(TOKEN_EXPIRES_AT);
    },

    async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.REFRESH, {
            refresh_token: refreshToken,
        });

        if (response.success && response.data) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);

            if (response.data.expiresAt) {
                localStorage.setItem(TOKEN_EXPIRES_AT, String(response.data.expiresAt));
            }
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

    getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    // Check if the token is expired
    isTokenExpired(): boolean {
        const token = this.getAccessToken();
        if (!token) return true;

        // First check stored expiresAt (faster)
        const storedExpiry = localStorage.getItem(TOKEN_EXPIRES_AT);
        if (storedExpiry) {
            let expiryTime = parseInt(storedExpiry, 10);
            // If expiresAt is in seconds (like JWT exp), convert to milliseconds
            // Values less than 10 billion are likely seconds
            if (expiryTime < 10000000000) {
                expiryTime = expiryTime * 1000;
            }
            const currentTime = Date.now();
            // Add 30 second buffer
            if (currentTime >= expiryTime - 30000) {
                return true;
            }
            return false;
        }

        // Fallback: decode JWT and check exp claim
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) return true;

        // exp is in seconds, Date.now() is in milliseconds
        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();

        return currentTime >= expiryTime - 30000; // 30 second buffer
    },

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        const hasToken = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!hasToken) return false;

        // Also check if token is expired
        return !this.isTokenExpired();
    },

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    },

    // Validate auth and redirect if needed
    async validateAuthOrRedirect(router: any): Promise<boolean> {
        if (!this.isAuthenticated()) {
            this.clearAuth();
            router.push('/login');
            return false;
        }

        const user = this.getCurrentUser();
        if (!user || user.role !== 'admin') {
            this.clearAuth();
            router.push('/login');
            return false;
        }

        return true;
    },
};
