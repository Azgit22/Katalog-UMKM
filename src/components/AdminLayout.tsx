import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Store,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { BusinessRow, UserSession } from '../types';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'products' | 'categories' | 'business';
  onNavigate: (tab: 'dashboard' | 'products' | 'categories' | 'business') => void;
  onLogout: () => void;
  business: BusinessRow | null;
  user: UserSession | null;
  onOpenPublicCatalog: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigate,
  onLogout,
  business,
  user,
  onOpenPublicCatalog,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Ringkasan & statistik',
    },
    {
      id: 'products',
      label: 'Kelola Produk',
      icon: Package,
      desc: 'Tambah, edit & harga',
    },
    {
      id: 'categories',
      label: 'Kategori Menu',
      icon: FolderTree,
      desc: 'Kelompok produk',
    },
    {
      id: 'business',
      label: 'Profil & Tampilan',
      icon: Store,
      desc: 'WhatsApp, logo & warna',
    },
  ] as const;

  const handleNavClick = (tab: 'dashboard' | 'products' | 'categories' | 'business') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 antialiased font-sans">
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-white shadow-md text-lg">
              {business?.name ? business.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-sm text-white truncate leading-tight">
                {business?.name || 'Admin Panel UMKM'}
              </h2>
              <span className="text-[11px] text-slate-400 font-medium block truncate">
                /{business?.slug || 'katalog'}
              </span>
            </div>
          </div>

          {/* Quick Button to Public Catalog */}
          <button
            onClick={onOpenPublicCatalog}
            className="mt-3.5 w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 cursor-pointer"
          >
            <span>Lihat Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5 flex-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="px-3 py-2 flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.fullName || user?.email || 'Pemilik Usaha'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE TOPBAR */}
      {/* ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 px-4 h-14 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
            {business?.name ? business.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="font-bold text-sm truncate text-white">
            {business?.name || 'Admin Panel'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPublicCatalog}
            aria-label="Lihat Website Publik"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-xs">Katalog</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Buka Menu Admin"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Menu Navigasi Admin</h3>
                <p className="text-xs text-slate-400">{business?.name}</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-200 bg-slate-800/60 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left flex-1">
                      <div>{item.label}</div>
                      <div className="text-[11px] opacity-70 font-normal">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={onOpenPublicCatalog}
                className="flex-1 py-3 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Katalog</span>
              </button>

              <button
                onClick={onLogout}
                className="py-3 px-4 bg-rose-950/80 text-rose-300 hover:bg-rose-900 text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
