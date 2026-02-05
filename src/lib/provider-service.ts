import { apiClient } from './api-client';
import { API_ENDPOINTS } from './config';
import type {
    Provider,
    CreateProviderData,
    PaginatedResponse,
    ApiResponse,
    AdminStats,
} from '@/types/api';

export const providerService = {
    // Public endpoints
    async createProvider(data: CreateProviderData): Promise<ApiResponse<Provider>> {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('category', data.category);

        if (data.description) formData.append('description', data.description);
        if (data.email) formData.append('email', data.email);
        if (data.website) formData.append('website', data.website);
        if (data.address) formData.append('address', data.address);
        if (data.city) formData.append('city', data.city);
        if (data.state) formData.append('state', data.state);
        if (data.zip_code) formData.append('zip_code', data.zip_code);
        if (data.latitude) formData.append('latitude', data.latitude.toString());
        if (data.longitude) formData.append('longitude', data.longitude.toString());
        if (data.experience_years) formData.append('experience_years', data.experience_years.toString());
        if (data.image) formData.append('image', data.image);
        formData.append('ward_number', data.ward_number.toString());

        return apiClient.post<Provider>(API_ENDPOINTS.PROVIDERS, formData);
    },

    async getProviders(params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        ward?: number;
        sort?: string;
        order?: 'asc' | 'desc';
    }): Promise<PaginatedResponse<Provider>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.category) queryParams.append('category', params.category);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.ward) queryParams.append('ward', params.ward.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.order) queryParams.append('order', params.order);

        const endpoint = `${API_ENDPOINTS.PROVIDERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return apiClient.get<Provider[]>(endpoint) as Promise<PaginatedResponse<Provider>>;
    },

    async getProviderById(id: string): Promise<ApiResponse<Provider>> {
        return apiClient.get<Provider>(API_ENDPOINTS.PROVIDER_BY_ID(id));
    },

    // Admin endpoints
    async getAdminStats(): Promise<ApiResponse<AdminStats>> {
        return apiClient.get<AdminStats>(API_ENDPOINTS.ADMIN_STATS);
    },

    async getAdminProviders(params?: {
        page?: number;
        limit?: number;
        status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    }): Promise<PaginatedResponse<Provider>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);

        const endpoint = `${API_ENDPOINTS.ADMIN_PROVIDERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return apiClient.get<Provider[]>(endpoint) as Promise<PaginatedResponse<Provider>>;
    },

    async getPendingProviders(params?: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<Provider>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const endpoint = `${API_ENDPOINTS.ADMIN_PENDING_PROVIDERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return apiClient.get<Provider[]>(endpoint) as Promise<PaginatedResponse<Provider>>;
    },

    async getAdminProviderById(id: string): Promise<ApiResponse<Provider>> {
        return apiClient.get<Provider>(API_ENDPOINTS.ADMIN_PROVIDER_BY_ID(id));
    },

    async approveProvider(id: string): Promise<ApiResponse<Provider>> {
        return apiClient.patch<Provider>(API_ENDPOINTS.ADMIN_APPROVE_PROVIDER(id));
    },

    async rejectProvider(id: string): Promise<ApiResponse<Provider>> {
        return apiClient.patch<Provider>(API_ENDPOINTS.ADMIN_REJECT_PROVIDER(id));
    },

    async deleteProvider(id: string): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(API_ENDPOINTS.ADMIN_DELETE_PROVIDER(id));
    },
};
