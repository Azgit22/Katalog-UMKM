import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Plus, Minus, ShieldCheck, Tag, Star, Flame, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatIDR, createWhatsAppOrderLink } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  businessName: string;
  whatsappNumber: string;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  businessName,
  whatsappNumber,
  onClose,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [customerNote, setCustomerNote] = useState<string>('');
  const [imgError, setImgError] = useState<boolean>(false);

  // Reset state saat modal dibuka untuk produk baru
  useEffect(() => {
    setQuantity(1);
    setCustomerNote('');
    setImgError(false);
  }, [product]);

  // Listener untuk tombol ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const totalPrice = product.price * quantity;
  const orderWhatsAppUrl = createWhatsAppOrderLink(
    whatsappNumber,
    businessName,
    product,
    quantity,
    customerNote
  );

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup detail produk"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 focus:outline-none transition-colors backdrop-blur-xs cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Product Big Image */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-100 w-full overflow-hidden">
            {!imgError ? (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 font-medium">
                {product.name}
              </div>
            )}

            {/* Badges */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
              {product.badge && (
                <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  {product.badge}
                </span>
              )}
              <span className="bg-slate-900/75 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-xs capitalize">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Title & Price */}
            <div>
              <h2 id="modal-product-title" className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-rose-600">
                  {formatIDR(product.price)}
                </span>
                {product.unit && (
                  <span className="text-sm font-medium text-slate-500">
                    / {product.unit}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatIDR(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-slate-100 pt-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Deskripsi Menu
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Availability Status */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Status: {product.available ? (
                  <strong className="text-emerald-700">Tersedia untuk dipesan</strong>
                ) : (
                  <strong className="text-rose-600">Sedang Habis Sementara</strong>
                )}
              </span>
            </div>

            {/* Quantity Selector & Notes (hanya jika tersedia) */}
            {product.available && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Jumlah Pesanan
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={decrementQty}
                        aria-label="Kurangi jumlah"
                        disabled={quantity <= 1}
                        className="p-1.5 rounded-lg bg-white shadow-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-slate-900 text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQty}
                        aria-label="Tambah jumlah"
                        className="p-1.5 rounded-lg bg-white shadow-xs text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500">
                      Total Estimasi: <strong className="text-rose-600 text-sm">{formatIDR(totalPrice)}</strong>
                    </div>
                  </div>
                </div>

                {/* Optional Note Field */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Contoh: Tidak pedas, kuah dipisah, sambal lebih"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Order Button */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs text-slate-500 block">Total Pembayaran</span>
            <span className="text-lg font-black text-rose-600">
              {formatIDR(totalPrice)}
            </span>
          </div>

          {product.available ? (
            <a
              href={orderWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm sm:text-base font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all duration-200 text-center"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Pesan via WhatsApp ({formatIDR(totalPrice)})</span>
            </a>
          ) : (
            <button
              disabled
              className="w-full py-3.5 bg-slate-300 text-slate-500 text-sm font-bold rounded-xl cursor-not-allowed text-center"
            >
              Produk Tidak Tersedia
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
