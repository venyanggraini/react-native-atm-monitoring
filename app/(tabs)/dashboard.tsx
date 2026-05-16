import HeaderComponent from "@/components/HeaderComponent";
import SafeScreenComponent from "@/components/SafeScreenComponent";
import SummaryStatusCardComponent from "@/components/SummaryStatusCardComponent";
import useDashboard from "@/hooks/useDashboard";
import { ScrollView, Text, View } from "react-native";

export default function Dashboard() {
    const {
        totalATM,
        atmStatus,
        cashStatus,
        printerStatus,
        cardReaderStatus,
    } = useDashboard();

    return (
        <SafeScreenComponent>
            <HeaderComponent title="ATM Dashboard" />
            <ScrollView>
                
                <View className="bg-gray-800 p-4 rounded-xl mb-4 items-center">
                    <Text className="text-gray-400">Total ATMs</Text>
                    <Text className="text-white text-2xl font-bold">{totalATM}</Text>
                </View>

                
                <SummaryStatusCardComponent title="ATM Status" data={atmStatus} type="atmStatus"/>
                <SummaryStatusCardComponent title="Cash Remaining" data={cashStatus} type="cashRemainingStatus"/>
                <SummaryStatusCardComponent title="Receipt Printer" data={printerStatus} type="receiptPrinterStatus"/>
                <SummaryStatusCardComponent title="Card Reader" data={cardReaderStatus} type="cardReaderStatus"/>
            </ScrollView>
        </SafeScreenComponent>
    );
}