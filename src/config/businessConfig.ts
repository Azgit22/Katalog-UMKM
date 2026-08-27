import { AppConfig } from '../types';

/**
 * ============================================================================
 * PANDUAN PENGGUNAAN TEMPLATE KATALOG UMKM
 * ============================================================================
 * Untuk mengganti data klien berikutnya, Anda CUKUP mengedit file ini saja!
 * Tidak perlu mengubah komponen kode lainnya.
 *
 * 1. Ganti Informasi Bisnis di bagian "business"
 * 2. Sesuaikan Warna Brand di bagian "theme"
 * 3. Tambah/Ubah Kategori di bagian "categories"
 * 4. Tambah/Ubah Daftar Produk di bagian "products"
 * ============================================================================
 */

export const businessConfig: AppConfig = {
  // ==========================================================================
  // 1. DATA INFORMASI BISNIS
  // ==========================================================================
  business: {
    name: "Kedai Nusantara",
    tagline: "Rasa rumahan, harga bersahabat.",
    description: "Menyajikan aneka hidangan khas nusantara dengan bumbu rempah pilihan, higienis, dan cita rasa autentik yang bikin kangen rumah.",
    
    // Logo Bisnis (bisa berupa URL gambar atau logo placeholder)
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&q=80",
    
    // Banner / Foto Hero
    heroImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",

    // Nomor WhatsApp Pemilik Usaha
    // Format: 628xxxxxxxxxx (awali dengan 62, jangan gunakan tanda + atau spasi)
    whatsappNumber: "6281234567890",

    // Pesan Default untuk Floating Chat WhatsApp
    whatsappDefaultMessage: "Halo Kedai Nusantara, saya ingin bertanya tentang menu dan cara pemesanan.",

    // Alamat Lengkap & Jam Buka
    address: "Jl. Melati No. 24, Sukajadi, Kota Bandung (Depan Alfamart)",
    googleMapsUrl: "https://maps.google.com/?q=Bandung",
    openingHours: "Setiap Hari | 09:00 - 21:00 WIB",

    // Akun Media Sosial
    instagram: "@kedainusantara.id",
    instagramUrl: "https://instagram.com",
    tiktok: "@kedainusantara",
    tiktokUrl: "https://tiktok.com",

    // 3 Keunggulan Singkat yang tampil di Hero
    features: [
      {
        title: "100% Halal & Higienis",
        description: "Bahan segar pilihan tanpa pengawet"
      },
      {
        title: "Pesan Mudah & Cepat",
        description: "Langsung terhubung ke WhatsApp penjual"
      },
      {
        title: "Porsi Kenyang Bersahabat",
        description: "Harga terjangkau cocok untuk keluarga & kantor"
      }
    ]
  },

  // ==========================================================================
  // 2. TEMA WARNA (Bisa disesuaikan dengan warna logo UMKM klien)
  // ==========================================================================
  // Pilihan Tema Populer:
  // - Kuliner Hangat / Bistro: primary: '#E11D48', primaryHover: '#BE123C'
  // - Cafe & Kopi Modern:      primary: '#78350F', primaryHover: '#582606'
  // - Segar / Herbal / Sehat:  primary: '#0D9488', primaryHover: '#0F766E'
  // - Jasa / Retail / Trendy:  primary: '#2563EB', primaryHover: '#1D4ED8'
  theme: {
    primary: "#E11D48",       // Merah Segar Kuliner (Rose-600)
    primaryHover: "#BE123C",  // Merah Lebih Gelap (Rose-700)
    primaryLight: "#FFE4E6",  // Background Pink Lembut (Rose-100)
    secondary: "#F97316",     // Oranye Aksen (Orange-500)
    accent: "#FBBF24",        // Kuning Emas untuk Bintang/Badge (Amber-400)
    background: "#F8FAFC",    // Abu-abu terang bersih (Slate-50)
    cardBg: "#FFFFFF",        // Putih Bersih
    textMain: "#0F172A",      // Slate-900
    textMuted: "#64748B",     // Slate-500
  },

  // ==========================================================================
  // 3. DAFTAR KATEGORI PRODUK
  // ==========================================================================
  categories: [
    { id: "semua", name: "Semua Menu" },
    { id: "makanan", name: "Makanan Utama" },
    { id: "paket-hemat", name: "Paket Hemat" },
    { id: "minuman", name: "Minuman Segar" },
    { id: "snack", name: "Camilan & Tambahan" },
  ],

  // ==========================================================================
  // 4. DAFTAR PRODUK (Minimal 10+ contoh produk lengkap)
  // ==========================================================================
  products: [
    {
      id: "prod-1",
      name: "Ayam Bakar Madu Spesial",
      category: "makanan",
      price: 26000,
      originalPrice: 30000,
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80",
      description: "Ayam ungkep bumbu rempah pilihan dengan olesan madu murni, dibakar harum disajikan dengan lalapan segar & sambal terasi.",
      available: true,
      badge: "FAVORIT",
      unit: "porsi"
    },
    {
      id: "prod-2",
      name: "Nasi Bebek Goreng Sambal Korek",
      category: "makanan",
      price: 32000,
      originalPrice: 36000,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      description: "Bebek goreng garing di luar dan lembut di dalam, disajikan dengan serundeng gurih dan sambal korek pedas nampol.",
      available: true,
      badge: "TERLARIS",
      unit: "porsi"
    },
    {
      id: "prod-3",
      name: "Ayam Geprek Keju Lumer",
      category: "makanan",
      price: 22000,
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
      description: "Ayam krispi renyah digeprek dengan cabai rawit merah pedas level 1-5, disiram keju mozzarella leleh yang gurih.",
      available: true,
      badge: "PROMO",
      unit: "porsi"
    },
    {
      id: "prod-4",
      name: "Nasi Goreng Spesial Nusantara",
      category: "makanan",
      price: 24000,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
      description: "Nasi goreng dengan bumbu racikan khas, suwiran ayam, telur mata sapi, sosis, bakso, dan kerupuk renyah.",
      available: true,
      unit: "porsi"
    },
    {
      id: "prod-5",
      name: "Paket Kenyang 1 (Nasi + Ayam + Es Teh)",
      category: "paket-hemat",
      price: 28000,
      originalPrice: 33000,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
      description: "Paket komplit hemat berisi Nasi Putih hangat, Ayam Goreng Lengkuas, Tempe Mendoan, Sambal, Lalapan, dan Es Teh Manis Jumbo.",
      available: true,
      badge: "PROMO",
      unit: "paket"
    },
    {
      id: "prod-6",
      name: "Paket Ramean (Untuk 4 Orang)",
      category: "paket-hemat",
      price: 110000,
      originalPrice: 130000,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
      description: "Cocok untuk keluarga atau kumpul teman: 4 Nasi Putih, 4 Ayam Bakar/Goreng, 2 Porsi Tahu Tempe, 2 Sayur Asem, dan 1 Pitcher Es Jeruk.",
      available: true,
      badge: "FAVORIT",
      unit: "paket"
    },
    {
      id: "prod-7",
      name: "Es Kopi Susu Gula Aren",
      category: "minuman",
      price: 15000,
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
      description: "Kopi espresso asli Nusantara dipadukan dengan susu segar creamy dan sirup gula aren organik yang wangi.",
      available: true,
      badge: "FAVORIT",
      unit: "cup"
    },
    {
      id: "prod-8",
      name: "Es Teh Manis Jumbo Melati",
      category: "minuman",
      price: 6000,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
      description: "Seduhan teh daun melati wangi dengan rasa manis pas dan es batu segar, ukuran porsi jumbo 500ml.",
      available: true,
      unit: "cup"
    },
    {
      id: "prod-9",
      name: "Es Jeruk Peras Murni",
      category: "minuman",
      price: 10000,
      image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
      description: "Jeruk peras asli segar kaya vitamin C, tanpa pemanis buatan, disajikan dingin menyegarkan tenggorokan.",
      available: true,
      unit: "cup"
    },
    {
      id: "prod-10",
      name: "Tahu & Tempe Mendoan Crispy",
      category: "snack",
      price: 12000,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      description: "Isi 5 pcs tahu dan tempe goreng tepung gurih dengan irisan daun bawang dan sambal kecap rawit pedas manis.",
      available: true,
      unit: "porsi"
    },
    {
      id: "prod-11",
      name: "Pisang Goreng Keju Cokelat",
      category: "snack",
      price: 14000,
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
      description: "Pisang raja manis digoreng renyah bertabur keju cheddar parut melimpah dan lelehan cokelat kental manis.",
      available: true,
      badge: "BARU",
      unit: "porsi"
    },
    {
      id: "prod-12",
      name: "Sop Iga Sapi Kuah Gurih (Limited)",
      category: "makanan",
      price: 45000,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
      description: "Iga sapi empuk direbus dengan kaldu rempah bening gurih, potongan wortel, kentang, daun bawang, dan taburan bawang goreng.",
      available: false, // Contoh produk habis
      badge: "HABIS",
      unit: "porsi"
    }
  ]
};
