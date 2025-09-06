// Temporary type definitions until auto-generated types update
export interface Database {
  public: {
    Tables: {
      outfit_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string;
          weather_conditions: string[];
          temperature_min: number | null;
          temperature_max: number | null;
          style_category: string;
          season: string;
          occasion: string | null;
          color_palette: string[];
          clothing_items: string[];
          style_tips: string | null;
          source_url: string | null;
          is_approved: boolean | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url: string;
          weather_conditions?: string[];
          temperature_min?: number | null;
          temperature_max?: number | null;
          style_category: string;
          season: string;
          occasion?: string | null;
          color_palette?: string[];
          clothing_items?: string[];
          style_tips?: string | null;
          source_url?: string | null;
          is_approved?: boolean | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string;
          weather_conditions?: string[];
          temperature_min?: number | null;
          temperature_max?: number | null;
          style_category?: string;
          season?: string;
          occasion?: string | null;
          color_palette?: string[];
          clothing_items?: string[];
          style_tips?: string | null;
          source_url?: string | null;
          is_approved?: boolean | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      outfit_items: {
        Row: {
          id: string;
          outfit_template_id: string | null;
          item_name: string;
          item_type: string;
          brand: string | null;
          price: number | null;
          currency: string | null;
          shop_url: string | null;
          image_url: string | null;
          size_range: string | null;
          color: string | null;
          material: string | null;
          description: string | null;
          is_available: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          outfit_template_id?: string | null;
          item_name: string;
          item_type: string;
          brand?: string | null;
          price?: number | null;
          currency?: string | null;
          shop_url?: string | null;
          image_url?: string | null;
          size_range?: string | null;
          color?: string | null;
          material?: string | null;
          description?: string | null;
          is_available?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          outfit_template_id?: string | null;
          item_name?: string;
          item_type?: string;
          brand?: string | null;
          price?: number | null;
          currency?: string | null;
          shop_url?: string | null;
          image_url?: string | null;
          size_range?: string | null;
          color?: string | null;
          material?: string | null;
          description?: string | null;
          is_available?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      wardrobe_items: {
        Row: {
          id: string;
          name: string;
          category: string;
          color: string;
          season: string;
          brand: string | null;
          image_url: string | null;
          user_id: string;
          weather_conditions: string[];
          temperature_min: number | null;
          temperature_max: number | null;
          times_worn: number;
          last_worn: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          color: string;
          season: string;
          brand?: string | null;
          image_url?: string | null;
          user_id: string;
          weather_conditions?: string[];
          temperature_min?: number | null;
          temperature_max?: number | null;
          times_worn?: number;
          last_worn?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          color?: string;
          season?: string;
          brand?: string | null;
          image_url?: string | null;
          user_id?: string;
          weather_conditions?: string[];
          temperature_min?: number | null;
          temperature_max?: number | null;
          times_worn?: number;
          last_worn?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_outfits: {
        Row: {
          id: string;
          name: string;
          item_ids: string[];
          rating: number | null;
          times_used: number;
          user_id: string;
          weather_context: any | null;
          last_used: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          item_ids?: string[];
          rating?: number | null;
          times_used?: number;
          user_id: string;
          weather_context?: any | null;
          last_used?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          item_ids?: string[];
          rating?: number | null;
          times_used?: number;
          user_id?: string;
          weather_context?: any | null;
          last_used?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      stylist_training_data: {
        Row: {
          id: string;
          outfit_template_id: string;
          user_feedback: string;
          rating: number;
          weather_context: any | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          outfit_template_id: string;
          user_feedback: string;
          rating: number;
          weather_context?: any | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          outfit_template_id?: string;
          user_feedback?: string;
          rating?: number;
          weather_context?: any | null;
          user_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          id: string;
          item_name: string;
          marketplace: string;
          price: number;
          external_url: string;
          category: string;
          image_url: string;
          weather_reason: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_name: string;
          marketplace: string;
          price: number;
          external_url: string;
          category: string;
          image_url: string;
          weather_reason: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_name?: string;
          marketplace?: string;
          price?: number;
          external_url?: string;
          category?: string;
          image_url?: string;
          weather_reason?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_random_outfit_templates: {
        Args: {
          weather_condition?: string | null;
          temperature?: number | null;
          limit_count?: number;
        };
        Returns: Database['public']['Tables']['outfit_templates']['Row'][];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}