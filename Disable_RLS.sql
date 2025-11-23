-- ==============================================
-- DISABLE ROW LEVEL SECURITY untuk Testing
-- Jalankan di Supabase SQL Editor
-- ==============================================

-- Nonaktifkan RLS untuk semua tabel katalog
ALTER TABLE public.bahan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.produk DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.percetakan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jasa DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilihan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.biaya_produksi DISABLE ROW LEVEL SECURITY;

-- Atau jika ingin mengaktifkan RLS dengan policy yang mengizinkan semua:
-- Hapus komentar di bawah ini jika ingin menggunakan RLS dengan policy terbuka

/*
-- Enable RLS
ALTER TABLE public.bahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.percetakan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jasa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilihan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biaya_produksi ENABLE ROW LEVEL SECURITY;

-- Buat policy yang mengizinkan semua operasi (untuk development)
CREATE POLICY "Allow all on bahan" ON public.bahan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on produk" ON public.produk FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on percetakan" ON public.percetakan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on jasa" ON public.jasa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on pilihan" ON public.pilihan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on biaya_produksi" ON public.biaya_produksi FOR ALL USING (true) WITH CHECK (true);
*/