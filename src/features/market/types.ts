export type ProductCategory =
  | 'tissus_vetements'
  | 'bijoux'
  | 'poterie'
  | 'sculpture'
  | 'objet_art'
  | 'produit_agricole'
  | 'produit_alimentaire'
  | 'souvenir';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'tissus_vetements',
  'bijoux',
  'poterie',
  'sculpture',
  'objet_art',
  'produit_agricole',
  'produit_alimentaire',
  'souvenir',
];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  tissus_vetements: 'Tissus / vêtements',
  bijoux: 'Bijoux',
  poterie: 'Poterie',
  sculpture: 'Sculpture',
  objet_art: "Objet d'art",
  produit_agricole: 'Produit agricole',
  produit_alimentaire: 'Produit alimentaire',
  souvenir: 'Souvenir',
};

export type FulfillmentMode = 'livraison' | 'retrait' | 'les_deux';

export const FULFILLMENT_MODES: FulfillmentMode[] = ['livraison', 'retrait', 'les_deux'];

export const FULFILLMENT_MODE_LABELS: Record<FulfillmentMode, string> = {
  livraison: 'Livraison',
  retrait: 'Retrait',
  les_deux: 'Les deux',
};

export interface ProductSummary {
  id: string;
  artisan_id: string;
  name: string;
  category: ProductCategory;
  price: number;
  currency: string;
  photo?: string;
  average_rating: number;
  review_count: number;
  in_stock: boolean;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  currency?: string;
  photos?: string[];
  stock_quantity?: number;
  fulfillment_mode?: FulfillmentMode;
  artisan_id?: string;
}

// Note: artisan_id is intentionally NOT part of the update payload — the backend's
// UpdateProductRequest has no artisan_id field, so it cannot be reassigned via PATCH.
export type UpdateProductPayload = Partial<Omit<CreateProductPayload, 'artisan_id'>>;

export interface ProductDetail {
  id: string;
  artisan_id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  currency: string;
  photos: string[];
  stock_quantity: number;
  fulfillment_mode: FulfillmentMode;
}

export interface ArtisanSummary {
  id: string;
  user_id: string;
  display_name: string;
  photo_url?: string;
  region: string;
  city?: string;
  is_verified: boolean;
}

export interface ArtisanDetail {
  id: string;
  user_id: string;
  display_name: string;
  story?: string;
  photo_url?: string;
  region: string;
  city?: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
}

export interface CreateArtisanPayload {
  display_name: string;
  story?: string;
  photo_url?: string;
  region: string;
  city?: string;
}

export type UpdateArtisanPayload = Partial<CreateArtisanPayload>;
