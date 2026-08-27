import { supabase, isSupabaseConfigured, isMockAuthEnabled } from '../lib/supabase';
import { UserSession } from '../types';
import { mockStorage } from './mockStorage';

export const authService = {
  /**
   * Register pengguna baru via Supabase Auth
   */
  async signUp(email: string, password: string, fullName?: string): Promise<{ user: UserSession | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          return { user: null, error: new Error('Email ini sudah terdaftar. Silakan langsung login.') };
        }
        return { user: null, error };
      }
      if (data.user) {
        return {
          user: {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || fullName,
          },
          error: null,
        };
      }
      return { user: null, error: new Error('Pendaftaran gagal. Silakan periksa kembali data Anda.') };
    } else if (isMockAuthEnabled()) {
      // Mock Fallback: HANYA jika VITE_ENABLE_MOCK_AUTH=true secara eksplisit
      const mockUser: UserSession = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        fullName: fullName || email.split('@')[0],
      };
      mockStorage.setSession(mockUser);
      return { user: mockUser, error: null };
    } else {
      return {
        user: null,
        error: new Error('Konfigurasi Supabase belum benar. Harap atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di environment variables.'),
      };
    }
  },

  /**
   * Login pengguna via Supabase Auth
   */
  async signIn(email: string, password: string): Promise<{ user: UserSession | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          return { user: null, error: new Error('Email atau password salah.') };
        }
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return { user: null, error: new Error('Email belum dikonfirmasi. Periksa kotak masuk email Anda.') };
        }
        return { user: null, error };
      }
      if (data.user) {
        return {
          user: {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || '',
          },
          error: null,
        };
      }
      return { user: null, error: new Error('Login gagal. Periksa kembali email dan password.') };
    } else if (isMockAuthEnabled()) {
      // Mock Fallback: HANYA jika VITE_ENABLE_MOCK_AUTH=true secara eksplisit
      const mockUser: UserSession = {
        id: 'user-demo-001',
        email,
        fullName: email.split('@')[0] || 'Pemilik Usaha',
      };
      mockStorage.setSession(mockUser);
      return { user: mockUser, error: null };
    } else {
      return {
        user: null,
        error: new Error('Konfigurasi Supabase belum benar. Harap atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di environment variables.'),
      };
    }
  },

  /**
   * Logout pengguna
   */
  async signOut(): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signOut();
      return { error };
    } else {
      mockStorage.setSession(null);
      return { error: null };
    }
  },

  /**
   * Mendapatkan user yang sedang aktif dari session
   */
  async getCurrentUser(): Promise<UserSession | null> {
    if (isSupabaseConfigured()) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) return null;
      return {
        id: session.user.id,
        email: session.user.email || '',
        fullName: session.user.user_metadata?.full_name || '',
      };
    } else if (isMockAuthEnabled()) {
      return mockStorage.getSession();
    } else {
      return null;
    }
  },

  /**
   * Listener perubahan session auth
   */
  onAuthStateChange(callback: (user: UserSession | null) => void): { unsubscribe: () => void } {
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          callback({
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || '',
          });
        } else {
          callback(null);
        }
      });
      return { unsubscribe: () => subscription.unsubscribe() };
    } else if (isMockAuthEnabled()) {
      const current = mockStorage.getSession();
      callback(current);
      return { unsubscribe: () => {} };
    } else {
      callback(null);
      return { unsubscribe: () => {} };
    }
  },
};
