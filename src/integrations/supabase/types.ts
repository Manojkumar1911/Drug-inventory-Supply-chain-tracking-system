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
      alerts: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: number
          location: string
          severity: string | null
          status: string | null
          timestamp: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: number
          location: string
          severity?: string | null
          status?: string | null
          timestamp?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: number
          location?: string
          severity?: string | null
          status?: string | null
          timestamp?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          category: string | null
          created_at: string | null
          date: string
          id: number
          location: string | null
          metric_type: string
          notes: string | null
          updated_at: string | null
          value: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          date: string
          id?: number
          location?: string | null
          metric_type: string
          notes?: string | null
          updated_at?: string | null
          value: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          date?: string
          id?: number
          location?: string | null
          metric_type?: string
          notes?: string | null
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      imported_products: {
        Row: {
          created_at: string | null
          error_count: number | null
          file_name: string
          id: string
          imported_by: string
          row_count: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_count?: number | null
          file_name: string
          id?: string
          imported_by: string
          row_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_count?: number | null
          file_name?: string
          id?: string
          imported_by?: string
          row_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string | null
          email: string | null
          id: number
          is_active: boolean | null
          manager: string | null
          name: string
          notes: string | null
          phone_number: string | null
          state: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          country?: string
          created_at?: string | null
          email?: string | null
          id?: number
          is_active?: boolean | null
          manager?: string | null
          name: string
          notes?: string | null
          phone_number?: string | null
          state: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string | null
          email?: string | null
          id?: number
          is_active?: boolean | null
          manager?: string | null
          name?: string
          notes?: string | null
          phone_number?: string | null
          state?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          expiry_date: string | null
          id: number
          location: string
          manufacturer: string | null
          name: string
          quantity: number
          reorder_level: number
          sku: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          location: string
          manufacturer?: string | null
          name: string
          quantity?: number
          reorder_level: number
          sku: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          location?: string
          manufacturer?: string | null
          name?: string
          quantity?: number
          reorder_level?: number
          sku?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          id: number
          product_id: number | null
          product_name: string
          purchase_order_id: number
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          id?: number
          product_id?: number | null
          product_name: string
          purchase_order_id: number
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          id?: number
          product_id?: number | null
          product_name?: string
          purchase_order_id?: number
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchase_order"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_by: string | null
          created_at: string | null
          expected_delivery_date: string | null
          id: number
          notes: string | null
          order_number: string
          payment_due_date: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          received_date: string | null
          shipping_method: string | null
          status: string | null
          submitted_by: string
          supplier_id: number | null
          supplier_name: string
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: number
          notes?: string | null
          order_number: string
          payment_due_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          received_date?: string | null
          shipping_method?: string | null
          status?: string | null
          submitted_by: string
          supplier_id?: number | null
          supplier_name: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: number
          notes?: string | null
          order_number?: string
          payment_due_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          received_date?: string | null
          shipping_method?: string | null
          status?: string | null
          submitted_by?: string
          supplier_id?: number | null
          supplier_name?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          group_name: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          group_name?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          group_name?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      supplier_products: {
        Row: {
          product_id: number
          supplier_id: number
        }
        Insert: {
          product_id: number
          supplier_id: number
        }
        Update: {
          product_id?: number
          supplier_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string
          city: string
          contact_person: string
          country: string | null
          created_at: string | null
          email: string
          id: number
          is_active: boolean | null
          lead_time: number | null
          minimum_order_amount: number | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone_number: string
          rating: number | null
          state: string
          tax_id: string | null
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          contact_person: string
          country?: string | null
          created_at?: string | null
          email: string
          id?: number
          is_active?: boolean | null
          lead_time?: number | null
          minimum_order_amount?: number | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone_number: string
          rating?: number | null
          state: string
          tax_id?: string | null
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          contact_person?: string
          country?: string | null
          created_at?: string | null
          email?: string
          id?: number
          is_active?: boolean | null
          lead_time?: number | null
          minimum_order_amount?: number | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone_number?: string
          rating?: number | null
          state?: string
          tax_id?: string | null
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      transfers: {
        Row: {
          completed_date: string | null
          created_at: string | null
          from_location: string
          id: number
          notes: string | null
          priority: string | null
          product_id: number | null
          product_name: string
          quantity: number
          requested_by: string
          status: string | null
          to_location: string
          transfer_date: string | null
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          from_location: string
          id?: number
          notes?: string | null
          priority?: string | null
          product_id?: number | null
          product_name: string
          quantity: number
          requested_by: string
          status?: string | null
          to_location: string
          transfer_date?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          from_location?: string
          id?: number
          notes?: string | null
          priority?: string | null
          product_id?: number | null
          product_name?: string
          quantity?: number
          requested_by?: string
          status?: string | null
          to_location?: string
          transfer_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transfers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          id: number
          is_active: boolean | null
          last_login: string | null
          name: string
          password: string
          reset_password_expires: string | null
          reset_password_token: string | null
          role: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: number
          is_active?: boolean | null
          last_login?: string | null
          name: string
          password: string
          reset_password_expires?: string | null
          reset_password_token?: string | null
          role?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: number
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          password?: string
          reset_password_expires?: string | null
          reset_password_token?: string | null
          role?: string
          updated_at?: string | null
          updated_by?: string | null
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
