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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          created_at: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      cold_email_templates: {
        Row: {
          created_at: string | null
          email_body: string
          email_subject: string
          id: string
          template_name: string
        }
        Insert: {
          created_at?: string | null
          email_body?: string
          email_subject: string
          id?: string
          template_name: string
        }
        Update: {
          created_at?: string | null
          email_body?: string
          email_subject?: string
          id?: string
          template_name?: string
        }
        Relationships: []
      }
      company_questions: {
        Row: {
          answer: string | null
          company: string
          created_at: string
          difficulty: string
          document_link: string | null
          id: string
          location: string
          question: string
          role: string
          skills: string[]
          updated_at: string
        }
        Insert: {
          answer?: string | null
          company: string
          created_at?: string
          difficulty?: string
          document_link?: string | null
          id?: string
          location?: string
          question: string
          role?: string
          skills?: string[]
          updated_at?: string
        }
        Update: {
          answer?: string | null
          company?: string
          created_at?: string
          difficulty?: string
          document_link?: string | null
          id?: string
          location?: string
          question?: string
          role?: string
          skills?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          query: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          query: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          query?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          rating: number
          user_email: string
          user_id: string
          user_name: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          message: string
          rating?: number
          user_email?: string
          user_id: string
          user_name?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          rating?: number
          user_email?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      hr_contacts: {
        Row: {
          company: string
          created_at: string | null
          email: string | null
          experience: string
          id: string
          linkedin: string | null
          name: string
          notes: string | null
          posted_at: string | null
          role_focus: string | null
          source_url: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          email?: string | null
          experience?: string
          id?: string
          linkedin?: string | null
          name: string
          notes?: string | null
          posted_at?: string | null
          role_focus?: string | null
          source_url?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          email?: string | null
          experience?: string
          id?: string
          linkedin?: string | null
          name?: string
          notes?: string | null
          posted_at?: string | null
          role_focus?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      interview_questions: {
        Row: {
          answer: string | null
          company: string
          created_at: string | null
          difficulty: string
          explanation: string
          hint: string | null
          id: string
          question: string
          role: string
          tags: string[]
          topic: string
        }
        Insert: {
          answer?: string | null
          company?: string
          created_at?: string | null
          difficulty?: string
          explanation?: string
          hint?: string | null
          id?: string
          question: string
          role: string
          tags?: string[]
          topic: string
        }
        Update: {
          answer?: string | null
          company?: string
          created_at?: string | null
          difficulty?: string
          explanation?: string
          hint?: string | null
          id?: string
          question?: string
          role?: string
          tags?: string[]
          topic?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          apply_link: string
          company_name: string
          created_at: string | null
          description: string
          id: string
          location: string | null
          posted_at: string | null
          skills_required: string[] | null
          source: string
          title: string
          updated_at: string | null
        }
        Insert: {
          apply_link?: string
          company_name: string
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          posted_at?: string | null
          skills_required?: string[] | null
          source?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          apply_link?: string
          company_name?: string
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          posted_at?: string | null
          skills_required?: string[] | null
          source?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      linkedin_optimizer_tips: {
        Row: {
          created_at: string | null
          example: string | null
          id: string
          optimization_tip: string
          section: string
        }
        Insert: {
          created_at?: string | null
          example?: string | null
          id?: string
          optimization_tip: string
          section: string
        }
        Update: {
          created_at?: string | null
          example?: string | null
          id?: string
          optimization_tip?: string
          section?: string
        }
        Relationships: []
      }
      mock_interviews: {
        Row: {
          created_at: string | null
          difficulty: string
          id: string
          question_set: string
          role: string
        }
        Insert: {
          created_at?: string | null
          difficulty?: string
          id?: string
          question_set: string
          role: string
        }
        Update: {
          created_at?: string | null
          difficulty?: string
          id?: string
          question_set?: string
          role?: string
        }
        Relationships: []
      }
      naukri_optimizer_tips: {
        Row: {
          created_at: string | null
          example: string | null
          id: string
          profile_section: string
          suggestion: string
        }
        Insert: {
          created_at?: string | null
          example?: string | null
          id?: string
          profile_section: string
          suggestion: string
        }
        Update: {
          created_at?: string | null
          example?: string | null
          id?: string
          profile_section?: string
          suggestion?: string
        }
        Relationships: []
      }
      prep_roadmap: {
        Row: {
          created_at: string | null
          id: string
          resource_link: string | null
          role: string
          step: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          resource_link?: string | null
          role: string
          step: string
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_link?: string | null
          role?: string
          step?: string
        }
        Relationships: []
      }
      resume_templates: {
        Row: {
          created_at: string | null
          file_url: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          file_url: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          file_url?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      roadmap_modules: {
        Row: {
          created_at: string
          difficulty: string
          duration: string
          icon_name: string
          id: string
          order_index: number
          progress: number
          title: string
          topic_links: Json
          topics: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: string
          duration?: string
          icon_name?: string
          id?: string
          order_index?: number
          progress?: number
          title: string
          topic_links?: Json
          topics?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: string
          duration?: string
          icon_name?: string
          id?: string
          order_index?: number
          progress?: number
          title?: string
          topic_links?: Json
          topics?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      scenario_questions: {
        Row: {
          answer: string | null
          created_at: string | null
          description: string | null
          difficulty: string
          explanation: string
          hint: string | null
          id: string
          scenario: string
          tags: string[]
          technology: string
          title: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string
          explanation?: string
          hint?: string | null
          id?: string
          scenario: string
          tags?: string[]
          technology?: string
          title?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string
          explanation?: string
          hint?: string | null
          id?: string
          scenario?: string
          tags?: string[]
          technology?: string
          title?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
