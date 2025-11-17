import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar'; // Impor Sidebar

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'B13 Garment App',
  description: 'Aplikasi manajemen untuk B13 Garment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-100`}>
        <div className="flex min-h-screen">
          <Sidebar /> {/* Tambahkan Sidebar di sini */}
          
          {/* Konten Utama */}
          <main className="flex-1 lg:pl-64">
            {/* Padding atas untuk memberi ruang dari tombol menu mobile */}
            <div className="pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}