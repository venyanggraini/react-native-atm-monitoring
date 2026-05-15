import SafeScreenComponent from '@/components/SafeScreenComponent';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function Index() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (!username || !password) {
            alert('Please enter username and password');
            return;
        }

        router.replace('/dashboard');
    };

    return (
        <SafeScreenComponent>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={120}
                className="flex-1" 
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}
                    >
                        <View className="justify-center">
                            {/* Title */}
                            <Text className="text-white text-3xl font-bold mb-2">
                                🏧 Monitoring
                            </Text>
                            <Text className="text-gray-400 mb-8">
                                Please login to continue
                            </Text>

                            {/* Username */}
                            <View className="mb-4">
                                <Text className="text-gray-400 mb-2">
                                    Username
                                </Text>
                                <TextInput 
                                    placeholder="Enter username"
                                    placeholderTextColor="#9ca3af"
                                    className="bg-gray-800 text-white px-4 py-3 rounded-xl"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </View>

                            {/* Password */}
                            <View className="mb-6">
                                <Text className="text-gray-400 mb-2">
                                        Password
                                    </Text>
                                <View className="flex-row items-center bg-gray-800 rounded-xl px-4">
                                    <TextInput 
                                        placeholder="Enter password"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showPassword}
                                        className="flex-1 text-white py-3"
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons 
                                            name={showPassword ? 'eye-off' : 'eye'}
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                className="bg-blue-500 py-3 rounded-xl"
                            >
                                <Text className="text-white text-center font-semibold text-lg">
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeScreenComponent>  
    );
}