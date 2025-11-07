import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface ConversionResult {
  success: boolean;
  data: any[];
  headers: string[];
  rowCount: number;
  message?: string;
}

export class TextToExcelConverter {
  /**
   * Detect delimiter in text content
   */
  private detectDelimiter(content: string): string {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return ',';

    const firstLine = lines[0];
    const delimiters = ['\t', ',', '|', ';', ' '];
    let maxCount = 0;
    let detectedDelimiter = ',';

    for (const delimiter of delimiters) {
      const count = firstLine.split(delimiter).length;
      if (count > maxCount) {
        maxCount = count;
        detectedDelimiter = delimiter;
      }
    }

    return detectedDelimiter;
  }

  /**
   * Parse text content to structured data
   */
  parseTextContent(content: string): ConversionResult {
    try {
      // Remove empty lines
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        return {
          success: false,
          data: [],
          headers: [],
          rowCount: 0,
          message: 'File is empty'
        };
      }

      // Detect delimiter
      const delimiter = this.detectDelimiter(content);

      // Parse with Papa Parse
      const parseResult = Papa.parse(content, {
        delimiter,
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim()
      });

      if (parseResult.errors.length > 0) {
        console.warn('Parse warnings:', parseResult.errors);
      }

      const data = parseResult.data;
      const headers = parseResult.meta.fields || [];

      return {
        success: true,
        data,
        headers,
        rowCount: data.length,
        message: `Successfully parsed ${data.length} rows with ${headers.length} columns`
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        headers: [],
        rowCount: 0,
        message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Convert text content to Excel file
   */
  convertToExcel(content: string, fileName: string): boolean {
    try {
      const result = this.parseTextContent(content);
      
      if (!result.success || result.data.length === 0) {
        throw new Error(result.message || 'No data to convert');
      }

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Add data sheet
      const ws = XLSX.utils.json_to_sheet(result.data);
      
      // Auto-size columns
      const colWidths = result.headers.map(header => ({
        wch: Math.max(header.length, 15)
      }));
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Data');

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const baseFileName = fileName.replace(/\.[^/.]+$/, '');
      const excelFileName = `${baseFileName}_converted_${timestamp}.xlsx`;

      // Download
      XLSX.writeFile(wb, excelFileName);

      return true;
    } catch (error) {
      console.error('Excel conversion error:', error);
      return false;
    }
  }

  /**
   * Convert text content to CSV file
   */
  convertToCSV(content: string, fileName: string): boolean {
    try {
      const result = this.parseTextContent(content);
      
      if (!result.success || result.data.length === 0) {
        throw new Error(result.message || 'No data to convert');
      }

      // Convert to CSV using Papa Parse
      const csv = Papa.unparse(result.data, {
        header: true,
        delimiter: ',',
        newline: '\r\n'
      });

      // Create download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const baseFileName = fileName.replace(/\.[^/.]+$/, '');
      const csvFileName = `${baseFileName}_converted_${timestamp}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', csvFileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error('CSV conversion error:', error);
      return false;
    }
  }
}
