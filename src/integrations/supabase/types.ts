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
      marketplace_recommendations: {
        Row: {
          category: string
          created_at: string | null
          external_url: string
          id: string
          image_url: string | null
          item_name: string
          marketplace: string
          price: number | null
          user_id: string
          weather_reason: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          external_url: string
          id?: string
          image_url?: string | null
          item_name: string
          marketplace: string
          price?: number | null
          user_id: string
          weather_reason?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          external_url?: string
          id?: string
          image_url?: string | null
          item_name?: string
          marketplace?: string
          price?: number | null
          user_id?: string
          weather_reason?: string | null
        }
        Relationships: []
      }
      outfits: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          item_ids: string[]
          last_used: string | null
          name: string
          rating: number | null
          temperature: number | null
          times_used: number | null
          updated_at: string | null
          user_id: string
          weather_condition: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_ids: string[]
          last_used?: string | null
          name: string
          rating?: number | null
          temperature?: number | null
          times_used?: number | null
          updated_at?: string | null
          user_id: string
          weather_condition?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_ids?: string[]
          last_used?: string | null
          name?: string
          rating?: number | null
          temperature?: number | null
          times_used?: number | null
          updated_at?: string | null
          user_id?: string
          weather_condition?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      wardrobe_items: {
        Row: {
          brand: string | null
          category: string
          color: string
          created_at: string | null
          id: string
          image_url: string | null
          last_worn: string | null
          name: string
          season: string
          temperature_max: number | null
          temperature_min: number | null
          times_worn: number | null
          updated_at: string | null
          user_id: string
          weather_conditions: string[] | null
        }
        Insert: {
          brand?: string | null
          category: string
          color: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          last_worn?: string | null
          name: string
          season: string
          temperature_max?: number | null
          temperature_min?: number | null
          times_worn?: number | null
          updated_at?: string | null
          user_id: string
          weather_conditions?: string[] | null
        }
        Update: {
          brand?: string | null
          category?: string
          color?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          last_worn?: string | null
          name?: string
          season?: string
          temperature_max?: number | null
          temperature_min?: number | null
          times_worn?: number | null
          updated_at?: string | null
          user_id?: string
          weather_conditions?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
