import React, { useState, useMemo } from 'react';
import { Shield, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { BusinessRow, CategoryRow, ProductRow, BusinessConfig, Category, Product } from '../types';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { AboutSection } from '../components/AboutSection';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { Footer } from '../components/Footer';

interface PublicCatalogProps {
  business: BusinessRow | null;
  categories: CategoryRow[];
  products: ProductRow[];
  isLoading: boolean;
  onNavigateToAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const PublicCatalog: React.FC<PublicCatalogProps> = ({
  business,
  categories,
  products,
  isLoading,
  onNavigateToAdmin,
  isAdminLoggedIn,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Transform CategoryRow[] into UI Category[]
  const uiCategories: Category[] = useMemo(() => {
    const list: Category[] = [{ id: 'semua', name: 'Semua Menu' }];
    categories.forEach((c) => {
      list.push({ id: c.id, name: c.name });
    });
    return list;
  }, [categories]);

  // Category ID to Name mapping
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  // Transform ProductRow[] into UI Product[]
  const uiProducts: Product[] = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      businessId: p.business_id,
      name: p.name,
      category: p.category_id || 'umum',
      categoryId: p.category_id || undefined,
      price: p.price,
      originalPrice: p.original_price || undefined,
      image: p.image_url,
      description: p.description,
      available: p.available,
      badge: p.badge || undefined,
      unit: p.unit || 'porsi',
    }));
  }, [products]);

  // Compute item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      semua: uiProducts.length,
    };
    uiProducts.forEach((p) => {
      const catKey = p.category || 'umum';
      counts[catKey] = (counts[catKey] || 0) + 1;
    });
    return counts;
  }, [uiProducts]);

  // Transform BusinessRow into UI BusinessConfig
  const uiBusiness: BusinessConfig = useMemo(() => {
    if (!business) {
      return {
        name: 'Memuat...',
        tagline: '',
        description: '',
        logo: '',
        heroImage: '',
        whatsappNumber: '6281234567890',
        whatsappDefaultMessage: 'Halo...',
        address: '',
        openingHours: '',
        features: [],
      };
    }
    return {
      id: business.id,
      ownerId: business.owner_id,
      slug: business.slug,
      name: business.name,
      tagline: business.tagline,
      description: business.description,
      logo: business.logo_url,
      heroImage: business.hero_image_url,
      whatsappNumber: business.whatsapp_number,
      whatsappDefaultMessage: business.whatsapp_default_message,
      address: business.address,
      googleMapsUrl: business.google_maps_url || undefined,
      openingHours: business.opening_hours,
      instagram: business.instagram || undefined,
      instagramUrl: business.instagram_url || undefined,
      features: [
        { title: '100% Halal & Higienis', description: 'Diproses dari bahan segar pilihan setiap hari' },
        { title: 'Pesan Cepat via WhatsApp', description: 'Tanpa registrasi, langsung terhubung ke kasir' },
        { title: 'Kemasan Rapi & Aman', description: 'Cocok untuk makan di tempat, bawa pulang, atau delivery' },
      ],
    };
  }, [business]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return uiProducts.filter((product) => {
      const matchCategory =
        selectedCategory === 'semua' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [uiProducts, selectedCategory, searchQuery]);

  if (isLoading && !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Memuat katalog UMKM...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Katalog Tidak Ditemukan</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-6">
          Katalog yang Anda cari belum terdaftar atau slug tidak sesuai.
        </p>
        <button
          onClick={onNavigateToAdmin}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer"
        >
          Masuk ke Panel Admin
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Owner Bar (Sticky subtle banner for owner login / admin access) */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="truncate">Katalog Resmi: <strong>{business.name}</strong></span>
        </div>
        <button
          onClick={onNavigateToAdmin}
          className="shrink-0 flex items-center gap-1 text-slate-300 hover:text-rose-400 font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer"
        >
          <Shield className="w-3 h-3 text-rose-500" />
          <span>{isAdminLoggedIn ? 'Panel Admin Usaha' : 'Login Admin'}</span>
        </button>
      </div>

      {/* Main Header */}
      <Header business={uiBusiness} />

      {/* Hero Banner */}
      <Hero business={uiBusiness} />

      {/* Main Catalog Area */}
      <main id="katalog" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilihan Menu Terbaik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Daftar Menu & Produk
            </h2>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs self-start sm:self-auto">
            Menampilkan {filteredProducts.length} menu
          </span>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Cari menu makanan, minuman, cemilan..."
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={uiCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={uiBusiness.whatsappNumber}
                businessName={uiBusiness.name}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-md mx-auto my-8 shadow-2xs">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Menu Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
              {searchQuery
                ? `Tidak ada menu yang sesuai dengan kata kunci "${searchQuery}".`
                : 'Belum ada produk dalam kategori ini.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('semua');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </main>

      {/* About & Location Section */}
      <AboutSection business={uiBusiness} />

      {/* Footer */}
      <Footer business={uiBusiness} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp
        whatsappNumber={uiBusiness.whatsappNumber}
        defaultMessage={uiBusiness.whatsappDefaultMessage}
        businessName={uiBusiness.name}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          whatsappNumber={uiBusiness.whatsappNumber}
          businessName={uiBusiness.name}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
