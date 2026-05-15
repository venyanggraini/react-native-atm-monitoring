import { ATMFilter } from '@/types/atm';
import axios from 'axios';
import { BASE_URL } from './api';

export const fetchATMs = async (filters?: ATMFilter) => {
  const { data } = await axios.post(
    `${BASE_URL}/devices`,
    filters || {}, 
    {
        headers: {
        'Content-Type': 'application/json',
        },
    }
  );

  return data.map((item: any) => ({
    id: item.atmId,
    atmStatus: item.atmStatus,
    cash: item.cashRemainingStatus,
    printer: item.receiptPrinterStatus,
    cardReader: item.cardReaderStatus,
  }));
};