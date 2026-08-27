/**
 * Tipe data TypeScript untuk Web Katalog UMKM
 */

export interface BusinessConfig {
  id?: string;
  ownerId?: string;
  slug?: string;
  // Informasi Utama Bisnis
  name: string;
  tagline: string;
  description: string;
  logo: string;
  heroImage: string;

  // Kontak & Lokasi
  whatsappNumber: string; // Format: 628xxxxxxxxxx (tanpa tanda + atau spasi)
  whatsappDefaultMessage: string;
  address: string;
  googleMapsUrl?: string;
  openingHours: string;
  
  // Media Sosial (Opsional)
  instagram?: string;
  instagramUrl?: string;
  tiktok?: string;
  tiktokUrl?: string;

  // Fitur & Keunggulan Singkat (tampil di Hero)
  features?: Array<{
    title: string;
    description: string;
  }>;
}

export interface Category {
  id: string;
  businessId?: string;
  name: string;
}

export interface Product {
  id: string | number;
  businessId?: string;
  name: string;
  category: string; // Sesuai dengan name/id kategori
  categoryId?: string;
  price: number;
  originalPrice?: number; // Opsional: harga coret jika promo
  image: string;
  description: string;
  available: boolean;
  badge?: 'FAVORIT' | 'PROMO' | 'TERLARIS' | 'BARU' | string;
  unit?: string; // Contoh: "porsi", "cup", "box", "pcs", "kg"
}

export interface ThemeColors {
  primary: string;       // Warna utama (header badge, tombol beli, dsb)
  primaryHover: string;  // Warna saat tombol di-hover
  primaryLight: string;  // Warna aksen lembut untuk background chip/badge
  secondary: string;     // Warna sekunder pendukung
  accent: string;        // Warna aksen pemanis (bintang, badge promo)
  background: string;    // Warna latar belakang halaman
  cardBg: string;        // Warna latar kartu produk
  textMain: string;      // Warna teks utama
  textMuted: string;     // Warna teks deskripsi/sekunder
}

export interface AppConfig {
  business: BusinessConfig;
  theme: ThemeColors;
  categories: Category[];
  products: Product[];
}

// Database schema types (Supabase)
export interface BusinessRow {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo_url: string;
  hero_image_url: string;
  whatsapp_number: string;
  whatsapp_default_message: string;
  address: string;
  google_maps_url: string | null;
  opening_hours: string;
  instagram: string | null;
  instagram_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryRow {
  id: string;
  business_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductRow {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  available: boolean;
  badge: string | null;
  unit: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserSession {
  id: string;
  email: string;
  fullName?: string;
}

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
