export interface Comment {
  id: number;
  item_id: number;
  user_id: number;
  body: string;
  created_at: string; //
}

export interface CommentCreate {
  body: string;
}
