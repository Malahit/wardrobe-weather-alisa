export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      outfit_items: {
        Row: {
          brand: string | null
          color: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          item_name: string
          item_type: string
          material: string | null
          outfit_template_id: string | null
          price: number | null
          shop_url: string | null
          size_range: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          color?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          item_name: string
          item_type: string
          material?: string | null
          outfit_template_id?: string | null
          price?: number | null
          shop_url?: string | null
          size_range?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          color?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          item_name?: string
          item_type?: string
          material?: string | null
          outfit_template_id?: string | null
          price?: number | null
          shop_url?: string | null
          size_range?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfit_items_outfit_template_id_fkey"
            columns: ["outfit_template_id"]
            isOneToOne: false
            referencedRelation: "outfit_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      outfit_templates: {
        Row: {
          clothing_items: string[]
          color_palette: string[]
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string
          is_approved: boolean | null
          name: string
          occasion: string | null
          season: string
          source_url: string | null
          style_category: string
          style_tips: string | null
          temperature_max: number | null
          temperature_min: number | null
          updated_at: string
          weather_conditions: string[]
        }
        Insert: {
          clothing_items?: string[]
          color_palette?: string[]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_approved?: boolean | null
          name: string
          occasion?: string | null
          season: string
          source_url?: string | null
          style_category: string
          style_tips?: string | null
          temperature_max?: number | null
          temperature_min?: number | null
          updated_at?: string
          weather_conditions?: string[]
        }
        Update: {
          clothing_items?: string[]
          color_palette?: string[]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_approved?: boolean | null
          name?: string
          occasion?: string | null
          season?: string
          source_url?: string | null
          style_category?: string
          style_tips?: string | null
          temperature_max?: number | null
          temperature_min?: number | null
          updated_at?: string
          weather_conditions?: string[]
        }
        Relationships: []
      }
      saved_outfits: {
        Row: {
          created_at: string
          id: string
          item_ids: string[]
          last_used: string | null
          name: string
          rating: number | null
          times_used: number
          updated_at: string
          user_id: string
          weather_context: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_ids?: string[]
          last_used?: string | null
          name: string
          rating?: number | null
          times_used?: number
          updated_at?: string
          user_id: string
          weather_context?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          item_ids?: string[]
          last_used?: string | null
          name?: string
          rating?: number | null
          times_used?: number
          updated_at?: string
          user_id?: string
          weather_context?: Json | null
        }
        Relationships: []
      }
      stylist_training_data: {
        Row: {
          created_at: string
          id: string
          outfit_template_id: string
          rating: number
          user_feedback: string
          user_id: string | null
          weather_context: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          outfit_template_id: string
          rating: number
          user_feedback: string
          user_id?: string | null
          weather_context?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          outfit_template_id?: string
          rating?: number
          user_feedback?: string
          user_id?: string | null
          weather_context?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "stylist_training_data_outfit_template_id_fkey"
            columns: ["outfit_template_id"]
            isOneToOne: false
            referencedRelation: "outfit_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      wardrobe_items: {
        Row: {
          brand: string | null
          category: string
          color: string
          created_at: string
          id: string
          image_url: string | null
          last_worn: string | null
          name: string
          season: string
          temperature_max: number | null
          temperature_min: number | null
          times_worn: number
          updated_at: string
          user_id: string
          weather_conditions: string[]
        }
        Insert: {
          brand?: string | null
          category: string
          color: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_worn?: string | null
          name: string
          season: string
          temperature_max?: number | null
          temperature_min?: number | null
          times_worn?: number
          updated_at?: string
          user_id: string
          weather_conditions?: string[]
        }
        Update: {
          brand?: string | null
          category?: string
          color?: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_worn?: string | null
          name?: string
          season?: string
          temperature_max?: number | null
          temperature_min?: number | null
          times_worn?: number
          updated_at?: string
          user_id?: string
          weather_conditions?: string[]
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          category: string
          created_at: string
          external_url: string
          id: string
          image_url: string
          item_name: string
          marketplace: string
          price: number
          user_id: string
          weather_reason: string
        }
        Insert: {
          category: string
          created_at?: string
          external_url: string
          id?: string
          image_url: string
          item_name: string
          marketplace: string
          price: number
          user_id: string
          weather_reason: string
        }
        Update: {
          category?: string
          created_at?: string
          external_url?: string
          id?: string
          image_url?: string
          item_name?: string
          marketplace?: string
          price?: number
          user_id?: string
          weather_reason?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_random_outfit_templates: {
        Args: {
          limit_count?: number
          temperature?: number
          weather_condition?: string
        }
        Returns: {
          clothing_items: string[]
          color_palette: string[]
          created_at: string
          created_by: string
          description: string
          id: string
          image_url: string
          is_approved: boolean
          name: string
          occasion: string
          season: string
          source_url: string
          style_category: string
          style_tips: string
          temperature_max: number
          temperature_min: number
          updated_at: string
          weather_conditions: string[]
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
