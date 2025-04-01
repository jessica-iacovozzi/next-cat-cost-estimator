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
      annual_costs: {
        Row: {
          cost: number
          expense_id: number | null
          id: number
          life_stage_id: number | null
          lifestyle: string
          year: number
        }
        Insert: {
          cost: number
          expense_id?: number | null
          id?: number
          life_stage_id?: number | null
          lifestyle: string
          year?: number
        }
        Update: {
          cost?: number
          expense_id?: number | null
          id?: number
          life_stage_id?: number | null
          lifestyle?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "annual_costs_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_costs_life_stage_id_fkey"
            columns: ["life_stage_id"]
            isOneToOne: false
            referencedRelation: "life_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          id: number
          name: string
          tooltip: Json | null
        }
        Insert: {
          id?: number
          name: string
          tooltip?: Json | null
        }
        Update: {
          id?: number
          name?: string
          tooltip?: Json | null
        }
        Relationships: []
      }
      life_stages: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      sexes: {
        Row: {
          id: number
          is_fixed: boolean
          name: string
        }
        Insert: {
          id?: number
          is_fixed?: boolean
          name: string
        }
        Update: {
          id?: number
          is_fixed?: boolean
          name?: string
        }
        Relationships: []
      }
      sterilization_costs: {
        Row: {
          cost: number
          id: number
          sex_id: number
          year: number
        }
        Insert: {
          cost: number
          id?: number
          sex_id: number
          year?: number
        }
        Update: {
          cost?: number
          id?: number
          sex_id?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "sterilization_costs_sex_id_fkey"
            columns: ["sex_id"]
            isOneToOne: false
            referencedRelation: "sexes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_estimates: {
        Row: {
          created_at: string
          id: number
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_expenses: {
        Row: {
          cost: number
          id: number
          name: string | null
          order: number
          user_estimate_id: number
        }
        Insert: {
          cost: number
          id?: number
          name?: string | null
          order: number
          user_estimate_id: number
        }
        Update: {
          cost?: number
          id?: number
          name?: string | null
          order?: number
          user_estimate_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_expenses_user_estimate_id_fkey"
            columns: ["user_estimate_id"]
            isOneToOne: false
            referencedRelation: "user_estimates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reorder_expenses: {
        Args: {
          p_expense_id: number
          p_estimate_id: number
          p_old_order: number
          p_new_order: number
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

