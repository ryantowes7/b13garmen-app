// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'B13 Garment App',
  description: 'Sistem Manajemen untuk B13 Garment Factory',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-100`}>
        <div className="flex min-h-screen">
          <Sidebar />
          
          {/* Konten Utama */}
          <main className="flex-1 lg:pl-64">
            <div className="pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}