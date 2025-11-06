import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { REQUIRED_COLUMNS, csvRowSchema, ValidationResult, ValidationError } from '@/types/csv';

export class CSVValidator {
  validateCSV(file: File): Promise<ValidationResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validationResult = this.validateData(results.data, results.meta.fields || []);
          resolve(validationResult);
        },
        error: (error) => {
          resolve({
            isValid: false,
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            missingColumns: [],
            errors: [{ row: 0, column: 'File', value: '', error: error.message }],
            data: [],
          });
        },
      });
    });
  }

  validateExcel(file: File): Promise<ValidationResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: '',
          });
          
          if (jsonData.length === 0) {
            resolve({
              isValid: false,
              totalRows: 0,
              validRows: 0,
              invalidRows: 0,
              missingColumns: [],
              errors: [{ row: 0, column: 'File', value: '', error: 'Empty file' }],
              data: [],
            });
            return;
          }

          // First row is headers
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          // Convert to object format
          const objectData = rows.map((row) => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] !== undefined ? String(row[index]).trim() : '';
            });
            return obj;
          });

          const validationResult = this.validateData(objectData, headers);
          resolve(validationResult);
        } catch (error) {
          resolve({
            isValid: false,
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            missingColumns: [],
            errors: [{ 
              row: 0, 
              column: 'File', 
              value: '', 
              error: error instanceof Error ? error.message : 'Unknown error' 
            }],
            data: [],
          });
        }
      };

      reader.onerror = () => {
        resolve({
          isValid: false,
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
          missingColumns: [],
          errors: [{ row: 0, column: 'File', value: '', error: 'Failed to read file' }],
          data: [],
        });
      };

      reader.readAsBinaryString(file);
    });
  }

  private validateData(data: any[], headers: string[]): ValidationResult {
    const errors: ValidationError[] = [];
    const missingColumns: string[] = [];
    
    // Check for missing columns
    REQUIRED_COLUMNS.forEach((column) => {
      if (!headers.includes(column)) {
        missingColumns.push(column);
      }
    });

    // If there are missing columns, return early
    if (missingColumns.length > 0) {
      return {
        isValid: false,
        totalRows: data.length,
        validRows: 0,
        invalidRows: data.length,
        missingColumns,
        errors: missingColumns.map((col) => ({
          row: 0,
          column: col,
          value: '',
          error: 'Column is missing from the file',
        })),
        data: [],
      };
    }

    // Validate each row
    let validRows = 0;
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because: 1 for header row, 1 for 0-based index
      
      try {
        // Validate using zod schema
        csvRowSchema.parse(row);
        validRows++;
      } catch (error: any) {
        if (error.errors) {
          error.errors.forEach((err: any) => {
            const column = err.path[0];
            errors.push({
              row: rowNumber,
              column: String(column),
              value: row[column] || '',
              error: err.message,
            });
          });
        }
      }

      // Additional check for empty/whitespace values
      REQUIRED_COLUMNS.forEach((column) => {
        const value = row[column];
        if (value === undefined || value === null || String(value).trim() === '') {
          // Only add if not already added by zod validation
          const existingError = errors.find(
            (e) => e.row === rowNumber && e.column === column
          );
          if (!existingError) {
            errors.push({
              row: rowNumber,
              column,
              value: String(value || ''),
              error: `${column} is missing or empty`,
            });
          }
        }
      });
    });

    const invalidRows = data.length - validRows;

    return {
      isValid: errors.length === 0 && missingColumns.length === 0,
      totalRows: data.length,
      validRows,
      invalidRows,
      missingColumns,
      errors,
      data: errors.length === 0 ? data : [],
    };
  }
}
