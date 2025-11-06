import { EDIFileLog } from '@/types/edi';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Network, Package } from 'lucide-react';

interface FileLogCardProps {
  fileLog: Partial<EDIFileLog>;
}

export const FileLogCard = ({ fileLog }: FileLogCardProps) => {
  const details = [
    {
      icon: Network,
      label: 'Network Address',
      value: fileLog.networkAddress || '-',
    },
    {
      icon: FileText,
      label: 'Batch Number',
      value: fileLog.batchNumber || '-',
    },
    {
      icon: Calendar,
      label: 'Date',
      value: fileLog.date || '-',
    },
    {
      icon: Clock,
      label: 'Time',
      value: fileLog.time || '-',
    },
    {
      icon: Package,
      label: 'Provider',
      value: fileLog.provider || '-',
    },
    {
      icon: FileText,
      label: 'Version',
      value: fileLog.versionNumber || '-',
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <h2 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
          <FileText className="h-6 w-6" />
          EDI File Information
        </h2>
        {fileLog.status && (
          <Badge 
            className="mt-2"
            variant={fileLog.status === 'completed' ? 'default' : 'secondary'}
          >
            {fileLog.status.toUpperCase()}
          </Badge>
        )}
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail) => {
          const Icon = detail.icon;
          return (
            <div key={detail.label} className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{detail.label}</span>
              </div>
              <p className="text-lg font-semibold font-mono">{detail.value}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
