export type ATMStatus =
  | 'ONLINE'
  | 'OFFLINE'
  | 'OUT_OF_SERVICE';

export type DeviceHealth =
  | 'NORMAL'
  | 'LOW'
  | 'NEARLY_FULL'
  | 'FULL'
  | 'EMPTY'
  | 'WARNING'
  | 'ERROR';

export interface ATM {
    atmId?: string;
    atmStatus?: ATMStatus;
    cashRemainingStatus?: DeviceHealth;
    cardReaderStatus?: DeviceHealth;
    receiptPrinterStatus?: DeviceHealth;
}

export type ATMFilter = Partial<ATM>;