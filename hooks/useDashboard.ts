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

    const fetchDashboard = async () => {
         const result = await fetchATMs();
            setData(result);
    }

    useFocusEffect (
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
    };
}