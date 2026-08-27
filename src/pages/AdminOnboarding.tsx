import React, { useState } from 'react';
import { Store, Sparkles, Phone, ArrowRight, Check } from 'lucide-react';
import { UserSession } from '../types';
import { businessService } from '../services/businessService';
import { categoryService } from '../services/categoryService';

interface AdminOnboardingProps {
  user: UserSession;
  onComplete: () => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminOnboarding: React.FC<AdminOnboardingProps> = ({
  user,
  onComplete,
  onShowToast,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (val: string) => {
    setBusinessName(val);
    if (!slug || slug === businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      onShowToast('Nama usaha wajib diisi', 'error');
      return;
    }
    if (!whatsappNumber.trim()) {
      onShowToast('Nomor WhatsApp wajib diisi', 'error');
      return;
    }

    let cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) {
      cleanWa = '62' + cleanWa.slice(1);
    }

    const cleanSlug = (slug || businessName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    setIsSubmitting(true);

    try {
      // 1. Create Business
      const { data: newBiz, error: bizError } = await businessService.createBusiness({
        owner_id: user.id,
        name: businessName.trim(),
        slug: cleanSlug,
        tagline: 'Katalog Menu & Pemesanan Resmi',
        description: `Selamat datang di katalog resmi ${businessName}. Kami menyajikan aneka pilihan menu berkualitas yang siap dipesan langsung via WhatsApp.`,
        whatsapp_number: cleanWa,
        whatsapp_default_message: 'Halo, saya ingin pesan menu dari katalog...',
        address: address.trim() || 'Indonesia',
        opening_hours: 'Setiap Hari, 09:00 - 21:00 WIB',
        logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&q=80',
        hero_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        primary_color: '#E11D48',
        secondary_color: '#F97316',
        accent_color: '#FBBF24',
      });

      if (bizError || !newBiz) {
        onShowToast(`Gagal membuat toko: ${bizError?.message || 'Error'}`, 'error');
        setIsSubmitting(false);
        return;
      }

      // 2. Create Initial Default Categories
      await categoryService.createCategory(newBiz.id, 'Makanan Utama');
      await categoryService.createCategory(newBiz.id, 'Minuman');
      await categoryService.createCategory(newBiz.id, 'Camilan / Snack');

      onShowToast('Toko berhasil disiapkan! Selamat datang di panel admin.', 'success');
      await onComplete();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Siapkan Katalog Usaha Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Hanya butuh 30 detik untuk mulai memajang menu & menerima order via WhatsApp
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nama Usaha / Brand Anda <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Kedai Kopi & Dimsum Bahagia"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Link Web Katalog (Slug) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <span className="text-slate-400 font-mono">/?katalog=</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kedai-kopi-bahagia"
                className="w-full bg-transparent text-slate-900 font-semibold focus:outline-none pl-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nomor WhatsApp untuk Terima Pesanan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Contoh: 081234567890 atau 6281234567890"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Kota / Alamat Singkat
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Bandung, Jawa Barat"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-sm font-bold rounded-2xl shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <span>Menyiapkan Katalog...</span>
            ) : (
              <>
                <span>Buka Panel Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
