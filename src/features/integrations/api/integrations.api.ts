import { apiClient } from '../../../shared/api/client';
import type {
  Connector,
  ConnectorType,
  CreateWebhookPayload,
  ImportDataPayload,
  UpdateConnectorPayload,
  Webhook,
} from '../types';

export async function fetchConnectors(): Promise<Connector[]> {
  const { data } = await apiClient.get<Connector[]>('/integrations/connectors');
  return data;
}

export async function upsertConnector(
  connectorType: ConnectorType,
  payload: UpdateConnectorPayload,
): Promise<Connector> {
  const { data } = await apiClient.put<Connector>(`/integrations/connectors/${connectorType}`, payload);
  return data;
}

export async function fetchMyWebhooks(): Promise<Webhook[]> {
  const { data } = await apiClient.get<Webhook[]>('/integrations/webhooks');
  return data;
}

export async function createWebhook(payload: CreateWebhookPayload): Promise<Webhook> {
  const { data } = await apiClient.post<Webhook>('/integrations/webhooks', payload);
  return data;
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  await apiClient.delete(`/integrations/webhooks/${webhookId}`);
}

export async function importData(payload: ImportDataPayload): Promise<unknown> {
  const { data } = await apiClient.post('/integrations/import', payload);
  return data;
}
