export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      stylist_training_data: {
        Row: {
          created_at: string
          id: string
          outfit_template_id: string | null
          personal_preferences: Json | null
          rating: number | null
          user_feedback: string | null
          user_id: string
          weather_context: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          outfit_template_id?: string | null
          personal_preferences?: Json | null
          rating?: number | null
          user_feedback?: string | null
          user_id: string
          weather_context?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          outfit_template_id?: string | null
          personal_preferences?: Json | null
          rating?: number | null
          user_feedback?: string | null
          user_id?: string
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
      get_random_outfit_templates: {
        Args: {
          weather_condition?: string
          temperature?: number
          limit_count?: number
        }
        Returns: {
          id: string
          name: string
          description: string
          image_url: string
          weather_conditions: string[]
          temperature_min: number
          temperature_max: number
          style_category: string
          season: string
          occasion: string
          color_palette: string[]
          clothing_items: string[]
          style_tips: string
          source_url: string
          is_approved: boolean
          created_by: string
          created_at: string
          updated_at: string
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
