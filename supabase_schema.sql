-- =====================================================================
-- SUPABASE SCHEMA: Web Katalog UMKM Multi-Tenant + RLS Security
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Table: Businesses (Toko/Usaha)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  whatsapp_number TEXT NOT NULL,
  whatsapp_default_message TEXT DEFAULT 'Halo, saya ingin pesan...',
  address TEXT DEFAULT '',
  google_maps_url TEXT,
  opening_hours TEXT DEFAULT '09:00 - 21:00 WIB',
  instagram TEXT,
  instagram_url TEXT,
  primary_color TEXT DEFAULT '#E11D48',
  secondary_color TEXT DEFAULT '#F97316',
  accent_color TEXT DEFAULT '#FBBF24',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Table: Categories (Kategori Menu)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Table: Products (Produk / Menu)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price BIGINT NOT NULL,
  original_price BIGINT,
  image_url TEXT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  badge TEXT,
  unit TEXT DEFAULT 'porsi',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for Fast Queries
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_categories_business_id ON categories(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business_id ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- POLICIES FOR 'businesses'
-- ---------------------------------------------------------------------
-- Public Read: Siapapun dapat membaca profil bisnis untuk katalog publik
CREATE POLICY "Public read access for businesses" 
ON businesses FOR SELECT 
USING (true);

-- Owner Insert: Pemilik hanya bisa insert profil usaha mereka sendiri
CREATE POLICY "Owners can insert their own business" 
ON businesses FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Owner Update: Pemilik hanya bisa update usaha milik mereka
CREATE POLICY "Owners can update their own business" 
ON businesses FOR UPDATE 
USING (auth.uid() = owner_id);

-- Owner Delete: Pemilik hanya bisa hapus usaha mereka
CREATE POLICY "Owners can delete their own business" 
ON businesses FOR DELETE 
USING (auth.uid() = owner_id);

-- ---------------------------------------------------------------------
-- POLICIES FOR 'categories'
-- ---------------------------------------------------------------------
-- Public Read: Siapapun dapat melihat kategori di katalog publik
CREATE POLICY "Public read access for categories" 
ON categories FOR SELECT 
USING (true);

-- Owner Insert: Hanya pemilik usaha yang bisa menambahkan kategori
CREATE POLICY "Owners can insert categories" 
ON categories FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = categories.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- Owner Update: Hanya pemilik usaha yang bisa mengubah kategori
CREATE POLICY "Owners can update categories" 
ON categories FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = categories.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- Owner Delete: Hanya pemilik usaha yang bisa menghapus kategori
CREATE POLICY "Owners can delete categories" 
ON categories FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = categories.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- ---------------------------------------------------------------------
-- POLICIES FOR 'products'
-- ---------------------------------------------------------------------
-- Public Read: Siapapun dapat melihat daftar produk di katalog publik
CREATE POLICY "Public read access for products" 
ON products FOR SELECT 
USING (true);

-- Owner Insert: Hanya pemilik usaha yang bisa menambahkan produk
CREATE POLICY "Owners can insert products" 
ON products FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = products.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- Owner Update: Hanya pemilik usaha yang bisa mengubah produk & stok
CREATE POLICY "Owners can update products" 
ON products FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = products.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- Owner Delete: Hanya pemilik usaha yang bisa menghapus produk
CREATE POLICY "Owners can delete products" 
ON products FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = products.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- =====================================================================
-- STORAGE BUCKET: product-images
-- =====================================================================
-- Jalankan di tab Storage Supabase:
-- 1. Buat bucket baru bernama 'product-images' (Set public = true)
-- 2. Tambahkan policy upload:
--    Allow authenticated users to INSERT objects into bucket 'product-images'
-- =====================================================================
