import apiClient from './client';
import type { Plan, PaginationParams, PaginatedResult } from '@/types';

export const plansApi = {
  getActivePlans: () =>
    apiClient.get<{ data: Plan[] }>('/plans/active'),

  getAll: (params?: PaginationParams) =>
    apiClient.get<{ data: PaginatedResult<Plan> }>('/plans', { params }),

  getById: (id: string) =>
    apiClient.get<{ data: Plan }>(`/plans/${id}`),

  create: (data: Partial<Plan>) =>
    apiClient.post<{ data: Plan }>('/plans', data),

  update: (id: string, data: Partial<Plan>) =>
    apiClient.patch<{ data: Plan }>(`/plans/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/plans/${id}`),
};
