import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchGuideEntries,
  createGuideEntry,
  updateGuideEntry,
  deleteGuideEntry,
  fetchSupportedLanguages,
  setLanguageActive,
} from '../api/international.api';
import type { UpdateGuideEntryPayload } from '../types';

export function useGuideEntries() {
  return useQuery({
    queryKey: ['admin-guide-entries'],
    queryFn: fetchGuideEntries,
  });
}

export function useCreateGuideEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGuideEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-guide-entries'] }),
  });
}

export function useUpdateGuideEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGuideEntryPayload }) => updateGuideEntry(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-guide-entries'] }),
  });
}

export function useDeleteGuideEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGuideEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-guide-entries'] }),
  });
}

export function useSupportedLanguages() {
  return useQuery({
    queryKey: ['admin-supported-languages'],
    queryFn: fetchSupportedLanguages,
  });
}

export function useSetLanguageActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, isActive }: { code: string; isActive: boolean }) => setLanguageActive(code, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-supported-languages'] }),
  });
}
