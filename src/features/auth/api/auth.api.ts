import { apiClient } from '../../../shared/api/client';
import type { TokenResponse } from '../../../shared/api/types';
import type { LoginPayload } from '../types';

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/auth/login', payload);
  return data;
}
