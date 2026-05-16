import { ATMFilter } from '@/types/atm';
import logger from '@/utils/logger';
import apiClient from './api';

const ATM_URL = `/v1/atm`;
const TAG = 'AtmService';

export const fetchATMs = async (filters?: ATMFilter) => {
  logger.info(TAG, 'Fetching ATMs', filters ?? 'no filters');
  const { data } = await apiClient.post(
    `${ATM_URL}/devices`,
    filters || {},
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const result = data.map((item: any) => ({
    atmId: item.atmId,
    atmStatus: item.atmStatus,
    cashRemainingStatus: item.cashRemainingStatus,
    receiptPrinterStatus: item.receiptPrinterStatus,
    cardReaderStatus: item.cardReaderStatus,
  }));

  logger.info(TAG, `Fetched ${result.length} ATM(s)`);
  return result;
};