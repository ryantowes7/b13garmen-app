import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function TransactionTable({
  transactions,
  onChange,
  onEdit,
}: {
  transactions: Transaction[];
  onChange: () => void;
  onEdit: (transaction: Transaction) => void;
}) {
  const [search, setSearch] = useState("");

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
    await supabase.from("transactions").delete().eq("id", id);
    onChange();
  }

  const filtered = transactions.filter(
    tx =>
      tx.type.toLowerCase().includes(search.toLowerCase()) ||
      tx.date.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="Filter Transaksi (tgl/tipe)..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border px-2 py-1 rounded mb-2 w-full"
      />
      <table className="min-w-full bg-white border mt-2">
        <thead>
          <tr>
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Barang</th>
            <th className="border px-2 py-1">Supplier</th>
            <th className="border px-2 py-1">Jenis</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1">Total</th>
            <th className="border px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(tx => (
            <tr key={tx.id}>
              <td className="border px-2 py-1">{tx.date}</td>
              <td className="border px-2 py-1">{tx.item_id}</td>
              <td className="border px-2 py-1">{tx.supplier_id ?? "-"}</td>
              <td className="border px-2 py-1">{tx.type === "IN" ? "Pembelian" : "Penjualan"}</td>
              <td className="border px-2 py-1">{tx.quantity}</td>
              <td className="border px-2 py-1">{tx.total}</td>
              <td className="border px-2 py-1">
                <button className="bg-yellow-600 text-white px-2 py-1 rounded mr-1"
                  onClick={() => onEdit(tx)}>Edit</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(tx.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}