import { ATM, ATMFilter } from '@/types/atm';
import logger from '@/utils/logger';
import api from './api';

const TAG = 'AtmService';

export const fetchATMs = async (filters?: ATMFilter): Promise<ATM[]> => {
  logger.info(TAG, 'Fetching ATMs', filters ?? 'no filters');
  const result = await api.post<ATM[]>(`/v1/atm/devices`, filters ?? {});
  logger.info(TAG, `Fetched ${result.length} ATM(s)`);
  return result;
};