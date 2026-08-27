import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BusinessRow } from '../types';
import { mockStorage } from './mockStorage';

export const businessService = {
  /**
   * Mengambil data bisnis berdasarkan slug publik
   */
  async getBusinessBySlug(slug: string): Promise<{ data: BusinessRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        // Jika tidak ditemukan dengan slug, coba ambil bisnis pertama sebagai fallback
        return { data: null, error };
      }
      return { data, error: null };
    } else {
      const all = mockStorage.getBusinesses();
      const found = all.find((b) => b.slug.toLowerCase() === slug.toLowerCase()) || all[0] || null;
      return { data: found, error: null };
    }
  },

  /**
   * Mengambil data bisnis milik user yang login (berdasarkan owner_id)
   */
  async getBusinessByOwnerId(ownerId: string): Promise<{ data: BusinessRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', ownerId)
        .maybeSingle();

      return { data: data || null, error };
    } else {
      const all = mockStorage.getBusinesses();
      const found = all.find((b) => b.owner_id === ownerId) || all[0] || null;
      return { data: found, error: null };
    }
  },

  /**
   * Mengambil bisnis pertama/default jika diakses dari root `/`
   */
  async getDefaultBusiness(): Promise<{ data: BusinessRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .limit(1)
        .maybeSingle();

      return { data: data || null, error };
    } else {
      const all = mockStorage.getBusinesses();
      return { data: all[0] || null, error: null };
    }
  },

  /**
   * Membuat profil bisnis baru untuk user pertama kali
   */
  async createBusiness(businessData: Partial<BusinessRow>): Promise<{ data: BusinessRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()
        .single();

      return { data: data || null, error };
    } else {
      const all = mockStorage.getBusinesses();
      const newBiz: BusinessRow = {
        id: 'biz-' + Math.random().toString(36).substring(2, 9),
        owner_id: businessData.owner_id || 'user-demo-001',
        slug: businessData.slug || 'usaha-baru',
        name: businessData.name || 'Usaha Baru',
        tagline: businessData.tagline || '',
        description: businessData.description || '',
        logo_url: businessData.logo_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&q=80',
        hero_image_url: businessData.hero_image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        whatsapp_number: businessData.whatsapp_number || '6281234567890',
        whatsapp_default_message: businessData.whatsapp_default_message || 'Halo, saya ingin pesan...',
        address: businessData.address || 'Alamat Toko',
        google_maps_url: businessData.google_maps_url || null,
        opening_hours: businessData.opening_hours || '09:00 - 21:00 WIB',
        instagram: businessData.instagram || null,
        instagram_url: businessData.instagram_url || null,
        primary_color: businessData.primary_color || '#E11D48',
        secondary_color: businessData.secondary_color || '#F97316',
        accent_color: businessData.accent_color || '#FBBF24',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      all.push(newBiz);
      mockStorage.saveBusinesses(all);
      return { data: newBiz, error: null };
    }
  },

  /**
   * Mengupdate informasi profil bisnis
   */
  async updateBusiness(id: string, updates: Partial<BusinessRow>): Promise<{ data: BusinessRow | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      return { data: data || null, error };
    } else {
      const all = mockStorage.getBusinesses();
      const idx = all.findIndex((b) => b.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
        mockStorage.saveBusinesses(all);
        return { data: all[idx], error: null };
      }
      return { data: null, error: new Error('Bisnis tidak ditemukan') };
    }
  },
};
