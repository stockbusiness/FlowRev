export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "revenue" | "expense";
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "revenue" | "expense";
          color?: string;
        };
        Update: {
          name?: string;
          type?: "revenue" | "expense";
          color?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: "revenue" | "expense";
          amount: number;
          description: string;
          category_id: string | null;
          customer_id: string | null;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "revenue" | "expense";
          amount: number;
          description: string;
          category_id?: string | null;
          customer_id?: string | null;
          date: string;
        };
        Update: {
          type?: "revenue" | "expense";
          amount?: number;
          description?: string;
          category_id?: string | null;
          customer_id?: string | null;
          date?: string;
          updated_at?: string;
        };
      };
    };
  };
}
