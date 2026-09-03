import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchQuoteRequests,
  fetchQuoteRequest,
  updateQuoteRequest,
  fetchInvoicesForQuote,
  createInvoice,
  updateInvoiceStatus,
} from '../api/business.api';
import type { QuoteRequestStatus, UpdateQuoteRequestPayload } from '../types';

export function useQuoteRequests(statusFilter?: QuoteRequestStatus) {
  return useQuery({
    queryKey: ['admin-quote-requests', statusFilter],
    queryFn: () => fetchQuoteRequests(statusFilter),
  });
}

export function useQuoteRequest(id: string | null) {
  return useQuery({
    queryKey: ['admin-quote-request', id],
    queryFn: () => fetchQuoteRequest(id as string),
    enabled: !!id,
  });
}

export function useUpdateQuoteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQuoteRequestPayload }) => updateQuoteRequest(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-quote-requests'] }),
  });
}

export function useInvoicesForQuote(quoteId: string | null) {
  return useQuery({
    queryKey: ['admin-quote-invoices', quoteId],
    queryFn: () => fetchInvoicesForQuote(quoteId as string),
    enabled: !!quoteId,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({ queryKey: ['admin-quote-invoices', variables.quote_request_id] }),
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string; quoteId: string }) => updateInvoiceStatus(id, status),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['admin-quote-invoices', variables.quoteId] }),
  });
}
