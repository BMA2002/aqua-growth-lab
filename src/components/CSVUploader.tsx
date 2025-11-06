import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CSVValidator } from '@/utils/csvValidator';
import { ValidationResult } from '@/types/csv';

interface CSVUploaderProps {
  onValidationComplete: (result: ValidationResult) => void;
}

export const CSVUploader = ({ onValidationComplete }: CSVUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [validator] = useState(() => new CSVValidator());

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setUploadStatus('processing');
    setUploadedFile(file.name);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let result: ValidationResult;

      if (fileExtension === 'csv') {
        result = await validator.validateCSV(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        result = await validator.validateExcel(file);
      } else {
        setUploadStatus('error');
        return;
      }

      setUploadStatus(result.isValid ? 'success' : 'error');
      onValidationComplete(result);
    } catch (error) {
      setUploadStatus('error');
      onValidationComplete({
        isValid: false,
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        missingColumns: [],
        errors: [{ 
          row: 0, 
          column: 'File', 
          value: '', 
          error: 'Failed to process file' 
        }],
        data: [],
      });
    }
  }, [validator, onValidationComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle2 className="h-12 w-12 text-success" />;
      case 'error':
        return <AlertCircle className="h-12 w-12 text-destructive" />;
      case 'processing':
        return <FileSpreadsheet className="h-12 w-12 text-accent animate-pulse" />;
      default:
        return <Upload className={cn(
          "h-12 w-12",
          isDragging ? "text-primary" : "text-muted-foreground"
        )} />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'success':
        return 'Validation Complete - All Data Valid';
      case 'error':
        return 'Validation Issues Found';
      case 'processing':
        return 'Processing File...';
      default:
        return 'Drop your CSV or Excel file here';
    }
  };

  return (
    <Card className={cn(
      "border-2 border-dashed transition-all duration-200",
      isDragging && "border-primary bg-primary/5 scale-[1.02]",
      uploadStatus === 'success' && "border-success bg-success/5",
      uploadStatus === 'error' && "border-destructive bg-destructive/5"
    )}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="p-12 flex flex-col items-center justify-center text-center space-y-4"
      >
        <div className={cn(
          "p-6 rounded-full transition-colors",
          isDragging && "bg-primary/10",
          uploadStatus === 'success' && "bg-success/10",
          uploadStatus === 'error' && "bg-destructive/10",
          uploadStatus === 'processing' && "bg-accent/10",
          uploadStatus === 'idle' && "bg-muted"
        )}>
          {getStatusIcon()}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            {getStatusText()}
          </h3>
          <p className="text-muted-foreground">
            {uploadStatus === 'idle' && 'Supports CSV and Excel files (.csv, .xlsx, .xls)'}
            {uploadStatus === 'processing' && `Validating: ${uploadedFile}`}
            {uploadStatus === 'success' && `File validated: ${uploadedFile}`}
            {uploadStatus === 'error' && `Problems detected in: ${uploadedFile}`}
          </p>
        </div>

        {(uploadStatus === 'idle' || uploadStatus === 'error') && (
          <>
            <input
              type="file"
              id="csv-upload"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
            />
            <Button asChild size="lg" className="gap-2">
              <label htmlFor="csv-upload" className="cursor-pointer">
                <FileSpreadsheet className="h-4 w-4" />
                Select File
              </label>
            </Button>
          </>
        )}

        {(uploadStatus === 'success' || uploadStatus === 'error') && (
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              setUploadStatus('idle');
              setUploadedFile(null);
            }}
          >
            Upload Another File
          </Button>
        )}
      </div>
    </Card>
  );
};
