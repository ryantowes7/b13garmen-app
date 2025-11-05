import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Transaction } from "@/types/transaction";

export function useFetchTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    setLoading(true);
    const { data, error } = await supabase.from("transactions").select("*").order("date",{ ascending: false });
    if (!error && data) setTransactions(data as Transaction[]);
    setLoading(false);
  }

  useEffect(() => { fetch(); }, []);

  return { transactions, loading, refetch: fetch };
}