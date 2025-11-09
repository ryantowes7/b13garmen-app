import React from "react";
import KatalogItem from "./KatalogItem";

export default function KatalogList({ products }) {
  if (!products.length)
    return <div className="katalog-empty">Produk tidak ditemukan.</div>;
  return (
    <div className="katalog-list-grid">
      {products.map(product => (
        <KatalogItem key={product.id} product={product} />
      ))}
    </div>
  );
}