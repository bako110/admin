export type MoneyServiceType = 'banque' | 'distributeur' | 'mobile_money' | 'bureau_change';

export const MONEY_SERVICE_TYPES: MoneyServiceType[] = ['banque', 'distributeur', 'mobile_money', 'bureau_change'];

export const MONEY_SERVICE_TYPE_LABELS: Record<MoneyServiceType, string> = {
  banque: 'Banque',
  distributeur: 'Distributeur (DAB)',
  mobile_money: 'Mobile Money',
  bureau_change: 'Bureau de change',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface MoneyServiceSummary {
  id: string;
  name: string;
  type: MoneyServiceType;
  operator?: string;
  region: string;
  city?: string;
  location: GeoPoint;
}

export interface CreateMoneyServicePayload {
  name: string;
  type: MoneyServiceType;
  operator?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  contact_phone?: string;
}

export type UpdateMoneyServicePayload = Partial<CreateMoneyServicePayload>;

export interface MoneyServiceDetail {
  id: string;
  name: string;
  type: MoneyServiceType;
  operator?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  contact_phone?: string;
}
