import { supabase } from './supabaseClient';
import { Product } from '@/types/database';

// Fetch all favorited products for the logged-in user
export async function getUserFavorites(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      product:products(
        *,
        category:categories(name, slug),
        variants:product_variants(*)
      )
    `)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  
  // Extract and return products array
  return (data || []).map((fav: any) => fav.product).filter(Boolean);
}

// Check if a specific product is favorited by the user
export async function isProductFavorited(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}