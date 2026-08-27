import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserSession, BusinessRow, CategoryRow, ProductRow, ToastMessage } from './types';
import { authService } from './services/authService';
import { businessService } from './services/businessService';
import { categoryService } from './services/categoryService';
import { productService } from './services/productService';
import { PublicCatalog } from './pages/PublicCatalog';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminOnboarding } from './pages/AdminOnboarding';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminCategories } from './pages/AdminCategories';
import { AdminBusiness } from './pages/AdminBusiness';
import { Toast } from './components/Toast';

type ViewMode = 'public' | 'login' | 'register' | 'onboarding' | 'admin';
type AdminTab = 'dashboard' | 'products' | 'categories' | 'business';

export default function App() {
  // Navigation & View States
  const [view, setView] = useState<ViewMode>('public');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Business & Catalog Data State
  const [business, setBusiness] = useState<BusinessRow | null>(null);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Parse URL Parameters on mount (e.g. ?katalog=slug or ?view=admin)
  const getUrlSlug = (): string => {
    const params = new URLSearchParams(window.location.search);
    return params.get('katalog') || params.get('slug') || '';
  };

  // Load Data function (multi-tenant aware)
  const loadBusinessData = useCallback(async (slugOrUserBiz?: string) => {
    setIsLoadingData(true);
    try {
      let biz: BusinessRow | null = null;

      // 1. If in admin mode and user logged in, prioritize owner's business
      if (currentUser && view === 'admin') {
        const { data } = await businessService.getBusinessByOwnerId(currentUser.id);
        biz = data;
      }

      // 2. Otherwise load by slug or default
      if (!biz) {
        const slug = slugOrUserBiz || getUrlSlug();
        if (slug) {
          const { data } = await businessService.getBusinessBySlug(slug);
          biz = data;
        } else {
          const { data } = await businessService.getDefaultBusiness();
          biz = data;
        }
      }

      if (biz) {
        setBusiness(biz);

        // Load Categories & Products for this business
        const [catsRes, prodsRes] = await Promise.all([
          categoryService.getCategoriesByBusinessId(biz.id),
          productService.getProductsByBusinessId(biz.id),
        ]);

        setCategories(catsRes.data);
        setProducts(prodsRes.data);

        // Inject dynamic theme colors to root
        const root = document.documentElement;
        if (biz.primary_color) {
          root.style.setProperty('--color-primary', biz.primary_color);
        }
        if (biz.secondary_color) {
          root.style.setProperty('--color-secondary', biz.secondary_color);
        }
        if (biz.accent_color) {
          root.style.setProperty('--color-accent', biz.accent_color);
        }
      } else {
        setBusiness(null);
      }
    } catch (err: any) {
      console.error('Error loading business data:', err);
      showToast('Gagal memuat data katalog', 'error');
    } finally {
      setIsLoadingData(false);
    }
  }, [currentUser, view, showToast]);

  // Initial Auth Check
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);

        // Check if URL specified admin view
        const params = new URLSearchParams(window.location.search);
        const urlView = params.get('view');
        if (urlView === 'admin') {
          if (user) {
            setView('admin');
          } else {
            setView('login');
          }
        } else if (urlView === 'login') {
          setView('login');
        } else if (urlView === 'register') {
          setView('register');
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setIsAuthChecking(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const { unsubscribe } = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Admin Route Protection
  useEffect(() => {
    if (!isAuthChecking) {
      if ((view === 'admin' || view === 'onboarding') && !currentUser) {
        setView('login');
      }
    }
  }, [view, currentUser, isAuthChecking]);

  // Reload data when view or currentUser changes
  useEffect(() => {
    if (!isAuthChecking) {
      loadBusinessData();
    }
  }, [view, currentUser, isAuthChecking, loadBusinessData]);

  // Handle successful login
  const handleAuthSuccess = async (user: UserSession) => {
    setCurrentUser(user);
    // Check if user has an existing business
    const { data: userBiz } = await businessService.getBusinessByOwnerId(user.id);
    if (!userBiz) {
      // Direct new owner to 30-second onboarding
      setView('onboarding');
    } else {
      setBusiness(userBiz);
      setView('admin');
      setAdminTab('dashboard');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setView('public');
    showToast('Berhasil keluar dari panel admin', 'info');
  };

  // Quick Availability Toggle from Dashboard
  const handleToggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await productService.updateProduct(productId, {
        available: !currentStatus,
      });
      if (error) {
        showToast('Gagal mengubah ketersediaan produk', 'error');
      } else {
        showToast(`Status produk diubah menjadi ${!currentStatus ? 'Tersedia' : 'Habis'}`, 'success');
        await loadBusinessData();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs text-slate-400 font-medium">Menyiapkan Web Katalog UMKM...</span>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* VIEW: LOGIN */}
      {view === 'login' && (
        <Login
          onSuccess={handleAuthSuccess}
          onNavigateToRegister={() => setView('register')}
          onNavigateToPublic={() => setView('public')}
          onShowToast={showToast}
        />
      )}

      {/* VIEW: REGISTER */}
      {view === 'register' && (
        <Register
          onSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setView('login')}
          onNavigateToPublic={() => setView('public')}
          onShowToast={showToast}
        />
      )}

      {/* VIEW: ONBOARDING FOR NEW OWNERS */}
      {view === 'onboarding' && currentUser && (
        <AdminOnboarding
          user={currentUser}
          onComplete={async () => {
            await loadBusinessData();
            setView('admin');
            setAdminTab('dashboard');
          }}
          onShowToast={showToast}
        />
      )}

      {/* VIEW: ADMIN PANEL */}
      {view === 'admin' && (
        <AdminLayout
          currentTab={adminTab}
          onNavigate={(tab) => setAdminTab(tab)}
          onLogout={handleLogout}
          business={business}
          user={currentUser}
          onOpenPublicCatalog={() => setView('public')}
        >
          {business ? (
            <>
              {adminTab === 'dashboard' && (
                <AdminDashboard
                  business={business}
                  categories={categories}
                  products={products}
                  onNavigate={(tab) => setAdminTab(tab)}
                  onOpenProductModal={() => {
                    setAdminTab('products');
                    setIsProductModalOpen(true);
                  }}
                  onToggleAvailability={handleToggleProductAvailability}
                  onOpenPublicCatalog={() => setView('public')}
                  onShowToast={showToast}
                />
              )}

              {adminTab === 'products' && (
                <AdminProducts
                  business={business}
                  categories={categories}
                  products={products}
                  onRefresh={loadBusinessData}
                  onShowToast={showToast}
                  isModalOpenInitially={isProductModalOpen}
                  onCloseInitialModal={() => setIsProductModalOpen(false)}
                />
              )}

              {adminTab === 'categories' && (
                <AdminCategories
                  business={business}
                  categories={categories}
                  products={products}
                  onRefresh={loadBusinessData}
                  onShowToast={showToast}
                />
              )}

              {adminTab === 'business' && (
                <AdminBusiness
                  business={business}
                  onRefresh={loadBusinessData}
                  onShowToast={showToast}
                />
              )}
            </>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Profil Usaha Belum Ditemukan</h2>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Silakan siapkan profil toko terlebih dahulu.
              </p>
              <button
                onClick={() => setView('onboarding')}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Mulai Setup Usaha
              </button>
            </div>
          )}
        </AdminLayout>
      )}

      {/* VIEW: PUBLIC CATALOG */}
      {view === 'public' && (
        <PublicCatalog
          business={business}
          categories={categories}
          products={products}
          isLoading={isLoadingData}
          onNavigateToAdmin={() => {
            if (currentUser) {
              setView('admin');
            } else {
              setView('login');
            }
          }}
          isAdminLoggedIn={Boolean(currentUser)}
        />
      )}
    </>
  );
}
