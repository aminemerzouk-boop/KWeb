import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { OrderStatus } from '@/types/database';

interface OrderRecord {
  id: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: string;
  created_at: string;
  shipping_address: { name: string; address: string; phone: string };
  order_items: Array<{
    id: string;
    size: string;
    quantity: number;
    custom_measurements?: { bustCm?: number; waistCm?: number; hipsCm?: number };
    product: { title: string };
    variant: { color_name: string };
  }>;
}

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(title),
          variant:product_variants(color_name)
        )
      `)
      .order('created_at', { ascending: false });

    if (data) setOrders(data as OrderRecord[]);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    // If order is delivered, update payment_status to 'paid_on_delivery'
    const isDelivered = newStatus === 'delivered';

    const { error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_status: isDelivered ? 'paid_on_delivery' : 'unpaid',
      })
      .eq('id', orderId);

    if (!error) {
      fetchOrders();
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Customer Orders & Tailoring</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-md border p-4 hover:border-gray-400 transition">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-3">
              <div>
                <p className="text-xs text-gray-500">Order ID: {order.id}</p>
                <p className="text-sm font-bold text-gray-900">
                  Customer: {order.shipping_address?.name || 'N/A'} ({order.shipping_address?.phone})
                </p>
              </div>

              {/* Status Updater */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-700">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                  className="rounded-md border border-gray-300 p-1 text-xs font-semibold uppercase focus:border-black focus:outline-none"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Line Items & Tailor Specifications */}
            <div className="mt-3 space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex flex-col text-xs text-gray-800 bg-gray-50 p-2 rounded">
                  <div className="flex justify-between font-medium">
                    <span>
                      {item.quantity}x {item.product?.title} ({item.variant?.color_name})
                    </span>
                    <span className="font-bold">Size: {item.size}</span>
                  </div>

                  {/* Render Custom Tailor Dimensions if provided */}
                  {item.size === 'Custom' && item.custom_measurements && (
                    <div className="mt-1 font-mono text-[11px] text-purple-700">
                      ✂️ Tailor Measurements: Bust: {item.custom_measurements.bustCm || '-'}cm |
                      Waist: {item.custom_measurements.waistCm || '-'}cm | Hips:{' '}
                      {item.custom_measurements.hipsCm || '-'}cm
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-600">
              <span>Payment: <strong>{order.payment_status}</strong> (Pay on Delivery)</span>
              <span className="font-bold text-sm text-black">${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};