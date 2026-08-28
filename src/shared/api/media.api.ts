import { apiClient } from './client';

export interface MediaUploadResult {
  url: string;
  resource_type: string;
  width?: number;
  height?: number;
  duration?: number;
}

export async function uploadMedia(file: File): Promise<MediaUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<MediaUploadResult>('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
