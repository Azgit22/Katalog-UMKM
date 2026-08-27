import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CategoryRow } from '../types';
import { mockStorage } from './mockStorage';

export const categoryService = {
  /**
   * Mengambil seluruh kategori milik bisnis tertentu
   */
  async getCategoriesByBusinessId(businessId: string): Promise<{ data: CategoryRow[]; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true });

      if ((!data || data.length === 0) && !error) {
        const all = mockStorage.getCategories();
        const filtered = all.filter((c) => c.business_id === businessId || businessId === 'biz-default-001');
        if (filtered.length > 0) return { data: filtered, error: null };
      }

      return { data: data || [], error };
    } else {
      const all = mockStorage.getCategories();
      const filtered = all.filter((c) => c.business_id === businessId || businessId === 'biz-default-001');
      return { data: filtered.length > 0 ? filtered : all, error: null };
    }
  },

  /**
   * Menambahkan kategori baru
   */
  async createCategory(businessId: string, name: string): Promise<{ data: CategoryRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ business_id: businessId, name: name.trim() }])
        .select()
        .single();

      return { data: data || null, error };
    } else {
      const all = mockStorage.getCategories();
      const newCat: CategoryRow = {
        id: 'cat-' + Math.random().toString(36).substring(2, 9),
        business_id: businessId,
        name: name.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      all.push(newCat);
      mockStorage.saveCategories(all);
      return { data: newCat, error: null };
    }
  },

  /**
   * Mengubah nama kategori
   */
  async updateCategory(id: string, name: string): Promise<{ data: CategoryRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('categories')
        .update({ name: name.trim(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data: data || null, error };
    } else {
      const all = mockStorage.getCategories();
      const idx = all.findIndex((c) => c.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], name: name.trim(), updated_at: new Date().toISOString() };
        mockStorage.saveCategories(all);
        return { data: all[idx], error: null };
      }
      return { data: null, error: new Error('Kategori tidak ditemukan') };
    }
  },

  /**
   * Menghapus kategori
   */
  async deleteCategory(id: string): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      return { error };
    } else {
      const all = mockStorage.getCategories();
      const filtered = all.filter((c) => c.id !== id);
      mockStorage.saveCategories(filtered);
      return { error: null };
    }
  },
};
