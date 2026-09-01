export type ConnectorType =
  | 'cartographie'
  | 'meteo'
  | 'paiement'
  | 'notifications'
  | 'sms_whatsapp'
  | 'billetterie'
  | 'hotels_reservation'
  | 'donnees_publiques';

export const CONNECTOR_TYPES: ConnectorType[] = [
  'cartographie',
  'meteo',
  'paiement',
  'notifications',
  'sms_whatsapp',
  'billetterie',
  'hotels_reservation',
  'donnees_publiques',
];

export const CONNECTOR_TYPE_LABELS: Record<ConnectorType, string> = {
  cartographie: 'Cartographie',
  meteo: 'Météo',
  paiement: 'Paiement',
  notifications: 'Notifications',
  sms_whatsapp: 'SMS / WhatsApp',
  billetterie: 'Billetterie',
  hotels_reservation: 'Réservation hôtelière',
  donnees_publiques: 'Données publiques',
};

export type ConnectorStatus = 'not_configured' | 'configured' | 'disabled';

export const CONNECTOR_STATUS_LABELS: Record<ConnectorStatus, string> = {
  not_configured: 'Non configuré',
  configured: 'Configuré',
  disabled: 'Désactivé',
};

export interface Connector {
  id: string;
  type: ConnectorType;
  provider_name: string;
  status: ConnectorStatus;
  config_notes?: string;
  updated_at: string;
}

export interface UpdateConnectorPayload {
  provider_name: string;
  status: ConnectorStatus;
  config_notes?: string;
}

export type WebhookEventType =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'payment_confirmed';

export const WEBHOOK_EVENT_TYPES: WebhookEventType[] = [
  'booking_created',
  'booking_confirmed',
  'booking_cancelled',
  'payment_confirmed',
];

export const WEBHOOK_EVENT_TYPE_LABELS: Record<WebhookEventType, string> = {
  booking_created: 'Réservation créée',
  booking_confirmed: 'Réservation confirmée',
  booking_cancelled: 'Réservation annulée',
  payment_confirmed: 'Paiement confirmé',
};

export interface Webhook {
  id: string;
  owner_id: string;
  event_type: WebhookEventType;
  target_url: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateWebhookPayload {
  event_type: WebhookEventType;
  target_url: string;
}

export interface ImportDataPayload {
  item_type: string;
  items: Record<string, unknown>[];
}
