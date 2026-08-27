import React from 'react';
import { UtensilsCrossed, MessageCircle, Sparkles, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';
import { BusinessConfig } from '../types';
import { createWhatsAppGeneralLink } from '../utils/formatters';

interface HeroProps {
  business: BusinessConfig;
}

export const Hero: React.FC<HeroProps> = ({ business }) => {
  const waLink = createWhatsAppGeneralLink(business.whatsappNumber, business.whatsappDefaultMessage);

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById('katalog');
    if (catalogElement) {
      const yOffset = -70;
      const y = catalogElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={business.heroImage}
          alt={`Banner ${business.name}`}
          className="w-full h-full object-cover object-center opacity-35 scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-16 text-center">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-slate-200 mb-4 animate-in fade-in duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{business.openingHours}</span>
        </div>

        {/* Business Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-3">
          {business.name}
        </h1>
        <p className="text-lg sm:text-xl font-medium text-rose-300 mb-4 max-w-2xl mx-auto">
          "{business.tagline}"
        </p>

        {/* Short Description */}
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
          {business.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            onClick={scrollToCatalog}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-rose-950/40 transition-all duration-200 cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Lihat Daftar Menu</span>
          </button>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Pesan via WhatsApp</span>
          </a>
        </div>

        {/* Key Business Features Cards */}
        {business.features && business.features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-10 pt-8 border-t border-white/10 text-left">
            {business.features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-3.5 sm:p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 shrink-0">
                    {idx === 0 && <ShieldCheck className="w-4 h-4" />}
                    {idx === 1 && <Zap className="w-4 h-4" />}
                    {idx === 2 && <HeartHandshake className="w-4 h-4" />}
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-semibold text-white leading-tight">
                      {feature.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
