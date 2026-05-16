import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

const parseParam = (val: string | string[] | undefined): string =>
    val ? (Array.isArray(val) ? val[0] : val) : '';

export default function useDeviceFilters() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [selectedATM, setSelectedATM] = useState(() => parseParam(params.atm));
    const [deviceType, setDeviceType] = useState(() => parseParam(params.type));
    const [status, setStatus] = useState(() => parseParam(params.status));

    // Keeps state in sync when params change on an already-mounted screen
    useEffect(() => {
        setSelectedATM(parseParam(params.atm));
        setDeviceType(parseParam(params.type));
        setStatus(parseParam(params.status));
    }, [params.type, params.status, params.atm]);

    const clearFilters = () => {
        setSelectedATM('');
        setDeviceType('');
        setStatus('');
        router.setParams({ type: '', status: '', atm: '' });
    };

    return {
        selectedATM, setSelectedATM,
        deviceType, setDeviceType,
        status, setStatus,
        clearFilters,
    };
}