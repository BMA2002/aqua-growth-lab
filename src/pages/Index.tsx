import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { EDIStats } from '@/components/EDIStats';
import { ContainerTable } from '@/components/ContainerTable';
import { FileLogCard } from '@/components/FileLogCard';
import { EDIParser } from '@/utils/ediParser';
import { ContainerSeal, EDIFileLog } from '@/types/edi';
import { toast } from 'sonner';
import { FileCode, Waves } from 'lucide-react';

const Index = () => {
  const [fileLog, setFileLog] = useState<Partial<EDIFileLog> | null>(null);
  const [containers, setContainers] = useState<ContainerSeal[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (content: string, name: string) => {
    try {
      const parser = new EDIParser();
      const result = parser.parseFile(content);

      setFileLog({
        ...result.fileLog,
        fileName: name,
        status: 'completed',
        createdAt: new Date().toISOString(),
        id: Date.now().toString(),
      });
      
      setContainers(result.containers);
      setTotalRecords(result.records.length);
      setFileName(name);

      toast.success('File processed successfully!', {
        description: `Processed ${result.records.length} records and found ${result.containers.length} containers.`,
      });
    } catch (error) {
      toast.error('Error processing file', {
        description: 'Please check the file format and try again.',
      });
      console.error('Parse error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
              <Waves className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EDI Import System
              </h1>
              <p className="text-muted-foreground">Purchase Order File Processing</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* File Upload Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Upload EDI File</h2>
          </div>
          <FileUploader onFileUpload={handleFileUpload} />
        </section>

        {/* Results Section */}
        {fileLog && (
          <>
            {/* Stats */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <EDIStats
                totalRecords={totalRecords}
                containerCount={containers.length}
                palletCount={fileLog.totalPalletCount || 0}
                cartonCount={fileLog.totalCartonCount || 0}
              />
            </section>

            {/* File Log Details */}
            <section>
              <FileLogCard fileLog={fileLog} />
            </section>

            {/* Container Table */}
            <section>
              <ContainerTable containers={containers} />
            </section>
          </>
        )}

        {/* Empty State */}
        {!fileLog && (
          <section className="text-center py-16">
            <div className="inline-flex p-6 bg-muted rounded-full mb-4">
              <FileCode className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No File Loaded</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload an EDI file to start processing purchase orders, containers, and shipping information.
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>EDI Import System - Processing purchase order files efficiently</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
