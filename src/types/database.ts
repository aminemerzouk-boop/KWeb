export type SizeOption = 'S' | 'M' | 'L' | 'Custom';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorName: string;
  colorHex: string;
  images: string[];
  stock: number;
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  basePrice: number;
  variants: ProductVariant[];
  averageRating?: number;
}

export interface CustomMeasurements {
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
  heightCm?: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  size: SizeOption;
  customMeasurements?: CustomMeasurements;
  quantity: number;
  price: number;
}