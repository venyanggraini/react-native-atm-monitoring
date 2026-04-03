import AlertModal from "@/components/AlertModal";
import HeaderComponent from "@/components/HeaderComponent";
import SafeScreenComponent from "@/components/SafeScreenComponent";
import useDeviceFilters from "@/hooks/useDeviceFilters";
import { fetchATMs } from "@/services/atmService";
import { getStatusColor } from "@/utils/statusColor";
import { STATUS_OPTIONS } from "@/utils/statusOptions";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

interface ATM {
    id: string | number;
    atm_status: string;
    cash: string;
    printer: string;
    cardReader: string;
}

export default function Devices() {
    const [showAlert, setShowAlert] = useState(false);

    const [data, setData] = useState<ATM[]>([]);
    useEffect(() => {
            const loadData = async () => {
                const atmData = await fetchATMs();
                setData(atmData);
            };
    
            loadData();
        }, []);

    const [activeFilter, setActiveFilter] = useState<
        'atm' | 'device' | 'status' | null
    >(null);

    const {
        selectedATM, setSelectedATM,
        deviceType, setDeviceType,
        status, setStatus,
        filteredData, clearFilters,
    } = useDeviceFilters(data);

    const atmOptions = useMemo(() => {
        return [...new Set(data.map((item) => String(item.id)))]
    }, [data]);

    const statusOptions = deviceType
        ? STATUS_OPTIONS[deviceType] || []
        : [];
    
    const closeModal = () => setActiveFilter(null);

    return (
        <SafeScreenComponent>
            <HeaderComponent title="ATM Status" />
            
            <View className="flex-row justify-around p-3 bg-gray-900">
                <FilterTab
                    label={selectedATM || 'ATM ID'}
                    onPress={() => setActiveFilter('atm')}
                />
                <FilterTab
                    label={deviceType || 'Device'}
                    onPress={() => setActiveFilter('device')}
                />
                <FilterTab
                    label={status || 'Status'}
                    onPress={() => setActiveFilter('status')}
                    disabled={!deviceType}
                />
                <TouchableOpacity
                    onPress={clearFilters}
                    className="bg-rex-500 px-3 py-2 rounded-xl"
                >
                    <Text className="text-white text-sm font-semibold">
                        Clear
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredData || []}
                extraData={[selectedATM, deviceType, status]}
                keyExtractor={( item ) => String(item.id)}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <View className="bg-gray-800 p-4 rounded-xl mb-3">
                        <View className="bg-gray-800 mb-2 items-center">
                            <Text className="text-white font-semibold text-lg">
                                {item.id}
                            </Text>
                        </View>
                        <DeviceRow label="ATM Status" value={item.atm_status} />
                        <DeviceRow label="Cash Remaining" value={item.cash} />
                        <DeviceRow label="Receipt Printer" value={item.printer} />
                        <DeviceRow label="Card Reader" value={item.cardReader} />
                    </View>
                )}
            />

            <Modal visible={!!activeFilter} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 bg-black/60 justify-center px-6"
                    onPress={closeModal}
                >
                    <TouchableOpacity activeOpacity={1} onPress={() => {}}> 
                        <View className="bg-gray-800 rounded-2xl p-4 max-h-[70%]">
                            <Text className="text-gray-400 text-center mb-2 font-bold uppercase">
                                Select {activeFilter}
                            </Text>
                            <FlatList 
                                data={
                                    activeFilter === 'atm' ? atmOptions :
                                    activeFilter === 'device' ? [ 'atm_status', 'cash', 'printer', 'cardReader' ] :
                                    statusOptions
                                }
                                renderItem={({ item }: { item: string }) => (
                                    <OptionItem
                                        label={item}
                                        onPress={() => {
                                            if (activeFilter === 'atm') {
                                                setSelectedATM(item);
                                                closeModal();
                                            };
                                            if (activeFilter === 'device') {
                                                setDeviceType(item as keyof ATM);
                                                closeModal();
                                            };
                                            if (activeFilter === 'status') {
                                                setStatus(item);
                                                closeModal();
                                            }
                                        }}
                                    />
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            <AlertModal
                visible={showAlert}
                title="Select Device Required"
                message="Please select a Device before proceeding."
                onConfirm={() => setShowAlert(false)}
            />
        </SafeScreenComponent>
    );
}

// 🔹 Filter Tab Component
interface FilterTabProps {
    label: string | null;
    onPress: () => void;
    disabled?: boolean;
}
function FilterTab({ label, onPress, disabled }: FilterTabProps) {
  return (
    <TouchableOpacity
        onPress={disabled ? undefined : onPress}
        activeOpacity={disabled ? 1: 0.7}
        className={`w-1/4 bg-gray-700 px-4 py-2 rounded-xl items-center ${
            disabled ? 'bg-gray-800 opacity-80' : 'bg-gray-700'
        }`}
    >
        <Text 
            numberOfLines={1}
            className={`${disabled ? 'text-gray-500' : 'text-white'}`}>
            {label || 'Select'}
        </Text>
    </TouchableOpacity>
  );
}

// 🔹 Option Item Component
interface OptionItemProps {
    label: string | null;
    onPress: () => void;
}
function OptionItem({ label, onPress }: OptionItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="py-3 border-b border-gray-700"
    >
      <Text className="text-white text-center">{label || 'Select'}</Text>
    </TouchableOpacity>
  );
}

// 🔹 Device Row
interface DeviceRowProps {
    label: string;
    value: string;
}
function DeviceRow({ label, value }: DeviceRowProps) {
  return (
    <View className="flex-row justify-between mb-1">
      <Text className="text-gray-400">{label}</Text>
      <Text style={{ color: getStatusColor(value) }}>
        {value}
      </Text>
    </View>
  );
}