'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createPayOnDeliveryOrder } from '@/lib/api';
import { OrderTracker } from '@/components/OrderTracker';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Your cart is empty');

    setLoading(true);
    try {
      const orderId = await createPayOnDeliveryOrder(
        'ANONYMOUS_USER_ID', // Replace with real auth user id
        { name: fullName, phone, address },
        cart,
        cartTotal
      );
      setActiveOrderId(orderId);
      clearCart();
    } catch (err: any) {
      alert(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {activeOrderId ? (
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-green-700">Order Placed Successfully!</h2>
          <p className="text-sm text-gray-600">
            Order Reference: <span className="font-mono font-bold text-black">{activeOrderId}</span>
          </p>
          <p className="text-xs text-gray-500">
            Payment Method: <strong className="text-black">Pay on Delivery</strong>
          </p>
          <div className="border-t pt-4">
            <h3 className="font-bold text-sm mb-2">Live Order Status:</h3>
            <OrderTracker status="pending" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cart Contents */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Shopping Cart ({cart.length})</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 divide-y">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-3 flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold">Item Size: {item.size}</p>
                      <p className="text-gray-500">${item.price.toFixed(2)}</p>
                      {item.size === 'Custom' && item.customMeasurements && (
                        <p className="text-purple-700 font-mono text-[10px] mt-1">
                          Bust: {item.customMeasurements.bustCm}cm | Waist: {item.customMeasurements.waistCm}cm | Hips: {item.customMeasurements.hipsCm}cm
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-red-500 hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="pt-4 flex justify-between font-bold text-sm">
                  <span>Total (Pay on Delivery):</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Details */}
          <form onSubmit={handleCheckout} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h2 className="text-xl font-bold">Delivery Details</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full border rounded p-2 text-xs focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full border rounded p-2 text-xs focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Shipping Address</label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full border rounded p-2 text-xs focus:border-black focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full bg-black text-white py-3 rounded text-xs font-bold hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Confirm Pay-on-Delivery Order'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}