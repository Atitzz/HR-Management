import apiClient from './client';
import type {
  LoginRequest,
  RegisterRequest,
  RegisterOrganizationRequest,
  AuthResponse,
} from '@/types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<{ data: AuthResponse }>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<{ data: AuthResponse }>('/auth/register', data),

  registerOrganization: (data: RegisterOrganizationRequest) =>
    apiClient.post<{ data: AuthResponse }>('/auth/register/organization', data),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),

  logout: () => apiClient.post('/auth/logout'),
};
