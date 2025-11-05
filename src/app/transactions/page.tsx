"use client";
import { useFetchTransactions } from "@/hooks/useFetchTransactions";
import TransactionForm from "@/components/TransactionForm";
import TransactionTable from "@/components/TransactionTable";
import { useState } from "react";
import { Transaction } from "@/types/transaction";

export default function TransactionsPage() {
  const { transactions, loading, refetch } = useFetchTransactions();
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Data Transaksi</h1>
      <TransactionForm onSaved={refetch} editTransaction={editTransaction} />
      {loading ? (
        <p>Mengambil data...</p>
      ) : (
        <TransactionTable transactions={transactions} onChange={refetch} onEdit={setEditTransaction} />
      )}
    </div>
  );
}