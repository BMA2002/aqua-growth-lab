import { EDIFileLog, ContainerSeal, ProcessedRecord } from '@/types/edi';
import { validateEDIFile, containerDataSchema } from './ediValidator';

export class EDIParser {
  private ediFileLog: Partial<EDIFileLog> = {};
  private containerSeals: ContainerSeal[] = [];
  private processedRecords: ProcessedRecord[] = [];

  parseFile(fileContent: string): {
    fileLog: Partial<EDIFileLog>;
    containers: ContainerSeal[];
    records: ProcessedRecord[];
  } {
    // Validate file before processing
    const validation = validateEDIFile(fileContent);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

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
    const rawContainer = {
      id: `${Date.now()}-${Math.random()}`,
      season: this.extract(line, 2, 2).trim() || null,
      locationCode: this.extract(line, 4, 4).trim() || null,
      organization: this.extract(line, 8, 10).trim() || null,
      stuffDate: this.extract(line, 58, 13).trim() || null,
      containerNo: this.extract(line, 19, 11).trim(),
      sealNumber: this.extract(line, 225, 15).trim() || null,
      barcode: this.extract(line, 71, 30).trim() || null,
      noCartons: parseInt(this.extract(line, 101, 4).trim()) || null,
      gross: parseFloat(this.extract(line, 105, 8).trim()) || null,
      nett: parseFloat(this.extract(line, 113, 8).trim()) || null,
      commodityCode: this.extract(line, 121, 3).trim() || null,
      varietyCode: this.extract(line, 124, 5).trim() || null,
      gradeCode: this.extract(line, 129, 2).trim() || null,
      packCode: this.extract(line, 131, 3).trim() || null,
      countCode: this.extract(line, 134, 4).trim() || null,
      markCode: this.extract(line, 138, 5).trim() || null,
      targetMarket: this.extract(line, 143, 3).trim() || null,
      country: this.extract(line, 146, 2).trim() || null,
      farmNo: this.extract(line, 148, 10).trim() || null,
      phc: this.extract(line, 158, 10).trim() || null,
      orchard: this.extract(line, 168, 10).trim() || null,
      inspectionDate: this.extract(line, 178, 8).trim() || null,
      inspPoint: this.extract(line, 186, 3).trim() || null,
      inspCode: this.extract(line, 189, 4).trim() || null,
      originalIntakeDate: this.extract(line, 193, 8).trim() || null,
      consignmentNoteNo: this.extract(line, 201, 15).trim() || null,
      temptale: this.extract(line, 216, 9).trim() || null,
      inventoryCode: this.extract(line, 240, 1).trim() || null,
      phytoData: this.extract(line, 241, 20).trim() || null,
      upn: this.extract(line, 261, 9).trim() || null,
      consecNo: this.extract(line, 240, 10).trim() || null,
      targetCountry: this.extract(line, 250, 2).trim() || null,
      productionArea: this.extract(line, 252, 10).trim() || null,
      shipName: this.extract(line, 270, 25).trim() || null,
      voyageNo: this.extract(line, 295, 10).trim() || null,
      callSign: this.extract(line, 305, 10).trim() || null,
    };

    // Validate container data before adding
    const validationResult = containerDataSchema.safeParse({
      season: rawContainer.season,
      location_code: rawContainer.locationCode,
      organization: rawContainer.organization,
      stuff_date: rawContainer.stuffDate,
      container_no: rawContainer.containerNo,
      seal_number: rawContainer.sealNumber,
      barcode: rawContainer.barcode,
      no_cartons: rawContainer.noCartons,
      gross: rawContainer.gross,
      nett: rawContainer.nett,
      commodity_code: rawContainer.commodityCode,
      variety_code: rawContainer.varietyCode,
      grade_code: rawContainer.gradeCode,
      pack_code: rawContainer.packCode,
      count_code: rawContainer.countCode,
      mark_code: rawContainer.markCode,
      target_market: rawContainer.targetMarket,
      country: rawContainer.country,
      farm_no: rawContainer.farmNo,
      phc: rawContainer.phc,
      orchard: rawContainer.orchard,
      inspection_date: rawContainer.inspectionDate,
      insp_point: rawContainer.inspPoint,
      insp_code: rawContainer.inspCode,
      original_intake_date: rawContainer.originalIntakeDate,
      consignment_note_no: rawContainer.consignmentNoteNo,
      temptale: rawContainer.temptale,
      inventory_code: rawContainer.inventoryCode,
      phyto_data: rawContainer.phytoData,
      upn: rawContainer.upn,
      consec_no: rawContainer.consecNo,
      target_country: rawContainer.targetCountry,
      production_area: rawContainer.productionArea,
      ship_name: rawContainer.shipName,
      voyage_no: rawContainer.voyageNo,
      call_sign: rawContainer.callSign,
    });

    if (!validationResult.success) {
      throw new Error(`Container validation failed at line ${lineNumber}: ${validationResult.error.errors[0].message}`);
    }

    const container: ContainerSeal = rawContainer;

    if (container.containerNo) {
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
