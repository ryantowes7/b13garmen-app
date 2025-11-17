// app/page.js
// Ini adalah Server Component, kita bisa fetch data langsung di sini.
import { supabase } from '@/lib/supabaseClient';
import { formatRupiah } from '@/lib/helpers';
import StatCard from '../components/StatCard';

// Impor ikon untuk kartu statistik
// Anda perlu: npm install react-icons
import { 
  LuDollarSign, 
  LuTrendingUp, 
  LuTrendingDown, 
  LuShoppingCart 
} from 'react-icons/lu';

/**
 * Fungsi untuk mengambil data total dari Supabase.
 * Kita menggunakan Promise.all untuk mengambil semua data secara paralel.
 */
async function getDashboardData() {
  // 1. Ambil total Pemasukan (dari tabel 'neraca' tipe 'masuk')
  const { data: pemasukanData, error: pemasukanError } = await supabase
    .from('neraca')
    .select('jumlah')
    .eq('tipe', 'masuk');

  // 2. Ambil total Pengeluaran (dari tabel 'neraca' tipe 'keluar')
  const { data: pengeluaranData, error: pengeluaranError } = await supabase
    .from('neraca')
    .select('jumlah')
    .eq('tipe', 'keluar');

  // 3. Ambil total Orderan (hitung jumlah baris di tabel 'orderan')
  // 'id' adalah placeholder, kita hanya butuh 'count'
  const { count: totalOrderan, error: orderanError } = await supabase
    .from('orderan')
    .select('id', { count: 'exact', head: true }); // head: true agar lebih cepat

  // Handle error jika ada
  if (pemasukanError) console.error("Error fetching pemasukan:", pemasukanError.message);
  if (pengeluaranError) console.error("Error fetching pengeluaran:", pengeluaranError.message);
  if (orderanError) console.error("Error fetching orderan:", orderanError.message);

  // Hitung total
  const totalPemasukan = pemasukanData 
    ? pemasukanData.reduce((acc, item) => acc + item.jumlah, 0) 
    : 0;
    
  const totalPengeluaran = pengeluaranData 
    ? pengeluaranData.reduce((acc, item) => acc + item.jumlah, 0) 
    : 0;

  const totalKeuntungan = totalPemasukan - totalPengeluaran;

  return {
    totalPemasukan,
    totalPengeluaran,
    totalKeuntungan,
    totalOrderan: totalOrderan || 0, // 'count' bisa null jika tabel kosong
  };
}


// Komponen Halaman Dashboard
export default async function DashboardPage() {
  // Panggil fungsi untuk mengambil data
  const { 
    totalPemasukan, 
    totalPengeluaran, 
    totalKeuntungan, 
    totalOrderan 
  } = await getDashboardData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Grid untuk kartu statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <StatCard 
          title="Total Pemasukan"
          value={formatRupiah(totalPemasukan)}
          icon={LuTrendingUp}
          colorClass="bg-green-100 text-green-700"
        />

        <StatCard 
          title="Total Pengeluaran"
          value={formatRupiah(totalPengeluaran)}
          icon={LuTrendingDown}
          colorClass="bg-red-100 text-red-700"
        />

        <StatCard 
          title="Total Keuntungan"
          value={formatRupiah(totalKeuntungan)}
          icon={LuDollarSign}
          colorClass="bg-sky-100 text-sky-700"
        />

        <StatCard 
          title="Total Orderan"
          value={totalOrderan.toString()} // Ubah angka jadi string
          icon={LuShoppingCart}
          colorClass="bg-indigo-100 text-indigo-700"
        />

      </div>

      {/* Area untuk konten dashboard lainnya nanti */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md min-h-[300px]">
          <h2 className="text-xl font-semibold mb-4">Grafik Penjualan (Contoh)</h2>
          <div className="flex items-center justify-center h-full text-gray-400">
            {/* Nanti bisa diisi dengan chart/grafik */}
            <p>Grafik akan muncul di sini</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
          <h2 className="text-xl font-semibold mb-4">Orderan Terbaru (Contoh)</h2>
          <div className="flex items-center justify-center h-full text-gray-400">
            {/* Nanti bisa diisi dengan daftar orderan */}
            <p>Orderan terbaru akan muncul di sini</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Opsi revalidasi data (opsional tapi bagus)
// Ini akan membuat Next.js mengambil ulang data dari Supabase
// setiap 60 detik di background (Incremental Static Regeneration)
// Atau Anda bisa hapus ini agar data diambil setiap kali user request (Server-Side Rendering)
export const revalidate = 60; // Revalidasi setiap 60 detik