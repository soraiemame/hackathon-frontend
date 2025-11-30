export interface User {
  id: number;
  username: string | null;
  email: string;
  created_at: string;
  icon_url?: string;
}

export interface UserUpdate {
  username?: string;
  icon_key?: string;
}