import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Star,
  Flame,
  Tag,
  Sparkles,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { BusinessRow, CategoryRow, ProductRow } from '../types';
import { productService } from '../services/productService';
import { formatIDR } from '../utils/formatters';

interface AdminProductsProps {
  business: BusinessRow;
  categories: CategoryRow[];
  products: ProductRow[];
  onRefresh: () => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isModalOpenInitially?: boolean;
  onCloseInitialModal?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  business,
  categories,
  products,
  onRefresh,
  onShowToast,
  isModalOpenInitially = false,
  onCloseInitialModal,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('semua');
  const [sortBy, setSortBy] = useState<'newest' | 'name-asc' | 'price-asc' | 'price-desc'>('newest');

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenInitially);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Dialog State
  const [deletingProduct, setDeletingProduct] = useState<ProductRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formUnit, setFormUnit] = useState('porsi');
  const [formBadge, setFormBadge] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  // Handle open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || '');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormUnit('porsi');
    setFormBadge('');
    setFormDescription('');
    setFormAvailable(true);
    setFormImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    setIsModalOpen(true);
  };

  // Handle open Edit Modal
  const handleOpenEditModal = (product: ProductRow) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategoryId(product.category_id || categories[0]?.id || '');
    setFormPrice(product.price.toString());
    setFormOriginalPrice(product.original_price ? product.original_price.toString() : '');
    setFormUnit(product.unit || 'porsi');
    setFormBadge(product.badge || '');
    setFormDescription(product.description || '');
    setFormAvailable(product.available);
    setFormImageUrl(product.image_url);
    setSelectedImageFile(null);
    setImagePreviewUrl(product.image_url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    if (onCloseInitialModal) onCloseInitialModal();
  };

  // Handle Image File Selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
    }
  };

  // Submit Product Form (Create or Update)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      onShowToast('Nama produk wajib diisi', 'error');
      return;
    }
    const priceNum = parseInt(formPrice.replace(/[^0-9]/g, ''), 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      onShowToast('Harga produk harus lebih besar dari 0', 'error');
      return;
    }

    const origPriceNum = formOriginalPrice.trim()
      ? parseInt(formOriginalPrice.replace(/[^0-9]/g, ''), 10)
      : null;

    setIsSaving(true);

    try {
      let finalImageUrl = formImageUrl;

      // Upload file jika ada file baru yang dipilih
      if (selectedImageFile) {
        const { url, error: uploadError } = await productService.uploadProductImage(
          selectedImageFile,
          business.id
        );
        if (uploadError) {
          onShowToast(`Gagal mengunggah foto: ${uploadError.message}`, 'error');
          setIsSaving(false);
          return;
        }
        if (url) {
          finalImageUrl = url;
        }
      }

      if (editingProduct) {
        // UPDATE
        const { error } = await productService.updateProduct(editingProduct.id, {
          name: formName.trim(),
          category_id: formCategoryId || null,
          price: priceNum,
          original_price: origPriceNum,
          unit: formUnit.trim() || 'porsi',
          badge: formBadge.trim() || null,
          description: formDescription.trim(),
          available: formAvailable,
          image_url: finalImageUrl,
        });

        if (error) {
          onShowToast(`Gagal mengupdate produk: ${error.message}`, 'error');
        } else {
          onShowToast('Produk berhasil diperbarui!', 'success');
          await onRefresh();
          closeModal();
        }
      } else {
        // CREATE
        const { error } = await productService.createProduct({
          business_id: business.id,
          name: formName.trim(),
          category_id: formCategoryId || null,
          price: priceNum,
          original_price: origPriceNum,
          unit: formUnit.trim() || 'porsi',
          badge: formBadge.trim() || null,
          description: formDescription.trim(),
          available: formAvailable,
          image_url: finalImageUrl,
        });

        if (error) {
          onShowToast(`Gagal menambahkan produk: ${error.message}`, 'error');
        } else {
          onShowToast('Produk baru berhasil ditambahkan!', 'success');
          await onRefresh();
          closeModal();
        }
      }
    } catch (err: any) {
      onShowToast(err.message || 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Available
  const handleToggleAvailable = async (product: ProductRow) => {
    try {
      const { error } = await productService.updateProduct(product.id, {
        available: !product.available,
      });
      if (error) {
        onShowToast('Gagal mengubah status', 'error');
      } else {
        onShowToast(
          `Status ${product.name} diubah menjadi: ${!product.available ? 'Tersedia' : 'Habis'}`,
          'success'
        );
        await onRefresh();
      }
    } catch (err: any) {
      onShowToast(err.message, 'error');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const { error } = await productService.deleteProduct(deletingProduct.id, deletingProduct.image_url);
      if (error) {
        onShowToast(`Gagal menghapus produk: ${error.message}`, 'error');
      } else {
        onShowToast('Produk berhasil dihapus', 'success');
        await onRefresh();
        setDeletingProduct(null);
      }
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory =
        selectedCategoryFilter === 'semua' || p.category_id === selectedCategoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // default by created_at descending
        break;
    }

    return result;
  }, [products, selectedCategoryFilter, searchQuery, sortBy]);

  // Category Map Helper
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Produk & Menu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Total {products.length} produk terdaftar dalam katalog
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter, Search & Sorting Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          >
            <option value="semua">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="name-asc">Nama (A-Z)</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Product List Table / Grid */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div className="max-w-xs">
                          <h3 className="font-bold text-slate-900 truncate">{product.name}</h3>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {product.description || 'Tidak ada deskripsi'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">
                        {categoryMap[product.category_id || ''] || 'Umum'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-rose-600">
                        {formatIDR(product.price)}
                        <span className="text-xs text-slate-400 font-normal"> /{product.unit || 'porsi'}</span>
                      </div>
                      {product.original_price && (
                        <div className="text-[11px] text-slate-400 line-through">
                          {formatIDR(product.original_price)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {product.badge ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-md">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailable(product)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          product.available
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        {product.available ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tersedia</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Habis</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                        {categoryMap[product.category_id || ''] || 'Umum'}
                      </span>
                      {product.badge && (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-bold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">
                      {product.name}
                    </h3>
                    <div className="font-extrabold text-rose-600 text-sm mt-0.5">
                      {formatIDR(product.price)}
                      <span className="text-xs text-slate-400 font-normal"> /{product.unit || 'porsi'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleAvailable(product)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.available
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {product.available ? '✓ Tersedia' : '✕ Habis'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingProduct(product)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Tidak ada produk ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            {searchQuery
              ? `Tidak ada produk dengan kata kunci "${searchQuery}"`
              : 'Mulai buat katalog Anda dengan menambahkan produk pertama.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={closeModal} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />

          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900">
                  {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Lengkapi informasi menu yang akan tampil di katalog
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Product Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Ayam Bakar Madu Spesial"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {/* Category & Unit Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kategori Menu
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Satuan Unit
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="porsi, cup, box, pcs"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              {/* Price & Original Price Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Harga Jual (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="Contoh: 25000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Harga Coret / Promo (Rp)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="Contoh: 30000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              {/* Badge & Status Available */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Badge Khusus (Opsional)
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="">Tidak Ada</option>
                    <option value="FAVORIT">FAVORIT</option>
                    <option value="TERLARIS">TERLARIS</option>
                    <option value="PROMO">PROMO</option>
                    <option value="BARU">BARU</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ketersediaan Stok
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="avail-check"
                      checked={formAvailable}
                      onChange={(e) => setFormAvailable(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                    />
                    <label htmlFor="avail-check" className="text-xs font-semibold text-slate-800 cursor-pointer">
                      {formAvailable ? 'Tersedia untuk dipesan' : 'Sedang Habis'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Deskripsi Menu
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Jelaskan bahan, rasa, porsi, atau kelezatan menu..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Image Upload / Preview */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Foto Produk
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {imagePreviewUrl || formImageUrl ? (
                      <img
                        src={imagePreviewUrl || formImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-slate-200">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Foto dari HP/Laptop</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Format: JPG, PNG, WEBP (Maksimal 3MB)
                    </p>

                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => {
                        setFormImageUrl(e.target.value);
                        setImagePreviewUrl('');
                      }}
                      placeholder="Atau masukkan URL Gambar langsung..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Produk</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CONFIRM DELETE PRODUCT */}
      {/* ===================================================================== */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setDeletingProduct(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Hapus Produk?
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>"{deletingProduct.name}"</strong>? Data yang dihapus tidak dapat dikembalikan.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
