-- =====================================================================
-- SUPABASE SCHEMA: Web Katalog UMKM Multi-Tenant + Hardened RLS Security
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Table: Businesses (Toko/Usaha)
-- ONE AUTH USER = ONE BUSINESS (Enforced via UNIQUE constraint on owner_id)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
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
  price BIGINT NOT NULL CHECK (price >= 0),
  original_price BIGINT CHECK (original_price IS NULL OR original_price >= 0),
  image_url TEXT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  badge TEXT,
  unit TEXT DEFAULT 'porsi',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Performance Indexes
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
-- Public Read: Anyone can read business profiles for the public catalog
DROP POLICY IF EXISTS "Public read access for businesses" ON businesses;
CREATE POLICY "Public read access for businesses" 
ON businesses FOR SELECT 
USING (true);

-- Owner Insert: Users can only create a business where owner_id matches their auth UID
DROP POLICY IF EXISTS "Owners can insert their own business" ON businesses;
CREATE POLICY "Owners can insert their own business" 
ON businesses FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Owner Update: Users can only update their own business profile
DROP POLICY IF EXISTS "Owners can update their own business" ON businesses;
CREATE POLICY "Owners can update their own business" 
ON businesses FOR UPDATE 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Owner Delete: Users can only delete their own business
DROP POLICY IF EXISTS "Owners can delete their own business" ON businesses;
CREATE POLICY "Owners can delete their own business" 
ON businesses FOR DELETE 
USING (auth.uid() = owner_id);

-- ---------------------------------------------------------------------
-- POLICIES FOR 'categories'
-- ---------------------------------------------------------------------
-- Public Read: Anyone can read categories on the public catalog
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
CREATE POLICY "Public read access for categories" 
ON categories FOR SELECT 
USING (true);

-- Owner Insert: Only the business owner can insert categories for their business
DROP POLICY IF EXISTS "Owners can insert categories" ON categories;
CREATE POLICY "Owners can insert categories" 
ON categories FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = categories.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- Owner Update: Only the business owner can update their categories
DROP POLICY IF EXISTS "Owners can update categories" ON categories;
CREATE POLICY "Owners can update categories" 
ON categories FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = categories.business_id 
    AND businesses.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = categories.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- Owner Delete: Only the business owner can delete their categories
DROP POLICY IF EXISTS "Owners can delete categories" ON categories;
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
-- Public Read: Anyone can view products in the public catalog
DROP POLICY IF EXISTS "Public read access for products" ON products;
CREATE POLICY "Public read access for products" 
ON products FOR SELECT 
USING (true);

-- Owner Insert: Only the business owner can insert products for their business,
-- AND if category_id is specified, it must belong to the exact same business
DROP POLICY IF EXISTS "Owners can insert products" ON products;
CREATE POLICY "Owners can insert products" 
ON products FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = products.business_id 
    AND businesses.owner_id = auth.uid()
  )
  AND (
    products.category_id IS NULL OR EXISTS (
      SELECT 1 FROM categories 
      WHERE categories.id = products.category_id 
      AND categories.business_id = products.business_id
    )
  )
);

-- Owner Update: Only the business owner can update their products,
-- AND if category_id is changed, it must belong to the same business
DROP POLICY IF EXISTS "Owners can update products" ON products;
CREATE POLICY "Owners can update products" 
ON products FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = products.business_id 
    AND businesses.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = products.business_id 
    AND businesses.owner_id = auth.uid()
  )
  AND (
    products.category_id IS NULL OR EXISTS (
      SELECT 1 FROM categories 
      WHERE categories.id = products.category_id 
      AND categories.business_id = products.business_id
    )
  )
);

-- Owner Delete: Only the business owner can delete their products
DROP POLICY IF EXISTS "Owners can delete products" ON products;
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
-- STORAGE BUCKET: product-images & STORAGE RLS POLICIES
-- =====================================================================
-- Insert bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  3145728, -- 3MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 3145728,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- 1. Storage Public Read Policy
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 2. Storage Authenticated Owner Upload Policy
-- Validates folder name matches user's owned business ID
DROP POLICY IF EXISTS "Business owners can upload product images" ON storage.objects;
CREATE POLICY "Business owners can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM businesses WHERE owner_id = auth.uid()
  )
);

-- 3. Storage Authenticated Owner Update Policy
DROP POLICY IF EXISTS "Business owners can update product images" ON storage.objects;
CREATE POLICY "Business owners can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM businesses WHERE owner_id = auth.uid()
  )
);

-- 4. Storage Authenticated Owner Delete Policy
DROP POLICY IF EXISTS "Business owners can delete product images" ON storage.objects;
CREATE POLICY "Business owners can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM businesses WHERE owner_id = auth.uid()
  )
);

