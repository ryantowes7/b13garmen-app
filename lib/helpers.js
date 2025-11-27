// lib/helpers.js

/**
 * Format angka menjadi format Rupiah
 * @param {number} angka 
 * @returns {string}
 */
export function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(angka || 0);
}

/**
 * Format tanggal ke format singkat (DD/MM/YYYY)
 * @param {string} tanggal 
 * @returns {string}
 */
export function formatTanggalSingkat(tanggal) {
  if (!tanggal) return '-';
  const date = new Date(tanggal);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format tanggal ke format lengkap
 * @param {string} tanggal 
 * @returns {string}
 */
export function formatTanggalLengkap(tanggal) {
  if (!tanggal) return '-';
  const date = new Date(tanggal);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('id-ID', options);
}

/**
 * Cek apakah deadline sudah lewat
 * @param {string} deadline 
 * @returns {boolean}
 */
export function isDeadlinePassed(deadline) {
  if (!deadline) return false;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  now.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  return deadlineDate < now;
}

/**
 * Generate nomor orderan
 * Format: YYMM + Inisial Nama (2 huruf) + Kode Produk (2 huruf) + Counter (2 digit)
 * @param {string} nama 
 * @param {string} kodeProduk 
 * @param {number} counter 
 * @returns {string}
 */
export function generateNoOrderan(nama, kodeProduk = 'ML', counter = 1) {
  const now = new Date();
  const tahun = String(now.getFullYear()).slice(-2);
  const bulan = String(now.getMonth() + 1).padStart(2, '0');
  
  // Ambil 2 huruf pertama dari nama (atau inisial 2 kata pertama)
  const words = nama.trim().split(' ');
  let initials = '';
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = 'XX';
  }
  
  // Format kode produk 2 huruf
  const kode = kodeProduk.substring(0, 2).toUpperCase().padEnd(2, 'X');
  
  // Format counter 2 digit
  const counterStr = String(counter).padStart(2, '0');
  
  return `${tahun}${bulan}${initials}${kode}${counterStr}`;
}

/**
 * Parse dimensi advertising (contoh: "2x3" menjadi 6, atau "5" menjadi 5)
 * @param {string} dimensi 
 * @returns {number}
 */
export function parseDimensi(dimensi) {
  if (!dimensi) return 1;
  
  if (typeof dimensi === 'string' && dimensi.includes('x')) {
    const parts = dimensi.split('x').map(p => parseFloat(p.trim()));
    return parts.reduce((a, b) => a * b, 1);
  }
  
  return parseFloat(dimensi) || 1;
}