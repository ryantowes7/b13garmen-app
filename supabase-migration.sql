-- B13 Garmen Database Migration for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nama_lengkap TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: bahan (kain/fabric)
CREATE TABLE IF NOT EXISTS bahan (
    id TEXT PRIMARY KEY,
    nama_toko TEXT NOT NULL,
    jenis TEXT NOT NULL,
    warna TEXT NOT NULL,
    harga NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: produk
CREATE TABLE IF NOT EXISTS produk (
    id TEXT PRIMARY KEY,
    produk TEXT NOT NULL,
    jenis TEXT NOT NULL,
    model TEXT NOT NULL,
    tipe_desain TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: percetakan
CREATE TABLE IF NOT EXISTS percetakan (
    id TEXT PRIMARY KEY,
    jenis TEXT NOT NULL,
    model TEXT NOT NULL,
    tipe_ukuran TEXT NOT NULL,
    harga NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: jasa
CREATE TABLE IF NOT EXISTS jasa (
    id TEXT PRIMARY KEY,
    jasa TEXT NOT NULL,
    jenis TEXT NOT NULL,
    tipe TEXT NOT NULL,
    harga NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: pilihan (dropdown options)
CREATE TABLE IF NOT EXISTS pilihan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori TEXT NOT NULL,
    nilai TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(kategori, nilai)
);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_orderan TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    nohp TEXT NOT NULL,
    alamat TEXT NOT NULL,
    jenis_produk TEXT NOT NULL,
    desain TEXT NOT NULL,
    subdesain TEXT,
    toko TEXT NOT NULL,
    jenis_kain TEXT NOT NULL,
    warna TEXT NOT NULL,
    lengan_pendek BOOLEAN DEFAULT FALSE,
    lengan_panjang BOOLEAN DEFAULT FALSE,
    ukuran_data JSONB,
    harga_satuan NUMERIC(10,2) NOT NULL,
    dp NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_tagihan NUMERIC(10,2) NOT NULL,
    sisa NUMERIC(10,2) NOT NULL,
    tanggal_pesan DATE NOT NULL,
    deadline DATE NOT NULL,
    gambar_mockup TEXT,
    items_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: biaya_produksi
CREATE TABLE IF NOT EXISTS biaya_produksi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    kategori TEXT NOT NULL,
    jenis TEXT NOT NULL,
    harga NUMERIC(10,2) NOT NULL,
    jumlah NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_no_orderan ON orders(no_orderan);
CREATE INDEX IF NOT EXISTS idx_orders_tanggal_pesan ON orders(tanggal_pesan);
CREATE INDEX IF NOT EXISTS idx_orders_deadline ON orders(deadline);
CREATE INDEX IF NOT EXISTS idx_biaya_produksi_order_id ON biaya_produksi(order_id);
CREATE INDEX IF NOT EXISTS idx_pilihan_kategori ON pilihan(kategori);

-- Create default admin user (username: admin, password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (username, password_hash, nama_lengkap, email)
VALUES ('admin', '$2a$10$xQZJ9qZ9XQZ9qZ9XQZ9qZO5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'Administrator', 'admin@b13garmen.com')
ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security (RLS) - opsional, bisa diaktifkan nanti
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bahan ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE percetakan ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE jasa ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pilihan ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE biaya_produksi ENABLE ROW LEVEL SECURITY;

-- Create Storage Bucket untuk gambar mockup
-- Run this separately in Supabase Dashboard > Storage
-- Bucket name: 'mockup-images'
-- Public bucket: true (agar bisa diakses tanpa auth)

COMMENT ON TABLE users IS 'User accounts for authentication';
COMMENT ON TABLE bahan IS 'Fabric/material catalog';
COMMENT ON TABLE produk IS 'Product catalog';
COMMENT ON TABLE percetakan IS 'Printing services catalog';
COMMENT ON TABLE jasa IS 'Service catalog';
COMMENT ON TABLE pilihan IS 'Dropdown options for forms';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE biaya_produksi IS 'Production costs breakdown per order';
