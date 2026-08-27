import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  ExternalLink,
  Plus,
  Copy,
  Check,
  Store,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { BusinessRow, CategoryRow, ProductRow } from '../types';
import { formatIDR } from '../utils/formatters';

interface AdminDashboardProps {
  business: BusinessRow;
  categories: CategoryRow[];
  products: ProductRow[];
  onNavigate: (tab: 'dashboard' | 'products' | 'categories' | 'business') => void;
  onOpenProductModal: () => void;
  onToggleAvailability: (productId: string, currentStatus: boolean) => void;
  onOpenPublicCatalog: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  business,
  categories,
  products,
  onNavigate,
  onOpenProductModal,
  onToggleAvailability,
  onOpenPublicCatalog,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const availableCount = products.filter((p) => p.available).length;
  const outOfStockCount = products.filter((p) => !p.available).length;

  const publicUrl = `${window.location.origin}/?katalog=${business.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    onShowToast('Link katalog publik berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome & Public Link Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-semibold mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Katalog Online Aktif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang, {business.name}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Kelola menu produk, harga, dan informasi usaha Anda secara real-time. Setiap perubahan langsung tampil di website pembeli.
            </p>
          </div>

          {/* Public Link Action Box */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3 min-w-[280px]">
            <span className="text-xs font-semibold text-slate-300">Link Web Katalog Anda:</span>
            <div className="flex items-center gap-2 bg-slate-950/60 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 border border-white/10 overflow-hidden">
              <span className="truncate flex-1 font-semibold">{business.slug}</span>
              <button
                onClick={handleCopyLink}
                className="text-rose-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                title="Salin link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer text-center"
              >
                {copied ? 'Tersalin!' : 'Salin Link'}
              </button>
              <button
                onClick={onOpenPublicCatalog}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Buka Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Total Produk</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">{products.length}</span>
          </div>
        </div>

        {/* Available Products */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Siap Dipesan</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600">{availableCount}</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Stok Habis</span>
            <span className="text-xl sm:text-2xl font-black text-amber-600">{outOfStockCount}</span>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <FolderTree className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Kategori Menu</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">{categories.length}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Action Buttons */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-bold text-slate-900 text-base">Aksi Cepat</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-xs">
            <button
              onClick={onOpenProductModal}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4" />
                <span>Tambah Produk Baru</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('categories')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <FolderTree className="w-4 h-4 text-slate-500" />
                <span>Atur Kategori Menu</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('business')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-slate-500" />
                <span>Edit Kontak & Tampilan</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Quick Product Stock Management */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base">Status Stok Produk Cepat</h2>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Lihat Semua ({products.length})
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {products.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-rose-600 font-extrabold">
                          {formatIDR(product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Fast Toggle Button */}
                    <button
                      onClick={() => onToggleAvailability(product.id, product.available)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                        product.available
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      {product.available ? 'Tersedia' : 'Habis'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs sm:text-sm">
                Belum ada produk. Silakan tambahkan produk pertama Anda!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
