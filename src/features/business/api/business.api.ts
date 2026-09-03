import { apiClient } from '../../../shared/api/client';
import type { CreateInvoicePayload, Invoice, QuoteRequest, QuoteRequestStatus, UpdateQuoteRequestPayload } from '../types';

export async function fetchQuoteRequests(statusFilter?: QuoteRequestStatus): Promise<QuoteRequest[]> {
  const { data } = await apiClient.get<QuoteRequest[]>('/business/quotes', {
    params: statusFilter ? { status_filter: statusFilter } : undefined,
  });
  return data;
}

export async function fetchQuoteRequest(id: string): Promise<QuoteRequest> {
  const { data } = await apiClient.get<QuoteRequest>(`/business/quotes/${id}`);
  return data;
}

export async function updateQuoteRequest(id: string, payload: UpdateQuoteRequestPayload) {
  const { data } = await apiClient.patch(`/business/quotes/${id}`, payload);
  return data;
}

export async function fetchInvoicesForQuote(quoteId: string): Promise<Invoice[]> {
  const { data } = await apiClient.get<Invoice[]>(`/business/quotes/${quoteId}/invoices`);
  return data;
}

export async function createInvoice(payload: CreateInvoicePayload) {
  const { data } = await apiClient.post('/business/invoices', payload);
  return data;
}

export async function updateInvoiceStatus(id: string, status: string) {
  const { data } = await apiClient.patch(`/business/invoices/${id}`, { status });
  return data;
}
