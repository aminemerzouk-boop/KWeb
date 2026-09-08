'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { ProductManager } from '@/components/admin/ProductManager';
import { OrderManager } from '@/components/admin/OrderManager';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('orders');

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-500">Checking permissions...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md my-16 rounded-lg border bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2 text-xs text-gray-600">
          You must be logged into an authorized Administrator account to view this dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Atelier Admin Dashboard</h1>
          <p className="text-xs text-gray-500">Logged in as: {user.email}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition ${
              activeTab === 'orders' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Orders & Tracking
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition ${
              activeTab === 'products' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Garments & Colors
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition ${
              activeTab === 'categories' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {activeTab === 'orders' && <OrderManager />}
      {activeTab === 'products' && <ProductManager />}
      {activeTab === 'categories' && <CategoryManager />}
    </div>
  );
}