import SafeScreen from "@/components/SafeScreenComponent";
import { router, Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen() {

    const handleNotFound = () => {
        router.replace("/");
    }
    return (
        <SafeScreen>
            <Stack.Screen options={{ title: 'Oops! Not Found' }} />
            <View className="flex-1 justify-center items-center mb-4">
                <TouchableOpacity onPress={handleNotFound} className="bg-blue-500 py-3 rounded-xl">
                    <Text className="text-white text-center font-semibold text-lg">
                        Go back to Login Page
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeScreen>
    )
}