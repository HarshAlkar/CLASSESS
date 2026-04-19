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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          id: string
          title: string
          description: string
          faculty_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          faculty_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          faculty_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          phone: string
          standard: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          phone: string
          standard: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          standard?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          medium: Database["public"]["Enums"]["medium_type"] | null
          requested_role: Database["public"]["Enums"]["app_role"]
          standard: string | null
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          medium?: Database["public"]["Enums"]["medium_type"] | null
          requested_role?: Database["public"]["Enums"]["app_role"]
          standard?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          medium?: Database["public"]["Enums"]["medium_type"] | null
          requested_role?: Database["public"]["Enums"]["app_role"]
          standard?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
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
      attendance: {
        Row: {
          id: string
          user_id: string
          faculty_id: string | null
          date: string
          subject: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          faculty_id?: string | null
          date: string
          subject: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          faculty_id?: string | null
          date?: string
          subject?: string
          status?: string
          standard?: string | null
          created_at?: string
        }
        Relationships: []
      }
      homework: {
        Row: {
          id: string
          user_id: string | null
          faculty_id: string | null
          subject: string
          title: string
          description: string | null
          due_date: string
          status: string
          standard: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          faculty_id?: string | null
          subject: string
          title: string
          description?: string | null
          due_date: string
          status?: string
          standard?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          faculty_id?: string | null
          subject?: string
          title?: string
          description?: string | null
          due_date?: string
          status?: string
          standard?: string | null
          created_at?: string
        }
        Relationships: []
      }
      homework_submissions: {
        Row: {
          id: string
          homework_id: string | null
          student_id: string | null
          content: string
          submitted_at: string
        }
        Insert: {
          id?: string
          homework_id?: string | null
          student_id?: string | null
          content: string
          submitted_at?: string
        }
        Update: {
          id?: string
          homework_id?: string | null
          student_id?: string | null
          content?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_homework_id_fkey"
            columns: ["homework_id"]
            isOneToOne: false
            referencedRelation: "homework"
            referencedColumns: ["id"]
          }
        ]
      }
      lectures: {
        Row: {
          id: string
          faculty_id: string | null
          subject: string
          topic: string
          date: string
          video_url: string | null
          standard: string | null
          created_at: string
        }
        Insert: {
          id?: string
          faculty_id?: string | null
          subject: string
          topic: string
          date: string
          video_url?: string | null
          standard?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          faculty_id?: string | null
          subject?: string
          topic?: string
          date?: string
          video_url?: string | null
          standard?: string | null
          created_at?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          id: string
          faculty_id: string | null
          subject: string
          title: string
          file_url: string
          standard: string | null
          created_at: string
        }
        Insert: {
          id?: string
          faculty_id?: string | null
          subject: string
          title: string
          file_url: string
          standard?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          faculty_id?: string | null
          subject?: string
          title?: string
          file_url?: string
          standard?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_status: {
        Args: never
        Returns: Database["public"]["Enums"]["account_status"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_status: "pending" | "approved" | "rejected"
      app_role: "admin" | "faculty" | "student"
      medium_type: "English" | "Marathi"
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
      account_status: ["pending", "approved", "rejected"],
      app_role: ["admin", "faculty", "student"],
      medium_type: ["English", "Marathi"],
    },
  },
} as const
