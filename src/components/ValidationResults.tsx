import { ValidationResult } from '@/types/csv';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileX, 
  TableProperties,
  FileCheck,
  Download
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ValidationResultsProps {
  result: ValidationResult;
}

export const ValidationResults = ({ result }: ValidationResultsProps) => {
  const handleExportToExcel = () => {
    try {
      toast.loading('Generating Excel report...', { id: 'excel-export' });

      const wb = XLSX.utils.book_new();

      // Summary sheet
      const summaryData = [
        { 'Metric': 'Total Rows', 'Value': result.totalRows },
        { 'Metric': 'Valid Rows', 'Value': result.validRows },
        { 'Metric': 'Invalid Rows', 'Value': result.invalidRows },
        { 'Metric': 'Validation Status', 'Value': result.isValid ? 'PASSED' : 'FAILED' },
        { 'Metric': 'Missing Columns', 'Value': result.missingColumns.length },
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // Missing columns sheet
      if (result.missingColumns.length > 0) {
        const missingColsData = result.missingColumns.map((col, idx) => ({
          'No.': idx + 1,
          'Missing Column': col
        }));
        const wsMissing = XLSX.utils.json_to_sheet(missingColsData);
        XLSX.utils.book_append_sheet(wb, wsMissing, 'Missing Columns');
      }

      // Errors sheet
      if (result.errors.length > 0) {
        const errorsData = result.errors.map((err, idx) => ({
          'No.': idx + 1,
          'Row': err.row,
          'Column': err.column,
          'Value': err.value,
          'Error': err.error
        }));
        const wsErrors = XLSX.utils.json_to_sheet(errorsData);
        wsErrors['!cols'] = [{ wch: 5 }, { wch: 8 }, { wch: 20 }, { wch: 20 }, { wch: 40 }];
        XLSX.utils.book_append_sheet(wb, wsErrors, 'Errors');
      }

      // Valid data sheet
      if (result.data.length > 0) {
        const wsData = XLSX.utils.json_to_sheet(result.data);
        XLSX.utils.book_append_sheet(wb, wsData, 'Valid Data');
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Validation_Report_${timestamp}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success('Excel report generated!', {
        id: 'excel-export',
        description: `Downloaded: ${fileName}`,
      });
    } catch (error) {
      toast.error('Error generating Excel report', {
        id: 'excel-export',
        description: 'Please try again.',
      });
    }
  };

  const errorsByRow = result.errors.reduce((acc, error) => {
    if (!acc[error.row]) {
      acc[error.row] = [];
    }
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, typeof result.errors>);

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Validation Results</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive analysis of your uploaded file
            </p>
          </div>
          <Button 
            variant="default"
            size="lg"
            className="gap-2"
            onClick={handleExportToExcel}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <TableProperties className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Rows</p>
              <p className="text-2xl font-bold">{result.totalRows}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valid Rows</p>
              <p className="text-2xl font-bold text-success">{result.validRows}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Invalid Rows</p>
              <p className="text-2xl font-bold text-destructive">{result.invalidRows}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Errors</p>
              <p className="text-2xl font-bold text-warning">{result.errors.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Missing Columns Alert */}
      {result.missingColumns.length > 0 && (
        <Alert variant="destructive">
          <FileX className="h-4 w-4" />
          <AlertTitle>Missing Required Columns</AlertTitle>
          <AlertDescription>
            <p className="mb-2">The following required columns are missing from your file:</p>
            <div className="flex flex-wrap gap-2">
              {result.missingColumns.map((column) => (
                <Badge key={column} variant="destructive">
                  {column}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {result.isValid && (
        <Alert className="border-success bg-success/5">
          <FileCheck className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">Validation Successful</AlertTitle>
          <AlertDescription>
            All {result.totalRows} rows have been validated successfully. All required columns are present and no missing data was found.
          </AlertDescription>
        </Alert>
      )}

      {/* Errors Table */}
      {result.errors.length > 0 && result.missingColumns.length === 0 && (
        <Card>
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Validation Errors ({result.errors.length})
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Review and fix the following issues in your file
            </p>
          </div>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Row #</TableHead>
                  <TableHead>Column</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.errors.map((error, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono font-bold">
                      <Badge variant="destructive">{error.row}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      <Badge variant="outline">{error.column}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {error.value || <span className="italic text-xs">empty</span>}
                    </TableCell>
                    <TableCell className="text-destructive">
                      {error.error}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}

      {/* Grouped Errors by Row */}
      {result.errors.length > 0 && result.missingColumns.length === 0 && Object.keys(errorsByRow).length <= 20 && (
        <Card>
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileX className="h-5 w-5 text-destructive" />
              Errors Grouped by Row
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Quick view of which rows have issues
            </p>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(errorsByRow).map(([row, errors]) => (
              <Alert key={row} variant="destructive">
                <AlertTitle className="flex items-center gap-2">
                  Row {row}
                  <Badge variant="destructive">{errors.length} error{errors.length > 1 ? 's' : ''}</Badge>
                </AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {errors.map((error, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-semibold">{error.column}</span>: {error.error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
