import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '../config/env';
import { useAuthStore } from '../../store/auth.store';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  },
);

export interface ApiErrorPayload {
  detail?: string | { msg: string }[];
}

export function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    if (typeof payload?.detail === 'string') return payload.detail;
    if (Array.isArray(payload?.detail) && payload.detail.length > 0) {
      return payload.detail[0]?.msg ?? fallback;
    }
  }
  return fallback;
}
