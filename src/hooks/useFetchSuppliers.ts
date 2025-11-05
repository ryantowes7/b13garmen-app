import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Supplier } from "@/types/supplier";

export function useFetchSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    setLoading(true);
    const { data, error } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false });
    if (!error && data) setSuppliers(data as Supplier[]);
    setLoading(false);
  }
  useEffect(() => { fetch(); }, []);
  return { suppliers, loading, refetch: fetch };
}