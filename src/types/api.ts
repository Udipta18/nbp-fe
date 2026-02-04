export interface Provider {
    id: string;
    name: string;
    phone: string;
    category: string;
    description?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
    experience_years?: number;
    price?: number;
    image_url?: string;
    gallery_images?: string[];
    social_links?: {
        facebook?: string;
        instagram?: string;
    };
    business_hours?: {
        mon?: string;
        tue?: string;
        wed?: string;
        thu?: string;
        fri?: string;
        sat?: string;
        sun?: string;
    };
    rating: number;
    review_count: number;
    is_verified?: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    created_at: string;
    updated_at: string;
}

export interface CreateProviderData {
    name: string;
    phone: string;
    category: string;
    description?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
    experience_years?: number;
    image?: File;
}

export interface Review {
    id: string;
    booking_id: string;
    provider_id: string;
    rating: number;
    comment?: string;
    created_at: string;
}

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        message: string;
        statusCode: number;
    };
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AdminStats {
    providers: {
        pending: number;
        approved: number;
        rejected: number;
    };
    totalBookings: number;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    is_active: boolean;
    created_at: string;
}
