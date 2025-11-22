// lib/helpers.js - Helper functions

/**
 * Format angka menjadi format Rupiah
 * @param {number} amount - Jumlah yang akan diformat
 * @returns {string} - String dalam format Rupiah
 */
export function formatRupiah(amount) {
  if (!amount && amount !== 0) return 'Rp 0';
  
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - String tanggal terformat
 */
export function formatTanggal(date) {
  if (!date) return '-';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Format tanggal ke format singkat (DD/MM/YYYY)
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - String tanggal terformat
 */
export function formatTanggalSingkat(date) {
  if (!date) return '-';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Cek apakah deadline sudah lewat
 * @param {string|Date} deadline - Tanggal deadline
 * @returns {boolean} - True jika deadline sudah lewat
 */
export function isDeadlinePassed(deadline) {
  if (!deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  return deadlineDate < today;
}

/**
 * Ekstrak inisial dari string
 */
export function extractInitials(value) {
  const parts = value.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1) {
    return (parts[0][0] + parts[0][parts[0].length - 1]).toUpperCase();
  }
  return '--';
}

/**
 * Ekstrak dua huruf pertama
 */
export function extractTwoFirst(value) {
  const parts = value.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  } else if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return '--';
}