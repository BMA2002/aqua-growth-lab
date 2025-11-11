import { useState } from 'react';
import { CSVUploader } from '@/components/CSVUploader';
import { ValidationResults } from '@/components/ValidationResults';
import { ValidationResult } from '@/types/csv';
import { FileSpreadsheet, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackButton } from '@/components/BackButton';

const Import = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-secondary to-primary rounded-lg">
                <FileSpreadsheet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  CSV/Excel Import & Validation
                </h1>
                <p className="text-muted-foreground">Import and validate shipping data files</p>
              </div>
            </div>
            <BackButton to="/" label="Back to Dashboard" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Upload Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-secondary" />
            <h2 className="text-xl font-semibold">Upload Data File</h2>
          </div>
          <CSVUploader onValidationComplete={setValidationResult} />
        </section>

        {/* Results Section */}
        {validationResult && (
          <section>
            <ValidationResults result={validationResult} />
          </section>
        )}

        {/* Help Section */}
        {!validationResult && (
          <section className="text-center py-16">
            <div className="inline-flex p-6 bg-muted rounded-full mb-4">
              <FileSpreadsheet className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No File Uploaded</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Upload a CSV or Excel file to validate your shipping data. The system will check for all required columns and identify any missing information.
            </p>
            
            <div className="max-w-3xl mx-auto mt-8">
              <h4 className="text-lg font-semibold mb-4">Required Columns:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                {[
                  'Season', 'Location Code', 'Organization', 'Stuff Date',
                  'Container No', 'Seal Number', 'Barcode', 'No Cartons',
                  'Gross', 'Nett', 'Commodity Code', 'Variety Code',
                  'Grade Code', 'Pack Code', 'Count Code', 'Mark Code',
                  'Target Market', 'Country', 'Farm No.', 'PHC',
                  'Orchard', 'Inspection Date', 'Insp. Point', 'Insp. Code',
                  'Original Intake Date', 'Consignment Note No.', 'Temptale',
                  'Inventory Code', 'PhytoData', 'UPN', 'Consec no',
                  'Target Country', 'Production Area'
                ].map((col) => (
                  <div key={col} className="p-2 bg-muted rounded text-xs">
                    {col}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Import;
