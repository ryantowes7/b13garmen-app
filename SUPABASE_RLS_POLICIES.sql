-- ============================================
-- SUPABASE RLS POLICIES FIX
-- Jalankan script ini di Supabase SQL Editor
-- ============================================

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE percetakan ENABLE ROW LEVEL SECURITY;
ALTER TABLE jasa ENABLE ROW LEVEL SECURITY;
ALTER TABLE biaya_produksi ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users full access to orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users full access to bahan" ON bahan;
DROP POLICY IF EXISTS "Allow authenticated users full access to produk" ON produk;
DROP POLICY IF EXISTS "Allow authenticated users full access to percetakan" ON percetakan;
DROP POLICY IF EXISTS "Allow authenticated users full access to jasa" ON jasa;
DROP POLICY IF EXISTS "Allow authenticated users full access to biaya_produksi" ON biaya_produksi;

-- ============================================
-- ORDERS TABLE POLICIES
-- ============================================
CREATE POLICY "Allow authenticated users full access to orders"
ON orders
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- BAHAN (FABRIC) TABLE POLICIES
-- ============================================
CREATE POLICY "Allow authenticated users full access to bahan"
ON bahan
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- PRODUK TABLE POLICIES
-- ============================================
CREATE POLICY "Allow authenticated users full access to produk"
ON produk
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- PERCETAKAN (PRINTING) TABLE POLICIES
-- ============================================
CREATE POLICY "Allow authenticated users full access to percetakan"
ON percetakan
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- JASA (SERVICES) TABLE POLICIES
-- ============================================
CREATE POLICY "Allow authenticated users full access to jasa"
ON jasa
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- BIAYA_PRODUKSI TABLE POLICIES
-- ============================================
CREATE POLICY "Allow authenticated users full access to biaya_produksi"
ON biaya_produksi
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify the policies are applied
-- ============================================

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'bahan', 'produk', 'percetakan', 'jasa', 'biaya_produksi');

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('orders', 'bahan', 'produk', 'percetakan', 'jasa', 'biaya_produksi');