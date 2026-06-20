// ClearWater Ireland — Supabase types for the v2 schema (project: ccxainfxmriydckzcyek)
// Hand-written from the frozen v2 schema. For 100% fidelity you can regenerate with:
//   supabase gen types typescript --project-id ccxainfxmriydckzcyek

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          name: string | null;
          email: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          customer_id: string;
          portal_user_id: string | null;
          created_at: string;
          updated_at: string;
          name: string;
          phone: string | null;
          email: string | null;
          address_line1: string | null;
          address_line2: string | null;
          town: string | null;
          county: string | null;
          eircode: string | null;
          property_type: string | null;
          num_bathrooms: number | null;
          year_built: number | null;
          pipe_type: string | null;
          access_notes: string | null;
        };
        Insert: {
          customer_id?: string;
          portal_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          town?: string | null;
          county?: string | null;
          eircode?: string | null;
          property_type?: string | null;
          num_bathrooms?: number | null;
          year_built?: number | null;
          pipe_type?: string | null;
          access_notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      installers: {
        Row: {
          installer_id: string;
          portal_user_id: string | null;
          created_at: string;
          updated_at: string;
          name: string;
          phone: string | null;
          email: string | null;
          insurance_provider: string | null;
          policy_number: string | null;
          policy_expiry: string | null;
          indemnity_confirmed: boolean;
          insurance_doc_url: string | null;
          ppsn: string | null;
          rct_rate: number;
          active: boolean;
        };
        Insert: {
          installer_id?: string;
          portal_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          insurance_provider?: string | null;
          policy_number?: string | null;
          policy_expiry?: string | null;
          indemnity_confirmed?: boolean;
          insurance_doc_url?: string | null;
          ppsn?: string | null;
          rct_rate?: number;
          active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["installers"]["Insert"]>;
        Relationships: [];
      };
      jobs: {
        Row: {
          job_id: string;
          job_ref: string;
          customer_id: string;
          created_at: string;
          updated_at: string;
          status: Database["public"]["Enums"]["job_status"];
          lead_source: Database["public"]["Enums"]["lead_source"] | null;
          package: Database["public"]["Enums"]["package_type"] | null;
          sale_price: number | null;
          deposit_amount: number | null;
          balance_amount: number | null;
          product_cost: number | null;
          labour_cost: number | null;
          ops_buffer: number;
          deposit_paid_at: string | null;
          deposit_stripe_id: string | null;
          balance_paid_at: string | null;
          balance_stripe_id: string | null;
          gross_profit: number | null;
          tax_reserve: number | null;
          net_profit: number | null;
          notes: string | null;
          owner_notes: string | null;
        };
        Insert: {
          job_id?: string;
          job_ref?: string;
          customer_id: string;
          created_at?: string;
          updated_at?: string;
          status?: Database["public"]["Enums"]["job_status"];
          lead_source?: Database["public"]["Enums"]["lead_source"] | null;
          package?: Database["public"]["Enums"]["package_type"] | null;
          sale_price?: number | null;
          deposit_amount?: number | null;
          balance_amount?: number | null;
          product_cost?: number | null;
          labour_cost?: number | null;
          ops_buffer?: number;
          deposit_paid_at?: string | null;
          deposit_stripe_id?: string | null;
          balance_paid_at?: string | null;
          balance_stripe_id?: string | null;
          gross_profit?: number | null;
          tax_reserve?: number | null;
          net_profit?: number | null;
          notes?: string | null;
          owner_notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "jobs_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["customer_id"];
          },
        ];
      };
      package_config: {
        Row: {
          package: Database["public"]["Enums"]["package_type"];
          name: string;
          tagline: string;
          sale_price: number;
          product_cost: number;
          labour_cost: number;
          ops_buffer: number;
          mfr_warranty_type: string;
          mfr_warranty_years: number;
          work_warranty_years: number;
          supplier: string;
          recommended: boolean;
          display_order: number;
          salt_management: boolean;
          priority_support: boolean;
          drinking_filtration: boolean;
          filter_tap: boolean;
        };
        Insert: {
          package: Database["public"]["Enums"]["package_type"];
          name: string;
          tagline: string;
          sale_price: number;
          product_cost: number;
          labour_cost: number;
          ops_buffer?: number;
          mfr_warranty_type: string;
          mfr_warranty_years: number;
          work_warranty_years: number;
          supplier: string;
          recommended?: boolean;
          display_order: number;
          salt_management?: boolean;
          priority_support?: boolean;
          drinking_filtration?: boolean;
          filter_tap?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["package_config"]["Insert"]>;
        Relationships: [];
      };
      quotes: {
        Row: {
          quote_id: string;
          job_id: string;
          created_at: string;
          updated_at: string;
          package: Database["public"]["Enums"]["package_type"];
          sale_price: number;
          expires_at: string;
          sent_at: string | null;
          viewed_at: string | null;
          accepted_at: string | null;
        };
        Insert: {
          quote_id?: string;
          job_id: string;
          created_at?: string;
          updated_at?: string;
          package: Database["public"]["Enums"]["package_type"];
          sale_price: number;
          expires_at?: string;
          sent_at?: string | null;
          viewed_at?: string | null;
          accepted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "quotes_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["job_id"];
          },
        ];
      };
      products: {
        Row: {
          product_id: string;
          job_id: string;
          created_at: string;
          package: Database["public"]["Enums"]["package_type"];
          product_name: string;
          supplier: string;
          product_cost: number;
          serial_number: string | null;
          ordered_at: string | null;
          delivered_at: string | null;
        };
        Insert: {
          product_id?: string;
          job_id: string;
          created_at?: string;
          package: Database["public"]["Enums"]["package_type"];
          product_name: string;
          supplier: string;
          product_cost: number;
          serial_number?: string | null;
          ordered_at?: string | null;
          delivered_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: true;
            referencedRelation: "jobs";
            referencedColumns: ["job_id"];
          },
        ];
      };
      installations: {
        Row: {
          installation_id: string;
          job_id: string;
          installer_id: string | null;
          created_at: string;
          updated_at: string;
          scheduled_date: string | null;
          arrival_time: string | null;
          completion_time: string | null;
          hardness_before: number | null;
          hardness_after: number | null;
          checklist_mains: boolean;
          checklist_bypass: boolean;
          checklist_drain: boolean;
          checklist_powered: boolean;
          checklist_salt: boolean;
          checklist_regen: boolean;
          checklist_leaks: boolean;
          checklist_hardness_test: boolean;
          checklist_filter_tap: boolean | null;
          checklist_filter_line: boolean | null;
          serial_number: string | null;
          customer_signature_url: string | null;
          installation_notes: string | null;
          status: Database["public"]["Enums"]["installation_status"];
        };
        Insert: {
          installation_id?: string;
          job_id: string;
          installer_id?: string | null;
          created_at?: string;
          updated_at?: string;
          scheduled_date?: string | null;
          arrival_time?: string | null;
          completion_time?: string | null;
          hardness_before?: number | null;
          hardness_after?: number | null;
          checklist_mains?: boolean;
          checklist_bypass?: boolean;
          checklist_drain?: boolean;
          checklist_powered?: boolean;
          checklist_salt?: boolean;
          checklist_regen?: boolean;
          checklist_leaks?: boolean;
          checklist_hardness_test?: boolean;
          checklist_filter_tap?: boolean | null;
          checklist_filter_line?: boolean | null;
          serial_number?: string | null;
          customer_signature_url?: string | null;
          installation_notes?: string | null;
          status?: Database["public"]["Enums"]["installation_status"];
        };
        Update: Partial<Database["public"]["Tables"]["installations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "installations_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: true;
            referencedRelation: "jobs";
            referencedColumns: ["job_id"];
          },
          {
            foreignKeyName: "installations_installer_id_fkey";
            columns: ["installer_id"];
            isOneToOne: false;
            referencedRelation: "installers";
            referencedColumns: ["installer_id"];
          },
        ];
      };
      photos: {
        Row: {
          photo_id: string;
          job_id: string;
          installation_id: string | null;
          uploaded_at: string;
          uploaded_by: string | null;
          type: Database["public"]["Enums"]["photo_type"];
          url: string;
          caption: string | null;
        };
        Insert: {
          photo_id?: string;
          job_id: string;
          installation_id?: string | null;
          uploaded_at?: string;
          uploaded_by?: string | null;
          type: Database["public"]["Enums"]["photo_type"];
          url: string;
          caption?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["photos"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "photos_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["job_id"];
          },
        ];
      };
      warranties: {
        Row: {
          warranty_id: string;
          job_id: string;
          created_at: string;
          updated_at: string;
          mfr_warranty_type: string;
          mfr_warranty_years: number;
          mfr_expiry: string;
          work_warranty_years: number;
          work_expiry: string;
          status: Database["public"]["Enums"]["warranty_status"];
          claim_count: number;
        };
        Insert: {
          warranty_id?: string;
          job_id: string;
          created_at?: string;
          updated_at?: string;
          mfr_warranty_type: string;
          mfr_warranty_years: number;
          mfr_expiry: string;
          work_warranty_years: number;
          work_expiry: string;
          status?: Database["public"]["Enums"]["warranty_status"];
          claim_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["warranties"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "warranties_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: true;
            referencedRelation: "jobs";
            referencedColumns: ["job_id"];
          },
        ];
      };
      warranty_claims: {
        Row: {
          claim_id: string;
          warranty_id: string;
          job_id: string;
          created_at: string;
          updated_at: string;
          description: string;
          status: Database["public"]["Enums"]["claim_status"];
          priority: Database["public"]["Enums"]["ticket_priority"];
          resolved_at: string | null;
          cost: number;
          notes: string | null;
        };
        Insert: {
          claim_id?: string;
          warranty_id: string;
          job_id: string;
          created_at?: string;
          updated_at?: string;
          description: string;
          status?: Database["public"]["Enums"]["claim_status"];
          priority?: Database["public"]["Enums"]["ticket_priority"];
          resolved_at?: string | null;
          cost?: number;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["warranty_claims"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "warranty_claims_warranty_id_fkey";
            columns: ["warranty_id"];
            isOneToOne: false;
            referencedRelation: "warranties";
            referencedColumns: ["warranty_id"];
          },
          {
            foreignKeyName: "warranty_claims_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["job_id"];
          },
        ];
      };
      support_tickets: {
        Row: {
          ticket_id: string;
          job_id: string;
          customer_id: string;
          created_at: string;
          updated_at: string;
          subject: string;
          description: string;
          status: Database["public"]["Enums"]["ticket_status"];
          priority: Database["public"]["Enums"]["ticket_priority"];
          resolved_at: string | null;
          resolution: string | null;
        };
        Insert: {
          ticket_id?: string;
          job_id: string;
          customer_id: string;
          created_at?: string;
          updated_at?: string;
          subject: string;
          description: string;
          status?: Database["public"]["Enums"]["ticket_status"];
          priority?: Database["public"]["Enums"]["ticket_priority"];
          resolved_at?: string | null;
          resolution?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "support_tickets_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["job_id"];
          },
          {
            foreignKeyName: "support_tickets_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["customer_id"];
          },
        ];
      };
      salt_orders: {
        Row: {
          order_id: string;
          job_id: string;
          customer_id: string;
          created_at: string;
          updated_at: string;
          bags_quantity: number;
          price_per_bag: number;
          total_price: number;
          status: Database["public"]["Enums"]["salt_order_status"];
          delivery_date: string | null;
          delivery_notes: string | null;
        };
        Insert: {
          order_id?: string;
          job_id: string;
          customer_id: string;
          created_at?: string;
          updated_at?: string;
          bags_quantity: number;
          price_per_bag: number;
          total_price: number;
          status?: Database["public"]["Enums"]["salt_order_status"];
          delivery_date?: string | null;
          delivery_notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["salt_orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "salt_orders_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["job_id"];
          },
          {
            foreignKeyName: "salt_orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["customer_id"];
          },
        ];
      };
    };
    Views: {
      customer_jobs: {
        Row: {
          job_id: string | null;
          job_ref: string | null;
          customer_id: string | null;
          status: Database["public"]["Enums"]["job_status"] | null;
          package: Database["public"]["Enums"]["package_type"] | null;
          sale_price: number | null;
          deposit_amount: number | null;
          balance_amount: number | null;
          deposit_paid_at: string | null;
          balance_paid_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      fn_complete_installation: {
        Args: { p_installation_id: string };
        Returns: undefined;
      };
      fn_create_warranty: {
        Args: { p_job_id: string; p_install_date: string };
        Returns: undefined;
      };
      fn_checklist_complete: {
        Args: { p_installation_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      job_status:
        | "lead"
        | "quoted"
        | "deposit_paid"
        | "scheduled"
        | "installed"
        | "completed"
        | "closed"
        | "cancelled";
      lead_source: "website" | "call" | "referral" | "flyer" | "google" | "facebook" | "other";
      package_type: "essential" | "complete" | "premium";
      photo_type: "before" | "after";
      warranty_status: "active" | "expired" | "claimed";
      claim_status: "open" | "in_progress" | "resolved";
      ticket_status: "open" | "in_progress" | "resolved";
      ticket_priority: "low" | "standard" | "high" | "urgent";
      salt_order_status: "requested" | "confirmed" | "delivered";
      installation_status: "pending" | "in_progress" | "complete";
      user_role: "owner" | "installer" | "customer";
    };
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
