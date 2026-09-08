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

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  created_at: string;
  custom_measurements?: Record<string, number>;
}