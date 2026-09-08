import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Category } from '@/types/database';

interface VariantFormInput {
  colorName: string;
  colorHex: string;
  imagesUrl: string; // Comma separated URLs
  stock: number;
}

export const ProductManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Local state for temporary variants before saving
  const [variants, setVariants] = useState<VariantFormInput[]>([
    { colorName: 'Classic Black', colorHex: '#000000', imagesUrl: '', stock: 10 },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      if (data) {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      }
    });
  }, []);

  const handleAddVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      { colorName: '', colorHex: '#ffffff', imagesUrl: '', stock: 5 },
    ]);
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantFormInput,
    value: string | number
  ) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !basePrice || !categoryId) return alert('Fill required product fields');

    setLoading(true);

    // 1. Insert product
    const { data: product, error: productErr } = await supabase
      .from('products')
      .insert({
        title,
        description,
        base_price: parseFloat(basePrice),
        category_id: categoryId,
      })
      .select('id')
      .single();

    if (productErr || !product) {
      alert(productErr?.message || 'Error creating product');
      setLoading(false);
      return;
    }

    // 2. Insert color variants
    const variantPayload = variants.map((v) => ({
      product_id: product.id,
      color_name: v.colorName,
      color_hex: v.colorHex,
      images: v.imagesUrl.split(',').map((url) => url.trim()).filter(Boolean),
      stock: v.stock,
    }));

    const { error: variantErr } = await supabase.from('product_variants').insert(variantPayload);

    if (variantErr) {
      alert(variantErr.message);
    } else {
      alert('Clothing item added successfully!');
      setTitle('');
      setDescription('');
      setBasePrice('');
      setVariants([{ colorName: 'Classic Black', colorHex: '#000000', imagesUrl: '', stock: 10 }]);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmitProduct} className="rounded-lg border bg-white p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Add New Garment</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Garment Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            placeholder="Silk Wrap Dress"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Base Price ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            placeholder="120.00"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            rows={3}
          />
        </div>
      </div>

      {/* Color Variants Builder */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Color Variants</h3>
          <button
            type="button"
            onClick={handleAddVariantRow}
            className="text-xs font-semibold text-black underline"
          >
            + Add Another Color
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {variants.map((variant, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-3 rounded-md border bg-gray-50 p-4 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Color Name</label>
                <input
                  type="text"
                  required
                  value={variant.colorName}
                  onChange={(e) => handleVariantChange(idx, 'colorName', e.target.value)}
                  className="mt-1 w-full rounded-md border bg-white p-1.5 text-xs"
                  placeholder="Emerald Green"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Hex Code</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={variant.colorHex}
                    onChange={(e) => handleVariantChange(idx, 'colorHex', e.target.value)}
                    className="h-7 w-8 rounded border"
                  />
                  <input
                    type="text"
                    value={variant.colorHex}
                    onChange={(e) => handleVariantChange(idx, 'colorHex', e.target.value)}
                    className="w-full rounded-md border bg-white p-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(idx, 'stock', parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded-md border bg-white p-1.5 text-xs"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-gray-700">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={variant.imagesUrl}
                  onChange={(e) => handleVariantChange(idx, 'imagesUrl', e.target.value)}
                  className="mt-1 w-full rounded-md border bg-white p-1.5 text-xs"
                  placeholder="https://images.com/dress-front.jpg, https://images.com/dress-back.jpg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black py-3 text-sm font-medium text-white hover:bg-gray-800"
      >
        {loading ? 'Saving Garment...' : 'Publish Product'}
      </button>
    </form>
  );
};