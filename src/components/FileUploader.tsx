import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileUpload: (content: string, fileName: string) => void;
}

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadedFile(file.name);
      setUploadStatus('success');
      onFileUpload(content, file.name);
    };

    reader.onerror = () => {
      setUploadStatus('error');
    };

    reader.readAsText(file);
  }, [onFileUpload]);

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

  return (
    <Card className={cn(
      "border-2 border-dashed transition-all duration-200",
      isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border",
      uploadStatus === 'success' && "border-success bg-success/5"
    )}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="p-12 flex flex-col items-center justify-center text-center space-y-4"
      >
        <div className={cn(
          "p-6 rounded-full transition-colors",
          isDragging ? "bg-primary/10" : "bg-muted",
          uploadStatus === 'success' && "bg-success/10"
        )}>
          {uploadStatus === 'success' ? (
            <CheckCircle2 className="h-12 w-12 text-success" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="h-12 w-12 text-destructive" />
          ) : (
            <Upload className={cn(
              "h-12 w-12",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            {uploadStatus === 'success' ? 'File Uploaded Successfully' : 'Drop your file here'}
          </h3>
          <p className="text-muted-foreground">
            {uploadStatus === 'success' 
              ? `Processing: ${uploadedFile}`
              : 'Supports EDI, TXT, CSV, and DAT files'
            }
          </p>
        </div>

        {uploadStatus === 'idle' && (
          <>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".txt,.dat,.edi,.csv"
              onChange={handleFileSelect}
            />
            <Button asChild size="lg" className="gap-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="h-4 w-4" />
                Select File
              </label>
            </Button>
          </>
        )}

        {uploadStatus === 'success' && (
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
