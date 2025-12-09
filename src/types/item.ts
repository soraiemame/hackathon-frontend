export interface ItemImage {
  id: number;
  image_url: string;
  image_key: string;
  item_id: number;
}

export interface ItemBase {
  name: string;
  description?: string;
  price: number;
  condition: number;
}

export interface ItemCreate extends ItemBase {
  image_keys: string[];
}

export interface Item extends ItemBase {
  id: number;
  seller_id: number;
  selling: boolean;
  created_at: string;
  images: ItemImage[];
  is_deleted: boolean;
  like_count: number;
  category_id: number;
}
