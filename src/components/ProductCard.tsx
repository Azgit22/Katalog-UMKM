import React, { useState } from 'react';
import { MessageCircle, Star, Sparkles, Flame, Eye, Tag, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatIDR, createWhatsAppOrderLink } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  businessName: string;
  whatsappNumber: string;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  businessName,
  whatsappNumber,
  onOpenDetail,
}) => {
  const [imgError, setImgError] = useState(false);

  const directOrderLink = createWhatsAppOrderLink(
    whatsappNumber,
    businessName,
    product,
    1
  );

  const renderBadge = () => {
    if (!product.available) {
      return (
        <span className="inline-flex items-center gap-1 bg-slate-900/80 text-white text-[10px] sm:text-xs font-bold px-2 py-0.8 rounded-md backdrop-blur-xs">
          <AlertCircle className="w-3 h-3" />
          Habis
        </span>
      );
    }

    if (!product.badge) return null;

    switch (product.badge.toUpperCase()) {
      case 'FAVORIT':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.8 rounded-md shadow-xs">
            <Star className="w-3 h-3 fill-current" />
            Favorit
          </span>
        );
      case 'TERLARIS':
        return (
          <span className="inline-flex items-center gap-1 bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.8 rounded-md shadow-xs">
            <Flame className="w-3 h-3 fill-current" />
            Terlaris
          </span>
        );
      case 'PROMO':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.8 rounded-md shadow-xs">
            <Tag className="w-3 h-3" />
            Promo
          </span>
        );
      case 'BARU':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.8 rounded-md shadow-xs">
            <Sparkles className="w-3 h-3" />
            Baru
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.8 rounded-md shadow-xs">
            {product.badge}
          </span>
        );
    }
  };

  return (
    <div className={`group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
      !product.available ? 'opacity-75' : ''
    }`}>
      {/* Card Header & Media */}
      <div 
        onClick={() => onOpenDetail(product)} 
        className="cursor-pointer relative overflow-hidden bg-slate-100 aspect-[4/3]"
      >
        {/* Product Image */}
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <Eye className="w-8 h-8 mb-1 stroke-1" />
            <span className="text-xs">{product.name}</span>
          </div>
        )}

        {/* Badges on Top-Left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {renderBadge()}
        </div>

        {/* Quick View Hover Tag (Desktop) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-rose-600 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Unit */}
        <div className="mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-rose-600">
              {formatIDR(product.price)}
            </span>
            {product.unit && (
              <span className="text-[11px] text-slate-500 font-medium">
                /{product.unit}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatIDR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <button
              onClick={() => onOpenDetail(product)}
              className="w-full py-2 px-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors text-center cursor-pointer"
            >
              Detail
            </button>

            {product.available ? (
              <a
                href={directOrderLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Pesan ${product.name} via WhatsApp`}
                className="w-full py-2 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Pesan</span>
              </a>
            ) : (
              <button
                disabled
                className="w-full py-2 px-2 bg-slate-200 text-slate-400 text-xs font-medium rounded-xl cursor-not-allowed text-center"
              >
                Habis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
