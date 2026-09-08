export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Dresses' | 'Tops' | 'Skirts' | 'Outerwear';
  images: string[];
  availableSizes: ClothingSize[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: ClothingSize;
  customMeasurements?: {
    bust?: number;
    waist?: number;
    hips?: number;
  };
  quantity: number;
}