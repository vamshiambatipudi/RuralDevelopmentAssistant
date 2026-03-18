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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      crop_profiles: {
        Row: {
          cost_per_acre: number
          created_at: string
          emoji: string
          fertilizer_details: string[]
          fertilizer_summary: string
          id: string
          irrigation_types: string[]
          is_active: boolean
          market_demand: string
          name: string
          optimal_soil_types: string[]
          price_per_quintal: number
          rainfall_range_max: number
          rainfall_range_min: number
          seasons: string[]
          temp_range_max: number
          temp_range_min: number
          tips: string[]
          updated_at: string
          yield_per_acre: number
        }
        Insert: {
          cost_per_acre?: number
          created_at?: string
          emoji?: string
          fertilizer_details?: string[]
          fertilizer_summary?: string
          id?: string
          irrigation_types?: string[]
          is_active?: boolean
          market_demand?: string
          name: string
          optimal_soil_types?: string[]
          price_per_quintal?: number
          rainfall_range_max?: number
          rainfall_range_min?: number
          seasons?: string[]
          temp_range_max?: number
          temp_range_min?: number
          tips?: string[]
          updated_at?: string
          yield_per_acre?: number
        }
        Update: {
          cost_per_acre?: number
          created_at?: string
          emoji?: string
          fertilizer_details?: string[]
          fertilizer_summary?: string
          id?: string
          irrigation_types?: string[]
          is_active?: boolean
          market_demand?: string
          name?: string
          optimal_soil_types?: string[]
          price_per_quintal?: number
          rainfall_range_max?: number
          rainfall_range_min?: number
          seasons?: string[]
          temp_range_max?: number
          temp_range_min?: number
          tips?: string[]
          updated_at?: string
          yield_per_acre?: number
        }
        Relationships: []
      }
      health_topics: {
        Row: {
          created_at: string
          home_remedies: string[]
          id: string
          is_active: boolean
          language: string
          medicines: string[]
          symptom_key: string
          updated_at: string
          warnings: string[]
        }
        Insert: {
          created_at?: string
          home_remedies?: string[]
          id?: string
          is_active?: boolean
          language?: string
          medicines?: string[]
          symptom_key: string
          updated_at?: string
          warnings?: string[]
        }
        Update: {
          created_at?: string
          home_remedies?: string[]
          id?: string
          is_active?: boolean
          language?: string
          medicines?: string[]
          symptom_key?: string
          updated_at?: string
          warnings?: string[]
        }
        Relationships: []
      }
      jobs: {
        Row: {
          apply_link: string | null
          category: string
          company: string
          created_at: string
          description: string
          eligibility: string[]
          id: string
          is_active: boolean
          location: string
          requirements: string[]
          salary: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          apply_link?: string | null
          category?: string
          company: string
          created_at?: string
          description?: string
          eligibility?: string[]
          id?: string
          is_active?: boolean
          location?: string
          requirements?: string[]
          salary?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          apply_link?: string | null
          category?: string
          company?: string
          created_at?: string
          description?: string
          eligibility?: string[]
          id?: string
          is_active?: boolean
          location?: string
          requirements?: string[]
          salary?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          district: string | null
          email: string | null
          id: string
          is_active: boolean
          mandal: string | null
          name: string | null
          phone: string | null
          pin_code: string | null
          state: string | null
          updated_at: string
          village: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          district?: string | null
          email?: string | null
          id: string
          is_active?: boolean
          mandal?: string | null
          name?: string | null
          phone?: string | null
          pin_code?: string | null
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          mandal?: string | null
          name?: string | null
          phone?: string | null
          pin_code?: string | null
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      schemes: {
        Row: {
          application_process: string[]
          benefits: string
          category: string
          created_at: string
          description: string
          documents_required: string[]
          eligibility: Json
          helpline: string | null
          id: string
          is_active: boolean
          link: string
          name: string
          updated_at: string
        }
        Insert: {
          application_process?: string[]
          benefits?: string
          category?: string
          created_at?: string
          description: string
          documents_required?: string[]
          eligibility?: Json
          helpline?: string | null
          id?: string
          is_active?: boolean
          link?: string
          name: string
          updated_at?: string
        }
        Update: {
          application_process?: string[]
          benefits?: string
          category?: string
          created_at?: string
          description?: string
          documents_required?: string[]
          eligibility?: Json
          helpline?: string | null
          id?: string
          is_active?: boolean
          link?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      trainings: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          enroll_link: string | null
          free: boolean
          id: string
          is_active: boolean
          level: string
          provider: string
          syllabus: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          enroll_link?: string | null
          free?: boolean
          id?: string
          is_active?: boolean
          level?: string
          provider: string
          syllabus?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          enroll_link?: string | null
          free?: boolean
          id?: string
          is_active?: boolean
          level?: string
          provider?: string
          syllabus?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weather_config: {
        Row: {
          config_key: string
          config_value: string
          created_at: string
          description: string
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value?: string
          created_at?: string
          description?: string
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: string
          created_at?: string
          description?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
