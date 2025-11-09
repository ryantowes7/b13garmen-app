import React, { useState } from "react";

export default function KatalogFilter({ onFilter }) {
  const [nama, setNama] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onFilter({ nama });
  }

  return (
    <form className="katalog-filter-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari nama produk..."
        value={nama}
        onChange={e => setNama(e.target.value)}
        className="input-global katalog-filter-input"
      />
      <button type="submit" className="button-global katalog-filter-btn">Cari</button>
    </form>
  );
}