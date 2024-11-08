export interface Message {
  id: number;
  content: string;
  created_at: string;
  parent_id: number | null;
  project_id: number;
}

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
}