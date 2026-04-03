import { getStatusColor } from "@/utils/statusColor";
import { STATUS_ORDER } from "@/utils/statusOrder";
import { getStatusPosition } from "@/utils/statusPosition";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface SummaryCardProps {
    title: string;
    data: Record<string, number>;
    type: keyof typeof STATUS_ORDER;
}

export default function SummaryStatusCardComponent({ title, data, type }: SummaryCardProps) {
    const router = useRouter();

    const handlePress = (status: string) => {
        router.push({
            pathname: '/devices',
            params: { type, status },
        });
    };

    const leftTab: [string, number][] = [];
    const centerTab: [string, number][] = [];
    const rigthTab: [string, number][] = [];

    Object.entries(data).forEach(([key, value]) => {
        const position = getStatusPosition(key) || 'left';
        if(position === 'left') leftTab.push([key, value]);
        else if (position === 'center') centerTab.push([key, value]);
        else rigthTab.push([key, value]);
    });

    const sortGroup = (group: [string, number][]) => {
        const order = STATUS_ORDER[type] || [];
        return group.sort(
            ([aKey], [bKey]) => order.indexOf(aKey) - order.indexOf(bKey)
        );
    };

    const allStatus = [
        ...sortGroup(leftTab),
        ...sortGroup(centerTab), 
        ...sortGroup(rigthTab)
    ];

    return (
        <View className="bg-gray-800 p-4 rounded-xl mb-4">
            <Text className="text-white font-semibold mb-2">
                {title}
            </Text>

            <View className="flex-row flex-wrap justify-start">
                {allStatus.map(([key, value]) => (
                    <TouchableOpacity
                        key={key}
                        onPress={() => handlePress(key)}
                        className="bg-gray-700 m-1 p-4 rounded-lg items-center flex-1 min-w-[22%]"
                    >
                        <Text 
                            numberOfLines={1}
                            style={{ color: getStatusColor(key) }}
                            className="font-semibold text-base"
                        >
                            {key}
                        </Text>
                        <Text className="text-white text-sm">
                            {value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}