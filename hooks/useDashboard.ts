import { fetchATMs } from "@/services/atmService";
import { useEffect, useState } from "react";

interface ATM {
    id: string;
    atm_status: string;
    cash: string;
    printer: string;
    cardReader: string;
}

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

    useEffect(() => {
        const loadData = async () => {
            const atmData = await fetchATMs();
            setData(atmData);
        };

        loadData();
    }, []);

    return {
        totalATM: data.length,
        atmStatus: countByStatus(data, 'atm_status'),
        cashStatus: countByStatus(data, 'cash'),
        printerStatus: countByStatus(data, 'printer'),
        cardReaderStatus: countByStatus(data, 'cardReader'),
    };
}