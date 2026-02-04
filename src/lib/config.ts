// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',

    // Providers
    PROVIDERS: '/providers',
    PROVIDER_BY_ID: (id: string) => `/providers/${id}`,
    PROVIDER_REVIEWS: (id: string) => `/providers/${id}/reviews`,

    // Admin
    ADMIN_STATS: '/admin/stats',
    ADMIN_PROVIDERS: '/admin/providers',
    ADMIN_PENDING_PROVIDERS: '/admin/providers/pending',
    ADMIN_PROVIDER_BY_ID: (id: string) => `/admin/providers/${id}`,
    ADMIN_APPROVE_PROVIDER: (id: string) => `/admin/providers/${id}/approve`,
    ADMIN_REJECT_PROVIDER: (id: string) => `/admin/providers/${id}/reject`,
    ADMIN_DELETE_PROVIDER: (id: string) => `/admin/providers/${id}`,

    // Reviews
    REVIEWS: '/reviews',
    REVIEW_BY_ID: (id: string) => `/reviews/${id}`,

    // Categories
    CATEGORIES: '/categories',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
} as const;
