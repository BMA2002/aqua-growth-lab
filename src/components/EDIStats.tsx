import { Package, Container, FileText, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EDIStatsProps {
  totalRecords: number;
  containerCount: number;
  palletCount: number;
  cartonCount: number;
}

export const EDIStats = ({ 
  totalRecords, 
  containerCount, 
  palletCount, 
  cartonCount 
}: EDIStatsProps) => {
  const stats = [
    {
      label: 'Total Records',
      value: totalRecords,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Containers',
      value: containerCount,
      icon: Container,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Pallets',
      value: palletCount,
      icon: Package,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'Cartons',
      value: cartonCount,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
