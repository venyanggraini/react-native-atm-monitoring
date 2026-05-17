import { fetchATMs } from "@/services/atmService";
import { ATM } from "@/types/atm";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

const countByStatus = <T, K extends keyof T>(data: T[], key: K) => {
    const result: Record<string, number>= {};

    data.forEach((item: any) => {
        const value = String(item[key]);
        result[value] = (result[value] || 0) + 1;
    });

    return result;
};

export default function useDashboard() {
    const [data, setData] = useState<ATM[]>([]);
    const [error, setError] = useState('');

    const fetchDashboard = async () => {
        try {
            const result = await fetchATMs();
            setData(result);
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || 'Failed to load dashboard data');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDashboard();
        }, [])
    );

    return {
        totalATM: data.length,
        atmStatus: countByStatus(data, 'atmStatus'),
        cashStatus: countByStatus(data, 'cashRemainingStatus'),
        printerStatus: countByStatus(data, 'receiptPrinterStatus'),
        cardReaderStatus: countByStatus(data, 'cardReaderStatus'),
        error,
        clearError: () => setError(''),
    };
}