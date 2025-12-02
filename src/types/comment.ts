import type { User } from './user';

export interface Comment {
    id: number;
    user_id: number;
    item_id: number;
    body: string;
    created_at: string;
    // 追加: バックエンドからネストされて返ってくるユーザー情報
    user: User | null;
}

export interface CommentCreate {
    body: string;
}