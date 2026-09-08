import { supabase } from './supabaseClient';
import { 
  Category, 
  Product, 
  Order, 
  CartItem, 
  CustomMeasurements 
} from '@/types/database';

// 1. DYNAMIC CATEGORIES
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// 2. FETCH PRODUCTS WITH COLOR VARIANTS
export async function getProducts(categoryId?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      variants:product_variants(*)
    `);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

// 3. FAVORITES TOGGLE
export async function toggleFavorite(userId: string, productId: string, isFavorited: boolean): Promise<void> {
  if (isFavorited) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: userId, product_id: productId });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, product_id: productId });
    if (error) throw new Error(error.message);
  }
}

// 4. PLACE PAY-ON-DELIVERY ORDER
export async function createPayOnDeliveryOrder(
  userId: string,
  shippingAddress: Record<string, unknown>,
  cartItems: CartItem[],
  totalAmount: number
): Promise<string> {
  // Insert main order record
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      status: 'pending',
      payment_status: 'unpaid'
    })
    .select('id')
    .single();

  if (orderError || !order) throw new Error(orderError?.message || 'Order creation failed');

  // Insert order line items (handles custom measurements if applicable)
  const lineItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    size: item.size,
    custom_measurements: item.customMeasurements || null,
    quantity: item.quantity,
    unit_price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(lineItems);

  if (itemsError) throw new Error(itemsError.message);

  return order.id;
}

// 5. VERIFY ELIGIBILITY AND SUBMIT REVIEW
export async function submitProductReview(
  userId: string,
  productId: string,
  orderId: string,
  rating: number,
  comment: string
): Promise<void> {
  // Check if order is delivered
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (orderErr || order?.status !== 'delivered') {
    throw new Error('You can only review products from delivered orders.');
  }

  const { error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      product_id: productId,
      order_id: orderId,
      rating,
      comment
    });

  if (error) throw new Error(error.message);
}

// 6. TRACK ORDER STATUS
export async function getCustomerOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        product:products(title),
        variant:product_variants(color_name, color_hex, images)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}