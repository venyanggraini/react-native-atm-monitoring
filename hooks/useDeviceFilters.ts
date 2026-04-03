import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

export default function useDeviceFilters(data: any[]) {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [selectedATM, setSelectedATM] = useState('');
    const [deviceType, setDeviceType] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        setDeviceType(params.type ? Array.isArray(params.type) ? params.type[0] : params.type : '');
        setStatus(params.status ? Array.isArray(params.status) ? params.status[0] : params.status : '');
        setSelectedATM(params.atm ? Array.isArray(params.atm) ? params.atm[0] : params.atm : '');
    }, [params.type, params.status, params.atm]);


    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchATM = selectedATM 
                ? String(item.id).toLowerCase() === String(selectedATM).toLowerCase()
                : true;
            
            const matchStatus = (deviceType && status)
                ? String(item[deviceType].toLowerCase()) === String(status.toLowerCase())
                : deviceType 
                ? item.hasOwnProperty(deviceType)
                : true

            return matchATM && matchStatus;
        });
    }, [data, selectedATM, deviceType, status]);

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
        filteredData, clearFilters,
    };
}