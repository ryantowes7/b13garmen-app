-- Add kategori_produk column to produk table

-- Jalankan di Supabase SQL Editor

ALTER TABLE public.produk

ADD COLUMN IF NOT EXISTS kategori_produk TEXT;

-- Add comment

COMMENT ON COLUMN public.produk.kategori_produk IS 'Kategori produk: Garment, Advertising, Jasa, atau Lainnya';

-- Create index for better query performance

CREATE INDEX IF NOT EXISTS idx_produk_kategori ON public.produk(kategori_produk);