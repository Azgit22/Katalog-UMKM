import React from 'react';
import { Heart, MessageCircle, Instagram, MapPin } from 'lucide-react';
import { BusinessConfig } from '../types';
import { createWhatsAppGeneralLink } from '../utils/formatters';

interface FooterProps {
  business: BusinessConfig;
}

export const Footer: React.FC<FooterProps> = ({ business }) => {
  const currentYear = new Date().getFullYear();
  const waUrl = createWhatsAppGeneralLink(business.whatsappNumber, business.whatsappDefaultMessage);

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs sm:text-sm pt-12 pb-24 sm:pb-12 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Col 1: Business Identity */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
              {business.name}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {business.description}
            </p>
            <p className="text-xs text-rose-400 font-medium">
              "{business.tagline}"
            </p>
          </div>

          {/* Col 2: Alamat & Jam Buka */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm">Lokasi & Operasional</h4>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>{business.address}</span>
            </div>
            <p className="text-xs text-slate-400 pl-6">
              🕒 {business.openingHours}
            </p>
          </div>

          {/* Col 3: Hubungi Kami */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">Kontak & Media Sosial</h4>
            <div className="flex flex-col gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                <span>WhatsApp: +{business.whatsappNumber}</span>
              </a>

              {business.instagram && (
                <a
                  href={business.instagramUrl || `https://instagram.com/${business.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-pink-400 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>Instagram: {business.instagram}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Template Info */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>
            &copy; {currentYear} <strong>{business.name}</strong>. Seluruh hak cipta dilindungi.
          </p>
          <p className="flex items-center justify-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk kemajuan UMKM Indonesia</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
