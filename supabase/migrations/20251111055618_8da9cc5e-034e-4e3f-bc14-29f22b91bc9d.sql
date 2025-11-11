-- Create table for PO Pallet Out records (main pallet data)
CREATE TABLE IF NOT EXISTS public.po_pallet_out (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  edi_file_log_id uuid REFERENCES public.validation_history(id) ON DELETE CASCADE,
  user_id uuid,
  
  -- Core identification
  record_type text,
  load_id text,
  pallet_id text,
  seq_no integer,
  original_seq_no integer,
  
  -- Unit and position
  unit_type text,
  position text,
  
  -- Parties
  sender text,
  agent text,
  ship_sender text,
  ship_agent text,
  
  -- Destination
  dest_type text,
  dest_locn text,
  cons_no text,
  
  -- Container info
  container text,
  seal_number text,
  consec_no text,
  cont_split text,
  
  -- Product codes
  channel text,
  orgzn text,
  country text,
  comm_grp text,
  commodity text,
  var_grp text,
  variety text,
  sub_var text,
  act_var text,
  pack text,
  grade text,
  mark text,
  size_count text,
  inv_code text,
  
  -- Farm and production
  pick_ref text,
  farm text,
  prod_grp text,
  prod_char text,
  targ_mkt text,
  
  -- Quantities
  ctn_qty numeric,
  plt_qty numeric,
  
  -- Flags and references
  mixed_ind text,
  remarks text,
  reason text,
  
  -- Dates
  intake_date date,
  orig_depot text,
  orig_intake date,
  shift text,
  shift_date date,
  
  -- Order and location
  order_no text,
  locn_code text,
  store text,
  stock_pool text,
  shipped_date timestamp with time zone,
  
  -- Transaction tracking
  xmit_flag text,
  revision text,
  mesg_no text,
  tran_user text,
  tran_date date,
  tran_time text,
  
  -- Pallet type and origin
  pallet_btype text,
  orig_cons text,
  ship_number text,
  
  -- Temperature
  temperature numeric,
  combo_pallet_id text,
  temp_device_id text,
  temp_device_type text,
  
  -- Customs and traceability
  boe_no text,
  principal text,
  sscc text,
  actual_nett_weight numeric,
  saftbin1 text,
  saftbin2 text,
  saftbin3 text,
  orig_account text,
  inspec_date date,
  
  -- Stack and storage
  stack_variance text,
  store_type text,
  batch_no text,
  waybill_no text,
  gtin text,
  packh_code text,
  
  -- Treatment and compliance
  steri_flag text,
  steri_dest text,
  label_type text,
  prov_flag text,
  sellby_code text,
  combo_sscc text,
  
  -- Inspection
  inspector text,
  inspect_pnt text,
  expiry_code text,
  orchard text,
  
  -- Target info
  target_region text,
  target_country text,
  global_gap_number text,
  lot_no text,
  traceability_code text,
  season text,
  orig_inspec_date date,
  
  -- Packaging
  inner_pack text,
  inner_cartons text,
  production_id text,
  protocol_exception_indicator text,
  upn text,
  pallet_treatment text,
  
  -- Weight and verification
  actual_gross_weight numeric,
  samsa_accredit_pallet text,
  weighing_location text,
  weighing_date_time text,
  
  -- Area codes
  main_area text,
  production_area text,
  phyto_data text,
  cust_ord text,
  re_inspect_doc text,
  
  -- Shipping details
  stuff_date date,
  ship_name text,
  call_sign text,
  voyage_no text,
  load_ref text,
  
  -- Client references
  client_ref text,
  client_reference text,
  
  -- Processing flags
  processed boolean DEFAULT false,
  archive boolean DEFAULT false,
  seq_checked boolean DEFAULT false,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.po_pallet_out ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read their own pallet records"
  ON public.po_pallet_out
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL) AND 
    ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
  );

CREATE POLICY "Users can insert their own pallet records"
  ON public.po_pallet_out
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL) AND 
    (user_id = auth.uid())
  );

CREATE POLICY "Users can update their own pallet records"
  ON public.po_pallet_out
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL) AND 
    (user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own pallet records"
  ON public.po_pallet_out
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL) AND 
    (user_id = auth.uid())
  );

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_po_pallet_out_edi_file_log ON public.po_pallet_out(edi_file_log_id);
CREATE INDEX IF NOT EXISTS idx_po_pallet_out_user_id ON public.po_pallet_out(user_id);
CREATE INDEX IF NOT EXISTS idx_po_pallet_out_container ON public.po_pallet_out(container);
CREATE INDEX IF NOT EXISTS idx_po_pallet_out_sscc ON public.po_pallet_out(sscc);
CREATE INDEX IF NOT EXISTS idx_po_pallet_out_season ON public.po_pallet_out(season);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_po_pallet_out_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_po_pallet_out_updated_at
  BEFORE UPDATE ON public.po_pallet_out
  FOR EACH ROW
  EXECUTE FUNCTION public.update_po_pallet_out_updated_at();