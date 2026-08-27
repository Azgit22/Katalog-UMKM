import { BusinessRow, CategoryRow, ProductRow, UserSession } from '../types';
import { businessConfig } from '../config/businessConfig';

const STORAGE_KEYS = {
  BUSINESSES: 'umkm_mock_businesses_v1',
  CATEGORIES: 'umkm_mock_categories_v1',
  PRODUCTS: 'umkm_mock_products_v1',
  SESSION: 'umkm_mock_session_v1',
};

// Seed default data dari businessConfig.ts jika belum ada
export function initializeMockData(): void {
  if (typeof window === 'undefined') return;

  const existingBusinesses = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
  if (!existingBusinesses) {
    const defaultBusiness: BusinessRow = {
      id: 'biz-default-001',
      owner_id: 'user-demo-001',
      slug: 'kedai-nusantara',
      name: businessConfig.business.name,
      tagline: businessConfig.business.tagline,
      description: businessConfig.business.description,
      logo_url: businessConfig.business.logo,
      hero_image_url: businessConfig.business.heroImage,
      whatsapp_number: businessConfig.business.whatsappNumber,
      whatsapp_default_message: businessConfig.business.whatsappDefaultMessage,
      address: businessConfig.business.address,
      google_maps_url: businessConfig.business.googleMapsUrl || null,
      opening_hours: businessConfig.business.openingHours,
      instagram: businessConfig.business.instagram || null,
      instagram_url: businessConfig.business.instagramUrl || null,
      primary_color: businessConfig.theme.primary,
      secondary_color: businessConfig.theme.secondary,
      accent_color: businessConfig.theme.accent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify([defaultBusiness]));

    const defaultCategories: CategoryRow[] = businessConfig.categories
      .filter((c) => c.id !== 'semua')
      .map((c, i) => ({
        id: `cat-${i + 1}`,
        business_id: 'biz-default-001',
        name: c.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));

    const categoryMap: Record<string, string> = {
      makanan: defaultCategories.find((c) => c.name.toLowerCase().includes('makanan'))?.id || defaultCategories[0]?.id || 'cat-1',
      'paket-hemat': defaultCategories.find((c) => c.name.toLowerCase().includes('paket'))?.id || defaultCategories[1]?.id || 'cat-2',
      minuman: defaultCategories.find((c) => c.name.toLowerCase().includes('minuman'))?.id || defaultCategories[2]?.id || 'cat-3',
      snack: defaultCategories.find((c) => c.name.toLowerCase().includes('camilan'))?.id || defaultCategories[3]?.id || 'cat-4',
    };

    const defaultProducts: ProductRow[] = businessConfig.products.map((p, i) => ({
      id: `prod-${i + 1}`,
      business_id: 'biz-default-001',
      category_id: categoryMap[p.category] || null,
      name: p.name,
      description: p.description,
      price: p.price,
      original_price: p.originalPrice || null,
      image_url: p.image,
      available: p.available,
      badge: p.badge || null,
      unit: p.unit || 'porsi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }
}

export const mockStorage = {
  getSession(): UserSession | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  },
  setSession(session: UserSession | null): void {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },
  getBusinesses(): BusinessRow[] {
    initializeMockData();
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return raw ? JSON.parse(raw) : [];
  },
  saveBusinesses(list: BusinessRow[]): void {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(list));
  },
  getCategories(): CategoryRow[] {
    initializeMockData();
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : [];
  },
  saveCategories(list: CategoryRow[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
  },
  getProducts(): ProductRow[] {
    initializeMockData();
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  },
  saveProducts(list: ProductRow[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
  },
};
