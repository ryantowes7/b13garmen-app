import { Item } from "@/types/item";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function ItemTable({ items, onChange, onEdit }: { items: Item[], onChange: () => void, onEdit: (item: Item) => void }) {
  const [search, setSearch] = useState("");
  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus barang ini?")) return;
    await supabase.from("items").delete().eq("id", id);
    onChange();
  }
  const filtered = items.filter(
    item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <input placeholder="Cari Barang..." value={search}
        onChange={e=>setSearch(e.target.value)}
        className="border px-2 py-1 rounded mb-2 w-full"/>
      <table className="min-w-full bg-white border mt-2">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Kategori</th>
            <th className="border px-2 py-1">Stok</th>
            <th className="border px-2 py-1">Harga</th>
            <th className="border px-2 py-1">Supplier</th>
            <th className="border px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.category}</td>
              <td className="border px-2 py-1">{item.stock}</td>
              <td className="border px-2 py-1">{item.price}</td>
              <td className="border px-2 py-1">{item.supplier_id ?? "-"}</td>
              <td className="border px-2 py-1">
                <button className="bg-yellow-600 text-white px-2 py-1 rounded mr-1"
                  onClick={() => onEdit(item)}>Edit</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}