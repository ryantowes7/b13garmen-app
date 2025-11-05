"use client";
import { useFetchItems } from "@/hooks/useFetchItems";
import ItemTable from "@/components/ItemTable";
import ItemForm from "@/components/ItemForm";
import { useState } from "react";
import { Item } from "@/types/item";

export default function ItemsPage() {
  const { items, loading, refetch } = useFetchItems();
  const [editItem, setEditItem] = useState<Item | null>(null);
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Data Barang</h1>
      <ItemForm onSaved={refetch} editItem={editItem} />
      {loading ? (
        <p>Mengambil data...</p>
      ) : (
        <ItemTable items={items} onChange={refetch} onEdit={setEditItem} />
      )}
    </div>
  );
}