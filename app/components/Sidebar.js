// components/Sidebar.js
'use client'; // Ini adalah Client Component karena menggunakan state dan Link

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
// Anda perlu menginstal react-icons: npm install react-icons
import { 
  LuLayoutDashboard, 
  LuPackage, 
  LuShoppingCart, 
  LuBook, 
  LuMenu, 
  LuX 
} from 'react-icons/lu';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LuLayoutDashboard },
  { name: 'Katalog', href: '/katalog', icon: LuPackage },
  { name: 'Orderan', href: '/orderan', icon: LuShoppingCart },
  { name: 'Neraca', href: '/neraca', icon: LuBook },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseLinkClasses = "flex items-center p-3 rounded-lg transition-colors";
  const inactiveLinkClasses = "text-gray-700 hover:bg-sky-100 hover:text-sky-700";
  const activeLinkClasses = "bg-sky-600 text-white shadow-md";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white shadow-lg lg:shadow-none lg:bg-transparent">
      {/* Logo */}
      <div className="px-6 py-5 border-b">
        <h1 className="text-3xl font-bold text-sky-600">B13Garment</h1>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
              <Icon size={22} className="mr-3" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* --- Sidebar untuk Desktop --- */}
      <aside className="hidden lg:flex lg:flex-col w-64 fixed inset-y-0 z-10 bg-white shadow-md">
        <SidebarContent />
      </aside>

      {/* --- Tombol Menu Mobile --- */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-full shadow-lg text-sky-600"
        aria-label="Buka menu"
      >
        {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
      </button>

      {/* --- Sidebar untuk Mobile (Overlay) --- */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-20" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
        }
      >
        <SidebarContent />
      </aside>
    </>
  );
}