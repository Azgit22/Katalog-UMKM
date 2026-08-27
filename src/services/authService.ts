import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserSession } from '../types';
import { mockStorage } from './mockStorage';

export const authService = {
  /**
   * Register pengguna baru
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

      if (error) return { user: null, error };
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
      return { user: null, error: new Error('Pendaftaran gagal. Silakan coba lagi.') };
    } else {
      // Mock Fallback
      const mockUser: UserSession = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        fullName: fullName || email.split('@')[0],
      };
      mockStorage.setSession(mockUser);
      return { user: mockUser, error: null };
    }
  },

  /**
   * Login pengguna
   */
  async signIn(email: string, password: string): Promise<{ user: UserSession | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { user: null, error };
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
    } else {
      // Mock Fallback
      const mockUser: UserSession = {
        id: 'user-demo-001',
        email,
        fullName: email.split('@')[0] || 'Pemilik Usaha',
      };
      mockStorage.setSession(mockUser);
      return { user: mockUser, error: null };
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
   * Mendapatkan user yang sedang aktif
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
    } else {
      return mockStorage.getSession();
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
    } else {
      // Mock polling / storage check
      const current = mockStorage.getSession();
      callback(current);
      return { unsubscribe: () => {} };
    }
  },
};
