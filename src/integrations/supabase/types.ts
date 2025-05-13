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
      achievements: {
        Row: {
          category: string
          created_at: string | null
          date: string
          description: string | null
          description_ar: string | null
          featured: boolean | null
          id: string
          image: string | null
          link: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          description_ar?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          link?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          description_ar?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          link?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      course_orders: {
        Row: {
          amount: number
          course_id: string | null
          created_at: string | null
          currency: string
          id: string
          payment_id: string | null
          payment_method: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          course_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          course_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_orders_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          content: string | null
          content_ar: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          description_ar: string | null
          duration: number | null
          featured: boolean | null
          id: string
          image: string | null
          is_free: boolean | null
          lessons: number | null
          level: string | null
          price: number | null
          show_orders: boolean | null
          students: number | null
          tags: Json | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          content_ar?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          description_ar?: string | null
          duration?: number | null
          featured?: boolean | null
          id?: string
          image?: string | null
          is_free?: boolean | null
          lessons?: number | null
          level?: string | null
          price?: number | null
          show_orders?: boolean | null
          students?: number | null
          tags?: Json | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          content_ar?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          description_ar?: string | null
          duration?: number | null
          featured?: boolean | null
          id?: string
          image?: string | null
          is_free?: boolean | null
          lessons?: number | null
          level?: string | null
          price?: number | null
          show_orders?: boolean | null
          students?: number | null
          tags?: Json | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          category: string
          created_at: string | null
          date: string
          description: string | null
          descriptionar: string | null
          downloads: number | null
          downloadurl: string
          featured: boolean | null
          filetype: string
          fullpath: string
          id: string
          size: number
          title: string
          titlear: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          descriptionar?: string | null
          downloads?: number | null
          downloadurl: string
          featured?: boolean | null
          filetype: string
          fullpath: string
          id?: string
          size: number
          title: string
          titlear: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          descriptionar?: string | null
          downloads?: number | null
          downloadurl?: string
          featured?: boolean | null
          filetype?: string
          fullpath?: string
          id?: string
          size?: number
          title?: string
          titlear?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string | null
          content: string | null
          contentAr: string | null
          created_at: string | null
          date: string | null
          excerpt: string | null
          excerptAr: string | null
          featured: boolean | null
          id: string
          image: string | null
          tags: Json | null
          title: string
          titleAr: string | null
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          contentAr?: string | null
          created_at?: string | null
          date?: string | null
          excerpt?: string | null
          excerptAr?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          tags?: Json | null
          title: string
          titleAr?: string | null
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string | null
          contentAr?: string | null
          created_at?: string | null
          date?: string | null
          excerpt?: string | null
          excerptAr?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          tags?: Json | null
          title?: string
          titleAr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          descriptionAr: string | null
          featured: boolean | null
          github: string | null
          id: string
          image: string | null
          link: string | null
          tags: Json | null
          technologies: Json | null
          title: string
          titleAr: string | null
          "updated_at:": string | null
          year: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          descriptionAr?: string | null
          featured?: boolean | null
          github?: string | null
          id?: string
          image?: string | null
          link?: string | null
          tags?: Json | null
          technologies?: Json | null
          title: string
          titleAr?: string | null
          "updated_at:"?: string | null
          year?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          descriptionAr?: string | null
          featured?: boolean | null
          github?: string | null
          id?: string
          image?: string | null
          link?: string | null
          tags?: Json | null
          technologies?: Json | null
          title?: string
          titleAr?: string | null
          "updated_at:"?: string | null
          year?: string | null
        }
        Relationships: []
      }
      publications: {
        Row: {
          abstract: string | null
          abstract_ar: string | null
          authors: string | null
          authors_ar: string | null
          category: string
          created_at: string | null
          date: string
          featured: boolean | null
          id: string
          image: string | null
          link: string | null
          published_in: string | null
          published_in_ar: string | null
          related_post_id: string | null
          related_project_id: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          abstract?: string | null
          abstract_ar?: string | null
          authors?: string | null
          authors_ar?: string | null
          category: string
          created_at?: string | null
          date: string
          featured?: boolean | null
          id?: string
          image?: string | null
          link?: string | null
          published_in?: string | null
          published_in_ar?: string | null
          related_post_id?: string | null
          related_project_id?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          abstract?: string | null
          abstract_ar?: string | null
          authors?: string | null
          authors_ar?: string | null
          category?: string
          created_at?: string | null
          date?: string
          featured?: boolean | null
          id?: string
          image?: string | null
          link?: string | null
          published_in?: string | null
          published_in_ar?: string | null
          related_post_id?: string | null
          related_project_id?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publications_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
