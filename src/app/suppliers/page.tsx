"use client";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import SupplierForm from "@/components/SupplierForm";
import SupplierTable from "@/components/SupplierTable";
import { useState } from "react";
import { Supplier } from "@/types/supplier";

export default function SuppliersPage() {
  const { suppliers, loading, refetch } = useFetchSuppliers();
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Data Supplier</h1>
      <SupplierForm onSaved={refetch} editSupplier={editSupplier} />
      {loading ? (
        <p>Mengambil data...</p>
      ) : (
        <SupplierTable suppliers={suppliers} onChange={refetch} onEdit={setEditSupplier} />
      )}
    </div>
  );
}