import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabsLayout() {
    return (
        <SafeAreaProvider>
            <Tabs screenOptions={{ headerShown: false}}>
                <Tabs.Screen 
                    name="dashboard" 
                    options={{ 
                        title: 'Dashboard',
                        tabBarIcon: () => (
                            <MaterialCommunityIcons name="view-dashboard" color="gray" size={24} />
                        ),
                        }} />
                <Tabs.Screen 
                    name="devices" 
                    options={{ 
                        title: 'Devices',
                        tabBarIcon: () => (
                            <MaterialCommunityIcons name="atm" color="gray" size={24} />
                        ),
                        }} />
            </Tabs>
        </SafeAreaProvider>
    )
}