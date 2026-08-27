import React, { useState } from 'react';
import {
  Store,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Palette,
  Image as ImageIcon,
  Save,
  Sparkles,
  Link,
  MessageSquare,
} from 'lucide-react';
import { BusinessRow } from '../types';
import { businessService } from '../services/businessService';

interface AdminBusinessProps {
  business: BusinessRow;
  onRefresh: () => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const COLOR_PRESETS = [
  { name: 'Rose Red', primary: '#E11D48', secondary: '#F97316', accent: '#FBBF24' },
  { name: 'Emerald Green', primary: '#059669', secondary: '#10B981', accent: '#34D399' },
  { name: 'Royal Indigo', primary: '#4F46E5', secondary: '#6366F1', accent: '#818CF8' },
  { name: 'Coffee Brown', primary: '#78350F', secondary: '#92400E', accent: '#D97706' },
  { name: 'Sunset Orange', primary: '#EA580C', secondary: '#F97316', accent: '#FBBF24' },
  { name: 'Ocean Cyan', primary: '#0891B2', secondary: '#06B6D4', accent: '#38BDF8' },
];

export const AdminBusiness: React.FC<AdminBusinessProps> = ({
  business,
  onRefresh,
  onShowToast,
}) => {
  const [name, setName] = useState(business.name);
  const [slug, setSlug] = useState(business.slug);
  const [tagline, setTagline] = useState(business.tagline);
  const [description, setDescription] = useState(business.description);
  const [logoUrl, setLogoUrl] = useState(business.logo_url);
  const [heroImageUrl, setHeroImageUrl] = useState(business.hero_image_url);

  const [whatsappNumber, setWhatsappNumber] = useState(business.whatsapp_number);
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState(
    business.whatsapp_default_message
  );
  const [address, setAddress] = useState(business.address);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(business.google_maps_url || '');
  const [openingHours, setOpeningHours] = useState(business.opening_hours);
  const [instagram, setInstagram] = useState(business.instagram || '');
  const [instagramUrl, setInstagramUrl] = useState(business.instagram_url || '');

  const [primaryColor, setPrimaryColor] = useState(business.primary_color || '#E11D48');
  const [secondaryColor, setSecondaryColor] = useState(business.secondary_color || '#F97316');
  const [accentColor, setAccentColor] = useState(business.accent_color || '#FBBF24');

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Nama bisnis wajib diisi', 'error');
      return;
    }
    if (!whatsappNumber.trim()) {
      onShowToast('Nomor WhatsApp wajib diisi', 'error');
      return;
    }

    // Clean whatsapp number (ensure digits only, starting with 62)
    let cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) {
      cleanWa = '62' + cleanWa.slice(1);
    }

    // Clean slug
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    setIsSaving(true);

    try {
      const { error } = await businessService.updateBusiness(business.id, {
        name: name.trim(),
        slug: cleanSlug,
        tagline: tagline.trim(),
        description: description.trim(),
        logo_url: logoUrl.trim(),
        hero_image_url: heroImageUrl.trim(),
        whatsapp_number: cleanWa,
        whatsapp_default_message: whatsappDefaultMessage.trim(),
        address: address.trim(),
        google_maps_url: googleMapsUrl.trim() || null,
        opening_hours: openingHours.trim(),
        instagram: instagram.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
      });

      if (error) {
        onShowToast(`Gagal menyimpan: ${error.message}`, 'error');
      } else {
        onShowToast('Profil usaha & tampilan berhasil diperbarui!', 'success');
        await onRefresh();
      }
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Profil Usaha & Tampilan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Atur informasi kontak, WhatsApp pemesanan, alamat fisik, dan warna tema katalog
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: INFORMASI UTAMA & BRANDING */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Store className="w-5 h-5 text-rose-600" />
            <span>Identitas Bisnis & URL</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Usaha / Toko <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kedai Nusantara"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Slug URL Katalog <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-3 py-2 text-xs sm:text-sm">
                <span className="text-slate-400 font-mono">/?katalog=</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kedai-nusantara"
                  className="w-full bg-transparent text-slate-900 font-semibold focus:outline-none pl-1"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tagline Singkat
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Contoh: Kuliner Tradisional Lezat, Higienis, & Halal"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Deskripsi Lengkap Usaha
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan sejarah, dedikasi rasa, atau komitmen usaha Anda kepada pelanggan..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Logo & Banner URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                URL Logo Usaha
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                URL Banner Hero Header
              </label>
              <input
                type="text"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: KONTAK & WHATSAPP */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Phone className="w-5 h-5 text-emerald-600" />
            <span>Integrasi Pesanan WhatsApp & Jam Buka</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nomor WhatsApp Toko <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Contoh: 6281234567890"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Gunakan awalan 628 (bukan 08 atau +62)
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Jam Operasional
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Contoh: Setiap Hari, 09:00 - 22:00 WIB"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Pesan Pembuka WhatsApp Default
            </label>
            <textarea
              rows={2}
              value={whatsappDefaultMessage}
              onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
              placeholder="Halo, saya ingin tanya seputar menu..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* SECTION 3: LOKASI & SOSIAL MEDIA */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-rose-600" />
            <span>Alamat & Media Sosial</span>
          </h2>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Alamat Lengkap Usaha
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Ahmad Yani No. 45, Kebayoran Baru, Jakarta Selatan"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Link Google Maps (Opsional)
              </label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => {
                  setInstagram(e.target.value);
                  setInstagramUrl(`https://instagram.com/${e.target.value.replace('@', '')}`);
                }}
                placeholder="@kedainusantara"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: WARNA TEMA */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Palette className="w-5 h-5 text-indigo-600" />
            <span>Pilihan Tema & Warna Tampilan</span>
          </h2>

          {/* Preset Palettes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilih Preset Warna Populer:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = primaryColor.toLowerCase() === preset.primary.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setSecondaryColor(preset.secondary);
                      setAccentColor(preset.accent);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 shadow-sm ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex -space-x-1.5 shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border border-white"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-white"
                        style={{ backgroundColor: preset.secondary }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-white"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Warna Utama (Primary)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Warna Sekunder
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Warna Aksen (Badge/Highlight)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-950/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Menyimpan Pengaturan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
