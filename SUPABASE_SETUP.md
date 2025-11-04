# Supabase Setup Instructions

## Step 1: Run Database Migration

1. Login to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `b13-garmen`
3. Go to **SQL Editor** (icon database di sidebar kiri)
4. Klik **New Query**
5. Copy semua isi file `supabase-migration.sql` dan paste di SQL Editor
6. Klik **Run** atau tekan `Ctrl+Enter`
7. Tunggu sampai muncul "Success. No rows returned"

## Step 2: Setup Storage Bucket

1. Di Supabase Dashboard, klik **Storage** di sidebar
2. Klik **Create a new bucket**
3. Isi:
   - **Name**: `mockup-images`
   - **Public bucket**: ✅ CENTANG (agar gambar bisa diakses publik)
4. Klik **Create bucket**

## Step 3: Set Storage Policies (Opsional - untuk akses publik)

Jika ingin mengatur policy untuk upload:

1. Klik bucket `mockup-images` yang baru dibuat
2. Klik tab **Policies**
3. Klik **New Policy**
4. Template: **Enable insert for authenticated users only**
5. Atau buat custom policy dengan SQL:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mockup-images');

-- Allow public read access
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'mockup-images');
```

## Step 4: Verify Setup

Untuk memverifikasi database sudah siap:

1. Klik **Table Editor** di sidebar
2. Anda harus melihat tables:
   - users
   - bahan
   - produk
   - percetakan
   - jasa
   - orders
   - biaya_produksi
   - pilihan

3. Klik table `users`, anda harus melihat 1 row user admin

## Default Login Credentials

Setelah migration berhasil, anda bisa login dengan:

- **Username**: `admin`
- **Password**: `admin123`

**PENTING**: Silakan ganti password admin setelah login pertama kali!

## Troubleshooting

### Error: "relation already exists"
Jika table sudah ada, anda bisa:
1. Drop semua tables dulu dengan run SQL:
```sql
DROP TABLE IF EXISTS biaya_produksi CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS pilihan CASCADE;
DROP TABLE IF EXISTS jasa CASCADE;
DROP TABLE IF EXISTS percetakan CASCADE;
DROP TABLE IF EXISTS produk CASCADE;
DROP TABLE IF EXISTS bahan CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```
2. Lalu run migration lagi

### Error: "password authentication failed"
Pastikan DATABASE_URL di `.env` menggunakan password yang benar.

### Storage bucket error
Pastikan bucket name persis: `mockup-images` (lowercase, dengan dash)

---

Setelah setup selesai, aplikasi sudah siap digunakan! 🚀
