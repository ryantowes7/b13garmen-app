import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Transaction } from "@/types/transaction";
import { Item } from "@/types/item";
import { Supplier } from "@/types/supplier";

type Props = {
  onSaved: () => void;
  editTransaction?: Transaction | null;
};

export default function TransactionForm({ onSaved, editTransaction }: Props) {
  const [form, setForm] = useState<Transaction>({
    id: "",
    date: "",
    item_id: "",
    supplier_id: "",
    quantity: 0,
    total: 0,
    type: "IN",
  });
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("items").select("*").then(resp => {
      if (resp.data) setItems(resp.data as Item[]);
    });
    supabase.from("suppliers").select("*").then(resp => {
      if (resp.data) setSuppliers(resp.data as Supplier[]);
    });
    if (editTransaction) setForm(editTransaction);
    else setForm({
      id: "",
      date: new Date().toISOString().slice(0, 10),
      item_id: "",
      supplier_id: "",
      quantity: 0,
      total: 0,
      type: "IN",
    });
  }, [editTransaction]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    let error;
    if (form.id) {
      ({ error } = await supabase.from("transactions").update(form).eq("id", form.id));
    } else {
      ({ error } = await supabase.from("transactions").insert([{ ...form, id: undefined }]));
    }
    setLoading(false);
    if (!error) {
      setForm({
        id: "",
        date: new Date().toISOString().slice(0, 10),
        item_id: "",
        supplier_id: "",
        quantity: 0,
        total: 0,
        type: "IN",
      });
      onSaved();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <input
        type="date"
        value={form.date}
        required
        className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
      />
      <select
        value={form.item_id}
        required
        className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, item_id: e.target.value }))}
      >
        <option value="">-- Pilih Barang --</option>
        {items.map(item => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
      <select
        value={form.supplier_id}
        className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, supplier_id: e.target.value }))}
      >
        <option value="">-- Pilih Supplier --</option>
        {suppliers.map(sup => (
          <option key={sup.id} value={sup.id}>{sup.name}</option>
        ))}
      </select>
      <select
        value={form.type}
        required
        className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, type: e.target.value as "IN" | "OUT" }))}
      >
        <option value="IN">Pembelian</option>
        <option value="OUT">Penjualan</option>
      </select>
      <input
        type="number"
        placeholder="Jumlah"
        value={form.quantity}
        required
        className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
      />
      <input
        type="number"
        placeholder="Total (Rp)"
        value={form.total}
        required
        className="border px-3 py-2 rounded w-full"
        onChange={e => setForm(f => ({ ...f, total: Number(e.target.value) }))}
      />
      <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800" disabled={loading}>
        {form.id ? "Edit Transaksi" : loading ? "Menyimpan..." : "Tambah Transaksi"}
      </button>
    </form>
  );
}