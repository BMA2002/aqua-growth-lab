import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUploader } from '@/components/FileUploader';
import { EDIStats } from '@/components/EDIStats';
import { ContainerTable } from '@/components/ContainerTable';
import { FileLogCard } from '@/components/FileLogCard';
import { EDIParser } from '@/utils/ediParser';
import { ContainerSeal, EDIFileLog } from '@/types/edi';
import { toast } from 'sonner';
import { FileCode, Waves, FileSpreadsheet, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import * as XLSX from 'xlsx';

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

  const handleConvertToExcel = () => {
    if (!containers.length) {
      toast.error('No data to export', {
        description: 'Please upload and process an EDI file first.',
      });
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = containers.map(container => ({
        'Container Number': container.containerNo,
        'Seal Number': container.sealNumber,
        'Ship Name': container.shipName,
        'Voyage Number': container.voyageNo,
        'Call Sign': container.callSign,
        'Stuff Date': container.stuffDate,
        'Consecutive Number': container.consecNo,
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Containers');

      // Generate and download file
      const excelFileName = `${fileName.replace(/\.[^/.]+$/, '')}_converted.xlsx`;
      XLSX.writeFile(wb, excelFileName);

      toast.success('Excel file generated!', {
        description: `Downloaded: ${excelFileName}`,
      });
    } catch (error) {
      toast.error('Error generating Excel file', {
        description: 'Please try again.',
      });
      console.error('Excel generation error:', error);
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
        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileCode className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">EDI File Import</h3>
                <p className="text-muted-foreground">
                  Process purchase order EDI files and extract container information
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-secondary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <FileSpreadsheet className="h-8 w-8 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">CSV/Excel Validation</h3>
                <p className="text-muted-foreground mb-4">
                  Upload and validate shipping data with comprehensive error checking
                </p>
                <Button asChild variant="default" className="gap-2">
                  <Link to="/import">
                    Go to Validator
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-accent/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Download className="h-8 w-8 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">PO to Excel Converter</h3>
                <p className="text-muted-foreground mb-4">
                  Convert processed EDI files to Excel format for easy sharing
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleConvertToExcel}
                  disabled={!containers.length}
                >
                  <Download className="h-4 w-4" />
                  Convert to Excel
                </Button>
              </div>
            </div>
          </Card>
        </section>

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
