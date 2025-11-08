import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_LINE_LENGTH = 10000;
const MAX_LINES = 100000;

export const validateEDIFile = (content: string): { valid: boolean; error?: string } => {
  // Check file size
  const sizeInBytes = new Blob([content]).size;
  if (sizeInBytes > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 10MB limit` };
  }

  // Check line count
  const lines = content.split('\n');
  if (lines.length > MAX_LINES) {
    return { valid: false, error: `File exceeds ${MAX_LINES} line limit` };
  }

  // Check line lengths
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > MAX_LINE_LENGTH) {
      return { valid: false, error: `Line ${i + 1} exceeds maximum length of ${MAX_LINE_LENGTH} characters` };
    }
  }

  return { valid: true };
};

// Schema for container data validation before database insert
export const containerDataSchema = z.object({
  season: z.string().max(10).optional().nullable(),
  location_code: z.string().max(10).optional().nullable(),
  organization: z.string().max(10).optional().nullable(),
  stuff_date: z.string().max(10).optional().nullable(),
  container_no: z.string().max(20).trim(),
  seal_number: z.string().max(20).optional().nullable(),
  barcode: z.string().max(50).optional().nullable(),
  no_cartons: z.number().int().min(0).max(999999).optional().nullable(),
  gross: z.number().min(0).max(999999.99).optional().nullable(),
  nett: z.number().min(0).max(999999.99).optional().nullable(),
  commodity_code: z.string().max(10).optional().nullable(),
  variety_code: z.string().max(10).optional().nullable(),
  grade_code: z.string().max(10).optional().nullable(),
  pack_code: z.string().max(10).optional().nullable(),
  count_code: z.string().max(10).optional().nullable(),
  mark_code: z.string().max(20).optional().nullable(),
  target_market: z.string().max(10).optional().nullable(),
  country: z.string().max(10).optional().nullable(),
  farm_no: z.string().max(20).optional().nullable(),
  phc: z.string().max(10).optional().nullable(),
  orchard: z.string().max(20).optional().nullable(),
  inspection_date: z.string().max(10).optional().nullable(),
  insp_point: z.string().max(10).optional().nullable(),
  insp_code: z.string().max(10).optional().nullable(),
  original_intake_date: z.string().max(10).optional().nullable(),
  consignment_note_no: z.string().max(20).optional().nullable(),
  temptale: z.string().max(20).optional().nullable(),
  inventory_code: z.string().max(10).optional().nullable(),
  phyto_data: z.string().max(50).optional().nullable(),
  upn: z.string().max(20).optional().nullable(),
  consec_no: z.string().max(20).optional().nullable(),
  target_country: z.string().max(10).optional().nullable(),
  production_area: z.string().max(20).optional().nullable(),
  ship_name: z.string().max(50).optional().nullable(),
  voyage_no: z.string().max(20).optional().nullable(),
  call_sign: z.string().max(20).optional().nullable(),
});

export type ValidatedContainerData = z.infer<typeof containerDataSchema>;
