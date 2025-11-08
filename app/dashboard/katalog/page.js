'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

/* ============================
   KONFIGURASI — Sesuaikan jika perlu
   ============================ */
const TABLES = {
  produk: 'produk',
  kain: 'kain',
  percetakan: 'percetakan',
  jasa: 'jasa'
};

const PAGE_SIZE = 10;
const STORAGE_BUCKET = 'katalog';

/* ======= Helper CRUD ======= */
async function fetchItems(table, { page = 1, search = '' } = {}) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from(table)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search.trim() !== '') {
    query = query.ilike('nama', `%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return { data: data || [], count: count || 0 };
}

async function uploadImage(file) {
  if (!file) return null;

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { publicURL } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return publicURL;
}

/* ===============================
   PAGE / KOMPONEN UTAMA
   =============================== */
export default function KatalogPage() {
  const [activeTab, setActiveTab] = useState('produk');
  const [lists, setLists] = useState({
    produk: [],
    kain: [],
    percetakan: [],
    jasa: []
  });
  const [counts, setCounts] = useState({
    produk: 0,
    kain: 0,
    percetakan: 0,
    jasa: 0
  });
  const [pages, setPages] = useState({
    produk: 1,
    kain: 1,
    percetakan: 1,
    jasa: 1
  });
  const [searches, setSearches] = useState({
    produk: '',
    kain: '',
    percetakan: '',
    jasa: ''
  });

  const [loading, setLoading] = useState(false);

  /* ========== FORM STATE ========== */
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingItem, setEditingItem] = useState(null);

  const [formValues, setFormValues] = useState({
    nama: '',
    kode: '',
    kategori: '',
    harga: '',
    stok: '',
    deskripsi: '',
    gambar_url: ''
  });

  const [fileToUpload, setFileToUpload] = useState(null);

  /* ========== FETCH ========== */
  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab, pages[activeTab], searches[activeTab]]);

  async function loadTab(tab) {
    const table = TABLES[tab];
    if (!table) return;

    setLoading(true);
    try {
      const { data, count } = await fetchItems(table, {
        page: pages[tab],
        search: searches[tab]
      });

      setLists(prev => ({ ...prev, [tab]: data }));
      setCounts(prev => ({ ...prev, [tab]: count }));
    } catch (err) {
      alert('Gagal mengambil data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ====== Pagination ====== */
  function changePage(tab, newPage) {
    setPages(prev => ({ ...prev, [tab]: newPage }));
  }

  /* ====== Search ====== */
  function handleSearch(tab, value) {
    setSearches(prev => ({ ...prev, [tab]: value }));
    setPages(prev => ({ ...prev, [tab]: 1 }));
  }

  /* ====== CREATE ====== */
  function openCreate(tab) {
    setActiveTab(tab);
    setFormMode('create');
    setEditingItem(null);

    setFormValues({
      nama: '',
      kode: '',
      kategori: tab,
      harga: '',
      stok: '',
      deskripsi: '',
      gambar_url: ''
    });

    setFileToUpload(null);
    setShowForm(true);
  }

  /* ====== EDIT ====== */
  function openEdit(tab, item) {
    setActiveTab(tab);
    setFormMode('edit');
    setEditingItem(item);

    setFormValues({
      nama: item.nama || '',
      kode: item.kode || '',
      kategori: item.kategori || tab,
      harga: item.harga || '',
      stok: item.stok || '',
      deskripsi: item.deskripsi || '',
      gambar_url: item.gambar_url || ''
    });

    setShowForm(true);
  }

  /* ====== DELETE ====== */
  async function handleDelete(tab, item) {
    if (!confirm('Yakin ingin menghapus?')) return;

    try {
      const { error } = await supabase
        .from(TABLES[tab])
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      loadTab(tab);
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  }

  /* ====== SUBMIT ====== */
  async function handleSubmit(e) {
    e.preventDefault();
    const tab = formValues.kategori;
    const table = TABLES[tab];

    try {
      setLoading(true);

      let gambarUrl = formValues.gambar_url;
      if (fileToUpload) {
        gambarUrl = await uploadImage(fileToUpload);
      }

      const payload = {
        nama: formValues.nama,
        kode: formValues.kode,
        kategori: formValues.kategori,
        harga: formValues.harga ? Number(formValues.harga) : null,
        stok: formValues.stok ? Number(formValues.stok) : null,
        deskripsi: formValues.deskripsi,
        gambar_url: gambarUrl
      };

      if (formMode === 'create') {
        const { error } = await supabase.from(table).insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(table)
          .update(payload)
          .eq('id', editingItem.id);

        if (error) throw error;
      }

      setShowForm(false);
      loadTab(tab);
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ====== RENDER ROW ====== */
  function renderRows(tab) {
    return lists[tab].map(item => (
      <tr key={item.id}>
        <td className="p-2 border">{item.id}</td>
        <td className="p-2 border">{item.nama}</td>
        <td className="p-2 border">{item.kode}</td>
        <td className="p-2 border">{item.harga}</td>
        <td className="p-2 border">{item.stok}</td>
        <td className="p-2 border">
          {item.gambar_url ? (
            <img
              src={item.gambar_url}
              alt={item.nama}
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            '-'
          )}
        </td>
        <td className="p-2 border">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
            onClick={() => openEdit(tab, item)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={() => handleDelete(tab, item)}
          >
            Hapus
          </button>
        </td>
      </tr>
    ));
  }

  /* ============================
     UI
     ============================ */
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Katalog</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {Object.keys(TABLES).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded ${
              activeTab === key
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => openCreate(activeTab)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Tambah {activeTab}
        </button>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={`Cari ${activeTab}...`}
            value={searches[activeTab]}
            onChange={e => handleSearch(activeTab, e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <span>Total: {counts[activeTab]}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Kode</th>
              <th className="p-2 border">Harga</th>
              <th className="p-2 border">Stok</th>
              <th className="p-2 border">Gambar</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  Memuat...
                </td>
              </tr>
            ) : lists[activeTab].length > 0 ? (
              renderRows(activeTab)
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">
        <div>
          {pages[activeTab] > 1 && (
            <button
              className="px-3 py-1 bg-gray-200 rounded mr-2"
              onClick={() => changePage(activeTab, pages[activeTab] - 1)}
            >
              Prev
            </button>
          )}
          {pages[activeTab] * PAGE_SIZE < counts[activeTab] && (
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => changePage(activeTab, pages[activeTab] + 1)}
            >
              Next
            </button>
          )}
        </div>
        <div className="text-sm">
          Halaman {pages[activeTab]} dari{' '}
          {Math.max(1, Math.ceil(counts[activeTab] / PAGE_SIZE))}
        </div>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[min(900px,95%)] max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">
              {formMode === 'create' ? 'Tambah' : 'Edit'} {activeTab}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Nama"
                  value={formValues.nama}
                  onChange={e =>
                    setFormValues({ ...formValues, nama: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  placeholder="Kode"
                  value={formValues.kode}
                  onChange={e =>
                    setFormValues({ ...formValues, kode: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  placeholder="Harga"
                  value={formValues.harga}
                  onChange={e =>
                    setFormValues({ ...formValues, harga: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  placeholder="Stok"
                  value={formValues.stok}
                  onChange={e =>
                    setFormValues({ ...formValues, stok: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>

              <textarea
                placeholder="Deskripsi"
                value={formValues.deskripsi}
                onChange={e =>
                  setFormValues({ ...formValues, deskripsi: e.target.value })
                }
                className="w-full p-2 border rounded"
              />

              <div>
                <label className="block mb-1 text-sm">Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFileToUpload(e.target.files?.[0] || null)}
                />

                {formValues.gambar_url && !fileToUpload && (
                  <div className="mt-2">
                    <img
                      src={formValues.gambar_url}
                      className="w-32 h-32 rounded object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {formMode === 'create' ? 'Simpan' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
