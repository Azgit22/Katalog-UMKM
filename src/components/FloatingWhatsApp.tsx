import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createWhatsAppGeneralLink } from '../utils/formatters';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  defaultMessage: string;
  businessName: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappNumber,
  defaultMessage,
  businessName,
}) => {
  const waUrl = createWhatsAppGeneralLink(whatsappNumber, defaultMessage);

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center group">
      {/* Tooltip on desktop */}
      <span className="hidden sm:inline-block mr-2 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat {businessName}
      </span>

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami melalui WhatsApp"
        className="relative flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-xl shadow-emerald-950/20 border-2 border-white transition-all duration-200"
      >
        {/* Radar Ping Animation */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>

        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="tracking-tight">Pesan Sekarang</span>
      </a>
    </div>
  );
};
