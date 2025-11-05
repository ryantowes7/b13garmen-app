export interface Item {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier_id?: string; // relasi dengan supplier
  created_at?: string;
}