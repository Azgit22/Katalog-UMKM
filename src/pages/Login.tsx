import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Store, Sparkles, ArrowLeft, AlertTriangle } from 'lucide-react';
import { authService } from '../services/authService';
import { isSupabaseConfigured, isMockAuthEnabled } from '../lib/supabase';
import { UserSession } from '../types';

interface LoginProps {
  onSuccess: (user: UserSession) => void;
  onNavigateToRegister: () => void;
  onNavigateToPublic: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToPublic,
  onShowToast,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onShowToast('Silakan isi email dan password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await authService.signIn(email.trim(), password);
      if (error || !user) {
        onShowToast(error?.message || 'Login gagal. Periksa kembali email dan password.', 'error');
      } else {
        onShowToast('Login berhasil! Mengalihkan ke panel admin...', 'success');
        onSuccess(user);
      }
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    if (!isMockAuthEnabled()) {
      onShowToast('Mode mock demo dinonaktifkan di production. Harap atur kredensial Supabase.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await authService.signIn('owner@kedainusantara.com', 'password123');
      if (user) {
        onShowToast('Login mode demo berhasil!', 'success');
        onSuccess(user);
      } else {
        onShowToast(error?.message || 'Login demo gagal', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Public Catalog */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onNavigateToPublic}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Publik</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Login Admin UMKM
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Masuk untuk mengelola produk, harga, dan profil toko
            </p>
          </div>

          {!isSupabaseConfigured() && !isMockAuthEnabled() && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-left text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Konfigurasi Supabase Belum Terpasang</p>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Harap atur variabel <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> dan <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> di pengaturan hosting (Vercel / .env).
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Akun
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@tokoanda.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Panel Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option - ONLY shown if mock auth is explicitly enabled */}
          {isMockAuthEnabled() && (
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Masuk Cepat Mode Demo (Sandbox)</span>
              </button>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Belum punya akun usaha?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
