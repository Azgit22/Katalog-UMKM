import React from 'react';
import { MapPin, Clock, MessageCircle, Instagram, ExternalLink, Sparkles, Phone } from 'lucide-react';
import { BusinessConfig } from '../types';
import { createWhatsAppGeneralLink } from '../utils/formatters';

interface AboutSectionProps {
  business: BusinessConfig;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ business }) => {
  const waLink = createWhatsAppGeneralLink(business.whatsappNumber, business.whatsappDefaultMessage);

  return (
    <section id="tentang-kami" className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kenali Kami Lebih Dekat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tentang {business.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {business.description}
          </p>
        </div>

        {/* Info Grid Cards */}
        <div id="lokasi" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: Alamat & Peta */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Alamat Usaha</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {business.address}
                </p>
              </div>
            </div>

            {business.googleMapsUrl && (
              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Card 2: Jam Operasional & Layanan */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Jam Operasional</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {business.openingHours}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  *Pemesanan online melalui WhatsApp dilayani selama jam buka di atas.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-semibold text-emerald-700">
                Menerima Pemesanan Dine-in, Takeaway & Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Social & Contact Bar */}
        <div className="mt-6 bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Punya Pertanyaan atau Ingin Pesan Banyak (Catering)?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Hubungi tim kami langsung via WhatsApp untuk respon cepat.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
            {business.instagramUrl && (
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Kami"
                className="p-3 bg-white hover:bg-slate-50 text-pink-600 rounded-xl border border-slate-200 shadow-xs transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
