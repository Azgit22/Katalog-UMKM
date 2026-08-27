import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

/**
 * Validasi apakah konfigurasi Supabase Client tersedia dan valid
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

/**
 * Flag mode mock auth untuk development/sandbox testing saja.
 * Default bernilai false. Tidak aktif secara default pada production build.
 */
export const isMockAuthEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';
};

// Inisialisasi Supabase Client (hanya menggunakan public anon key)
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (null as unknown as SupabaseClient);
