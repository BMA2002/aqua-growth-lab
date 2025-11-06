import { z } from 'zod';

// Define the exact columns expected in the import
export const REQUIRED_COLUMNS = [
  'Season',
  'Location Code',
  'Organization',
  'Stuff Date',
  'Container No',
  'Seal Number',
  'Barcode',
  'No Cartons',
  'Gross',
  'Nett',
  'Commodity Code',
  'Variety Code',
  'Grade Code',
  'Pack Code',
  'Count Code',
  'Mark Code',
  'Target Market',
  'Country',
  'Farm No.',
  'PHC',
  'Orchard',
  'Inspection Date',
  'Insp. Point',
  'Insp. Code',
  'Original Intake Date',
  'Consignment Note No.',
  'Temptale',
  'Inventory Code',
  'PhytoData',
  'UPN',
  'Consec no',
  'Target Country',
  'Production Area',
] as const;

// Validation schema for CSV row
export const csvRowSchema = z.object({
  'Season': z.string().trim().min(1, 'Season is required'),
  'Location Code': z.string().trim().min(1, 'Location Code is required'),
  'Organization': z.string().trim().min(1, 'Organization is required'),
  'Stuff Date': z.string().trim().min(1, 'Stuff Date is required'),
  'Container No': z.string().trim().min(1, 'Container No is required'),
  'Seal Number': z.string().trim().min(1, 'Seal Number is required'),
  'Barcode': z.string().trim().min(1, 'Barcode is required'),
  'No Cartons': z.string().trim().min(1, 'No Cartons is required'),
  'Gross': z.string().trim().min(1, 'Gross is required'),
  'Nett': z.string().trim().min(1, 'Nett is required'),
  'Commodity Code': z.string().trim().min(1, 'Commodity Code is required'),
  'Variety Code': z.string().trim().min(1, 'Variety Code is required'),
  'Grade Code': z.string().trim().min(1, 'Grade Code is required'),
  'Pack Code': z.string().trim().min(1, 'Pack Code is required'),
  'Count Code': z.string().trim().min(1, 'Count Code is required'),
  'Mark Code': z.string().trim().min(1, 'Mark Code is required'),
  'Target Market': z.string().trim().min(1, 'Target Market is required'),
  'Country': z.string().trim().min(1, 'Country is required'),
  'Farm No.': z.string().trim().min(1, 'Farm No. is required'),
  'PHC': z.string().trim().min(1, 'PHC is required'),
  'Orchard': z.string().trim().min(1, 'Orchard is required'),
  'Inspection Date': z.string().trim().min(1, 'Inspection Date is required'),
  'Insp. Point': z.string().trim().min(1, 'Insp. Point is required'),
  'Insp. Code': z.string().trim().min(1, 'Insp. Code is required'),
  'Original Intake Date': z.string().trim().min(1, 'Original Intake Date is required'),
  'Consignment Note No.': z.string().trim().min(1, 'Consignment Note No. is required'),
  'Temptale': z.string().trim().min(1, 'Temptale is required'),
  'Inventory Code': z.string().trim().min(1, 'Inventory Code is required'),
  'PhytoData': z.string().trim().min(1, 'PhytoData is required'),
  'UPN': z.string().trim().min(1, 'UPN is required'),
  'Consec no': z.string().trim().min(1, 'Consec no is required'),
  'Target Country': z.string().trim().min(1, 'Target Country is required'),
  'Production Area': z.string().trim().min(1, 'Production Area is required'),
});

export type CSVRow = z.infer<typeof csvRowSchema>;

export interface ValidationError {
  row: number;
  column: string;
  value: string;
  error: string;
}

export interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  missingColumns: string[];
  errors: ValidationError[];
  data: any[];
}
