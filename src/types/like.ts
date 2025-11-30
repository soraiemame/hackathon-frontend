import type { Item } from "./item";

export interface Like {
    id: number;
    user_id: number;
    item_id: number;
    created_at: string;
    item: Item; 
}