import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Package,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { BusinessRow, CategoryRow, ProductRow } from '../types';
import { categoryService } from '../services/categoryService';

interface AdminCategoriesProps {
  business: BusinessRow;
  categories: CategoryRow[];
  products: ProductRow[];
  onRefresh: () => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  business,
  categories,
  products,
  onRefresh,
  onShowToast,
}) => {
  // New Category Input
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit Category State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Category Dialog
  const [deletingCategory, setDeletingCategory] = useState<CategoryRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate products per category
  const productCountMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      if (p.category_id) {
        map[p.category_id] = (map[p.category_id] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  // Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      onShowToast('Nama kategori tidak boleh kosong', 'error');
      return;
    }

    setIsAdding(true);
    try {
      const { error } = await categoryService.createCategory(
        business.id,
        newCategoryName.trim()
      );
      if (error) {
        onShowToast(`Gagal membuat kategori: ${error.message}`, 'error');
      } else {
        onShowToast('Kategori baru berhasil ditambahkan!', 'success');
        setNewCategoryName('');
        await onRefresh();
      }
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setIsAdding(false);
    }
  };

  // Start Edit Category
  const startEditCategory = (cat: CategoryRow) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
  };

  // Save Edit Category
  const handleSaveEditCategory = async (id: string) => {
    if (!editCategoryName.trim()) {
      onShowToast('Nama kategori tidak boleh kosong', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await categoryService.updateCategory(id, editCategoryName.trim());
      if (error) {
        onShowToast(`Gagal mengubah kategori: ${error.message}`, 'error');
      } else {
        onShowToast('Kategori berhasil diperbarui!', 'success');
        setEditingCategoryId(null);
        await onRefresh();
      }
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm Delete Category
  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      const { error } = await categoryService.deleteCategory(deletingCategory.id);
      if (error) {
        onShowToast(`Gagal menghapus kategori: ${error.message}`, 'error');
      } else {
        onShowToast('Kategori berhasil dihapus', 'success');
        setDeletingCategory(null);
        await onRefresh();
      }
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Kategori Menu & Produk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelompokkan menu agar pelanggan mudah mencari pilihan makanan, minuman, atau paket
        </p>
      </div>

      {/* Add New Category Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-600" />
          <span>Tambah Kategori Baru</span>
        </h2>
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Contoh: Aneka Jus & Kopi, Makanan Ringan, Dimsum..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={isAdding}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAdding ? (
              <span>Menambahkan...</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Simpan Kategori</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Daftar Kategori ({categories.length})
          </span>
        </div>

        {categories.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const count = productCountMap[cat.id] || 0;
              const isEditing = editingCategoryId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <FolderTree className="w-4 h-4" />
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-rose-500 rounded-lg text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEditCategory(cat.id)}
                          disabled={isUpdating}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                          title="Simpan Perubahan"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                          title="Batal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Package className="w-3.5 h-3.5" />
                          <span>{count} produk</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => startEditCategory(cat)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Nama Kategori"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs sm:text-sm">
            Belum ada kategori. Silakan buat kategori pertama Anda di atas.
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL: CONFIRM DELETE CATEGORY */}
      {/* ===================================================================== */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setDeletingCategory(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Hapus Kategori "{deletingCategory.name}"?
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              {(productCountMap[deletingCategory.id] || 0) > 0
                ? `Terdapat ${productCountMap[deletingCategory.id]} produk yang terhubung dengan kategori ini. Produk tersebut tidak akan terhapus, tetapi akan berstatus tanpa kategori.`
                : 'Kategori ini tidak memiliki produk terdaftar dan aman untuk dihapus.'}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeletingCategory(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteCategory}
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
