export interface EDIFileLog {
  id: string;
  networkAddress: string;
  batchNumber: string;
  date: string;
  time: string;
  provider: string;
  versionNumber: string;
  totalCartonCount: number;
  totalPalletCount: number;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: string;
}

export interface ContainerSeal {
  id: string;
  containerNo: string;
  sealNumber: string;
  shipName: string;
  voyageNo: string;
  callSign: string;
  stuffDate: string;
  consecNo: string;
}

export interface PalletOut {
  id: string;
  palletNo: string;
  loadRef: string;
  cartonCount: number;
  containerNo: string;
  status: string;
}

export interface ProcessedRecord {
  type: 'BH' | 'OH' | 'OL' | 'OK' | 'OC' | 'OP' | 'BT';
  data: any;
  lineNumber: number;
}
