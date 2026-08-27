import React, { useState } from 'react';
import { MessageCircle, Menu, X, Clock, MapPin } from 'lucide-react';
import { BusinessConfig } from '../types';
import { createWhatsAppGeneralLink } from '../utils/formatters';

interface HeaderProps {
  business: BusinessConfig;
}

export const Header: React.FC<HeaderProps> = ({ business }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const waLink = createWhatsAppGeneralLink(business.whatsappNumber, business.whatsappDefaultMessage);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          {business.logo ? (
            <img 
              src={business.logo} 
              alt={`Logo ${business.name}`} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:scale-105 transition-transform"
              onError={(e) => {
                // Fallback jika logo URL gagal dimuat
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight block leading-tight group-hover:text-rose-600 transition-colors">
              {business.name}
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              {business.tagline}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => scrollToSection('katalog')} 
            className="hover:text-rose-600 transition-colors cursor-pointer py-1"
          >
            Daftar Menu
          </button>
          <button 
            onClick={() => scrollToSection('tentang-kami')} 
            className="hover:text-rose-600 transition-colors cursor-pointer py-1"
          >
            Tentang Kami
          </button>
          <button 
            onClick={() => scrollToSection('lokasi')} 
            className="hover:text-rose-600 transition-colors cursor-pointer py-1"
          >
            Lokasi & Jam Buka
          </button>
        </nav>

        {/* Action Header Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat WhatsApp</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Buka menu navigasi"
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 font-medium text-slate-700">
            <button
              onClick={() => scrollToSection('katalog')}
              className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 hover:text-rose-600 active:bg-slate-100 transition-colors"
            >
              📖 Lihat Daftar Menu
            </button>
            <button
              onClick={() => scrollToSection('tentang-kami')}
              className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 hover:text-rose-600 active:bg-slate-100 transition-colors"
            >
              🏪 Tentang Usaha
            </button>
            <button
              onClick={() => scrollToSection('lokasi')}
              className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 hover:text-rose-600 active:bg-slate-100 transition-colors"
            >
              📍 Lokasi & Jam Operasional
            </button>

            <div className="pt-2 border-t border-slate-100">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Hubungi via WhatsApp
              </a>
            </div>

            <div className="text-xs text-slate-500 pt-1 px-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{business.openingHours}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
