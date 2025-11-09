'use client';

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Konfigurasi tab & field sesuai database kamu (UUID scan otomatis)!
const tabs = [
  {
    key: "produk",
    label: "Produk",
    columns: [
      { key: "produk", label: "Produk", required: true },
      { key: "jenis", label: "Jenis", required: true },
      { key: "model", label: "Model", required: true },
      { key: "tipe_desain", label: "Tipe/Desain", required: false }
    ]
  },
  {
    key: "bahan",
    label: "Bahan",
    columns: [
      { key: "nama_toko", label: "Nama Toko", required: true },
      { key: "jenis", label: "Jenis", required: true },
      { key: "warna", label: "Warna", required: false },
      { key: "harga", label: "Harga", required: true, type: "number" }
    ]
  },
  {
    key: "percetakan",
    label: "Percetakan",
    columns: [
      { key: "jenis", label: "Jenis", required: true },
      { key: "model", label: "Model", required: true },
      { key: "tipe_ukuran", label: "Tipe Ukuran", required: false },
      { key: "harga", label: "Harga", required: true, type: "number" }
    ]
  },
  {
    key: "jasa",
    label: "Jasa",
    columns: [
      { key: "jasa", label: "Jasa", required: true },
      { key: "jenis", label: "Jenis", required: true },
      { key: "tipe", label: "Tipe", required: false },
      { key: "harga", label: "Harga", required: true, type: "number" }
    ]
  }
];

const PER_PAGE = 12; // Responsive pagination

export default function KatalogPage() {
  const [tab, setTab] = useState(tabs[0]);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => { fetchData(); }, [tab, page, search]);

  async function fetchData() {
    setLoading(true);
    let query = supabase.from(tab.key).select("*", { count: "exact" }).order(tab.columns[0].key, { ascending: true });
    if (search) {
      const expr = tab.columns.map(col => `ilike(${col.key},'%${search}%')`).join(" OR ");
      query = query.or(expr);
    }
    query = query.range((page-1)*PER_PAGE, page*PER_PAGE-1);
    const { data, error, count } = await query;
    setData(data || []);
    setTotalPages(Math.max(1, Math.ceil((count || 0) / PER_PAGE)));
    setLoading(false);
  }

  // CRUD actions
  async function handleSave(values) {
    if (values.id) {
      await supabase.from(tab.key).update(values).eq("id", values.id);
    } else {
      let insert = { ...values };
      delete insert.id;
      await supabase.from(tab.key).insert(insert);
    }
    setShowForm(false);
    setEditRow(null);
    fetchData();
  }
  async function handleDelete(id) {
    if (confirm("Yakin mau hapus data ini?")) {
      await supabase.from(tab.key).delete().eq("id", id);
      fetchData();
    }
  }
  async function handleDuplicate(row) {
    let copy = { ...row }; delete copy.id;
    await supabase.from(tab.key).insert(copy);
    fetchData();
  }

  return (
    <div className="katalog-container">
      <div className="katalog-tabs">
        {tabs.map(t => (
          <button key={t.key}
            className={`tab-btn${tab.key === t.key ? " active" : ""}`}
            onClick={() => { setTab(t); setPage(1); setSearch(""); }}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-content active">
        <h2 className="katalog-h2">Katalog {tab.label}</h2>
        <div className="flex flex-wrap items-center mb-4 gap-3">
          <button className="btn btn-tambah" onClick={() => { setEditRow(null); setShowForm(true); }}>
            + Tambah {tab.label}
          </button>
          <form className="search-form" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder={`Cari ${tab.label.toLowerCase()}...`} value={search}
                   onChange={e => { setSearch(e.target.value); setPage(1); }} className="search-input" />
            <button type="submit" className="btn-search">Cari</button>
          </form>
        </div>
        <div className="table-wrapper" style={{overflowX:"auto"}}>
          {loading ? (<div className="loading-global">Loading...</div>) : (
            <table className="katalog-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {tab.columns.map(c => (<th key={c.key}>{c.label}</th>))}
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {!data.length ?
                  <tr><td colSpan={tab.columns.length + 2} className="no-data">Tidak ditemukan data.</td></tr>
                  :
                  data.map(row => (<tr key={row.id}>
                    <td style={{fontSize:"0.97em",color:"#606c88"}}>{row.id}</td>
                    {tab.columns.map(c =>
                      <td key={c.key} style={{fontSize:"1em"}}>{(c.type==="number"? row[c.key]===null?"-" : ("Rp "+Number(row[c.key]).toLocaleString()) : (row[c.key]||"-"))}</td>
                    )}
                    <td className="actions" style={{whiteSpace:"nowrap"}}>
                      <button className="btn-edit" title="Edit" onClick={() => { setEditRow(row); setShowForm(true); }}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-duplicate" title="Duplikat" onClick={() => handleDuplicate(row)}>
                        <i className="fas fa-copy"></i>
                      </button>
                      <button className="btn-hapus" title="Hapus" onClick={() => handleDelete(row.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          )}
        </div>
        <div className="pagination mt-4 flex gap-3 items-center justify-center">
          {page > 1 && <button className="btn" onClick={() => setPage(page - 1)}>&laquo; Prev</button>}
          <span>Halaman {page} dari {totalPages}</span>
          {page < totalPages && <button className="btn" onClick={() => setPage(page + 1)}>Next &raquo;</button>}
        </div>
        {showForm && (
          <FormKatalog
            tab={tab}
            values={editRow}
            onClose={() => setShowForm(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

// MODAL FORM ELEGAN, UNIVERSAL
function FormKatalog({ tab, values, onClose, onSave }) {
  const empty = {};
  tab.columns.forEach(c => { empty[c.key] = ""; });
  const [form, setForm] = useState(values ? { ...values } : empty);

  function handleChange(e) {
    let val = e.target.value;
    const type = tab.columns.find(c=>c.key===e.target.name)?.type;
    if(type==="number") val = val.replace(/[^.\d]/g,''); //only digits, dot
    setForm(f => ({ ...f, [e.target.name]: val }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    let filtered = { ...form };
    // Atur harga dan type number ke NUMERIC jika perlu
    tab.columns.forEach(c=>{
      if(c.type==="number" && filtered[c.key]!=="") filtered[c.key]=Number(filtered[c.key]);
      if(c.required && !filtered[c.key]) {
        alert(`${c.label} wajib diisi!`); return;
      }
    });
    onSave(filtered);
  }
  return (
    <div className="modal-backdrop">
      <div className="modal-form">
        <h3 style={{marginBottom:"16px"}}>{form.id ? "Edit" : "Tambah"} {tab.label}</h3>
        <form onSubmit={handleSubmit}>
          {tab.columns.map(c => (
            <label className="form-label" key={c.key}>
              {c.label}
              <input name={c.key} value={form[c.key]} onChange={handleChange}
                     type={c.type||"text"}
                     autoComplete="off"
                     required={c.required}
                     className="form-input"
                     style={{marginTop:"5px",fontSize:"1em"}}
                     placeholder={`Isi ${c.label.toLowerCase()}...`} />
            </label>
          ))}
          <div className="modal-actions" style={{marginTop:"18px"}}>
            <button type="submit" className="btn btn-primary">Simpan</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}