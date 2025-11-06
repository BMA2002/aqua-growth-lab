import { ContainerSeal } from '@/types/edi';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ship, Lock, Navigation } from 'lucide-react';

interface ContainerTableProps {
  containers: ContainerSeal[];
}

export const ContainerTable = ({ containers }: ContainerTableProps) => {
  if (containers.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <Ship className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No container data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Ship className="h-6 w-6 text-primary" />
          Container & Seal Information
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Container No.</TableHead>
              <TableHead>Seal Number</TableHead>
              <TableHead>Ship Name</TableHead>
              <TableHead>Voyage No.</TableHead>
              <TableHead>Call Sign</TableHead>
              <TableHead>Stuff Date</TableHead>
              <TableHead>Consec No.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {containers.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="font-mono font-semibold">
                  <Badge variant="outline" className="gap-1">
                    <Navigation className="h-3 w-3" />
                    {container.containerNo}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" />
                    {container.sealNumber}
                  </Badge>
                </TableCell>
                <TableCell>{container.shipName || '-'}</TableCell>
                <TableCell className="font-mono">{container.voyageNo || '-'}</TableCell>
                <TableCell className="font-mono">{container.callSign || '-'}</TableCell>
                <TableCell>{container.stuffDate || '-'}</TableCell>
                <TableCell className="font-mono">{container.consecNo || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
