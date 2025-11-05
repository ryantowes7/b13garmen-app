import { Supplier } from "@/types/supplier";
import { supabase } from "@/lib/supabaseClient";

export default function SupplierTable({ suppliers, onChange, onEdit }: { suppliers: Supplier[], onChange: () => void, onEdit: (supplier: Supplier) => void }) {
  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus supplier ini?")) return;
    await supabase.from("suppliers").delete().eq("id", id);
    onChange();
  }
  return (
    <table className="min-w-full bg-white border mt-2">
      <thead>
        <tr>
          <th className="border px-2 py-1">Nama</th>
          <th className="border px-2 py-1">Telepon</th>
          <th className="border px-2 py-1">Alamat</th>
          <th className="border px-2 py-1"></th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((sup) => (
          <tr key={sup.id}>
            <td className="border px-2 py-1">{sup.name}</td>
            <td className="border px-2 py-1">{sup.phone}</td>
            <td className="border px-2 py-1">{sup.address}</td>
            <td className="border px-2 py-1">
              <button className="bg-yellow-600 text-white px-2 py-1 rounded mr-1" onClick={() => onEdit(sup)}>Edit</button>
              <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(sup.id)}>Hapus</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}