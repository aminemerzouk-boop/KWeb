'use client';

import React, { useEffect, useState } from 'react';
import { getCategories, getProducts, toggleFavorite } from '@/lib/api';
import { Category, Product } from '@/types/database';
import { ProductDetails } from '@/components/ProductDetails';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    getProducts(selectedCategoryId).then((data) => {
      setProducts(data);
      if (data.length > 0 && !selectedProduct) {
        setSelectedProduct(data[0]);
      }
    });
  }, [selectedCategoryId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
        <button
          onClick={() => setSelectedCategoryId(undefined)}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            selectedCategoryId === undefined
              ? 'bg-black text-white'
              : 'bg-white border text-gray-700 hover:border-gray-400'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategoryId === cat.id
                ? 'bg-black text-white'
                : 'bg-white border text-gray-700 hover:border-gray-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Interactive Display */}
      {selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onAddToCart={(item) => {
            addToCart(item);
            alert('Garment added to your cart!');
          }}
          onToggleFavorite={async (productId, isFav) => {
            // Replaces userId parameter with current session context if using auth
            await toggleFavorite('ANONYMOUS_USER_ID', productId, isFav);
          }}
        />
      ) : (
        <div className="text-center py-16 text-gray-500">No garments found in this category.</div>
      )}

      {/* Catalog Selector Grid */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Browse Collection</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`cursor-pointer border rounded-lg p-3 bg-white transition hover:shadow-md ${
                selectedProduct?.id === p.id ? 'ring-2 ring-black' : ''
              }`}
            >
              <div className="aspect-[3/4] relative bg-gray-100 rounded overflow-hidden mb-2">
                {p.variants?.[0]?.images?.[0] && (
                  <img
                    src={p.variants[0].images[0]}
                    alt={p.title}
                    className="object-cover h-full w-full"
                  />
                )}
              </div>
              <h3 className="font-semibold text-xs truncate">{p.title}</h3>
              <p className="text-xs text-gray-600 mt-0.5">${p.basePrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}