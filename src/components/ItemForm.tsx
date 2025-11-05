import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Item } from "@/types/item";

export default function ItemForm({ onSaved, editItem }: { onSaved: () => void, editItem?: Item|null }) {
  const [form, setForm] = useState<Item>({
    id: "",
    name: "",
    category: "",
    stock: 0,
    price: 0,
    supplier_id: "",
  });
  const [suppliers, setSuppliers] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // fetch suppliers
    supabase.from("suppliers").select("id,name").then(({ data }) => {
      if(data) setSuppliers(data);
    });
    if(editItem) setForm(editItem);
    else setForm({ id:"", name:"", category:"", stock:0, price:0, supplier_id:"" });
  }, [editItem]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    let error;
    if (form.id) {
      // Update
      ({ error } = await supabase.from("items").update(form).eq("id", form.id));
    } else {
      // Insert
      ({ error } = await supabase.from("items").insert([{ ...form, id: undefined }]));
    }
    setLoading(false);
    if (!error) {
      setForm({ id:"", name:"", category:"", stock:0, price:0, supplier_id:"" });
      onSaved();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <input type="text" placeholder="Nama Barang" value={form.name}
        required className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      <input type="text" placeholder="Kategori" value={form.category}
        required className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
      <input type="number" placeholder="Stok" value={form.stock}
        required className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
      <input type="number" placeholder="Harga" value={form.price}
        required className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
      <select value={form.supplier_id}
        required className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, supplier_id: e.target.value }))}>
        <option value="">-- Pilih Supplier --</option>
        {suppliers.map(sup => (
          <option key={sup.id} value={sup.id}>{sup.name}</option>
        ))}
      </select>
      <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800" disabled={loading}>
        {form.id ? "Edit Barang" : loading ? "Menyimpan..." : "Tambah Barang"}
      </button>
    </form>
  );
}