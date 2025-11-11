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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      container_details: {
        Row: {
          barcode: string | null
          call_sign: string | null
          commodity_code: string | null
          consec_no: string | null
          consignment_note_no: string | null
          container_no: string
          count_code: string | null
          country: string | null
          created_at: string | null
          farm_no: string | null
          grade_code: string | null
          gross: number | null
          id: string
          insp_code: string | null
          insp_point: string | null
          inspection_date: string | null
          inventory_code: string | null
          location_code: string | null
          mark_code: string | null
          nett: number | null
          no_cartons: number | null
          orchard: string | null
          organization: string | null
          original_intake_date: string | null
          pack_code: string | null
          phc: string | null
          phyto_data: string | null
          production_area: string | null
          seal_number: string | null
          season: string | null
          ship_name: string | null
          stuff_date: string | null
          target_country: string | null
          target_market: string | null
          temptale: string | null
          upn: string | null
          user_id: string | null
          validation_id: string | null
          variety_code: string | null
          voyage_no: string | null
        }
        Insert: {
          barcode?: string | null
          call_sign?: string | null
          commodity_code?: string | null
          consec_no?: string | null
          consignment_note_no?: string | null
          container_no: string
          count_code?: string | null
          country?: string | null
          created_at?: string | null
          farm_no?: string | null
          grade_code?: string | null
          gross?: number | null
          id?: string
          insp_code?: string | null
          insp_point?: string | null
          inspection_date?: string | null
          inventory_code?: string | null
          location_code?: string | null
          mark_code?: string | null
          nett?: number | null
          no_cartons?: number | null
          orchard?: string | null
          organization?: string | null
          original_intake_date?: string | null
          pack_code?: string | null
          phc?: string | null
          phyto_data?: string | null
          production_area?: string | null
          seal_number?: string | null
          season?: string | null
          ship_name?: string | null
          stuff_date?: string | null
          target_country?: string | null
          target_market?: string | null
          temptale?: string | null
          upn?: string | null
          user_id?: string | null
          validation_id?: string | null
          variety_code?: string | null
          voyage_no?: string | null
        }
        Update: {
          barcode?: string | null
          call_sign?: string | null
          commodity_code?: string | null
          consec_no?: string | null
          consignment_note_no?: string | null
          container_no?: string
          count_code?: string | null
          country?: string | null
          created_at?: string | null
          farm_no?: string | null
          grade_code?: string | null
          gross?: number | null
          id?: string
          insp_code?: string | null
          insp_point?: string | null
          inspection_date?: string | null
          inventory_code?: string | null
          location_code?: string | null
          mark_code?: string | null
          nett?: number | null
          no_cartons?: number | null
          orchard?: string | null
          organization?: string | null
          original_intake_date?: string | null
          pack_code?: string | null
          phc?: string | null
          phyto_data?: string | null
          production_area?: string | null
          seal_number?: string | null
          season?: string | null
          ship_name?: string | null
          stuff_date?: string | null
          target_country?: string | null
          target_market?: string | null
          temptale?: string | null
          upn?: string | null
          user_id?: string | null
          validation_id?: string | null
          variety_code?: string | null
          voyage_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "container_details_validation_id_fkey"
            columns: ["validation_id"]
            isOneToOne: false
            referencedRelation: "validation_history"
            referencedColumns: ["id"]
          },
        ]
      }
      po_pallet_out: {
        Row: {
          act_var: string | null
          actual_gross_weight: number | null
          actual_nett_weight: number | null
          agent: string | null
          archive: boolean | null
          batch_no: string | null
          boe_no: string | null
          call_sign: string | null
          channel: string | null
          client_ref: string | null
          client_reference: string | null
          combo_pallet_id: string | null
          combo_sscc: string | null
          comm_grp: string | null
          commodity: string | null
          cons_no: string | null
          consec_no: string | null
          cont_split: string | null
          container: string | null
          country: string | null
          created_at: string | null
          ctn_qty: number | null
          cust_ord: string | null
          dest_locn: string | null
          dest_type: string | null
          edi_file_log_id: string | null
          expiry_code: string | null
          farm: string | null
          global_gap_number: string | null
          grade: string | null
          gtin: string | null
          id: string
          inner_cartons: string | null
          inner_pack: string | null
          inspec_date: string | null
          inspect_pnt: string | null
          inspector: string | null
          intake_date: string | null
          inv_code: string | null
          label_type: string | null
          load_id: string | null
          load_ref: string | null
          locn_code: string | null
          lot_no: string | null
          main_area: string | null
          mark: string | null
          mesg_no: string | null
          mixed_ind: string | null
          orchard: string | null
          order_no: string | null
          orgzn: string | null
          orig_account: string | null
          orig_cons: string | null
          orig_depot: string | null
          orig_inspec_date: string | null
          orig_intake: string | null
          original_seq_no: number | null
          pack: string | null
          packh_code: string | null
          pallet_btype: string | null
          pallet_id: string | null
          pallet_treatment: string | null
          phyto_data: string | null
          pick_ref: string | null
          plt_qty: number | null
          position: string | null
          principal: string | null
          processed: boolean | null
          prod_char: string | null
          prod_grp: string | null
          production_area: string | null
          production_id: string | null
          protocol_exception_indicator: string | null
          prov_flag: string | null
          re_inspect_doc: string | null
          reason: string | null
          record_type: string | null
          remarks: string | null
          revision: string | null
          saftbin1: string | null
          saftbin2: string | null
          saftbin3: string | null
          samsa_accredit_pallet: string | null
          seal_number: string | null
          season: string | null
          sellby_code: string | null
          sender: string | null
          seq_checked: boolean | null
          seq_no: number | null
          shift: string | null
          shift_date: string | null
          ship_agent: string | null
          ship_name: string | null
          ship_number: string | null
          ship_sender: string | null
          shipped_date: string | null
          size_count: string | null
          sscc: string | null
          stack_variance: string | null
          steri_dest: string | null
          steri_flag: string | null
          stock_pool: string | null
          store: string | null
          store_type: string | null
          stuff_date: string | null
          sub_var: string | null
          targ_mkt: string | null
          target_country: string | null
          target_region: string | null
          temp_device_id: string | null
          temp_device_type: string | null
          temperature: number | null
          traceability_code: string | null
          tran_date: string | null
          tran_time: string | null
          tran_user: string | null
          unit_type: string | null
          updated_at: string | null
          upn: string | null
          user_id: string | null
          var_grp: string | null
          variety: string | null
          voyage_no: string | null
          waybill_no: string | null
          weighing_date_time: string | null
          weighing_location: string | null
          xmit_flag: string | null
        }
        Insert: {
          act_var?: string | null
          actual_gross_weight?: number | null
          actual_nett_weight?: number | null
          agent?: string | null
          archive?: boolean | null
          batch_no?: string | null
          boe_no?: string | null
          call_sign?: string | null
          channel?: string | null
          client_ref?: string | null
          client_reference?: string | null
          combo_pallet_id?: string | null
          combo_sscc?: string | null
          comm_grp?: string | null
          commodity?: string | null
          cons_no?: string | null
          consec_no?: string | null
          cont_split?: string | null
          container?: string | null
          country?: string | null
          created_at?: string | null
          ctn_qty?: number | null
          cust_ord?: string | null
          dest_locn?: string | null
          dest_type?: string | null
          edi_file_log_id?: string | null
          expiry_code?: string | null
          farm?: string | null
          global_gap_number?: string | null
          grade?: string | null
          gtin?: string | null
          id?: string
          inner_cartons?: string | null
          inner_pack?: string | null
          inspec_date?: string | null
          inspect_pnt?: string | null
          inspector?: string | null
          intake_date?: string | null
          inv_code?: string | null
          label_type?: string | null
          load_id?: string | null
          load_ref?: string | null
          locn_code?: string | null
          lot_no?: string | null
          main_area?: string | null
          mark?: string | null
          mesg_no?: string | null
          mixed_ind?: string | null
          orchard?: string | null
          order_no?: string | null
          orgzn?: string | null
          orig_account?: string | null
          orig_cons?: string | null
          orig_depot?: string | null
          orig_inspec_date?: string | null
          orig_intake?: string | null
          original_seq_no?: number | null
          pack?: string | null
          packh_code?: string | null
          pallet_btype?: string | null
          pallet_id?: string | null
          pallet_treatment?: string | null
          phyto_data?: string | null
          pick_ref?: string | null
          plt_qty?: number | null
          position?: string | null
          principal?: string | null
          processed?: boolean | null
          prod_char?: string | null
          prod_grp?: string | null
          production_area?: string | null
          production_id?: string | null
          protocol_exception_indicator?: string | null
          prov_flag?: string | null
          re_inspect_doc?: string | null
          reason?: string | null
          record_type?: string | null
          remarks?: string | null
          revision?: string | null
          saftbin1?: string | null
          saftbin2?: string | null
          saftbin3?: string | null
          samsa_accredit_pallet?: string | null
          seal_number?: string | null
          season?: string | null
          sellby_code?: string | null
          sender?: string | null
          seq_checked?: boolean | null
          seq_no?: number | null
          shift?: string | null
          shift_date?: string | null
          ship_agent?: string | null
          ship_name?: string | null
          ship_number?: string | null
          ship_sender?: string | null
          shipped_date?: string | null
          size_count?: string | null
          sscc?: string | null
          stack_variance?: string | null
          steri_dest?: string | null
          steri_flag?: string | null
          stock_pool?: string | null
          store?: string | null
          store_type?: string | null
          stuff_date?: string | null
          sub_var?: string | null
          targ_mkt?: string | null
          target_country?: string | null
          target_region?: string | null
          temp_device_id?: string | null
          temp_device_type?: string | null
          temperature?: number | null
          traceability_code?: string | null
          tran_date?: string | null
          tran_time?: string | null
          tran_user?: string | null
          unit_type?: string | null
          updated_at?: string | null
          upn?: string | null
          user_id?: string | null
          var_grp?: string | null
          variety?: string | null
          voyage_no?: string | null
          waybill_no?: string | null
          weighing_date_time?: string | null
          weighing_location?: string | null
          xmit_flag?: string | null
        }
        Update: {
          act_var?: string | null
          actual_gross_weight?: number | null
          actual_nett_weight?: number | null
          agent?: string | null
          archive?: boolean | null
          batch_no?: string | null
          boe_no?: string | null
          call_sign?: string | null
          channel?: string | null
          client_ref?: string | null
          client_reference?: string | null
          combo_pallet_id?: string | null
          combo_sscc?: string | null
          comm_grp?: string | null
          commodity?: string | null
          cons_no?: string | null
          consec_no?: string | null
          cont_split?: string | null
          container?: string | null
          country?: string | null
          created_at?: string | null
          ctn_qty?: number | null
          cust_ord?: string | null
          dest_locn?: string | null
          dest_type?: string | null
          edi_file_log_id?: string | null
          expiry_code?: string | null
          farm?: string | null
          global_gap_number?: string | null
          grade?: string | null
          gtin?: string | null
          id?: string
          inner_cartons?: string | null
          inner_pack?: string | null
          inspec_date?: string | null
          inspect_pnt?: string | null
          inspector?: string | null
          intake_date?: string | null
          inv_code?: string | null
          label_type?: string | null
          load_id?: string | null
          load_ref?: string | null
          locn_code?: string | null
          lot_no?: string | null
          main_area?: string | null
          mark?: string | null
          mesg_no?: string | null
          mixed_ind?: string | null
          orchard?: string | null
          order_no?: string | null
          orgzn?: string | null
          orig_account?: string | null
          orig_cons?: string | null
          orig_depot?: string | null
          orig_inspec_date?: string | null
          orig_intake?: string | null
          original_seq_no?: number | null
          pack?: string | null
          packh_code?: string | null
          pallet_btype?: string | null
          pallet_id?: string | null
          pallet_treatment?: string | null
          phyto_data?: string | null
          pick_ref?: string | null
          plt_qty?: number | null
          position?: string | null
          principal?: string | null
          processed?: boolean | null
          prod_char?: string | null
          prod_grp?: string | null
          production_area?: string | null
          production_id?: string | null
          protocol_exception_indicator?: string | null
          prov_flag?: string | null
          re_inspect_doc?: string | null
          reason?: string | null
          record_type?: string | null
          remarks?: string | null
          revision?: string | null
          saftbin1?: string | null
          saftbin2?: string | null
          saftbin3?: string | null
          samsa_accredit_pallet?: string | null
          seal_number?: string | null
          season?: string | null
          sellby_code?: string | null
          sender?: string | null
          seq_checked?: boolean | null
          seq_no?: number | null
          shift?: string | null
          shift_date?: string | null
          ship_agent?: string | null
          ship_name?: string | null
          ship_number?: string | null
          ship_sender?: string | null
          shipped_date?: string | null
          size_count?: string | null
          sscc?: string | null
          stack_variance?: string | null
          steri_dest?: string | null
          steri_flag?: string | null
          stock_pool?: string | null
          store?: string | null
          store_type?: string | null
          stuff_date?: string | null
          sub_var?: string | null
          targ_mkt?: string | null
          target_country?: string | null
          target_region?: string | null
          temp_device_id?: string | null
          temp_device_type?: string | null
          temperature?: number | null
          traceability_code?: string | null
          tran_date?: string | null
          tran_time?: string | null
          tran_user?: string | null
          unit_type?: string | null
          updated_at?: string | null
          upn?: string | null
          user_id?: string | null
          var_grp?: string | null
          variety?: string | null
          voyage_no?: string | null
          waybill_no?: string | null
          weighing_date_time?: string | null
          weighing_location?: string | null
          xmit_flag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_pallet_out_edi_file_log_id_fkey"
            columns: ["edi_file_log_id"]
            isOneToOne: false
            referencedRelation: "validation_history"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      validation_history: {
        Row: {
          created_at: string | null
          error_records: number | null
          file_name: string
          file_type: string
          id: string
          successful_records: number | null
          total_cartons: number | null
          total_containers: number | null
          total_pallets: number | null
          total_records: number | null
          user_id: string | null
          validation_errors: Json | null
        }
        Insert: {
          created_at?: string | null
          error_records?: number | null
          file_name: string
          file_type: string
          id?: string
          successful_records?: number | null
          total_cartons?: number | null
          total_containers?: number | null
          total_pallets?: number | null
          total_records?: number | null
          user_id?: string | null
          validation_errors?: Json | null
        }
        Update: {
          created_at?: string | null
          error_records?: number | null
          file_name?: string
          file_type?: string
          id?: string
          successful_records?: number | null
          total_cartons?: number | null
          total_containers?: number | null
          total_pallets?: number | null
          total_records?: number | null
          user_id?: string | null
          validation_errors?: Json | null
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
