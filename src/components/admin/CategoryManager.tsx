import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Category } from '@/types/database';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');

    const { error } = await supabase
      .from('categories')
      .insert({ name: newCategoryName.trim(), slug });

    if (!error) {
      setNewCategoryName('');
      fetchCategories();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>

      <form onSubmit={handleAddCategory} className="mt-4 flex gap-3">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New Category (e.g. Evening Gowns)"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      <div className="mt-6 divide-y border-t border-b">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-sm text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-500">Slug: {cat.slug}</p>
            </div>
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};