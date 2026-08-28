export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export type UserRole = 'tourist' | 'guide' | 'provider' | 'moderator' | 'admin';

export interface UserPublic {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  preferred_language?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_at: string;
  user: UserPublic;
}
