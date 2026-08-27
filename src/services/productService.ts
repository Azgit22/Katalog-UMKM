import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProductRow } from '../types';
import { mockStorage } from './mockStorage';

export const productService = {
  /**
   * Mengambil semua produk milik bisnis tertentu
   */
  async getProductsByBusinessId(businessId: string): Promise<{ data: ProductRow[]; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } else {
      const all = mockStorage.getProducts();
      const filtered = all.filter((p) => p.business_id === businessId);
      return { data: filtered, error: null };
    }
  },

  /**
   * Menambahkan produk baru
   */
  async createProduct(productData: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ProductRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      return { data: data || null, error };
    } else {
      const all = mockStorage.getProducts();
      const newProd: ProductRow = {
        ...productData,
        id: 'prod-' + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      all.unshift(newProd);
      mockStorage.saveProducts(all);
      return { data: newProd, error: null };
    }
  },

  /**
   * Mengupdate data produk
   */
  async updateProduct(id: string, updates: Partial<ProductRow>): Promise<{ data: ProductRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      return { data: data || null, error };
    } else {
      const all = mockStorage.getProducts();
      const idx = all.findIndex((p) => p.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
        mockStorage.saveProducts(all);
        return { data: all[idx], error: null };
      }
      return { data: null, error: new Error('Produk tidak ditemukan') };
    }
  },

  /**
   * Menghapus produk
   */
  async deleteProduct(id: string, _imageUrl?: string): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      return { error };
    } else {
      const all = mockStorage.getProducts();
      const filtered = all.filter((p) => p.id !== id);
      mockStorage.saveProducts(filtered);
      return { error: null };
    }
  },

  /**
   * Upload gambar produk ke Supabase Storage (bucket: product-images)
   */
  async uploadProductImage(file: File, businessId: string): Promise<{ url: string | null; error: Error | null }> {
    // Validasi ukuran (maksimal 3MB)
    if (file.size > 3 * 1024 * 1024) {
      return { url: null, error: new Error('Ukuran file foto maksimal 3MB') };
    }

    // Validasi format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return { url: null, error: new Error('Format file harus berupa JPG, PNG, atau WEBP') };
    }

    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${businessId}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          // Jika bucket belum dibuat, kita berikan petunjuk error yang jelas
          return { url: null, error: uploadError };
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        return { url: data.publicUrl, error: null };
      } catch (err: any) {
        return { url: null, error: err };
      }
    } else {
      // Mock Upload: gunakan FileReader base64 atau blob URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ url: reader.result as string, error: null });
        };
        reader.onerror = () => {
          resolve({ url: null, error: new Error('Gagal memproses gambar lokal') });
        };
        reader.readAsDataURL(file);
      });
    }
  },
};
