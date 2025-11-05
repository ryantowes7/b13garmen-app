import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Item } from "@/types/item";

export function useFetchItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    setLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as Item[]);
    setLoading(false);
  }

  useEffect(() => {
    fetch();
  }, []);

  return { items, loading, refetch: fetch };
}