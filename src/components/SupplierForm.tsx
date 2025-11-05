import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Supplier } from "@/types/supplier";

export default function SupplierForm({ onSaved, editSupplier }: { onSaved: () => void; editSupplier?: Supplier | null }) {
  const [form, setForm] = useState<Supplier>(
    editSupplier ?? { id: "", name: "", phone: "", address: "" }
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    let error;
    if (form.id) {
      ({ error } = await supabase.from("suppliers").update(form).eq("id", form.id));
    } else {
      ({ error } = await supabase.from("suppliers").insert([{ ...form, id: undefined }]));
    }
    setLoading(false);
    if (!error) {
      setForm({ id: "", name: "", phone: "", address: "" });
      onSaved();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input type="text" placeholder="Nama Supplier" value={form.name} required
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border px-3 py-2 rounded w-full" />
      <input type="text" placeholder="Telepon" value={form.phone ?? ""}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="border px-3 py-2 rounded w-full" />
      <input type="text" placeholder="Alamat" value={form.address ?? ""}
        onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="border px-3 py-2 rounded w-full" />
      <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800" disabled={loading}>
        {form.id ? "Edit Supplier" : loading ? "Menyimpan..." : "Tambah Supplier"}
      </button>
    </form>
  );
}