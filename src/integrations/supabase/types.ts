export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      holidays_bab0c1c4_950f_428b_a1a9_e7391bd7b26d: {
        Row: {
          created_at: string
          end_date: string
          id: string
          reason: string
          staff_id: string
          start_date: string
          status: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          reason: string
          staff_id: string
          start_date: string
          status?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          reason?: string
          staff_id?: string
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_holidays_bab0c1c4_950f_428b_a1a9_e7391bd7b26d_staff_id"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_bab0c1c4_950f_428b_a1a9_e7391bd7b26d"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_bab0c1c4_950f_428b_a1a9_e7391bd7b26d: {
        Row: {
          active: boolean
          created_at: string
          email: string | null
          id: string
          image: string | null
          name: string
          position: string
          salary: number
          start_date: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          email?: string | null
          id?: string
          image?: string | null
          name: string
          position: string
          salary: number
          start_date: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string | null
          id?: string
          image?: string | null
          name?: string
          position?: string
          salary?: number
          start_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          address: string | null
          country: string | null
          created_at: string
          id: string
          owner_name: string | null
          phone: string | null
          store_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          country?: string | null
          created_at?: string
          id?: string
          owner_name?: string | null
          phone?: string | null
          store_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          country?: string | null
          created_at?: string
          id?: string
          owner_name?: string | null
          phone?: string | null
          store_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions_bab0c1c4_950f_428b_a1a9_e7391bd7b26d: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
          staff_id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description: string
          id?: string
          staff_id: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          staff_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_bab0c1c4_950f_428b_a1a9_e7391bd7b26d_staff_id"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_bab0c1c4_950f_428b_a1a9_e7391bd7b26d"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          recovery_email: string | null
          reset_token: string | null
          reset_token_expires_at: string | null
          show_data_password: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recovery_email?: string | null
          reset_token?: string | null
          reset_token_expires_at?: string | null
          show_data_password?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recovery_email?: string | null
          reset_token?: string | null
          reset_token_expires_at?: string | null
          show_data_password?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_tables: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
