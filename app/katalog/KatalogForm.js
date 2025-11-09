import React, { useState } from 'react';

// Nilai awal untuk tambah/edit
const defaultValues = {
  produk: "",
  jenis: "",
  model: "",
  tipe_desain: "",
};

export default function KatalogForm({ values, onClose, onSave }) {
  const [form, setForm] = useState(values ? { ...values } : defaultValues);

  function handleChange(e) {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-form">
        <h3>{form.id ? 'Edit Produk' : 'Tambah Produk'}</h3>
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Nama Produk
            <input
              name="produk"
              value={form.produk}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Nama produk"
            />
          </label>
          <label className="form-label">
            Jenis
            <input
              name="jenis"
              value={form.jenis}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Jenis"
            />
          </label>
          <label className="form-label">
            Model
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Model"
            />
          </label>
          <label className="form-label">
            Tipe/Desain
            <input
              name="tipe_desain"
              value={form.tipe_desain}
              onChange={handleChange}
              className="form-input"
              placeholder="Tipe/Desain"
            />
          </label>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Simpan</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}