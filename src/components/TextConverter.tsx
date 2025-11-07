import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, FileSpreadsheet, FileType } from 'lucide-react';
import { TextToExcelConverter } from '@/utils/textToExcelConverter';
import { toast } from 'sonner';

interface TextConverterProps {
  content: string;
  fileName: string;
}

export const TextConverter = ({ content, fileName }: TextConverterProps) => {
  const [converting, setConverting] = useState(false);
  const [converter] = useState(() => new TextToExcelConverter());

  const handleConvertToExcel = () => {
    setConverting(true);
    toast.loading('Converting to Excel...', { id: 'convert-excel' });

    try {
      const success = converter.convertToExcel(content, fileName);
      
      if (success) {
        toast.success('Excel file generated!', {
          id: 'convert-excel',
          description: 'Your file has been converted and downloaded'
        });
      } else {
        toast.error('Conversion failed', {
          id: 'convert-excel',
          description: 'Unable to convert file. Please check the format.'
        });
      }
    } catch (error) {
      toast.error('Conversion error', {
        id: 'convert-excel',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setConverting(false);
    }
  };

  const handleConvertToCSV = () => {
    setConverting(true);
    toast.loading('Converting to CSV...', { id: 'convert-csv' });

    try {
      const success = converter.convertToCSV(content, fileName);
      
      if (success) {
        toast.success('CSV file generated!', {
          id: 'convert-csv',
          description: 'Your file has been converted and downloaded'
        });
      } else {
        toast.error('Conversion failed', {
          id: 'convert-csv',
          description: 'Unable to convert file. Please check the format.'
        });
      }
    } catch (error) {
      toast.error('Conversion error', {
        id: 'convert-csv',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setConverting(false);
    }
  };

  const previewResult = converter.parseTextContent(content);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Text File Converter</h3>
              <p className="text-sm text-muted-foreground">
                Convert your text file to Excel or CSV format
              </p>
            </div>
          </div>
        </div>

        {/* Preview Info */}
        {previewResult.success && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">Detected Rows</p>
              <p className="text-2xl font-bold">{previewResult.rowCount}</p>
            </Card>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">Detected Columns</p>
              <p className="text-2xl font-bold">{previewResult.headers.length}</p>
            </Card>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">File Name</p>
              <p className="text-sm font-mono truncate">{fileName}</p>
            </Card>
          </div>
        )}

        {/* Column Headers Preview */}
        {previewResult.success && previewResult.headers.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2">Detected Columns:</p>
            <div className="flex flex-wrap gap-2">
              {previewResult.headers.map((header, idx) => (
                <Badge key={idx} variant="outline">
                  {header}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Conversion Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 gap-2"
            onClick={handleConvertToExcel}
            disabled={converting || !previewResult.success}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Convert to Excel
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleConvertToCSV}
            disabled={converting || !previewResult.success}
          >
            <FileType className="h-4 w-4" />
            Convert to CSV
          </Button>
        </div>

        {/* Error Message */}
        {!previewResult.success && (
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive font-semibold">
              {previewResult.message || 'Unable to parse file'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
