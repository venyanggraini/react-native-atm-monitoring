import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeScreenComponent({ children }: any) {
    return (
        <SafeAreaView className="flex-1 bg-dark px-4">
            {children}
        </SafeAreaView>
    )
}