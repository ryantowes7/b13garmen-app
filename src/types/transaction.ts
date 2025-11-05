export interface Transaction {
  id: string;
  date: string;
  item_id: string;
  supplier_id?: string;
  quantity: number;
  total: number;
  type: "IN" | "OUT";
  created_at?: string;
}