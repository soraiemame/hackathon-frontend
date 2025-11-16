import type { Item } from "./item";

export type OrderStatus = "pending" | "shipped" | "completed";

export interface Order {
  id: number;
  item_id: number;
  buyer_id: number;
  seller_id: number;
  status: OrderStatus;
  created_at: string;

  item: Item;
}
