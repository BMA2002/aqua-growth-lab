import { EDIFileLog, ContainerSeal, ProcessedRecord } from '@/types/edi';

export class EDIParser {
  private ediFileLog: Partial<EDIFileLog> = {};
  private containerSeals: ContainerSeal[] = [];
  private processedRecords: ProcessedRecord[] = [];

  parseFile(fileContent: string): {
    fileLog: Partial<EDIFileLog>;
    containers: ContainerSeal[];
    records: ProcessedRecord[];
  } {
    const lines = fileContent.split('\n');
    
    lines.forEach((line, index) => {
      if (line.trim().length < 2) return;
      
      const recordType = line.substring(0, 2);
      this.processLine(recordType, line, index + 1);
    });

    return {
      fileLog: this.ediFileLog,
      containers: this.containerSeals,
      records: this.processedRecords,
    };
  }

  private processLine(recordType: string, line: string, lineNumber: number) {
    switch (recordType) {
      case 'BH':
        this.handleBatchHeader(line, lineNumber);
        break;
      case 'OH':
        this.handleOrderHeader(line, lineNumber);
        break;
      case 'OL':
        this.handleOrderLine(line, lineNumber);
        break;
      case 'OK':
        this.handleContainer(line, lineNumber);
        break;
      case 'OC':
        this.handleOrderClose(line, lineNumber);
        break;
      case 'OP':
        this.handlePallet(line, lineNumber);
        break;
      case 'BT':
        this.handleBatchTrailer(line, lineNumber);
        break;
    }
  }

  private handleBatchHeader(line: string, lineNumber: number) {
    this.ediFileLog = {
      networkAddress: this.extract(line, 2, 3),
      batchNumber: this.extract(line, 5, 6),
      date: this.convertDate(this.extract(line, 11, 8)),
      time: this.extract(line, 19, 8),
      provider: this.extract(line, 27, 30).trim(),
      versionNumber: this.extract(line, 57, 30).trim(),
      totalCartonCount: 0,
      totalPalletCount: 0,
      status: 'processing',
    };

    this.processedRecords.push({
      type: 'BH',
      data: this.ediFileLog,
      lineNumber,
    });
  }

  private handleOrderHeader(line: string, lineNumber: number) {
    const loadRef = this.extract(line, 12, 10);
    
    this.processedRecords.push({
      type: 'OH',
      data: { loadRef },
      lineNumber,
    });
  }

  private handleOrderLine(line: string, lineNumber: number) {
    this.processedRecords.push({
      type: 'OL',
      data: {},
      lineNumber,
    });
  }

  private handleContainer(line: string, lineNumber: number) {
    const containerNo = this.extract(line, 19, 11).trim();
    const sealNumber = this.extract(line, 225, 15).trim();
    const consecNo = this.extract(line, 240, 10).trim();
    const shipName = this.extract(line, 270, 25).trim();
    const voyageNo = this.extract(line, 295, 10).trim();
    const callSign = this.extract(line, 305, 10).trim();
    const stuffDate = this.extract(line, 58, 13).trim();

    if (containerNo && sealNumber) {
      const container: ContainerSeal = {
        id: `${containerNo}-${Date.now()}`,
        containerNo,
        sealNumber,
        shipName,
        voyageNo,
        callSign,
        stuffDate,
        consecNo,
      };

      this.containerSeals.push(container);
      
      this.processedRecords.push({
        type: 'OK',
        data: container,
        lineNumber,
      });
    }
  }

  private handleOrderClose(line: string, lineNumber: number) {
    this.processedRecords.push({
      type: 'OC',
      data: {},
      lineNumber,
    });
  }

  private handlePallet(line: string, lineNumber: number) {
    this.processedRecords.push({
      type: 'OP',
      data: {},
      lineNumber,
    });
  }

  private handleBatchTrailer(line: string, lineNumber: number) {
    this.processedRecords.push({
      type: 'BT',
      data: {},
      lineNumber,
    });
  }

  private extract(line: string, start: number, length: number): string {
    return line.substring(start, start + length) || '';
  }

  private convertDate(dateStr: string): string {
    if (dateStr.length !== 8) return dateStr;
    
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}-${month}-${day}`;
  }
}
