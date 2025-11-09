import React from "react";

export default function KatalogItem({ product }) {
  return (
    <div className="card-global katalog-item-card">
      <h2 className="katalog-item-title">{product.produk}</h2>
      {/* Jika ada url gambar, render: */}
      {product.gambar_url && (
        <img src={product.gambar_url} alt={product.produk} className="katalog-item-image" />
      )}
      <div className="katalog-item-detail">
        <span>Jenis: {product.jenis}</span><br />
        <span>Model: {product.model}</span><br />
        {/* Tambahkan info lain sesuai kebutuhan */}
      </div>
    </div>
  );
}